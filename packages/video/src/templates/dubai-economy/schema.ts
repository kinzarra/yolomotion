import { z } from "zod";

// The public contract of this reel: what a caller may change without editing
// the template. Brand text belongs here, motion does not.
export const dubaiEconomySchema = z.object({
  ctaLabel: z.string().describe("Final call-to-action chip text"),
});

export type DubaiEconomyProps = z.infer<typeof dubaiEconomySchema>;
