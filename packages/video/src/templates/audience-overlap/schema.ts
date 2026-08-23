import { z } from "zod";

export const audienceOverlapSchema = z.object({
  tagline: z.string().describe("Finale line under the Yoloco logo"),
  ctaLabel: z.string().describe("Final call-to-action chip text"),
});

export type AudienceOverlapProps = z.infer<typeof audienceOverlapSchema>;
