// Hook only for now (author: «начнём с такого же ХУКА», 2026-10-17).
// Every hit is a frame number in HOOK, taken from the ASR word timings
// (asr.ts, en-US) scaled by HOOK_SPEED; the clips are placed off the same
// numbers, so picture and voice cannot drift apart.
import { buildScenes, defineVoiceover, scenesDuration } from "../../reel";
import { DURATIONS } from "./durations";

export const FPS = 30;
export const HOOK_SPEED = 1.1;
const h = (sec: number) => Math.round((sec / HOOK_SPEED) * FPS);

// asr.ts: 01-then  «You@0 made@0.24 seven@0.39 twenty-five@0.78 an hour@1.35 in@1.77 two thousand nine@1.89»
//         02-still «You@0 still@0.15 make@0.42 seven@0.6 twenty-five@0.96» (speech ends ~1.7)
//         03-worth «So@0.12 what's@0.24 it@0.54 really@0.63 worth@0.99» (speech ends ~1.45)
const STILL_AT = h(DURATIONS["01-then"]) + 2;
const WORTH_AT = STILL_AT + h(1.75) + 1;

export const HOOK = {
  seven: h(0.39), // «seven twenty-five» — the amount punches
  year: h(1.89), // «two thousand nine» — the year stamps
  still: STILL_AT, // «you still make» — the year rolls 2009 → 2026
  stillAmount: STILL_AT + h(0.6), // «seven twenty-five» — the stub reprints, same amount
  worth: WORTH_AT, // «so what's it really worth?»
  worthHit: WORTH_AT + h(0.99), // «worth» — the cash shudders, the amount turns into $?.??
  clips: { still: STILL_AT, worth: WORTH_AT },
} as const;

// Frames inside the years scene (silent from here on). A quiet year is a
// half-second tick; an event year (a $1 note lost, a price shock) holds 2 s.
const f = (sec: number) => Math.round(sec * FPS);
const HOLDS = [0.6, 0.5, 2.0, 0.45, 0.45, 0.45, 0.45, 0.45, 0.45, 0.45, 0.45, 0.5, 2.0, 2.0, 0.6, 2.0, 0.6];
// 2009 … 2025 above; 2026 is the last year and holds to the end
const starts = HOLDS.reduce<number[]>((acc, s) => [...acc, acc[acc.length - 1] + s], [0]);
export const YRS = {
  years: starts.map(f), // index = YEARS
  stamp: f(starts[starts.length - 1] + 0.7), // −36% slams onto the answer
} as const;

export const SCENES = buildScenes({
  hook: 6.6, // seven $1 bills + a quarter · $7.25 2009 → 2026 still $7.25 → WHAT'S IT REALLY WORTH?
  years: 16.9, // 2009 → 2026, cash re-paid in 2009 dollars every year; $4.63 · −36% held 1.8 s (author: no frozen tail)
});

export const DURATION = scenesDuration(SCENES);

export const VOICEOVER = defineVoiceover(DURATIONS, [
  { file: "01-then", start: SCENES.hook.from, rate: HOOK_SPEED },
  { file: "02-still", start: SCENES.hook.from + HOOK.clips.still / FPS, rate: HOOK_SPEED },
  { file: "03-worth", start: SCENES.hook.from + HOOK.clips.worth / FPS, rate: HOOK_SPEED },
]);
