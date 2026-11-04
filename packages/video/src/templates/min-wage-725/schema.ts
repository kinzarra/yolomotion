import { z } from "zod";

export const minWage725Schema = z.object({
  /** Series tag in the top bar. */
  series: z.string().min(1),
  /** Episode marker next to it. */
  episode: z.string().min(1),
});

export type MinWage725Props = z.infer<typeof minWage725Schema>;
