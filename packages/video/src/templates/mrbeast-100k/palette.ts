import { Palette } from "../../theme";

// YouTube red on near-black, everything else white/grey. The reel is a
// mini-documentary about a platform, so the platform's own red is the only
// color allowed on screen — one red element per frame, never two.
export const mbPalette: Palette = {
  bg: "#08080B",
  bgAlt: "#101015",
  primary: "#FF1E28", // THE hero color — max one element per frame
  accent: "#FF7B82", // red tint, secondary data only
  text: "#F6F6F8",
  textDim: "#83838D",
  glow: "rgba(255, 30, 40, 0.45)",
};

export const mbColors = {
  surface: "rgba(17, 17, 22, 0.86)",
  surfaceStrong: "#131318",
  surfaceLift: "#1D1D24",
  line: "rgba(236, 236, 244, 0.13)",
  lineStrong: "rgba(236, 236, 244, 0.30)",
  white: "#FFFFFF",
  ink: "#08080B",
  dim: "#4E4E58",
  // The archival player card: a 2017 upload, so it is grey and slightly warm,
  // never black — it has to read as footage, not as background.
  tape: "#191920",
  tapeLift: "#25252E",
  redSoft: "rgba(255, 30, 40, 0.12)",
  redLine: "rgba(255, 30, 40, 0.55)",
  shadow: "0 30px 80px -46px rgba(0, 0, 0, 0.92)",
} as const;
