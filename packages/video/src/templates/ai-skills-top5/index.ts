import React from "react";
import { z } from "zod";
import { defineTemplate } from "../types";
import { SkillCheck, makeSkillCheck } from "../_shorts/SkillCheck";
import { DATA } from "./data";
import { DURATIONS } from "./durations";

const schema = z.object({});
const Comp: React.FC = () => React.createElement(SkillCheck, { data: DATA, D: DURATIONS });

export const aiSkillsTop5 = defineTemplate({
  id: "ai-skills-top5",
  name: "5 навыков для работы с ИИ",
  description: "Self-check reel (_shorts/SkillCheck): data in data.ts, voice in scripts/voiceover/ai-skills-top5.json.",
  schema,
  defaultProps: {},
  durationInSeconds: makeSkillCheck(DATA, DURATIONS).DURATION,
  formats: ["reel"],
  component: Comp,
});
