import { z } from "zod";

export const yolocoAudienceFitSchema = z.object({
  handle: z.string().min(1), // the "looks huge" creator
  niche: z.string().min(1),
  tagline: z.string().min(1),
  cta: z.string().min(1),
});

export type YolocoAudienceFitProps = z.infer<typeof yolocoAudienceFitSchema>;
