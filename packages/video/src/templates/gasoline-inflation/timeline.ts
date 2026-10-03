import { buildScenes, defineVoiceover, scenesDuration } from "../../reel";
import { DURATIONS } from "./durations";

// The house clone must play at its native rate. `@remotion/media` resamples
// playbackRate and a 1.1× voice comes out roughly 1.65 semitones higher.
export const VO_RATE = 1.0;

export const SCENES = buildScenes({
  hook: 4.2,
  shortage: 5.95,
  proof: 6.65,
  firstHit: 5.55,
  field: 5.75,
  chain: 6.6,
  costs: 7.1,
  hidden: 5.4,
  definition: 7.45,
  outro: 5.25,
});

export const DURATION = scenesDuration(SCENES);

export const VOICEOVER = defineVoiceover(DURATIONS, [
  { file: "01-hook", start: SCENES.hook.from },
  { file: "02-shortage", start: SCENES.shortage.from + 0.12 },
  { file: "03-proof", start: SCENES.proof.from + 0.12 },
  { file: "04-first-hit", start: SCENES.firstHit.from + 0.12 },
  { file: "05-field", start: SCENES.field.from + 0.12 },
  { file: "06-chain", start: SCENES.chain.from + 0.12 },
  { file: "07-costs", start: SCENES.costs.from + 0.12 },
  { file: "08-hidden", start: SCENES.hidden.from + 0.12 },
  { file: "09-definition", start: SCENES.definition.from + 0.12 },
  { file: "10-outro", start: SCENES.outro.from + 0.12 },
]);
