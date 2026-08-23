import { scenesDuration } from "../../reel";

// One source of truth for the 30s timeline. The video carries the voiceover and
// nothing else — no music bed, no SFX — so the cuts are paced off the spoken
// lines. Scene starts still sit on a 0.5s grid, which keeps the rhythm even.
export const VO_RATE = 1.07;

export const SCENES = {
  hook: { from: 0, len: 3.5 },
  creator: { from: 3.5, len: 5.5 },
  vanity: { from: 9, len: 3 },
  pillars: { from: 12, len: 5.5 },
  versus: { from: 17.5, len: 4.5 },
  dashboard: { from: 22, len: 4 },
  logo: { from: 26, len: 4 },
} as const;

// [file, start, spoken length at VO_RATE] — measured from the rendered mp3s.
export const VOICEOVER = [
  { file: "01-hook", start: 0.2, raw: 2.78 },
  { file: "02-creator", start: 3.8, raw: 4.6 },
  { file: "03-vanity", start: 9.25, raw: 2.43 },
  { file: "04-matters", start: 12.25, raw: 4.81 },
  { file: "05-versus", start: 17.7, raw: 3.99 },
  { file: "06-cta", start: 22.3, raw: 2.95 },
  { file: "07-brand", start: 26.35, raw: 2.99 },
];

// Composition length follows the scene grid — never a hardcoded number.
export const DURATION = scenesDuration(SCENES);
