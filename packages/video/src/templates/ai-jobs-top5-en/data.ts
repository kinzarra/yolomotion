import { CountdownData } from "../_shorts/Countdown";

// Flipped with the RU cut (author 2026-10-18): «5 jobs AI killed».
// List: WEF Future of Jobs Report 2025, fastest-declining jobs to 2030 (postal service clerks #1).
// US pay and outlook: BLS Occupational Outlook Handbook, May 2025 medians, projections 2025–35:
// accountants $83,680; cashiers $32,880, -6%; file clerks (closest BLS group to data entry)
// $43,600, -16%; tellers $43,030, -13%; mail carriers $60,550, postal workers -1%.
const A = "images/ai-jobs-top5/";
const K = "media/kit-killed/";
export const DATA: CountdownData = {
  series: "PHILIPP WHY?",
  episode: "AI · JOBS",
  voiceoverDir: "ai-jobs-top5-en",
  rate: 1.12,
  rankWord: "PLACE",
  hook: {
    words: ["5", "JOBS", "AI", "ALREADY", "KILLED"],
    badWord: 4,
    sub: "CHECK IF YOUR JOB IS HERE",
    clip: K + "accountant.mp4",
    chips: ["WEF · FUTURE OF JOBS 2025", "FASTEST-DECLINING TO 2030"],
    meme: A + "cat-cry.jpg",
    killer: A + "mask.png",
    skull: true,
    kill: true,
  },
  places: [
    { title: "ACCOUNTANT", chips: ["ON WEF'S DECLINING LIST", "AI IN EVERY ACCOUNTING APP", "RECEIPTS READ BY AI"], logos: ["images/kit/sap.svg"], clip: K + "accountant.mp4", person: { src: A + "accountant-us.png", w: 560, ratio: 840 / 1352 }, why: "AI BUILDS THE REPORT IN SECONDS", whyTitle: "WHY AI", num: { value: "$83,680", label: "US MEDIAN PAY · BLS, MAY 2025" }, stamp: { text: "AI DOES THE BOOKS", tone: "bad" } },
    { title: "CASHIER", chips: ["WEF TOP-5 DECLINING", "-6% CASHIERS BY 2035 · BLS", "PAY BY FACE AND QR"], clip: K + "checkout.mp4", person: { src: A + "cashier.png", w: 520, ratio: 1200 / 1800 }, why: "SELF-CHECKOUT AND PAY-BY-FACE", whyTitle: "WHY AI", num: { value: "$32,880", label: "US MEDIAN PAY · BLS, MAY 2025" }, stamp: { text: "-6% BY 2035", tone: "bad", label: "200,600 FEWER JOBS · BLS" } },
    { title: "DATA ENTRY CLERK", chips: ["WEF TOP-5 DECLINING", "-16% FILE CLERKS · BLS", "SCAN INSTEAD OF TYPING"], clip: K + "servers.mp4", why: "AI READS SCANS, RECEIPTS AND FORMS ITSELF", whyTitle: "WHY AI", logos: ["images/kit/google.svg", "images/kit/openai.svg"], photo: A + "typing.jpg", num: { value: "-16%", label: "FILE CLERKS, 2025 TO 2035 · BLS" }, stamp: { text: "AI READS IT", tone: "bad" } },
    { title: "BANK TELLER", chips: ["WEF TOP-5 DECLINING", "-13% TELLERS BY 2035 · BLS", "TRANSFERS IN THE APP"], clip: K + "counter.mp4", person: { src: A + "teller.png", w: 520, ratio: 1200 / 1803 }, why: "TRANSFERS AND DEPOSITS MOVED TO THE APP", whyTitle: "WHY AI", num: { value: "$43,030", label: "US MEDIAN PAY · BLS, MAY 2025" }, stamp: { text: "-13% BY 2035", tone: "bad", label: "44,700 FEWER TELLERS · BLS" } },
    { title: "TRANSLATOR", chips: ["NEURAL NETS TRANSLATE INSTANTLY", "VIDEO DUBBED BY AI", "LIVE SPEECH TRANSLATION"], clip: K + "translator.mp4", person: { src: A + "translator.png", w: 520, ratio: 1100 / 1495 }, why: "GOOGLE, DEEPL AND OTHERS TRANSLATE IN A SECOND", whyTitle: "WHY AI", logos: ["images/kit/google-translate.svg", "images/kit/deepl.svg"], numbers: ["HELLO", "ПРИВЕТ", "BONJOUR", "你好", "HOLA", "EN → ES", "0.3 S"], num: { value: "$60,170", label: "US MEDIAN PAY · BLS, MAY 2025" }, stamp: { text: "AI TRANSLATES", tone: "bad" } },
  ],
  final: { line: "IS YOUR JOB NEXT?", badWords: [3], stamp: "CHECK NOW" },
  sources: "WEF Future of Jobs Report 2025 · US Bureau of Labor Statistics, OOH, May 2025",
};
