import { z } from "zod";
import { zLook } from "../../looks";

// The lab is silent and costs nothing to render: captions run on synthetic
// timings, media are props (a public/ path or an http(s) URL from S3), so a
// server job can preview any look on the client's own footage.
export const lookLabSchema = z.object({
  look: zLook,
  eyebrow: z.string(),
  headline: z.string(), // lines split by \n, *accent* word
  number: z.number(),
  numberSuffix: z.string(),
  numberLabel: z.string(),
  photo: z.string(),
  photoTag: z.string(),
  photoCaption: z.string(),
  clip: z.string(),
  clipHeadline: z.string(),
  cta: z.string(),
  handle: z.string(),
});

export type LookLabProps = z.infer<typeof lookLabSchema>;
