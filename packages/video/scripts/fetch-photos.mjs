// Find and download LICENSED photos for a reel's cut-outs (the author's rule:
// a real photo in every beat). Two steps, so the shot is chosen by looking at
// a contact sheet, not by its title:
//
//   npm run fetch-photos -- search <id> "<query>" ["<query>" …] [--count 6]
//     → out/fetch-photos/<id>/<query>.json, thumbs/, and sheet.jpg (6 across,
//       rows in query order) — read sheet.jpg, pick by index
//   npm run fetch-photos -- get <id> <query>:<index> --name fig-cashier [--cut]
//     → public/images/<id>/fig-cashier.jpg (large2x), or with --cut the subject
//       on transparent, trimmed: fig-cashier.png (matte.swift + trim.swift,
//       macOS only); the credit line lands in public/images/<id>/credits.json
//
// Pexels only for now (Pexels licence: free reuse, no credit required).
// Env: PEXELS_API_KEY (process.env first, then the repo .env).
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const pkg = resolve(here, "..");
const root = resolve(pkg, "../..");
const dotenv = existsSync(resolve(root, ".env")) ? readFileSync(resolve(root, ".env"), "utf8") : "";
const key = process.env.PEXELS_API_KEY ?? dotenv.match(/^PEXELS_API_KEY=["']?([^"'\n]+)/m)?.[1];
if (!key) { console.error("PEXELS_API_KEY is not set (env or .env)"); process.exit(1); }

const args = process.argv.slice(2);
const flag = (n, d) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : d; };
const has = (n) => args.includes(n);
const [cmd, id] = args;
if (!cmd || !id) { console.error("usage: fetch-photos search <id> \"<q>\" … | get <id> <query>:<index> --name <file> [--cut]"); process.exit(1); }
const slug = (q) => q.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
const outDir = resolve(root, "out/fetch-photos", id);
mkdirSync(resolve(outDir, "thumbs"), { recursive: true });
const dl = async (url, file) => { const r = await fetch(url); if (!r.ok) throw new Error(`${r.status} ${url}`); writeFileSync(file, Buffer.from(await r.arrayBuffer())); };

if (cmd === "search") {
  const count = Number(flag("--count", 6));
  const queries = args.slice(2).filter((a, i, all) => !a.startsWith("--") && all[i - 1] !== "--count");
  const files = [];
  for (const q of queries) {
    const r = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(q)}&per_page=${count}&orientation=portrait`, { headers: { Authorization: key } });
    const j = await r.json();
    writeFileSync(resolve(outDir, `${slug(q)}.json`), JSON.stringify(j, null, 1));
    console.log(`\n## ${q}`);
    let i = 0;
    for (const p of j.photos ?? []) {
      const f = resolve(outDir, "thumbs", `${slug(q)}-${i}.jpg`);
      if (!existsSync(f)) await dl(p.src.medium, f);
      files.push(f);
      console.log(`${i}: ${p.id} ${p.width}x${p.height} ${p.photographer} | ${(p.alt ?? "").slice(0, 70)}`);
      i += 1;
    }
  }
  if (files.length > 1) {
    execFileSync("node", [resolve(here, "sheet.mjs"), resolve(outDir, "sheet.jpg"), "6", "300", "450", ...files], { stdio: "inherit" });
    console.log(`\nSheet: ${resolve(outDir, "sheet.jpg")} (rows in query order, 6 across)`);
  }
} else if (cmd === "get") {
  const [q, idx] = (args[2] ?? "").split(":");
  const name = flag("--name");
  if (!q || idx === undefined || !name) { console.error("get <id> <query>:<index> --name <file> [--cut]"); process.exit(1); }
  const j = JSON.parse(readFileSync(resolve(outDir, `${slug(q)}.json`), "utf8"));
  const p = j.photos[Number(idx)];
  if (!p) { console.error("no such candidate"); process.exit(1); }
  const imgDir = resolve(pkg, "public/images", id);
  mkdirSync(imgDir, { recursive: true });
  const src = resolve(outDir, `${name}.jpg`);
  await dl(p.src.large2x, src);
  let out = resolve(imgDir, `${name}.jpg`);
  if (has("--cut")) {
    const bin = resolve(tmpdir(), "yolomotion-bin");
    mkdirSync(bin, { recursive: true });
    for (const t of ["matte", "trim"]) if (!existsSync(resolve(bin, t))) execFileSync("swiftc", ["-O", resolve(here, `${t}.swift`), "-o", resolve(bin, t)], { stdio: "inherit" });
    const raw = resolve(outDir, `${name}-raw.png`);
    execFileSync(resolve(bin, "matte"), [src, raw], { stdio: "inherit" });
    out = resolve(imgDir, `${name}.png`);
    execFileSync(resolve(bin, "trim"), [raw, out], { stdio: "inherit" });
  } else {
    writeFileSync(out, readFileSync(src));
  }
  const credits = resolve(imgDir, "credits.json");
  const list = existsSync(credits) ? JSON.parse(readFileSync(credits, "utf8")) : [];
  list.push({ file: out.slice(imgDir.length + 1), source: "pexels", id: p.id, author: p.photographer, page: p.url, license: "Pexels License", credit: null, cut: has("--cut") });
  writeFileSync(credits, JSON.stringify(list, null, 2));
  console.log(`Saved ${out.replace(root + "/", "")} (Pexels ${p.id}, ${p.photographer}; no credit required)`);
} else {
  console.error(`unknown command ${cmd}`);
  process.exit(1);
}
