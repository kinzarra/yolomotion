import { z } from "zod";

export const serbiaEconomySchema = z.object({
  question: z.string().describe("Comment-bubble question on the end card"),
});

export type SerbiaEconomyProps = z.infer<typeof serbiaEconomySchema>;
