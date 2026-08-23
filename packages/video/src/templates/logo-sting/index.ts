import { defineTemplate } from "../types";
import { logoStingSchema } from "./schema";
import { LogoSting } from "./LogoSting";

export const logoSting = defineTemplate({
  id: "logo-sting",
  name: "Logo Sting",
  description: "3.5s brand intro: radial spark mark, word-by-word name, tagline.",
  schema: logoStingSchema,
  defaultProps: {
    brandName: "Yolomotion",
    tagline: "Video as code",
  },
  durationInSeconds: 3.5,
  formats: ["landscape", "reel", "square"],
  component: LogoSting,
});
