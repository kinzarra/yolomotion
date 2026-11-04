// The cash layout shared by the hook and the years: seven $1 notes in a tidy
// cascade (each shows its top band, so they can be counted), coins below.
export const BILL_W = 600;
export const SLOT0 = { x: 240, y: 560 };
export const STEP = 62;
export const SLOTS = Array.from({ length: 7 }, (_, i) => ({
  x: SLOT0.x + (i % 2 === 0 ? -12 : 12),
  y: SLOT0.y + i * STEP,
  rot: i % 2 === 0 ? -2.5 : 1.8,
}));
