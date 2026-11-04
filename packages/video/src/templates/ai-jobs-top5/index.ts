import React from "react";
import { z } from "zod";
import { defineTemplate } from "../types";
import { Countdown, makeCountdown } from "../_shorts/Countdown";
import { DATA } from "./data";
import { DURATIONS } from "./durations";

const schema = z.object({});
const Comp: React.FC = () => React.createElement(Countdown, { data: DATA, D: DURATIONS });

export const aiJobsTop5 = defineTemplate({
  id: "ai-jobs-top5",
  name: "5 профессий, которые создал ИИ",
  description: "Countdown reel (_shorts/Countdown): data in data.ts, voice in scripts/voiceover/ai-jobs-top5.json.",
  schema,
  defaultProps: {},
  durationInSeconds: makeCountdown(DATA, DURATIONS).DURATION,
  formats: ["reel"],
  component: Comp,
});
