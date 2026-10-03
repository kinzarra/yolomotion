import { defineTemplate } from "../types";
import { YoclipsPromo } from "./YoclipsPromo";
import { yoclipsPromoSchema } from "./schema";
import { DURATION } from "./timeline";

export const yoclipsPromo = defineTemplate({
  id: "yoclips-promo",
  name: "YoClips — Канал, который снимает сам себя",
  description:
    "Промо продукта: один абзац брифа превращается в опубликованный Shorts за $0.25. Шесть скринкастов настоящего кабинета как улики, «ЧЕК × ПИКСЕЛЬ» как язык.",
  schema: yoclipsPromoSchema,
  defaultProps: {
    ctaLabel: "CLIPS.YOLOCO.IO",
  },
  durationInSeconds: DURATION,
  formats: ["reel"],
  component: YoclipsPromo,
});
