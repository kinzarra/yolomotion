import { buildScenes, defineVoiceover, scenesDuration } from "../../reel";
import { DURATIONS } from "./durations";

export const VO_RATE = 1.12;
const v = (k: keyof typeof DURATIONS) => DURATIONS[k] / VO_RATE;
const snap = (s: number) => Math.ceil(s * 20) / 20;
const beat = (k: keyof typeof DURATIONS) => snap(v(k) + 0.35);

// A beat is its line + 0.35 s; the final holds 1.2 s past its line for the end card.
export const SCENES = buildScenes({
  hook: snap(v("01-hook") + 0.25),
  cards: beat("02-cards"),
  fails: beat("03-fails"),
  hand: beat("04-hand"),
  gameboy: beat("05-gameboy"),
  mario: beat("06-mario"),
  final: snap(v("07-final") + 1.2),
});

/** Every line starts 0.1 s after its cut, the hook at 0.0. */
export const LEAD = 0.1;
const at = (k: keyof typeof SCENES) => SCENES[k].from + LEAD;

export const VOICEOVER = defineVoiceover(DURATIONS, [
  { file: "01-hook", start: 0, pages: ["Ты знаешь Nintendo", "по Марио.", "А начиналась она", "с +игральных +карт,", "такси", "и !отелей !на !час."] },
  { file: "02-cards", start: at("cards"), pages: ["Всё началось", "ещё в +позапрошлом +веке,", "в Киото.", "Фусадзиро Ямаути", "рисует +карты", "+вручную."] },
  { file: "03-fails", start: at("fails"), pages: ["Через 70 лет", "карты !никому", "!не !нужны.", "Внук основателя", "пробует всё:", "такси,", "рис быстрого", "приготовления,", "отели на час.", "!Ничего !не !взлетает."] },
  { file: "04-hand", start: at("hand"), pages: ["И тут ремонтник", "с фабрики", "мастерит себе", "игрушку,", "+руку-хваталку.", "Её продают", "больше +миллиона", "+штук."] },
  { file: "05-gameboy", start: at("gameboy"), pages: ["Потом этот ремонтник", "придумает +Game +Boy."] },
  { file: "06-mario", start: at("mario"), pages: ["А главного героя", "назовут в честь", "хозяина склада", "в Америке.", "Его звали +Марио."] },
  { file: "07-final", start: at("final"), pages: ["Сегодня одну только", "Switch купили", "+156 +миллионов +раз.", "А всё началось", "с колоды +карт.", "~Какую компанию", "~разобрать следующей?", "~Пиши в комментариях."] },
]);

export const DURATION = scenesDuration(SCENES);
