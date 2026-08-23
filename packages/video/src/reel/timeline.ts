// The timeline vocabulary every voiceover-driven reel is built from.
//
// Two numbers used to be typed by hand into each template: scene start times
// (recomputed whenever a beat got retimed) and the measured mp3 durations.
// Both are derived here instead — `buildScenes` accumulates starts from
// lengths, `defineVoiceover` reads durations from the generated
// `durations.ts` that `gen-voiceover.mjs` writes next to the clips.
import { useVideoConfig } from "remotion";

export type SceneSpec = { from: number; len: number }; // seconds

export type SceneMap<K extends string> = Record<K, SceneSpec>;

// Scene lengths in order → absolute starts. Retiming one beat shifts every
// later beat automatically, which is the whole point: a scene grid that can
// only be edited in one place cannot drift out of sync with itself.
export const buildScenes = <K extends string>(
  lengths: Record<K, number>,
  startAt = 0,
): SceneMap<K> => {
  let cursor = startAt;
  const scenes = {} as SceneMap<K>;
  for (const key of Object.keys(lengths) as K[]) {
    scenes[key] = { from: cursor, len: lengths[key] };
    cursor += lengths[key];
  }
  return scenes;
};

export const scenesDuration = (scenes: SceneMap<string>): number =>
  Math.max(...Object.values<SceneSpec>(scenes).map((s) => s.from + s.len));

// Seconds → Sequence props. Rounding happens once, here, so no scene can be
// a frame off from its neighbour.
export const sceneFrames = (spec: SceneSpec, fps: number) => ({
  from: Math.round(spec.from * fps),
  durationInFrames: Math.round(spec.len * fps),
});

export const useSceneFrames = (spec: SceneSpec) => {
  const { fps } = useVideoConfig();
  return sceneFrames(spec, fps);
};

// A voiceover line as the timeline author writes it: which clip, when it
// starts, and the caption pages covering exactly what is spoken.
export type VoLineSpec = {
  file: string; // basename of the mp3 in public/voiceover/<dir>/
  start: number; // seconds into the video
  // Caption pages, in word order, exactly covering the spoken text — the
  // words are what word-level timing is computed from.
  //   "~PAGE"  hides the page (a scene headline is carrying those words,
  //            but they still consume their share of the clip's time)
  //   "+WORD"  renders the word in the hero color, permanently once spoken
  //   "!WORD"  renders the word in the signal/bad color, same rule
  pages: string[];
};

// The same line once the measured clip duration is attached.
export type VoLine = VoLineSpec & { raw: number };

// All the voiceover track itself needs: which clip, and when it starts.
// Reels without karaoke captions declare only this much.
export type VoTrackLine = { file: string; start: number };

export type ClipDurations = Record<string, number>;

// Rough spoken length of a caption page, ~0.32s per word — measured against
// the existing reels. Only used before a clip exists.
const estimate = (pages: string[]): number =>
  pages.reduce((total, page) => total + page.replace(/^~/, "").split(" ").length, 0) * 0.32;

// Attaches measured durations to the authored lines.
//
// A clip that has not been synthesised yet falls back to a word-count
// estimate so a half-written template still previews. It must NOT throw: the
// registry imports every template, so one unfinished reel would otherwise
// take down Studio and every render in the project.
// Generic in the line shape so reels without karaoke captions can pass plain
// { file, start } entries and still get measured durations back.
export const defineVoiceover = <T extends VoTrackLine & { pages?: string[] }>(
  durations: ClipDurations,
  lines: T[],
): (T & { raw: number })[] =>
  lines.map((line) => {
    const raw = durations[line.file];
    if (typeof raw === "number") return { ...line, raw };
    console.warn(
      `[reel] No measured duration for voiceover clip "${line.file}" — ` +
        `using a word-count estimate. Synthesise it with: ` +
        `npm run voiceover -- scripts/voiceover/<id>.json`,
    );
    return { ...line, raw: estimate(line.pages ?? []) };
  });

// Where the spoken track actually ends, at playback rate. Templates set their
// duration from this (+ a tail) instead of a hardcoded 30.
export const voiceoverEnd = (
  lines: readonly (VoTrackLine & { raw: number })[],
  rate: number,
): number => Math.max(...lines.map((l) => l.start + l.raw / rate));
