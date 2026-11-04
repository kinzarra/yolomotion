import { defineTemplate } from "../types";
import { ShawarmaFactory } from "./ShawarmaFactory";
import { shawarmaFactorySchema } from "./schema";
import { DURATION } from "./timeline";

export const shawarmaFactory = defineTemplate({
  id: "shawarma-factory",
  name: "Шаурмичная, которую собрал Claude",
  description: "A night street, one shawarma kiosk, a queue that pays 500 ₽ each; the code Claude wrote for it types underneath.",
  schema: shawarmaFactorySchema,
  defaultProps: {},
  durationInSeconds: DURATION,
  formats: ["reel"],
  component: ShawarmaFactory,
});
