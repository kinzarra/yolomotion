import { defineTemplate } from "../types";
import { DubaiEconomy } from "./DubaiEconomy";
import { dubaiEconomySchema } from "./schema";
import { DURATION } from "./timeline";

export const dubaiEconomy = defineTemplate({
  id: "dubai-economy",
  name: "Как устроена экономика Дубая",
  description: "TODO: one line — what the viewer sees and what it sells.",
  schema: dubaiEconomySchema,
  defaultProps: {
    ctaLabel: "LEARN MORE",
  },
  durationInSeconds: DURATION,
  formats: ["reel"],
  component: DubaiEconomy,
});
