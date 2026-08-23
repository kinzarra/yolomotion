// Episode kit for «Доллар: брать или ждать?». The series look — paper that
// prints, digital that snaps — lives in ../digital-ruble/ui and is re-exported
// untouched; this file adds only what a currency episode needs: a rate line
// that spikes and retraces, chart markers, an exchange-office board, the big
// «КУПИТЬ» button with a cursor that hovers over it, generic foreign-currency
// slips, a key-rate dial, a tear-off calendar, the split-purchase day strip, a
// walking figure, and the scenario lanes.
//
// Same rules as every episode: every entrance moves 2–3 properties on a
// spring, every ramp is eased and clamped, every color comes from the series
// palette. Nothing here names a real bank, broker or exchange.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { useIn, useRamp } from "../../reel";
import { dwColors, dwPalette } from "./palette";
import { rnd } from "../digital-ruble/ui";

export * from "../digital-ruble/ui";

/* ------------------------------------------------------------ helpers */

/** Eased, clamped 0→1 exit ramp (ease-in: exits are faster than entrances). */
export const useExit = (at: number, life = 10) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [at, at + life], [0, 1], {
    easing: theme.ease.in,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
};

/** Hero font stack with the mono face behind it — Unbounded has no ₽. */
export const WIDE = `${theme.fonts.wide}, ${theme.fonts.mono}`;

export type Pt = { x: number; y: number };

const toPath = (pts: Pt[]) =>
  pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");

/** Point at fraction `p` of a polyline's length — for a marker or a glowing tip. */
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

/* --------------------------------------------------------- line shapes */

/**
 * The August move: a run up to a peak at `peakAt`, then a retrace that does
 * NOT come all the way back. Deterministic wobble so it reads as a market and
 * renders identically every frame.
 */
export const spikeLine = (width: number, height: number, n = 30, peakAt = 0.6, seed = 5): Pt[] => {
  const y0 = height * 0.8;
  const yPeak = height * 0.14;
  const yEnd = height * 0.42;
  return Array.from({ length: n }, (_, i) => {
    const t = i / (n - 1);
    const up = t <= peakAt;
    const k = up ? t / peakAt : (t - peakAt) / (1 - peakAt);
    const eased = up ? 1 - Math.pow(1 - k, 2.4) : Math.pow(k, 1.7);
    const y = up ? y0 + (yPeak - y0) * eased : yPeak + (yEnd - yPeak) * eased;
    const wob = i === 0 || i === n - 1 ? 0 : (rnd(seed * 19 + i * 11) - 0.5) * 2 * height * 0.05;
    return { x: t * width, y: y + wob };
  });
};

/** Index of the peak in a `spikeLine` of the same shape — where the marker goes. */
export const spikeIndex = (n = 30, peakAt = 0.6) => Math.round(peakAt * (n - 1));

/** The fever: no trend to speak of, only shakes. `drift` tilts it a little. */
export const feverLine = (width: number, height: number, n = 30, drift = 0.22, seed = 3): Pt[] =>
  Array.from({ length: n }, (_, i) => {
    const t = i / (n - 1);
    const base = height * 0.72 - t * height * drift;
    const jag = (rnd(seed * 13 + i * 7) - 0.5) * 2 * height * 0.2;
    return { x: t * width, y: base + jag };
  });

/** One scenario lane: a trend up, a trend down, or the chop between them. */
export const laneLine = (
  width: number,
  height: number,
  dir: "up" | "down" | "chop",
  n = 20,
  seed = 7,
): Pt[] =>
  Array.from({ length: n }, (_, i) => {
    const t = i / (n - 1);
    const noise = (rnd(seed * 23 + i * 5) - 0.5) * 2;
    if (dir === "chop") {
      return { x: t * width, y: height * 0.5 + noise * height * 0.42 };
    }
    const slope = dir === "up" ? height * 0.72 - t * height * 0.5 : height * 0.28 + t * height * 0.5;
    return { x: t * width, y: slope + noise * height * 0.1 };
  });

/* ---------------------------------------------------------------- chart */

/**
 * The rate line. `progress` draws it left→right; `tip` puts a pulsing dot at
 * the drawing head. `split` (0..1 along the path) lets a scene draw the run-up
 * in one color and the retrace in another — the peak is where the story turns,
 * so it gets to change color there.
 */
export const RateChart: React.FC<{
  id: string;
  width: number;
  height: number;
  pts: Pt[];
  progress: number;
  color?: string;
  /** Everything past this fraction of the path draws in `afterColor`. */
  split?: number;
  afterColor?: string;
  thick?: number;
  glow?: boolean;
  tip?: boolean;
  area?: boolean;
  gridRows?: number;
  gridCols?: number;
  style?: React.CSSProperties;
}> = ({
  id,
  width,
  height,
  pts,
  progress,
  color = dwColors.bad,
  split,
  afterColor = dwPalette.primary,
  thick = 8,
  glow = false,
  tip = false,
  area = false,
  gridRows = 4,
  gridCols = 6,
  style,
}) => {
  const frame = useCurrentFrame();
  const head = progress > 0 && progress < 1 ? pointAt(pts, progress) : null;
  const pulse = 1 + Math.sin(frame / 4) * 0.22;
  const areaPts = [...pts, { x: pts[pts.length - 1].x, y: height }, { x: pts[0].x, y: height }];
  const line = {
    fill: "none" as const,
    strokeWidth: thick,
    strokeLinecap: "square" as const,
    strokeLinejoin: "miter" as const,
    pathLength: 1,
  };
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ display: "block", overflow: "visible", ...style }}
    >
      <defs>
        <linearGradient id={`${id}-area`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.24} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
        <clipPath id={`${id}-clip`}>
          <rect x={0} y={-60} width={width * progress} height={height + 60} />
        </clipPath>
        {split !== undefined && (
          <>
            <clipPath id={`${id}-before`}>
              <rect x={0} y={-60} width={width * split} height={height + 60} />
            </clipPath>
            <clipPath id={`${id}-after`}>
              <rect x={width * split} y={-60} width={width * (1 - split)} height={height + 60} />
            </clipPath>
          </>
        )}
      </defs>

      {/* grid */}
      {Array.from({ length: gridRows + 1 }, (_, i) => (
        <line
          key={`r${i}`}
          x1={0}
          x2={width}
          y1={(i / gridRows) * height}
          y2={(i / gridRows) * height}
          stroke={dwColors.line}
          strokeWidth={1}
          strokeDasharray="4 9"
        />
      ))}
      {Array.from({ length: gridCols + 1 }, (_, i) => (
        <line
          key={`c${i}`}
          y1={0}
          y2={height}
          x1={(i / gridCols) * width}
          x2={(i / gridCols) * width}
          stroke={dwColors.line}
          strokeWidth={1}
          strokeDasharray="4 9"
        />
      ))}

      {area && progress > 0 && (
        <path d={toPath(areaPts)} fill={`url(#${id}-area)`} clipPath={`url(#${id}-clip)`} />
      )}

      {split === undefined ? (
        <path
          d={toPath(pts)}
          {...line}
          stroke={color}
          strokeDasharray={1}
          strokeDashoffset={1 - progress}
          style={glow ? { filter: `drop-shadow(0 0 14px ${color})` } : undefined}
        />
      ) : (
        <>
          <g clipPath={`url(#${id}-before)`}>
            <path
              d={toPath(pts)}
              {...line}
              stroke={color}
              strokeDasharray={1}
              strokeDashoffset={1 - progress}
            />
          </g>
          <g clipPath={`url(#${id}-after)`}>
            <path
              d={toPath(pts)}
              {...line}
              stroke={afterColor}
              strokeDasharray={1}
              strokeDashoffset={1 - progress}
              style={glow ? { filter: `drop-shadow(0 0 14px ${afterColor})` } : undefined}
            />
          </g>
        </>
      )}

      {tip && head && (
        <>
          <circle cx={head.x} cy={head.y} r={24 * pulse} fill={color} opacity={0.2} />
          <circle cx={head.x} cy={head.y} r={10} fill={color} />
        </>
      )}
    </svg>
  );
};

/**
 * A price tag pinned to a point on the chart: a value in a box with a hairline
 * stem down to the line. `tone` picks the register — red is the top nobody
 * should have bought, paper is just a number, lime is the plan.
 */
export const RateTag: React.FC<{
  value: string;
  note?: string;
  tone?: "bad" | "paper" | "hero";
  delay?: number;
  stem?: number;
  size?: number;
  style?: React.CSSProperties;
}> = ({ value, note, tone = "paper", delay = 0, stem = 60, size = 44, style }) => {
  const p = useIn(delay, "snappy");
  const color =
    tone === "bad" ? dwColors.bad : tone === "hero" ? dwPalette.primary : dwColors.paper;
  const ink = tone === "paper" ? dwColors.ink : dwColors.ink2;
  return (
    <div
      style={{
        // Relative on purpose: a caller pins it by wrapping it in an absolute
        // div, so this component keeps full control of its own transform.
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        opacity: Math.min(1, p * 1.4),
        transform: `translateY(${interpolate(p, [0, 1], [-26, 0])}px) scale(${interpolate(p, [0, 1], [0.7, 1])})`,
        ...style,
      }}
    >
      <div
        style={{
          padding: `${Math.round(size * 0.22)}px ${Math.round(size * 0.44)}px`,
          background: color,
          color: ink,
          fontFamily: WIDE,
          fontSize: size,
          fontWeight: 900,
          letterSpacing: "-0.01em",
          lineHeight: 1,
          whiteSpace: "nowrap",
          boxShadow: tone === "bad" ? `0 0 40px ${dwColors.badGlow}` : dwColors.shadow,
        }}
      >
        {value}
      </div>
      {note && (
        <div
          style={{
            marginTop: 8,
            fontFamily: theme.fonts.mono,
            fontSize: Math.round(size * 0.4),
            fontWeight: 700,
            letterSpacing: "0.14em",
            color,
            whiteSpace: "nowrap",
          }}
        >
          {note}
        </div>
      )}
      <div style={{ width: 2, height: stem * p, background: color, opacity: 0.75 }} />
    </div>
  );
};

/* --------------------------------------------------------------- marks */

/** A bar striking through whatever it is laid over. Draws left→right. */
export const Strike: React.FC<{
  delay?: number;
  thick?: number;
  color?: string;
  tilt?: number;
  style?: React.CSSProperties;
}> = ({ delay = 0, thick = 14, color = dwColors.bad, tilt = -3, style }) => {
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
        boxShadow: `0 0 18px ${dwColors.badGlow}`,
        ...style,
      }}
    />
  );
};

/** An arrow that draws itself, left → right. */
export const Arrow: React.FC<{
  width?: number;
  delay?: number;
  color?: string;
  thick?: number;
  style?: React.CSSProperties;
}> = ({ width = 120, delay = 0, color = dwPalette.text, thick = 6, style }) => {
  const p = useRamp(delay, delay + 12, theme.ease.out);
  const head = 18;
  return (
    <svg
      width={width}
      height={head * 2 + 4}
      viewBox={`0 0 ${width} ${head * 2 + 4}`}
      style={{ display: "block", overflow: "visible", ...style }}
    >
      <line
        x1={0}
        y1={head + 2}
        x2={Math.max(0, (width - head) * p)}
        y2={head + 2}
        stroke={color}
        strokeWidth={thick}
        strokeLinecap="square"
      />
      {p > 0.9 && (
        <path
          d={`M${width - head} 2 L${width} ${head + 2} L${width - head} ${head * 2 + 2}`}
          fill="none"
          stroke={color}
          strokeWidth={thick}
          strokeLinecap="square"
          strokeLinejoin="miter"
          opacity={(p - 0.9) * 10}
        />
      )}
    </svg>
  );
};

/** Up / down arrow drawn as a stroke, drawing itself. */
export const TrendGlyph: React.FC<{
  dir: "up" | "down";
  size?: number;
  delay?: number;
  color?: string;
  thick?: number;
  style?: React.CSSProperties;
}> = ({ dir, size = 80, delay = 0, color = dwPalette.text, thick = 12, style }) => {
  const p = useRamp(delay, delay + 12, theme.ease.out);
  const d = dir === "up" ? "M50 92 L50 12 M18 44 L50 12 L82 44" : "M50 8 L50 88 M18 56 L50 88 L82 56";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{ display: "block", overflow: "visible", ...style }}
    >
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

/* -------------------------------------------------------------- the buy */

/**
 * The big «КУПИТЬ». Lime by default — it is the thing everyone wants to press.
 * `press` sinks it; `tone="bad"` is the same button after the news, when
 * pressing it is the mistake.
 */
export const BuyButton: React.FC<{
  label?: string;
  width?: number;
  height?: number;
  delay?: number;
  press?: number;
  tone?: "hero" | "bad" | "muted";
  style?: React.CSSProperties;
}> = ({ label = "КУПИТЬ", width = 640, height = 176, delay = 0, press = 0, tone = "hero", style }) => {
  const p = useIn(delay, "snappy");
  const frame = useCurrentFrame();
  const breathe = 1 + Math.sin(frame / 22) * 0.008;
  const bg =
    tone === "muted"
      ? dwColors.surfaceLift
      : tone === "bad"
        ? dwColors.bad
        : dwPalette.primary;
  const glow = tone === "bad" ? dwColors.badGlow : dwPalette.glow;
  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        borderRadius: Math.round(height * 0.18),
        background: bg,
        color: tone === "muted" ? dwPalette.textDim : dwColors.ink2,
        border: tone === "muted" ? `2px solid ${dwColors.lineStrong}` : undefined,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: WIDE,
        fontSize: Math.round(height * 0.34),
        fontWeight: 900,
        letterSpacing: "0.01em",
        overflow: "hidden",
        opacity: Math.min(1, p * 1.4),
        boxShadow:
          tone === "muted" ? dwColors.shadow : `0 0 ${(height * 0.55) * (1 - press)}px ${glow}`,
        transform: `translateY(${interpolate(p, [0, 1], [70, 0])}px) scale(${
          interpolate(p, [0, 1], [0.86, 1]) * breathe * (1 - press * 0.045)
        })`,
        filter: `brightness(${1 - press * 0.16})`,
        ...style,
      }}
    >
      {/* sheen */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(115deg, transparent 32%, rgba(255,255,255,0.22) 46%, transparent 60%)",
          transform: `translateX(${interpolate(Math.sin(frame / 30), [-1, 1], [-30, 30])}%)`,
        }}
      />
      <span style={{ position: "relative" }}>{label}</span>
    </div>
  );
};

/**
 * A mouse cursor hovering over something. It never presses in this reel —
 * that is the point of the hook. Positioned by its tip.
 */
export const Cursor: React.FC<{
  x: number;
  y: number;
  size?: number;
  delay?: number;
  press?: number;
  float?: number;
  style?: React.CSSProperties;
}> = ({ x, y, size = 96, delay = 0, press = 0, float = 0, style }) => {
  const p = useIn(delay, "snappy");
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y + float,
        width: size,
        height: size * 1.35,
        opacity: Math.min(1, p * 1.6),
        transform: `translate(${interpolate(p, [0, 1], [40, 0])}px, ${interpolate(p, [0, 1], [60, 0])}px) scale(${
          interpolate(p, [0, 1], [0.7, 1]) * (1 - press * 0.12)
        })`,
        transformOrigin: "0% 0%",
        pointerEvents: "none",
        filter: `drop-shadow(0 10px 22px ${dwColors.ink2})`,
        ...style,
      }}
    >
      <svg width={size} height={size * 1.35} viewBox="0 0 40 54">
        <path
          d="M4 2 L4 44 L14 34 L21 50 L28 46 L21 31 L34 30 Z"
          fill={dwColors.white}
          stroke={dwColors.ink2}
          strokeWidth={3}
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

/* -------------------------------------------------------------- paper */

/**
 * A generic foreign-currency note. Deliberately no country, no portrait, no
 * seal — the series draws money as paper, and this is just "валюта".
 */
export const DollarSlip: React.FC<{
  width?: number;
  delay?: number;
  tilt?: number;
  denom?: string;
  style?: React.CSSProperties;
}> = ({ width = 380, delay = 0, tilt = 0, denom = "100", style }) => {
  const p = useIn(delay, "smooth");
  const h = Math.round(width * 0.44);
  return (
    <div
      style={{
        position: "relative",
        width,
        height: h,
        background: `linear-gradient(135deg, ${dwColors.white}, ${dwColors.paperShade})`,
        border: `2px solid ${dwColors.inkRule}`,
        boxShadow: dwColors.paperShadow,
        overflow: "hidden",
        fontFamily: theme.fonts.mono,
        color: dwColors.ink,
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [50, 0])}px) rotate(${tilt}deg) scale(${interpolate(p, [0, 1], [0.9, 1])})`,
        ...style,
      }}
    >
      <div style={{ position: "absolute", inset: 10, border: `3px double ${dwColors.inkRule}` }} />
      {/* guilloche */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: h * 0.66,
          height: h * 0.66,
          marginLeft: -h * 0.33,
          marginTop: -h * 0.33,
          borderRadius: "50%",
          border: `2px solid ${dwColors.inkRule}`,
          backgroundImage: `repeating-radial-gradient(circle, transparent 0 5px, ${dwColors.inkRule} 5px 6px)`,
          opacity: 0.75,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: WIDE,
          fontSize: h * 0.4,
          fontWeight: 900,
          color: dwColors.inkFaded,
        }}
      >
        $
      </div>
      {[
        { l: 24, t: 20 },
        { r: 24, b: 18 },
      ].map((pos, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            ...pos,
            fontSize: width * 0.11,
            fontWeight: 800,
            letterSpacing: "-0.02em",
          }}
        >
          {denom}
        </div>
      ))}
      <div
        style={{
          position: "absolute",
          left: 24,
          bottom: 20,
          fontSize: width * 0.042,
          letterSpacing: "0.2em",
          color: dwColors.inkFaded,
        }}
      >
        ВАЛЮТА · БУМАГА
      </div>
    </div>
  );
};

/* --------------------------------------------------------------- board */

/**
 * The exchange-office board. Two columns, a USD row that the scene can heat
 * up (`hot` 0..1 → red + glow) and a second dim row purely as texture. No
 * bank name — it is every обменник and none of them.
 */
export const RateBoard: React.FC<{
  buy: string;
  sell: string;
  hot?: number;
  delay?: number;
  width?: number;
  title?: string;
  style?: React.CSSProperties;
}> = ({ buy, sell, hot = 0, delay = 0, width = 720, title = "ОБМЕН ВАЛЮТЫ", style }) => {
  const p = useIn(delay, "smooth");
  const frame = useCurrentFrame();
  const blink = Math.sin(frame / 7) > 0 ? 1 : 0.35;
  const signal = hot > 0.02 ? dwColors.bad : dwPalette.text;
  const cell = (text: string, strong: boolean) => (
    <span
      style={{
        fontFamily: WIDE,
        fontSize: strong ? 52 : 34,
        fontWeight: 900,
        letterSpacing: "-0.01em",
        color: strong ? signal : dwPalette.textDim,
        fontVariantNumeric: "tabular-nums",
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </span>
  );
  return (
    <div
      style={{
        position: "relative",
        width,
        padding: "26px 34px 30px",
        borderRadius: 20,
        background: `linear-gradient(170deg, ${dwColors.surfaceLift}, ${dwColors.surfaceStrong})`,
        border: `3px solid ${hot > 0.02 ? dwColors.bad : dwColors.lineStrong}`,
        boxShadow: hot > 0.02 ? `0 0 ${70 * hot}px ${dwColors.badGlow}` : dwColors.shadow,
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [50, 0])}px) scale(${interpolate(p, [0, 1], [0.92, 1])})`,
        ...style,
      }}
    >
      {/* header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          fontFamily: theme.fonts.mono,
          fontSize: 22,
          fontWeight: 700,
          letterSpacing: "0.2em",
          color: dwPalette.textDim,
          marginBottom: 18,
        }}
      >
        <span
          style={{
            width: 11,
            height: 11,
            borderRadius: "50%",
            background: hot > 0.02 ? dwColors.bad : dwPalette.primary,
            opacity: blink,
          }}
        />
        {title}
      </div>
      <div style={{ height: 2, background: dwColors.line, marginBottom: 16 }} />
      {/* column labels */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.1fr 1fr 1fr",
          alignItems: "center",
          fontFamily: theme.fonts.mono,
          fontSize: 19,
          fontWeight: 700,
          letterSpacing: "0.18em",
          color: dwPalette.textDim,
          marginBottom: 10,
        }}
      >
        <span />
        <span style={{ textAlign: "right" }}>ПОКУПКА</span>
        <span style={{ textAlign: "right" }}>ПРОДАЖА</span>
      </div>
      {/* USD */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.1fr 1fr 1fr",
          alignItems: "center",
          padding: "10px 0",
        }}
      >
        <span
          style={{
            fontFamily: WIDE,
            fontSize: 44,
            fontWeight: 900,
            color: signal,
            letterSpacing: "-0.01em",
          }}
        >
          USD
        </span>
        <span style={{ textAlign: "right" }}>{cell(buy, true)}</span>
        <span style={{ textAlign: "right" }}>{cell(sell, true)}</span>
      </div>
      <div style={{ height: 1, background: dwColors.line, margin: "6px 0" }} />
      {/* a second row, dim — texture, not information */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.1fr 1fr 1fr",
          alignItems: "center",
          padding: "8px 0",
          opacity: 0.45,
        }}
      >
        <span
          style={{
            fontFamily: WIDE,
            fontSize: 30,
            fontWeight: 800,
            color: dwPalette.textDim,
          }}
        >
          EUR
        </span>
        <span style={{ textAlign: "right" }}>{cell("—", false)}</span>
        <span style={{ textAlign: "right" }}>{cell("—", false)}</span>
      </div>
    </div>
  );
};

/* ---------------------------------------------------------------- dial */

/**
 * The key-rate dial: a half-circle of ticks with a needle that swings from
 * `from` to `to` over `frames`. Lime only when the scene says so — a frame
 * never holds two glowing things.
 */
export const RateDial: React.FC<{
  from: number;
  to: number;
  max?: number;
  label: string;
  value: string;
  delay?: number;
  size?: number;
  lit?: boolean;
  style?: React.CSSProperties;
}> = ({ from, to, max = 20, label, value, delay = 0, size = 340, lit = true, style }) => {
  const p = useIn(delay, "smooth");
  const swing = useRamp(delay + 8, delay + 40, theme.ease.inOut);
  const current = from + (to - from) * swing;
  const angle = -90 + (current / max) * 180;
  const r = size * 0.42;
  const ticks = 11;
  const color = lit ? dwPalette.primary : dwPalette.text;
  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [40, 0])}px) scale(${interpolate(p, [0, 1], [0.86, 1])})`,
        ...style,
      }}
    >
      <svg width={size} height={size * 0.62} viewBox={`0 0 ${size} ${size * 0.62}`} style={{ display: "block" }}>
        {/* arc */}
        <path
          d={`M ${size / 2 - r} ${size * 0.56} A ${r} ${r} 0 0 1 ${size / 2 + r} ${size * 0.56}`}
          fill="none"
          stroke={dwColors.lineStrong}
          strokeWidth={3}
        />
        {/* ticks */}
        {Array.from({ length: ticks }, (_, i) => {
          const a = (-90 + (i / (ticks - 1)) * 180) * (Math.PI / 180);
          const x0 = size / 2 + Math.sin(a) * (r - 16);
          const y0 = size * 0.56 - Math.cos(a) * (r - 16);
          const x1 = size / 2 + Math.sin(a) * r;
          const y1 = size * 0.56 - Math.cos(a) * r;
          return (
            <line
              key={i}
              x1={x0}
              y1={y0}
              x2={x1}
              y2={y1}
              stroke={dwColors.lineStrong}
              strokeWidth={i % 5 === 0 ? 5 : 2}
            />
          );
        })}
        {/* needle */}
        <g
          style={{
            transform: `rotate(${angle}deg)`,
            transformOrigin: `${size / 2}px ${size * 0.56}px`,
            filter: lit ? `drop-shadow(0 0 14px ${dwPalette.glow})` : undefined,
          }}
        >
          <line
            x1={size / 2}
            y1={size * 0.56}
            x2={size / 2}
            y2={size * 0.56 - r + 6}
            stroke={color}
            strokeWidth={8}
            strokeLinecap="square"
          />
        </g>
        <circle cx={size / 2} cy={size * 0.56} r={14} fill={color} />
      </svg>
      {/* value and label sit UNDER the pivot — the needle sweeps the arc above
          them, so nothing ever covers it */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: size * 0.63,
          textAlign: "center",
          fontFamily: WIDE,
          fontSize: size * 0.19,
          fontWeight: 900,
          letterSpacing: "-0.02em",
          lineHeight: 1,
          color,
        }}
      >
        {value}
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: size * 0.88,
          textAlign: "center",
          fontFamily: theme.fonts.mono,
          fontSize: 21,
          fontWeight: 700,
          letterSpacing: "0.18em",
          color: dwPalette.textDim,
        }}
      >
        {label}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------ calendar */

/** A tear-off calendar page: header band, big day, a note under it. */
export const CalendarTile: React.FC<{
  day: string;
  month: string;
  note?: string;
  tone?: "paper" | "hero";
  delay?: number;
  width?: number;
  style?: React.CSSProperties;
}> = ({ day, month, note, tone = "paper", delay = 0, width = 300, style }) => {
  const p = useIn(delay, "bouncy");
  const band = tone === "hero" ? dwPalette.primary : dwColors.paper;
  return (
    <div
      style={{
        position: "relative",
        width,
        borderRadius: 14,
        background: `linear-gradient(160deg, ${dwColors.white}, ${dwColors.paperShade})`,
        border: `2px solid ${dwColors.inkRule}`,
        boxShadow: dwColors.paperShadow,
        overflow: "hidden",
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [50, 0])}px) rotate(${interpolate(p, [0, 1], [-8, 0])}deg) scale(${interpolate(p, [0, 1], [0.8, 1])})`,
        ...style,
      }}
    >
      <div
        style={{
          background: band,
          color: dwColors.ink,
          padding: "12px 0",
          textAlign: "center",
          fontFamily: theme.fonts.mono,
          fontSize: Math.round(width * 0.075),
          fontWeight: 800,
          letterSpacing: "0.16em",
        }}
      >
        {month}
      </div>
      <div
        style={{
          padding: "10px 0 6px",
          textAlign: "center",
          fontFamily: WIDE,
          fontSize: Math.round(width * 0.44),
          fontWeight: 900,
          letterSpacing: "-0.04em",
          lineHeight: 1,
          color: dwColors.ink,
        }}
      >
        {day}
      </div>
      {note && (
        <div
          style={{
            padding: "0 12px 16px",
            textAlign: "center",
            fontFamily: theme.fonts.mono,
            fontSize: Math.round(width * 0.062),
            fontWeight: 700,
            letterSpacing: "0.1em",
            color: dwColors.inkFaded,
          }}
        >
          {note}
        </div>
      )}
    </div>
  );
};

export type Drop = {
  /** Which day cell it lands in. */
  index: number;
  /** Frame the fall starts. */
  at: number;
  tone: "hero" | "bad";
  /** Diameter, px. */
  size: number;
  label?: string;
};

/**
 * The split-purchase strip: a row of day cells, and tokens that fall into
 * them. One heavy red token in a single cell is «всё сразу»; a handful of
 * lime tokens spread across cells is the plan. The whole argument of the reel
 * is this one picture, so it is a primitive rather than scene-local markup.
 */
export const DayStrip: React.FC<{
  cells?: number;
  width: number;
  delay?: number;
  label?: string;
  drops?: Drop[];
  /** Cell indices to mark as "the day you happened to pick". */
  highlight?: number[];
  shake?: number;
  style?: React.CSSProperties;
}> = ({ cells = 8, width, delay = 0, label, drops = [], highlight = [], shake = 0, style }) => {
  const frame = useCurrentFrame();
  const p = useIn(delay, "smooth");
  const gap = 14;
  const cellW = (width - gap * (cells - 1)) / cells;
  const cellH = Math.round(cellW * 1.15);
  const centerX = (i: number) => i * (cellW + gap) + cellW / 2;
  return (
    <div
      style={{
        position: "relative",
        width,
        opacity: p,
        transform: `translateX(${shake}px) translateY(${interpolate(p, [0, 1], [40, 0])}px)`,
        ...style,
      }}
    >
      {label && (
        <div
          style={{
            fontFamily: theme.fonts.mono,
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: "0.2em",
            color: dwPalette.textDim,
            marginBottom: 14,
          }}
        >
          {label}
        </div>
      )}
      <div style={{ position: "relative", display: "flex", gap, height: cellH }}>
        {Array.from({ length: cells }, (_, i) => {
          const on = highlight.includes(i);
          return (
            <div
              key={i}
              style={{
                width: cellW,
                height: cellH,
                borderRadius: 10,
                background: dwColors.surface,
                border: `2px solid ${on ? dwColors.lineStrong : dwColors.line}`,
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "flex-end",
                padding: 8,
                fontFamily: theme.fonts.mono,
                fontSize: Math.round(cellW * 0.26),
                fontWeight: 700,
                color: dwPalette.textDim,
                opacity: on ? 1 : 0.55,
              }}
            >
              {i + 1}
            </div>
          );
        })}
      </div>
      {/* the tokens falling in */}
      {drops.map((d, i) => {
        const fall = interpolate(frame, [d.at, d.at + 14], [0, 1], {
          easing: theme.ease.out,
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        if (fall <= 0) return null;
        const settle = interpolate(frame, [d.at + 12, d.at + 22], [0, 1], {
          easing: theme.ease.out,
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const color = d.tone === "hero" ? dwPalette.primary : dwColors.bad;
        const glow = d.tone === "hero" ? dwPalette.glow : dwColors.badGlow;
        return (
          <div
            key={`${d.index}-${i}`}
            style={{
              position: "absolute",
              left: centerX(d.index) - d.size / 2,
              top: (label ? 40 : 0) + cellH / 2 - d.size / 2 - (1 - fall) * 260,
              width: d.size,
              height: d.size,
              borderRadius: "50%",
              background: color,
              border: `3px solid ${dwColors.ink2}`,
              boxShadow: `0 0 ${d.size * 0.6}px ${glow}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: WIDE,
              fontSize: Math.round(d.size * 0.4),
              fontWeight: 900,
              color: dwColors.ink2,
              opacity: Math.min(1, fall * 2),
              transform: `scale(${1 + (1 - settle) * 0.12 * fall})`,
            }}
          >
            {d.label ?? "$"}
          </div>
        );
      })}
    </div>
  );
};

/* -------------------------------------------------------------- figure */

/**
 * A person, flat, mid-walk. `walk` drives the leg swing (pass the frame), so
 * a scene can freeze the figure by holding it still. Drawn in textDim, not in
 * a surface color: on this background a surface-colored figure disappears.
 */
export const Walker: React.FC<{
  height?: number;
  delay?: number;
  walk?: number;
  flip?: boolean;
  color?: string;
  style?: React.CSSProperties;
}> = ({ height = 260, delay = 0, walk = 0, flip = false, color = dwPalette.textDim, style }) => {
  const p = useIn(delay, "smooth");
  const w = height * 0.55;
  const swing = Math.sin(walk / 4) * 16;
  const bob = Math.abs(Math.sin(walk / 4)) * 1.6;
  return (
    <svg
      width={w}
      height={height}
      viewBox="0 0 55 100"
      style={{
        display: "block",
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [40, 0]) - bob}px) scaleX(${flip ? -1 : 1})`,
        ...style,
      }}
    >
      {/* legs — the back one darker so the stride reads even when it is small */}
      <g strokeWidth={8} strokeLinecap="round" fill="none">
        <line x1={27} y1={62} x2={27 - swing * 0.55} y2={97} stroke={dwColors.surfaceLift} />
        <line x1={27} y1={62} x2={27 + swing * 0.55} y2={97} stroke={color} />
        {/* arm — swings clear of the body, or it is invisible inside it */}
        <line x1={27} y1={42} x2={27 - swing * 0.95} y2={68} strokeWidth={7} stroke={color} />
      </g>
      {/* body */}
      <path
        d="M27 30 C36 30 41 38 41 48 L41 64 L13 64 L13 48 C13 38 18 30 27 30 Z"
        fill={color}
      />
      {/* head */}
      <circle cx={27} cy={18} r={12} fill={color} />
    </svg>
  );
};

/* --------------------------------------------------------------- rows */

/**
 * `СИТУАЦИЯ → ЧТО ДЕЛАТЬ`. The arrow draws, then the answer snaps in. Lime
 * answers are the plan, red answers are the thing not to do.
 */
export const PlanRow: React.FC<{
  when: string;
  then: string;
  tone?: "hero" | "bad";
  delay?: number;
  width?: number;
  style?: React.CSSProperties;
}> = ({ when, then, tone = "hero", delay = 0, width = 900, style }) => {
  const p = useIn(delay, "snappy");
  const answer = useIn(delay + 12, "snappy");
  const color = tone === "hero" ? dwPalette.primary : dwColors.bad;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 20,
        width,
        opacity: p,
        transform: `translateX(${interpolate(p, [0, 1], [-40, 0])}px)`,
        ...style,
      }}
    >
      <div
        style={{
          flex: "0 0 auto",
          padding: "14px 20px",
          border: `2px solid ${dwColors.lineStrong}`,
          background: dwColors.surface,
          fontFamily: theme.fonts.mono,
          fontSize: 26,
          fontWeight: 700,
          letterSpacing: "0.08em",
          color: dwPalette.text,
          whiteSpace: "nowrap",
        }}
      >
        {when}
      </div>
      <Arrow width={72} delay={delay + 6} color={dwPalette.textDim} thick={5} />
      <div
        style={{
          flex: "0 0 auto",
          padding: "14px 22px",
          border: `3px solid ${color}`,
          background: `${color}14`,
          fontFamily: WIDE,
          fontSize: 30,
          fontWeight: 900,
          letterSpacing: "-0.01em",
          color,
          whiteSpace: "nowrap",
          opacity: Math.min(1, answer * 1.5),
          transform: `scale(${interpolate(answer, [0, 1], [0.8, 1])})`,
        }}
      >
        {then}
      </div>
    </div>
  );
};

/**
 * One scenario lane: a label, a mini chart of the shape it describes, and a
 * dim/lit state so the finale can grey all three at once.
 */
export const Lane: React.FC<{
  id: string;
  label: string;
  dir: "up" | "down" | "chop";
  delay?: number;
  width?: number;
  height?: number;
  dim?: number;
  style?: React.CSSProperties;
}> = ({ id, label, dir, delay = 0, width = 900, height = 130, dim = 0, style }) => {
  const p = useIn(delay, "snappy");
  const draw = useRamp(delay + 4, delay + 30, theme.ease.inOut);
  const chartW = Math.round(width * 0.46);
  const color = dir === "up" ? dwColors.bad : dir === "down" ? dwColors.paper : dwPalette.textDim;
  const pts = React.useMemo(
    () => laneLine(chartW, height - 40, dir, 20, dir === "up" ? 7 : dir === "down" ? 11 : 17),
    [chartW, height, dir],
  );
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 26,
        width,
        height,
        padding: "0 26px",
        border: `2px solid ${dwColors.line}`,
        background: dwColors.surface,
        opacity: p * (1 - dim * 0.72),
        transform: `translateY(${interpolate(p, [0, 1], [34, 0])}px) scale(${interpolate(p, [0, 1], [0.95, 1])})`,
        ...style,
      }}
    >
      <span
        style={{
          fontFamily: WIDE,
          fontSize: 38,
          fontWeight: 900,
          letterSpacing: "-0.01em",
          color: dwPalette.text,
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
      <RateChart
        id={id}
        width={chartW}
        height={height - 40}
        pts={pts}
        progress={draw}
        color={color}
        thick={5}
        gridRows={2}
        gridCols={4}
      />
    </div>
  );
};
