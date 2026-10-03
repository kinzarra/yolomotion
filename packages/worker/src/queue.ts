// Очередь поверх Postgres: claim / heartbeat / продвижение стадий / retry.
// Претензий на общность нет — это ровно те операции, которые нужны циклу
// воркера, и все инварианты (один активный джоб на видео, транзакционный
// чекпоинт, деньги один раз) живут здесь и в 001_init.sql.
import { env } from "./env.js";
import { q, tx } from "./db.js";

export type VideoRow = {
  id: number;
  project_id: number | null;
  template_id: string;
  composition: string;
  title: string | null;
  description: string | null;
  scenario_md: string | null;
  props: Record<string, unknown>;
  vo_manifest: {
    voiceId: string;
    modelId?: string;
    voiceSettings?: Record<string, unknown>;
    lines: [string, string][];
  } | null;
  durations: Record<string, number> | null;
  youtube_id: string | null;
};

export type JobRow = {
  id: number;
  video_id: number;
  status: string;
  stage: "voiceover" | "render" | "upload";
  upload: boolean;
  privacy: "private" | "unlisted" | "public";
  attempts: number;
  max_attempts: number;
  out_path: string | null;
};

export const event = (
  jobId: number,
  kind: string,
  detail: Record<string, unknown> = {},
): Promise<unknown> =>
  q("insert into job_event (job_id, kind, detail) values ($1, $2, $3)", [
    jobId,
    kind,
    JSON.stringify(detail),
  ]);

// Строки running с протухшим heartbeat — умершие воркеры. Возвращаем в
// pending, не тратя attempt: попытку жжёт только реальный провал стадии.
export const requeueStale = async (): Promise<void> => {
  const { rows } = await q<{ id: number }>(
    `update video_job
        set status = 'pending', claimed_by = null, claimed_at = null,
            heartbeat_at = null, attempts = greatest(attempts - 1, 0),
            next_attempt_at = now(), updated_at = now()
      where status = 'running'
        and heartbeat_at < now() - make_interval(secs => $1)
      returning id`,
    [env.staleSeconds],
  );
  for (const r of rows) await event(r.id, "released", { reason: "stale heartbeat" });
};

export const claimNext = async (): Promise<{ job: JobRow; video: VideoRow } | null> =>
  tx(async (c) => {
    const claimed = await c.query(
      `update video_job j
          set status = 'running', claimed_by = $1, claimed_at = now(),
              heartbeat_at = now(), attempts = attempts + 1, updated_at = now()
        where j.id = (
          select id from video_job
           where status = 'pending' and next_attempt_at <= now()
           order by next_attempt_at, id
             for update skip locked
           limit 1
        )
        returning *`,
      [env.workerId],
    );
    if (!claimed.rowCount) return null;
    const job = claimed.rows[0] as JobRow;
    const video = await c.query("select * from video where id = $1", [job.video_id]);
    await c.query(
      "insert into job_event (job_id, kind, detail) values ($1, 'claimed', $2)",
      [job.id, JSON.stringify({ by: env.workerId, attempt: job.attempts })],
    );
    return { job, video: video.rows[0] as VideoRow };
  });

export const heartbeat = (jobId: number): Promise<unknown> =>
  q("update video_job set heartbeat_at = now() where id = $1", [jobId]);

// Живой прогресс для бота — колонка, не события: обновляется часто,
// журналить каждое обновление незачем.
export const setProgress = (
  jobId: number,
  progress: Record<string, unknown>,
): Promise<unknown> =>
  q("update video_job set progress = $2, updated_at = now() where id = $1", [
    jobId,
    JSON.stringify(progress),
  ]);

// Стадия завершена: чекпоинт в video и продвижение stage — ОДНА транзакция.
// Упасть между «купили голос» и «запомнили, что купили» невозможно.
export const advanceStage = (
  job: JobRow,
  nextStage: JobRow["stage"] | null, // null = стадий больше нет
  videoPatch: Partial<Pick<VideoRow, "durations" | "youtube_id">> = {},
  detail: Record<string, unknown> = {},
): Promise<void> =>
  tx(async (c) => {
    const sets: string[] = ["updated_at = now()"];
    const params: unknown[] = [job.video_id];
    for (const [col, value] of Object.entries(videoPatch)) {
      params.push(col === "youtube_id" ? value : JSON.stringify(value));
      sets.push(`${col} = $${params.length}`);
    }
    await c.query(`update video set ${sets.join(", ")} where id = $1`, params);
    if (nextStage) {
      await c.query(
        "update video_job set stage = $2, updated_at = now() where id = $1",
        [job.id, nextStage],
      );
    }
    await c.query(
      "insert into job_event (job_id, kind, detail) values ($1, 'stage_done', $2)",
      [job.id, JSON.stringify({ stage: job.stage, ...detail })],
    );
  });

// Каждая покупка — строка немедленно после траты, не в конце стадии: упавший
// между «купил» и «дошёл до чекпоинта» воркер не должен терять кост.
export const addCost = (
  videoId: number,
  provider: "elevenlabs" | "heygen" | "anthropic" | "other",
  units: Record<string, unknown>,
  usd: number | null,
  note?: string,
): Promise<unknown> =>
  q(
    "insert into cost (video_id, provider, units, usd, note) values ($1, $2, $3, $4, $5)",
    [videoId, provider, JSON.stringify(units), usd, note ?? null],
  );

export const finishJob = (job: JobRow, outPath: string): Promise<void> =>
  tx(async (c) => {
    await c.query(
      `update video_job
          set status = 'done', out_path = $2, progress = '{}', updated_at = now()
        where id = $1`,
      [job.id, outPath],
    );
    await c.query(
      "insert into job_event (job_id, kind, detail) values ($1, 'done', $2)",
      [job.id, JSON.stringify({ out_path: outPath })],
    );
  });

// Провал стадии: retry с линейным бэкоффом, после max_attempts — failed.
export const failJob = async (job: JobRow, error: unknown): Promise<void> => {
  const message = error instanceof Error ? error.message : String(error);
  const exhausted = job.attempts >= job.max_attempts;
  await q(
    `update video_job
        set status = $2, last_error = $3, claimed_by = null, claimed_at = null,
            heartbeat_at = null,
            next_attempt_at = now() + make_interval(secs => $4),
            updated_at = now()
      where id = $1`,
    [job.id, exhausted ? "failed" : "pending", message, job.attempts * 60],
  );
  await event(job.id, exhausted ? "failed" : "retry", {
    stage: job.stage,
    attempt: job.attempts,
    error: message,
  });
};

// Мягкое возвращение в очередь на SIGTERM: attempt не сожжён — деплой стоит
// пере-клейма, а не красной ошибки (паттерн etl).
export const releaseJob = async (job: JobRow): Promise<void> => {
  await q(
    `update video_job
        set status = 'pending', claimed_by = null, claimed_at = null,
            heartbeat_at = null, attempts = greatest(attempts - 1, 0),
            next_attempt_at = now(), updated_at = now()
      where id = $1 and status = 'running'`,
    [job.id],
  );
  await event(job.id, "released", { reason: "sigterm", stage: job.stage });
};
