import { defineTemplate } from "../types";
import { Sberbook1991 } from "./Sberbook1991";
import { sberbook1991Schema } from "./schema";
import { DURATION } from "./timeline";

export const sberbook1991 = defineTemplate({
  id: "sberbook-1991",
  name: "Сберкнижка 1991: 10 000 рублей = ? сегодня",
  description:
    "«ДЕНЬГИ · ПРОСТО»: a Soviet savings book with 10 000 руб. — what prices did to it year by year, and what the state gives back today. Voice in the hook only.",
  schema: sberbook1991Schema,
  defaultProps: {
    series: "ДЕНЬГИ · ПРОСТО",
    episode: "ВЫПУСК 10",
  },
  durationInSeconds: DURATION,
  formats: ["reel"],
  component: Sberbook1991,
});
