// The three HeyGen inserts — what each one lip-syncs and how much of its clip
// is on screen. Mirrors scripts/presenter/replace-cost.json (`from`/`to` in
// seconds of the mp3 at 1.0×). Until the inserts are bought the film shows a
// placeholder card for exactly these seconds (`face: false`).
import { VO_RATE } from "./timeline";

export const FACE = {
  hook: { id: "p1-hook", clip: "01-hook", to: 3.02, says: "Тебя уже заменили. Просто тебе об этом ещё не сказали." },
  twist: { id: "p2-twist", clip: "09-twist-face", to: 6.5, says: "Потому что дешёвый бот, который бесит клиентов, в итоге стоит дороже человека." },
  cta: { id: "p3-cta", clip: "18-cta", to: 4.65, says: "Так сколько стоит заменить тебя? Напиши свою профессию в комментариях — посчитаю." },
} as const;

/** Seconds of the film the insert covers. */
export const faceSeconds = (k: keyof typeof FACE) => FACE[k].to / VO_RATE;
export const faceSrc = (k: keyof typeof FACE) => `presenter/replace-cost/${FACE[k].id}.mp4`;
