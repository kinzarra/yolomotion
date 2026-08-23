import { z } from "zod";

// The public contract of this reel: what a caller may change without editing
// the template. Brand text belongs here — and so do the five quoted figures,
// because the brief asks for «укажите актуальный курс на дату записи»: the
// reel is meant to be re-rendered on a later date with fresh numbers instead
// of being rewritten. The argument itself (buy in parts, not on a spike) is
// the script and stays in the scenes.
export const dollarWaitSchema = z.object({
  /** Series tag in the top bar, e.g. "ДЕНЬГИ · ПРОСТО". */
  series: z.string().min(1),
  /** Episode marker next to it, e.g. "ВЫПУСК 04". */
  episode: z.string().min(1),
  /** The August peak on the chart, e.g. "85 ₽". */
  rateHigh: z.string().min(1),
  /** Where it came back to, e.g. "82,90 ₽". */
  rateNow: z.string().min(1),
  /** The monthly move against the dollar, e.g. "−5,8%". */
  monthDelta: z.string().min(1),
  /** Key rate after the last cut, e.g. "14%". */
  keyRate: z.string().min(1),
  /** Date of the next rate decision, e.g. "11 СЕНТЯБРЯ". */
  nextMeeting: z.string().min(1),
  /** Small print under the finale — the source line. */
  footnote: z.string().min(1),
  /** The mandatory not-investment-advice line. */
  disclaimer: z.string().min(1),
});

export type DollarWaitProps = z.infer<typeof dollarWaitSchema>;
