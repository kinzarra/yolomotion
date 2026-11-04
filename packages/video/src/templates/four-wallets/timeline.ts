// No voice: the clock is the age counter. 0,65 s per year of life, a 3 s
// hook in front and a 5 s answer behind.
import { buildScenes, scenesDuration } from "../../reel";

export const VO_RATE = 1;
export const HOOK = 3.0; // portraits + question, then the dots start
export const YEAR = 0.65; // seconds per year of life
export const AGE_FROM = 18;
export const AGE_TO = 65;
export const LIFE_END = HOOK + (AGE_TO - AGE_FROM) * YEAR; // 33,55 s
export const FINALE = 5.0;

export const SCENES = buildScenes({ main: Math.round((LIFE_END + FINALE) * 2) / 2 });
export const DURATION = scenesDuration(SCENES);
export const VOICEOVER = [] as const;

/** Second of the reel at which a hero reaches `age`. */
export const timeAt = (age: number) => HOOK + (age - AGE_FROM) * YEAR;
/** Age shown at second `t`. */
export const ageAt = (t: number) =>
  Math.min(AGE_TO, Math.max(AGE_FROM, AGE_FROM + (t - HOOK) / YEAR));
