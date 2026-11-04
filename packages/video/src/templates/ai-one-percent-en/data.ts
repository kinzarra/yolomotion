import { PyramidData } from "../_shorts/Pyramid";

// As ai-one-percent; US: Pew Research, Feb 2026: 44% of US adults use ChatGPT or other
// chatbots (2025: 34% had ever used ChatGPT).
export const DATA: PyramidData = {
  series: "PHILIPP WHY?",
  episode: "AI · 1%",
  voiceoverDir: "ai-one-percent-en",
  rate: 1.1,
  hook: { total: "8.1 BILLION", words: ["PAY", "FOR", "AI:", "LESS", "THAN", "1%"], sub: "WHICH LAYER ARE YOU IN?", clip: "media/kit-ai/crowd.mp4", faces: ["images/ai-one-percent/face-00.jpg","images/ai-one-percent/face-01.jpg","images/ai-one-percent/face-02.jpg","images/ai-one-percent/face-03.jpg","images/ai-one-percent/face-10.jpg","images/ai-one-percent/face-11.jpg","images/ai-one-percent/face-12.jpg","images/ai-one-percent/face-13.jpg","images/ai-one-percent/face-20.jpg","images/ai-one-percent/face-21.jpg","images/ai-one-percent/face-22.jpg","images/ai-one-percent/face-23.jpg"], bills: ["images/ai-one-percent/usd20.jpg", "images/ai-one-percent/usd100.jpg"], presenter: { file: "presenter/ai-one-percent-en/punch.mp4", from: 1.25, duration: 3.36, caption: "LESS THAN 1% PAY FOR AI" } },
  layers: [
    { share: 0.74, value: "6 BILLION", label: "ONLINE · 74% OF HUMANITY · ITU 2025", side: { left: ["«ONLINE» = WENT ONLINE AT LEAST ONCE IN 3 MONTHS", "CITIES: 85% ONLINE"], right: ["THAT IS NOT «USES AI»", "VILLAGES: 58% ONLINE"] }, numbers: ["WI-FI", "4G", "5G", "6,000,000,000", "74%", "ITU"], clip: "media/kit-ai/earth.mp4", photos: [{ src: "images/ai-one-percent/offline-crowd2.jpg", w: 420, label: "2.2 BILLION OFFLINE" }], logos: ["images/kit/itu.svg", "images/kit/wifi.svg"], chips: ["2.2 BILLION OFFLINE", "96% IN POORER COUNTRIES"] },
    { share: 0.111, value: "900 MILLION", label: "OPEN CHATGPT EVERY WEEK · 11%", side: { left: ["CHATGPT: 900M A WEEK · FEB 2026", "1 IN 9 PEOPLE"], right: ["GEMINI: 900M A MONTH", "MOST USE IT FREE"] }, numbers: ["PROMPT", "GPT", "AI", "900,000,000", "11%", "CHAT"], clip: "media/kit-ai/chat.mp4", logos: ["images/kit/openai.svg", "images/kit/gemini.svg"], chips: ["DATA FEB 2026"] },
    { share: 0.006, value: "50 MILLION", label: "PAY FOR AI · 0.6% OF HUMANITY", clip: "media/kit-ai/card.mp4", logos: ["images/kit/openai.svg", "images/kit/anthropic.svg"], bills: ["images/ai-one-percent/usd20.jpg", "images/ai-one-percent/usd20.jpg", "images/ai-one-percent/usd100.jpg"], stamp: { text: "LESS THAN 1%", tone: "bad" }, tiers: [{ price: "$20", label: "PLUS · PRO" }, { price: "$100", label: "MAX" }, { price: "$200", label: "PRO · MAX" }], chips: ["SUBSCRIPTIONS A MONTH", "CHATGPT · CLAUDE"] },
  ],
  country: { value: "4,500", label: "ALL OF OPENAI'S STAFF · FT, MARCH 2026", share: 0, sprite: { dir: "images/ai-one-percent/rick", count: 16, fps: 10, h: 760 }, flyIn: { src: "images/ai-one-percent/einstein.png", w: 260 }, spin: { src: "images/ai-one-percent/dna.png", w: 200, label: "MEDICINE" }, side: { left: ["USED BY DOCTORS"], right: ["PHYSICISTS AND BIOLOGISTS"] }, logos: ["images/kit/openai.svg", "images/kit/anthropic.svg", "images/kit/gemini.svg"], stamp: { text: "0.00006% OF PEOPLE", tone: "hero" }, note: "BUILD AI FOR EVERYONE ELSE" },
  dotLabel: "1 DOT ≈ 8 MILLION PEOPLE",
  final: { pointer: "ARE YOU HERE?", stamp: "6 DOTS OUT OF 1,000", sources: "UN · ITU Facts and Figures 2025 · OpenAI, Feb 2026 · Financial Times, March 2026" },
};
