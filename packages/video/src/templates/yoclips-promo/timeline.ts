// The scenario as data. Voiceover only — no music, no SFX — so every cut is
// paced off the spoken lines.
//
// Beat lengths are set from the measured clips in `durations.ts` divided by
// VO_RATE, plus the ~0.2s the visual gets before the voice arrives. Nothing
// here is transcribed by hand, and retiming a beat is one number: every later
// beat moves with it.
//
// Ordering was checked against references/retention.md BEFORE the scenes were
// built: the turn («пишу один абзац») is at 5.0s of 49.0s — the first third —
// the reel never runs two explanatory beats in a row, and the two hard numbers
// sit at 15.5s ($0.25) and 38.5s ($25) so the tail has a reason to exist.
import { buildScenes, defineVoiceover, scenesDuration, VoLine } from "../../reel";
import { DURATIONS } from "./durations";

// 1.08 tightens the read without pitching the clone audibly. Every beat length
// below already accounts for it.
export const VO_RATE = 1.08;

export const SCENES = buildScenes({
  hook: 5.0, // «Я БОЛЬШЕ НЕ СНИМАЮ РОЛИКИ» + the price stamps: $0.25
  brief: 3.5, // the real cabinet: тема + бриф being typed
  scenario: 7.0, // the agent's beat table on the receipt, then what it returns
  budget: 6.5, // СМЕТА — the money beat, ends on ИТОГО ДЕНЬГАМИ $0.25
  voice: 6.0, // ведущий: the avatar grid, then голос = клон
  render: 5.0, // the ready-made YouTube fields, then the stage chain
  keys: 5.5, // ключи владельца, зашифрованы его паролём
  scale: 6.5, // 1 → 100 роликов, $0.25 → $25
  cta: 4.0, // YOCLIPS / CLIPS.YOLOCO.IO
});

export const DURATION = scenesDuration(SCENES);

export type { VoLine };

// "~PAGE" hides a page (a headline or the footage is carrying those words),
// "+WORD" paints it the hero color once spoken, "!WORD" the signal color.
export const VOICEOVER = defineVoiceover(DURATIONS, [
  {
    file: "01-hook",
    start: 0.25,
    // The headline slams the first sentence; the caption picks up the price.
    pages: ["~Я больше не снимаю ролики.", "Я их заказываю — по +двадцать +пять +центов за штуку."],
  },
  {
    file: "02-brief",
    start: 5.2,
    pages: ["Открываю вкладку и пишу +один +абзац.", "Тема и бриф. Всё."],
  },
  {
    file: "03-scenario",
    start: 8.7,
    pages: [
      "Агент читает мой пайплайн и прошлые выпуски —",
      "и пишет +сценарий.",
      "Биты, реплики, текст на экране.",
    ],
  },
  {
    file: "04-budget",
    start: 15.7,
    // The last page is hidden: the receipt in shot is printing ИТОГО
    // ДЕНЬГАМИ $0.25 at exactly that moment, and the stamp lands on it.
    pages: ["Дальше смета.", "Ни один цент не уходит, пока я её не подтвердил.", "~Итого — двадцать пять центов."],
  },
  {
    file: "05-voice",
    start: 22.2,
    pages: ["Голос — мой +клон.", "Лицо — мои врезки:", "полный кадр на хуке, кружок на повороте."],
  },
  {
    file: "06-render",
    start: 28.2,
    pages: ["Дальше без меня.", "Рендер, заголовок, описание, теги —", "и +заливка на канал."],
  },
  {
    file: "07-keys",
    start: 33.2,
    pages: ["Ключи мои, зашифрованы моим паролём.", "Счета приходят +мне, а не платформе."],
  },
  {
    file: "08-scale",
    start: 38.7,
    // Both figures are hidden here — the counters on screen ARE the sentence,
    // and a caption repeating them would read as a subtitle of a subtitle.
    pages: [
      "~Один ролик — двадцать пять центов.",
      "~Сто роликов — двадцать пять долларов.",
      "Канал за цену ужина.",
    ],
  },
  {
    file: "09-cta",
    start: 45.25,
    pages: ["~Йоклипс.", "~Канал, который снимает сам себя."],
  },
]);
