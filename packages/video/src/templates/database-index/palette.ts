// VibeCloud "indexes" palette: deep navy base, the logo's orange as THE hero
// color, the logo's blue as the structural accent. Sampled from
// public/images/vibe-cloud-logo.png.
import { Palette } from "../../theme";

export const idxPalette: Palette = {
  bg: "#070B16", // deep navy
  bgAlt: "#0E1524",
  primary: "#FF8A4C", // hero — max one element per frame
  accent: "#3E8FD0", // VibeCloud blue
  text: "#EEF3FA",
  textDim: "#7D8CA6",
  glow: "rgba(255, 138, 76, 0.45)",
};

// Surfaces + the two scarce signal colors. `danger` is the full-scan alarm and
// `good` is the indexed result — neither is ever used as decoration.
export const idxColors = {
  surface: "rgba(14, 21, 36, 0.86)",
  surfaceStrong: "#0F1727",
  surfaceLift: "#162034",
  paper: "#1B2740", // the book pages in the analogy scene
  line: "rgba(120, 150, 200, 0.16)",
  lineStrong: "rgba(120, 150, 200, 0.34)",
  // Dense rows are drawn as bars; at 13px tall they need real contrast or the
  // "hundreds of thousands of rows" beat reads as an empty panel.
  bar: "rgba(163, 188, 224, 0.62)",
  barSoft: "rgba(163, 188, 224, 0.34)",
  blue: "#2A6DA0", // the logo blue, for depth behind the accent
  blueSoft: "rgba(62, 143, 208, 0.12)",
  good: "#4ADE9B",
  goodSoft: "rgba(74, 222, 155, 0.12)",
  danger: "#FF5A5A",
  dangerSoft: "rgba(255, 90, 90, 0.13)",
  tint: "rgba(255, 138, 76, 0.10)",
  shadow: "0 30px 90px -46px rgba(0, 0, 0, 0.95)",
} as const;

// Editor syntax colors — deliberately cool so code never competes with the hero.
export const syntax = {
  kw: "#7FB4E8",
  id: "#D6DEEA",
  str: "#7FD6A8",
  num: "#FFB27A",
  punct: "#67789A",
  plain: "#D6DEEA",
} as const;

export type SyntaxKind = keyof typeof syntax;
