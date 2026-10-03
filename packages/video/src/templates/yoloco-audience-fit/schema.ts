import { z } from "zod";

export const yolocoAudienceFitSchema = z.object({
  handle: z.string().min(1), // the "looks huge" creator
  niche: z.string().min(1),
  tagline: z.string().min(1),
  cta: z.string().min(1),

  // Server-render overrides. Absent (Studio, CLI without --props) the template
  // uses the checked-in defaults: the generated durations.ts and the authored
  // beat grid. A render job that re-voices the lines sends the re-measured
  // clip lengths here — the timeline, the fits-check and the composition
  // duration all follow, and no file in the repo has to change.
  durations: z.record(z.string(), z.number()).optional(), // clip → seconds at 1.0×
  beats: z.record(z.string(), z.number()).optional(), // scene → seconds
  voiceoverDir: z.string().optional(), // public/ subdir, or absolute http(s) URL
});

export type YolocoAudienceFitProps = z.infer<typeof yolocoAudienceFitSchema>;
