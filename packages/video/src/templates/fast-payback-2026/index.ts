import React from "react";
import { z } from "zod";
import { defineTemplate } from "../types";
import { Countdown, makeCountdown } from "../_shorts/Countdown";
import { DATA } from "./data";
import { DURATIONS } from "./durations";

const schema = z.object({});
const Comp: React.FC = () => React.createElement(Countdown, { data: DATA, D: DURATIONS });

export const fastPayback2026 = defineTemplate({
  id: "fast-payback-2026",
  name: "Топ-5 бизнесов с самой быстрой окупаемостью",
  description: "Countdown reel (_shorts/Countdown): data in data.ts, voice in scripts/voiceover/fast-payback-2026.json.",
  schema,
  defaultProps: {},
  durationInSeconds: makeCountdown(DATA, DURATIONS).DURATION,
  formats: ["reel"],
  component: Comp,
});
