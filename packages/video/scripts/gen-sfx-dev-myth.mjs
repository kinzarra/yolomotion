// SFX kit for dev-myth (long format, sound allowed): synthesised 16-bit WAVs,
// no downloads, no licences. Deterministic (seeded noise), so a re-run gives
// the same files.
//
//   node scripts/gen-sfx-dev-myth.mjs  →  public/sfx/dev-myth/*.wav
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SR = 44100;
const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "sfx", "dev-myth");
mkdirSync(OUT, { recursive: true });

let seed = 7;
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const noise = () => rnd() * 2 - 1;
const secs = (s) => Math.round(s * SR);

const wav = (name, x) => {
  let peak = 0;
  for (const v of x) peak = Math.max(peak, Math.abs(v));
  const g = peak > 0 ? 0.89 / peak : 1; // every file peaks at -1 dBFS; the mix sets levels
  const buf = Buffer.alloc(44 + x.length * 2);
  buf.write("RIFF", 0); buf.writeUInt32LE(36 + x.length * 2, 4); buf.write("WAVE", 8);
  buf.write("fmt ", 12); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(1, 22);
  buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 2, 28); buf.writeUInt16LE(2, 32); buf.writeUInt16LE(16, 34);
  buf.write("data", 36); buf.writeUInt32LE(x.length * 2, 40);
  x.forEach((v, i) => buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, v * g)) * 32767), 44 + i * 2));
  writeFileSync(join(OUT, name), buf);
};

// two-pole resonant bandpass, per-sample
const bandpass = (f, q) => {
  const w = (2 * Math.PI * f) / SR, a = Math.sin(w) / (2 * q), c = Math.cos(w);
  const b0 = a, b2 = -a, a0 = 1 + a, a1 = -2 * c, a2 = 1 - a;
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
  return (x) => { const y = (b0 * x + b2 * x2 - a1 * y1 - a2 * y2) / a0; x2 = x1; x1 = x; y2 = y1; y1 = y; return y; };
};
const add = (dst, src, at, gain = 1) => { const o = secs(at); for (let i = 0; i < src.length && o + i < dst.length; i++) dst[o + i] += src[i] * gain; };

// one mechanical key: a bright click (bandpassed noise, 3 ms) + a low «thock» (sine, 25 ms)
const key = (tone = 1) => {
  const n = secs(0.07), x = new Float32Array(n);
  const bp = bandpass(3200 * tone, 1.6), bp2 = bandpass(1200 * tone, 2);
  let ph = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const click = (bp(noise()) * 1.4 + bp2(noise()) * 0.6) * Math.exp(-t / 0.0045);
    ph += (2 * Math.PI * (190 * tone - 600 * t)) / SR;
    const thock = Math.sin(ph) * Math.exp(-t / 0.018) * 0.55;
    x[i] = click + thock;
  }
  return x;
};
for (let k = 0; k < 4; k++) wav(`key${k + 1}.wav`, key(0.9 + k * 0.07));

// typing bursts: human rhythm, 9–14 keys/s, a space bar every few words
const typing = (dur, rate) => {
  const x = new Float32Array(secs(dur));
  let t = 0.02;
  while (t < dur - 0.08) {
    const space = rnd() < 0.14;
    add(x, key(space ? 0.75 : 0.88 + rnd() * 0.25), t, space ? 1.1 : 0.6 + rnd() * 0.45);
    t += (1 / rate) * (0.55 + rnd() * 0.9) + (rnd() < 0.08 ? 0.18 : 0);
  }
  return x;
};
wav("typing-short.wav", typing(1.6, 12));
wav("typing-long.wav", typing(4.5, 11));

// coin: inharmonic partials of a struck disc, slight beating, a tick on the strike
const coin = (pitch = 1, len = 1.1) => {
  const n = secs(len), x = new Float32Array(n);
  const parts = [[2093, 1, 0.55], [2121, 0.6, 0.5], [5302, 0.55, 0.32], [7924, 0.35, 0.22], [10560, 0.22, 0.14]];
  for (const [f, a, d] of parts) {
    let ph = rnd() * 6.28;
    for (let i = 0; i < n; i++) { ph += (2 * Math.PI * f * pitch) / SR; x[i] += Math.sin(ph) * a * Math.exp(-(i / SR) / d); }
  }
  const bp = bandpass(6000, 1);
  for (let i = 0; i < secs(0.006); i++) x[i] += bp(noise()) * 2.2 * (1 - i / secs(0.006));
  return x;
};
wav("coin.wav", coin(1));
{ // a handful of coins landing
  const x = new Float32Array(secs(1.6));
  [0, 0.07, 0.12, 0.2, 0.26, 0.31, 0.39, 0.5, 0.62].forEach((t, i) => add(x, coin(0.92 + rnd() * 0.2, 0.9), t, 0.7 - i * 0.05));
  wav("coins.wav", x);
}

// whoosh: noise through a sweeping bandpass, swell and fade
const whoosh = (len, f0, f1) => {
  const n = secs(len), x = new Float32Array(n);
  let bp = bandpass(f0, 0.8);
  for (let i = 0; i < n; i++) {
    const t = i / n;
    if (i % 64 === 0) bp = ((prev) => { const b = bandpass(f0 + (f1 - f0) * t, 0.8); return b; })(bp);
    x[i] = bp(noise()) * Math.sin(Math.PI * Math.pow(t, 0.6)) ** 2;
  }
  return x;
};
wav("whoosh.wav", whoosh(0.42, 400, 3200));
wav("whoosh-low.wav", whoosh(0.6, 200, 1200));

// impact: sub drop + a noise crack, for stamps and slams
const impact = (sub = 70, crack = 1) => {
  const n = secs(0.7), x = new Float32Array(n);
  let ph = 0;
  const bp = bandpass(2400, 0.7);
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    ph += (2 * Math.PI * (sub + 90 * Math.exp(-t / 0.03))) / SR;
    x[i] = Math.sin(ph) * Math.exp(-t / 0.16) * 1.0 + bp(noise()) * Math.exp(-t / 0.025) * 0.9 * crack;
  }
  return x;
};
wav("impact.wav", impact(62, 1));
wav("stamp.wav", impact(90, 1.4));
wav("thud.wav", impact(48, 0.3));

// glitch: bit-crushed, sample-held noise and a buzz, 0.3 s
{
  const n = secs(0.32), x = new Float32Array(n);
  let hold = 0, ph = 0;
  for (let i = 0; i < n; i++) {
    if (i % (40 + Math.floor(rnd() * 400)) === 0) hold = noise();
    ph += (2 * Math.PI * 110) / SR;
    const gate = Math.floor(i / secs(0.03)) % 3 === 1 ? 0.2 : 1;
    x[i] = (Math.round(hold * 6) / 6 + Math.sign(Math.sin(ph)) * 0.25) * gate * (1 - i / n);
  }
  wav("glitch.wav", x);
}

// receipt printer: thermal head stutter, ~16 lines/s
{
  const n = secs(0.9), x = new Float32Array(n);
  const bp = bandpass(4200, 3);
  let ph = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    ph += (2 * Math.PI * 820) / SR;
    const line = (t * 16) % 1;
    const env = line < 0.55 ? 1 : 0.15;
    x[i] = (bp(noise()) * 0.8 + Math.sign(Math.sin(ph)) * 0.08) * env * Math.min(1, t / 0.03) * Math.min(1, (0.9 - t) / 0.06);
  }
  wav("printer.wav", x);
}

// stopwatch tick and a mouse click
{
  const x = new Float32Array(secs(0.04));
  const bp = bandpass(5200, 4);
  for (let i = 0; i < x.length; i++) x[i] = bp(noise()) * Math.exp(-(i / SR) / 0.004);
  wav("tick.wav", x);
  const c = new Float32Array(secs(0.05));
  const bp2 = bandpass(2600, 2);
  for (let i = 0; i < c.length; i++) c[i] = bp2(noise()) * Math.exp(-(i / SR) / 0.006) + (i === secs(0.018) ? 0 : 0);
  add(c, x, 0.018, 0.6);
  wav("click.wav", c);
}

// shimmer: a cluster of high bell partials rising, for the miracle and the brain
{
  const n = secs(1.6), x = new Float32Array(n);
  [1568, 2093, 2637, 3136, 3951, 4699].forEach((f, k) => {
    let ph = 0;
    const at = k * 0.06;
    for (let i = secs(at); i < n; i++) {
      const t = i / SR - at;
      ph += (2 * Math.PI * f * (1 + 0.004 * Math.sin(t * 30))) / SR;
      x[i] += Math.sin(ph) * Math.exp(-t / 0.5) * Math.min(1, t / 0.01) * 0.4;
    }
  });
  wav("shimmer.wav", x);
}

// riser: rising noise + tone into a cut (the part cards)
{
  const n = secs(1.2), x = new Float32Array(n);
  let ph = 0;
  for (let i = 0; i < n; i++) {
    const t = i / n;
    ph += (2 * Math.PI * (120 + 900 * t * t)) / SR;
    x[i] = (noise() * 0.5 + Math.sin(ph) * 0.5) * t * t;
  }
  wav("riser.wav", x);
}

// magic (note 25: the old shimmer sounded dull): a plucked-harp glissando up a
// major-pentatonic over two octaves, each pluck a Karplus-Strong string, with
// a soft multi-tap echo so it blooms instead of clicking
{
  const n = secs(2.4), x = new Float32Array(n);
  const notes = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21, 24, 26, 28];
  notes.forEach((st, k) => {
    const f = 523.25 * Math.pow(2, st / 12);
    const p = Math.round(SR / f);
    const buf = Float32Array.from({ length: p }, () => noise() * 0.5);
    const at = secs(k * 0.045);
    let idx = 0;
    for (let i = at; i < n; i++) {
      const a = buf[idx], b = buf[(idx + 1) % p];
      const v = 0.4985 * (a + b);
      buf[idx] = v;
      idx = (idx + 1) % p;
      x[i] += v * (0.9 - k * 0.03);
    }
  });
  const y = new Float32Array(n);
  for (let i = 0; i < n; i++) y[i] = x[i] + 0.35 * (x[i - secs(0.11)] ?? 0) + 0.2 * (x[i - secs(0.23)] ?? 0) + 0.1 * (x[i - secs(0.37)] ?? 0);
  for (let i = 0; i < n; i++) y[i] *= Math.min(1, (n - i) / secs(0.6));
  wav("magic.wav", y);
}

console.log("SFX written to", OUT);
