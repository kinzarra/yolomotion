// A template is a parameterized composition: the zod schema is the contract
// between callers (Studio props panel today, the SaaS API later) and the video.
import React from "react";
import { z } from "zod";
import { FormatId } from "../formats";

export type VideoTemplate<Schema extends z.ZodTypeAny = z.ZodTypeAny> = {
  id: string; // kebab-case; composition ids become `${id}-${format}`
  name: string;
  description: string;
  schema: Schema;
  defaultProps: z.infer<Schema>;
  // A constant, or a function of the input props for templates whose length
  // depends on what the caller sends (server-side renders pass re-measured
  // clip durations / beat lengths as props). The function form is wired into
  // the composition as `calculateMetadata`, so Studio and `selectComposition`
  // both honour it — a render job never has to know how long the video is.
  durationInSeconds: number | ((props: z.infer<Schema>) => number);
  fps?: number; // defaults to DEFAULT_FPS
  formats: FormatId[];
  component: React.FC<z.infer<Schema>>;
};

export const defineTemplate = <S extends z.ZodTypeAny>(
  t: VideoTemplate<S>,
): VideoTemplate<S> => t;
