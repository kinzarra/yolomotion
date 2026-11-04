import { defineTemplate } from "../types";
import { AiMoneyCircle } from "./AiMoneyCircle";
import { aiMoneyCircleSchema } from "./schema";
import { DURATION } from "./timeline";

export const aiMoneyCircle = defineTemplate({
  id: "ai-money-circle",
  name: "Кто кому должен в ИИ: карта за 30 секунд",
  description:
    "«ДЕНЬГИ · ПРОСТО»: one map of ten logos drawn arrow by arrow, one figure at a time. The hook closes the Nvidia → OpenAI → Oracle → Nvidia circle; the beats show who funded OpenAI, whom it promised to pay, who holds Anthropic, whom Nvidia sells to, and where it is thin.",
  schema: aiMoneyCircleSchema,
  defaultProps: {
    series: "ДЕНЬГИ · ПРОСТО",
    episode: "ВЫПУСК 17",
  },
  durationInSeconds: DURATION,
  formats: ["reel"],
  component: AiMoneyCircle,
});
