// Placeholder until `npm run heygen -- scripts/presenter/phone-slowdown.json --generate`
// overwrites this file with the measured shots. enabled:false → the scene shows
// its graphic fallback instead of the face.
export const PRESENTER = {
  "face": { clip: "01-face", style: "wide", reelIn: 0, duration: 5.75, file: "face.mp4", enabled: false },
  "prove": { clip: "05-prove", style: "wide", reelIn: 0, duration: 4.65, file: "prove.mp4", enabled: false },
  "ate": { clip: "13-ate", style: "wide", reelIn: 0, duration: 1.25, file: "ate.mp4", enabled: false },
  "turn": { clip: "22-turn", style: "wide", reelIn: 0, duration: 3.85, file: "turn.mp4", enabled: false },
  "final": { clip: "42-final", style: "wide", reelIn: 0, duration: 4.35, file: "final.mp4", enabled: false },
} as const;
