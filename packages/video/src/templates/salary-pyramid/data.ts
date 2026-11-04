import { LadderData } from "../_shorts/Ladder";

// Rosstat, the April 2025 wage survey (every two years; 95,4 k organisations
// without small business, 28,4 M workers, pay before income tax). Shares by
// bracket: < 22 440 ₽ 2,6% · 22,4–40 k 15,2% · 40–60 k 20,2% · 60–80 k 17,0% ·
// 80–100 k 13,1% · 100–150 k 17,2% · 150–200 k 6,9% · 200–400 k 6,3% ·
// > 400 k 1,5% · ≥ 1 M 0,16% (45 k people). Median 73 871 ₽, mean 97 375 ₽.
// Bottom decile mean 24 786 ₽, 9th decile 150 555 ₽, top decile mean 315 835 ₽,
// gap 12,7× (34× in 2000). Industry medians (Kommersant on Rosstat): education
// 50 500, culture & sport 51 900, health 56 100, finance 118 300, IT & telecom
// 125 600, mining 127 600, tobacco 155 400. Regional means, April 2025:
// Ingushetia 39 600, Chechnya 43 100, Dagestan 45 400, Moscow 178 200,
// Chukotka 193 800. Pipeline transport 295 978 (May 2026). Sources: WORK.md.
const A = "images/salary-pyramid/";
const K = "images/kit/";
const M = "media/salary-pyramid/";
const NB = " ";

export const DATA: LadderData = {
  series: "ДЕНЬГИ · ПРОСТО",
  episode: "ВЫПУСК 16",
  voiceoverDir: "salary-pyramid",
  rate: 1.15,
  hookRate: 1.18,
  hook: {
    words: ["БОГАТ", "ЛИ", "ТЫ?"],
    hero: [2],
    sub: "28 000 000 ЗАРПЛАТ · РОССТАТ, АПРЕЛЬ 2025",
    top: "БОГАТЫЙ",
    bottom: "БЕДНЫЙ",
    clip: M + "hook-crowd.mp4",
    figure: { src: A + "meme-money.jpg", h: 207, w: 440, card: true, caption: "ЭТО ТЫ?" },
    stamp: "ПОГНАЛИ!",
    pointer: "ТЫ?",
    numbers: ["22 440", "73 871", "97 375", "1 000 000", "315 835", "12,7×", "45 000", "28 400 000"],
    artifacts: { photo: A + "ev-rubles.jpg", cards: ["ОТ 22 440 ₽ В МЕСЯЦ", "ДО 1 000 000+ ₽", "95 400 КОМПАНИЙ"] },
  },
  labels: { step: "СТУПЕНЬ", us: "РАБОТНИКОВ", who: "КТО ЗДЕСЬ", up: "КАК ПОДНЯТЬСЯ", people: "ЧЕЛОВЕК НА ЭТОЙ СТУПЕНИ" },
  steps: [
    {
      range: `ДО 40${NB}000${NB}₽`,
      short: "ДО 40 ТЫС.",
      share: 0.178,
      pct: "17,8%",
      count: "5,1 МЛН",
      every: "КАЖДЫЙ ШЕСТОЙ",
      tone: "bad",
      who: [
        { src: A + "fig-cashier.png", h: 280, label: "КАССИР" },
        { src: A + "fig-waiter.png", h: 280, label: "ОФИЦИАНТ" },
        { src: A + "fig-farmer.png", h: 280, label: "ФЕРМА" },
      ],
      cards: ["ИНГУШЕТИЯ · 39 600 ₽ В СРЕДНЕМ", "ЧЕЧНЯ · 43 100 ₽", "ДАГЕСТАН · 45 400 ₽"],
      flags: [A + "flag-ingushetia.svg", A + "flag-chechnya.svg", A + "flag-dagestan.svg"],
      clip: M + "s5-cashier.mp4",
      up: "ПЕРЕЕЗД: МОСКВА 178 200 ₽ В СРЕДНЕМ, В 4 РАЗА БОЛЬШЕ ИНГУШЕТИИ",
      strip: [{ src: A + "ev-village.jpg", label: "ГЛУБИНКА" }, { src: A + "ev-tractor.jpg", label: "СЕЛЬСКОЕ ХОЗЯЙСТВО" }],
      numbers: ["22 440", "МРОТ", "24 786", "17,8%", "5 100 000", "39 600"],
    },
    {
      range: `40-80 ТЫС.${NB}₽`,
      short: "40-80 ТЫС.",
      share: 0.372,
      pct: "37,2%",
      count: "10,6 МЛН",
      every: "БОЛЬШЕ ТРЕТИ СТРАНЫ",
      marker: "МЕДИАНА 73 871 ₽ ЗДЕСЬ",
      tone: "paper",
      who: [
        { src: A + "fig-teacher.png", h: 280, label: "УЧИТЕЛЬ" },
        { src: A + "fig-doctor.png", h: 280, label: "ВРАЧ" },
        { src: A + "fig-driver.png", h: 280, label: "ВОДИТЕЛЬ" },
      ],
      cards: ["ОБРАЗОВАНИЕ · МЕДИАНА 50 500 ₽", "ЗДРАВООХРАНЕНИЕ · 56 100 ₽", "КУЛЬТУРА И СПОРТ · 51 900 ₽"],
      clip: M + "s4-class.mp4",
      up: "СМЕНА ОТРАСЛИ: IT И СВЯЗЬ 125 600 ₽, В 2,5 РАЗА БОЛЬШЕ ОБРАЗОВАНИЯ",
      strip: [{ src: A + "ev-school.jpg", label: "ШКОЛА · 50 500 ₽" }, { src: A + "ev-hospital.jpg", label: "БОЛЬНИЦА · 56 100 ₽" }],
      numbers: ["73 871", "50 500", "56 100", "37,2%", "10 600 000", "51 900"],
    },
    {
      range: `80-150 ТЫС.${NB}₽`,
      short: "80-150 ТЫС.",
      share: 0.303,
      pct: "30,3%",
      count: "8,6 МЛН",
      every: "КАЖДЫЙ ТРЕТИЙ",
      marker: "СРЕДНЯЯ 97 375 ₽ ЗДЕСЬ",
      tone: "paper",
      who: [
        { src: A + "fig-oil.png", h: 280, label: "НЕФТЯНИК" },
        { src: A + "fig-dev.png", h: 280, label: "ПРОГРАММИСТ" },
        { src: A + "fig-bank.png", h: 280, label: "БАНК" },
      ],
      cards: ["ДОБЫЧА · МЕДИАНА 127 600 ₽", "IT И СВЯЗЬ · 125 600 ₽", "ФИНАНСЫ · 118 300 ₽"],
      logos: [A + "gazprom.svg", K + "yandex.svg", K + "sber.svg"],
      clip: M + "s3-oil.mp4",
      up: "СЕВЕР ИЛИ СТОЛИЦА: ЧУКОТКА 193 800 ₽, МОСКВА 178 200 ₽ В СРЕДНЕМ",
      strip: [{ src: A + "ev-moscow.jpg", label: "МОСКВА · 178 200 ₽" }, { src: A + "ev-servers.jpg", label: "IT · 125 600 ₽", logo: K + "yandex.svg" }],
      numbers: ["97 375", "127 600", "125 600", "30,3%", "8 600 000", "193 800"],
    },
    {
      range: `150-400 ТЫС.${NB}₽`,
      short: "150-400 ТЫС.",
      share: 0.132,
      pct: "13,2%",
      count: "3,7 МЛН",
      every: "1 ИЗ 8",
      marker: "ВЕРХНИЕ 10% В СРЕДНЕМ 315 835 ₽",
      tone: "paper",
      who: [
        { src: A + "fig-boss.png", h: 250, label: "РУКОВОДИТЕЛЬ" },
        { src: A + "fig-engineer.png", h: 250, label: "ТРУБОПРОВОД" },
      ],
      cards: ["ТРУБОПРОВОДНЫЙ ТРАНСПОРТ · 295 978 ₽ В СРЕДНЕМ", "ТАБАЧНАЯ ФАБРИКА · МЕДИАНА 155 400 ₽", "9-Й ДЕЦИЛЬ · 150 555 ₽"],
      logos: [A + "transneft.svg"],
      flags: [A + "flag-moscow.svg"],
      clip: M + "s2-office.mp4",
      up: "КРЕСЛО РУКОВОДИТЕЛЯ ИЛИ ТРУБА: 295 978 ₽ В СРЕДНЕМ",
      strip: [
        { src: A + "ev-pipeline.jpg", label: "ГАЗОПРОВОД · 295 978 ₽", logo: A + "gazprom.svg" },
        { src: A + "ev-rig.jpg", label: "НЕФТЬ И ГАЗ" },
      ],
      numbers: ["315 835", "295 978", "155 400", "13,2%", "3 700 000", "150 555"],
    },
    {
      range: `СВЫШЕ 400${NB}000${NB}₽`,
      short: "ОТ 400 ТЫС.",
      share: 0.015,
      pct: "1,5%",
      count: "430 ТЫС.",
      every: "1 ИЗ 67",
      tone: "hero",
      who: [
        { src: A + "fig-ceo.png", h: 215, label: "ТОП IT" },
        { src: A + "fig-rich2.png", h: 215, label: "СВОЯ КОМПАНИЯ" },
      ],
      cards: ["IT И СВЯЗЬ · 9 900 ЧЕЛОВЕК ОТ 1 МЛН ₽", "ТОРГОВЛЯ · 6 700", "ФИНАНСЫ · 6 200"],
      logos: [K + "yandex.svg", K + "tbank.svg"],
      up: "СВОЯ КОМПАНИЯ ИЛИ ТОП В IT И ФИНАНСАХ",
      strip: [{ src: A + "ev-jet.jpg", pos: "50% 40%", label: "ОТ 1 000 000 ₽ В МЕСЯЦ" }, { src: A + "ev-car.jpg", pos: "50% 72%", label: "45 000 ЧЕЛОВЕК" }],
      numbers: ["1 000 000", "45 000", "0,16%", "1,5%", "430 000", "1 ИЗ 625"],
      spike: { value: "ОТ 1 000 000 ₽", label: "45 000 ЧЕЛОВЕК · 0,16% · 1 ИЗ 625" },
    },
  ],
  final: {
    line: "КАКАЯ СТУПЕНЬ ТВОЯ?",
    stamp: "ПИШИ НОМЕР",
    note: "РАЗРЫВ ВЕРХ / НИЗ: 12,7 РАЗА. В 2000-М: 34",
    sources: "РОССТАТ, АПРЕЛЬ 2025 · 28,4 МЛН РАБОТНИКОВ КРУПНЫХ И СРЕДНИХ КОМПАНИЙ · ДО НДФЛ",
  },
};
