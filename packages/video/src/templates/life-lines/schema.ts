import { z } from "zod";

// What a caller may change: the closing words. The life itself is data.ts.
export const lifeLinesSchema = z.object({
  title: z.string().min(1),
  line1: z.string().min(1),
  line2: z.string().min(1),
  /** The comment question in the pill; questionAccent is highlighted inside it. */
  question: z.string().min(1),
  questionAccent: z.string().min(1),
  /** Small line under the pill: what to do with the question. */
  hint: z.string(),
});

export type LifeLinesProps = z.infer<typeof lifeLinesSchema>;
