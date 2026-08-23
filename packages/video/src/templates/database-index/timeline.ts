import { scenesDuration } from "../../reel";

// One source of truth for the 30s timeline. The video carries the voiceover and
// nothing else — no music bed, no SFX — so every cut is paced off a spoken line.
export const VO_RATE = 1.05;

export const SCENES = {
  fast: { from: 0, len: 3 },
  slow: { from: 3, len: 4 },
  query: { from: 7, len: 3.7 },
  scan: { from: 10.7, len: 3.6 },
  book: { from: 14.3, len: 3.9 },
  index: { from: 18.2, len: 3.8 },
  found: { from: 22, len: 3.6 },
  cta: { from: 25.6, len: 4.4 },
} as const;

// [file, start] — starts chosen so each line lands just after its scene cut.
// Spoken lengths at VO_RATE, measured from the rendered mp3s:
//   01 2.39 · 02 3.41 · 03 3.19 · 04 3.05 · 05 2.96 · 06 3.49 · 07 2.43 · 08 1.50
// Every line lands inside its own scene with no overlap into the next.
export const VOICEOVER = [
  { file: "01-fast", start: 0.25 },
  { file: "02-dies", start: 3.15 },
  { file: "03-imagine", start: 7.1 },
  { file: "04-scan", start: 10.8 },
  { file: "05-contents", start: 14.45 },
  { file: "06-knows", start: 18.35 },
  { file: "07-less", start: 22.15 },
  { file: "08-matters", start: 26.1 },
];

// Composition length follows the scene grid — never a hardcoded number.
export const DURATION = scenesDuration(SCENES);
