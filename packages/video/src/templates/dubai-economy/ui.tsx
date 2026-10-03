// Episode kit for «Как устроена экономика Дубая» (ВЫПУСК 07). The series look
// — paper that prints, digital that snaps — is re-exported untouched from the
// previous episodes; this file adds what a city-economy episode needs:
//
//   FOOTAGE   Photo (cover-crop + Ken Burns to a point + greyscale grade),
//             Clip (a cut shot from footage.ts in a box), PrintedPhoto (a
//             photo coming out of the thermal printer), Scrim, Sweep.
//   MOTION    FlashCut (the cut between beats), CutZoom (the beat lands with
//             a push), Dust (slow lime particles for depth).
//   CITY      Skyline, Crane, Lanes (goods / people / money running past a
//             node), DotGlobe, Pie, BoardRow, DebtLine.
//
// Every footage file is evidence for one spoken line — see the scenario's
// «улика» lines — and is graded to greyscale so it never brings a third
// colour into the frame. Footage cuts hard: no opacity fade on a photo or a
// clip (two fades back to back read as a dropped frame, see yoclips-promo).
import React from "react";
import {
  Img,
  OffthreadVideo,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { theme } from "../../theme";
import { useIn } from "../../reel";
import { deColors, dePalette } from "./palette";
import { FOOTAGE, FootageShot } from "./footage";
import { rnd } from "../digital-ruble/ui";

export * from "../no-it-in-russia/ui";

const DIR = "footage/dubai-economy";

/** Eased, clamped ramp off an already-read frame — usable inside `.map()`. */
export const ramp = (frame: number, from: number, to: number, easing = theme.ease.out) =>
  interpolate(frame, [from, to], [0, 1], {
    easing,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

/** The series grade for footage: greyscale, a touch of contrast, a hair dark. */
export const PHOTO_GRADE = "grayscale(1) contrast(1.18) brightness(0.86)";

/* ------------------------------------------------------------ footage */

/**
 * A still, cover-cropped into its box, pushed from `zoom[0]` to `zoom[1]`
 * across `len` frames with the push ending on `focus` (0..1 of the source) —
 * the part of the frame the voice is talking about, not the centre.
 * `drift` adds a slow horizontal parallax in px.
 */
export const Photo: React.FC<{
  file: string;
  len: number;
  focus?: [number, number];
  zoom?: [number, number];
  drift?: number;
  filter?: string;
  style?: React.CSSProperties;
}> = ({ file, len, focus = [0.5, 0.5], zoom = [1.04, 1.16], drift = 0, filter = PHOTO_GRADE, style }) => {
  const frame = useCurrentFrame();
  const t = ramp(frame, 0, len, theme.ease.inOut);
  const settle = useIn(0, "smooth");
  const scale = interpolate(t, [0, 1], zoom) * interpolate(settle, [0, 1], [1.06, 1]);
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", ...style }}>
      <Img
        src={staticFile(`${DIR}/${file}`)}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: `${focus[0] * 100}% ${focus[1] * 100}%`,
          transformOrigin: `${focus[0] * 100}% ${focus[1] * 100}%`,
          transform: `translateX(${t * drift}px) scale(${scale})`,
          filter,
        }}
      />
    </div>
  );
};

/** Frames a cut clip runs — a scene never types a footage length. */
export const shotFrames = (shot: FootageShot, fps: number) => Math.floor(FOOTAGE[shot].seconds * fps);

/** A cut shot from footage.ts, cover-fitted into its box, graded, muted. */
export const Clip: React.FC<{
  shot: FootageShot;
  zoom?: [number, number];
  focus?: [number, number];
  filter?: string;
  style?: React.CSSProperties;
}> = ({ shot, zoom = [1.02, 1.1], focus = [0.5, 0.5], filter = PHOTO_GRADE, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = ramp(frame, 0, shotFrames(shot, fps), theme.ease.inOut);
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", ...style }}>
      <OffthreadVideo
        src={staticFile(`${DIR}/${shot}.mp4`)}
        muted
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: `${focus[0] * 100}% ${focus[1] * 100}%`,
          transformOrigin: `${focus[0] * 100}% ${focus[1] * 100}%`,
          transform: `scale(${interpolate(t, [0, 1], zoom)})`,
          filter,
        }}
      />
    </div>
  );
};

/**
 * Dark wash so type keeps its contrast over footage. Dense at the top (brand
 * bar + headline) and from y≈1300 down, where the captions sit at 1416.
 */
export const Scrim: React.FC<{ top?: number; mid?: number; bottom?: number }> = ({
  top = 0.85,
  mid = 0.25,
  bottom = 0.95,
}) => {
  const a = (v: number) =>
    Math.round(v * 255)
      .toString(16)
      .padStart(2, "0");
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: `linear-gradient(180deg, ${dePalette.bg}${a(top)} 0%, ${dePalette.bg}${a(mid)} 34%, ${dePalette.bg}${a(mid)} 58%, ${dePalette.bg}${a(bottom)} 74%, ${dePalette.bg}${a(bottom)} 100%)`,
      }}
    />
  );
};

/** A diagonal glint crossing a photo once — the light catching the print. */
export const Sweep: React.FC<{ at: number; life?: number; strength?: number }> = ({
  at,
  life = 26,
  strength = 0.22,
}) => {
  const frame = useCurrentFrame();
  const p = ramp(frame, at, at + life, theme.ease.inOut);
  if (p <= 0 || p >= 1) return null;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        mixBlendMode: "screen",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "-40%",
          bottom: "-40%",
          width: "34%",
          left: `${interpolate(p, [0, 1], [-50, 120])}%`,
          transform: "rotate(18deg)",
          background: `linear-gradient(90deg, transparent, ${deColors.white}, transparent)`,
          opacity: strength,
        }}
      />
    </div>
  );
};

/**
 * A photo coming out of the thermal printer: paper card, the image revealed
 * top→down under the lime head, greyscale with a scanline dither, a tilt.
 */
export const PrintedPhoto: React.FC<{
  file: string;
  width: number;
  height: number;
  printFrom?: number;
  printFrames?: number;
  focus?: [number, number];
  zoom?: [number, number];
  len: number;
  caption?: string;
  tilt?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({
  file,
  width,
  height,
  printFrom = 0,
  printFrames = 30,
  focus,
  zoom = [1.0, 1.14],
  len,
  caption,
  tilt = -2,
  style,
  children,
}) => {
  const frame = useCurrentFrame();
  const p = ramp(frame, printFrom, printFrom + printFrames, theme.ease.inOut);
  const head = p > 0 && p < 1 ? Math.sin(p * Math.PI) : 0;
  const pad = 22;
  const capH = caption ? 64 : 0;
  return (
    <div
      style={{
        position: "relative",
        width,
        height: height + pad * 2 + capH,
        transform: `rotate(${tilt}deg)`,
        filter: `drop-shadow(${deColors.paperShadow})`,
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          clipPath: `inset(0 0 ${(1 - p) * 100}% 0)`,
          background: deColors.paper,
          padding: pad,
        }}
      >
        <div style={{ position: "relative", width: width - pad * 2, height, overflow: "hidden" }}>
          <Photo file={file} len={len} focus={focus} zoom={zoom} filter="grayscale(1) contrast(1.3) brightness(1.02)" />
          {/* thermal dither: fine horizontal lines + a paper multiply */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "repeating-linear-gradient(180deg, rgba(21,23,26,0.16) 0px, rgba(21,23,26,0.16) 1px, transparent 1px, transparent 3px)",
            }}
          />
          <div style={{ position: "absolute", inset: 0, background: deColors.paper, mixBlendMode: "multiply", opacity: 0.55 }} />
          {children}
        </div>
        {caption && (
          <div
            style={{
              height: capH,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontFamily: theme.fonts.mono,
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: "0.12em",
              color: deColors.ink,
            }}
          >
            {caption}
          </div>
        )}
      </div>
      <div
        style={{
          position: "absolute",
          left: -16,
          right: -16,
          top: `${p * 100}%`,
          height: 6,
          marginTop: -3,
          background: dePalette.primary,
          boxShadow: `0 0 24px ${dePalette.glow}`,
          opacity: head,
        }}
      />
    </div>
  );
};

/* ------------------------------------------------------------- motion */

/**
 * The cut between beats: 2 frames before and 3 after each boundary — one
 * white peak ON the boundary frame, a lime/red chromatic tear at the edges,
 * a few horizontal light streaks. Six frames, so it reads as a cut, not as a
 * transition. Lives above the scenes, below the captions.
 */
export const FlashCut: React.FC<{ cuts: number[] }> = ({ cuts }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const hit = cuts
    .map((c) => frame - Math.round(c * fps))
    .find((k) => k >= -2 && k <= 3);
  if (hit === undefined) return null;
  // One white peak on the boundary frame, then gone in three. Longer than
  // that and the flash washes the incoming beat grey instead of cutting.
  const PEAK = [0.05, 0.12, 0.32, 0.12, 0.04, 0];
  const peak = PEAK[hit + 2];
  const tear = Math.max(0, 1 - Math.abs(hit) / 3);
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(97deg, ${deColors.bad} 0%, transparent 22%, transparent 78%, ${dePalette.primary} 100%)`,
          mixBlendMode: "screen",
          opacity: tear * 0.4,
          transform: `translateX(${(hit % 2 === 0 ? 1 : -1) * 18 * tear}px)`,
        }}
      />
      {Array.from({ length: 5 }, (_, i) => {
        const y = rnd(i * 17 + Math.round(frame / 2) * 3) * 1920;
        const h = 2 + rnd(i * 5 + frame) * 10;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: y,
              height: h,
              background: deColors.white,
              opacity: tear * 0.35,
              transform: `translateX(${(rnd(i + frame) - 0.5) * 300}px)`,
            }}
          />
        );
      })}
      <div style={{ position: "absolute", inset: 0, background: deColors.white, opacity: Math.max(0, peak) }} />
    </div>
  );
};

/** The beat lands with a push: content scales 1.07 → 1 over its first 10 frames. */
export const CutZoom: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const k = ramp(frame, 0, 10);
  return (
    <div style={{ position: "absolute", inset: 0, transform: `scale(${interpolate(k, [0, 1], [1.07, 1])})` }}>
      {children}
    </div>
  );
};

/** Slow lime motes for depth — tiny, dim, never the frame's glowing element. */
export const Dust: React.FC<{ count?: number; seed?: number; opacity?: number }> = ({
  count = 26,
  seed = 1,
  opacity = 0.55,
}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {Array.from({ length: count }, (_, i) => {
        const x = rnd(seed * 31 + i * 7) * 1080;
        const speed = 0.4 + rnd(seed + i * 13) * 1.1;
        const y = (((rnd(seed * 3 + i * 11) * 2000 - frame * speed) % 2000) + 2000) % 2000 - 40;
        const s = 3 + rnd(i * 19 + seed) * 5;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x + Math.sin((frame + i * 20) / 30) * 14,
              top: y,
              width: s,
              height: s,
              background: dePalette.primary,
              opacity: opacity * (0.3 + rnd(i * 23) * 0.7),
            }}
          />
        );
      })}
    </div>
  );
};

/* --------------------------------------------------------------- city */

export type Tower = { x: number; w: number; h: number; spire?: boolean };

/** A row of towers that grow out of the ground, staggered, with lit windows. */
export const Skyline: React.FC<{
  towers: Tower[];
  ground: number;
  delay?: number;
  per?: number;
  color?: string;
  windows?: string;
  /** 0..1 per tower — how far it is built (crisis: half-built towers). */
  built?: number[];
}> = ({ towers, ground, delay = 0, per = 3, color = deColors.surfaceLift, windows = deColors.lineStrong, built }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <>
      {towers.map((tw, i) => {
        const p = spring({ frame: frame - delay - i * per, fps, config: theme.spring.smooth });
        const h = tw.h * p * (built?.[i] ?? 1);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: tw.x,
              top: ground - h,
              width: tw.w,
              height: h,
              background: color,
              borderTop: `2px solid ${deColors.lineStrong}`,
              backgroundImage: `repeating-linear-gradient(180deg, transparent 0px, transparent 18px, ${windows} 18px, ${windows} 21px), repeating-linear-gradient(90deg, transparent 0px, transparent 14px, ${color} 14px, ${color} 22px)`,
              backgroundBlendMode: "normal",
            }}
          >
            {tw.spire && (
              <div
                style={{
                  position: "absolute",
                  left: tw.w / 2 - 4,
                  top: -tw.h * 0.32 * p,
                  width: 8,
                  height: tw.h * 0.32 * p,
                  background: color,
                  clipPath: "polygon(0 100%, 50% 0, 100% 100%)",
                }}
              />
            )}
          </div>
        );
      })}
    </>
  );
};

/** A tower crane: mast, jib, a hook that swings. Drawn in bone hairlines. */
export const Crane: React.FC<{
  x: number;
  ground: number;
  height: number;
  delay?: number;
  color?: string;
  swing?: number;
}> = ({ x, ground, height, delay = 0, color = deColors.lineStrong, swing = 0 }) => {
  const p = useIn(delay, "smooth");
  const frame = useCurrentFrame();
  const jib = height * 0.9;
  const cable = 120 + Math.sin(frame / 18 + x) * 18;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: ground - height,
        width: 20,
        height,
        opacity: p,
        transform: `translateY(${(1 - p) * 120}px) rotate(${swing * Math.sin(frame / 40)}deg)`,
        transformOrigin: "50% 100%",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          border: `3px solid ${color}`,
          backgroundImage: `repeating-linear-gradient(45deg, transparent 0px, transparent 16px, ${color} 16px, ${color} 19px)`,
        }}
      />
      <div style={{ position: "absolute", top: 0, left: -jib * 0.25, width: jib, height: 5, background: color }} />
      <div style={{ position: "absolute", top: 0, left: jib * 0.62, width: 2, height: cable, background: color }} />
      <div style={{ position: "absolute", top: cable, left: jib * 0.62 - 12, width: 26, height: 18, border: `3px solid ${color}` }} />
    </div>
  );
};

export type LaneItem = "box" | "person" | "coin";

/** One glyph that runs along a lane: a container box, a person, a coin. */
const LaneGlyph: React.FC<{ kind: LaneItem; size: number; color: string }> = ({ kind, size, color }) => {
  if (kind === "box") {
    return (
      <div
        style={{
          width: size * 1.6,
          height: size,
          border: `4px solid ${color}`,
          backgroundImage: `repeating-linear-gradient(90deg, transparent 0px, transparent 10px, ${color} 10px, ${color} 13px)`,
        }}
      />
    );
  }
  if (kind === "coin") {
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          border: `4px solid ${color}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: theme.fonts.mono,
          fontWeight: 800,
          fontSize: size * 0.6,
          color,
        }}
      >
        $
      </div>
    );
  }
  return (
    <div style={{ position: "relative", width: size * 0.8, height: size * 1.1 }}>
      <div
        style={{
          position: "absolute",
          left: size * 0.22,
          top: 0,
          width: size * 0.36,
          height: size * 0.36,
          borderRadius: "50%",
          background: color,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: size * 0.44,
          width: size * 0.8,
          height: size * 0.62,
          borderRadius: `${size * 0.4}px ${size * 0.4}px 4px 4px`,
          background: color,
        }}
      />
    </div>
  );
};

/**
 * A horizontal lane: glyphs stream left→right at constant spacing, looping.
 * `on` (0..1) fades the stream in; `speed` px/frame.
 */
export const Lane: React.FC<{
  kind: LaneItem;
  y: number;
  label: string;
  delay?: number;
  speed?: number;
  gap?: number;
  size?: number;
  color?: string;
}> = ({ kind, y, label, delay = 0, speed = 9, gap = 170, size = 54, color = dePalette.primary }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const on = spring({ frame: frame - delay, fps, config: theme.spring.smooth });
  const n = Math.ceil(1400 / gap) + 1;
  const offset = ((frame - delay) * speed) % gap;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, height: size * 1.2 }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: size * 0.6,
          height: 2,
          background: color,
          opacity: 0.25 * on,
          transform: `scaleX(${on})`,
          transformOrigin: "left",
        }}
      />
      {Array.from({ length: n }, (_, i) => {
        const x = -200 + i * gap + offset;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: 0,
              opacity: on,
              transform: `translateY(${(1 - on) * 30}px)`,
            }}
          >
            <LaneGlyph kind={kind} size={size} color={color} />
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          right: 90,
          top: -44,
          fontFamily: theme.fonts.mono,
          fontSize: 26,
          fontWeight: 700,
          letterSpacing: "0.16em",
          color: dePalette.text,
          opacity: on,
          transform: `translateX(${(1 - on) * 30}px)`,
        }}
      >
        {label}
      </div>
    </div>
  );
};

/**
 * A dot-matrix globe: a disc of dots with a slow drift (the rotation), a pin,
 * and an expanding ring. `ring` 0..1 grows the 8-hour reach.
 */
export const DotGlobe: React.FC<{ size: number; ring: number; delay?: number }> = ({ size, ring, delay = 0 }) => {
  const frame = useCurrentFrame();
  const p = useIn(delay, "smooth");
  const pitch = 26;
  const r = size / 2;
  const dots: { x: number; y: number; land: boolean }[] = [];
  const shift = (frame * 0.6) % pitch;
  for (let y = -r; y <= r; y += pitch) {
    for (let x = -r - pitch; x <= r + pitch; x += pitch) {
      const xx = x + shift;
      if (xx * xx + y * y > r * r) continue;
      // crude continents: deterministic blobs, enough to read as "the planet"
      const gx = Math.floor((x - frame * 0.6 + 4000) / pitch);
      const gy = Math.floor((y + 4000) / pitch);
      const land = rnd(Math.floor(gx / 3) * 7 + Math.floor(gy / 3) * 13) > 0.45;
      dots.push({ x: xx, y, land });
    }
  }
  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        opacity: p,
        transform: `scale(${interpolate(p, [0, 1], [0.7, 1])}) rotate(${interpolate(p, [0, 1], [-12, 0])}deg)`,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          border: `2px solid ${deColors.line}`,
          background: `radial-gradient(circle at 38% 34%, ${deColors.surfaceLift}, ${dePalette.bg} 70%)`,
        }}
      />
      {dots.map((d, i) => {
        const edge = 1 - Math.sqrt(d.x * d.x + d.y * d.y) / r;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: r + d.x - 4,
              top: r + d.y - 4,
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: d.land ? dePalette.text : deColors.lineStrong,
              opacity: (d.land ? 0.7 : 0.35) * Math.min(1, edge * 4),
            }}
          />
        );
      })}
      {/* the 8-hour reach */}
      <div
        style={{
          position: "absolute",
          left: r - r * 1.05 * ring,
          top: r * 0.8 - r * 1.05 * ring,
          width: r * 2.1 * ring,
          height: r * 2.1 * ring,
          borderRadius: "50%",
          border: `5px solid ${dePalette.primary}`,
          background: `${dePalette.primary}14`,
          boxShadow: `0 0 50px ${dePalette.glow}`,
          opacity: ring > 0.01 ? 1 : 0,
        }}
      />
      {/* the pin */}
      <div
        style={{
          position: "absolute",
          left: r - 13,
          top: r * 0.8 - 13,
          width: 26,
          height: 26,
          background: dePalette.primary,
          transform: `rotate(45deg) scale(${1 + Math.sin(frame / 6) * 0.12})`,
        }}
      />
    </div>
  );
};

/** A pie that fills to `share` (0..1) — lime slice over a dark disc. */
export const Pie: React.FC<{ size: number; share: number; label: string }> = ({ size, share, label }) => (
  <div
    style={{
      position: "relative",
      width: size,
      height: size,
      borderRadius: "50%",
      background: `conic-gradient(${dePalette.primary} 0turn ${share}turn, ${deColors.surfaceLift} ${share}turn 1turn)`,
      boxShadow: `0 0 ${size * 0.25}px ${dePalette.glow}`,
    }}
  >
    <div
      style={{
        position: "absolute",
        inset: size * 0.2,
        borderRadius: "50%",
        background: dePalette.bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: `${theme.fonts.wide}, ${theme.fonts.mono}`,
        fontWeight: 900,
        fontSize: size * 0.22,
        color: dePalette.text,
      }}
    >
      {label}
    </div>
  </div>
);

/**
 * A split-flap row on a departures board: each character rolls through noise
 * before it settles, left to right.
 */
export const BoardRow: React.FC<{
  cells: string[];
  widths: number[];
  delay?: number;
  size?: number;
  hero?: boolean;
}> = ({ cells, widths, delay = 0, size = 34, hero = false }) => {
  const frame = useCurrentFrame();
  const NOISE = "ABCDEFGHKMNOPRSTUXZ0123456789";
  let n = 0;
  return (
    <div
      style={{
        display: "flex",
        gap: 18,
        fontFamily: theme.fonts.mono,
        fontSize: size,
        fontWeight: 800,
        letterSpacing: "0.08em",
        color: hero ? dePalette.primary : dePalette.text,
      }}
    >
      {cells.map((cell, ci) => (
        <div key={ci} style={{ width: widths[ci], display: "flex", gap: 3 }}>
          {cell.split("").map((ch, i) => {
            const k = n++;
            const settle = delay + k * 1.2;
            const shown =
              frame < delay
                ? " "
                : frame >= settle || ch === " "
                  ? ch
                  : NOISE[Math.floor(rnd(k * 31 + frame) * NOISE.length)];
            return (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  width: size * 0.66,
                  textAlign: "center",
                  background: deColors.surfaceStrong,
                  borderTop: `1px solid ${deColors.line}`,
                  opacity: frame < delay ? 0 : 1,
                }}
              >
                {shown}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

/** The 2009 debt line: climbs in red across `width`, then snaps at `snapAt`. */
export const DebtLine: React.FC<{
  width: number;
  height: number;
  delay?: number;
  frames?: number;
  snapAt?: number;
}> = ({ width, height, delay = 0, frames = 70, snapAt = 1e9 }) => {
  const frame = useCurrentFrame();
  const p = ramp(frame, delay, delay + frames, theme.ease.inOut);
  const n = 22;
  const pts = Array.from({ length: n }, (_, i) => {
    const u = i / (n - 1);
    const y = height - Math.pow(u, 1.8) * height * 0.92 - (rnd(i * 7) - 0.5) * 26;
    return { x: u * width, y };
  });
  const shown = Math.max(2, Math.ceil(p * n));
  const snapped = frame >= snapAt;
  const drop = snapped ? ramp(frame, snapAt, snapAt + 16, theme.ease.in) : 0;
  const head = pts[shown - 1];
  const path = pts
    .slice(0, shown)
    .map((pt, i) => {
      const fall = snapped && i >= shown - 3 ? drop * (i - shown + 4) * 90 : 0;
      return `${i === 0 ? "M" : "L"}${pt.x.toFixed(1)} ${(pt.y + fall).toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg width={width} height={height + 300} style={{ overflow: "visible", display: "block" }}>
      <path
        d={path}
        fill="none"
        stroke={deColors.bad}
        strokeWidth={8}
        strokeLinejoin="miter"
        style={{ filter: `drop-shadow(0 0 14px ${deColors.badGlow})` }}
      />
      {!snapped && <rect x={head.x - 10} y={head.y - 10} width={20} height={20} fill={deColors.bad} />}
    </svg>
  );
};

/** Coin token in the series finish, "$" by default — the oil dollar. */
export const Coin: React.FC<{ size?: number; tone?: "hero" | "paper" | "bad"; style?: React.CSSProperties }> = ({
  size = 70,
  tone = "hero",
  style,
}) => {
  const c = tone === "hero" ? dePalette.primary : tone === "bad" ? deColors.bad : deColors.paper;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: `radial-gradient(circle at 35% 30%, ${c}, ${c}AA)`,
        border: `${Math.round(size * 0.06)}px solid ${dePalette.bg}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: theme.fonts.mono,
        fontWeight: 900,
        fontSize: size * 0.56,
        color: deColors.ink2,
        ...style,
      }}
    >
      $
    </div>
  );
};

/** Big number in the wide face (mono behind it for $ ≈ %). */
export const BigNum: React.FC<{
  children: React.ReactNode;
  size?: number;
  color?: string;
  delay?: number;
  glow?: string;
  style?: React.CSSProperties;
}> = ({ children, size = 300, color = dePalette.text, delay = 0, glow, style }) => {
  const p = useIn(delay, "bouncy");
  return (
    <div
      style={{
        fontFamily: `${theme.fonts.wide}, ${theme.fonts.mono}`,
        fontWeight: 900,
        fontSize: size,
        lineHeight: 0.9,
        letterSpacing: "-0.04em",
        color,
        whiteSpace: "nowrap",
        opacity: Math.min(1, p * 1.5),
        transform: `scale(${interpolate(p, [0, 1], [1.8, 1])}) translateY(${interpolate(p, [0, 1], [30, 0])}px)`,
        filter: glow ? `drop-shadow(0 0 ${size * 0.18}px ${glow})` : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
