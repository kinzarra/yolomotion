// Studio panel — the author's desk. Zero dependencies: one Node http server
// and one HTML page. It never builds a reel itself; it packs a brief into
// studio/briefs/<id>/ (brief.md + files/ + status.json + PROMPT.txt) for
// Claude Code to pick up, edits studio/PLAYBOOK.md, and plays what came out.
//   npm run panel            → http://127.0.0.1:4400
//   PANEL_HOST=0.0.0.0 PANEL_PORT=4400 npm run panel   (on a server, behind auth)
import { createServer } from "node:http";
import { createReadStream, createWriteStream, existsSync, statSync } from "node:fs";
import { mkdir, readFile, readdir, rename, rm, stat, writeFile } from "node:fs/promises";
import { pipeline } from "node:stream/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "../..");
const STUDIO = path.join(ROOT, "studio");
const BRIEFS = path.join(STUDIO, "briefs");
const PLAYBOOK = path.join(STUDIO, "PLAYBOOK.md");
const OUT = path.join(ROOT, "out");
const HOST = process.env.PANEL_HOST ?? "127.0.0.1";
const PORT = Number(process.env.PANEL_PORT ?? 4400);
// Optional basic auth for when the panel lives on a public server.
const AUTH = process.env.PANEL_PASSWORD
  ? "Basic " + Buffer.from(`studio:${process.env.PANEL_PASSWORD}`).toString("base64")
  : null;

const STATUSES = ["new", "writing", "review", "rendering", "done"];
const FACES = { none: "без лица", heygen: "HeyGen-аватар", self: "снимаю сам", ask: "решим вместе" };

const TYPES = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".md": "text/markdown; charset=utf-8", ".txt": "text/plain; charset=utf-8",
  ".mp4": "video/mp4", ".mov": "video/quicktime", ".webm": "video/webm", ".m4v": "video/mp4",
  ".mp3": "audio/mpeg", ".wav": "audio/wav", ".m4a": "audio/mp4",
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp",
  ".gif": "image/gif", ".heic": "image/heic", ".pdf": "application/pdf",
};

// --- helpers -----------------------------------------------------------------
const send = (res, code, body, type = "application/json") => {
  res.writeHead(code, { "content-type": type, "cache-control": "no-store" });
  res.end(type === "application/json" ? JSON.stringify(body) : body);
};
const fail = (res, code, message) => send(res, code, { error: message });

const readBody = async (req, limit = 2 << 20) => {
  const chunks = [];
  let size = 0;
  for await (const c of req) {
    size += c.length;
    if (size > limit) throw Object.assign(new Error("body too large"), { code: 413 });
    chunks.push(c);
  }
  return Buffer.concat(chunks).toString("utf8");
};

const safeName = (name) =>
  path.basename(decodeURIComponent(name)).replace(/[^\p{L}\p{N}._ -]+/gu, "_").slice(0, 120);
const isId = (id) => /^[a-z0-9][a-z0-9-]{0,80}$/.test(id);
const briefDir = (id) => path.join(BRIEFS, id);

const slug = (s) => {
  const map = { а:"a",б:"b",в:"v",г:"g",д:"d",е:"e",ё:"e",ж:"zh",з:"z",и:"i",й:"y",к:"k",л:"l",м:"m",н:"n",о:"o",п:"p",р:"r",с:"s",т:"t",у:"u",ф:"f",х:"h",ц:"c",ч:"ch",ш:"sh",щ:"sch",ъ:"",ы:"y",ь:"",э:"e",ю:"yu",я:"ya" };
  return s.toLowerCase().split("").map((ch) => map[ch] ?? ch).join("")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40) || "reel";
};

const readMeta = async (id) => JSON.parse(await readFile(path.join(briefDir(id), "status.json"), "utf8"));

const listFiles = async (id) => {
  const dir = path.join(briefDir(id), "files");
  if (!existsSync(dir)) return [];
  const names = (await readdir(dir)).filter((n) => !n.startsWith("."));
  return Promise.all(names.map(async (name) => {
    const s = await stat(path.join(dir, name));
    return { name, size: s.size, type: TYPES[path.extname(name).toLowerCase()] ?? "application/octet-stream" };
  }));
};

const videoFor = (id) => {
  const file = path.join(OUT, `${id}.mp4`);
  // ?v=mtime: a re-render keeps the name, the query makes the panel reload it
  return existsSync(file) ? `/media/out/${id}.mp4?v=${Math.round(statSync(file).mtimeMs)}` : null;
};

// Frame notes: the author pauses the preview, draws on the frame and writes
// what to change. Each note is the composited frame (notes/NN.png) plus a row
// in notes/notes.json — Claude reads both, and flips `done` when it is fixed.
const notesDir = (id) => path.join(briefDir(id), "notes");
const readNotes = async (id) => {
  const f = path.join(notesDir(id), "notes.json");
  return existsSync(f) ? JSON.parse(await readFile(f, "utf8")) : [];
};
const writeNotes = async (id, notes) => {
  await mkdir(notesDir(id), { recursive: true });
  await writeFile(path.join(notesDir(id), "notes.json"), JSON.stringify(notes, null, 2));
};
const notesPrompt = (id) =>
  `Правки по кадрам: studio/briefs/${id}/notes/notes.json — открой каждую картинку notes/NN.png (кадр с моими обводками), внеси открытые пометки, перерендери out/${id}.mp4 и отметь done.`;

const promptFor = (id) =>
  `Собери рилс по брифу studio/briefs/${id}/ — сначала studio/PLAYBOOK.md, потом brief.md и всё в files/.`;

// brief.md is what Claude reads: plain, complete, no UI noise.
const renderBrief = (m, files, notes = []) => {
  const f = m.fields;
  const block = (title, text) => (text?.trim() ? `## ${title}\n\n${text.trim()}\n\n` : "");
  return (
    `# ${m.title}\n\n` +
    `- id: \`${m.id}\`\n- создан: ${m.created.slice(0, 16).replace("T", " ")}\n` +
    `- лицо: ${FACES[f.face] ?? f.face}\n- длина: ~${f.duration} с\n- формат: вертикальный 1080×1920\n\n` +
    block("Идея / тема", f.idea) +
    block("Текст автора (если есть — это основа, не переписывать смысл)", f.script) +
    block("Факты, цифры, источники", f.facts) +
    block("Референсы", f.refs) +
    block("Пожелания", f.notes) +
    (files.length
      ? `## Материалы (files/)\n\n${files.map((x) => `- \`files/${x.name}\` (${(x.size / 1048576).toFixed(1)} MB)`).join("\n")}\n`
      : "") +
    (notes.some((n) => !n.done)
      ? `\n## Пометки по кадрам (notes/)\n\n${notes.filter((n) => !n.done).map((n) => `- \`notes/${n.img}\` · ${n.t.toFixed(2)} с — ${n.text || "(без текста, смотри обводку)"}`).join("\n")}\n`
      : "")
  );
};

const saveBrief = async (m) => {
  const dir = briefDir(m.id);
  m.updated = new Date().toISOString();
  await writeFile(path.join(dir, "status.json"), JSON.stringify(m, null, 2));
  await writeFile(path.join(dir, "brief.md"), renderBrief(m, await listFiles(m.id), await readNotes(m.id)));
  await writeFile(path.join(dir, "PROMPT.txt"), promptFor(m.id) + "\n");
};

const cleanFields = (b = {}) => ({
  idea: String(b.idea ?? ""), script: String(b.script ?? ""), facts: String(b.facts ?? ""),
  refs: String(b.refs ?? ""), notes: String(b.notes ?? ""),
  face: FACES[b.face] ? b.face : "ask",
  duration: Math.min(180, Math.max(10, Number(b.duration) || 45)),
});

// Range-aware file streaming: <video> seeks with Range requests.
const serveFile = async (req, res, file) => {
  let s;
  try { s = await stat(file); } catch { return fail(res, 404, "not found"); }
  const type = TYPES[path.extname(file).toLowerCase()] ?? "application/octet-stream";
  const range = /bytes=(\d*)-(\d*)/.exec(req.headers.range ?? "");
  if (range) {
    const start = range[1] ? Number(range[1]) : Math.max(0, s.size - Number(range[2]));
    const end = range[1] && range[2] ? Math.min(Number(range[2]), s.size - 1) : s.size - 1;
    if (start >= s.size) { res.writeHead(416, { "content-range": `bytes */${s.size}` }); return res.end(); }
    res.writeHead(206, {
      "content-type": type, "accept-ranges": "bytes",
      "content-range": `bytes ${start}-${end}/${s.size}`, "content-length": end - start + 1,
    });
    return pipeline(createReadStream(file, { start, end }), res).catch(() => {});
  }
  res.writeHead(200, { "content-type": type, "content-length": s.size, "accept-ranges": "bytes" });
  return pipeline(createReadStream(file), res).catch(() => {});
};

// --- routes ------------------------------------------------------------------
const routes = [
  ["GET", /^\/$/, (req, res) => serveFile(req, res, path.join(HERE, "index.html"))],

  ["GET", /^\/api\/playbook$/, async (req, res) =>
    send(res, 200, { text: existsSync(PLAYBOOK) ? await readFile(PLAYBOOK, "utf8") : "" })],
  ["PUT", /^\/api\/playbook$/, async (req, res) => {
    const { text } = JSON.parse(await readBody(req));
    await mkdir(STUDIO, { recursive: true });
    await writeFile(PLAYBOOK, String(text));
    send(res, 200, { ok: true, saved: new Date().toISOString() });
  }],

  ["GET", /^\/api\/briefs$/, async (req, res) => {
    if (!existsSync(BRIEFS)) return send(res, 200, []);
    const ids = (await readdir(BRIEFS)).filter((d) => isId(d) && existsSync(path.join(BRIEFS, d, "status.json")));
    const items = await Promise.all(ids.map(async (id) => {
      const m = await readMeta(id);
      const notes = await readNotes(id);
      return { id, title: m.title, status: m.status, note: m.note ?? "", created: m.created, updated: m.updated, video: videoFor(id), open: notes.filter((n) => !n.done).length, notesSig: notes.map((n) => `${n.n}${n.done ? "+" : ""}`).join(",") };
    }));
    send(res, 200, items.sort((a, b) => b.created.localeCompare(a.created)));
  }],
  ["POST", /^\/api\/briefs$/, async (req, res) => {
    const b = JSON.parse(await readBody(req));
    const title = String(b.title ?? "").trim() || "Без названия";
    const day = new Date().toISOString().slice(0, 10);
    let id = `${day}-${slug(title)}`;
    for (let n = 2; existsSync(briefDir(id)); n++) id = `${day}-${slug(title)}-${n}`;
    await mkdir(path.join(briefDir(id), "files"), { recursive: true });
    const now = new Date().toISOString();
    const m = { id, title, status: "new", note: "", created: now, updated: now, fields: cleanFields(b) };
    await saveBrief(m);
    send(res, 201, { id });
  }],
  ["GET", /^\/api\/briefs\/([a-z0-9-]+)$/, async (req, res, [, id]) => {
    if (!isId(id) || !existsSync(briefDir(id))) return fail(res, 404, "no such brief");
    const m = await readMeta(id);
    send(res, 200, { ...m, files: await listFiles(id), notes: await readNotes(id), prompt: promptFor(id), notesPrompt: notesPrompt(id), video: videoFor(id) });
  }],
  ["PUT", /^\/api\/briefs\/([a-z0-9-]+)$/, async (req, res, [, id]) => {
    if (!isId(id) || !existsSync(briefDir(id))) return fail(res, 404, "no such brief");
    const b = JSON.parse(await readBody(req));
    const m = await readMeta(id);
    if (b.title !== undefined) m.title = String(b.title).trim() || m.title;
    if (b.fields) m.fields = cleanFields({ ...m.fields, ...b.fields });
    if (STATUSES.includes(b.status)) m.status = b.status;
    await saveBrief(m);
    send(res, 200, { ok: true });
  }],
  ["DELETE", /^\/api\/briefs\/([a-z0-9-]+)$/, async (req, res, [, id]) => {
    if (!isId(id) || !existsSync(briefDir(id))) return fail(res, 404, "no such brief");
    await rm(briefDir(id), { recursive: true, force: true });
    send(res, 200, { ok: true });
  }],

  // Uploads stream straight to disk: PUT body = the file, no multipart parsing.
  ["PUT", /^\/api\/briefs\/([a-z0-9-]+)\/files\/(.+)$/, async (req, res, [, id, raw]) => {
    if (!isId(id) || !existsSync(briefDir(id))) return fail(res, 404, "no such brief");
    const name = safeName(raw);
    const dir = path.join(briefDir(id), "files");
    await mkdir(dir, { recursive: true });
    const tmp = path.join(dir, `.${name}.part`);
    await pipeline(req, createWriteStream(tmp));
    await rm(path.join(dir, name), { force: true });
    await rename(tmp, path.join(dir, name));
    await saveBrief(await readMeta(id));
    send(res, 201, { name });
  }],
  ["DELETE", /^\/api\/briefs\/([a-z0-9-]+)\/files\/(.+)$/, async (req, res, [, id, raw]) => {
    if (!isId(id)) return fail(res, 404, "no such brief");
    await rm(path.join(briefDir(id), "files", safeName(raw)), { force: true });
    await saveBrief(await readMeta(id));
    send(res, 200, { ok: true });
  }],

  ["POST", /^\/api\/briefs\/([a-z0-9-]+)\/notes$/, async (req, res, [, id]) => {
    if (!isId(id) || !existsSync(briefDir(id))) return fail(res, 404, "no such brief");
    const b = JSON.parse(await readBody(req, 24 << 20));
    const png = /^data:image\/png;base64,(.+)$/.exec(String(b.png ?? ""));
    if (!png) return fail(res, 400, "png data url expected");
    const notes = await readNotes(id);
    const n = notes.reduce((mx, x) => Math.max(mx, x.n), 0) + 1;
    const t = Math.max(0, Number(b.t) || 0);
    const img = `${String(n).padStart(2, "0")}-t${t.toFixed(2)}.png`;
    await mkdir(notesDir(id), { recursive: true });
    await writeFile(path.join(notesDir(id), img), Buffer.from(png[1], "base64"));
    notes.push({ n, t, frame: Math.round(t * 30), text: String(b.text ?? "").trim(), img, done: false, created: new Date().toISOString() });
    await writeNotes(id, notes);
    await saveBrief(await readMeta(id));
    send(res, 201, { n, img });
  }],
  ["PUT", /^\/api\/briefs\/([a-z0-9-]+)\/notes\/(\d+)$/, async (req, res, [, id, n]) => {
    if (!isId(id)) return fail(res, 404, "no such brief");
    const b = JSON.parse(await readBody(req));
    const notes = await readNotes(id);
    const note = notes.find((x) => x.n === Number(n));
    if (!note) return fail(res, 404, "no such note");
    if (b.text !== undefined) note.text = String(b.text).trim();
    if (b.done !== undefined) note.done = Boolean(b.done);
    await writeNotes(id, notes);
    await saveBrief(await readMeta(id));
    send(res, 200, { ok: true });
  }],
  ["DELETE", /^\/api\/briefs\/([a-z0-9-]+)\/notes\/(\d+)$/, async (req, res, [, id, n]) => {
    if (!isId(id)) return fail(res, 404, "no such brief");
    const notes = await readNotes(id);
    const note = notes.find((x) => x.n === Number(n));
    if (note) await rm(path.join(notesDir(id), safeName(note.img)), { force: true });
    await writeNotes(id, notes.filter((x) => x.n !== Number(n)));
    await saveBrief(await readMeta(id));
    send(res, 200, { ok: true });
  }],

  ["GET", /^\/api\/renders$/, async (req, res) => {
    if (!existsSync(OUT)) return send(res, 200, []);
    const names = (await readdir(OUT)).filter((n) => n.endsWith(".mp4"));
    const items = await Promise.all(names.map(async (name) => {
      const s = await stat(path.join(OUT, name));
      return { name, size: s.size, mtime: s.mtime.toISOString(), url: `/media/out/${encodeURIComponent(name)}` };
    }));
    send(res, 200, items.sort((a, b) => b.mtime.localeCompare(a.mtime)));
  }],

  ["GET", /^\/media\/briefs\/([a-z0-9-]+)\/files\/(.+)$/, (req, res, [, id, raw]) =>
    isId(id) ? serveFile(req, res, path.join(briefDir(id), "files", safeName(raw))) : fail(res, 404, "not found")],
  ["GET", /^\/media\/briefs\/([a-z0-9-]+)\/notes\/(.+)$/, (req, res, [, id, raw]) =>
    isId(id) ? serveFile(req, res, path.join(notesDir(id), safeName(raw))) : fail(res, 404, "not found")],
  ["GET", /^\/media\/out\/(.+)$/, (req, res, [, raw]) => serveFile(req, res, path.join(OUT, safeName(raw)))],
];

createServer(async (req, res) => {
  if (AUTH && req.headers.authorization !== AUTH) {
    res.writeHead(401, { "www-authenticate": 'Basic realm="studio"' });
    return res.end();
  }
  const url = new URL(req.url, "http://x");
  for (const [method, re, handler] of routes) {
    const m = req.method === method && re.exec(url.pathname);
    if (m) {
      try { return await handler(req, res, m); }
      catch (e) { return fail(res, e.code === 413 ? 413 : 500, e.message); }
    }
  }
  fail(res, 404, "not found");
}).listen(PORT, HOST, () => {
  process.stdout.write(`Studio panel → http://${HOST === "0.0.0.0" ? "localhost" : HOST}:${PORT}\n`);
});
