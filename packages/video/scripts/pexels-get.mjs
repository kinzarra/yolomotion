// Pexels video straight into a reel, by id or by the first good search hit:
// downloads the HD file, cuts `--len` seconds from `--from`, normalises to
// 1920 wide (or 1080 wide for vertical) at 30 fps without audio, and appends
// the credit to public/media/<reel>/credits.json.
//
//   node scripts/pexels-get.mjs <reel> <name> id:7507758 [--from 0] [--len 8]
//   node scripts/pexels-get.mjs <reel> <name> "q:server room" [--portrait]
//
// Use it for the author's own Pexels links and for quick evidence clips;
// fetch-footage (search → thumbs → pick) is still the way to choose by eye.
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync, chmodSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const pkg = path.resolve(here, "..");
const root = path.resolve(pkg, "../..");
const env = readFileSync(path.join(root, ".env"), "utf8");
const key = process.env.PEXELS_API_KEY ?? env.match(/^PEXELS_API_KEY=["']?([^"'\n]+)/m)?.[1];
const [reel, name, what] = process.argv.slice(2);
const flag = (n, d) => { const i = process.argv.indexOf(`--${n}`); return i >= 0 ? process.argv[i + 1] : d; };
const from = Number(flag("from", 0));
const len = Number(flag("len", 8));
const portrait = process.argv.includes("--portrait");
if (!reel || !name || !what) { console.error("usage: pexels-get <reel> <name> id:<n> | q:<query>"); process.exit(1); }

const api = async (u) => (await fetch(u, { headers: { Authorization: key } })).json();
let video;
if (what.startsWith("id:")) video = await api(`https://api.pexels.com/videos/videos/${what.slice(3)}`);
else {
  const r = await api(`https://api.pexels.com/videos/search?query=${encodeURIComponent(what.slice(2))}&per_page=10&orientation=${portrait ? "portrait" : "landscape"}`);
  video = r.videos?.find((v) => v.duration >= len + from) ?? r.videos?.[0];
}
if (!video?.video_files) throw new Error(`nothing for ${what}`);
const files = video.video_files.filter((f) => f.file_type === "video/mp4" && f.width);
files.sort((a, b) => Math.abs(Math.min(a.width, a.height) - 1080) - Math.abs(Math.min(b.width, b.height) - 1080));
const src = files[0];
const dir = path.join(pkg, "public/media", reel);
mkdirSync(dir, { recursive: true });
const tmp = path.join(root, "out", `${reel}-${name}.src.mp4`);
execFileSync("curl", ["-sSL", "-o", tmp, src.link]);
const vertical = src.height > src.width;
const out = path.join(dir, `${name}.mp4`);
execFileSync("ffmpeg", ["-v", "error", "-y", "-ss", String(from), "-t", String(len), "-i", tmp, "-an", "-vf", `scale=${vertical ? 1080 : 1920}:-2,fps=30`, "-c:v", "libx264", "-crf", "19", "-pix_fmt", "yuv420p", out]);
chmodSync(out, 0o644);
const credits = path.join(dir, "credits.json");
const list = existsSync(credits) ? JSON.parse(readFileSync(credits, "utf8")) : [];
list.push({ file: `${name}.mp4`, source: `Pexels ${video.id}`, author: video.user?.name, page: video.url, license: "Pexels License" });
writeFileSync(credits, JSON.stringify(list, null, 2));
chmodSync(credits, 0o644);
const thumb = path.join(root, "out", "dev-myth-check", `vid-${name}.jpg`);
execFileSync("ffmpeg", ["-v", "error", "-y", "-ss", String(Math.min(2, len / 2)), "-i", out, "-frames:v", "1", "-vf", "scale=-2:270", thumb]);
console.log(`✓ ${path.relative(root, out)}  ${vertical ? "vertical" : "landscape"}  Pexels ${video.id} (${video.user?.name})`);
