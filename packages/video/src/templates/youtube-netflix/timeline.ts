// The scenario as data. Voiceover only — no music, no SFX — so every cut is
// paced off the spoken lines.
//
// Beat lengths are each clip's measured read plus the hold that beat needs
// after the voice stops: the camera pushing through EXCLUSIVE after the face
// has gone, THE CREATOR WAR sitting as a masthead, WHY WATCH HERE? in
// near-silence, FOR CREATORS holding under the flashes, the brand card at the
// end. The read is 50.3s at rate; the holds take the piece to 57.8s, which is
// the brief's 52–58s window with 2.2s of margin to the hard 60s ceiling.
//
// Scene starts are derived from the lengths below; clip durations come from
// the generated durations module. Nothing here is transcribed by hand.
import { buildScenes, defineVoiceover, scenesDuration, VoLine } from "../../reel";
import { DURATIONS } from "./durations";

// Playback rate of the voiceover clips. 1.05–1.10 tightens the read without
// pitching the voice audibly. The presenter footage plays at the same rate.
export const VO_RATE = 1.08;

export const SCENES = buildScenes({
  hook: 4.5, // studio face → pull back to a plate → $MILLIONS → STAY exclusive.
  offer: 5.5, // YouTube plate → three creator cards → $1M+/$2M+/$5M+ → Netflix cuts in
  netflix: 4.5, // red hairline → N → pull back to YOUTUBE ⚡ NETFLIX → THE CREATOR WAR
  television: 6.4, // PHONE → LAPTOP → TV, the TV opens → CREATORS ARE TELEVISION.
  problem: 6.5, // one show card splits in two → EXCLUSIVE VALUE 100% → ??? → WHY WATCH HERE?
  money: 7.0, // OLD MODEL struck → NEW BATTLE + BRAND DEALS → the transfer tug
  crazy: 2.4, // face insert #2, pushed in and framed left → THE NEW HOLLYWOOD?
  shift: 5.5, // CREATORS vs HOLLYWOOD rotates into YOUTUBE vs NETFLIX → FOR CREATORS.
  followers: 6.5, // 10,000,000 FOLLOWERS → SO WHAT? → six dimensions → ATTENTION IS AN ASSET.
  economy: 5.4, // the ecosystem wires up, then simplifies to one creator × one brand
  yoloco: 3.6, // mark, FIND THE CREATORS WORTH BETTING ON., yoloco.io, ~0.9s hold
});

export const DURATION = scenesDuration(SCENES);

export type { VoLine };

// "~PAGE" hides a page (a headline is already saying those words), "+WORD"
// paints it the accent once spoken.
//
// Most pages are hidden. The brief asks for spoken language to become part of
// the motion design rather than a subtitle strip, so wherever a scene headline
// carries the words — $MILLIONS, STAY EXCLUSIVE, THE CREATOR WAR, CREATORS ARE
// TELEVISION, WHY WATCH HERE?, THE NEW HOLLYWOOD?, FOR CREATORS, SO WHAT?, the
// Yoloco line — the caption stays out and the frame never says the same
// sentence twice. Hidden pages still consume their share of the clip, so the
// visible ones stay in sync.
//
// Exactly two words wear the red across the whole reel: the compound in 02 and
// +PURSUING in 04. Each lands in a frame where nothing else is red.
export const VOICEOVER = defineVoiceover(DURATIONS, [
  {
    // start 0 exactly: the avatar is lip-synced to this clip from reel frame 0,
    // so any offset here desyncs the mouth.
    file: "01-hook",
    start: SCENES.hook.from,
    pages: [
      "~YOUTUBE IS OFFERING",
      "~CREATORS MILLIONS...",
      "~FOR ONE THING:",
      "~STAY EXCLUSIVE.",
    ],
  },
  {
    file: "02-offer",
    start: SCENES.offer.from + 0.2,
    pages: [
      "ACCORDING TO REPORTS,",
      "YOUTUBE IS DISCUSSING",
      // "+" marks a whole space-delimited token, so it goes at the front of
      // the compound, not in front of the syllable.
      "+MULTI-MILLION-DOLLAR DEALS",
      "WITH ITS BIGGEST CREATORS.",
    ],
  },
  {
    file: "03-netflix",
    start: SCENES.netflix.from + 0.2,
    pages: [
      "WHY?",
      "BECAUSE NETFLIX IS COMING",
      "FOR YOUTUBE'S BIGGEST STARS.",
    ],
  },
  {
    file: "04-television",
    start: SCENES.television.from + 0.2,
    pages: [
      "NETFLIX HAS BEEN +PURSUING",
      "SUCCESSFUL YOUTUBERS.",
      "CREATOR CONTENT ISN'T JUST",
      "~INTERNET CONTENT ANYMORE.", // CREATORS ARE TELEVISION. lands here
    ],
  },
  {
    file: "05-problem",
    start: SCENES.problem.from + 0.2,
    pages: [
      "AND THAT'S A PROBLEM.",
      "IF THE SAME SUPERSTAR CONTENT",
      "LIVES ON NETFLIX —",
      "~WHAT MAKES YOUTUBE EXCLUSIVE?", // the near-silent slam
    ],
  },
  {
    file: "06-money",
    start: SCENES.money.from + 0.2,
    pages: [
      "SO YOUTUBE IS CONSIDERING",
      "SOMETHING DIFFERENT:",
      "FINANCING CREATOR SHOWS DIRECTLY,",
      "AND OPENING UP",
      "MAJOR BRAND DEALS.",
    ],
  },
  {
    file: "07-crazy",
    // Frame 0 of the beat, like the hook: the cut lands on a face already
    // mid-sentence, which is what makes it read as an interruption.
    start: SCENES.crazy.from,
    pages: ["~AND THIS IS WHERE IT GETS CRAZY."],
  },
  {
    file: "08-shift",
    start: SCENES.shift.from + 0.2,
    pages: [
      "CREATORS AREN'T COMPETING",
      "WITH HOLLYWOOD ANYMORE.",
      "~PLATFORMS ARE COMPETING", // FOR CREATORS. takes the page
      "~FOR CREATORS.",
    ],
  },
  {
    file: "09-followers",
    start: SCENES.followers.from + 0.2,
    pages: [
      "IF PLATFORMS WILL SPEND MILLIONS",
      // Not "+ATTENTION": SO WHAT? is already wearing the red in this frame,
      // and khaby's rule is that a caption keyword and a headline never spend
      // the accent at the same moment.
      "FIGHTING OVER CREATOR ATTENTION —",
      "BRANDS SHOULD STOP CHOOSING",
      "CREATORS BY FOLLOWER COUNT.",
    ],
  },
  {
    file: "10-economy",
    start: SCENES.economy.from + 0.2,
    pages: [
      "THE CREATOR ECONOMY",
      "JUST BECAME THE MEDIA ECONOMY.",
      "CHOOSING THE RIGHT CREATOR",
      "MATTERS MORE THAN EVER.",
    ],
  },
  {
    file: "11-yoloco",
    start: SCENES.yoloco.from + 0.2,
    pages: ["~YOLOCO.", "~FIND THE CREATORS WORTH BETTING ON."],
  },
]);
