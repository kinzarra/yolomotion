// Motion kit for the frontend-secrets Short. Every entrance moves 2–3
// properties on a spring, every interpolate is eased and clamped, and all
// colors/easings come from theme + palette. Nothing here is inlined per-scene.
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
import { secColors, secPalette, syntax, SyntaxKind } from "./palette";

type SpringName = keyof typeof theme.spring;

/* ------------------------------------------------------------- timing */

export const useIn = (delay = 0, config: SpringName = "smooth") => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: theme.spring[config] });
};

/** Eased 0→1 ramp for non-spring moves (sweeps, typing, progress, dots). */
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
  /** Dims the grid + orbs for the near-black closing frame. */
  quiet?: boolean;
}> = ({ children, exit = true, quiet = false }) => {
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
          opacity: quiet ? 0.1 : 0.26,
          backgroundImage: `linear-gradient(${secColors.line} 1px, transparent 1px), linear-gradient(90deg, ${secColors.line} 1px, transparent 1px)`,
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
          opacity: quiet ? 0.3 : 1,
          background: `radial-gradient(circle, ${secColors.blue}3D, transparent 66%)`,
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
          opacity: quiet ? 0.22 : 1,
          background: `radial-gradient(circle, ${secPalette.primary}26, transparent 68%)`,
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
}> = ({ children, delay = 0, color = secPalette.accent }) => {
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
  color = secPalette.text,
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
        // drop-shadow on the container, NOT textShadow: per-word overflow
        // masks clip a text shadow into visible rectangles.
        filter: glow ? `drop-shadow(0 0 ${size * 0.3}px ${color}66)` : undefined,
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

/** Giant impact line: slams from oversized scale, for the warning beats. */
export const Slam: React.FC<{
  text: string;
  at: number;
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}> = ({ text, at, size = 140, color = secPalette.text, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - at, fps, config: theme.spring.snappy });
  if (frame < at) return null;
  return (
    <div
      style={{
        fontFamily: theme.fonts.display,
        fontSize: size,
        fontWeight: 800,
        lineHeight: 0.98,
        letterSpacing: "-0.045em",
        color,
        textShadow: `0 0 ${size * 0.5}px ${color}44`,
        opacity: p,
        transform: `scale(${interpolate(p, [0, 1], [1.7, 1])})`,
        ...style,
      }}
    >
      {text}
    </div>
  );
};

/* ------------------------------------------------------------ surfaces */

export type Tone = "neutral" | "hero" | "blue" | "good" | "danger";

const toneBorder: Record<Tone, string> = {
  neutral: secColors.line,
  hero: secPalette.primary,
  blue: secPalette.accent,
  good: secColors.good,
  danger: secColors.danger,
};

const toneFill: Record<Tone, string> = {
  neutral: secColors.surface,
  hero: secColors.tint,
  blue: secColors.blueSoft,
  good: secColors.goodSoft,
  danger: secColors.dangerSoft,
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
            ? `0 30px 90px -42px ${secPalette.glow}`
            : secColors.shadow,
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
  const color = tone === "neutral" ? secPalette.textDim : toneBorder[tone];
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 14,
        padding: `${Math.round(size * 0.45)}px ${Math.round(size * 0.8)}px`,
        borderRadius: 999,
        border: `1px solid ${tone === "neutral" ? secColors.line : color}`,
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
  "const", "new", "await", "return", "import", "from", "export", "function",
  "async", "let", "if", "fetch",
]);

export type Token = { text: string; kind: SyntaxKind };

export const tokenize = (src: string): Token[] =>
  (src.match(/"[^"]*"|'[^']*'|\/\/.*|[A-Za-z_$][A-Za-z0-9_$]*|\d+|\s+|./g) ?? []).map(
    (text) => ({
      text,
      kind:
        text.startsWith('"') || text.startsWith("'")
          ? "str"
          : text.startsWith("//")
            ? "comment"
            : KEYWORDS.has(text)
              ? "kw"
              : /^\d/.test(text)
                ? "num"
                : /^[A-Za-z_$]/.test(text)
                  ? "id"
                  : /^\s+$/.test(text)
                    ? "plain"
                    : "punct",
    }),
  );

/** One syntax-colored code line. `boost` recolors the whole line (leak beats). */
export const CodeLine: React.FC<{
  code: string;
  size?: number;
  boost?: string;
  style?: React.CSSProperties;
}> = ({ code, size = 30, boost, style }) => (
  <div
    style={{
      fontFamily: theme.fonts.mono,
      fontSize: size,
      lineHeight: 1.5,
      letterSpacing: "-0.01em",
      whiteSpace: "pre",
      ...style,
    }}
  >
    {tokenize(code).map((tok, i) => (
      <span
        key={i}
        style={{
          color: boost ?? syntax[tok.kind],
          fontWeight: tok.kind === "kw" ? 700 : 500,
        }}
      >
        {tok.text}
      </span>
    ))}
  </div>
);

/** Code typed in character by character, with a blinking block cursor. */
export const TypedCode: React.FC<{
  lines: string[];
  delay?: number;
  duration?: number;
  size?: number;
  cursor?: boolean;
  /** 0-based line indexes rendered in the hero color once fully typed. */
  heroLines?: number[];
}> = ({ lines, delay = 0, duration = 34, size = 30, cursor = true, heroLines = [] }) => {
  const frame = useCurrentFrame();
  const code = lines.join("\n");
  const typed = useRamp(delay, delay + duration, theme.ease.inOut);
  const visible = Math.round(code.length * typed);
  let seen = 0;
  return (
    <div
      style={{
        fontFamily: theme.fonts.mono,
        fontSize: size,
        lineHeight: 1.5,
        letterSpacing: "-0.01em",
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
      }}
    >
      {lines.map((line, li) => {
        const lineStart = seen;
        const lineDone = visible >= lineStart + line.length;
        const isHero = heroLines.includes(li) && lineDone;
        const rendered = tokenize(line).map((tok, i) => {
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
                color: isHero ? secPalette.primary : syntax[tok.kind],
                fontWeight: tok.kind === "kw" || isHero ? 700 : 500,
                textShadow: isHero ? `0 0 26px ${secPalette.glow}` : undefined,
              }}
            >
              {slice}
            </span>
          );
        });
        seen += 1; // the \n between lines
        return <div key={li}>{rendered}</div>;
      })}
      {cursor ? (
        <span
          style={{
            display: "inline-block",
            width: size * 0.55,
            height: size * 1.05,
            marginLeft: 4,
            verticalAlign: "text-bottom",
            background: secPalette.primary,
            opacity: Math.floor(frame / 8) % 2 === 0 ? 1 : 0.16,
            boxShadow: `0 0 22px ${secPalette.glow}`,
          }}
        />
      ) : null}
    </div>
  );
};

/* --------------------------------------------------------------- chrome */

/** Editor / terminal / browser window shell with traffic lights. */
export const WindowCard: React.FC<{
  title: React.ReactNode;
  delay?: number;
  tone?: Tone;
  children: React.ReactNode;
  style?: React.CSSProperties;
  pad?: string;
}> = ({ title, delay = 0, tone = "neutral", children, style, pad = "26px 28px" }) => (
  <Panel delay={delay} tone={tone} style={{ overflow: "hidden", ...style }}>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "18px 26px",
        borderBottom: `1px solid ${secColors.line}`,
        background: secColors.surfaceStrong,
        fontFamily: theme.fonts.mono,
        fontSize: 22,
        letterSpacing: "0.08em",
        color: secPalette.textDim,
      }}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: 13,
            height: 13,
            borderRadius: 7,
            background: secColors.lineStrong,
            opacity: 0.8 - i * 0.18,
          }}
        />
      ))}
      <span style={{ marginLeft: 12, display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }}>
        {title}
      </span>
    </div>
    <div style={{ padding: pad }}>{children}</div>
  </Panel>
);

/** Pill URL field for the browser variant of WindowCard. */
export const UrlPill: React.FC<{ domain: string }> = ({ domain }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
      padding: "7px 20px",
      borderRadius: 999,
      background: secColors.surfaceLift,
      border: `1px solid ${secColors.line}`,
      fontFamily: theme.fonts.mono,
      fontSize: 21,
      letterSpacing: "0.02em",
      color: secPalette.textDim,
      whiteSpace: "nowrap",
    }}
  >
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <rect x="4" y="10" width="16" height="11" rx="2.6" stroke={secColors.good} strokeWidth="2.4" />
      <path d="M8 10V7.5a4 4 0 0 1 8 0V10" stroke={secColors.good} strokeWidth="2.4" />
    </svg>
    {domain}
  </span>
);

/* --------------------------------------------------------------- glyphs */

/** Key glyph drawn in CSS-free SVG so it can travel along the arch rails. */
export const KeyGlyph: React.FC<{ size?: number; color?: string; glow?: boolean }> = ({
  size = 34,
  color = secPalette.primary,
  glow = true,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    style={{ filter: glow ? `drop-shadow(0 0 ${size * 0.4}px ${color})` : undefined }}
  >
    <circle cx="8" cy="12" r="4.4" stroke={color} strokeWidth="2.6" />
    <path d="M12.4 12h9M18 12v3.6M21.4 12v2.6" stroke={color} strokeWidth="2.6" strokeLinecap="round" />
  </svg>
);

export const LockGlyph: React.FC<{ size?: number; color?: string }> = ({
  size = 34,
  color = secColors.good,
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="4.5" y="10" width="15" height="10.5" rx="2.6" stroke={color} strokeWidth="2.4" />
    <path d="M8 10V7.5a4 4 0 0 1 8 0V10" stroke={color} strokeWidth="2.4" />
    <circle cx="12" cy="15.2" r="1.7" fill={color} />
  </svg>
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
        background: secPalette.text,
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
        color: secPalette.textDim,
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
            color: secPalette.text,
          }}
        >
          {brandName}
        </span>
      </span>
      <span>{chapter}</span>
    </div>
  );
};
