import { defineTemplate } from "../types";
import { BtcSqueeze } from "./BtcSqueeze";
import { btcSqueezeSchema } from "./schema";
import { DURATION } from "./timeline";

export const btcSqueeze = defineTemplate({
  id: "btc-squeeze",
  name: "Биткойн +20%: кнопку «памп» нажали не в крипте",
  description:
    "Personal finance-blog market thriller in the «ЧЕК × ПИКСЕЛЬ» style: a red chart breaks out lime and a ₿ coin punches through; the US Treasury doubles its buybacks ($2B → $4B), ПЕЧАТНЫЙ СТАНОК? gets struck out, the White House and the CLARITY Act, a domino cascade of SHORT blocks worth $2.75B, the squeeze loop, $1B into spot ETFs, the four-link chain — and a «смотри на деньги, а не на свечи» close.",
  schema: btcSqueezeSchema,
  defaultProps: {
    series: "ДЕНЬГИ · ПРОСТО",
    episode: "ВЫПУСК 02",
    dataDate: "21 АВГ 2026",
    footnote: "Объяснение механики рынка, не инвестиционная рекомендация",
  },
  durationInSeconds: DURATION,
  formats: ["reel"],
  component: BtcSqueeze,
});
