// The scenario as data. Voiceover only — no music, no SFX — so every cut is
// paced off the spoken lines. The brief's clock says 58–62s; the spoken text
// measures 85s of audio, so the beats are sized from the clips, not the brief.
//
// Scene starts are derived from the lengths below; clip durations come from
// the generated durations module. Nothing here is transcribed by hand.
import { buildScenes, defineVoiceover, scenesDuration, VoLine } from "../../reel";
import { DURATIONS } from "./durations";

// 1.10 — the top of the allowed range: a thriller wants the read tight.
export const VO_RATE = 1.1;

export const SCENES = buildScenes({
  hook: 6.5, // red chart breaks out lime → +20% → ₿ punches through → ПАМП?
  trigger: 12, // mountain of Treasury slips; $2B glitches into $4B
  printer: 9.5, // ПЕЧАТНЫЙ СТАНОК? struck out → доходности ↓ доллар ↓ риск ↑
  clarity: 11, // White House, silhouettes, the CLARITY ACT document
  shorts: 13, // боковик → SHORT dominoes → the cascade → $2.75B
  squeeze: 5.5, // the loop: рост → ликвидация → покупка → рост
  etf: 6, // $ rain into three ETF cards → $1 000 000 000
  formula: 7.5, // госдолг → правила → шорты → ETF, the line draws itself
  cta: 10.5, // two indicators → СМОТРИ НА ДЕНЬГИ → the chain receipt
});

export const DURATION = scenesDuration(SCENES);

export type { VoLine };

// Caption markup maps onto the series rule:
//   "+WORD" → lime, only ever the pump / money coming in / the chain
//   "!WORD" → red, only ever shorts, liquidation, the "no"
//   "~PAGE" → hidden, because a scene headline is already carrying the words
// The lines start ~0.2s after their scene so the visual lands first.
export const VOICEOVER = defineVoiceover(DURATIONS, [
  {
    file: "01-hook",
    start: SCENES.hook.from + 0.3,
    pages: [
      "БИТКОЙН ПРИБАВИЛ",
      "ПОЧТИ +ДВАДЦАТЬ +ПРОЦЕНТОВ",
      "ЗА ЧЕТЫРЕ ДНЯ.",
      "НО КНОПКУ !«ПАМП»",
      "НАЖАЛИ ВООБЩЕ",
      "НЕ В КРИПТЕ.",
    ],
  },
  {
    file: "02-trigger",
    start: SCENES.trigger.from + 0.2,
    pages: [
      "ВСЁ НАЧАЛОСЬ НА РЫНКЕ",
      "АМЕРИКАНСКОГО ГОСДОЛГА.",
      "ДЕВЯТНАДЦАТОГО АВГУСТА",
      "МИНФИН США НЕОЖИДАННО",
      "+УДВОИЛ РАЗМЕР ВЫКУПА",
      "ДЛИННЫХ ОБЛИГАЦИЙ:",
      "С ДВУХ ДО МИНИМУМ",
      "+ЧЕТЫРЁХ +МИЛЛИАРДОВ ДОЛЛАРОВ",
      "ЗА ОПЕРАЦИЮ.",
    ],
  },
  {
    file: "03-printer",
    start: SCENES.printer.from + 0.2,
    pages: [
      "НЕТ, ЭТО НЕ",
      "!ПЕЧАТНЫЙ !СТАНОК.",
      "НО РЫНОК УСЛЫШАЛ ДРУГОЕ:",
      "ВЛАСТИ ГОТОВЫ",
      "ТУШИТЬ ПОЖАР В ГОСДОЛГЕ.",
      "ДОХОДНОСТИ СНАЧАЛА УПАЛИ,",
      "ДОЛЛАР ОСЛАБ —",
      "И ДЕНЬГИ ПОШЛИ В +РИСК.",
    ],
  },
  {
    file: "04-clarity",
    start: SCENES.clarity.from + 0.2,
    pages: [
      "ПОЧТИ ОДНОВРЕМЕННО",
      "БЕЛЫЙ ДОМ СОБРАЛ",
      "ЛИДЕРОВ КРИПТОИНДУСТРИИ,",
      "А ТРАМП ПОТРЕБОВАЛ",
      "ПРОДВИНУТЬ +CLARITY +ACT.",
      "ДЛЯ РЫНКА ЭТО",
      "ОЗНАЧАЛО ОДНО:",
      "ПРАВИЛА ДЛЯ КРИПТЫ",
      "МОГУТ СТАТЬ ПОНЯТНЕЕ.",
    ],
  },
  {
    file: "05-shorts",
    start: SCENES.shorts.from + 0.2,
    pages: [
      "НО НАСТОЯЩИЙ ВЗРЫВ",
      "УСТРОИЛИ ТРЕЙДЕРЫ.",
      "ПОСЛЕ НЕСКОЛЬКИХ",
      "НЕДЕЛЬ БОКОВИКА",
      "ОНИ НАБРАЛИ !ШОРТЫ.",
      "ЦЕНА ПОШЛА +ВВЕРХ —",
      "И БИРЖИ ПРИНУДИТЕЛЬНО",
      "!ЗАКРЫЛИ МЕДВЕЖЬИ ПОЗИЦИИ",
      "ПОЧТИ НА ДВА И",
      "СЕМЬДЕСЯТ ПЯТЬ",
      "МИЛЛИАРДА ДОЛЛАРОВ.",
    ],
  },
  {
    file: "06-squeeze",
    start: SCENES.squeeze.from + 0.15,
    pages: [
      "А ЗАКРЫТЬ ШОРТ —",
      "ЗНАЧИТ +КУПИТЬ БИТКОЙН.",
      "+ПОКУПКА ПОДНИМАЛА ЦЕНУ",
      "И !ЛИКВИДИРОВАЛА",
      "СЛЕДУЮЩЕГО.",
    ],
  },
  {
    file: "07-etf",
    start: SCENES.etf.from + 0.2,
    pages: [
      "НО ЭТО БЫЛ",
      "НЕ ТОЛЬКО ШОРТ-СКВИЗ.",
      "ЗА ТРИ ТОРГОВЫЕ СЕССИИ",
      "В БИТКОЙН-ETF ВОШЁЛ",
      "+МИЛЛИАРД ДОЛЛАРОВ.",
    ],
  },
  {
    file: "08-formula",
    start: SCENES.formula.from + 0.2,
    pages: [
      "ИТАК: ГОСДОЛГ",
      "ЗАЖЁГ СПИЧКУ,",
      "РЕГУЛИРОВАНИЕ",
      "ДОБАВИЛО УВЕРЕННОСТИ,",
      "!ШОРТЫ СТАЛИ БЕНЗИНОМ,",
      "А +ETF ПОДДЕРЖАЛИ ОГОНЬ.",
    ],
  },
  {
    file: "09-cta",
    start: SCENES.cta.from + 0.2,
    pages: [
      "ТЕПЕРЬ ВСЁ ЗАВИСИТ",
      "ОТ ДВУХ ВЕЩЕЙ:",
      "ПРОДОЛЖАТ ЛИ ПРИХОДИТЬ",
      "+ДЕНЬГИ В ETF",
      "И НЕ ВЕРНУТСЯ ЛИ",
      "!ДОХОДНОСТИ ВВЕРХ.",
      "СОХРАНИ ЭТУ ЦЕПОЧКУ.",
      "ЦЕНА — ВСЕГДА",
      "ПОСЛЕДНЕЕ ЗВЕНО.",
    ],
  },
]);
