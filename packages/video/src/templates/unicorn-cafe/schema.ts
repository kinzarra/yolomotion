import { z } from "zod";

// The public contract of this reel: what a caller may change without editing
// the template. The timing cannot be changed here — it belongs to the
// recording (scripts/cuts/unicorn-cafe.json), so only the type is exposed.
export const unicornCafeSchema = z.object({
  claim: z.array(z.string()).describe("Hook headline over the selfie, one entry per line"),
  slamWord: z
    .string()
    .describe("The word stamped in magenta when it is spoken at src 5.82s"),
  payoff: z
    .array(z.string())
    .describe("Closing headline, one entry per line — the last line takes the accent"),
  cta: z.array(z.string()).describe("Closing question, one entry per line"),
  brand: z.string().describe("Wordmark on the closing card"),
  brandNote: z.string().describe("Small line under the wordmark"),
});

export type UnicornCafeProps = z.infer<typeof unicornCafeSchema>;
