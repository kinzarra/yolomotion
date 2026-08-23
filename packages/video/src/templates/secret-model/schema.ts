import { z } from "zod";

// The public contract of this reel: what a caller may change without editing
// the template. Same shape as the rest of the VibeCloud series.
//
// Deliberately absent: anything that could turn an attributed claim into a
// stated one. Model names and their status live in the scenes, paired, so a
// props change cannot relabel a rumor as shipping.
export const secretModelSchema = z.object({
  brandName: z.string().min(1),
  chapter: z.string().min(1),
  /** The opening question. Wraps on its own; `MODEL?` lands in the hero color. */
  headline: z.string().min(1),
  /** The line the Short closes on. `|` breaks the line. */
  closingLine: z.string().min(1),
  /** The quiet series sign-off under the closing line. */
  signOff: z.string().min(1),
});

export type SecretModelProps = z.infer<typeof secretModelSchema>;
