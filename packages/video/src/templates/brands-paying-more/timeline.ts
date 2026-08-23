// The scenario as data. Voiceover only — no music, no SFX — so every cut is
// paced off the spoken lines.
//
// Beat lengths are each clip's measured read plus the hold that beat needs
// after the voice stops: the money column freezing before the catch, TRUST
// sitting cracked in silence, the comment field going quiet, RISK holding
// under the push-in, the grid locking onto one card. The read is ~45s at
// rate; the holds take the piece to 59s.
//
// Scene starts are derived from the lengths below; clip durations come from
// the generated durations module. Nothing here is transcribed by hand.
import { buildScenes, defineVoiceover, scenesDuration, VoLine } from "../../reel";
import { DURATIONS } from "./durations";

// Playback rate of the voiceover clips. 1.05–1.10 tightens the read without
// pitching the voice audibly.
export const VO_RATE = 1.08;

export const SCENES = buildScenes({
  hook: 6, // studio face → AI BRANDS / PAY MORE? → HATE fills the frame
  money: 8.5, // $10K → $100K → $1M+ fly up, freeze → BUT THERE'S A CATCH.
  trust: 6, // creator card, +$250,000 up / trust 100→64 down → TRUST cracks
  backlash: 6.5, // PAID PARTNERSHIP → four comments → eighty → one, on black
  economics: 5, // BRAND MONEY + REACH struck → + REPUTATION RISK, push in
  fit: 8, // 8.2M dominates → dimensions stack in → 380K wins → BIGGEST ≠ BEST
  shift: 7, // REACH dissolves, TRUST enormous → ATTENTION ↓ TRUST ↓ INFLUENCE
  measure: 6, // 4,829,103 ✓ vs TRUST ??? → pull back to the field → SO HOW…
  yoloco: 7, // noise snaps to grid, one card locks → mark, CTA, url, 1.9s hold
});

export const DURATION = scenesDuration(SCENES);

export type { VoLine };

// "~PAGE" hides a page (a headline carries those words), "+WORD" paints it
// the hero color once spoken.
//
// Roughly half these pages are hidden. The brief asks for spoken words as
// design elements rather than subtitles, so wherever a scene headline is
// already saying the words — HATE, BUT THERE'S A CATCH., TRUST, BIGGEST ≠
// BEST, SO HOW DO YOU CHOOSE?, the Yoloco line — the caption stays out and
// the frame never carries the same sentence twice. Hidden pages still consume
// their share of the clip, so the visible ones stay in sync.
export const VOICEOVER = defineVoiceover(DURATIONS, [
  {
    // start 0 exactly: the avatar is lip-synced to this clip from reel frame
    // 0, so any offset here desyncs the mouth.
    file: "01-hook",
    start: SCENES.hook.from,
    pages: [
      "~AI COMPANIES HAVE",
      "~A WEIRD NEW PROBLEM.",
      "~INFLUENCERS CAN CHARGE MORE...",
      "~BECAUSE PEOPLE HATE THEIR ADS.",
    ],
  },
  {
    file: "02-money",
    start: SCENES.money.from + 0.25,
    pages: [
      "AND YES —",
      "THIS IS ACTUALLY HAPPENING.",
      "AI BRAND DEALS",
      "CAN BE LUCRATIVE.",
      "SOME REPORTED OFFERS",
      "REACH +SEVEN FIGURES.",
      "~BUT THERE'S A CATCH.", // the slam carries it
    ],
  },
  {
    file: "03-trust",
    start: SCENES.trust.from + 0.2,
    pages: [
      "PROMOTING AI CAN MAKE",
      "A CREATOR MONEY...",
      "AND COST THEM SOMETHING",
      "WORTH FAR MORE.",
      "~TRUST.", // the word that survives the frame
    ],
  },
  {
    file: "04-backlash",
    start: SCENES.backlash.from + 0.2,
    pages: [
      "BECAUSE AUDIENCES",
      "DON'T JUST JUDGE THE AD.",
      "THEY JUDGE THE CREATOR",
      "WHO ACCEPTED IT.",
    ],
  },
  {
    file: "05-economics",
    start: SCENES.economics.from + 0.2,
    pages: ["AND THAT CHANGES", "THE ECONOMICS OF", "INFLUENCER MARKETING."],
  },
  {
    file: "06-fit",
    start: SCENES.fit.from + 0.2,
    pages: [
      "SUDDENLY, FOLLOWER COUNT",
      "ISN'T ENOUGH.",
      "A CREATOR CAN HAVE",
      "MILLIONS OF FOLLOWERS...",
      "AND STILL BE COMPLETELY",
      // Not "+WRONG": the accent is already on creator C's row at this
      // moment, and painting the caption too would put two of them in frame.
      "WRONG FOR YOUR BRAND.",
    ],
  },
  {
    file: "07-shift",
    start: SCENES.shift.from + 0.2,
    pages: [
      "THIS MIGHT BE THE BIGGEST",
      "SHIFT IN INFLUENCER",
      "MARKETING RIGHT NOW.",
      "BRANDS AREN'T BUYING",
      "REACH ANYMORE.",
      "~THEY'RE BUYING TRUST.", // TRUST is already enormous on the page
    ],
  },
  {
    file: "08-measure",
    start: SCENES.measure.from + 0.2,
    pages: [
      "AND +TRUST...",
      "IS A LOT HARDER TO MEASURE",
      "THAN FOLLOWERS.",
      "~SO HOW DO YOU CHOOSE?", // the pull-back's headline
    ],
  },
  {
    file: "09-yoloco",
    start: SCENES.yoloco.from + 0.2,
    pages: [
      "THAT'S WHY INFLUENCER",
      "MARKETING NEEDS +DATA.",
      "~YOLOCO.", // the mark
      "~FIND CREATORS WHO ACTUALLY FIT YOUR BRAND.", // the CTA block
    ],
  },
]);
