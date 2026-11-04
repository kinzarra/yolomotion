import { defineTemplate } from "../types";
import { SponsorshipPromo } from "./SponsorshipPromo";
import { sponsorshipPromoSchema } from "./schema";
import { DURATION } from "./timeline";

export const sponsorshipPromo = defineTemplate({
  id: "sponsorship-promo",
  name: "Yoloco Конкуренты: промо",
  description:
    "60 s product promo for Yoloco «Конкуренты» (sponsorship reports) in the app's own palette: feed wall of real ads, the form, AI scan, report figures one per frame, the «НИ У КОГО» silence, «Кроме Yoloco» and the CTA.",
  schema: sponsorshipPromoSchema,
  defaultProps: { site: "yoloco.io", section: "Конкуренты" },
  durationInSeconds: DURATION,
  formats: ["reel"],
  component: SponsorshipPromo,
});
