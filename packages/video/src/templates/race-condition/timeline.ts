// The scenario as data. Voiceover only — no music, no SFX — so every cut is
// paced off the spoken lines. The brief asks for a visual change every
// 0.7–1.3s, so beats are short and each one carries several staged hits.
//
// Scene starts are derived from the lengths below; clip durations come from
// the generated durations module. Nothing here is transcribed by hand.
import { buildScenes, defineVoiceover, scenesDuration, VoLine } from "../../reel";
import { DURATIONS } from "./durations";

export const VO_RATE = 1.07;

export const SCENES = buildScenes({
  hook: 4.5, // 1 TICKET LEFT → two BUY buttons slam on the same frame
  read: 4, // split screen, both requests read tickets = 1
  sold: 4.5, // both write 0 → SOLD TWICE slams in
  race: 5, // RACE CONDITION fills the frame, two lines race for the row
  lock: 7, // rewind → TRANSACTION/LOCK → A buys → B gets SOLD OUT
  law: 5, // IF IT CAN HAPPEN AT THE SAME TIME — IT WILL.
});

export const DURATION = scenesDuration(SCENES);

export type { VoLine };

export const VOICEOVER = defineVoiceover(DURATIONS, [
  {
    file: "01-hook",
    start: 0.25,
    pages: [
      "~THERE'S ONE TICKET LEFT.", // carried by the 1 TICKET LEFT headline
      "TWO USERS CLICK BUY",
      "AT THE EXACT SAME TIME.",
    ],
  },
  {
    file: "02-read",
    start: 4.7,
    pages: ["BOTH CHECK THE DATABASE.", "BOTH SEE:", "ONE TICKET AVAILABLE."],
  },
  {
    file: "03-sold",
    start: 8.7,
    pages: [
      "BOTH BUY IT.",
      "CONGRATULATIONS —",
      "YOU JUST SOLD",
      "~THE SAME TICKET TWICE.", // carried by the SOLD TWICE slam
    ],
  },
  {
    file: "04-race",
    start: 13.2,
    pages: [
      "THIS IS CALLED A",
      "~RACE CONDITION.", // carried by the full-frame headline
      "YOUR CODE WORKED PERFECTLY...",
      "JUST IN THE !WRONG !ORDER.",
    ],
  },
  {
    file: "05-lock",
    start: 18.25,
    pages: [
      "DATABASES SOLVE THIS WITH",
      "+TRANSACTIONS AND +LOCKING:",
      "ONE OPERATION FINISHES",
      "BEFORE THE OTHER CAN",
      "CHANGE THE SAME DATA.",
    ],
  },
  {
    file: "06-law",
    start: 25.3,
    pages: [
      "IF TWO THINGS CAN HAPPEN",
      "~AT THE SAME TIME,", // the law card owns the finale from here
      "~ASSUME SOMEDAY THEY WILL.",
    ],
  },
]);
