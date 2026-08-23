// Geometry the hook and the finale share so the reel loops: the «КУПИТЬ»
// button sits here at frame 0 of the hook and returns here on the last frame
// of the CTA, with the cursor hovering above it in both.
export const BUY = { left: 220, top: 1020, width: 640, height: 176 } as const;
// Off to the right of the word, so the arrow never sits on the "Ь".
export const CURSOR = { x: BUY.left + 480, y: BUY.top + 62 } as const;

// The chart column every rate scene draws in, so the line never jumps
// horizontally between beats.
export const CHART = { left: 90, width: 900 } as const;

/**
 * "82,90 ₽" → "82,90", "85 ₽" → "85,00" — an exchange board prints digits
 * without units and always to two places, so the two columns stay aligned.
 */
export const digits = (s: string) => {
  const raw = s.replace(/[^\d,.]/g, "");
  if (!raw) return s;
  return /[,.]/.test(raw) ? raw : `${raw},00`;
};
