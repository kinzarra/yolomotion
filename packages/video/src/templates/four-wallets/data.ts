// The four lives. Values are «what this person has at hand», million ₽:
// own money, the husband's, the father's. Composite characters, not real
// people; the figures are round on purpose.
//
// keys: [age, value]; the value eases from one key to the next, so a jump
// is two keys half a year apart.
import { fwColors } from "./palette";

export type LifeEvent = {
  age: number;
  title: string;
  sub: string;
  loss?: boolean; // the sub-line is a minus: red
  shake?: boolean; // a crash: the chart shakes
};

export type Hero = {
  key: "worker" | "business" | "wife" | "major";
  name: string;
  photo: string;
  face: string; // facecrop.swift head-and-shoulders, for the legend
  color: string;
  keys: [number, number][];
  events: LifeEvent[];
  phase: number; // wobble phase, so the trails do not wave in step
};

export const HEROES: Hero[] = [
  {
    key: "worker",
    name: "НАЁМНЫЙ",
    photo: "images/four-wallets/worker.png",
    face: "images/four-wallets/worker-face.png",
    color: fwColors.worker,
    phase: 0.3,
    keys: [[18, 0], [22.5, 0], [23, 0.1], [30.5, 1.2], [31, 2], [36.5, 4], [37, 3], [48.5, 9], [49, 10], [65, 18]],
    events: [
      { age: 23, title: "ПЕРВАЯ РАБОТА", sub: "60 000 ₽ В МЕСЯЦ" },
      { age: 31, title: "ИПОТЕКА", sub: "ДВУШКА ЗА 9 МЛН ₽" },
      { age: 37, title: "СОКРАЩЕНИЕ", sub: "−1 МЛН ₽", loss: true },
      { age: 49, title: "ИПОТЕКА ЗАКРЫТА", sub: "КВАРТИРА СВОЯ" },
    ],
  },
  {
    key: "business",
    name: "БИЗНЕСМЕН",
    photo: "images/four-wallets/business.png",
    face: "images/four-wallets/business-face.png",
    color: fwColors.business,
    phase: 1.9,
    keys: [[18, 0], [24.5, 0.4], [25, -2], [26.5, -1.5], [27, -2.5], [32.5, -2], [33, 3], [38.5, 15], [39, 1], [42, 6], [50.5, 30], [51, 60], [65, 70]],
    events: [
      { age: 25, title: "КРЕДИТ НА БИЗНЕС", sub: "ДОЛГ 2 МЛН ₽", loss: true },
      { age: 27, title: "ПРОГОРЕЛ", sub: "ДОЛГ 2,5 МЛН ₽", loss: true, shake: true },
      { age: 33, title: "ВТОРОЙ БИЗНЕС", sub: "ПОШЛО" },
      { age: 39, title: "КРИЗИС", sub: "−14 МЛН ₽", loss: true, shake: true },
      { age: 51, title: "ПРОДАЛ БИЗНЕС", sub: "+30 МЛН ₽" },
    ],
  },
  {
    key: "wife",
    name: "УДАЧНО ВЫШЛА ЗАМУЖ",
    photo: "images/four-wallets/wife.png",
    face: "images/four-wallets/wife-face.png",
    color: fwColors.wife,
    phase: 3.4,
    keys: [[18, 0], [28.5, 0.5], [29, 40], [40.5, 42], [41, 2], [65, 6]],
    events: [
      { age: 29, title: "СВАДЬБА", sub: "+40 МЛН ₽ МУЖА" },
      { age: 41, title: "РАЗВОД", sub: "БРАЧНЫЙ ДОГОВОР: −40 МЛН ₽", loss: true, shake: true },
    ],
  },
  {
    key: "major",
    name: "МАЖОР",
    photo: "images/four-wallets/major.png",
    face: "images/four-wallets/major-face.png",
    color: fwColors.major,
    phase: 5.1,
    keys: [[18, 25], [34.5, 10], [35, 3], [44.5, 2], [45, 40], [52.5, 36], [53, 15], [57.5, 12], [58, 4], [65, 2]],
    events: [
      { age: 21, title: "ТУСОВКИ", sub: "ДУБАЙ, МАШИНЫ, КЛУБЫ" },
      { age: 35, title: "ПАПА ПЕРЕСТАЛ ДАВАТЬ", sub: "−7 МЛН ₽", loss: true, shake: true },
      { age: 45, title: "НАСЛЕДСТВО", sub: "+38 МЛН ₽" },
      { age: 53, title: "РЕСТОРАН ПРОГОРЕЛ", sub: "−21 МЛН ₽", loss: true, shake: true },
      { age: 58, title: "КРИПТА", sub: "−8 МЛН ₽", loss: true },
    ],
  },
];

/** Final order, richest first. */
export const RANKING = [...HEROES]
  .sort((a, b) => b.keys[b.keys.length - 1][1] - a.keys[a.keys.length - 1][1])
  .map((h) => h.key);

/** The highest key of a life: where its star stays. */
export const peakOf = (h: Hero) =>
  h.keys.reduce((best, k) => (k[1] > best[1] ? k : best), h.keys[0]);
