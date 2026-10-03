// Стадия upload: залить рендер в YouTube-канал проекта и записать публикацию.
//
// Чекпоинт — video.youtube_id, и он пишется НЕМЕДЛЕННО после ответа API,
// одной транзакцией со строкой publication (та же логика, что addCost после
// покупки): упади мы между заливкой и записью — ретрай задублировал бы видео
// на канале. Повторный джоб с youtube_id — skip, не re-upload.
import path from "node:path";
import { resolveChannelCredential } from "../credentials.js";
import { q, tx } from "../db.js";
import { JobRow, VideoRow } from "../queue.js";
import { restoreAsset } from "../s3.js";
import { refreshAccessToken, uploadVideo } from "../youtube.js";
import { jobDir, StageResult } from "./voiceover.js";

export const uploadStage = async (
  job: JobRow,
  video: VideoRow,
  signal: AbortSignal,
): Promise<StageResult> => {
  if (!job.upload) return { skipped: true };
  if (video.youtube_id) return { skipped: true }; // уже залито

  if (!video.project_id) {
    throw new Error("у видео нет project_id — нечем выбрать канал для заливки");
  }
  const channelRows = await q<{ id: number; slug: string }>(
    `select ch.id, p.slug from channel ch join project p on p.id = ch.project_id
      where ch.project_id = $1 and ch.platform = 'youtube'`,
    [video.project_id],
  );
  if (!channelRows.rows.length) {
    throw new Error("у проекта нет youtube-канала (npm run worker:seed?)");
  }
  const channel = channelRows.rows[0];
  const refresh = await resolveChannelCredential(channel.id, "youtube_oauth_refresh");
  if (!refresh) {
    throw new Error(
      `канал youtube проекта не подключён — npm run worker:connect-youtube -- --project ${channel.slug}`,
    );
  }

  // Рендер мог случиться на другом воркере — восстановим из S3-реестра.
  const file = path.join(jobDir(video.id), "out.mp4");
  if (!(await restoreAsset(video.id, "render", "out.mp4", file))) {
    throw new Error("out.mp4 не найден ни локально, ни в S3 — стадия render не отработала?");
  }

  const accessToken = await refreshAccessToken(refresh);
  const title = video.title ?? video.composition;
  const youtubeId = await uploadVideo({
    accessToken,
    file,
    title,
    description: video.description ?? "",
    privacy: job.privacy,
    signal,
  });

  const url = `https://www.youtube.com/watch?v=${youtubeId}`;
  await tx(async (c) => {
    await c.query(
      "update video set youtube_id = $2, updated_at = now() where id = $1",
      [video.id, youtubeId],
    );
    await c.query(
      `insert into publication (video_id, channel_id, external_id, url, title, published_at)
       values ($1, $2, $3, $4, $5, now())
       on conflict (video_id, channel_id) do update
         set external_id = excluded.external_id, url = excluded.url,
             title = excluded.title, published_at = excluded.published_at`,
      [video.id, channel.id, youtubeId, url, title],
    );
  });
  video.youtube_id = youtubeId;
  return { detail: { youtube_id: youtubeId, url, privacy: job.privacy } };
};
