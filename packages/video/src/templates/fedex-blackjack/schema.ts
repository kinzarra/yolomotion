import { z } from "zod";

// Everything on screen is fixed by the scenario; no caller props yet.
export const fedexBlackjackSchema = z.object({});

export type FedexBlackjackProps = z.infer<typeof fedexBlackjackSchema>;
