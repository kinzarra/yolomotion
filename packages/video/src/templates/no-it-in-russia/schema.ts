import { z } from "zod";

// The public contract of this reel: what a caller may change without editing
// the template. Brand text belongs here — and so do the three quoted figures,
// because a labour-market reel dates fast and is meant to be re-rendered with
// fresh numbers rather than rewritten. The argument itself (the assistant
// cancels the second hire rather than firing the first) is the script and
// stays in the scenes.
export const noItInRussiaSchema = z.object({
  /** Series tag in the top bar, e.g. "ДЕНЬГИ · ПРОСТО". */
  series: z.string().min(1),
  /** Episode marker next to it, e.g. "ВЫПУСК 05". */
  episode: z.string().min(1),
  /** Applicants per opening — the hook's number, e.g. "24". */
  applicants: z.string().min(1),
  /** Year-on-year move in openings, e.g. "≈ −32%". */
  vacancyDelta: z.string().min(1),
  /** How many listings the study read, as a number the counter runs up to. */
  scanned: z.number().int().positive(),
  /** Small print under the finale — where the figures come from. */
  footnote: z.string().min(1),
});

export type NoItInRussiaProps = z.infer<typeof noItInRussiaSchema>;
