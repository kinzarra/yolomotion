// Claim-loop: свип протухших → клейм → стадии с чекпоинтами → следующий.
// Один джоб за раз: рендер съедает весь CPU-лимит контейнера, «конкурентность»
// здесь — это несколько контейнеров, а FOR UPDATE SKIP LOCKED уже сейчас
// гарантирует, что они не возьмут одну строку (паттерн etl-worker-ads).
import { migrate } from "./migrate.js";
import { startAssetServer } from "./assets.js";
import { env } from "./env.js";
import { pool } from "./db.js";
import {
  advanceStage,
  claimNext,
  event,
  failJob,
  finishJob,
  heartbeat,
  JobRow,
  releaseJob,
  requeueStale,
  VideoRow,
} from "./queue.js";
import { StageResult, voiceoverStage } from "./stages/voiceover.js";
import { renderStage } from "./stages/render.js";
import { uploadStage } from "./stages/upload.js";

const ORDER: JobRow["stage"][] = ["voiceover", "render", "upload"];

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// SIGTERM/SIGINT: дорабатывать нельзя, бросать джоб молча тоже. Флаг ронит
// цикл после текущей операции, AbortSignal обрывает стадию внутри неё.
const drain = new AbortController();
let current: JobRow | null = null;
for (const sig of ["SIGTERM", "SIGINT"] as const) {
  process.on(sig, () => {
    console.log(`${sig}: draining`);
    drain.abort();
  });
}

const runStage = async (
  job: JobRow,
  video: VideoRow,
): Promise<StageResult & { outPath?: string }> => {
  switch (job.stage) {
    case "voiceover":
      return voiceoverStage(job, video, drain.signal);
    case "render":
      return renderStage(job, video, drain.signal);
    case "upload":
      return uploadStage(job, video, drain.signal);
  }
};

const runJob = async (job: JobRow, video: VideoRow): Promise<void> => {
  const beat = setInterval(() => void heartbeat(job.id), 15_000);
  let outPath = job.out_path;
  try {
    let stageIndex = ORDER.indexOf(job.stage);
    while (stageIndex < ORDER.length) {
      if (drain.signal.aborted) {
        await releaseJob(job);
        return;
      }
      job.stage = ORDER[stageIndex];
      await event(job.id, "stage_started", { stage: job.stage });
      const result = await runStage(job, video);
      if (result.outPath) outPath = result.outPath;
      const next = ORDER[stageIndex + 1] ?? null;
      if (result.skipped) {
        await event(job.id, "stage_skipped", { stage: job.stage });
        if (next) {
          await advanceStage(job, next);
        }
      } else {
        await advanceStage(job, next, result.videoPatch ?? {}, result.detail);
        // Чекпоинт уехал в базу — стадия могла обновить строку видео.
        if (result.videoPatch) Object.assign(video, result.videoPatch);
      }
      stageIndex += 1;
    }
    await finishJob(job, outPath ?? "");
    console.log(`job ${job.id} (video ${video.id}) done → ${outPath}`);
  } catch (error) {
    if (drain.signal.aborted) {
      await releaseJob(job);
      console.log(`job ${job.id} released (drain)`);
    } else {
      await failJob(job, error);
      console.error(`job ${job.id} failed at ${job.stage}:`, error);
    }
  } finally {
    clearInterval(beat);
  }
};

await migrate();
const assets = await startAssetServer();
console.log(
  `worker ${env.workerId}: db=${env.databaseUrl.replace(/\/\/.*@/, "//…@")} ` +
    `jobs=${env.jobsDir} assets=:${env.assetsPort}${env.once ? " (once)" : ""}`,
);

while (!drain.signal.aborted) {
  await requeueStale();
  const claimed = await claimNext();
  if (!claimed) {
    if (env.once) break;
    await sleep(env.pollMs);
    continue;
  }
  current = claimed.job;
  console.log(
    `claimed job ${claimed.job.id} (video ${claimed.video.id}, ` +
      `${claimed.video.composition}) at stage ${claimed.job.stage}`,
  );
  await runJob(claimed.job, claimed.video);
  current = null;
}

// Дренаж поймал нас между джобами — current уже отпущен внутри runJob.
void current;
assets.close();
await pool.end();
console.log("worker stopped");
