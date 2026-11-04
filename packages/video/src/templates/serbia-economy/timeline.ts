import { buildScenes, defineVoiceover, scenesDuration } from "../../reel";
import { DURATIONS } from "./durations";

export const VO_RATE = 1.1;
const v = (k: keyof typeof DURATIONS) => DURATIONS[k] / VO_RATE;
const snap = (s: number) => Math.ceil(s * 20) / 20;

// Lengths follow the measured lines: a fact is its line + 0.3 s, never under
// 3.4 s; the final holds 0.8 s past the last line for the end card. 30 s by PLAYBOOK §16; ~33.5 s after the author's notes 4 and 6 (2026-10-26).
export const SCENES = buildScenes({
  hook: snap(v("01-hook") + 0.2),
  vucic: snap(Math.max(3.4, v("02-vucic") + 0.3)),
  un: snap(Math.max(3.4, v("03-un") + 0.3)),
  fsb: snap(Math.max(3.4, v("04-fsb") + 0.3)),
  russians: snap(Math.max(3.4, v("05-russians") + 0.3)),
  nis: snap(Math.max(3.4, v("06-nis") + 0.3)),
  final: snap(v("07-final") + 0.8),
});

const at = (k: keyof typeof SCENES, lead = 0.1) => SCENES[k].from + lead;

export const VOICEOVER = defineVoiceover(DURATIONS, [
  // the face is lip-synced from 0 of the clip, so the hook line starts on frame 0
  { file: "01-hook", start: 0, pages: ["Друг России", "продал снаряды", "на +800 +миллионов +евро.", "Доехали они", "до !Украины."] },
  { file: "02-vucic", start: at("vucic"), pages: ["Это +Сербия.", "Партия Вучича", "правила +14 +лет", "и только что", "!проиграла."] },
  { file: "03-un", start: at("un"), pages: ["В ООН Сербия", "голосовала", "!против России.", "Вучич извинился:", "+устал."] },
  { file: "04-fsb", start: at("fsb"), pages: ["А проверять", "собственную полицию", "позвали !ФСБ."] },
  { file: "05-russians", start: at("russians"), pages: ["Россиян там", "в +12 +раз больше,", "чем до войны:", "+62 +тысячи."] },
  { file: "06-nis", start: at("nis"), pages: ["Одна дочка", "Газпром нефти", "давала +11%", "бюджета Сербии."] },
  { file: "07-final", start: at("final"), pages: ["В итоге", "победили +студенты.", "~Санкции против России?", "~Письменно:", "~нет.", "~Пока санкций против России никто не планирует."] },
]);

export const DURATION = scenesDuration(SCENES);
