// The scenario as data. Voiceover only — no music, no SFX — so every cut is
// paced off the spoken lines. The brief asks for a visual change every
// 0.7–1.2s, so beats are short and each one carries several staged hits.
//
// Scene starts are derived from the lengths below; clip durations come from
// the generated durations module. Nothing here is transcribed by hand.
import { buildScenes, defineVoiceover, scenesDuration, VoLine } from "../../reel";
import { DURATIONS } from "./durations";

export const VO_RATE = 1.08;

export const SCENES = buildScenes({
  hook: 4.5, // "CLAUDE ISN'T ANTHROPIC'S STRONGEST MODEL?" + redaction wipe
  internal: 2.5, // blurred model card, INTERNAL stamp punches down
  ladder: 5.5, // the shipping lineup stacked, one slot above it out of focus
  testing: 5, // MYTHOS / FABLE / INTERNAL TESTING barrage → internal eval log
  pipeline: 5, // TRAINED → TESTED → SAFETY EVALS → RELEASED
  gap: 4.5, // YOU USE TODAY'S MODEL / THEY'RE ALREADY TESTING TOMORROW'S
  law: 3.5, // THE BEST AI MODEL MAY BE ONE YOU CAN'T USE YET.
});

export const DURATION = scenesDuration(SCENES);

export type { VoLine };

// Caption markup for this reel maps onto the palette's editorial rule:
//   "+WORD" → orange, and orange only ever marks the unreleased/attributed
//             (MYTHOS, INTERNALLY, POWERFUL-model-you-cannot-use)
//   "~PAGE" → hidden, because a scene headline is already carrying those words
// Blue is left to the active-word highlight, so the two colors never compete.
export const VOICEOVER = defineVoiceover(DURATIONS, [
  {
    file: "01-hook",
    start: 0.25,
    pages: [
      "~ANTHROPIC MAY ALREADY HAVE", // the headline owns the first 2.5s
      "~A MODEL MORE POWERFUL",
      "THAN THE CLAUDE",
      "YOU'RE USING TODAY.",
    ],
  },
  {
    file: "02-internal",
    start: 4.7,
    pages: ["AND THIS ISN'T JUST", "RANDOM TWITTER HYPE."],
  },
  {
    file: "03-ladder",
    start: 7.2,
    pages: [
      "THE CLAUDE LINEUP",
      "ALREADY GOES PAST",
      "OPUS, SONNET AND HAIKU.",
      "FABLE IS REAL,",
      "AND IT'S SHIPPING.",
    ],
  },
  {
    file: "04-testing",
    start: 12.7,
    pages: [
      "REPORTS NAME OTHERS,",
      "LIKE +MYTHOS —",
      "AND SAY NEWER VERSIONS",
      "ARE BEING TESTED +INTERNALLY.",
    ],
  },
  {
    file: "05-pipeline",
    start: 17.7,
    pages: [
      "THE CRAZY PART?",
      "LABS TRAIN THE",
      "NEXT GENERATION",
      "LONG BEFORE YOU",
      "EVER GET ACCESS TO IT.",
    ],
  },
  {
    file: "06-gap",
    start: 22.7,
    // The split frame IS this line — captions would only repeat it smaller.
    pages: [
      "~SO WHILE YOU'RE USING TODAY'S BEST MODEL...",
      "~TOMORROW'S MODEL MAY ALREADY EXIST.",
    ],
  },
  {
    file: "07-law",
    start: 27.2,
    pages: ["~IT'S JUST NOT PUBLIC YET."], // the law card owns the finale
  },
]);
