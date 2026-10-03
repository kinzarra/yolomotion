// Scene primitives for unicorn-cafe. The reel is one continuous piece of phone
// footage, so the kit is deliberately small: a footage frame, a HUD register
// built from bone hairlines, and one magenta slam. Everything else is type.
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { theme } from "../../theme";
import { useIn, useRamp } from "../../reel";
import { SHOTS } from "./cuts";
import { ucColors, ucPalette } from "./palette";
import { SCENES } from "./timeline";

// The phone shot is 592×1280 — TALLER than 9:16, so cover is width-driven and
// the crop happens vertically. `focus` picks which band survives: 0.5 centres
// it and loses 114px of head and shoulders in source pixels; the values the
// scenes pass are measured against the faces in each shot.
const SRC = { w: 592, h: 1280 } as const;
export const SRC_SCALE = 1080 / SRC.w; // 1.824 — covers 1920 with 415px to spare

export const Footage: React.FC<{
  shot: keyof typeof SHOTS;
  /** 0 = crop from the top of the source, 1 = from the bottom. */
  focus?: number;
  /** Ken Burns: scale at the first and last frame of the scene. */
  zoom?: [number, number];
  /** Extra scale on top of the push — snap-zooms and punches ride this. */
  scale?: number;
  style?: React.CSSProperties;
}> = ({ shot, focus = 0.42, zoom = [1, 1.06], scale = 1, style }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const push = interpolate(frame, [0, durationInFrames], zoom, {
    easing: theme.ease.inOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ overflow: "hidden", ...style }}>
      <AbsoluteFill
        style={{
          transform: `scale(${push * scale})`,
          transformOrigin: `50% ${focus * 100}%`,
        }}
      >
        <OffthreadVideo
          src={staticFile("media/unicorn-cafe/source.mp4")}
          muted
          // The soundtrack is served by the reel's voiceover track instead:
          // it is sliced across the jump cut and levelled to -16 LUFS, which
          // the raw stream is not.
          trimBefore={Math.round(SHOTS[shot].srcIn * fps)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: `50% ${focus * 100}%`,
            // The phone camera runs auto-white-balance in a beige room; a
            // little contrast and desaturation pulls it toward the ink/bone
            // register the graphics live in, without turning it grey.
            filter: "saturate(0.86) contrast(1.1) brightness(0.94)",
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Dark wash so type over the footage keeps its contrast. */
export const Scrim: React.FC<{
  from?: "top" | "bottom";
  height?: number;
  strength?: number;
}> = ({ from = "bottom", height = 700, strength = 0.9 }) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      right: 0,
      [from]: 0,
      height,
      background: `linear-gradient(${from === "bottom" ? 0 : 180}deg, ${
        ucPalette.bg
      }${Math.round(strength * 255).toString(16)}, transparent)`,
      pointerEvents: "none",
    }}
  />
);

/** Small mono label — HUD register. Latin and digits only: the mono face's
 *  Cyrillic coverage is not part of the loaded subset. */
export const Mono: React.FC<{
  children: React.ReactNode;
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}> = ({ children, size = 24, color = ucColors.dim, style }) => (
  <span
    style={{
      fontFamily: theme.fonts.mono,
      fontSize: size,
      fontWeight: 500,
      letterSpacing: "0.16em",
      textTransform: "uppercase",
      color,
      ...style,
    }}
  >
    {children}
  </span>
);

/** Wide display type — every Cyrillic headline in the reel. */
export const Wide: React.FC<{
  children: React.ReactNode;
  size?: number;
  weight?: number;
  color?: string;
  style?: React.CSSProperties;
}> = ({ children, size = 88, weight = 800, color = ucPalette.text, style }) => (
  <span
    style={{
      fontFamily: theme.fonts.wide,
      fontSize: size,
      fontWeight: weight,
      lineHeight: 1.02,
      letterSpacing: "-0.03em",
      textTransform: "uppercase",
      color,
      ...style,
    }}
  >
    {children}
  </span>
);

/**
 * A headline that arrives line by line behind a wiping mask, instead of
 * fading. Each line is its own clip: the type slides up inside a fixed box, so
 * the words appear to be uncovered rather than to move.
 */
export const MaskLines: React.FC<{
  lines: string[];
  size: number;
  delay?: number;
  per?: number;
  color?: string;
  accentIndex?: number;
  align?: "left" | "center";
}> = ({ lines, size, delay = 0, per = 4, color = ucPalette.text, accentIndex, align = "left" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lineHeight = size * 1.02;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: size * 0.1 }}>
      {lines.map((line, i) => {
        // A plain eased ramp, not useIn: a hook cannot be called in a .map().
        const p = interpolate(frame, [delay + i * per, delay + i * per + 16], [0, 1], {
          easing: theme.ease.out,
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <div
            key={line}
            style={{
              height: lineHeight,
              overflow: "hidden",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: align === "center" ? "center" : "flex-start",
            }}
          >
            <Wide
              size={size}
              color={i === accentIndex ? ucPalette.primary : color}
              style={{
                display: "block",
                transform: `translateY(${interpolate(p, [0, 1], [lineHeight, 0])}px)`,
                opacity: interpolate(p, [0, 0.25, 1], [0, 1, 1]),
              }}
            >
              {line}
            </Wide>
          </div>
        );
      })}
    </div>
  );
};

/** Hairline that draws itself left to right. Never fades in. */
export const Rule: React.FC<{
  width: number;
  delay?: number;
  color?: string;
  thickness?: number;
}> = ({ width, delay = 0, color = ucColors.lineStrong, thickness = 3 }) => {
  const p = useRamp(delay, delay + 14, theme.ease.out);
  return <div style={{ width: width * p, height: thickness, background: color }} />;
};

/**
 * The one magenta moment: a word that lands like a stamp — overshoot scale,
 * a hard bone rule under it, and a shear that settles. Used once, on
 * «ЕДИНОРОГА».
 */
export const Slam: React.FC<{ word: string; delay: number; size?: number }> = ({
  word,
  delay,
  size = 116,
}) => {
  const frame = useCurrentFrame();
  const p = useIn(delay, "bouncy");
  const settle = useRamp(delay + 6, delay + 26, theme.ease.out);
  if (frame < delay) return null;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
      <Wide
        size={size}
        weight={900}
        color={ucPalette.primary}
        style={{
          letterSpacing: "-0.05em",
          // 1.16, not 1.5: «ЕДИНОРОГА» at size 116 is already 895px wide, so a
          // 1.5 overshoot pushes both ends past the frame for four frames and
          // the stamp lands looking like a crop, not a hit.
          transform: `scale(${interpolate(p, [0, 1], [1.16, 1])}) skewX(${interpolate(
            settle,
            [0, 1],
            [-9, 0],
          )}deg)`,
          opacity: Math.min(1, p * 2),
          filter: `drop-shadow(0 0 60px ${ucPalette.glow})`,
        }}
      >
        {word}
      </Wide>
      <div
        style={{
          width: interpolate(settle, [0, 1], [0, size * word.length * 0.62]),
          height: 5,
          background: ucColors.bone,
        }}
      />
    </div>
  );
};

/** Corner brackets closing onto the frame — the "this is being captured" cue. */
export const Brackets: React.FC<{ delay?: number; inset?: number; size?: number }> = ({
  delay = 0,
  inset = 56,
  size = 118,
}) => {
  const p = useRamp(delay, delay + 22, theme.ease.out);
  const travel = interpolate(p, [0, 1], [80, 0]);
  const edge = `4px solid ${ucColors.bone}`;
  // dx/dy also say which two edges the corner draws: -1 = the near side.
  const corners: { dx: -1 | 1; dy: -1 | 1 }[] = [
    { dx: -1, dy: -1 },
    { dx: 1, dy: -1 },
    { dx: -1, dy: 1 },
    { dx: 1, dy: 1 },
  ];
  return (
    <>
      {corners.map(({ dx, dy }) => (
        <div
          key={`${dx}${dy}`}
          style={{
            position: "absolute",
            top: dy < 0 ? inset : undefined,
            bottom: dy > 0 ? inset : undefined,
            left: dx < 0 ? inset : undefined,
            right: dx > 0 ? inset : undefined,
            width: size,
            height: size,
            borderTop: dy < 0 ? edge : undefined,
            borderBottom: dy > 0 ? edge : undefined,
            borderLeft: dx < 0 ? edge : undefined,
            borderRight: dx > 0 ? edge : undefined,
            opacity: p * 0.9,
            transform: `translate(${dx * travel}px, ${dy * travel}px)`,
          }}
        />
      ))}
    </>
  );
};

/** White flash on a hit. Amount is 0–1. */
export const Flash: React.FC<{ amount: number; color?: string }> = ({
  amount,
  color = ucColors.bone,
}) =>
  amount <= 0 ? null : (
    <AbsoluteFill
      style={{ background: color, opacity: Math.min(0.34, amount * 0.34), pointerEvents: "none" }}
    />
  );

/** Exit for a scene's graphics: faster than the entrance, per rule 4. */
export const useExit = (frames = 10): React.CSSProperties => {
  const { durationInFrames } = useVideoConfig();
  const p = useRamp(durationInFrames - frames, durationInFrames - 2, theme.ease.in);
  return { opacity: 1 - p, transform: `translateY(${-40 * p}px)` };
};

/**
 * A bone band sweeping down the frame once — the footage being read. It is a
 * gradient with a bright leading edge, not a hairline: a 3px rule travelling
 * over live video reads as a compression seam rather than a scan.
 */
export const ScanLine: React.FC<{ from: number; to: number }> = ({ from, to }) => {
  const frame = useCurrentFrame();
  const p = useRamp(from, to, theme.ease.inOut);
  if (frame < from || frame > to) return null;
  const fade = Math.sin(p * Math.PI);
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 1920 * p - 150,
        height: 156,
        opacity: 0.5 * fade,
        background: `linear-gradient(180deg, transparent, ${ucColors.bone}22 70%, ${ucColors.bone})`,
      }}
    />
  );
};

/** Mono line that types itself on, with a block cursor while it runs. */
export const Typed: React.FC<{ text: string; delay: number; size?: number }> = ({
  text,
  delay,
  size = 26,
}) => {
  const frame = useCurrentFrame();
  const p = useRamp(delay, delay + text.length * 0.7, theme.ease.inOut);
  if (frame < delay) return null;
  const shown = text.slice(0, Math.ceil(p * text.length));
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <Mono size={size} color={ucColors.lineStrong} style={{ letterSpacing: 0 }}>
        ›
      </Mono>
      <Mono size={size} color={ucColors.bone} style={{ letterSpacing: "0.06em" }}>
        {shown}
      </Mono>
      {p < 1 && (
        <div
          style={{
            width: size * 0.5,
            height: size,
            background: ucColors.bone,
            opacity: frame % 12 < 7 ? 0.9 : 0.2,
          }}
        />
      )}
    </div>
  );
};

/** Bone progress bar with a mono readout. Never magenta: the accent belongs
 *  to the caption's active word while this beat runs. */
export const Bar: React.FC<{ from: number; to: number; width?: number }> = ({
  from,
  to,
  width = 900,
}) => {
  // ease.out, not inOut: easeInOutQuint spends its first third under 2%, so
  // the readout sat on "0%" for a full second. Expo-out also happens to be
  // how a real render bar behaves — most of the way fast, then a long crawl.
  const p = useRamp(from, to, theme.ease.out);
  // The track draws itself in before the fill starts, so the bar is never a
  // static "0%" waiting for its cue.
  const track = useRamp(from - 8, from + 4, theme.ease.out);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, width }}>
      <div style={{ display: "flex", justifyContent: "space-between", opacity: track }}>
        <Mono size={22}>render</Mono>
        <Mono size={22} color={ucColors.bone}>
          {Math.round(p * 100)}%
        </Mono>
      </div>
      <div style={{ width: width * track, height: 8, background: ucColors.line }}>
        <div style={{ width: width * p, height: 8, background: ucColors.bone }} />
      </div>
    </div>
  );
};

/** Running capture HUD: source timecode that JUMPS at the jump cut, which is
 *  the whole joke of beat 04. Lives above the scenes, so it reads global
 *  frames and finds the shot itself. */
export const Timecode: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const now = frame / fps;
  const shot = (Object.keys(SHOTS) as (keyof typeof SHOTS)[]).find((key) => {
    const scene = SCENES[key];
    return now >= scene.from && now < scene.from + scene.len;
  });
  // The outro has no footage, so the capture HUD goes off with the picture.
  if (!shot) return null;
  const src = SHOTS[shot].srcIn + (now - SCENES[shot].from);
  const mm = String(Math.floor(src / 60)).padStart(2, "0");
  const ss = String(Math.floor(src % 60)).padStart(2, "0");
  const cs = String(Math.floor((src % 1) * 100)).padStart(2, "0");
  return (
    <div
      style={{
        position: "absolute",
        left: 90,
        top: 152,
        display: "flex",
        alignItems: "center",
        gap: 14,
      }}
    >
      <div
        style={{
          width: 16,
          height: 16,
          borderRadius: 8,
          background: ucColors.bone,
          opacity: frame % 30 < 18 ? 0.95 : 0.25,
        }}
      />
      <Mono size={24} color={ucColors.bone}>
        rec
      </Mono>
      <Mono size={24} style={{ letterSpacing: "0.1em" }}>
        {`src ${mm}:${ss}.${cs}`}
      </Mono>
    </div>
  );
};
