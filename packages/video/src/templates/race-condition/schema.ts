import { z } from "zod";

// The public contract of this reel: what a caller may change without editing
// the template. Same shape as the rest of the VibeCloud series.
export const raceConditionSchema = z.object({
  brandName: z.string().min(1),
  chapter: z.string().min(1),
  /** What is being oversold — drives the hook headline. */
  itemLabel: z.string().min(1),
  /** The law the Short closes on. `|` breaks the line. */
  closingLine: z.string().min(1),
  /** The quiet series sign-off under the law. */
  signOff: z.string().min(1),
});

export type RaceConditionProps = z.infer<typeof raceConditionSchema>;
