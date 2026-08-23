import { z } from "zod";

// The public contract of this reel: what a caller may change without editing
// the template. Brand text and the source line belong here, motion does
// not — and neither do the facts in the beats, which are the script.
export const phoneCheckSchema = z.object({
  /** Series tag in the top bar, e.g. "ДЕНЬГИ · ПРОСТО". */
  series: z.string().min(1),
  /** Episode marker next to it, e.g. "ВЫПУСК 03". */
  episode: z.string().min(1),
  /** Amount on the stylised transfer screen, e.g. "50 000 ₽". */
  amount: z.string().min(1),
  /** Small print under the finale — the source line. */
  footnote: z.string().min(1),
});

export type PhoneCheckProps = z.infer<typeof phoneCheckSchema>;
