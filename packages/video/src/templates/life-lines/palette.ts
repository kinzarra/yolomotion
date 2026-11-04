// life-lines: «Созвездие». Night sky, one glowing thread per person.
// The look copies creaconbruno's reel 1:1 (author's request, 2026-10-25),
// so it has its own palette instead of the «ДЕНЬГИ · ПРОСТО» kit.
import { Easing } from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadCormorant } from "@remotion/google-fonts/CormorantGaramond";

const inter = loadInter("normal", {
  weights: ["500", "600"],
  subsets: ["cyrillic", "latin"],
});
const serif = loadCormorant("italic", {
  weights: ["500"],
  subsets: ["cyrillic", "latin"],
});

export const fonts = {
  label: inter.fontFamily,
  serif: serif.fontFamily,
} as const;

export const palette = {
  skyTop: "#0e1838",
  skyMid: "#0a1129",
  skyBottom: "#04060d",
  nebula: "rgba(92, 104, 210, 0.16)",
  nebula2: "rgba(150, 90, 200, 0.10)",
  star: "#dfe6ff",
  axis: "rgba(170, 182, 220, 0.22)",
  axisText: "rgba(170, 182, 220, 0.55)",
  now: "#ffc24a",
  passTrail: "#aab4cc",
  passLabel: "#dfe5f5",
  constellation: "rgba(200, 212, 255, 0.5)",
  text: "#f2f0ea",
  textDim: "#c3c9e0",
  pillBg: "rgba(10, 14, 32, 0.78)",
  scrim: "rgba(4, 6, 16, 0.72)",
  // one color per thread
  grandma: "#a597ff",
  grandpa: "#e8ecf5",
  mom: "#ff5f6d",
  dad: "#5585ff",
  me: "#ffc24a",
  friend: "#3ddc84",
  dog: "#ff8c3a",
  wife: "#ff94cb",
  son: "#2fe0d0",
  daughter: "#d6f25c",
  grandson: "#74c6ff",
  granddaughter: "#9cf5c4",
} as const;

export const ease = {
  out: Easing.bezier(0.16, 1, 0.3, 1),
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  in: Easing.bezier(0.7, 0, 0.84, 0),
} as const;

export const springs = {
  pop: { damping: 13, stiffness: 150, mass: 0.6 },
  soft: { damping: 20, stiffness: 80, mass: 1 },
} as const;
