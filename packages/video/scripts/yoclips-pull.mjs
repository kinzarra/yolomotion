#!/usr/bin/env node
// Pull one finished YoClips video out of S3 into a working copy, so it can be
// re-cut without buying anything again (docs/tiktok/TZ-800-ceiling.md §3).
//
//   node packages/video/scripts/yoclips-pull.mjs v97 [--into <repo root>]
//
// s3://<S3_AVATAR_BUCKET>/videos/vN/ →
//   other/template.tgz      → packages/video/  (src/templates/<slug>/ + scripts/presenter/<slug>.json)
//   voiceover_clip/*.mp3    → packages/video/public/voiceover/<slug>/
//   presenter/*.mp4         → packages/video/public/presenter/<slug>/
//   image/*                 → packages/video/public/images/<slug>/
//   out.mp4, still/*        → out/yoclips/vN/   (the published cut, for comparison)
//
// Read-only on the bucket. The template's durations.ts arrives empty (the
// product passes measured durations through props): measure the mp3s with
// `npm run voiceover -- <manifest> --durations-only`, never by hand. The
// template is NOT registered in templates/index.ts — that is a code edit.
//
// YoClips templates are built on the YoClips fork of the engine
// (components/Type|Flags|Race, reel/effects.tsx, useFlip3D), which this repo
// does not carry. Pull into a YoClips checkout with --into until the engines
// are merged.
import { S3Client, ListObjectsV2Command, GetObjectCommand } from "@aws-sdk/client-s3";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here, "../../..");
const argv = process.argv.slice(2);
const vid = argv.find((a) => /^v\d+$/.test(a));
const intoAt = argv.indexOf("--into");
const into = intoAt >= 0 ? path.resolve(argv[intoAt + 1]) : repo;
if (!vid) throw new Error("Usage: yoclips-pull.mjs vN [--into <repo root>]");

const dotenv = Object.fromEntries(
  (existsSync(path.join(repo, ".env")) ? readFileSync(path.join(repo, ".env"), "utf8") : "")
    .split(/\r?\n/)
    .filter((l) => /^[A-Z0-9_]+=/.test(l))
    .map((l) => [l.slice(0, l.indexOf("=")), l.slice(l.indexOf("=") + 1).trim().replace(/^['"]|['"]$/g, "")]),
);
const env = (k) => process.env[k] || dotenv[k];
const endpoint = env("S3_ENDPOINT") ?? env("S3_ENDPOINT_URL");
const bucket = env("YOCLIPS_BUCKET") ?? env("S3_AVATAR_BUCKET") ?? "yoclips";
const s3 = new S3Client({
  region: env("S3_REGION") ?? (endpoint?.includes("yandexcloud") ? "ru-central1" : "auto"),
  endpoint,
  forcePathStyle: Boolean(endpoint),
  credentials: {
    accessKeyId: env("S3_ACCESS_KEY_ID") ?? env("S3_ACCESS_KEY"),
    secretAccessKey: env("S3_SECRET_ACCESS_KEY") ?? env("S3_SECRET_KEY"),
  },
});

const prefix = `videos/${vid}/`;
const keys = [];
for (let token; ;) {
  const r = await s3.send(new ListObjectsV2Command({ Bucket: bucket, Prefix: prefix, ContinuationToken: token }));
  keys.push(...(r.Contents ?? []).map((o) => o.Key.slice(prefix.length)));
  if (!r.IsTruncated) break;
  token = r.NextContinuationToken;
}
if (!keys.includes("other/template.tgz")) throw new Error(`${vid}: no other/template.tgz in s3://${bucket}/${prefix}`);

const get = async (key) =>
  Buffer.from(await (await s3.send(new GetObjectCommand({ Bucket: bucket, Key: prefix + key }))).Body.transformToByteArray());
const save = async (file, body) => {
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, body);
};

const video = path.join(into, "packages/video");
const tgz = path.join(into, "out/yoclips", vid, "template.tgz");
await save(tgz, await get("other/template.tgz"));
const listing = execFileSync("tar", ["tzf", tgz], { encoding: "utf8" });
const slug = listing.match(/src\/templates\/([^/]+)\//)?.[1];
if (!slug) throw new Error(`${vid}: template.tgz has no src/templates/<slug>/`);
if (existsSync(path.join(video, "src/templates", slug))) {
  throw new Error(`${slug} already exists in ${video}/src/templates — move it away first`);
}
execFileSync("tar", ["xzf", tgz, "-C", video]);

const dest = {
  voiceover_clip: path.join(video, "public/voiceover", slug),
  presenter: path.join(video, "public/presenter", slug),
  image: path.join(video, "public/images", slug),
  still: path.join(into, "out/yoclips", vid),
};
let n = 0;
for (const key of keys) {
  const [kind, ...rest] = key.split("/");
  const target = key === "out.mp4" ? path.join(into, "out/yoclips", vid, "out.mp4")
    : dest[kind] && rest.length ? path.join(dest[kind], rest.join("/"))
    : null;
  if (!target) continue;
  await save(target, await get(key));
  n++;
}
console.log(`${vid} → ${slug}: template + ${n} files into ${into}`);
console.log(`next: register ${slug} in src/templates/index.ts, measure durations (--durations-only), npm run stills -- ${slug}-reel`);
