import { defineTemplate } from "../types";
import { FourWallets } from "./FourWallets";
import { fourWalletsSchema } from "./schema";
import { DURATION } from "./timeline";

export const fourWallets = defineTemplate({
  id: "four-wallets",
  name: "Кто богаче в 65?",
  description: "Four lives from 18 to 65 on one night-sky chart (worker, businessman, married well, rich kid): each wallet rises and falls on life events, peaks stay as stars, the rich kid ends last. No voice.",
  schema: fourWalletsSchema,
  defaultProps: {},
  durationInSeconds: DURATION,
  formats: ["reel"],
  component: FourWallets,
});
