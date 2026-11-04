import { SkillData } from "../_shorts/SkillCheck";

// Author 2026-10-19: top-5 skills to work with AI, teen-level, self-check hook, no face.
// Facts: Mata v. Avianca (S.D.N.Y., 22.06.2023): 6 invented cases, $5 000 sanction; judge Starr's AI order 30.05.2023.
// Ghibli wave: 700 M images by 130 M users in a week (OpenAI COO Lightcap, 04.2025), Altman «our GPUs are melting».
// Moffatt v. Air Canada, 2024 BCCRT 149 (14.02.2024): chatbot invented a refund rule, airline pays 650,88 CAD.
// Reddit r/ChatGPT (~1,7k upvotes): 2 ERs + 3 neurologists, ChatGPT suggested a CSF leak, MRI confirmed (self-reported).
// METR 2025: experienced devs 19% slower with AI, felt 20% faster.
// Willy's Chocolate Experience, Glasgow 24.02.2024: AI-made ads, £35 tickets, near-empty warehouse, police called.
const A = "images/ai-skills-top5/";
const M = "media/ai-skills-top5/";
export const DATA: SkillData = {
  series: "ДЕНЬГИ · ПРОСТО",
  episode: "ВЫПУСК 14",
  voiceoverDir: "ai-skills-top5",
  rate: 1.15,
  hook: {
    kicker: "ПРОВЕРЬ СЕБЯ",
    words: ["5", "НАВЫКОВ", "ДЛЯ", "РАБОТЫ", "С", "ИИ"],
    sub: "ИИ У ВСЕХ ОДИН. РЕЗУЛЬТАТ РАЗНЫЙ",
    clip: M + "typing.mp4",
    counter: "У ТЕБЯ: ?/5",
    props: [
      { src: A + "phone-ai.jpg", x: 60, y: 1190, w: 400, rot: -7 },
      { src: A + "teen-laptop.jpg", x: 600, y: 1170, w: 420, rot: 6 },
    ],
    teasers: ["−5 000 $", "650 $", "700 МЛН", "35 £", "−19%", "?/5"],
  },
  labels: { example: "ПРИМЕР ИЗ ЖИЗНИ", train: "КАК КАЧАТЬ", you: "У ТЕБЯ", place: "МЕСТО" },
  beats: [
    {
      word: "ПРАВИЛО",
      clip: M + "gavel.mp4",
      example: { kind: "story", photo: A + "lawyer.jpg", lines: ["ЮРИСТ ПОПРОСИЛ ИИ НАЙТИ ДЕЛА", "ИИ ВЫДУМАЛ 6 ШТУК", "ЮРИСТ НЕ ПРОВЕРИЛ", "ТЕПЕРЬ В СУДАХ ПРАВИЛО: ПРОВЕРЯЙ ИИ"], stamp: "ВЫДУМАНО", badge: "США, 2023" },
      num: { value: "−5 000 $", label: "ШТРАФ ЮРИСТУ" },
      meme: { img: A + "dog.jpg", top: "ИИ ТОЧНО НЕ ВРЁТ", bottom: "ВСЁ НОРМАЛЬНО" },
      check: "У МЕНЯ ЕСТЬ СВОИ ПРАВИЛА ДЛЯ ИИ",
      tip: "ОБЛАЖАЛСЯ РАЗ? ЗАПИШИ: «ВСЕГДА ...» ИЛИ «НИКОГДА ...»",
    },
    {
      word: "ПОЧЕМУ",
      clip: M + "candy.mp4",
      example: {
        kind: "split",
        left: { label: "«СДЕЛАЙ КРАСИВО»", img: A + "kid-lollipop.jpg", caption: "СЕРО И СКУЧНО", tone: "bad", dull: true },
        right: { label: "«КАК АНИМЕ, ЯРКО»", img: A + "kid-lollipop.jpg", caption: "ВОТ ЭТО ДА", tone: "hero" },
        badge: "ВЕСНА 2025: ВЕСЬ ИНТЕРНЕТ В АНИМЕ",
      },
      num: { value: "700 МЛН", label: "КАРТИНОК ЗА 7 ДНЕЙ · OPENAI" },
      meme: { img: A + "gpu.jpg", top: "ВИДЕОКАРТЫ OPENAI", bottom: "МЫ ПЛАВИМСЯ" },
      check: "МОГУ ОБЪЯСНИТЬ, ПОЧЕМУ МНЕ НРАВИТСЯ",
      tip: "НРАВИТСЯ? СКАЖИ ПОЧЕМУ. ОДНОЙ ФРАЗОЙ",
    },
    {
      word: "ГРАНИЦЫ",
      clip: M + "wing.mp4",
      example: { kind: "chat", photo: A + "plane.jpg", user: "МОЖНО ВЕРНУТЬ ДЕНЬГИ ЗА БИЛЕТ?", bot: "КОНЕЧНО! ДАЖЕ ПОСЛЕ ПОЛЁТА", verdict: "СУД: ПЛАТИТЕ", badge: "КАНАДА, 2024" },
      num: { value: "650 $", label: "ЗАПЛАТИЛА АВИАКОМПАНИЯ ЗА СЛОВА БОТА" },
      meme: { img: A + "robot.jpg", top: "БОТ: Я САМ ПО СЕБЕ", bottom: "СУД: НЕТ" },
      check: "СТАВЛЮ ИИ ЛИМИТЫ",
      tip: "ГОВОРИ ЦИФРАМИ: СКОЛЬКО, КОГДА, ЧТО НЕЛЬЗЯ",
    },
    {
      word: "ФАКТЫ",
      clip: M + "doctor.mp4",
      example: {
        kind: "split",
        left: { label: "«БОЛИТ ГОЛОВА»", img: A + "headache.jpg", caption: "3 НЕВРОЛОГА: НИЧЕГО", tone: "bad", cross: true },
        right: { label: "КОГДА, ГДЕ, ОТ ЧЕГО", img: A + "consult.jpg", caption: "ИИ: РЕДКАЯ БОЛЕЗНЬ. МРТ: ДА", tone: "hero" },
        badge: "ИСТОРИЯ С REDDIT · НЕ МЕДСОВЕТ",
      },
      num: { value: "−19%", label: "С ИИ КАЗАЛОСЬ БЫСТРЕЕ. СЕКУНДОМЕР: МЕДЛЕННЕЕ · METR" },
      meme: { img: A + "doctor.jpg", top: "ВРАЧ: ЧТО БЕСПОКОИТ?", bottom: "Я: УЖЕ ВСЁ НАГУГЛИЛ" },
      check: "ГОВОРЮ ФАКТАМИ",
      tip: "ГОВОРИ, ЧТО ВИДЕЛ. А НЕ ЧТО ДУМАЕШЬ",
    },
    {
      word: "ПРЕДСТАВЬ",
      clip: M + "warehouse.mp4",
      example: {
        kind: "split",
        left: { label: "ОБЕЩАЛИ (РИСОВАЛ ИИ)", img: A + "candy-room.jpg", caption: "ФАБРИКА ВИЛЛИ ВОНКИ", tone: "hero" },
        right: { label: "ПОЛУЧИЛИ", img: A + "warehouse.jpg", caption: "ПУСТОЙ СКЛАД", tone: "bad", dull: true },
        badge: "ГЛАЗГО, 2024",
      },
      num: { value: "35 £", label: "БИЛЕТ. ДЕТИ ПЛАКАЛИ, ПРИЕХАЛА ПОЛИЦИЯ" },
      meme: { img: A + "sad-clown.jpg", top: "Я, АКТЁР ФАБРИКИ", bottom: "В ПУСТОМ СКЛАДЕ" },
      check: "ВИЖУ РЕЗУЛЬТАТ ЗАРАНЕЕ",
      tip: "ПЕРЕД ПРОСЬБОЙ ОПИШИ ГОТОВОЕ: 5 ДЕТАЛЕЙ",
    },
  ],
  final: { line: "СКОЛЬКО У ТЕБЯ?", stamp: "ПИШИ ЧИСЛО", counter: "?/5" },
  sources: "Mata v. Avianca, 2023 · Moffatt v. Air Canada, 2024 · OpenAI, 2025 · METR, 2025 · Reddit r/ChatGPT · BBC, 2024",
};
