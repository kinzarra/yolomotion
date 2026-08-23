import { z } from "zod";

export const databaseIndexSchema = z.object({
  brandName: z.string().min(1),
  chapter: z.string().min(1),
  /** The SELECT that is scanned first and indexed second. */
  query: z.string().min(1),
  /** The DDL typed in the payoff scene. */
  indexStatement: z.string().min(1),
  /** The row every scene is hunting for. */
  targetEmail: z.string().min(1),
  closingLine: z.string().min(1),
});

export type DatabaseIndexProps = z.infer<typeof databaseIndexSchema>;
