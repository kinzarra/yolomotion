// The look kit: the handful of primitives every beat is built from — a
// headline with one accent word, an eyebrow, a big number, an evidence frame
// for a photo or a clip, a CTA and the cut effect. Each reads the active look
// and prints in its medium, so a scene is written once and renders in any
// look the job asks for.
//
// Hooks rule: every primitive reads the frame once and drives its items with
// plain eased interpolate/spring calls — no hooks inside a .map().
import React from "react";
import {
  AbsoluteFill,
  Img,
  OffthreadVideo,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { theme } from "../theme";
import { useLook } from "./context";
import { Look } from "./presets";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = (f: number, from: number, to: number, out: [number, number] = [0, 1]) =>
  interpolate(f, [from, to], out, { ...clamp, easing: theme.ease.out });

/** A bare name resolves inside public/, an http(s) URL is used as-is. */
export const mediaSrc = (src: string) => (/^https?:\/\//.test(src) ? src : staticFile(src));

const springFor = (look: Look) =>
  look.entrance === "slam" || look.entrance === "stamp" ? theme.spring.bouncy : look.entrance === "mask" ? theme.spring.snappy : theme.spring.smooth;

// One word's entrance in the look's manner. `p` is its spring, 0→1.
const enter = (look: Look, p: number): React.CSSProperties => {
  const o = Math.min(1, p * 1.6);
  switch (look.entrance) {
    case "stamp":
      return { opacity: o, transform: `scale(${interpolate(p, [0, 1], [1.4, 1])}) rotate(${interpolate(p, [0, 1], [-6, 0])}deg)` };
    case "blur":
      return { opacity: o, filter: `blur(${(1 - Math.min(p, 1)) * 18}px)`, transform: `translateY(${(1 - p) * 34}px) scale(${interpolate(p, [0, 1], [1.12, 1])})` };
    case "mask":
      return { transform: `translateY(${(1 - p) * 105}%)` };
    case "float":
      return { opacity: o, filter: `blur(${(1 - Math.min(p, 1)) * 12}px)`, transform: `translateY(${(1 - p) * 56}px)` };
    case "slam":
      return { opacity: o, transform: `scale(${interpolate(p, [0, 1], [2.1, 1])})` };
    case "rise":
      return { opacity: o, transform: `translateY(${(1 - p) * 44}px)`, letterSpacing: `${(1 - p) * 0.08}em` };
  }
};

// ── Accent word ─────────────────────────────────────────────────────────────

const AccentWord: React.FC<{ text: string; p: number; frame: number }> = ({ text, p, frame }) => {
  const look = useLook();
  const { palette, c, type } = look;
  const base: React.CSSProperties = {
    fontFamily: type.accentFamily,
    fontStyle: type.accentStyle,
    fontWeight: type.accentWeight,
    display: "inline-block",
    position: "relative",
  };
  switch (look.accent) {
    case "overprint": {
      // Two drums out of register: the blue pass lands off the pink one and
      // drifts back toward (never quite onto) it.
      const off = 5 + (1 - Math.min(p, 1)) * 18;
      return (
        <span style={base}>
          <span style={{ position: "absolute", left: off, top: off * 0.6, color: c.second, mixBlendMode: "multiply" }}>{text}</span>
          <span style={{ position: "relative", color: palette.primary, mixBlendMode: "multiply" }}>{text}</span>
        </span>
      );
    }
    case "chrome":
      return (
        <span style={{ ...base, color: palette.primary, textShadow: `0 0 34px ${palette.glow}, 0 0 4px ${palette.primary}` }}>
          {text}
        </span>
      );
    case "signal":
      return <span style={{ ...base, color: palette.primary }}>{text}</span>;
    case "gradient":
      return (
        <span
          style={{
            ...base,
            backgroundImage: `linear-gradient(100deg, ${c.stops.join(", ")})`,
            backgroundSize: "200% 100%",
            backgroundPosition: `${50 + Math.sin(frame / 30) * 50}% 0`,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            paddingRight: "0.04em",
          }}
        >
          {text}
        </span>
      );
    case "boxed": {
      const k = Math.min(1, p);
      return (
        <span style={{ ...base, color: c.onHero, padding: "0 0.14em", transform: "rotate(-2deg)" }}>
          <span
            style={{
              position: "absolute",
              inset: "0.04em 0 0.02em",
              background: palette.primary,
              transform: `scaleX(${k})`,
              transformOrigin: "left center",
              zIndex: -1,
            }}
          />
          {text}
        </span>
      );
    }
    case "serif":
      return <span style={{ ...base, color: palette.primary, letterSpacing: "-0.01em", paddingRight: "0.06em" }}>{text}</span>;
  }
};

// The headline's non-accent words. Chrome is the one look whose whole
// headline is the material, not just the accent.
const plainStyle = (look: Look, frame: number): React.CSSProperties =>
  look.accent === "chrome"
    ? {
        backgroundImage: `linear-gradient(178deg, ${look.c.stops.join(", ")})`,
        backgroundSize: "100% 220%",
        backgroundPosition: `0 ${50 + Math.sin(frame / 26) * 40}%`,
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
      }
    : { color: look.palette.text };

// ── Headline ────────────────────────────────────────────────────────────────

/**
 * `text` is lines separated by "\n"; a word wrapped in *stars* is the accent.
 * Words enter staggered in the look's manner, then the block breathes.
 */
export const Headline: React.FC<{
  text: string;
  size: number;
  delay?: number;
  per?: number; // frames between words
  align?: "left" | "center";
  column?: number; // px the longest word must fit in
  style?: React.CSSProperties;
}> = ({ text, size: wanted, delay = 0, per = 4, align, column = 940, style }) => {
  const look = useLook();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const side = align ?? (look.id === "swiss" ? "left" : "center");
  const longest = Math.max(...text.replace(/\*/g, "").split(/\s+/).map((w) => w.length));
  const size = Math.min(wanted, Math.floor(column / (longest * look.type.em)));
  let i = 0;
  const lines = text.split("\n").map((line) =>
    line.split(" ").filter(Boolean).map((raw) => {
      const accent = /^\*.*\*[.,!?:]?$/.test(raw);
      const word = accent ? raw.replace(/\*/g, "") : raw;
      return { word, accent, idx: i++ };
    }),
  );
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: side === "left" ? "flex-start" : "center",
        textAlign: side,
        fontFamily: look.type.display,
        fontWeight: look.type.weight,
        fontSize: size,
        lineHeight: look.type.leading,
        letterSpacing: look.type.tracking,
        textTransform: look.type.upper ? "uppercase" : "none",
        transform: `translateY(${Math.sin(frame / 32) * 3}px)`,
        ...style,
      }}
    >
      {lines.map((words, li) => (
        <div key={li} style={{ display: "flex", flexWrap: "wrap", justifyContent: side === "left" ? "flex-start" : "center", columnGap: size * 0.24 }}>
          {words.map(({ word, accent, idx }) => {
            const p = spring({ frame: frame - delay - idx * per, fps, config: springFor(look) });
            const inner = accent ? (
              <AccentWord text={word} p={p} frame={frame} />
            ) : (
              <span style={plainStyle(look, frame)}>{word}</span>
            );
            return look.entrance === "mask" ? (
              <span key={idx} style={{ display: "inline-block", overflow: "hidden", paddingBottom: "0.08em", marginBottom: "-0.08em" }}>
                <span style={{ display: "inline-block", ...enter(look, p) }}>{inner}</span>
              </span>
            ) : (
              <span key={idx} style={{ display: "inline-block", ...enter(look, p) }}>
                {inner}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

// ── Eyebrow ─────────────────────────────────────────────────────────────────

export const Eyebrow: React.FC<{ text: string; delay?: number; style?: React.CSSProperties }> = ({ text, delay = 0, style }) => {
  const look = useLook();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: theme.spring.snappy });
  const { palette, c, type } = look;
  const font: React.CSSProperties = {
    fontFamily: type.label,
    fontWeight: type.labelWeight,
    fontSize: 30,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    whiteSpace: "nowrap",
  };
  const skin: Record<Look["frame"], React.CSSProperties> = {
    print: { color: c.second, border: `3px solid ${c.second}`, borderRadius: 999, padding: "8px 26px" },
    screen: { color: palette.primary, letterSpacing: "0.22em", padding: "8px 0", textShadow: `0 0 18px ${palette.glow}` },
    plate: { color: c.ink, padding: "8px 0", letterSpacing: "0.02em", textTransform: "none", fontSize: 32 },
    glass: { color: palette.text, background: c.surface, border: `1.5px solid ${c.line}`, borderRadius: 999, padding: "10px 28px", backdropFilter: "blur(14px)" },
    clipping: { color: palette.text, background: c.second, padding: "6px 20px", transform: "skewX(-8deg)", fontSize: 34 },
    gallery: { color: c.second, letterSpacing: "0.38em", padding: "8px 0", fontSize: 24 },
  };
  const label = look.frame === "screen" ? `[ ${text} ]` : text;
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 18,
        opacity: p,
        transform: `translateY(${(1 - p) * 20}px) scale(${interpolate(p, [0, 1], [0.9, 1])})`,
        ...style,
      }}
    >
      {look.frame === "plate" && <div style={{ width: 56 * p, height: 4, background: palette.primary }} />}
      {look.frame === "gallery" && <div style={{ width: 70 * p, height: 1, background: c.second }} />}
      <div style={{ ...font, ...skin[look.frame] }}>{label}</div>
      {look.frame === "gallery" && <div style={{ width: 70 * p, height: 1, background: c.second }} />}
    </div>
  );
};

// ── Big number ──────────────────────────────────────────────────────────────

export const BigNumber: React.FC<{
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  label: string;
  size?: number;
  delay?: number;
}> = ({ value, decimals = 0, prefix = "", suffix = "", label, size = 300, delay = 0 }) => {
  const look = useLook();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const count = ease(frame, delay, delay + Math.round(fps * 1.1)) * value;
  const p = spring({ frame: frame - delay, fps, config: springFor(look) });
  const lp = spring({ frame: frame - delay - 10, fps, config: theme.spring.smooth });
  const num = `${prefix}${count.toFixed(decimals).replace(".", ",")}${suffix}`;
  const left = look.id === "swiss";
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: left ? "flex-start" : "center", gap: 26 + size * 0.08 }}>
      {left && <div style={{ width: 936 * ease(frame, delay, delay + 20), height: 10, background: look.c.ink }} />}
      <div
        style={{
          fontFamily: look.type.accentFamily,
          fontStyle: look.type.accentStyle,
          fontWeight: look.type.accentWeight,
          fontSize: size,
          lineHeight: 1,
          letterSpacing: "-0.04em",
          fontVariantNumeric: "tabular-nums",
          whiteSpace: "nowrap",
          ...enter(look, p),
        }}
      >
        <AccentWord text={num} p={p} frame={frame} />
      </div>
      <div
        style={{
          fontFamily: look.type.label,
          fontWeight: look.type.labelWeight,
          fontSize: 44,
          lineHeight: 1.15,
          maxWidth: 860,
          textAlign: left ? "left" : "center",
          color: look.palette.text,
          opacity: lp,
          transform: `translateY(${(1 - lp) * 24}px)`,
          textTransform: look.type.upper ? "uppercase" : "none",
        }}
      >
        {label}
      </div>
    </div>
  );
};

// ── Evidence: a photo or a clip in the look's container ─────────────────────

export const Evidence: React.FC<{
  src: string;
  kind: "photo" | "clip";
  width: number;
  height: number;
  tag?: string; // short label on the frame
  figure?: number; // the swiss plate's figure number
  caption?: string; // line under it
  delay?: number;
  startFrom?: number; // clip in-point, seconds
}> = ({ src, kind, width, height, tag, caption, figure = 1, delay = 0, startFrom = 0 }) => {
  const look = useLook();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { palette, c, type } = look;
  const p = spring({ frame: frame - delay, fps, config: springFor(look) });
  // Ken Burns on every still and every clip, so nothing sits dead.
  const kb = ease(frame, delay, delay + fps * 5, [1.06, 1.16]);
  const pan = ease(frame, delay, delay + fps * 5, [-12, 12]);
  const tilt: Partial<Record<Look["frame"], number>> = { print: -2.2, clipping: 1.6 };

  const media = (
    <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", borderRadius: look.frame === "glass" ? 34 : look.frame === "screen" ? 18 : 0, background: palette.bgAlt }}>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${kb}) translateX(${pan}px)`, filter: look.media }}>
        {kind === "clip" ? (
          <OffthreadVideo src={mediaSrc(src)} muted startFrom={Math.round(startFrom * fps)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <Img src={mediaSrc(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        )}
      </div>
      {look.tint.opacity > 0 && (
        <AbsoluteFill style={{ background: look.tint.color, mixBlendMode: look.tint.blend, opacity: look.tint.opacity }} />
      )}
      {(look.frame === "print" || look.frame === "clipping") && (
        <AbsoluteFill
          style={{
            backgroundImage: `radial-gradient(circle, ${look.frame === "print" ? palette.primary : c.ink} 1.4px, transparent 2px)`,
            backgroundSize: "9px 9px",
            mixBlendMode: "multiply",
            opacity: 0.35,
          }}
        />
      )}
      {look.frame === "screen" && (
        <AbsoluteFill style={{ backgroundImage: `repeating-linear-gradient(0deg, ${palette.bg} 0 2px, transparent 2px 4px)`, opacity: 0.35 }} />
      )}
      {look.frame === "gallery" && <div style={{ position: "absolute", inset: 18, border: `1px solid ${c.lineStrong}` }} />}
    </div>
  );

  const label = (extra: React.CSSProperties) =>
    tag ? (
      <div style={{ position: "absolute", fontFamily: type.label, fontWeight: type.labelWeight, fontSize: 28, textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap", ...extra }}>
        {tag}
      </div>
    ) : null;

  const shell: Record<Look["frame"], React.CSSProperties> = {
    print: { background: c.surface, padding: 22, boxShadow: c.shadow },
    screen: { padding: 10, borderRadius: 26, border: `2px solid ${c.lineStrong}`, background: c.surface, boxShadow: `${c.shadow}, 0 0 0 1px ${c.line}, 0 0 80px -10px ${palette.glow}` },
    plate: {},
    glass: { padding: 14, borderRadius: 48, background: c.surface, border: `1.5px solid ${c.line}`, backdropFilter: "blur(20px)", boxShadow: c.shadow },
    clipping: { background: c.surface, padding: 18, boxShadow: c.shadow },
    gallery: { boxShadow: c.shadow },
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: look.frame === "plate" ? "flex-start" : "center", gap: 22 }}>
      {look.frame === "plate" && (
        <div style={{ width, display: "flex", justifyContent: "space-between", fontFamily: type.label, fontWeight: 500, fontSize: 28, color: c.ink, opacity: p }}>
          <span>Рис. {String(figure).padStart(2, "0")}</span>
          <span>{tag}</span>
        </div>
      )}
      <div
        style={{
          position: "relative",
          width,
          height,
          ...shell[look.frame],
          boxSizing: "content-box",
          ...enter(look, p),
          transform: `${enter(look, p).transform ?? ""} rotate(${tilt[look.frame] ?? 0}deg)`,
        }}
      >
        {media}
        {look.frame === "print" && (
          <div style={{ position: "absolute", top: -26, left: width / 2 - 90, width: 180, height: 52, background: palette.bgAlt, opacity: 0.88, transform: "rotate(-4deg)", boxShadow: c.shadow }} />
        )}
        {look.frame === "print" && label({ left: 46, bottom: 44, color: c.surface, background: c.second, padding: "6px 16px" })}
        {look.frame === "screen" && label({ left: 34, top: 30, color: palette.primary, textShadow: `0 0 14px ${palette.glow}` })}
        {look.frame === "glass" && label({ left: 40, top: 38, color: palette.text, background: c.scrim, padding: "8px 20px", borderRadius: 999, backdropFilter: "blur(10px)", textTransform: "none", letterSpacing: "0" })}
        {look.frame === "clipping" &&
          tag &&
          label({
            right: -24,
            top: -30,
            color: c.second,
            border: `6px solid ${c.second}`,
            padding: "4px 18px",
            fontSize: 44,
            transform: `rotate(-9deg) scale(${interpolate(spring({ frame: frame - delay - 14, fps, config: theme.spring.bouncy }), [0, 1], [2.2, 1])})`,
            opacity: ease(frame, delay + 14, delay + 17),
          })}
      </div>
      {look.frame === "plate" && <div style={{ width, height: 4, background: c.ink, transform: `scaleX(${ease(frame, delay + 6, delay + 26)})`, transformOrigin: "left" }} />}
      {caption && (
        <div
          style={{
            width,
            fontFamily: look.frame === "gallery" ? type.accentFamily : type.label,
            fontStyle: look.frame === "gallery" ? "italic" : "normal",
            fontWeight: look.frame === "gallery" ? 500 : type.labelWeight,
            fontSize: look.frame === "gallery" ? 40 : 32,
            color: look.frame === "gallery" ? c.second : look.frame === "plate" ? c.ink : palette.text,
            textAlign: look.frame === "plate" ? "left" : "center",
            opacity: ease(frame, delay + 12, delay + 24),
            transform: `translateY(${ease(frame, delay + 12, delay + 24, [16, 0])}px)`,
          }}
        >
          {caption}
        </div>
      )}
    </div>
  );
};

// ── CTA ─────────────────────────────────────────────────────────────────────

export const Cta: React.FC<{ text: string; handle?: string; delay?: number }> = ({ text, handle, delay = 0 }) => {
  const look = useLook();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { palette, c, type } = look;
  const p = spring({ frame: frame - delay, fps, config: theme.spring.bouncy });
  const pulse = 1 + Math.max(0, Math.sin((frame - delay) / 9)) * 0.03 * Math.min(1, p);
  const skin: Record<Look["frame"], React.CSSProperties> = {
    print: { background: palette.primary, color: c.onHero, borderRadius: 999, boxShadow: `8px 8px 0 ${c.second}` },
    screen: { background: palette.primary, color: c.onHero, borderRadius: 16, boxShadow: `0 0 60px ${palette.glow}` },
    plate: { background: palette.primary, color: c.onHero, borderRadius: 0 },
    glass: { background: palette.text, color: c.onHero, borderRadius: 999, boxShadow: `0 20px 60px -10px ${palette.glow}` },
    clipping: { background: palette.primary, color: c.onHero, transform: "rotate(-2deg)", boxShadow: `10px 10px 0 ${c.second}` },
    gallery: { background: "transparent", color: palette.text, border: `1.5px solid ${palette.text}`, borderRadius: 999 },
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: look.id === "swiss" ? "flex-start" : "center", gap: 26 }}>
      <div
        style={{
          fontFamily: type.display,
          fontWeight: type.weight,
          fontSize: 58,
          letterSpacing: look.id === "swiss" ? "-0.03em" : "0",
          textTransform: type.upper ? "uppercase" : "none",
          padding: "26px 60px",
          whiteSpace: "nowrap",
          opacity: Math.min(1, p * 1.5),
          transform: `scale(${interpolate(p, [0, 1], [0.6, 1]) * pulse})`,
          ...skin[look.frame],
        }}
      >
        {text}
        {look.id === "swiss" ? "  →" : ""}
      </div>
      {handle && (
        <div style={{ fontFamily: type.label, fontWeight: type.labelWeight, fontSize: 34, color: look.palette.textDim, opacity: ease(frame, delay + 10, delay + 22), letterSpacing: "0.04em" }}>
          {handle}
        </div>
      )}
    </div>
  );
};

// ── The cut ─────────────────────────────────────────────────────────────────

/**
 * The look's effect on every cut. `cuts` are boundary frames (absolute, in
 * the composition); each effect is centred on its boundary and lives ±`half`
 * frames, so a retimed beat moves its cut with it. Rendered above the scenes
 * and below the captions.
 */
export const Cuts: React.FC<{ cuts: number[]; half?: number }> = ({ cuts, half = 6 }) => {
  const look = useLook();
  const frame = useCurrentFrame();
  const { palette, c } = look;
  const near = cuts.find((b) => Math.abs(frame - b) <= half);
  if (near === undefined) return null;
  const k = (frame - near) / half; // -1 … 1, 0 on the boundary frame
  const peak = 1 - Math.abs(k);
  switch (look.cut) {
    case "inkbars":
      return (
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          {Array.from({ length: 6 }, (_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: `${i * (100 / 6)}%`,
                height: `${100 / 6 + 0.5}%`,
                background: i % 2 ? c.second : palette.primary,
                mixBlendMode: "multiply",
                transform: `translateX(${(k + (i % 2 ? 0.08 : -0.08)) * -110}%)`,
              }}
            />
          ))}
        </AbsoluteFill>
      );
    case "flash":
      return (
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <AbsoluteFill style={{ background: c.flash, opacity: peak ** 2.4 }} />
          {[0.3, 0.52, 0.71].map((y, i) => (
            <div key={i} style={{ position: "absolute", left: 0, right: 0, top: `${y * 100}%`, height: 3 + i * 2, background: i === 1 ? palette.primary : c.second, opacity: peak, transform: `translateX(${k * (i % 2 ? 60 : -60)}%)` }} />
          ))}
        </AbsoluteFill>
      );
    case "panel":
      return (
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <AbsoluteFill style={{ background: palette.primary, transform: `translateY(${k <= 0 ? (-k) * 100 : -k * 100}%)` }} />
        </AbsoluteFill>
      );
    case "bloom":
      return (
        <AbsoluteFill
          style={{
            pointerEvents: "none",
            background: `radial-gradient(ellipse 70% 50% at ${30 + (k + 1) * 20}% 40%, ${c.flash}, ${palette.primary}88 40%, transparent 75%)`,
            opacity: peak ** 1.5,
            mixBlendMode: "screen",
          }}
        />
      );
    case "slam":
      return (
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <AbsoluteFill style={{ background: c.flash, opacity: frame === near || frame === near + 1 ? 0.9 : 0 }} />
          <div
            style={{
              position: "absolute",
              left: "-20%",
              width: "140%",
              top: "38%",
              height: "24%",
              background: palette.primary,
              transform: `rotate(-12deg) translateX(${k * 120}%)`,
            }}
          />
        </AbsoluteFill>
      );
    case "dip":
      return (
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <AbsoluteFill style={{ background: c.flash, opacity: peak ** 1.2 }} />
          <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: `${peak * 50}%`, background: c.flash }} />
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${peak * 50}%`, background: c.flash }} />
        </AbsoluteFill>
      );
  }
};

/** A scene's punch-in on its first frames, the half of the cut that moves the picture. */
export const useCutZoom = (life = 9) => {
  const look = useLook();
  const frame = useCurrentFrame();
  const amount = look.cut === "slam" ? 0.14 : look.cut === "flash" ? 0.08 : look.cut === "dip" ? 0.03 : 0.05;
  return 1 + ease(frame, 0, life, [amount, 0]);
};
