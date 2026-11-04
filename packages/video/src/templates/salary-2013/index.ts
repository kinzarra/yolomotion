import { defineTemplate } from "../types";
import { Salary2013 } from "./Salary2013";
import { salary2013Schema } from "./schema";
import { DURATION } from "./timeline";

export const salary2013 = defineTemplate({
  id: "salary-2013",
  name: "Зарплата 30 000 ₽ в 2013 = ? сегодня",
  description:
    "«ДЕНЬГИ · ПРОСТО»: one salary from 2013 to today — on paper ×3,4, in 2013 prices far less. Voice in the hook only.",
  schema: salary2013Schema,
  defaultProps: {
    series: "ДЕНЬГИ · ПРОСТО",
    episode: "ВЫПУСК 08",
  },
  durationInSeconds: DURATION,
  formats: ["reel"],
  component: Salary2013,
});
