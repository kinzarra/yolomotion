// ВЫПУСК: FedEx. Series palette from digital-ruble, the world recoloured in
// FedEx purple and orange: purple is the company, orange is money and action.
import { drPalette, drColors } from "../digital-ruble/palette";

export const fxPalette = { ...drPalette, primary: "#FF6200", glow: "rgba(255, 98, 0, 0.55)" };
export const fxColors = drColors;

export const fx = {
  outline: "#0B0616",
  purple: "#4D148C",
  purpleHi: "#6B2FC0",
  purpleLo: "#2E0B5C",
  night: "#120728",
  nightLow: "#24104A",
  orange: "#FF6200",
  orangeHi: "#FF8A3D",
  white: "#FFFFFF",
  paper: "#F3F0F7",
  grey: "#A39CB3",
  greyLo: "#6E6680",
  tarmac: "#1A1326",
  tarmacLine: "rgba(255, 255, 255, 0.10)",
  glass: "#FFD9B8",
  skin: "#EDBE9C",
  skinLo: "#D49E7C",
  hair: "#5A3A22",
  suit: "#262B3B",
  suitLo: "#1A1E2A",
  felt: "#3A0F78",
  feltHi: "#5520A0",
  red: "#E5243B",
  ink: "#15101F",
  box: "#D9A066",
  boxLo: "#B07A45",
  dawn: "#FF9A52",
} as const;
