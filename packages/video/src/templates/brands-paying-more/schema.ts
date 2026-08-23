import { z } from "zod";

// The public contract of this reel: what a caller may change without editing
// the template. Brand text belongs here, motion does not.
//
// Deliberately absent: every figure on screen. The money ladder, the trust
// percentages and the three creators are conceptual, they are labelled as
// conceptual in frame, and making them props would invite someone to swap in
// numbers the voiceover does not support.
export const brandsPayingMoreSchema = z.object({
  kicker: z.string().describe("Mono eyebrow over the hook headline"),
  postHandle: z
    .string()
    .describe("Handle on the fictional sponsored post — must not name a real account"),
  ctaLabel: z.string().describe("Closing line under the Yoloco mark"),
  url: z.string().describe("Closing URL"),
});

export type BrandsPayingMoreProps = z.infer<typeof brandsPayingMoreSchema>;
