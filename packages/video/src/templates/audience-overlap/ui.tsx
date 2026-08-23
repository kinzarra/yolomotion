// Audience-overlap motion kit. Every entrance moves 2–3 properties on a
// spring, every interpolate is eased + clamped, colors/easings come from
// theme + palette only. Glitch offsets use remotion's seeded random() —
// never Math.random() — so frames are deterministic across render threads.
import React from "react";
import {
  interpolate,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { theme } from "../../theme";
import { ovColors, ovPalette } from "./palette";

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

/* ------------------------------------------------------------------ data */

// The five hired creators. Follower counts sum to 4,377,000; the payments
// sum to $12,000 — the numbers every scene reuses.
export type Influencer = {
  handle: string;
  followers: string;
  count: number;
  amount: string;
};

export const INFLUENCERS: Influencer[] = [
  { handle: "@lily.fit", followers: "812K", count: 812_000, amount: "$2,400" },
  { handle: "@max.travels", followers: "1.2M", count: 1_205_000, amount: "$1,800" },
  { handle: "@nova.beauty", followers: "645K", count: 645_000, amount: "$3,200" },
  { handle: "@tech.tom", followers: "990K", count: 990_000, amount: "$2,100" },
  { handle: "@chef.mila", followers: "730K", count: 725_000, amount: "$2,500" },
];

export const TOTAL_FOLLOWERS = 4_377_000;
export const UNIQUE_REACH = 1_580_000;
export const FIXED_REACH = 3_940_000;
export const TOTAL_SPENT = 12_000;

// Hook-scene card centers — the finale's loop-out flies circles to these
// exact points so the cut back to frame 0 reads as a seam, not a jump.
export const CARD_POS = [
  { x: 295, y: 505, rot: -3.5 },
  { x: 785, y: 585, rot: 2.5 },
  { x: 540, y: 830, rot: -1.5 },
  { x: 300, y: 1105, rot: 2 },
  { x: 775, y: 1075, rot: -3 },
] as const;

/* ----------------------------------------------------------------- shell */

export const SceneShell: React.FC<{
  children: React.ReactNode;
  exit?: boolean;
  flat?: boolean; // finale: bare black, no grid/mesh
}> = ({ children, exit = true, flat = false }) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
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
      {!flat && (
        <>
          <div
            style={{
              position: "absolute",
              inset: -80,
              opacity: 0.2,
              backgroundImage: `linear-gradient(${ovColors.line} 1px, transparent 1px), linear-gradient(90deg, ${ovColors.line} 1px, transparent 1px)`,
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
              left: -430,
              top: 90,
              background: `radial-gradient(circle, ${ovPalette.primary}1E, transparent 66%)`,
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
              background: "radial-gradient(circle, rgba(228,244,234,0.06), transparent 68%)",
              transform: `translateY(${Math.cos(t * 0.75) * 24}px)`,
            }}
          />
        </>
      )}
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
  color = ovPalette.text,
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

// Bordered mono pill. tone picks which of the two signal colors it may use.
export const Chip: React.FC<{
  children: React.ReactNode;
  delay?: number;
  tone?: "neutral" | "bad" | "hero";
  size?: number;
  style?: React.CSSProperties;
}> = ({ children, delay = 0, tone = "neutral", size = 34, style }) => {
  const p = useIn(delay, "bouncy");
  const border =
    tone === "bad" ? ovColors.badLine : tone === "hero" ? ovColors.greenLine : ovColors.lineStrong;
  const bg = tone === "bad" ? ovColors.badSoft : tone === "hero" ? ovColors.greenSoft : ovColors.surface;
  const color = tone === "bad" ? ovColors.bad : tone === "hero" ? ovPalette.primary : ovPalette.text;
  const shadow =
    tone === "bad"
      ? `0 0 46px ${ovColors.badGlow}`
      : tone === "hero"
        ? `0 0 46px ${ovPalette.glow}`
        : ovColors.shadow;
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 16,
        padding: `${Math.round(size * 0.55)}px ${Math.round(size * 0.95)}px`,
        borderRadius: 999,
        border: `2px solid ${border}`,
        background: bg,
        boxShadow: shadow,
        fontFamily: theme.fonts.mono,
        fontSize: size,
        fontWeight: 700,
        letterSpacing: "0.1em",
        color,
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [34, 0])}px) scale(${interpolate(p, [0, 1], [0.7, 1])}) rotate(${interpolate(p, [0, 1], [-4, 0])}deg)`,
        ...style,
      }}
    >
      {children}
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

// Animated red strike — swipes across whatever it is laid over.
export const Strike: React.FC<{
  delay?: number;
  color?: string;
  width?: number;
  rot?: number;
}> = ({ delay = 0, color = ovColors.bad, width = 12, rot = -5 }) => {
  const p = useRamp(delay, delay + 7, theme.ease.out);
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: "-5%",
          top: "48%",
          width: `${110 * p}%`,
          height: width,
          borderRadius: width,
          background: color,
          boxShadow: `0 0 30px ${color}77`,
          transform: `rotate(${rot}deg)`,
          transformOrigin: "left center",
        }}
      />
    </div>
  );
};

/* ---------------------------------------------------------------- glitch */

// Full-frame slice glitch overlay. intensity 0..1; deterministic per frame.
// tone: "bad" for the problem act, "hero" for the brand/loop seams.
export const FrameGlitch: React.FC<{
  intensity: number;
  seed?: string;
  tone?: "bad" | "hero";
}> = ({ intensity, seed = "fg", tone = "bad" }) => {
  const frame = useCurrentFrame();
  if (intensity <= 0.004) return null;
  const tint = tone === "bad" ? "255, 59, 77" : "0, 255, 133";
  const tick = Math.floor(frame / 2); // re-roll offsets every 2 frames
  const bars = Array.from({ length: 7 }).map((_, i) => {
    const r = (k: string) => random(`${seed}-${i}-${tick}-${k}`);
    const colored = i % 3 !== 1;
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
          background: colored
            ? `rgba(${tint}, ${0.16 + 0.3 * intensity})`
            : `rgba(228, 244, 234, ${0.1 + 0.16 * intensity})`,
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
            "repeating-linear-gradient(0deg, rgba(228,244,234,0.05) 0px, rgba(228,244,234,0.05) 2px, transparent 2px, transparent 6px)",
        }}
      />
    </div>
  );
};

/* --------------------------------------------------------------- avatars */

// Procedural creator portraits — five distinct silhouettes (bun, long hair,
// crop, cap, beard) in porcelain neutrals so no face competes with the two
// signal colors. No stock imagery, no emoji.
export const Avatar: React.FC<{ variant: number; size?: number; dim?: boolean }> = ({
  variant,
  size = 108,
  dim = false,
}) => {
  const v = ((variant % 5) + 5) % 5;
  const skin = v % 2 === 0 ? ovColors.skin : ovColors.skinShade;
  const hair = v % 2 === 0 ? ovColors.hairA : ovColors.hairB;
  const u = (n: number) => size * n; // proportional unit
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        overflow: "hidden",
        position: "relative",
        flexShrink: 0,
        background: `linear-gradient(150deg, ${ovColors.surfaceLift}, ${ovColors.surfaceStrong})`,
        border: `2px solid ${ovColors.lineStrong}`,
        filter: dim ? "saturate(0.4) brightness(0.7)" : "none",
      }}
    >
      {/* shoulders */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: u(0.62),
          width: u(0.66),
          height: u(0.5),
          marginLeft: u(-0.33),
          borderRadius: `${u(0.33)}px ${u(0.33)}px 0 0`,
          background: skin,
        }}
      />
      {/* head */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: u(0.18),
          width: u(0.38),
          height: u(0.4),
          marginLeft: u(-0.19),
          borderRadius: "46%",
          background: skin,
        }}
      />
      {/* hairstyle per variant */}
      {v === 0 && (
        <>
          <div style={{ position: "absolute", left: "50%", top: u(0.05), width: u(0.2), height: u(0.2), marginLeft: u(-0.1), borderRadius: "50%", background: hair }} />
          <div style={{ position: "absolute", left: "50%", top: u(0.16), width: u(0.42), height: u(0.18), marginLeft: u(-0.21), borderRadius: `${u(0.21)}px ${u(0.21)}px 0 0`, background: hair }} />
        </>
      )}
      {v === 1 && (
        <>
          <div style={{ position: "absolute", left: "50%", top: u(0.14), width: u(0.5), height: u(0.2), marginLeft: u(-0.25), borderRadius: `${u(0.25)}px ${u(0.25)}px 0 0`, background: hair }} />
          <div style={{ position: "absolute", left: "50%", top: u(0.2), width: u(0.56), height: u(0.42), marginLeft: u(-0.28), borderRadius: `0 0 ${u(0.1)}px ${u(0.1)}px`, background: hair, clipPath: "polygon(0 0, 18% 0, 18% 100%, 0 100%, 0 0, 100% 0, 100% 100%, 82% 100%, 82% 0)" }} />
        </>
      )}
      {v === 2 && (
        <div style={{ position: "absolute", left: "50%", top: u(0.13), width: u(0.4), height: u(0.16), marginLeft: u(-0.2), borderRadius: `${u(0.2)}px ${u(0.2)}px 0 0`, background: hair }} />
      )}
      {v === 3 && (
        <>
          <div style={{ position: "absolute", left: "50%", top: u(0.1), width: u(0.42), height: u(0.16), marginLeft: u(-0.21), borderRadius: `${u(0.21)}px ${u(0.21)}px 0 0`, background: hair }} />
          <div style={{ position: "absolute", left: "50%", top: u(0.235), width: u(0.52), height: u(0.05), marginLeft: u(-0.31), borderRadius: u(0.03), background: hair }} />
        </>
      )}
      {v === 4 && (
        <>
          <div style={{ position: "absolute", left: "50%", top: u(0.15), width: u(0.4), height: u(0.13), marginLeft: u(-0.2), borderRadius: `${u(0.2)}px ${u(0.2)}px 0 0`, background: hair }} />
          <div style={{ position: "absolute", left: "50%", top: u(0.44), width: u(0.3), height: u(0.14), marginLeft: u(-0.15), borderRadius: `0 0 ${u(0.15)}px ${u(0.15)}px`, background: hair }} />
        </>
      )}
    </div>
  );
};

// Influencer profile card — the hook's core element and the loop target.
export const ProfileCard: React.FC<{
  influencer: Influencer;
  variant: number;
  delay?: number;
  toastDelay?: number;
}> = ({ influencer, variant, delay = 0, toastDelay }) => {
  const p = useIn(delay, "bouncy");
  const toast = useIn(toastDelay ?? delay + 8, "bouncy");
  return (
    <div
      style={{
        position: "relative",
        width: 460,
        borderRadius: 30,
        border: `1px solid ${ovColors.lineStrong}`,
        background: ovColors.surface,
        boxShadow: ovColors.shadow,
        padding: "26px 30px",
        display: "flex",
        alignItems: "center",
        gap: 24,
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [70, 0])}px) scale(${interpolate(p, [0, 1], [0.62, 1])})`,
      }}
    >
      <Avatar variant={variant} size={108} />
      <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 0 }}>
        <span
          style={{
            fontFamily: theme.fonts.display,
            fontSize: 40,
            fontWeight: 700,
            letterSpacing: "-0.03em",
            color: ovPalette.text,
            whiteSpace: "nowrap",
          }}
        >
          {influencer.handle}
        </span>
        <span
          style={{
            fontFamily: theme.fonts.mono,
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: "0.08em",
            color: ovPalette.textDim,
          }}
        >
          {influencer.followers} FOLLOWERS
        </span>
      </div>
      {/* payment notification toast */}
      <div
        style={{
          position: "absolute",
          right: -26,
          top: -30,
          padding: "12px 22px",
          borderRadius: 16,
          border: `1px solid ${ovColors.lineStrong}`,
          background: ovColors.surfaceLift,
          boxShadow: ovColors.shadow,
          fontFamily: theme.fonts.mono,
          fontSize: 27,
          fontWeight: 700,
          letterSpacing: "0.05em",
          color: ovColors.white,
          whiteSpace: "nowrap",
          opacity: toast,
          transform: `translateY(${interpolate(toast, [0, 1], [26, 0])}px) scale(${interpolate(toast, [0, 1], [0.55, 1])}) rotate(${interpolate(toast, [0, 1], [6, 0])}deg)`,
        }}
      >
        PAID −{influencer.amount}
      </div>
    </div>
  );
};

/* ----------------------------------------------------------------- brand */

const Y_PATH =
  "M14.8568 4H19L11.804 12.0229V17H8.19604V12.0229L1 4H5.30176L10.0793 9.64571L14.8568 4Z";

// Yoloco tile in the video's electric green, ink glyph.
export const YolocoTile: React.FC<{ size?: number }> = ({ size = 30 }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.28,
      background: ovPalette.primary,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    }}
  >
    <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 20 20" fill="none">
      <path d={Y_PATH} fill={ovColors.ink} />
    </svg>
  </div>
);

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
        borderRadius: size * 0.28,
        background: ovPalette.primary,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: tile,
        transform: `scale(${interpolate(tile, [0, 1], [0.62, breathe])}) rotate(${interpolate(tile, [0, 1], [-14, 0])}deg)`,
        boxShadow: `0 ${size * 0.16}px ${size * 0.42}px -${size * 0.12}px ${ovPalette.glow}`,
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
        <path d={Y_PATH} fill={ovColors.ink} />
      </svg>
    </div>
  );
};

export const YolocoWordmark: React.FC<{ delay?: number; size?: number }> = ({
  delay = 0,
  size = 96,
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
        color: ovPalette.text,
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
        color: ovPalette.textDim,
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
            color: ovPalette.text,
          }}
        >
          Yoloco
        </span>
      </span>
      <span>{chapter}</span>
    </div>
  );
};
