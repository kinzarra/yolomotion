// The countdown, as data. Frames are relative to each place's scene and are
// cut to the words of its voice clip (macOS ASR on the clip).
export type Place = {
  rank: number;
  name: string;
  role: string;
  photo: string; // public/images/usd-five-people/
  photoWidth: number;
  credit: string;
  act: string; // what they do
  from: string; // asset flowing out…
  to: string; // …and what it becomes
  when: string;
  result: string;
  resultHero: number[]; // word indices in lime
  resultBad?: number[]; // word indices in red
  toCross?: boolean; // the flow is blocked: cross the target out
  clip: string;
  // why this person weighs: short stat chips, top right
  stats: string[];
  logo?: string; // company logo, shown on a paper card instead of the role chip
  rig?: string; // a real object of their business, bottom right
  rigLabel?: string;
  meme?: string; // the author's reaction image on the result word
  memeWidth?: number;
  gauge?: number; // budget-rule cut-off price: live «Urals vs cut-off» card
  subscribe?: boolean; // the subscribe button beat (author's request, note 21)
  stamps?: string; // word slammed onto the photo as rubber stamps at the end
  at: { name: number; role: number; act: number; when: number; result: number; meme: number; sub?: number; stamps?: number };
};

// 06-place5 (take B, «Се́чин», «Рос Нефть») «Пятое@0 место@0.48 Игорь@1.02
// Сечин@1.44 Роснефть@2.04 продает@3.12 валюту@3.6 под@4.11 налоги@4.29
// и@5.07 рубль@5.1 каждый@5.4 месяц@5.79 крепнет@6.24».
// Stats: «почти 40% российской нефти» — Сечин на собрании акционеров;
// №2 в мире по добыче среди публичных компаний за 2025 (investfuture.ru);
// «крупнейший налогоплательщик» — годовой отчёт «Роснефти». Fact: in the end-of-month tax period exporters
// sell FX to pay taxes, which supports the ruble (The Moscow Times market
// reports 2023–2025).
export const PLACE5: Place = {
  rank: 5,
  name: "ИГОРЬ СЕЧИН",
  role: "ГЛАВА «РОСНЕФТИ»",
  photo: "sechin.png",
  photoWidth: 900,
  credit: "ФОТО: KREMLIN.RU (CC BY 4.0)",
  act: "ПРОДАЁТ ВАЛЮТУ",
  from: "usd-stack.png",
  to: "rub-pile.png",
  when: "КАЖДЫЙ МЕСЯЦ · ПОД НАЛОГИ",
  result: "РУБЛЬ КРЕПНЕТ",
  resultHero: [1],
  clip: "06-place5",
  stats: ["≈40% НЕФТИ РОССИИ", "№2 В МИРЕ ПО ДОБЫЧЕ", "КРУПНЕЙШИЙ НАЛОГОПЛАТЕЛЬЩИК"],
  logo: "rosneft-logo.png",
  rig: "jack5.png",
  rigLabel: "НЕФТЬ URALS",
  meme: "kot.png",
  at: { name: 31, role: 61, act: 94, when: 129, result: 153, meme: 187 },
};

// 07-place4 «Четвёртое@0 место Мухаммед@0.66 Бин@1.62 салман@1.86
// саудовский@2.49 принц@3.27 решает@3.75 сколько@4.35 нефти@4.77
// добывает@5.22 опек@5.94 плюс а значит@6.51 сколько@7.77 долларов@8.25
// придёт@8.76 в@9.15 Россию@9.24». Stats: Saudi Arabia — the largest crude
// exporter; leads OPEC+; PIF AUM $900bn+ (PIF annual report 2025). Export
// revenue reaches Russia with a 1–2 month lag (Bank of Russia).
export const PLACE4: Place = {
  rank: 4,
  name: "МУХАММЕД БИН САЛМАН",
  role: "НАСЛЕДНЫЙ ПРИНЦ · САУДОВСКАЯ АРАВИЯ",
  photo: "mbs.png",
  photoWidth: 640,
  credit: "ФОТО: NUMBER 10 (CC BY 2.0)",
  act: "РЕШАЕТ, СКОЛЬКО НЕФТИ",
  from: "oil-drum.png",
  to: "usd-stack.png",
  when: "ВЫРУЧКА — ЧЕРЕЗ 1–2 МЕСЯЦА",
  result: "СКОЛЬКО ДОЛЛАРОВ ПРИДЁТ",
  resultHero: [1],
  clip: "07-place4",
  stats: ["№1 ЭКСПОРТЁР НЕФТИ", "ЛИДЕР ОПЕК+", "ФОНД PIF > $900 МЛРД"],
  logo: "opec-logo.png",
  rig: "jack5.png",
  rigLabel: "КВОТЫ ОПЕК+",
  at: { name: 20, role: 75, act: 112, when: 157, result: 233, meme: 9999 },
};

// 08-place3 «Третье@0 место@0.48 Скотт Бессен министр@1.2 финансов@2.67
// США@3.12 санкции@4.02 против@4.83 российских@5.46 компаний@6.09 вводит@6.66
// его@7.08 ведомство@7.32 и@8.28 долларом@8.49 все@9.03 труднее@9.27
// попасть@9.96 в@10.47 Россию@10.56». OFAC sits in the Treasury; it
// sanctioned Rosneft and Lukoil in October 2025. Bessent is listed as
// Secretary on home.treasury.gov (checked 2026-10-16).
export const PLACE3: Place = {
  rank: 3,
  name: "СКОТТ БЕССЕНТ",
  role: "МИНИСТР ФИНАНСОВ США",
  photo: "bessent.png",
  photoWidth: 620,
  credit: "ФОТО: U.S. TREASURY (PD)",
  act: "ВВОДИТ САНКЦИИ",
  from: "usd-stack.png",
  to: "rub-pile.png",
  toCross: true,
  when: "КАЖДЫЙ НОВЫЙ ПАКЕТ",
  result: "ДОЛЛАРАМ ВСЁ ТРУДНЕЕ",
  resultHero: [],
  resultBad: [2],
  clip: "08-place3",
  stats: ["МИНФИН США", "OFAC — САНКЦИИ", "РОСНЕФТЬ И ЛУКОЙЛ · 2025"],
  logo: "treasury-seal.png",
  stamps: "SANCTIONS",
  at: { name: 27, role: 80, act: 121, when: 164, result: 255, meme: 9999, stamps: 284 },
};

// 09-place2 «Второе@0 место@0.51 Антон@0.96 Силуанов@1.47 министр@2.13
// финансов@2.55 нефть@3.39 дороже@3.72 59 $@5.1 Минфин@5.76 покупает@6.48
// валюту@7.08 дешевле@7.83 продает@8.73 и@9.42 так@9.63 каждый@9.87
// день@10.23». Budget rule 2026: Urals base price $59; above it the
// Ministry of Finance buys FX and gold for the NWF, below it sells
// (The Moscow Times 09.09.2025, 12.05.2026).
export const PLACE2: Place = {
  rank: 2,
  name: "АНТОН СИЛУАНОВ",
  role: "МИНИСТР ФИНАНСОВ РОССИИ",
  photo: "siluanov.png",
  photoWidth: 600,
  credit: "ФОТО: GOVERNMENT.RU (CC BY 4.0)",
  act: "ЦЕНА ОТСЕЧЕНИЯ $59",
  from: "rub-pile.png",
  to: "yuan.png",
  when: "ДОРОЖЕ — ПОКУПАЕТ · ДЕШЕВЛЕ — ПРОДАЁТ",
  result: "И ТАК КАЖДЫЙ ДЕНЬ",
  resultHero: [3],
  clip: "09-place2",
  stats: ["МИНФИН РОССИИ", "БЮДЖЕТНОЕ ПРАВИЛО", "ФОНД НАЦБЛАГОСОСТОЯНИЯ"],
  gauge: 59,
  meme: "fry.png",
  memeWidth: 400,
  at: { name: 29, role: 64, act: 102, when: 173, result: 283, meme: 262 },
};

// 10-place1 «Первое@0 место@0.57 Эльвира@1.23 Набиуллина@1.68 глава@2.34
// центробанка@2.61 ставка@3.66 14 %@5.04 держит@5.97 деньги@6.42 в рублях@6.87
// и@7.53 рубль@7.71 крепче@8.01». Key rate 14% since the 11.09.2026 decision
// (cbr.ru); head of the Bank of Russia since 2013; 8 rate meetings a year.
export const PLACE1: Place = {
  rank: 1,
  name: "ЭЛЬВИРА НАБИУЛЛИНА",
  role: "ГЛАВА ЦЕНТРОБАНКА",
  photo: "nabiullina.png",
  photoWidth: 600,
  credit: "ФОТО: ПРЕСС-СЛУЖБА ГОСДУМЫ (CC BY 4.0)",
  act: "СТАВКА 14%",
  from: "usd-stack.png",
  to: "rub-pile.png",
  when: "ВКЛАДЫ В РУБЛЯХ ВЫГОДНЕЕ",
  result: "РУБЛЬ КРЕПЧЕ",
  resultHero: [1],
  clip: "10-place1",
  stats: ["КЛЮЧЕВАЯ СТАВКА 14%", "ГЛАВА ЦБ С 2013", "8 РЕШЕНИЙ В ГОД"],
  logo: "cbr-logo.png",
  subscribe: true,
  at: { name: 37, role: 70, act: 110, when: 179, result: 231, meme: 9999, sub: 40 },
};
