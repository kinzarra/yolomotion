-- Видео и очередь джобов. Оркестрация — plain Postgres без брокера, по
-- образцу yoloservice/etl: claim через FOR UPDATE SKIP LOCKED, статусный
-- журнал для наррации в боте, чекпоинты стадий в самой строке видео.

-- Каждое видео — воспроизводимая строка: все настройки, из которых оно
-- собрано. public/ не в гите, но манифест + пропсы + замеры здесь, так что
-- любой ролик пересобирается из строки (голос — за те же TTS-кредиты).
create table video (
  id           bigint generated always as identity primary key,
  template_id  text not null,                 -- 'yoloco-audience-fit'
  composition  text not null,                 -- '<template>-<format>'
  title        text,
  props        jsonb not null default '{}',   -- inputProps композиции
  vo_manifest  jsonb,                         -- {voiceId, modelId, voiceSettings, lines:[[name,text],…]}
                                              -- null = у видео нет своей озвучки, стадия voiceover не работает
  -- Чекпоинт стадии voiceover: замеренные ffprobe длины клипов, сек при 1.0×.
  -- Заполнен = озвучка куплена и лежит на диске; рестарт джоба НЕ синтезирует
  -- её заново. Это инвариант «деньги списываются один раз», а не оптимизация.
  durations    jsonb,
  spend        jsonb not null default '{}',   -- {"elevenlabs_chars": n, "heygen_usd": x}
  youtube_id   text,                          -- чекпоинт стадии upload
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Очередь. stage — СЛЕДУЮЩАЯ стадия к выполнению; продвигается транзакционно
-- вместе с чекпоинтом в video, поэтому упавший между стадиями воркер
-- продолжает ровно с места падения.
create table video_job (
  id              bigint generated always as identity primary key,
  video_id        bigint not null references video (id),
  status          text not null default 'pending',
  stage           text not null default 'voiceover',
  upload          boolean not null default false,  -- false: закончить на mp4, не ходить в YouTube
  progress        jsonb not null default '{}',     -- {stage, frames, total} — живая строка для бота
  claimed_by      text,                            -- hostname:pid воркера
  claimed_at      timestamptz,
  -- Воркер тикает heartbeat во время долгих стадий; строка running с
  -- протухшим heartbeat — это умерший процесс, её возвращает в pending
  -- requeue-свип. Никакого отдельного реаниматора: свип делает каждый воркер
  -- на каждом опросе (как tick расписания в etl).
  heartbeat_at    timestamptz,
  attempts        int not null default 0,
  max_attempts    int not null default 3,
  next_attempt_at timestamptz not null default now(),
  last_error      text,
  out_path        text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  constraint video_job_status_chk
    check (status in ('pending', 'running', 'done', 'failed', 'canceled')),
  constraint video_job_stage_chk
    check (stage in ('voiceover', 'render', 'upload'))
);

-- Порядок клейма — id, т.е. FIFO; частичный индекс покрывает ровно то, что
-- сканирует claim.
create index video_job_claim_idx
  on video_job (next_attempt_at, id)
  where status = 'pending';

-- Один активный джоб на видео: два воркера не могут собирать один ролик, и
-- спенд-чекпоинты в video из-за этого свободны от гонок.
create unique index video_job_one_active
  on video_job (video_id)
  where status in ('pending', 'running');

-- Статусный журнал: что и когда происходило с джобом. Источник наррации для
-- бота; бот перезапустился — история цела (паттерн etl: рестарт бота
-- прерывает сообщения, не работу).
create table job_event (
  id      bigint generated always as identity primary key,
  job_id  bigint not null references video_job (id),
  at      timestamptz not null default now(),
  kind    text not null,   -- claimed|stage_started|stage_skipped|stage_done|released|retry|failed|done
  detail  jsonb not null default '{}'
);

create index job_event_job_idx on job_event (job_id, id);
