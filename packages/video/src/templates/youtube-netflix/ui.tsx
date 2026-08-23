// Motion kit for "The Creator War".
//
// The editorial grammar — SceneShell, Kinetic, Slam, Eyebrow, Mono, Num, Rule,
// Strike, Tag, Flash, the Yoloco mark, useIn/useRamp/usePunch — is
// khaby-silence's and is re-exported wholesale rather than re-invented. Only
// what this story needs that that one did not is defined below: the two
// platform marks, the broadcast chrome (folio, ticker), abstract creators and
// show cards, the device chain, the money flow, and the ecosystem field.
//
// Every repeated thing here is a component, not a `.map()` body, because
// useIn/useRamp read the frame — they are hooks and cannot be called in a loop
// body or behind a `?:`. Where one item needs several ramps, the component
// reads useCurrentFrame() once and uses the plain `ramp()` helper.
import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../theme";
import { useIn } from "../khaby-silence/ui";
import { ynColors, ynPalette } from "./palette";

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

/** Frame shake as a wrapper, so a scene can drive it off usePunch. */
export const Shake: React.FC<{ amount: number; children: React.ReactNode }> = ({
  amount,
  children,
}) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      transform: `translate(${amount * 0.35}px, ${amount}px)`,
    }}
  >
    {children}
  </div>
);

/* ------------------------------------------------------- platform marks */

// Both platforms wear the SAME red; they are told apart by form. That is the
// palette rule and the story at once — see palette.ts.

/**
 * YouTube: the rounded play plate. `progress` wipes it in from the left like a
 * plate being printed, rather than fading it up.
 */
export const YouTubeMark: React.FC<{
  width: number;
  progress?: number;
  color?: string;
  style?: React.CSSProperties;
}> = ({ width, progress = 1, color = ynPalette.primary, style }) => {
  const h = width * 0.7;
  return (
    <div
      style={{
        width,
        height: h,
        clipPath: `inset(0 ${(1 - progress) * 100}% 0 0)`,
        ...style,
      }}
    >
      <svg width={width} height={h} viewBox="0 0 100 70" fill="none">
        <rect width="100" height="70" rx="20" fill={color} />
        <path d="M40 20.5L68.5 35L40 49.5V20.5Z" fill={ynColors.ink} />
      </svg>
    </div>
  );
};

/**
 * Netflix: three vertical bars that resolve into an N. `progress` raises them
 * one after another out of their own baseline — the title-card build.
 */
export const NetflixMark: React.FC<{
  height: number;
  progress?: number;
  color?: string;
  style?: React.CSSProperties;
}> = ({ height, progress = 1, color = ynPalette.primary, style }) => {
  const w = height * 0.62;
  const bar = (i: number) =>
    interpolate(progress, [i * 0.22, i * 0.22 + 0.56], [0, 1], {
      easing: theme.ease.out,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  return (
    <div style={{ width: w, height, ...style }}>
      <svg width={w} height={height} viewBox="0 0 62 100" fill="none">
        <g transform={`translate(0 ${(1 - bar(0)) * 100})`}>
          <rect x="0" y="0" width="17" height="100" fill={color} opacity={bar(0)} />
        </g>
        <g transform={`translate(0 ${(1 - bar(2)) * 100})`}>
          <rect x="45" y="0" width="17" height="100" fill={color} opacity={bar(2)} />
        </g>
        {/* The diagonal is the last thing to land: until it does, the mark is
            two bars and could be anything. */}
        <g style={{ clipPath: `inset(0 0 ${(1 - bar(1)) * 100}% 0)` }}>
          <path d="M17 0L45 100H62L34 0H17Z" fill={color} opacity={0.82} />
        </g>
      </svg>
    </div>
  );
};

/* ----------------------------------------------------- broadcast chrome */

/** The magazine folio: mono, tracked out, hairline above. */
export const Folio: React.FC<{
  left: React.ReactNode;
  right?: React.ReactNode;
  delay?: number;
  top?: number;
  color?: string;
}> = ({ left, right, delay = 0, top = 176, color = ynPalette.textDim }) => {
  const p = useIn(delay, "smooth");
  return (
    <div
      style={{
        position: "absolute",
        left: 84,
        right: 84,
        top,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        opacity: p * 0.92,
        transform: `translateY(${interpolate(p, [0, 1], [-18, 0])}px)`,
        fontFamily: theme.fonts.mono,
        fontSize: 22,
        fontWeight: 500,
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        color,
      }}
    >
      <span>{left}</span>
      {right ? <span>{right}</span> : null}
    </div>
  );
};

/**
 * The Bloomberg strip. It scrolls at a constant rate — the one place in this
 * reel where linear motion is right, because a ticker that eases is a ticker
 * that is lying about being live.
 */
export const Ticker: React.FC<{
  items: string[];
  top: number;
  delay?: number;
  speed?: number; // px per second
  size?: number;
}> = ({ items, top, delay = 0, speed = 96, size = 24 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = ramp(frame, delay, delay + 14);
  const shift = ((frame - delay) / fps) * speed;
  const run = [...items, ...items, ...items];
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top,
        height: size * 2.1,
        overflow: "hidden",
        borderTop: `1px solid ${ynColors.line}`,
        borderBottom: `1px solid ${ynColors.line}`,
        opacity: p * 0.85,
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 46,
          whiteSpace: "nowrap",
          transform: `translateX(${-shift % 1400}px)`,
          fontFamily: theme.fonts.mono,
          fontSize: size,
          fontWeight: 500,
          letterSpacing: "0.12em",
          color: ynPalette.textDim,
          paddingLeft: 84,
        }}
      >
        {run.map((it, i) => (
          <span key={`tick-${i}`} style={{ display: "inline-block" }}>
            {it}
          </span>
        ))}
      </div>
    </div>
  );
};

/** Bordered mono chip in the reel's own red — khaby's Tag is bone-only. */
export const Chip: React.FC<{
  children: React.ReactNode;
  delay?: number;
  color?: string;
  filled?: boolean;
  size?: number;
  style?: React.CSSProperties;
}> = ({ children, delay = 0, color = ynPalette.primary, filled = false, size = 22, style }) => {
  const p = useIn(delay, "snappy");
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: `${Math.round(size * 0.5)}px ${Math.round(size * 0.86)}px`,
        borderRadius: 4,
        border: `1.5px solid ${color}`,
        background: filled ? color : "transparent",
        fontFamily: theme.fonts.mono,
        fontSize: size,
        fontWeight: 600,
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
        color: filled ? ynColors.ink : color,
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [16, 0])}px) scale(${interpolate(p, [0, 1], [0.9, 1])})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** The disclaimer line. Small, mono, never a caption — it must be IN the frame. */
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
        fontSize: 19,
        fontWeight: 500,
        lineHeight: 1.5,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: ynColors.dim,
        opacity: p * 0.95,
        transform: `translateY(${interpolate(p, [0, 1], [10, 0])}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/* -------------------------------------------------------------- creators */

/**
 * An abstract creator. No likeness, no handle, no photograph: the brief
 * forbids fabricated pictures of real creators and none were licensed for this
 * project, so a creator here is a disc, a rule and a code.
 */
export const CreatorCard: React.FC<{
  code: string;
  meta?: string;
  width: number;
  delay?: number;
  accent?: boolean;
  dim?: number;
  bar?: number; // 0..1 fill of the reach bar
  style?: React.CSSProperties;
}> = ({ code, meta, width, delay = 0, accent = false, dim = 1, bar = 0.5, style }) => {
  const p = useIn(delay, "smooth");
  const disc = Math.round(width * 0.2);
  const edge = accent ? ynPalette.primary : ynColors.lineStrong;
  return (
    <div
      style={{
        width,
        // border-box, or `width` becomes a lie the moment anything is placed
        // next to the card — the money column in beat 02 and the link line in
        // beat 10 are both positioned off this number.
        boxSizing: "border-box",
        padding: Math.round(width * 0.075),
        border: `1.5px solid ${edge}`,
        borderRadius: 6,
        background: accent ? ynColors.redSoft : ynColors.surface,
        display: "flex",
        alignItems: "center",
        gap: Math.round(width * 0.075),
        opacity: p * dim,
        transform: `translateY(${interpolate(p, [0, 1], [30, 0])}px) scale(${interpolate(p, [0, 1], [0.92, 1])})`,
        ...style,
      }}
    >
      <div
        style={{
          width: disc,
          height: disc,
          borderRadius: "50%",
          flexShrink: 0,
          border: `1.5px solid ${edge}`,
          background: `linear-gradient(160deg, ${ynColors.surfaceStrong}, ${ynColors.ink})`,
        }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: theme.fonts.mono,
            fontSize: Math.round(width * 0.082),
            fontWeight: 700,
            letterSpacing: "0.14em",
            color: accent ? ynPalette.primary : ynColors.bone,
            whiteSpace: "nowrap",
          }}
        >
          {code}
        </div>
        {meta ? (
          <div
            style={{
              fontFamily: theme.fonts.mono,
              fontSize: Math.round(width * 0.062),
              fontWeight: 500,
              letterSpacing: "0.1em",
              color: ynPalette.textDim,
              marginTop: Math.round(width * 0.022),
              whiteSpace: "nowrap",
            }}
          >
            {meta}
          </div>
        ) : null}
        <div
          style={{
            marginTop: Math.round(width * 0.04),
            height: 3,
            background: ynColors.line,
          }}
        >
          <div
            style={{
              height: 3,
              width: `${Math.min(1, Math.max(0, bar)) * 100 * p}%`,
              background: accent ? ynPalette.primary : ynColors.lineStrong,
            }}
          />
        </div>
      </div>
    </div>
  );
};

/**
 * A premium show card: the thing both platforms want to own. Deliberately
 * anonymous — a poster gradient, a play glyph, a mono slate.
 */
export const ShowCard: React.FC<{
  width: number;
  title: string;
  meta?: string;
  delay?: number;
  badge?: string;
  badgeAccent?: boolean;
  dim?: number;
  style?: React.CSSProperties;
}> = ({ width, title, meta, delay = 0, badge, badgeAccent = false, dim = 1, style }) => {
  const frame = useCurrentFrame();
  const p = useIn(delay, "smooth");
  const h = Math.round((width * 9) / 16);
  const breathe = Math.sin(frame / 26) * 3;
  return (
    <div
      style={{
        width,
        height: h,
        position: "relative",
        overflow: "hidden",
        borderRadius: Math.round(width * 0.02),
        border: `1.5px solid ${ynColors.lineStrong}`,
        background: `linear-gradient(148deg, ${ynColors.screenLift} 0%, ${ynColors.screen} 62%, ${ynColors.ink} 100%)`,
        boxShadow: ynColors.shadow,
        opacity: p * dim,
        transform: `translateY(${interpolate(p, [0, 1], [40, breathe])}px) scale(${interpolate(p, [0, 1], [0.9, 1])})`,
        ...style,
      }}
    >
      {/* the "still": a soft key light, so the card is never a flat rectangle */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at 32% 28%, rgba(237,232,223,0.10), transparent 58%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: Math.round(width * 0.05),
          bottom: Math.round(width * 0.055),
          right: Math.round(width * 0.05),
        }}
      >
        <div
          style={{
            fontFamily: theme.fonts.display,
            fontSize: Math.round(width * 0.088),
            fontWeight: 700,
            letterSpacing: "-0.03em",
            lineHeight: 1,
            color: ynColors.bone,
            whiteSpace: "nowrap",
            overflow: "hidden",
          }}
        >
          {title}
        </div>
        {meta ? (
          <div
            style={{
              marginTop: Math.round(width * 0.022),
              fontFamily: theme.fonts.mono,
              fontSize: Math.round(width * 0.038),
              fontWeight: 500,
              letterSpacing: "0.14em",
              color: ynPalette.textDim,
              whiteSpace: "nowrap",
            }}
          >
            {meta}
          </div>
        ) : null}
      </div>
      {badge ? (
        <div
          style={{
            position: "absolute",
            left: Math.round(width * 0.05),
            top: Math.round(width * 0.05),
            padding: `${Math.round(width * 0.016)}px ${Math.round(width * 0.03)}px`,
            borderRadius: 3,
            background: badgeAccent ? ynPalette.primary : "rgba(237,232,223,0.14)",
            fontFamily: theme.fonts.mono,
            fontSize: Math.round(width * 0.034),
            fontWeight: 700,
            letterSpacing: "0.16em",
            color: badgeAccent ? ynColors.bone : ynColors.bone,
          }}
        >
          {badge}
        </div>
      ) : null}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 3,
          background: "rgba(237,232,223,0.14)",
        }}
      >
        <div style={{ height: 3, width: "34%", background: "rgba(237,232,223,0.5)" }} />
      </div>
    </div>
  );
};

/* --------------------------------------------------------------- devices */

/**
 * A device drawn in hairlines — phone, laptop, TV. The screen is a hole the
 * scene fills, so the same show card can hop from one to the next.
 */
export const Device: React.FC<{
  kind: "phone" | "laptop" | "tv";
  screenW: number;
  progress: number; // 0..1 draw-in
  dim?: number;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ kind, screenW, progress, dim = 1, children, style }) => {
  const ratio = kind === "phone" ? 16 / 9 : 9 / 16;
  const screenH = Math.round(screenW * ratio);
  const bezel = Math.round(screenW * (kind === "phone" ? 0.055 : 0.035));
  const radius = kind === "phone" ? Math.round(screenW * 0.11) : Math.round(screenW * 0.018);
  return (
    <div
      style={{
        position: "relative",
        opacity: dim,
        transform: `scale(${interpolate(progress, [0, 1], [0.88, 1])})`,
        ...style,
      }}
    >
      <div
        style={{
          width: screenW + bezel * 2,
          height: screenH + bezel * 2,
          borderRadius: radius,
          border: `2px solid ${ynColors.lineStrong}`,
          background: ynColors.ink,
          padding: bezel,
          boxSizing: "border-box",
          clipPath: `inset(0 ${(1 - progress) * 100}% 0 0)`,
        }}
      >
        <div
          style={{
            width: screenW,
            height: screenH,
            borderRadius: Math.max(2, radius - bezel),
            overflow: "hidden",
            background: ynColors.screen,
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {children}
        </div>
      </div>
      {kind === "laptop" ? (
        <div
          style={{
            width: (screenW + bezel * 2) * 1.16,
            height: 12,
            marginLeft: -((screenW + bezel * 2) * 0.08),
            marginTop: 4,
            borderRadius: "0 0 8px 8px",
            background: ynColors.lineStrong,
            clipPath: `inset(0 ${(1 - progress) * 100}% 0 0)`,
          }}
        />
      ) : null}
      {kind === "tv" ? (
        <div
          style={{
            width: 4,
            height: 34,
            margin: "0 auto",
            background: ynColors.lineStrong,
            opacity: progress,
          }}
        />
      ) : null}
      {kind === "tv" ? (
        <div
          style={{
            width: (screenW + bezel * 2) * 0.34,
            height: 4,
            margin: "0 auto",
            background: ynColors.lineStrong,
            opacity: progress,
          }}
        />
      ) : null}
    </div>
  );
};

/* ------------------------------------------------------------ money flow */

/** One travelling payment dot. Its own component: it needs its own ramp. */
export const FlowDot: React.FC<{
  x: number;
  y0: number;
  y1: number;
  at: number;
  size?: number;
  color?: string;
}> = ({ x, y0, y1, at, size = 10, color = ynColors.bone }) => {
  const frame = useCurrentFrame();
  const p = ramp(frame, at, at + 26, theme.ease.inOut);
  if (p <= 0 || p >= 1) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x - size / 2,
        top: interpolate(p, [0, 1], [y0, y1]) - size / 2,
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
        opacity: Math.sin(p * Math.PI),
      }}
    />
  );
};

/** A hairline that draws itself between two points. */
export const Wire: React.FC<{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  progress: number;
  color?: string;
  thickness?: number;
}> = ({ x1, y1, x2, y2, progress, color = ynColors.line, thickness = 1.5 }) => {
  const len = Math.hypot(x2 - x1, y2 - y1);
  const angle = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
  return (
    <div
      style={{
        position: "absolute",
        left: x1,
        top: y1 - thickness / 2,
        width: len,
        height: thickness,
        background: color,
        transformOrigin: "left center",
        transform: `rotate(${angle}deg) scaleX(${progress})`,
      }}
    />
  );
};

/* ------------------------------------------------------------- ecosystem */

/** One labelled node of the closing ecosystem. */
export const Node: React.FC<{
  x: number;
  y: number;
  label: string;
  delay?: number;
  accent?: boolean;
  dim?: number;
  size?: number;
}> = ({ x, y, label, delay = 0, accent = false, dim = 1, size = 96 }) => {
  const frame = useCurrentFrame();
  const p = useIn(delay, "smooth");
  const breathe = Math.sin(frame / 30 + x / 140) * 2.5;
  return (
    <div
      style={{
        position: "absolute",
        left: x - size / 2,
        top: y - size / 2 + breathe,
        width: size,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        opacity: p * dim,
        transform: `scale(${interpolate(p, [0, 1], [0.6, 1])})`,
      }}
    >
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          border: `2px solid ${accent ? ynPalette.primary : ynColors.lineStrong}`,
          background: accent ? ynColors.redSoft : ynColors.surface,
        }}
      />
      <div
        style={{
          fontFamily: theme.fonts.mono,
          fontSize: 19,
          fontWeight: 600,
          letterSpacing: "0.14em",
          whiteSpace: "nowrap",
          color: accent ? ynPalette.primary : ynPalette.textDim,
        }}
      >
        {label}
      </div>
    </div>
  );
};

/** A single anonymous creator mark in the background field. */
export const FieldMark: React.FC<{
  x: number;
  y: number;
  size: number;
  delay: number;
  dim: number;
}> = ({ x, y, size, delay, dim }) => {
  const frame = useCurrentFrame();
  const p = ramp(frame, delay, delay + 18);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: size,
        height: size,
        borderRadius: "50%",
        border: `1.5px solid ${ynColors.line}`,
        opacity: p * dim,
        transform: `scale(${interpolate(p, [0, 1], [0.4, 1])})`,
      }}
    />
  );
};
