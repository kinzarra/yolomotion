// The presenter shots (HeyGen «Podcast host in blue hoodie», avatar_iv, photo).
// Not bought yet: the author approves the cut first (2026-11-04), so the
// scenes show the avatar's preview still. After `npm run heygen -- scripts/
// presenter/intellect-mine.json --generate` writes presenter.ts, set ready to
// true and take the measured durations from it.
export const FACE = {
  ready: false,
  shots: {
    hook: { file: "hook.mp4", duration: 6.024 },
    promise: { file: "promise.mp4", duration: 4.32 },
    final: { file: "final.mp4", duration: 8.016 },
  },
} as const;
export const FACE_DIR = "presenter/intellect-mine/";
export const FACE_PREVIEW = "images/intellect-mine/face-preview.jpg";
