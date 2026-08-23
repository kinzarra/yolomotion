import { defineTemplate } from "../types";
import { YoutubeNetflix } from "./YoutubeNetflix";
import { youtubeNetflixSchema } from "./schema";
import { DURATION } from "./timeline";

export const youtubeNetflix = defineTemplate({
  id: "youtube-netflix",
  name: "The Creator War",
  description:
    "YouTube is reportedly discussing multi-million-dollar exclusivity deals while Netflix chases its biggest creators — told as a transfer-market story that ends on how brands should pick creators.",
  schema: youtubeNetflixSchema,
  defaultProps: {
    ctaLabel: "FIND THE CREATORS WORTH BETTING ON.",
    url: "yoloco.io",
  },
  durationInSeconds: DURATION,
  formats: ["reel"],
  component: YoutubeNetflix,
});
