// Cuts a subject out of a plain studio sweep and gives it a die-cut paper
// border, for use as a collage element. Produced public/images/mrbeast-cutout.png.
//
// There is no matting library in this project, and none is worth adding for
// this: a studio sweep is a smooth gradient, so the backdrop can be *grown*
// instead of keyed. A flood fill seeded at the frame edges steps only between
// near-identical luminances, which walks the entire gradient — something a
// single colorkey cannot do — and stops where luminance or saturation jumps.
// LUM_MIN is what keeps it out of black clothing, the one place a pure
// gradient walk leaks.
//
// Usage — ffmpeg does the decoding, this does the matte:
//   ffmpeg -i public/images/mrbeast-studio.jpg \
//     -vf "crop=900:870:0:0,scale=1200:1160" -f rawvideo -pix_fmt rgb24 /tmp/mb.raw -y
//   W=1200 H=1160 LUM_STEP=5 LUM_MIN=70 SAT_MAX=30 EDGE=14 node scripts/cutout.mjs
//   ffmpeg -f rawvideo -pix_fmt rgba -s <trimmed> -i /tmp/mb-cut.rgba \
//     public/images/mrbeast-cutout.png -y
//
// The crop is deliberate: below the hips the sweep darkens to the luminance of
// his trousers and no threshold separates them, so the cut-out is a torso —
// which reads better as a collage element anyway.

import { readFileSync, writeFileSync } from "node:fs";

const [W, H] = [Number(process.env.W), Number(process.env.H)];
const LUM_STEP = Number(process.env.LUM_STEP ?? 5);
const LUM_MIN = Number(process.env.LUM_MIN ?? 70);  // below this it is him, not the sweep
const SAT_MAX = Number(process.env.SAT_MAX ?? 30);  // the sweep is neutral; skin is not
const EDGE = Number(process.env.EDGE ?? 14);        // die-cut paper border, px
// Rows to drop off the bottom. The source crop cuts through his hands, so the
// matte frays there; a straight cut reads as scissors, a frayed one as a bug.
const BOTTOM_TRIM = Number(process.env.BOTTOM_TRIM ?? 0);

const rgb = readFileSync("/tmp/mb.raw");
const N = W * H;
const lum = new Uint8Array(N), sat = new Uint8Array(N);
for (let i = 0; i < N; i++) {
  const r = rgb[i * 3], g = rgb[i * 3 + 1], b = rgb[i * 3 + 2];
  lum[i] = (0.299 * r + 0.587 * g + 0.114 * b) | 0;
  sat[i] = Math.max(r, g, b) - Math.min(r, g, b);
}
const isSweep = (i) => lum[i] >= LUM_MIN && sat[i] <= SAT_MAX;

const bg = new Uint8Array(N);
const stack = new Int32Array(N);
let sp = 0;
const seed = (i) => { if (!bg[i] && isSweep(i)) { bg[i] = 1; stack[sp++] = i; } };
for (let x = 0; x < W; x++) { seed(x); seed((H - 1) * W + x); }
for (let y = 0; y < H; y++) { seed(y * W); seed(y * W + W - 1); }
while (sp > 0) {
  const i = stack[--sp], x = i % W, y = (i / W) | 0, l = lum[i];
  const step = (j) => {
    if (bg[j] || !isSweep(j) || Math.abs(lum[j] - l) > LUM_STEP) return;
    bg[j] = 1; stack[sp++] = j;
  };
  if (x > 0) step(i - 1);
  if (x < W - 1) step(i + 1);
  if (y > 0) step(i - W);
  if (y < H - 1) step(i + W);
}

let a = new Uint8Array(N);
for (let i = 0; i < N; i++) a[i] = bg[i] ? 0 : 255;

const morph = (src, r, mode) => {
  // separable min/max — a full square window per pixel is too slow at this size
  const tmp = new Uint8Array(N), out = new Uint8Array(N);
  const pick = mode === "max" ? Math.max : Math.min;
  const init = mode === "max" ? 0 : 255;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    let v = init;
    for (let d = -r; d <= r; d++) { const xx = x + d; if (xx >= 0 && xx < W) v = pick(v, src[y * W + xx]); }
    tmp[y * W + x] = v;
  }
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    let v = init;
    for (let d = -r; d <= r; d++) { const yy = y + d; if (yy >= 0 && yy < H) v = pick(v, tmp[yy * W + x]); }
    out[y * W + x] = v;
  }
  return out;
};
a = morph(morph(a, 3, "max"), 3, "min"); // close pinholes inside him
a = morph(morph(a, 2, "min"), 2, "max"); // drop specks outside him

// Keep only the largest blob: the sweep has bright patches the fill cannot
// reach, and they would otherwise ship as stray confetti.
{
  const label = new Int32Array(N).fill(-1);
  const q = new Int32Array(N);
  let best = -1, bestSize = 0;
  for (let s0 = 0; s0 < N; s0++) {
    if (a[s0] === 0 || label[s0] !== -1) continue;
    let head = 0, tail = 0, size = 0;
    q[tail++] = s0; label[s0] = s0;
    while (head < tail) {
      const i = q[head++]; size++;
      const x = i % W, y = (i / W) | 0;
      const visit = (j) => { if (a[j] && label[j] === -1) { label[j] = s0; q[tail++] = j; } };
      if (x > 0) visit(i - 1);
      if (x < W - 1) visit(i + 1);
      if (y > 0) visit(i - W);
      if (y < H - 1) visit(i + W);
    }
    if (size > bestSize) { bestSize = size; best = s0; }
  }
  for (let i = 0; i < N; i++) if (a[i] && label[i] !== best) a[i] = 0;
}

const solid = a;
const ring = morph(solid, EDGE, "max");

const blur = (src) => {
  const out = new Uint8Array(N);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    let s = 0, n = 0;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      const yy = y + dy, xx = x + dx;
      if (yy < 0 || yy >= H || xx < 0 || xx >= W) continue;
      s += src[yy * W + xx]; n++;
    }
    out[y * W + x] = (s / n) | 0;
  }
  return out;
};
const sS = blur(solid), rS = blur(ring);

const out = Buffer.alloc(N * 4);
let cov = 0;
for (let i = 0; i < N; i++) {
  const s = sS[i] / 255, r = rS[i] / 255;
  if (s > 0.5) cov++;
  const px = (c) => Math.round(255 * (1 - s) * r + c * s);
  out[i * 4] = px(rgb[i * 3]);
  out[i * 4 + 1] = px(rgb[i * 3 + 1]);
  out[i * 4 + 2] = px(rgb[i * 3 + 2]);
  out[i * 4 + 3] = Math.round(Math.max(s, r) * 255);
}
let x0 = W, y0 = H, x1 = 0, y1 = 0;
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (rS[y * W + x] > 8) {
  if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
}
// even dimensions keep every downstream encoder happy
const tw = (x1 - x0 + 1 + 1) & ~1;
const th = ((y1 - y0 + 1 - BOTTOM_TRIM) + 1) & ~1;
const trimmed = Buffer.alloc(tw * th * 4);
for (let y = 0; y < th; y++) {
  const sy = y0 + y;
  if (sy >= H) continue;
  for (let x = 0; x < tw; x++) {
    const sx = x0 + x;
    if (sx >= W) continue;
    out.copy(trimmed, (y * tw + x) * 4, (sy * W + sx) * 4, (sy * W + sx) * 4 + 4);
  }
}
writeFileSync("/tmp/mb-cut.rgba", trimmed);
console.log(JSON.stringify({ subjectPct: +(100 * cov / N).toFixed(1), trimmed: { w: tw, h: th } }));
