// The scenario as data. Voiceover only — no music, no SFX — so every cut is
// paced off the spoken lines. Beats are sized from the measured clips (59.9s
// of audio at 1.0×, 54.5s at VO_RATE), never from the brief's clock: the
// brief budgets 72s, the read comes in at 68.5s, and the read wins.
//
// Scene starts are derived from the lengths below; clip durations come from
// the generated durations module. Nothing here is transcribed by hand.
import { buildScenes, defineVoiceover, scenesDuration, VoLine } from "../../reel";
import { DURATIONS } from "./durations";

// 1.10 — the series rate since ВЫПУСК 01. The reel reads tight.
export const VO_RATE = 1.1;

export const SCENES = buildScenes({
  // 5.0, not 5.5: the avatar's 5.12s of footage plays at VO_RATE and is gone
  // by 4.655s, and the tail is the glitch-out — ten frames, an exit, not a
  // hold. The brief's «ровно 5 секунд» of face lands at 4.66s.
  hook: 5.0, // FACE full-bleed + «24 ЧЕЛОВЕКА НА 1 ВАКАНСИЮ» → glitch cut
  numbers: 6.5, // bars fall to red, résumés rain down, ≈ −32% / РЕЗЮМЕ ↑
  break: 4.0, // «ИИ» splits into three → НЕ ЕДИНСТВЕННАЯ ПРИЧИНА
  economy: 7.5, // five figures, two ghost hires crossed out, the receipt of causes
  tasks: 8.5, // four cards taken one at a time: КОД / ТЕСТЫ / ДОКУМЕНТАЦИЯ / ПОДДЕРЖКА
  insight: 9.0, // developer + the empty desk beside him; the desk becomes AI
  junior: 8.5, // the staircase loses its bottom two steps; the figure can't reach
  factcheck: 7.5, // the listings scan, the counter to 700 000, the lime stamp
  answer: 6.5, // IT НЕ УМЕР (lime) / ПЛАНКА ВХОДА ВЫРОСЛА (bone)
  cta: 5.5, // ПОШЛИ БЫ В IT? — ДА / НЕТ
});

export const DURATION = scenesDuration(SCENES);

export type { VoLine };

// Caption markup, on the series rule:
//   "+WORD" → lime, only the answer that holds — «не подтверждает», «не умер»
//   "!WORD" → red, only the loss — «убили», «меньше», «треть», «новичкам»
//   "~PAGE" → hidden, because a headline, a card or a counter already carries
//             those words on screen, and because every figure is spelled out
//             for the TTS while the frame shows the digits.
//
// Lines start ~0.2s after their scene so the visual lands first. Two
// exceptions: the hook starts at 0.0 (a face that waits six frames before
// speaking reads as a buffering video, which is the one thing a hook cannot
// afford), and `answer` waits 0.4s — that gap is the brief's «музыка
// останавливается на секунду перед финальной фразой», done with silence
// because the series has no music to stop.
export const VOICEOVER = defineVoiceover(DURATIONS, [
  {
    file: "01-hook",
    start: SCENES.hook.from,
    pages: ["~ДВАДЦАТЬ ЧЕТЫРЕ ЧЕЛОВЕКА", "~НА ОДНУ ВАКАНСИЮ В IT.", "НЕЙРОСЕТИ !УБИЛИ ПРОФЕССИЮ?"],
  },
  {
    file: "02-numbers",
    start: SCENES.numbers.from + 0.2,
    pages: [
      "ЗА ГОД ВАКАНСИЙ",
      "В ОТРАСЛИ СТАЛО !МЕНЬШЕ",
      "~ПРИМЕРНО НА ТРЕТЬ.",
      "А ЖЕЛАЮЩИХ ТУДА ПОПАСТЬ —",
      "ТОЛЬКО БОЛЬШЕ.",
    ],
  },
  {
    file: "03-break",
    start: SCENES.break.from + 0.2,
    pages: ["НО ВИНОВАТ", "НЕ ТОЛЬКО ИСКУССТВЕННЫЙ ИНТЕЛЛЕКТ."],
  },
  {
    file: "04-economy",
    start: SCENES.economy.from + 0.2,
    pages: [
      "ЭКОНОМИКА ЗАМЕДЛЯЕТСЯ.",
      "~КОМПАНИИ ОТКЛАДЫВАЮТ ПРОЕКТЫ,",
      "~ЗАМОРАЖИВАЮТ НАЙМ",
      "И ПРОСЯТ ДЕЛАТЬ БОЛЬШЕ",
      "ПРЕЖНИМИ КОМАНДАМИ.",
    ],
  },
  {
    file: "05-tasks",
    start: SCENES.tasks.from + 0.25,
    pages: [
      "А НЕЙРОСЕТИ УЖЕ ЗАБИРАЮТ ПРОСТОЕ:",
      "~ШАБЛОННЫЙ КОД,",
      "~ТЕСТЫ,",
      "~ДОКУМЕНТАЦИЮ,",
      "~ПОИСК ОШИБОК",
      "~И ПЕРВУЮ ЛИНИЮ ПОДДЕРЖКИ.",
    ],
  },
  {
    file: "06-insight",
    start: SCENES.insight.from + 0.2,
    pages: [
      "СМОТРИТЕ ГЛАВНОЕ.",
      "ИСКУССТВЕННЫЙ ИНТЕЛЛЕКТ",
      "~НЕ УВОЛЬНЯЕТ ПРОГРАММИСТА.",
      "ОН !ОТМЕНЯЕТ ВАКАНСИЮ ВТОРОГО —",
      "ТОГО, КОГО СОБИРАЛИСЬ НАНЯТЬ.",
    ],
  },
  {
    file: "07-junior",
    start: SCENES.junior.from + 0.2,
    pages: [
      "ПОЭТОМУ ТЯЖЕЛЕЕ ВСЕГО !НОВИЧКАМ.",
      "ЗАДАЧИ, НА КОТОРЫХ РАНЬШЕ",
      "ПОЛУЧАЛИ ПЕРВЫЙ ОПЫТ,",
      "ТЕПЕРЬ ЧАСТИЧНО ДЕЛАЕТ НЕЙРОСЕТЬ.",
    ],
  },
  {
    file: "08-factcheck",
    start: SCENES.factcheck.from + 0.2,
    pages: [
      "ПРИ ЭТОМ ИССЛЕДОВАНИЕ",
      "~БОЛЕЕ СЕМИСОТ ТЫСЯЧ ВАКАНСИЙ",
      "МАССОВОЙ ЗАМЕНЫ ПРОГРАММИСТОВ",
      "ПОКА +НЕ +ПОДТВЕРЖДАЕТ.",
    ],
  },
  {
    file: "09-answer",
    start: SCENES.answer.from + 0.4,
    pages: ["~IT НЕ УМЕР.", "УМЕРЛА РУТИНА.", "~ПЛАНКА ВХОДА ВЫРОСЛА —", "И ЭТО УЖЕ ДРУГАЯ ИСТОРИЯ."],
  },
  {
    file: "10-cta",
    start: SCENES.cta.from + 0.3,
    pages: ["~А ВЫ БЫ СЕГОДНЯ", "~ПОШЛИ В IT?", "НАПИШИТЕ: ДА ИЛИ НЕТ."],
  },
]);
