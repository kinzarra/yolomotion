// The scenario as data. Voice only (the author's clone), no music, no SFX.
// Beat lengths fit the measured clips at VO_RATE; the one silent beat is the
// author's drama pause: «НИ У КОГО» alone on screen, then «Кроме Yoloco».
import { buildScenes, defineVoiceover, scenesDuration, VoLine } from "../../reel";
import { DURATIONS } from "./durations";

// 1.12: a promo read, tight; still natural on the clone.
export const VO_RATE = 1.12;

export const SCENES = buildScenes({
  hook: 7.5, // question over the ad wall → grid of ad videos, platform stickers fly out
  pain: 5.5, // generated girl doubting → hand scrolls a feed, ad or not
  reveal: 3.5, // Y mark slam → «Конкуренты NEW» → the real form with 3 brands
  scan: 10, // AI · 1 МЛРД+ posts · networks · internet → the real «Посты» list scrolled, ads caught
  ultra: 6, // AI tells an ad from a post: classifier gate → 99% of ads found, fine print
  speed: 2.5, // 15 МИНУТ, posts stream into the build card
  volume: 4.5, // integrations card with posts → creators card, creator strip
  budget: 3.5, // «СКОЛЬКО ПОТРАТИЛИ?» 72 млн ₽
  sov: 3, // share of voice, VOIS leads, its posts around
  mech: 5, // promo code / ref link / discount on real posts → all mechanics card
  camp: 4, // campaigns fan → best offers → top creators
  erid: 2.5, // ERID 1,8% red
  nobody: 3, // «Такого разбора на рынке нет» over the report mosaic
  silence: 1.5, // «Ни у кого.» said plainly, each word slams on the voice
  except: 1.5, // «КРОМЕ» + Yoloco slam
  cta: 7, // yoloco.io, section, СКОЛЬКО · КАК · У КОГО, QR
});

export const DURATION = scenesDuration(SCENES);

export type { VoLine };

const L = 0.15; // the picture lands first, then the voice

// "~PAGE" hides a page (a headline carries those words), "+WORD" paints it
// violet once spoken, "!WORD" red.
export const VOICEOVER = defineVoiceover(DURATIONS, [
  {
    file: "01-hook",
    start: SCENES.hook.from + 0.1,
    pages: ["~А ты знаешь, у каких блогеров", "~рекламируется твой конкурент?", "~И как вообще найти", "~рекламные интеграции", "~в соцсетях?"],
  },
  {
    file: "02-pain",
    start: SCENES.pain.from + L,
    pages: ["Обычно это", "!неделя вручную:", "листаешь ленты,", "ловишь промокоды,", "бюджет !на глаз."],
  },
  {
    file: "03-reveal",
    start: SCENES.reveal.from + L,
    pages: ["В +Yoloco появились", "+Конкуренты.", "Пишешь бренды,", "и всё."],
  },
  {
    file: "04-scan",
    start: SCENES.scan.from + L,
    pages: [
      "+AI ищет",
      "в нашей базе.",
      "У нас +один",
      "+миллиард постов!",
      "И по всему",
      "+интернету.",
      "Находит рекламу",
      "по +промокодам",
      "и +ссылкам,",
      "даже без",
      "отметки бренда.",
    ],
  },
  {
    file: "04b-ultra",
    start: SCENES.ultra.from + L,
    pages: ["+AI отличает рекламу", "от обычного поста.", "По нашим тестам", "находит +99% рекламы."],
  },
  { file: "05-speed", start: SCENES.speed.from + 0.1, pages: ["+15 минут,", "и отчёт готов."] },
  {
    file: "06-volume",
    start: SCENES.volume.from + L,
    pages: ["Находим +рекламные +интеграции", "и +блогеров,", "которые рекламировали", "конкурента."],
  },
  {
    file: "07-budget",
    start: SCENES.budget.from + L,
    pages: ["~Сколько потратили", "~на блогеров?"],
  },
  {
    file: "08-sov",
    start: SCENES.sov.from + L,
    pages: ["Можем оценить,", "~кто забирает рынок."],
  },
  {
    file: "09-mech",
    start: SCENES.mech.from + L,
    pages: ["~И как они продают:", "+промокоды,", "+реферальные ссылки,", "+скидки.", "Все механики."],
  },
  {
    file: "10-camp",
    start: SCENES.camp.from + L,
    pages: ["Ищем все +кампании,", "лучшие +офферы", "и +топ-блогеров."],
  },
  {
    file: "11-erid",
    start: SCENES.erid.from + L,
    pages: ["И даже покажем", "+ERID и маркировку."],
  },
  {
    file: "12-nobody",
    start: SCENES.nobody.from + L,
    pages: ["~Такого разбора рекламы", "~конкурентов на рынке нет."],
  },
  { file: "13-silence", start: SCENES.silence.from + 0.1, pages: ["~Ни у кого."] },
  { file: "14-except", start: SCENES.except.from + 0.08, pages: ["~Кроме Yoloco."] },
  {
    file: "15-cta",
    start: SCENES.cta.from + L,
    pages: ["Открой +Yoloco,", "раздел +Конкуренты,", "~и узнай: сколько, как", "~и у кого рекламируется", "~твой конкурент."],
  },
]);
