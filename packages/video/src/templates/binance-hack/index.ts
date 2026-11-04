import { defineTemplate } from "../types";
import { BinanceHack } from "./BinanceHack";
import { binanceHackSchema } from "./schema";
import { DURATION } from "./timeline";

export const binanceHack = defineTemplate({
  id: "binance-hack",
  name: "Binance: 6,3 млрд за 20 минут",
  description: "Noir comic case file: $6.36B left Binance in 20 minutes through one engineer laptop; suspects, frozen funds, the bitcoin nobody can freeze.",
  schema: binanceHackSchema,
  defaultProps: {},
  durationInSeconds: DURATION,
  formats: ["reel"],
  component: BinanceHack,
});
