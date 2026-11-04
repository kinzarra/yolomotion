// life-spend: a life told by what it buys. Same sky and clock as life-lines;
// family threads carry the life, purchases branch off whoever pays, ride a
// moment beside them and rise into the sky as small stars. Ages are «Я»'s.
import { palette } from "../life-lines/palette";

export const FPS = 30;
export const NOW_Y = 1000;
export const PX_PER_YEAR = 80;

export type EndKind = "star" | "leave" | "stay";
export type Kind = "family" | "long" | "buy";

export type Thread = {
  id: string;
  /** label switches at these ages: [[age, text], ...] */
  labels: [number, string][];
  color: string;
  kind: Kind;
  start: number;
  end: number;
  endKind: EndKind;
  xs: [number, number][];
  star?: [number, number];
  starSize?: number;
  labelDy?: number;
  wobble?: [number, number];
  thick?: boolean;
};

const OFF_L = -160;
const OFF_R = 1240;
const FOREVER = 999;

export const LANE = { me: 540, wife: 360, car: 720, son: 870, grand: 1000, home: 190 } as const;

export const colors = {
  car: "#d7defa",
  home: "#3ddc84",
  mortgage: "#2fd27a",
  dacha: "#b6ef6a",
} as const;

const BUY_COLORS = ["#ffd36e", "#7fe0ff", "#ff9ec7", "#b9a6ff", "#8ff0a4", "#ffb27a", "#e6f27a", "#9fc4ff"];

const FAMILY: Thread[] = [
  { id: "mom", labels: [[-9, "Мама"]], color: palette.mom, kind: "family", start: -6, end: 22, endKind: "leave",
    xs: [[-6, 410], [17.6, 410], [22, OFF_L]] },
  { id: "dad", labels: [[-9, "Папа"]], color: palette.dad, kind: "family", start: -6, end: 22.5, endKind: "leave",
    xs: [[-6, 670], [18, 670], [19.5, 930], [22.5, OFF_R]] },
  { id: "me", labels: [[-9, "Я"]], color: palette.me, kind: "family", start: 0, end: 84, endKind: "star",
    xs: [[0, LANE.me], [84, LANE.me]], star: [540, 845], starSize: 1.6 },
  { id: "wife", labels: [[-9, "Жена"]], color: palette.wife, kind: "family", start: 26.3, end: 81, endKind: "star",
    xs: [[26.3, OFF_L], [27.3, LANE.wife], [81, LANE.wife]], star: [330, 880] },
  { id: "son", labels: [[-9, "Сын"]], color: palette.son, kind: "family", start: 30, end: FOREVER, endKind: "stay",
    xs: [[30, LANE.me], [31.6, LANE.son], [57, LANE.son], [58.5, 840], [79, 840], [80.6, 690]] },
  { id: "grandson", labels: [[-9, "Внук"]], color: palette.grandson, kind: "family", start: 58, end: FOREVER, endKind: "stay",
    xs: [[58, 840], [59.6, LANE.grand]], labelDy: -36 },
];

// Long purchases hold a lane: the car line swaps its label car by car.
const car = (id: string, label: string, start: number, end: number): Thread => ({
  id, labels: [[-9, label]], color: colors.car, kind: "long", start, end, endKind: "star",
  xs: [[start, LANE.car], [end, LANE.car]], wobble: [3, 0.9],
});

const LONG: Thread[] = [
  { id: "lada", labels: [[-9, "Лада"], [18, "папина Лада"]], color: colors.car, kind: "long", start: 0.4, end: 23, endKind: "star",
    xs: [[0.4, 670], [1.3, 860], [17.6, 860], [19.4, LANE.car], [23, LANE.car]], wobble: [3, 0.9] },
  car("mitsubishi", "Mitsubishi", 23, 30),
  car("bmw", "BMW", 30, 34),
  car("volvo", "Volvo", 34, 45),
  car("camry", "Toyota Camry", 45, 54),
  car("minibus", "микроавтобус", 54, 65),
  car("niva", "Нива", 65, 74),
  car("taxi", "такси", 74, 77.5),
  { id: "flat", labels: [[-9, "съёмная квартира"]], color: colors.home, kind: "long", start: 24, end: 28, endKind: "star",
    xs: [[24, LANE.me], [24.8, LANE.home], [28, LANE.home]] },
  { id: "mortgage", labels: [[-9, "ипотека"]], color: colors.mortgage, kind: "long", start: 28, end: 48, endKind: "star",
    xs: [[28, LANE.home], [48, LANE.home]], thick: true, wobble: [3, 0.7] },
  { id: "dacha", labels: [[-9, "дача"]], color: colors.dacha, kind: "long", start: 52, end: 80, endKind: "star",
    xs: [[52, LANE.me], [52.8, LANE.home], [80, LANE.home]] },
];

// Short purchases: [age, label, payer, ride next to]
type Payer = "mom" | "dad" | "me" | "son";
type Near = "son" | "grand" | "me";
const BUYS: [number, string, Payer, Near?][] = [
  [0, "смесь", "mom"], [0, "подгузники", "mom"], [0, "коляска", "dad"],
  [1, "пюре", "mom"],
  [2, "погремушка", "dad"],
  [3, "машинки", "dad"],
  [4, "Kinder Сюрприз", "mom"],
  [5, "LEGO", "dad"],
  [6, "жвачка с вкладышами", "mom"],
  [7, "рюкзак", "mom"], [7, "школьная форма", "dad"],
  [8, "велосипед", "dad"],
  [9, "чипсы Lay's", "mom"],
  [10, "PlayStation", "dad"],
  [11, "кола", "mom"],
  [12, "первый телефон", "dad"],
  [13, "компьютер", "dad"],
  [14, "шаурма", "mom"],
  [15, "кроссовки Nike", "mom"],
  [16, "скейт", "dad"],
  [17, "костюм", "mom"], [17, "репетитор", "dad"],
  [18, "банковская карта", "me"], [18, "пиво", "me"], [18, "Доширак", "me"],
  [19, "общага", "me"],
  [20, "первая кредитка", "me"],
  [21, "роллы", "me"],
  [22, "кофе навынос", "me"],
  [24, "IKEA", "me"],
  [25, "Турция", "me"],
  [26, "абонемент в зал", "me"],
  [27, "кольцо", "me"], [27, "банкет", "me"],
  [29, "ремонт", "me"],
  [30, "вино", "me"], [30, "виски", "me"], [30, "подгузники", "me", "son"],
  [31, "PlayStation 5", "me"],
  [32, "доставка еды", "me"],
  [33, "LEGO сыну", "me", "son"],
  [35, "Сочи с ребёнком", "me"],
  [36, "витамины", "me"],
  [37, "школьная форма сыну", "me", "son"],
  [38, "стоматолог", "me"],
  [39, "смузи", "me"],
  [40, "брокколи", "me"], [40, "коньяк", "me"],
  [41, "фитнес-браслет", "me"],
  [42, "Lay's сыну", "me", "son"],
  [43, "посудомойка", "me"],
  [44, "велосипед сыну", "me", "son"],
  [46, "спиннинг", "me"],
  [47, "репетитор сыну", "me", "son"],
  [50, "творог 0%", "me"],
  [53, "рассада", "me"],
  [55, "кольцо", "me", "son"], [55, "банкет", "me", "son"],
  [57, "тонометр", "me"],
  [58, "подгузники", "son", "grand"],
  [60, "овсянка", "me"],
  [62, "LEGO внуку", "me", "grand"],
  [63, "санаторий", "me"],
  [67, "корвалол", "me"],
  [68, "PlayStation внуку", "me", "grand"],
  [70, "кефир", "me"], [70, "кнопочный телефон", "me"],
  [72, "аптека", "me"],
  [75, "слуховой аппарат", "me"],
  [78, "каша", "me"],
  [80, "сиделка", "son", "me"],
  [82, "бульон", "me"],
];

/** The last purchase, made by the son after «Я» is gone. */
export const FUNERAL: [number, string][] = [
  [84.25, "похоронное бюро"],
  [84.55, "памятник"],
];

export const EVENTS: [number, string][] = [
  [3, "садик"],
  [7, "первый класс"],
  [17, "выпускной"],
  [18, "свои деньги"],
  [22, "первая работа"],
  [27, "свадьба"],
  [30, "сын"],
  [48, "ипотека закрыта"],
  [55, "свадьба сына"],
  [58, "внук"],
  [65, "пенсия"],
];

// ---- clock -----------------------------------------------------------------
const smooth = (x: number) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));
const speedAt = (t: number) => 1.1 - 0.8 * smooth((t - 75) / 5);
const STEPS_PER_FRAME = 4;
const MAX_S = 120;
const RAW_AGES: number[] = (() => {
  const out: number[] = [];
  let age = -1.5;
  const dt = 1 / FPS / STEPS_PER_FRAME;
  for (let f = 0; f <= MAX_S * FPS; f++) {
    out.push(age);
    for (let s = 0; s < STEPS_PER_FRAME; s++) age += speedAt((f + s / STEPS_PER_FRAME) / FPS) * dt;
  }
  return out;
})();

export const FINALE_FRAME = RAW_AGES.findIndex((a) => a >= 84);
export const TAIL_S = 10.5;
export const DURATION = Math.ceil(FINALE_FRAME / FPS + TAIL_S);
export const AGES = RAW_AGES.slice(0, DURATION * FPS + 1);

export const ageAt = (frame: number) => AGES[Math.max(0, Math.min(AGES.length - 1, Math.floor(frame)))];
export const frameOfAge = (age: number) => {
  const i = AGES.findIndex((a) => a >= age);
  return i < 0 ? AGES.length : i;
};

// ---- lanes -----------------------------------------------------------------
export const laneX = (p: Pick<Thread, "xs">, age: number) => {
  const xs = p.xs;
  if (age <= xs[0][0]) return xs[0][1];
  for (let i = 1; i < xs.length; i++) {
    const [a1, x1] = xs[i];
    const [a0, x0] = xs[i - 1];
    if (age <= a1) return x0 + (x1 - x0) * smooth((age - a0) / (a1 - a0));
  }
  return xs[xs.length - 1][1];
};

const famX = (id: string, age: number) => laneX(FAMILY.find((f) => f.id === id)!, age);

// ---- star field for purchases: a jittered grid above the now line ---------
const rnd = (n: number) => {
  const x = Math.sin(n * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};
// Purchase stars fill the sky row by row like a meander (left to right, then
// back), so the finale path that joins them in order reads as one long road.
const COLS = 14;
const ROWS = 6;
const CELLS: [number, number][] = [];
for (let r = 0; r < ROWS; r++) {
  for (let j = 0; j < COLS; j++) {
    const c = r % 2 === 0 ? j : COLS - 1 - j;
    const x = 115 + c * 66 + (rnd(r * 31 + c) - 0.5) * 34;
    const y = 360 + r * 84 + Math.sin(c * 0.9 + r) * 14 + (rnd(r * 17 + c * 3 + 5) - 0.5) * 30;
    CELLS.push([x, y]);
  }
}
let cell = 0;
const nextStar = (): [number, number] => CELLS[cell++ % CELLS.length];

// ---- build short purchases --------------------------------------------------
const HOLD = 0.85; // years a purchase rides before it rises
const buyThreads: Thread[] = (() => {
  const out: Thread[] = [];
  const perAge = new Map<number, number>();
  let meSide = 0;
  BUYS.forEach(([age, label, payer, near], i) => {
    const k = perAge.get(age) ?? 0;
    perAge.set(age, k + 1);
    const start = age + k * 0.3 + 0.05;
    const end = start + HOLD;
    const from = famX(payer, start);
    let x: number;
    if (near === "son") x = famX("son", start) + (start < 57 ? 90 : -85);
    else if (near === "grand") x = LANE.grand - 85;
    else if (near === "me") x = LANE.me + 85;
    else if (payer === "mom") x = from - 110;
    else if (payer === "dad") x = from + 100;
    else x = LANE.me + (meSide++ % 2 === 0 ? -88 : 88);
    out.push({
      id: `buy${i}`,
      labels: [[-9, label]],
      color: BUY_COLORS[i % BUY_COLORS.length],
      kind: "buy",
      start,
      end,
      endKind: "star",
      xs: [[start, from], [start + 0.35, x], [end, x]],
      labelDy: i % 2 === 1 ? -150 : -102,
      wobble: [2, 1],
    });
  });
  return out;
})();

const funeralThreads: Thread[] = FUNERAL.map(([start, label], k) => ({
  id: `funeral${k}`,
  labels: [[-9, label]],
  color: "#c9cde0",
  kind: "buy",
  start,
  end: FOREVER,
  endKind: "stay",
  xs: [[start, famX("son", start)], [start + 0.25, famX("son", start) + (k === 0 ? -150 : 150)]],
  labelDy: -40,
  wobble: [2, 1],
}));

// stars are handed out in purchase order, so the finale path walks the life
const withStars = [...LONG, ...buyThreads].sort((a, b) => a.end - b.end);
withStars.forEach((t) => (t.star = nextStar()));

export const THREADS: Thread[] = [...FAMILY, ...LONG, ...buyThreads, ...funeralThreads];

/** Purchase stars in the order they were bought: the finale draws this path. */
export const PATH: [number, number][] = withStars.map((t) => t.star!);

export const labelAt = (t: Thread, age: number) => {
  let s = t.labels[0][1];
  for (const [a, l] of t.labels) if (age >= a) s = l;
  return s;
};

export const wobbleX = (p: Thread, age: number, seed: number) => {
  const [amp, freq] = p.wobble ?? [5, 1.1];
  return Math.sin(age * freq + seed * 6.28) * amp + Math.sin(age * freq * 2.7 + seed * 3.1) * amp * 0.45;
};
