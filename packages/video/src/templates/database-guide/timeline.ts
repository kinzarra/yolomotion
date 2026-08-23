// The scenario as data. Voiceover only — no music, no SFX — so every cut is
// paced off the spoken lines.
import { defineVoiceover, scenesDuration } from "../../reel";
import { DURATIONS } from "./durations";

export const VO_RATE = 1.1;

export const SCENES = {
  hook: { from: 0, len: 3.5 }, // YOUR APP FORGOT EVERYTHING
  why: { from: 3.5, len: 4.5 }, // why an app needs a database
  table: { from: 8, len: 5.2 }, // the spreadsheet analogy
  choice: { from: 13.2, len: 8 }, // which database a vibecoder picks
  cta: { from: 21.2, len: 4.3 }, // follow for the next guide
  // 3.0, not 2.5: the closing line speaks for 2.70s at VO_RATE, so the
  // shorter scene cut its last word off in the encoded mp4. The remaining
  // 0.3s is the beat of silence before the Short loops.
  loop: { from: 25.5, len: 3 },
} as const;

// Composition length follows the scene grid — never a hardcoded number.
export const DURATION = scenesDuration(SCENES);

export const VOICEOVER = defineVoiceover(DURATIONS, [
  { file: "01-hook", start: 0 },
  { file: "02-why", start: 3.5 },
  { file: "03-table", start: 8 },
  { file: "04-choice", start: 13.2 },
  { file: "05-cta", start: 21.2 },
  { file: "06-loop", start: 25.5 },
]);
