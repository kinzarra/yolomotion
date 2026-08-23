// Output format presets. A template declares which formats it supports;
// the registry registers one Composition per (template × format).
export const FORMATS = {
  reel: { width: 1080, height: 1920 }, // Reels / Shorts / TikTok
  landscape: { width: 1920, height: 1080 }, // YouTube / web
  square: { width: 1080, height: 1080 }, // feed posts
} as const;

export type FormatId = keyof typeof FORMATS;

export const DEFAULT_FPS = 30;
