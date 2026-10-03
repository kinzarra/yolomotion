// The look book. A look is a whole visual system for a voiceover reel —
// palette, faces, how a headline's accent word is set, the container a clip
// or photo sits in, the cut effect, the caption style and the finishing
// stack — chosen per render by ONE prop (`look`). The scenes are written once
// against the kit in ./kit.tsx; the look decides how they print.
//
// Each look keeps the house rules: one hero colour that marks at most one
// thing per frame, a second colour only where the look's medium has one
// (riso's second drum, tabloid's alarm red), and every colour named here so
// no component inlines a hex.
import { Palette, theme } from "../theme";
import { CaptionStyle } from "../reel";
import { lookFonts } from "./fonts";

export const LOOK_IDS = ["riso", "chrome", "swiss", "aurora", "tabloid", "gloss"] as const;
export type LookId = (typeof LOOK_IDS)[number];

export type Look = {
  id: LookId;
  name: string; // shown in the lab, Russian — the author's catalogue
  mood: string;
  palette: Palette;
  c: {
    ink: string; // type on the look's surface
    surface: string; // card / container fill
    line: string;
    lineStrong: string;
    second: string; // the medium's second colour (never a second hero)
    scrim: string; // under type that sits on footage
    shadow: string;
    flash: string; // the cut's peak
    onHero: string; // type set on a hero-colour fill (CTA, boxed accent)
    stops: readonly string[]; // gradient type (chrome, aurora); others unused
  };
  type: {
    display: string;
    weight: number;
    upper: boolean;
    tracking: string;
    leading: number;
    // Average advance of one capital/lower letter, in em, measured off the
    // stills. Headlines fit their longest word to the column with it, so a
    // server job's arbitrary text never runs off the frame.
    em: number;
    accentFamily: string;
    accentStyle: "normal" | "italic";
    accentWeight: number;
    label: string; // eyebrows, figure captions
    labelWeight: number;
  };
  accent: "overprint" | "chrome" | "signal" | "gradient" | "boxed" | "serif";
  entrance: "stamp" | "blur" | "mask" | "float" | "slam" | "rise";
  backdrop: "paper" | "void" | "grid" | "aurora" | "news" | "noir";
  frame: "print" | "screen" | "plate" | "glass" | "clipping" | "gallery";
  media: string; // CSS filter applied to every photo and clip
  tint: { color: string; blend: "multiply" | "screen" | "soft-light" | "color"; opacity: number };
  cut: "inkbars" | "flash" | "panel" | "bloom" | "slam" | "dip";
  finish: { grade: number; grain: number; vignette: number; halftone: number; scanlines: number };
  captions: CaptionStyle;
};

// ── РИЗО — two-drum risograph on cream stock ────────────────────────────────
const riso: Look = {
  id: "riso",
  name: "РИЗО",
  mood: "двухцветная печать на кремовой бумаге, полутон, сбитая приводка",
  palette: {
    bg: "#F2ECDF",
    bgAlt: "#E8DFCC",
    primary: "#FF3E9A", // fluo pink drum — THE hero
    accent: "#2D50E6", // medium blue drum
    text: "#1B1A33",
    textDim: "#8A8270",
    glow: "rgba(255, 62, 154, 0.32)",
  },
  c: {
    ink: "#1B1A33",
    surface: "#FBF7EE",
    line: "rgba(27, 26, 51, 0.16)",
    lineStrong: "rgba(27, 26, 51, 0.5)",
    second: "#2D50E6",
    scrim: "rgba(242, 236, 223, 0.0)",
    shadow: "0 26px 40px -26px rgba(27, 26, 51, 0.45)",
    flash: "#FF3E9A",
    onHero: "#FBF7EE",
    stops: [],
  },
  type: {
    display: lookFonts.dela,
    weight: 400,
    upper: true,
    tracking: "-0.01em",
    leading: 1.02,
    em: 0.84,
    accentFamily: lookFonts.dela,
    accentStyle: "normal",
    accentWeight: 400,
    label: lookFonts.interTight,
    labelWeight: 800,
  },
  accent: "overprint",
  entrance: "stamp",
  backdrop: "paper",
  frame: "print",
  media: "grayscale(1) contrast(1.35) brightness(1.08)",
  tint: { color: "#2D50E6", blend: "screen", opacity: 0.9 },
  cut: "inkbars",
  finish: { grade: 0, grain: 0.1, vignette: 0.08, halftone: 0.1, scanlines: 0 },
  captions: {
    mode: "box",
    fontFamily: lookFonts.interTight,
    fontWeight: 800,
    fontSize: 56,
    uppercase: true,
    letterSpacing: "-0.01em",
    textShadow: "none",
    activeInk: "#FBF7EE",
  },
};

// ── ХРОМ — Y2K liquid chrome on black ───────────────────────────────────────
const chrome: Look = {
  id: "chrome",
  name: "ХРОМ",
  mood: "Y2K: жидкий хром, ледяной блик, сканлайны, вспышки",
  palette: {
    bg: "#04050A",
    bgAlt: "#0D1122",
    primary: "#7FE3FF", // ice — THE hero
    accent: "#B4A1FF", // lilac, only the glitch's second channel
    text: "#EEF3FA",
    textDim: "#6B7385",
    glow: "rgba(127, 227, 255, 0.5)",
  },
  c: {
    ink: "#EEF3FA",
    surface: "rgba(14, 18, 34, 0.86)",
    line: "rgba(200, 220, 255, 0.14)",
    lineStrong: "rgba(200, 220, 255, 0.4)",
    second: "#B4A1FF",
    scrim: "rgba(4, 5, 10, 0.7)",
    shadow: "0 40px 90px -30px rgba(127, 227, 255, 0.25)",
    flash: "#FFFFFF",
    onHero: "#04050A",
    stops: ["#FFFFFF", "#D5DEEA", "#8A96AA", "#2B3242", "#C9D6E6", "#FFFFFF", "#7E8A9E"],
  },
  type: {
    display: lookFonts.tektur,
    weight: 800,
    upper: true,
    tracking: "-0.01em",
    leading: 0.98,
    em: 0.68,
    accentFamily: lookFonts.tektur,
    accentStyle: "normal",
    accentWeight: 800,
    label: lookFonts.tektur,
    labelWeight: 600,
  },
  accent: "chrome",
  entrance: "blur",
  backdrop: "void",
  frame: "screen",
  media: "saturate(0.55) contrast(1.2) brightness(0.92)",
  tint: { color: "#7FE3FF", blend: "soft-light", opacity: 0.45 },
  cut: "flash",
  finish: { grade: 0.08, grain: 0.06, vignette: 0.35, halftone: 0, scanlines: 0.07 },
  captions: {
    mode: "color",
    fontFamily: lookFonts.tektur,
    fontWeight: 800,
    fontSize: 54,
    uppercase: true,
    letterSpacing: "0em",
    textShadow: "0 0 24px rgba(127, 227, 255, 0.35), 0 4px 22px rgba(0, 0, 0, 0.9)",
  },
};

// ── ШВЕЙЦАРИЯ — international typographic style ─────────────────────────────
const swiss: Look = {
  id: "swiss",
  name: "ШВЕЙЦАРИЯ",
  mood: "сетка, гротеск, левый край, один оранжевый сигнал",
  palette: {
    bg: "#EEECE7",
    bgAlt: "#E2DFD8",
    primary: "#FF3D00", // international orange — THE hero
    accent: "#0D0D0D",
    text: "#0D0D0D",
    textDim: "#9A978F",
    glow: "rgba(255, 61, 0, 0.3)",
  },
  c: {
    ink: "#0D0D0D",
    surface: "#F7F6F2",
    line: "rgba(13, 13, 13, 0.1)",
    lineStrong: "rgba(13, 13, 13, 0.85)",
    second: "#0D0D0D",
    scrim: "rgba(238, 236, 231, 0)",
    shadow: "none",
    flash: "#FF3D00",
    onHero: "#0D0D0D",
    stops: [],
  },
  type: {
    display: lookFonts.interTight,
    weight: 800,
    upper: false,
    tracking: "-0.055em",
    leading: 0.92,
    em: 0.58,
    accentFamily: lookFonts.interTight,
    accentStyle: "normal",
    accentWeight: 800,
    label: lookFonts.interTight,
    labelWeight: 500,
  },
  accent: "signal",
  entrance: "mask",
  backdrop: "grid",
  frame: "plate",
  media: "grayscale(1) contrast(1.12)",
  tint: { color: "#EEECE7", blend: "multiply", opacity: 0 },
  cut: "panel",
  finish: { grade: 0, grain: 0.05, vignette: 0, halftone: 0, scanlines: 0 },
  captions: {
    mode: "underline",
    fontFamily: lookFonts.interTight,
    fontWeight: 800,
    fontSize: 58,
    align: "left",
    letterSpacing: "-0.035em",
    textShadow: "none",
    sideMargin: 72,
    maxWidth: 936,
  },
};

// ── АВРОРА — frosted glass over a drifting pastel aurora ────────────────────
const aurora: Look = {
  id: "aurora",
  name: "АВРОРА",
  mood: "мягкое стекло, пастельное северное сияние, скругления",
  palette: {
    bg: "#090B1A",
    bgAlt: "#151842",
    primary: "#FFB58A", // peach — THE hero
    accent: "#8C7BFF", // violet, the aurora's body
    text: "#F5F3FF",
    textDim: "#8E8CB0",
    glow: "rgba(255, 181, 138, 0.4)",
  },
  c: {
    ink: "#F5F3FF",
    surface: "rgba(255, 255, 255, 0.08)",
    line: "rgba(255, 255, 255, 0.16)",
    lineStrong: "rgba(255, 255, 255, 0.4)",
    second: "#6FF2D2", // mint, the aurora's third light — never on type
    scrim: "rgba(9, 11, 26, 0.55)",
    shadow: "0 40px 80px -40px rgba(0, 0, 0, 0.8)",
    flash: "#FFF4EC",
    onHero: "#090B1A",
    stops: ["#FFB58A", "#FF8FB1", "#8C7BFF"],
  },
  type: {
    display: lookFonts.geologica,
    weight: 800,
    upper: false,
    tracking: "-0.04em",
    leading: 1.0,
    em: 0.62,
    accentFamily: lookFonts.geologica,
    accentStyle: "normal",
    accentWeight: 800,
    label: lookFonts.geologica,
    labelWeight: 500,
  },
  accent: "gradient",
  entrance: "float",
  backdrop: "aurora",
  frame: "glass",
  media: "saturate(0.8) contrast(1.05) brightness(0.95)",
  tint: { color: "#8C7BFF", blend: "soft-light", opacity: 0.4 },
  cut: "bloom",
  finish: { grade: 0.06, grain: 0.06, vignette: 0.2, halftone: 0, scanlines: 0 },
  captions: {
    mode: "pill",
    fontFamily: lookFonts.geologica,
    fontWeight: 800,
    fontSize: 52,
    letterSpacing: "-0.03em",
    textShadow: "none",
    plate: "rgba(20, 22, 52, 0.42)",
    plateBlur: 18,
    activeInk: "#090B1A",
    boxColor: "#F5F3FF",
  },
};

// ── ТАБЛОИД — newsprint front page: yellow, black, alarm red ────────────────
const tabloid: Look = {
  id: "tabloid",
  name: "ТАБЛОИД",
  mood: "первая полоса: жёлтый, чёрный, красный штамп, грубый полутон",
  palette: {
    bg: "#0F0F0F",
    bgAlt: "#1C1B18",
    primary: "#FFE500", // press yellow — THE hero
    accent: "#FF2D2D", // alarm red — stamps and «нет» only
    text: "#FFFFFF",
    textDim: "#9A9A9A",
    glow: "rgba(255, 229, 0, 0.35)",
  },
  c: {
    ink: "#0F0F0F",
    surface: "#ECE6D5", // newsprint
    line: "rgba(255, 255, 255, 0.14)",
    lineStrong: "rgba(255, 255, 255, 0.5)",
    second: "#FF2D2D",
    scrim: "rgba(15, 15, 15, 0.6)",
    shadow: "0 24px 50px -20px rgba(0, 0, 0, 0.9)",
    flash: "#FFFFFF",
    onHero: "#0F0F0F",
    stops: [],
  },
  type: {
    display: lookFonts.oswald,
    weight: 700,
    upper: true,
    tracking: "-0.01em",
    leading: 1.02,
    em: 0.52,
    accentFamily: lookFonts.oswald,
    accentStyle: "normal",
    accentWeight: 700,
    label: lookFonts.oswald,
    labelWeight: 600,
  },
  accent: "boxed",
  entrance: "slam",
  backdrop: "news",
  frame: "clipping",
  media: "grayscale(1) contrast(1.5) brightness(1.05)",
  tint: { color: "#ECE6D5", blend: "multiply", opacity: 0.55 },
  cut: "slam",
  finish: { grade: 0, grain: 0.08, vignette: 0.3, halftone: 0.14, scanlines: 0 },
  captions: {
    mode: "box",
    fontFamily: lookFonts.oswald,
    fontWeight: 700,
    fontSize: 68,
    uppercase: true,
    letterSpacing: "0em",
    textShadow: "none",
    stroke: "10px #0F0F0F",
    activeInk: "#0F0F0F",
    boxTilt: 2.5,
  },
};

// ── ГЛЯНЕЦ — fashion-magazine editorial, Cyrillic serif ────────────────────
const gloss: Look = {
  id: "gloss",
  name: "ГЛЯНЕЦ",
  mood: "журнальная обложка: крем, контрастная антиква, курсив, вишнёвый",
  palette: {
    bg: "#0D0B0A",
    bgAlt: "#1A1511",
    primary: "#E0263F", // cherry — THE hero
    accent: "#CDB892", // champagne, rules and folios only
    text: "#F2EBDD",
    textDim: "#7D7468",
    glow: "rgba(224, 38, 63, 0.3)",
  },
  c: {
    ink: "#F2EBDD",
    surface: "#F2EBDD",
    line: "rgba(242, 235, 221, 0.18)",
    lineStrong: "rgba(242, 235, 221, 0.6)",
    second: "#CDB892",
    scrim: "rgba(13, 11, 10, 0.55)",
    shadow: "0 50px 90px -40px rgba(0, 0, 0, 0.95)",
    flash: "#000000",
    onHero: "#F2EBDD",
    stops: [],
  },
  type: {
    display: lookFonts.playfair,
    weight: 800,
    upper: false,
    tracking: "-0.03em",
    leading: 0.98,
    em: 0.6,
    accentFamily: lookFonts.playfairItalic,
    accentStyle: "italic",
    accentWeight: 500,
    label: lookFonts.onest,
    labelWeight: 500,
  },
  accent: "serif",
  entrance: "rise",
  backdrop: "noir",
  frame: "gallery",
  media: "contrast(1.08) saturate(0.7) sepia(0.14) brightness(0.94)",
  tint: { color: "#E0263F", blend: "soft-light", opacity: 0.12 },
  cut: "dip",
  finish: { grade: 0.04, grain: 0.08, vignette: 0.45, halftone: 0, scanlines: 0 },
  captions: {
    mode: "color",
    fontFamily: lookFonts.onest,
    fontWeight: 700,
    fontSize: 52,
    letterSpacing: "-0.02em",
    activeColor: "#FFFFFF",
    heroFontFamily: lookFonts.playfairItalic,
    heroFontStyle: "italic",
    heroFontWeight: 500,
  },
};

export const LOOKS: Record<LookId, Look> = { riso, chrome, swiss, aurora, tabloid, gloss };

export const getLook = (id: LookId | undefined): Look => LOOKS[id ?? "riso"] ?? riso;

// Re-exported so look components take their curves from one place.
export const lookEase = theme.ease;
