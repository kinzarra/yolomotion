import { z } from "zod";

// The public contract of this reel: what a caller may change without editing
// the template. Brand text and the legal footnote belong here, motion does
// not — and neither do the market facts in the beats, which are the script.
export const btcSqueezeSchema = z.object({
  /** Series tag in the top bar, e.g. "ДЕНЬГИ · ПРОСТО". */
  series: z.string().min(1),
  /** Episode marker next to it, e.g. "ВЫПУСК 02". */
  episode: z.string().min(1),
  /** Data date printed on the closing receipt. */
  dataDate: z.string().min(1),
  /** Small print under the finale. */
  footnote: z.string().min(1),
});

export type BtcSqueezeProps = z.infer<typeof btcSqueezeSchema>;
