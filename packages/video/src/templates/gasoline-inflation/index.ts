import { defineTemplate } from "../types";
import { GasolineInflation } from "./GasolineInflation";
import { gasolineInflationSchema } from "./schema";
import { DURATION } from "./timeline";

export const gasolineInflation = defineTemplate({
  id: "gasoline-inflation",
  name: "Почему бензин оказывается в твоём чеке",
  description:
    "55-секундный vertical explainer: дефицит топлива превращается в инфляцию издержек через поле, перевозку, производство, склад и магазин. Реальные proof-кадры, один короткий студийный HeyGen-хук и JSON-караоке-субтитры.",
  schema: gasolineInflationSchema,
  defaultProps: {
    series: "ДЕНЬГИ · ПРОСТО",
    episode: "ВЫПУСК 06",
    gasolineIncrease: "+17,7%",
    inflation: "+4,7%",
    source: "Росстат • 10.08.2026",
  },
  durationInSeconds: DURATION,
  formats: ["reel"],
  component: GasolineInflation,
});
