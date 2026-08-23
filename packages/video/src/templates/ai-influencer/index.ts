import { defineTemplate } from "../types";
import { AiInfluencer } from "./AiInfluencer";
import { aiInfluencerSchema } from "./schema";
import { DURATION } from "./timeline";

export const aiInfluencer = defineTemplate({
  id: "ai-influencer",
  name: "Yoloco — The Influencer Who Doesn't Exist",
  description:
    "30s vertical YouTube Short: an AI influencer promotes real products — will AI replace human creators? Black/white/red, glitch language, loops back to the opening shot.",
  schema: aiInfluencerSchema,
  defaultProps: {
    handle: "@ava.official",
    followers: "2.4M FOLLOWERS",
    ctaLabel: "COMMENT BELOW",
  },
  durationInSeconds: DURATION,
  formats: ["reel"],
  component: AiInfluencer,
});
