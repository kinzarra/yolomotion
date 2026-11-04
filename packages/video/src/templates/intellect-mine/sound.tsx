// The sound layer (the author asked for a cinematic bed, 2026-11-04):
// «Lightless Dawn» (Kevin MacLeod, CC BY 4.0) under the voice, ducked while the
// voice speaks, plus a soft hit on each part card and on the two turns. Every
// cue comes from the timeline, so a retime moves the sound with the picture.
import React from "react";
import { Audio, Sequence, interpolate, staticFile, useVideoConfig } from "remotion";
import { CARD, DURATION, SCENES, VOICEOVER, VO_RATE, cue } from "./timeline";

type Sfx = "impact" | "whoosh-low" | "whoosh";
const LEVEL: Record<Sfx, number> = { impact: 0.3, "whoosh-low": 0.26, whoosh: 0.22 };
const CARDS = ["card1", "card2", "card3", "card4", "card5", "card6"] as const;

const CUES: [number, Sfx, number?][] = [
  [SCENES.hook.from + cue("hook", "интеллект"), "impact", 0.7],
  [SCENES.hook.from + cue("hook", "700"), "impact", 0.5],
  ...CARDS.flatMap((c) => [[SCENES[c].from + CARD.hit, "impact", 0.65], [SCENES[c].from + CARD.shatter, "whoosh-low", 0.8]] as [number, Sfx, number][]),
  [SCENES.final.from + cue("final", "ты"), "impact", 0.6],
];

const VOICE = VOICEOVER.map((l) => [l.start, l.start + l.raw / VO_RATE] as const);
const BED_GAP = 0.8; // between lines (track −24.3 LUFS → about −26)
const BED_VOICE = 0.36; // under the voice (≈ −33 LUFS under a −16 voice)
const duck = (t: number) => {
  let d = 0;
  for (const [a, b] of VOICE) {
    const dist = t < a ? a - t : t > b ? t - b : 0;
    d = Math.max(d, 1 - Math.min(1, dist / 0.35));
  }
  return d;
};

export const SoundLayer: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <>
      <Sequence from={0} durationInFrames={Math.round(DURATION * fps)} name="music">
        <Audio
          src={staticFile("music/intellect-mine/bed.mp3")}
          volume={(f) => {
            const t = f / fps;
            const env = Math.min(1, t / 0.6) * interpolate(t, [DURATION - 3, DURATION], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            return (BED_GAP - (BED_GAP - BED_VOICE) * duck(t)) * env;
          }}
        />
      </Sequence>
      {CUES.filter(([t]) => t >= 0 && t < DURATION).map(([t, name, gain = 1], i) => (
        <Sequence key={i} from={Math.round(t * fps)} name={`sfx/${name}`}>
          <Audio src={staticFile(`sfx/dev-myth/${name}.wav`)} volume={LEVEL[name] * gain} />
        </Sequence>
      ))}
    </>
  );
};
