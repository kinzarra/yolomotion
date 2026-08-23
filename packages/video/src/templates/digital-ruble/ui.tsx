// Motion kit for the «ЧЕК × ПИКСЕЛЬ» look. Two families of primitives share
// the frame on purpose: PAPER (receipts, banknote, the familiar money — they
// *print* in under a lime head) and DIGITAL (the ₽ mark, glitch slices,
// stamps — they *snap* in). A scene composes both; it never invents a third.
//
// Every entrance moves 2–3 properties on a spring, every interpolate is eased
// and clamped, and every color / easing comes from theme + palette.
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../theme";
import { useIn, useRamp } from "../../reel";
import { drColors, drPalette } from "./palette";

/* ------------------------------------------------------------ helpers */

/** Deterministic 0..1 noise — the same frame always glitches the same way. */
export const rnd = (seed: number) => {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};

/** Zigzag torn edge for thermal paper, as a clip-path polygon. */
const zigzag = (teeth = 26, depth = 14) => {
  const pts: string[] = ["0% 0%", "100% 0%"];
  for (let i = teeth; i >= 0; i -= 1) {
    const x = (i / teeth) * 100;
    const y = i % 2 === 0 ? `100%` : `calc(100% - ${depth}px)`;
    pts.push(`${x}% ${y}`);
  }
  return `polygon(${pts.join(", ")})`;
};
const ZIGZAG = zigzag();

/* -------------------------------------------------------------- shell */

/**
 * Background + exit for every beat: pixel grid, one drifting lime glow, a
 * scanline wash, and a 7-frame exit that is faster than any entrance.
 * `shake` (px) comes from a scene's `usePunch` so an impact moves the frame.
 * `<Reel>` supplies grade / grain / vignette above this.
 */
export const SceneShell: React.FC<{
  children: React.ReactNode;
  exit?: boolean;
  shake?: number;
}> = ({ children, exit = true, shake = 0 }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = frame / fps;
  const out = exit
    ? interpolate(frame, [durationInFrames - 7, durationInFrames - 1], [0, 1], {
        easing: theme.ease.in,
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        background: drPalette.bg,
      }}
    >
      {/* pixel grid — 2px dots on a 48px pitch, drifting a hair */}
      <div
        style={{
          position: "absolute",
          inset: -60,
          opacity: 0.55,
          backgroundImage: `radial-gradient(circle, ${drColors.lineStrong} 1.2px, transparent 1.6px)`,
          backgroundSize: "48px 48px",
          transform: `translate(${Math.sin(t * 0.7) * 8}px, ${Math.cos(t * 0.55) * 10}px)`,
        }}
      />
      {/* the one glow: lime, low, drifting */}
      <div
        style={{
          position: "absolute",
          width: 1100,
          height: 1100,
          borderRadius: "50%",
          left: -380 + Math.sin(t * 0.5) * 40,
          top: 760 + Math.cos(t * 0.4) * 50,
          background: `radial-gradient(circle, ${drPalette.primary}1F, transparent 64%)`,
        }}
      />
      {/* scanlines */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.45,
          backgroundImage:
            "repeating-linear-gradient(180deg, rgba(205,255,59,0.045) 0px, rgba(205,255,59,0.045) 1px, transparent 1px, transparent 4px)",
          backgroundPosition: `0 ${(t * 11) % 4}px`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 1 - out * 0.85,
          transform: `translate(${shake}px, ${out * -30}px) scale(${1 + out * 0.03})`,
        }}
      >
        {children}
      </div>
    </div>
  );
};

/** Full-frame colour flash for impacts. A few frames, never more. */
export const Flash: React.FC<{ amount: number; color?: string }> = ({
  amount,
  color = drPalette.primary,
}) =>
  amount <= 0.001 ? null : (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: color,
        mixBlendMode: "screen",
        opacity: amount * 0.3,
        pointerEvents: "none",
      }}
    />
  );

/** Series tag top-left, episode top-right, a hairline between. */
export const BrandBar: React.FC<{ series: string; episode: string; delay?: number }> = ({
  series,
  episode,
  delay = 0,
}) => {
  const p = useIn(delay, "snappy");
  const frame = useCurrentFrame();
  const blink = Math.sin(frame / 9) > 0.2 ? 1 : 0.25;
  return (
    <div
      style={{
        position: "absolute",
        left: 72,
        right: 72,
        top: 168,
        display: "flex",
        alignItems: "center",
        gap: 20,
        fontFamily: theme.fonts.mono,
        fontSize: 23,
        fontWeight: 700,
        letterSpacing: "0.16em",
        color: drPalette.textDim,
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [-16, 0])}px)`,
      }}
    >
      <span
        style={{
          width: 12,
          height: 12,
          background: drPalette.primary,
          opacity: blink,
        }}
      />
      <span style={{ color: drPalette.text }}>{series}</span>
      <span style={{ flex: 1, height: 1, background: drColors.line }} />
      <span>{episode}</span>
    </div>
  );
};

/* ------------------------------------------------------------- glitch */

/**
 * Datamosh wrapper. `amount` 0 renders the child untouched; above that the
 * child is cut into horizontal bands that shear sideways, with a red and a
 * mint copy offset behind it (RGB split). Deterministic per frame.
 */
export const Glitch: React.FC<{
  amount: number;
  bands?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ amount, bands = 5, children, style }) => {
  const frame = useCurrentFrame();
  if (amount <= 0.001) {
    return <div style={{ position: "relative", ...style }}>{children}</div>;
  }
  const slices = Array.from({ length: bands }, (_, i) => {
    const a = rnd(frame * 7 + i * 13);
    const b = rnd(frame * 3 + i * 29);
    const top = Math.min(a, b) * 100;
    const bottom = 100 - Math.max(a, b) * 100;
    const dx = (rnd(frame * 11 + i * 5) - 0.5) * 2 * 70 * amount;
    return { top, bottom, dx, i };
  });
  const split = 14 * amount;
  return (
    <div style={{ position: "relative", ...style }}>
      {/* channel copies */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translateX(${-split}px)`,
          filter: "sepia(1) saturate(9) hue-rotate(-45deg) brightness(1.1)",
          mixBlendMode: "screen",
          opacity: 0.8,
        }}
      >
        {children}
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translateX(${split}px)`,
          filter: "sepia(1) saturate(9) hue-rotate(60deg) brightness(1.1)",
          mixBlendMode: "screen",
          opacity: 0.8,
        }}
      >
        {children}
      </div>
      {/* base, minus the bands */}
      <div style={{ position: "relative", opacity: 1 - amount * 0.25 }}>{children}</div>
      {/* sheared bands */}
      {slices.map((s) => (
        <div
          key={s.i}
          style={{
            position: "absolute",
            inset: 0,
            clipPath: `inset(${s.top}% 0 ${s.bottom}% 0)`,
            transform: `translateX(${s.dx}px)`,
          }}
        >
          {children}
        </div>
      ))}
    </div>
  );
};

/* --------------------------------------------------------------- type */

export const Eyebrow: React.FC<{
  children: React.ReactNode;
  delay?: number;
  color?: string;
}> = ({ children, delay = 0, color = drPalette.primary }) => {
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
        fontSize: 25,
        fontWeight: 700,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          width: 26,
          height: 4,
          background: color,
          transform: `scaleX(${p})`,
          transformOrigin: "left",
        }}
      />
      {children}
    </div>
  );
};

/**
 * Big kinetic type in Unbounded. Each word rises out of its own mask
 * (`rise`, the paper voice) or snaps in with a skew pop (`snap`, the digital
 * voice). `hero` / `bad` pick word indices for lime / red.
 */
export const Kinetic: React.FC<{
  text: string;
  delay?: number;
  per?: number;
  size?: number;
  weight?: number;
  color?: string;
  align?: "flex-start" | "center";
  hero?: number[];
  bad?: number[];
  glow?: boolean;
  mode?: "rise" | "snap";
  lineHeight?: number;
  style?: React.CSSProperties;
}> = ({
  text,
  delay = 0,
  per = 3,
  size = 104,
  weight = 800,
  color = drPalette.text,
  align = "flex-start",
  hero,
  bad,
  glow = false,
  mode = "rise",
  lineHeight = 1.04,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(" ");
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: align,
        columnGap: Math.round(size * 0.26),
        rowGap: Math.round(size * 0.02),
        // Unbounded has no ₽ — the mono face supplies it, heavy and geometric.
        fontFamily: `${theme.fonts.wide}, ${theme.fonts.mono}`,
        fontSize: size,
        fontWeight: weight,
        lineHeight,
        letterSpacing: "-0.02em",
        color,
        // drop-shadow on the container: the glyphs sit in overflow masks and
        // a text-shadow would be sliced at the mask edge.
        filter: glow ? `drop-shadow(0 0 ${Math.round(size * 0.3)}px ${drPalette.glow})` : undefined,
        ...style,
      }}
    >
      {words.map((word, i) => {
        const p = spring({
          frame: frame - delay - i * per,
          fps,
          config: mode === "snap" ? theme.spring.snappy : theme.spring.smooth,
        });
        const wordColor = hero?.includes(i)
          ? drPalette.primary
          : bad?.includes(i)
            ? drColors.bad
            : undefined;
        const inner =
          mode === "rise"
            ? {
                transform: `translateY(${interpolate(p, [0, 1], [130, 0])}%)`,
              }
            : {
                opacity: p,
                transform: `scale(${interpolate(p, [0, 1], [1.25, 1])}) skewX(${interpolate(p, [0, 1], [-14, 0])}deg)`,
              };
        return (
          <span
            key={`${word}-${i}`}
            style={{
              display: "inline-block",
              overflow: mode === "rise" ? "hidden" : "visible",
              padding: "0.06em 0.02em 0.1em",
              margin: "-0.06em -0.02em -0.1em",
            }}
          >
            <span
              style={{
                display: "inline-block",
                color: wordColor,
                ...inner,
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

/** Mono label in a hairline box. */
export const Chip: React.FC<{
  children: React.ReactNode;
  delay?: number;
  tone?: "neutral" | "hero" | "bad" | "paper";
  size?: number;
  filled?: boolean;
  style?: React.CSSProperties;
}> = ({ children, delay = 0, tone = "neutral", size = 26, filled = false, style }) => {
  const p = useIn(delay, "snappy");
  const color =
    tone === "hero"
      ? drPalette.primary
      : tone === "bad"
        ? drColors.bad
        : tone === "paper"
          ? drColors.ink
          : drPalette.text;
  const bg = filled
    ? color
    : tone === "paper"
      ? drColors.paper
      : drColors.surface;
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 12,
        padding: `${Math.round(size * 0.45)}px ${Math.round(size * 0.8)}px`,
        border: `2px solid ${tone === "paper" ? drColors.paper : color}`,
        background: bg,
        color: filled ? drColors.ink2 : color,
        fontFamily: theme.fonts.mono,
        fontSize: size,
        fontWeight: 700,
        letterSpacing: "0.1em",
        whiteSpace: "nowrap",
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [18, 0])}px) scale(${interpolate(p, [0, 1], [0.92, 1])})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/**
 * A stamp slamming down onto the frame: scale 2.4 → 1 on a snappy spring,
 * tilted, with a thick frame. The impact of the beat.
 */
export const Stamp: React.FC<{
  children: React.ReactNode;
  delay?: number;
  tone?: "hero" | "bad";
  size?: number;
  rotate?: number;
  style?: React.CSSProperties;
}> = ({ children, delay = 0, tone = "bad", size = 96, rotate = -7, style }) => {
  const p = useIn(delay, "snappy");
  const color = tone === "bad" ? drColors.bad : drPalette.primary;
  const glow = tone === "bad" ? drColors.badGlow : drPalette.glow;
  return (
    <div
      style={{
        display: "inline-block",
        padding: `${Math.round(size * 0.12)}px ${Math.round(size * 0.3)}px`,
        border: `${Math.max(6, Math.round(size * 0.08))}px solid ${color}`,
        color,
        fontFamily: theme.fonts.wide,
        fontSize: size,
        fontWeight: 900,
        letterSpacing: "-0.01em",
        lineHeight: 1,
        whiteSpace: "nowrap",
        opacity: Math.min(1, p * 1.6),
        transform: `rotate(${rotate}deg) scale(${interpolate(p, [0, 1], [2.4, 1])})`,
        filter: `drop-shadow(0 0 ${Math.round(size * 0.28)}px ${glow})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/* ------------------------------------------------------------- marks */

/** Red X — two bars scaling in with a stagger. */
export const Cross: React.FC<{ delay?: number; size?: number; thick?: number }> = ({
  delay = 0,
  size = 120,
  thick = 16,
}) => {
  const a = useIn(delay, "snappy");
  const b = useIn(delay + 3, "snappy");
  const bar = (p: number, deg: number) => (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: size,
        height: thick,
        marginLeft: -size / 2,
        marginTop: -thick / 2,
        background: drColors.bad,
        transform: `rotate(${deg}deg) scaleX(${p})`,
      }}
    />
  );
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      {bar(a, 45)}
      {bar(b, -45)}
    </div>
  );
};

/** Lime check — a stroke drawing itself. */
export const Check: React.FC<{ delay?: number; size?: number; color?: string }> = ({
  delay = 0,
  size = 120,
  color = drPalette.primary,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [delay, delay + 14], [0, 1], {
    easing: theme.ease.out,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const len = 140;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "block" }}>
      <path
        d="M14 54 L40 80 L88 24"
        fill="none"
        stroke={color}
        strokeWidth={14}
        strokeLinecap="square"
        strokeLinejoin="miter"
        strokeDasharray={len}
        strokeDashoffset={len * (1 - p)}
      />
    </svg>
  );
};

/**
 * The digital ruble mark: a dot-matrix tile with a heavy ₽. `lit` turns the
 * glow on — the scene decides, so a frame never holds two glowing things.
 */
export const RubleMark: React.FC<{
  size?: number;
  lit?: boolean;
  delay?: number;
  style?: React.CSSProperties;
}> = ({ size = 360, lit = true, delay = 0, style }) => {
  const p = useIn(delay, "bouncy");
  const frame = useCurrentFrame();
  const breathe = 1 + Math.sin(frame / 20) * 0.012;
  const r = Math.round(size * 0.16);
  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        borderRadius: r,
        background: `linear-gradient(160deg, ${drColors.surfaceLift}, ${drColors.surfaceStrong})`,
        border: `${Math.max(3, Math.round(size * 0.012))}px solid ${drPalette.primary}`,
        boxShadow: lit
          ? `0 0 ${size * 0.18}px ${drPalette.glow}, 0 0 ${size * 0.5}px ${drPalette.primary}26, ${drColors.shadow}`
          : drColors.shadow,
        opacity: p,
        transform: `scale(${interpolate(p, [0, 1], [0.5, 1]) * breathe}) rotate(${interpolate(p, [0, 1], [-12, 0])}deg)`,
        overflow: "hidden",
        ...style,
      }}
    >
      {/* dot matrix */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `radial-gradient(circle, ${drPalette.primary}40 1.4px, transparent 2px)`,
          backgroundSize: `${Math.round(size * 0.055)}px ${Math.round(size * 0.055)}px`,
          opacity: 0.9,
        }}
      />
      {/* corner ticks */}
      {[
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
      ].map(([x, y]) => (
        <div
          key={`${x}${y}`}
          style={{
            position: "absolute",
            width: size * 0.045,
            height: size * 0.045,
            background: drPalette.primary,
            left: x ? undefined : size * 0.07,
            right: x ? size * 0.07 : undefined,
            top: y ? undefined : size * 0.07,
            bottom: y ? size * 0.07 : undefined,
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: `${theme.fonts.wide}, ${theme.fonts.mono}`,
          fontSize: size * 0.58,
          fontWeight: 900,
          lineHeight: 1,
          color: drPalette.primary,
          textShadow: lit ? `0 0 ${size * 0.12}px ${drPalette.glow}` : undefined,
        }}
      >
        ₽
      </div>
    </div>
  );
};

/** Round ₽ token — the "one ruble" that gets cloned, in three finishes. */
export const Token: React.FC<{
  size?: number;
  tone?: "paper" | "dark" | "hero";
  delay?: number;
  label?: string;
  style?: React.CSSProperties;
}> = ({ size = 200, tone = "paper", delay = 0, label = "₽", style }) => {
  const p = useIn(delay, "bouncy");
  const bg =
    tone === "paper"
      ? `radial-gradient(circle at 35% 30%, ${drColors.white}, ${drColors.paperShade})`
      : tone === "dark"
        ? `radial-gradient(circle at 35% 30%, ${drColors.surfaceLift}, ${drColors.surfaceStrong})`
        : `radial-gradient(circle at 35% 30%, ${drPalette.primary}, #9FD915)`;
  const fg = tone === "dark" ? drPalette.text : drColors.ink;
  const ring = tone === "hero" ? drPalette.primary : tone === "dark" ? drColors.lineStrong : drColors.inkRule;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: bg,
        border: `${Math.round(size * 0.03)}px solid ${ring}`,
        boxShadow:
          tone === "hero" ? `0 0 ${size * 0.3}px ${drPalette.glow}, ${drColors.shadow}` : drColors.shadow,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: `${theme.fonts.wide}, ${theme.fonts.mono}`,
        fontSize: size * 0.5,
        fontWeight: 900,
        color: fg,
        opacity: p,
        transform: `scale(${interpolate(p, [0, 1], [0.4, 1])}) rotate(${interpolate(p, [0, 1], [-30, 0])}deg)`,
        ...style,
      }}
    >
      {label}
    </div>
  );
};

/* -------------------------------------------------------------- paper */

/**
 * Thermal receipt. It prints: the paper is revealed top→down over
 * `printFrames` under a lime print head, and the bottom edge is torn.
 * Children are `ReceiptLine`s / `ReceiptRule`s / anything in ink.
 */
export const Receipt: React.FC<{
  children: React.ReactNode;
  width?: number;
  printFrom?: number;
  printFrames?: number;
  title?: string;
  number?: string;
  tilt?: number;
  style?: React.CSSProperties;
}> = ({
  children,
  width = 620,
  printFrom = 0,
  printFrames = 30,
  title,
  number,
  tilt = 0,
  style,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [printFrom, printFrom + printFrames], [0, 1], {
    easing: theme.ease.inOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const headAlpha = p > 0 && p < 1 ? Math.sin(p * Math.PI) : 0;
  return (
    <div
      style={{
        position: "relative",
        width,
        transform: `rotate(${tilt}deg)`,
        filter: `drop-shadow(${drColors.paperShadow})`,
        ...style,
      }}
    >
      <div style={{ clipPath: `inset(0 0 ${(1 - p) * 100}% 0)` }}>
        <div
          style={{
            background: drColors.paper,
            clipPath: ZIGZAG,
            padding: "34px 40px 48px",
            fontFamily: theme.fonts.mono,
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: "0.04em",
            color: drColors.ink,
            backgroundImage:
              "repeating-linear-gradient(90deg, transparent 0px, transparent 3px, rgba(21,23,26,0.03) 3px, rgba(21,23,26,0.03) 4px)",
          }}
        >
          {(title || number) && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                marginBottom: 16,
                fontSize: 22,
                letterSpacing: "0.14em",
                color: drColors.inkFaded,
              }}
            >
              <span>{title}</span>
              <span>{number}</span>
            </div>
          )}
          {children}
        </div>
      </div>
      {/* print head */}
      <div
        style={{
          position: "absolute",
          left: -18,
          right: -18,
          top: `${p * 100}%`,
          height: 6,
          marginTop: -3,
          background: drPalette.primary,
          boxShadow: `0 0 24px ${drPalette.glow}`,
          opacity: headAlpha,
        }}
      />
    </div>
  );
};

export const ReceiptRule: React.FC<{ strong?: boolean }> = ({ strong = false }) => (
  <div
    style={{
      borderTop: `${strong ? 3 : 2}px ${strong ? "solid" : "dashed"} ${strong ? drColors.ink : drColors.inkRule}`,
      margin: "16px 0",
    }}
  />
);

/** `LABEL ........ VALUE`, with an optional red cross or lime check. */
export const ReceiptLine: React.FC<{
  label: React.ReactNode;
  value?: React.ReactNode;
  mark?: "cross" | "check";
  strong?: boolean;
  faded?: boolean;
  size?: number;
  delay?: number;
}> = ({ label, value, mark, strong = false, faded = false, size = 26, delay = 0 }) => {
  const p = useIn(delay, "snappy");
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        fontSize: size,
        fontWeight: strong ? 800 : 700,
        color: faded ? drColors.inkFaded : drColors.ink,
        padding: "8px 0",
        opacity: p,
        transform: `translateX(${interpolate(p, [0, 1], [-14, 0])}px)`,
      }}
    >
      <span style={{ whiteSpace: "nowrap" }}>{label}</span>
      <span
        style={{
          flex: 1,
          borderBottom: `2px dotted ${drColors.inkRule}`,
          transform: "translateY(-0.2em)",
          minWidth: 20,
        }}
      />
      {value !== undefined && <span style={{ whiteSpace: "nowrap" }}>{value}</span>}
      {mark === "cross" && <Cross delay={delay + 4} size={size * 1.1} thick={Math.max(4, size * 0.16)} />}
      {mark === "check" && <Check delay={delay + 4} size={size * 1.3} color={drColors.ink} />}
    </div>
  );
};

/** A banknote-ish paper slip. Deliberately generic: no issuer, no portrait. */
export const Banknote: React.FC<{ width?: number; delay?: number; style?: React.CSSProperties }> = ({
  width = 420,
  delay = 0,
  style,
}) => {
  const p = useIn(delay, "smooth");
  const h = Math.round(width * 0.46);
  return (
    <div
      style={{
        position: "relative",
        width,
        height: h,
        background: `linear-gradient(135deg, ${drColors.white}, ${drColors.paperShade})`,
        border: `2px solid ${drColors.inkRule}`,
        boxShadow: drColors.paperShadow,
        overflow: "hidden",
        fontFamily: theme.fonts.mono,
        color: drColors.ink,
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [40, 0])}px) scale(${interpolate(p, [0, 1], [0.92, 1])})`,
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 12,
          border: `3px double ${drColors.inkRule}`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: h * 0.62,
          height: h * 0.62,
          marginLeft: -h * 0.31,
          marginTop: -h * 0.31,
          borderRadius: "50%",
          border: `2px solid ${drColors.inkRule}`,
          backgroundImage: `repeating-radial-gradient(circle, transparent 0 6px, ${drColors.inkRule} 6px 7px)`,
          opacity: 0.7,
        }}
      />
      {[
        { l: 28, t: 24 },
        { r: 28, b: 22 },
      ].map((pos, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            ...pos,
            fontSize: width * 0.1,
            fontWeight: 800,
            letterSpacing: "-0.02em",
          }}
        >
          5000
        </div>
      ))}
      <div
        style={{
          position: "absolute",
          left: 28,
          bottom: 24,
          fontSize: width * 0.04,
          letterSpacing: "0.2em",
          color: drColors.inkFaded,
        }}
      >
        НАЛИЧНЫЕ · БУМАГА
      </div>
    </div>
  );
};

/* ------------------------------------------------------------ objects */

/** A plain debit card drawn in CSS. No brands. */
export const BankCard: React.FC<{
  width?: number;
  delay?: number;
  tone?: "dark" | "paper";
  style?: React.CSSProperties;
}> = ({ width = 640, delay = 0, tone = "dark", style }) => {
  const p = useIn(delay, "smooth");
  const h = Math.round(width / 1.586);
  const fg = tone === "dark" ? drPalette.text : drColors.ink;
  const dim = tone === "dark" ? drPalette.textDim : drColors.inkFaded;
  return (
    <div
      style={{
        position: "relative",
        width,
        height: h,
        borderRadius: Math.round(width * 0.05),
        background:
          tone === "dark"
            ? `linear-gradient(135deg, ${drColors.surfaceLift} 0%, ${drColors.surfaceStrong} 55%, #0B0E12 100%)`
            : `linear-gradient(135deg, ${drColors.white}, ${drColors.paperShade})`,
        border: `2px solid ${tone === "dark" ? drColors.lineStrong : drColors.inkRule}`,
        boxShadow: drColors.shadow,
        overflow: "hidden",
        fontFamily: theme.fonts.mono,
        color: fg,
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [50, 0])}px) scale(${interpolate(p, [0, 1], [0.9, 1])})`,
        ...style,
      }}
    >
      {/* sheen */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.07) 45%, transparent 60%)",
        }}
      />
      {/* chip */}
      <div
        style={{
          position: "absolute",
          left: width * 0.07,
          top: h * 0.3,
          width: width * 0.12,
          height: width * 0.09,
          borderRadius: 8,
          background: `linear-gradient(135deg, #C9CDD2, #8F959C)`,
          border: `1px solid ${drColors.lineStrong}`,
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", left: 0, right: 0, top: "33%", height: 1, background: "#5F666D" }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: "66%", height: 1, background: "#5F666D" }} />
        <div style={{ position: "absolute", top: 0, bottom: 0, left: "50%", width: 1, background: "#5F666D" }} />
      </div>
      {/* contactless */}
      <svg
        width={width * 0.09}
        height={width * 0.09}
        viewBox="0 0 40 40"
        style={{ position: "absolute", left: width * 0.22, top: h * 0.3 }}
      >
        {[10, 17, 24].map((r) => (
          <path
            key={r}
            d={`M ${20 - r * 0.7} ${20 - r * 0.7} A ${r} ${r} 0 0 1 ${20 - r * 0.7} ${20 + r * 0.7}`}
            fill="none"
            stroke={dim}
            strokeWidth={2.4}
            strokeLinecap="round"
            transform="rotate(180 20 20)"
          />
        ))}
      </svg>
      <div
        style={{
          position: "absolute",
          left: width * 0.07,
          top: h * 0.6,
          fontSize: width * 0.052,
          fontWeight: 700,
          letterSpacing: "0.12em",
        }}
      >
        •••• •••• •••• 4821
      </div>
      <div
        style={{
          position: "absolute",
          left: width * 0.07,
          bottom: h * 0.1,
          fontSize: width * 0.028,
          letterSpacing: "0.18em",
          color: dim,
        }}
      >
        ДЕБЕТОВАЯ · 09/28
      </div>
      <div
        style={{
          position: "absolute",
          right: width * 0.07,
          top: h * 0.1,
          fontSize: width * 0.03,
          letterSpacing: "0.2em",
          color: dim,
        }}
      >
        БАНК
      </div>
    </div>
  );
};

/** Phone shell with a slot for a screen. */
export const Phone: React.FC<{
  width?: number;
  height?: number;
  delay?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ width = 440, height = 860, delay = 0, children, style }) => {
  const p = useIn(delay, "smooth");
  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        borderRadius: 56,
        background: "#0B0E12",
        border: `3px solid ${drColors.lineStrong}`,
        boxShadow: drColors.shadow,
        overflow: "hidden",
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [120, 0])}px) scale(${interpolate(p, [0, 1], [0.94, 1])})`,
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 18,
          width: 120,
          height: 30,
          marginLeft: -60,
          borderRadius: 20,
          background: drColors.ink2,
          border: `1px solid ${drColors.line}`,
          zIndex: 2,
        }}
      />
      <div style={{ position: "absolute", inset: 0, background: drColors.surfaceStrong }}>{children}</div>
    </div>
  );
};

/** Switch. `on` is 0..1 so it can be driven by a spring. */
export const Toggle: React.FC<{ on: number; width?: number }> = ({ on, width = 200 }) => {
  const h = width * 0.5;
  const pad = width * 0.05;
  const knob = h - pad * 2;
  return (
    <div
      style={{
        position: "relative",
        width,
        height: h,
        borderRadius: h,
        background: `linear-gradient(90deg, ${drColors.surfaceLift} 0%, ${drColors.surfaceLift} 42%, ${drPalette.primary} 58%, ${drPalette.primary} 100%)`,
        backgroundSize: "200% 100%",
        backgroundPosition: `${on * 100}% 0`,
        border: `2px solid ${drColors.lineStrong}`,
        boxShadow: on > 0.5 ? `0 0 ${width * 0.25}px ${drPalette.glow}` : undefined,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: pad - 2,
          left: pad - 2 + on * (width - knob - pad * 2),
          width: knob,
          height: knob,
          borderRadius: "50%",
          background: on > 0.5 ? drColors.ink2 : drPalette.text,
        }}
      />
    </div>
  );
};

/** Expanding ring from a point — the coin hit, drawn. */
export const Shockwave: React.FC<{ at: number; life?: number; color?: string; size?: number }> = ({
  at,
  life = 22,
  color = drPalette.primary,
  size = 1400,
}) => {
  const p = useRamp(at, at + life, theme.ease.out);
  if (p <= 0 || p >= 1) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: size * p,
        height: size * p,
        marginLeft: (-size * p) / 2,
        marginTop: (-size * p) / 2,
        borderRadius: "50%",
        border: `${Math.round(22 * (1 - p) + 2)}px solid ${color}`,
        opacity: 1 - p,
        pointerEvents: "none",
      }}
    />
  );
};

/** A lime portal: rotating dashed ring around a dark well. */
export const Portal: React.FC<{ size?: number; delay?: number; style?: React.CSSProperties }> = ({
  size = 420,
  delay = 0,
  style,
}) => {
  const p = useIn(delay, "bouncy");
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        opacity: p,
        transform: `scale(${interpolate(p, [0, 1], [0.2, 1])})`,
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${drColors.ink2} 0%, ${drColors.ink2} 38%, ${drPalette.primary}55 70%, transparent 72%)`,
          boxShadow: `0 0 ${size * 0.25}px ${drPalette.glow}`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: size * 0.06,
          borderRadius: "50%",
          border: `${Math.round(size * 0.02)}px dashed ${drPalette.primary}`,
          transform: `rotate(${frame * 2.4}deg)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: size * 0.16,
          borderRadius: "50%",
          border: `${Math.round(size * 0.01)}px solid ${drPalette.primary}`,
          opacity: 0.7,
          transform: `rotate(${-frame * 1.6}deg) scale(${1 + Math.sin(frame / 6) * 0.03})`,
        }}
      />
    </div>
  );
};

/** Tabular-number counter on a spring. */
export const Counter: React.FC<{
  to: number;
  delay?: number;
  size?: number;
  color?: string;
  prefix?: string;
}> = ({ to, delay = 0, size = 120, color = drPalette.text, prefix = "" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: { damping: 34, stiffness: 40, mass: 1 } });
  const value = Math.round(interpolate(p, [0, 1], [0, to]));
  return (
    <span
      style={{
        fontFamily: theme.fonts.wide,
        fontSize: size,
        fontWeight: 900,
        fontVariantNumeric: "tabular-nums",
        letterSpacing: "-0.02em",
        color,
      }}
    >
      {prefix}
      {value.toLocaleString("ru-RU").replace(/ /g, " ")}
    </span>
  );
};
