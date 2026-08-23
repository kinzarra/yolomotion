// The scenario as data. Voiceover only — no music, no SFX — so every cut is
// paced off the spoken lines. The brief is a ~10-minute long-form script; this
// is the vertical cut-down, and the beats are sized from the measured clips
// (107.7s of audio at 1.0×, 98s at VO_RATE), not from the brief's clock.
//
// Scene starts are derived from the lengths below; clip durations come from
// the generated durations module. Nothing here is transcribed by hand.
import { buildScenes, defineVoiceover, scenesDuration, VoLine } from "../../reel";
import { DURATIONS } from "./durations";

// 1.10 — same as the two previous episodes: the series reads tight.
export const VO_RATE = 1.1;

export const SCENES = buildScenes({
  hook: 5.5, // rate rips up → КУПИТЬ + hovering cursor → ПОКУПАТЬ? ЖДАТЬ? ПОЗДНО?
  answer: 8, // lime stamp НЕ ПОЗДНО, then the red counterweight ОШИБКА ТОЛПЫ
  fever: 7, // РУБЛЬ НЕ ПАДАЕТ. ЕГО ЛИХОРАДИТ. + the −5,8% tag
  levels: 11.5, // the chart for real: 85 ₽ peak → 82,90 ₽ retrace, «КУПИЛ ЗДЕСЬ»
  why: 8.5, // the receipt prints three причины; the key-rate dial drops to 14
  counter: 9.5, // the ставка↓→доллар↑ equation struck out; НЕФТЬ / ЭКСПОРТ; 11 СЕНТЯБРЯ
  mistake: 7, // the walker ignores the cheap board, then sprints at the red one
  swap: 5, // КАКОЙ БУДЕТ КУРС? struck → КОГДА МНЕ НУЖНА ВАЛЮТА?
  who: 10, // receipt of real reasons, checked; РУБЛЁВАЯ ПОДУШКА stays in rubles
  plan: 13, // the payoff: one red lump vs lime slices on the calendar strip
  scenarios: 10, // three lanes, then НЕ УГАДЫВАТЬ — УПРАВЛЯТЬ РИСКОМ
  cta: 10.5, // НЕ ПОЗДНО / НО ТОЛЬКО ЧАСТЯМИ, three answers, then the loop
});

export const DURATION = scenesDuration(SCENES);

export type { VoLine };

// Caption markup maps onto the series rule:
//   "+WORD" → lime, only ever the plan / parts / the goal / managed risk
//   "!WORD" → red, only ever panic, the spike, the top, the loss
//   "~PAGE" → hidden, because a headline, a receipt line or a chart marker is
//             already carrying those words — and because every spoken number
//             is spelled out for the TTS while the screen shows the figure.
// Lines start ~0.2s after their scene so the visual lands first; the hook
// waits half a second on the button before the voice comes in.
export const VOICEOVER = defineVoiceover(DURATIONS, [
  {
    file: "01-hook",
    start: SCENES.hook.from + 0.5,
    pages: ["ДОЛЛАР СНОВА РЕЗКО", "ПОШЁЛ !ВВЕРХ.", "ПОКУПАТЬ ВАЛЮТУ — ИЛИ", "ПОЕЗД УЖЕ УШЁЛ?"],
  },
  {
    file: "02-answer",
    start: SCENES.answer.from + 0.2,
    pages: [
      "ОТВЕЧУ СРАЗУ:",
      "~НЕ ПОЗДНО.",
      "НО ЕСЛИ ПОСЛЕ ГРОМКИХ НОВОСТЕЙ",
      "ВЫ МЕНЯЕТЕ НА ДОЛЛАРЫ",
      "ВСЕ СБЕРЕЖЕНИЯ —",
      "ЭТО КЛАССИЧЕСКАЯ !ОШИБКА !ТОЛПЫ.",
    ],
  },
  {
    file: "03-fever",
    start: SCENES.fever.from + 0.2,
    pages: [
      "~РУБЛЬ НЕ ПРОСТО ПАДАЕТ —",
      "~ЕГО ЛИХОРАДИТ.",
      "В ИЮЛЕ ОН ОСЛАБ К ДОЛЛАРУ",
      "~ПРИМЕРНО НА ПЯТЬ И ВОСЕМЬ ДЕСЯТЫХ ПРОЦЕНТА.",
    ],
  },
  {
    file: "04-levels",
    start: SCENES.levels.from + 0.2,
    pages: [
      "В СЕРЕДИНЕ АВГУСТА ДОЛЛАР",
      "ПОДНИМАЛСЯ ВЫШЕ",
      "~ВОСЬМИДЕСЯТИ ПЯТИ РУБЛЕЙ.",
      "А К ДВАДЦАТЬ ВТОРОМУ ВЕРНУЛСЯ",
      "~ПРИМЕРНО К ВОСЬМИДЕСЯТИ ДВУМ ДЕВЯНОСТА.",
      "КТО ИСПУГАЛСЯ И КУПИЛ",
      "НА !МАКСИМУМЕ —",
      "УЖЕ УВИДЕЛ !МИНУС.",
    ],
  },
  {
    file: "05-why",
    start: SCENES.why.from + 0.2,
    pages: [
      "ПОЧЕМУ?",
      "~МЕНЬШЕ ЭКСПОРТНОЙ ВЫРУЧКИ,",
      "~ВЫСОКИЙ СПРОС НА ВАЛЮТУ ДЛЯ ИМПОРТА",
      "И КЛЮЧЕВАЯ СТАВКА —",
      "ЦЕНТРОБАНК СНИЗИЛ ЕЁ",
      "~ДО ЧЕТЫРНАДЦАТИ ПРОЦЕНТОВ.",
    ],
  },
  {
    file: "06-counter",
    start: SCENES.counter.from + 0.2,
    pages: [
      "НО ПРАВИЛА",
      "~«СТАВКА ВНИЗ — ДОЛЛАР ВВЕРХ»",
      "НЕ СУЩЕСТВУЕТ.",
      "РУБЛЬ МОГУТ ПОДДЕРЖАТЬ",
      "ДОРОГАЯ +НЕФТЬ",
      "И РОСТ +ЭКСПОРТА.",
      "А РЕШЕНИЕ ПО СТАВКЕ —",
      "~ОДИННАДЦАТОГО СЕНТЯБРЯ.",
    ],
  },
  {
    file: "07-mistake",
    start: SCENES.mistake.from + 0.2,
    pages: [
      "~БОЛЬШИНСТВО ПОКУПАЕТ ВАЛЮТУ",
      "~НЕ КОГДА ОНА НУЖНА,",
      "~А КОГДА СТАНОВИТСЯ СТРАШНО.",
      "РЕШЕНИЕ ПРИНИМАЕТ",
      "НЕ ПЛАН,",
      "А !ТРЕВОГА.",
    ],
  },
  {
    file: "08-swap",
    start: SCENES.swap.from + 0.2,
    pages: ["ПОЭТОМУ ЗАМЕНИТЕ ВОПРОС", "~«КАКИМ БУДЕТ КУРС»", "~НА «КОГДА МНЕ НУЖНА ВАЛЮТА»."],
  },
  {
    file: "09-who",
    start: SCENES.who.from + 0.2,
    pages: [
      "~ЕСТЬ РАСХОД В ВАЛЮТЕ —",
      "~ПОЕЗДКА, УЧЁБА, ЛЕЧЕНИЕ,",
      "~ПЛАТЕЖИ ЗА РУБЕЖ?",
      "ЗАДАЧА НЕ УГАДАТЬ КУРС,",
      "А +УБРАТЬ +РИСК.",
      "А РУБЛЁВУЮ ПОДУШКУ",
      "В ВАЛЮТУ !НЕ !ПЕРЕВОДИТЕ.",
    ],
  },
  {
    file: "10-plan",
    start: SCENES.plan.from + 0.2,
    pages: [
      "АЛГОРИТМ.",
      "~ВАЛЮТА НУЖНА В БЛИЖАЙШИЕ ТРИ МЕСЯЦА —",
      "ДЕЛИТЕ СУММУ НА +ЧАСТИ",
      "И ПОКУПАЙТЕ ПО +ГРАФИКУ.",
      "~ЧЕРЕЗ ТРИ-ДВЕНАДЦАТЬ МЕСЯЦЕВ —",
      "РАВНЫМИ ПОКУПКАМИ",
      "РАЗ В МЕСЯЦ.",
      "~ЦЕЛИ НЕТ —",
      "НЕ ПОКУПАЙТЕ НА ВСЁ",
      "ПОСЛЕ !СКАЧКА.",
    ],
  },
  {
    file: "11-scenarios",
    start: SCENES.scenarios.from + 0.2,
    pages: [
      "ДАЛЬШЕ ВОЗМОЖНЫ",
      "ТРИ СЦЕНАРИЯ:",
      "~ОСЛАБЛЕНИЕ, УКРЕПЛЕНИЕ —",
      "~ИЛИ МЕСЯЦЫ КАЧЕЛЕЙ.",
      "ПОКУПКА +ЧАСТЯМИ",
      "НЕ УГАДЫВАЕТ БУДУЩЕЕ.",
      "ОНА СНИЖАЕТ ЗАВИСИМОСТЬ",
      "ОТ ОДНОГО !НЕУДАЧНОГО !ДНЯ.",
    ],
  },
  {
    file: "12-cta",
    start: SCENES.cta.from + 0.2,
    pages: [
      "~НЕ ПОЗДНО —",
      "ЕСЛИ ВАЛЮТА НУЖНА",
      "ДЛЯ +ЦЕЛИ.",
      "!ПОЗДНО — БЕЖАТЬ ЗА КУРСОМ",
      "И ПОКУПАТЬ !НА !ВСЁ.",
      "НАПИШИТЕ ОДНИМ СЛОВОМ:",
      "~ПОКУПАЮ, ЖДУ ИЛИ НЕ НУЖНА.",
    ],
  },
]);
