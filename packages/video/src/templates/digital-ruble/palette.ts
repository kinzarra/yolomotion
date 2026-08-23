// «ЧЕК × ПИКСЕЛЬ» — the personal-finance-blog look this reel establishes.
//
// Two worlds share the frame: thermal-receipt paper (the money everyone
// already knows) and an acid-lime digital layer (the new form). Lime is the
// one hero color and marks exactly one thing per frame — the digital ruble,
// the fix, the "yes". Red is the alarm and the "no", and it is just as scarce.
// Paper is a SURFACE, never a signal: it carries ink, not meaning.
import { Palette } from "../../theme";

export const drPalette: Palette = {
  bg: "#06080A",
  bgAlt: "#0E1216",
  primary: "#CDFF3B", // acid lime — THE hero color
  accent: "#8BFFD6", // mint tint of the hero, for the glitch's second channel only
  text: "#F2F5EE",
  textDim: "#8A918C",
  glow: "rgba(205, 255, 59, 0.42)",
};

export const drColors = {
  bad: "#FF3B3B", // alarm / "no" / not provided
  badGlow: "rgba(255, 59, 59, 0.38)",
  // thermal paper
  paper: "#F1EDE2",
  paperShade: "#E3DECF",
  ink: "#15171A",
  inkFaded: "#6E6C64",
  inkRule: "rgba(21, 23, 26, 0.22)",
  // dark surfaces
  surface: "rgba(16, 20, 24, 0.86)",
  surfaceStrong: "#10141A",
  surfaceLift: "#1A2027",
  line: "rgba(230, 240, 225, 0.12)",
  lineStrong: "rgba(230, 240, 225, 0.3)",
  white: "#FFFFFF",
  ink2: "#05070A",
  shadow: "0 34px 90px -40px rgba(0, 0, 0, 0.92)",
  paperShadow: "0 30px 60px -30px rgba(0, 0, 0, 0.75)",
} as const;
