import { z } from "zod";

// Everything on screen is fixed by the scenario; no caller props yet.
export const dessaDuplexSchema = z.object({});

export type DessaDuplexProps = z.infer<typeof dessaDuplexSchema>;
