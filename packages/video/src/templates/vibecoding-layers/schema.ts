import { z } from "zod";

// Nothing to override from outside: the words live in data.ts.
export const vibecodingLayersSchema = z.object({});

export type VibecodingLayersProps = z.infer<typeof vibecodingLayersSchema>;
