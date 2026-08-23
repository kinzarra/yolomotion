import { Palette } from "../../theme";

// The brief's palette: near-black base, electric green as THE hero color
// (Yoloco / the fix / new reach), red as the scarce problem signal (same
// audience, invisible tax). Same discipline as ai-influencer: max one
// glowing element per frame — green OR red, never both.
export const ovPalette: Palette = {
  bg: "#050807",
  bgAlt: "#0C120E",
  primary: "#00FF85", // THE hero color — max one element per frame
  accent: "#7DFFC0", // green tint, secondary data only
  text: "#F2F7F4",
  textDim: "#8B968E",
  glow: "rgba(0, 255, 133, 0.42)",
};

export const ovColors = {
  surface: "rgba(15, 21, 17, 0.84)",
  surfaceStrong: "#101712",
  surfaceLift: "#1A241D",
  line: "rgba(228, 244, 234, 0.14)",
  lineStrong: "rgba(228, 244, 234, 0.32)",
  white: "#FFFFFF",
  ink: "#060907",
  // The problem color — as scarce as the hero green.
  bad: "#FF3B4D",
  badSoft: "rgba(255, 59, 77, 0.12)",
  badLine: "rgba(255, 59, 77, 0.55)",
  badGlow: "rgba(255, 59, 77, 0.45)",
  greenSoft: "rgba(0, 255, 133, 0.10)",
  greenLine: "rgba(0, 255, 133, 0.55)",
  // Procedural avatar tones — porcelain neutrals so five distinct faces
  // never fight the two signal colors.
  skin: "#E7EAE6",
  skinShade: "#C2C8C2",
  hairA: "#20241F",
  hairB: "#3A3F38",
  dim: "#525B54",
  shadow: "0 30px 80px -46px rgba(0, 0, 0, 0.9)",
} as const;
