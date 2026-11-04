import React from "react";
import { z } from "zod";
import { defineTemplate } from "../types";
import { Pyramid, makePyramid } from "../_shorts/Pyramid";
import { DATA } from "./data";
import { DURATIONS } from "./durations";

const Comp: React.FC = () => React.createElement(Pyramid, { data: DATA, D: DURATIONS });

export const aiOnePercentEn = defineTemplate({
  id: "ai-one-percent-en",
  name: "Are you in the 1%? Who uses AI",
  description: "Layer pyramid reel (_shorts/Pyramid): data in data.ts, voice in scripts/voiceover/ai-one-percent-en.json.",
  schema: z.object({}),
  defaultProps: {},
  durationInSeconds: makePyramid(DATA, DURATIONS).DURATION,
  formats: ["reel"],
  component: Comp,
});
