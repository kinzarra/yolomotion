// Motion kit for the indexes Short. Every entrance moves 2–3 properties on a
// spring, every interpolate is eased and clamped, and all colors/easings come
// from theme + palette. Nothing here is inlined per-scene.
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
import { idxColors, idxPalette, syntax, SyntaxKind } from "./palette";

type SpringName = keyof typeof theme.spring;

/* ------------------------------------------------------------- timing */

export const useIn = (delay = 0, config: SpringName = "smooth") => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: theme.spring[config] });
};

/** Eased 0→1 ramp for non-spring moves (bars, sweeps, typing, counters). */
export const useRamp = (from: number, to: number, easing = theme.ease.out) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [from, to], [0, 1], {
    easing,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
};

/** Impact: 0 → 1 → 0 decay for slams. Drives scale punch + shake together. */
export const usePunch = (at: number, life = 16) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [at, at + life], [0, 1], {
    easing: theme.ease.out,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const decay = 1 - t;
  return {
    // Damped oscillation, dead before and after the window.
    shake: frame < at ? 0 : Math.sin((frame - at) * 1.5) * decay * decay * 26,
    pop: frame < at ? 0 : Math.sin(t * Math.PI) * decay,
    energy: frame < at ? 0 : decay * decay,
  };
};

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
          backgroundImage: `linear-gradient(${idxColors.line} 1px, transparent 1px), linear-gradient(90deg, ${idxColors.line} 1px, transparent 1px)`,
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
          top: 90,
          background: `radial-gradient(circle, ${idxColors.blue}3D, transparent 66%)`,
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
          background: `radial-gradient(circle, ${idxPalette.primary}26, transparent 68%)`,
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
}> = ({ children, delay = 0, color = idxPalette.accent }) => {
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
  color = idxPalette.text,
  weight = 700,
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
        textShadow: glow ? `0 0 ${size * 0.6}px ${color}55` : undefined,
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

export const Counter: React.FC<{
  to: number;
  from?: number;
  delay?: number;
  duration?: number;
  easing?: (n: number) => number;
  format?: (v: number) => string;
  style?: React.CSSProperties;
}> = ({
  to,
  from = 0,
  delay = 0,
  duration = 34,
  easing = theme.ease.out,
  format = (v) => Math.round(v).toLocaleString("en-US"),
  style,
}) => {
  const p = useRamp(delay, delay + duration, easing);
  return (
    <span style={{ fontVariantNumeric: "tabular-nums", ...style }}>
      {format(from + (to - from) * p)}
    </span>
  );
};

/* ------------------------------------------------------------ surfaces */

export type Tone = "neutral" | "hero" | "blue" | "good" | "danger";

const toneBorder: Record<Tone, string> = {
  neutral: idxColors.line,
  hero: idxPalette.primary,
  blue: idxPalette.accent,
  good: idxColors.good,
  danger: idxColors.danger,
};

const toneFill: Record<Tone, string> = {
  neutral: idxColors.surface,
  hero: idxColors.tint,
  blue: idxColors.blueSoft,
  good: idxColors.goodSoft,
  danger: idxColors.dangerSoft,
};

export const Panel: React.FC<{
  delay?: number;
  tone?: Tone;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ delay = 0, tone = "neutral", style, children }) => {
  const p = useIn(delay, "smooth");
  return (
    <div
      style={{
        borderRadius: 30,
        border: `1px solid ${toneBorder[tone]}`,
        background: toneFill[tone],
        boxShadow:
          tone === "hero"
            ? `0 30px 90px -42px ${idxPalette.glow}`
            : idxColors.shadow,
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
  const color =
    tone === "neutral" ? idxPalette.textDim : toneBorder[tone];
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 14,
        padding: `${Math.round(size * 0.45)}px ${Math.round(size * 0.8)}px`,
        borderRadius: 999,
        border: `1px solid ${tone === "neutral" ? idxColors.line : color}`,
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

/* ---------------------------------------------------------------- code */

const KEYWORDS = new Set([
  "SELECT", "FROM", "WHERE", "CREATE", "INDEX", "ON", "AND", "LIMIT",
  "EXPLAIN", "ANALYZE", "USING", "ORDER", "BY",
]);

type Token = { text: string; kind: SyntaxKind };

export const tokenize = (src: string): Token[] =>
  (src.match(/'[^']*'|[A-Za-z_][A-Za-z0-9_]*|\d+|\s+|./g) ?? []).map((text) => ({
    text,
    kind: text.startsWith("'")
      ? "str"
      : KEYWORDS.has(text.toUpperCase())
        ? "kw"
        : /^\d/.test(text)
          ? "num"
          : /^[A-Za-z_]/.test(text)
            ? "id"
            : /^\s+$/.test(text)
              ? "plain"
              : "punct",
  }));

/** SQL typed in character by character, with a blinking block cursor. */
export const TypedCode: React.FC<{
  code: string;
  delay?: number;
  duration?: number;
  size?: number;
  cursor?: boolean;
}> = ({ code, delay = 0, duration = 34, size = 30, cursor = true }) => {
  const frame = useCurrentFrame();
  const typed = useRamp(delay, delay + duration, theme.ease.inOut);
  const visible = Math.round(code.length * typed);
  let seen = 0;
  return (
    <div
      style={{
        fontFamily: theme.fonts.mono,
        fontSize: size,
        lineHeight: 1.45,
        letterSpacing: "-0.01em",
        color: syntax.plain,
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
      }}
    >
      {tokenize(code).map((tok, i) => {
        const start = seen;
        seen += tok.text.length;
        const slice = tok.text.slice(
          0,
          Math.max(0, Math.min(tok.text.length, visible - start)),
        );
        if (!slice) return null;
        return (
          <span
            key={i}
            style={{
              color: syntax[tok.kind],
              fontWeight: tok.kind === "kw" ? 700 : 500,
            }}
          >
            {slice}
          </span>
        );
      })}
      {cursor ? (
        <span
          style={{
            display: "inline-block",
            width: size * 0.55,
            height: size * 1.05,
            marginLeft: 4,
            verticalAlign: "text-bottom",
            background: idxPalette.primary,
            opacity: Math.floor(frame / 8) % 2 === 0 ? 1 : 0.16,
            boxShadow: `0 0 22px ${idxPalette.glow}`,
          }}
        />
      ) : null}
    </div>
  );
};

/** Terminal / editor window chrome. */
export const TerminalCard: React.FC<{
  title: string;
  delay?: number;
  tone?: Tone;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ title, delay = 0, tone = "neutral", children, style }) => (
  <Panel delay={delay} tone={tone} style={{ overflow: "hidden", ...style }}>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "20px 28px",
        borderBottom: `1px solid ${idxColors.line}`,
        background: idxColors.surfaceStrong,
        fontFamily: theme.fonts.mono,
        fontSize: 23,
        letterSpacing: "0.1em",
        color: idxPalette.textDim,
      }}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: 13,
            height: 13,
            borderRadius: 7,
            background: idxColors.lineStrong,
            opacity: 0.8 - i * 0.18,
          }}
        />
      ))}
      <span style={{ marginLeft: 14 }}>{title}</span>
    </div>
    <div style={{ padding: "26px 28px" }}>{children}</div>
  </Panel>
);

/* ---------------------------------------------------------------- data */

// Deterministic pseudo-random rows — Math.random() would differ per render pass.
const NAMES = ["kai", "zoe", "noor", "ravi", "lena", "theo", "mika", "omar",
  "iris", "dan", "sam", "jun", "ada", "niko", "vera", "piotr"];
const DOMAINS = ["ship.ai", "build.io", "deploy.sh", "vibe.dev", "stackr.co",
  "edgeql.net"];

const rnd = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

export const fakeRow = (i: number) => ({
  id: String(100000 + Math.floor(rnd(i + 19.1) * 899999)),
  email: `${NAMES[Math.floor(rnd(i) * NAMES.length)]}@${DOMAINS[Math.floor(rnd(i + 7.3) * DOMAINS.length)]}`,
});

export type RowState = "idle" | "checked" | "hit";

export const TableRow: React.FC<{
  index: number;
  height: number;
  state?: RowState;
  email?: string;
  opacity?: number;
}> = ({ index, height, state = "idle", email, opacity = 1 }) => {
  const dense = height < 30;
  const row = fakeRow(index);
  const label = email ?? row.email;
  const color =
    state === "hit"
      ? idxColors.good
      : state === "checked"
        ? idxColors.danger
        : idxPalette.textDim;
  return (
    <div
      style={{
        height,
        boxSizing: "border-box",
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        gap: dense ? 14 : 26,
        padding: dense ? "0 18px" : "0 28px",
        borderBottom: `1px solid ${idxColors.line}`,
        background:
          state === "hit"
            ? idxColors.goodSoft
            : state === "checked"
              ? idxColors.dangerSoft
              : "transparent",
        opacity,
      }}
    >
      <span
        style={{
          width: dense ? 6 : 10,
          height: dense ? 6 : 10,
          borderRadius: 6,
          flexShrink: 0,
          background: color,
          boxShadow: state === "hit" ? `0 0 24px ${idxColors.good}` : undefined,
        }}
      />
      {dense ? (
        <>
          <span
            style={{
              width: 58,
              height: Math.max(4, height * 0.3),
              borderRadius: 3,
              flexShrink: 0,
              background: state === "checked" ? idxColors.danger : idxColors.barSoft,
            }}
          />
          <span
            style={{
              // Ragged widths so the field reads as data, not as a stripe pattern.
              width: `${44 + Math.round(rnd(index + 41.7) * 48)}%`,
              height: Math.max(4, height * 0.3),
              borderRadius: 3,
              background:
                state === "hit"
                  ? idxColors.good
                  : state === "checked"
                    ? idxColors.danger
                    : idxColors.bar,
              opacity: state === "checked" ? 0.75 : 1,
            }}
          />
        </>
      ) : (
        <>
          <span
            style={{
              fontFamily: theme.fonts.mono,
              fontSize: Math.min(26, height * 0.4),
              color: idxPalette.textDim,
              minWidth: 118,
            }}
          >
            {row.id}
          </span>
          <span
            style={{
              fontFamily: theme.fonts.mono,
              fontSize: Math.min(28, height * 0.44),
              fontWeight: state === "hit" ? 700 : 500,
              color: state === "hit" ? idxColors.good : idxPalette.text,
            }}
          >
            {label}
          </span>
        </>
      )}
    </div>
  );
};

/** Horizontal beam that sweeps down a row list while it is being scanned. */
export const ScanBeam: React.FC<{ y: number; color?: string }> = ({
  y,
  color = idxColors.danger,
}) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      right: 0,
      top: y,
      height: 4,
      background: color,
      boxShadow: `0 0 34px 6px ${color}`,
      opacity: 0.95,
    }}
  />
);

/**
 * A clipped viewport onto a table. `rowH` shrinks to imply density, `offset`
 * scrolls the content, `scanY` drops a beam that marks every row above it as
 * checked, and `hitIndex` lights the one row the query was looking for.
 */
export const RowField: React.FC<{
  count: number;
  rowH: number;
  height: number;
  offset?: number;
  scanY?: number;
  hitIndex?: number;
  hitEmail?: string;
  startIndex?: number;
  fade?: (i: number) => number;
}> = ({
  count,
  rowH,
  height,
  offset = 0,
  scanY = -1,
  hitIndex = -1,
  hitEmail,
  startIndex = 0,
  fade,
}) => (
  <div style={{ position: "relative", height, overflow: "hidden" }}>
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        transform: `translateY(${offset}px)`,
      }}
    >
      {Array.from({ length: count }).map((_, i) => {
        const y = i * rowH + offset;
        const state: RowState =
          i === hitIndex ? "hit" : scanY >= 0 && y < scanY ? "checked" : "idle";
        return (
          <TableRow
            key={i}
            index={startIndex + i}
            height={rowH}
            state={state}
            email={i === hitIndex ? hitEmail : undefined}
            opacity={fade ? fade(i) : 1}
          />
        );
      })}
    </div>
    {scanY >= 0 ? <ScanBeam y={scanY} /> : null}
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: 90,
        background: `linear-gradient(180deg, transparent, ${idxPalette.bg})`,
        pointerEvents: "none",
      }}
    />
  </div>
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
        background: idxPalette.text,
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
        color: idxPalette.textDim,
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
            color: idxPalette.text,
          }}
        >
          {brandName}
        </span>
      </span>
      <span>{chapter}</span>
    </div>
  );
};
