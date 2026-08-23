import { scenesDuration } from "../../reel";

// One source of truth for the 30s timeline. The video carries the voiceover and
// nothing else — no music bed, no SFX — so every cut is paced off a spoken line.
export const VO_RATE = 1.05;

export const SCENES = {
  hook: { from: 0, len: 3.9 },
  app: { from: 3.9, len: 3.6 },
  devtools: { from: 7.5, len: 5.9 },
  exposed: { from: 13.4, len: 4.7 },
  arch: { from: 18.1, len: 6.5 },
  end: { from: 24.6, len: 5.4 },
} as const;

// [file, start] — starts chosen so each line lands just after its scene cut.
// Spoken lengths at VO_RATE, measured from the rendered mp3s:
//   01 3.54 · 02 3.36 · 03 5.53 · 04 4.42 · 05 2.34 · 06 1.72 · 07 1.28 · 08 3.36
// Every line lands inside its own scene with no overlap into the next; the
// arch scene carries three short lines (ask / uses / never) back to back.
export const VOICEOVER = [
  { file: "01-hook", start: 0.2 },
  { file: "02-download", start: 3.95 },
  { file: "03-devtools", start: 7.55 },
  { file: "04-server", start: 13.45 },
  { file: "05-ask", start: 18.2 },
  { file: "06-uses", start: 20.7 },
  { file: "07-never", start: 22.6 },
  { file: "08-remember", start: 24.75 },
];

// Composition length follows the scene grid — never a hardcoded number.
export const DURATION = scenesDuration(SCENES);
