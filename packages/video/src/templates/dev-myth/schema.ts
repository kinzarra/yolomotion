import { z } from "zod";

// The two figures the first beats stand on. Sources: Хабр Карьера, 1-е
// полугодие 2026 (медиана backend 254 000 ₽); Claude Max 5x, 100 $ в месяц.
export const devMythSchema = z.object({
  salary: z.number().describe("Monthly median developer salary, ₽"),
  price: z.number().describe("Monthly price of the machine, $"),
  source: z.string().describe("Salary source line on the paper label"),
});

export type DevMythProps = z.infer<typeof devMythSchema>;
