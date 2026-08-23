// VibeCloud "AI labs" palette — same brand family as the rest of the series,
// pushed a stop darker so the reel reads as a leaked internal document rather
// than a product page.
//
// The two colors carry the whole editorial rule of this Short and are never
// used decoratively:
//
//   accent blue   = what you CAN use.   Shipping, confirmed, public.
//   primary orange = what you CAN'T.    Internal, reported, unreleased.
//
// So a frame's color alone tells you whether what you are looking at is a fact
// or an attribution. Nothing rumored is ever drawn in blue.
import { Palette } from "../../theme";

export const smPalette: Palette = {
  bg: "#05070E", // near-black navy
  bgAlt: "#0B1120",
  primary: "#FF8A4C", // hero — the unreleased model. Max one glowing element.
  accent: "#4DA3FF", // electric blue — the model you have today
  text: "#EDF2FA",
  textDim: "#7C8AA3",
  glow: "rgba(255, 138, 76, 0.45)",
};

export const smColors = {
  surface: "rgba(11, 17, 32, 0.88)",
  surfaceStrong: "#080D18",
  surfaceLift: "#121A2C",
  line: "rgba(120, 160, 220, 0.16)",
  lineStrong: "rgba(120, 160, 220, 0.34)",
  blueSoft: "rgba(77, 163, 255, 0.11)",
  heroSoft: "rgba(255, 138, 76, 0.10)",
  // Redaction fill. Deliberately NOT pure black — a bar that matches the page
  // background reads as empty space; one a shade above it reads as something
  // covered up, which is the point.
  redact: "#1A2338",
  shadow: "0 34px 96px -48px rgba(0, 0, 0, 0.96)",
} as const;

// Terminal colors — cool and low-contrast on purpose, so the one orange
// element in the eval panel (the redacted checkpoint) stays the only thing
// the eye is pulled to.
export const term = {
  prompt: "#4DA3FF",
  dim: "#5D6E8A",
  plain: "#C3CFDF",
  ok: "#8FA8C8",
} as const;
