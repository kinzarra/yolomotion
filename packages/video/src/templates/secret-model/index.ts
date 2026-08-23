import { defineTemplate } from "../types";
import { SecretModel } from "./SecretModel";
import { secretModelSchema } from "./schema";
import { DURATION } from "./timeline";

export const secretModel = defineTemplate({
  id: "secret-model",
  name: "VibeCloud — Claude Isn't Anthropic's Strongest Model?",
  description:
    "30s vertical Short: the model you use may not be the best one that exists. Shipping lineup vs. an internal slot that stays out of focus, the train → test → evals → release pipeline, and the gap you live in. Confirmed facts are drawn crisp and blue, reported ones blurred, dashed and orange — the labeling rule is the design.",
  schema: secretModelSchema,
  defaultProps: {
    brandName: "VibeCloud",
    chapter: "AI LABS · REPORT",
    headline: "CLAUDE ISN'T ANTHROPIC'S STRONGEST MODEL?",
    closingLine: "THE BEST AI MODEL|MAY BE ONE YOU|CAN'T USE YET.",
    signOff: "AI + CS for vibe coders.",
  },
  durationInSeconds: DURATION,
  formats: ["reel"],
  component: SecretModel,
});
