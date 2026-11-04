// Cover (voice: what the reel is about) + the circle (voice) + five explained
// map beats + the cover again. Every beat's length is its voice line at
// VO_RATE plus a tail, never shorter than its visuals need; the hits inside
// the circle are frames keyed to the words of its clip (macOS ASR, raw
// seconds), the beats key their arrows to their words in map.ts.
import { buildScenes, defineVoiceover, scenesDuration } from "../../reel";
import { DURATIONS } from "./durations";

export const FPS = 30;

// All clips play faster than recorded (unelected-five precedent, 1.2 there).
export const VO_RATE = 1.3;
// the voice starts this long after its scene cut: the picture lands first
export const LEAD = 0.1;
const f = (rawSeconds: number) => Math.round((rawSeconds * FPS) / VO_RATE) + Math.round(LEAD * FPS);

// 02-circle (10.22 s raw): «Энвидиа@0.12 вложила@0.84 в Оупен Эй Ай@1.41 30@2.64
// миллиардов@3.12 Оупен@3.87 Эй Ай@4.38 платит@4.89 Oracle 300@5.31 Oracle@6.51
// покупает@6.99 чипы@7.53 у Энвидиа@8.01 круг@8.67 замкнулся@9.12» (ends 10.02 s)
export const CIRCLE = {
  a1: f(0.9), // «вложила»: NVIDIA → OPENAI starts drawing
  n1: f(2.64), // «30»: $30 МЛРД lands
  a2: f(4.89), // «платит»: OPENAI → ORACLE starts drawing
  n2: f(5.85), // «300»: $300 МЛРД lands
  a3: f(6.99), // «покупает»: ORACLE → NVIDIA starts drawing
  n3: f(7.53), // «чипы»: $40 МЛРД lands
  ring: f(8.67), // «круг»: the triangle pulses
  stamp: f(9.12), // «замкнулся»: КРУГ ЗАМКНУЛСЯ + the ouroboros
} as const;

// a beat lasts its line plus a tail, but never less than its visuals need
const fit = (clip: keyof typeof DURATIONS, tail: number, minVisual: number) =>
  Math.max(minVisual, Math.ceil(((DURATIONS[clip] ?? 0) / VO_RATE + LEAD + tail) * 10) / 10);

export const SCENES = buildScenes({
  cover: fit("01-cover", 0.2, 3.0), // the whole map, «сейчас покажу, кто кому должен»
  circle: fit("02-circle", 0.6, 7.5), // the triangle draws on the words, КРУГ ЗАМКНУЛСЯ
  openaiIn: fit("03-openai-in", 0.4, 4.8), // who gave OpenAI money (stamp at 138)
  openaiOut: fit("04-openai-out", 0.4, 3.9), // whom it promised to pay (stamp at 104)
  anthropic: fit("05-anthropic", 0.4, 4.0), // the same owners (stamp at 108)
  nvidia: fit("06-nvidia", 0.4, 3.3), // sells to those it funded (stamp at 84)
  weak: fit("07-weak", 0.5, 2.6), // where it is thin (stamp at 60)
  final: fit("08-final", 0.5, 1.5), // the cover again, loop
});

export const DURATION = scenesDuration(SCENES);

export const VOICEOVER = defineVoiceover(DURATIONS, [
  { file: "01-cover", start: SCENES.cover.from + LEAD },
  { file: "02-circle", start: SCENES.circle.from + LEAD },
  { file: "03-openai-in", start: SCENES.openaiIn.from + LEAD },
  { file: "04-openai-out", start: SCENES.openaiOut.from + LEAD },
  { file: "05-anthropic", start: SCENES.anthropic.from + LEAD },
  { file: "06-nvidia", start: SCENES.nvidia.from + LEAD },
  { file: "07-weak", start: SCENES.weak.from + LEAD },
  { file: "08-final", start: SCENES.final.from + LEAD },
]);
