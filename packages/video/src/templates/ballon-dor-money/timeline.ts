import { buildScenes, defineVoiceover, scenesDuration } from "../../reel";
import { DURATIONS } from "./durations";

export const VO_RATE = 1.1;
const v = (k: keyof typeof DURATIONS) => DURATIONS[k] / VO_RATE;
const snap = (s: number) => Math.ceil(s * 20) / 20;
const fact = (k: keyof typeof DURATIONS) => snap(Math.max(3.4, v(k) + 0.3));

// A fact is its line + 0.3 s, never under 3.4 s; the final holds 0.8 s past
// its line for the end card. ~37 s: the author asked for 30-40 (2026-10-27).
export const SCENES = buildScenes({
  hook: snap(v("01-hook") + 0.2),
  ticket: fact("02-ticket"),
  ronaldo: fact("03-ronaldo"),
  dembele: fact("04-dembele"),
  gala: fact("05-gala"),
  magazine: fact("06-magazine"),
  winner: fact("07-winner"),
  final: snap(v("08-final") + 0.8),
});

const at = (k: keyof typeof SCENES, lead = 0.1) => SCENES[k].from + lead;

/** Hook clip seconds (Whisper, 1.0×): «Победителю» 2.75, «Но» 4.98. The face is the slice 2.75–4.90. */
export const HOOK = { face: 2.75 / VO_RATE, after: 4.98 / VO_RATE } as const;

export const VOICEOVER = defineVoiceover(DURATIONS, [
  { file: "01-hook", start: 0, pages: ["~Золотой мяч", "~стоит 3 000 евро.", "Победителю", "не платят", "!ни !цента.", "Но вокруг него", "крутятся +миллионы."] },
  { file: "02-ticket", start: at("ticket"), pages: ["Билет", "на церемонию", "в Лондоне:", "+3 +000 +фунтов.", "Как сам мяч."] },
  { file: "03-ronaldo", start: at("ronaldo"), pages: ["Роналду продал", "свой мяч", "на аукционе", "за +600 +000 +евро."] },
  { file: "04-dembele", start: at("dembele"), pages: ["Дембеле", "после победы", "подорожал", "на +10 +миллионов."] },
  { file: "05-gala", start: at("gala"), pages: ["Организаторы", "за одну церемонию", "получают", "до +16 +миллионов +евро."] },
  { file: "06-magazine", start: at("magazine"), pages: ["Это +львиная +доля", "доходов журнала,", "который придумал", "премию."] },
  { file: "07-winner", start: at("winner"), pages: ["В этом году", "мяч у +Кейна,", "его цена:", "+60 +миллионов +евро."] },
  { file: "08-final", start: at("final"), pages: ["Игроку:", "!0 !евро.", "Организатору:", "+миллионы.", "~А ты бы сколько", "~отдал за этот мяч?"] },
]);

export const DURATION = scenesDuration(SCENES);
