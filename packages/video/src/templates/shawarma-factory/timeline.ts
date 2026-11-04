// One running street for the whole reel. Reel time t (what the viewer
// watches) maps to sim time T: 1:1 until the second cook is hired, then the
// game fast-forwards ×4 so the investment pays back on screen, then slows to
// 1:1 for the CTA.
import { buildScenes, defineVoiceover, scenesDuration } from "../../reel";
import { DURATIONS } from "./durations";
import { HIRE, START } from "./sim";

export const VO_RATE = 1.06;

export const SCENES = buildScenes({
  main: 30, // street + HUD + code
});

export const DURATION = scenesDuration(SCENES);

/** Story beats, reel seconds. */
export const BEAT = {
  face: 2.1, // HeyGen face on «Сейчас покажу мультик на 30 секунд» (clip 0–2.2 s / VO_RATE), then the street
  titleOut: 4.0, // hook title leaves after the voice line
  rush: 7.5, // «ЧАС ПИК», crowd from the metro
  card: 14.2, // upgrade card slides in
  hire: HIRE - START, // tap: −15 000 ₽, the helper jumps in
  ffFrom: 17.6, // fast-forward ramps up
  ffTo: 24.8, // and back down
  done: 25.0, // editor finished
  cta: 26.0, // CTA voice + subscribe row
} as const;

const FF = 4;
/** Playback rate of the sim at reel time t: 1, ramp to ×4, hold, ramp back. */
const rate = (t: number) => {
  if (t < BEAT.ffFrom) return 1;
  if (t < BEAT.ffFrom + 1) return 1 + (FF - 1) * (t - BEAT.ffFrom);
  if (t < BEAT.ffTo) return FF;
  if (t < BEAT.ffTo + 1) return FF - (FF - 1) * (t - BEAT.ffTo);
  return 1;
};
/** Sim time at reel time t (integral of rate). */
export const simTime = (t: number) => {
  const step = 1 / 120;
  let T = START;
  for (let u = 0; u < t; u += step) T += rate(u + step / 2) * Math.min(step, t - u);
  return T;
};
export const ffAmount = (t: number) => (rate(t) - 1) / (FF - 1);

/** The editor starts mid-file so frame 0 already shows code, and finishes at BEAT.done. */
export const TYPE = { from: 620, end: BEAT.done };

export const VOICEOVER = defineVoiceover(DURATIONS, [
  { file: "01-hook", start: 0 },
  { file: "02-cta", start: BEAT.cta },
]);
