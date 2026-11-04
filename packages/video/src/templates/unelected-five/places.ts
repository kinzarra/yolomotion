// The countdown, as data. Frames are relative to each place's scene, at
// RECORDED speed (macOS ASR on the clip); PlaceScene divides by PLACE_SPEED.
export type Place = {
  rank: number;
  name: string;
  role: string;
  photo?: { src: string; width: number; ratio: number; credit: string; right?: number; bottom?: number; flip?: boolean };
  maskFallback?: string; // no free photo: the masked figure from the hook stays, with this chip
  stats: string[]; // short chips, top right, in order of `at.stats`
  clip: { src: string; from: number; label: string };
  num: { value: string; label: string };
  num2?: { value: string; label: string };
  stamp: { text: string; tone: "bad" | "hero"; label?: string };
  voice: string;
  at: { name: number; stats: number[]; clip: number; num: number; num2?: number; stamp: number };
  // the author's frame notes, as extra hits (raw frames)
  extras?: {
    cpu?: number; // his CPU photo lands next to the clip
    putin?: number; // his Putin photo rises under «В РОССИЮ: 0»
    tiktok?: number; // TikTok mark + ByteDance logo under the role
    crowd?: number; // a crowd band behind the number
    ticker?: { at: number; items: string[] }; // BlackRock's stakes, scrolling
    leaders?: number; // Цзян → Ху → Си with arrows to Wang
    flag?: number; // the PRC flag where the clip was
  };
};

// 04-place5 (re-recorded, numbers as digits) «Пятое@0 место@0.60 Кристоф@0.99 Фуке
// каждый@1.83 новый@2.19 чип@2.46 на планете@2.91 печатает@3.63 только@4.44
// его@4.74 машина@5.01 380@5.58 миллионов@6.54 долларов@7.02 за@7.44 штуку@7.56» (8.17 s).
// 48 EUV systems in 2025 — ASML Annual Report 2025; High-NA EXE ≈ $380M —
// Tom's Hardware / CNBC 2025; EU sanctions ban lithography exports to Russia.
export const PLACE5: Place = {
  rank: 5,
  name: "КРИСТОФ ФУКЕ",
  role: "ГЛАВА ASML · НИДЕРЛАНДЫ",
  photo: { src: "person-fouquet.png", width: 620, ratio: 1200 / 1996, credit: "ФОТО: EUROPEAN UNION / DATI BENDO (CC BY 4.0)", right: -40, bottom: 520 },
  stats: ["ЕДИНСТВЕННЫЙ В МИРЕ", "48 МАШИН EUV ЗА 2025", "НА ВСЮ ПЛАНЕТУ"],
  clip: { src: "chip.mp4", from: 2, label: "ЧИП · ВНУТРИ ТВОЕГО ТЕЛЕФОНА" },
  num: { value: "$380 МЛН", label: "ОДНА МАШИНА · HIGH-NA EUV" },
  stamp: { text: "В РОССИЮ: 0", tone: "bad", label: "САНКЦИИ ЕС: НИ ОДНОЙ МАШИНЫ" },
  voice: "04-place5",
  at: { name: 30, stats: [55, 74, 109], clip: 55, num: 167, stamp: 227 },
  extras: { cpu: 74, putin: 227 },
};

// 05-place4 «Четвёртое@0 Чжан@1.32 Имин@1.80 его@2.40 алгоритм@2.88 решает@3.42
// что смотрит@4.05 миллиард@4.50 человек@4.95 ушёл@5.52 в тень@5.94 и стал@6.84
// самым@7.17 богатым@7.65 в Азии@8.25» (9.10 s).
// $105bn, richest in Asia — Bloomberg Billionaires Index via Fortune 17.09.2026;
// TikTok > 1bn users — ByteDance; >50% voting control — Reuters. No free photo
// exists of him — he does not pose, so the mask stays.
export const PLACE4: Place = {
  rank: 4,
  name: "ЧЖАН ИМИН",
  role: "ОСНОВАТЕЛЬ BYTEDANCE · TIKTOK",
  photo: { src: "person-zhang.png", width: 560, ratio: 1, credit: "ФОТО: ИЗ МАТЕРИАЛОВ АВТОРА", right: -20, bottom: 640 },
  stats: ["1 МЛРД+ ЗРИТЕЛЕЙ", "УШЁЛ С ПОСТА CEO В 2021", "> 50% ГОЛОСОВ У НЕГО"],
  clip: { src: "feed.mp4", from: 3, label: "ЛЕНТА · ЕГО АЛГОРИТМ" },
  num: { value: "1 МЛРД+", label: "ЧЕЛОВЕК СМОТРЯТ, ЧТО ОН РЕШИЛ" },
  num2: { value: "$105 МЛРД", label: "№1 В АЗИИ · BLOOMBERG, 09.2026" },
  stamp: { text: "SHORTS И REELS: КОПИИ ЕГО TIKTOK", tone: "hero" },
  voice: "05-place4",
  at: { name: 40, stats: [86, 166, 190], clip: 86, num: 135, num2: 230, stamp: 252 },
  extras: { tiktok: 60, crowd: 135 },
};

// 06-place3 «Третье@0 Ларри@0.63 Финк его@1.56 Блэкрок@1.89 управляет@2.76
// пятнадцатью@3.48 с половиной@4.47 триллионами долларов@5.01 это@6.36
// тридцать@6.66 два@7.08 бюджета@7.35 России@7.86» (8.68 s).
// $15.5T AUM at 30.09.2026 — BlackRock 8-K, 14.10.2026; Russia's 2026 budget
// revenue 40 283 bn ₽ (Minfin) = $481bn at 83.76 ₽/$ (CBR 16.10.2026) → 32.2;
// largest shareholder in 88% of S&P 500 with Vanguard and State Street —
// Fichtner et al., Business and Politics 2017.
export const PLACE3: Place = {
  rank: 3,
  name: "ЛАРРИ ФИНК",
  role: "ГЛАВА BLACKROCK · США",
  photo: { src: "person-fink.png", width: 600, ratio: 1200 / 1813, credit: "ФОТО: EUROPEAN COMMISSION / KENA BETANCUR (CC BY 4.0)", right: -60, bottom: 580 },
  stats: ["$15,5 ТРЛН ПОД УПРАВЛЕНИЕМ", "88% КОМПАНИЙ S&P 500", "С VANGUARD И STATE STREET"],
  clip: { src: "chart.mp4", from: 2, label: "БИРЖА · ЕГО ДЕНЬГИ ВЕЗДЕ" },
  num: { value: "$15,5 ТРЛН", label: "ПОД УПРАВЛЕНИЕМ · SEC, 30.09.2026" },
  num2: { value: "32 БЮДЖЕТА РОССИИ", label: "ДОХОДЫ БЮДЖЕТА 2026 · МИНФИН" },
  stamp: { text: "88% S&P 500", tone: "bad" },
  voice: "06-place3",
  at: { name: 19, stats: [60, 83, 100], clip: 83, num: 104, num2: 200, stamp: 243 },
  // stakes: Apple 7,28% and Nvidia 7,56% (Motley Fool, 02.2025), Microsoft 7,45% (Techopedia), Amazon 6,1% (HedgeFundAlpha) — 13F snapshots, 2025
  extras: { ticker: { at: 83, items: ["APPLE 7,3%", "NVIDIA 7,6%", "MICROSOFT 7,5%", "AMAZON 6,1%", "ДОЛЯ BLACKROCK · 13F 2025"] } },
};

// 07-place2 «Второе@0 Ван Хунин@0.78 ты@1.59 не видел@1.83 его@2.07 по
// телевизору@2.34 тридцать@3.12 лет@3.60 он пишет@3.96 идеологию@4.32 для@4.92
// трёх@5.37 вождей@5.70 Китая@6.06 подряд@6.51» (7.25 s).
// Central Policy Research Office 2002–2020, in the apparatus since 1995;
// Politburo Standing Committee since 2017; CPPCC chairman since 2023 —
// Wikipedia / MERICS. «America Against America» (1991): copies at 16 660 ¥
// after 6 January 2021 — LRB, Barclay Bram, 2023.
export const PLACE2: Place = {
  rank: 2,
  name: "ВАН ХУНИН",
  role: "ИДЕОЛОГ КПК · №4 В КИТАЕ",
  photo: { src: "person-wang.png", width: 600, ratio: 1200 / 1601, credit: "ФОТО: PID BANGLADESH (PUBLIC DOMAIN)", right: -40, bottom: 600 },
  stats: ["В АППАРАТЕ ЦК С 1995", "ЦЗЯН → ХУ → СИ", "«АМЕРИКА ПРОТИВ АМЕРИКИ» · 1991"],
  clip: { src: "beijing.mp4", from: 0, label: "ПЕКИН · 1,4 МЛРД ЧЕЛОВЕК" },
  num: { value: "30 ЛЕТ", label: "ПИШЕТ, ЧТО ДУМАЕТ КИТАЙ" },
  stamp: { text: "1,4 МЛРД ЧЕЛОВЕК", tone: "bad", label: "НАСЕЛЕНИЕ КИТАЯ ЖИВЁТ ПО ЕГО ТЕКСТАМ" },
  voice: "07-place2",
  at: { name: 23, stats: [55, 100, 130], clip: 70, num: 94, num2: 161, stamp: 200 },
  extras: { leaders: 161, flag: 161 },
};

// 08-place1 «Первое@0 место@0.54 Тахнун@1.14 бен Заид@1.71 никогда@2.61 не
// снимает@3.39 очки@3.93 глава@4.77 спецслужб@5.16 брат@6.03 президента@6.42
// и полтора@7.68 триллиона@8.13 долларов@8.73 под@9.24 его рукой@9.66» (10.40 s).
// Three quarters of Abu Dhabi's $1.5T sovereign wealth — Bloomberg 05.09.2023;
// UAE national security adviser, brother of the president — Bloomberg Big
// Take 25.04.2024; the dark glasses — The Guardian / MoneyWeek.
export const PLACE1: Place = {
  rank: 1,
  name: "ТАХНУН БЕН ЗАИД",
  role: "СОВЕТНИК ПО НАЦБЕЗОПАСНОСТИ · ОАЭ",
  photo: { src: "person-tahnoon.png", width: 1150, ratio: 1200 / 897, credit: "ФОТО: THE WHITE HOUSE (PUBLIC DOMAIN)", right: -300, bottom: 560 },
  stats: ["НИКОГДА НЕ СНИМАЕТ ОЧКИ", "ГЛАВА СПЕЦСЛУЖБ", "БРАТ ПРЕЗИДЕНТА ОАЭ"],
  clip: { src: "abudhabi.mp4", from: 0, label: "АБУ-ДАБИ · ЕГО ДЕНЬГИ" },
  num: { value: "$1,5 ТРЛН", label: "3/4 ДЕНЕГ АБУ-ДАБИ · BLOOMBERG" },
  stamp: { text: "НЕ ИЗБРАН", tone: "bad" },
  voice: "08-place1",
  at: { name: 34, stats: [78, 143, 181], clip: 143, num: 230, stamp: 290 },
};

export const PLACES = [PLACE5, PLACE4, PLACE3, PLACE2, PLACE1];
