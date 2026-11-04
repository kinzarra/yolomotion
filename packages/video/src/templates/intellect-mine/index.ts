import { defineTemplate } from "../types";
import { IntellectMine } from "./IntellectMine";
import { intellectMineSchema } from "./schema";
import { DURATION } from "./timeline";

export const intellectMine = defineTemplate({
  id: "intellect-mine",
  name: "Как добывают интеллект",
  description: "Long-format YouTube explainer (16:9), ВЫПУСК 09: the AI supply chain from quartz to a token, six parts, face on the hook, the promise and the conclusion.",
  schema: intellectMineSchema,
  defaultProps: { series: "ДЕНЬГИ · ПРОСТО", episode: "ВЫПУСК 09" },
  durationInSeconds: DURATION,
  formats: ["landscape"],
  component: IntellectMine,
});
