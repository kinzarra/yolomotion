import { defineTemplate } from "../types";
import { NintendoCards } from "./NintendoCards";
import { nintendoCardsSchema } from "./schema";
import { DURATION } from "./timeline";

export const nintendoCards = defineTemplate({
  id: "nintendo-cards",
  name: "Nintendo: от колоды карт до Switch",
  description: "ИСТОРИИ КОМПАНИЙ 01: Nintendo as a comic. Cards in 1889, taxi, rice and love hotels that flopped, the repairman's Ultra Hand, Game Boy, Mario named after a landlord, 156 M Switch.",
  schema: nintendoCardsSchema,
  defaultProps: {
    question: "КАКУЮ КОМПАНИЮ РАЗОБРАТЬ?",
  },
  durationInSeconds: DURATION,
  formats: ["reel"],
  component: NintendoCards,
});
