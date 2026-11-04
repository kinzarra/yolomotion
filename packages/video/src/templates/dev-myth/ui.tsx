// Landscape (1920×1080) additions to the series kit. Everything portrait-only
// in the chain (SpeedLines, Numbers, BrandBar) gets a wide twin here; the rest
// (SceneShell, Kinetic, Stamp, Flash, Glitch, FlyIn, Slam, Label, Cross) is
// position-agnostic and comes straight from the chain.
import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../theme";
import { useIn } from "../../reel";
import { rnd } from "../digital-ruble/ui";
import { devMythColors as colors, devMythPalette as palette } from "./palette";
import { richText } from "./sym";

export * from "../serbia-economy/ui";

export const WIDE = `${theme.fonts.wide}, ${theme.fonts.mono}`;
export const STAGE = { w: 1920, h: 1080 } as const;
export const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const S = (seconds: number, fps: number) => Math.round(seconds * fps);

/** Series tag top-left, the episode note top-right, a hairline between (wide). */
export const TopBar: React.FC<{ left: string; right: string; delay?: number }> = ({ left, right, delay = 0 }) => {
  const p = useIn(delay, "snappy");
  const frame = useCurrentFrame();
  const blink = Math.sin(frame / 9) > 0.2 ? 1 : 0.25;
  return (
    <div style={{ position: "absolute", left: 96, right: 96, top: 56, zIndex: 12, display: "flex", alignItems: "center", gap: 20, fontFamily: theme.fonts.mono, fontSize: 24, fontWeight: 700, letterSpacing: "0.16em", color: palette.textDim, opacity: p, transform: `translateY(${interpolate(p, [0, 1], [-16, 0])}px)` }}>
      <span style={{ width: 12, height: 12, background: palette.primary, opacity: blink }} />
      <span style={{ color: palette.text }}>{left}</span>
      <span style={{ flex: 1, height: 1, background: colors.line }} />
      <span>{right}</span>
    </div>
  );
};

/** Faint figures drifting up the whole wide frame: the data weather behind a beat. */
export const Drift: React.FC<{ items: string[]; opacity?: number }> = ({ items, opacity = 0.18 }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none" }}>
      {Array.from({ length: 16 }, (_, k) => {
        const y = STAGE.h + 40 - ((frame * (2 + (k % 3)) + k * 150) % (STAGE.h + 200));
        const x = 40 + ((k * 233) % (STAGE.w - 160));
        return (
          <div key={k} style={{ position: "absolute", left: x, top: y, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 28 + (k % 3) * 12, color: k % 4 === 0 ? colors.bad : palette.primary, opacity }}>
            {richText(items[k % items.length])}
          </div>
        );
      })}
    </div>
  );
};

/** Radial speed lines on the wide stage, 14 frames, for a slam. */
export const Burst: React.FC<{ at: number; x: number; y: number; color?: string; count?: number }> = ({ at, x, y, color = palette.primary, count = 30 }) => {
  const frame = useCurrentFrame();
  const k = frame - at;
  if (k < 0 || k > 14) return null;
  const p = interpolate(k, [0, 14], [0, 1], { easing: theme.ease.out, ...cl });
  return (
    <svg width={STAGE.w} height={STAGE.h} style={{ position: "absolute", inset: 0, zIndex: 8, pointerEvents: "none" }}>
      {Array.from({ length: count }, (_, i) => {
        const a = (i / count) * Math.PI * 2 + rnd(i * 3) * 0.2;
        const r0 = 140 + p * 420;
        const r1 = r0 + 180 + rnd(i) * 240 * (1 - p);
        return <line key={i} x1={x + Math.cos(a) * r0} y1={y + Math.sin(a) * r0} x2={x + Math.cos(a) * r1} y2={y + Math.sin(a) * r1} stroke={color} strokeWidth={6 + rnd(i * 7) * 8} strokeLinecap="round" opacity={1 - p} />;
      })}
    </svg>
  );
};

/** A red rule drawn through a figure that just lost: scaleX 0 → 1 from the left. */
export const Strike: React.FC<{ at: number; width: number; thick?: number; style?: React.CSSProperties }> = ({ at, width, thick = 14, style }) => {
  const p = useIn(at, "snappy");
  return <div style={{ position: "absolute", width, height: thick, background: colors.bad, transformOrigin: "left center", transform: `rotate(-6deg) scaleX(${p})`, boxShadow: `0 0 24px ${colors.badGlow}`, ...style }} />;
};

/**
 * The Claude Code window: a dark card with a title bar, lines typed one
 * character a frame from `at`, a block cursor blinking at the end. Lines are
 * typed in order; a line marked `instant` lands whole once its turn comes.
 */
export const Terminal: React.FC<{ at: number; width: number; lines: { text: string; dim?: boolean; instant?: boolean }[]; speed?: number }> = ({ at, width, lines, speed = 1.4 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const k = Math.max(0, frame - at - Math.round(fps * 0.2));
  let budget = Math.floor(k * speed);
  const shown = lines.map((l) => {
    if (budget <= 0) return { ...l, out: "" };
    const n = l.instant ? (budget > 0 ? l.text.length : 0) : Math.min(l.text.length, budget);
    budget -= l.instant ? 6 : n;
    return { ...l, out: l.text.slice(0, n) };
  });
  const typing = shown.findIndex((l) => l.out.length < l.text.length);
  const blink = Math.floor(frame / 8) % 2 === 0;
  return (
    <div style={{ width, background: colors.surfaceStrong, border: `2px solid ${colors.lineStrong}`, boxShadow: colors.shadow, fontFamily: theme.fonts.mono, overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 20px", background: colors.surfaceLift, borderBottom: `1px solid ${colors.line}` }}>
        {[0, 1, 2].map((i) => <span key={i} style={{ width: 14, height: 14, borderRadius: 7, background: i === 0 ? colors.bad : colors.lineStrong }} />)}
        <span style={{ marginLeft: 12, fontSize: 22, fontWeight: 700, letterSpacing: "0.1em", color: palette.textDim }}>claude</span>
      </div>
      <div style={{ padding: "22px 26px 26px", fontSize: 30, lineHeight: 1.45, color: palette.text, minHeight: 60 }}>
        {shown.map((l, i) =>
          l.out.length === 0 && i !== 0 && typing !== i ? null : (
            <div key={i} style={{ color: l.dim ? palette.textDim : palette.text, whiteSpace: "pre-wrap", fontWeight: l.dim ? 500 : 700 }}>
              {richText(l.out)}
              {typing === i && blink && <span style={{ display: "inline-block", width: 16, height: 32, background: palette.text, verticalAlign: "-4px", marginLeft: 2 }} />}
            </div>
          ),
        )}
      </div>
    </div>
  );
};

/** mm:ss in lime mono, racing: `rate` scene-seconds of display per real second. */
export const Stopwatch: React.FC<{ at: number; rate?: number; size?: number; color?: string }> = ({ at, rate = 60, size = 44, color = palette.primary }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sec = Math.max(0, (frame - at) / fps) * rate;
  const mm = String(Math.floor(sec / 60)).padStart(2, "0");
  const ss = String(Math.floor(sec % 60)).padStart(2, "0");
  const colon = Math.floor(frame / 4) % 2 === 0 ? ":" : " ";
  return (
    <span style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: size, fontVariantNumeric: "tabular-nums", letterSpacing: "0.04em", color, textShadow: `0 0 ${size * 0.5}px ${palette.glow}` }}>
      {mm}{colon}{ss}
    </span>
  );
};

/** A paper month: 30 cells, crossed out one by one as `day` runs 0 → 30. */
export const Calendar: React.FC<{ day: number; title: string; width?: number }> = ({ day, title, width = 320 }) => {
  const cell = Math.floor((width - 36) / 7);
  return (
    <div style={{ width, padding: 18, background: colors.paper, color: colors.ink, fontFamily: theme.fonts.mono, boxShadow: colors.paperShadow }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 20, fontWeight: 800, letterSpacing: "0.14em", color: colors.inkFaded, marginBottom: 10 }}>
        <span>{title}</span>
        <span>{Math.min(30, Math.max(0, Math.floor(day)))} / 30</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(7, ${cell}px)`, gap: 0 }}>
        {Array.from({ length: 35 }, (_, i) => {
          const d = i + 1;
          const gone = d <= 30 && d <= day;
          const off = d > 30;
          return (
            <div key={i} style={{ position: "relative", width: cell, height: cell, border: `1px solid ${colors.inkRule}`, fontSize: 15, fontWeight: 700, color: off ? "transparent" : colors.ink, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {off ? "" : d}
              {gone && <div style={{ position: "absolute", inset: 3, background: `linear-gradient(45deg, transparent 44%, ${colors.bad} 44%, ${colors.bad} 56%, transparent 56%), linear-gradient(-45deg, transparent 44%, ${colors.bad} 44%, ${colors.bad} 56%, transparent 56%)` }} />}
            </div>
          );
        })}
      </div>
    </div>
  );
};
