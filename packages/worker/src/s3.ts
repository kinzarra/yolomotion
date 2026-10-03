// S3-реестр файлов видео: бинарники в бакете, строки в asset. Ключи —
// <prefix>/videos/v<id>/<kind>/<name>; kind 'render' лежит плоско
// (<prefix>/videos/v<id>/out.mp4). Старые строки asset хранят свой s3_key целиком.
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { env } from "./env.js";
import { q } from "./db.js";

export const s3Enabled = (): boolean => env.s3 !== null;

let client: S3Client | null = null;
const s3 = (): S3Client => {
  if (!env.s3) throw new Error("S3 is not configured (S3_BUCKET et al.)");
  client ??= new S3Client({
    region: env.s3.region,
    endpoint: env.s3.endpoint,
    forcePathStyle: Boolean(env.s3.endpoint), // совместимые стораджи хотят path-style
    credentials: {
      accessKeyId: env.s3.accessKeyId,
      secretAccessKey: env.s3.secretAccessKey,
    },
  });
  return client;
};

export type AssetKind =
  | "voiceover_clip" | "presenter" | "image" | "render" | "still" | "other";

const CONTENT_TYPES: Record<string, string> = {
  ".mp3": "audio/mpeg",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".md": "text/markdown",
};

export const s3KeyFor = (videoId: number, kind: AssetKind, name: string): string =>
  `${env.s3!.prefix}/videos/v${videoId}/` + (kind === "render" ? name : `${kind}/${name}`);

const sha256File = async (file: string): Promise<string> =>
  createHash("sha256").update(await readFile(file)).digest("hex");

// Залить локальный файл и (идемпотентно) записать его в реестр. Вызывается и
// для свежекупленного клипа, и как бэкфилл для файлов, купленных до S3 —
// поэтому upsert, а не insert.
export const putAsset = async (
  videoId: number,
  kind: AssetKind,
  name: string,
  file: string,
): Promise<void> => {
  const key = s3KeyFor(videoId, kind, name);
  const ext = name.slice(name.lastIndexOf("."));
  const body = await readFile(file);
  await s3().send(
    new PutObjectCommand({
      Bucket: env.s3!.bucket,
      Key: key,
      Body: body,
      ContentType: CONTENT_TYPES[ext] ?? "application/octet-stream",
    }),
  );
  await q(
    `insert into asset (video_id, kind, name, s3_key, bytes, content_type, sha256)
     values ($1, $2, $3, $4, $5, $6, $7)
     on conflict (video_id, kind, name) do update
       set s3_key = excluded.s3_key, bytes = excluded.bytes,
           sha256 = excluded.sha256`,
    [videoId, kind, name, key, body.byteLength,
      CONTENT_TYPES[ext] ?? "application/octet-stream",
      createHash("sha256").update(body).digest("hex")],
  );
};

// Восстановить файл из S3, если он числится в реестре. true = лежит локально.
// Это вторая половина инварианта «деньги один раз»: чекпоинт покупки теперь
// не директория одного воркера, а бакет.
export const restoreAsset = async (
  videoId: number,
  kind: AssetKind,
  name: string,
  file: string,
): Promise<boolean> => {
  if (existsSync(file)) return true;
  if (!s3Enabled()) return false;
  const { rows } = await q<{ s3_key: string }>(
    "select s3_key from asset where video_id = $1 and kind = $2 and name = $3",
    [videoId, kind, name],
  );
  if (!rows.length) return false;
  const result = await s3().send(
    new GetObjectCommand({ Bucket: env.s3!.bucket, Key: rows[0].s3_key }),
  );
  await writeFile(file, Buffer.from(await result.Body!.transformToByteArray()));
  return true;
};

// Бэкфилл: локальный файл есть, а в реестре его нет — довезти в S3. Дешёвая
// страховка, дающая старым локальным джобам S3-восстановимость при первом же
// повторном прогоне.
export const ensureAsset = async (
  videoId: number,
  kind: AssetKind,
  name: string,
  file: string,
): Promise<void> => {
  if (!s3Enabled() || !existsSync(file)) return;
  const sha = await sha256File(file);
  const { rows } = await q<{ sha256: string | null }>(
    "select sha256 from asset where video_id = $1 and kind = $2 and name = $3",
    [videoId, kind, name],
  );
  if (rows.length && rows[0].sha256 === sha) return;
  await putAsset(videoId, kind, name, file);
};
