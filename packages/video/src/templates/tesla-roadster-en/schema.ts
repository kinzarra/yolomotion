import { z } from "zod";

export const teslaRoadsterSchema = z.object({
  /** Series tag in the top bar. */
  series: z.string().min(1),
  /** Episode marker next to it. */
  episode: z.string().min(1),
});

export type TeslaRoadsterProps = z.infer<typeof teslaRoadsterSchema>;
