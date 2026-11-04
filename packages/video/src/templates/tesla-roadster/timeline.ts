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

// asr.ts: 01-wow «Вау@0 Маск@0.48 сделал@0.87 летающую@1.2 Теслу@1.89»
//         02-price «Отдай@0 … 50@0.81 000@1.38 $@1.77 а@2.52 цену@2.67 … скажут@3.6»
const PRICE_AT = h(DURATIONS["01-wow"]) + 2;

export const HOOK = {
  flying: h(1.2), // «летающую» — the word lights up
  price: PRICE_AT, // «отдай» — cut to the ramp, the deposit slip prints
  fifty: PRICE_AT + h(0.81), // «пятьдесят тысяч» — $50 000 punches
  noPrice: PRICE_AT + h(2.52), // «а цену» — cut to the face, ЦЕНА ??? line
  never: PRICE_AT + h(3.6), // «не скажут» — the stamp slams
} as const;

// asr.ts: 03-thrust «Это@0.12 только@0.48 бронь@0.78 за@1.26 версию@1.47 …
//         ракетными@1.92 двигателями@2.46 двести@3.36 пятьдесят@3.9 тысяч@4.47»
const THRUST_AT = PRICE_AT + h(DURATIONS["02-price"]) + 20; // Fry + stamp hold first

export const THRUST = {
  start: THRUST_AT, // «и это только бронь» — Fry drops out, still on the face
  bron: THRUST_AT + h(0.78), // «бронь» — ТОЛЬКО БРОНЬ stamps the slip
  version: THRUST_AT + h(1.26), // «за версию» — cut to the takeoff, slow motion
  rockets: THRUST_AT + h(1.92), // «с ракетными двигателями» — the line lands
  twoFifty: THRUST_AT + h(3.36), // «двести пятьдесят тысяч» — the slip reprints ×5
  end: THRUST_AT + h(DURATIONS["03-thrust"]) + 15, // the Mask holds here (note 4)
} as const;

// asr.ts: 04-rocket «А летает@0 вообще@0.75 третья@1.14 версия@1.65 её@2.16
//   продают@2.46 только@2.94 по приглашениям@3.24 и@4.47 выезжать@4.68 …
//   дорогу@5.61 нельзя@6.03»
const ROCKET_AT = THRUST.end;

export const ROCKET = {
  start: ROCKET_AT, // «а летает вообще» — cut to the car leaving the ramp top
  third: ROCKET_AT + h(1.14), // «третья версия» — ВЕРСИЯ №3 · ROCKET
  invite: ROCKET_AT + h(2.16), // «её продают» — cut to the hover, the slip reprints
  only: ROCKET_AT + h(3.24), // «по приглашениям» — ИНВАЙТ punches
  road: ROCKET_AT + h(4.47), // «и выезжать на ней» — cut to the car out of the smoke
  never: ROCKET_AT + h(6.03), // «нельзя» — the sign and НЕ ДЛЯ ДОРОГ slam
  end: ROCKET_AT + h(DURATIONS["04-rocket"]) + 14,
} as const;

// asr.ts: 05-2017 «Те@0 же@0.27 50@0.45 000@1.11 Маск@1.62 брал@2.4 ещё@2.82
//   в 2017-м@3.09 обещал@5.1 тысячу@5.64 км@6.09 хода@6.6 и@7.2 четыре@7.38 места@7.83»
const PROMISE_AT = ROCKET.end;

export const PROMISE = {
  start: PROMISE_AT, // «те же пятьдесят тысяч» — cut to the 2017 prototype, the old slip prints
  fifty: PROMISE_AT + h(0.45), // «пятьдесят тысяч» — $50 000 punches
  musk: PROMISE_AT + h(1.62), // «Маск брал» — Musk 2017 slides in
  year: PROMISE_AT + h(3.21), // «в 2017-м» — the year stamps
  promised: PROMISE_AT + h(5.1), // «обещал» — cut to the red Roadster, ОБЕЩАЛ
  km: PROMISE_AT + h(5.64), // «тысячу километров» — ХОД 1 000 КМ prints
  seats: PROMISE_AT + h(7.38), // «четыре места» — МЕСТ 4 prints, then ВЫПУСК 2020
  end: PROMISE_AT + h(DURATIONS["05-2017"]) + 14,
} as const;

// asr.ts: 06-now «Сейчас@0 400@0.6 80 км@1.14 два@2.46 места@2.73 и выпуск@3.42
//   в 2028-м@4.05» (take C, author note 5: «четыреста восемьдесят» read whole)
const NOW_AT = PROMISE.end;

export const NOW = {
  start: NOW_AT, // «сейчас» — cut to 2026, the 2017 slip stays
  km: NOW_AT + h(0.6), // «четыреста восемьдесят» — 1 000 melts to 480
  seats: NOW_AT + h(2.46), // «два места» — 4 → 2
  year: NOW_AT + h(4.17), // «2028-м» — 2020 → 2028
  end: NOW_AT + h(DURATIONS["06-now"]) + 12,
} as const;

// asr.ts: 07-truth «Так что продают@0.54 тут не машину@1.44 шоу@2.64 сняли на
//   площадке SpaceX@3.93 а Маск@4.98 намекает на слияние@6.24 Теслы и SpaceX@7.74»
const TRUTH_AT = NOW.end;

export const TRUTH = {
  start: TRUTH_AT, // «так что продают тут» — cut to the show over the Semi
  notCar: TRUTH_AT + h(1.44), // «не машину» — НЕ МАШИНУ
  show: TRUTH_AT + h(2.64), // «шоу» — А ШОУ
  spacex: TRUTH_AT + h(3.93), // «SpaceX» — the site chip
  musk: TRUTH_AT + h(4.98), // «а Маск намекает» — graphic: Musk + two wordmarks
  merge: TRUTH_AT + h(6.24), // «слияние» — TESLA × SPACEX slam together
  end: TRUTH_AT + h(DURATIONS["07-truth"]) + 6,
} as const;

// asr.ts: 08-cta «Ты бы отдал@0.36 50 000@0.72 за летающую Теслу@1.77»
const CTA_AT = TRUTH.end;

export const CTA = {
  start: CTA_AT, // the face, lip-synced from frame 0 of its slice (presenter.ts «cta»)
  fifty: CTA_AT + h(0.72), // «пятьдесят тысяч» — $50 000? punches
  like: CTA_AT + h(1.6), // ♥ → ПОДПИСАТЬСЯ → bell under the question
  loop: CTA_AT + h(DURATIONS["08-cta"]) + 30, // last 10 frames replay the cover → loops into frame 0
  end: CTA_AT + h(DURATIONS["08-cta"]) + 40,
} as const;

// The hook face: lip-synced slice «а цену тебе даже не скажут» (presenter.ts
// «price», 02-price from 2.45 s) — starts with its voice, two frames before the cut.
export const FACE_IN = HOOK.price + h(2.45);

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
