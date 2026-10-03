import { defineTemplate } from "../types";
import { UnicornCafe } from "./UnicornCafe";
import { unicornCafeSchema } from "./schema";
import { DURATION } from "./timeline";

export const unicornCafe = defineTemplate({
  id: "unicorn-cafe",
  name: "Сурс → Рил",
  description:
    "17,5-секундный мета-рил на живом футаже с телефона: селфи из кафе обрывается на полуслове «используем, чтобы дальше…», и ролик заканчивает фразу собой. Караоке-субтитры по реальным word-таймингам (Apple Speech), джамп-кат, один магента-слэм.",
  schema: unicornCafeSchema,
  defaultProps: {
    claim: ["ЭТО ВИДЕО", "СМОНТИРОВАЛ", "КОД"],
    slamWord: "ЕДИНОРОГА",
    payoff: ["…СДЕЛАТЬ", "ВОТ ЭТО."],
    cta: ["ЧТО МОНТИРУЕМ", "ДАЛЬШЕ?"],
    brand: "yolomotion",
    brandNote: "снято на телефон · смонтировано кодом",
  },
  durationInSeconds: DURATION,
  formats: ["reel"],
  component: UnicornCafe,
});
