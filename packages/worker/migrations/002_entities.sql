-- Сущности вокруг видео: владельцы и их ключи, проекты и их каналы, реестр
-- файлов в S3, косты по провайдерам, публикации и срезы метрик.
--
-- Правило хранения: структуры и тексты (сценарий, манифест, пропсы, замеры) —
-- в Postgres; бинарники (mp3, футаж, mp4) — в S3, здесь только реестр.
-- Инвариант: ролик восстановим из БД + S3 без локального состояния.

-- Владелец — тот, чьими ключами оплачивается генерация.
create table owner (
  id          bigint generated always as identity primary key,
  name        text not null unique,
  created_at  timestamptz not null default now()
);

-- Проект = бренд/канал контента: «Philipp Why?», «Yoloco», «vbcld».
create table project (
  id          bigint generated always as identity primary key,
  owner_id    bigint not null references owner (id),
  slug        text not null unique,     -- 'philipp-why'
  name        text not null,            -- 'Philipp Why?'
  created_at  timestamptz not null default now()
);

-- Площадка проекта. OAuth-токены площадки — строки credential с channel_id.
create table channel (
  id           bigint generated always as identity primary key,
  project_id   bigint not null references project (id),
  platform     text not null check (platform in ('youtube', 'tiktok', 'instagram')),
  handle       text,                    -- '@philippwhy'
  url          text,
  external_id  text,                    -- id канала в API площадки
  created_at   timestamptz not null default now(),
  unique (project_id, platform)
);

-- Ключи и токены. Три формы значения, ровно одна заполнена:
--   secret_ref — имя env-переменной (v1: ключи уже в env/Vault);
--   secret_enc — AES-256-GCM под MASTER_KEY из env (nonce||tag||ct);
--   value      — открытое НЕсекретное значение (voice id, avatar id).
-- Никогда plaintext-секрет в базе.
create table credential (
  id          bigint generated always as identity primary key,
  owner_id    bigint references owner (id),
  channel_id  bigint references channel (id),
  kind        text not null,  -- elevenlabs_api_key | elevenlabs_voice_id |
                              -- heygen_api_key | heygen_avatar_id |
                              -- anthropic_api_key | claude_oauth_token |
                              -- youtube_oauth_refresh | ...
  secret_ref  text,
  secret_enc  bytea,
  value       text,
  meta        jsonb not null default '{}',
  created_at  timestamptz not null default now(),
  check (num_nonnulls(owner_id, channel_id) = 1),
  check (num_nonnulls(secret_ref, secret_enc, value) = 1)
);
create unique index credential_owner_kind
  on credential (owner_id, kind) where owner_id is not null;
create unique index credential_channel_kind
  on credential (channel_id, kind) where channel_id is not null;

-- Видео прирастает проектом и сценарием (бриф записи — текст, он часть
-- воспроизводимости и должен быть greppable, S3 ему не нужен).
alter table video add column project_id bigint references project (id);
alter table video add column scenario_md text;

-- Реестр файлов в S3. name уникален в границах (video, kind) — это те же
-- имена, что в манифесте ('01-hook.mp3') и на диске джоба.
create table asset (
  id            bigint generated always as identity primary key,
  video_id      bigint not null references video (id),
  kind          text not null check (kind in
    ('voiceover_clip', 'presenter', 'image', 'render', 'still', 'other')),
  name          text not null,
  s3_key        text not null,
  bytes         bigint,
  content_type  text,
  sha256        text,
  meta          jsonb not null default '{}',
  created_at    timestamptz not null default now(),
  unique (video_id, kind, name)
);

-- Косты — строками, не агрегатом: каждая покупка отдельно, с юнитами
-- провайдера. usd может быть null (ElevenLabs тарифицируется кредитами;
-- курс задаётся env-переменной и может отсутствовать).
--   elevenlabs: units {chars}
--   heygen:     units {seconds, engine, avatar_kind}
--   anthropic:  units {input_tokens, output_tokens, model}
create table cost (
  id        bigint generated always as identity primary key,
  video_id  bigint not null references video (id),
  provider  text not null check (provider in ('elevenlabs', 'heygen', 'anthropic', 'other')),
  units     jsonb not null default '{}',
  usd       numeric(10, 4),
  note      text,
  at        timestamptz not null default now()
);
create index cost_video_idx on cost (video_id);

create view video_cost as
  select video_id, provider, count(*) as entries, sum(usd) as usd
    from cost group by video_id, provider;

-- Публикация ролика в конкретный канал (одно видео может выйти в несколько).
create table publication (
  id            bigint generated always as identity primary key,
  video_id      bigint not null references video (id),
  channel_id    bigint not null references channel (id),
  external_id   text,      -- id видео на площадке
  url           text,
  title         text,
  description   text,
  published_at  timestamptz,
  created_at    timestamptz not null default now(),
  unique (video_id, channel_id)
);

-- Срезы метрик во времени. Выводы — это SQL поверх этой таблицы: правила из
-- .claude/skills/reel-production/references/retention.md становятся
-- проверяемыми запросом, а не разовым разбором скриншота из Studio.
create table metric_snapshot (
  id                   bigint generated always as identity primary key,
  publication_id       bigint not null references publication (id),
  at                   timestamptz not null default now(),
  views                bigint,
  likes                bigint,
  comments             bigint,
  shares               bigint,
  avg_view_duration_s  numeric(6, 1),
  stayed_pct           numeric(5, 2),
  raw                  jsonb not null default '{}'
);
create index metric_snapshot_pub_idx on metric_snapshot (publication_id, at);

-- spend-агрегат заменён строками cost.
alter table video drop column spend;
