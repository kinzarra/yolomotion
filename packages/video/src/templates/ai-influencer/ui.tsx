// AI-influencer motion kit. Every entrance moves 2–3 properties on a spring,
// every interpolate is eased + clamped, colors/easings come from theme +
// palette only. Glitch offsets use remotion's seeded random() — never
// Math.random() — so frames are deterministic across render threads.
import React from "react";
import {
  interpolate,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { theme } from "../../theme";
import { aiColors, aiPalette } from "./palette";

type SpringName = keyof typeof theme.spring;

export const useIn = (delay = 0, config: SpringName = "smooth") => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: theme.spring[config] });
};

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
          opacity: 0.2,
          backgroundImage: `linear-gradient(${aiColors.line} 1px, transparent 1px), linear-gradient(90deg, ${aiColors.line} 1px, transparent 1px)`,
          backgroundSize: "90px 90px",
          transform: `translate(${Math.sin(t * 0.8) * 8}px, ${Math.cos(t * 0.7) * 10}px)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 940,
          height: 940,
          borderRadius: "50%",
          left: -420,
          top: 100,
          background: `radial-gradient(circle, ${aiPalette.primary}26, transparent 66%)`,
          transform: `translateY(${Math.sin(t * 0.9) * 26}px)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 820,
          height: 820,
          borderRadius: "50%",
          right: -420,
          bottom: 40,
          background: `radial-gradient(circle, rgba(235,235,245,0.07), transparent 68%)`,
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
}> = ({ children, delay = 0, color = aiPalette.textDim }) => {
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
  // mask=false skips the per-word clipping box — required when the text
  // carries a glow, since textShadow gets clipped into a visible rectangle.
  mask?: boolean;
  style?: React.CSSProperties;
}> = ({
  text,
  delay = 0,
  per = 3,
  size = 116,
  color = aiPalette.text,
  weight = 700,
  align = "flex-start",
  mask = true,
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
        if (!mask) {
          return (
            <span
              key={`${word}-${i}`}
              style={{
                display: "inline-block",
                opacity: p,
                transform: `translateY(${interpolate(p, [0, 1], [size * 0.24, 0])}px) scale(${interpolate(p, [0, 1], [1.5, 1])})`,
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

// Bordered mono pill — the "24/7", "FULL CONTROL" style stamps.
export const Chip: React.FC<{
  children: React.ReactNode;
  delay?: number;
  red?: boolean;
  size?: number;
  style?: React.CSSProperties;
}> = ({ children, delay = 0, red = false, size = 34, style }) => {
  const p = useIn(delay, "bouncy");
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 16,
        padding: `${Math.round(size * 0.55)}px ${Math.round(size * 0.95)}px`,
        borderRadius: 999,
        border: `2px solid ${red ? aiPalette.primary : aiColors.lineStrong}`,
        background: red ? aiColors.redSoft : aiColors.surface,
        boxShadow: red ? `0 0 46px ${aiPalette.glow}` : aiColors.shadow,
        fontFamily: theme.fonts.mono,
        fontSize: size,
        fontWeight: 700,
        letterSpacing: "0.1em",
        color: red ? aiPalette.primary : aiPalette.text,
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [34, 0])}px) scale(${interpolate(p, [0, 1], [0.7, 1])}) rotate(${interpolate(p, [0, 1], [-4, 0])}deg)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/* ----------------------------------------------------------------- glitch */

// Full-frame slice glitch overlay. intensity 0..1; deterministic per frame.
export const FrameGlitch: React.FC<{ intensity: number; seed?: string }> = ({
  intensity,
  seed = "fg",
}) => {
  const frame = useCurrentFrame();
  if (intensity <= 0.004) return null;
  const tick = Math.floor(frame / 2); // re-roll offsets every 2 frames
  const bars = Array.from({ length: 7 }).map((_, i) => {
    const r = (k: string) => random(`${seed}-${i}-${tick}-${k}`);
    const red = i % 3 !== 1;
    return (
      <div
        key={i}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: `${r("t") * 100}%`,
          height: 3 + r("h") * 52 * intensity,
          transform: `translateX(${(r("x") - 0.5) * 150 * intensity}px)`,
          background: red
            ? `rgba(255, 46, 63, ${0.16 + 0.3 * intensity})`
            : `rgba(235, 235, 245, ${0.1 + 0.16 * intensity})`,
          mixBlendMode: "screen",
        }}
      />
    );
  });
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        transform: `translateX(${(random(`${seed}-j-${tick}`) - 0.5) * 12 * intensity}px)`,
      }}
    >
      {bars}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.5 * intensity,
          background:
            "repeating-linear-gradient(0deg, rgba(235,235,245,0.05) 0px, rgba(235,235,245,0.05) 2px, transparent 2px, transparent 6px)",
        }}
      />
    </div>
  );
};

// Horizontal-slice displacement applied to arbitrary children: the content is
// cloned into bands via clip-path, each band shifted sideways. Reads as a
// datamosh without needing per-pixel filters.
export const SliceGlitch: React.FC<{
  intensity: number;
  seed?: string;
  slices?: number;
  children: React.ReactNode;
}> = ({ intensity, seed = "sg", slices = 5, children }) => {
  const frame = useCurrentFrame();
  if (intensity <= 0.004) {
    return <div style={{ position: "relative" }}>{children}</div>;
  }
  const tick = Math.floor(frame / 2);
  const bands: React.ReactNode[] = [];
  let cursor = 0;
  for (let i = 0; i < slices; i++) {
    const r = (k: string) => random(`${seed}-${i}-${tick}-${k}`);
    const h = (1 / slices) * (0.55 + r("h") * 0.9);
    const top = Math.min(cursor, 1);
    const bottom = Math.min(cursor + h, 1);
    cursor = bottom;
    const dx = (r("x") - 0.5) * 90 * intensity;
    bands.push(
      <div
        key={i}
        style={{
          position: "absolute",
          inset: 0,
          clipPath: `inset(${(top * 100).toFixed(2)}% 0 ${(100 - bottom * 100).toFixed(2)}% 0)`,
          transform: `translateX(${dx}px)`,
        }}
      >
        {children}
      </div>,
    );
  }
  return (
    <div style={{ position: "relative" }}>
      <div style={{ opacity: 0.25 }}>{children}</div>
      {bands}
    </div>
  );
};

/* ----------------------------------------------------------------- brand */

const Y_PATH =
  "M14.8568 4H19L11.804 12.0229V17H8.19604V12.0229L1 4H5.30176L10.0793 9.64571L14.8568 4Z";

// Monochrome Yoloco tile — white tile, ink glyph — so the brand chip doesn't
// spend the video's only color on itself.
export const YolocoTile: React.FC<{ size?: number }> = ({ size = 30 }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.28,
      background: aiColors.white,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    }}
  >
    <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 20 20" fill="none">
      <path d={Y_PATH} fill={aiColors.ink} />
    </svg>
  </div>
);

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
        color: aiPalette.textDim,
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
            color: aiPalette.text,
          }}
        >
          Yoloco
        </span>
      </span>
      <span>{chapter}</span>
    </div>
  );
};
