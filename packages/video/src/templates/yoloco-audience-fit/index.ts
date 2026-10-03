import { defineTemplate } from "../types";
import { YolocoAudienceFit } from "./YolocoAudienceFit";
import { yolocoAudienceFitSchema } from "./schema";
import { makeTimeline } from "./timeline";

export const yolocoAudienceFit = defineTemplate({
  id: "yoloco-audience-fit",
  name: "Yoloco — Followers ≠ Customers",
  description:
    "30s vertical YouTube Short: follower count is a vanity metric; audience fit, real engagement and audience composition are what sell. Ends on the Yoloco platform.",
  schema: yolocoAudienceFitSchema,
  defaultProps: {
    handle: "@maxvisuals",
    niche: "Lifestyle · YouTube",
    tagline: "Influencer marketing, powered by data.",
    cta: "Follow for smarter influencer marketing.",
  },
  // A function of the props: overridden beats/durations move the composition
  // length. Wired into calculateMetadata by Root.tsx.
  durationInSeconds: (props) => makeTimeline(props).DURATION,
  formats: ["reel"],
  component: YolocoAudienceFit,
});
