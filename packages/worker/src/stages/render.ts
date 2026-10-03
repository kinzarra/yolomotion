// Стадия render: собрать inputProps из строки видео и отдать в renderJob.
// Замеренные на стадии voiceover длины и URL per-job аудио едут через props —
// ровно тот контракт, что описан в engine.md («Server-side parameterization»);
// шаблоны без этих полей в схеме просто их не заметят.
import { existsSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { makeCancelSignal, renderJob } from "@yolomotion/renderer";
import { assetUrl } from "../assets.js";
import { JobRow, setProgress, VideoRow } from "../queue.js";
import { putAsset, restoreAsset, s3Enabled } from "../s3.js";
import { jobDir, StageResult } from "./voiceover.js";

export const renderStage = async (
  job: JobRow,
  video: VideoRow,
  signal: AbortSignal,
): Promise<StageResult & { outPath: string }> => {
  // Джоб мог сменить воркера между стадиями (release/requeue): клипы стадии
  // voiceover тогда не на этом диске, а в S3 — восстанавливаем перед рендером,
  // иначе шаблон молча упадёт на 404 от раздачи ассетов.
  if (video.vo_manifest) {
    const dir = path.join(jobDir(video.id), "vo");
    await mkdir(dir, { recursive: true });
    for (const [name] of video.vo_manifest.lines) {
      const ok = await restoreAsset(
        video.id, "voiceover_clip", `${name}.mp3`, path.join(dir, `${name}.mp3`),
      );
      if (!ok) {
        throw new Error(
          `voiceover clip ${name}.mp3 is neither on disk nor in S3 — ` +
            `re-run the voiceover stage (reset job.stage)`,
        );
      }
    }
  }

  const props: Record<string, unknown> = { ...video.props };
  if (video.durations) props.durations = video.durations;
  if (existsSync(path.join(jobDir(video.id), "vo"))) {
    props.voiceoverDir = assetUrl(`v${video.id}`, "vo");
  }

  const outPath = path.join(jobDir(video.id), "out.mp4");
  const cancel = makeCancelSignal();
  const onAbort = () => cancel.cancel();
  signal.addEventListener("abort", onAbort);
  let lastBeat = 0;
  try {
    await renderJob({
      compositionId: video.composition,
      inputProps: props,
      outPath,
      cancelSignal: cancel.cancelSignal,
      onProgress: (frames, total) => {
        // Не чаще раза в ~2с: прогресс — колонка для бота, не журнал.
        const now = Date.now();
        if (now - lastBeat > 2000 || frames === total) {
          lastBeat = now;
          void setProgress(job.id, { stage: "render", frames, total });
        }
      },
    });
  } finally {
    signal.removeEventListener("abort", onAbort);
  }
  if (signal.aborted) throw new Error("aborted");
  // Готовый рендер — в S3-реестр (upsert: пере-рендер законно перезаписывает).
  if (s3Enabled()) await putAsset(video.id, "render", "out.mp4", outPath);
  return { outPath, detail: { out: outPath } };
};
