// Episode kit on top of dev-myth's wide stage: crisp Phosphor icons drawn as
// masks (any size, palette colour), real brand logos on glass, auto-fitted type
// so no headline ever leaves the frame, and the episode's own instruments
// (stopwatch, memory bars, size bars, layer stack, load queue, life line).
import React from "react";
import { Img, OffthreadVideo, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../theme";
import { useIn, usePunch } from "../../reel";
import { psColors as colors, psPalette as palette } from "./palette";
import { Flash, Glitch, Kinetic, SceneShell, Slam, Stamp, TopBar, WIDE, cl, media } from "../dev-myth/ui";
import { BgVideo, Hud } from "../dev-myth/fx2";
import { rnd } from "../digital-ruble/ui";
import { PRESENTER } from "./presenter";
import { LEAD, T, VO_RATE } from "./timeline";

export const I = "images/phone-slowdown/";
export const L = "images/phone-slowdown/logos/";
export const V = "media/phone-slowdown/";
export const S30 = (sec: number) => Math.round(sec * 30);
/** Scene frame of a clip second. */
export const at = (clipSec: number, lead = LEAD) => S30(T(clipSec, lead));

/** Font size so `text` in Unbounded caps fits `maxW` on one line (≈0.8em per glyph). */
export const fit = (text: string, maxW: number, maxSize: number, per = 0.8) =>
  Math.floor(Math.min(maxSize, maxW / (Math.max(4, text.length) * per)));

/* ------------------------------------------------------------------ shell */

export const PARTS = {
  hook: "20 ЛЕТ В IT · ИСПОВЕДЬ",
  p1: "ЧАСТЬ 1 · КУДА ДЕЛАСЬ СКОРОСТЬ",
  p2: "ЧАСТЬ 2 · ЗАКОН ВИРТА",
  p3: "ЧАСТЬ 3 · ПОЧЕМУ ЭТО ВЫГОДНО",
  p4: "ЧАСТЬ 4 · СЧЁТ ЗА ЖЕЛЕЗО",
  p5: "ЧАСТЬ 5 · КАК НЕ ПЛАТИТЬ",
} as const;

export const Shell: React.FC<{ part: keyof typeof PARTS; bg?: string; dim?: number; tint?: number; startFrom?: number; shake?: number; exit?: boolean; children: React.ReactNode }> = ({ part, bg, dim = 0.7, tint = 0.3, startFrom = 0, shake = 0, exit, children }) => (
  <SceneShell shake={shake} exit={exit}>
    {bg && <BgVideo src={V + bg} dim={dim} tint={tint} startFrom={startFrom} />}
    <TopBar left="ДЕНЬГИ · ПРОСТО" right={PARTS[part]} />
    {children}
  </SceneShell>
);

/** Absolute box helper. */
export const Box: React.FC<{ x: number; y: number; w?: number; z?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ x, y, w, z = 9, children, style }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, zIndex: z, ...style }}>{children}</div>
);

/** A wrapped headline that never overflows: size from its longest word and the box width. */
export const Head: React.FC<{ text: string; at?: number; x: number; y: number; w: number; size?: number; hero?: number[]; bad?: number[]; align?: "flex-start" | "center"; z?: number; oneLine?: boolean }> = ({ text, at: a = 2, x, y, w, size = 96, hero, bad, align, z, oneLine }) => {
  const longest = Math.max(...text.split(" ").map((s) => s.length));
  const s = oneLine ? fit(text, w, size, 0.84) : Math.min(size, fit("x".repeat(longest), w, size, 0.84));
  return (
    <Box x={x} y={y} w={w} z={z}>
      <Kinetic text={text} size={s} delay={a} per={3} mode="snap" lineHeight={1.02} hero={hero} bad={bad} align={align} style={{ maxWidth: w }} />
    </Box>
  );
};

/** A one-line stamp sized to fit. */
export const FitStamp: React.FC<{ text: string; at: number; x: number; y: number; maxW: number; size?: number; tone?: "hero" | "bad"; rotate?: number }> = ({ text, at: a, x, y, maxW, size = 110, tone = "bad", rotate = -3 }) => {
  const frame = useCurrentFrame();
  const p = useIn(a, "snappy");
  if (frame < a) return null;
  const s = fit(text, maxW - 60, size, 0.86);
  // the kit's stamp lands from 2.4×; cap the overshoot at 1.15× so it never leaves the frame
  const inner = interpolate(p, [0, 1], [2.4, 1]);
  return (
    <Box x={x} y={y} z={11}>
      <div style={{ display: "inline-block", transform: `scale(${interpolate(p, [0, 1], [1.15, 1]) / inner})` }}>
        <Stamp tone={tone} size={s} rotate={rotate} delay={a}>{text}</Stamp>
      </div>
    </Box>
  );
};

/** A big number, slammed (optionally rolling), sized to fit `maxW`. */
export const Big: React.FC<{ text: string; at: number; x: number; y: number; maxW: number; size?: number; bad?: boolean; roll?: { from: number; to: number; suffix?: string; prefix?: string } }> = ({ text, at: a, x, y, maxW, size = 200, bad, roll }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // Slam lands from 2.2× (origin left); cap it at 1.12× so the figure stays inside its box
  const p = spring({ frame: frame - a, fps, config: theme.spring.snappy });
  const inner = interpolate(p, [0, 1], [2.2, 1]);
  return (
    <Box x={x} y={y} z={10}>
      <div style={{ transformOrigin: "left center", transform: `scale(${interpolate(p, [0, 1], [1.12, 1]) / inner})` }}>
        <Slam text={text} at={a} size={fit(text, maxW, size, 0.78)} color={bad ? colors.bad : palette.primary} roll={roll} />
      </div>
    </Box>
  );
};

/** Paper tag: the caption under a figure. */
export const Tag: React.FC<{ children: React.ReactNode; at: number; x: number; y: number; tone?: "paper" | "bad" | "lime"; size?: number; rotate?: number }> = ({ children, at: a, x, y, tone = "paper", size = 24, rotate = -1.5 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - a, fps, config: theme.spring.snappy });
  if (frame < a) return null;
  const bg = tone === "bad" ? colors.bad : tone === "lime" ? palette.primary : colors.paper;
  const fg = tone === "bad" ? colors.white : colors.ink;
  return (
    <Box x={x} y={y} z={11}>
      <div style={{ display: "inline-block", padding: `${size * 0.36}px ${size * 0.7}px`, background: bg, color: fg, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: size, letterSpacing: "0.08em", whiteSpace: "nowrap", boxShadow: colors.paperShadow, opacity: Math.min(1, p * 1.5), transform: `translateX(${interpolate(p, [0, 1], [-50, 0])}px) rotate(${rotate}deg)` }}>{children}</div>
    </Box>
  );
};

/* ------------------------------------------------------------------ icons and logos */

/** A Phosphor icon (public/images/phone-slowdown/icons/<name>.svg) painted through a mask. */
export const Icon: React.FC<{ n: string; s: number; c?: string; glow?: boolean; style?: React.CSSProperties }> = ({ n, s, c = palette.primary, glow, style }) => {
  const url = `url(${media(I + "icons/" + n + ".svg")})`;
  return (
    <div style={{ width: s, height: s, background: c, WebkitMaskImage: url, maskImage: url, WebkitMaskSize: "contain", maskSize: "contain", WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat", WebkitMaskPosition: "center", maskPosition: "center", filter: glow ? `drop-shadow(0 0 ${s * 0.25}px ${c === colors.bad ? colors.badGlow : palette.glow})` : undefined, flexShrink: 0, ...style }} />
  );
};

/** Glass tile with a round icon badge and a label: the modern chip. */
export const IconChip: React.FC<{ at: number; x: number; y: number; icon: string; text: string; tone?: "lime" | "bad" | "plain"; size?: number; drift?: boolean }> = ({ at: a, x, y, icon, text, tone = "plain", size = 30, drift = true }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - a, fps, config: theme.spring.bouncy });
  if (frame < a) return null;
  const c = tone === "bad" ? colors.bad : palette.primary;
  const dx = drift ? Math.sin((frame + x) / 37) * 8 : 0;
  const dy = drift ? Math.cos((frame + y) / 45) * 6 : 0;
  return (
    <div style={{ position: "absolute", left: x, top: y, zIndex: 10, transform: `translate(${dx}px, ${dy}px) scale(${interpolate(p, [0, 1], [0.5, 1])})`, opacity: Math.min(1, p * 1.5), display: "flex", alignItems: "center", gap: size * 0.5, padding: `${size * 0.32}px ${size * 0.8}px ${size * 0.32}px ${size * 0.32}px`, borderRadius: 999, background: "rgba(14,18,22,0.9)", border: `1.5px solid ${tone === "plain" ? "rgba(230,240,225,0.22)" : c + "99"}`, boxShadow: `0 18px 50px -18px rgba(0,0,0,0.9)${tone === "plain" ? "" : `, 0 0 26px ${c}33`}`, whiteSpace: "nowrap" }}>
      <div style={{ width: size * 1.7, height: size * 1.7, borderRadius: "50%", background: tone === "plain" ? "rgba(230,240,225,0.10)" : c, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon n={icon} s={size * 1.05} c={tone === "plain" ? palette.text : colors.ink2} />
      </div>
      <span style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: size, letterSpacing: "0.06em", color: palette.text }}>{text}</span>
    </div>
  );
};

/** A big icon in a glowing glass disc. */
export const IconDisc: React.FC<{ at: number; x: number; y: number; icon: string; d?: number; tone?: "lime" | "bad"; label?: string }> = ({ at: a, x, y, icon, d = 180, tone = "lime", label }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - a, fps, config: theme.spring.bouncy });
  if (frame < a) return null;
  const c = tone === "bad" ? colors.bad : palette.primary;
  const bob = Math.sin((frame + x) / 30) * 6;
  return (
    <div style={{ position: "absolute", left: x, top: y + bob, zIndex: 9, width: d, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, opacity: Math.min(1, p * 1.4), transform: `scale(${interpolate(p, [0, 1], [0.3, 1])})` }}>
      <div style={{ width: d, height: d, borderRadius: "50%", background: "rgba(14,18,22,0.9)", border: `3px solid ${c}`, boxShadow: `0 0 40px ${c}55, inset 0 0 40px ${c}22`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon n={icon} s={d * 0.52} c={c} glow />
      </div>
      {label && <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: Math.max(18, d * 0.13), letterSpacing: "0.1em", color: palette.text, whiteSpace: "nowrap" }}>{label}</div>}
    </div>
  );
};

/** A real brand logo on a glass plate. `light` for marks drawn dark (Apple, Windows 95). */
export const Logo: React.FC<{ at: number; src: string; x: number; y: number; w: number; h: number; light?: boolean; caption?: string; tilt?: number; pad?: number }> = ({ at: a, src, x, y, w, h, light, caption, tilt = 0, pad = 0.16 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - a, fps, config: theme.spring.bouncy });
  if (frame < a) return null;
  const float = Math.sin((frame + x) / 40) * 5;
  return (
    <div style={{ position: "absolute", left: x, top: y + float, width: w, zIndex: 9, opacity: Math.min(1, p * 1.4), transform: `translateY(${interpolate(p, [0, 1], [50, 0])}px) scale(${interpolate(p, [0, 1], [0.75, 1])}) rotate(${tilt}deg)` }}>
      <div style={{ width: w, height: h, boxSizing: "border-box", padding: `${h * pad}px ${w * pad * 0.7}px`, borderRadius: 26, background: light ? "rgba(244,246,240,0.97)" : "rgba(14,18,22,0.9)", border: `1.5px solid ${light ? "rgba(255,255,255,0.9)" : "rgba(230,240,225,0.22)"}`, boxShadow: `0 30px 80px -30px rgba(0,0,0,0.95), 0 0 0 1px ${palette.primary}22`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Img src={media(src)} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", display: "block" }} />
      </div>
      {caption && <div style={{ marginTop: 14, textAlign: "center", fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 22, letterSpacing: "0.1em", color: palette.text, whiteSpace: "nowrap" }}>{caption}</div>}
    </div>
  );
};

/* ------------------------------------------------------------------ the face */

type Shot = keyof typeof PRESENTER;
/** The HeyGen face full frame, lip-synced from `clipFrom` of its clip; pushed right so type sits left. */
export const Face: React.FC<{ shot: Shot; from: number; glitch?: number; push?: number; fallback: string }> = ({ shot, from, glitch = 0, push = 260, fallback }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sh = PRESENTER[shot];
  const len = Math.round((sh.duration / VO_RATE) * fps);
  const k = Math.min(Math.max(0, frame - from), len - 1);
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 2, overflow: "hidden", background: palette.bg }}>
      {sh.enabled ? (
        <Glitch amount={glitch} style={{ position: "absolute", inset: 0 }}>
          <Sequence from={from} layout="none">
            <OffthreadVideo src={media("presenter/phone-slowdown/" + sh.file)} muted playbackRate={VO_RATE} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `translateX(${push}px) scale(${1.12 + k * 0.0007})`, transformOrigin: "50% 45%" }} />
          </Sequence>
        </Glitch>
      ) : (
        <BgVideo src={V + fallback} dim={0.45} tint={0.25} />
      )}
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(90deg, ${palette.bg}F2 0%, ${palette.bg}C8 30%, ${palette.bg}30 54%, transparent 70%)` }} />
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${palette.bg}80 0%, transparent 20%, transparent 72%, ${palette.bg}E8 100%)` }} />
    </div>
  );
};

/* ------------------------------------------------------------------ instruments */

/** Seconds racing 0.0 → `to`, red once past `warn`. */
export const Seconds: React.FC<{ at: number; to: number; dur: number; size?: number; warn?: number }> = ({ at: a, to, dur, size = 200, warn = 2 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = interpolate(frame - a, [0, dur * fps], [0, to], { easing: theme.ease.inOut, ...cl });
  const c = t >= warn ? colors.bad : palette.primary;
  const done = frame - a >= dur * fps;
  return (
    <div style={{ fontFamily: WIDE, fontWeight: 900, fontSize: size, lineHeight: 1, fontVariantNumeric: "tabular-nums", color: c, textShadow: `0 0 ${size * 0.3}px ${c === colors.bad ? colors.badGlow : palette.glow}`, transform: done ? `scale(${1 + Math.sin((frame - a) / 3) * 0.015})` : undefined }}>
      {t.toFixed(1).replace(".", ",")}<span style={{ fontSize: size * 0.4 }}> С</span>
    </div>
  );
};

/** A loading spinner drawn as an arc. */
export const Spinner: React.FC<{ s: number; c?: string }> = ({ s, c = palette.text }) => {
  const frame = useCurrentFrame();
  return (
    <svg width={s} height={s} viewBox="0 0 48 48" style={{ transform: `rotate(${frame * 12}deg)` }}>
      <circle cx={24} cy={24} r={19} fill="none" stroke={c} strokeOpacity={0.18} strokeWidth={5} />
      <path d="M24 5 A19 19 0 0 1 43 24" fill="none" stroke={c} strokeWidth={5} strokeLinecap="round" />
    </svg>
  );
};

/** A modern phone (rounded slab, dynamic island) with any screen content. */
export const Handset: React.FC<{ w: number; children?: React.ReactNode; glow?: string; style?: React.CSSProperties }> = ({ w, children, glow, style }) => {
  const h = w * 2.06;
  return (
    <div style={{ position: "relative", width: w, height: h, borderRadius: w * 0.16, background: "linear-gradient(145deg,#2a3036,#0b0e11)", padding: w * 0.035, boxSizing: "border-box", boxShadow: `0 50px 100px -30px rgba(0,0,0,0.95), inset 0 0 0 2px rgba(255,255,255,0.12)${glow ? `, 0 0 60px ${glow}` : ""}`, ...style }}>
      <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: w * 0.13, overflow: "hidden", background: "#0b0f12" }}>
        {children}
        <div style={{ position: "absolute", top: w * 0.04, left: "50%", width: w * 0.3, height: w * 0.085, marginLeft: -w * 0.15, borderRadius: 999, background: "#000" }} />
      </div>
    </div>
  );
};

/** A memory bar: a block that grows to `w` from `at`, with its label. */
export const MemBar: React.FC<{ at: number; w: number; h: number; label: string; value: string; bad?: boolean; dur?: number }> = ({ at: a, w, h, label, value, bad, dur = 20 }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - a, [0, dur], [0, 1], { easing: theme.ease.out, ...cl });
  if (frame < a) return null;
  const c = bad ? colors.bad : palette.primary;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 20, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 26, letterSpacing: "0.1em", color: palette.textDim }}>
        <span style={{ color: palette.text }}>{label}</span>
        <span style={{ color: c, fontFamily: WIDE, fontSize: 44, letterSpacing: "-0.01em" }}>{value}</span>
      </div>
      <div style={{ position: "relative", width: Math.max(10, w * p), height: h, borderRadius: 8, background: `repeating-linear-gradient(90deg, ${c} 0 18px, ${c}CC 18px 22px)`, boxShadow: `0 0 30px ${c}66` }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 8, background: "linear-gradient(180deg, rgba(255,255,255,0.35), transparent 55%)" }} />
      </div>
    </div>
  );
};

/** Vertical bar chart: values rise in turn, value labels on top. */
export const BarChart: React.FC<{ at: number; items: { label: string; value: number; text: string; bad?: boolean }[]; w: number; h: number; every?: number }> = ({ at: a, items, w, h, every = 10 }) => {
  const frame = useCurrentFrame();
  const max = Math.max(...items.map((i) => i.value));
  const bw = (w / items.length) * 0.56;
  return (
    <div style={{ position: "relative", width: w, height: h + 60, display: "flex", alignItems: "flex-end", justifyContent: "space-around" }}>
      {items.map((it, i) => {
        const p = interpolate(frame - a - i * every, [0, 22], [0, 1], { easing: theme.ease.out, ...cl });
        const c = it.bad ? colors.bad : palette.primary;
        const bh = Math.max(4, (it.value / max) * h * p);
        return (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, opacity: p > 0 ? 1 : 0 }}>
            <div style={{ fontFamily: WIDE, fontWeight: 900, fontSize: 46, color: c, textShadow: `0 0 20px ${c}66`, whiteSpace: "nowrap" }}>{it.text}</div>
            <div style={{ width: bw, height: bh, borderRadius: "10px 10px 0 0", background: `linear-gradient(180deg, ${c}, ${c}88)`, boxShadow: `0 0 40px ${c}55` }} />
            <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 24, letterSpacing: "0.1em", color: palette.text }}>{it.label}</div>
          </div>
        );
      })}
    </div>
  );
};

/** Punch flashes on the listed frames (one per slam). */
export const Hits: React.FC<{ at: number[]; bad?: number[] }> = ({ at: frames, bad = [] }) => (
  <>
    {frames.map((f, i) => <HitFlash key={i} at={f} />)}
    {bad.map((f, i) => <HitFlash key={`b${i}`} at={f} color={colors.bad} />)}
  </>
);
const HitFlash: React.FC<{ at: number; color?: string }> = ({ at: a, color }) => {
  const p = usePunch(a, 12);
  return <Flash amount={p.energy * 0.7} color={color} />;
};

/** A field of drifting 0/1 and size labels: the bloat weather. */
export const BloatRain: React.FC<{ at: number; items: string[] }> = ({ at: a, items }) => {
  const frame = useCurrentFrame();
  const k = frame - a;
  if (k < 0) return null;
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none" }}>
      {Array.from({ length: 22 }, (_, i) => {
        const x = 60 + rnd(i * 3) * 1780;
        const y = -80 + ((k * (3 + rnd(i * 5) * 5) + rnd(i * 7) * 1200) % 1200);
        return <div key={i} style={{ position: "absolute", left: x, top: y, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 22 + rnd(i) * 22, color: i % 5 === 0 ? colors.bad : palette.primary, opacity: 0.16 + rnd(i * 9) * 0.2 }}>{items[i % items.length]}</div>;
      })}
    </div>
  );
};

/** A screenshot sized to its own aspect, never cropped or zoomed: a white sheet, HUD-framed, floating. */
export const Shot: React.FC<{ src: string; at: number; x: number; y: number; w: number; ratio: number; label: string; meta: string; tilt?: number }> = ({ src, at: a, x, y, w, ratio, label, meta, tilt = -4 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - a, fps, config: theme.spring.smooth });
  if (frame < a) return null;
  const h = Math.round(w / ratio);
  const float = Math.sin((frame + x) / 40) * 5;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, zIndex: 7, perspective: 1400, opacity: Math.min(1, p * 1.4) }}>
      <div style={{ position: "absolute", inset: 0, transform: `translateY(${interpolate(p, [0, 1], [60, 0]) + float}px) rotateY(${interpolate(p, [0, 1], [tilt * 4 + 20, tilt])}deg)` }}>
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", borderRadius: 14, background: "#ffffff", boxShadow: `0 40px 90px -30px rgba(0,0,0,0.95), 0 0 0 1px ${palette.primary}33` }}>
          <Img src={media(I + src)} style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }} />
        </div>
        <Hud label={label} meta={meta} />
      </div>
    </div>
  );
};
