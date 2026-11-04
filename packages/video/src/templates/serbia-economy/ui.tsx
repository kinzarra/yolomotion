// TikTok-density kit for ВЫПУСК 21, on top of the series kit: lime-toned
// footage with a whip-zoom entrance, a lime slab wipe on every cut, sticker
// cut-outs that fly in from the edges, hand-drawn arrows, speed-line bursts,
// an ash dissolve, a ticker and the subscribe/like/comment end card.
import React from "react";
import { Img, OffthreadVideo, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../theme";
import { useIn } from "../../reel";
import { rnd } from "../digital-ruble/ui";
import { seColors as colors, sePalette as palette } from "./palette";

export * from "../digital-ruble/ui";

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const media = (f: string) => staticFile(f);
const WIDE = `${theme.fonts.wide}, ${theme.fonts.mono}`;

/* ------------------------------------------------------------ footage */

/** Full-frame clip, lime duotone, whip-zoom + blur on entry, slow push after. */
export const DuoClip: React.FC<{ src: string; dim?: number; startFrom?: number; tint?: number }> = ({ src, dim = 0.42, startFrom = 0.3, tint = 0.5 }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const whip = interpolate(frame, [0, 10], [1.38, 1.06], { easing: theme.ease.out, ...clamp });
  const push = interpolate(frame, [0, durationInFrames], [0, 0.09], { easing: theme.ease.inOut, ...clamp });
  const blur = interpolate(frame, [0, 7], [16, 0], { easing: theme.ease.out, ...clamp });
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <OffthreadVideo
        src={media(src)}
        muted
        startFrom={Math.round(startFrom * fps)}
        style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${whip + push})`, filter: `grayscale(1) contrast(1.3) brightness(${1 - dim}) blur(${blur}px)` }}
      />
      <div style={{ position: "absolute", inset: 0, background: palette.primary, mixBlendMode: "multiply", opacity: tint }} />
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${palette.bg}F0 0%, ${palette.bg}40 26%, ${palette.bg}30 58%, ${palette.bg}F4 90%)` }} />
    </div>
  );
};

/* ---------------------------------------------------------------- cut */

/** The cut: a skewed lime slab sweeps across, a flash and a few RGB-torn frames. */
export const CutWipe: React.FC<{ color?: string }> = ({ color = palette.primary }) => {
  const frame = useCurrentFrame();
  if (frame > 10) return null;
  const x = interpolate(frame, [0, 9], [-200, 2100], { easing: theme.ease.inOut, ...clamp });
  const flash = interpolate(frame, [0, 5], [0.55, 0], { easing: theme.ease.out, ...clamp });
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 30, pointerEvents: "none", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -200, bottom: -200, left: x - 900, width: 700, background: color, transform: "skewX(-18deg)", boxShadow: `0 0 120px ${palette.glow}` }} />
      <div style={{ position: "absolute", top: -200, bottom: -200, left: x - 1180, width: 90, background: color, opacity: 0.6, transform: "skewX(-18deg)" }} />
      <div style={{ position: "absolute", inset: 0, background: color, opacity: flash, mixBlendMode: "screen" }} />
    </div>
  );
};

/** Radial speed lines bursting out of a point: the impact of a number. */
export const SpeedLines: React.FC<{ at: number; x?: number; y?: number; color?: string; count?: number }> = ({ at, x = 540, y = 960, color = palette.primary, count = 28 }) => {
  const frame = useCurrentFrame();
  const k = frame - at;
  if (k < 0 || k > 14) return null;
  const p = interpolate(k, [0, 14], [0, 1], { easing: theme.ease.out, ...clamp });
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, zIndex: 6, pointerEvents: "none" }}>
      {Array.from({ length: count }, (_, i) => {
        const a = (i / count) * Math.PI * 2 + rnd(i * 3) * 0.2;
        const r0 = 120 + p * 380;
        const r1 = r0 + 160 + rnd(i) * 220 * (1 - p);
        return (
          <line key={i} x1={x + Math.cos(a) * r0} y1={y + Math.sin(a) * r0} x2={x + Math.cos(a) * r1} y2={y + Math.sin(a) * r1} stroke={color} strokeWidth={6 + rnd(i * 7) * 8} strokeLinecap="round" opacity={1 - p} />
        );
      })}
    </svg>
  );
};

/* ------------------------------------------------------------- props */

type Side = "left" | "right" | "top" | "bottom";

/**
 * A cut-out flies in from an edge with overshoot, spin and motion blur, then
 * bobs. `sticker` gives it the TikTok white outline.
 */
export const FlyIn: React.FC<{
  src?: string;
  children?: React.ReactNode;
  from: Side;
  at: number;
  x: number;
  y: number;
  w: number;
  rot?: number;
  sticker?: boolean;
  card?: boolean;
  z?: number;
  out?: number; // frame it flies back out (optional)
}> = ({ src, children, from, at, x, y, w, rot = 0, sticker = true, card = false, z = 3, out }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - at, fps, config: theme.spring.bouncy });
  const q = out === undefined ? 0 : interpolate(frame, [out, out + 8], [0, 1], { easing: theme.ease.in, ...clamp });
  if (frame < at) return null;
  const far = { left: [-(x + w + 160), 0], right: [1080 - x + 160, 0], top: [0, -(y + 700)], bottom: [0, 1920 - y + 160] }[from];
  const t = 1 - p + q;
  const vel = Math.abs(1 - p) + q;
  const bob = Math.sin(frame / 16 + x) * 7;
  const wob = Math.sin(frame / 23 + y) * 2;
  const spin = (from === "left" || from === "bottom" ? -1 : 1) * 32;
  const outline = sticker && !card ? `drop-shadow(5px 0 0 ${colors.white}) drop-shadow(-5px 0 0 ${colors.white}) drop-shadow(0 5px 0 ${colors.white}) drop-shadow(0 -5px 0 ${colors.white}) ` : "";
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        zIndex: z,
        transform: `translate(${far[0] * t}px, ${far[1] * t + bob}px) rotate(${rot + spin * t + wob}deg) scale(${interpolate(p, [0, 1], [0.7, 1])})`,
        filter: `${outline}drop-shadow(0 26px 30px rgba(0,0,0,0.7)) blur(${Math.min(10, vel * 14)}px)`,
      }}
    >
      {children ??
        (card ? (
          <div style={{ padding: 8, background: colors.white, boxShadow: colors.shadow }}>
            <Img src={media(src!)} style={{ width: "100%", display: "block" }} />
          </div>
        ) : (
          <Img src={media(src!)} style={{ width: "100%", display: "block" }} />
        ))}
    </div>
  );
};

/** Hand-drawn TikTok arrow that draws itself toward a target. */
export const Arrow: React.FC<{ at: number; x: number; y: number; w?: number; flip?: boolean; rot?: number; color?: string }> = ({ at, x, y, w = 220, flip = false, rot = 0, color = palette.primary }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - at, [0, 9], [0, 1], { easing: theme.ease.out, ...clamp });
  if (frame < at) return null;
  const len = 340;
  const pulse = 1 + Math.sin((frame - at) / 4) * 0.04;
  return (
    <svg viewBox="0 0 200 140" width={w} height={w * 0.7} style={{ position: "absolute", left: x, top: y, zIndex: 8, transform: `scaleX(${flip ? -1 : 1}) rotate(${rot}deg) scale(${pulse})`, filter: `drop-shadow(0 0 14px ${color === palette.primary ? palette.glow : colors.badGlow})`, overflow: "visible" }}>
      <path d="M10 20 C 70 0, 150 30, 172 112" fill="none" stroke={color} strokeWidth={13} strokeLinecap="round" strokeDasharray={len} strokeDashoffset={len * (1 - p)} />
      <path d="M140 96 L174 122 L190 82" fill="none" stroke={color} strokeWidth={13} strokeLinecap="round" strokeLinejoin="round" opacity={p > 0.85 ? 1 : 0} />
    </svg>
  );
};

/** A cut-out that crumbles to ash from `at`: tiles drift up-right and burn off. */
export const Ash: React.FC<{ src: string; x: number; y: number; w: number; ratio: number; at: number; cols?: number; rows?: number }> = ({ src, x, y, w, ratio, at, cols = 10, rows = 14 }) => {
  const frame = useCurrentFrame();
  const h = w / ratio;
  const tw = w / cols;
  const th = h / rows;
  const breathe = Math.sin(frame / 20) * 4;
  return (
    <div style={{ position: "absolute", left: x, top: y + breathe, width: w, height: h, zIndex: 2 }}>
      {Array.from({ length: cols * rows }, (_, i) => {
        const c = i % cols;
        const r = Math.floor(i / cols);
        // burn starts top-right and spreads
        const delay = (1 - r / rows) * 8 + (c / cols) * 6 + rnd(i) * 6;
        const k = Math.max(0, frame - at - delay);
        const p = interpolate(k, [0, 16], [0, 1], { easing: theme.ease.in, ...clamp });
        const dx = p * (80 + rnd(i * 3) * 160);
        const dy = -p * (120 + rnd(i * 5) * 260);
        return (
          <div key={i} style={{ position: "absolute", left: c * tw, top: r * th, width: tw + 0.6, height: th + 0.6, overflow: "hidden", opacity: 1 - p, transform: `translate(${dx}px, ${dy}px) rotate(${p * (rnd(i) * 160 - 80)}deg) scale(${1 - p * 0.6})`, filter: p > 0 ? `brightness(${1 + p * 1.5}) sepia(${p})` : undefined }}>
            <Img src={media(src)} style={{ position: "absolute", left: -c * tw, top: -r * th, width: w, height: h }} />
          </div>
        );
      })}
    </div>
  );
};

/* --------------------------------------------------------------- type */

/** Fact counter top-left: «ФАКТ 2/5», flips in on a lime block. */
export const FactTag: React.FC<{ n: number; of: number; kicker?: string }> = ({ n, of, kicker }) => {
  const p = useIn(2, "bouncy");
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: 64, top: 214, zIndex: 9, display: "flex", alignItems: "center", gap: 14 }}>
      <div style={{ padding: "10px 20px", background: palette.primary, color: colors.ink2, fontFamily: WIDE, fontWeight: 900, fontSize: 40, letterSpacing: "-0.01em", transform: `rotate(-3deg) scale(${interpolate(p, [0, 1], [0.2, 1])}) rotateX(${interpolate(p, [0, 1], [90, 0])}deg)`, boxShadow: `0 0 40px ${palette.glow}` }}>
        ФАКТ {n}/{of}
      </div>
      {kicker && (
        <div style={{ padding: "8px 14px", border: `2px solid ${palette.text}`, color: palette.text, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 24, letterSpacing: "0.1em", opacity: interpolate(frame, [6, 12], [0, 1], clamp), transform: `translateX(${interpolate(frame, [6, 14], [-40, 0], { easing: theme.ease.out, ...clamp })}px)` }}>
          {kicker}
        </div>
      )}
    </div>
  );
};

/** What a number is, on paper. Every figure on screen gets one. */
export const Label: React.FC<{ children: React.ReactNode; at: number; size?: number; rotate?: number; tone?: "paper" | "bad" | "lime" }> = ({ children, at, size = 26, rotate = -1, tone = "paper" }) => {
  const p = useIn(at, "snappy");
  const bg = tone === "bad" ? colors.bad : tone === "lime" ? palette.primary : colors.paper;
  const fg = tone === "bad" ? colors.white : colors.ink;
  return (
    <div style={{ alignSelf: "flex-start", padding: `${size * 0.35}px ${size * 0.7}px`, background: bg, color: fg, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: size, letterSpacing: "0.06em", lineHeight: 1.25, boxShadow: colors.paperShadow, opacity: p, transform: `translateX(${interpolate(p, [0, 1], [-60, 0])}px) rotate(${rotate}deg)` }}>
      {children}
    </div>
  );
};

/** A number slammed in: scale 2.2 → 1, glow, odometer roll for numerics. */
export const Slam: React.FC<{ text: string; at: number; size: number; color?: string; roll?: { from: number; to: number; suffix?: string; prefix?: string } }> = ({ text, at, size, color = palette.primary, roll }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - at, fps, config: theme.spring.snappy });
  if (frame < at) return null;
  let shown = text;
  if (roll) {
    const r = interpolate(frame - at, [0, 22], [0, 1], { easing: theme.ease.out, ...clamp });
    const v = Math.round(roll.from + (roll.to - roll.from) * r);
    shown = `${roll.prefix ?? ""}${v.toLocaleString("ru-RU").replace(/\s/g, " ")}${roll.suffix ?? ""}`;
  }
  const jitter = frame - at < 8 ? (rnd(frame) - 0.5) * 10 : 0;
  return (
    <div style={{ fontFamily: WIDE, fontWeight: 900, fontSize: size, lineHeight: 0.95, letterSpacing: "-0.03em", color, whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums", opacity: Math.min(1, p * 1.5), transform: `translateX(${jitter}px) scale(${interpolate(p, [0, 1], [2.2, 1])})`, transformOrigin: "left center", filter: `drop-shadow(0 0 ${size * 0.25}px ${color === colors.bad ? colors.badGlow : palette.glow})` }}>
      {shown}
    </div>
  );
};

/** Lime ticker band, tilted, scrolling: the breaking-news strip. */
export const Ticker: React.FC<{ items: string[]; top?: number }> = ({ items, top = 1585 }) => {
  const frame = useCurrentFrame();
  const line = items.join("  //  ");
  const x = -((frame * 6) % 2400);
  return (
    <div style={{ position: "absolute", left: -40, right: -40, top, height: 62, zIndex: 20, background: palette.primary, transform: "rotate(-2deg)", overflow: "hidden", boxShadow: `0 0 40px ${palette.glow}` }}>
      <div style={{ position: "absolute", left: x, top: 12, whiteSpace: "nowrap", fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 30, letterSpacing: "0.08em", color: colors.ink2 }}>
        {[0, 1, 2, 3].map((i) => (
          <span key={i}>{line}{"  //  "}</span>
        ))}
      </div>
    </div>
  );
};

/** TikTok progress bar on the very top edge. */
export const Progress: React.FC<{ total: number }> = ({ total }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: 0, top: 0, height: 10, width: `${(frame / total) * 100}%`, background: palette.primary, zIndex: 40, boxShadow: `0 0 20px ${palette.glow}` }} />
  );
};

/** Numbers drifting up behind everything: the data texture. */
export const Numbers: React.FC<{ items: string[] }> = ({ items }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none" }}>
      {Array.from({ length: 14 }, (_, k) => {
        const y = 1900 - ((frame * (3 + (k % 3)) + k * 140) % 2000);
        const x = 30 + ((k * 211) % 980);
        return (
          <div key={k} style={{ position: "absolute", left: x, top: y, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 30 + (k % 3) * 12, color: k % 4 === 0 ? colors.bad : palette.primary, opacity: 0.22 }}>
            {items[k % items.length]}
          </div>
        );
      })}
    </div>
  );
};

/* ------------------------------------------------------------ end card */

const Bell: React.FC<{ swing: number; size: number; color: string }> = ({ swing, size, color }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} style={{ transform: `rotate(${swing}deg)`, transformOrigin: "50% 10%" }}>
    <path d="M12 2a1.6 1.6 0 0 1 1.6 1.6v.6A6.4 6.4 0 0 1 18.4 10.4v4.4l1.8 2.6H3.8l1.8-2.6v-4.4a6.4 6.4 0 0 1 4.8-6.2v-.6A1.6 1.6 0 0 1 12 2z" fill={color} />
    <circle cx={12} cy={20.2} r={2} fill={color} />
  </svg>
);
const Thumb: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg viewBox="0 0 24 24" width={size} height={size}>
    <path d="M2 10h4v11H2zM8 21V10l5.2-7.4a1.8 1.8 0 0 1 3.2 1.4L15.4 9H21a2 2 0 0 1 2 2.3l-1.4 8A2 2 0 0 1 19.6 21z" fill={color} />
  </svg>
);
const Bubble: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg viewBox="0 0 24 24" width={size} height={size}>
    <path d="M4 3h16a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H9l-5 4v-4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" fill={color} />
  </svg>
);

/**
 * The standard end card (author 2026-10-26): «Подписаться» gets pressed and
 * turns into «Вы подписаны», the bell rings, the like counts up, a comment
 * bubble asks the question. No hand. Sits low, never over the final figure.
 */
export const SubscribeCard: React.FC<{ at: number; question: string; top?: number }> = ({ at, question, top = 1250 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const k = frame - at;
  if (k < 0) return null;
  const inP = spring({ frame: k, fps, config: theme.spring.bouncy });
  const press = Math.round(0.55 * fps);
  const pressed = k >= press;
  const squish = interpolate(k, [press - 3, press, press + 5], [1, 0.86, 1], { easing: theme.ease.out, ...clamp });
  const ring = pressed ? Math.sin((k - press) / 1.6) * interpolate(k - press, [0, 24], [26, 0], clamp) : 0;
  const likeAt = press + 6;
  const likeP = spring({ frame: k - likeAt, fps, config: theme.spring.bouncy });
  const likes = Math.round(interpolate(k - likeAt, [0, 20], [0, 1000], { easing: theme.ease.out, ...clamp }));
  const comAt = likeAt + 6;
  const comP = spring({ frame: k - comAt, fps, config: theme.spring.bouncy });
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top, zIndex: 25, display: "flex", flexDirection: "column", alignItems: "center", gap: 18, opacity: Math.min(1, inP * 1.4), transform: `translateY(${interpolate(inP, [0, 1], [140, 0])}px)` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "20px 38px", borderRadius: 60, background: pressed ? colors.surfaceLift : colors.bad, color: colors.white, fontFamily: WIDE, fontWeight: 800, fontSize: 40, transform: `scale(${squish})`, boxShadow: pressed ? "none" : `0 0 40px ${colors.badGlow}` }}>
          {pressed ? "ВЫ ПОДПИСАНЫ" : "ПОДПИСАТЬСЯ"}
        </div>
        <div style={{ width: 92, height: 92, borderRadius: 46, background: pressed ? palette.primary : colors.surfaceLift, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: pressed ? `0 0 30px ${palette.glow}` : "none" }}>
          <Bell swing={ring} size={52} color={pressed ? colors.ink2 : colors.white} />
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 26px", borderRadius: 40, background: colors.surfaceLift, opacity: likeP, transform: `scale(${interpolate(likeP, [0, 1], [0.3, 1])}) rotate(-3deg)` }}>
          <div style={{ transform: `rotate(${interpolate(likeP, [0, 1], [-40, 0])}deg) scale(${1 + Math.max(0, Math.sin((k - likeAt) / 3)) * 0.12 * interpolate(k - likeAt, [0, 18], [1, 0], clamp)})` }}>
            <Thumb size={44} color={palette.primary} />
          </div>
          <span style={{ fontFamily: WIDE, fontWeight: 800, fontSize: 32, color: palette.text, fontVariantNumeric: "tabular-nums" }}>{likes >= 1000 ? "1K" : likes}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 24px", borderRadius: 40, background: colors.paper, opacity: comP, transform: `scale(${interpolate(comP, [0, 1], [0.3, 1])}) rotate(2deg)` }}>
          <Bubble size={40} color={colors.ink} />
          <span style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 26, color: colors.ink, letterSpacing: "0.04em" }}>{question}</span>
        </div>
      </div>
    </div>
  );
};
