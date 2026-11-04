// Episode kit for «Сколько стоит заменить тебя» (ВЫПУСК 08) — the first
// 16:9 film of the series. The look — paper that prints, digital that snaps —
// is re-exported untouched from the previous episodes; this file adds what a
// landscape, evidence-dense film needs:
//
//   LAYOUT    BrandBarWide (series left, episode right at y=52), Source (the
//             tiny line naming where a figure comes from), NumTitle («№1
//             КАССИР», the chapter mark every profession opens on).
//   FOOTAGE   Photo / Clip (cover-crop, push to a focus point, greyscale),
//             Screen (a clip plays inside a monitor bezel — the "screen"
//             container), PrintedPhoto (paper container), Logo (a brand mark
//             on a paper plate, graded to ink).
//   MONEY     VersusReceipt (ЧЕЛОВЕК on paper vs МАШИНА in lime — the episode's
//             running device), Ring (a % that fills), Odometer (a figure that
//             rolls from one value to another), DotField (N people as dots
//             that switch off).
//   FACE      Face: the HeyGen insert full-bleed, or — until it is bought — a
//             placeholder card that says exactly which seconds it will cover.
//
// Footage cuts hard: no opacity fade on a photo or a clip. Every entrance
// moves 2–3 properties on a spring; every ramp is eased and clamped.
import React from "react";
import {
  Img,
  OffthreadVideo,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { theme } from "../../theme";
import { useIn } from "../../reel";
import { rcColors, rcPalette } from "./palette";
import { ramp, PHOTO_GRADE, rnd, WIDE } from "../dubai-economy/ui";

export * from "../dubai-economy/ui";

const DIR = "footage/replace-cost";
export const media = (file: string) => staticFile(`${DIR}/${file}`);

/** Frame size — a landscape film. Scenes lay out against these. */
export const W = 1920;
export const H = 1080;
/** Captions sit at y≈905; nothing critical goes below this line. */
export const SAFE_BOTTOM = 870;

/* ------------------------------------------------------------- layout */

/** Series tag top-left, episode top-right, a hairline between. */
export const BrandBarWide: React.FC<{ series: string; episode: string; delay?: number }> = ({
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
        left: 96,
        right: 96,
        top: 52,
        display: "flex",
        alignItems: "center",
        gap: 20,
        fontFamily: theme.fonts.mono,
        fontSize: 22,
        fontWeight: 700,
        letterSpacing: "0.16em",
        color: rcPalette.textDim,
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [-16, 0])}px)`,
        zIndex: 5,
      }}
    >
      <span style={{ width: 12, height: 12, background: rcPalette.primary, opacity: blink }} />
      <span style={{ color: rcPalette.text }}>{series}</span>
      <span style={{ flex: 1, height: 1, background: rcColors.line }} />
      <span style={{ color: rcPalette.text }}>{episode}</span>
    </div>
  );
};

/** Where a figure comes from — tiny mono, bottom-left of its panel. */
export const Source: React.FC<{ children: React.ReactNode; delay?: number; style?: React.CSSProperties }> = ({
  children,
  delay = 0,
  style,
}) => {
  const p = useIn(delay, "smooth");
  return (
    <div
      style={{
        fontFamily: theme.fonts.mono,
        fontSize: 17,
        fontWeight: 700,
        letterSpacing: "0.12em",
        color: rcPalette.textDim,
        opacity: p * 0.9,
        transform: `translateY(${interpolate(p, [0, 1], [8, 0])}px)`,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      ИСТОЧНИК · {children}
    </div>
  );
};

/** The chapter mark each profession opens on: «№1» in lime, the name in bone. */
export const NumTitle: React.FC<{ n: number; name: string; delay?: number; size?: number }> = ({
  n,
  name,
  delay = 0,
  size = 86,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: theme.spring.snappy });
  const q = spring({ frame: frame - delay - 5, fps, config: theme.spring.smooth });
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 26 }}>
      <span
        style={{
          fontFamily: WIDE,
          fontWeight: 900,
          fontSize: size,
          color: rcPalette.primary,
          letterSpacing: "-0.03em",
          opacity: p,
          transform: `scale(${interpolate(p, [0, 1], [1.6, 1])}) skewX(${interpolate(p, [0, 1], [-12, 0])}deg)`,
          display: "inline-block",
        }}
      >
        №{n}
      </span>
      <span style={{ overflow: "hidden", display: "inline-block", padding: "0.06em 0 0.12em" }}>
        <span
          style={{
            display: "inline-block",
            fontFamily: WIDE,
            fontWeight: 800,
            fontSize: size * 0.72,
            color: rcPalette.text,
            letterSpacing: "-0.02em",
            transform: `translateY(${interpolate(q, [0, 1], [120, 0])}%)`,
          }}
        >
          {name}
        </span>
      </span>
    </div>
  );
};

/* ------------------------------------------------------------ footage */

/**
 * A still, cover-cropped into its box, pushed from `zoom[0]` to `zoom[1]`
 * across `len` frames, the push ending on `focus` (0..1 of the source).
 */
export const Photo: React.FC<{
  file: string;
  len: number;
  focus?: [number, number];
  zoom?: [number, number];
  drift?: number;
  filter?: string;
  fit?: "cover" | "contain";
  style?: React.CSSProperties;
}> = ({ file, len, focus = [0.5, 0.5], zoom = [1.04, 1.16], drift = 0, filter = PHOTO_GRADE, fit = "cover", style }) => {
  const frame = useCurrentFrame();
  const t = ramp(frame, 0, len, theme.ease.inOut);
  const settle = useIn(0, "smooth");
  const scale = interpolate(t, [0, 1], zoom) * interpolate(settle, [0, 1], [1.06, 1]);
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", ...style }}>
      <Img
        src={media(file)}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: fit,
          objectPosition: `${focus[0] * 100}% ${focus[1] * 100}%`,
          transformOrigin: `${focus[0] * 100}% ${focus[1] * 100}%`,
          transform: `translateX(${t * drift}px) scale(${scale})`,
          filter,
        }}
      />
    </div>
  );
};

/** A clip, cover-fitted into its box, graded, muted, with a slow push. */
export const Clip: React.FC<{
  file: string;
  len: number;
  zoom?: [number, number];
  focus?: [number, number];
  filter?: string;
  startFrom?: number;
  style?: React.CSSProperties;
}> = ({ file, len, zoom = [1.02, 1.12], focus = [0.5, 0.5], filter = PHOTO_GRADE, startFrom = 0, style }) => {
  const frame = useCurrentFrame();
  const t = ramp(frame, 0, len, theme.ease.inOut);
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", ...style }}>
      <OffthreadVideo
        src={media(file)}
        muted
        startFrom={startFrom}
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
 * The "screen" container: a dark bezel with a lime power dot, scanlines and
 * a pixel grid over whatever plays inside. Enters with a rise + scale.
 */
export const Screen: React.FC<{
  width: number;
  height: number;
  delay?: number;
  label?: string;
  tilt?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ width, height, delay = 0, label, tilt = 0, style, children }) => {
  const p = useIn(delay, "smooth");
  const frame = useCurrentFrame();
  const bez = 14;
  return (
    <div
      style={{
        position: "absolute",
        width,
        height: height + bez * 2 + 34,
        opacity: Math.min(1, p * 1.4),
        transform: `translateY(${interpolate(p, [0, 1], [60, Math.sin(frame / 40) * 3])}px) scale(${interpolate(p, [0, 1], [0.92, 1])}) rotate(${tilt}deg)`,
        filter: `drop-shadow(${rcColors.shadow})`,
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: rcColors.surfaceStrong,
          border: `2px solid ${rcColors.lineStrong}`,
          borderRadius: 18,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: bez,
          top: bez,
          width: width - bez * 2,
          height,
          overflow: "hidden",
          borderRadius: 8,
          background: rcPalette.bg,
        }}
      >
        {children}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "repeating-linear-gradient(180deg, rgba(0,0,0,0.18) 0px, rgba(0,0,0,0.18) 1px, transparent 1px, transparent 3px)",
            pointerEvents: "none",
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: bez + 6,
          right: bez + 6,
          bottom: 9,
          display: "flex",
          alignItems: "center",
          gap: 12,
          fontFamily: theme.fonts.mono,
          fontSize: 16,
          fontWeight: 700,
          letterSpacing: "0.16em",
          color: rcPalette.textDim,
        }}
      >
        <span style={{ width: 9, height: 9, borderRadius: 5, background: rcPalette.primary, opacity: Math.sin(frame / 7) > 0 ? 1 : 0.35 }} />
        <span>{label ?? "REC"}</span>
        <span style={{ flex: 1 }} />
        <span>{`00:${String(Math.floor(frame / 30) % 60).padStart(2, "0")}:${String(frame % 30).padStart(2, "0")}`}</span>
      </div>
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
  len: number;
  printFrom?: number;
  printFrames?: number;
  focus?: [number, number];
  zoom?: [number, number];
  caption?: React.ReactNode;
  tilt?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({
  file,
  width,
  height,
  len,
  printFrom = 0,
  printFrames = 26,
  focus,
  zoom = [1.0, 1.12],
  caption,
  tilt = -2,
  style,
  children,
}) => {
  const frame = useCurrentFrame();
  const p = ramp(frame, printFrom, printFrom + printFrames, theme.ease.inOut);
  const head = p > 0 && p < 1 ? Math.sin(p * Math.PI) : 0;
  const pad = 18;
  const capH = caption ? 54 : 0;
  const breathe = Math.sin(frame / 36) * 0.6;
  return (
    <div
      style={{
        position: "absolute",
        width,
        height: height + pad * 2 + capH,
        transform: `rotate(${tilt + breathe * 0.3}deg)`,
        filter: `drop-shadow(${rcColors.paperShadow})`,
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          clipPath: `inset(0 0 ${(1 - p) * 100}% 0)`,
          background: rcColors.paper,
          padding: pad,
        }}
      >
        <div style={{ position: "relative", width: width - pad * 2, height, overflow: "hidden" }}>
          <Photo file={file} len={len} focus={focus} zoom={zoom} filter="grayscale(1) contrast(1.25) brightness(1.02)" />
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "repeating-linear-gradient(180deg, rgba(21,23,26,0.13) 0px, rgba(21,23,26,0.13) 1px, transparent 1px, transparent 3px)",
            }}
          />
          <div style={{ position: "absolute", inset: 0, background: rcColors.paper, mixBlendMode: "multiply", opacity: 0.45 }} />
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
              fontSize: 20,
              fontWeight: 700,
              letterSpacing: "0.12em",
              color: rcColors.ink,
            }}
          >
            {caption}
          </div>
        )}
      </div>
      <div
        style={{
          position: "absolute",
          left: -14,
          right: -14,
          top: `${p * 100}%`,
          height: 6,
          marginTop: -3,
          background: rcPalette.primary,
          boxShadow: `0 0 24px ${rcPalette.glow}`,
          opacity: head,
        }}
      />
    </div>
  );
};

/**
 * A brand mark on a paper plate, graded to ink: the real logo, full vector
 * quality, but never a third colour in the frame. Snaps in like a sticker.
 */
export const Logo: React.FC<{
  file: string;
  height?: number;
  width?: number;
  delay?: number;
  tilt?: number;
  plate?: boolean;
  /** "ink" = greyscale on paper (default); "bone" = white mark on dark. */
  tone?: "ink" | "bone";
  style?: React.CSSProperties;
}> = ({ file, height = 70, width, delay = 0, tilt = -2, plate = true, tone = "ink", style }) => {
  const p = useIn(delay, "snappy");
  const frame = useCurrentFrame();
  const filter =
    tone === "bone" ? "grayscale(1) brightness(0) invert(0.95)" : "grayscale(1) contrast(1.15)";
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: plate ? `${Math.round(height * 0.3)}px ${Math.round(height * 0.42)}px` : 0,
        background: plate ? rcColors.paper : "transparent",
        opacity: Math.min(1, p * 1.5),
        transform: `rotate(${tilt + Math.sin((frame + delay) / 30) * 0.5}deg) scale(${interpolate(p, [0, 1], [1.5, 1])})`,
        filter: plate ? `drop-shadow(${rcColors.paperShadow})` : undefined,
        ...style,
      }}
    >
      <Img src={media(file)} style={{ height, width, objectFit: "contain", filter, display: "block" }} />
    </div>
  );
};

/* -------------------------------------------------------------- money */

/**
 * The episode's device: what a person costs, printed on thermal paper, next
 * to what the machine costs, snapped in as a lime digital tag. `cheaper`
 * slams a stamp across the pair once both are in.
 */
export const VersusReceipt: React.FC<{
  role: string;
  human: { label: string; value: string; unit: string };
  machine: { label: string; value: string; unit: string };
  delay?: number;
  machineAt: number;
  scale?: number;
}> = ({ role, human, machine, delay = 0, machineAt, scale = 1 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pr = ramp(frame, delay, delay + 24, theme.ease.inOut);
  const head = pr > 0 && pr < 1 ? Math.sin(pr * Math.PI) : 0;
  const m = spring({ frame: frame - machineAt, fps, config: theme.spring.snappy });
  return (
    <div style={{ display: "flex", alignItems: "stretch", gap: 28 * scale }}>
      {/* human: paper */}
      <div style={{ position: "relative", width: 430 * scale, filter: `drop-shadow(${rcColors.paperShadow})`, transform: "rotate(-1.5deg)" }}>
        <div style={{ clipPath: `inset(0 0 ${(1 - pr) * 100}% 0)` }}>
          <div
            style={{
              background: rcColors.paper,
              padding: `${26 * scale}px ${32 * scale}px ${34 * scale}px`,
              fontFamily: theme.fonts.mono,
              color: rcColors.ink,
              fontWeight: 700,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18 * scale, letterSpacing: "0.14em", color: rcColors.inkFaded }}>
              <span>ЧЕЛОВЕК</span>
              <span>{role}</span>
            </div>
            <div style={{ borderTop: `2px dashed ${rcColors.inkRule}`, margin: `${14 * scale}px 0` }} />
            <div style={{ fontSize: 20 * scale, letterSpacing: "0.08em" }}>{human.label}</div>
            <div style={{ fontFamily: WIDE, fontWeight: 900, fontSize: 64 * scale, letterSpacing: "-0.03em", margin: `${8 * scale}px 0 0` }}>
              {human.value}
            </div>
            <div style={{ fontSize: 20 * scale, letterSpacing: "0.1em", color: rcColors.inkFaded }}>{human.unit}</div>
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            left: -14,
            right: -14,
            top: `${pr * 100}%`,
            height: 6,
            background: rcPalette.primary,
            boxShadow: `0 0 24px ${rcPalette.glow}`,
            opacity: head,
          }}
        />
      </div>
      {/* machine: lime tag */}
      <div
        style={{
          width: 430 * scale,
          padding: `${26 * scale}px ${32 * scale}px ${34 * scale}px`,
          border: `3px solid ${rcPalette.primary}`,
          background: rcColors.surface,
          fontFamily: theme.fonts.mono,
          fontWeight: 700,
          color: rcPalette.primary,
          opacity: Math.min(1, m * 1.4),
          transform: `translateX(${interpolate(m, [0, 1], [60, 0])}px) scale(${interpolate(m, [0, 1], [1.12, 1])}) skewX(${interpolate(m, [0, 1], [-10, 0])}deg)`,
          boxShadow: `0 0 ${40 * m}px -6px ${rcPalette.glow}`,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18 * scale, letterSpacing: "0.14em" }}>
          <span>МАШИНА</span>
          <span style={{ color: rcPalette.textDim }}>ЗАМЕНА</span>
        </div>
        <div style={{ borderTop: `2px dashed ${rcColors.lineStrong}`, margin: `${14 * scale}px 0` }} />
        <div style={{ fontSize: 20 * scale, letterSpacing: "0.08em", color: rcPalette.text }}>{machine.label}</div>
        <div style={{ fontFamily: WIDE, fontWeight: 900, fontSize: 64 * scale, letterSpacing: "-0.03em", margin: `${8 * scale}px 0 0` }}>
          {machine.value}
        </div>
        <div style={{ fontSize: 20 * scale, letterSpacing: "0.1em", color: rcPalette.textDim }}>{machine.unit}</div>
      </div>
    </div>
  );
};

/** A % ring that fills on a smooth ease, the number counting with it. */
export const Ring: React.FC<{
  value: number;
  size?: number;
  delay?: number;
  label?: string;
  prefix?: string;
  tone?: "hero" | "bad" | "bone";
  dur?: number;
}> = ({ value, size = 300, delay = 0, label, prefix = "", tone = "hero", dur = 40 }) => {
  const frame = useCurrentFrame();
  const p = ramp(frame, delay, delay + dur, theme.ease.out);
  const e = useIn(delay, "smooth");
  const color = tone === "hero" ? rcPalette.primary : tone === "bad" ? rcColors.bad : rcPalette.text;
  const r = size / 2 - 14;
  const c = 2 * Math.PI * r;
  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        opacity: e,
        transform: `scale(${interpolate(e, [0, 1], [0.8, 1])}) rotate(${interpolate(e, [0, 1], [-20, 0])}deg)`,
      }}
    >
      <svg width={size} height={size} style={{ position: "absolute", inset: 0, transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={rcColors.line} strokeWidth={16} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={16}
          strokeDasharray={`${c * (value / 100) * p} ${c}`}
          style={{ filter: tone === "hero" ? `drop-shadow(0 0 10px ${rcPalette.glow})` : undefined }}
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
        }}
      >
        <div style={{ fontFamily: WIDE, fontWeight: 900, fontSize: size * 0.27, color, letterSpacing: "-0.04em", fontVariantNumeric: "tabular-nums" }}>
          {prefix}
          {Math.round(value * p)}%
        </div>
        {label && (
          <div style={{ fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: Math.max(15, size * 0.058), letterSpacing: "0.12em", color: rcPalette.textDim, marginTop: 6, textAlign: "center", maxWidth: size * 0.7 }}>
            {label}
          </div>
        )}
      </div>
    </div>
  );
};

const fmt = (v: number) => Math.round(v).toLocaleString("ru-RU").replace(/\s/g, " ");

/** A figure rolling from `from` to `to` on an ease, in the wide face. */
export const Odometer: React.FC<{
  from?: number;
  to: number;
  delay?: number;
  dur?: number;
  size?: number;
  color?: string;
  prefix?: string;
  suffix?: string;
  style?: React.CSSProperties;
}> = ({ from = 0, to, delay = 0, dur = 36, size = 140, color = rcPalette.text, prefix = "", suffix = "", style }) => {
  const frame = useCurrentFrame();
  const p = ramp(frame, delay, delay + dur, theme.ease.out);
  const e = useIn(delay, "snappy");
  return (
    <div
      style={{
        fontFamily: WIDE,
        fontWeight: 900,
        fontSize: size,
        lineHeight: 1,
        letterSpacing: "-0.035em",
        fontVariantNumeric: "tabular-nums",
        color,
        whiteSpace: "nowrap",
        opacity: Math.min(1, e * 1.5),
        transform: `translateY(${interpolate(e, [0, 1], [30, 0])}px) scale(${interpolate(e, [0, 1], [1.15, 1])})`,
        ...style,
      }}
    >
      {prefix}
      {fmt(interpolate(p, [0, 1], [from, to]))}
      {suffix}
    </div>
  );
};

/**
 * `count` people as dots in a grid. They light up in a ripple from `delay`;
 * from `offAt` they switch off (the work handed to a machine), and from
 * `backAt` a share of them comes back on.
 */
export const DotField: React.FC<{
  count: number;
  cols: number;
  dot?: number;
  gap?: number;
  delay?: number;
  offAt?: number;
  backAt?: number;
  backShare?: number;
}> = ({ count, cols, dot = 14, gap = 8, delay = 0, offAt, backAt, backShare = 0.35 }) => {
  const frame = useCurrentFrame();
  const rows = Math.ceil(count / cols);
  return (
    <div style={{ position: "relative", width: cols * (dot + gap), height: rows * (dot + gap) }}>
      {Array.from({ length: count }, (_, i) => {
        const x = i % cols;
        const y = Math.floor(i / cols);
        const order = (x + y * 1.7) / (cols + rows * 1.7);
        const seed = rnd(i * 3.1);
        const on = ramp(frame, delay + order * 24, delay + order * 24 + 8);
        const off = offAt === undefined ? 0 : ramp(frame, offAt + seed * 26, offAt + seed * 26 + 6);
        const back = backAt === undefined || seed > backShare ? 0 : ramp(frame, backAt + seed * 30, backAt + seed * 30 + 8);
        const lit = on * (1 - off) + back;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x * (dot + gap),
              top: y * (dot + gap),
              width: dot,
              height: dot,
              borderRadius: dot / 2,
              background: off > 0.5 && back < 0.5 ? rcColors.bad : rcPalette.text,
              opacity: 0.12 + Math.min(1, lit) * 0.88 * (off > 0.5 && back < 0.5 ? 0.35 : 1),
              transform: `scale(${0.4 + on * 0.6})`,
            }}
          />
        );
      })}
    </div>
  );
};

/* --------------------------------------------------------------- face */

/**
 * The presenter, full-bleed. Until the HeyGen insert is bought, a placeholder
 * card stands in: a studio-dark frame, a dashed silhouette, and a label that
 * says which line, which seconds and which engine — so the cut can be
 * approved before a cent is spent. With `face` on, `src` plays instead.
 */
export const Face: React.FC<{
  live: boolean;
  src?: string;
  says: string;
  seconds: number;
  id: string;
}> = ({ live, src, says, seconds, id }) => {
  const frame = useCurrentFrame();
  if (live && src) {
    return (
      <div style={{ position: "absolute", inset: 0 }}>
        <OffthreadVideo src={staticFile(src)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
    );
  }
  const pulse = 0.5 + Math.sin(frame / 10) * 0.5;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: `radial-gradient(ellipse at 50% 38%, ${rcColors.surfaceLift} 0%, ${rcPalette.bg} 70%)`,
        overflow: "hidden",
      }}
    >
      {/* silhouette */}
      <div style={{ position: "absolute", left: "50%", top: 150, transform: `translateX(-50%) translateY(${Math.sin(frame / 24) * 4}px)` }}>
        <div
          style={{
            width: 250,
            height: 300,
            margin: "0 auto",
            borderRadius: "48% 48% 44% 44%",
            border: `4px dashed ${rcColors.lineStrong}`,
          }}
        />
        <div
          style={{
            width: 700,
            height: 420,
            marginTop: 30,
            borderRadius: "340px 340px 0 0",
            border: `4px dashed ${rcColors.lineStrong}`,
            borderBottom: "none",
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: 96,
          top: 130,
          display: "flex",
          flexDirection: "column",
          gap: 10,
          fontFamily: theme.fonts.mono,
          fontWeight: 700,
          letterSpacing: "0.14em",
          color: rcPalette.textDim,
          fontSize: 20,
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 12, color: rcPalette.primary, fontSize: 24 }}>
          <span style={{ width: 14, height: 14, borderRadius: 7, background: rcPalette.primary, opacity: pulse }} />
          ЛИЦО · HEYGEN — ЗАГЛУШКА
        </span>
        <span>{id.toUpperCase()} · DIGITAL TWIN «PHILIPP» · AVATAR IV</span>
        <span>{seconds.toFixed(1)} С НА ЭКРАНЕ · НЕ СГЕНЕРИРОВАНО</span>
      </div>
      <div
        style={{
          position: "absolute",
          right: 96,
          top: 130,
          maxWidth: 560,
          textAlign: "right",
          fontFamily: theme.fonts.mono,
          fontWeight: 700,
          fontSize: 20,
          lineHeight: 1.5,
          letterSpacing: "0.06em",
          color: rcPalette.textDim,
        }}
      >
        «{says}»
      </div>
    </div>
  );
};

/** Dark wash for type over footage: left column + caption band at the bottom. */
export const ScrimWide: React.FC<{ left?: number; bottom?: number; top?: number }> = ({ left = 0.85, bottom = 0.9, top = 0.6 }) => {
  const a = (v: number) =>
    Math.round(v * 255)
      .toString(16)
      .padStart(2, "0");
  return (
    <>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(90deg, ${rcPalette.bg}${a(left)} 0%, ${rcPalette.bg}${a(left * 0.7)} 38%, ${rcPalette.bg}00 70%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(180deg, ${rcPalette.bg}${a(top)} 0%, ${rcPalette.bg}00 18%, ${rcPalette.bg}00 66%, ${rcPalette.bg}${a(bottom)} 86%, ${rcPalette.bg}${a(bottom)} 100%)`,
        }}
      />
    </>
  );
};

/* -------------------------------------------------------------- parts */

/**
 * One half of a two-line beat: mounts at `from` (frames from the beat's
 * start) for `len` frames, so every delay inside is relative to the part, and
 * leaves on a fast ease-in (8 frames) unless it is the beat's last part.
 */
export const Part: React.FC<{ from: number; len?: number; exit?: boolean; children: React.ReactNode }> = ({
  from,
  len,
  exit = true,
  children,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const end = len === undefined ? durationInFrames : from + len;
  if (frame < from || frame >= end) return null;
  const out = exit && len !== undefined ? ramp(frame, end - 8, end - 1, theme.ease.in) : 0;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: 1 - out,
        transform: `translateY(${out * -24}px) scale(${1 - out * 0.02})`,
      }}
    >
      <FrameShift by={from}>{children}</FrameShift>
    </div>
  );
};

/** Re-bases useCurrentFrame for children (a Sequence without its own layout). */
const FrameShift: React.FC<{ by: number; children: React.ReactNode }> = ({ by, children }) => (
  <Sequence from={by} layout="none">
    {children}
  </Sequence>
);

/** A clip never runs past this many frames — the cut files are 5 s long. */
export const CLIP_MAX = 145;

export type Shot = { file: string; len: number; focus?: [number, number]; zoom?: [number, number] };

/**
 * Shots played back to back in one box, hard cuts between them. A `.mp4`
 * plays as a clip (capped at CLIP_MAX — a longer slot is an authoring error
 * and is clamped), anything else as a pushed photo.
 */
export const Shots: React.FC<{ shots: Shot[] }> = ({ shots }) => {
  let at = 0;
  return (
    <>
      {shots.map((s, i) => {
        const isClip = s.file.endsWith(".mp4");
        const len = isClip ? Math.min(s.len, CLIP_MAX) : s.len;
        const from = at;
        at += len;
        if (len <= 0) return null;
        return (
          <Sequence key={`${s.file}-${i}`} from={from} durationInFrames={len} layout="none">
            <div style={{ position: "absolute", inset: 0 }}>
              {isClip ? (
                <Clip file={s.file} len={len} focus={s.focus} zoom={s.zoom} />
              ) : (
                <Photo file={s.file} len={len} focus={s.focus} zoom={s.zoom} />
              )}
            </div>
          </Sequence>
        );
      })}
    </>
  );
};
