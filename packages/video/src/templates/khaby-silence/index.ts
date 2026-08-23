import { defineTemplate } from "../types";
import { KhabySilence } from "./KhabySilence";
import { khabySilenceSchema } from "./schema";
import { DURATION } from "./timeline";

export const khabySilence = defineTemplate({
  id: "khaby-silence",
  name: "Yoloco — Khaby Lame: The Power of Silence",
  description:
    "60s vertical Short, editorial mini-documentary: how Khaby Lame became the most-followed creator on TikTok without a word — and why audience fit beats reach. Oversized type, real CC-licensed portraits, black / bone / one vermilion.",
  schema: khabySilenceSchema,
  defaultProps: {
    handle: "@khaby.lame",
    heroPhoto: "khaby-hero.png",
    gesturePhoto: "khaby-gesture.png",
    calmPhoto: "khaby-calm.png",
    stagePhoto: "khaby-stage.png",
    photoCredit:
      "Photos: Web Summit (CC BY 4.0) · State Farm (CC BY 2.0) · via Wikimedia Commons",
    ctaLabel: "FIND THE RIGHT CREATORS.",
    url: "yoloco.io",
  },
  durationInSeconds: DURATION,
  formats: ["reel"],
  component: KhabySilence,
});
