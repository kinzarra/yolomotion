import { z } from "zod";
import { zColor } from "@remotion/zod-types";

export const logoStingSchema = z.object({
  brandName: z.string().min(1),
  tagline: z.string(),
  // Brand overrides; omitted fields fall back to the theme palette.
  primary: zColor().optional(),
  accent: zColor().optional(),
});

export type LogoStingProps = z.infer<typeof logoStingSchema>;
