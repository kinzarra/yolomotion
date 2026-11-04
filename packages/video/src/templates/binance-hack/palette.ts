// ВЫПУСК: Binance. Series palette from digital-ruble, recoloured as a noir
// comic: ink, newsprint and one Binance yellow. Yellow is the money (the
// vault, the counter), red is the crime (stamps, strings, the thief).
import { drPalette, drColors } from "../digital-ruble/palette";

export const bhPalette = { ...drPalette, primary: "#F0B90B", glow: "rgba(240, 185, 11, 0.5)" };
export const bhColors = drColors;

export const bh = {
  ink: "#0B0B0D",
  inkSoft: "#1A1A1F",
  night: "#08080A",
  paper: "#F2EAD8",
  paperShade: "#DCD2BC",
  yellow: "#F0B90B",
  yellowHi: "#FFD84D",
  yellowLo: "#8A6A06",
  red: "#E5243B",
  redLo: "#7A0F1C",
  white: "#FFFFFF",
  grey: "#8C8A86",
  cork: "#2A2018",
  string: "#E5243B",
} as const;
