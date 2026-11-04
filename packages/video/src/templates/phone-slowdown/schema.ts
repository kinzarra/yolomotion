import { z } from "zod";

// The figures the reel stands on (sources in scripts/scenarios/phone-slowdown.md).
export const phoneSlowdownSchema = z.object({
  phonePrice: z.number().describe("Average smartphone price in Russia, ₽ (М.Видео, Q1 2026)"),
  lifetimeLoss: z.number().describe("Lifetime overpay, ₽: (60/3 − 60/6) × phonePrice"),
});
export type PhoneSlowdownProps = z.infer<typeof phoneSlowdownSchema>;
