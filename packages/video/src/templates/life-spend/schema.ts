import { z } from "zod";

// What a caller may change: the words. The life itself is data.ts.
export const lifeSpendSchema = z.object({
  hook: z.string().min(1),
  line1: z.string().min(1),
  line2: z.string().min(1),
  question: z.string().min(1),
});

export type LifeSpendProps = z.infer<typeof lifeSpendSchema>;
