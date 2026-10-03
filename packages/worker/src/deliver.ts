// Выдача рила: всё, чего нет в git и что пропадёт вместе с машиной (облачной
// VM или чужим ноутбуком), уезжает в S3 — mp4 из out/ и купленное/найденное в
// public/: озвучка, презентер, футаж, медиа. Бинарники в git не попадают.
//   npm run deliver -- <id>              залить, напечатать ссылку на mp4
//   npm run deliver -- <id> --restore    скачать обратно в те же пути
// Ключ = reels/<id>/<путь от корня репо>, поэтому restore — зеркальная операция.
// Ссылка — presigned GET на 7 дней (потолок SigV4); S3_PUBLIC_URL, если бакет
// публичный, даёт вечную. Env: S3_BUCKET, S3_ENDPOINT (пусто = AWS),
// S3_REGION, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY.
import { createHash, createHmac } from "node:crypto";
import { existsSync, readdirSync, statSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { env, REPO_ROOT } from "./env.js";

const id = process.argv[2];
if (!id || id.startsWith("--")) {
  throw new Error("usage: npm run deliver -- <reel-id> [--restore]");
}
const restore = process.argv.includes("--restore");
if (!env.s3) throw new Error("S3 is not configured: set S3_BUCKET and the S3_* keys");
const cfg = env.s3;

const s3 = new S3Client({
  region: cfg.region,
  endpoint: cfg.endpoint,
  forcePathStyle: Boolean(cfg.endpoint),
  credentials: { accessKeyId: cfg.accessKeyId, secretAccessKey: cfg.secretAccessKey },
});
const prefix = `reels/${id}/`;

const CONTENT_TYPES: Record<string, string> = {
  ".mp4": "video/mp4", ".webm": "video/webm", ".mov": "video/quicktime",
  ".mp3": "audio/mpeg", ".wav": "audio/wav",
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
  ".json": "application/json",
};

const walk = (dir: string): string[] =>
  !existsSync(dir) ? [] : readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });

// Что принадлежит рилу: его рендеры (<id>-reel.mp4, <id>-ru-reel.mp4 …) и
// папки public/<kind>/<id>* — у двуязычного рила их две (<id>, <id>-ru).
const reelFiles = (): string[] => {
  const out = path.join(REPO_ROOT, "out");
  const renders = existsSync(out)
    ? readdirSync(out)
        .filter((f) => f.startsWith(`${id}-`) && f.endsWith(".mp4"))
        .map((f) => path.join(out, f))
    : [];
  const pub = path.join(REPO_ROOT, "packages/video/public");
  const kinds = ["voiceover", "presenter", "footage", "media"];
  const assets = kinds.flatMap((kind) => {
    const dir = path.join(pub, kind);
    if (!existsSync(dir)) return [];
    return readdirSync(dir)
      .filter((d) => d === id || d.startsWith(`${id}-`))
      .flatMap((d) => walk(path.join(dir, d)));
  });
  return [...renders, ...assets];
};

// --- presigned GET (SigV4, query string), без отдельной зависимости ---------
const enc = (s: string) =>
  encodeURIComponent(s).replace(/[!'()*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);
const hmac = (key: string | Buffer, data: string) => createHmac("sha256", key).update(data).digest();

const presign = (key: string, seconds: number): string => {
  const base = cfg.endpoint
    ? new URL(`${cfg.endpoint.replace(/\/$/, "")}/${cfg.bucket}`)
    : new URL(`https://${cfg.bucket}.s3.${cfg.region}.amazonaws.com`);
  const pathname = `${base.pathname.replace(/\/$/, "")}/${key.split("/").map(enc).join("/")}`;
  const amzDate = new Date().toISOString().replace(/[:-]|\.\d{3}/g, "");
  const scope = `${amzDate.slice(0, 8)}/${cfg.region}/s3/aws4_request`;
  const query = [
    ["X-Amz-Algorithm", "AWS4-HMAC-SHA256"],
    ["X-Amz-Credential", `${cfg.accessKeyId}/${scope}`],
    ["X-Amz-Date", amzDate],
    ["X-Amz-Expires", String(seconds)],
    ["X-Amz-SignedHeaders", "host"],
  ].map(([k, v]) => `${enc(k)}=${enc(v)}`).sort().join("&");
  const canonical = ["GET", pathname, query, `host:${base.host}\n`, "host", "UNSIGNED-PAYLOAD"].join("\n");
  const toSign = ["AWS4-HMAC-SHA256", amzDate, scope,
    createHash("sha256").update(canonical).digest("hex")].join("\n");
  let k = hmac(`AWS4${cfg.secretAccessKey}`, amzDate.slice(0, 8));
  for (const part of [cfg.region, "s3", "aws4_request"]) k = hmac(k, part);
  const signature = createHmac("sha256", k).update(toSign).digest("hex");
  return `${base.origin}${pathname}?${query}&X-Amz-Signature=${signature}`;
};

const linkFor = (key: string): string =>
  process.env.S3_PUBLIC_URL
    ? `${process.env.S3_PUBLIC_URL.replace(/\/$/, "")}/${key}`
    : presign(key, 7 * 24 * 3600);

if (restore) {
  let token: string | undefined;
  let count = 0;
  do {
    const page = await s3.send(new ListObjectsV2Command({
      Bucket: cfg.bucket, Prefix: prefix, ContinuationToken: token,
    }));
    for (const obj of page.Contents ?? []) {
      const file = path.join(REPO_ROOT, obj.Key!.slice(prefix.length));
      if (existsSync(file) && statSync(file).size === obj.Size) continue;
      const got = await s3.send(new GetObjectCommand({ Bucket: cfg.bucket, Key: obj.Key! }));
      await mkdir(path.dirname(file), { recursive: true });
      await writeFile(file, Buffer.from(await got.Body!.transformToByteArray()));
      count += 1;
      process.stdout.write(`↓ ${path.relative(REPO_ROOT, file)}\n`);
    }
    token = page.NextContinuationToken;
  } while (token);
  process.stdout.write(`Restored ${count} file(s) of ${id} from s3://${cfg.bucket}/${prefix}\n`);
} else {
  const files = reelFiles();
  if (!files.length) throw new Error(`nothing to deliver for ${id}: no out/${id}-*.mp4, no public/*/${id}`);
  let bytes = 0;
  for (const file of files) {
    const rel = path.relative(REPO_ROOT, file).split(path.sep).join("/");
    const body = await readFile(file);
    await s3.send(new PutObjectCommand({
      Bucket: cfg.bucket,
      Key: prefix + rel,
      Body: body,
      ContentType: CONTENT_TYPES[path.extname(file).toLowerCase()] ?? "application/octet-stream",
    }));
    bytes += body.byteLength;
    process.stdout.write(`↑ ${rel}\n`);
  }
  process.stdout.write(
    `Delivered ${files.length} file(s), ${(bytes / 1048576).toFixed(1)} MB → s3://${cfg.bucket}/${prefix}\n`,
  );
  for (const file of files.filter((f) => f.endsWith(".mp4") && f.includes(`${path.sep}out${path.sep}`))) {
    const rel = path.relative(REPO_ROOT, file).split(path.sep).join("/");
    process.stdout.write(`\n${path.basename(file)}:\n${linkFor(prefix + rel)}\n`);
  }
}
