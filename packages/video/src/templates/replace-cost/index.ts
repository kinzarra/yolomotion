import { defineTemplate } from "../types";
import { ReplaceCost } from "./ReplaceCost";
import { replaceCostSchema } from "./schema";
import { DURATION } from "./timeline";

export const replaceCost = defineTemplate({
  id: "replace-cost",
  name: "Сколько стоит заменить тебя",
  description:
    "«ДЕНЬГИ · ПРОСТО», ВЫПУСК 08, 16:9 ~3 мин: пять профессий, на которые уже выписан ценник замены (кассир, оператор, бэк-офис, курьер, программист) — человек на чеке против машины лаймом; поворот Klarna; формула «инструкция = ценник».",
  schema: replaceCostSchema,
  defaultProps: {
    series: "ДЕНЬГИ · ПРОСТО",
    episode: "ВЫПУСК 08",
    question: "СКОЛЬКО СТОИТ ЗАМЕНИТЬ ТЕБЯ?",
    credits: "Фото и видео: Pexels, Wikimedia Commons",
    sources:
      "Совкомбанк/Ведомости 2026 · X5 2025–26 · Klarna 2024 · Т-Банк 2026 · Reuters 2025 · Сбер 2025 · Хабр Карьера 2025 · WEF 2025",
    face: false,
  },
  durationInSeconds: DURATION,
  formats: ["landscape"],
  component: ReplaceCost,
});
