// brain-ages: the life-lines night sky (author 2026-10-26: «точно такой же стиль»)
// plus the brain's own colours. Fonts, easings, springs come from life-lines.
export { ease, fonts, springs } from "../life-lines/palette";
import { palette as sky } from "../life-lines/palette";

export const palette = {
  ...sky,
  // cortex: soft matte porcelain, lilac in the folds (author: «приятно и стильно», not plastic)
  brainBase: "#c4c8ea",
  brainDeep: "#33356e",
  brainRim: "#a99cff",
  neuron: "#dfe3ff",
  // one colour per part when it lights up
  frontal: sky.me,
  motor: sky.dog,
  parietal: sky.daughter,
  temporal: sky.son,
  occipital: sky.grandma,
  limbic: sky.wife,
  cerebellum: sky.friend,
  brainstem: sky.dad,
  hippocampus: "#5fe6ff",
  amygdala: sky.mom,
  callosum: sky.grandpa,
  ventricles: "#7aa8ff",
} as const;

export const LOBES = ["frontal", "motor", "parietal", "temporal", "occipital", "limbic"] as const;
export const DEEP = ["cerebellum", "brainstem", "hippocampus", "amygdala", "callosum", "ventricles"] as const;
export type Lobe = (typeof LOBES)[number];
export type Deep = (typeof DEEP)[number];
export type Part = Lobe | Deep;
/** structures inside the cortex: seen only through x-ray glass */
export const HIDDEN: Part[] = ["hippocampus", "amygdala", "callosum", "ventricles"];

export const PART_NAME: Record<Part, string> = {
  frontal: "Лобная доля",
  motor: "Моторная кора",
  parietal: "Теменная доля",
  temporal: "Височная доля",
  occipital: "Затылочная доля",
  limbic: "Поясная извилина",
  cerebellum: "Мозжечок",
  brainstem: "Ствол мозга",
  hippocampus: "Гиппокамп",
  amygdala: "Миндалина",
  callosum: "Мозолистое тело",
  ventricles: "Желудочки",
};
