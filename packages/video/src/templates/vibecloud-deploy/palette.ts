// VibeClouD brand mapped onto the video palette.
// Hero color = terracotta (logo bolt / landing accent). Blue is secondary.
import { Palette } from "../../theme";

export const vibe: Palette = {
  bg: "#0B0D12", // landing dark-mode background
  bgAlt: "#12161E",
  primary: "#E07A5F", // hero — max one element per frame
  accent: "#2A6DA0", // brand blue, surfaces + mesh
  text: "#F4F4F5",
  textDim: "#9AA3AF",
  glow: "rgba(224, 122, 95, 0.4)",
};

// The landing's real dark-mode tokens (html.dark in globals.css) — used
// INSIDE the browser mockup so the product looks like the actual site.
export const page = {
  background: "#0B0D12",
  surface: "#14171E",
  surfaceAlt: "rgba(30, 34, 44, 0.6)",
  primary: "#FF934D", // dark-mode hero orange
  accent: "#57E6C0",
  textMain: "#ECEEF2",
  textMuted: "#8B93A3",
  border: "rgba(150, 160, 185, 0.16)",
  shadow: "0 18px 44px -22px rgba(0, 0, 0, 0.8)",
  btnGrad: "linear-gradient(118deg, #FFD9A8, #FF934D 55%, #FF7A2E)",
  btnText: "#241300",
} as const;

// Editor syntax colors — deliberately cool/neutral so the orange cursor stays
// the only hero-colored element in the IDE scene.
export const syntax = {
  kw: "#7FB4D8",
  fn: "#B8C4E8",
  str: "#A3BE8C",
  tag: "#8FBCBB",
  punct: "#6B7280",
  comment: "#565F6E",
  plain: "#D6DAE0",
} as const;
