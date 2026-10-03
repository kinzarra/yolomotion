// Конфиг воркера из окружения, с подхватом repo-root .env (как это делает
// gen-voiceover.mjs). Переменные окружения побеждают файл — в контейнере
// приходит .env_prod и файла нет вовсе.
import { readFileSync } from "node:fs";
import { hostname } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
export const REPO_ROOT = path.resolve(here, "../../..");

const loadDotenv = (): void => {
  let raw: string;
  try {
    raw = readFileSync(path.join(REPO_ROOT, ".env"), "utf8");
  } catch {
    return;
  }
  for (const line of raw.split(/\r?\n/)) {
    const m = /^([A-Z0-9_]+)=(.*)$/.exec(line.trim());
    if (m && process.env[m[1]] === undefined) {
      process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, "");
    }
  }
};
loadDotenv();

const s3Config = () => {
  const e = process.env;
  const bucket = e.S3_BUCKET ?? e.S3_AVATAR_BUCKET;
  if (!bucket) return null;
  const endpoint = e.S3_ENDPOINT ?? e.S3_ENDPOINT_URL; // undefined = AWS
  return {
    bucket,
    endpoint,
    // Yandex Object Storage подписывается только регионом ru-central1.
    region: e.S3_REGION ?? (endpoint?.includes("yandexcloud") ? "ru-central1" : "auto"),
    accessKeyId: e.S3_ACCESS_KEY_ID ?? e.S3_ACCESS_KEY ?? "",
    secretAccessKey: e.S3_SECRET_ACCESS_KEY ?? e.S3_SECRET_KEY ?? "",
    prefix: (e.S3_PREFIX ?? "yolomotion").replace(/^\/+|\/+$/g, ""),
  };
};

export const env = {
  databaseUrl:
    process.env.DATABASE_URL ??
    "postgresql://postgres:postgres@127.0.0.1:5432/yolomotion_dev",
  // Ассеты джобов: <jobsDir>/v<video_id>/{vo/*.mp3, out.mp4}. На сервере это
  // volume; локальный дефолт живёт в гитигнорном out/.
  jobsDir: process.env.JOBS_DIR ?? path.join(REPO_ROOT, "out", "jobs"),
  // Мини-раздача jobsDir на loopback: рендер берёт per-job аудио по
  // voiceoverDir-URL, не требуя ре-бандла (см. engine.md).
  assetsPort: Number(process.env.ASSETS_PORT ?? 8765),
  pollMs: Number(process.env.POLL_MS ?? 2000),
  // running-строка с heartbeat старше этого — умерший воркер, вернуть в очередь.
  staleSeconds: Number(process.env.STALE_SECONDS ?? 90),
  workerId: process.env.WORKER_ID ?? `${hostname()}:${process.pid}`,
  // Режим одного прохода: осушить очередь и выйти (тесты, ручные прогоны).
  once: process.env.WORKER_ONCE === "1",
  elevenLabsKey: process.env.ELEVENLABS_API_KEY,
  // Курс для usd-колонки cost по ElevenLabs (тариф — кредиты, курс зависит от
  // плана). Не задан — usd остаётся null, units.chars хранятся всегда.
  elevenUsdPer1k: process.env.ELEVENLABS_USD_PER_1K_CHARS
    ? Number(process.env.ELEVENLABS_USD_PER_1K_CHARS)
    : null,
  // Ключ для credential.secret_enc (hex, 32 байта). Без него шифрованные
  // секреты недоступны — но secret_ref/value работают.
  masterKey: process.env.MASTER_KEY,
  // Сбор публичной статистики (collect-stats) — обычный API key, не OAuth.
  youtubeApiKey: process.env.YOUTUBE_API_KEY,
  // S3-совместимое хранилище (Hetzner Object Storage / R2 / AWS). Без этих
  // переменных воркер работает локально, реестр asset не ведётся —
  // регенерация из БД+S3 требует их на сервере.
  // Имена S3_ENDPOINT_URL / S3_ACCESS_KEY / S3_SECRET_KEY / S3_AVATAR_BUCKET —
  // из соседнего проекта (yoclips), их .env копируется как есть; канонические
  // S3_* побеждают. Всё наше лежит под префиксом (S3_PREFIX, по умолчанию
  // yolomotion/), чтобы не путаться с чужими файлами в общем бакете.
  s3: s3Config(),
};
