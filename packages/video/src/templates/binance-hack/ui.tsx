// Noir-comic kit for the Binance case: inked photos with halftone, comic
// panels, caption boxes, evidence tags, stamps, red strings, sound words.
// Series primitives (Flash, Glitch, …) come from digital-ruble.
import React from "react";
import { Img, interpolate, OffthreadVideo, Sequence, spring, staticFile } from "remotion";
import { theme } from "../../theme";
import { bh } from "./palette";

export * from "../digital-ruble/ui";

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const WIDE = theme.fonts.wide;
export const MONO = theme.fonts.mono;
export const X0 = 110;
export const X1 = 970;
export const img = (f: string) => staticFile(`images/binance-hack/${f}`);
export const media = (f: string) => staticFile(`media/binance-hack/${f}`);

/**
 * Stock footage printed like the photos: mono, high contrast, a colour
 * multiplied over it and the halftone screen. Starts at reel second `at`.
 */
export const InkClip: React.FC<{ src: string; at: number; fps: number; tint?: string; dark?: number; rate?: number; style?: React.CSSProperties }> = ({ src, at, fps, tint = bh.yellow, dark = 0.3, rate = 1, style }) => (
  <div style={{ position: "absolute", inset: 0, overflow: "hidden", ...style }}>
    <Sequence from={Math.round(at * fps)} layout="none">
      <OffthreadVideo src={src} muted playbackRate={rate} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(1) contrast(1.5) brightness(0.95)" }} />
    </Sequence>
    <div style={{ position: "absolute", inset: 0, background: tint, mixBlendMode: "multiply" }} />
    <div style={{ position: "absolute", inset: 0, backgroundImage: dots(bh.ink, 12, 28), backgroundSize: "12px 12px", opacity: 0.4 }} />
    <div style={{ position: "absolute", inset: 0, background: `rgba(8,8,10,${dark})` }} />
  </div>
);

export const sp = (age: number, fps: number, cfg: keyof typeof theme.spring = "snappy") =>
  age <= 0 ? 0 : spring({ frame: age * fps, fps, config: theme.spring[cfg] });
export const out = (age: number, len: number, k = 0.2) =>
  interpolate(age, [len - k, len], [1, 0], { easing: theme.ease.in, ...clamp });
export const ramp = (t: number, a: number, b: number, ease: keyof typeof theme.ease = "inOut") =>
  interpolate(t, [a, b], [0, 1], { easing: theme.ease[ease], ...clamp });
export const usd = (n: number) => "$" + String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
/** «$6,36 МЛРД»: billions with two decimals (one when `short`). */
export const bln = (n: number, short = false) => "$" + (n / 1e9).toFixed(short ? 1 : 2).replace(".", ",") + " МЛРД";

/** Comic ink outline around any cut-out: four hard drop-shadows. */
const inkLine = (w: number, c: string = bh.ink) =>
  `drop-shadow(${w}px 0 0 ${c}) drop-shadow(-${w}px 0 0 ${c}) drop-shadow(0 ${w}px 0 ${c}) drop-shadow(0 -${w}px 0 ${c})`;

/** Halftone dot screen as a CSS background. */
export const dots = (color: string, size = 12, r = 28) =>
  `radial-gradient(circle, ${color} ${r}%, transparent ${r + 3}%)`;

/**
 * A real photo drawn as a comic print: high-contrast mono, a halftone layer
 * clipped to the photo's own alpha, an ink outline and an offset shadow.
 * `tint` multiplies a colour over it (yellow for money, red for a suspect).
 */
export const Inked: React.FC<{
  src: string;
  w: number;
  h?: number;
  tint?: string;
  outline?: number;
  dot?: number;
  color?: boolean;
  style?: React.CSSProperties;
}> = ({ src, w, h, tint, outline = 6, dot = 0.35, color = false, style }) => {
  const mask: React.CSSProperties = {
    WebkitMaskImage: `url(${src})`,
    WebkitMaskSize: "100% 100%",
    maskImage: `url(${src})`,
    maskSize: "100% 100%",
  };
  return (
    <div style={{ position: "absolute", width: w, height: h, filter: `${inkLine(outline)} drop-shadow(14px 16px 0 rgba(0,0,0,0.55))`, ...style }}>
      <Img
        src={src}
        style={{
          width: "100%",
          height: h ? "100%" : undefined,
          display: "block",
          filter: color ? "contrast(1.25) saturate(1.2)" : "grayscale(1) contrast(1.55) brightness(1.08)",
        }}
      />
      {tint && <div style={{ position: "absolute", inset: 0, background: tint, mixBlendMode: "multiply", ...mask }} />}
      <div style={{ position: "absolute", inset: 0, backgroundImage: dots(bh.ink), backgroundSize: "11px 11px", opacity: dot, mixBlendMode: "multiply", ...mask }} />
    </div>
  );
};

/** Full-bleed photo background, inked and duotoned, slowly pushing in. */
export const InkBg: React.FC<{ src: string; t: number; tint?: string; dark?: number; focus?: string }> = ({ src, t, tint = bh.yellow, dark = 0.35, focus = "50% 50%" }) => (
  <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
    <Img src={src} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: focus, filter: "grayscale(1) contrast(1.6) brightness(0.9)", transform: `scale(${1.08 + t * 0.012}) translateY(${-t * 4}px)` }} />
    <div style={{ position: "absolute", inset: 0, background: tint, mixBlendMode: "multiply" }} />
    <div style={{ position: "absolute", inset: 0, backgroundImage: dots(bh.ink, 14, 30), backgroundSize: "14px 14px", opacity: 0.45 }} />
    <div style={{ position: "absolute", inset: 0, background: `rgba(8,8,10,${dark})` }} />
  </div>
);

/** Radial speed lines behind a hit. */
export const SpeedLines: React.FC<{ t: number; cx?: number; cy?: number; color?: string; opacity?: number; n?: number }> = ({ t, cx = 540, cy = 960, color = bh.ink, opacity = 0.6, n = 64 }) => (
  <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity }}>
    {Array.from({ length: n }, (_, i) => {
      const a = (i / n) * Math.PI * 2 + Math.sin(i * 7.3) * 0.04;
      const r0 = 330 + ((Math.sin(i * 13.1 + t * 9) + 1) / 2) * 260;
      const wd = 6 + (i % 4) * 5;
      const x1 = cx + Math.cos(a) * r0, y1 = cy + Math.sin(a) * r0;
      const x2 = cx + Math.cos(a) * 1500, y2 = cy + Math.sin(a) * 1500;
      const px = Math.cos(a + Math.PI / 2) * wd, py = Math.sin(a + Math.PI / 2) * wd;
      return <path key={i} d={`M${x1} ${y1} L${x2 + px} ${y2 + py} L${x2 - px} ${y2 - py} Z`} fill={color} />;
    })}
  </svg>
);

/** Comic panel: thick ink border, hard offset shadow, slight tilt. */
export const Panel: React.FC<{ x: number; y: number; w: number; h: number; rot?: number; age: number; fps: number; from?: "left" | "right" | "top" | "bottom"; bg?: string; children?: React.ReactNode; style?: React.CSSProperties }> = ({ x, y, w, h, rot = 0, age, fps, from = "left", bg = bh.paper, children, style }) => {
  if (age < 0) return null;
  const s = sp(age, fps, "snappy");
  const d = (1 - s) * 900;
  const off = { left: [-d, 0], right: [d, 0], top: [0, -d], bottom: [0, d] }[from];
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, background: bg, border: `9px solid ${bh.ink}`, boxShadow: `16px 18px 0 ${bh.ink}`, overflow: "hidden", transform: `translate(${off[0]}px, ${off[1]}px) rotate(${rot}deg)`, ...style }}>
      {children}
    </div>
  );
};

/** Yellow-paper narration box, typed in mono caps. */
export const Caption: React.FC<{ age: number; fps: number; text: string; x?: number; y: number; rot?: number; w?: number; tone?: "paper" | "ink" }> = ({ age, fps, text, x = X0, y, rot = -2, w, tone = "paper" }) => {
  if (age < 0) return null;
  const s = sp(age, fps, "snappy");
  const n = Math.round(interpolate(age, [0.05, 0.05 + text.length * 0.022], [0, text.length], clamp));
  const dark = tone === "ink";
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, transform: `rotate(${rot}deg) scale(${interpolate(s, [0, 1], [0.6, 1])})`, transformOrigin: "left top", opacity: Math.min(1, s * 2), background: dark ? bh.ink : bh.paper, color: dark ? bh.paper : bh.ink, border: `6px solid ${bh.ink}`, boxShadow: `10px 10px 0 ${bh.ink}`, padding: "16px 24px", fontFamily: MONO, fontWeight: 800, fontSize: 34, lineHeight: 1.2, letterSpacing: "0.04em", whiteSpace: w ? "normal" : "nowrap" }}>
      <span>{text.slice(0, n)}</span>
      <span style={{ opacity: 0 }}>{text.slice(n)}</span>
    </div>
  );
};

/** Evidence tag: «УЛИКА №1» on a yellow-black tent card. */
export const Tag: React.FC<{ n: number; label?: string; x: number; y: number; age: number; fps: number; rot?: number }> = ({ n, label, x, y, age, fps, rot = 4 }) => {
  if (age < 0) return null;
  const s = sp(age, fps, "bouncy");
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `rotate(${rot}deg) scale(${s})`, transformOrigin: "left top", display: "flex", alignItems: "stretch", border: `5px solid ${bh.ink}`, boxShadow: `8px 8px 0 ${bh.ink}`, fontFamily: MONO, fontWeight: 800 }}>
      <div style={{ background: bh.yellow, color: bh.ink, fontSize: 30, padding: "8px 16px", letterSpacing: "0.08em" }}>УЛИКА №{n}</div>
      {label && <div style={{ background: bh.ink, color: bh.paper, fontSize: 26, padding: "10px 16px", letterSpacing: "0.06em" }}>{label}</div>}
    </div>
  );
};

/** Rubber stamp with a worn edge. */
export const Stamp2: React.FC<{ age: number; fps: number; text: string; size?: number; rot?: number; color?: string; style?: React.CSSProperties }> = ({ age, fps, text, size = 80, rot = -10, color = bh.red, style }) => {
  if (age < 0) return null;
  const s = sp(age, fps, "snappy");
  return (
    <div style={{ position: "absolute", padding: `${size * 0.08}px ${size * 0.26}px`, border: `${size * 0.1}px double ${color}`, color, fontFamily: WIDE, fontWeight: 900, fontSize: size, lineHeight: 1.05, whiteSpace: "nowrap", opacity: Math.min(1, s * 1.8) * 0.94, transform: `rotate(${rot}deg) scale(${interpolate(s, [0, 1], [2.4, 1])})`, mixBlendMode: "normal", WebkitMaskImage: `${dots("#000", 6, 46)}, linear-gradient(#000,#000)`, WebkitMaskSize: "7px 7px, 100% 100%", WebkitMaskComposite: "source-over", ...style }}>
      {text}
    </div>
  );
};

/** Comic sound word: big skewed letters, ink stroke, pops and shakes. */
export const Boom: React.FC<{ age: number; fps: number; text: string; x: number; y: number; size?: number; rot?: number; color?: string; len?: number }> = ({ age, fps, text, x, y, size = 150, rot = -8, color = bh.yellow, len = 1.4 }) => {
  if (age < 0 || age > len) return null;
  const s = sp(age, fps, "bouncy");
  const shake = Math.sin(age * 80) * interpolate(age, [0, 0.3], [10, 0], clamp);
  return (
    <div style={{ position: "absolute", left: x + shake, top: y, transform: `translate(-50%, -50%) rotate(${rot}deg) skewX(-10deg) scale(${interpolate(s, [0, 1], [0.2, 1])})`, opacity: out(age, len, 0.25), fontFamily: WIDE, fontWeight: 900, fontSize: size, color, WebkitTextStroke: `${size * 0.09}px ${bh.ink}`, paintOrder: "stroke fill", textShadow: `${size * 0.06}px ${size * 0.07}px 0 ${bh.ink}`, whiteSpace: "nowrap", letterSpacing: "-0.02em" }}>
      {text}
    </div>
  );
};

/** Chapter card across the top: «ГЛАВА 2 · ОРУЖИЕ». */
export const Chapter: React.FC<{ age: number; fps: number; n: number; title: string }> = ({ age, fps, n, title }) => {
  if (age < 0) return null;
  const s = sp(age, fps, "snappy");
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 170, display: "flex", justifyContent: "center", transform: `translateY(${interpolate(s, [0, 1], [-160, 0])}px)` }}>
      <div style={{ display: "flex", border: `6px solid ${bh.ink}`, boxShadow: `10px 10px 0 ${bh.ink}`, transform: "rotate(-1.5deg)" }}>
        <div style={{ background: bh.red, color: bh.white, fontFamily: MONO, fontWeight: 800, fontSize: 30, padding: "10px 20px", letterSpacing: "0.12em" }}>ГЛАВА {n}</div>
        <div style={{ background: bh.paper, color: bh.ink, fontFamily: WIDE, fontWeight: 900, fontSize: 36, padding: "8px 24px" }}>{title}</div>
      </div>
    </div>
  );
};

/** Live clock HUD «20:05:14 UTC» with a blinking REC dot. */
export const Clock: React.FC<{ secs: number; t: number; x?: number; y?: number; size?: number }> = ({ secs, t, x = X0, y = 1480, size = 56 }) => {
  const h = Math.floor(secs / 3600), m = Math.floor((secs % 3600) / 60), s = Math.floor(secs % 60);
  const p = (v: number) => String(v).padStart(2, "0");
  return (
    <div style={{ position: "absolute", left: x, top: y, display: "flex", alignItems: "center", gap: 16, background: bh.ink, border: `5px solid ${bh.ink}`, padding: "8px 20px", boxShadow: `8px 8px 0 rgba(0,0,0,0.6)` }}>
      <div style={{ width: 20, height: 20, borderRadius: 10, background: bh.red, opacity: Math.sin(t * 7) > 0 ? 1 : 0.25 }} />
      <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: size, color: bh.paper, letterSpacing: "0.04em" }}>{p(h)}:{p(m)}:{p(s)}</div>
      <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: size * 0.45, color: bh.grey }}>UTC</div>
    </div>
  );
};

/** Red string between two pins, sagging and swaying. */
export const RedString: React.FC<{ a: [number, number]; b: [number, number]; draw: number; t: number }> = ({ a, b, draw, t }) => {
  if (draw <= 0) return null;
  const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2 + 60 + Math.sin(t * 2 + a[0]) * 8;
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]) * 1.15;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <path d={`M${a[0]} ${a[1]} Q${mx} ${my} ${b[0]} ${b[1]}`} fill="none" stroke={bh.string} strokeWidth={7} strokeLinecap="round" strokeDasharray={len} strokeDashoffset={len * (1 - draw)} style={{ filter: "drop-shadow(4px 6px 0 rgba(0,0,0,0.6))" }} />
      {[a, b].map(([x, y], i) => (
        <g key={i} opacity={i === 1 ? (draw > 0.95 ? 1 : 0) : 1}>
          <circle cx={x} cy={y} r={15} fill={bh.red} stroke={bh.ink} strokeWidth={4} />
          <circle cx={x - 4} cy={y - 4} r={4} fill={bh.white} opacity={0.7} />
        </g>
      ))}
    </svg>
  );
};

/** Polaroid-ish evidence print: white border, inked photo, caption strip. */
export const Print: React.FC<{ x: number; y: number; w: number; h: number; rot?: number; age: number; fps: number; label: string; sub?: string; children: React.ReactNode; tone?: "bad" | "plain"; labelSize?: number }> = ({ x, y, w, h, rot = 0, age, fps, label, sub, children, tone = "plain", labelSize = 34 }) => {
  if (age < 0) return null;
  const s = sp(age, fps, "bouncy");
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, transform: `rotate(${rot + (1 - s) * 18}deg) scale(${interpolate(s, [0, 1], [1.6, 1])})`, opacity: Math.min(1, s * 2), background: bh.paper, border: `6px solid ${bh.ink}`, boxShadow: `12px 14px 0 ${bh.ink}`, padding: 14 }}>
      <div style={{ position: "relative", width: w - 40, height: h, overflow: "hidden", background: bh.inkSoft, border: `4px solid ${bh.ink}` }}>{children}</div>
      <div style={{ marginTop: 10, fontFamily: WIDE, fontWeight: 900, fontSize: labelSize, color: tone === "bad" ? bh.red : bh.ink, whiteSpace: "nowrap", lineHeight: 1.05 }}>{label}</div>
      {sub && <div style={{ marginTop: 4, fontFamily: MONO, fontWeight: 700, fontSize: 22, color: bh.ink, opacity: 0.75, letterSpacing: "0.06em" }}>{sub}</div>}
    </div>
  );
};

/** Big money counter in comic lettering. Yellow = the one hero element. */
export const Money: React.FC<{ value: number; size?: number; color?: string; style?: React.CSSProperties; pop?: number; short?: boolean }> = ({ value, size = 140, color = bh.yellow, style, pop = 0, short = false }) => (
  <div style={{ fontFamily: WIDE, fontWeight: 900, fontSize: size, lineHeight: 1, color, WebkitTextStroke: `${size * 0.08}px ${bh.ink}`, paintOrder: "stroke fill", textShadow: `${size * 0.05}px ${size * 0.07}px 0 ${bh.ink}`, whiteSpace: "nowrap", letterSpacing: "-0.03em", transform: `scale(${1 + pop * 0.08})`, transformOrigin: "left center", ...style }}>
    {bln(value, short)}
  </div>
);

/* ------------------------------------------------------------ finale (from fedex-blackjack, recoloured) */

const Pointer: React.FC<{ x: number; y: number; pressed: boolean }> = ({ x, y, pressed }) => (
  <svg viewBox="0 0 40 52" width={58} height={76} style={{ position: "absolute", left: x - 10, top: y - 4, transform: `scale(${pressed ? 0.88 : 1})`, filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.6))" }}>
    <path d="M14 4 Q14 0 18 0 Q22 0 22 4 L22 22 L30 23 Q38 25 37 33 L35 44 Q34 50 28 50 L16 50 Q12 50 9 46 L2 34 Q0 30 4 28 Q7 27 10 30 L14 34 Z" fill={bh.white} stroke={bh.ink} strokeWidth={2.5} strokeLinejoin="round" />
  </svg>
);

/** Subscribe (pressed → «ВЫ ПОДПИСАНЫ», bell rings), like, comment bubble. */
export const Subscribe: React.FC<{ t: number; at: number; tapAt: number; fps: number; top: number; ask: string }> = ({ t, at, tapAt, fps, top, ask }) => {
  const age = t - at;
  if (age < 0) return null;
  const row = sp(age, fps);
  const subbed = t > tapAt;
  const tap = t - tapAt;
  const ring = subbed ? Math.sin(tap * 22) * interpolate(tap, [0, 0.9], [24, 0], clamp) : 0;
  const likeAt = tapAt + 0.55;
  const liked = t > likeAt;
  const likeHit = sp(t - likeAt, fps, "bouncy");
  const point = interpolate(t, [tapAt - 0.6, tapAt - 0.05], [0, 1], { easing: theme.ease.out, ...clamp });
  const bubble = sp(age - 0.35, fps, "bouncy");
  const pill: React.CSSProperties = { position: "relative", display: "inline-flex", alignItems: "center", gap: 14, height: 100, padding: "0 34px", borderRadius: 50, fontFamily: MONO, fontWeight: 800, fontSize: 34, letterSpacing: "0.05em", whiteSpace: "nowrap", border: `4px solid ${bh.ink}`, boxShadow: `0 10px 0 ${bh.ink}` };
  return (
    <div style={{ position: "absolute", left: X0, top }}>
      <div style={{ display: "flex", gap: 16, alignItems: "center", opacity: row, transform: `translateY(${interpolate(row, [0, 1], [60, 0])}px)` }}>
        <div style={{ ...pill, background: subbed ? bh.inkSoft : bh.red, color: bh.white, transform: `scale(${tap > -0.1 && tap < 0.12 ? 0.9 : 1 + (subbed ? 0 : Math.sin(t * 8) * 0.025)})` }}>
          {subbed ? "ВЫ ПОДПИСАНЫ" : "ПОДПИСАТЬСЯ"}
          <svg viewBox="0 0 24 24" width={42} height={42} style={{ transform: `rotate(${ring}deg)`, transformOrigin: "50% 15%" }}>
            <path d="M12 2a6 6 0 0 0-6 6v4l-2 3v1h16v-1l-2-3V8a6 6 0 0 0-6-6zm-2 17a2 2 0 0 0 4 0" fill={bh.white} />
          </svg>
          {!subbed && point > 0 && <Pointer x={170 + (1 - point) * 140} y={56 + (1 - point) * 140} pressed={tap > -0.1} />}
        </div>
        <div style={{ ...pill, padding: "0 28px", background: liked ? bh.yellow : bh.paper, color: bh.ink, transform: `scale(${liked ? 1 + (1 - likeHit) * 0.35 : 1})` }}>
          <svg viewBox="0 0 24 24" width={44} height={44}>
            <path d="M2 10h4v11H2zM7 10l4.2-7.6c.4-.7 1.3-.9 1.9-.4.5.4.7 1 .6 1.6L13 9h6.3c1.3 0 2.3 1.2 2 2.5l-1.6 7.4A2.5 2.5 0 0 1 17.3 21H7z" fill={liked ? bh.white : "none"} stroke={liked ? bh.white : bh.ink} strokeWidth={1.6} strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      <div style={{ marginTop: 26, opacity: Math.min(1, bubble * 1.5), transform: `translateY(${Math.sin(t * 4) * 3}px) scale(${interpolate(bubble, [0, 1], [0.5, 1])})`, transformOrigin: "left top" }}>
        <div style={{ ...pill, height: 84, fontSize: 30, background: bh.paper, color: bh.ink, borderRadius: "42px 42px 42px 8px" }}>
          <svg viewBox="0 0 24 24" width={34} height={34}><path d="M4 4h16v12H8l-4 4z" fill="none" stroke={bh.ink} strokeWidth={2.4} strokeLinejoin="round" /></svg>
          {ask}
        </div>
      </div>
    </div>
  );
};
