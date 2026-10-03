import { defineTemplate } from "../types";
import { YolocoExplorer } from "./YolocoExplorer";
import { yolocoExplorerSchema } from "./schema";
import { DURATION_BY } from "./timeline";

// One film, two cuts: same beats and scenes, the voice and the copy differ.
const base = {
  schema: yolocoExplorerSchema,
  formats: ["reel" as const],
  component: YolocoExplorer,
};

export const yolocoExplorer = defineTemplate({
  ...base,
  id: "yoloco-explorer",
  name: "Yoloco Explorer — any creator in 3 minutes (EN)",
  description:
    "English Short (eleven_v3, accent-free author voice): three impossible briefs, the clock starts, and the real Explorer UI types a brief, scans four networks, scores creators, takes swipes, learns in round 2 and exports emails to Excel. QR to app.yoloco.io/explorer/new.",
  defaultProps: { lang: "en" as const },
  durationInSeconds: DURATION_BY.en,
});

export const yolocoExplorerRu = defineTemplate({
  ...base,
  id: "yoloco-explorer-ru",
  name: "Ёлоко Подбор — любые блогеры за 3 минуты (RU)",
  description: "Русская версия yoloco-explorer: те же сцены, озвучка клоном, интерфейс на русском. QR на app.yoloco.ru/explorer/new.",
  defaultProps: { lang: "ru" as const },
  durationInSeconds: DURATION_BY.ru,
});
