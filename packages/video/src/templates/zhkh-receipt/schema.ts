import { z } from "zod";

// Nothing to override from outside: the figures live in data.ts with their sources.
export const zhkhReceiptSchema = z.object({});

export type ZhkhReceiptProps = z.infer<typeof zhkhReceiptSchema>;
