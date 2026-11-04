// The series kit, plus the two pieces this episode adds: a 16:9 clip
// reframed to 9:16 by tracking its subject, and the face placeholder.
import React from "react";
import { Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../theme";
import { colors, palette } from "./palette";

export * from "../digital-ruble/ui";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const linearAt = (pts: [number, number][], t: number) =>
  pts.length > 1 ? interpolate(t, pts.map(([s]) => s), pts.map(([, v]) => v), clamp) : pts[0][1];

/** Box-averaged linear path: a steady camera move through measured points. */
const smoothPath = (pts: [number, number][], t: number, half = 0.4, n = 17) => {
  let sum = 0;
  for (let i = 0; i < n; i++) sum += linearAt(pts, t - half + (2 * half * i) / (n - 1));
  return sum / n;
};

/**
 * A landscape clip filling the vertical frame: scaled to full height, then
 * panned so `track` (clip seconds → subject x, 0..1 of the source width)
 * stays centred; `drop` pushes it down when the subject sits high. Lives inside a <Sequence> that starts the clip at 0.
 */
export const TrackedClip: React.FC<{
  src: string;
  track: [number, number][];
  /** clip seconds → px the picture is pushed down (subject high in the source) */
  drop?: [number, number][];
  push?: number;
  /** clip second to start on, and playback rate (slow motion < 1) */
  from?: number;
  rate?: number;
  /** >1 crops tighter into the source (a small subject in a wide shot) */
  zoom?: number;
}> = ({ src, track, drop = [[0, 0]], push = 0.06, from = 0, rate = 1, zoom = 1 }) => {
  const frame = useCurrentFrame();
  const { fps, width, height, durationInFrames } = useVideoConfig();
  const t = from + (frame / fps) * rate;
  const h = height * zoom;
  const w = (h * 16) / 9;
  // camera smoothing, not an animation curve: a linear path through the
  // measured points, averaged over ±0.4 s — per-segment easing stopped and
  // started the pan at every point and read as the car shaking (author note 2)
  const x = smoothPath(track, t);
  const top = smoothPath(drop, t);
  const left = Math.min(0, Math.max(width - w, width / 2 - x * w));
  const scale = interpolate(frame, [0, durationInFrames], [1, 1 + push], { easing: theme.ease.out, ...clamp });
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", transform: `scale(${scale})` }}>
      {/* the same clip, blurred, under the gap a drop opens at the edges */}
      {top !== 0 && (
        <OffthreadVideo
          src={staticFile(src)}
          startFrom={Math.round(from * fps)}
          playbackRate={rate}
          muted
          style={{
            position: "absolute",
            inset: 0,
            width,
            height,
            objectFit: "cover",
            filter: "blur(36px) brightness(0.55)",
            transform: "scale(1.2)",
          }}
        />
      )}
      <OffthreadVideo
        src={staticFile(src)}
        startFrom={Math.round(from * fps)}
        playbackRate={rate}
        muted
        style={{
          position: "absolute",
          top,
          left,
          width: w,
          height: h,
          maxWidth: "none",
          // Tesla graded the night shots dark — lift them so the car reads on a phone
          filter: "brightness(1.35) contrast(1.12) saturate(1.1)",
        }}
      />
    </div>
  );
};

/** Stand-in for the author's own shot until he films it. */
export const FacePlaceholder: React.FC<{ label?: string }> = ({ label = "ЛИЦО АВТОРА · СНИМЕТ САМ" }) => {
  const frame = useCurrentFrame();
  const breathe = 1 + Math.sin(frame / 18) * 0.01;
  return (
    <div style={{ position: "absolute", inset: 0, background: colors.surfaceLift }}>
      <svg
        viewBox="0 0 1080 1920"
        style={{ position: "absolute", inset: 0, transform: `scale(${breathe})`, transformOrigin: "50% 60%" }}
      >
        <circle cx={540} cy={640} r={190} fill={colors.surfaceStrong} stroke={colors.lineStrong} strokeWidth={4} />
        <path
          d="M150 1500 C170 1050 360 900 540 900 C720 900 910 1050 930 1500 Z"
          fill={colors.surfaceStrong}
          stroke={colors.lineStrong}
          strokeWidth={4}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 48,
          border: `3px dashed ${colors.lineStrong}`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 330,
          textAlign: "center",
          fontFamily: theme.fonts.mono,
          fontSize: 30,
          fontWeight: 700,
          letterSpacing: "0.16em",
          color: palette.textDim,
        }}
      >
        {label}
      </div>
    </div>
  );
};

/** Red «no entry» road sign, drawn — no emoji, no clip art. */
export const NoEntry: React.FC<{ size?: number }> = ({ size = 260 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "block" }}>
    <circle cx={50} cy={50} r={48} fill={colors.white} />
    <circle cx={50} cy={50} r={44} fill={colors.bad} />
    <rect x={18} y={42} width={64} height={16} rx={2} fill={colors.white} />
  </svg>
);

/**
 * A still filling the frame with Ken Burns (1 → 1.08 and a slow pan), graded
 * warm and a little faded: these are the 2017 promises, not today.
 */
export const ArchivePhoto: React.FC<{ src: string; focus?: string; pan?: number }> = ({
  src,
  focus = "50% 50%",
  pan = 40,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = interpolate(frame, [0, durationInFrames], [0, 1], { easing: theme.ease.inOut, ...clamp });
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <Img
        src={staticFile(src)}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: focus,
          transform: `scale(${1.04 + p * 0.08}) translateX(${(p - 0.5) * pan}px)`,
          filter: "sepia(0.32) saturate(0.9) contrast(1.05) brightness(0.85)",
        }}
      />
    </div>
  );
};

/**
 * The HeyGen face, full-screen. The photo look comes back as a 16:9 picture
 * letterboxed in white inside a 9:16 file (rows 656–1263), so the band is
 * scaled up to fill most of the frame and the same clip, blurred, fills the
 * rest. Lip-synced to the voiceover slice: play at the voice's rate.
 */
const BAND_TOP = 656;
const BAND_H = 608;

export const FaceShot: React.FC<{ src: string; rate?: number; scale?: number; top?: number }> = ({
  src,
  rate = 1,
  scale = 2.4,
  top = 230,
}) => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();
  const push = 1 + interpolate(frame, [0, 90], [0, 0.04], { easing: theme.ease.out, ...clamp });
  const w = width * scale;
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: colors.ink2 }}>
      <OffthreadVideo
        src={staticFile(src)}
        playbackRate={rate}
        muted
        style={{
          position: "absolute",
          left: (width - width * 3.2) / 2,
          top: 960 - (BAND_TOP + BAND_H / 2) * 3.2,
          width: width * 3.2,
          height: 1920 * 3.2,
          maxWidth: "none",
          filter: "blur(40px) brightness(0.5)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top,
          height: BAND_H * scale,
          overflow: "hidden",
          transform: `scale(${push})`,
          boxShadow: colors.shadow,
        }}
      >
        <OffthreadVideo
          src={staticFile(src)}
          playbackRate={rate}
          muted
          style={{
            position: "absolute",
            left: (width - w) / 2,
            top: -BAND_TOP * scale,
            width: w,
            height: 1920 * scale,
            maxWidth: "none",
          }}
        />
      </div>
    </div>
  );
};
