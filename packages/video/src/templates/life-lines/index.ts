import { defineTemplate } from "../types";
import { LifeLines } from "./LifeLines";
import { lifeLinesSchema } from "./schema";
import { DURATION } from "./data";

export const lifeLines = defineTemplate({
  id: "life-lines",
  name: "Созвездие: жизнь линиями",
  description:
    "A life as glowing threads on a night sky: family, friends, colleagues and a dog ride the «now» line on an age axis; whoever leaves becomes a star, and the stars join into a constellation. Silent render, sound added at upload.",
  schema: lifeLinesSchema,
  defaultProps: {
    title: "Жизнь это путь",
    line1: "Кто-то идёт рядом недолго.",
    line2: "Кто-то остаётся в твоём небе навсегда.",
    question: "Напиши СЕМЬЯ в комментариях",
    questionAccent: "СЕМЬЯ",
    hint: "пришлю, как сделать такое про свою семью",
  },
  durationInSeconds: DURATION,
  formats: ["reel"],
  component: LifeLines,
});
