import { z } from "zod";

export const binanceHackSchema = z.object({});

export type BinanceHackProps = z.infer<typeof binanceHackSchema>;
