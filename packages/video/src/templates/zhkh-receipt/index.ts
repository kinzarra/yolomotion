import { defineTemplate } from "../types";
import { ZhkhReceipt } from "./ZhkhReceipt";
import { zhkhReceiptSchema } from "./schema";
import { DURATION } from "./timeline";

export const zhkhReceipt = defineTemplate({
  id: "zhkh-receipt",
  name: "Твоя квитанция: +13 881 ₽ в год",
  description: "A utility bill after the 1 October 2026 rise: the total jumps, the face reacts, one line per beat with its tariff, % and the yearly cost, then the year's sum as working days and fuel.",
  schema: zhkhReceiptSchema,
  defaultProps: {},
  durationInSeconds: DURATION,
  formats: ["reel"],
  component: ZhkhReceipt,
});
