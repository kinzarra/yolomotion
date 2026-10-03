// Turns an edit decision list over LIVE footage into everything the template
// needs: the scene grid, the voiceover slices, and word-accurate captions.
//
//   node scripts/gen-source-cut.mjs scripts/cuts/<id>.json [--slice]
//
// The problem this solves: a reel built on real footage has three things that
// must agree to the frame — where the scenes cut, where the audio slices
// start, and when each spoken word appears. Written by hand they drift the
// moment the jump cut moves. Here the config states SOURCE timestamps only,
// and reel time is derived, so retiming the edit retimes all three.
//
// Captions come from real ASR timestamps (scripts/transcribe.swift), not from
// the letter-weight estimate in gen-weighted-captions.mjs — that one is only
// valid for clips we synthesised ourselves, where no recording exists to
// disagree with it.
//
// `--slice` re-cuts the mp3s from the source (they are NOT normalised here;
// follow with `npm run voiceover -- scripts/voiceover/<id>.json
// --normalize-only`, which levels them to -16 LUFS and regenerates
// durations.ts).
import { execFile } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

const run = promisify(execFile);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const [configArg, ...flags] = process.argv.slice(2);
if (!configArg) throw new Error("Usage: node gen-source-cut.mjs <config.json> [--slice]");
const slice = flags.includes("--slice");

const config = JSON.parse(await readFile(path.resolve(configArg), "utf8"));
const asr = JSON.parse(await readFile(path.resolve(root, config.asr), "utf8"));
if (asr.error) throw new Error(`${config.asr}: ${asr.error}`);

const round = (seconds) => Math.round(seconds * 1000) / 1000;

// --- reel time -------------------------------------------------------------
// Segments play back to back, so a source timestamp maps into the reel only if
// it falls inside one of them: anything in a jump-cut gap is simply gone.
let cursor = 0;
const segments = config.segments.map((segment) => {
  const len = round(segment.srcOut - segment.srcIn);
  if (len <= 0) throw new Error(`${segment.scene}: srcOut must be after srcIn`);
  const placed = { ...segment, len, from: round(cursor) };
  cursor = round(cursor + len);
  return placed;
});
const tail = config.tail ? { ...config.tail, from: round(cursor) } : null;
if (tail) cursor = round(cursor + tail.len);

const toReel = (srcSeconds) => {
  const segment = segments.find(
    (s) => srcSeconds >= s.srcIn && srcSeconds < s.srcOut,
  );
  return segment ? round(segment.from + (srcSeconds - segment.srcIn)) : null;
};

// --- captions --------------------------------------------------------------
// A Speech-framework segment can hold several words on one timestamp; split
// those across the segment's window by letter count so the karaoke highlight
// still lands per word.
const letters = (word) => Math.max(1, word.replace(/[^\p{L}\p{N}]/gu, "").length);

const words = [];
for (const segment of asr.segments) {
  const parts = segment.text.trim().split(/\s+/);
  const total = parts.reduce((sum, part) => sum + letters(part), 0);
  let at = segment.start;
  for (const part of parts) {
    const share = (letters(part) / total) * segment.duration;
    words.push({ text: part, start: round(at), end: round(at + share) });
    at += share;
  }
}

const dropped = [];
const spoken = [];
for (const word of words) {
  const reason = (config.drop ?? []).find(
    ([from, to]) => word.start >= from && word.start < to,
  );
  if (reason) {
    dropped.push(`${word.text} @${word.start}s — ${reason[2]}`);
    continue;
  }
  const from = toReel(word.start);
  if (from === null) {
    dropped.push(`${word.text} @${word.start}s — inside a jump-cut gap`);
    continue;
  }
  spoken.push({
    text: config.rewrite?.[word.text] ?? word.text,
    fromMs: Math.round(from * 1000),
    toMs: Math.round((from + (word.end - word.start)) * 1000),
  });
}

// Pages are authored (the reel engine's `pages` idea) but timed by the
// recording. Splitting them on a proximity threshold instead — the generic
// TikTok grouper — breaks lines mid-sentence, because the pauses in real
// speech do not sit where the grammar does. The word lists must cover the
// surviving speech exactly, in order; that check is the whole safety net.
let cursor2 = 0;
const pages = (config.pages ?? []).map((page) => {
  const wanted = page.trim().split(/\s+/);
  const tokens = spoken.slice(cursor2, cursor2 + wanted.length);
  const got = tokens.map((t) => t.text).join(" ");
  if (got !== wanted.join(" ")) {
    throw new Error(
      `caption page "${page}" does not match the recording at word ${cursor2}: ` +
        `heard "${got}". Pages must cover the spoken words exactly, in order.`,
    );
  }
  cursor2 += wanted.length;
  return {
    startMs: tokens[0].fromMs,
    endMs: tokens[tokens.length - 1].toMs,
    tokens,
  };
});
if (cursor2 !== spoken.length) {
  throw new Error(
    `caption pages cover ${cursor2} of ${spoken.length} spoken words — ` +
      `missing: "${spoken.slice(cursor2).map((t) => t.text).join(" ")}"`,
  );
}

// A page holds briefly after its last word, then clears — it never lingers
// across a pause. The silent beat in this reel is a joke; a caption parked
// over it would step on the timing.
const hold = config.holdMs ?? 260;
const captions = pages.map((page, i) => ({
  ...page,
  outMs: Math.min(pages[i + 1]?.startMs ?? Infinity, page.endMs + hold),
}));

// --- audio slices ----------------------------------------------------------
// The clips are continuous stretches of the source's own soundtrack, so a cut
// inside a sentence is audible. Each one starts where its first segment does.
const audio = config.audio.map((clip) => {
  const from = toReel(clip.srcIn);
  if (from === null) throw new Error(`${clip.file}: srcIn ${clip.srcIn} is not on screen`);
  return { ...clip, from };
});

if (slice) {
  const outDir = path.resolve(root, config.voiceoverDir);
  await mkdir(outDir, { recursive: true });
  for (const clip of audio) {
    const file = path.join(outDir, `${clip.file}.mp3`);
    await run("ffmpeg", [
      "-v", "error", "-y",
      "-i", path.resolve(root, config.source),
      "-vn", "-ss", String(clip.srcIn),
      ...(clip.srcOut ? ["-t", String(round(clip.srcOut - clip.srcIn))] : []),
      "-c:a", "libmp3lame", "-q:a", "2",
      file,
    ]);
    process.stdout.write(`Sliced ${path.relative(root, file)}\n`);
  }
}

// --- generated module ------------------------------------------------------
const beats = [...segments, ...(tail ? [tail] : [])]
  .map((s) => `  ${s.scene}: ${s.len},`)
  .join("\n");
const shots = segments
  .map((s) => `  ${s.scene}: { srcIn: ${s.srcIn}, srcOut: ${s.srcOut} },`)
  .join("\n");
const starts = audio.map((clip) => `  "${clip.file}": ${clip.from},`).join("\n");

const cuts =
  `// Generated by scripts/gen-source-cut.mjs — do not edit by hand.\n` +
  `// Regenerate: node scripts/gen-source-cut.mjs ${configArg}\n` +
  `//\n` +
  `// BEATS are scene lengths in seconds, measured off the source cut; SHOTS\n` +
  `// are the source in/out points each scene shows; VO_STARTS is where each\n` +
  `// audio slice lands in reel time.\n` +
  `export const BEATS = {\n${beats}\n} as const;\n\n` +
  `export const SHOTS = {\n${shots}\n} as const;\n\n` +
  `export const VO_STARTS: Record<string, number> = {\n${starts}\n};\n`;

const cutsPath = path.resolve(root, config.outCuts);
await mkdir(path.dirname(cutsPath), { recursive: true });
await writeFile(cutsPath, cuts);

const captionsPath = path.resolve(root, config.outCaptions);
await mkdir(path.dirname(captionsPath), { recursive: true });
await writeFile(captionsPath, `${JSON.stringify(captions, null, 2)}\n`);

process.stdout.write(
  `${segments.length} shots + ${tail ? 1 : 0} tail = ${cursor}s → ` +
    `${path.relative(root, cutsPath)}\n` +
    `${captions.length} caption pages / ${spoken.length} words → ` +
    `${path.relative(root, captionsPath)}\n`,
);
for (const line of dropped) process.stdout.write(`  dropped: ${line}\n`);
