// The timing model. Unusually for this repo, almost nothing is authored here:
// the beats ARE the cuts of a real recording, so both the scene lengths and
// the audio starts come from the generated cuts module.
//
// Retiming happens in scripts/cuts/unicorn-cafe.json (source timestamps) and
// is regenerated — editing numbers here would desync the picture from the
// captions, which are derived from the same file.
import { buildScenes, defineVoiceover, scenesDuration } from "../../reel";
import { BEATS, VO_STARTS } from "./cuts";
import { DURATIONS } from "./durations";

// 1.0, and it is not a tuning knob. The voiceover is the footage's own live
// audio: any other rate would pitch real voices and slide the words out of
// sync with the lips on screen.
export const VO_RATE = 1;

export const SCENES = buildScenes(BEATS);

export const DURATION = scenesDuration(SCENES);

export const VOICEOVER = defineVoiceover(DURATIONS, [
  { file: "01-hello", start: VO_STARTS["01-hello"] },
  { file: "02-source", start: VO_STARTS["02-source"] },
]);
