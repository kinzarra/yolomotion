import { defineTemplate } from "../types";
import { TOTAL } from "./ages";
import { BrainAges } from "./BrainAges";
import { brainAgesSchema } from "./schema";

export const brainAges = defineTemplate({
  id: "brain-ages",
  name: "Мозг от 0 до 85",
  description:
    "One life, one brain: a detailed 3D brain on the life-lines night sky turns and ages from birth to 85 (grows, folds, thins) through 17 life events, each lighting the changing part with a fact and a cut-out photo; four turning points stamped; silent render.",
  schema: brainAgesSchema,
  defaultProps: { net: true },
  durationInSeconds: TOTAL,
  formats: ["reel"],
  component: BrainAges,
});
