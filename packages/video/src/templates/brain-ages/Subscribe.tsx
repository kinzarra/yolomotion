// The standard end reminder (author 2026-10-26), drawn in this reel's quiet
// style: «Подписаться» is pressed and becomes «Вы подписаны», the bell swings,
// the like counts up, a comment bubble asks the question. No hand.
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { ease, fonts, palette, springs } from "./palette";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const Bell: React.FC<{ swing: number; color: string }> = ({ swing, color }) => (
  <svg width={40} height={40} viewBox="0 0 24 24" style={{ transform: `rotate(${swing}deg)`, transformOrigin: "50% 10%" }}>
    <path d="M12 3a6 6 0 0 0-6 6v4l-1.6 2.6a.6.6 0 0 0 .5.9h14.2a.6.6 0 0 0 .5-.9L18 13V9a6 6 0 0 0-6-6Z" fill={color} />
    <path d="M9.8 19a2.3 2.3 0 0 0 4.4 0" stroke={color} strokeWidth={1.8} fill="none" strokeLinecap="round" />
  </svg>
);
const Thumb: React.FC<{ color: string }> = ({ color }) => (
  <svg width={36} height={36} viewBox="0 0 24 24">
    <path d="M2 10h4v11H2zM8 21h9.2a2 2 0 0 0 2-1.6l1.4-7A2 2 0 0 0 18.6 10H14l.8-4.2A1.8 1.8 0 0 0 13 3.6L8 10z" fill={color} />
  </svg>
);
const Bubble: React.FC<{ color: string }> = ({ color }) => (
  <svg width={34} height={34} viewBox="0 0 24 24">
    <path d="M4 4h16a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H9l-4.4 3.5A.4.4 0 0 1 4 20.2V17a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z" fill={color} />
  </svg>
);

export const Subscribe: React.FC<{ at: number; question: string; top: number }> = ({ at, question, top }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const k = frame - at;
  if (k < 0) return null;
  const inP = spring({ frame: k, fps, config: springs.soft });
  const press = Math.round(0.7 * fps);
  const pressed = k >= press;
  const squish = interpolate(k, [press - 3, press, press + 6], [1, 0.9, 1], { ...clamp, easing: ease.out });
  const swing = pressed ? Math.sin((k - press) / 2) * interpolate(k - press, [0, 30], [22, 0], clamp) : 0;
  const likeP = spring({ frame: k - press - 8, fps, config: springs.pop });
  const likes = Math.round(interpolate(k - press - 8, [0, 24], [0, 999], { ...clamp, easing: ease.out }));
  const comP = spring({ frame: k - press - 16, fps, config: springs.pop });
  const pill = (bg: string, extra: React.CSSProperties = {}): React.CSSProperties => ({
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "16px 30px",
    borderRadius: 60,
    background: bg,
    fontFamily: fonts.label,
    fontWeight: 600,
    ...extra,
  });
  return (
    <div
      style={{
        position: "absolute",
        left: 110,
        right: 110,
        top,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 18,
        opacity: inP,
        transform: `translateY(${(1 - inP) * 60}px)`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div
          style={pill(pressed ? "rgba(255,255,255,0.12)" : "#f2f0ea", {
            fontSize: 36,
            color: pressed ? palette.text : "#0a1129",
            transform: `scale(${squish})`,
            border: pressed ? "1.5px solid rgba(255,255,255,0.22)" : "none",
          })}
        >
          {pressed ? "Вы подписаны" : "Подписаться"}
        </div>
        <div style={pill("rgba(255,255,255,0.12)", { padding: 16, border: "1.5px solid rgba(255,255,255,0.22)" })}>
          <Bell swing={swing} color={pressed ? palette.now : palette.text} />
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={pill("rgba(255,255,255,0.10)", { fontSize: 30, color: palette.text, opacity: likeP, transform: `scale(${0.6 + 0.4 * likeP})` })}>
          <Thumb color={palette.now} />
          <span style={{ fontVariantNumeric: "tabular-nums" }}>{likes >= 999 ? "1K" : likes}</span>
        </div>
        <div style={pill("rgba(255,255,255,0.10)", { fontSize: 30, color: palette.text, opacity: comP, transform: `scale(${0.6 + 0.4 * comP})` })}>
          <Bubble color={palette.text} />
          {question}
        </div>
      </div>
    </div>
  );
};
