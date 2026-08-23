import { z } from "zod";

// The public contract of this reel: what a caller may change without editing
// the template. Brand text and the closing question belong here, motion does
// not — and neither do the facts in the beats, which are the script.
export const digitalRubleSchema = z.object({
  /** Series tag in the top bar, e.g. "ДЕНЬГИ · ПРОСТО". */
  series: z.string().min(1),
  /** Episode marker next to it, e.g. "ВЫПУСК 01". */
  episode: z.string().min(1),
  /** The two words the CTA asks for in the comments. */
  yesLabel: z.string().min(1),
  noLabel: z.string().min(1),
  /** Where the comment counter races to in the finale. */
  commentTarget: z.number().int().positive(),
});

export type DigitalRubleProps = z.infer<typeof digitalRubleSchema>;
