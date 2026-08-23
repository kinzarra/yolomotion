// Shared chrome for the promo: window frames, step label, per-scene exit.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { vibe } from "./palette";

// Scene-local exit (SceneExit from components/ keys off composition length;
// scenes here live inside Sequences, so the exit needs the scene length).
export const ExitWrap: React.FC<{ len: number; children: React.ReactNode }> = ({
  len,
  children,
}) => {
  const frame = useCurrentFrame();
  const y = interpolate(frame, [len - 12, len - 2], [0, -42], {
    easing: theme.ease.in,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(frame, [len - 12, len - 2], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
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

export const WindowFrame: React.FC<{
  width: number;
  title?: React.ReactNode;
  children: React.ReactNode;
  bar?: React.ReactNode; // extra title-bar content (e.g. URL field)
}> = ({ width, title, bar, children }) => (
  <div
    style={{
      width,
      borderRadius: 18,
      overflow: "hidden",
      border: "1px solid rgba(255,255,255,0.09)",
      background: vibe.bgAlt,
      boxShadow: "0 50px 100px -30px rgba(0,0,0,0.7)",
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 18,
        padding: "16px 22px",
        background: "rgba(255,255,255,0.04)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <div style={{ display: "flex", gap: 9 }}>
        {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
          <div
            key={c}
            style={{ width: 14, height: 14, borderRadius: 7, background: c }}
          />
        ))}
      </div>
      {title ? (
        <div
          style={{
            fontFamily: theme.fonts.body,
            fontSize: 19,
            fontWeight: 500,
            color: vibe.textDim,
          }}
        >
          {title}
        </div>
      ) : null}
      {bar}
    </div>
    {children}
  </div>
);

// Positioned by the caller; no absolute here so it can sit inside <Entrance>.
export const StepLabel: React.FC<{ n: string; word: string }> = ({
  n,
  word,
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "baseline",
      gap: 14,
      fontFamily: theme.fonts.display,
      letterSpacing: "0.18em",
      textTransform: "uppercase",
    }}
  >
    <span style={{ fontSize: 26, fontWeight: 700, color: vibe.primary }}>
      {n}
    </span>
    <span style={{ fontSize: 26, fontWeight: 500, color: vibe.textDim }}>
      {word}
    </span>
  </div>
);
