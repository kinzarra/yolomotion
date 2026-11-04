import { defineTemplate } from "../types";
import { VibecodingLayers } from "./VibecodingLayers";
import { vibecodingLayersSchema } from "./schema";
import { DURATION } from "./timeline";

export const vibecodingLayers = defineTemplate({
  id: "vibecoding-layers",
  name: "Хороним программирование",
  description: "Seventy years of programming in five layers, from punch-card holes to one spoken sentence: what you had to know shrinks from numbers to the product idea.",
  schema: vibecodingLayersSchema,
  defaultProps: {},
  durationInSeconds: DURATION,
  formats: ["reel"],
  component: VibecodingLayers,
});
