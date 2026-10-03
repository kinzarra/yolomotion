// The timing model. Voiceover only. One set of beats for both cuts: each beat
// is as long as the LONGER of its two measured clips (EN, RU) plus the lead,
// so the scenes are identical and only the voice and the copy change.
import { buildScenes, defineVoiceover, pageTimes, scenesDuration, VoLine } from "../../reel";
import { DURATIONS as EN } from "./durations";
import { DURATIONS as RU } from "./durations-ru";
import { Lang } from "./copy";

// Per cut: the English read is eleven_v3 (accent-free, but ~25% slower than
// the multilingual_v2 Russian clone), so each language gets its own beat
// lengths, derived from its own measured clips. The scenes key everything to
// cues relative to their beat, so they stretch with it.
export const VO_RATE_BY: Record<Lang, number> = { en: 1.08, ru: 1.06 };
/** @deprecated single-rate alias kept for tooling; scenes use VO_RATE_BY. */
export const VO_RATE = VO_RATE_BY.ru;

// Line lead: the picture lands first, then the voice.
const LEAD = { hook: 0.2, prompt: 0.25, results: 0.25, pick: 0.25, more: 0.25, export: 0.25, cta: 0.3 } as const;

type Beat = "hook" | "prompt" | "results" | "pick" | "more" | "export" | "cta";
const FILE: Record<Beat, string> = {
  hook: "01-hook",
  prompt: "02-prompt",
  results: "03-results",
  pick: "04-pick",
  more: "05-more",
  export: "06-export",
  cta: "07-cta",
};
// Floors: the hook needs its three briefs + the clock, pick needs four
// decisions, the CTA holds the QR long enough to scan.
const FLOOR: Record<Beat, number> = { hook: 8, prompt: 9.5, results: 9.5, pick: 7, more: 6.5, export: 4.5, cta: 6 };
const TAIL = 0.3;

const lengthsFor = (lang: Lang): Record<Beat, number> => {
  const d: Record<string, number> = lang === "en" ? EN : RU;
  const out = {} as Record<Beat, number>;
  (Object.keys(FILE) as Beat[]).forEach((b) => {
    const need = (d[FILE[b]] ?? 0) / VO_RATE_BY[lang] + LEAD[b] + TAIL;
    out[b] = Math.max(FLOOR[b], Math.ceil(need * 2) / 2); // 0.5s grid
  });
  return out;
};

export const SCENES_BY: Record<Lang, ReturnType<typeof buildScenes<Beat>>> = {
  en: buildScenes(lengthsFor("en")),
  ru: buildScenes(lengthsFor("ru")),
};
/** RU timing (the reference cut). Language-aware code uses SCENES_BY. */
export const SCENES = SCENES_BY.ru;

export const DURATION_BY: Record<Lang, number> = { en: scenesDuration(SCENES_BY.en), ru: scenesDuration(SCENES_BY.ru) };
export const DURATION = DURATION_BY.ru;

const at = (lang: Lang, beat: keyof typeof LEAD) => SCENES_BY[lang][beat].from + LEAD[beat];

// Caption pages. Both languages carry the SAME page structure per line, so a
// scene can key a cue to "page 3 of the prompt line" and it lands on the right
// words in either cut. "~" hides a page the scene's own type is carrying; "+"
// paints a word the hero colour once spoken. The manifests spell some words
// for the voice («Йо-ло́-ко», «И-И», «Yolo-co», «A.I.»); the captions show
// them as written.
const PAGES: Record<Lang, Record<string, string[]>> = {
  en: {
    "01-hook": ["~WE'LL FIND ANY CREATORS,", "~IN THREE MINUTES.", "~TAXI DRIVERS IN NIGERIA.", "~MOMS IN AUSTRALIA.", "~FINANCE PROS IN NEW YORK.", "~START THE CLOCK!"],
    "02-prompt": ["THIS IS +YOLOCO +EXPLORER.", "DESCRIBE THE CREATORS YOU NEED,", "IN YOUR OWN WORDS.", "THE AI READS THE BRIEF", "AND BUILDS THE SHORTLIST FOR YOU."],
    "03-results": ["IT SCANS INSTAGRAM, TIKTOK,", "YOUTUBE AND TELEGRAM,", "AND SERVES THE CREATORS", "UP ON A PLATE.", "EACH ONE WITH A +SCORE,", "AND A +REASON WHY THEY FIT."],
    "04-pick": ["KEEP OR REJECT.", "ONE TAP.", "IT'S TINDER FOR MARKETERS:", "SWIPE LEFT, OR SWIPE RIGHT!"],
    "05-more": ["HIT +FIND +MORE.", "THE AI LEARNS FROM YOUR PICKS,", "AND EVERY ROUND GETS +SHARPER."],
    "06-export": ["EXPORT TO EXCEL,", "WITH +EMAILS ALREADY INSIDE.", "READY FOR OUTREACH."],
    "07-cta": ["~YOLOCO EXPLORER.", "ANY CREATOR, IN THREE MINUTES.", "LINK IN BIO."],
  },
  ru: {
    "01-hook": ["~МЫ НАЙДЁМ ЛЮБЫХ БЛОГЕРОВ", "~ЗА ТРИ МИНУТЫ.", "~ТАКСИСТЫ ИЗ НИГЕРИИ.", "~МАМОЧКИ ИЗ АВСТРАЛИИ.", "~ФИНАНСИСТЫ ИЗ НЬЮ-ЙОРКА.", "~ЗАСЕКАЙТЕ!"],
    "02-prompt": ["ЭТО +ЁЛОКО +ПОДБОР.", "ОПИШИТЕ СВОИМИ СЛОВАМИ,", "КАКИХ БЛОГЕРОВ ИЩЕТЕ.", "ИИ РАЗБЕРЁТ БРИФ", "И САМ СОБЕРЁТ ПОДБОРКУ БЛОГЕРОВ."],
    "03-results": ["ОН ПРОЧЁСЫВАЕТ ИНСТАГРАМ, ТИКТОК,", "ЮТУБ И ТЕЛЕГРАМ,", "И ПРИНОСИТ БЛОГЕРОВ", "К ВАМ НА БЛЮДЕЧКЕ.", "У КАЖДОГО +ОЦЕНКА", "И +ПРИЧИНА, ПОЧЕМУ ОН ПОДХОДИТ."],
    "04-pick": ["ОСТАВИТЬ ИЛИ ВЫЧЕРКНУТЬ.", "ОДНО КАСАНИЕ.", "ЭТО ТИНДЕР ДЛЯ МАРКЕТОЛОГА:", "СВАЙП ВЛЕВО ИЛИ ВПРАВО!"],
    "05-more": ["ЖМЁТЕ +«НАЙТИ +ЕЩЁ».", "ИИ УЧИТСЯ НА ВАШЕМ ВЫБОРЕ,", "И КАЖДЫЙ РАУНД +ТОЧНЕЕ."],
    "06-export": ["ВЫГРУЗКА В EXCEL,", "И +ПОЧТЫ УЖЕ ВНУТРИ.", "МОЖНО СРАЗУ ПИСАТЬ."],
    "07-cta": ["~ЁЛОКО ПОДБОР.", "ЛЮБЫЕ БЛОГЕРЫ ЗА ТРИ МИНУТЫ.", "ССЫЛКА В ПРОФИЛЕ."],
  },
};

const LINES: { file: string; beat: keyof typeof LEAD }[] = [
  { file: "01-hook", beat: "hook" },
  { file: "02-prompt", beat: "prompt" },
  { file: "03-results", beat: "results" },
  { file: "04-pick", beat: "pick" },
  { file: "05-more", beat: "more" },
  { file: "06-export", beat: "export" },
  { file: "07-cta", beat: "cta" },
];

const build = (lang: Lang): VoLine[] =>
  defineVoiceover(
    lang === "en" ? EN : RU,
    LINES.map(({ file, beat }) => ({ file, start: at(lang, beat), pages: PAGES[lang][file] })),
  );

export const VOICEOVER: Record<Lang, VoLine[]> = { en: build("en"), ru: build("ru") };

export const VO_DIR: Record<Lang, string> = { en: "yoloco-explorer", ru: "yoloco-explorer-ru" };

/**
 * Cue times, in seconds FROM THE START OF THE BEAT, for every caption page of
 * a beat's line: `cues(lang, "results")[4]` is when "each with a score" is
 * said in that cut. Scenes key their reveals to these so a picture lands on
 * its words in both languages.
 */
export const cues = (lang: Lang, beat: keyof typeof LEAD): number[] => {
  const line = VOICEOVER[lang][LINES.findIndex((l) => l.beat === beat)];
  return pageTimes(line, VO_RATE_BY[lang]).map((p) => p.start - SCENES_BY[lang][beat].from);
};

/** End of a beat's spoken line, from the beat start. */
export const lineEnd = (lang: Lang, beat: keyof typeof LEAD): number => {
  const line = VOICEOVER[lang][LINES.findIndex((l) => l.beat === beat)];
  const pages = pageTimes(line, VO_RATE_BY[lang]);
  return pages[pages.length - 1].end - SCENES_BY[lang][beat].from;
};

// The clock «Засекайте!» starts. It runs from the last word of the hook to the
// moment the export lands, and shows that span compressed to 2:47 — a real
// run measured ~2.5 min end to end (explorer/results, 2026-09-24), so the
// number on screen is honest about the product, not about the edit.
export const CLOCK = {
  shownSeconds: 167,
  stopAfterExport: 2.6, // seconds into the export beat
} as const;

export const clockSpan = (lang: Lang) => ({
  from: SCENES_BY[lang].hook.from + cues(lang, "hook")[5],
  to: SCENES_BY[lang].export.from + CLOCK.stopAfterExport,
});
