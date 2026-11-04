import { z } from "zod";

export const intellectMineSchema = z.object({
  series: z.string().min(1),
  episode: z.string().min(1),
});

export type IntellectMineProps = z.infer<typeof intellectMineSchema>;
