// Night sky, after the reference reel (creaconbruno): deep navy, stars, and
// one glowing trail per life. Each hero owns one trail colour; red is kept
// for losses only (a minus on a tag), so it never names a person.
import { Palette } from "../../theme";

export const fourWalletsPalette: Palette = {
  bg: "#050812",
  bgAlt: "#0B1230",
  primary: "#6E7CFF", // grade tint: pushes the frame toward the night blue
  accent: "#B9C3FF",
  text: "#EEF1FF",
  textDim: "#8790B8",
  glow: "rgba(110, 124, 255, 0.4)",
};

export const fwColors = {
  skyTop: "#0B1336",
  skyMid: "#0A0F27",
  skyBottom: "#04060D",
  nebulaA: "rgba(108, 76, 210, 0.26)",
  nebulaB: "rgba(52, 96, 220, 0.22)",
  star: "#DCE3FF",
  grid: "rgba(185, 195, 255, 0.10)",
  gridZero: "rgba(185, 195, 255, 0.34)",
  axisText: "rgba(185, 195, 255, 0.55)",
  surface: "rgba(8, 12, 30, 0.82)",
  surfaceLine: "rgba(185, 195, 255, 0.18)",
  white: "#FFFFFF",
  loss: "#FF4D5E",
  lossGlow: "rgba(255, 77, 94, 0.45)",
  // one trail colour per hero
  worker: "#8EC5FF",
  business: "#CDFF3B",
  wife: "#FF8FCB",
  major: "#FFC94A",
} as const;
