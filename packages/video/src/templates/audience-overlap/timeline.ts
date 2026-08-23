// The scenario as data. Voiceover only — no music, no SFX — so every cut is
// paced off the spoken lines. Rapid cuts through the hook, a deliberate
// slow-down on the invisible-tax reveal, then the pacing accelerates again
// for the Yoloco fix.
//
// Scene starts are derived from the lengths below; clip durations come from
// the generated durations module. Nothing here is transcribed by hand.
import { buildScenes, defineVoiceover, scenesDuration, VoLine } from "../../reel";
import { DURATIONS } from "./durations";

export const VO_RATE = 1.08;

export const SCENES = buildScenes({
  hook: 6, // 5 cards + payments → 5 INFLUENCERS → 1 AUDIENCE
  overlap: 4.5, // follower clouds converge, duplicates flip red
  counter: 5, // TOTAL FOLLOWERS races up → UNIQUE REACH deflates
  invoices: 4.5, // invoice stack + INVISIBLE INFLUENCER TAX stamp
  yoloco: 6, // overlap analysis, swap creators, reach expands
  finale: 4, // STOP BUYING FOLLOWERS → START BUYING UNIQUE REACH → logo
});

export const DURATION = scenesDuration(SCENES);

export type { VoLine };

export const VOICEOVER = defineVoiceover(DURATIONS, [
  {
    file: "01-hook",
    start: 0.25,
    pages: [
      "YOU JUST PAID",
      "FIVE DIFFERENT INFLUENCERS.",
      "CONGRATULATIONS —",
      "YOU MAY HAVE BOUGHT",
      "~THE SAME AUDIENCE", // carried by the 1 AUDIENCE headline
      "~FIVE TIMES.",
    ],
  },
  {
    file: "02-overlap",
    start: 6.15,
    pages: [
      "BECAUSE DIFFERENT CREATORS",
      "CAN SHARE THOUSANDS",
      "OF !IDENTICAL FOLLOWERS.",
    ],
  },
  {
    file: "03-reach",
    start: 10.6,
    pages: [
      "FOLLOWER COUNTS MAKE",
      "YOUR CAMPAIGN",
      "LOOK MASSIVE.",
      "~UNIQUE REACH", // carried by the UNIQUE REACH headline flip
      "TELLS THE REAL STORY.",
    ],
  },
  {
    file: "04-tax",
    start: 15.65,
    pages: [
      "THIS IS THE",
      "~INVISIBLE INFLUENCER TAX —", // carried by the red stamp
      "AND MOST BRANDS",
      "NEVER SEE IT.",
    ],
  },
  {
    file: "05-yoloco",
    start: 19.95,
    pages: [
      "+YOLOCO REVEALS",
      "AUDIENCE OVERLAP",
      "BEFORE YOU SPEND —",
      "SO EVERY CREATOR",
      "ADDS +NEW +REACH,",
      "NOT ANOTHER INVOICE.",
    ],
  },
  {
    file: "06-question",
    start: 26,
    pages: [
      "WOULD YOU RATHER",
      "HIRE FIVE INFLUENCERS,",
      "OR REACH FIVE",
      "DIFFERENT AUDIENCES?",
    ],
  },
]);
