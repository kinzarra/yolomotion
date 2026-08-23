import { defineTemplate } from "../types";
import { vibecloudDeploySchema } from "./schema";
import { VibecloudDeploy } from "./VibecloudDeploy";

export const vibecloudDeploy = defineTemplate({
  id: "vibecloud-deploy",
  name: "VibeClouD — Prompt to Prod",
  description:
    "20s promo: code in an IDE → ask Claude → MCP build & deploy → live site with click + scroll → logo sting.",
  schema: vibecloudDeploySchema,
  defaultProps: {
    brandName: "VibeCloud",
    tagline: "VibeCode. VibeCloud",
    url: "vbcld.com",
    chatPrompt: "Deploy this to prod",
    headline: "Ship vibes, not configs",
  },
  durationInSeconds: 20,
  formats: ["landscape"],
  component: VibecloudDeploy,
});
