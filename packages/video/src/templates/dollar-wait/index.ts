import { defineTemplate } from "../types";
import { DollarWait } from "./DollarWait";
import { dollarWaitSchema } from "./schema";
import { DURATION } from "./timeline";

export const dollarWait = defineTemplate({
  id: "dollar-wait",
  name: "Доллар: брать или ждать?",
  description:
    "Personal finance-blog explainer in the «ЧЕК × ПИКСЕЛЬ» style: USD/RUB rips up over a huge lime КУПИТЬ with a cursor that never presses it, the answer НЕ ПОЗДНО lands in the first ten seconds with its red counterweight ОШИБКА ТОЛПЫ, the August chart runs to 85 ₽ in red and retraces to 82,90 ₽ in paper white with the peak tag still hanging there, a receipt prints the three causes while the key-rate dial swings to 14%, the «ставка вниз → доллар вверх» equation is struck out against НЕФТЬ / ЭКСПОРТ and the 11 СЕНТЯБРЯ calendar page, a figure walks past the quiet exchange board and sprints back at the red one, the wrong question is replaced by «КОГДА МНЕ НУЖНА ВАЛЮТА?», one heavy red purchase drops on a single day before splitting into four lime ones, three scenario lanes grey out under НЕ УГАДЫВАТЬ — УПРАВЛЯТЬ РИСКОМ, and the finale asks покупаю / жду / не нужна before looping back to the button.",
  schema: dollarWaitSchema,
  defaultProps: {
    series: "ДЕНЬГИ · ПРОСТО",
    episode: "ВЫПУСК 04",
    rateHigh: "85 ₽",
    rateNow: "82,90 ₽",
    monthDelta: "−5,8%",
    keyRate: "14%",
    nextMeeting: "11 СЕНТЯБРЯ",
    footnote: "Официальные курсы Банка России • на 22.08",
    disclaimer:
      "Материал носит информационный характер и не является индивидуальной инвестиционной рекомендацией.",
  },
  durationInSeconds: DURATION,
  formats: ["reel"],
  component: DollarWait,
});
