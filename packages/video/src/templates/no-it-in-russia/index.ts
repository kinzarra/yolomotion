import { defineTemplate } from "../types";
import { NoItInRussia } from "./NoItInRussia";
import { noItInRussiaSchema } from "./schema";
import { DURATION } from "./timeline";

export const noItInRussia = defineTemplate({
  id: "no-it-in-russia",
  name: "Нейросети убили IT?",
  description:
    "Fifth «ЧЕК × ПИКСЕЛЬ» episode, and the first with a face: five seconds of studio talking-head open on «24 ЧЕЛОВЕКА НА 1 ВАКАНСИЮ» and glitch straight out of it, a year of openings falls into red under a downpour of paper résumés, «ИИ» splits into three shards to say it is not the only cause, a five-person team keeps two dashed hires that never arrive, four routine cards are swept away one by one and tagged AI, the empty desk beside a working developer turns into the assistant that replaced the hire rather than the person, the career staircase loses its bottom two steps while a junior stands where they were, a scan over 700 000 listings stamps the fact-check in lime, and the finale answers IT НЕ УМЕР / ПЛАНКА ВХОДА ВЫРОСЛА before asking ПОШЛИ БЫ В IT? — ДА / НЕТ.",
  schema: noItInRussiaSchema,
  defaultProps: {
    series: "ДЕНЬГИ · ПРОСТО",
    episode: "ВЫПУСК 05",
    applicants: "24",
    vacancyDelta: "≈ −32%",
    scanned: 700000,
    footnote: "Оценки по открытым данным рынка труда • август 2026",
  },
  durationInSeconds: DURATION,
  formats: ["reel"],
  component: NoItInRussia,
});
