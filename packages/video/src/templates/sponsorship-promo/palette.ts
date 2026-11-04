// Yoloco product palette, taken 1:1 from yoloapp/frontend (tailwind.config.ts,
// components/report/chartColors.ts, the report widgets). Not the «ДЕНЬГИ ·
// ПРОСТО» look: this is a product promo, so it wears the product.
//
// Violet #6071FF is the one hero color. Product cards are white, exactly as in
// the app, floating on the app's dark background. Red is the scarce "bad" signal.
import { Palette } from "../../theme";

export const spPalette: Palette = {
  bg: "#121121", // background-dark
  bgAlt: "#1A1930",
  primary: "#6071FF", // Figma Violet (New Yoloco)
  accent: "#A5A9FF", // chart tint of the violet (non-peak bars)
  text: "#FFFFFF",
  textDim: "#A3A8C3",
  glow: "rgba(96, 113, 255, 0.45)",
};

export const sp = {
  violet: "#6071FF",
  violetTint: "#A5A9FF",
  violetSoft: "#EFF1FF",
  violetGlow: "rgba(96, 113, 255, 0.45)",
  bad: "#F5535D", // CHART_RED
  badSoft: "rgba(245, 83, 93, 0.12)",
  // report brand colors by position (STATS_COMPARE_COLORS)
  mixit: "#6071FF",
  vois: "#D19000",
  theact: "#10BF61",
  blue: "#21A5E4",
  // app surfaces
  card: "#FFFFFF",
  page: "#F2F5FA",
  ink: "#0F172A",
  inkSoft: "#323841",
  muted: "#929EB0",
  mutedDark: "#76849B",
  line: "#E6EAF0",
  track: "#F2F4F7",
  night: "#121121",
  black: "#07070E",
  // platforms (MediaplanOverviewBoard PLATFORM_ID_META)
  instagram: "#E1306C",
  youtube: "#FF0000",
  tiktok: "#010101",
  telegram: "#0088CC",
  vk: "#4C75A3",
  shadow: "0 40px 90px -30px rgba(0, 0, 0, 0.75), 0 0 0 1px rgba(255,255,255,0.04)",
  white: "#FFFFFF",
} as const;
