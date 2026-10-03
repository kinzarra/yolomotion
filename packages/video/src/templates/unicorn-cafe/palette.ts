import { Palette } from "../../theme";

// One hero color: unicorn magenta. The footage is a bright, warm café shot —
// beige walls, wood table, daylight — so the accent has to be a colour that
// does not occur anywhere in it. Magenta is the only saturated hue in the
// frame at any moment, which is what makes the eye go where it is put.
export const ucPalette: Palette = {
  bg: "#08070B",
  bgAlt: "#141018",
  primary: "#FF2E93", // THE hero color — max one element per frame
  accent: "#FF9AC8", // tint of the hero, small marks only
  text: "#F7F4F8",
  textDim: "#8B8794",
  glow: "rgba(255, 46, 147, 0.45)",
};

export const ucColors = {
  // Chrome is deliberately colourless: HUD, plates and rules are bone or ink,
  // never magenta, so the accent stays unique in every frame.
  bone: "#F7F4F8",
  ink: "#08070B",
  plate: "rgba(8, 7, 11, 0.72)",
  plateSolid: "#0C0A10",
  line: "rgba(247, 244, 248, 0.22)",
  lineStrong: "rgba(247, 244, 248, 0.55)",
  dim: "rgba(247, 244, 248, 0.5)",
  shadow: "0 30px 90px -40px rgba(0, 0, 0, 0.85)",
} as const;
