// Voice in the hook only (PLAYBOOK §2/§4); the years are silent.
// Every hit in the hook is a frame number in HOOK, taken from the ASR word
// timings (asr.ts) scaled by HOOK_SPEED; the clips are placed off the same
// numbers, so picture and voice cannot drift apart.
import { buildScenes, defineVoiceover, scenesDuration } from "../../reel";
import { DURATIONS } from "./durations";

export const FPS = 30;
export const HOOK_SPEED = 1.15;
const h = (sec: number) => Math.round((sec / HOOK_SPEED) * FPS);

// asr.ts: 01-book «Это@0 Сберкнижка@0.39 твоих@1.05 родителей@1.32 10@1.92 000@2.43 руб.@2.79» (ends 3.48)
//         02-salary «В@0 91-м@0.24 то@0.78 полтора@1.2 года@1.56 зарплат@1.8» (ends 2.51)
//         03-left «Смотри@0 что@0.51 от@0.72 них@0.78 осталось@0.99» (ends 1.81)
const L2 = h(DURATIONS["01-book"]) + 5;
const L3 = L2 + h(DURATIONS["02-salary"]) + 5;

export const HOOK = {
  book: h(0.39), // «сберкнижка» — the book settles
  parents: h(1.05), // «твоих родителей» — headline word
  amount: h(1.92), // «десять тысяч» — the balance punches
  rubles: h(2.79), // «рублей» — loose notes slide out of the pack
  year: L2 + h(0.24), // «в девяносто первом» — the year stamps, the car slides in
  salary: L2 + h(1.2), // «полтора года зарплаты» — the chip
  look: L3, // «смотри» — the question
  left: L3 + h(0.99), // «осталось» — the doubt hits, glitch out
  clips: { salary: L2, left: L3 },
} as const;

// Frames inside the years scene (silent). Index 0 is the 1991 state the
// scene opens on; then one frame per year, the last held to the end.
const f = (sec: number) => Math.round(sec * FPS);
export const YRS = {
  rewind: 0, // hook → glitch, the full grid for half a second
  years: [0, f(0.5), f(4.5), f(8.5), f(12.5), f(16.5)], // 1991 · 1992 · 1993 · 1995 · 1998 · СЕГОДНЯ (index = YEARS)
  clipLife: f(1.8), // how long an evidence clip stays over the object
  ghost: f(18.5), // the six notes shrink into the wall of 126 they should have been
  stamp: f(20.5), // ПОТЕРЯНО 95%
} as const;

export const SCENES = buildScenes({
  hook: 7.5, // the book + 100 notes · 10 000 РУБ. · 1991 · 18 зарплат · что от них осталось?
  years: 24.0, // 1992 → 1993 → 1995 → 1998 → 2026: вернут 30 000 → должно быть 629 000 → потеряно 95%, held to the end
});

export const DURATION = scenesDuration(SCENES);

export const VOICEOVER = defineVoiceover(DURATIONS, [
  { file: "01-book", start: SCENES.hook.from, rate: HOOK_SPEED },
  { file: "02-salary", start: SCENES.hook.from + HOOK.clips.salary / FPS, rate: HOOK_SPEED },
  { file: "03-left", start: SCENES.hook.from + HOOK.clips.left / FPS, rate: HOOK_SPEED },
]);
