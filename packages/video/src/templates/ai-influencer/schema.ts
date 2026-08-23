import { z } from "zod";

export const aiInfluencerSchema = z.object({
  handle: z.string().describe("The AI influencer's handle shown in the hook"),
  followers: z.string().describe("Follower-count chip text, e.g. 2.4M FOLLOWERS"),
  ctaLabel: z.string().describe("Final call-to-action chip text"),
});

export type AiInfluencerProps = z.infer<typeof aiInfluencerSchema>;
