// The shell every voiceover reel shares: background, the voiceover track,
// the scene stack, captions above the cuts, then grade → grain → vignette on
// top (rule 5 of the motion skill, applied once instead of per template).
//
// A template supplies only what is actually its own: the palette, the
// timeline, and the scenes.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig } from "remotion";
import { BgMesh, Grade, Grain, Vignette } from "../components/Layers";
import { Palette } from "../theme";
import { Captions, CaptionStyle } from "./Captions";
import { SceneSpec, VoLine, VoTrackLine, sceneFrames, voiceoverEnd } from "./timeline";

// Voiceover only — no music bed, no SFX. Clips are normalised to -16 LUFS by
// scripts/gen-voiceover.mjs, so they need no extra gain.
// A bare name resolves inside the bundled public/; an absolute URL is used
// as-is. The URL form is what server render jobs pass: per-job clips live in
// object storage, not in the bundle, and re-bundling per job just to move
// audio would defeat the cached-bundle worker.
const clipSrc = (dir: string, file: string): string =>
  /^https?:\/\//.test(dir)
    ? `${dir.replace(/\/$/, "")}/${file}.mp3`
    : staticFile(`voiceover/${dir}/${file}.mp3`);

export const VoiceoverTrack: React.FC<{
  dir: string; // public/voiceover/<dir>/, or an absolute http(s) base URL
  lines: readonly VoTrackLine[];
  rate: number;
  // Clips normalised by gen-voiceover.mjs need no gain. Only older clips
  // recorded before that pass existed do.
  volume?: number;
}> = ({ dir, lines, rate, volume = 1 }) => {
  const { fps } = useVideoConfig();
  return (
    <>
      {lines.map(({ file, start }) => (
        <Sequence key={file} from={Math.round(start * fps)} name={`vo/${file}`}>
          <Audio src={clipSrc(dir, file)} playbackRate={rate} volume={volume} />
        </Sequence>
      ))}
    </>
  );
};

// One beat of the timeline. Takes seconds, converts to frames once.
export const Scene: React.FC<{
  spec: SceneSpec;
  name: string;
  children: React.ReactNode;
}> = ({ spec, name, children }) => {
  const { fps } = useVideoConfig();
  return (
    <Sequence {...sceneFrames(spec, fps)} name={name}>
      {children}
    </Sequence>
  );
};

type ReelBase = {
  palette: Palette;
  voiceoverDir: string;
  voRate: number;
  voVolume?: number; // only for clips predating loudness normalisation
  bgMesh?: boolean; // drifting mesh under the scenes, for reels whose scenes
  // do not paint their own full-frame background
  gradeOpacity?: number;
  // A look (src/looks) replaces the background and the finishing stack as a
  // whole; without one the reel keeps the default mesh + grade/grain/vignette.
  backdrop?: React.ReactNode;
  finish?: React.ReactNode;
  children: React.ReactNode;
};

// Captions need the caption pages and the measured clip length; the bare
// voiceover track does not. Splitting the props on `captions` means a reel
// that carries its type in the scenes never has to invent empty pages.
export type ReelProps =
  | (ReelBase & {
      captions: false;
      voiceover: readonly (VoTrackLine & { raw?: number })[];
    })
  | (ReelBase & { captions?: CaptionStyle; voiceover: VoLine[] });

// Narrowing happens on `props`, not on destructured locals — destructuring a
// discriminated union drops the link between `captions` and `voiceover`.
// A line whose audio runs past the end of the composition is simply cut off —
// silently, and only in the finished mp4. Catch it at render time instead.
const useFitsCheck = (
  dir: string,
  lines: readonly VoTrackLine[],
  rate: number,
) => {
  const { fps, durationInFrames } = useVideoConfig();
  const total = durationInFrames / fps;
  const measured = lines.filter(
    (l): l is VoTrackLine & { raw: number } => typeof (l as { raw?: number }).raw === "number",
  );
  if (measured.length === 0) return;
  const end = voiceoverEnd(measured, rate);
  if (end > total + 0.02) {
    console.warn(
      `[reel] ${dir}: the voiceover runs to ${end.toFixed(2)}s but the ` +
        `composition ends at ${total.toFixed(2)}s — the last ` +
        `${(end - total).toFixed(2)}s of speech will be cut off. Lengthen the ` +
        `final scene in timeline.ts.`,
    );
  }
};

export const Reel: React.FC<ReelProps> = (props) => {
  const {
    palette,
    voiceoverDir,
    voRate,
    voVolume,
    bgMesh = false,
    gradeOpacity = 0.1,
    backdrop,
    finish,
    children,
  } = props;
  useFitsCheck(voiceoverDir, props.voiceover, voRate);
  return (
    <AbsoluteFill style={{ backgroundColor: palette.bg }}>
      <VoiceoverTrack
        dir={voiceoverDir}
        lines={props.voiceover}
        rate={voRate}
        volume={voVolume}
      />

      {backdrop ?? (bgMesh && <BgMesh palette={palette} />)}
      {children}

      {/* Captions span scene cuts, so they live above the scenes. */}
      {props.captions !== false && (
        <Captions
          voiceover={props.voiceover}
          rate={voRate}
          palette={palette}
          {...(props.captions ?? {})}
        />
      )}

      {finish ?? (
        <>
          <Grade palette={palette} opacity={gradeOpacity} />
          <Grain />
          <Vignette />
        </>
      )}
    </AbsoluteFill>
  );
};
