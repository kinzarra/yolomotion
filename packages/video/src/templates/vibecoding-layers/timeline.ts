// The scenario as data. Voice only; every cut is paced off the measured clips.
// Scene starts derive from the lengths below; clip lengths come from durations.ts.
import { buildScenes, defineVoiceover, scenesDuration, VoLine } from "../../reel";
import { DURATIONS } from "./durations";

export const VO_RATE = 1.1;
/** A line starts this much after its scene: the visual lands first. */
export const LEAD = 0.15;

// each length = clip / VO_RATE + lead, rounded up to the 0.5 s grid
export const SCENES = buildScenes({
  hook: 6.0, // candle + tombstone, then the face, «70 ЛЕТ» and the era rail
  punch: 8.5, // 1950-е: the card, holes = да/нет, one wrong hole
  asm: 8.5, // команды: ADD / MOV / CMP, Apollo, Hamilton
  clang: 9.0, // 1972: C, the missing «;»
  frameworks: 8.0, // 2000-е: ready bricks
  vibe: 9.0, // 2025: one sentence, the app prints itself
  turn: 7.5, // the ladder: числа → синтаксис → фреймворки → идея
  cta: 3.0, // candle, mourners and language logos round the grave, like + subscribe (loop)
});

export const DURATION = scenesDuration(SCENES);

export type { VoLine };

/** Seconds into the hook when «Смотри, как оно жило 70 лет» starts. */
export const PROMISE_AT = DURATIONS["01-hook"] / VO_RATE + 0.14;

export const VOICEOVER = defineVoiceover(DURATIONS, [
  { file: "01-hook", start: 0 },
  { file: "02-promise", start: PROMISE_AT },
  { file: "03-punch", start: SCENES.punch.from + LEAD },
  { file: "04-asm", start: SCENES.asm.from + LEAD },
  { file: "05-clang", start: SCENES.clang.from + LEAD },
  { file: "06-frameworks", start: SCENES.frameworks.from + LEAD },
  { file: "07-vibe", start: SCENES.vibe.from + LEAD },
  { file: "08-turn", start: SCENES.turn.from + LEAD },
  { file: "09-cta", start: SCENES.cta.from + LEAD },
]);

/** Word starts inside each clip (Whisper word timestamps), in clip seconds at 1.0×. */
export const CUES = {
  hook: { bury: 0.64, craft: 1.02, prog: 2.24 },
  promise: { seventy: 1.3 },
  punch: { cards: 1.98, computer: 2.7, yesno: 3.98, hole: 4.7, nohole: 5.76, oops: 6.52, again: 7.78 },
  asm: { instead: 1.44, cmds: 2.52, add: 4.0, mov: 4.62, cmp: 5.3, moon: 5.96, luna: 8.12 },
  clang: { then: 0.22, lang: 1.06, english: 2.12, machine: 3.62, digits: 5.2, forgot: 5.98, semi: 6.54, nothing: 8.06 },
  frameworks: { fw: 1.12, button: 2.42, pay: 3.0, login: 3.56, wrote: 4.82, build: 5.54, lego: 7.62 },
  vibe: { word: 1.46, just: 2.52, make: 3.62, ai: 6.52, writes: 7.18, self: 8.44 },
  turn: { numbers: 1.52, syntax: 2.78, fw: 3.76, now: 4.76, what: 5.82 },
} as const;
