// Motion kit for "Why AI ads cost brands more".
//
// The editorial grammar — SceneShell, Kinetic, Slam, Eyebrow, Mono, Num, Rule,
// Strike, Tag, Flash, the Yoloco mark — is khaby-silence's and is re-exported
// wholesale rather than re-invented. Only what this story needs that that one
// did not is defined below: money escalation, abstract creators, comment
// cards, a cracked word, drawn marks, and the field of hundreds of creators
// that the ending resolves.
//
// Every repeated thing here is a component, not a `.map()` body, because
// useIn/useRamp read the frame — they are hooks and cannot be called in a loop
// body or behind a `?:`. Where one item needs several ramps, the component
// reads useCurrentFrame() once and uses the plain `ramp()` helper.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { bpmColors, bpmPalette } from "./palette";
import { useIn } from "../khaby-silence/ui";

export * from "../khaby-silence/ui";

/* --------------------------------------------------------------- helpers */

/** Eased, clamped 0→1 ramp for code paths that already hold the frame. */
export const ramp = (
  frame: number,
  from: number,
  to: number,
  easing = theme.ease.out,
) =>
  interpolate(frame, [from, to], [0, 1], {
    easing,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

/** Deterministic hash-noise in [0,1). Math.random() would re-roll every frame. */
export const noise = (i: number, salt = 0) => {
  const x = Math.sin(i * 127.1 + salt * 311.7 + 1.3) * 43758.5453;
  return x - Math.floor(x);
};

/* ----------------------------------------------------------------- money */

// One rung of the money ladder. The figures do not fade in — they fly up from
// under their own baseline and decelerate into place, so the column reads as
// an escalation rather than a list. Each rung steps back when the next lands.
export const MoneyStep: React.FC<{
  value: string;
  at: number;
  size: number;
  accent?: boolean;
  dimAt?: number;
  style?: React.CSSProperties;
}> = ({ value, at, size, accent = false, dimAt, style }) => {
  const frame = useCurrentFrame();
  const p = ramp(frame, at, at + 20, theme.ease.out);
  const back = dimAt === undefined ? 0 : ramp(frame, dimAt, dimAt + 14, theme.ease.out);
  return (
    <div
      style={{
        fontFamily: theme.fonts.wide,
        fontSize: size,
        fontWeight: 800,
        letterSpacing: "-0.05em",
        lineHeight: 0.94,
        fontVariantNumeric: "tabular-nums",
        whiteSpace: "nowrap",
        color: accent ? bpmPalette.primary : bpmColors.bone,
        opacity: p * (1 - back * 0.6),
        transform: `translateY(${interpolate(p, [0, 1], [size * 0.85, 0])}px) scale(${
          interpolate(p, [0, 1], [0.86, 1]) * (1 - back * 0.1)
        })`,
        transformOrigin: "left bottom",
        ...style,
      }}
    >
      {value}
    </div>
  );
};

/* ---------------------------------------------------------------- people */

// Abstract creator glyph: a circle with a head and shoulders. Never a
// likeness, never a photograph — every creator in this reel is conceptual and
// has to look it.
export const Avatar: React.FC<{ size: number; accent?: boolean }> = ({ size, accent = false }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      background: bpmColors.surfaceStrong,
      border: `1.5px solid ${accent ? bpmPalette.primary : bpmColors.line}`,
      overflow: "hidden",
      position: "relative",
      flex: "none",
    }}
  >
    <div
      style={{
        position: "absolute",
        left: size * 0.31,
        top: size * 0.2,
        width: size * 0.38,
        height: size * 0.38,
        borderRadius: "50%",
        background: accent ? bpmPalette.primary : bpmColors.dim,
      }}
    />
    <div
      style={{
        position: "absolute",
        left: size * 0.17,
        top: size * 0.64,
        width: size * 0.66,
        height: size * 0.52,
        borderRadius: `${size * 0.33}px ${size * 0.33}px 0 0`,
        background: accent ? bpmPalette.primary : bpmColors.dim,
      }}
    />
  </div>
);

/* -------------------------------------------------------------- comments */

// A comment lands the way a notification does: it drops, overshoots, settles.
// It never fades in on its own.
export const CommentCard: React.FC<{
  text: string;
  at: number;
  x: number;
  y: number;
  width: number;
  scale?: number;
  rotate?: number;
  size?: number;
  accent?: boolean;
  fade?: number;
}> = ({ text, at, x, y, width, scale = 1, rotate = 0, size = 30, accent = false, fade = 1 }) => {
  const p = useIn(at, "snappy");
  if (p <= 0.002 || fade <= 0.002) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        display: "flex",
        alignItems: "center",
        gap: size * 0.55,
        padding: `${Math.round(size * 0.58)}px ${Math.round(size * 0.82)}px`,
        borderRadius: 10,
        background: bpmColors.surfaceStrong,
        border: `1.5px solid ${accent ? bpmPalette.primary : bpmColors.line}`,
        boxShadow: bpmColors.shadow,
        opacity: p * fade,
        transform: `translateY(${interpolate(p, [0, 1], [28, 0])}px) scale(${
          interpolate(p, [0, 1], [0.88, 1]) * scale
        }) rotate(${rotate}deg)`,
        transformOrigin: "left center",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: size * 1.1,
          height: size * 1.1,
          borderRadius: "50%",
          background: bpmColors.dim,
          flex: "none",
        }}
      />
      <div
        style={{
          fontFamily: theme.fonts.body,
          fontSize: size,
          fontWeight: 500,
          letterSpacing: "-0.01em",
          lineHeight: 1.1,
          color: accent ? bpmPalette.primary : bpmPalette.text,
          whiteSpace: "nowrap",
          overflow: "hidden",
        }}
      >
        {text}
      </div>
    </div>
  );
};

/* ----------------------------------------------------------------- marks */

// Bone tick, drawn. An emoji ✅ would render as a full-colour platform glyph
// and spend the frame's accent budget on itself.
export const Tick: React.FC<{ size?: number; progress: number; color?: string }> = ({
  size = 64,
  progress,
  color = bpmColors.bone,
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flex: "none" }}>
    <path
      d="M4 12.5 L9.5 18 L20 6"
      stroke={color}
      strokeWidth={2.4}
      strokeLinecap="square"
      strokeDasharray={30}
      strokeDashoffset={30 * (1 - progress)}
    />
  </svg>
);

// A downward step between two rungs of the ladder. SVG rather than "↓":
// Space Grotesk has no arrow glyph and would fall back mid-column.
export const ArrowDown: React.FC<{ size?: number; progress: number; color?: string }> = ({
  size = 44,
  progress,
  color = bpmPalette.textDim,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    style={{
      flex: "none",
      opacity: progress,
      transform: `translateY(${(1 - progress) * -12}px)`,
    }}
  >
    <path
      d="M12 3 V19 M5.5 12.5 L12 19.5 L18.5 12.5"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="square"
    />
  </svg>
);

// Hairline fractures spreading from the centre of whatever they are laid over.
// The parent must be position: relative. No glow, no particles — the crack is
// the only thing that happens, which is what makes it land.
const CRACKS: readonly [number, number][] = [
  [-0.5, -0.9],
  [0.42, -0.78],
  [0.96, -0.12],
  [0.6, 0.82],
  [-0.28, 0.94],
  [-0.94, 0.3],
  [-0.72, -0.34],
  [0.2, 0.36],
];

export const Crack: React.FC<{ progress: number; color?: string; length?: number }> = ({
  progress,
  color = bpmColors.bone,
  length = 620,
}) => (
  <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
    {CRACKS.map(([dx, dy], i) => {
      const p = Math.max(0, Math.min(1, (progress - i * 0.05) / 0.5));
      const len = length * (0.45 + noise(i, 3) * 0.55) * p;
      const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
      return (
        <div
          key={`crack-${i}`}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: len,
            height: 4,
            background: color,
            opacity: p,
            transformOrigin: "left center",
            transform: `rotate(${angle}deg)`,
          }}
        />
      );
    })}
  </div>
);

/* ----------------------------------------------------------------- field */

// The haystack: a screenful of creator cards too small to read, which is the
// point. The last two beats share this layout so the cut between them is
// continuous — `t` blends every card from its scattered position to its slot
// in the grid, and `pop` lifts one card out of the grid into the centre.
export const FIELD_COLS = 6;
export const FIELD_ROWS = 16;
export const FIELD_COUNT = FIELD_COLS * FIELD_ROWS;
const CARD_W = 150;
const CARD_H = 58;
const SLOT_X = 26;
const SLOT_DX = 172;
const SLOT_Y = -46;
const SLOT_DY = 120;
export const FIELD_CHOSEN = 8 * FIELD_COLS + 2; // middle of the page

const slotOf = (i: number) => ({
  x: SLOT_X + (i % FIELD_COLS) * SLOT_DX,
  y: SLOT_Y + Math.floor(i / FIELD_COLS) * SLOT_DY,
});
const scatterOf = (i: number) => ({
  x: -90 + noise(i, 21) * 1120,
  y: -80 + noise(i, 22) * 1980,
  r: (noise(i, 23) - 0.5) * 26,
});

const FieldCard: React.FC<{ i: number; t: number; dim: number; pop: number; chosen: boolean }> = ({
  i,
  t,
  dim,
  pop,
  chosen,
}) => {
  const s = scatterOf(i);
  const g = slotOf(i);
  const baseX = s.x + (g.x - s.x) * t;
  const baseY = s.y + (g.y - s.y) * t;
  // The chosen card leaves the grid for the middle of the page.
  const x = chosen ? baseX + (465 - baseX) * pop : baseX;
  const y = chosen ? baseY + (900 - baseY) * pop : baseY;
  const scale = chosen ? 1 + pop * 1.6 : 1;
  const opacity = chosen ? dim + (1 - dim) * pop : dim;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: CARD_W,
        height: CARD_H,
        borderRadius: 6,
        background: bpmColors.surfaceStrong,
        border: `1px solid ${chosen && pop > 0.05 ? bpmPalette.primary : bpmColors.line}`,
        transform: `rotate(${s.r * (1 - t)}deg) scale(${scale})`,
        opacity,
        // Once it lifts out of the grid it is over everything: at 2.6× it
        // covers its neighbours, and they are drawn after it in index order.
        zIndex: chosen ? 2 : 1,
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: 10,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: 26,
          height: 26,
          borderRadius: "50%",
          background: chosen && pop > 0.05 ? bpmPalette.primary : bpmColors.dim,
          flex: "none",
        }}
      />
      <div style={{ flex: 1 }}>
        <div
          style={{
            height: 3,
            width: `${52 + noise(i, 1) * 40}%`,
            background: bpmColors.dim,
            marginBottom: 7,
          }}
        />
        <div style={{ height: 3, width: `${28 + noise(i, 2) * 34}%`, background: bpmColors.line }} />
      </div>
    </div>
  );
};

export const Field: React.FC<{
  t: number; // 0 = scattered noise, 1 = grid
  dim: number;
  pop?: number; // 0 = chosen card sits in the grid, 1 = centred and enlarged
  chosen?: number | null;
  style?: React.CSSProperties;
}> = ({ t, dim, pop = 0, chosen = null, style }) => (
  <div style={{ position: "absolute", inset: 0, overflow: "hidden", ...style }}>
    {Array.from({ length: FIELD_COUNT }, (_, i) => (
      <FieldCard key={`f-${i}`} i={i} t={t} dim={dim} pop={pop} chosen={i === chosen} />
    ))}
  </div>
);

/* -------------------------------------------------------------- fragment */

// A shard of the hook's HATE. Card-shaped on purpose: beat 04's comment flood
// is what these turn into.
export const Shard: React.FC<{
  i: number;
  x: number;
  y: number;
  w: number;
  h: number;
  progress: number;
  color: string;
}> = ({ i, x, y, w, h, progress, color }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      height: h,
      background: color,
      opacity: 1 - progress * 0.2,
      transform: `translate(${(noise(i, 7) - 0.5) * 1500 * progress}px, ${
        (noise(i, 11) - 0.35) * 1700 * progress
      }px) rotate(${(noise(i, 13) - 0.5) * 80 * progress}deg) scale(${1 - progress * 0.12})`,
    }}
  />
);

/* ---------------------------------------------------------------- labels */

// The disclaimer line. Every conceptual figure in this reel carries one, in
// frame, at the size a magazine sets a footnote.
export const Footnote: React.FC<{
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
}> = ({ children, delay = 0, style }) => {
  const p = useIn(delay, "smooth");
  return (
    <div
      style={{
        fontFamily: theme.fonts.mono,
        fontSize: 16,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: bpmPalette.textDim,
        opacity: p * 0.75,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {children}
    </div>
  );
};
