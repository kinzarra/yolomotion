// The scenario as data. Voiceover only — no music, no SFX — so every cut is
// paced off the spoken lines. Fast cuts up to the trust beat, then the pacing
// deliberately slows: the freeze/pixel-break moment is the contrast the
// scenario asks for.
//
// Scene starts are derived from the lengths below; clip durations come from
// the generated durations module. Nothing here is transcribed by hand.
import { buildScenes, defineVoiceover, scenesDuration, VoLine } from "../../reel";
import { DURATIONS } from "./durations";

export const VO_RATE = 1.06;

export const SCENES = buildScenes({
  hook: 4.5, // push-in → glitch → SHE DOESN'T EXIST
  morph: 5.5, // niche morphs + 24/7 / FULL CONTROL / UNLIMITED
  split: 5.5, // tired human vs multiplying AI
  trust: 5.5, // freeze → pixel breakup → WOULD YOU TRUST HER?
  scale: 4.5, // AI SCALE vs HUMAN AUTHENTICITY
  finale: 4.5, // eyes close-up → YES / NO → loop glitch
});

export const DURATION = scenesDuration(SCENES);

export type { VoLine };

export const VOICEOVER = defineVoiceover(DURATIONS, [
  {
    file: "01-hook",
    start: 0.2,
    pages: [
      "THIS INFLUENCER",
      "PROMOTES REAL PRODUCTS.",
      "BUT THERE'S ONE PROBLEM...",
      "~SHE DOESN'T EXIST.", // carried by the SHE DOESN'T EXIST headline
    ],
  },
  {
    file: "02-ai",
    start: 4.7,
    pages: [
      "SHE'S AN AI INFLUENCER.",
      "PERFECT APPEARANCE.",
      "UNLIMITED CONTENT.",
      "NO DAYS OFF.",
      "AND NO SCANDALS.",
    ],
  },
  {
    file: "03-brands",
    start: 10.2,
    pages: [
      "FOR BRANDS,",
      "SHE SOUNDS PERFECT.",
      "SHE'S NEVER LATE,",
      "NEVER TIRED,",
      "AND SHE CAN CREATE",
      "HUNDREDS OF VIDEOS.",
    ],
  },
  {
    file: "04-trust",
    start: 15.8,
    pages: [
      "BUT THERE'S ONE THING",
      "AI STILL STRUGGLES",
      "TO GENERATE",
      "CONVINCINGLY...",
      "~TRUST.", // carried by the WOULD YOU TRUST HER? headline
    ],
  },
  {
    file: "05-believe",
    start: 21.15,
    pages: [
      "THE WINNER",
      "WON'T BE HUMAN,",
      "OR AI.",
      "IT WILL BE WHOEVER",
      "THE AUDIENCE BELIEVES.",
    ],
  },
  {
    file: "06-question",
    start: 25.75,
    pages: [
      "WOULD YOU BUY SOMETHING",
      "RECOMMENDED BY A PERSON",
      "WHO NEVER EXISTED?",
    ],
  },
]);
