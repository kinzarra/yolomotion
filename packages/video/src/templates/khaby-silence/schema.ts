import { z } from "zod";

// The public contract of this reel: what a caller may change without editing
// the template. Brand text and the photo assets belong here, motion does not.
export const khabySilenceSchema = z.object({
  handle: z.string().describe("Creator handle shown on the phone in the 2020 beat"),
  // Filenames inside public/images/. All four shipped photographs are CC BY
  // subject mattes — see public/images/CREDITS.md — and `photoCredit` is
  // what discharges those licences.
  heroPhoto: z.string().describe("Hero portrait PNG with alpha (hook)"),
  gesturePhoto: z.string().describe("Open-palms gesture PNG with alpha (opposite, globe)"),
  calmPhoto: z.string().describe("Second portrait PNG with alpha (barrier reveal)"),
  stagePhoto: z.string().describe("Full-figure PNG with alpha (#1 frame)"),
  photoCredit: z
    .string()
    .describe("On-screen photo attribution, required by the CC BY licences"),
  ctaLabel: z.string().describe("Closing line under the Yoloco mark"),
  url: z.string().describe("Closing URL"),
});

export type KhabySilenceProps = z.infer<typeof khabySilenceSchema>;
