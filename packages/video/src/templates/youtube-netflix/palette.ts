import { Palette } from "../../theme";
import { ksColors } from "../khaby-silence/palette";

// The editorial page of khaby-silence — near-black, bone type, warm greys —
// with one substitution: the accent is the PLATFORM RED.
//
// Why one red and not two. YouTube's #FF0000 and Netflix's #E50914 sit four
// degrees apart on the wheel; side by side they read as a colour-management
// fault, not as a duel. So the reel spends exactly one red, both marks wear
// it, and the platforms are told apart by FORM alone — YouTube is a rounded
// play plate, Netflix is three vertical bars. That is also the story: the two
// of them want the same thing, in the same colour, from the same people.
//
// Everything else is bone. The money is bone, the creators are bone, every
// number is bone. Red marks only the two platforms and the damage they do to
// each other; at most one red element per frame, except in the versus frames
// where the two marks meeting IS the event.
export const ynPalette: Palette = {
  bg: ksColors.ink,
  bgAlt: "#111111",
  primary: "#E50914", // THE accent — the platform red, flat, never neon
  accent: "#B8B2A7", // warm grey, secondary data only
  text: "#D9D3C7", // caption body: a shade under bone so the active word reads
  textDim: "#6E6A63",
  glow: "rgba(229, 9, 20, 0.30)",
};

export const ynColors = {
  ...ksColors,
  // The red family. `soft` is a wash for fills, `line` for hairlines that must
  // read as red without spending the frame's single accent.
  red: "#E50914",
  redSoft: "rgba(229, 9, 20, 0.12)",
  redLine: "rgba(229, 9, 20, 0.5)",
  // Device screens: a screen is never the page colour, or the hairline drawing
  // of the device around it disappears.
  screen: "#0E0E0F",
  screenLift: "#17171A",
  // The hook's grade. khaby's `photo` is a documentary grade — flat, slightly
  // dark, right for an archival still. The hook is not an archival still: it
  // is a live broadcast plate, and at that size a murky grey panel reads as a
  // bad crop rather than as silver. Higher contrast, lifted, and the strip
  // lights survive as rim light.
  photoHot: "grayscale(1) contrast(1.3) brightness(1.12)",
} as const;

// The scaffold names the palette after the template; keep that export alive so
// the registry and the composition keep working.
export const youtubeNetflixPalette = ynPalette;
