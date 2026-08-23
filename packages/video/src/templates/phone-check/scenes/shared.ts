// Geometry the hook and the finale share so the reel loops: the phone sits
// here at frame 0 of the hook and returns here on the last frame of the CTA.
export const PHONE = { left: 320, top: 420, width: 440, height: 860 } as const;
// Centre of the ПЕРЕВЕСТИ button inside that phone, in frame coordinates.
export const BUTTON = { x: PHONE.left + 220, y: PHONE.top + 762 } as const;
