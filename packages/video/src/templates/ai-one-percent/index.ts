import React from "react";
import { z } from "zod";
import { defineTemplate } from "../types";
import { Pyramid, makePyramid } from "../_shorts/Pyramid";
import { DATA } from "./data";
import { DURATIONS } from "./durations";

const Comp: React.FC = () => React.createElement(Pyramid, { data: DATA, D: DURATIONS });

export const aiOnePercent = defineTemplate({
  id: "ai-one-percent",
  name: "Ты в 1%? Кто пользуется ИИ",
  description: "Layer pyramid reel (_shorts/Pyramid): data in data.ts, voice in scripts/voiceover/ai-one-percent.json.",
  schema: z.object({}),
  defaultProps: {},
  durationInSeconds: makePyramid(DATA, DURATIONS).DURATION,
  formats: ["reel"],
  component: Comp,
});
