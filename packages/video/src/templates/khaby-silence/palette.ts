import { Palette } from "../../theme";

// Black / bone / neutral greys — an editorial print palette, not a screen one.
// The single accent is a flat vermilion: at most one element per frame wears
// it, most frames have none, and it never glows. Captions highlight the active
// word in white, so the accent is reserved for the scenario's keywords.
export const ksPalette: Palette = {
  bg: "#070707",
  bgAlt: "#111111",
  primary: "#E8481F", // THE accent — max one element per frame, flat, no neon
  accent: "#B8B2A7", // warm grey, secondary data only
  text: "#D9D3C7", // caption body: a shade under bone so the active word reads
  textDim: "#6E6A63",
  glow: "rgba(232, 72, 31, 0.28)", // used once, under the #1 flash
};

export const ksColors = {
  bone: "#EDE8DF", // headline white
  white: "#FFFFFF", // the active caption word, camera flashes
  ink: "#070707",
  paper: "#EDE8DF", // the chaos beat's sheet
  paperInk: "#141414",
  paperLine: "rgba(20, 20, 20, 0.55)",
  surface: "rgba(237, 232, 223, 0.05)",
  surfaceStrong: "#121212",
  line: "rgba(237, 232, 223, 0.14)",
  lineStrong: "rgba(237, 232, 223, 0.34)",
  dim: "#4A4742",
  shadow: "0 40px 90px -40px rgba(0, 0, 0, 0.95)",
  photo: "grayscale(1) contrast(1.08) brightness(0.96)",
} as const;
