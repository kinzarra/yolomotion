import { z } from "zod";

export const sberbook1991Schema = z.object({
  /** Series tag in the top bar. */
  series: z.string().min(1),
  /** Episode marker next to it. */
  episode: z.string().min(1),
});

export type Sberbook1991Props = z.infer<typeof sberbook1991Schema>;
