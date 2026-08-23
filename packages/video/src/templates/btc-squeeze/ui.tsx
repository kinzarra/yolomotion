// Episode kit for «Биткойн +20%». The series look — paper that prints, digital
// that snaps — lives in ../digital-ruble/ui and is re-exported untouched; this
// file only adds what a market thriller needs: a price line that breaks out,
// Treasury slips, SHORT dominoes, a chain, indicator tiles. Same rules: every
// entrance moves 2–3 properties on a spring, every ramp is eased and clamped,
// every color comes from the series palette.
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../theme";
import { useIn, useRamp } from "../../reel";
import { btcColors, btcPalette } from "./palette";
import { rnd } from "../digital-ruble/ui";

export * from "../digital-ruble/ui";

/* ------------------------------------------------------------ helpers */

export type Pt = { x: number; y: number };

/** Point at fraction `p` of a polyline's length. */
export const pointAt = (pts: Pt[], p: number): Pt => {
  if (pts.length === 0) return { x: 0, y: 0 };
  if (pts.length === 1 || p <= 0) return pts[0];
  const segs: number[] = [];
  let total = 0;
  for (let i = 1; i < pts.length; i += 1) {
    const d = Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
    segs.push(d);
    total += d;
  }
  let target = Math.min(1, p) * total;
  for (let i = 0; i < segs.length; i += 1) {
    if (target <= segs[i]) {
      const t = segs[i] === 0 ? 0 : target / segs[i];
      return {
        x: pts[i].x + (pts[i + 1].x - pts[i].x) * t,
        y: pts[i].y + (pts[i + 1].y - pts[i].y) * t,
      };
    }
    target -= segs[i];
  }
  return pts[pts.length - 1];
};

const toPath = (pts: Pt[]) => pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");

/** A sideways, slightly sagging line: the боковик. Deterministic per seed. */
export const flatLine = (width: number, y: number, amp: number, n = 16, seed = 1): Pt[] =>
  Array.from({ length: n }, (_, i) => ({
    x: (i / (n - 1)) * width,
    y: y + (rnd(seed * 31 + i * 7) - 0.5) * 2 * amp + (i / (n - 1)) * amp * 0.6,
  }));

/** The breakout: mostly up, with two small pullbacks so it reads as a market. */
export const upLine = (from: Pt, to: Pt, n = 12, seed = 2): Pt[] =>
  Array.from({ length: n }, (_, i) => {
    const t = i / (n - 1);
    const ease = 1 - Math.pow(1 - t, 2.2);
    const pullback = i > 0 && i < n - 1 ? (rnd(seed * 17 + i * 11) - 0.35) * (to.y - from.y) * 0.08 : 0;
    return { x: from.x + (to.x - from.x) * t, y: from.y + (to.y - from.y) * ease - pullback };
  });

/* --------------------------------------------------------------- chart */

/**
 * Price chart: a red flat stretch that draws left→right, then a lime
 * breakout with a glowing tip and a lime area under it. Both halves are
 * driven by 0..1 progress values so a scene can time the break to the voice.
 */
export const PriceChart: React.FC<{
  width: number;
  height: number;
  flat: Pt[];
  up?: Pt[];
  flatProgress: number;
  upProgress?: number;
  id: string;
  flatColor?: string;
  gridRows?: number;
}> = ({ width, height, flat, up, flatProgress, upProgress = 0, id, flatColor = btcColors.bad, gridRows = 4 }) => {
  const frame = useCurrentFrame();
  const tip = up && upProgress > 0 ? pointAt(up, upProgress) : null;
  const pulse = 1 + Math.sin(frame / 4) * 0.25;
  const areaPts = up ? [...up, { x: up[up.length - 1].x, y: height }, { x: up[0].x, y: height }] : [];
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: "block", overflow: "visible" }}>
      <defs>
        <linearGradient id={`${id}-area`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={btcPalette.primary} stopOpacity={0.28} />
          <stop offset="100%" stopColor={btcPalette.primary} stopOpacity={0} />
        </linearGradient>
        <clipPath id={`${id}-clip`}>
          <rect x={up ? up[0].x : 0} y={-40} width={up ? (up[up.length - 1].x - up[0].x) * upProgress : 0} height={height + 40} />
        </clipPath>
      </defs>
      {/* grid */}
      {Array.from({ length: gridRows + 1 }, (_, i) => (
        <line
          key={i}
          x1={0}
          x2={width}
          y1={(i / gridRows) * height}
          y2={(i / gridRows) * height}
          stroke={btcColors.line}
          strokeWidth={1}
          strokeDasharray="4 8"
        />
      ))}
      {/* flat */}
      <path
        d={toPath(flat)}
        fill="none"
        stroke={flatColor}
        strokeWidth={8}
        strokeLinecap="square"
        strokeLinejoin="miter"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - flatProgress}
      />
      {/* breakout */}
      {up && upProgress > 0 && (
        <>
          <path d={toPath(areaPts)} fill={`url(#${id}-area)`} clipPath={`url(#${id}-clip)`} />
          <path
            d={toPath(up)}
            fill="none"
            stroke={btcPalette.primary}
            strokeWidth={10}
            strokeLinecap="square"
            strokeLinejoin="miter"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - upProgress}
            style={{ filter: `drop-shadow(0 0 14px ${btcPalette.glow})` }}
          />
          {tip && (
            <>
              <circle cx={tip.x} cy={tip.y} r={26 * pulse} fill={btcPalette.primary} opacity={0.22} />
              <circle cx={tip.x} cy={tip.y} r={11} fill={btcPalette.primary} />
            </>
          )}
        </>
      )}
    </svg>
  );
};

/* ---------------------------------------------------------------- coin */

/**
 * The ₿ coin — a dark disc with a lime ring. Unbounded has no ₿ glyph, so the
 * mark is a heavy B with two stem bars drawn on top. `from` is the entrance
 * scale (3 = punches through the frame). `lit` turns the glow on.
 */
export const Coin: React.FC<{
  size?: number;
  delay?: number;
  from?: number;
  lit?: boolean;
  style?: React.CSSProperties;
}> = ({ size = 320, delay = 0, from = 0.4, lit = true, style }) => {
  const p = useIn(delay, "bouncy");
  const frame = useCurrentFrame();
  const breathe = 1 + Math.sin(frame / 19) * 0.015;
  const ring = Math.max(4, Math.round(size * 0.02));
  const glyph = size * 0.5;
  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        borderRadius: "50%",
        background: `radial-gradient(circle at 38% 32%, ${btcColors.surfaceLift}, ${btcColors.surfaceStrong} 70%)`,
        border: `${ring}px solid ${btcPalette.primary}`,
        boxShadow: lit
          ? `0 0 ${size * 0.16}px ${btcPalette.glow}, 0 0 ${size * 0.5}px ${btcPalette.primary}26, ${btcColors.shadow}`
          : btcColors.shadow,
        opacity: Math.min(1, p * 1.5),
        transform: `scale(${interpolate(p, [0, 1], [from, 1]) * breathe}) rotate(${interpolate(p, [0, 1], [-24, 0])}deg)`,
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: size * 0.07,
          borderRadius: "50%",
          border: `${Math.max(2, Math.round(size * 0.008))}px dashed ${btcPalette.primary}`,
          opacity: 0.55,
          transform: `rotate(${frame * 0.6}deg)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: theme.fonts.wide,
          fontSize: glyph,
          fontWeight: 900,
          lineHeight: 1,
          color: btcPalette.primary,
          textShadow: lit ? `0 0 ${size * 0.1}px ${btcPalette.glow}` : undefined,
          transform: "translateY(-2%)",
        }}
      >
        B
      </div>
      {/* the two stem bars that make a B a ₿ */}
      {[-0.11, 0.11].map((dx) => (
        <React.Fragment key={dx}>
          <div
            style={{
              position: "absolute",
              left: `calc(50% + ${(dx - 0.09) * glyph}px)`,
              top: `calc(50% - ${glyph * 0.46}px)`,
              width: Math.max(3, glyph * 0.06),
              height: glyph * 0.1,
              background: btcPalette.primary,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: `calc(50% + ${(dx - 0.09) * glyph}px)`,
              top: `calc(50% + ${glyph * 0.32}px)`,
              width: Math.max(3, glyph * 0.06),
              height: glyph * 0.1,
              background: btcPalette.primary,
            }}
          />
        </React.Fragment>
      ))}
    </div>
  );
};

/* --------------------------------------------------------------- paper */

/** A Treasury-ish paper slip. Generic on purpose: no seal, no signature. */
export const PaperSlip: React.FC<{
  width?: number;
  delay?: number;
  tilt?: number;
  title?: string;
  figure?: string;
  sub?: string;
  style?: React.CSSProperties;
}> = ({ width = 300, delay = 0, tilt = 0, title = "US TREASURY", figure = "30Y", sub = "BOND · LONG", style }) => {
  const p = useIn(delay, "smooth");
  const h = Math.round(width * 0.5);
  return (
    <div
      style={{
        position: "relative",
        width,
        height: h,
        background: `linear-gradient(135deg, ${btcColors.white}, ${btcColors.paperShade})`,
        border: `2px solid ${btcColors.inkRule}`,
        boxShadow: btcColors.paperShadow,
        overflow: "hidden",
        fontFamily: theme.fonts.mono,
        color: btcColors.ink,
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [70, 0])}px) rotate(${tilt}deg) scale(${interpolate(p, [0, 1], [0.9, 1])})`,
        ...style,
      }}
    >
      <div style={{ position: "absolute", inset: 8, border: `2px double ${btcColors.inkRule}` }} />
      <div
        style={{
          position: "absolute",
          right: width * 0.07,
          top: "50%",
          width: h * 0.5,
          height: h * 0.5,
          marginTop: -h * 0.25,
          borderRadius: "50%",
          border: `2px solid ${btcColors.inkRule}`,
          backgroundImage: `repeating-radial-gradient(circle, transparent 0 4px, ${btcColors.inkRule} 4px 5px)`,
          opacity: 0.7,
        }}
      />
      <div style={{ position: "absolute", left: width * 0.07, top: h * 0.16, fontSize: width * 0.055, fontWeight: 800, letterSpacing: "0.14em" }}>
        {title}
      </div>
      <div style={{ position: "absolute", left: width * 0.07, top: h * 0.4, fontSize: width * 0.16, fontWeight: 800, letterSpacing: "-0.02em" }}>
        {figure}
      </div>
      <div style={{ position: "absolute", left: width * 0.07, bottom: h * 0.12, fontSize: width * 0.04, letterSpacing: "0.2em", color: btcColors.inkFaded }}>
        {sub}
      </div>
    </div>
  );
};

/* -------------------------------------------------------------- domino */

/**
 * One SHORT position, standing. `fall` 0..1 tips it over its bottom-right
 * corner; a fallen block dims. Red is the signal here — the scene that uses
 * these keeps lime to a single line and one number.
 */
export const Domino: React.FC<{
  width?: number;
  height?: number;
  fall: number;
  delay?: number;
  label?: string;
}> = ({ width = 64, height = 170, fall, delay = 0, label = "SHORT" }) => {
  const p = useIn(delay, "snappy");
  const rot = interpolate(fall, [0, 1], [0, 84], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div
      style={{
        width,
        height,
        transformOrigin: "100% 100%",
        transform: `rotate(${rot}deg)`,
        opacity: p,
      }}
    >
      <div
        style={{
          width,
          height,
          borderRadius: 6,
          background: `linear-gradient(180deg, ${btcColors.bad}, #B51F1F)`,
          border: `2px solid #FF7A7A`,
          boxShadow: `0 18px 40px -18px rgba(0,0,0,0.9)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transformOrigin: "50% 100%",
          transform: `scaleY(${interpolate(p, [0, 1], [0.2, 1])})`,
          opacity: interpolate(fall, [0.8, 1], [1, 0.55], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        <span
          style={{
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
            fontFamily: theme.fonts.mono,
            fontSize: Math.round(width * 0.36),
            fontWeight: 800,
            letterSpacing: "0.18em",
            color: btcColors.ink2,
          }}
        >
          {label}
        </span>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------ figures */

/** A person, head and shoulders, drawn flat. */
export const Silhouette: React.FC<{ height?: number; delay?: number; style?: React.CSSProperties }> = ({
  height = 220,
  delay = 0,
  style,
}) => {
  const p = useIn(delay, "smooth");
  const w = height * 0.7;
  return (
    <svg
      width={w}
      height={height}
      viewBox="0 0 70 100"
      style={{
        display: "block",
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [60, 0])}px) scale(${interpolate(p, [0, 1], [0.9, 1])})`,
        transformOrigin: "50% 100%",
        ...style,
      }}
    >
      <path
        d="M4 100 C4 62 18 44 35 44 C52 44 66 62 66 100 Z"
        fill={btcColors.surfaceLift}
        stroke={btcColors.lineStrong}
        strokeWidth="2"
      />
      <circle cx="35" cy="24" r="16" fill={btcColors.surfaceLift} stroke={btcColors.lineStrong} strokeWidth="2" />
    </svg>
  );
};

/** The White House as a line drawing that draws itself. No flag, no seal. */
export const WhiteHouse: React.FC<{ width?: number; delay?: number; color?: string }> = ({
  width = 720,
  delay = 0,
  color = btcPalette.textDim,
}) => {
  const p = useRamp(delay, delay + 42, theme.ease.inOut);
  const rise = useIn(delay, "smooth");
  const h = Math.round(width * 0.5);
  const stroke = { fill: "none", stroke: color, strokeWidth: 2.2, pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - p } as const;
  const cols = [58, 82, 106, 130, 170, 194, 218, 242, 282, 306, 330, 354];
  return (
    <svg
      width={width}
      height={h}
      viewBox="0 0 400 200"
      style={{
        display: "block",
        opacity: rise,
        transform: `translateY(${interpolate(rise, [0, 1], [30, 0])}px)`,
      }}
    >
      {/* ground */}
      <path d="M0 186 L400 186" {...stroke} />
      {/* body */}
      <path d="M36 186 L36 96 L364 96 L364 186" {...stroke} />
      {/* roof balustrade */}
      <path d="M30 96 L30 84 L370 84 L370 96" {...stroke} />
      <path d="M44 84 L44 72 L356 72 L356 84" {...stroke} />
      {/* portico + pediment */}
      <path d="M152 96 L152 56 L200 30 L248 56 L248 96" {...stroke} />
      <path d="M160 60 L200 40 L240 60 Z" {...stroke} />
      {/* columns */}
      {cols.map((x) => (
        <path key={x} d={`M${x} 96 L${x} 186`} {...stroke} />
      ))}
      {/* portico columns, heavier */}
      {[166, 188, 212, 234].map((x) => (
        <path key={x} d={`M${x} 96 L${x} 186`} {...stroke} strokeWidth={3.2} />
      ))}
      {/* windows */}
      {[60, 96, 132, 268, 304, 340].map((x) => (
        <path key={x} d={`M${x} 118 L${x} 142 M${x + 8} 118 L${x + 8} 142`} {...stroke} />
      ))}
      {/* steps */}
      <path d="M140 186 L140 176 L260 176 L260 186 M130 186 L130 181 L270 181 L270 186" {...stroke} />
    </svg>
  );
};

/* ---------------------------------------------------------------- marks */

/** A red bar striking through whatever it is laid over. */
export const Strike: React.FC<{ delay?: number; thick?: number; color?: string; tilt?: number }> = ({
  delay = 0,
  thick = 14,
  color = btcColors.bad,
  tilt = -3,
}) => {
  const p = useRamp(delay, delay + 9, theme.ease.out);
  return (
    <div
      style={{
        position: "absolute",
        left: "-4%",
        right: "-4%",
        top: "50%",
        height: thick,
        marginTop: -thick / 2,
        background: color,
        transformOrigin: "left center",
        transform: `rotate(${tilt}deg) scaleX(${p})`,
        boxShadow: `0 0 18px ${btcColors.badGlow}`,
      }}
    />
  );
};

/** Up / down arrow drawn as a stroke, drawing itself. */
export const ArrowGlyph: React.FC<{ dir: "up" | "down"; size?: number; delay?: number; color?: string; thick?: number }> = ({
  dir,
  size = 80,
  delay = 0,
  color = btcPalette.text,
  thick = 12,
}) => {
  const p = useRamp(delay, delay + 12, theme.ease.out);
  const d = dir === "up" ? "M50 92 L50 12 M18 44 L50 12 L82 44" : "M50 8 L50 88 M18 56 L50 88 L82 56";
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "block", overflow: "visible" }}>
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={thick}
        strokeLinecap="square"
        strokeLinejoin="miter"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - p}
      />
    </svg>
  );
};

/* -------------------------------------------------------------- numbers */

/** Eased counter with decimals — `$0.00B → $2.75B`. Deterministic landing. */
export const DecimalCounter: React.FC<{
  to: number;
  decimals?: number;
  delay?: number;
  frames?: number;
  size?: number;
  color?: string;
  prefix?: string;
  suffix?: string;
  glow?: boolean;
}> = ({ to, decimals = 2, delay = 0, frames = 80, size = 160, color = btcPalette.text, prefix = "", suffix = "", glow = false }) => {
  const frame = useCurrentFrame();
  const ramp = useRamp(delay, delay + frames, theme.ease.out);
  const value = frame >= delay + frames ? to : to * ramp;
  return (
    <span
      style={{
        fontFamily: `${theme.fonts.wide}, ${theme.fonts.mono}`,
        fontSize: size,
        fontWeight: 900,
        fontVariantNumeric: "tabular-nums",
        letterSpacing: "-0.02em",
        lineHeight: 1,
        color,
        textShadow: glow ? `0 0 ${Math.round(size * 0.3)}px ${btcPalette.glow}` : undefined,
      }}
    >
      {prefix}
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
};

/** Mono digit strip: `$1 000 000 000` racing, tabular. */
export const DigitStrip: React.FC<{
  to: number;
  delay?: number;
  frames?: number;
  size?: number;
  color?: string;
  prefix?: string;
}> = ({ to, delay = 0, frames = 60, size = 64, color = btcPalette.text, prefix = "" }) => {
  const frame = useCurrentFrame();
  const ramp = useRamp(delay, delay + frames, theme.ease.out);
  const value = frame >= delay + frames ? to : Math.round(to * ramp);
  return (
    <span
      style={{
        fontFamily: theme.fonts.mono,
        fontSize: size,
        fontWeight: 800,
        fontVariantNumeric: "tabular-nums",
        letterSpacing: "0.02em",
        lineHeight: 1,
        color,
        whiteSpace: "nowrap",
      }}
    >
      {prefix}
      {value.toLocaleString("ru-RU").replace(/ /g, " ")}
    </span>
  );
};

/* ---------------------------------------------------------------- chain */

/**
 * A link of the chain. `lit` 0..1 takes the outline and text to lime; `hot`
 * 0..1 fills it and glows — the scene hands `hot` to one node at a time.
 */
export const ChainNode: React.FC<{
  label: string;
  note?: string;
  lit?: number;
  hot?: number;
  delay?: number;
  size?: number;
  width?: number;
  tone?: "hero" | "bad";
}> = ({ label, note, lit = 0, hot = 0, delay = 0, size = 60, width = 560, tone = "hero" }) => {
  const p = useIn(delay, "snappy");
  const signal = tone === "hero" ? btcPalette.primary : btcColors.bad;
  const glow = tone === "hero" ? btcPalette.glow : btcColors.badGlow;
  return (
    <div
      style={{
        position: "relative",
        width,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 20,
        padding: `${Math.round(size * 0.32)}px ${Math.round(size * 0.5)}px`,
        background: hot > 0.5 ? signal : btcColors.surface,
        border: `3px solid ${lit > 0.5 ? signal : btcColors.lineStrong}`,
        boxShadow: hot > 0.01 ? `0 0 ${60 * hot}px ${glow}` : btcColors.shadow,
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [30, 0])}px) scale(${interpolate(p, [0, 1], [0.92, 1]) + hot * 0.04})`,
      }}
    >
      <span
        style={{
          fontFamily: theme.fonts.wide,
          fontSize: size,
          fontWeight: 900,
          letterSpacing: "-0.01em",
          lineHeight: 1,
          color: hot > 0.5 ? btcColors.ink2 : lit > 0.5 ? signal : btcPalette.text,
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
      {note && (
        <span
          style={{
            fontFamily: theme.fonts.mono,
            fontSize: Math.round(size * 0.38),
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: hot > 0.5 ? btcColors.ink2 : btcPalette.textDim,
            whiteSpace: "nowrap",
          }}
        >
          {note}
        </span>
      )}
    </div>
  );
};

/* ------------------------------------------------------------ indicator */

/** A tile with a LED, a big glyph and a label — the "watch this" dashboard. */
export const Indicator: React.FC<{
  label: string;
  tone: "hero" | "bad";
  glyph: "up" | "question";
  delay?: number;
  width?: number;
}> = ({ label, tone, glyph, delay = 0, width = 440 }) => {
  const p = useIn(delay, "bouncy");
  const frame = useCurrentFrame();
  const color = tone === "hero" ? btcPalette.primary : btcColors.bad;
  const glow = tone === "hero" ? btcPalette.glow : btcColors.badGlow;
  const blink = Math.sin((frame - delay) / 6) > 0 ? 1 : 0.3;
  return (
    <div
      style={{
        width,
        height: Math.round(width * 0.5),
        position: "relative",
        background: btcColors.surface,
        border: `3px solid ${color}`,
        borderRadius: 20,
        boxShadow: tone === "hero" ? `0 0 50px ${glow}` : btcColors.shadow,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [50, 0])}px) scale(${interpolate(p, [0, 1], [0.8, 1])})`,
      }}
    >
      <span style={{ position: "absolute", left: 18, top: 18, width: 12, height: 12, borderRadius: "50%", background: color, opacity: blink }} />
      {glyph === "up" ? (
        <ArrowGlyph dir="up" size={84} delay={delay + 6} color={color} thick={14} />
      ) : (
        <span style={{ fontFamily: theme.fonts.wide, fontSize: 84, fontWeight: 900, lineHeight: 1, color }}>?</span>
      )}
      <span
        style={{
          fontFamily: theme.fonts.mono,
          fontSize: 24,
          fontWeight: 700,
          letterSpacing: "0.16em",
          color: btcPalette.text,
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
    </div>
  );
};

/* ------------------------------------------------------------------ etf */

/** A spot-ETF share, drawn as a dark ticket. `pulse` 0..1 bumps it on a hit. */
export const EtfCard: React.FC<{ name?: string; ticker?: string; delay?: number; pulse?: number; width?: number }> = ({
  name = "BTC ETF",
  ticker = "SPOT",
  delay = 0,
  pulse = 0,
  width = 280,
}) => {
  const p = useIn(delay, "smooth");
  const h = Math.round(width * 0.64);
  return (
    <div
      style={{
        position: "relative",
        width,
        height: h,
        borderRadius: 18,
        background: `linear-gradient(160deg, ${btcColors.surfaceLift}, ${btcColors.surfaceStrong})`,
        border: `2px solid ${pulse > 0.3 ? btcPalette.primary : btcColors.lineStrong}`,
        boxShadow: btcColors.shadow,
        overflow: "hidden",
        fontFamily: theme.fonts.mono,
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [60, 0])}px) scale(${interpolate(p, [0, 1], [0.9, 1]) + pulse * 0.05})`,
      }}
    >
      {/* slot on top — the money goes in here */}
      <div style={{ position: "absolute", left: "20%", right: "20%", top: 0, height: 8, background: btcPalette.primary, opacity: 0.5 + pulse * 0.5 }} />
      <div style={{ position: "absolute", left: 22, top: 26, fontSize: 30, fontWeight: 800, letterSpacing: "0.06em", color: btcPalette.text }}>{name}</div>
      <div style={{ position: "absolute", left: 22, top: 70, fontSize: 18, letterSpacing: "0.22em", color: btcPalette.textDim }}>{ticker}</div>
      <div style={{ position: "absolute", left: 22, right: 22, bottom: 22, height: 2, background: btcColors.line }} />
      <div style={{ position: "absolute", right: 22, bottom: 34, fontSize: 20, fontWeight: 800, letterSpacing: "0.1em", color: btcPalette.primary }}>IN ↓</div>
    </div>
  );
};

/** Headline swap helper: 0..1 exit for the old headline — up and out, fast. */
export const useExit = (at: number, life = 10) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [at, at + life], [0, 1], {
    easing: theme.ease.in,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
};

