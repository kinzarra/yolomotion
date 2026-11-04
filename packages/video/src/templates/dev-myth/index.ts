import { defineTemplate } from "../types";
import { DevMyth } from "./DevMyth";
import { devMythSchema } from "./schema";
import { DURATION } from "./timeline";

export const devMyth = defineTemplate({
  id: "dev-myth",
  name: "Как разработчики обманывали нас",
  description: "Long-format YouTube explainer (16:9). Hook: the author's face confesses «20 лет в IT, мы вас обманывали», then 254 000 ₽ a month against a 100 $ machine.",
  schema: devMythSchema,
  defaultProps: {
    salary: 254000,
    price: 100,
    source: "МЕДИАНА BACKEND · ХАБР КАРЬЕРА · 1-Е ПОЛУГОДИЕ 2026",
  },
  durationInSeconds: DURATION,
  formats: ["landscape"],
  component: DevMyth,
});
