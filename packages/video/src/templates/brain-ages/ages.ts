// How the brain looks at an age, and the life it lives through.
// Every number has a source line in studio/briefs/brain-ages/WORK.md.
import { interpolate } from "remotion";
import { Part } from "./palette";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export type Body = {
  /** overall linear size vs the adult peak (newborn 27% by mass ≈ 0.65 linear) */
  scale: number;
  /** 0 = smooth newborn-like cortex, 1 = adult folds */
  fold: number;
  /** 0..1: folds open up and gyri thin in old age */
  atrophy: number;
  /** lateral ventricles grow with age */
  ventricles: number;
};

export const bodyAt = (age: number): Body => ({
  scale: interpolate(age, [0, 1, 2, 6, 19, 40, 60, 85], [0.66, 0.85, 0.9, 0.97, 1, 0.995, 0.975, 0.955], clamp),
  fold: interpolate(age, [0, 1, 2, 6], [0.22, 0.6, 0.82, 1], clamp),
  atrophy: interpolate(age, [40, 60, 85], [0, 0.35, 1], clamp),
  ventricles: interpolate(age, [0, 40, 60, 85], [0.9, 1, 1.25, 1.6], clamp),
});

export type Beat = {
  age: number;
  /** life event, the big line */
  event: string;
  /** what the brain does, one line, with its number */
  fact: string;
  parts: Partial<Record<Part, number>>;
  /** show the cortex as glass to reveal a deep structure */
  glass?: boolean;
  /** turning point number (Mousley 2025) */
  turn?: number;
  photo: string;
};

// Author 2026-10-26: «упор на интересные события: школа, университет, работа,
// жена, завёл собаку, стареешь», up to 60 s, no voice.
export const BEATS: Beat[] = [
  { age: 0, event: "Рождение", fact: "мозг весит 360 г: 27% от взрослого", parts: { occipital: 1, brainstem: 1 }, photo: "fig-shoes" },
  { age: 1, event: "Первые шаги", fact: "за год мозг вырос вдвое: +101%", parts: { cerebellum: 1, motor: 1 }, photo: "fig-toddler" },
  { age: 4, event: "Детский сад", fact: "мозг съедает 66% энергии тела", parts: { frontal: 1, motor: 1, parietal: 1, temporal: 1, occipital: 1 }, photo: "fig-blocks" },
  { age: 7, event: "Школа", fact: "серого вещества больше всего за жизнь, лишние связи начинают отмирать", parts: { temporal: 1, parietal: 0.85 }, photo: "fig-backpack" },
  { age: 9, event: "Первый велосипед", fact: "детская сеть связей становится подростковой", parts: { callosum: 1 }, glass: true, turn: 1, photo: "fig-bike" },
  { age: 14, event: "Первая любовь", fact: "эмоции на пике, а тормоз в лобной доле ещё строится", parts: { amygdala: 1 }, glass: true, photo: "fig-teens" },
  { age: 18, event: "Университет", fact: "пик скорости мышления", parts: { frontal: 1, cerebellum: 0.9 }, photo: "fig-graduate" },
  { age: 23, event: "Первая работа", fact: "рабочая память на пике до 35", parts: { parietal: 1, frontal: 0.85 }, photo: "fig-laptop" },
  { age: 28, event: "Свадьба", fact: "белое вещество на пике: 28,7 лет", parts: { callosum: 1 }, glass: true, photo: "fig-rings" },
  { age: 32, event: "Первый ребёнок", fact: "лобные доли достроены, подростковый режим выключен", parts: { frontal: 1 }, turn: 2, photo: "fig-pram" },
  { age: 35, event: "Завёл собаку", fact: "с 35 мозг теряет 0,2% объёма в год", parts: {}, photo: "fig-puppy" },
  { age: 40, event: "Повышение", fact: "пик зарплаты в России: 35–44 года, 90,9 тыс ₽", parts: { temporal: 1, frontal: 0.85 }, photo: "fig-suit" },
  { age: 53, event: "Ипотека закрыта", fact: "меньше всего переплат по кредитам: опыт обгоняет скорость", parts: { frontal: 1, temporal: 0.85 }, photo: "fig-keys" },
  { age: 66, event: "Пенсия и дача", fact: "мозг теряет уже 0,5% в год, связи слабеют", parts: {}, glass: true, turn: 3, photo: "fig-harvest" },
  { age: 72, event: "Где очки?", fact: "гиппокамп, центр памяти, теряет 1,1% в год", parts: { hippocampus: 1 }, glass: true, photo: "fig-glasses" },
  { age: 78, event: "Шахматы с внуком", fact: "но в гиппокампе всё ещё находят новые клетки", parts: { hippocampus: 1 }, glass: true, photo: "fig-chess" },
  { age: 83, event: "Правнуки", fact: "у суперэйджеров кора тает вдвое медленнее: 1,06% против 2,24% в год", parts: { frontal: 1, temporal: 1, parietal: 1 }, turn: 4, photo: "fig-hourglass" },
];

export const TURNS = [9, 32, 66, 83];

/** timing, seconds */
export const HOOK = 3.4;
export const BEAT = 2.7;
export const FIRST_TRAVEL = 0.9; // from the hook's adult brain back to the newborn
const TRAVEL = 0.5;
export const FINALE = HOOK + BEATS.length * BEAT;
export const TOTAL = FINALE + 5.5;
const HOOK_AGE = 30;
const smooth = (x: number) => x * x * (3 - 2 * x);
const FINAL_AGE = 85;

// Yaw that shows a part best (lateral left view ≈ -1.57; front to the left of screen).
const VIEW: Partial<Record<Part, number>> = {
  frontal: -0.8, motor: -1.45, parietal: -1.75, temporal: -1.5, occipital: -2.5, limbic: -1.57,
  cerebellum: -2.45, brainstem: -2.1, hippocampus: -1.5, amygdala: -1.0, callosum: -1.57, ventricles: -1.57,
};
const TAU = Math.PI * 2;
const SPIN = 0.22; // rad/s of slow turn inside a beat
const HOOK_YAW = -1.9;
/** yaw at each beat's start: the next angle ahead that shows the beat's main part */
const YAWS: number[] = (() => {
  const out: number[] = [];
  let y = HOOK_YAW + HOOK * 0.36;
  for (const b of BEATS) {
    const main = Object.entries(b.parts).sort((p, q) => (q[1] ?? 0) - (p[1] ?? 0))[0]?.[0] as Part | undefined;
    // the view should be centred mid-beat, so aim a little behind it
    const want = main ? (VIEW[main] ?? -1.57) - SPIN * BEAT * 0.5 : y + 0.9;
    let t = want;
    while (t < y + 0.45) t += TAU;
    while (t - TAU >= y + 0.45) t -= TAU;
    out.push(t);
    y = t + SPIN * BEAT;
  }
  return out;
})();

export const yawAt = (sec: number): number => {
  if (sec < HOOK) return HOOK_YAW + sec * 0.36;
  if (sec >= FINALE) {
    const end = YAWS[YAWS.length - 1] + SPIN * BEAT;
    return end + (sec - FINALE) * 0.3;
  }
  // clamp: float rounding can put the last frame before FINALE one beat too far
  const i = Math.min(BEATS.length - 1, Math.floor((sec - HOOK) / BEAT));
  const local = sec - HOOK - i * BEAT;
  const from = i === 0 ? HOOK_YAW + HOOK * 0.36 : YAWS[i - 1] + SPIN * BEAT;
  const travel = i === 0 ? FIRST_TRAVEL : TRAVEL + 0.15;
  const t = smooth(interpolate(local, [0, travel], [0, 1], clamp));
  return from + (YAWS[i] - from) * t + SPIN * local * t;
};

export type Moment = {
  age: number;
  parts: Partial<Record<Part, number>>;
  glass: number;
  /** current beat, -1 in the hook, BEATS.length in the finale */
  beat: number;
  /** seconds since the beat (or hook/finale) started */
  local: number;
  /** 0..1 visibility of the beat's label and photo */
  label: number;
};

export const momentAt = (sec: number): Moment => {
  if (sec < HOOK) return { age: HOOK_AGE, parts: {}, glass: 0, beat: -1, local: sec, label: 0 };
  if (sec >= FINALE) {
    const local = sec - FINALE;
    const t = smooth(interpolate(local, [0, TRAVEL], [0, 1], clamp));
    return { age: 83 + (FINAL_AGE - 83) * t, parts: {}, glass: 0, beat: BEATS.length, local, label: 1 };
  }
  // clamp: float rounding can put the last frame before FINALE one beat too far
  const i = Math.min(BEATS.length - 1, Math.floor((sec - HOOK) / BEAT));
  const local = sec - HOOK - i * BEAT;
  const b = BEATS[i];
  const prev = i === 0 ? null : BEATS[i - 1];
  const travel = i === 0 ? FIRST_TRAVEL : TRAVEL;
  const t = smooth(interpolate(local, [0, travel], [0, 1], clamp));
  const from = prev ? prev.age : HOOK_AGE;
  const age = from + (b.age - from) * t;
  const on =
    interpolate(local, [travel * 0.6, travel + 0.35], [0, 1], clamp) *
    interpolate(local, [BEAT - 0.3, BEAT], [1, 0], clamp);
  const parts: Partial<Record<Part, number>> = {};
  for (const [p, v] of Object.entries(b.parts)) parts[p as Part] = (v ?? 0) * on;
  const g = (x: Beat | null) => (x?.glass ? 1 : 0);
  const glass = g(prev) + (g(b) - g(prev)) * t;
  return { age, parts, glass, beat: i, local, label: on };
};

export const ageText = (age: number): string => {
  const a = Math.round(age);
  if (a === 0) return "0 лет";
  const m10 = a % 10;
  const m100 = a % 100;
  const word = m10 === 1 && m100 !== 11 ? "год" : m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14) ? "года" : "лет";
  return `${a} ${word}`;
};
