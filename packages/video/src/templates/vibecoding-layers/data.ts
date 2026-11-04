// Every word and figure on screen, with where it comes from.
export const SERIES = "ДЕНЬГИ · ПРОСТО";
export const EPISODE = "ВЫПУСК 20";

/** The ladder of what you had to know, bottom to top. */
export const LAYERS = ["ЧИСЛА", "КОМАНДЫ", "СИНТАКСИС", "КУБИКИ", "ИДЕЯ"] as const;

/** The era rail of the promise beat. */
export const ERAS = [
  { year: "1950", label: "ПЕРФОКАРТЫ" },
  { year: "1960", label: "ASSEMBLER" },
  { year: "1972", label: "C · C++" },
  { year: "2000", label: "ФРЕЙМВОРКИ" },
  { year: "2025", label: "ЯЗЫК" },
] as const;

export const GRAVE = { name: "ПРОГРАММИРОВАНИЕ", years: "1950 · 2025", rip: "ПОКОЙСЯ С МИРОМ" };

/** The eight holes of one column-row, read as да/нет. */
export const BITS = [1, 0, 1, 1, 0, 0, 1, 0] as const;
/** The hole punched by mistake on «Ошибся». */
export const WRONG_BIT = 5;

// Apollo Guidance Computer software was written in assembly at MIT; Margaret Hamilton led it.
export const ASM = [
  { op: "ADD", arg: "A, 5", say: "СЛОЖИ" },
  { op: "MOV", arg: "B, A", say: "ПЕРЕНЕСИ" },
  { op: "CMP", arg: "B, 10", say: "СРАВНИ" },
] as const;

// C: Dennis Ritchie, Bell Labs, 1972.
export const C_LINES = ["int total = 0;", "total = total + price;", 'printf("%d", total)'] as const;
export const C_BINARY = "10110010 01101001";

export const BRICKS = ["КНОПКА", "ОПЛАТА", "ВХОД"] as const;

// «Vibe coding»: Andrej Karpathy, post of 2 Feb 2025; Collins Word of the Year 2025.
export const PROMPT = "сделай приложение, которое считает мои траты";
export const APP = {
  title: "МОИ ТРАТЫ",
  month: "ОКТЯБРЬ",
  rows: [
    { label: "ПРОДУКТЫ", value: "18 400" },
    { label: "ТАКСИ", value: "3 200" },
    { label: "КАФЕ", value: "5 100" },
  ],
  total: "26 700",
};

export const CREDITS =
  "ФОТО: M. HAMILTON, ЛУНА LRO (NASA, PD) · D. RITCHIE (DENISE PANYIK-DALE, CC BY 2.0) · A. KARPATHY (FORBES.UA) · ВИДЕО: NASA, DETROIT 1957 (PD), PEXELS";

/** The two mourners by the candle in the last beat: sad DiCaprio and Affleck, cut from the author's pictures (2026-10-24 notes 17–20). */
export const MOURNERS = [
  { src: "dicaprio-cut", x: 10, y: 400, w: 340, ratio: 930 / 1020, rot: -6 },
  { src: "affleck-cut", x: 740, y: 430, w: 330, ratio: 1024 / 1020, rot: 6 },
] as const;

/** Language logos thrown onto the grave like flowers (note 16). Commons, public domain. */
export const LANGS = [
  { f: "python", x: 300, y: 1640, rot: -12 },
  { f: "csharp", x: 430, y: 1660, rot: 8 },
  { f: "cpp", x: 560, y: 1645, rot: -6 },
  { f: "js", x: 690, y: 1650, rot: 14 },
  { f: "c", x: 250, y: 1500, rot: 10 },
  { f: "ts", x: 740, y: 1500, rot: -10 },
  { f: "go", x: 330, y: 1770, rot: 4 },
  { f: "ruby", x: 480, y: 1780, rot: -14 },
  { f: "kotlin", x: 610, y: 1770, rot: 9 },
  { f: "php", x: 740, y: 1775, rot: -4 },
] as const;
