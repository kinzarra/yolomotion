import { z } from "zod";

export const nintendoCardsSchema = z.object({
  question: z.string().describe("Comment-bubble question on the end card"),
});

export type NintendoCardsProps = z.infer<typeof nintendoCardsSchema>;
