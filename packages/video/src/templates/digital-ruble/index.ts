import { defineTemplate } from "../types";
import { DigitalRuble } from "./DigitalRuble";
import { digitalRubleSchema } from "./schema";
import { DURATION } from "./timeline";

export const digitalRuble = defineTemplate({
  id: "digital-ruble",
  name: "Цифровой рубль: что изменится с 1 сентября?",
  description:
    "Personal finance-blog explainer in the «ЧЕК × ПИКСЕЛЬ» style: thermal receipts for the money you know, acid-lime glitch for the digital ruble. Card tears into a pixel ₽, three forms of one ruble, ₽1 = 1 digital ₽, the 1 September rollout, voluntary wallets, zero fees, no interest — and a DA / NET comment CTA.",
  schema: digitalRubleSchema,
  defaultProps: {
    series: "ДЕНЬГИ · ПРОСТО",
    episode: "ВЫПУСК 01",
    yesLabel: "ДА",
    noLabel: "НЕТ",
    commentTarget: 1284,
  },
  durationInSeconds: DURATION,
  formats: ["reel"],
  component: DigitalRuble,
});
