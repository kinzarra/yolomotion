import { defineTemplate } from "../types";
import { UnelectedFive } from "./UnelectedFive";
import { unelectedFiveSchema } from "./schema";
import { DURATION } from "./timeline";

export const unelectedFive = defineTemplate({
  id: "unelected-five",
  name: "Кто решает за тебя? 5 человек без выборов",
  description:
    "«ДЕНЬГИ · ПРОСТО»: five people who really move the world and never make the news: not Musk, not Trump, not Putin. Countdown 5 to 1, one lever and one number each.",
  schema: unelectedFiveSchema,
  defaultProps: {
    series: "ДЕНЬГИ · ПРОСТО",
    episode: "ВЫПУСК 12",
  },
  durationInSeconds: DURATION,
  formats: ["reel"],
  component: UnelectedFive,
});
