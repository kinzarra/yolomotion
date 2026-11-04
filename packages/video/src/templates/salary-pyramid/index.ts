import React from "react";
import { z } from "zod";
import { defineTemplate } from "../types";
import { Ladder, makeLadder } from "../_shorts/Ladder";
import { DATA } from "./data";
import { DURATIONS } from "./durations";

const schema = z.object({});
const Comp: React.FC = () => React.createElement(Ladder, { data: DATA, D: DURATIONS });

export const salaryPyramid = defineTemplate({
  id: "salary-pyramid",
  name: "Богат ли ты? Пирамида зарплат России",
  description: "Wage ladder reel (_shorts/Ladder): data in data.ts, voice in scripts/voiceover/salary-pyramid.json.",
  schema,
  defaultProps: {},
  durationInSeconds: makeLadder(DATA, DURATIONS).DURATION,
  formats: ["reel"],
  component: Comp,
});
