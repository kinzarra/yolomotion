import { z } from "zod";

// The public contract of this film: what a caller may change without editing
// the template. Brand text belongs here, motion does not.
export const replaceCostSchema = z.object({
  series: z.string().min(1).describe("Series tag, top-left"),
  episode: z.string().min(1).describe("Episode marker, top-right"),
  question: z.string().min(1).describe("The CTA question"),
  credits: z.string().min(1).describe("Footage credit line in the closing beat"),
  sources: z.string().min(1).describe("Data sources line in the closing beat"),
  face: z
    .boolean()
    .describe("true = HeyGen inserts from presenter.ts; false = placeholder cards (not generated yet)"),
});

export type ReplaceCostProps = z.infer<typeof replaceCostSchema>;
