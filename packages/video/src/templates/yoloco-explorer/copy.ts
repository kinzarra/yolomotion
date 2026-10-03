// Everything the two cuts say on screen. The reels are the same film: one
// timeline, one set of scenes, and this table is the only thing that differs.
// Product strings are the app's own i18n values (yoloapp/frontend
// src/lib/i18n/translations/{en,ru}.ts, `explorer.*`), so the UI on screen
// reads exactly like the product.

export type Lang = "en" | "ru";

export type Platform = "instagram" | "tiktok" | "youtube" | "telegram";

export type DemoCreator = {
  handle: string;
  name: string;
  followers: string;
  score: number;
  reason: string;
  bio: string;
  platform: Platform;
  /** Pexels portrait in public/footage/yoloco-mcp/avatars, or a letter fallback as the app draws it. */
  photo?: string;
  letterColor?: string;
  gender: string;
  email?: string;
  round: number;
  isNew?: boolean;
};

type Copy = {
  // hook
  hookAny: [string, string];
  hookQueries: { who: string; where: string; flag: string }[];
  hookFound: string;
  hookStart: string;
  // app chrome
  appTitle: string;
  url: string;
  // /explorer/new
  eyebrow: string;
  newTitle: string;
  newSubtitle: string;
  step1: string;
  step1Hint: string;
  step2: string;
  step2Hint: string;
  briefLabel: string;
  brief: string;
  briefHint: string;
  next: string;
  analyzing: string;
  aiUnderstood: string;
  tags: { icon: string; label: string }[];
  limitTag: string;
  launch: string;
  launchCost: string;
  // progress
  progressTitle: string;
  progressRunning: string;
  usually: string;
  stages: string[];
  foundTitle: string;
  // report
  reportTitle: string;
  ready: string;
  rounds: (n: number) => string;
  bloggers: string;
  summary: (found: number, kept: number, rejected: number) => string;
  tabs: string[];
  keep: string;
  reject: string;
  more: string;
  newBadge: string;
  round: (n: number) => string;
  language: string;
  country: string;
  swipeHint: string;
  // refine
  findMore: string;
  refineTitle: string;
  refineSummary: (kept: number, rejected: number) => string;
  refineNoRepeat: (shown: number) => string;
  refineYes: string;
  roundHistory: string;
  plusBloggers: (n: number) => string;
  // export
  exportBtn: string;
  sheetName: string;
  cols: [string, string, string, string];
  // timer + CTA
  timerLabel: string;
  timerDone: string;
  ctaProduct: string;
  ctaLine: string;
  ctaScan: string;
  ctaUrl: string;
  creators: DemoCreator[];
  round2: DemoCreator[];
};

// Demo creators: invented handles over the Pexels portraits already licensed
// for yoloco-mcp (public/images/CREDITS.md). The one the demo strikes is the
// faceless back-view photo — never an identifiable face beside a rejection.
const people = {
  kate: { photo: "miamifitkate", platform: "instagram" as const },
  yoga: { photo: "orlandoyoga_j", platform: "youtube" as const },
  lift: { photo: "tampa_lift", platform: "tiktok" as const },
  coach: { photo: "coach_dre305", platform: "instagram" as const },
  run: { photo: "run_jax", platform: "youtube" as const },
  box: { photo: "flbeachbody", platform: "telegram" as const },
};

export const COPY: Record<Lang, Copy> = {
  en: {
    hookAny: ["ANY CREATORS", "IN 3 MINUTES"],
    hookQueries: [
      { who: "Taxi drivers", where: "Nigeria", flag: "🇳🇬" },
      { who: "Moms", where: "Australia", flag: "🇦🇺" },
      { who: "Finance pros", where: "New York", flag: "🇺🇸" },
    ],
    hookFound: "creators found",
    hookStart: "START THE CLOCK",
    appTitle: "Blogger Selections",
    url: "app.yoloco.io/explorer/new",
    eyebrow: "BLOGGER SELECTIONS",
    newTitle: "New blogger selection",
    newSubtitle: "Describe the task in your own words. AI will clarify the parameters, find bloggers and explain why they fit.",
    step1: "Who we are looking for",
    step1Hint: "Describe the bloggers in words",
    step2: "Refine",
    step2Hint: "Countries, language, size, networks",
    briefLabel: "Which bloggers are we looking for?",
    brief: "Fitness bloggers from Miami to promote a protein bar, English-speaking audience",
    briefHint: "The more detail (topic, country, audience, product), the more accurate the selection.",
    next: "Next",
    analyzing: "AI is analyzing your request",
    aiUnderstood: "AI understood it as",
    tags: [
      { icon: "tag", label: "ProteinBar · protein.bar" },
      { icon: "🇺🇸", label: "United States · Miami" },
      { icon: "lang", label: "English" },
      { icon: "people", label: "10K–500K" },
    ],
    limitTag: "up to 50 bloggers",
    launch: "Start search",
    launchCost: "10",
    progressTitle: "AI at work",
    progressRunning: "Finding creators for your brief",
    usually: "Usually 1–4 minutes",
    stages: ["Reading the brief", "Searching the networks", "Collecting profiles", "AI scoring", "Finding similar"],
    foundTitle: "Candidates found",
    reportTitle: "Miami fitness bloggers",
    ready: "READY",
    rounds: (n) => `Rounds: ${n}`,
    bloggers: "Bloggers",
    summary: (f, k, r) => `Found ${f} · Kept ${k} · Rejected ${r}`,
    tabs: ["All", "New", "Kept", "Rejected"],
    keep: "Keep",
    reject: "Reject",
    more: "more",
    newBadge: "NEW",
    round: (n) => `round ${n}`,
    language: "English",
    country: "US",
    swipeHint: "← reject · swipe · keep →",
    findMore: "Find more",
    refineTitle: "Find more bloggers",
    refineSummary: (k, r) => `AI will use your picks: ✓ ${k} kept, ✕ ${r} rejected.`,
    refineNoRepeat: (s) => `Already shown (${s}) will not repeat.`,
    refineYes: "Yes, find",
    roundHistory: "ROUND HISTORY",
    plusBloggers: (n) => `+${n} bloggers`,
    exportBtn: "Export to Excel",
    sheetName: "explorer_report.xlsx",
    cols: ["Blogger", "Followers", "Relevance", "Email"],
    timerLabel: "SEARCH TIME",
    timerDone: "DONE",
    ctaProduct: "EXPLORER",
    ctaLine: "Any creator. 3 minutes.",
    ctaScan: "Scan to try it",
    ctaUrl: "app.yoloco.io/explorer",
    creators: [
      { ...people.kate, handle: "miamifitkate", name: "Kate · Miami Fit", followers: "184K", score: 92, reason: "Miami fitness coach, workout reels, US audience, a natural fit for a protein bar", bio: "Certified trainer · South Beach · 6am bootcamps", gender: "Female", email: "kate@miamifit.co", round: 1 },
      { ...people.lift, handle: "tampa_lift", name: "Lift with Ana", followers: "96.4K", score: 88, reason: "strength training and meal prep, posts snack reviews, English-speaking", bio: "Powerlifting · macros · honest reviews", gender: "Female", email: "ana@liftwithana.com", round: 1 },
      { ...people.coach, handle: "gymdeals305", name: "Gym Deals 305", followers: "41.2K", score: 61, reason: "gym discount page, not a creator: ads only, no own content", bio: "Best gym deals in Miami-Dade", gender: "Not detected", round: 1 },
      { ...people.yoga, handle: "orlandoyoga_j", name: "Jasmine Yoga", followers: "212K", score: 85, reason: "yoga and wellness, healthy snacks in routine videos, Florida audience", bio: "Yoga teacher · plant-based · mom of two", gender: "Female", email: "hello@jasmineyoga.us", round: 1 },
    ],
    round2: [
      { ...people.run, handle: "run_jax", name: "Jax Runs Miami", followers: "128K", score: 94, reason: "runner and nutrition vlogs in Miami, like the creators you kept", bio: "Marathons · fuel tests · Brickell", gender: "Male", email: "jax@runjax.com", round: 2, isNew: true },
      { ...people.box, handle: "flbeachbody", name: "FL Beach Body", followers: "73.9K", score: 90, reason: "beach workouts and protein recipes, US audience, matches your picks", bio: "Outdoor HIIT · recipes · Miami Beach", gender: "Not detected", email: "team@flbeachbody.com", round: 2, isNew: true },
    ],
  },
  ru: {
    hookAny: ["ЛЮБЫЕ БЛОГЕРЫ", "ЗА 3 МИНУТЫ"],
    hookQueries: [
      { who: "Таксисты", where: "Нигерия", flag: "🇳🇬" },
      { who: "Мамочки", where: "Австралия", flag: "🇦🇺" },
      { who: "Финансисты", where: "Нью-Йорк", flag: "🇺🇸" },
    ],
    hookFound: "блогеров найдено",
    hookStart: "ЗАСЕКАЙТЕ",
    appTitle: "Подборки блогеров",
    url: "app.yoloco.ru/explorer/new",
    eyebrow: "ПОДБОРКИ БЛОГЕРОВ",
    newTitle: "Новая подборка блогеров",
    newSubtitle: "Опишите задачу своими словами. AI уточнит параметры, найдёт блогеров и объяснит, почему они подходят.",
    step1: "Кого ищем",
    step1Hint: "Опишите блогеров словами",
    step2: "Уточним",
    step2Hint: "Страны, язык, размер, соцсети",
    briefLabel: "Каких блогеров ищем?",
    brief: "Фитнес-блогеры из Майами для рекламы протеиновых батончиков, аудитория на английском",
    briefHint: "Чем подробнее описание (тематика, страна, аудитория, продукт), тем точнее подборка.",
    next: "Дальше",
    analyzing: "AI разбирает запрос",
    aiUnderstood: "AI понял так",
    tags: [
      { icon: "tag", label: "ProteinBar · protein.bar" },
      { icon: "🇺🇸", label: "Соединённые Штаты · Майами" },
      { icon: "lang", label: "Английский" },
      { icon: "people", label: "10 тыс.–500 тыс." },
    ],
    limitTag: "до 50 блогеров",
    launch: "Запустить поиск",
    launchCost: "10",
    progressTitle: "Работа AI",
    progressRunning: "Подбираем блогеров под ваш запрос",
    usually: "Обычно 1–4 минуты",
    stages: ["Разбираем бриф", "Ищем в соцсетях", "Собираем профили", "AI оценивает", "Ищем похожих"],
    foundTitle: "Найдено кандидатов",
    reportTitle: "Фитнес-блогеры Майами",
    ready: "ГОТОВО",
    rounds: (n) => `Раундов: ${n}`,
    bloggers: "Блогеры",
    summary: (f, k, r) => `Найдено ${f} · Отобрано ${k} · Вычеркнуто ${r}`,
    tabs: ["Все", "Новые", "Отобранные", "Вычеркнутые"],
    keep: "Оставить",
    reject: "Вычеркнуть",
    more: "ещё",
    newBadge: "НОВЫЙ",
    round: (n) => `раунд ${n}`,
    language: "Английский",
    country: "US",
    swipeHint: "← вычеркнуть · свайп · оставить →",
    findMore: "Найти ещё",
    refineTitle: "Найти ещё блогеров",
    refineSummary: (k, r) => `AI учтёт ваш выбор: ✓ ${k} оставленных, ✕ ${r} вычеркнутых.`,
    refineNoRepeat: (s) => `Уже показанные (${s}) не повторятся.`,
    refineYes: "Да, найти",
    roundHistory: "ИСТОРИЯ РАУНДОВ",
    plusBloggers: (n) => `+${n} блогеров`,
    exportBtn: "Выгрузить в Excel",
    sheetName: "explorer_report.xlsx",
    cols: ["Блогер", "Подписчики", "Релевантность", "Email"],
    timerLabel: "ВРЕМЯ ПОИСКА",
    timerDone: "ГОТОВО",
    ctaProduct: "ПОДБОР",
    ctaLine: "Любые блогеры за 3 минуты",
    ctaScan: "Сканируйте и попробуйте",
    ctaUrl: "app.yoloco.ru/explorer",
    creators: [
      { ...people.kate, handle: "miamifitkate", name: "Kate · Miami Fit", followers: "184 тыс.", score: 92, reason: "фитнес-тренер из Майами, тренировки в рилс, аудитория США, идеально для батончиков", bio: "Certified trainer · South Beach · 6am bootcamps", gender: "Женщина", email: "kate@miamifit.co", round: 1 },
      { ...people.lift, handle: "tampa_lift", name: "Lift with Ana", followers: "96,4 тыс.", score: 88, reason: "силовые и мил-преп, делает обзоры перекусов, англоязычная аудитория", bio: "Powerlifting · macros · honest reviews", gender: "Женщина", email: "ana@liftwithana.com", round: 1 },
      { ...people.coach, handle: "gymdeals305", name: "Gym Deals 305", followers: "41,2 тыс.", score: 61, reason: "паблик скидок на спортзалы, не блогер: только реклама, своего контента нет", bio: "Best gym deals in Miami-Dade", gender: "Не определён", round: 1 },
      { ...people.yoga, handle: "orlandoyoga_j", name: "Jasmine Yoga", followers: "212 тыс.", score: 85, reason: "йога и велнес, полезные перекусы в рутинах, аудитория Флориды", bio: "Yoga teacher · plant-based · mom of two", gender: "Женщина", email: "hello@jasmineyoga.us", round: 1 },
    ],
    round2: [
      { ...people.run, handle: "run_jax", name: "Jax Runs Miami", followers: "128 тыс.", score: 94, reason: "бег и питание в Майами, похож на тех, кого вы оставили", bio: "Marathons · fuel tests · Brickell", gender: "Мужчина", email: "jax@runjax.com", round: 2, isNew: true },
      { ...people.box, handle: "flbeachbody", name: "FL Beach Body", followers: "73,9 тыс.", score: 90, reason: "тренировки на пляже и протеиновые рецепты, аудитория США, как ваши отобранные", bio: "Outdoor HIIT · recipes · Miami Beach", gender: "Не определён", email: "team@flbeachbody.com", round: 2, isNew: true },
    ],
  },
};
