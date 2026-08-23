import { defineTemplate } from "../types";
import { BrandsPayingMore } from "./BrandsPayingMore";
import { brandsPayingMoreSchema } from "./schema";
import { DURATION } from "./timeline";

export const brandsPayingMore = defineTemplate({
  id: "brands-paying-more",
  name: "Yoloco — Why AI Ads Cost Brands More",
  description:
    "59s vertical Short on the current AI-brand-deal backlash: creators can charge a premium to post AI ads because audiences punish them for it — and why that makes follower count the wrong thing to buy. Face-led studio hook, oversized editorial type, black / bone / one vermilion.",
  schema: brandsPayingMoreSchema,
  defaultProps: {
    kicker: "Influencer marketing — the AI premium",
    postHandle: "@creator",
    ctaLabel: "FIND THE RIGHT CREATORS.",
    url: "yoloco.io",
  },
  durationInSeconds: DURATION,
  formats: ["reel"],
  component: BrandsPayingMore,
});
