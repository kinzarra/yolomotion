import { PyramidData } from "../_shorts/Pyramid";

// 8,1 bn people (UN). Online ≈ 6 bn = 74% (ITU Facts and Figures 2025). ChatGPT ≈ 900 M
// weekly users (OpenAI via trackers, 02.2026) = 11%. Paying for AI ≈ 50 M (ChatGPT paid
// subscribers, aggregator estimate) = 0,6%. Russia: ВЦИОМ 30.07.2026, 58% of internet
// users weekly; non-users: 44% «нет задач».
export const DATA: PyramidData = {
  series: "ДЕНЬГИ · ПРОСТО",
  episode: "ВЫПУСК 15",
  voiceoverDir: "ai-one-percent",
  rate: 1.1,
  hook: { total: "8,1 МЛРД", words: ["ПЛАТЯТ", "ЗА", "ИИ:", "МЕНЬШЕ", "1%"], sub: "ТЫ В КАКОМ СЛОЕ?", clip: "media/kit-ai/crowd.mp4", faces: ["images/ai-one-percent/face-00.jpg","images/ai-one-percent/face-01.jpg","images/ai-one-percent/face-02.jpg","images/ai-one-percent/face-03.jpg","images/ai-one-percent/face-10.jpg","images/ai-one-percent/face-11.jpg","images/ai-one-percent/face-12.jpg","images/ai-one-percent/face-13.jpg","images/ai-one-percent/face-20.jpg","images/ai-one-percent/face-21.jpg","images/ai-one-percent/face-22.jpg","images/ai-one-percent/face-23.jpg"], bills: ["images/ai-one-percent/usd20.jpg", "images/ai-one-percent/usd100.jpg"], presenter: { file: "presenter/ai-one-percent/punch.mp4", from: 1.8, duration: 4.48, caption: "ПЛАТЯТ ЗА ИИ МЕНЬШЕ 1%" } },
  layers: [
    { share: 0.74, value: "6 МЛРД", label: "В ИНТЕРНЕТЕ · 74% ЛЮДЕЙ · ITU 2025", side: { left: ["«В ИНТЕРНЕТЕ» = ЗАХОДИЛ В СЕТЬ ХОТЯ БЫ РАЗ ЗА 3 МЕСЯЦА", "ГОРОД: 85% ОНЛАЙН"], right: ["ЭТО НЕ «ПОЛЬЗУЕТСЯ ИИ»", "СЕЛО: 58% ОНЛАЙН"] }, numbers: ["WI-FI", "4G", "5G", "6 000 000 000", "74%", "ITU"], clip: "media/kit-ai/earth.mp4", photos: [{ src: "images/ai-one-percent/offline-crowd2.jpg", w: 420, label: "2,2 МЛРД ОФЛАЙН" }], logos: ["images/kit/itu.svg", "images/kit/wifi.svg"], chips: ["2,2 МЛРД ОФЛАЙН", "96% ИЗ НИХ В БЕДНЫХ СТРАНАХ"] },
    { share: 0.111, value: "900 МЛН", label: "ОТКРЫВАЮТ CHATGPT КАЖДУЮ НЕДЕЛЮ · 11%", side: { left: ["CHATGPT: 900 МЛН В НЕДЕЛЮ · 02.2026", "КАЖДЫЙ 9-Й ЧЕЛОВЕК"], right: ["GEMINI: 900 МЛН В МЕСЯЦ", "БЕСПЛАТНО: БОЛЬШИНСТВО"] }, numbers: ["PROMPT", "GPT", "AI", "900 000 000", "11%", "ЧАТ"], clip: "media/kit-ai/chat.mp4", logos: ["images/kit/openai.svg", "images/kit/gemini.svg"], photos: [{ src: "images/ai-one-percent/meme-two-buttons.jpg", w: 190 }], chips: ["ДАННЫЕ 02.2026"] },
    { share: 0.006, value: "50 МЛН", label: "ПЛАТЯТ ЗА ИИ · 0,6% ЧЕЛОВЕЧЕСТВА", clip: "media/kit-ai/card.mp4", logos: ["images/kit/openai.svg", "images/kit/anthropic.svg"], bills: ["images/ai-one-percent/usd20.jpg", "images/ai-one-percent/usd20.jpg", "images/ai-one-percent/usd100.jpg"], stamp: { text: "МЕНЬШЕ 1%", tone: "bad" }, tiers: [{ price: "$20", label: "PLUS · PRO" }, { price: "$100", label: "MAX" }, { price: "$200", label: "PRO · MAX" }], chips: ["ПОДПИСКИ В МЕСЯЦ", "CHATGPT · CLAUDE"] },
  ],
  country: { value: "4 500", label: "СТОЛЬКО ЛЮДЕЙ ВО ВСЕЙ OPENAI · FT, 03.2026", share: 0, sprite: { dir: "images/ai-one-percent/rick", count: 16, fps: 10, h: 760 }, flyIn: { src: "images/ai-one-percent/einstein.png", w: 260 }, spin: { src: "images/ai-one-percent/dna.png", w: 200, label: "МЕДИЦИНА" }, side: { left: ["РАБОТАЮТ С ИИ: МЕДИКИ"], right: ["ФИЗИКИ И БИОЛОГИ"] }, logos: ["images/kit/openai.svg", "images/kit/anthropic.svg", "images/kit/gemini.svg"], stamp: { text: "0,00006% ЛЮДЕЙ", tone: "hero" }, note: "СОЗДАЮТ ИИ ДЛЯ ВСЕХ ОСТАЛЬНЫХ" },
  final: { pointer: "ТЫ ЗДЕСЬ?", stamp: "6 ТОЧЕК ИЗ 1 000", sources: "ООН · ITU Facts and Figures 2025 · OpenAI, 02.2026 · Financial Times, 03.2026" },
};
