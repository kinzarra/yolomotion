import { z } from "zod";

export const usdFivePeopleSchema = z.object({
  /** Series tag in the top bar. */
  series: z.string().min(1),
  /** Episode marker next to it. */
  episode: z.string().min(1),
  /** The rate the ticker prints, e.g. "83,95" (ЦБ, day of release). */
  rate: z.string().min(1),
});

export type UsdFivePeopleProps = z.infer<typeof usdFivePeopleSchema>;
