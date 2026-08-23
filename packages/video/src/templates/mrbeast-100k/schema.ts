import { z } from "zod";

// The public contract of this reel: what a caller may change without editing
// the template. Brand text belongs here, motion does not.
export const mrbeast100kSchema = z.object({
  // Filenames inside public/images/. Both shipped photographs are CC BY — see
  // public/images/CREDITS.md — and `photoCredit` is what discharges that.
  tapePhoto: z
    .string()
    .describe("Archival-card photo in public/images/ (a video frame reads best)"),
  studioPhoto: z
    .string()
    .describe("Collage cut-out PNG with alpha in public/images/ — see scripts/cutout.mjs"),
  photoCredit: z
    .string()
    .describe("On-screen photo attribution, required by the CC BY licences"),
  sourceLabel: z
    .string()
    .describe("Citation under the archival player card in the hook"),
  tagline: z.string().describe("Two-line closing tagline, split on |"),
  ctaLabel: z.string().describe("Final call-to-action chip text"),
});

export type Mrbeast100kProps = z.infer<typeof mrbeast100kSchema>;
