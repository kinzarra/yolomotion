// The scenario as data. Voiceover only — no music, no SFX — so every cut is
// paced off the spoken lines.
//
// Beat lengths are each clip's measured read plus the hold the beat needs
// after the voice stops: the follower count settling, THAT'S IT. sitting in
// silence, the globe emptying to one gesture, #1 under the flashes, the brand
// holding for a second. The full read is ~46s at rate; the holds take the
// piece to 59s.
//
// Scene starts are derived from the lengths below; clip durations come from
// the generated durations module. Nothing here is transcribed by hand.
import { buildScenes, defineVoiceover, scenesDuration, VoLine } from "../../reel";
import { DURATIONS } from "./durations";

// Playback rate of the voiceover clips. 1.05–1.10 tightens the read without
// pitching the voice audibly.
export const VO_RATE = 1.08;

export const SCENES = buildScenes({
  hook: 5, // black → 0 → WORDS. → portrait through the type → 1M…100M+
  job: 7.5, // 2020 → FACTORY JOB struck → LOST. → ladder → phone, 0 followers
  nobody: 4.5, // early-post cards → black → THEN HE NOTICED SOMETHING.
  chaos: 6.5, // paper sheet fills with steps and arrows → hard cut to black
  opposite: 4.5, // reset: one object, the gesture → THAT'S IT.
  silence: 7.5, // NO EXPLANATION / VOICE / LANGUAGE → globe → NO TRANSLATION NEEDED.
  barrier: 5, // language wall → shatters on "language" → UNIVERSAL.
  growth: 5, // ladder 2020 → 100M+ rides up → #1 under camera flashes
  lesson: 8, // creator cards: FOLLOWERS struck → AUDIENCE FIT → RIGHT AUDIENCE WINS
  yoloco: 6, // BIG struck → RIGHT → mark, FIND THE RIGHT CREATORS., yoloco.io, 1s hold
});

export const DURATION = scenesDuration(SCENES);

export type { VoLine };

// "~PAGE" hides a page (a headline carries those words), "+WORD" paints it
// the accent once spoken.
export const VOICEOVER = defineVoiceover(DURATIONS, [
  {
    file: "01-hook",
    start: SCENES.hook.from + 0.5,
    // The hook's type is the caption: 0 WORDS. and the editorial block carry
    // every word of the line.
    pages: [
      "~THIS MAN BECAME",
      "~ONE OF THE BIGGEST",
      "~CREATORS ON EARTH...",
      "~WITHOUT SAYING A SINGLE WORD.",
    ],
  },
  {
    file: "02-job",
    start: SCENES.job.from + 0.2,
    pages: [
      "IN 2020, KHABY LAME",
      "~LOST HIS FACTORY JOB.", // the strike + LOST. headline
      "SO HE WENT HOME...",
      "OPENED TIKTOK...",
      "AND STARTED FILMING VIDEOS",
      "IN HIS BEDROOM.",
    ],
  },
  {
    file: "03-nobody",
    start: SCENES.nobody.from + 0.2,
    pages: [
      "AT FIRST,",
      "ALMOST NOBODY CARED.",
      "~THEN HE NOTICED SOMETHING.", // lands in the scene after the black
    ],
  },
  {
    file: "04-chaos",
    start: SCENES.chaos.from + 0.2,
    pages: [
      "THE INTERNET WAS OBSESSED",
      "WITH RIDICULOUS LIFE HACKS.",
      "PEOPLE WERE MAKING",
      "SIMPLE THINGS...",
      "IMPOSSIBLY COMPLICATED.",
    ],
  },
  {
    file: "05-opposite",
    start: SCENES.opposite.from + 0.4,
    // THE OPPOSITE. and THAT'S IT. own this beat — no captions under them.
    pages: ["~SO KHABY DID THE OPPOSITE.", "~HE SHOWED THE OBVIOUS SOLUTION."],
  },
  {
    file: "06-silence",
    start: SCENES.silence.from + 0.2,
    pages: [
      "~NO EXPLANATION.", // the three slams
      "~NO VOICE-OVER.",
      "~NO LANGUAGE.",
      "AND SUDDENLY...",
      "THE ENTIRE +WORLD",
      "UNDERSTOOD THE JOKE.",
    ],
  },
  {
    file: "07-barrier",
    start: SCENES.barrier.from + 0.2,
    pages: [
      "KHABY HAD REMOVED",
      "ONE OF THE BIGGEST",
      "BARRIERS IN CONTENT:",
      "~LANGUAGE.", // the wall breaks on this word
    ],
  },
  {
    file: "08-growth",
    start: SCENES.growth.from + 0.2,
    pages: [
      "AND THE RESULT?",
      "HE BECAME THE",
      "MOST-FOLLOWED CREATOR",
      "ON TIKTOK.",
    ],
  },
  {
    file: "09-lesson",
    start: SCENES.lesson.from + 0.2,
    pages: [
      "BUT HERE'S THE",
      "INFLUENCER MARKETING LESSON.",
      "THE BEST CREATOR",
      "ISN'T ALWAYS THE ONE",
      "WHO SAYS THE MOST.",
      "IT'S THE ONE YOUR +AUDIENCE",
      "UNDERSTANDS INSTANTLY.",
    ],
  },
  {
    file: "10-yoloco",
    start: SCENES.yoloco.from + 0.2,
    pages: [
      "THAT'S WHY BRANDS",
      "DON'T JUST NEED BIG CREATORS.",
      "~THEY NEED THE RIGHT CREATORS.", // BIG → RIGHT on screen
      "~YOLOCO.", // the mark
    ],
  },
]);
