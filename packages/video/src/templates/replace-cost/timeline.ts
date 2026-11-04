// The scenario as data. Voiceover only — no music, no SFX — so every cut is
// paced off the spoken lines. 16:9, ~3 minutes: a YouTube film, not a Short.
//
// Scene lengths and second-line starts are DERIVED from the measured clips
// (durations.ts) — nothing here is a typed duration. A beat that holds two
// lines plays them back to back with a breath between.
import { buildScenes, defineVoiceover, scenesDuration, VoLine } from "../../reel";
import { DURATIONS } from "./durations";

// 1.1 — the series rate since ВЫПУСК 01. The read stays tight.
export const VO_RATE = 1.1;

type Clip = keyof typeof DURATIONS;
const said = (c: Clip) => DURATIONS[c] / VO_RATE;

/** Lead before the first line of a beat — the picture lands, then the voice. */
export const LEAD = 0.2;
/** Breath between two lines inside one beat. */
export const BREATH = 0.35;
/** Tail after the last line before the cut. */
const TAIL = 0.35;

/** Offset of the n-th line inside its beat (seconds from the beat's start). */
const offsets = (clips: Clip[]) => {
  const out: number[] = [];
  let t = LEAD;
  for (const c of clips) {
    out.push(t);
    t += said(c) + BREATH;
  }
  return out;
};
/** Beat length: its lines + tail, rounded up to the 0.5s grid. */
const fit = (clips: Clip[], extra = 0) => {
  const o = offsets(clips);
  const end = o[o.length - 1] + said(clips[clips.length - 1]) + TAIL + extra;
  return Math.ceil(end * 2) / 2;
};

/** Which clips each beat speaks, in order. */
export const BEAT_LINES = {
  hook: ["01-hook"],
  price: ["02-price"],
  list: ["03-list"],
  cashier: ["04-cashier", "05-cashier-price"],
  operator: ["06-operator", "07-operator-ru"],
  twist: ["08-twist", "09-twist-face"],
  backoffice: ["10-backoffice"],
  gref: ["11-gref"],
  courier: ["12-courier"],
  dev: ["13-dev", "14-dev-price"],
  wef: ["15-wef"],
  formula: ["16-formula", "17-answer"],
  cta: ["18-cta"],
} as const satisfies Record<string, Clip[]>;

type Beat = keyof typeof BEAT_LINES;

/** Seconds from the beat's start at which its i-th line begins. */
export const lineAt = (beat: Beat, i = 0) => offsets([...BEAT_LINES[beat]])[i];
/** Seconds the i-th line of a beat lasts on screen. */
export const lineLen = (beat: Beat, i = 0) => said(BEAT_LINES[beat][i]);

export const SCENES = buildScenes({
  hook: fit(["01-hook"], 0.3), // FACE full-bleed · ТЕБЯ УЖЕ ЗАМЕНИЛИ
  price: fit(["02-price"]), // courier receipt 878 000 vs rover tag 295 000 · ×3
  list: fit(["03-list"]), // five price tags, the fifth locked «???»
  cashier: fit(["04-cashier", "05-cashier-price"]), // №1 · 42% · 69 000 КСО · kiosk = 2–3 зарплаты
  operator: fit(["06-operator", "07-operator-ru"]), // №2 · Klarna 2,3 млн = 700 · Т-Банк 40% · 4 ₽/мин vs 1 млн
  twist: fit(["08-twist", "09-twist-face"]), // ПОВОРОТ · «перегнули» · FACE
  backoffice: fit(["10-backoffice"]), // №3 · Сбер 308 092 → 294 578
  gref: fit(["11-gref"]), // Греф · −20% центрального аппарата
  courier: fit(["12-courier"]), // №4 · 1 оператор = 12 роботов · 20 000 к 2027
  dev: fit(["13-dev", "14-dev-price"]), // №5 · 69% кода · $10 vs 50 000 ₽ · −38%
  wef: fit(["15-wef"]), // −92 млн / +170 млн · ЧЬИ?
  formula: fit(["16-formula", "17-answer"]), // инструкция = ценник · дорого — тот, кто решает
  cta: fit(["18-cta"], 3.2), // FACE · СКОЛЬКО СТОИТ ЗАМЕНИТЬ ТЕБЯ? · credits
});

export const DURATION = scenesDuration(SCENES);

/** Scene boundaries in seconds — where the flash cut fires. */
export const CUTS = Object.values(SCENES)
  .map((s) => s.from)
  .filter((t) => t > 0);

export type { VoLine };

const at = (beat: Beat, i = 0) => SCENES[beat].from + lineAt(beat, i);

// Caption markup, on the series rule:
//   "+WORD" → lime, only the machine / the price of replacing
//   "!WORD" → red, only the loss
//   "~PAGE" → hidden: a headline, counter or stamp already carries those
//             words, and every figure is spelled out for the TTS while the
//             frame shows the digits.
export const VOICEOVER = defineVoiceover(DURATIONS, [
  {
    file: "01-hook",
    start: at("hook"),
    pages: ["~ТЕБЯ УЖЕ ЗАМЕНИЛИ.", "ПРОСТО ТЕБЕ ОБ ЭТОМ", "ЕЩЁ НЕ СКАЗАЛИ."],
  },
  {
    file: "02-price",
    start: at("price"),
    pages: [
      "КУРЬЕР ОБХОДИТСЯ КОМПАНИИ",
      "~В ВОСЕМЬСОТ СЕМЬДЕСЯТ ВОСЕМЬ ТЫСЯЧ РУБЛЕЙ В ГОД.",
      "РОБОТ-ДОСТАВЩИК ЯНДЕКСА —",
      "~В ДВЕСТИ ДЕВЯНОСТО ПЯТЬ.",
      "ВТРОЕ +ДЕШЕВЛЕ.",
    ],
  },
  {
    file: "03-list",
    start: at("list"),
    pages: [
      "ТАКОЙ ЦЕННИК УЖЕ ВИСИТ",
      "НА ПЯТИ ПРОФЕССИЯХ.",
      "И ПОСЛЕДНЯЯ ИЗ НИХ —",
      "ТА, КОТОРУЮ СЧИТАЛИ",
      "САМОЙ ЗАЩИЩЁННОЙ.",
    ],
  },
  {
    file: "04-cashier",
    start: at("cashier", 0),
    pages: [
      "~НОМЕР ОДИН. КАССИР.",
      "В ПЯТЁРОЧКЕ УЖЕ",
      "~СОРОК ДВА ПРОЦЕНТА ПОКУПАТЕЛЕЙ",
      "ПЛАТЯТ БЕЗ КАССИРА.",
      "КАСС САМООБСЛУЖИВАНИЯ У ИКС-ПЯТЬ —",
      "~ШЕСТЬДЕСЯТ ДЕВЯТЬ ТЫСЯЧ.",
      "ПОЧТИ СТОЛЬКО ЖЕ, СКОЛЬКО ОБЫЧНЫХ.",
    ],
  },
  {
    file: "05-cashier-price",
    start: at("cashier", 1),
    pages: [
      "ТАКАЯ КАССА СТОИТ",
      "~ОКОЛО СТА ТРИДЦАТИ ТЫСЯЧ РУБЛЕЙ.",
      "ЭТО ДВА-ТРИ МЕСЯЦА",
      "ЗАРПЛАТЫ КАССИРА.",
      "ДАЛЬШЕ ОНА РАБОТАЕТ",
      "БЕЗ БОЛЬНИЧНЫХ И БЕЗ ОТПУСКА.",
    ],
  },
  {
    file: "06-operator",
    start: at("operator", 0),
    pages: [
      "~НОМЕР ДВА. ОПЕРАТОР КОЛЛ-ЦЕНТРА.",
      "КЛАРНА ЗАПУСТИЛА +ИИ-АССИСТЕНТА —",
      "И ЗА ПЕРВЫЙ МЕСЯЦ ОН ПРОВЁЛ",
      "~ДВА МИЛЛИОНА ТРИСТА ТЫСЯЧ ДИАЛОГОВ.",
      "ЭТО РАБОТА",
      "~СЕМИСОТ ОПЕРАТОРОВ.",
      "ОБЕЩАННАЯ ЭКОНОМИЯ —",
      "~СОРОК МИЛЛИОНОВ ДОЛЛАРОВ.",
    ],
  },
  {
    file: "07-operator-ru",
    start: at("operator", 1),
    pages: [
      "В Т-БАНКЕ ИИ УЖЕ ЗАКРЫВАЕТ",
      "~СОРОК ПРОЦЕНТОВ ОБРАЩЕНИЙ",
      "БЕЗ ЧЕЛОВЕКА.",
      "МИНУТА БОТА —",
      "~ОКОЛО ЧЕТЫРЁХ РУБЛЕЙ.",
      "ОПЕРАТОР ОБХОДИТСЯ БИЗНЕСУ",
      "~В МИЛЛИОН В ГОД.",
    ],
  },
  {
    file: "08-twist",
    start: at("twist", 0),
    pages: ["~А ТЕПЕРЬ ПОВОРОТ.", "ЧЕРЕЗ ГОД ГЛАВА КЛАРНЫ ПРИЗНАЛ:", "~ПЕРЕГНУЛИ.", "И НАЧАЛ НАНИМАТЬ", "ЛЮДЕЙ +ОБРАТНО."],
  },
  {
    file: "09-twist-face",
    start: at("twist", 1),
    pages: [
      "ПОТОМУ ЧТО ДЕШЁВЫЙ БОТ,",
      "КОТОРЫЙ БЕСИТ КЛИЕНТОВ,",
      "В ИТОГЕ СТОИТ",
      "!ДОРОЖЕ ЧЕЛОВЕКА.",
      "~ЗАПОМНИ ЭТО —",
      "~ДАЛЬШЕ ПРИГОДИТСЯ.",
    ],
  },
  {
    file: "10-backoffice",
    start: at("backoffice"),
    pages: [
      "~НОМЕР ТРИ. БАНКОВСКИЙ БЭК-ОФИС.",
      "ЗА ДЕВЯТЬ МЕСЯЦЕВ",
      "ДВАДЦАТЬ ПЯТОГО ГОДА СБЕР СТАЛ МЕНЬШЕ",
      "~НА ТРИНАДЦАТЬ С ПОЛОВИНОЙ ТЫСЯЧ ЧЕЛОВЕК.",
      "И САМ СВЯЗАЛ ЭТО",
      "С +ГИГАЧАТОМ.",
    ],
  },
  {
    file: "11-gref",
    start: at("gref"),
    pages: [
      "А В НОЯБРЕ ГРЕФ ОБЪЯВИЛ:",
      "ИИ ОЦЕНИЛ",
      "ЭФФЕКТИВНОСТЬ КОМАНД —",
      "~И ДВАДЦАТЬ ПРОЦЕНТОВ",
      "~ЦЕНТРАЛЬНОГО АППАРАТА СОКРАТЯТ.",
    ],
  },
  {
    file: "12-courier",
    start: at("courier"),
    pages: [
      "~НОМЕР ЧЕТЫРЕ. КУРЬЕР.",
      "ТОТ САМЫЙ РОБОТ",
      "~ЗА ДВЕСТИ ДЕВЯНОСТО ПЯТЬ ТЫСЯЧ.",
      "ОДИН ОПЕРАТОР СЛЕДИТ",
      "~СРАЗУ ЗА ДВЕНАДЦАТЬЮ МАШИНАМИ.",
      "К КОНЦУ ДВАДЦАТЬ СЕДЬМОГО ГОДА",
      "ЯНДЕКС ХОЧЕТ",
      "~ДВАДЦАТЬ ТЫСЯЧ ТАКИХ РОБОТОВ.",
    ],
  },
  {
    file: "13-dev",
    start: at("dev", 0),
    pages: [
      "~НОМЕР ПЯТЬ. ПРОГРАММИСТ.",
      "ПРОФЕССИЯ, КОТОРАЯ СОЗДАЛА ИИ,",
      "ТЕПЕРЬ РАБОТАЕТ ВМЕСТЕ С НИМ.",
      "В СБЕРЕ",
      "~ШЕСТЬДЕСЯТ ДЕВЯТЬ ПРОЦЕНТОВ КОДА,",
      "КОТОРЫЙ ПРИНИМАЮТ КОМАНДЫ,",
      "НАПИСАЛА +НЕЙРОСЕТЬ.",
      "В ГУГЛЕ —",
      "~БОЛЬШЕ ТРЕТИ.",
    ],
  },
  {
    file: "14-dev-price",
    start: at("dev", 1),
    pages: [
      "ПОДПИСКА НА ИИ-АССИСТЕНТА —",
      "~ДЕСЯТЬ ДОЛЛАРОВ В МЕСЯЦ.",
      "ДЖУНУ ПЛАТЯТ",
      "~ПЯТЬДЕСЯТ ТЫСЯЧ РУБЛЕЙ.",
      "А ВАКАНСИЙ НА ХАБР КАРЬЕРЕ",
      "ЗА ПОЛГОДА СТАЛО",
      "~НА ТРИДЦАТЬ ВОСЕМЬ ПРОЦЕНТОВ МЕНЬШЕ.",
    ],
  },
  {
    file: "15-wef",
    start: at("wef"),
    pages: [
      "ВСЕМИРНЫЙ ЭКОНОМИЧЕСКИЙ ФОРУМ СЧИТАЕТ:",
      "К ТРИДЦАТОМУ ГОДУ ИСЧЕЗНУТ",
      "~ДЕВЯНОСТО ДВА МИЛЛИОНА РАБОЧИХ МЕСТ.",
      "И ПОЯВЯТСЯ",
      "~СТО СЕМЬДЕСЯТ.",
      "~ВОПРОС — ЧЬИ.",
    ],
  },
  {
    file: "16-formula",
    start: at("formula", 0),
    pages: [
      "ВИДИШЬ ЗАКОНОМЕРНОСТЬ?",
      "ДЕШЕВЛЕ ВСЕГО ЗАМЕНИТЬ РАБОТУ,",
      "КОТОРУЮ МОЖНО ОПИСАТЬ +ИНСТРУКЦИЕЙ.",
      "~ПРОБИЛ ТОВАР.",
      "~ОТВЕТИЛ ПО СКРИПТУ.",
      "~ОТВЁЗ ИЗ ТОЧКИ А В ТОЧКУ Б.",
    ],
  },
  {
    file: "17-answer",
    start: at("formula", 1),
    pages: [
      "~ДОРОГО — ЗАМЕНИТЬ ТОГО,",
      "~КТО РЕШАЕТ, КОГДА ИНСТРУКЦИЯ НЕ РАБОТАЕТ.",
      "РОВНО НА ЭТОМ",
      "КЛАРНА И !ОБОЖГЛАСЬ.",
    ],
  },
  {
    file: "18-cta",
    start: at("cta"),
    pages: ["~ТАК СКОЛЬКО СТОИТ ЗАМЕНИТЬ ТЕБЯ?", "НАПИШИ СВОЮ ПРОФЕССИЮ", "В КОММЕНТАРИЯХ —", "ПОСЧИТАЮ."],
  },
]);
