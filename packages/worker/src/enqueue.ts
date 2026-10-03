// Постановка видео в очередь — CLI-предтеча API/бота с тем же контрактом.
// Новое видео:
//   npm run worker:enqueue -- --template yoloco-audience-fit --project yoloco \
//     [--format reel] [--title "…"] [--props f.json] [--manifest f.json] \
//     [--scenario scripts/scenarios/x.md] [--upload]
// Перегенерация существующего (только БД + S3, ничего локального):
//   npm run worker:enqueue -- --video 42
import { readFileSync } from "node:fs";
import path from "node:path";
import { REPO_ROOT } from "./env.js";
import { pool, tx } from "./db.js";
import { migrate } from "./migrate.js";

const args = process.argv.slice(2);
const flag = (name: string): string | undefined => {
  const i = args.indexOf(`--${name}`);
  return i !== -1 ? args[i + 1] : undefined;
};
const has = (name: string): boolean => args.includes(`--${name}`);
const readText = (p: string | undefined): string | null =>
  p ? readFileSync(path.resolve(REPO_ROOT, p), "utf8") : null;
const readJson = (p: string | undefined): unknown => {
  const raw = readText(p);
  return raw ? JSON.parse(raw) : null;
};

await migrate();

const ids = await tx(async (c) => {
  let videoId: number;
  let hasManifest: boolean;

  const existing = flag("video");
  if (existing) {
    // Перегенерация: строка видео уже несёт всё нужное, джоб начинается с
    // voiceover — стадия сама решит, что восстановить из S3, а что купить.
    const row = await c.query(
      "select id, vo_manifest is not null as has_manifest from video where id = $1",
      [existing],
    );
    if (!row.rowCount) throw new Error(`video ${existing} does not exist`);
    videoId = (row.rows[0] as { id: number }).id;
    hasManifest = (row.rows[0] as { has_manifest: boolean }).has_manifest;
  } else {
    const template = flag("template");
    if (!template) {
      console.error(
        "Usage: enqueue --template <id> [--project slug] [--format reel] " +
          "[--title t] [--props f.json] [--manifest f.json] [--scenario f.md] " +
          "[--upload] | --video <id>",
      );
      process.exit(1);
    }
    let projectId: number | null = null;
    const projectSlug = flag("project");
    if (projectSlug) {
      const p = await c.query("select id from project where slug = $1", [projectSlug]);
      if (!p.rowCount) {
        const known = await c.query("select slug from project order by id");
        throw new Error(
          `project "${projectSlug}" not found; known: ` +
            known.rows.map((r) => (r as { slug: string }).slug).join(", "),
        );
      }
      projectId = (p.rows[0] as { id: number }).id;
    }
    const rawManifest = readJson(flag("manifest")) as {
      voiceId: string;
      modelId?: string;
      voiceSettings?: Record<string, unknown>;
      lines: [string, string][];
    } | null;
    // В строку видео едет только то, что нужно воркеру; outDir и прочие поля
    // скриптового манифеста — его локальные дела.
    const manifest = rawManifest
      ? {
          voiceId: rawManifest.voiceId,
          modelId: rawManifest.modelId,
          voiceSettings: rawManifest.voiceSettings,
          lines: rawManifest.lines,
        }
      : null;
    const video = await c.query(
      `insert into video (project_id, template_id, composition, title, scenario_md, props, vo_manifest)
       values ($1, $2, $3, $4, $5, $6, $7) returning id`,
      [projectId, template, `${template}-${flag("format") ?? "reel"}`,
        flag("title") ?? null, readText(flag("scenario")),
        JSON.stringify(readJson(flag("props")) ?? {}),
        manifest ? JSON.stringify(manifest) : null],
    );
    videoId = (video.rows[0] as { id: number }).id;
    hasManifest = manifest !== null;
  }

  const privacy = flag("privacy") ?? "private";
  if (!["private", "unlisted", "public"].includes(privacy)) {
    throw new Error(`--privacy: private | unlisted | public, got "${privacy}"`);
  }
  const job = await c.query(
    `insert into video_job (video_id, stage, upload, privacy)
     values ($1, $2, $3, $4) returning id`,
    // Без манифеста стадии voiceover нечего делать — стартуем сразу с рендера.
    [videoId, hasManifest ? "voiceover" : "render", has("upload"), privacy],
  );
  return { videoId, jobId: (job.rows[0] as { id: number }).id };
});
console.log(`video ${ids.videoId}, job ${ids.jobId}`);
await pool.end();
