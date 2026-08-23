// The scenario as data. Voiceover only — no music, no SFX — so every cut is
// paced off the spoken lines. The brief's clock says 63s; the spoken text
// measures 79s of audio, so the beats are sized from the clips, not the brief.
//
// Scene starts are derived from the lengths below; clip durations come from
// the generated durations module. Nothing here is transcribed by hand.
import { buildScenes, defineVoiceover, scenesDuration, VoLine } from "../../reel";
import { DURATIONS } from "./durations";

// 1.10 — the top of the allowed range: a thriller wants the read tight.
export const VO_RATE = 1.1;

export const SCENES = buildScenes({
  hook: 4.5, // tap → ₽ lift → red slam: ПЕРЕВОД ОТКЛОНЁН
  date: 10.5, // the phone recedes; 1 МАРТА 2027 locks together; УГРОЗА → ОТКАЗ
  loop: 6, // dim; notes hang between the hood and the bank; КТО ВЕРНЁТ ДЕНЬГИ?
  scope: 10.5, // card / СБП / wallet hit the red barrier; the lime detour
  fear: 7.5, // БАНК ПРОЧИТАЕТ ПЕРЕПИСКУ? → freeze → strike → the safe
  consent: 8, // the dialog, the hovering finger, the trace, the padlock, the law
  inside: 9, // the cutaway: three layers, the red pulse dies, the ₽ freeze
  twist: 12, // the question returns → the bank ignores → reversal → ВОЗМЕЩЕНИЕ
  condition: 7, // the tear: ВЗЛОМ vs ПЕРЕВЁЛ САМ
  cta: 6.5, // ЗАЩИТА vs ПРИВАТНОСТЬ, then the transfer screen rises for the loop
});

export const DURATION = scenesDuration(SCENES);

export type { VoLine };

// Caption markup maps onto the series rule:
//   "+WORD" → lime, only ever protection / consent / the refund
//   "!WORD" → red, only ever the threat / the block / the malware / the "no"
//   "~PAGE" → hidden, because a scene headline is already carrying the words
// The lines start ~0.2s after their scene so the visual lands first; the hook
// waits for the slam, the twist waits a full second on the dark question.
export const VOICEOVER = defineVoiceover(DURATIONS, [
  {
    file: "01-hook",
    start: SCENES.hook.from + 0.55,
    pages: ["ВАШ ПЕРЕВОД !ОТКЛОНЁН.", "ПРИЧИНА —", "!УГРОЗА ВНУТРИ ТЕЛЕФОНА."],
  },
  {
    file: "02-date",
    start: SCENES.date.from + 0.2,
    // The date is spoken in words («две тысячи двадцать седьмого») — the
    // hidden pages carry the same weight so the later words stay in sync.
    pages: [
      "~С ПЕРВОГО МАРТА",
      "~ДВЕ ТЫСЯЧИ ДВАДЦАТЬ",
      "~СЕДЬМОГО ГОДА",
      "ЭТО СТАНЕТ",
      "РЕАЛЬНОСТЬЮ.",
      "БАНК СМОЖЕТ",
      "!ОСТАНОВИТЬ ПЕРЕВОД",
      "С УСТРОЙСТВА,",
      "НА КОТОРОМ СИСТЕМА",
      "ОБНАРУЖИТ ПРИЗНАКИ",
      "!ВРЕДОНОСНОГО ВОЗДЕЙСТВИЯ.",
    ],
  },
  {
    file: "03-loop",
    start: SCENES.loop.from + 0.2,
    pages: [
      "НО САМОЕ ИНТЕРЕСНОЕ",
      "ЗДЕСЬ —",
      "ДАЖЕ НЕ !БЛОКИРОВКА.",
      "А КТО ВЕРНЁТ ДЕНЬГИ,",
      "ЕСЛИ +ЗАЩИТА",
      "НЕ СРАБОТАЕТ?",
    ],
  },
  {
    file: "04-scope",
    start: SCENES.scope.from + 0.2,
    pages: [
      "ПРАВИЛО ЗАТРОНЕТ",
      "ОПЕРАЦИИ ПО КАРТАМ,",
      "ЭЛЕКТРОННЫЕ ДЕНЬГИ",
      "И ПЕРЕВОДЫ ЧЕРЕЗ СБП.",
      "ПРИ ОБНАРУЖЕНИИ !УГРОЗЫ",
      "БАНК СООБЩИТ ПРИЧИНУ",
      "И ПРЕДЛОЖИТ",
      "+ДРУГОЕ +УСТРОЙСТВО",
      "ИЛИ ОТДЕЛЕНИЕ.",
    ],
  },
  {
    file: "05-fear",
    start: SCENES.fear.from + 0.2,
    pages: [
      "ИМЕННО ЗДЕСЬ",
      "ЗАГОЛОВКИ НАЧИНАЮТ",
      "!ПУГАТЬ.",
      "КАЖЕТСЯ, БУДТО БАНК",
      "ПОЛУЧИТ ДОСТУП",
      "К ФОТОГРАФИЯМ",
      "И ПЕРЕПИСКЕ.",
      "НО ЭТО +НЕ +ТАК.",
    ],
  },
  {
    file: "06-consent",
    start: SCENES.consent.from + 0.2,
    pages: [
      "ЗАКОН НЕ ДАЁТ БАНКУ",
      "АВТОМАТИЧЕСКОГО ДОСТУПА",
      "К СОДЕРЖИМОМУ",
      "ТЕЛЕФОНА.",
      "ПРОВЕРКА БЕЗОПАСНОСТИ",
      "ДОЛЖНА ПРОВОДИТЬСЯ",
      "+С +СОГЛАСИЯ КЛИЕНТА.",
    ],
  },
  {
    file: "07-inside",
    start: SCENES.inside.from + 0.2,
    pages: [
      "ЦЕЛЬ ПРОВЕРКИ —",
      "ОБНАРУЖИТЬ ПРИЗНАКИ",
      "!ВРЕДОНОСНОЙ ПРОГРАММЫ",
      "НА УСТРОЙСТВЕ",
      "С ОНЛАЙН-БАНКОМ.",
      "НАПРИМЕР, ПОПЫТКУ",
      "!ПЕРЕХВАТИТЬ УПРАВЛЕНИЕ",
      "ИЛИ БАНКОВСКИЕ ДАННЫЕ.",
    ],
  },
  {
    file: "08-twist",
    start: SCENES.twist.from + 1.0,
    pages: [
      "А ТЕПЕРЬ",
      "ГЛАВНЫЙ ПОВОРОТ.",
      "ЕСЛИ МОШЕННИКИ",
      "!ВЗЛОМАЮТ ОНЛАЙН-БАНК,",
      "А БАНК !ПРОИГНОРИРУЕТ",
      "СИГНАЛ",
      "ИЛИ НАРУШИТ",
      "ТРЕБОВАНИЯ ЗАЩИТЫ,",
      "ПОХИЩЕННЫЕ ДЕНЬГИ",
      "ДОЛЖЕН БУДЕТ +ВОЗМЕСТИТЬ",
      "УЖЕ +БАНК.",
    ],
  },
  {
    file: "09-condition",
    start: SCENES.condition.from + 0.2,
    pages: [
      "НО ЕСЛИ ЧЕЛОВЕК",
      "!САМ ПЕРЕВЁЛ ДЕНЬГИ",
      "МОШЕННИКАМ,",
      "А БАНК ВЫПОЛНИЛ",
      "ПРАВИЛА,",
      "АВТОМАТИЧЕСКОГО",
      "ВОЗВРАТА !НЕ !БУДЕТ.",
    ],
  },
  {
    file: "10-cta",
    start: SCENES.cta.from + 0.2,
    pages: ["ВЫ БЫ ДАЛИ", "ТАКОЕ СОГЛАСИЕ?", "НАПИШИТЕ ОДНИМ СЛОВОМ:", "+ЗАЩИТА", "ИЛИ ПРИВАТНОСТЬ."],
  },
]);
