import { ClipDurations, buildScenes, defineVoiceover, scenesDuration } from "../../reel";
import { DURATIONS } from "./durations";

// One source of truth for the 30s timeline. The video carries the voiceover and
// nothing else — no music bed, no SFX — so the cuts are paced off the spoken
// lines. Scene starts sit on a 0.5s grid, which keeps the rhythm even.
export const VO_RATE = 1.07;

// The authored beat grid — the render-time default. This template is the
// reference for server-side parameterization: a job may override any beat (and
// the measured clip lengths) through input props, so both live behind
// makeTimeline() instead of being baked into module-level constants.
const BEATS = {
  hook: 3.5,
  creator: 5.5,
  vanity: 3,
  pillars: 5.5,
  versus: 4.5,
  dashboard: 4,
  logo: 4,
} as const;

export type BeatId = keyof typeof BEATS;

// Which clip speaks over which scene, and how far it trails the cut. Leads are
// scene-relative so an overridden beat carries its line with it — an absolute
// start would keep speaking over the previous scene's extension.
const LINES: { file: string; scene: BeatId; lead: number }[] = [
  { file: "01-hook", scene: "hook", lead: 0.2 },
  { file: "02-creator", scene: "creator", lead: 0.3 },
  { file: "03-vanity", scene: "vanity", lead: 0.25 },
  { file: "04-matters", scene: "pillars", lead: 0.25 },
  { file: "05-versus", scene: "versus", lead: 0.2 },
  { file: "06-cta", scene: "dashboard", lead: 0.3 },
  { file: "07-brand", scene: "logo", lead: 0.35 },
];

export type TimelineOverrides = {
  durations?: ClipDurations; // re-measured clips, seconds at 1.0×
  beats?: Partial<Record<string, number>>; // scene lengths, seconds
};

// The whole timeline as a pure function of the overrides. Called with none it
// reproduces the checked-in reel exactly; called from calculateMetadata / the
// component with a render job's props it re-derives scene starts, voiceover
// starts and the composition duration from what the job sent.
export const makeTimeline = ({ durations, beats }: TimelineOverrides = {}) => {
  const lengths = { ...BEATS } as Record<BeatId, number>;
  for (const key of Object.keys(lengths) as BeatId[]) {
    const override = beats?.[key];
    if (typeof override === "number") lengths[key] = override;
  }
  const SCENES = buildScenes(lengths);
  const VOICEOVER = defineVoiceover({ ...DURATIONS, ...durations }, LINES.map(
    ({ file, scene, lead }) => ({ file, start: SCENES[scene].from + lead }),
  ));
  return { SCENES, VOICEOVER, DURATION: scenesDuration(SCENES) };
};

// The default timeline, for everything that renders without overrides.
export const { SCENES, VOICEOVER, DURATION } = makeTimeline();
