import { defineTemplate } from "../types";
import { Mrbeast100k } from "./Mrbeast100k";
import { mrbeast100kSchema } from "./schema";
import { DURATION } from "./timeline";

export const mrbeast100k = defineTemplate({
  id: "mrbeast-100k",
  name: "Yoloco — MrBeast Counted To 100,000",
  description:
    "50s vertical Short: the 2017 counting video as a lesson in format design — simple idea + extreme execution = irresistible story. Kinetic type, counters and data-viz in YouTube red on black.",
  schema: mrbeast100kSchema,
  defaultProps: {
    tapePhoto: "mrbeast-tape.jpg",
    studioPhoto: "mrbeast-cutout.png",
    photoCredit:
      "Photos: Fidias (CC BY 3.0) · Steven Khan (CC BY 4.0) · Wikimedia Commons",
    sourceLabel: 'MrBeast — "I Counted To 100,000!" (2017)',
    tagline: "Study creators.|Understand growth.",
    ctaLabel: "YOLOCO.IO",
  },
  durationInSeconds: DURATION,
  formats: ["reel"],
  component: Mrbeast100k,
});
