import { Palette } from "../../theme";

// Black / white / red — the scenario's palette, executed with the same
// discipline as the Yoloco brand video: one hero color, everything else
// monochrome. Red is scarce: the active caption word OR the scene's single
// red element, never both glowing at once.
export const aiPalette: Palette = {
  bg: "#070708",
  bgAlt: "#101013",
  primary: "#FF2E3F", // THE hero color — max one element per frame
  accent: "#FF8B94", // red tint, secondary data only
  text: "#F5F5F7",
  textDim: "#8E8E98",
  glow: "rgba(255, 46, 63, 0.45)",
};

export const aiColors = {
  surface: "rgba(19, 19, 23, 0.82)",
  surfaceStrong: "#151518",
  surfaceLift: "#202026",
  line: "rgba(235, 235, 245, 0.14)",
  lineStrong: "rgba(235, 235, 245, 0.32)",
  white: "#FFFFFF",
  // Her — porcelain monochrome so she reads synthetic, not human.
  skin: "#E9E9EF",
  skinShade: "#C4C4D0",
  skinLine: "#AFAFBE",
  hair: "#1B1B21",
  ink: "#0B0B0E",
  lips: "#B4A4AE",
  dim: "#55555E",
  redSoft: "rgba(255, 46, 63, 0.12)",
  redLine: "rgba(255, 46, 63, 0.55)",
  shadow: "0 30px 80px -46px rgba(0, 0, 0, 0.9)",
} as const;
