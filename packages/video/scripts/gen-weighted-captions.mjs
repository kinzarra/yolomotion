// Generates Remotion Caption[] JSON from the same measured clips used by the
// reel. This keeps subtitles deterministic without another paid transcription
// pass and, unlike hand-timed pages, automatically follows regenerated audio.
//
// Usage: node scripts/gen-weighted-captions.mjs scripts/captions/<id>.json
import { execFile } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

const run = promisify(execFile);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const configPath = process.argv[2];

if (!configPath) {
  throw new Error("Usage: node gen-weighted-captions.mjs <config.json>");
}

const config = JSON.parse(await readFile(path.resolve(configPath), "utf8"));
const voiceoverManifest = JSON.parse(
  await readFile(path.resolve(root, config.voiceoverManifest), "utf8"),
);
const texts = new Map(voiceoverManifest.lines);

const duration = async (file) => {
  const { stdout } = await run("ffprobe", [
    "-v",
    "error",
    "-show_entries",
    "format=duration",
    "-of",
    "csv=p=0",
    file,
  ]);
  return Number(stdout.trim());
};

const weight = (word) => {
  const letters = word.replace(/[^\p{L}\p{N}']/gu, "").length;
  if (word.endsWith("...")) return letters + 8;
  if (/[.?!]$/.test(word)) return letters + 3.2;
  if (/[,—]$/.test(word)) return letters + 1.8;
  return letters + 1.3;
};

// Pronunciation hints belong in TTS input, not in on-screen typography.
const withoutStressMarks = (word) => word.normalize("NFD").replace(/\u0301/g, "");

const captions = [];
let globalWord = 0;
for (const [file, start] of config.lines) {
  const text = texts.get(file);
  if (!text) throw new Error(`${file}: missing from ${config.voiceoverManifest}`);
  const words = text.trim().split(/\s+/);
  const weights = words.map(weight);
  const raw = await duration(
    path.resolve(root, voiceoverManifest.outDir, `${file}.mp3`),
  );
  const spoken = raw / config.rate;
  const totalWeight = weights.reduce((sum, item) => sum + item, 0);
  let cursor = start;

  for (let i = 0; i < words.length; i += 1) {
    const wordDuration = (weights[i] / totalWeight) * spoken;
    captions.push({
      text: `${globalWord === 0 ? "" : " "}${withoutStressMarks(words[i])}`,
      startMs: Math.round(cursor * 1000),
      endMs: Math.round((cursor + wordDuration) * 1000),
      timestampMs: Math.round(cursor * 1000),
      confidence: 1,
    });
    cursor += wordDuration;
    globalWord += 1;
  }
}

const out = path.resolve(root, config.outFile);
await mkdir(path.dirname(out), { recursive: true });
await writeFile(out, `${JSON.stringify(captions, null, 2)}\n`);
process.stdout.write(
  `${captions.length} caption tokens → ${path.relative(root, out)}\n`,
);
