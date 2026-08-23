// VibeCloud "concurrency" palette — same brand family as the indexes and
// security Shorts: deep navy base, logo orange as THE hero color, logo blue as
// the structural accent. Red is the failure signal (the double sale) and green
// only ever appears on the corrected run; neither is decoration.
import { Palette } from "../../theme";

export const rcPalette: Palette = {
  bg: "#070B16", // deep navy
  bgAlt: "#0E1524",
  primary: "#FF8A4C", // hero — max one element per frame
  accent: "#3E8FD0", // VibeCloud electric blue
  text: "#EEF3FA",
  textDim: "#7D8CA6",
  glow: "rgba(255, 138, 76, 0.45)",
};

export const rcColors = {
  surface: "rgba(14, 21, 36, 0.86)",
  surfaceStrong: "#0F1727",
  surfaceLift: "#162034",
  line: "rgba(120, 150, 200, 0.16)",
  lineStrong: "rgba(120, 150, 200, 0.34)",
  blue: "#2A6DA0",
  blueSoft: "rgba(62, 143, 208, 0.12)",
  good: "#4ADE9B",
  goodSoft: "rgba(74, 222, 155, 0.12)",
  danger: "#FF5A5A",
  dangerSoft: "rgba(255, 90, 90, 0.13)",
  dangerGlow: "rgba(255, 90, 90, 0.5)",
  tint: "rgba(255, 138, 76, 0.10)",
  // Both racers share one colour on purpose: they are the same request, and
  // that is the whole point of the bug. Position and the A/B label separate
  // them. Colour then means exactly one thing each — blue is a request,
  // orange is the contested row and the lock that guards it, red is the
  // failure, green is the corrected outcome.
  req: "#5AA9E6",
  reqSoft: "rgba(90, 169, 230, 0.14)",
  shadow: "0 30px 90px -46px rgba(0, 0, 0, 0.95)",
} as const;

// Code / value colors — cool, so the row value stays the only warm number
// on screen when it matters.
export const syntax = {
  kw: "#7FB4E8",
  id: "#D6DEEA",
  str: "#7FD6A8",
  num: "#FFB27A",
  punct: "#67789A",
  plain: "#D6DEEA",
} as const;
