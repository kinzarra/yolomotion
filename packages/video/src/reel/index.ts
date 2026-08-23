// The reel engine: everything a voiceover-driven short shares, so a new
// template is only its scenario — palette, timeline, scenes.
export { Reel, Scene, VoiceoverTrack } from "./Reel";
export type { ReelProps } from "./Reel";
export { Captions } from "./Captions";
export type { CaptionStyle } from "./Captions";
export { useIn, usePunch, useRamp } from "./motion";
export type { SpringName } from "./motion";
export {
  buildScenes,
  defineVoiceover,
  sceneFrames,
  scenesDuration,
  useSceneFrames,
  voiceoverEnd,
} from "./timeline";
export type {
  ClipDurations,
  SceneMap,
  SceneSpec,
  VoLine,
  VoLineSpec,
  VoTrackLine,
} from "./timeline";
