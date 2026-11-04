// Visual cues keyed to the spoken words, in frames from the scene's start.
// Built on the engine's pageTimes — the same weights the karaoke uses — so a
// re-recorded clip moves every cue with its caption.
import { pageTimes } from "../../reel";
import { SCENES, VOICEOVER, VO_RATE } from "./timeline";

type Beat = keyof typeof SCENES;

/** Frame (from the beat's start) at which page `page` of clip `file` starts. */
export const cue = (beat: Beat, file: string, page: number, fps: number) => {
  const line = VOICEOVER.find((l) => l.file === file);
  if (!line) throw new Error(`no voiceover line ${file}`);
  const t = pageTimes(line, VO_RATE)[page].start - SCENES[beat].from;
  return Math.round(t * fps);
};

/** Frame (from the beat's start) at which clip `file` ends. */
export const lineEnd = (beat: Beat, file: string, fps: number) => {
  const line = VOICEOVER.find((l) => l.file === file);
  if (!line) throw new Error(`no voiceover line ${file}`);
  return Math.round((line.start + line.raw / VO_RATE - SCENES[beat].from) * fps);
};

/** Frame (from the beat's start) at which clip `file` starts. */
export const lineStart = (beat: Beat, file: string, fps: number) => {
  const line = VOICEOVER.find((l) => l.file === file);
  if (!line) throw new Error(`no voiceover line ${file}`);
  return Math.round((line.start - SCENES[beat].from) * fps);
};
