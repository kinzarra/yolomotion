// Hook + five places + the final stamp.
// Every hit in the hook is a frame number in HOOK; the voice clips are placed
// off the same numbers, so picture and voice cannot drift apart. Places keep
// their own frames in places.ts, cut to the words of each clip.
import { buildScenes, defineVoiceover, scenesDuration } from "../../reel";
import { DURATIONS } from "./durations";

export const FPS = 30;

// The reel plays faster than the clips were recorded (usd-five-people
// precedent). Every hit is scaled by the same factor, so sync is kept.
export const HOOK_SPEED = 1.2;
export const PLACE_SPEED = 1.2;
const h = (f: number) => Math.round(f / HOOK_SPEED);
const s = (f: number) => Math.round(f / PLACE_SPEED);

// Frames inside the hook scene, at RECORDED speed (macOS ASR on the clips):
// 01-unknown  «Ты@0 не@0.24 знаешь@0.36 этих@0.69 пятерых@0.90» (ends 1.58 s)
// 02-decide   «Они@0 решают@0.39 что@0.84 в@1.08 твоём@1.14 телефоне@1.50
//              что@2.04 ты@2.25 смотришь@2.37 и@3.15 куда@3.33 идут@3.60
//              деньги@3.78 мира@4.17» (ends 4.69 s)
// 03-not-them (re-recorded) «Не@0 Маск@0.30 и не@0.90 Трамп@1.05 и не@1.56 Путин@1.71» (ends 2.32 s)
const DECIDE_AT = 56; // 02-decide clip starts (0.25 s after the first line)
const NOT_THEM_AT = 204; // 03-not-them clip starts (0.23 s after «мира»)

export const HOOK = {
  five: h(27), // «пятерых» — the 5 punches
  decide: h(DECIDE_AT + 12), // «решают» — the row leans in
  chip: h(DECIDE_AT + 45), // «телефоне» — the chip lands
  play: h(DECIDE_AT + 71), // «смотришь» — the play button lands
  money: h(DECIDE_AT + 113), // «деньги» — the dollars land
  blink: h(NOT_THEM_AT - 14), // the stage stutters out before «Не Маск»
  not1: h(NOT_THEM_AT + 9), // НЕ МАСК
  not2: h(NOT_THEM_AT + 32), // НЕ ТРАМП
  not3: h(NOT_THEM_AT + 51), // НЕ ПУТИН
  dissolve: h(NOT_THEM_AT + 80), // the three faces go to ash
  who: h(NOT_THEM_AT + 100), // ТОГДА КТО? + the masks come back
  clips: { decide: h(DECIDE_AT), notThem: h(NOT_THEM_AT) },
} as const;

// 09-final «Ни@0 одного@0.30 из@0.60 них@0.72 ты@0.96 не@1.05 выбирал@1.17» (1.81 s)
export const FINAL = {
  names: s(6),
  stamp: s(35), // «выбирал»
} as const;

export const SCENES = buildScenes({
  hook: 338 / HOOK_SPEED / FPS, // cover → улики → НЕ МАСК · НЕ ТРАМП · НЕ ПУТИН → ash → ТОГДА КТО?
  place5: 8.9 / PLACE_SPEED, // Фуке (04-place5 re-recorded, 8.17 s)
  place4: 9.7 / PLACE_SPEED, // Чжан Имин (05-place4 9.10 s)
  place3: 9.3 / PLACE_SPEED, // Финк (06-place3 8.68 s)
  place2: 7.9 / PLACE_SPEED, // Ван Хунин (07-place2 7.25 s)
  place1: 11.0 / PLACE_SPEED, // Тахнун (08-place1 10.40 s)
  final: 5.4 / PLACE_SPEED, // ни одного из них ты не выбирал → masks unmask → stamp holds
});

export const DURATION = scenesDuration(SCENES);

export const VOICEOVER = defineVoiceover(DURATIONS, [
  { file: "01-unknown", start: SCENES.hook.from, rate: HOOK_SPEED },
  { file: "02-decide", start: SCENES.hook.from + HOOK.clips.decide / FPS, rate: HOOK_SPEED },
  { file: "03-not-them", start: SCENES.hook.from + HOOK.clips.notThem / FPS, rate: HOOK_SPEED },
  { file: "04-place5", start: SCENES.place5.from, rate: PLACE_SPEED },
  { file: "05-place4", start: SCENES.place4.from, rate: PLACE_SPEED },
  { file: "06-place3", start: SCENES.place3.from, rate: PLACE_SPEED },
  { file: "07-place2", start: SCENES.place2.from, rate: PLACE_SPEED },
  { file: "08-place1", start: SCENES.place1.from, rate: PLACE_SPEED },
  { file: "09-final", start: SCENES.final.from, rate: PLACE_SPEED },
]);
