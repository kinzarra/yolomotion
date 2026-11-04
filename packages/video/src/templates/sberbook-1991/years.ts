// The data behind the years beat. Every figure has its source next to it;
// scripts/scenarios/sberbook-1991.md and the brief's WORK.md carry the same list.
//
// infl — Росстат, индекс потребительских цен, декабрь к декабрю, % за год
//   (таблица на уровень-инфляции.рф по данным Росстата, снята 2026-10-17).
// The deposit: 10 000 руб. on a Сбербанк СССР book as of 20.06.1991.
// Compensation: balance × 3 (born up to 1945) / × 2 (1946–1991), coefficient
// 1,0 for a deposit still open or closed in 1996 or later — Правительство РФ,
// ежегодное постановление; выплачивает Сбербанк. Max for 10 000 → 30 000 ₽.
// Average salary 1991: 548 руб./мес (Росстат) → 10 000 = 18 salaries.

const INFL: Record<number, number> = {
  1992: 2508.85, 1993: 839.87, 1994: 215.02, 1995: 131.33, 1996: 21.81, 1997: 11.03,
  1998: 84.44, 1999: 36.56, 2000: 20.2, 2001: 18.58, 2002: 15.06, 2003: 11.99,
  2004: 11.74, 2005: 10.91, 2006: 9.0, 2007: 11.87, 2008: 13.28, 2009: 8.8,
  2010: 8.78, 2011: 6.1, 2012: 6.58, 2013: 6.45, 2014: 11.36, 2015: 12.91,
  2016: 5.38, 2017: 2.52, 2018: 4.27, 2019: 3.05, 2020: 4.91, 2021: 8.39,
  2022: 11.92, 2023: 7.42, 2024: 9.51, 2025: 5.6,
};

/** Prices of December `year` against December 1991, times. */
export const pricesSince1991 = (year: number) => {
  let k = 1;
  for (let y = 1992; y <= year; y += 1) k *= 1 + INFL[y] / 100;
  return k;
};

export const DEPOSIT = 10000; // руб. on the book, 20.06.1991
export const NOTE_VALUE = 100; // the grid: 100 notes of 100 руб.
export const NOTES_TOTAL = DEPOSIT / NOTE_VALUE;
export const SALARY_1991 = 548; // руб./мес, Росстат

/** What the 10 000 buy, in December-1991 rubles. */
export const realIn = (year: number) => DEPOSIT / pricesSince1991(year);

/** 10 000 руб. of 1991 in today's (Dec 2025) rubles, after the 1998 ÷1000. */
export const NEED_TODAY = Math.round((DEPOSIT * pricesSince1991(2025)) / 1000); // 629 141 ₽
export const RETURNED = 30000; // ₽ — the most the compensation pays for 10 000
export const LOSS_PCT = Math.round((1 - RETURNED / NEED_TODAY) * 100); // 95
/** The same 629 141 ₽ as 5 000 ₽ notes — the wall the six returned notes sit in. */
export const NEED_NOTES = Math.round(NEED_TODAY / 5000); // 126
/** 629 141 → 629 000 for the frame; the description carries the exact figure. */
export const NEED_SHOWN = Math.round(NEED_TODAY / 1000) * 1000;

export type YearState = {
  year: number;
  /** The odometer text; «СЕГОДНЯ» for the last frame. */
  label: string;
  /** Purchasing power of the deposit in 1991 rubles. */
  real: number;
  /** What the book says. */
  onBook: string;
  /** One line under the year. */
  event?: { text: string; tone: "bad" | "paper" };
  /** Red chip by the notes. */
  chip?: string;
  /** Evidence clip over the object, if any. */
  clip?: string;
  /** Receipt tape under the readout. */
  tape: string[];
};

const times = (year: number) => `×${Math.round(pricesSince1991(year)).toLocaleString("ru-RU").replace(/\s/g, " ")}`;

// Index 0 is the state the scene opens on (the hook's 1991); the frames that
// follow are YRS.years[1..].
export const YEARS: YearState[] = [
  {
    year: 1991,
    label: "1991",
    real: DEPOSIT,
    onBook: "10 000 РУБ.",
    tape: ["ВКЛАД 10 000 РУБ.", "ЗАРПЛАТА 548 РУБ./МЕС", "100 КУПЮР ПО 100"],
  },
  {
    year: 1992,
    label: "1992",
    real: realIn(1992), // 383
    onBook: "10 000 РУБ.",
    event: { text: "2 ЯНВАРЯ · ЦЕНЫ ОТПУЩЕНЫ", tone: "bad" },
    chip: "ЦЕНЫ ×26 ЗА ГОД",
    clip: "volga",
    tape: ["ЦЕНЫ +2 509%", "ИЗ 100 КУПЮР ОСТАЛОСЬ 4", "ВКЛАД 10 000 РУБ."],
  },
  {
    year: 1993,
    label: "1993",
    real: realIn(1993), // 41
    onBook: "10 000 РУБ.",
    event: { text: "ЕЩЁ ×9,4 ЗА ГОД", tone: "bad" },
    chip: `С 1991: ЦЕНЫ ${times(1993)}`,
    tape: ["ЦЕНЫ +840%", "ОСТАЛОСЬ 0,4 КУПЮРЫ", "ВКЛАД 10 000 РУБ."],
  },
  {
    year: 1995,
    label: "1995",
    real: realIn(1995), // 6
    onBook: "10 000 РУБ.",
    event: { text: "ЗАКОН 73-ФЗ: ВКЛАДЫ — ГОСДОЛГ", tone: "paper" },
    chip: `С 1991: ЦЕНЫ ${times(1995)}`,
    tape: ["ЦЕНЫ +131%", "10 000 РУБ. = 6 РУБ. 1991-ГО", "ГОСУДАРСТВО ОБЕЩАЕТ ВЕРНУТЬ"],
  },
  {
    year: 1998,
    label: "1998",
    real: realIn(1998), // 2
    onBook: "10 ₽",
    // «÷» is missing from the loaded fonts (renders as «+») — spelled out
    event: { text: "ДЕНОМИНАЦИЯ: МИНУС ТРИ НУЛЯ · НА КНИЖКЕ 10 ₽", tone: "bad" },
    chip: `С 1991: ЦЕНЫ ${times(1998)}`,
    tape: ["ДЕФОЛТ · ЦЕНЫ +84%", "НА КНИЖКЕ 10 ₽", "10 000 РУБ. = 2 РУБ. 1991-ГО"],
  },
  {
    year: 2026,
    label: "2026",
    real: realIn(2025), // 0,16
    onBook: "10 000 × 3 = 30 000 ₽",
    event: { text: "СБЕРБАНК ВОЗВРАЩАЕТ ВКЛАД: 10 000 × 3", tone: "paper" },
    clip: "rubles",
    tape: ["ВЕРНУТ 30 000 ₽", "В ЦЕНАХ 2026: 629 000 ₽", "ПОТЕРЯНО 95%"],
  },
];

export const LAST = YEARS.length - 1;
