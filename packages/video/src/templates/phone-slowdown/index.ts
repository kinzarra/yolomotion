import { defineTemplate } from "../types";
import { PhoneSlowdown } from "./PhoneSlowdown";
import { phoneSlowdownSchema } from "./schema";
import { DURATION } from "./timeline";

export const phoneSlowdown = defineTemplate({
  id: "phone-slowdown",
  name: "Мы специально замедляем твой телефон",
  description: "Long-format YouTube (16:9), «20 лет в IT» confession: Wirth's law, app bloat, batterygate and the lifetime bill for spare hardware.",
  schema: phoneSlowdownSchema,
  defaultProps: { phonePrice: 25700, lifetimeLoss: 257000 },
  durationInSeconds: DURATION,
  formats: ["landscape"],
  component: PhoneSlowdown,
});
