import { defineTemplate } from "../types";
import { MinWage725 } from "./MinWage725";
import { minWage725Schema } from "./schema";
import { DURATION } from "./timeline";

export const minWage725 = defineTemplate({
  id: "min-wage-725",
  name: "$7.25 since 2009. What's it worth now?",
  description:
    "MONEY · SIMPLY (EN): the US federal minimum wage, $7.25 since 2009, paid out in real $1 bills and coins year by year in 2009 dollars. Voice in the hook only.",
  schema: minWage725Schema,
  defaultProps: {
    series: "MONEY · SIMPLY",
    episode: "EP. 10",
  },
  durationInSeconds: DURATION,
  formats: ["reel"],
  component: MinWage725,
});
