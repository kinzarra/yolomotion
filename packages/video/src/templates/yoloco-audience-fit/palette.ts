import { Palette } from "../../theme";

// Real Yoloco identity, lifted from the product:
//   frontend/tailwind.config.ts -> primary #6071FF ("Figma Violet (New Yoloco)"),
//   background-dark #121121, background-light #f6f6f8.
// #6071FF is also the exact background of the social avatar.
export const yoPalette: Palette = {
  bg: "#121121",
  bgAlt: "#1B1930",
  primary: "#6071FF", // THE hero color — max one element per frame
  accent: "#A5B0FF", // primary tint, for secondary data
  text: "#FFFFFF",
  textDim: "#9B98B8",
  glow: "rgba(96, 113, 255, 0.45)", // matches the app's pulseGlow shadow
};

// Semantic surfaces + the two scarce signal colors (bad = wrong audience,
// dim = the devalued vanity number). Never used as decoration.
export const yoColors = {
  surface: "rgba(27, 25, 48, 0.82)",
  surfaceStrong: "#1E1C34",
  surfaceLift: "#282544",
  line: "rgba(160, 165, 220, 0.18)",
  lineStrong: "rgba(160, 165, 220, 0.34)",
  bad: "#FF4D6D",
  badSoft: "rgba(255, 77, 109, 0.14)",
  dim: "#565273",
  deep: "#3B49C4", // darker primary, for gradient depth
  tint: "rgba(96, 113, 255, 0.10)", // hero panel fill
  tintStrong: "rgba(96, 113, 255, 0.14)", // selected row in the app UI
  ink: "rgba(255, 255, 255, 0.9)", // avatar silhouette
  shadow: "0 30px 80px -46px rgba(0, 0, 0, 0.9)",
} as const;
