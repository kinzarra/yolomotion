import { defineTemplate } from "../types";
import { TeslaRoadster } from "./TeslaRoadster";
import { teslaRoadsterSchema } from "./schema";
import { DURATION } from "./timeline";

export const teslaRoadster = defineTemplate({
  id: "tesla-roadster",
  name: "Маск сделал летающую Теслу",
  description:
    "«ДЕНЬГИ · ПРОСТО»: Tesla's flying Roadster (15.10.2026) — the flight, then what it really costs: a $50 000 deposit and no price.",
  schema: teslaRoadsterSchema,
  defaultProps: {
    series: "ДЕНЬГИ · ПРОСТО",
    episode: "ВЫПУСК 09",
  },
  durationInSeconds: DURATION,
  formats: ["reel"],
  component: TeslaRoadster,
});
