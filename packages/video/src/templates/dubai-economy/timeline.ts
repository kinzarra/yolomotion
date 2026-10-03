// The scenario as data. Voiceover only — no music, no SFX — so every cut is
// paced off the spoken lines.
//
// Scene starts are derived from the lengths below; clip durations come from
// the generated durations module. Nothing here is transcribed by hand.
import { buildScenes, defineVoiceover, scenesDuration, VoLine } from "../../reel";
import { DURATIONS } from "./durations";

// Playback rate of the voiceover clips. 1.05–1.10 tightens the read without
// pitching the voice audibly.
export const VO_RATE = 1.06;

export const SCENES = buildScenes({
  hook: 2.5, // TODO: what the viewer sees in this beat
  turn: 2.5, // TODO: what the viewer sees in this beat
  oil: 2.5, // TODO: what the viewer sees in this beat
  port: 2.5, // TODO: what the viewer sees in this beat
  map: 2.5, // TODO: what the viewer sees in this beat
  airport: 2.5, // TODO: what the viewer sees in this beat
  tax: 2.5, // TODO: what the viewer sees in this beat
  model: 2.5, // TODO: what the viewer sees in this beat
  crisis: 2.5, // TODO: what the viewer sees in this beat
  rescue: 2.5, // TODO: what the viewer sees in this beat
  answer: 2.5, // TODO: what the viewer sees in this beat
  cta: 2.5, // TODO: what the viewer sees in this beat
});

export const DURATION = scenesDuration(SCENES);

export type { VoLine };

// "~PAGE" hides a page (a headline carries those words), "+WORD" paints it
// the hero color once spoken, "!WORD" the signal color.
export const VOICEOVER = defineVoiceover(DURATIONS, [
  {
    file: "01-hook",
    start: 0.00,
    pages: ["TODO CAPTION", "PAGES FOR THIS LINE"],
  },
  {
    file: "02-turn",
    start: 2.50,
    pages: ["TODO CAPTION", "PAGES FOR THIS LINE"],
  },
  {
    file: "03-oil",
    start: 5.00,
    pages: ["TODO CAPTION", "PAGES FOR THIS LINE"],
  },
  {
    file: "04-port",
    start: 7.50,
    pages: ["TODO CAPTION", "PAGES FOR THIS LINE"],
  },
  {
    file: "05-map",
    start: 10.00,
    pages: ["TODO CAPTION", "PAGES FOR THIS LINE"],
  },
  {
    file: "06-airport",
    start: 12.50,
    pages: ["TODO CAPTION", "PAGES FOR THIS LINE"],
  },
  {
    file: "07-tax",
    start: 15.00,
    pages: ["TODO CAPTION", "PAGES FOR THIS LINE"],
  },
  {
    file: "08-model",
    start: 17.50,
    pages: ["TODO CAPTION", "PAGES FOR THIS LINE"],
  },
  {
    file: "09-crisis",
    start: 20.00,
    pages: ["TODO CAPTION", "PAGES FOR THIS LINE"],
  },
  {
    file: "10-rescue",
    start: 22.50,
    pages: ["TODO CAPTION", "PAGES FOR THIS LINE"],
  },
  {
    file: "11-answer",
    start: 25.00,
    pages: ["TODO CAPTION", "PAGES FOR THIS LINE"],
  },
  {
    file: "12-cta",
    start: 27.50,
    pages: ["TODO CAPTION", "PAGES FOR THIS LINE"],
  },
]);
