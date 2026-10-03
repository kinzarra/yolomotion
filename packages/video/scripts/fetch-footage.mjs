// Find and download LICENSED video for a reel's evidence shots. Two steps, so
// the shot is chosen by looking at it, not by its title:
//
//   npm run fetch-footage -- search <id> "<query>" [--source all|pexels|pixabay|commons|youtube-cc]
//                                                  [--count 5] [--landscape]
//     → candidates in out/fetch-footage/<id>/candidates.json and a thumbnail
//       per candidate in out/fetch-footage/<id>/thumbs/ (read them before picking)
//   npm run fetch-footage -- get <id> <source:id> --name <file> [--from 12 --to 20]
//     → public/media/<id>/<file>.<ext>, plus its line in public/media/<id>/credits.json
//
// Then cut it like any source: scripts/footage/<id>.json with
// "sourceDir": "../../public/media/<id>" and `npm run footage`.
//
// What gets through is decided by the licence, not by availability:
//   pexels / pixabay  — their own licences: free reuse, no credit required
//   commons           — CC0, public domain and CC BY only (no SA / NC / ND:
//                       a monetised reel cannot carry their conditions)
//   youtube-cc        — only videos YouTube marks «Creative Commons Attribution»;
//                       anything else is dropped BEFORE download. Needs yt-dlp.
// Every BY source must appear in the reel's closing credit line — credits.json
// carries the exact text («credit»).
//
// Env: PEXELS_API_KEY, PIXABAY_API_KEY (each source is skipped without its key).
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const pkg = resolve(here, "..");
const root = resolve(pkg, "../..");

// process.env first (cloud), then the repo .env — as gen-voiceover does.
const dotenv = existsSync(resolve(root, ".env")) ? readFileSync(resolve(root, ".env"), "utf8") : "";
const envValue = (key) =>
  process.env[key] ||
  dotenv.split(/\r?\n/).find((l) => l.startsWith(`${key}=`))
    ?.slice(key.length + 1).trim().replace(/^['"]|['"]$/g, "");

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(`--${name}`);
  return i === -1 ? fallback : argv[i + 1];
};
const positional = argv.filter((a, i) => !a.startsWith("--") && !argv[i - 1]?.startsWith("--"));
const [command, id, arg] = positional;
const usage = 'usage: fetch-footage search <id> "<query>" [--source …] | get <id> <source:id> --name <file>';
if (!["search", "get"].includes(command) || !id || !arg) {
  console.error(usage);
  process.exit(1);
}

const work = resolve(root, "out/fetch-footage", id);
const candidatesFile = resolve(work, "candidates.json");
const mediaDir = resolve(pkg, "public/media", id);
const creditsFile = resolve(mediaDir, "credits.json");
const readJson = (file, fallback) => (existsSync(file) ? JSON.parse(readFileSync(file, "utf8")) : fallback);

const getJson = async (url, headers = {}) => {
  const res = await fetch(url, { headers: { "user-agent": "yolomotion-fetch-footage/1.0", ...headers } });
  if (!res.ok) throw new Error(`${new URL(url).host} → ${res.status} ${(await res.text()).slice(0, 200)}`);
  return res.json();
};
const download = async (url, file) => {
  const res = await fetch(url, { headers: { "user-agent": "yolomotion-fetch-footage/1.0" } });
  if (!res.ok) throw new Error(`download ${res.status}: ${url}`);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, Buffer.from(await res.arrayBuffer()));
};
const stripHtml = (s = "") => s.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();

// Closest to 1080 on the short side without going over 1920 on the long one.
const pickRendition = (files) =>
  files
    .filter((f) => f.url && f.width && f.height && Math.max(f.width, f.height) <= 1920)
    .sort((a, b) => Math.abs(Math.min(a.width, a.height) - 1080) - Math.abs(Math.min(b.width, b.height) - 1080))[0];

// --- sources: each returns normalised candidates ---------------------------

const pexels = async (query, count, portrait) => {
  const key = envValue("PEXELS_API_KEY");
  if (!key) return { skipped: "PEXELS_API_KEY not set" };
  const url = new URL("https://api.pexels.com/videos/search");
  url.search = new URLSearchParams({
    query, per_page: String(count), ...(portrait ? { orientation: "portrait" } : {}),
  });
  const data = await getJson(url, { authorization: key });
  return data.videos.map((v) => {
    const r = pickRendition(v.video_files.filter((f) => f.file_type === "video/mp4")
      .map((f) => ({ url: f.link, width: f.width, height: f.height })));
    return r && {
      key: `pexels:${v.id}`, source: "pexels", duration: v.duration, ...r, thumb: v.image,
      author: v.user?.name, page: v.url, license: "Pexels License", attribution: false,
      credit: null,
    };
  });
};

const pixabay = async (query, count) => {
  const key = envValue("PIXABAY_API_KEY");
  if (!key) return { skipped: "PIXABAY_API_KEY not set" };
  const url = new URL("https://pixabay.com/api/videos/");
  url.search = new URLSearchParams({ key, q: query, per_page: String(Math.max(3, count)), safesearch: "true" });
  const data = await getJson(url);
  return data.hits.slice(0, count).map((v) => {
    const r = pickRendition(["large", "medium", "small"].map((k) => v.videos[k]).filter(Boolean)
      .map((f) => ({ url: f.url, width: f.width, height: f.height, thumb: f.thumbnail })));
    return r && {
      key: `pixabay:${v.id}`, source: "pixabay", duration: v.duration, ...r,
      author: v.user, page: v.pageURL, license: "Pixabay Content License", attribution: false,
      credit: null,
    };
  });
};

const COMMONS_OK = /^(cc0|cc-zero|public domain|pd\b|pd-|cc by \d|cc-by-\d|cc by$)/i;
const COMMONS_NO = /[-\s](sa|nc|nd)\b|share.?alike|non.?commercial|no.?deriv/i; // not «PD-…-NASA»
const commons = async (query, count) => {
  const url = new URL("https://commons.wikimedia.org/w/api.php");
  url.search = new URLSearchParams({
    action: "query", format: "json", generator: "search", gsrnamespace: "6",
    gsrsearch: `${query} filetype:video`, gsrlimit: String(count * 3),
    prop: "imageinfo", iiprop: "url|size|mime|extmetadata|metadata", iiurlwidth: "480",
  });
  const data = await getJson(url);
  return Object.values(data.query?.pages ?? {}).map((p) => {
    const info = p.imageinfo?.[0];
    const meta = info?.extmetadata ?? {};
    const license = meta.LicenseShortName?.value ?? "";
    if (!info || !COMMONS_OK.test(license) || COMMONS_NO.test(license)) return null;
    const length = info.metadata?.find((m) => m.name === "length" || m.name === "playtime_seconds")?.value;
    const author = stripHtml(meta.Artist?.value) || "Wikimedia Commons";
    const attribution = !/^(cc0|cc-zero|public domain|pd)/i.test(license);
    return {
      key: `commons:${p.pageid}`, source: "commons", duration: length ? Math.round(Number(length)) : null,
      url: info.url, width: info.width, height: info.height, thumb: info.thumburl,
      author, page: info.descriptionurl, license, attribution,
      credit: attribution ? `${author} / Wikimedia Commons, ${license}` : null,
    };
  }).filter(Boolean).slice(0, count);
};

const hasYtDlp = () => {
  try { execFileSync("yt-dlp", ["--version"], { stdio: "ignore" }); return true; } catch { return false; }
};
const youtubeCc = async (query, count) => {
  if (!hasYtDlp()) return { skipped: "yt-dlp is not installed" };
  // sp=EgIwAQ%3D%3D is YouTube's own «Creative Commons» search filter; the
  // licence is still re-checked per video below — the filter is not trusted.
  const search = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}&sp=EgIwAQ%3D%3D`;
  const out = execFileSync("yt-dlp", [
    "--dump-json", "--skip-download", "--no-warnings", "--playlist-end", String(count * 2), search,
  ], { maxBuffer: 1 << 28 }).toString();
  return out.split("\n").filter(Boolean).map((line) => JSON.parse(line)).map((v) => {
    if (!/creative commons/i.test(v.license ?? "")) return null;
    return {
      key: `youtube-cc:${v.id}`, source: "youtube-cc", duration: v.duration,
      url: v.webpage_url, width: v.width, height: v.height, thumb: v.thumbnail,
      author: v.channel ?? v.uploader, page: v.webpage_url, license: "CC BY (YouTube)", attribution: true,
      credit: `${v.channel ?? v.uploader} / YouTube, CC BY`, title: v.title,
    };
  }).filter(Boolean).slice(0, count);
};

const SOURCES = { pexels, pixabay, commons, "youtube-cc": youtubeCc };

// --- commands ----------------------------------------------------------------

if (command === "search") {
  const query = arg;
  const count = Number(flag("count", "5"));
  const portrait = !argv.includes("--landscape");
  const which = flag("source", "all");
  const names = which === "all" ? Object.keys(SOURCES) : which.split(",");
  const found = [];
  for (const name of names) {
    if (!SOURCES[name]) throw new Error(`unknown source ${name}; known: ${Object.keys(SOURCES).join(", ")}`);
    try {
      const result = await SOURCES[name](query, count, portrait);
      if (result.skipped) { console.log(`${name}: skipped — ${result.skipped}`); continue; }
      const list = result.filter(Boolean).map((c) => ({ ...c, query }));
      console.log(`${name}: ${list.length}`);
      found.push(...list);
    } catch (error) {
      console.log(`${name}: failed — ${error.message.split("\n")[0]}`);
    }
  }
  const all = readJson(candidatesFile, {});
  for (const c of found) {
    all[c.key] = c;
    if (c.thumb) {
      await download(c.thumb, resolve(work, "thumbs", `${c.key.replace(":", "-")}.jpg`)).catch(() => {});
    }
  }
  mkdirSync(work, { recursive: true });
  writeFileSync(candidatesFile, `${JSON.stringify(all, null, 2)}\n`);
  for (const c of found) {
    const shape = c.width && c.height ? `${c.width}x${c.height}${c.height > c.width ? " vertical" : ""}` : "?";
    console.log(`  ${c.key}  ${c.duration ?? "?"}s  ${shape}  ${c.license}  — ${c.title ?? c.author ?? ""}`);
  }
  console.log(`\nThumbnails: ${resolve(work, "thumbs")}\nNext: fetch-footage get ${id} <source:id> --name <file>`);
} else {
  const c = readJson(candidatesFile, {})[arg];
  if (!c) throw new Error(`${arg} is not in ${candidatesFile} — run search first`);
  const name = flag("name");
  if (!name) throw new Error("--name <file> is required (e.g. --name 05-port)");
  const from = flag("from");
  const to = flag("to");
  mkdirSync(mediaDir, { recursive: true });
  let file;
  if (c.source === "youtube-cc") {
    if (!hasYtDlp()) throw new Error("yt-dlp is not installed");
    file = resolve(mediaDir, `${name}.mp4`);
    execFileSync("yt-dlp", [
      "-f", "bv*[height<=1080]+ba/b[height<=1080]", "--merge-output-format", "mp4",
      ...(from && to ? ["--download-sections", `*${from}-${to}`, "--force-keyframes-at-cuts"] : []),
      "-o", file, "--no-warnings", c.url,
    ], { stdio: "inherit" });
  } else {
    const ext = extname(new URL(c.url).pathname) || ".mp4";
    file = resolve(mediaDir, `${name}${ext}`);
    await download(c.url, file);
  }
  const credits = readJson(creditsFile, []).filter((x) => x.file !== `${name}${extname(file)}`);
  credits.push({
    file: `${name}${extname(file)}`, source: c.source, page: c.page, author: c.author,
    license: c.license, attribution: c.attribution, credit: c.credit,
    ...(from && to ? { section: [Number(from), Number(to)] } : {}),
  });
  writeFileSync(creditsFile, `${JSON.stringify(credits, null, 2)}\n`);
  console.log(`Saved ${file.slice(root.length + 1)}`);
  console.log(c.credit ? `On-screen credit required: «${c.credit}»` : "No credit required by the licence.");
}
