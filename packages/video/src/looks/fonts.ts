// The looks' faces. Every one has Cyrillic — a look is chosen per render by
// a prop, so it cannot assume the reel is English. Only the weights a look
// actually sets are loaded: these load at module scope for every composition.
import { loadFont as loadDela } from "@remotion/google-fonts/DelaGothicOne";
import { loadFont as loadTektur } from "@remotion/google-fonts/Tektur";
import { loadFont as loadInterTight } from "@remotion/google-fonts/InterTight";
import { loadFont as loadGeologica } from "@remotion/google-fonts/Geologica";
import { loadFont as loadOswald } from "@remotion/google-fonts/Oswald";
import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadOnest } from "@remotion/google-fonts/Onest";

const subsets: ("cyrillic" | "latin")[] = ["cyrillic", "latin"];

export const lookFonts = {
  // riso — a fat poster grotesk that prints like a stamp
  dela: loadDela("normal", { weights: ["400"], subsets }).fontFamily,
  // chrome — squared tech display
  tektur: loadTektur("normal", { weights: ["600", "800"], subsets }).fontFamily,
  // swiss — tight neo-grotesk
  interTight: loadInterTight("normal", { weights: ["500", "800"], subsets }).fontFamily,
  // aurora — soft geometric
  geologica: loadGeologica("normal", { weights: ["500", "800"], subsets }).fontFamily,
  // tabloid — condensed headline
  oswald: loadOswald("normal", { weights: ["600", "700"], subsets }).fontFamily,
  // gloss — high-contrast serif; italic is the one contrasting word
  playfair: loadPlayfair("normal", { weights: ["800"], subsets }).fontFamily,
  playfairItalic: loadPlayfair("italic", { weights: ["500"], subsets }).fontFamily,
  // running text / captions in the editorial look
  onest: loadOnest("normal", { weights: ["500", "700"], subsets }).fontFamily,
} as const;
