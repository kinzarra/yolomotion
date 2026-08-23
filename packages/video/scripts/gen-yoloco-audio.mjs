// Synthesizes the audio bed for `yoloco-audience-fit`: a 30s 120 BPM electronic
// track whose chord changes and impacts land exactly on the scene cuts, plus the
// UI-click / riser / impact one-shots the template triggers. No downloads.
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SR = 44100;
const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "sfx", "yoloco");
mkdirSync(OUT, { recursive: true });

const wav = (samples, gain = 1) => {
  const n = samples.length;
  const buf = Buffer.alloc(44 + n * 2);
  buf.write("RIFF", 0);
  buf.writeUInt32LE(36 + n * 2, 4);
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
  buf.writeUInt32LE(n * 2, 40);
  for (let i = 0; i < n; i++) {
    const s = Math.max(-1, Math.min(1, samples[i] * gain));
    buf.writeInt16LE(Math.round(s * 32767), 44 + i * 2);
  }
  return buf;
};

// Deterministic noise — the track must be byte-identical on every run.
let seed = 12345;
const rnd = () => {
  seed = (seed * 16807) % 2147483647;
  return seed / 2147483647 - 0.5;
};

const SHOTS = {};
const emit = (name, samples, peak) => {
  const g = norm(samples, peak);
  const out = new Float32Array(samples.length);
  for (let i = 0; i < samples.length; i++) out[i] = samples[i] * g;
  SHOTS[name] = out;
  writeFileSync(join(OUT, `${name}.wav`), wav(out));
};

const norm = (buf, peak = 0.9) => {
  let max = 0;
  for (const v of buf) max = Math.max(max, Math.abs(v));
  return max > 0 ? peak / max : 1;
};

/* ------------------------------------------------------------- one-shots */

// click — crisp, short, high: the UI tick under chips/rows.
{
  const N = Math.round(0.045 * SR);
  const out = new Float32Array(N);
  let phase = 0;
  for (let i = 0; i < N; i++) {
    const t = i / N;
    phase += (2 * Math.PI * (2600 - 900 * t)) / SR;
    out[i] = (Math.sin(phase) * 0.75 + rnd() * 0.5) * Math.exp(-t * 16);
  }
  emit("click", out, 0.7);
}

// swipe — tight noise sweep for card/panel entrances.
{
  const N = Math.round(0.26 * SR);
  const out = new Float32Array(N);
  let lp = 0;
  for (let i = 0; i < N; i++) {
    const t = i / N;
    const env = Math.sin(Math.PI * Math.pow(t, 0.6)) ** 2;
    lp += (0.04 + 0.32 * t) * (rnd() * 2 - lp);
    out[i] = lp * env;
  }
  emit("swipe", out, 0.8);
}

// impact — sub boom + short noise body, for the crossout and the verdict.
{
  const N = Math.round(0.9 * SR);
  const out = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    const ts = i / SR;
    const p = i / N;
    const f = 62 - 26 * Math.min(1, ts * 3);
    out[i] =
      Math.sin(2 * Math.PI * f * ts) * Math.exp(-p * 5.5) * 0.95 +
      rnd() * 2 * Math.exp(-p * 26) * 0.35;
  }
  emit("impact", out, 0.92);
}

// riser — 1.5s noise + pitch sweep into a cut.
{
  const N = Math.round(1.5 * SR);
  const out = new Float32Array(N);
  let lp = 0;
  let phase = 0;
  for (let i = 0; i < N; i++) {
    const p = i / N;
    const env = Math.pow(p, 2.2);
    lp += (0.02 + 0.5 * Math.pow(p, 2)) * (rnd() * 2 - lp);
    phase += (2 * Math.PI * (220 + 1500 * Math.pow(p, 2.6))) / SR;
    out[i] = (lp * 0.85 + Math.sin(phase) * 0.16) * env;
  }
  emit("riser", out, 0.62);
}

/* ----------------------------------------------------------------- track */

const DUR = 30;
const N = SR * DUR;
const track = new Float32Array(N);
const add = (start, dur, fn) => {
  const s0 = Math.floor(start * SR);
  const n = Math.floor(dur * SR);
  for (let i = 0; i < n && s0 + i < N; i++) {
    if (s0 + i >= 0) track[s0 + i] += fn(i / SR, i / n);
  }
};

const CUTS = [3.5, 9, 12, 17.5, 22, 26];

// Chords follow the narrative: tension -> problem -> clarity -> lift -> resolve.
const CHORDS = [
  [0, 3.5, [110, 130.81, 164.81]], // Am
  [3.5, 5.5, [87.31, 110, 130.81]], // F
  [9, 3, [146.83, 174.61, 220]], // Dm — the vanity-metric beat
  [12, 5.5, [130.81, 164.81, 196]], // C
  [17.5, 4.5, [98, 123.47, 146.83]], // G
  [22, 4, [87.31, 110, 130.81]], // F
  [26, 4, [130.81, 164.81, 196, 261.63]], // C + octave for the logo
];

const BEAT = 0.5; // 120 BPM
// Sidechain: pads and bass duck on every kick so the bed breathes.
const duck = (t) => {
  const since = ((t - 3.5) % BEAT + BEAT) % BEAT;
  return t < 3.5 || t > 26 ? 1 : 0.55 + 0.45 * Math.min(1, since / 0.22);
};

for (const [start, dur, freqs] of CHORDS) {
  for (const f of freqs) {
    for (const d of [f * 0.9985, f * 1.0015]) {
      add(start, dur + 0.6, (ts, p) => {
        const attack = Math.min(1, ts / 0.35);
        const release = Math.min(1, ((1 - p) * (dur + 0.6)) / 0.7);
        return (
          Math.sin(2 * Math.PI * d * ts) *
          0.026 *
          attack *
          release *
          duck(start + ts)
        );
      });
    }
  }
}

const kick = (t, amp = 0.62) =>
  add(t, 0.32, (ts, p) => {
    const f = 116 - 74 * Math.min(1, ts * 8);
    return Math.sin(2 * Math.PI * f * ts) * Math.exp(-p * 6.2) * amp;
  });
const hat = (t, amp = 0.05) =>
  add(t, 0.045, (ts, p) => rnd() * 2 * Math.exp(-p * 13) * amp);
const bass = (t, f, dur = 0.2, amp = 0.2) =>
  add(t, dur, (ts, p) => {
    const env = Math.min(1, ts * 80) * Math.exp(-p * 3.2);
    return Math.sin(2 * Math.PI * f * ts) * env * amp * duck(t + ts);
  });
const pluck = (t, f, amp = 0.055) =>
  add(t, 0.24, (ts, p) => {
    const env = Math.min(1, ts * 300) * Math.exp(-p * 7);
    return (Math.sin(2 * Math.PI * f * ts) + 0.4 * Math.sin(4 * Math.PI * f * ts)) * env * amp;
  });
const boom = (t, amp = 0.5) => {
  add(t, 1.2, (ts, p) => {
    const f = 58 - 22 * Math.min(1, ts * 2.5);
    return Math.sin(2 * Math.PI * f * ts) * Math.exp(-p * 4.2) * amp;
  });
  add(t, 0.28, (ts, p) => rnd() * 2 * Math.exp(-p * 8) * 0.13);
};
const swell = (t, dur) =>
  add(t, dur, (ts, p) => {
    let lp = 0;
    return rnd() * 2 * Math.pow(p, 2.4) * 0.09 + lp;
  });

// Beat: enters on the first cut, drops out under the logo.
for (let t = 3.5; t < 26; t += BEAT) kick(t, t < 12 ? 0.55 : 0.64);
for (let t = 26; t < 29; t += BEAT * 2) kick(t, 0.5);
for (let t = 5; t < 26; t += BEAT) hat(t + BEAT / 2, t < 12 ? 0.04 : 0.06);
for (let t = 12; t < 26; t += BEAT / 2) hat(t + BEAT / 4, 0.028);

// Bass follows the chord roots, 8ths.
for (const [start, dur, freqs] of CHORDS) {
  if (start < 3.5 || start >= 26) continue;
  const root = freqs[0] / 2;
  for (let t = Math.max(start, 3.5); t < start + dur - 0.01; t += BEAT / 2) {
    bass(t, root, 0.17, 0.19);
  }
}
bass(26, 130.81 / 2, 1.9, 0.2);
bass(28, 130.81 / 2, 1.9, 0.16);

// 16th arp through the "what matters" / "math" build.
const ARP = [
  [12, 17.5, [261.63, 329.63, 392, 329.63]], // C
  [17.5, 22, [196, 246.94, 293.66, 246.94]], // G
  [22, 26, [174.61, 220, 261.63, 220]], // F
];
let step = 0;
for (const [t0, t1, notes] of ARP) {
  for (let t = t0; t < t1 - 0.01; t += BEAT / 4) {
    pluck(t, notes[step % notes.length], t < 17.5 ? 0.04 : 0.055);
    step++;
  }
}

// Impacts land exactly on the scene cuts; risers lead into the two big ones.
for (const c of CUTS) boom(c, c === 17.5 || c === 22 ? 0.58 : 0.46);
swell(16.3, 1.2);
swell(20.8, 1.2);

// Outro fade so the loop point is clean.
for (let i = 0; i < N; i++) {
  const ts = i / SR;
  if (ts > DUR - 1.4) track[i] *= (DUR - ts) / 1.4;
  if (ts < 0.3) track[i] *= ts / 0.3;
}

const g = norm(track, 0.88);
writeFileSync(join(OUT, "track.wav"), wav(track, g));
console.log(`yoloco audio written to ${OUT} (track gain ${g.toFixed(2)})`);

/* --------------------------------------------------------------- sfx bed */
// The template used to mount one <Audio> per hit — 39 of them. Remotion Studio
// has to fetch, decode and keep every audio element in sync, which stalled the
// preview player and buried the timeline. Stamping the hits into one 30s bed
// here keeps the cues exact and leaves the composition with 9 audio elements.
// Times are absolute seconds, ~3 frames before the visual they punctuate.
const CUES = [
  ["click", 0.05], ["click", 0.22], ["click", 0.42], ["swipe", 1.33], ["impact", 1.6],
  ["swipe", 3.42], ["click", 4.22], ["swipe", 5.02], ["click", 5.98], ["click", 6.22],
  ["click", 6.46], ["impact", 7.02],
  ["swipe", 8.94], ["impact", 9.64],
  ["swipe", 11.94], ["click", 13.05], ["click", 14.32], ["click", 15.52],
  ["swipe", 17.42], ["click", 17.98], ["click", 18.32], ["click", 18.92],
  ["click", 19.52], ["impact", 20.12], ["impact", 20.52],
  ["swipe", 21.92], ["click", 22.22], ["click", 22.32], ["click", 22.42],
  ["click", 22.52], ["click", 22.72], ["click", 22.89], ["click", 23.06],
  ["click", 23.37], ["impact", 23.82],
  ["impact", 25.92], ["click", 26.32], ["swipe", 27.42], ["click", 27.92],
];

// Gains validated against the -16 LUFS voiceover: the full mix peaks at -1.6 dBFS.
const CUE_GAIN = { click: 0.36, swipe: 0.43, impact: 0.46, riser: 0.4 };

const bed = new Float32Array(N);
for (const [name, t] of CUES) {
  const shot = SHOTS[name];
  const g = CUE_GAIN[name];
  const s0 = Math.round(t * SR);
  for (let i = 0; i < shot.length && s0 + i < N; i++) bed[s0 + i] += shot[i] * g;
}
let bedPeak = 0;
for (const v of bed) bedPeak = Math.max(bedPeak, Math.abs(v));
writeFileSync(join(OUT, "sfx-bed.wav"), wav(bed));
console.log(`sfx-bed.wav written: ${CUES.length} cues, peak ${bedPeak.toFixed(3)}`);
