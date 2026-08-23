// Motion kit for the concurrency Short. Every entrance moves 2–3 properties on
// a spring, every interpolate is eased and clamped, and all colors/easings come
// from theme + palette. Nothing is inlined per-scene.
import React from "react";
import {
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { theme } from "../../theme";
import { useIn, useRamp } from "../../reel";
import { rcColors, rcPalette } from "./palette";

/* -------------------------------------------------------------- shell */

export const SceneShell: React.FC<{
  children: React.ReactNode;
  exit?: boolean;
}> = ({ children, exit = true }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = frame / fps;
  // Exit is 7 frames — faster than any entrance in the scene.
  const out = exit
    ? interpolate(frame, [durationInFrames - 7, durationInFrames - 1], [0, 1], {
        easing: theme.ease.in,
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          inset: -90,
          opacity: 0.26,
          backgroundImage: `linear-gradient(${rcColors.line} 1px, transparent 1px), linear-gradient(90deg, ${rcColors.line} 1px, transparent 1px)`,
          backgroundSize: "84px 84px",
          transform: `translate(${Math.sin(t * 0.8) * 9}px, ${Math.cos(t * 0.65) * 11}px)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 980,
          height: 980,
          borderRadius: "50%",
          left: -420,
          top: 120,
          background: `radial-gradient(circle, ${rcColors.blue}3D, transparent 66%)`,
          transform: `translateY(${Math.sin(t * 0.9) * 28}px)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 860,
          height: 860,
          borderRadius: "50%",
          right: -400,
          bottom: 40,
          background: `radial-gradient(circle, ${rcPalette.primary}26, transparent 68%)`,
          transform: `translateY(${Math.cos(t * 0.72) * 24}px)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 1 - out * 0.8,
          transform: `translateY(${out * -34}px) scale(${1 + out * 0.024})`,
        }}
      >
        {children}
      </div>
    </div>
  );
};

/* --------------------------------------------------------------- type */

export const Eyebrow: React.FC<{
  children: React.ReactNode;
  delay?: number;
  color?: string;
}> = ({ children, delay = 0, color = rcPalette.accent }) => {
  const p = useIn(delay, "snappy");
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 14,
        opacity: p,
        transform: `translateX(${interpolate(p, [0, 1], [-28, 0])}px)`,
        fontFamily: theme.fonts.mono,
        color,
        fontSize: 26,
        fontWeight: 700,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          width: 28,
          height: 4,
          borderRadius: 2,
          background: color,
          transform: `scaleX(${p})`,
          transformOrigin: "left",
        }}
      />
      {children}
    </div>
  );
};

/** Large kinetic type: each word rises out of its own clipping mask. */
export const Kinetic: React.FC<{
  text: string;
  delay?: number;
  per?: number;
  size?: number;
  color?: string;
  weight?: number;
  align?: "flex-start" | "center";
  glow?: boolean;
  style?: React.CSSProperties;
}> = ({
  text,
  delay = 0,
  per = 3,
  size = 116,
  color = rcPalette.text,
  weight = 800,
  align = "flex-start",
  glow = false,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: align,
        columnGap: Math.round(size * 0.24),
        rowGap: Math.round(size * 0.04),
        fontFamily: theme.fonts.display,
        fontSize: size,
        fontWeight: weight,
        lineHeight: 1.02,
        letterSpacing: "-0.045em",
        color,
        // drop-shadow on the container, not text-shadow on the glyphs: each
        // word sits in an overflow:hidden mask so it can slide up, and a
        // text-shadow gets sliced into a visible rectangle at the mask edge.
        // A filter applies to the already-composited (already-clipped) result.
        filter: glow ? `drop-shadow(0 0 ${Math.round(size * 0.34)}px ${color}66)` : undefined,
        ...style,
      }}
    >
      {text.split(" ").map((word, i) => {
        const p = spring({
          frame: frame - delay - i * per,
          fps,
          config: theme.spring.snappy,
        });
        return (
          <span
            key={`${word}-${i}`}
            style={{
              display: "inline-block",
              overflow: "hidden",
              paddingBottom: Math.round(size * 0.11),
              marginBottom: Math.round(size * -0.11),
            }}
          >
            <span
              style={{
                display: "inline-block",
                opacity: p,
                transform: `translateY(${interpolate(p, [0, 1], [size * 1.05, 0])}px) skewY(${interpolate(p, [0, 1], [5, 0])}deg)`,
              }}
            >
              {word}
            </span>
          </span>
        );
      })}
    </div>
  );
};

/* ------------------------------------------------------------ surfaces */

export type Tone = "neutral" | "hero" | "blue" | "good" | "danger" | "req";

const toneBorder: Record<Tone, string> = {
  neutral: rcColors.line,
  hero: rcPalette.primary,
  blue: rcPalette.accent,
  good: rcColors.good,
  danger: rcColors.danger,
  req: rcColors.req,
};

const toneFill: Record<Tone, string> = {
  neutral: rcColors.surface,
  hero: rcColors.tint,
  blue: rcColors.blueSoft,
  good: rcColors.goodSoft,
  danger: rcColors.dangerSoft,
  req: rcColors.reqSoft,
};

export const toneColor = (tone: Tone) => toneBorder[tone];

export const Panel: React.FC<{
  delay?: number;
  tone?: Tone;
  glow?: boolean;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ delay = 0, tone = "neutral", glow = false, style, children }) => {
  const p = useIn(delay, "smooth");
  return (
    <div
      style={{
        borderRadius: 30,
        border: `1px solid ${toneBorder[tone]}`,
        background: toneFill[tone],
        boxShadow: glow
          ? `0 0 60px -6px ${toneBorder[tone]}66, ${rcColors.shadow}`
          : rcColors.shadow,
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [44, 0])}px) scale(${interpolate(p, [0, 1], [0.94, 1])})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const Chip: React.FC<{
  children: React.ReactNode;
  delay?: number;
  tone?: Tone;
  size?: number;
  dot?: boolean;
}> = ({ children, delay = 0, tone = "neutral", size = 28, dot = true }) => {
  const p = useIn(delay, "snappy");
  const color = tone === "neutral" ? rcPalette.textDim : toneBorder[tone];
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 14,
        padding: `${Math.round(size * 0.45)}px ${Math.round(size * 0.8)}px`,
        borderRadius: 999,
        border: `1px solid ${tone === "neutral" ? rcColors.line : color}`,
        background: toneFill[tone],
        fontFamily: theme.fonts.mono,
        fontSize: size,
        fontWeight: 700,
        letterSpacing: "0.04em",
        color,
        whiteSpace: "nowrap",
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [22, 0])}px) scale(${interpolate(p, [0, 1], [0.9, 1])})`,
      }}
    >
      {dot ? (
        <span
          style={{
            width: 12,
            height: 12,
            borderRadius: 6,
            background: color,
            boxShadow: tone === "neutral" ? undefined : `0 0 20px ${color}`,
            flexShrink: 0,
          }}
        />
      ) : null}
      {children}
    </div>
  );
};

/* ------------------------------------------------------------ concurrency */

/**
 * The contested row. `value` is the ticket count; `flash` pulses the border
 * when a request touches it. The number is the only warm figure on screen when
 * it is being fought over, so the eye always knows what is at stake.
 */
export const RowCard: React.FC<{
  value: React.ReactNode;
  delay?: number;
  tone?: Tone;
  flash?: number; // 0–1, a touch on the row
  label?: string;
  width?: number;
}> = ({ value, delay = 0, tone = "neutral", flash = 0, label = "tickets", width = 520 }) => {
  const p = useIn(delay, "smooth");
  const color = toneBorder[tone];
  return (
    <div
      style={{
        width,
        borderRadius: 28,
        border: `2px solid ${flash > 0 ? color : rcColors.lineStrong}`,
        background: rcColors.surfaceStrong,
        boxShadow: `0 0 ${40 + flash * 60}px -10px ${color}${flash > 0 ? "AA" : "22"}, ${rcColors.shadow}`,
        padding: "26px 34px",
        // Centred: the number is the subject of the shot, and a left-aligned
        // digit left most of the card empty.
        textAlign: "center",
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [30, 0])}px) scale(${interpolate(p, [0, 1], [0.94, 1]) * (1 + flash * 0.03)})`,
      }}
    >
      <div
        style={{
          fontFamily: theme.fonts.mono,
          fontSize: 24,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: rcPalette.textDim,
          marginBottom: 10,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: theme.fonts.display,
          fontSize: 96,
          fontWeight: 800,
          lineHeight: 1,
          letterSpacing: "-0.04em",
          color: rcPalette.text,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value}
      </div>
    </div>
  );
};

/**
 * A request travelling from a user down to the row. `progress` 0→1 walks the
 * head along the path and trails a beam behind it, so two of these on the same
 * frame read as genuinely simultaneous.
 */
export const RequestBeam: React.FC<{
  progress: number;
  color: string;
  x: number;
  top: number;
  height: number;
  label?: string;
  dir?: 1 | -1; // 1 = down to the row, -1 = back up to the user
}> = ({ progress, color, x, top, height, label, dir = 1 }) => {
  const len = Math.max(0, Math.min(1, progress)) * height;
  const headY = dir === 1 ? top + len : top + height - len;
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: x - 2,
          top: dir === 1 ? top : top + height - len,
          width: 4,
          height: len,
          borderRadius: 2,
          background: `linear-gradient(${dir === 1 ? 180 : 0}deg, ${color}00, ${color})`,
          boxShadow: `0 0 22px ${color}88`,
        }}
      />
      {progress > 0 && progress < 1.001 ? (
        <div
          style={{
            position: "absolute",
            left: x - 11,
            top: headY - 11,
            width: 22,
            height: 22,
            borderRadius: 11,
            background: color,
            boxShadow: `0 0 30px 6px ${color}`,
          }}
        />
      ) : null}
      {label && progress > 0.06 ? (
        <div
          style={{
            position: "absolute",
            left: x + 22,
            top: headY - 20,
            fontFamily: theme.fonts.mono,
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: "0.06em",
            color,
            whiteSpace: "nowrap",
            opacity: Math.min(1, progress * 4),
          }}
        >
          {label}
        </div>
      ) : null}
    </>
  );
};

/** User panel with a BUY button that can be slammed. */
export const UserCard: React.FC<{
  name: string;
  tone: Tone;
  delay?: number;
  pressed?: number; // 0–1 slam envelope
  state?: string; // replaces the button label once resolved
  stateTone?: Tone;
  width?: number;
}> = ({ name, tone, delay = 0, pressed = 0, state, stateTone, width = 400 }) => {
  const color = toneBorder[tone];
  const resolved = state ? toneBorder[stateTone ?? tone] : color;
  return (
    <Panel delay={delay} tone={tone} glow={pressed > 0.2} style={{ width, padding: "30px 30px 34px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
        <span
          style={{
            width: 54,
            height: 54,
            borderRadius: 27,
            flexShrink: 0,
            background: `linear-gradient(140deg, ${color}, ${color}55)`,
            boxShadow: `0 0 26px -6px ${color}`,
          }}
        />
        <span
          style={{
            fontFamily: theme.fonts.display,
            fontSize: 40,
            fontWeight: 800,
            letterSpacing: "-0.02em",
            color: rcPalette.text,
          }}
        >
          {name}
        </span>
      </div>
      <div
        style={{
          height: 88,
          borderRadius: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: theme.fonts.display,
          fontSize: state ? 34 : 42,
          fontWeight: 800,
          letterSpacing: state ? "0.02em" : "0.06em",
          color: state ? resolved : rcPalette.bg,
          background: state ? "transparent" : color,
          border: state ? `2px solid ${resolved}` : "none",
          boxShadow: pressed > 0 && !state ? `0 0 ${pressed * 70}px ${color}` : undefined,
          // The slam: the button dips into the card rather than scaling up.
          transform: `translateY(${pressed * 6}px) scale(${1 - pressed * 0.045})`,
        }}
      >
        {state ?? "BUY"}
      </div>
    </Panel>
  );
};

/**
 * Skull mark for the double-sale slam. Drawn, not an emoji: platform emoji
 * render in their own colors and would break the one-hero-color rule.
 */
export const Skull: React.FC<{ size?: number; color?: string; opacity?: number }> = ({
  size = 96,
  color = rcColors.danger,
  opacity = 1,
}) => (
  <svg width={size} height={size} viewBox="0 0 64 64" style={{ opacity, flexShrink: 0 }}>
    <path
      d="M32 6C19.3 6 9 15.6 9 27.5c0 6.6 3.2 12.4 8.2 16.2v6.8c0 2 1.7 3.5 3.7 3.5h22.2c2 0 3.7-1.6 3.7-3.5v-6.8C51.8 39.9 55 34.1 55 27.5 55 15.6 44.7 6 32 6Z"
      fill="none"
      stroke={color}
      strokeWidth={3.4}
      strokeLinejoin="round"
    />
    <circle cx="23" cy="28" r="6" fill={color} />
    <circle cx="41" cy="28" r="6" fill={color} />
    <path d="M32 36l-3.4 7h6.8L32 36Z" fill={color} />
    <path d="M25 50v4M32 50v4M39 50v4" stroke={color} strokeWidth={3.4} strokeLinecap="round" />
  </svg>
);

/** Full-frame colour flash, for impacts. Never longer than a few frames. */
export const Flash: React.FC<{ amount: number; color?: string }> = ({
  amount,
  color = rcColors.danger,
}) =>
  amount <= 0 ? null : (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: color,
        mixBlendMode: "screen",
        opacity: amount * 0.28,
        pointerEvents: "none",
      }}
    />
  );

/* --------------------------------------------------------------- brand */

export const VibeMark: React.FC<{ size?: number; delay?: number }> = ({
  size = 56,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = useIn(delay, "bouncy");
  const breathe = 1 + Math.sin((frame / fps) * 2.1) * 0.015;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.28,
        overflow: "hidden",
        flexShrink: 0,
        background: rcPalette.text,
        opacity: p,
        transform: `scale(${interpolate(p, [0, 1], [0.6, breathe])}) rotate(${interpolate(p, [0, 1], [-12, 0])}deg)`,
      }}
    >
      <Img
        src={staticFile("images/vibe-cloud-logo.png")}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          // The source PNG has generous padding; crop in so the mark still
          // reads at brand-bar size.
          transform: "scale(1.22)",
        }}
      />
    </div>
  );
};

/** Persistent, deliberately quiet series strip — keeps the Short readable muted. */
export const BrandBar: React.FC<{ brandName: string; chapter: string }> = ({
  brandName,
  chapter,
}) => {
  const p = useIn(-3, "smooth");
  return (
    <div
      style={{
        position: "absolute",
        left: 82,
        right: 82,
        top: 116,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        opacity: p * 0.85,
        transform: `translateY(${interpolate(p, [0, 1], [-18, 0])}px)`,
        fontFamily: theme.fonts.mono,
        fontSize: 23,
        letterSpacing: "0.14em",
        color: rcPalette.textDim,
      }}
    >
      <span style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <VibeMark size={46} delay={-3} />
        <span
          style={{
            fontFamily: theme.fonts.display,
            fontSize: 27,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: rcPalette.text,
          }}
        >
          {brandName}
        </span>
      </span>
      <span>{chapter}</span>
    </div>
  );
};

export { useIn, useRamp };
