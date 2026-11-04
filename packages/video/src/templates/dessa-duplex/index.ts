import { defineTemplate } from "../types";
import { DessaDuplex } from "./DessaDuplex";
import { dessaDuplexSchema } from "./schema";
import { DURATION } from "./timeline";

export const dessaDuplex = defineTemplate({
  id: "dessa-duplex",
  name: "Перебивает как тёща. Только по делу",
  description: "ВЫПУСК 23: Block's Dessa, a voice AI trained on live speech only. The тёща cuts you off, dissolves into the author's face; 0 letters of text, no 2-second pause, hears sarcasm, one rack to train, one MacBook to run.",
  schema: dessaDuplexSchema,
  defaultProps: {},
  durationInSeconds: DURATION,
  formats: ["reel"],
  component: DessaDuplex,
});
