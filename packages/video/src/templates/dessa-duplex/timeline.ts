// The scenario as data. Voice only; every cut is paced off the measured clips.
// Scene starts derive from the lengths below; clip lengths come from durations.ts.
import { buildScenes, defineVoiceover, scenesDuration, VoLine } from "../../reel";
import { DURATIONS } from "./durations";

export const VO_RATE = 1.06;
/** A line starts this much after its scene: the visual lands first. */
export const LEAD = 0.15;

// clip / 1.06 + lead: hook 3.50 (starts at 0.0), no-text 3.08, no-pause 5.36, feels 4.22, hardware 3.92,
// cta: «Пока это дэмо» 1.18 + «Подпишись…» 1.75 (cut from the take the HeyGen face was synced to) + question hold
export const SCENES = buildScenes({
  hook: 4.0, // тёща cuts you off, dissolves into the author's face: «Только по делу»
  noText: 3.5, // ЗВУК › ТЕКСТ › ИИ › ГОЛОС, ТЕКСТ knocked out, «0 БУКВ» around Dorsey, live speech clip
  noPause: 6.0, // waiting on the phone, red 2,0 с collapses to lime 0
  feels: 4.5, // сарказм, вздох, смешок on the live wave; Dessa cuts in
  hardware: 4.5, // 1 СТОЙКА GB200 → 1 НОУТБУК MacBook
  cta: 5.5, // «Пока это дэмо», face: «Подпишись…», question holds, loops back into the тёща
});

export const DURATION = scenesDuration(SCENES);

export type { VoLine };

/** «Подпишись…» starts here inside the cta scene; the HeyGen cta shot starts with it. */
export const SUB_AT = LEAD + DURATIONS["06a-demo"] / VO_RATE + 0.1;

export const VOICEOVER = defineVoiceover(DURATIONS, [
  { file: "01-hook", start: 0 },
  { file: "02-no-text", start: SCENES.noText.from + LEAD },
  { file: "03-no-pause", start: SCENES.noPause.from + LEAD },
  { file: "04-feels", start: SCENES.feels.from + LEAD },
  { file: "05-hardware", start: SCENES.hardware.from + LEAD },
  { file: "06a-demo", start: SCENES.cta.from + LEAD },
  { file: "06b-subscribe", start: SCENES.cta.from + SUB_AT },
]);

/** Seconds inside each scene (reel time = clip time / VO_RATE + line start). Clip times from silencedetect. */
const at = (clip: number, lead = LEAD) => clip / VO_RATE + lead;
export const CUES = {
  hook: { cut: 0.45, morph: 1.25, face: at(2.2, 0), deloo: at(2.7, 0) },
  noText: { knock: at(1.6), zero: at(1.74) },
  noPause: { wait: at(0.2), two: at(2.49), now: at(4.01) },
  feels: { sarcasm: at(0.7), sigh: at(1.87), laugh: at(2.2), cut: at(2.77) },
  hardware: { mac: at(2.2) },
  cta: { face: SUB_AT, loop: 4.85 },
} as const;
