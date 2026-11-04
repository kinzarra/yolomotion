// The sound layer (long format only, the author's «делай звук» 2026-10-31):
// the author's YouTube Audio Library track under the voice, ducked while the
// voice speaks, and the synthesised SFX kit (scripts/gen-sfx-dev-myth.mjs) on
// the visual events. Every cue is placed from the same timeline constants the
// scenes animate on, so a retime moves the sound with the picture.
import React from "react";
import { Audio, Sequence, interpolate, staticFile, useVideoConfig } from "remotion";
import { DURATIONS } from "./durations";
import {
  AI_T, BELIEVE_T, BILL_T, BUTTON_T, DURATION, EXPLAIN_T, HOOK_LEAD, HOOK_T, LANG_T, LIBS_T, MACHINE_T, MINUTES_T,
  MIRACLE_T, NOTQUITE_T, NQ_LEAD, PRIESTS_T, PROF_T, SALARY_T, SCENES, SCRATCH_T, SEARCH_T, SOLVED_T, T, TASKS_T,
  THING_T, TODAY_T, VOICEOVER, VO_RATE, WHO_T, WHY2_T, P2CARD,
} from "./timeline";

type Sfx = "magic" | "click" | "coin" | "coins" | "glitch" | "impact" | "key1" | "key2" | "key3" | "key4" | "printer" | "riser" | "shimmer" | "stamp" | "thud" | "tick" | "typing-long" | "typing-short" | "whoosh-low" | "whoosh";
type Cue = [number, Sfx, number?];

const LEVEL: Record<Sfx, number> = {
  magic: 0.3,
  click: 0.35, coin: 0.3, coins: 0.3, glitch: 0.16, impact: 0.32, key1: 0.3, key2: 0.3, key3: 0.3, key4: 0.3,
  printer: 0.18, riser: 0.3, shimmer: 0.22, stamp: 0.4, thud: 0.32, tick: 0.25, "typing-long": 0.2, "typing-short": 0.2,
  "whoosh-low": 0.3, whoosh: 0.26,
};

const s = (k: keyof typeof SCENES, local: number) => SCENES[k].from + local;
const w = (k: keyof typeof SCENES, clipSec: number, lead?: number) => s(k, T(clipSec, lead));

/** Every cue in absolute seconds. Notes 4 and 5 asked for the typing and the coins. */
const CUES: Cue[] = [
  // Author 2026-11-01 (notes 36–38, 41, 67): no printers, coins, typing, clicks or harp.
  // What is left is a soft hit on the four turns and on each part card.
  [w("hook", HOOK_T.lie, HOOK_LEAD), "impact", 0.6], // «мы вас обманывали»
  [w("notquite", NOTQUITE_T.lie), "impact", 0.6], // «Так нас обманывали?»
  [w("explain", EXPLAIN_T.destroy), "impact", 0.6], // «уничтожить»
  [s("p2card", P2CARD.hit), "impact", 0.6],
  [s("p3card", P2CARD.hit), "impact", 0.6],
  [s("p4card", P2CARD.hit), "impact", 0.6],
  [s("p5card", P2CARD.hit), "impact", 0.6],
];

/** Seconds the voice is speaking, for the duck. */
const VOICE = VOICEOVER.map((l) => [l.start, l.start + l.raw / VO_RATE] as const);
const BED_LEN = 143.82; // measured: the author's track
const BED_GAP = 0.2; // volume between lines
const BED_VOICE = 0.085; // under the voice (track −10.9 LUFS → about −32 under a −16 voice)

const duck = (t: number) => {
  let d = 0;
  for (const [a, b] of VOICE) {
    const dist = t < a ? a - t : t > b ? t - b : 0;
    d = Math.max(d, 1 - Math.min(1, dist / 0.35));
  }
  return d;
};

const Bed: React.FC<{ from: number; startFrom: number; len: number; fadeIn: number; fadeOut: number }> = ({ from, startFrom, len, fadeIn, fadeOut }) => {
  const { fps } = useVideoConfig();
  return (
    <Sequence from={Math.round(from * fps)} durationInFrames={Math.round(len * fps)} name="music">
      <Audio
        src={staticFile("music/dev-myth/bed.mp3")}
        startFrom={Math.round(startFrom * fps)}
        volume={(f) => {
          const local = f / fps;
          const t = from + local;
          const env = Math.min(1, Math.max(0, local / fadeIn)) * Math.min(1, Math.max(0, (len - local) / fadeOut));
          const end = interpolate(t, [DURATION - 2.5, DURATION], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (BED_GAP - (BED_GAP - BED_VOICE) * duck(t)) * env * end;
        }}
      />
    </Sequence>
  );
};

/** Passes of the bed: the first from 0, the rest from 18 s, crossfading by `cross`, until the end (note 44). */
const PASSES = (() => {
  const out: { from: number; startFrom: number; len: number; fadeIn: number }[] = [];
  let t = 0;
  let src = 0;
  while (t < DURATION) {
    const len = Math.min(BED_LEN - src - 0.5, DURATION - t);
    out.push({ from: t, startFrom: src, len, fadeIn: t === 0 ? 0.4 : 2.5 });
    t += len - 2.5;
    src = 18;
    if (len < 3) break;
  }
  return out;
})();

export const SoundLayer: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <>
      {PASSES.map((p, i) => <Bed key={i} from={p.from} startFrom={p.startFrom} len={p.len} fadeIn={p.fadeIn} fadeOut={i === PASSES.length - 1 ? 0.1 : 2.5} />)}
      {CUES.filter(([t]) => t >= 0 && t < DURATION).map(([t, name, gain = 1], i) => (
        <Sequence key={i} from={Math.round(t * fps)} name={`sfx/${name}`}>
          <Audio src={staticFile(`sfx/dev-myth/${name}.wav`)} volume={LEVEL[name] * gain} />
        </Sequence>
      ))}
    </>
  );
};

export const _durations = DURATIONS;

/**
 * The same mix as data, for scripts/mix-audio.ts: a Remotion audio-only render
 * still walks every frame (≈40 frames/min on vibesrv for 4 600 frames), while
 * ffmpeg mixes these files in seconds. Keep it in step with SoundLayer above.
 */
export const MIX = {
  rate: VO_RATE,
  duration: DURATION,
  voice: VOICEOVER.map((l) => ({ file: `voiceover/dev-myth/${l.file}.mp3`, start: l.start, end: l.start + l.raw / VO_RATE })),
  bed: { file: "music/dev-myth/bed.mp3", len: BED_LEN, gap: BED_GAP, under: BED_VOICE, passes: PASSES, cross: 2.5, endFade: 2.5, duckRamp: 0.35 },
  cues: CUES.filter(([t]) => t >= 0 && t < DURATION).map(([t, name, gain = 1]) => ({ t, file: `sfx/dev-myth/${name}.wav`, vol: LEVEL[name] * gain })),
};
