import { defineTemplate } from "../types";
import { FedexBlackjack } from "./FedexBlackjack";
import { fedexBlackjackSchema } from "./schema";
import { DURATION } from "./timeline";

export const fedexBlackjack = defineTemplate({
  id: "fedex-blackjack",
  name: "FedEx: последние $5 000 в казино",
  description: "1973: Federal Express has $5 000 and a $24 000 fuel bill; Fred Smith flies to Las Vegas, wins $27 000 at blackjack, the jets fly on Monday.",
  schema: fedexBlackjackSchema,
  defaultProps: {},
  durationInSeconds: DURATION,
  formats: ["reel"],
  component: FedexBlackjack,
});
