import { defineTemplate } from "../types";
import { BallonDorMoney } from "./BallonDorMoney";
import { ballonDorMoneySchema } from "./schema";
import { DURATION } from "./timeline";

export const ballonDorMoney = defineTemplate({
  id: "ballon-dor-money",
  name: "Экономика Золотого мяча",
  description: "ВЫПУСК 22: the Ballon d'Or 2026 through money. The trophy costs 3 000 €, the winner gets 0, the price tag climbs beat by beat to the organisers' 16 M €.",
  schema: ballonDorMoneySchema,
  defaultProps: {
    question: "СКОЛЬКО ТЫ БЫ ОТДАЛ ЗА МЯЧ?",
    // Ballon d'Or 2026: Harry Kane (author 27.10); Transfermarkt 60 M €, update 27.05.2026
    winner: { name: "КЕЙН", photo: "images/ballon-dor-money/kane.png", ratio: 830 / 1337, value: 60, club: "БАВАРИЯ · АНГЛИЯ" },
  },
  durationInSeconds: DURATION,
  formats: ["reel"],
  component: BallonDorMoney,
});
