// Yoloco Explorer. A Yoloco product promo, so it inherits the Yoloco identity
// wholesale: #6071FF is the hero and the only glow. The product UI is shown
// the way the app draws it (light cards on #f6f6f8), so the reel carries two
// surfaces — the dark Yoloco field and the bright product card — and still
// one signal colour. "Keep" is the hero; "strike" goes dim + struck, never red.
import { Palette } from "../../theme";
import { yoColors, yoPalette } from "../yoloco-audience-fit/palette";

export const exPalette: Palette = yoPalette;

export const exColors = {
  ...yoColors,
  // The app's light theme, lifted from the live report page.
  app: "#F6F6F8",
  card: "#FFFFFF",
  cardLine: "#E7E7EE",
  appInk: "#14132A",
  appDim: "#6E6C86",
  appFaint: "#A3A1B8",
  chip: "#F1F1F6",
  // Hero tint on light (selected tab, "new" badge, kept card ring).
  heroSoftLight: "rgba(96, 113, 255, 0.12)",
  // The app's primary button runs violet → blue.
  heroEnd: "#4F8BFF",
  // Excel export: the app paints that one button green. Kept to the button
  // and the sheet header only, and never in the same frame as a glow.
  sheet: "#1F8A53",
  sheetSoft: "rgba(31, 138, 83, 0.12)",
} as const;
