// Frame and camera constants shared by the brain, its neural net and the labels.
import type { Body } from "./ages";
import type { Part } from "./palette";

export const W = 1080;
export const H = 1920;
export const FOV = 30;
export const CAM_Z = 640;
/** brain centre on screen, model units (mm) */
export const BRAIN_Y = 22;

export type BrainPose = {
  rotX: number;
  rotY: number;
  body: Body;
  /** 0..1 per part */
  parts: Partial<Record<Part, number>>;
  /** 0 = solid cortex, 1 = x-ray glass showing the deep structures */
  glass: number;
  time: number;
};
