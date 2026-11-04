import { z } from "zod";

// Preview stage (2026-10-26): the brain ages 0 → 85 while it turns.
export const brainAgesSchema = z.object({
  /** draw the neural net on the cortex */
  net: z.boolean(),
});

export type BrainAgesProps = z.infer<typeof brainAgesSchema>;
