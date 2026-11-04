import { z } from "zod";

// Everything on screen is fixed by the scenario; no caller props yet.
export const shawarmaFactorySchema = z.object({});

export type ShawarmaFactoryProps = z.infer<typeof shawarmaFactorySchema>;
