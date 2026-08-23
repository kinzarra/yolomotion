// Synthesizes a 20s warm electronic bed at 120 BPM, mixed FOR the
// vibecloud-deploy timeline: chord changes and impacts land exactly on the
// scene cuts (4s, 9.5s, 16.5s). No glitch sections — calm build, half-time
// finale under the logo, 2s outro fade.
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SR = 44100;
const DUR = 20.5;
const N = SR * DUR;
const out = new Float32Array(N);
const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "sfx");
mkdirSync(OUT, { recursive: true });

const add = (start, dur, fn) => {
  const s0 = Math.floor(start * SR);
  const n = Math.floor(dur * SR);
  for (let i = 0; i < n && s0 + i < N; i++) out[s0 + i] += fn(i / SR, i / n);
};
let seed = 1;
const rnd = () => {
  seed = (seed * 16807) % 2147483647;
  return seed / 2147483647 - 0.5;
};

// Soft kick: rounded thump, no sharp click.
const kick = (t, amp = 0.6) =>
  add(t, 0.3, (ts, p) => {
    const f = 110 - 70 * Math.min(1, ts * 7);
    return Math.sin(2 * Math.PI * f * ts) * Math.exp(-p * 6) * amp;
  });
const hat = (t) => add(t, 0.04, (ts, p) => rnd() * 2 * Math.exp(-p * 12) * 0.055);
const bass = (t, f, dur = 0.22, amp = 0.22) =>
  add(t, dur, (ts, p) => {
    const env = Math.min(1, ts * 70) * Math.exp(-p * 3.5);
    return Math.sin(2 * Math.PI * f * ts) * env * amp;
  });
// Scene-cut impact: deep boom + soft noise swell, gentler than a drop.
const impact = (t) => {
  add(t, 1.1, (ts, p) => {
    const f = 55 - 20 * Math.min(1, ts * 2.5);
    return Math.sin(2 * Math.PI * f * ts) * Math.exp(-p * 4) * 0.55;
  });
  add(t, 0.3, (ts, p) => rnd() * 2 * Math.exp(-p * 7) * 0.16);
};

// Chord pads follow the scenes: Am (IDE) -> F (chat) -> C (live) -> Am (logo).
// Detuned sines + slow tremolo, long soft edges.
const CHORDS = [
  [0, 4, [110, 130.81, 164.81]], // A2 C3 E3
  [4, 5.5, [87.31, 110, 130.81]], // F2 A2 C3
  [9.5, 7, [98, 130.81, 164.81]], // G2(add) C3 E3 — brighter for the live site
  [16.5, 4, [110, 130.81, 164.81, 220]], // Am + octave for the logo
];
for (const [start, dur, freqs] of CHORDS) {
  for (const f of freqs) {
    add(start, dur, (ts, p) => {
      const attack = Math.min(1, ts / 0.9);
      const release = Math.min(1, ((1 - p) * dur) / 1.2);
      const trem = 1 + 0.12 * Math.sin(2 * Math.PI * 0.9 * ts);
      return (
        (Math.sin(2 * Math.PI * f * ts) + Math.sin(2 * Math.PI * (f * 1.003) * ts)) *
        0.028 *
        attack *
        release *
        trem
      );
    });
  }
}

const FPB = 0.5;
// Kicks: four-on-floor from 2s to 16.5s, half-time under the logo.
for (let b = 4; b < 33; b++) kick(b * FPB, 0.55);
for (let b = 33; b < 40; b += 2) kick(b * FPB, 0.6);
// Offbeat hats 2s..16.5s only (keep the logo airy).
for (let b = 4; b < 33; b++) hat(b * FPB + 0.25);
// Bass 8ths following the chords, 2s..16.5s.
const ROOTS = [
  [2, 4, 55], // A1
  [4, 9.5, 43.65], // F1
  [9.5, 16.5, 49], // G1
];
for (const [t0, t1, f] of ROOTS) {
  for (let t = t0; t < t1 - 0.01; t += 0.25) bass(t, f, 0.16, 0.2);
}
// Logo bass: two long whole notes.
bass(16.5, 55, 1.8, 0.24);
bass(18.3, 55, 1.8, 0.2);
// Impacts exactly on the scene cuts.
impact(4);
impact(9.5);
impact(16.5);

// Global outro fade over the last 2.5s.
for (let i = 0; i < N; i++) {
  const ts = i / SR;
  if (ts > DUR - 2.7) out[i] *= (DUR - ts) / 2.7;
}

// Normalize to 0.85 peak.
let peak = 0;
for (let i = 0; i < N; i++) peak = Math.max(peak, Math.abs(out[i]));
const g = 0.85 / peak;
const buf = Buffer.alloc(44 + N * 2);
buf.write("RIFF", 0);
buf.writeUInt32LE(36 + N * 2, 4);
buf.write("WAVE", 8);
buf.write("fmt ", 12);
buf.writeUInt32LE(16, 16);
buf.writeUInt16LE(1, 20);
buf.writeUInt16LE(1, 22);
buf.writeUInt32LE(SR, 24);
buf.writeUInt32LE(SR * 2, 28);
buf.writeUInt16LE(2, 32);
buf.writeUInt16LE(16, 34);
buf.write("data", 36);
buf.writeUInt32LE(N * 2, 40);
for (let i = 0; i < N; i++)
  buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, out[i] * g)) * 32767), 44 + i * 2);
writeFileSync(join(OUT, "track.wav"), buf);
console.log("track.wav written, pre-norm peak", peak.toFixed(2));
