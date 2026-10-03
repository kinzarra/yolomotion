import { z } from "zod";

// The public contract of this reel: what a caller may change without editing
// the template. The address is a prop because the promo outlives the domain —
// a demo build, a partner deck and the live channel want different closes.
export const yoclipsPromoSchema = z.object({
  ctaLabel: z.string().describe("Closing chip — the address the viewer types"),
});

export type YoclipsPromoProps = z.infer<typeof yoclipsPromoSchema>;
