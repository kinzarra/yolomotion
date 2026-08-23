// Fonts load once at module scope; every component references them via theme.fonts.
import { loadFont as loadSpaceGrotesk } from "@remotion/google-fonts/SpaceGrotesk";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadJetBrainsMono } from "@remotion/google-fonts/JetBrainsMono";
import { loadFont as loadUnbounded } from "@remotion/google-fonts/Unbounded";
import { loadFont as loadInstrumentSerif } from "@remotion/google-fonts/InstrumentSerif";

const display = loadSpaceGrotesk();
const body = loadInter();
const mono = loadJetBrainsMono();
// Wide display grotesk with full Cyrillic — Space Grotesk has none, so every
// Russian-language reel sets its heroes and captions in this face instead.
const wide = loadUnbounded("normal", {
  weights: ["500", "700", "800", "900"],
  subsets: ["cyrillic", "cyrillic-ext", "latin"],
});
// Editorial serif, italic only — the one contrasting word in a fashion-
// magazine headline (khaby-silence). Never for running text or captions.
const serif = loadInstrumentSerif("italic", {
  weights: ["400"],
  subsets: ["latin"],
});

export const fonts = {
  display: display.fontFamily,
  body: body.fontFamily,
  mono: mono.fontFamily,
  wide: wide.fontFamily,
  serif: serif.fontFamily,
} as const;
