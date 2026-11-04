import { z } from "zod";

// Nothing to override from outside: the four lives live in data.ts.
export const fourWalletsSchema = z.object({});

export type FourWalletsProps = z.infer<typeof fourWalletsSchema>;
