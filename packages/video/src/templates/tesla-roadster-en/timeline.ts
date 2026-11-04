// The whole reel, built beat by beat with the author. They share one scene: the deposit
// slip runs straight through the cuts and reprints on each beat.
// Every hit is a frame number in HOOK, taken from the ASR word timings
// (asr.ts) scaled by HOOK_SPEED; the cuts sit on the same numbers, so
// picture and voice cannot drift apart.
import { buildScenes, defineVoiceover, scenesDuration } from "../../reel";
import { DURATIONS } from "./durations";

export const FPS = 30;
export const HOOK_SPEED = 1.12;
const h = (sec: number) => Math.round((sec / HOOK_SPEED) * FPS);

// word times: asr.ts (en-US); each hit below names its English word
const PRICE_AT = h(DURATIONS["01-wow"]) + 2;

export const HOOK = {
  flying: h(1.35), // «летающую» — the word lights up
  price: PRICE_AT, // «отдай» — cut to the ramp, the deposit slip prints
  fifty: PRICE_AT + h(0.09), // «пятьдесят тысяч» — $50 000 punches
  noPrice: PRICE_AT + h(1.32), // «а цену» — cut to the face, ЦЕНА ??? line
  never: PRICE_AT + h(2.46), // «не скажут» — the stamp slams
} as const;

// word times: asr.ts (en-US); each hit below names its English word
const THRUST_AT = PRICE_AT + h(DURATIONS["02-price"]) + 20; // Fry + stamp hold first

export const THRUST = {
  start: THRUST_AT, // «и это только бронь» — Fry drops out, still on the face
  bron: THRUST_AT + h(0.81), // «бронь» — ТОЛЬКО БРОНЬ stamps the slip
  version: THRUST_AT + h(1.41), // «за версию» — cut to the takeoff, slow motion
  rockets: THRUST_AT + h(1.95), // «с ракетными двигателями» — the line lands
  twoFifty: THRUST_AT + h(2.28), // «двести пятьдесят тысяч» — the slip reprints ×5
  end: THRUST_AT + h(DURATIONS["03-thrust"]) + 15, // the Mask holds here (note 4)
} as const;

// word times: asr.ts (en-US); each hit below names its English word
const ROCKET_AT = THRUST.end;

export const ROCKET = {
  start: ROCKET_AT, // «а летает вообще» — cut to the car leaving the ramp top
  third: ROCKET_AT + h(1.83), // «третья версия» — ВЕРСИЯ №3 · ROCKET
  invite: ROCKET_AT + h(2.85), // «её продают» — cut to the hover, the slip reprints
  only: ROCKET_AT + h(3.09), // «по приглашениям» — ИНВАЙТ punches
  road: ROCKET_AT + h(3.78), // «и выезжать на ней» — cut to the car out of the smoke
  never: ROCKET_AT + h(4.38), // «нельзя» — the sign and НЕ ДЛЯ ДОРОГ slam
  end: ROCKET_AT + h(DURATIONS["04-rocket"]) + 14,
} as const;

// word times: asr.ts (en-US); each hit below names its English word
const PROMISE_AT = ROCKET.end;

export const PROMISE = {
  start: PROMISE_AT, // «те же пятьдесят тысяч» — cut to the 2017 prototype, the old slip prints
  fifty: PROMISE_AT + h(1.41), // «пятьдесят тысяч» — $50 000 punches
  musk: PROMISE_AT + h(2.46), // «Маск брал» — Musk 2017 slides in
  year: PROMISE_AT + h(2.82), // «в 2017-м» — the year stamps
  promised: PROMISE_AT + h(3.87), // «обещал» — cut to the red Roadster, ОБЕЩАЛ
  km: PROMISE_AT + h(4.26), // «тысячу километров» — ХОД 1 000 КМ prints
  seats: PROMISE_AT + h(6.15), // «четыре места» — МЕСТ 4 prints, then ВЫПУСК 2020
  end: PROMISE_AT + h(DURATIONS["05-2017"]) + 14,
} as const;

// word times: asr.ts (en-US); each hit below names its English word
const NOW_AT = PROMISE.end;

export const NOW = {
  start: NOW_AT, // «сейчас» — cut to 2026, the 2017 slip stays
  km: NOW_AT + h(0.78), // «четыреста восемьдесят» — 1 000 melts to 480
  seats: NOW_AT + h(1.86), // «два места» — 4 → 2
  year: NOW_AT + h(3.12), // «2028-м» — 2020 → 2028
  end: NOW_AT + h(DURATIONS["06-now"]) + 12,
} as const;

// word times: asr.ts (en-US); each hit below names its English word
const TRUTH_AT = NOW.end;

export const TRUTH = {
  start: TRUTH_AT, // «так что продают тут» — cut to the show over the Semi
  notCar: TRUTH_AT + h(1.11), // «не машину» — НЕ МАШИНУ
  show: TRUTH_AT + h(2.43), // «шоу» — А ШОУ
  spacex: TRUTH_AT + h(4.11), // «SpaceX» — the site chip
  musk: TRUTH_AT + h(5.61), // «а Маск намекает» — graphic: Musk + two wordmarks
  merge: TRUTH_AT + h(7.65), // «слияние» — TESLA × SPACEX slam together
  end: TRUTH_AT + h(DURATIONS["07-truth"]) + 6,
} as const;

// word times: asr.ts (en-US); each hit below names its English word
const CTA_AT = TRUTH.end;

export const CTA = {
  start: CTA_AT, // the face, lip-synced from frame 0 of its slice (presenter.ts «cta»)
  fifty: CTA_AT + h(0.69), // «пятьдесят тысяч» — $50 000? punches
  like: CTA_AT + h(1.6), // ♥ → ПОДПИСАТЬСЯ → bell under the question
  loop: CTA_AT + h(DURATIONS["08-cta"]) + 30, // last 10 frames replay the cover → loops into frame 0
  end: CTA_AT + h(DURATIONS["08-cta"]) + 40,
} as const;

// The hook face: lip-synced slice «а цену тебе даже не скажут» (presenter.ts
// «price», 02-price from 1.32 s) — starts with its voice, two frames before the cut.
export const FACE_IN = HOOK.price + h(1.32);

export const SCENES = buildScenes({
  // kickflip · ramp + deposit slip · face + НЕ СКАЖУТ · ТОЛЬКО БРОНЬ · takeoff + $250 000
  // … · ramp flight ВЕРСИЯ №3 · hover + ИНВАЙТ · out of the smoke + НЕ ДЛЯ ДОРОГ
  // … · 2017 prototype + old slip, Musk, 2017 · red Roadster ОБЕЩАЛ 1 000 КМ · 4 МЕСТА
  // … · 2026: the 2017 slip melts 1 000 → 480 КМ, 4 → 2, 2020 → 2028
  // … · ПРОДАЮТ НЕ МАШИНУ, А ШОУ · TESLA × SPACEX · face: ТЫ БЫ ОТДАЛ? + like/sub → loop
  hook: CTA.end / FPS,
});

export const DURATION = scenesDuration(SCENES);

export const VOICEOVER = defineVoiceover(DURATIONS, [
  { file: "01-wow", start: SCENES.hook.from, rate: HOOK_SPEED },
  { file: "02-price", start: SCENES.hook.from + HOOK.price / FPS, rate: HOOK_SPEED },
  { file: "03-thrust", start: SCENES.hook.from + THRUST.start / FPS, rate: HOOK_SPEED },
  { file: "04-rocket", start: SCENES.hook.from + ROCKET.start / FPS, rate: HOOK_SPEED },
  { file: "05-2017", start: SCENES.hook.from + PROMISE.start / FPS, rate: HOOK_SPEED },
  { file: "06-now", start: SCENES.hook.from + NOW.start / FPS, rate: HOOK_SPEED },
  { file: "07-truth", start: SCENES.hook.from + TRUTH.start / FPS, rate: HOOK_SPEED },
  { file: "08-cta", start: SCENES.hook.from + CTA.start / FPS, rate: HOOK_SPEED },
]);
