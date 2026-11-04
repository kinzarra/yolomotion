// Hook + five places + loop.
// Every hit in the hook is a frame number in HOOK; the voice clips are
// placed off the same numbers, so picture and voice cannot drift apart.
import { buildScenes, defineVoiceover, scenesDuration } from "../../reel";
import { DURATIONS } from "./durations";

export const FPS = 30;

// The reel runs faster than the clips were recorded (author: «сократим до
// 59 с, первые 7 секунд точно ускорить»). Voice plays at these rates and
// every hit is scaled by the same factor, so sync is kept.
export const HOOK_SPEED = 1.2;
export const PLACE_SPEED = 1.1;
const h = (f: number) => Math.round(f / HOOK_SPEED);

// Frames inside the hook scene. Word positions from macOS ASR on the clips:
// 01-question «Кто@0 управляет@0.33 курсом@0.84 доллара@1.23 пять@1.68 …
// людей@2.88» (speech ends 3.25 s); 02-surprise «Но вы удивитесь…» speaks
// 0.17–1.02 s; 03-not-them «Это@0.18 не@0.39 Путин@0.54 и@0.99 не@1.11 Трамп@1.26».
// Frames below are at recorded speed; h() scales them to the reel.
const SURPRISE_AT = 100; // 02-surprise clip starts (frame)
const NOT_THEM_AT = 152; // 03-not-them clip starts, after the pause

export const HOOK = {
  words: [-12, h(10), h(25), h(37)], // КТО is already down on frame 0 — the cover
  five: h(50),
  surprise: h(SURPRISE_AT + 3), // «НО ВЫ УДИВИТЕСЬ…» + the slow push-in
  blink: h(134), // inside the pause after «удивитесь»
  eto: h(NOT_THEM_AT), // ЭТО
  not1: h(NOT_THEM_AT + 12), // НЕ ПУТИН on «не»
  not2: h(NOT_THEM_AT + 30), // НЕ ТРАМП on «и не»
  dissolve: h(NOT_THEM_AT + 56),
  who: h(NOT_THEM_AT + 92), // ТОГДА КТО? + the shocked face
  go: h(NOT_THEM_AT + 122), // ПОГНАЛИ! after «тогда кто?» ends
  clips: { surprise: h(SURPRISE_AT), notThem: h(NOT_THEM_AT) },
} as const;

export const SCENES = buildScenes({
  hook: 10.4 / HOOK_SPEED, // words drop → НО ВЫ УДИВИТЕСЬ… → blink → ЭТО НЕ ПУТИН · НЕ ТРАМП → dissolve → ТОГДА КТО? → ПОГНАЛИ!
  place5: 7.4 / PLACE_SPEED, // 5 МЕСТО — Сечин (06-place5 runs 6.97 s)
  place4: 10.5 / PLACE_SPEED, // бин Салман (07-place4 10.08 s)
  place3: 11.8 / PLACE_SPEED, // Бессент (08-place3 11.33 s)
  place2: 11.3 / PLACE_SPEED, // Силуанов (09-place2 10.82 s)
  place1: 9.3 / PLACE_SPEED, // Набиуллина (10-place1 8.82 s)
  loop: 1.0, // the stage rebuilds into frame 0 — the reel loops seamlessly
});

export const DURATION = scenesDuration(SCENES);

const LEAD = 0.15 / HOOK_SPEED; // lead silence in 04-who
const GO_LEAD = 0.18 / HOOK_SPEED; // lead silence in 05-go

export const VOICEOVER = defineVoiceover(DURATIONS, [
  { file: "01-question", start: SCENES.hook.from, rate: HOOK_SPEED },
  { file: "02-surprise", start: SCENES.hook.from + HOOK.clips.surprise / FPS, rate: HOOK_SPEED },
  { file: "03-not-them", start: SCENES.hook.from + HOOK.clips.notThem / FPS, rate: HOOK_SPEED },
  { file: "04-who", start: SCENES.hook.from + HOOK.who / FPS - LEAD, rate: HOOK_SPEED },
  { file: "05-go", start: SCENES.hook.from + HOOK.go / FPS - GO_LEAD, rate: HOOK_SPEED },
  { file: "06-place5", start: SCENES.place5.from, rate: PLACE_SPEED },
  { file: "07-place4", start: SCENES.place4.from, rate: PLACE_SPEED },
  { file: "08-place3", start: SCENES.place3.from, rate: PLACE_SPEED },
  { file: "09-place2", start: SCENES.place2.from, rate: PLACE_SPEED },
  { file: "10-place1", start: SCENES.place1.from, rate: PLACE_SPEED },
]);
