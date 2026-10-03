import { defineTemplate } from "../types";
import { lookLabSchema } from "./schema";
import { LookLab, DURATION } from "./LookLab";

export const lookLab = defineTemplate({
  id: "look-lab",
  name: "Look Lab",
  description:
    "Silent 15s showcase of a look (riso, chrome, swiss, aurora, tabloid, gloss): hook, number, photo, clip, CTA with captions and cut effects.",
  schema: lookLabSchema,
  defaultProps: {
    look: "riso" as const,
    eyebrow: "ЛУК · {look}",
    headline: "Деньги\nбольше не\n*спят*",
    number: 73,
    numberSuffix: "%",
    numberLabel: "зрителей решают за три секунды",
    photo: "footage/dubai-economy/01-hook-skyline.jpg",
    photoTag: "Дубай, 2026",
    photoCaption: "Город, который построили за 30 лет",
    clip: "footage/dubai-economy/06-airport-a380.mp4",
    clipHeadline: "Каждый кадр\n*доказательство*",
    cta: "Подписаться",
    handle: "@dengi.prosto",
  },
  durationInSeconds: DURATION,
  formats: ["reel"],
  component: LookLab,
});
