// The scenario as data. Voiceover only — no music, no SFX — so every cut is
// paced off the spoken lines. The brief's clock says 56s; the spoken text is
// 72s of audio, so the beats are sized from the measured clips, not the brief.
//
// Scene starts are derived from the lengths below; clip durations come from
// the generated durations module. Nothing here is transcribed by hand.
import { buildScenes, defineVoiceover, scenesDuration, VoLine } from "../../reel";
import { DURATIONS } from "./durations";

// 1.10 — the top of the allowed range: the read is long and the cuts want
// to stay punchy.
export const VO_RATE = 1.1;

export const SCENES = buildScenes({
  hook: 7, // bank card → alarm → glitch → pixel ₽; headline prints
  stop: 5, // СТОП. stamp; ₿ and the banknote get crossed out and thrown
  forms: 8.5, // one ₽ splits into three ledger rows
  parity: 4, // ₽1 = 1 ЦИФРОВОЙ ₽ — the coin hit
  launch: 10, // calendar tears to 1 СЕН → bank app → «Цифровой кошелёк»
  voluntary: 6, // red auto-button shatters → «только по желанию» toggle
  pros: 7.5, // the zero-fee receipt prints
  cons: 6, // КЕШБЭК? ПРОЦЕНТЫ? КРЕДИТ? → portal → НЕ ПРЕДУСМОТРЕНЫ
  question: 8, // the frame tears: card vs digital wallet
  cta: 8, // ОТКРОЕТЕ? ДА / НЕТ + comment counter
});

export const DURATION = scenesDuration(SCENES);

export type { VoLine };

// Caption markup maps onto the palette's rule:
//   "+WORD" → lime, only ever the digital ruble / the fix / "yes"
//   "!WORD" → red, only ever the alarm / "no" / not provided
//   "~PAGE" → hidden, because a scene headline is already carrying the words
// The lines start ~0.2s after their scene so the visual lands first.
export const VOICEOVER = defineVoiceover(DURATIONS, [
  {
    file: "01-hook",
    start: SCENES.hook.from + 0.3,
    pages: [
      "ЧЕРЕЗ НЕСКОЛЬКО ДНЕЙ",
      "В РОССИИ МАССОВО",
      "ЗАПУСКАЮТ",
      "+ЦИФРОВОЙ РУБЛЬ.",
      "ВАШИ ДЕНЬГИ ТЕПЕРЬ",
      "СМОЖЕТ !КОНТРОЛИРОВАТЬ",
      "ГОСУДАРСТВО?",
    ],
  },
  {
    file: "02-stop",
    start: SCENES.stop.from + 0.2,
    pages: [
      "~СТОП.", // the stamp owns it
      "НЕ ПАНИКУЙТЕ:",
      "ЭТО НЕ НОВАЯ ВАЛЮТА,",
      "!НЕ КРИПТА",
      "И !НЕ ЗАМЕНА НАЛИЧНЫМ.",
    ],
  },
  {
    file: "03-forms",
    start: SCENES.forms.from + 0.2,
    pages: [
      "ЭТО ТРЕТЬЯ ФОРМА",
      "ТЕХ ЖЕ РОССИЙСКИХ ДЕНЕГ.",
      "НАЛИЧНЫЕ ЛЕЖАТ",
      "В КОШЕЛЬКЕ,",
      "БЕЗНАЛИЧНЫЕ — В БАНКЕ,",
      "А +ЦИФРОВЫЕ РУБЛИ —",
      "НА ПЛАТФОРМЕ ЦЕНТРОБАНКА.",
    ],
  },
  {
    file: "04-parity",
    start: SCENES.parity.from + 0.2,
    pages: [
      "НО ЦЕНА У НИХ ОДНА:",
      "~ОДИН РУБЛЬ РАВЕН", // the full-frame equation is this line
      "~ОДНОМУ ЦИФРОВОМУ РУБЛЮ.",
    ],
  },
  {
    file: "05-launch",
    start: SCENES.launch.from + 0.2,
    pages: [
      "~С ПЕРВОГО СЕНТЯБРЯ", // the calendar carries the date
      "~ДВЕ ТЫСЯЧИ ДВАДЦАТЬ ШЕСТОГО ГОДА",
      "КРУПНЕЙШИЕ БАНКИ",
      "ДОЛЖНЫ ДАТЬ КЛИЕНТАМ",
      "ДОСТУП К +ЦИФРОВЫМ",
      "КОШЕЛЬКАМ, ПЕРЕВОДАМ",
      "И ОПЛАТЕ ПОКУПОК.",
    ],
  },
  {
    file: "06-voluntary",
    start: SCENES.voluntary.from + 0.2,
    pages: [
      "А ТЕПЕРЬ ГЛАВНОЕ:",
      "ДЛЯ ОБЫЧНОГО ЧЕЛОВЕКА",
      "ЭТО +ДОБРОВОЛЬНО.",
      "АВТОМАТИЧЕСКИ КОШЕЛЁК",
      "ВАМ !НЕ ОТКРОЮТ.",
    ],
  },
  {
    file: "07-pros",
    start: SCENES.pros.from + 0.2,
    pages: [
      "ПЕРЕВОДЫ И ПЛАТЕЖИ",
      "ДЛЯ ГРАЖДАН",
      "ОБЕЩАЮТ СДЕЛАТЬ",
      "+БЕСПЛАТНЫМИ.",
      "ПОЛЬЗОВАТЬСЯ КОШЕЛЬКОМ",
      "МОЖНО БУДЕТ ЧЕРЕЗ",
      "ПРИВЫЧНОЕ БАНКОВСКОЕ",
      "ПРИЛОЖЕНИЕ.",
    ],
  },
  {
    file: "08-cons",
    start: SCENES.cons.from + 0.2,
    pages: [
      "НО ПРОЦЕНТОВ",
      "НА ЦИФРОВОЙ ОСТАТОК",
      "!НЕ БУДЕТ.",
      "И КРЕДИТ",
      "В ЦИФРОВЫХ РУБЛЯХ",
      "ЦЕНТРОБАНК ТОЖЕ",
      "!НЕ ВЫДАЁТ.",
    ],
  },
  {
    file: "09-question",
    start: SCENES.question.from + 0.2,
    pages: [
      "ТО ЕСТЬ +ЦИФРОВОЙ РУБЛЬ —",
      "УДОБНЫЙ ПЛАТЁЖНЫЙ",
      "ИНСТРУМЕНТ.",
      "НО СТАНЕТ ЛИ ОН",
      "УДОБНЕЕ БАНКОВСКОЙ",
      "КАРТЫ ЛИЧНО ДЛЯ ВАС —",
      "ВОТ НАСТОЯЩИЙ ВОПРОС.",
    ],
  },
  {
    file: "10-cta",
    start: SCENES.cta.from + 0.2,
    pages: [
      "ВЫ БЫ ОТКРЫЛИ",
      "+ЦИФРОВОЙ КОШЕЛЁК?",
      "НАПИШИТЕ ОДНИМ СЛОВОМ:",
      "+«ДА» ИЛИ !«НЕТ».",
      "И ОТПРАВЬТЕ ЭТО ВИДЕО",
      "ТОМУ, КТО ДУМАЕТ,",
      "ЧТО НАЛИЧНЫЕ ОТМЕНЯЮТ.",
    ],
  },
]);
