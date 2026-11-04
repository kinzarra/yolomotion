import { defineTemplate } from "../types";
import { LifeSpend } from "./LifeSpend";
import { lifeSpendSchema } from "./schema";
import { DURATION } from "./data";

export const lifeSpend = defineTemplate({
  id: "life-spend",
  name: "Жизнь в покупках",
  description:
    "life-lines sky, told by purchases: from baby formula to the funeral home. Each purchase branches off whoever pays, rides a moment and rises as a small star; cars swap on one lane, the mortgage is a thick line for 20 years. Silent render.",
  schema: lifeSpendSchema,
  defaultProps: {
    hook: "Вся жизнь в покупках",
    line1: "За жизнь ты купишь тысячи вещей.",
    line2: "Последнюю купят за тебя.",
    question: "Что было твоей первой покупкой?",
  },
  durationInSeconds: DURATION,
  formats: ["reel"],
  component: LifeSpend,
});
