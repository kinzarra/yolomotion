import { z } from "zod";

export const salary2013Schema = z.object({
  /** Series tag in the top bar. */
  series: z.string().min(1),
  /** Episode marker next to it. */
  episode: z.string().min(1),
});

export type Salary2013Props = z.infer<typeof salary2013Schema>;
