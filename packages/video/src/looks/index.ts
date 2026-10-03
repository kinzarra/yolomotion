// Looks: whole visual systems a reel can be rendered in, picked per job by
// one `look` prop. See presets.ts for the catalogue and kit.tsx for the
// primitives scenes are written against.
import { z } from "zod";
import { LOOK_IDS } from "./presets";

export { LOOKS, LOOK_IDS, getLook } from "./presets";
export type { Look, LookId } from "./presets";
export { LookProvider, useLook } from "./context";
export { Backdrop, Finish } from "./layers";
export { BigNumber, Cta, Cuts, Evidence, Eyebrow, Headline, mediaSrc, useCutZoom } from "./kit";
export { LookReel } from "./LookReel";
export type { LookReelProps } from "./LookReel";

/** The schema field every look-aware template adds: `look: zLook.default("riso")`. */
export const zLook = z.enum(LOOK_IDS);
