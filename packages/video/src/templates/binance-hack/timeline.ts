// Six chapters of one case file, cut on the voice lines. Inner moments sit
// on word times measured by Whisper (raw clip seconds / VO_RATE + line start).
import { buildScenes, defineVoiceover, scenesDuration } from "../../reel";
import { DURATIONS } from "./durations";

export const VO_RATE = 1.1;

export const SCENES = buildScenes({
  main: 30.5,
});

export const DURATION = scenesDuration(SCENES);

/** Voice line starts, reel seconds. */
export const LINE = {
  hook: 0.0, // Твоя крипта на бирже? (first 1.62 s of the original take: the HeyGen face is synced to it)
  hook2: 1.6, // Вчера с Бинанс украли больше 6 миллиардов долларов. И всё началось с одного ноутбука.
  laptop: 7.05, // Шифр никто не ломал. Взломали ноутбук одного инженера.
  order: 10.45, // Через него хакеры отдали приказ, и биржа сама перевела им деньги.
  wave: 14.8, // Почему волна? Бьют не по коду, а по людям: фейковая вакансия и тестовое задание с вирусом.
  frozen: 20.55, // 2,7 миллиарда успели заморозить. Биткоин заморозить нельзя.
  cta: 24.5, // Биржа обещает вернуть всё. А ты держишь крупное на бирже? Пиши в комментариях.
} as const;

/** Inner moments, from Whisper word times (raw / VO_RATE + line start). */
export const CUT = {
  faceEnd: 1.47, // the hook face stops before the old take's «Смотри»
  money: 3.09, // «6 миллиардов»
  teaser: 4.73, // «И всё началось с одного ноутбука»
  hack: 8.36, // «Взломали ноутбук»
  order: 11.07, // «хакеры отдали приказ»
  drain: 12.72, // «биржа сама перевела»
  people: 15.76, // «Бьют не по коду, а по людям»
  vacancy: 17.24, // «Фейковая вакансия»
  virus: 18.75, // «тестовое задание с вирусом»
  btc: 22.71, // «Биткоин заморозить нельзя»
  ask: 26.09, // «А ты держишь крупное на бирже?» (face)
  comment: 27.59, // «Пиши в комментариях»
  tap: 28.5, // subscribe press
} as const;

export const STOLEN = 6_300_000_000; // Binance figure, spoken «6,3 миллиарда» (TRM: 6,36)
export const FROZEN = 2_700_000_000; // TRM Labs, issuers' freezes
/** Wall clock of the theft, UTC seconds since midnight: 20:05 → 20:25. */
export const CLOCK0 = 20 * 3600 + 5 * 60;
export const CLOCK1 = 20 * 3600 + 25 * 60;

export const VOICEOVER = defineVoiceover(DURATIONS, [
  { file: "01-hook", start: LINE.hook },
  { file: "01b-hook", start: LINE.hook2 },
  { file: "02-laptop", start: LINE.laptop },
  { file: "03-order", start: LINE.order },
  { file: "04-wave", start: LINE.wave },
  { file: "05-frozen", start: LINE.frozen },
  { file: "06-cta", start: LINE.cta },
]);
