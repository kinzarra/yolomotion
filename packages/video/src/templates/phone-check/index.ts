import { defineTemplate } from "../types";
import { PhoneCheck } from "./PhoneCheck";
import { phoneCheckSchema } from "./schema";
import { DURATION } from "./timeline";

export const phoneCheck = defineTemplate({
  id: "phone-check",
  name: "Банк будет проверять ваш телефон?",
  description:
    "Personal finance-blog cyber-thriller in the «ЧЕК × ПИКСЕЛЬ» style: a transfer of 50 000 ₽ slams red with ПЕРЕВОД ОТКЛОНЁН, the date 1 МАРТА 2027 glitches together, КТО ВЕРНЁТ ДЕНЬГИ? hangs unanswered, cards / СБП / wallets hit a red barrier, the БАНК ПРОЧИТАЕТ ПЕРЕПИСКУ? fear is struck out and locked in a safe, consent is the only key, a phone cutaway catches the malware a centimetre before the money leaves, the twist lands in lime ВОЗМЕЩЕНИЕ with its condition, and the finale asks ЗАЩИТА ИЛИ ПРИВАТНОСТЬ? before looping back to the tap.",
  schema: phoneCheckSchema,
  defaultProps: {
    series: "ДЕНЬГИ · ПРОСТО",
    episode: "ВЫПУСК 03",
    amount: "50 000 ₽",
    footnote: "Источник: Банк России • ФЗ №210-ФЗ",
  },
  durationInSeconds: DURATION,
  formats: ["reel"],
  component: PhoneCheck,
});
