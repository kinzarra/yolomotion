// Figures behind the reel. Sources per number: scripts/scenarios/zhkh-receipt.md
// and studio/briefs/zhkh-receipt/brief.md. Example household on screen:
// Moscow, 54 m², 3 people, gas stove, water meters, a building fed after the heat point.
// Tariffs: Moscow from 01.10.2026 (ДЭПиР Москвы; amoskva.com/news/572848, t-j.ru/zhkh-msk).
export const SERIES = "ДЕНЬГИ · ПРОСТО";
export const EPISODE = "ВЫПУСК 19";
export const IMG = "images/zhkh-receipt/";

export type ReceiptRow = { key: string; label: string; before: string; after: string };
export const RECEIPT = {
  title: "ЕПД · 10.2026",
  number: "54 М² · 3 ЧЕЛ",
  before: 9410,
  after: 10567,
  deltaNum: "+1 157",
  deltaUnit: "/ МЕС",
  rows: [
    { key: "hotwater", label: "ГОРЯЧАЯ ВОДА", before: "1 667,98", after: "1 983,45" },
    { key: "heating", label: "ОТОПЛЕНИЕ", before: "3 283,79", after: "3 627,92" },
    { key: "power", label: "ЭЛЕКТРОЭНЕРГИЯ", before: "2 400,00", after: "2 670,00" },
    { key: "water", label: "ХОЛОДНАЯ ВОДА", before: "702,14", after: "774,80" },
    { key: "water", label: "ВОДООТВЕДЕНИЕ", before: "826,56", after: "948,78" },
    { key: "gas", label: "ГАЗ", before: "74,10", after: "82,58" },
    { key: "tko", label: "ВЫВОЗ ТКО", before: "455,22", after: "478,98" },
  ] as ReceiptRow[],
};

export type Meme = { src: string; w: number; ratio: number; cut?: boolean };

export type Service = {
  key: "hotwater" | "heating" | "power" | "water";
  clip?: "hot-water" | "heating" | "water"; // footage/zhkh-receipt/<clip>.mp4, in a tile under the photo
  meme?: Meme; // the author's meme, bottom left (notes 5, 6)
  chips?: string[]; // extra artefacts, right column (note 10)
  card?: boolean; // photo on a white card instead of a cut-out
  wordmarkLeft?: boolean; // the supplier chip under the tile's left edge when the photo hangs low (note 15)
  title: string;
  oldTariff: string;
  newTariff: string;
  unit: string;
  pct: string;
  year: number; // +₽ per year in the example household
  volume: string; // the assumption, printed under the number
  brand: string; // supplier wordmark
  photo?: string; // none on hot water: the author removed the mixer (note 12)
  photoW: number;
  photoRatio: number; // w / h
  photoX: number;
  photoY: number;
  rot: number;
  extra?: string; // a second tariff line (water: disposal)
  note?: string;
};

export const SERVICES: Service[] = [
  {
    key: "hotwater",
    title: "ГОРЯЧАЯ ВОДА",
    oldTariff: "317,71",
    newTariff: "377,80",
    unit: "₽ / М³",
    pct: "+18,9%",
    year: 3786,
    volume: "5,25 М³ В МЕСЯЦ · СЕМЬЯ ИЗ 3",
    brand: "МОЭК",
    clip: "hot-water",
    photoW: 0,
    photoRatio: 1,
    photoX: 0,
    photoY: 0,
    rot: 0,
    meme: { src: IMG + "meme-swamp.jpg", w: 380, ratio: 547 / 365 },
  },
  {
    key: "heating",
    title: "ОТОПЛЕНИЕ",
    oldTariff: "3 800,68",
    newTariff: "4 198,98",
    unit: "₽ / ГКАЛ",
    pct: "+10,5%",
    year: 4130,
    volume: "0,864 ГКАЛ · НОРМАТИВ МОСКВЫ 0,016 × 54 М²",
    brand: "МОЭК",
    clip: "heating",
    photo: IMG + "03-heating.png",
    photoW: 190,
    photoRatio: 334 / 843,
    photoX: 830,
    photoY: 1200, // moved down (note 15)
    rot: -4,
    wordmarkLeft: true,
    meme: { src: IMG + "meme-frozen.png", w: 460, ratio: 664 / 376, cut: true },
  },
  {
    key: "power",
    title: "СВЕТ",
    oldTariff: "8,00",
    newTariff: "8,90",
    unit: "₽ / КВТ·Ч",
    pct: "+11,3%",
    year: 3240,
    volume: "300 КВТ·Ч В МЕСЯЦ · ДОМ С ГАЗОВОЙ ПЛИТОЙ",
    brand: "МОСЭНЕРГОСБЫТ",
    photo: IMG + "cat-lamp.jpg", // author's image (note 7)
    card: true,
    photoW: 520,
    photoRatio: 592 / 517,
    photoX: 540,
    photoY: 720,
    rot: 3,
  },
  {
    key: "water",
    title: "ХОЛОДНАЯ ВОДА",
    oldTariff: "66,87",
    newTariff: "73,79",
    unit: "₽ / М³",
    pct: "+10,3%",
    extra: "И КАНАЛИЗАЦИЯ: 52,48 → 60,24 ₽/М³ · +14,8%",
    year: 2339,
    volume: "10,5 М³ ХОЛОДНОЙ · 15,75 М³ В КАНАЛИЗАЦИЮ",
    note: "ГАЗ И МУСОР: ЕЩЁ +387 ₽ В ГОД",
    brand: "МОСВОДОКАНАЛ",
    clip: "water",
    photo: IMG + "dirty-water.jpg", // author's image (note 9)
    card: true,
    photoW: 440,
    photoRatio: 738 / 411,
    photoX: 580,
    photoY: 1345, // moved under the tile (note 16)
    rot: -4,
    chips: ["КАНАЛИЗАЦИЯ: +14,8%", "15,75 М³ В МЕСЯЦ", "КАЖДЫЙ КУБ: ВОДА + СТОК"],
  },
];

export const HOOK = {
  words: ["ТВОЯ", "КВИТАНЦИЯ"],
  meme: { src: IMG + "meme-boy.png", w: 300, ratio: 326 / 377, cut: true } as Meme, // «ну давай, расскажи» (note 2)
  // icons round the bill before the face lands (notes 3, 13, 14: icons instead of cut-outs)
  icons: [
    { kind: "drop", label: "ГОРЯЧАЯ", value: "+18,9%", x: 630, y: 520, rot: -6 },
    { kind: "bolt", label: "СВЕТ", value: "+11,3%", x: 840, y: 480, rot: 5 },
    { kind: "flame", label: "ГАЗ", value: "+11,4%", x: 630, y: 760, rot: 4 },
    { kind: "radiator", label: "ТЕПЛО", value: "+10,5%", x: 840, y: 720, rot: -5 },
  ] as { kind: "drop" | "bolt" | "flame" | "radiator"; label: string; value: string; x: number; y: number; rot: number }[],
  chips: ["МОСКВА: +15%", "РЕГИОНЫ: ОТ 8% ДО 22%", "ВТОРОЙ РАЗ ЗА ГОД"],
};

export const TOTAL = {
  spoken: 14000, // what the voice says: «четырнадцать тысяч»
  year: 13881,
  label: "ТОЧНЕЕ: +13 881 ₽ · ТА ЖЕ КВАРТИРА · 12 МЕСЯЦЕВ",
  bars: [
    ["ВОДА", 6124],
    ["ОТОПЛЕНИЕ", 4130],
    ["СВЕТ", 3240],
    ["ГАЗ И МУСОР", 387],
  ] as [string, number][],
  days: "4 РАБОЧИХ ДНЯ",
  daysLabel: "ПРИ МЕДИАННОЙ ЗАРПЛАТЕ 73 871 ₽ · РОССТАТ",
  fuel: "3,5 БАКА АИ-95",
  fuelLabel: "173 Л × 80,3 ₽ · РОССТАТ, 13–19.10.2026",
  fuelPhoto: IMG + "06-total.png",
  next: "1 ИЮЛЯ 2027: ЕЩЁ +11%",
  nextLabel: "ПРОГНОЗ МИНЭКОНОМРАЗВИТИЯ",
  you: "У ТЕБЯ: ОТ 8% ДО 22% · ПИШИ СУММУ И ГОРОД",
  like: "ЛАЙК",
  subscribe: "ПОДПИСАТЬСЯ",
  sources: "ТАРИФЫ: ДЭПИР МОСКВЫ С 01.10.2026 · ОТОПЛЕНИЕ: ПП МОСКВЫ № 41 · РОССТАТ · МИНЭК",
};
