// ВЫПУСК: шаурмичная. Series palette (lime = money / +500 ₽, red = the grill
// heat only), plus the cartoon's muted street colors so nothing on the
// street competes with the lime.
export { drPalette as sfPalette, drColors as sfColors } from "../digital-ruble/palette";

export const toon = {
  outline: "#05070A",
  skyTop: "#070A12",
  skyLow: "#111827",
  building: ["#0E131B", "#121924", "#0B1017"],
  windowOn: "rgba(241, 237, 226, 0.55)",
  windowOff: "rgba(241, 237, 226, 0.06)",
  wall: "#1A1F27",
  sidewalk: "#1B2028",
  sidewalkLine: "rgba(230, 240, 225, 0.07)",
  curb: "#2B313A",
  road: "#0B0E13",
  kiosk: "#232A33",
  kioskDark: "#151A21",
  kioskEdge: "#39424D",
  steel: "#AEB6BE",
  interior: "#2A2620",
  tile: "rgba(241, 237, 226, 0.08)",
  meat: "#8A4B2A",
  meatHi: "#B8693A",
  meatLo: "#5C2E18",
  lavash: "#E8D2A2",
  lavashLo: "#C9AE78",
  apron: "#F2F5EE",
  apronShade: "#D9DDD4",
  skin: ["#E8B996", "#C98E6A", "#F2CDB0", "#A86F4E", "#DDA57F"],
  hair: ["#1B1512", "#4A3426", "#8C6A4A", "#2A2A2A", "#9A9A9A"],
  top: ["#3B4A63", "#5A4B3A", "#4A5A44", "#6B3F46", "#575C66", "#2E3640", "#7A6A55", "#3F5A5A"],
  pants: ["#2C3A52", "#25282E", "#3A3F47", "#4A4136"],
  shoe: "#0E1014",
  lampLight: "rgba(241, 237, 226, 0.10)",
  // editor
  editor: "#080B0F",
  editorBar: "#0D1116",
  codeNum: "#F2B98A",
} as const;
