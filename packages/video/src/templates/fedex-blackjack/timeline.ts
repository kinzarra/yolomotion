// One running story, cut into five worlds. Every beat starts on its voice
// line; the worlds cut on the line that names them.
import { buildScenes, defineVoiceover, scenesDuration } from "../../reel";
import { DURATIONS } from "./durations";

export const VO_RATE = 1.1;

export const SCENES = buildScenes({
  main: 30,
});

export const DURATION = scenesDuration(SCENES);

/** Voice line starts, reel seconds. */
export const LINE = {
  hook: 0.0, // 1973 год. У твоей компании осталось 5 000 долларов.
  fuel: 3.8, // А в понедельник платить за топливо 24 000.
  no: 7.0, // Инвесторы отказали.
  vegas: 8.6, // Тогда основатель Федэкс берёт последние деньги и летит в Вегас.
  bj: 12.6, // Блэкджек.
  lose: 13.9, // Он проигрывает.
  win: 15.3, // Отыгрывается.
  prize: 16.8, // Выигрыш: 27 000 долларов.
  fly: 18.9, // В понедельник самолёты взлетели.
  now: 21.1, // В первую ночь Федэкс вёз 186 посылок. Сегодня 17 миллионов в день.
  cta: 26.5, // А ты бы поставил последние? Подписывайся.
} as const;

/** World cuts and inner moments. */
export const CUT = {
  cash: 8.5, // Fred grabs the last $5 000
  flight: 11.0, // «и летит в Вегас»
  vegas: 12.5,
  monday: 18.8,
  sky: 21.0,
  today: 24.0, // «Сегодня» inside line 10: the counter rolls to 17 млн
} as const;

/** Blackjack hands: when the cards land and what the bankroll becomes. */
export const HANDS = [
  { at: 13.0, cards: [["10", "spade"], ["9", "heart"]], bank: 10000 },
  { at: 13.9, cards: [["10", "club"], ["6", "diamond"]], bank: 3000 },
  { at: 15.3, cards: [["Q", "spade"], ["10", "heart"]], bank: 8000 },
  { at: 15.8, cards: [["9", "club"], ["A", "diamond"]], bank: 16000 },
  { at: 16.3, cards: [["J", "diamond"], ["10", "spade"]], bank: 22000 },
  { at: 16.8, cards: [["A", "spade"], ["K", "heart"]], bank: 32000 },
] as const;
export const BANK0 = 5000;
export const FUEL = 24000;

export const VOICEOVER = defineVoiceover(DURATIONS, [
  { file: "01-hook", start: LINE.hook },
  { file: "02-fuel", start: LINE.fuel },
  { file: "03-no", start: LINE.no },
  { file: "04-vegas", start: LINE.vegas },
  { file: "05-bj", start: LINE.bj },
  { file: "06-lose", start: LINE.lose },
  { file: "07-win", start: LINE.win },
  { file: "08-prize", start: LINE.prize },
  { file: "09-fly", start: LINE.fly },
  { file: "10-now", start: LINE.now },
  { file: "11-cta", start: LINE.cta },
]);
