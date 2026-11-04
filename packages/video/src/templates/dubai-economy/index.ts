import { defineTemplate } from "../types";
import { DubaiEconomy } from "./DubaiEconomy";
import { dubaiEconomySchema } from "./schema";
import { DURATION } from "./timeline";

export const dubaiEconomy = defineTemplate({
  id: "dubai-economy",
  name: "Как устроена экономика Дубая",
  description:
    "«ДЕНЬГИ · ПРОСТО», ВЫПУСК 07: нефть даёт Дубаю ~1% — город зарабатывает на потоках (порт, аэропорт, ноль налога на зарплату), чуть не рухнул в 2009-м и был спасён Абу-Даби. Улики: ночной скайлайн, спутниковый снимок Джебель-Али, A380 Emirates в DXB, терминал 3, Бурдж-Халифа.",
  schema: dubaiEconomySchema,
  defaultProps: {
    series: "ДЕНЬГИ · ПРОСТО",
    episode: "ВЫПУСК 07",
    question: "ПЕРЕЕХАЛИ БЫ РАДИ 0%?",
    credits:
      "Фото и видео: Wikimedia Commons — Klaus Hesse (CC BY 3.0), KARI / Arirang-3 (KOGL), Robert Bock, EditQ, Meandmybrix (CC0)",
  },
  durationInSeconds: DURATION,
  formats: ["reel"],
  component: DubaiEconomy,
});
