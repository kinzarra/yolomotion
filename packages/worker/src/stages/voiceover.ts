// Стадия voiceover: восстановить или купить клипы, нормализовать, замерить,
// чекпоинт. Порядок на каждый клип — три ступени, от бесплатного к платному:
//   1. локальный файл (чекпоинт этого воркера);
//   2. S3 по реестру asset (чекпоинт ЛЮБОГО воркера — инвариант «деньги один
//      раз» межмашинный: перегенерация на чистом сервере не покупает голос);
//   3. синтез — с ключом владельца проекта (credential-цепочка, фолбэк env),
//      кост фиксируется НЕМЕДЛЕННО после покупки, файл уезжает в S3.
import { existsSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { env } from "../env.js";
import { resolveCredential } from "../credentials.js";
import { addCost, event, JobRow, setProgress, VideoRow } from "../queue.js";
import { ensureAsset, putAsset, restoreAsset, s3Enabled } from "../s3.js";
import { normalize, probeDuration, synthesize } from "../tts.js";

export type StageResult = {
  skipped?: boolean;
  videoPatch?: Partial<Pick<VideoRow, "durations" | "youtube_id">>;
  detail?: Record<string, unknown>;
};

export const jobDir = (videoId: number): string =>
  path.join(env.jobsDir, `v${videoId}`);

export const voiceoverStage = async (
  job: JobRow,
  video: VideoRow,
  signal: AbortSignal,
): Promise<StageResult> => {
  if (!video.vo_manifest) return { skipped: true };
  const manifest = video.vo_manifest;
  const dir = path.join(jobDir(video.id), "vo");
  await mkdir(dir, { recursive: true });

  // Ключ резолвится лениво: джоб, которому нечего покупать, не требует ключа.
  let apiKey: string | null = null;
  let synthesized = 0;
  let restored = 0;
  let chars = 0;
  for (const [name, text] of manifest.lines) {
    if (signal.aborted) throw new Error("aborted");
    const file = path.join(dir, `${name}.mp3`);
    if (existsSync(file)) continue;
    if (await restoreAsset(video.id, "voiceover_clip", `${name}.mp3`, file)) {
      restored += 1;
      continue;
    }
    apiKey ??= await resolveCredential(video.id, "elevenlabs_api_key", "ELEVENLABS_API_KEY");
    if (!apiKey) {
      throw new Error("no elevenlabs_api_key credential for this video's owner and env is unset");
    }
    await synthesize({
      apiKey,
      voiceId: manifest.voiceId,
      modelId: manifest.modelId,
      voiceSettings: manifest.voiceSettings,
      text,
      outFile: file,
      signal,
    });
    await normalize(file);
    await addCost(
      video.id,
      "elevenlabs",
      { chars: text.length, clip: name },
      env.elevenUsdPer1k ? (text.length / 1000) * env.elevenUsdPer1k : null,
    );
    if (s3Enabled()) await putAsset(video.id, "voiceover_clip", `${name}.mp3`, file);
    synthesized += 1;
    chars += text.length;
    await setProgress(job.id, {
      stage: "voiceover",
      clips: synthesized + restored,
      of: manifest.lines.length,
    });
  }

  // Замер — всегда по всем клипам: durations в чекпоинте обязаны описывать
  // весь манифест, из скольких бы заходов он ни был собран.
  const durations: Record<string, number> = {};
  for (const [name] of manifest.lines) {
    durations[name] = await probeDuration(path.join(dir, `${name}.mp3`));
  }

  // Бэкфилл реестра: клипы, купленные до S3 (или подложенные руками),
  // становятся S3-восстановимыми при первом же прогоне.
  if (s3Enabled()) {
    for (const [name] of manifest.lines) {
      await ensureAsset(video.id, "voiceover_clip", `${name}.mp3`, path.join(dir, `${name}.mp3`));
    }
  }

  if (synthesized === 0) {
    await event(job.id, "stage_skipped", {
      stage: "voiceover",
      reason: restored ? "clips restored from S3" : "all clips already on disk",
    });
  }
  return {
    videoPatch: { durations },
    detail: { synthesized, restored, chars },
  };
};
