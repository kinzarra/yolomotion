// «ИСТОРИИ КОМПАНИЙ» comic kit, on top of the TikTok kit of ВЫПУСК 21/22.
// One rule keeps it one style: every photo, clip and cut-out is printed in
// ink on the series paper (greyscale, high contrast, halftone dots); colour
// comes only from the palette: lime for the win, red for the flop.
import React from "react";
import { Img, OffthreadVideo, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../theme";
import { rnd } from "../digital-ruble/ui";
import { ncColors as colors, ncPalette as palette } from "./palette";
import { clamp, media } from "../serbia-economy/ui";

export * from "../serbia-economy/ui";

export const WIDE = `${theme.fonts.wide}, ${theme.fonts.mono}`;

/** The print: photo greyscale and punchy, multiplied onto paper. */
const INK = "grayscale(1) contrast(1.45) brightness(1.06)";
const dots = (size: number, color: string, r = 28) => ({
  backgroundImage: `radial-gradient(${color} ${r}%, transparent ${r + 4}%)`,
  backgroundSize: `${size}px ${size}px`,
});

/** Halftone dots over a printed photo. */
const Halftone: React.FC<{ size?: number; opacity?: number }> = ({ size = 7, opacity = 0.32 }) => (
  <div style={{ position: "absolute", inset: 0, ...dots(size, colors.ink), mixBlendMode: "multiply", opacity, pointerEvents: "none" }} />
);

/* ------------------------------------------------------------ background */

/** Dark page: a slow comic sunburst and lime halftone fading to the edges. */
export const ComicBg: React.FC<{ tone?: "hero" | "bad" }> = ({ tone = "hero" }) => {
  const frame = useCurrentFrame();
  const c = tone === "bad" ? colors.bad : palette.primary;
  return (
    <div style={{ position: "absolute", inset: 0, background: palette.bg, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: -900, top: -400, width: 2880, height: 2880, background: `repeating-conic-gradient(from ${frame * 0.15}deg at 50% 50%, rgba(242,245,238,0.035) 0deg 5deg, transparent 5deg 12deg)` }} />
      <div style={{ position: "absolute", inset: 0, ...dots(22, c, 18), opacity: 0.1, WebkitMaskImage: "radial-gradient(ellipse 70% 55% at 50% 45%, transparent 30%, black 100%)", transform: `translateY(${(frame * 0.4) % 22}px)` }} />
    </div>
  );
};

/** Full-frame clip, printed: greyscale, halftone, dark scrims for the type. */
export const ComicClip: React.FC<{ src: string; dim?: number; startFrom?: number }> = ({ src, dim = 0.55, startFrom = 0 }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const whip = interpolate(frame, [0, 10], [1.3, 1.05], { easing: theme.ease.out, ...clamp });
  const push = interpolate(frame, [0, durationInFrames], [0, 0.08], { easing: theme.ease.inOut, ...clamp });
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <OffthreadVideo src={media(src)} muted startFrom={Math.round(startFrom * fps)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${whip + push})`, filter: `${INK} brightness(${1 - dim})` }} />
      <div style={{ position: "absolute", inset: 0, ...dots(9, colors.ink2, 30), opacity: 0.5 }} />
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${palette.bg}F2 0%, ${palette.bg}55 24%, ${palette.bg}40 60%, ${palette.bg}F4 88%)` }} />
    </div>
  );
};

/* ----------------------------------------------------------------- panel */

type Side = "left" | "right" | "top" | "bottom";

/**
 * A comic panel: paper frame, ink border, hard shadow; a photo or a clip
 * printed inside with a Ken Burns push to `focus`. Slams in from a side.
 */
export const Panel: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  at: number;
  from?: Side;
  rot?: number;
  src?: string;
  clip?: string;
  focus?: [number, number];
  fit?: "cover" | "contain";
  out?: number;
  z?: number;
  frameColor?: string;
  bright?: number;
  children?: React.ReactNode;
}> = ({ x, y, w, h, at, from = "bottom", rot = 0, src, clip, focus = [50, 50], fit = "cover", out, z = 4, frameColor = colors.paper, bright = 1, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - at, fps, config: theme.spring.bouncy });
  const q = out === undefined ? 0 : interpolate(frame, [out, out + 7], [0, 1], { easing: theme.ease.in, ...clamp });
  if (frame < at || q >= 1) return null;
  const d = 220;
  const off = { left: [-d, 0], right: [d, 0], top: [0, -d], bottom: [0, d] }[from];
  const t = 1 - p;
  const kb = 1.05 + interpolate(frame - at, [0, 6 * fps], [0, 0.12], { easing: theme.ease.inOut, ...clamp });
  const media0 = src ? (
    <Img src={media(src)} style={{ width: "100%", height: "100%", objectFit: fit, objectPosition: `${focus[0]}% ${focus[1]}%`, filter: `${INK} brightness(${bright})`, mixBlendMode: "multiply", transform: `scale(${kb})`, transformOrigin: `${focus[0]}% ${focus[1]}%` }} />
  ) : clip ? (
    <OffthreadVideo src={media(clip)} muted style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: `${focus[0]}% ${focus[1]}%`, filter: INK, mixBlendMode: "multiply", transform: `scale(${kb})` }} />
  ) : null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        zIndex: z,
        opacity: Math.min(1, p * 1.6) * (1 - q),
        transform: `translate(${off[0] * t}px, ${off[1] * t + q * 160}px) rotate(${rot + t * 8 + Math.sin(frame / 40 + x) * 0.4}deg) scale(${interpolate(p, [0, 1], [0.8, 1]) * (1 - q * 0.2)})`,
        background: frameColor,
        padding: 10,
        boxShadow: `16px 18px 0 rgba(0,0,0,0.6)`,
      }}
    >
      <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", border: `6px solid ${colors.ink}`, background: colors.paper }}>
        {media0}
        {media0 && <Halftone />}
      </div>
      {children}
    </div>
  );
};

/* -------------------------------------------------------------- cut-out */

/**
 * An object cut-out in comic print: greyscale ink, halftone dots clipped to
 * the object, a thin ink line and the paper sticker outline around it.
 */
export const InkCut: React.FC<{ src: string; style?: React.CSSProperties }> = ({ src, style }) => {
  const ink = [[3, 0], [-3, 0], [0, 3], [0, -3]].map(([x, y]) => `drop-shadow(${x}px ${y}px 0 ${colors.ink})`).join(" ");
  const paper = [[6, 0], [-6, 0], [0, 6], [0, -6]].map(([x, y]) => `drop-shadow(${x}px ${y}px 0 ${colors.paper})`).join(" ");
  return (
    <div style={{ position: "relative", filter: `${ink} ${paper} drop-shadow(14px 16px 0 rgba(0,0,0,0.55))`, ...style }}>
      <Img src={media(src)} style={{ width: "100%", display: "block", filter: INK }} />
      <div style={{ position: "absolute", inset: 0, ...dots(7, colors.ink), opacity: 0.4, WebkitMaskImage: `url(${media(src)})`, WebkitMaskSize: "100% 100%" }} />
    </div>
  );
};

/* ------------------------------------------------------------ lettering */

/** Comic starburst with a word: «БАМ!» on the win (lime), «ПШИК» on the flop (red). */
export const Boom: React.FC<{ text: string; at: number; x: number; y: number; size?: number; tone?: "hero" | "bad"; rot?: number; life?: number }> = ({ text, at, x, y, size = 260, tone = "hero", rot = -8, life }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const k = frame - at;
  if (k < 0 || (life !== undefined && k > life + 6)) return null;
  const p = spring({ frame: k, fps, config: theme.spring.bouncy });
  const gone = life === undefined ? 0 : interpolate(k, [life, life + 6], [0, 1], { easing: theme.ease.in, ...clamp });
  const n = 14;
  const pts = Array.from({ length: n * 2 }, (_, i) => {
    const a = (i / (n * 2)) * Math.PI * 2;
    const r = i % 2 === 0 ? 0.5 : 0.34 + rnd(i * 11 + at) * 0.06;
    return `${50 + Math.cos(a) * r * 100},${50 + Math.sin(a) * r * 100 * 0.78}`;
  }).join(" ");
  const fill = tone === "bad" ? colors.bad : palette.primary;
  const wob = Math.sin(k / 3) * 2;
  return (
    <div style={{ position: "absolute", left: x - size / 2, top: y - size * 0.39, width: size, height: size * 0.78, zIndex: 14, opacity: 1 - gone, transform: `scale(${interpolate(p, [0, 1], [0.2, 1]) * (1 - gone * 0.4)}) rotate(${rot + wob + (1 - p) * -30}deg)` }}>
      <svg viewBox="0 0 100 78" width={size} height={size * 0.78} style={{ position: "absolute", inset: 0, overflow: "visible", filter: "drop-shadow(10px 12px 0 rgba(0,0,0,0.55))" }}>
        <polygon points={pts} fill={fill} stroke={colors.ink} strokeWidth={2.6} strokeLinejoin="round" />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: WIDE, fontWeight: 900, fontSize: size * (text.length > 6 ? 0.115 : text.length > 4 ? 0.135 : 0.17), color: tone === "bad" ? colors.white : colors.ink2, letterSpacing: "-0.02em", textAlign: "center", lineHeight: 0.95 }}>
        {text}
      </div>
    </div>
  );
};

/** A speech bubble: paper, ink outline, tail pointing at the speaker. */
export const Bubble: React.FC<{ text: string; at: number; x: number; y: number; w: number; size?: number; tail?: "left" | "right"; rot?: number }> = ({ text, at, x, y, w, size = 44, tail = "left", rot = -3 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const k = frame - at;
  if (k < 0) return null;
  const p = spring({ frame: k, fps, config: theme.spring.bouncy });
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, zIndex: 13, transformOrigin: tail === "left" ? "15% 100%" : "85% 100%", transform: `scale(${interpolate(p, [0, 1], [0.2, 1])}) rotate(${rot + Math.sin(frame / 12) * 1.2}deg)`, opacity: Math.min(1, p * 1.5) }}>
      <div style={{ position: "relative", padding: `${size * 0.5}px ${size * 0.6}px`, background: colors.paper, border: `6px solid ${colors.ink}`, borderRadius: size * 1.4, fontFamily: WIDE, fontWeight: 900, fontSize: size, lineHeight: 1.02, color: colors.ink, textAlign: "center", boxShadow: "12px 14px 0 rgba(0,0,0,0.55)" }}>
        {text}
        <svg width={70} height={60} viewBox="0 0 70 60" style={{ position: "absolute", bottom: -52, [tail === "left" ? "left" : "right"]: 40, overflow: "visible", transform: tail === "right" ? "scaleX(-1)" : undefined }}>
          <path d="M6 0 L18 56 L48 0" fill={colors.paper} stroke={colors.ink} strokeWidth={6} strokeLinejoin="round" />
          <rect x={4} y={-10} width={48} height={12} fill={colors.paper} />
        </svg>
      </div>
    </div>
  );
};

/** A year that rolls like an odometer, no thousands separator. */
export const Year: React.FC<{ from: number; to: number; at: number; size: number; color?: string; dur?: number }> = ({ from, to, at, size, color = palette.primary, dur = 22 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - at, fps, config: theme.spring.snappy });
  const r = interpolate(frame - at, [0, dur], [0, 1], { easing: theme.ease.out, ...clamp });
  if (frame < at) return null;
  return (
    <div style={{ fontFamily: WIDE, fontWeight: 900, fontSize: size, lineHeight: 0.95, letterSpacing: "-0.03em", color, fontVariantNumeric: "tabular-nums", transformOrigin: "left center", transform: `scale(${interpolate(p, [0, 1], [1.8, 1])})`, opacity: Math.min(1, p * 1.5), filter: `drop-shadow(0 0 ${size * 0.2}px ${color === colors.bad ? colors.badGlow : palette.glow}) drop-shadow(8px 10px 0 rgba(0,0,0,0.6))` }}>
      {Math.round(from + (to - from) * r)}
    </div>
  );
};

/* ------------------------------------------------------------ ultra hand */

/**
 * The Ultra Hand (no free photo of the 1966 toy exists): lazy tongs in ink on
 * paper with red scissor grips, extending from `x,y` to the right as `ext`
 * goes 0 → 1. `children` ride on the claw.
 */
export const UltraHand: React.FC<{ x: number; y: number; ext: number; rot?: number; segs?: number; bar?: number; children?: React.ReactNode }> = ({ x, y, ext, rot = 0, segs = 6, bar = 130, children }) => {
  const th = interpolate(ext, [0, 1], [72, 16]) * (Math.PI / 180);
  const d = bar * Math.cos(th);
  const h = bar * Math.sin(th);
  const L = segs * d;
  const top: string[] = [];
  const bot: string[] = [];
  for (let i = 0; i <= segs; i++) {
    const px = i * d;
    top.push(`${px},${i % 2 === 0 ? -h / 2 : h / 2}`);
    bot.push(`${px},${i % 2 === 0 ? h / 2 : -h / 2}`);
  }
  const W = L + 140;
  return (
    <div style={{ position: "absolute", left: x, top: y, zIndex: 10, transformOrigin: "0 0", transform: `rotate(${rot}deg)`, filter: "drop-shadow(12px 14px 0 rgba(0,0,0,0.55))" }}>
      <svg width={W + 160} height={360} viewBox={`-150 -180 ${W + 160} 360`} style={{ position: "absolute", left: -150, top: -180, overflow: "visible" }}>
        {/* grips */}
        <circle cx={-80} cy={-46} r={34} fill="none" stroke={colors.ink} strokeWidth={22} />
        <circle cx={-80} cy={-46} r={34} fill="none" stroke={colors.bad} strokeWidth={12} />
        <circle cx={-80} cy={46} r={34} fill="none" stroke={colors.ink} strokeWidth={22} />
        <circle cx={-80} cy={46} r={34} fill="none" stroke={colors.bad} strokeWidth={12} />
        <polyline points={`-50,-40 0,${-h / 2}`} fill="none" stroke={colors.ink} strokeWidth={22} strokeLinecap="round" />
        <polyline points={`-50,40 0,${h / 2}`} fill="none" stroke={colors.ink} strokeWidth={22} strokeLinecap="round" />
        {[top, bot].map((pts, i) => (
          <polyline key={`i${i}`} points={pts.join(" ")} fill="none" stroke={colors.ink} strokeWidth={24} strokeLinejoin="round" strokeLinecap="round" />
        ))}
        {[top, bot].map((pts, i) => (
          <polyline key={`p${i}`} points={pts.join(" ")} fill="none" stroke={colors.paper} strokeWidth={12} strokeLinejoin="round" strokeLinecap="round" />
        ))}
        {Array.from({ length: segs + 1 }, (_, i) => (
          <circle key={i} cx={i * d} cy={0} r={7} fill={colors.ink} />
        ))}
        {/* claw */}
        <path d={`M${L} ${-h / 2} q 70 -30 90 20`} fill="none" stroke={colors.ink} strokeWidth={22} strokeLinecap="round" />
        <path d={`M${L} ${h / 2} q 70 30 90 -20`} fill="none" stroke={colors.ink} strokeWidth={22} strokeLinecap="round" />
        <path d={`M${L} ${-h / 2} q 70 -30 90 20`} fill="none" stroke={colors.paper} strokeWidth={10} strokeLinecap="round" />
        <path d={`M${L} ${h / 2} q 70 30 90 -20`} fill="none" stroke={colors.paper} strokeWidth={10} strokeLinecap="round" />
      </svg>
      {children && <div style={{ position: "absolute", left: L + 60, top: 0 }}>{children}</div>}
    </div>
  );
};
