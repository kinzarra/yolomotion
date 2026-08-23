import { defineTemplate } from "../types";
import { AudienceOverlap } from "./AudienceOverlap";
import { audienceOverlapSchema } from "./schema";
import { DURATION } from "./timeline";

export const audienceOverlap = defineTemplate({
  id: "audience-overlap",
  name: "Yoloco — Five Influencers. Five Invoices. One Audience.",
  description:
    "30s vertical YouTube Short: brands pay five creators who share the same followers — Yoloco exposes audience overlap before the spend. Dark / electric green / red, kinetic type, loops back to the opening cards.",
  schema: audienceOverlapSchema,
  defaultProps: {
    tagline: "SEE WHO YOU'RE REALLY PAYING FOR",
    ctaLabel: "ANALYZE BEFORE YOU SPEND",
  },
  durationInSeconds: DURATION,
  formats: ["reel"],
  component: AudienceOverlap,
});
