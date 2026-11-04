import { defineTemplate } from "../types";
import { SerbiaEconomy } from "./SerbiaEconomy";
import { serbiaEconomySchema } from "./schema";
import { DURATION } from "./timeline";

export const serbiaEconomy = defineTemplate({
  id: "serbia-economy",
  name: "Что студенты пообещали России",
  description: "ВЫПУСК 21: Serbia after the 25.10.2026 vote through the Russia link; HeyGen hook, five facts, the answer, subscribe card.",
  schema: serbiaEconomySchema,
  defaultProps: {
    question: "ВВЕДУТ САНКЦИИ? ДА ИЛИ НЕТ",
  },
  durationInSeconds: DURATION,
  formats: ["reel"],
  component: SerbiaEconomy,
});
