// The scenario as data. Voice only; every cut is paced off the measured clips.
// Scene starts derive from the lengths below; clip lengths come from durations.ts.
import { buildScenes, defineVoiceover, scenesDuration, VoLine } from "../../reel";
import { DURATIONS } from "./durations";

export const VO_RATE = 1.08;
/** A line starts this much after its scene: the visual lands first. */
export const LEAD = 0.15;

// hook 5.53 s / 1.08 = 5.12 + lead → 5.4; total 7.66 / 1.08 = 7.10 + lead, then «лайк и подписка» 1.72 / 1.08 → 9.6
export const SCENES = buildScenes({
  hook: 5.4, // the receipt prints, the total jumps, the face reacts, «ЗА ЧТО?»
  hotwater: 3.8, // +18,9% → +3 786 ₽ в год
  heating: 3.8, // +10,5% → +4 130 ₽
  power: 3.3, // +11,3% → +3 240 ₽
  water: 3.8, // +10,3% / +14,8% → +2 339 ₽
  total: 9.6, // +13 881 ₽ = 4 рабочих дня = 3,5 бака
});

export const DURATION = scenesDuration(SCENES);

export type { VoLine };

/** Seconds into the total scene when «Поставь лайк и подпишись» starts. */
export const CTA_AT = LEAD + DURATIONS["06-total"] / VO_RATE + 0.3;

export const VOICEOVER = defineVoiceover(DURATIONS, [
  { file: "01-hook", start: SCENES.hook.from + LEAD },
  { file: "02-hot-water", start: SCENES.hotwater.from + LEAD },
  { file: "03-heating", start: SCENES.heating.from + LEAD },
  { file: "04-power", start: SCENES.power.from + LEAD },
  { file: "05-water", start: SCENES.water.from + LEAD },
  { file: "06-total", start: SCENES.total.from + LEAD },
  { file: "07-cta", start: SCENES.total.from + CTA_AT },
]);

/** Measured word boundaries inside a clip (ffmpeg silencedetect), in clip seconds at 1.0×. */
// hook.face is where the old face clip (lip-synced to «…рублей. Ого, реально? За что?») must start so its
// «Ого» (1.313 s into the clip) lands on the new line's «Ого» at 3.44 s: 3.44 − 1.313 = 2.127.
export const CUES = {
  hook: { number: 2.22, face: 2.127, ogo: 3.44, why: 4.72 },
  total: { days: 3.06, fuel: 5.23, end: 7.41 },
} as const;
