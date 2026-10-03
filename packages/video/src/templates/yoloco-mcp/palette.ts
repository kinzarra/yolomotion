// Yoloco × Claude. The reel is a Yoloco product promo, so it inherits the
// Yoloco identity wholesale (#6071FF is the hero and the only glow), and adds
// one second signal colour: Claude's clay. Clay marks the agent side only —
// the Claude mark, the spinner while a tool runs — never a "bad" state, so
// flagged creators go dim + struck rather than red. Two colours, not three.
import { Palette } from "../../theme";
import { yoColors, yoPalette } from "../yoloco-audience-fit/palette";

export const mcpPalette: Palette = yoPalette;

export const mcpColors = {
  ...yoColors,
  clay: "#D97757",
  clayGlow: "rgba(217, 119, 87, 0.42)",
  claySoft: "rgba(217, 119, 87, 0.16)",
  // Claude-style chat surfaces: warm near-black and ivory, so the demo reads
  // as "a chat" against the cool Yoloco field around it.
  chatBg: "#262624",
  chatSurface: "#30302E",
  chatBubble: "#3D3D3A",
  chatLine: "rgba(240, 238, 230, 0.10)",
  ivory: "#F0EEE6",
  ivoryDim: "#A8A59C",
  ivoryFaint: "#6E6B64",
  qrInk: "#141413", // QR modules on the ivory plate (yoColors.ink is white: the avatar silhouette)
  // Muted avatar gradients for the demo creators — none may compete with the hero.
  avatarHues: ["#565273", "#6B6890", "#4B4870", "#7B78A0", "#3F3C60", "#5E5B85"],
} as const;
