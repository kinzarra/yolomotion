import { z } from "zod";

export const ballonDorMoneySchema = z.object({
  question: z.string().describe("Comment-bubble question on the end card"),
  winner: z.object({
    name: z.string().describe("Winner as it reads on screen, nominative caps: «КЕЙН»"),
    photo: z.string().describe("Cut-out under public/, e.g. images/ballon-dor-money/kane.png"),
    ratio: z.number().describe("Cut-out width / height"),
    value: z.number().describe("Transfermarkt market value, € millions"),
    club: z.string().describe("Club line under the name"),
  }),
});

export type BallonDorMoneyProps = z.infer<typeof ballonDorMoneySchema>;
