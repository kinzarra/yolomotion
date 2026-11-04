import { defineTemplate } from "../types";
import { UsdFivePeople } from "./UsdFivePeople";
import { usdFivePeopleSchema } from "./schema";
import { DURATION } from "./timeline";

export const usdFivePeople = defineTemplate({
  id: "usd-five-people",
  name: "Кто решает курс рубля к доллару?",
  description:
    "«ДЕНЬГИ · ПРОСТО»: five non-obvious people who move the ruble-dollar rate — not Putin, not Trump. One object: 100 ₽ = $1.",
  schema: usdFivePeopleSchema,
  defaultProps: {
    series: "ДЕНЬГИ · ПРОСТО",
    episode: "ВЫПУСК 07",
    rate: "83,76",
  },
  durationInSeconds: DURATION,
  formats: ["reel"],
  component: UsdFivePeople,
});
