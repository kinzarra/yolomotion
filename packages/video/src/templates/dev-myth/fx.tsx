// Part-1 primitives for the wide stage: a graded still, typed code, the
// binary grid, the wand and its sparks, a browser mock with a cursor, a
// Jira card, a file tree and the glass tower. Drawn in the series palette;
// no third colour.
import React from "react";
import { Img, OffthreadVideo, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../theme";
import { useIn } from "../../reel";
import { rnd } from "../digital-ruble/ui";
import { devMythColors as colors, devMythPalette as palette } from "./palette";
import { STAGE, cl, media } from "./ui";
import { Sym } from "./sym";

/** A photo full-frame, graded like the clips: slow Ken Burns, lime multiply, dark gradient. */
export const Still: React.FC<{ src: string; from?: number; to?: number; pan?: [number, number]; dim?: number; tint?: number; frames?: number }> = ({ src, from = 1.04, to = 1.16, pan = [-60, -30], dim = 0.35, tint = 0.45, frames }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const len = frames ?? durationInFrames;
  const p = interpolate(frame, [0, len], [0, 1], { easing: theme.ease.inOut, ...cl });
  const whip = interpolate(frame, [0, 8], [1.3, 1], { easing: theme.ease.out, ...cl });
  const blur = interpolate(frame, [0, 7], [14, 0], { easing: theme.ease.out, ...cl });
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <Img src={media(src)} style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", objectFit: "cover", transform: `translate(${pan[0] * p}px, ${pan[1] * p}px) scale(${(from + (to - from) * p) * whip})`, filter: `grayscale(0.85) contrast(1.25) brightness(${1 - dim}) blur(${blur}px)` }} />
      <div style={{ position: "absolute", inset: 0, background: palette.primary, mixBlendMode: "multiply", opacity: tint }} />
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${palette.bg}E8 0%, ${palette.bg}30 24%, ${palette.bg}30 62%, ${palette.bg}F2 92%)` }} />
    </div>
  );
};

/** Raw code typed one character a frame from `at`; no window chrome. */
export const CodeBlock: React.FC<{ at: number; lines: string[]; speed?: number; size?: number; width: number; label?: string; accent?: RegExp }> = ({ at, lines, speed = 1.6, size = 26, width, label, accent }) => {
  const frame = useCurrentFrame();
  let budget = Math.max(0, Math.floor((frame - at) * speed));
  const shown = lines.map((l) => {
    const n = Math.min(l.length, Math.max(0, budget));
    budget -= n;
    return l.slice(0, n);
  });
  const typing = shown.findIndex((s, i) => s.length < lines[i].length);
  const blink = Math.floor(frame / 8) % 2 === 0;
  return (
    <div style={{ width, fontFamily: theme.fonts.mono, fontSize: size, lineHeight: 1.5, color: palette.text, fontWeight: 600 }}>
      {label && <div style={{ display: "inline-block", marginBottom: 14, padding: "6px 14px", background: colors.paper, color: colors.ink, fontSize: 22, fontWeight: 800, letterSpacing: "0.12em" }}>{label}</div>}
      {shown.map((s, i) => (
        <div key={i} style={{ whiteSpace: "pre", minHeight: size * 1.5, opacity: s.length ? 1 : 0 }}>
          {accent ? s.split(accent).map((part, k) => <span key={k} style={{ color: k % 2 === 1 ? palette.primary : undefined }}>{part}</span>) : s}
          {typing === i && blink && <span style={{ display: "inline-block", width: size * 0.55, height: size * 1.1, background: palette.text, verticalAlign: "-0.2em" }} />}
        </div>
      ))}
    </div>
  );
};

/** A field of 0/1 fading in over the frame: the city turning into data. */
export const BinaryGrid: React.FC<{ at: number; opacity?: number }> = ({ at, opacity = 0.55 }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - at, [0, 24], [0, 1], { easing: theme.ease.out, ...cl });
  if (p <= 0) return null;
  const cols = 40;
  const rows = 22;
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 3, display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: 30, color: palette.primary, opacity: opacity * p, pointerEvents: "none" }}>
      {Array.from({ length: cols * rows }, (_, i) => {
        const r = rnd(i * 7 + Math.floor(frame / 6) * 3);
        const show = rnd(i * 13) < p;
        return <div key={i} style={{ textAlign: "center", opacity: show ? 0.35 + rnd(i) * 0.65 : 0 }}>{r > 0.5 ? "1" : "0"}</div>;
      })}
    </div>
  );
};

/** The wand: a stroke that swings in, and a burst of sparks that turn into code glyphs. */
export const Wand: React.FC<{ at: number; x: number; y: number }> = ({ at, x, y }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const k = frame - at;
  if (k < 0) return null;
  const swing = spring({ frame: k, fps, config: theme.spring.smooth });
  const rot = interpolate(swing, [0, 1], [-70, 12]);
  const burst = interpolate(k, [10, 40], [0, 1], { easing: theme.ease.out, ...cl });
  const glyphs = ["{", "}", ";", "<", "/>", "=>", "()", "[]", "&&", "::", "fn", "const", "if", "=", "::", "<div>"];
  return (
    <div style={{ position: "absolute", left: x, top: y, zIndex: 6 }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 420, height: 14, borderRadius: 7, background: `linear-gradient(90deg, ${colors.paperShade}, ${colors.paper})`, transformOrigin: "0% 50%", transform: `rotate(${rot}deg)`, boxShadow: colors.paperShadow }} />
      {k >= 10 &&
        Array.from({ length: 26 }, (_, i) => {
          const a = rnd(i * 3) * Math.PI * 2;
          const d = (120 + rnd(i * 5) * 420) * burst;
          const tipX = Math.cos((rot * Math.PI) / 180) * 420;
          const tipY = Math.sin((rot * Math.PI) / 180) * 420;
          const isGlyph = burst > 0.45 + rnd(i * 11) * 0.3;
          return (
            <div key={i} style={{ position: "absolute", left: tipX + Math.cos(a) * d, top: tipY + Math.sin(a) * d, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: isGlyph ? 28 + rnd(i) * 18 : 10, color: palette.primary, opacity: 1 - burst * 0.4, textShadow: `0 0 18px ${palette.glow}`, transform: `rotate(${(rnd(i * 2) - 0.5) * 40 * burst}deg)` }}>
              {isGlyph ? glyphs[i % glyphs.length] : <Sym c="●" />}
            </div>
          );
        })}
    </div>
  );
};

/** A site wireframe assembling block by block from `at`. */
export const Wireframe: React.FC<{ at: number; x: number; y: number; w: number }> = ({ at, x, y, w }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const blocks = [
    { l: 0, t: 0, w: 1, h: 0.08 },
    { l: 0, t: 0.1, w: 0.62, h: 0.34 },
    { l: 0.66, t: 0.1, w: 0.34, h: 0.34 },
    { l: 0, t: 0.48, w: 0.3, h: 0.3 },
    { l: 0.35, t: 0.48, w: 0.3, h: 0.3 },
    { l: 0.7, t: 0.48, w: 0.3, h: 0.3 },
    { l: 0.3, t: 0.84, w: 0.4, h: 0.12 },
  ];
  const h = w * 0.62;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, zIndex: 5 }}>
      {blocks.map((b, i) => {
        const p = spring({ frame: frame - at - i * 4, fps, config: theme.spring.snappy });
        const hero = i === blocks.length - 1;
        return <div key={i} style={{ position: "absolute", left: b.l * w, top: b.t * h, width: b.w * w, height: b.h * h, background: hero ? palette.primary : colors.surfaceLift, border: `2px solid ${hero ? palette.primary : colors.lineStrong}`, opacity: p, transform: `scale(${interpolate(p, [0, 1], [0.6, 1])})`, boxShadow: hero ? `0 0 30px ${palette.glow}` : undefined }} />;
      })}
    </div>
  );
};

/** A browser window with one grey button and a cursor that clicks it to no effect. */
export const Browser: React.FC<{ at: number; clickAt: number; width: number; label: string }> = ({ at, clickAt, width, label }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - at, fps, config: theme.spring.smooth });
  const move = interpolate(frame, [clickAt - 18, clickAt], [0, 1], { easing: theme.ease.inOut, ...cl });
  const click = frame >= clickAt && frame < clickAt + 6;
  const shakeNo = frame >= clickAt + 4 && frame < clickAt + 22 ? Math.sin((frame - clickAt) * 1.6) * 8 : 0;
  const h = width * 0.6;
  return (
    <div style={{ position: "relative", width, height: h, background: colors.surfaceStrong, border: `2px solid ${colors.lineStrong}`, boxShadow: colors.shadow, opacity: p, transform: `translateY(${interpolate(p, [0, 1], [40, 0])}px)` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 18px", background: colors.surfaceLift, borderBottom: `1px solid ${colors.line}` }}>
        {[0, 1, 2].map((i) => <span key={i} style={{ width: 12, height: 12, borderRadius: 6, background: colors.lineStrong }} />)}
        <span style={{ marginLeft: 12, flex: 1, height: 22, background: colors.surfaceStrong, border: `1px solid ${colors.line}` }} />
      </div>
      <div style={{ padding: 28 }}>
        <div style={{ width: "55%", height: 26, background: colors.lineStrong, marginBottom: 14 }} />
        <div style={{ width: "80%", height: 14, background: colors.line, marginBottom: 8 }} />
        <div style={{ width: "70%", height: 14, background: colors.line, marginBottom: 30 }} />
        <div style={{ display: "inline-block", padding: "16px 34px", background: colors.paperShade, color: colors.inkFaded, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 24, letterSpacing: "0.1em", transform: `translateX(${shakeNo}px) scale(${click ? 0.95 : 1})`, opacity: 0.8 }}>
          {label}
        </div>
      </div>
      {/* the cursor */}
      <svg width={40} height={48} viewBox="0 0 20 24" style={{ position: "absolute", left: interpolate(move, [0, 1], [width - 80, 60 + 90]), top: interpolate(move, [0, 1], [h - 40, h - 70]), zIndex: 3, filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.6))" }}>
        <path d="M2 2 L2 19 L6.5 14.5 L9.5 21 L12.5 19.6 L9.6 13.2 L16 13 Z" fill={colors.white} stroke={colors.ink2} strokeWidth={1.2} />
      </svg>
    </div>
  );
};

/** A Jira-like ticket: key, title, points, sprint, and a status that walks to Blocked. */
export const Ticket: React.FC<{ at: number; width: number; statusAt: number[] }> = ({ at, width, statusAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - at, fps, config: theme.spring.snappy });
  const statuses = [["К ВЫПОЛНЕНИЮ", colors.lineStrong], ["В РАБОТЕ", palette.primary], ["ЗАБЛОКИРОВАНО", colors.bad]] as const;
  const idx = statusAt.filter((s) => frame >= s).length - 1;
  const st = statuses[Math.max(0, Math.min(2, idx))];
  const pop = useIn(statusAt[Math.max(0, Math.min(2, idx))] ?? 0, "snappy");
  const row = (k: string, v: React.ReactNode) => (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderTop: `1px solid ${colors.line}`, fontSize: 22 }}>
      <span style={{ color: palette.textDim }}>{k}</span>
      <span style={{ fontWeight: 800 }}>{v}</span>
    </div>
  );
  return (
    <div style={{ width, padding: 24, background: colors.surfaceStrong, border: `2px solid ${colors.lineStrong}`, boxShadow: colors.shadow, fontFamily: theme.fonts.mono, color: palette.text, opacity: p, transform: `translateY(${interpolate(p, [0, 1], [60, 0])}px) scale(${interpolate(p, [0, 1], [0.9, 1])})` }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 20, color: palette.textDim, letterSpacing: "0.12em", marginBottom: 10 }}>
        <span>DEV-1042 · ЗАДАЧА</span>
        <span>СПРИНТ 14</span>
      </div>
      <div style={{ fontSize: 30, fontWeight: 800, marginBottom: 16 }}>Добавить кнопку «Купить»</div>
      {row("ОЦЕНКА", "8 STORY POINTS")}
      {row("СРОК", "2 НЕДЕЛИ")}
      {row("ИСПОЛНИТЕЛЬ", "backend + frontend + QA")}
      <div style={{ marginTop: 16, display: "inline-block", padding: "8px 16px", background: st[1], color: st[1] === colors.lineStrong ? palette.text : colors.ink2, fontWeight: 800, fontSize: 22, letterSpacing: "0.1em", transform: `scale(${interpolate(pop, [0, 1], [1.3, 1])})` }}>
        {st[0]}
      </div>
    </div>
  );
};

/** A file tree that grows one line every `every` frames from `at`. */
export const FileTree: React.FC<{ at: number; every?: number; files: string[]; width: number }> = ({ at, every = 5, files, width }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ width, fontFamily: theme.fonts.mono, fontSize: 26, lineHeight: 1.45, color: palette.text, fontWeight: 600 }}>
      {files.map((f, i) => {
        const p = spring({ frame: frame - at - i * every, fps, config: theme.spring.snappy });
        const depth = f.length - f.trimStart().length;
        const dir = f.trim().endsWith("/");
        return (
          <div key={i} style={{ opacity: p, transform: `translateX(${interpolate(p, [0, 1], [-20, 0])}px)`, paddingLeft: depth * 14, color: dir ? palette.textDim : palette.text, whiteSpace: "pre" }}>
            <span style={{ color: palette.primary, marginRight: 10 }}>{dir ? <Sym c="▸" /> : "+"}</span>
            {f.trim()}
          </div>
        );
      })}
    </div>
  );
};

/** A glass tower of lit windows with a label, and cracks that draw across it from `crackAt`. */
export const Tower: React.FC<{ x: number; y: number; w: number; h: number; label: string; crackAt?: number }> = ({ x, y, w, h, label, crackAt }) => {
  const frame = useCurrentFrame();
  const cols = 10;
  const rows = Math.floor(h / (w / cols));
  const cell = w / cols;
  const crack = crackAt === undefined ? 0 : interpolate(frame - crackAt, [0, 14], [0, 1], { easing: theme.ease.out, ...cl });
  const cracks = [
    "M 0.52 0 L 0.47 0.18 L 0.58 0.3 L 0.5 0.46 L 0.61 0.6 L 0.55 0.78 L 0.64 1",
    "M 0.2 0.3 L 0.3 0.42 L 0.26 0.55 L 0.38 0.7 L 0.33 0.9",
    "M 0.85 0.15 L 0.78 0.33 L 0.86 0.5 L 0.76 0.66",
  ];
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h + 70, zIndex: 4 }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: w, textAlign: "center", fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 24, letterSpacing: "0.16em", color: palette.textDim }}>{label}</div>
      <div style={{ position: "absolute", left: 0, top: 50, width: w, height: h, background: colors.surfaceStrong, border: `2px solid ${colors.lineStrong}`, overflow: "hidden", transform: crack > 0 ? `translate(${Math.sin(frame * 2) * 4 * (1 - crack)}px, 0)` : undefined }}>
        {Array.from({ length: cols * rows }, (_, i) => {
          const lit = rnd(i * 17 + Math.floor(frame / 20)) > 0.55;
          return <div key={i} style={{ position: "absolute", left: (i % cols) * cell + 4, top: Math.floor(i / cols) * cell + 4, width: cell - 8, height: cell - 8, background: lit ? palette.primary : colors.surfaceLift, opacity: lit ? 0.35 + rnd(i) * 0.3 : 1 }} />;
        })}
        {crack > 0 && (
          <svg viewBox="0 0 1 1" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
            {cracks.map((d, i) => (
              <path key={i} d={d} fill="none" stroke={colors.bad} strokeWidth={0.012} vectorEffect="non-scaling-stroke" style={{ strokeDasharray: 4, strokeDashoffset: 4 * (1 - Math.min(1, crack * 1.4 - i * 0.15)) }} strokeLinecap="round" />
            ))}
          </svg>
        )}
      </div>
    </div>
  );
};

/** A kit banknote falling and tumbling: `n` of them, seeded, from `at`. */
export const NoteRain: React.FC<{ at: number; count?: number; children: (i: number) => React.ReactNode }> = ({ at, count = 14, children }) => {
  const frame = useCurrentFrame();
  const k = frame - at;
  if (k < 0) return null;
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none" }}>
      {Array.from({ length: count }, (_, i) => {
        const x = 40 + rnd(i * 3) * (STAGE.w - 320);
        const speed = 7 + rnd(i * 5) * 8;
        const y = -260 + ((k * speed + rnd(i * 7) * 900) % (STAGE.h + 500));
        const rot = (rnd(i * 11) - 0.5) * 60 + Math.sin(k / 9 + i) * 14;
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y, transform: `rotate(${rot}deg) scale(${0.5 + rnd(i * 13) * 0.4})`, opacity: 0.9 }}>
            {children(i)}
          </div>
        );
      })}
    </div>
  );
};

/**
 * A neon brain (notes 8, 18, 19): the folds of a real brain model (Pexels
 * 6192331), high-passed into a mask, lit in `color`, flickering like a tube
 * and swept by a scan band; the model itself sits faint underneath.
 */
export const NeonBrain: React.FC<{ at: number; w: number; color: string; seed?: number }> = ({ at, w, color, seed = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const k = frame - at;
  if (k < 0) return null;
  const p = spring({ frame: k, fps, config: theme.spring.bouncy });
  const h = w * (1082 / 873);
  const tube = rnd(Math.floor(frame / 2) * 7 + seed) < 0.07 ? 0.35 : 0.82 + 0.18 * Math.sin(frame * 0.7 + seed);
  const ignite = interpolate(k, [0, 2, 3, 5, 6, 10], [0, 1, 0.2, 1, 0.4, 1], cl);
  const scan = ((k * 2.2) % 140) - 20;
  const mask = `url(${media("images/dev-myth/brain-lines.png")})`;
  const masked = (bg: string, op: number) => (
    <div style={{ position: "absolute", inset: 0, background: bg, opacity: op, WebkitMaskImage: mask, maskImage: mask, WebkitMaskSize: "100% 100%", maskSize: "100% 100%" }} />
  );
  return (
    <div style={{ position: "relative", width: w, height: h, transform: `scale(${interpolate(p, [0, 1], [0.5, 1])}) rotate(${Math.sin(frame / 22 + seed) * 3}deg)`, opacity: Math.min(1, p * 1.5) }}>
      <Img src={media("images/dev-myth/brain.png")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.18, filter: "grayscale(1) brightness(0.7)" }} />
      <div style={{ position: "absolute", inset: 0, filter: `drop-shadow(0 0 6px ${color}) drop-shadow(0 0 22px ${color}) drop-shadow(0 0 48px ${color}88)` }}>
        {masked(color, tube * ignite)}
        {masked(`linear-gradient(180deg, transparent ${scan - 12}%, ${colors.white} ${scan}%, transparent ${scan + 12}%)`, 0.9 * ignite)}
      </div>
    </div>
  );
};

/** A logo on a dark tile with its name in mono: the AI labs, the stacks. */
export const LogoCard: React.FC<{ at: number; src: string; name: string; size?: number; hero?: boolean; w?: number }> = ({ at, src, name, size = 120, hero = false, w }) => {
  const width = w ?? size * 1.9; // notes 32, 34: every tile the same width and height
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - at, fps, config: theme.spring.bouncy });
  if (frame < at) return null;
  return (
    <div style={{ width, height: size * 1.75, boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, padding: `${size * 0.18}px ${size * 0.12}px`, background: colors.surfaceStrong, border: `2px solid ${hero ? palette.primary : colors.lineStrong}`, boxShadow: hero ? `0 0 40px ${palette.glow}` : colors.shadow, opacity: Math.min(1, p * 1.4), transform: `translateY(${interpolate(p, [0, 1], [80, 0])}px) scale(${interpolate(p, [0, 1], [0.6, 1])})` }}>
      <Img src={media(src)} style={{ width: size, height: size, objectFit: "contain", filter: "drop-shadow(0 6px 18px rgba(0,0,0,0.6))" }} />
      <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: Math.max(16, size * 0.17), letterSpacing: "0.08em", color: palette.text, whiteSpace: "nowrap" }}>{name}</div>
    </div>
  );
};

/** A cut-out with a thick white sticker outline (note 13: «обведи жирным белой линией»). */
export const Outlined: React.FC<{ src: string; w: number; px?: number; style?: React.CSSProperties }> = ({ src, w, px = 10, style }) => {
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1], [0.7, 0.7], [-0.7, 0.7], [0.7, -0.7], [-0.7, -0.7]];
  const outline = dirs.map(([x, y]) => `drop-shadow(${(x * px).toFixed(1)}px ${(y * px).toFixed(1)}px 0 ${colors.white})`).join(" ");
  return <Img src={media(src)} style={{ width: w, display: "block", filter: `${outline} drop-shadow(0 30px 40px rgba(0,0,0,0.7))`, ...style }} />;
};

/** A falling line chart: one series, one red label, drawn from `at` (note 16). */
export const DropChart: React.FC<{ at: number; w: number; h: number; points: number[]; label: string; value: string; source: string }> = ({ at, w, h, points, label, value, source }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - at, [0, 26], [0, 1], { easing: theme.ease.out, ...cl });
  if (frame < at) return null;
  const max = Math.max(...points), min = Math.min(...points);
  const xy = points.map((v, i) => [(i / (points.length - 1)) * (w - 40) + 20, 20 + (1 - (v - min) / (max - min || 1)) * (h - 60)]);
  const d = xy.map(([x, y], i) => `${i ? "L" : "M"} ${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const [lx, ly] = xy[xy.length - 1];
  return (
    <div style={{ position: "relative", width: w, height: h + 50, opacity: Math.min(1, p * 3) }}>
      <div style={{ display: "flex", gap: 14, alignItems: "baseline", fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 24, letterSpacing: "0.1em", color: palette.textDim, marginBottom: 6 }}>
        <span style={{ color: palette.text }}>{label}</span>
        <span style={{ color: colors.bad, fontSize: 40 }}>{value}</span>
        <span style={{ fontSize: 18 }}>{source}</span>
      </div>
      <svg width={w} height={h} style={{ display: "block" }}>
        {[0.25, 0.5, 0.75].map((g) => <line key={g} x1={0} x2={w} y1={h * g} y2={h * g} stroke={colors.line} strokeWidth={1} />)}
        <path d={d} fill="none" stroke={colors.bad} strokeWidth={7} strokeLinejoin="round" strokeLinecap="round" strokeDasharray={3000} strokeDashoffset={3000 * (1 - p)} style={{ filter: `drop-shadow(0 0 10px ${colors.badGlow})` }} />
        {p > 0.95 && <circle cx={lx} cy={ly} r={12} fill={colors.bad} />}
      </svg>
    </div>
  );
};

/**
 * The author's face (HeyGen, lip-synced to the house clip from its 0), full
 * frame, pushed right so the left third carries type; cuts in hard, cuts out
 * hard. `from` is the scene frame the voice line starts on.
 */
export const FaceShot: React.FC<{ file: string; duration: number; rate: number; from: number; push?: number; children?: React.ReactNode }> = ({ file, duration, rate, from, push = 230, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const len = Math.round((duration / rate) * fps);
  const k = frame - from;
  if (k < 0 || k >= len) return null;
  const tear = interpolate(k, [0, 1, 6], [1, 1, 0], cl) + interpolate(k, [len - 5, len - 1], [0, 1], cl);
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 20, overflow: "hidden", background: palette.bg }}>
      <Sequence from={from} layout="none">
        <OffthreadVideo src={media("presenter/dev-myth/" + file)} muted playbackRate={rate} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `translateX(${push}px) scale(${1.14 + k * 0.0007})`, transformOrigin: "50% 45%", filter: `blur(${tear * 6}px)` }} />
      </Sequence>
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(90deg, ${palette.bg}F5 0%, ${palette.bg}D0 28%, ${palette.bg}40 52%, transparent 70%)` }} />
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${palette.bg}80 0%, transparent 22%, transparent 70%, ${palette.bg}E0 100%)` }} />
      <div style={{ position: "absolute", inset: 0, background: palette.primary, mixBlendMode: "screen", opacity: tear * 0.25 }} />
      {children}
    </div>
  );
};

/** A cut-out video (alpha WebM from video-matte.swift) with a white sticker outline. */
export const CutVideo: React.FC<{ src: string; w: number; from?: number; bright?: number; px?: number; style?: React.CSSProperties }> = ({ src, w, from = 0, bright = 1, px = 6, style }) => {
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  const outline = dirs.map(([x, y]) => `drop-shadow(${x * px}px ${y * px}px 0 ${colors.white})`).join(" ");
  return (
    <Sequence from={from} layout="none">
      <OffthreadVideo src={media(src)} muted transparent style={{ width: w, display: "block", filter: `brightness(${bright}) ${outline} drop-shadow(0 30px 40px rgba(0,0,0,0.7))`, ...style }} />
    </Sequence>
  );
};
