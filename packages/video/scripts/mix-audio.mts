// Mix a template's soundtrack with ffmpeg from its exported MIX description
// (voice clips at VO_RATE, the ducked music bed, the SFX cues) — the audio a
// Remotion render would produce, in seconds instead of a full frame walk.
//
//   npx tsx scripts/mix-audio.mts dev-myth  →  out/dev-myth-audio.m4a
import { execFileSync } from "node:child_process";
import { writeFileSync, readFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const id = process.argv[2];
const here = path.dirname(fileURLToPath(import.meta.url));
const pkg = path.resolve(here, "..");
const root = path.resolve(pkg, "../..");
const { MIX } = await import(path.join(pkg, "src/templates", id, "sound.tsx"));
const pub = (f: string) => path.join(pkg, "public", f);
const SR = 48000;
const tmp = path.join(root, "out", `${id}-mix`);
mkdirSync(tmp, { recursive: true });

// 1. the bed, enveloped sample by sample (duck under the voice, crossfade into a second pass, fade out)
const pcm = execFileSync("ffmpeg", ["-v", "error", "-i", pub(MIX.bed.file), "-f", "f32le", "-ac", "2", "-ar", String(SR), "-"], { maxBuffer: 1 << 30 });
const src = new Float32Array(pcm.buffer, pcm.byteOffset, pcm.byteLength / 4);
const srcFrames = src.length / 2;
const N = Math.round(MIX.duration * SR);
const out = new Float32Array(N * 2);
const b = MIX.bed;
const duck = (t: number) => {
  let d = 0;
  for (const v of MIX.voice) {
    const dist = t < v.start ? v.start - t : t > v.end ? t - v.end : 0;
    d = Math.max(d, 1 - Math.min(1, dist / b.duckRamp));
  }
  return d;
};
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
let gain = 0;
for (let i = 0; i < N; i++) {
  const t = i / SR;
  if (i % 480 === 0) gain = (b.gap - (b.gap - b.under) * duck(t)) * clamp01((MIX.duration - t) / b.endFade);
  let l = 0, r = 0;
  // every pass of the bed: fade in over `fadeIn`, out over `cross` before its end (the last one ends with the video)
  b.passes.forEach((p: { from: number; startFrom: number; len: number; fadeIn: number }, pi: number) => {
    if (t < p.from || t >= p.from + p.len) return;
    const last = pi === b.passes.length - 1;
    const e = clamp01((t - p.from) / p.fadeIn) * (last ? 1 : clamp01((p.from + p.len - t) / b.cross));
    const k = Math.round((t - p.from + p.startFrom) * SR) % srcFrames;
    l += src[2 * k] * e; r += src[2 * k + 1] * e;
  });
  out[2 * i] = l * gain; out[2 * i + 1] = r * gain;
}
const bedRaw = path.join(tmp, "bed.f32");
writeFileSync(bedRaw, Buffer.from(out.buffer));

// 2. voice + sfx placed with adelay, summed onto the bed without normalisation
const ins: string[] = ["-f", "f32le", "-ac", "2", "-ar", String(SR), "-i", bedRaw];
const parts: string[] = [];
let n = 1;
for (const v of MIX.voice) {
  ins.push("-i", pub(v.file));
  const ms = Math.round(v.start * 1000);
  parts.push(`[${n}:a]aresample=${SR},atempo=${MIX.rate},aformat=channel_layouts=stereo,adelay=${ms}|${ms}[a${n}]`);
  n++;
}
for (const c of MIX.cues) {
  ins.push("-i", pub(c.file));
  const ms = Math.round(c.t * 1000);
  parts.push(`[${n}:a]aresample=${SR},aformat=channel_layouts=stereo,volume=${c.vol.toFixed(3)},adelay=${ms}|${ms}[a${n}]`);
  n++;
}
const labels = Array.from({ length: n - 1 }, (_, i) => `[a${i + 1}]`).join("");
const graph = `${parts.join(";")};[0:a]${labels}amix=inputs=${n}:normalize=0:duration=first,alimiter=limit=0.95[m]`;
const script = path.join(tmp, "graph.txt");
writeFileSync(script, graph);
const dst = path.join(root, "out", `${id}-audio.m4a`);
execFileSync("ffmpeg", ["-v", "error", "-y", ...ins, "-filter_complex_script", script, "-map", "[m]", "-t", String(MIX.duration), "-c:a", "aac", "-b:a", "320k", dst], { stdio: "inherit" });
console.log(`✓ out/${id}-audio.m4a  ${MIX.duration}s  (${MIX.voice.length} voice clips, ${MIX.cues.length} cues, bed ducked)`);
void readFileSync;
