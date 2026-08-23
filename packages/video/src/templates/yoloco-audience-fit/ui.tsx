// Yoloco motion kit. Every entrance moves 2–3 properties on a spring, every
// interpolate is eased + clamped, colors/easings come from theme + palette only.
import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { theme } from "../../theme";
import { yoColors, yoPalette } from "./palette";

type SpringName = keyof typeof theme.spring;

export const useIn = (delay = 0, config: SpringName = "smooth") => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: theme.spring[config] });
};

// Eased 0→1 ramp for non-spring moves (bars, dials, sweeps).
export const useRamp = (from: number, to: number, easing = theme.ease.out) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [from, to], [0, 1], {
    easing,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
};

/* ---------------------------------------------------------------- shell */

export const SceneShell: React.FC<{
  children: React.ReactNode;
  exit?: boolean;
}> = ({ children, exit = true }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = frame / fps;
  // Exit: faster than any entrance (10 frames), eased-in, clamped.
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
          inset: -80,
          opacity: 0.22,
          backgroundImage: `linear-gradient(${yoColors.line} 1px, transparent 1px), linear-gradient(90deg, ${yoColors.line} 1px, transparent 1px)`,
          backgroundSize: "90px 90px",
          transform: `translate(${Math.sin(t * 0.8) * 8}px, ${Math.cos(t * 0.7) * 10}px)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 900,
          height: 900,
          borderRadius: "50%",
          left: -380,
          top: 120,
          // No CSS blur: the gradient is already soft, and a blur() on an
          // 900px layer costs a full-frame filter pass on every frame.
          background: `radial-gradient(circle, ${yoPalette.primary}44, transparent 66%)`,
          transform: `translateY(${Math.sin(t * 0.9) * 26}px)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 820,
          height: 820,
          borderRadius: "50%",
          right: -400,
          bottom: 60,
          background: `radial-gradient(circle, ${yoColors.deep}3A, transparent 68%)`,
          transform: `translateY(${Math.cos(t * 0.75) * 24}px)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 1 - out * 0.78,
          transform: `translateY(${out * -30}px) scale(${1 + out * 0.022})`,
        }}
      >
        {children}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------ primitives */

export const Rise: React.FC<{
  delay?: number;
  config?: SpringName;
  distance?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ delay = 0, config = "smooth", distance = 44, style, children }) => {
  const p = useIn(delay, config);
  return (
    <div
      style={{
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [distance, 0])}px) scale(${interpolate(p, [0, 1], [0.93, 1])})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const Eyebrow: React.FC<{
  children: React.ReactNode;
  delay?: number;
  color?: string;
}> = ({ children, delay = 0, color = yoPalette.accent }) => {
  const p = useIn(delay, "snappy");
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 14,
        opacity: p,
        transform: `translateX(${interpolate(p, [0, 1], [-26, 0])}px)`,
        fontFamily: theme.fonts.mono,
        color,
        fontSize: 27,
        fontWeight: 700,
        letterSpacing: "0.16em",
        textTransform: "uppercase",
      }}
    >
      <span
        style={{
          width: 26,
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

// Large kinetic type: each word rises out of its own clipping mask.
export const Kinetic: React.FC<{
  text: string;
  delay?: number;
  per?: number;
  size?: number;
  color?: string;
  weight?: number;
  align?: "flex-start" | "center";
  style?: React.CSSProperties;
}> = ({
  text,
  delay = 0,
  per = 3,
  size = 116,
  color = yoPalette.text,
  weight = 700,
  align = "flex-start",
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
        columnGap: Math.round(size * 0.26),
        rowGap: Math.round(size * 0.06),
        fontFamily: theme.fonts.display,
        fontSize: size,
        fontWeight: weight,
        lineHeight: 1.02,
        letterSpacing: "-0.045em",
        color,
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
              paddingBottom: Math.round(size * 0.1),
              marginBottom: Math.round(size * -0.1),
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

export const Counter: React.FC<{
  to: number;
  from?: number;
  delay?: number;
  duration?: number;
  format?: (v: number) => string;
  style?: React.CSSProperties;
}> = ({
  to,
  from = 0,
  delay = 0,
  duration = 34,
  format = (v) => Math.round(v).toLocaleString("en-US"),
  style,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [delay, delay + duration], [0, 1], {
    easing: theme.ease.out,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <span style={{ fontVariantNumeric: "tabular-nums", ...style }}>
      {format(from + (to - from) * p)}
    </span>
  );
};

export const Panel: React.FC<{
  delay?: number;
  hero?: boolean;
  danger?: boolean;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ delay = 0, hero = false, danger = false, style, children }) => {
  const p = useIn(delay, "smooth");
  const border = hero
    ? yoPalette.primary
    : danger
      ? yoColors.bad
      : yoColors.line;
  return (
    <div
      style={{
        borderRadius: 34,
        border: `1px solid ${border}`,
        background: hero
          ? yoColors.tint
          : danger
            ? yoColors.badSoft
            : yoColors.surface,
        boxShadow: hero
          ? `0 30px 90px -40px ${yoPalette.glow}`
          : yoColors.shadow,
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [46, 0])}px) scale(${interpolate(p, [0, 1], [0.94, 1])})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/* ----------------------------------------------------------------- data */

export const MetricBar: React.FC<{
  label: string;
  value: number; // 0–100
  delay?: number;
  color?: string;
  trackHeight?: number;
  labelSize?: number;
  suffix?: string;
}> = ({
  label,
  value,
  delay = 0,
  color = yoPalette.primary,
  trackHeight = 20,
  labelSize = 32,
  suffix = "%",
}) => {
  const p = useIn(delay, "snappy");
  const fill = useRamp(delay + 4, delay + 26);
  return (
    <div style={{ width: "100%", opacity: p }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 14,
          fontFamily: theme.fonts.body,
          fontSize: labelSize,
          fontWeight: 600,
          color: yoPalette.textDim,
        }}
      >
        <span>{label}</span>
        <span
          style={{
            color,
            fontFamily: theme.fonts.mono,
            fontWeight: 700,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {Math.round(value * fill)}
          {suffix}
        </span>
      </div>
      <div
        style={{
          height: trackHeight,
          borderRadius: trackHeight,
          background: yoColors.surfaceStrong,
          border: `1px solid ${yoColors.line}`,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${value * fill}%`,
            height: "100%",
            borderRadius: trackHeight,
            background: color,
          }}
        />
      </div>
    </div>
  );
};

// Procedural creator avatar — geometric silhouette, no stock imagery.
export const Avatar: React.FC<{
  size?: number;
  hue?: string;
  muted?: boolean;
}> = ({ size = 168, hue = yoPalette.primary, muted = false }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      overflow: "hidden",
      position: "relative",
      flexShrink: 0,
      background: `linear-gradient(150deg, ${hue}, ${yoColors.deep})`,
      border: `2px solid ${yoColors.lineStrong}`,
      filter: muted ? "saturate(0.25)" : "none",
    }}
  >
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: size * 0.2,
        width: size * 0.34,
        height: size * 0.34,
        marginLeft: size * -0.17,
        borderRadius: "50%",
        background: yoColors.ink,
      }}
    />
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: size * 0.6,
        width: size * 0.62,
        height: size * 0.5,
        marginLeft: size * -0.31,
        borderRadius: `${size * 0.31}px ${size * 0.31}px 0 0`,
        background: yoColors.ink,
      }}
    />
  </div>
);

// Radial score gauge (Yoloco "Brand Readiness" style).
export const Dial: React.FC<{
  value: number; // 0–100
  delay?: number;
  size?: number;
  label: string;
  color?: string;
}> = ({ value, delay = 0, size = 200, label, color = yoPalette.primary }) => {
  const p = useIn(delay, "smooth");
  const sweep = useRamp(delay + 3, delay + 30, theme.ease.inOut);
  const r = size * 0.4;
  const c = 2 * Math.PI * r;
  const arc = 0.75; // three-quarter dial
  return (
    <div
      style={{
        width: size,
        height: size,
        position: "relative",
        opacity: p,
        transform: `scale(${interpolate(p, [0, 1], [0.86, 1])})`,
      }}
    >
      <svg width={size} height={size} style={{ transform: "rotate(135deg)" }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={yoColors.surfaceLift}
          strokeWidth={size * 0.075}
          strokeLinecap="round"
          strokeDasharray={`${c * arc} ${c}`}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={size * 0.075}
          strokeLinecap="round"
          strokeDasharray={`${c * arc * (value / 100) * sweep} ${c}`}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
        }}
      >
        <span
          style={{
            fontFamily: theme.fonts.display,
            fontSize: size * 0.29,
            fontWeight: 700,
            color: yoPalette.text,
            fontVariantNumeric: "tabular-nums",
            letterSpacing: "-0.04em",
          }}
        >
          {Math.round(value * sweep)}
        </span>
        <span
          style={{
            fontFamily: theme.fonts.mono,
            fontSize: size * 0.082,
            letterSpacing: "0.1em",
            color: yoPalette.textDim,
            textTransform: "uppercase",
          }}
        >
          {label}
        </span>
      </div>
    </div>
  );
};

// Hand-drawn-feeling crossout: two strokes swiped across the content.
export const Strike: React.FC<{
  delay?: number;
  color?: string;
  width?: number;
}> = ({ delay = 0, color = yoColors.bad, width = 16 }) => {
  const a = useRamp(delay, delay + 6, theme.ease.out);
  const b = useRamp(delay + 4, delay + 11, theme.ease.out);
  const stroke = (p: number, y1: number, y2: number, rot: number) => ({
    position: "absolute" as const,
    left: "-4%",
    top: `${y1}%`,
    width: `${108 * p}%`,
    height: width,
    borderRadius: width,
    background: color,
    boxShadow: `0 0 30px ${color}77`,
    transform: `translateY(${y2}px) rotate(${rot}deg)`,
    transformOrigin: "left center",
  });
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <div style={stroke(a, 38, 0, -6.5)} />
      <div style={stroke(b, 56, 0, 4.5)} />
    </div>
  );
};

/* ----------------------------------------------------------------- brand */

// The real Yoloco mark: the "Y" from frontend/public/y.svg (copied to
// public/images/yoloco-y.svg), on the rounded primary tile the app header uses.
// Path is inlined so the reveal can be animated; viewBox is the original 20x20.
const Y_PATH =
  "M14.8568 4H19L11.804 12.0229V17H8.19604V12.0229L1 4H5.30176L10.0793 9.64571L14.8568 4Z";

export const YolocoMark: React.FC<{ size?: number; delay?: number }> = ({
  size = 150,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tile = useIn(delay, "bouncy");
  const glyph = useIn(delay + 5, "snappy");
  const breathe = 1 + Math.sin((frame / fps) * 2.2) * 0.016;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.28, // matches the app's rounded-xl tile
        background: yoPalette.primary,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: tile,
        transform: `scale(${interpolate(tile, [0, 1], [0.62, breathe])}) rotate(${interpolate(tile, [0, 1], [-14, 0])}deg)`,
        boxShadow: `0 ${size * 0.16}px ${size * 0.42}px -${size * 0.12}px ${yoPalette.glow}`,
      }}
    >
      <svg
        width={size * 0.6}
        height={size * 0.6}
        viewBox="0 0 20 20"
        fill="none"
        style={{
          opacity: glyph,
          // Wipes up from the stem so the Y assembles rather than fades.
          clipPath: `inset(0 0 ${(1 - glyph) * 100}% 0)`,
          transform: `translateY(${interpolate(glyph, [0, 1], [size * 0.06, 0])}px)`,
        }}
      >
        <path d={Y_PATH} fill={yoPalette.text} />
      </svg>
    </div>
  );
};

// Small solid-tile version for the persistent chapter strip.
export const YolocoTile: React.FC<{ size?: number }> = ({ size = 30 }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.28,
      background: yoPalette.primary,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    }}
  >
    <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 20 20" fill="none">
      <path d={Y_PATH} fill={yoPalette.text} />
    </svg>
  </div>
);

export const YolocoWordmark: React.FC<{
  delay?: number;
  size?: number;
}> = ({ delay = 0, size = 118 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div
      style={{
        display: "flex",
        fontFamily: theme.fonts.body,
        fontSize: size,
        fontWeight: 700,
        letterSpacing: "-0.035em",
        color: yoPalette.text,
      }}
    >
      {"Yoloco".split("").map((ch, i) => {
        const p = spring({
          frame: frame - delay - i * 2,
          fps,
          config: theme.spring.snappy,
        });
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: p,
              transform: `translateY(${interpolate(p, [0, 1], [size * 0.42, 0])}px)`,
            }}
          >
            {ch}
          </span>
        );
      })}
    </div>
  );
};

// Persistent brand strip — keeps the video readable when muted.
export const BrandBar: React.FC<{ chapter: string }> = ({ chapter }) => {
  const p = useIn(-2, "smooth");
  return (
    <div
      style={{
        position: "absolute",
        left: 86,
        right: 86,
        top: 118,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        opacity: p * 0.9,
        transform: `translateY(${interpolate(p, [0, 1], [-20, 0])}px)`,
        fontFamily: theme.fonts.mono,
        fontSize: 24,
        letterSpacing: "0.12em",
        color: yoPalette.textDim,
      }}
    >
      <span style={{ display: "flex", alignItems: "center", gap: 13 }}>
        <YolocoTile size={30} />
        <span
          style={{
            fontFamily: theme.fonts.body,
            fontSize: 27,
            fontWeight: 700,
            letterSpacing: "-0.03em",
            color: yoPalette.text,
          }}
        >
          Yoloco
        </span>
      </span>
      <span>{chapter}</span>
    </div>
  );
};

// One 100%-wide bar split into labelled audience segments — the fastest way to
// show that "1M followers" is mostly not your buyer.
export type Segment = { label: string; value: number; color: string };

export const StackedBar: React.FC<{
  segments: Segment[];
  delay?: number;
  height?: number;
}> = ({ segments, delay = 0, height = 46 }) => {
  const p = useIn(delay, "smooth");
  const draw = useRamp(delay + 3, delay + 30, theme.ease.inOut);
  return (
    <div
      style={{
        width: "100%",
        height,
        borderRadius: height,
        overflow: "hidden",
        display: "flex",
        background: yoColors.surfaceStrong,
        border: `1px solid ${yoColors.line}`,
        opacity: p,
        transform: `scaleX(${interpolate(p, [0, 1], [0.9, 1])})`,
      }}
    >
      {segments.map((s, i) => (
        <div
          key={s.label}
          style={{
            width: `${s.value * draw}%`,
            height: "100%",
            background: s.color,
            borderRight:
              i < segments.length - 1 ? `2px solid ${yoPalette.bg}` : undefined,
          }}
        />
      ))}
    </div>
  );
};

export const Legend: React.FC<{
  segment: Segment;
  delay?: number;
  hero?: boolean;
}> = ({ segment, delay = 0, hero = false }) => {
  const p = useIn(delay, "snappy");
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pulse = hero ? 1 + Math.sin((frame / fps) * 5) * 0.04 : 1;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 20,
        opacity: p,
        transform: `translateX(${interpolate(p, [0, 1], [-30, 0])}px)`,
        fontFamily: theme.fonts.body,
        fontSize: 38,
        fontWeight: 600,
        color: hero ? yoPalette.text : yoPalette.textDim,
      }}
    >
      <span
        style={{
          width: 22,
          height: 22,
          borderRadius: 7,
          background: segment.color,
          transform: `scale(${pulse})`,
          boxShadow: hero ? `0 0 26px ${segment.color}` : undefined,
        }}
      />
      <span
        style={{
          fontFamily: theme.fonts.mono,
          fontWeight: 700,
          minWidth: 108,
          color: hero ? segment.color : yoPalette.text,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {segment.value}%
      </span>
      <span>{segment.label}</span>
    </div>
  );
};

// Sparkline for the engagement pillar — drawn, not faded in.
export const Spark: React.FC<{
  points: number[];
  delay?: number;
  width?: number;
  height?: number;
  color?: string;
}> = ({
  points,
  delay = 0,
  width = 260,
  height = 92,
  color = yoPalette.primary,
}) => {
  const draw = useRamp(delay, delay + 26, theme.ease.out);
  const max = Math.max(...points);
  const d = points
    .map((v, i) => {
      const x = (i / (points.length - 1)) * width;
      const y = height - (v / max) * height * 0.92 - 4;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  const len = width * 1.6;
  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={6}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={len}
        strokeDashoffset={len * (1 - draw)}
      />
    </svg>
  );
};
