// The data behind the years beat: four years, one frame each. Every figure
// has its source next to it; WORK.md in the brief carries the same list.
//
// nominal — Росстат, среднемесячная номинальная начисленная зарплата, ₽
//   (tab3-zpl-2025.xlsx, редакция 2026: 2014 32 495 · 2018 43 724 ·
//   2022 65 338 · 2025 101 784; 2013 = хук, округлено из 29 792).
// real    — зарплата в ценах 2013: 30 000 × Π(реальная з/п, % к пред. году)
//   2014 101,2 · 2015 91,0 · 2016 100,8 · 2017 102,9 · 2018 108,5 · 2019 104,8
//   · 2020 103,8 · 2021 104,5 · 2022 101,0 · 2023 107,8 · 2024 109,7 · 2025 104,4
//   (2014–2016, 2018, 2023, 2025 сверены; остальное — сверить с Росстатом).
// leader  — верхняя строка той же таблицы Росстата за год.

const BASE = 30000;
const IDX: Record<number, number> = {
  2014: 1.012, 2015: 0.91, 2016: 1.008, 2017: 1.029, 2018: 1.085, 2019: 1.048,
  2020: 1.038, 2021: 1.045, 2022: 1.01, 2023: 1.078, 2024: 1.097, 2025: 1.044,
};
const realIn = (year: number) => {
  let v = BASE;
  for (let y = 2014; y <= year; y += 1) v *= IDX[y];
  return Math.round(v);
};

export type YearState = {
  year: number;
  nominal: number;
  real: number;
  /** One line under the year: what happened. */
  event?: { text: string; tone: "bad" | "paper" };
  /** The best-paid industry of the year and its clip. */
  leader?: { who: string; amount: number; clip: string };
  /** Receipt-tape artifacts under the readout. */
  tape: string[];
};

// tape: цены — инфляция дек/дек (Росстат); $ — средний курс ЦБ за год;
// нефть — Brent, средняя за год (EIA).
export const YEARS: YearState[] = [
  { year: 2013, nominal: BASE, real: BASE, tape: ["ЦЕНЫ +6,5%", "$ 31,8 ₽", "НЕФТЬ $109"] },
  {
    year: 2014,
    nominal: 32495,
    real: realIn(2014), // 30 360
    event: { text: "16 ДЕКАБРЯ · ЧЁРНЫЙ ВТОРНИК · $ ДО 80 ₽", tone: "bad" }, // Мосбиржа, внутри дня 80,10
    leader: { who: "НЕФТЕ-\nПЕРЕРАБОТКА", amount: 75517, clip: "refinery" },
    tape: ["ЦЕНЫ +11,4%", "$ 38,4 ₽", "НЕФТЬ $99"],
  },
  {
    year: 2018,
    nominal: 43724,
    real: realIn(2018), // 31 092
    event: { text: "РЕКОРД · РЕАЛЬНО +8,5% ЗА ГОД", tone: "paper" },
    leader: { who: "НЕФТЬ И ГАЗ", amount: 127771, clip: "drilling" },
    tape: ["ЦЕНЫ +4,3%", "$ 62,7 ₽", "НЕФТЬ $71"],
  },
  {
    year: 2022,
    nominal: 65338,
    real: realIn(2022), // 35 698
    event: { text: "САНКЦИИ · $ = 120 ₽ (ЦБ, 11 МАРТА)", tone: "bad" },
    leader: { who: "НЕФТЬ И ГАЗ", amount: 165624, clip: "gas-flare" },
    tape: ["ЦЕНЫ +11,9%", "$ 68,5 ₽", "НЕФТЬ $101"],
  },
  {
    year: 2025,
    nominal: 101784,
    real: realIn(2025), // 44 073
    event: { text: "ВПЕРВЫЕ БОЛЬШЕ 100 000 ₽", tone: "paper" },
    leader: { who: "НЕФТЬ И ГАЗ", amount: 219014, clip: "oil-rig" },
    tape: ["ЦЕНЫ +5,6%", "НА БУМАГЕ ×3,4", "ФИНАНСЫ 216 870 ₽"], // финансы — второе место 2025 (Росстат)
  },
];

/** ₽ per pack on screen. */
export const PACK_VALUE = 10000;

/** Real change since 2013, % — the final stamp. 2025: +47 %. */
export const realSince2013 = (i: number) => Math.round((YEARS[i].real / BASE - 1) * 100);
