// VibeCloud "frontend secrets" palette: same deep-navy brand family as the
// indexes Short — navy base, logo orange as THE hero color, electric blue as
// the structural accent. Danger red is the leak alarm and is never decoration.
import { Palette } from "../../theme";

export const secPalette: Palette = {
  bg: "#070B16", // deep navy
  bgAlt: "#0E1524",
  primary: "#FF8A4C", // hero — max one element per frame
  accent: "#3E8FD0", // VibeCloud electric blue
  text: "#EEF3FA",
  textDim: "#7D8CA6",
  glow: "rgba(255, 138, 76, 0.45)",
};

export const secColors = {
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
  // Mock-app chart bars need real contrast on the lifted surface or the
  // dashboard beat reads as an empty panel.
  bar: "rgba(163, 188, 224, 0.42)",
  shadow: "0 30px 90px -46px rgba(0, 0, 0, 0.95)",
  // DevTools chrome sits darker than the app surfaces so the "ripped open"
  // beat reads as going BENEATH the pretty UI.
  toolsBg: "#0A0F1A",
  toolsBar: "#0C1220",
} as const;

// Editor / DevTools syntax — deliberately cool so the leaked key (hero orange)
// and the danger highlights stay the only warm pixels in a code frame.
export const syntax = {
  kw: "#7FB4E8",
  id: "#D6DEEA",
  str: "#7FD6A8",
  num: "#FFB27A",
  punct: "#67789A",
  comment: "#4E5D78",
  plain: "#D6DEEA",
} as const;

export type SyntaxKind = keyof typeof syntax;
