import { CountdownData } from "../_shorts/Countdown";

// Author's notes 2026-10-18: flip to «5 профессий, которые ИИ убил».
// List: WEF Future of Jobs 2025, fastest-declining jobs to 2030 (postal service clerks #1;
// bank tellers, data entry clerks, cashiers, accountants among the steepest; drivers: AI,
// information processing, digital access). Pay, average in vacancies: Работа.ру catalogue
// (бухгалтер 69 000 ₽, оператор 1С 65 000 ₽, почтальон 57 000 ₽), кассир-операционист:
// hh.ru vacancies 35–145 тыс. ₽ (04.2025, via Skillbox), кассир: Dream Job, users' reports 53 000 ₽.
// #1 replaced (author 2026-10-18): почтальон → переводчик (not on WEF's list; machine translation).
// Переводчик: медиана 83,6 тыс. ₽ на 01.09.2025, вакансий с английским −24% за год, конкуренция ×1,5 (hh.ru via Inc. Russia).
const A = "images/ai-jobs-top5/";
const K = "media/kit-killed/";
export const DATA: CountdownData = {
  series: "ДЕНЬГИ · ПРОСТО",
  episode: "ВЫПУСК 13",
  voiceoverDir: "ai-jobs-top5",
  rate: 1.1,
  rankWord: "МЕСТО",
  hook: {
    words: ["5", "ПРОФЕССИЙ,", "КОТОРЫЕ", "ИИ", "УБИЛ"],
    badWord: 4,
    sub: "ПРОВЕРЬ, НЕТ ЛИ ТВОЕЙ",
    clip: K + "accountant.mp4",
    chips: ["WEF · FUTURE OF JOBS 2025", "БЫСТРЕЕ ВСЕХ ИСЧЕЗАЮТ К 2030"],
    meme: A + "cat-cry.jpg",
    killer: A + "mask.png",
    skull: true,
    sign: A + "sign-kill.jpg",
    kill: true,
    presenter: { file: "presenter/ai-jobs-top5/punch.mp4", from: 0.9, duration: 3.68, caption: "5 ПРОФЕССИЙ, КОТОРЫЕ ИИ УБИЛ" },
    // author's note 20: 1С, SAP, касса, калькулятор, бумаги и отчёты, цифры
    props: [
      { src: A + "register.png", x: -40, y: 1430, w: 300, rot: -6, at: -20 },
      { src: A + "calc2.png", x: 250, y: 1500, w: 130, rot: 10, at: -18 },
      { src: A + "reports.jpg", x: 420, y: 1560, w: 230, rot: -4, at: -16, card: true },
      { src: "images/kit/1c.svg", x: 60, y: 700, w: 150, rot: -8, at: -14, card: true },
      { src: "images/kit/sap.svg", x: 70, y: 860, w: 150, rot: 6, at: -12, card: true },
    ],
    numbers: ["69 000 ₽", "1С", "−90%", "12 450,00", "НДС 20%", "ИТОГО", "0101", "57 000", "Σ"],
  },
  places: [
    { title: "БУХГАЛТЕР", chips: ["В СПИСКЕ ИСЧЕЗАЮЩИХ · WEF", "1С И SAP УЖЕ С ИИ", "ПЕРВИЧКА: РАСПОЗНАЁТ ИИ"], clip: K + "accountant.mp4", person: { src: A + "accountant3.png", w: 560, ratio: 652 / 937 }, why: "ИИ СВОДИТ ОТЧЁТЫ ЗА СЕКУНДЫ", logos: ["images/kit/1c.svg", "images/kit/sap.svg"], numbers: ["ДЕБЕТ", "КРЕДИТ", "69 000 ₽", "НДС", "БАЛАНС"], num: { value: "69 000 ₽", label: "СРЕДНЯЯ В ВАКАНСИЯХ · РАБОТА.РУ" }, stamp: { text: "ОТЧЁТ ДЕЛАЕТ ИИ", tone: "bad" } },
    { title: "КАССИР", chips: ["В ТОП-5 ИСЧЕЗАЮЩИХ · WEF", "США: −6% КАССИРОВ К 2035 · BLS", "ОПЛАТА ЛИЦОМ И QR"], clip: K + "checkout.mp4", person: { src: A + "cashier.png", w: 520, ratio: 1200 / 1800 }, why: "КАССЫ САМООБСЛУЖИВАНИЯ И ОПЛАТА ЛИЦОМ", num: { value: "53 000 ₽", label: "СРЕДНЯЯ ПО ОТЗЫВАМ · DREAM JOB" }, stamp: { text: "КАССА БЕЗ ЛЮДЕЙ", tone: "bad" } },
    { title: "ОПЕРАТОР ВВОДА ДАННЫХ", chips: ["В ТОП-5 ИСЧЕЗАЮЩИХ · WEF", "США: −16% КЛЕРКОВ К 2035 · BLS", "СКАН ВМЕСТО РУЧНОГО ВВОДА"], clip: K + "servers.mp4", why: "ИИ ЧИТАЕТ СКАНЫ, ЧЕКИ И АНКЕТЫ САМ", logos: ["images/kit/google.svg", "images/kit/yandex.svg"], photo: A + "typing.jpg", numbers: ["ФИО", "ИНН 7707083893", "№ 0042", "СКАН.PDF", "OCR 99%", "65 000 ₽"], props: [{ src: A + "papers.jpg", x: 680, y: 640, w: 330, rot: 6, at: 10, card: true }, { src: A + "receipts.jpg", x: 700, y: 1380, w: 300, rot: -7, at: 16, card: true }, { src: A + "reports.jpg", x: 40, y: 1400, w: 260, rot: 5, at: 22, card: true }], num: { value: "65 000 ₽", label: "ОПЕРАТОР 1С · СРЕДНЯЯ · РАБОТА.РУ" }, stamp: { text: "РАСПОЗНАЁТ ИИ", tone: "bad" } },
    { title: "КАССИР В БАНКЕ", chips: ["В ТОП-5 ИСЧЕЗАЮЩИХ · WEF", "США: −13% К 2035 · BLS", "ПЕРЕВОДЫ ПО СБП"], clip: K + "counter.mp4", person: { src: A + "teller.png", w: 520, ratio: 1200 / 1803 }, why: "ПЕРЕВОДЫ И ВКЛАДЫ УШЛИ В ПРИЛОЖЕНИЕ", logos: ["images/kit/sber.svg", "images/kit/tbank.svg", "images/kit/alfa.svg"], num: { value: "ОТ 35 000 ₽", label: "ВИЛКА 35–145 ТЫС. · HH.RU, 04.2025" }, stamp: { text: "БАНК В ТЕЛЕФОНЕ", tone: "bad" } },
    { title: "ПЕРЕВОДЧИК", chips: ["НЕЙРОСЕТИ ПЕРЕВОДЯТ МГНОВЕННО", "КОНКУРЕНЦИЯ ×1,5 · HH.RU 2025", "ВИДЕО ПЕРЕВОДИТСЯ ГОЛОСОМ"], clip: K + "translator.mp4", person: { src: A + "translator.png", w: 520, ratio: 1100 / 1495 }, why: "GOOGLE, DEEPL И ЯНДЕКС ПЕРЕВОДЯТ ЗА СЕКУНДУ", logos: ["images/kit/google-translate.svg", "images/kit/deepl.svg", "images/kit/yandex-translate.svg"], numbers: ["HELLO", "ПРИВЕТ", "BONJOUR", "你好", "HOLA", "EN → RU", "0,3 С"], num: { value: "83 600 ₽", label: "МЕДИАНА В ВАКАНСИЯХ · HH.RU, 09.2025" }, stamp: { text: "ПЕРЕВОДИТ ИИ", tone: "bad", label: "ВАКАНСИЙ С АНГЛИЙСКИМ −24% ЗА ГОД" } },
  ],
  final: { line: "ТВОЯ ПРОФЕССИЯ СЛЕДУЮЩАЯ?", badWords: [2], stamp: "ПРОВЕРЬ СЕЙЧАС" },
  sources: "WEF Future of Jobs Report 2025 · Работа.ру · hh.ru, 2025 · Dream Job",
};
