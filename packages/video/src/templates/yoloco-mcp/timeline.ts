// The timing model. Voiceover only. Scene starts derive from the lengths;
// clip lengths come from the generated durations module.
import { buildScenes, defineVoiceover, scenesDuration, VoLine } from "../../reel";
import { DURATIONS } from "./durations";

// The author's own voice (vEwyfyXy2Qc8PnNvEdqA). 1.05 tightens the read
// without pitching it — his voice is the point, so it is barely sped up.
export const VO_RATE = 1.05;

// Beat lengths (s). Each ≥ its clip at VO_RATE + the lead before the line.
//   hook    5.387/1.05 = 5.13 + 0.25 → 5.38, then snap 5.45 + the cut at 6.0
//   agents  4.73 + 0.35 → 5.08
//   mcp     4.73 + 0.30 → 5.03
//   tools   7.21 + 0.25 → 7.46
//   ask/analyze/plan are one continuous chat; the beats only place the lines
//   plan    4.95 + 0.25 → 5.20, then the card holds and Claude offers the campaign
//   cta     3.85 + 0.30 → 4.15
export const SCENES = buildScenes({
  hook: 6,
  agents: 5.5,
  mcp: 5.5,
  tools: 7.75,
  ask: 6.5,
  analyze: 5,
  plan: 6.5,
  cta: 5,
});

export const DURATION = scenesDuration(SCENES);

export const CHAT_SPAN = {
  from: SCENES.ask.from,
  len: SCENES.ask.len + SCENES.analyze.len + SCENES.plan.len,
};

// Hook choreography, seconds from the scene start.
export const HOOK = {
  tightUntil: 2.7,
  pulledAt: 4.1,
  headline: 3.4,
  snap: 5.45,
  strobe: 5.72,
} as const;

// The second hard cut — agents → MCP at 11.5s, the one the author asked to
// make a proper TikTok transition. Seconds from the START of the agents beat.
export const CUT2 = { at: SCENES.agents.len - 0.5 } as const;

export type { VoLine };

// "~PAGE" hides a page (a headline carries those words), "+WORD" paints it
// the hero colour once spoken. No em dashes anywhere on screen.
export const VOICEOVER = defineVoiceover(DURATIONS, [
  {
    file: "01-hook",
    start: SCENES.hook.from + 0.25,
    pages: ["HI, I'M +PHILIPP,", "FOUNDER OF +YOLOCO.", "LET ME SHOW YOU HOW", "~INFLUENCER MARKETING", "~IS CHANGING."],
  },
  {
    file: "02-agents",
    start: SCENES.agents.from + 0.35,
    pages: ["WELCOME TO THE +NEW +ERA.", "~THE AI REVOLUTION.", "~TODAY, EVERYTHING RUNS ON AGENTS."],
  },
  {
    file: "03-mcp",
    start: SCENES.mcp.from + 0.3,
    pages: ["AND INFLUENCER MARKETING", "IS NOT FALLING BEHIND.", "AT +YOLOCO,", "~WE LAUNCHED AN MCP SERVER."],
  },
  {
    file: "04-tools",
    start: SCENES.tools.from + 0.25,
    pages: [
      "YOUR AGENT CAN NOW",
      "~FIND THE RIGHT CREATORS,",
      "~ANALYZE THEIR AUDIENCE,",
      "~CHECK THE OVERLAP,",
      "~AND BUILD THE MEDIA PLAN.",
      "STRAIGHT FROM THE +CHAT.",
    ],
  },
  {
    file: "05-ask",
    start: SCENES.ask.from + 0.3,
    pages: ["WATCH.", "~FIND ME FITNESS INSTRUCTORS IN FLORIDA.", "THE AGENT SEARCHES +YOLOCO", "AND BRINGS BACK CREATORS."],
  },
  {
    file: "06-analyze",
    start: SCENES.analyze.from + 0.25,
    pages: ["YOU PICK THE ONES YOU LIKE.", "IT ANALYZES THEM,", "AND FLAGS THE TWO", "WITH A FAKE AUDIENCE."],
  },
  {
    file: "07-plan",
    start: SCENES.plan.from + 0.25,
    pages: ["~ADD THE REST TO A MEDIA PLAN.", "DONE.", "BUDGET, REACH, DATES.", "IN ONE +MESSAGE."],
  },
  {
    file: "08-cta",
    start: SCENES.cta.from + 0.3,
    pages: ["~MCP.", "~POWERED BY YOLOCO.", "SCAN THE CODE,", "OR GRAB THE LINK IN BIO."],
  },
]);
