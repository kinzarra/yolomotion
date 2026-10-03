import { z } from "zod";

export const gasolineInflationSchema = z.object({
  series: z.string().min(1),
  episode: z.string().min(1),
  gasolineIncrease: z.string().min(1),
  inflation: z.string().min(1),
  source: z.string().min(1),
});

export type GasolineInflationProps = z.infer<typeof gasolineInflationSchema>;
