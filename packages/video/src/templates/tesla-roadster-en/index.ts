import { defineTemplate } from "../types";
import { TeslaRoadsterEn } from "./TeslaRoadster";
import { teslaRoadsterSchema } from "./schema";
import { DURATION } from "./timeline";

export const teslaRoadsterEn = defineTemplate({
  id: "tesla-roadster-en",
  name: "Musk made a flying Tesla (EN)",
  description:
    "MONEY · SIMPLY, English cut of tesla-roadster: the flying Roadster (Oct 15, 2026), then what it really costs: a $50,000 deposit and no price.",
  schema: teslaRoadsterSchema,
  defaultProps: {
    series: "MONEY · SIMPLY",
    episode: "EP. 09",
  },
  durationInSeconds: DURATION,
  formats: ["reel"],
  component: TeslaRoadsterEn,
});
