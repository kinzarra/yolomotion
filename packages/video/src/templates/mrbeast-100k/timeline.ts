// The scenario as data. Voiceover only — no music, no SFX — so every cut is
// paced off the spoken lines.
//
// Beat lengths land on the scenario's own timecodes (0 / 3.5 / 8.5 / 14 / 20 /
// 28 / 35 / 42.5) because each length is the clip's measured read plus the
// hold the beat needs after the voice stops: the impact on 100,000, the three
// questions stacking under the thumbnail, the four words landing in black.
//
// Scene starts are derived from the lengths below; clip durations come from
// the generated durations module. Nothing here is transcribed by hand.
import { buildScenes, defineVoiceover, scenesDuration, VoLine } from "../../reel";
import { DURATIONS } from "./durations";

// Playback rate of the voiceover clips. 1.05–1.10 tightens the read without
// pitching the voice audibly.
export const VO_RATE = 1.06;

export const SCENES = buildScenes({
  hook: 3.5, // 40 HOURS → hard cut → COUNTING., counter spinning at 98,4xx
  count: 5, // 1 → 100 → 1,000 → 10,000 → 100,000, push-in, impact + shake
  stamp: 5.5, // freeze-frame → STUPID IDEA? → GENIUS FORMAT.
  thumbnail: 6, // mock YouTube card, cursor hover, three questions
  formula: 8.5, // SIMPLE IDEA + EXTREME EXECUTION = IRRESISTIBLE STORY
  timeline: 7, // 2017 → CHALLENGES → MILLIONS OF VIEWS → MRBEAST
  lesson: 7.5, // black screen, four words one at a time
  yoloco: 7.5, // cursor → CLICK → graph → brand lockup
});

export const DURATION = scenesDuration(SCENES);

export type { VoLine };

// "~PAGE" hides a page (a headline carries those words), "+WORD" paints it
// the hero color once spoken, "!WORD" the signal color.
export const VOICEOVER = defineVoiceover(DURATIONS, [
  {
    file: "01-hook",
    start: 0.25,
    pages: [
      "MRBEAST ONCE SPENT",
      "~FORTY HOURS...", // the 40 HOURS. headline lands these
      "~JUST COUNTING.", // the COUNTING. headline lands these
    ],
  },
  {
    file: "02-count",
    start: 3.7,
    pages: [
      "HE SAT IN FRONT",
      "OF A CAMERA,",
      "AND COUNTED",
      "ALL THE WAY TO",
      "~ONE HUNDRED THOUSAND.", // the counter lands on 100,000 instead
    ],
  },
  {
    file: "03-stamp",
    start: 8.75,
    pages: [
      "IT SOUNDS LIKE",
      "THE DUMBEST",
      "~YOUTUBE IDEA IMAGINABLE.", // the STUPID IDEA? stamp
      "BUT THERE WAS SOMETHING",
      "~GENIUS ABOUT IT.", // the GENIUS FORMAT. stamp
    ],
  },
  {
    file: "04-thumbnail",
    start: 14.25,
    pages: [
      "BECAUSE YOU UNDERSTAND",
      "THE ENTIRE VIDEO —",
      "BEFORE YOU EVEN",
      "CLICK IT.",
    ],
  },
  {
    file: "05-formula",
    start: 20.3,
    pages: [
      "AND THAT'S THE TRICK",
      "MRBEAST WOULD",
      "EVENTUALLY MASTER.",
      "TAKE SOMETHING",
      "~RIDICULOUSLY SIMPLE,", // the SIMPLE IDEA row of the formula
      "AND PUSH IT TO",
      "~AN EXTREME.", // the EXTREME EXECUTION row
    ],
  },
  {
    file: "06-timeline",
    start: 28.75,
    pages: [
      "COUNTING BECAME",
      "BIGGER CHALLENGES.",
      "BIGGER CHALLENGES",
      "BECAME BIGGER VIDEOS.",
      "AND BIGGER VIDEOS",
      "~BUILT MRBEAST.", // the MRBEAST wordmark lands
    ],
  },
  {
    file: "07-lesson",
    start: 35.8,
    pages: [
      "THE LESSON ISN'T:",
      "~DO SOMETHING STUPID.", // struck through on screen
      "IT'S THIS.",
      "~MAKE THE IDEA", // the four words in black land these
      "~IMPOSSIBLE TO IGNORE.",
    ],
  },
  {
    file: "08-yoloco",
    start: 43.25,
    pages: [
      "BECAUSE BEFORE",
      "THE ALGORITHM",
      "CAN MAKE YOU VIRAL...",
      "A HUMAN STILL",
      "HAS TO CLICK.",
    ],
  },
]);
