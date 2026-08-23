// Scene primitives for the MrBeast reel. Documentary + data-viz language:
// tape-grey archival cards, tabular-mono counters, rubber stamps, huge kinetic
// type. Every entrance moves 2–3 properties on a spring, every interpolate is
// eased and clamped, and colors/easings come from theme + palette only.
import React from "react";
import {
  Img,
  interpolate,
  random,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { theme } from "../../theme";
import { mbColors, mbPalette } from "./palette";

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

/** A hard cut: 0 before `at`, 1 from `at` on. No tween — the point is the jolt. */
export const useCut = (at: number) => (useCurrentFrame() >= at ? 1 : 0);

/* ---------------------------------------------------------------- shell */

// Backdrop every scene sits on: near-black, a faint measurement grid that
// drifts, one dim red bloom, and a fast scale-and-lift exit so cuts feel cut
// rather than dissolved.
export const SceneShell: React.FC<{
  children: React.ReactNode;
  exit?: boolean;
  grid?: number; // grid opacity multiplier; 0 kills it (the lesson beat)
  bloom?: number;
}> = ({ children, exit = true, grid = 1, bloom = 1 }) => {
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
        background: mbPalette.bg,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: -90,
          opacity: 0.24 * grid,
          backgroundImage: `linear-gradient(${mbColors.line} 1px, transparent 1px), linear-gradient(90deg, ${mbColors.line} 1px, transparent 1px)`,
          backgroundSize: "108px 108px",
          transform: `translate(${Math.sin(t * 0.6) * 9}px, ${Math.cos(t * 0.5) * 11}px)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 1180,
          height: 1180,
          borderRadius: "50%",
          left: -300,
          top: -260,
          opacity: bloom,
          background: `radial-gradient(circle, ${mbPalette.primary}1F, transparent 64%)`,
          transform: `translateY(${Math.sin(t * 0.8) * 28}px)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 900,
          height: 900,
          borderRadius: "50%",
          right: -380,
          bottom: -180,
          opacity: bloom,
          background: `radial-gradient(circle, rgba(236,236,244,0.06), transparent 66%)`,
          transform: `translateY(${Math.cos(t * 0.7) * 22}px)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 1 - out * 0.85,
          transform: `translateY(${out * -26}px) scale(${1 + out * 0.02})`,
        }}
      >
        {children}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ type */

export const Rise: React.FC<{
  delay?: number;
  config?: SpringName;
  distance?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ delay = 0, config = "smooth", distance = 42, style, children }) => {
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
}> = ({ children, delay = 0, color = mbPalette.textDim }) => {
  const p = useIn(delay, "snappy");
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 14,
        opacity: p,
        transform: `translateX(${interpolate(p, [0, 1], [-24, 0])}px)`,
        fontFamily: theme.fonts.mono,
        color,
        fontSize: 26,
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
  color = mbPalette.text,
  weight = 800,
  align = "center",
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
        columnGap: Math.round(size * 0.24),
        rowGap: Math.round(size * 0.06),
        fontFamily: theme.fonts.display,
        fontSize: size,
        fontWeight: weight,
        lineHeight: 1.0,
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
        if (!mask) {
          return (
            <span
              key={`${word}-${i}`}
              style={{
                display: "inline-block",
                opacity: p,
                transform: `translateY(${interpolate(p, [0, 1], [size * 0.22, 0])}px) scale(${interpolate(p, [0, 1], [1.45, 1])})`,
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

// A headline that SLAMS: it arrives oversized and compresses onto the frame,
// so the cut reads as an impact rather than an entrance. `until` hard-cuts it
// off the screen with no fade — that is the hook's whole trick.
export const Slam: React.FC<{
  text: string;
  at: number;
  until?: number;
  size?: number;
  color?: string;
  glow?: boolean;
  style?: React.CSSProperties;
}> = ({ text, at, until, size = 190, color = mbPalette.text, glow = false, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < at || (until !== undefined && frame >= until)) return null;
  const p = spring({
    frame: frame - at,
    fps,
    config: { damping: 15, stiffness: 220, mass: 0.55 },
  });
  const settle = Math.sin((frame - at) / 26) * 1.4;
  return (
    <div
      style={{
        fontFamily: theme.fonts.display,
        fontSize: size,
        fontWeight: 800,
        letterSpacing: "-0.055em",
        lineHeight: 0.94,
        textAlign: "center",
        color,
        textShadow: glow
          ? `0 0 60px ${mbPalette.glow}, 0 0 130px ${mbPalette.glow}`
          : "0 20px 60px rgba(0,0,0,0.6)",
        opacity: interpolate(p, [0, 0.25], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
        transform: `scale(${interpolate(p, [0, 1], [1.2, 1])}) translateY(${interpolate(p, [0, 1], [-22, settle])}px)`,
        ...style,
      }}
    >
      {text}
    </div>
  );
};

/* ---------------------------------------------------------------- chips */

export const Chip: React.FC<{
  children: React.ReactNode;
  delay?: number;
  red?: boolean;
  size?: number;
  style?: React.CSSProperties;
}> = ({ children, delay = 0, red = false, size = 32, style }) => {
  const p = useIn(delay, "bouncy");
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 14,
        padding: `${Math.round(size * 0.52)}px ${Math.round(size * 0.92)}px`,
        borderRadius: 999,
        border: `2px solid ${red ? mbPalette.primary : mbColors.lineStrong}`,
        background: red ? mbColors.redSoft : mbColors.surface,
        boxShadow: red ? `0 0 44px ${mbPalette.glow}` : mbColors.shadow,
        fontFamily: theme.fonts.mono,
        fontSize: size,
        fontWeight: 700,
        letterSpacing: "0.1em",
        whiteSpace: "nowrap",
        color: red ? mbPalette.primary : mbPalette.text,
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [32, 0])}px) scale(${interpolate(p, [0, 1], [0.72, 1])}) rotate(${interpolate(p, [0, 1], [-4, 0])}deg)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/* -------------------------------------------------------------- counters */

const GROUPED = new Intl.NumberFormat("en-US");

/**
 * The counter this whole reel is about. Digits are tabular so the number never
 * jitters as it grows, and `settle` lets a scene pin the final value while the
 * type keeps breathing.
 */
export const Odometer: React.FC<{
  value: number;
  size?: number;
  color?: string;
  glow?: boolean;
  style?: React.CSSProperties;
}> = ({ value, size = 168, color = mbPalette.text, glow = false, style }) => (
  <div
    style={{
      fontFamily: theme.fonts.mono,
      fontSize: size,
      fontWeight: 800,
      letterSpacing: "-0.03em",
      fontVariantNumeric: "tabular-nums",
      lineHeight: 1,
      color,
      textShadow: glow ? `0 0 54px ${mbPalette.glow}, 0 0 120px ${mbPalette.glow}` : undefined,
      ...style,
    }}
  >
    {GROUPED.format(Math.max(0, Math.round(value)))}
  </div>
);

/** Exponential ramp 1 → 10^power. Linear counting to 100,000 reads as a bug. */
export const expCount = (p: number, power = 5) => Math.pow(10, p * power);

/* ---------------------------------------------------------- archival card */

export const Scanlines: React.FC<{ opacity?: number; period?: number }> = ({
  opacity = 0.3,
  period = 5,
}) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      opacity,
      pointerEvents: "none",
      background: `repeating-linear-gradient(0deg, rgba(0,0,0,0.55) 0px, rgba(0,0,0,0.55) 1px, transparent 1px, transparent ${period}px)`,
    }}
  />
);

/**
 * The archival player frame: a tape-grey 16:9 card with a scanline grade, a
 * timecode and the counter ticking on screen.
 *
 * `photo` is a CC-licensed still from `public/images/` (see CREDITS.md there) —
 * it is graded to greyscale so the photograph never spends the frame's single
 * hero colour, and it gets its own Ken Burns so the card is never a dead still.
 * Without one the card falls back to an anonymous silhouette, which is what it
 * shipped with before the photographs were licensed.
 */
export const PlayerCard: React.FC<{
  width?: number;
  count?: number;
  progress?: number;
  timecode?: string;
  frozen?: boolean;
  delay?: number;
  photo?: string;
  photoPos?: string; // object-position, for photos that are not already 16:9
  style?: React.CSSProperties;
}> = ({
  width = 720,
  count,
  progress = 0.12,
  timecode,
  frozen = false,
  delay = 0,
  photo,
  photoPos = "50% 42%",
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = useIn(delay, "smooth");
  const h = Math.round((width * 9) / 16);
  const flick = 0.9 + random(`tape-${Math.floor(frame / 3)}`) * 0.1;
  const breathe = frozen ? 0 : Math.sin((frame / fps) * 1.6) * 4;
  const kb = interpolate(frame, [0, 160], [1.02, 1.11], {
    easing: theme.ease.inOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        width,
        height: h,
        borderRadius: Math.round(width * 0.035),
        overflow: "hidden",
        position: "relative",
        background: mbColors.tape,
        border: `1px solid ${mbColors.lineStrong}`,
        boxShadow: mbColors.shadow,
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [46, breathe])}px) scale(${interpolate(p, [0, 1], [0.9, 1])})`,
        ...style,
      }}
    >
      {/* room */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 50% 42%, ${mbColors.tapeLift}, ${mbColors.tape} 68%)`,
          opacity: flick,
        }}
      />
      {photo ? (
        <Img
          src={staticFile(`images/${photo}`)}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: photoPos,
            // Greyscale is not a look here, it is the colour budget: the reel
            // allows exactly one red element per frame.
            filter: "grayscale(1) contrast(1.04) brightness(0.94)",
            transform: `scale(${frozen ? 1.02 : kb})`,
          }}
        />
      ) : (
        <>
          {/* fallback: head + shoulders, never a likeness */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              bottom: 0,
              transform: "translateX(-50%)",
              width: h * 0.86,
              height: h * 0.62,
              borderRadius: `${h * 0.4}px ${h * 0.4}px 0 0`,
              background: mbColors.ink,
              opacity: 0.72,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: h * 0.2,
              transform: "translateX(-50%)",
              width: h * 0.3,
              height: h * 0.3,
              borderRadius: "50%",
              background: mbColors.ink,
              opacity: 0.72,
            }}
          />
        </>
      )}
      {count !== undefined && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: photo ? h * 0.7 : h * 0.5,
            textAlign: "center",
            fontFamily: theme.fonts.mono,
            fontSize: Math.round(width * 0.115),
            fontWeight: 800,
            fontVariantNumeric: "tabular-nums",
            letterSpacing: "-0.02em",
            color: mbColors.white,
            opacity: 0.92,
            textShadow: photo ? "0 4px 24px rgba(0,0,0,0.9)" : undefined,
          }}
        >
          {GROUPED.format(Math.max(0, Math.round(count)))}
        </div>
      )}
      <Scanlines opacity={0.34} period={Math.max(4, Math.round(width / 160))} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 50% 46%, transparent 34%, rgba(0,0,0,0.68) 92%)`,
        }}
      />
      {timecode && (
        <div
          style={{
            position: "absolute",
            left: Math.round(width * 0.04),
            bottom: Math.round(width * 0.055),
            fontFamily: theme.fonts.mono,
            fontSize: Math.round(width * 0.036),
            fontWeight: 700,
            letterSpacing: "0.08em",
            color: "rgba(246,246,248,0.72)",
          }}
        >
          {timecode}
        </div>
      )}
      {/* scrub bar — grey, so the card never spends the frame's red */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: Math.round(width * 0.008),
          background: "rgba(246,246,248,0.16)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            width: `${Math.min(1, Math.max(0, progress)) * 100}%`,
            background: "rgba(246,246,248,0.62)",
          }}
        />
      </div>
      {frozen && <FreezeBrackets />}
    </div>
  );
};

const FreezeBrackets: React.FC = () => {
  const p = useIn(2, "snappy");
  const arm = 46;
  const corners: React.CSSProperties[] = [
    { left: 22, top: 22, borderLeft: "4px solid", borderTop: "4px solid" },
    { right: 22, top: 22, borderRight: "4px solid", borderTop: "4px solid" },
    { left: 22, bottom: 30, borderLeft: "4px solid", borderBottom: "4px solid" },
    { right: 22, bottom: 30, borderRight: "4px solid", borderBottom: "4px solid" },
  ];
  return (
    <>
      {corners.map((c, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: arm,
            height: arm,
            borderColor: mbColors.white,
            opacity: p * 0.85,
            transform: `scale(${interpolate(p, [0, 1], [1.5, 1])})`,
            ...c,
          }}
        />
      ))}
    </>
  );
};

/**
 * The collage element: the studio portrait cut off its sweep by
 * `scripts/cutout.mjs`, which also gives it the white die-cut border a paper
 * clipping has. Rendered with a hard, unblurred offset shadow — a clipping sits
 * ON the page, it does not glow above it — and graded to greyscale so the
 * photograph never spends the frame's single hero colour.
 *
 * The asset is 928×1000; `height` drives the width so the aspect is never
 * typed by hand.
 */
const CUTOUT_ASPECT = 928 / 1000;

export const Cutout: React.FC<{
  photo: string;
  height: number;
  delay?: number;
  tilt?: number; // degrees — a pasted clipping is never perfectly square
  dim?: number; // brightness, for when type has to sit on top of him
  style?: React.CSSProperties;
}> = ({ photo, height, delay = 0, tilt = 0, dim = 1, style }) => {
  const frame = useCurrentFrame();
  const p = useIn(delay, "smooth");
  const kb = interpolate(frame, [0, 190], [1, 1.04], {
    easing: theme.ease.inOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const off = Math.max(4, Math.round(height * 0.02));
  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        height,
        width: Math.round(height * CUTOUT_ASPECT),
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [40, 0])}px) rotate(${interpolate(p, [0, 1], [tilt - 3, tilt])}deg) scale(${interpolate(p, [0, 1], [0.94, kb])})`,
        transformOrigin: "bottom center",
        filter: `grayscale(1) contrast(1.12) brightness(${dim}) drop-shadow(${off}px ${off}px 0 rgba(0,0,0,0.9))`,
        ...style,
      }}
    >
      <Img
        src={staticFile(`images/${photo}`)}
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
      />
    </div>
  );
};

export const SourceLabel: React.FC<{ children: React.ReactNode; delay?: number }> = ({
  children,
  delay = 0,
}) => {
  const p = useIn(delay, "snappy");
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        fontFamily: theme.fonts.mono,
        fontSize: 24,
        fontWeight: 500,
        letterSpacing: "0.04em",
        color: mbPalette.textDim,
        opacity: p * 0.9,
        transform: `translateY(${interpolate(p, [0, 1], [14, 0])}px)`,
      }}
    >
      <span
        style={{
          width: 18,
          height: 18,
          border: `2px solid ${mbColors.lineStrong}`,
          borderRadius: 4,
          flexShrink: 0,
        }}
      />
      {children}
    </div>
  );
};

/* --------------------------------------------------------------- stamps */

// Rubber stamp: lands rotated and oversized, then bites down. `outline` keeps
// the red to a border so it can share a frame with something else; the solid
// variant is the payoff and owns the frame alone.
export const Stamp: React.FC<{
  text: string;
  at: number;
  until?: number;
  solid?: boolean;
  rotate?: number;
  size?: number;
  style?: React.CSSProperties;
}> = ({ text, at, until, solid = false, rotate = -8, size = 96, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < at) return null;
  const p = spring({
    frame: frame - at,
    fps,
    config: { damping: 13, stiffness: 240, mass: 0.5 },
  });
  const out =
    until === undefined
      ? 0
      : interpolate(frame, [until, until + 7], [0, 1], {
          easing: theme.ease.in,
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
  if (out >= 1) return null;
  // Ink jitter: a stamp is never perfectly registered.
  const jx = (random(`st-${text}-${Math.floor(frame / 4)}`) - 0.5) * 2.2;
  return (
    <div
      style={{
        display: "inline-block",
        padding: `${Math.round(size * 0.3)}px ${Math.round(size * 0.5)}px`,
        border: `${Math.max(5, Math.round(size * 0.075))}px solid ${mbPalette.primary}`,
        borderRadius: Math.round(size * 0.16),
        background: solid ? mbPalette.primary : "rgba(255, 30, 40, 0.10)",
        color: solid ? mbColors.white : mbPalette.primary,
        fontFamily: theme.fonts.display,
        fontSize: size,
        fontWeight: 800,
        letterSpacing: "-0.02em",
        whiteSpace: "nowrap",
        boxShadow: solid ? `0 0 90px ${mbPalette.glow}` : `0 0 46px ${mbPalette.glow}`,
        opacity: (1 - out) * interpolate(p, [0, 0.3], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
        transform: `rotate(${interpolate(p, [0, 1], [rotate - 12, rotate])}deg) scale(${interpolate(p, [0, 1], [1.9, 1 - out * 0.14])}) translate(${jx}px, ${out * -20}px)`,
        ...style,
      }}
    >
      {text}
    </div>
  );
};

/* --------------------------------------------------------------- cursor */

// The mouse pointer the whole last act is about.
export const Cursor: React.FC<{
  x: number;
  y: number;
  click?: number; // 0..1 click ring energy
  size?: number;
}> = ({ x, y, click = 0, size = 46 }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      transform: `scale(${1 - click * 0.16})`,
      transformOrigin: "6px 4px",
      pointerEvents: "none",
    }}
  >
    {click > 0.01 && (
      <div
        style={{
          position: "absolute",
          left: 6,
          top: 4,
          width: 30 + click * 130,
          height: 30 + click * 130,
          marginLeft: -(15 + click * 65),
          marginTop: -(15 + click * 65),
          borderRadius: "50%",
          border: `4px solid ${mbPalette.primary}`,
          opacity: 1 - click,
        }}
      />
    )}
    <svg width={size} height={size * 1.35} viewBox="0 0 24 32" fill="none">
      <path
        d="M3 2L20 17.2H11.6L15.4 27.4L11.2 29L7.4 18.9L3 23.2V2Z"
        fill={mbColors.white}
        stroke={mbColors.ink}
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

/* ---------------------------------------------------------------- brand */

const Y_PATH =
  "M14.8568 4H19L11.804 12.0229V17H8.19604V12.0229L1 4H5.30176L10.0793 9.64571L14.8568 4Z";

// Monochrome tile in the brand bar — the chip must not spend the frame's red.
export const YolocoTile: React.FC<{ size?: number; red?: boolean }> = ({
  size = 30,
  red = false,
}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.28,
      background: red ? mbPalette.primary : mbColors.white,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    }}
  >
    <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 20 20" fill="none">
      <path d={Y_PATH} fill={mbColors.ink} />
    </svg>
  </div>
);

export const YolocoMark: React.FC<{ size?: number; delay?: number }> = ({
  size = 148,
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
        background: mbPalette.primary,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: tile,
        transform: `scale(${interpolate(tile, [0, 1], [0.62, breathe])}) rotate(${interpolate(tile, [0, 1], [-14, 0])}deg)`,
        boxShadow: `0 ${size * 0.16}px ${size * 0.42}px -${size * 0.12}px ${mbPalette.glow}`,
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
        <path d={Y_PATH} fill={mbColors.ink} />
      </svg>
    </div>
  );
};

export const YolocoWordmark: React.FC<{ delay?: number; size?: number }> = ({
  delay = 0,
  size = 92,
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
        color: mbPalette.text,
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
        fontSize: 23,
        letterSpacing: "0.12em",
        color: mbPalette.textDim,
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
            color: mbPalette.text,
          }}
        >
          Yoloco
        </span>
      </span>
      <span>{chapter}</span>
    </div>
  );
};
