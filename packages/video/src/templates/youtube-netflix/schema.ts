import { z } from "zod";

// The public contract of this reel: what a caller may change without editing
// the template. Brand text belongs here, motion does not.
export const youtubeNetflixSchema = z.object({
  ctaLabel: z.string().describe("Closing call-to-action, two lines"),
  url: z.string().describe("Brand url on the closing card"),
});

export type YoutubeNetflixProps = z.infer<typeof youtubeNetflixSchema>;
