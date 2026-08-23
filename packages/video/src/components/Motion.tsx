// Motion primitives. Rules: no linear easing, entrances animate 2–3 properties,
// exits are faster than entrances, everything staggers, always clamp.
import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { theme } from "../theme";

// The workhorse: fade + rise + scale on a smooth spring.
export const Entrance: React.FC<{
  delay?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ delay = 0, children, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: theme.spring.smooth });
  return (
    <div
      style={{
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [40, 0])}px) scale(${interpolate(p, [0, 1], [0.94, 1])})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const WordReveal: React.FC<{
  text: string;
  delay?: number;
  per?: number; // frames between words, 3–6
  style?: React.CSSProperties;
}> = ({ text, delay = 0, per = 3, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.26em", ...style }}>
      {text.split(" ").map((word, i) => {
        const p = spring({
          frame: frame - delay - i * per,
          fps,
          config: theme.spring.snappy,
        });
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: p,
              transform: `translateY(${interpolate(p, [0, 1], [30, 0])}px)`,
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};

// Wrap a whole scene: rises and fades out over the final ~12 frames.
export const SceneExit: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const y = interpolate(
    frame,
    [durationInFrames - 12, durationInFrames - 2],
    [0, -42],
    {
      easing: theme.ease.in,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );
  const opacity = interpolate(
    frame,
    [durationInFrames - 12, durationInFrames - 2],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        opacity,
        transform: `translateY(${y}px)`,
      }}
    >
      {children}
    </div>
  );
};

// Idle micro-motion for anything on screen longer than ~2s.
export const useBreathe = (amount = 0.015, speed = 22) => {
  const frame = useCurrentFrame();
  return 1 + Math.sin(frame / speed) * amount;
};

export const useFloat = (px = 3, speed = 30) => {
  const frame = useCurrentFrame();
  return Math.sin(frame / speed) * px;
};
