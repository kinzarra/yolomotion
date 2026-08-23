import { z } from "zod";

export const vibecloudDeploySchema = z.object({
  brandName: z.string().min(1),
  tagline: z.string(),
  url: z.string(),
  chatPrompt: z.string(),
  headline: z.string(), // headline shown on the "live product" page
});

export type VibecloudDeployProps = z.infer<typeof vibecloudDeploySchema>;
