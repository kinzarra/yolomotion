#!/usr/bin/env node
// TikTok research through RapidAPI «Tiktok Scraper» (tikwm, tiktok-scraper7).
// Reads RAPID_TIKTOK_KEY from the environment or the repo-root .env.
//
//   npm run tiktok -- user <handle> [--count 30] [--pages 1] [--sort latest|hot]
//   npm run tiktok -- search "<query>" [--region ru] [--days 0|1|7|30|90|180] [--sort relevance|likes|date] [--pages 1]
//   npm run tiktok -- hashtag <name> [--count 30] [--pages 1]
//   npm run tiktok -- music <url|id> [--count 30]
//   npm run tiktok -- fyp [--region ru] [--count 20]
//   npm run tiktok -- video <url|id> [--comments 50]
//   npm run tiktok -- grab <url|id> [--every 1]
//   npm run tiktok -- raw <route> key=value …          (any of the 34 endpoints)
//
// Every command writes the full response to out/tiktok/ and prints a compact
// table: views, engagement rate, the counts, length, date, caption — sorted so
// the outliers (≥ 3× the median views) stand out. `grab` downloads one video
// in original quality into out/tiktok/videos/<id>/ with a contact sheet and
// the audio track, for analysis ONLY: TikTok videos never become reel footage
// (Content ID → claim / strike); adapt the idea, not the file.
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const OUT = path.join(root, "out/tiktok");
const HOST = "tiktok-scraper7.p.rapidapi.com";

/* ------------------------------------------------------------------ args */

const [cmd, ...rest] = process.argv.slice(2);
const opts = {};
const pos = [];
for (let i = 0; i < rest.length; i += 1) {
  if (rest[i].startsWith("--")) {
    opts[rest[i].slice(2)] = rest[i + 1] && !rest[i + 1].startsWith("--") ? rest[++i] : true;
  } else pos.push(rest[i]);
}
const num = (k, d) => (opts[k] === undefined ? d : Number(opts[k]));

/* ------------------------------------------------------------------- api */

const key = async () => {
  if (process.env.RAPID_TIKTOK_KEY) return process.env.RAPID_TIKTOK_KEY;
  const text = await readFile(path.join(root, ".env"), "utf8").catch(() => "");
  const line = text.split(/\r?\n/).find((l) => l.startsWith("RAPID_TIKTOK_KEY="));
  const v = line?.slice("RAPID_TIKTOK_KEY=".length).trim().replace(/^['"]|['"]$/g, "");
  if (!v) throw new Error("RAPID_TIKTOK_KEY is not set (env or repo-root .env)");
  return v;
};

let quota = null;
const api = async (route, params = {}) => {
  const qs = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== ""),
  );
  const res = await fetch(`https://${HOST}${route}?${qs}`, {
    headers: { "x-rapidapi-key": await key(), "x-rapidapi-host": HOST },
  });
  quota = res.headers.get("x-ratelimit-scraping-api-remaining") ?? quota;
  const body = await res.json().catch(() => ({ code: -1, msg: `HTTP ${res.status}` }));
  if (!res.ok || body.code !== 0) {
    throw new Error(`${route}: ${body.msg ?? body.message ?? res.status}`);
  }
  return body.data;
};

// Cursor pagination: `pages` requests of `count`, stopping when hasMore ends.
const paged = async (route, params, pick, pages) => {
  const all = [];
  let cursor = 0;
  for (let p = 0; p < pages; p += 1) {
    const data = await api(route, { ...params, cursor });
    all.push(...pick(data));
    if (!data.hasMore) break;
    cursor = data.cursor;
  }
  return all;
};

/* ---------------------------------------------------------------- output */

const slug = (s) =>
  String(s).toLowerCase().replace(/^@/, "").replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-|-$/g, "").slice(0, 60);

const save = async (name, data) => {
  await mkdir(OUT, { recursive: true });
  const file = path.join(OUT, `${name}.json`);
  await writeFile(file, `${JSON.stringify(data, null, 2)}\n`);
  return path.relative(root, file);
};

const k = (n) =>
  n >= 1e9 ? `${(n / 1e9).toFixed(1)}B` : n >= 1e6 ? `${(n / 1e6).toFixed(1)}M` : n >= 1e3 ? `${(n / 1e3).toFixed(1)}K` : String(n ?? 0);

// One flat row per video — the fields an analysis actually uses.
const row = (v) => {
  const views = v.play_count ?? 0;
  const eng = (v.digg_count ?? 0) + (v.comment_count ?? 0) + (v.share_count ?? 0) + (v.collect_count ?? 0);
  return {
    id: v.video_id ?? v.id,
    url: `https://www.tiktok.com/@${v.author?.unique_id ?? "_"}/video/${v.video_id ?? v.id}`,
    author: v.author?.unique_id,
    date: v.create_time ? new Date(v.create_time * 1000).toISOString().slice(0, 10) : "",
    duration: v.duration,
    views,
    likes: v.digg_count,
    comments: v.comment_count,
    shares: v.share_count,
    saves: v.collect_count,
    er: views ? eng / views : 0, // (likes+comments+shares+saves) / views
    saveRate: views ? (v.collect_count ?? 0) / views : 0, // «полезно» — сохраняют
    shareRate: views ? (v.share_count ?? 0) / views : 0, // «надо показать другу»
    music: v.music_info?.title,
    original: v.music_info?.original,
    pinned: Boolean(v.is_top),
    ad: Boolean(v.is_ad),
    caption: (v.title ?? "").replace(/\s+/g, " ").trim(),
  };
};

const median = (xs) => {
  const s = [...xs].sort((a, b) => a - b);
  return s.length ? s[Math.floor(s.length / 2)] : 0;
};

const table = (rows, label) => {
  if (!rows.length) {
    console.log(`${label}: nothing returned`);
    return;
  }
  const med = median(rows.map((r) => r.views));
  const sorted = [...rows].sort((a, b) => b.views - a.views);
  console.log(`\n${label}: ${rows.length} videos · median views ${k(med)} · ★ = ≥3× median\n`);
  console.log("    views    ER   save  share   dur  date        caption");
  for (const r of sorted) {
    const star = med && r.views >= 3 * med ? "★" : " ";
    console.log(
      `${star} ${k(r.views).padStart(7)} ${(r.er * 100).toFixed(1).padStart(5)}% ${(r.saveRate * 100).toFixed(2).padStart(5)}% ${(r.shareRate * 100).toFixed(2).padStart(5)}% ${String(r.duration ?? "").padStart(4)}s  ${r.date}  ${r.caption.slice(0, 70)}`,
    );
  }
};

const done = (file) => console.log(`\n→ ${file}${quota ? `   (quota left: ${quota})` : ""}`);

const videoId = (s) => String(s).match(/video\/(\d+)/)?.[1] ?? String(s);

/* -------------------------------------------------------------- commands */

const SORT_SEARCH = { relevance: 0, likes: 1, date: 2 };

const commands = {
  async user() {
    const handle = String(pos[0] ?? "").replace(/^@/, "");
    if (!handle) throw new Error("user <handle>");
    const info = await api("/user/info", { unique_id: handle });
    const posts = await paged(
      "/user/posts",
      { unique_id: handle, count: num("count", 30), sort_type: opts.sort === "hot" ? 1 : 0 },
      (d) => d.videos ?? [],
      num("pages", 1),
    );
    const u = info.user ?? {};
    const s = info.stats ?? {};
    console.log(
      `@${u.uniqueId} — ${u.nickname} · ${k(s.followerCount)} followers · ${k(s.heartCount ?? s.heart)} likes · ${s.videoCount} videos${u.verified ? " · verified" : ""}`,
    );
    if (u.signature) console.log(`bio: ${u.signature.replace(/\s+/g, " ")}`);
    const rows = posts.map(row);
    table(rows, `@${handle}`);
    done(await save(`user-${slug(handle)}`, { info, rows, raw: posts }));
  },

  async search() {
    const q = pos.join(" ");
    if (!q) throw new Error('search "<query>"');
    const videos = await paged(
      "/feed/search",
      {
        keywords: q,
        region: opts.region,
        count: num("count", 30),
        publish_time: num("days", 0),
        sort_type: SORT_SEARCH[opts.sort ?? "relevance"] ?? 0,
      },
      (d) => d.videos ?? [],
      num("pages", 1),
    );
    const rows = videos.map(row);
    table(rows, `«${q}»${opts.region ? ` [${opts.region}]` : ""}`);
    done(await save(`search-${slug(q)}`, { query: q, opts, rows, raw: videos }));
  },

  async hashtag() {
    const name = String(pos[0] ?? "").replace(/^#/, "");
    if (!name) throw new Error("hashtag <name>");
    const info = await api("/challenge/info", { challenge_name: name });
    const videos = await paged(
      "/challenge/posts",
      { challenge_id: info.id, count: num("count", 30) },
      (d) => d.videos ?? [],
      num("pages", 1),
    );
    console.log(`#${info.cha_name} · ${k(info.view_count)} views · ${k(info.user_count)} videos`);
    const rows = videos.map(row);
    table(rows, `#${name}`);
    done(await save(`hashtag-${slug(name)}`, { info, rows, raw: videos }));
  },

  async music() {
    const id = String(pos[0] ?? "").match(/(\d{8,})/)?.[1];
    if (!id) throw new Error("music <url|id>");
    const info = await api("/music/info", { url: pos[0] });
    const videos = await paged("/music/posts", { music_id: id, count: num("count", 30) }, (d) => d.videos ?? [], num("pages", 1));
    console.log(`♪ ${info.title} — ${info.author} · ${k(info.video_count)} videos`);
    const rows = videos.map(row);
    table(rows, `music ${id}`);
    done(await save(`music-${id}`, { info, rows, raw: videos }));
  },

  async fyp() {
    const data = await api("/feed/list", { region: opts.region ?? "ru", count: num("count", 20) });
    const rows = (Array.isArray(data) ? data : data.videos ?? []).map(row);
    table(rows, `FYP [${opts.region ?? "ru"}]`);
    done(await save(`fyp-${opts.region ?? "ru"}-${new Date().toISOString().slice(0, 10)}`, { rows, raw: data }));
  },

  async video() {
    if (!pos[0]) throw new Error("video <url|id>");
    const detail = await api("/", { url: pos[0], hd: 1 });
    const comments = await paged(
      "/comment/list",
      { url: videoId(pos[0]), count: Math.min(num("comments", 50), 50) },
      (d) => d.comments ?? [],
      Math.ceil(num("comments", 50) / 50),
    );
    const r = row(detail);
    console.log(`@${r.author} · ${r.date} · ${r.duration}s · ${k(r.views)} views · ER ${(r.er * 100).toFixed(1)}% · saves ${(r.saveRate * 100).toFixed(2)}% · shares ${(r.shareRate * 100).toFixed(2)}%`);
    console.log(`caption: ${r.caption}`);
    console.log(`sound: ${r.music ?? "?"}${r.original ? " (original)" : ""}`);
    console.log(`\ntop comments (by likes) — what the audience actually reacted to:`);
    for (const c of comments.filter((c) => String(c.text ?? "").trim()).sort((a, b) => (b.digg_count ?? 0) - (a.digg_count ?? 0)).slice(0, 15)) {
      console.log(`  ${k(c.digg_count ?? 0).padStart(6)} ♥  ${String(c.text).replace(/\s+/g, " ").slice(0, 110)}`);
    }
    done(await save(`video-${r.id}`, { row: r, detail, comments }));
  },

  async grab() {
    if (!pos[0]) throw new Error("grab <url|id>");
    const detail = await api("/", { url: pos[0], hd: 1 });
    const r = row(detail);
    const dir = path.join(OUT, "videos", String(r.id));
    await mkdir(dir, { recursive: true });
    const src = detail.hdplay || detail.play;
    const res = await fetch(src);
    if (!res.ok) throw new Error(`download ${res.status}`);
    const mp4 = path.join(dir, "video.mp4");
    await writeFile(mp4, Buffer.from(await res.arrayBuffer()));
    // Contact sheet: one frame per `every` seconds, 6 across — the hook's
    // first frames, the cuts, the on-screen text, all in one image to read.
    const every = num("every", 1);
    const frames = Math.max(1, Math.ceil((detail.duration || 30) / every));
    const rows = Math.ceil(Math.min(frames, 36) / 6);
    execFileSync("ffmpeg", ["-v", "error", "-y", "-i", mp4, "-vf", `fps=1/${every},scale=240:-2,tile=6x${rows}`, "-frames:v", "1", path.join(dir, "sheet.png")]);
    execFileSync("ffmpeg", ["-v", "error", "-y", "-i", mp4, "-t", "3", "-vf", "fps=10,scale=240:-2,tile=6x5", "-frames:v", "1", path.join(dir, "hook.png")]);
    execFileSync("ffmpeg", ["-v", "error", "-y", "-i", mp4, "-vn", "-ac", "1", "-ar", "16000", path.join(dir, "audio.wav")]);
    await writeFile(path.join(dir, "meta.json"), `${JSON.stringify({ row: r, detail }, null, 2)}\n`);
    console.log(`@${r.author} · ${r.duration}s · ${k(r.views)} views — ${r.caption.slice(0, 80)}`);
    console.log(`→ ${path.relative(root, dir)}/  video.mp4 · sheet.png (1 frame / ${every}s) · hook.png (first 3s at 10fps) · audio.wav`);
    console.log("  analysis only — never footage in a reel.");
  },

  async raw() {
    const route = pos[0];
    if (!route?.startsWith("/")) throw new Error("raw </route> key=value …");
    const params = Object.fromEntries(pos.slice(1).map((p) => [p.slice(0, p.indexOf("=")), p.slice(p.indexOf("=") + 1)]));
    const data = await api(route, params);
    console.log(JSON.stringify(data, null, 2).slice(0, 4000));
    done(await save(`raw-${slug(route)}-${Date.now()}`, data));
  },
};

if (!commands[cmd]) {
  console.error(
    "Usage: npm run tiktok -- <user|search|hashtag|music|fyp|video|grab|raw> …\n" +
      "See .claude/skills/tiktok-research/SKILL.md",
  );
  process.exit(1);
}
await commands[cmd]();
