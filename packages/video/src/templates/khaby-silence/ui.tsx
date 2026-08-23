// Editorial motion kit for the Khaby reel. Print grammar on a black page:
// oversized grotesk headlines, Unbounded numerals, a single serif-italic word,
// mono labels with hairline rules, greyscale subject mattes. Every entrance
// moves 2–3 properties on a spring, every interpolate is eased + clamped, and
// colors/easings come from theme + palette only.
import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { useIn, usePunch, useRamp } from "../../reel";
import { theme } from "../../theme";
import { ksColors, ksPalette } from "./palette";

export { useIn, usePunch, useRamp };

/* ---------------------------------------------------------------- shell */

// The page every beat sits on: near-black with a faint top light that
// breathes, and a fast lift-and-fade exit so cuts feel cut. `exit={false}`
// for beats that end on a hard cut or hand the frame over themselves.
export const SceneShell: React.FC<{
  children: React.ReactNode;
  exit?: boolean;
  light?: number; // top-light opacity multiplier; 0 for the black beats
}> = ({ children, exit = true, light = 1 }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = frame / fps;
  const out = exit
    ? interpolate(frame, [durationInFrames - 6, durationInFrames - 1], [0, 1], {
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
        background: ksPalette.bg,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: -200,
          right: -200,
          top: -700,
          height: 1400,
          borderRadius: "50%",
          opacity: (0.05 + Math.sin(t * 0.7) * 0.012) * light,
          background: `radial-gradient(ellipse at center, ${ksColors.bone}, transparent 62%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 1 - out * 0.85,
          transform: `translateY(${out * -24}px) scale(${1 + out * 0.015})`,
        }}
      >
        {children}
      </div>
    </div>
  );
};

/* ----------------------------------------------------------------- type */

export const Rise: React.FC<{
  delay?: number;
  distance?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ delay = 0, distance = 40, style, children }) => {
  const p = useIn(delay, "smooth");
  return (
    <div
      style={{
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [distance, 0])}px) scale(${interpolate(p, [0, 1], [0.96, 1])})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// Mono small-caps label with a short rule — the magazine "department" line.
export const Eyebrow: React.FC<{
  children: React.ReactNode;
  delay?: number;
  color?: string;
  size?: number;
  rule?: boolean;
  align?: "left" | "right";
}> = ({ children, delay = 0, color = ksPalette.textDim, size = 23, rule = true, align = "left" }) => {
  const p = useIn(delay, "snappy");
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        flexDirection: align === "right" ? "row-reverse" : "row",
        gap: 16,
        opacity: p,
        transform: `translateX(${interpolate(p, [0, 1], [align === "right" ? 22 : -22, 0])}px)`,
        fontFamily: theme.fonts.mono,
        color,
        fontSize: size,
        fontWeight: 500,
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
      }}
    >
      {rule && (
        <span
          style={{
            width: 30,
            height: 2,
            background: color,
            transform: `scaleX(${p})`,
            transformOrigin: align === "right" ? "right" : "left",
          }}
        />
      )}
      {children}
    </div>
  );
};

export const Mono: React.FC<{
  children: React.ReactNode;
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}> = ({ children, size = 22, color = ksPalette.textDim, style }) => (
  <div
    style={{
      fontFamily: theme.fonts.mono,
      fontSize: size,
      fontWeight: 500,
      letterSpacing: "0.16em",
      textTransform: "uppercase",
      color,
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {children}
  </div>
);

// Large kinetic type: each word rises out of its own clipping mask. Words
// listed in `italic` (by index) are set in the serif italic — the one
// contrasting word a fashion headline allows.
export const Kinetic: React.FC<{
  text: string;
  delay?: number;
  per?: number;
  size?: number;
  color?: string;
  weight?: number;
  align?: "flex-start" | "center" | "flex-end";
  italic?: number[];
  italicColor?: string;
  mask?: boolean;
  lineHeight?: number;
  style?: React.CSSProperties;
}> = ({
  text,
  delay = 0,
  per = 3,
  size = 120,
  color = ksColors.bone,
  weight = 700,
  align = "center",
  italic = [],
  italicColor,
  mask = true,
  lineHeight = 0.98,
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
        alignItems: "baseline",
        columnGap: Math.round(size * 0.22),
        rowGap: Math.round(size * 0.04),
        fontFamily: theme.fonts.display,
        fontSize: size,
        fontWeight: weight,
        lineHeight,
        letterSpacing: "-0.05em",
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
        const isItalic = italic.includes(i);
        const inner: React.CSSProperties = isItalic
          ? {
              fontFamily: theme.fonts.serif,
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: size * 1.12,
              letterSpacing: "-0.015em",
              color: italicColor ?? color,
            }
          : {};
        if (!mask) {
          return (
            <span
              key={`${word}-${i}`}
              style={{
                display: "inline-block",
                opacity: p,
                transform: `translateY(${interpolate(p, [0, 1], [size * 0.2, 0])}px) scale(${interpolate(p, [0, 1], [1.3, 1])})`,
                ...inner,
              }}
            >
              {word}
            </span>
          );
        }
        return (
          <span
            key={`${word}-${i}`}
            style={{
              display: "inline-block",
              overflow: "hidden",
              paddingBottom: Math.round(size * 0.14),
              marginBottom: Math.round(size * -0.14),
              paddingRight: isItalic ? Math.round(size * 0.08) : 0,
            }}
          >
            <span
              style={{
                display: "inline-block",
                opacity: p,
                transform: `translateY(${interpolate(p, [0, 1], [size * 1.1, 0])}px) skewY(${interpolate(p, [0, 1], [4, 0])}deg)`,
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

// A headline that SLAMS: it arrives oversized and compresses onto the page,
// so the cut reads as an impact. `until` hard-cuts it off — no fade.
export const Slam: React.FC<{
  text: string;
  at: number;
  until?: number;
  size?: number;
  color?: string;
  font?: string;
  weight?: number;
  tracking?: string;
  align?: "left" | "center" | "right";
  style?: React.CSSProperties;
}> = ({
  text,
  at,
  until,
  size = 190,
  color = ksColors.bone,
  font = theme.fonts.display,
  weight = 700,
  tracking = "-0.055em",
  align = "center",
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < at || (until !== undefined && frame >= until)) return null;
  const p = spring({
    frame: frame - at,
    fps,
    config: { damping: 16, stiffness: 230, mass: 0.55 },
  });
  const settle = Math.sin((frame - at) / 28) * 1.2;
  return (
    <div
      style={{
        fontFamily: font,
        fontSize: size,
        fontWeight: weight,
        letterSpacing: tracking,
        lineHeight: 0.92,
        textAlign: align,
        color,
        whiteSpace: "nowrap",
        opacity: interpolate(p, [0, 0.2], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
        transform: `scale(${interpolate(p, [0, 1], [1.22, 1])}) translateY(${interpolate(p, [0, 1], [-18, settle])}px)`,
        ...style,
      }}
    >
      {text}
    </div>
  );
};

// Numerals: the wide display face, tabular so a changing count never jitters.
export const Num: React.FC<{
  children: React.ReactNode;
  size?: number;
  color?: string;
  weight?: number;
  style?: React.CSSProperties;
}> = ({ children, size = 160, color = ksColors.bone, weight = 900, style }) => (
  <div
    style={{
      fontFamily: theme.fonts.wide,
      fontSize: size,
      fontWeight: weight,
      letterSpacing: "-0.04em",
      lineHeight: 0.9,
      fontVariantNumeric: "tabular-nums",
      color,
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {children}
  </div>
);

/* ------------------------------------------------------------- hairlines */

export const Rule: React.FC<{
  width: number | string;
  delay?: number;
  color?: string;
  thickness?: number;
  from?: "left" | "right" | "center";
  style?: React.CSSProperties;
}> = ({ width, delay = 0, color = ksColors.lineStrong, thickness = 2, from = "left", style }) => {
  const p = useRamp(delay, delay + 16, theme.ease.out);
  return (
    <div
      style={{
        width,
        height: thickness,
        background: color,
        transform: `scaleX(${p})`,
        transformOrigin: from,
        ...style,
      }}
    />
  );
};

// A rule drawn through whatever it is laid over. Absolutely positioned, so the
// parent must be `position: relative`.
export const Strike: React.FC<{
  progress: number;
  color?: string;
  thickness?: number;
  tilt?: number;
}> = ({ progress, color = ksPalette.primary, thickness = 8, tilt = -2 }) => (
  <div
    style={{
      position: "absolute",
      left: "-3%",
      right: "-3%",
      top: "50%",
      height: thickness,
      marginTop: -thickness / 2,
      background: color,
      transform: `rotate(${tilt}deg) scaleX(${progress})`,
      transformOrigin: "left center",
      pointerEvents: "none",
    }}
  />
);

// Bordered mono tag with square-ish corners — a print label, not a web pill.
export const Tag: React.FC<{
  children: React.ReactNode;
  delay?: number;
  accent?: boolean;
  size?: number;
  style?: React.CSSProperties;
}> = ({ children, delay = 0, accent = false, size = 22, style }) => {
  const p = useIn(delay, "snappy");
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: `${Math.round(size * 0.5)}px ${Math.round(size * 0.8)}px`,
        borderRadius: 4,
        border: `1.5px solid ${accent ? ksPalette.primary : ksColors.lineStrong}`,
        background: accent ? ksPalette.primary : "transparent",
        fontFamily: theme.fonts.mono,
        fontSize: size,
        fontWeight: 600,
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
        color: accent ? ksColors.bone : ksColors.bone,
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [18, 0])}px) scale(${interpolate(p, [0, 1], [0.9, 1])})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/* ----------------------------------------------------------------- photo */

// A subject matte from public/images/, graded to greyscale (the colour budget:
// one accent per frame, and it is never the photograph), with a slow Ken
// Burns and an optional bottom fade so a crop edge never shows.
export const Photo: React.FC<{
  src: string;
  width: number;
  delay?: number;
  rise?: number; // px the figure rises on entrance
  kb?: number; // Ken Burns end scale
  fade?: number; // px of bottom fade to transparent
  dim?: number; // brightness multiplier
  style?: React.CSSProperties;
}> = ({ src, width, delay = 0, rise = 140, kb = 1.05, fade = 0, dim = 1, style }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = useIn(delay, "smooth");
  const scale = interpolate(frame, [0, durationInFrames], [1, kb], {
    easing: theme.ease.inOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const mask = fade > 0
    ? `linear-gradient(180deg, #000 0%, #000 calc(100% - ${fade}px), transparent 100%)`
    : undefined;
  return (
    <div
      style={{
        width,
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [rise, 0])}px) scale(${interpolate(p, [0, 1], [0.98, scale])})`,
        transformOrigin: "50% 30%",
        WebkitMaskImage: mask,
        maskImage: mask,
        ...style,
      }}
    >
      <Img
        src={staticFile(`images/${src}`)}
        style={{
          display: "block",
          width: "100%",
          height: "auto",
          filter: `${ksColors.photo} brightness(${dim})`,
        }}
      />
    </div>
  );
};

/* ---------------------------------------------------------------- light */

// Camera flash: one frame of white that decays. `energy` from usePunch.
export const Flash: React.FC<{ energy: number; strength?: number }> = ({
  energy,
  strength = 0.5,
}) => (
  <AbsoluteFill
    style={{
      background: ksColors.white,
      opacity: energy * strength,
      pointerEvents: "none",
    }}
  />
);

/* ----------------------------------------------------------------- brand */

const Y_PATH =
  "M14.8568 4H19L11.804 12.0229V17H8.19604V12.0229L1 4H5.30176L10.0793 9.64571L14.8568 4Z";

// Monochrome Yoloco tile — bone tile, ink glyph — so the brand never spends
// the frame's accent on itself.
export const YolocoMark: React.FC<{ size?: number; delay?: number }> = ({
  size = 96,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tile = useIn(delay, "smooth");
  const glyph = useIn(delay + 5, "snappy");
  const breathe = 1 + Math.sin((frame / fps) * 2) * 0.012;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.26,
        background: ksColors.bone,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: tile,
        transform: `scale(${interpolate(tile, [0, 1], [0.7, breathe])}) rotate(${interpolate(tile, [0, 1], [-10, 0])}deg)`,
        boxShadow: ksColors.shadow,
      }}
    >
      <svg
        width={size * 0.6}
        height={size * 0.6}
        viewBox="0 0 20 20"
        fill="none"
        style={{
          opacity: glyph,
          clipPath: `inset(0 0 ${(1 - glyph) * 100}% 0)`,
          transform: `translateY(${interpolate(glyph, [0, 1], [size * 0.06, 0])}px)`,
        }}
      >
        <path d={Y_PATH} fill={ksColors.ink} />
      </svg>
    </div>
  );
};

export const YolocoWordmark: React.FC<{ delay?: number; size?: number }> = ({
  delay = 0,
  size = 84,
}) => {
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
        color: ksColors.bone,
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
            key={`${ch}-${i}`}
            style={{
              display: "inline-block",
              opacity: p,
              transform: `translateY(${interpolate(p, [0, 1], [size * 0.28, 0])}px)`,
            }}
          >
            {ch}
          </span>
        );
      })}
    </div>
  );
};
