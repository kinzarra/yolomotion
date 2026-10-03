import { Palette } from "../../theme";

// One hero color, everything else monochrome — max one glowing element per
// frame. Replace these with the scenario's palette.
export const dubaiEconomyPalette: Palette = {
  bg: "#07070A",
  bgAlt: "#101016",
  primary: "#7C3AED", // THE hero color
  accent: "#B49BFF", // tint of the hero, secondary data only
  text: "#F4F4F7",
  textDim: "#8E8E9A",
  glow: "rgba(124, 58, 237, 0.42)",
};

export const dubaiEconomyColors = {
  surface: "rgba(18, 18, 24, 0.84)",
  surfaceStrong: "#15151B",
  surfaceLift: "#20202A",
  line: "rgba(235, 235, 245, 0.14)",
  lineStrong: "rgba(235, 235, 245, 0.32)",
  white: "#FFFFFF",
  ink: "#08080B",
  dim: "#55555E",
  shadow: "0 30px 80px -46px rgba(0, 0, 0, 0.9)",
} as const;
