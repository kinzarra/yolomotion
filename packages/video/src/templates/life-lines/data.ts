// The whole life as data. Ages are the hero's («Я») age; x is the thread's
// lane on a 1080-wide frame, keyframed and eased between keys.
import { palette } from "./palette";

export const FPS = 30;
export const DURATION = 90; // seconds, as the reference
export const NOW_Y = 1000; // the «now» line: heads ride it, the past trails below
export const PX_PER_YEAR = 80;

export type EndKind = "star" | "leave" | "stay";

export type Person = {
  id: string;
  label: string;
  color: string;
  /** passers-by: grey trail, no star */
  pass?: boolean;
  start: number;
  end: number;
  endKind: EndKind;
  xs: [number, number][];
  star?: [number, number];
  starSide?: "left" | "right";
  starSize?: number;
  /** raise the label to clear a neighbour's */
  labelDy?: number;
  /** wobble amplitude (px) and frequency */
  wobble?: [number, number];
};

const OFF_L = -160;
const OFF_R = 1240;
const FOREVER = 999;

export const PEOPLE: Person[] = [
  { id: "grandma", label: "Бабушка", color: palette.grandma, start: -6, end: 10, endKind: "star",
    xs: [[-6, 180], [10, 180]], star: [190, 450] },
  { id: "grandpa", label: "Дедушка", color: palette.grandpa, start: -6, end: 6, endKind: "star",
    xs: [[-6, 800], [3.5, 800], [6, 880]], star: [880, 370], starSide: "left" },
  { id: "mom", label: "Мама", color: palette.mom, start: -6, end: 72, endKind: "star",
    xs: [[-6, 330], [28, 320], [33, 200], [72, 200]], star: [210, 710] },
  { id: "dad", label: "Папа", color: palette.dad, start: -6, end: 52, endKind: "star",
    xs: [[-6, 640], [29.5, 660], [32, 800], [35, 860], [52, 860]], star: [840, 630], starSide: "left" },
  { id: "me", label: "Я", color: palette.me, start: 0, end: 84, endKind: "star",
    xs: [[0, 490], [2, 510], [33, 520], [36, 480], [84, 480]], star: [560, 880], starSize: 1.5 },

  { id: "kinder", label: "Друг из садика", color: palette.passTrail, pass: true, start: 2.4, end: 6.6, endKind: "leave",
    xs: [[2.4, OFF_R], [3.5, 980], [5.5, 980], [6.6, OFF_R]], labelDy: -40 },
  { id: "friend", label: "Друг детства", color: palette.friend, start: 6.2, end: 30.5, endKind: "leave",
    xs: [[6.2, OFF_R], [7.3, 780], [28.5, 790], [30.5, OFF_R]], labelDy: -40 },
  { id: "classmate", label: "Одноклассник", color: palette.passTrail, pass: true, start: 7.8, end: 18, endKind: "leave",
    xs: [[7.8, OFF_R], [9, 960], [16.8, 960], [18, OFF_R]] },
  { id: "dog", label: "Собака", color: palette.dog, start: 8.8, end: 22, endKind: "star",
    xs: [[8.8, OFF_L], [9.8, 425], [22, 425]], star: [660, 490], starSize: 0.7, labelDy: -40, wobble: [7, 2.2] },
  { id: "love", label: "Первая любовь", color: palette.passTrail, pass: true, start: 15.3, end: 18.8, endKind: "leave",
    xs: [[15.3, OFF_L], [16.4, 200], [17.8, 200], [18.8, OFF_L]], labelDy: -40 },
  { id: "uni", label: "Однокурсник", color: palette.passTrail, pass: true, start: 18.2, end: 23.6, endKind: "leave",
    xs: [[18.2, OFF_R], [19.3, 960], [22.5, 960], [23.6, OFF_R]] },
  { id: "colleague", label: "Коллега", color: palette.passTrail, pass: true, start: 21.6, end: 27.9, endKind: "leave",
    xs: [[21.6, OFF_L], [22.7, 200], [26.8, 200], [27.9, OFF_L]] },
  { id: "wife", label: "Жена", color: palette.wife, start: 23.6, end: 81, endKind: "star",
    xs: [[23.6, OFF_L], [25, 425], [33, 420], [36, 340], [81, 340]], star: [380, 790] },
  { id: "son", label: "Сын", color: palette.son, start: 30, end: FOREVER, endKind: "stay",
    xs: [[30, 470], [32, 640], [42, 640], [44, 760], [53, 760], [56, 880], [76, 880], [80, 900]] },
  { id: "daughter", label: "Дочь", color: palette.daughter, start: 34, end: FOREVER, endKind: "stay",
    xs: [[34, 450], [36.5, 760], [42, 760], [44, 640], [76, 640], [80, 760]] },
  { id: "workfriend", label: "Друг с работы", color: palette.passTrail, pass: true, start: 34.5, end: 60, endKind: "leave",
    xs: [[34.5, OFF_R], [35.8, 980], [39.2, 980], [40.4, OFF_R]], labelDy: -40 },
  { id: "newcolleague", label: "Новый коллега", color: palette.passTrail, pass: true, start: 40.6, end: 56.5, endKind: "leave",
    xs: [[40.6, OFF_R], [41.8, 980], [55.2, 980], [56.5, OFF_R]], labelDy: -40 },
  { id: "reunion", label: "Друг детства", color: palette.friend, start: 43.8, end: 47.4, endKind: "leave",
    xs: [[43.8, OFF_L], [45, 270], [46.3, 270], [47.4, OFF_L]], labelDy: -40 },
  { id: "grandson", label: "Внук", color: palette.grandson, start: 58, end: FOREVER, endKind: "stay",
    xs: [[58, 880], [60, 980], [76, 980], [80, 970]], labelDy: -36 },
  { id: "granddaughter", label: "Внучка", color: palette.granddaughter, start: 63, end: FOREVER, endKind: "stay",
    xs: [[63, 640], [65, 740], [76, 740], [80, 830]], labelDy: -36 },
  { id: "neighbor", label: "Сосед", color: palette.passTrail, pass: true, start: 72.6, end: 78.8, endKind: "leave",
    xs: [[72.6, OFF_L], [73.8, 210], [77.8, 210], [78.8, OFF_L]] },
];

/** Life events, shown as one line at the top while that age passes. */
export const EVENTS: [number, string][] = [
  [3, "садик"],
  [7, "первый класс"],
  [9, "первая собака"],
  [17, "выпускной"],
  [22, "первая работа"],
  [25, "свадьба"],
  [28, "ипотека"],
  [30, "сын"],
  [34, "дочь"],
  [37, "сын пошёл в школу"],
  [40, "новая работа"],
  [45, "встреча выпускников"],
  [48, "ипотека закрыта"],
  [50, "юбилей"],
  [58, "первый внук"],
  [65, "пенсия"],
];

/** Constellation edges, drawn in this order once «Я» becomes a star. */
export const EDGES: [string, string][] = [
  ["me", "wife"],
  ["wife", "mom"],
  ["mom", "grandma"],
  ["grandma", "grandpa"],
  ["grandpa", "dad"],
  ["dad", "me"],
  ["me", "dog"],
];

// ---- clock: age as a function of time --------------------------------------
// ~1.1 years a second, slowing into the last years so the end can breathe.
const smooth = (x: number) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));
const speedAt = (t: number) => 1.1 - 0.8 * smooth((t - 75) / 5);

const STEPS_PER_FRAME = 4;
export const AGES: number[] = (() => {
  const out: number[] = [];
  let age = -1.5;
  const dt = 1 / FPS / STEPS_PER_FRAME;
  for (let f = 0; f <= DURATION * FPS; f++) {
    out.push(age);
    for (let s = 0; s < STEPS_PER_FRAME; s++) {
      age += speedAt((f + s / STEPS_PER_FRAME) / FPS) * dt;
    }
  }
  return out;
})();

export const ageAt = (frame: number) =>
  AGES[Math.max(0, Math.min(AGES.length - 1, Math.floor(frame)))];

/** First frame at which the clock reaches this age. */
export const frameOfAge = (age: number) => {
  const i = AGES.findIndex((a) => a >= age);
  return i < 0 ? AGES.length : i;
};

export const FINALE_FRAME = frameOfAge(84); // «Я» becomes a star

// ---- lanes -----------------------------------------------------------------
export const laneX = (p: Person, age: number) => {
  const xs = p.xs;
  if (age <= xs[0][0]) return xs[0][1];
  for (let i = 1; i < xs.length; i++) {
    const [a1, x1] = xs[i];
    const [a0, x0] = xs[i - 1];
    if (age <= a1) return x0 + (x1 - x0) * smooth((age - a0) / (a1 - a0));
  }
  return xs[xs.length - 1][1];
};

export const wobbleX = (p: Person, age: number, seed: number) => {
  const [amp, freq] = p.wobble ?? [5, 1.1];
  return (
    Math.sin(age * freq + seed * 6.28) * amp +
    Math.sin(age * freq * 2.7 + seed * 3.1) * amp * 0.45
  );
};
