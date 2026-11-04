// Hook only for now (author: «давай с хука начнём», 3–4 s).
// Every hit in the hook is a frame number in HOOK, taken from the ASR word
// timings (asr.ts) scaled by HOOK_SPEED; the clips are placed off the same
// numbers, so picture and voice cannot drift apart.
import { buildScenes, defineVoiceover, scenesDuration } from "../../reel";
import { DURATIONS } from "./durations";

export const FPS = 30;
export const HOOK_SPEED = 1.25;
const h = (sec: number) => Math.round((sec / HOOK_SPEED) * FPS);

// asr.ts: 01-then «Ты@0 получал@0.15 30@0.6 000@1.08 в@1.44 2013@1.56 (13-м@2.22)»
//         02-now «Сейчас@0 получаешь@0.39 100@0.93» (speech ends 1.27)
//         03-richer «Ты@0 правда@0.15 стал@0.42 богаче@0.69» (speech ends 1.22)
const NOW_AT = h(DURATIONS["01-then"]) + 1;
const RICH_AT = NOW_AT + h(1.27) + 1;

export const HOOK = {
  thirty: h(0.6), // «тридцать тысяч» — the amount punches
  year: h(1.56), // «в 2013-м» — the year stamps
  now: NOW_AT, // «сейчас» — the slip reprints, the fan grows
  sto: NOW_AT + h(0.93), // «сто» — the counter lands
  rich: RICH_AT, // «ты правда стал богаче?»
  meme: RICH_AT + h(0.42), // «стал богаче» — the author's meme lands
  richer: RICH_AT + h(0.69), // «богаче» — the doubt hits
  clips: { now: NOW_AT, rich: RICH_AT },
} as const;

// Frames inside the years scene (silent from here on): four years, one
// frame each, the last one held to the end.
const f = (sec: number) => Math.round(sec * FPS);
export const YRS = {
  rewind: 0, // hook → glitch back to 2013
  // 4.8 s a year (2026-10-17: the reel goes to 25–30 s per PLAYBOOK §2 —
  // the 21 s cut had nothing to hold or share; the winner ran 29 s)
  years: [0, f(0.5), f(5.3), f(10.1), f(14.9)], // 2013 · 2014 · 2018 · 2022 · 2025 (index = YEARS)
  stamp: f(15.9), // РЕАЛЬНО +47%
  dicaprio: f(16.5), // DiCaprio beside the 2025 leader
} as const;

export const SCENES = buildScenes({
  hook: 5.2, // one pack · 30 000 ₽ → packs multiply, 100 360 ₽ → ТЫ ПРАВДА СТАЛ БОГАЧЕ? + meme
  years: 21.0, // 2013 → 2014 → 2018 → 2022 → 2025, one frame per year; 2025 + stamp held ~6 s
});

export const DURATION = scenesDuration(SCENES);

export const VOICEOVER = defineVoiceover(DURATIONS, [
  { file: "01-then", start: SCENES.hook.from, rate: HOOK_SPEED },
  { file: "02-now", start: SCENES.hook.from + HOOK.clips.now / FPS, rate: HOOK_SPEED },
  { file: "03-richer", start: SCENES.hook.from + HOOK.clips.rich / FPS, rate: HOOK_SPEED },
]);
