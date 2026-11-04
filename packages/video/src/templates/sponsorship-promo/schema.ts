import { z } from "zod";

// What a caller may change without editing the template: the CTA text.
// The figures in the beats are the script (the MIXIT vs VOIS vs The Act report).
export const sponsorshipPromoSchema = z.object({
  /** Site on the final card. */
  site: z.string().min(1),
  /** The product section name, as in the app's menu. */
  section: z.string().min(1),
  /** Server render: base URL of per-job clips. */
  voiceoverDir: z.string().optional(),
});

export type SponsorshipPromoProps = z.infer<typeof sponsorshipPromoSchema>;
