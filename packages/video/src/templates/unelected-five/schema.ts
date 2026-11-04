import { z } from "zod";

export const unelectedFiveSchema = z.object({
  /** Series tag in the top bar. */
  series: z.string().min(1),
  /** Episode marker next to it. */
  episode: z.string().min(1),
});

export type UnelectedFiveProps = z.infer<typeof unelectedFiveSchema>;
