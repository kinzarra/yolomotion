import { z } from "zod";

// The public contract of this reel: what a caller may change without editing
// the template. Brand text belongs here, motion does not.
export const dubaiEconomySchema = z.object({
  series: z.string().min(1).describe("Series tag, top-left"),
  episode: z.string().min(1).describe("Episode marker, top-right"),
  question: z.string().min(1).describe("The CTA question, on screen in model and cta"),
  credits: z.string().min(1).describe("Footage credit line in the closing beat"),
});

export type DubaiEconomyProps = z.infer<typeof dubaiEconomySchema>;
