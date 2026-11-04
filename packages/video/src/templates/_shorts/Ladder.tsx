// The wage ladder («юла»): five stacked steps are the one object of the reel.
// The hook shows the stereotype pyramid with no numbers; every step scene
// climbs one step, lights it, morphs it to its honest width (its share of
// workers), stands real cut-out people on it, pops the who/where cards and the
// «how to climb» line; the final holds the honest shape with every step
// labelled, the pointer hopping, the stamp to the last frame. Data-driven,
// under 30 s by construction (PLAYBOOK §16).
import React from "react";
import { Img, OffthreadVideo, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../theme";
import { Reel, Scene, buildScenes, defineVoiceover, scenesDuration, useIn, usePunch } from "../../reel";
import { drColors as colors, drPalette as palette } from "../digital-ruble/palette";
import { BrandBar, Chip, Flash, Glitch, Kinetic, SceneShell, Stamp } from "../digital-ruble/ui";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const media = (f: string) => staticFile(f);

export type LadderFigure = { src: string; h: number; label: string };
export type LadderStep = {
  range: string; // headline; keep a number together with NBSP («40 000 ₽»)
  short: string; // the step's label on the final shape («ДО 40 ТЫС.»)
  share: number; // 0..1 of workers on this step
  pct: string; // «17,8%»
  count: string; // «5,1 МЛН»
  every: string; // «КАЖДЫЙ ШЕСТОЙ»
  marker?: string; // hero chip under the kicker («МЕДИАНА 73 871 ₽ ЗДЕСЬ»)
  tone: "bad" | "paper" | "hero";
  who: LadderFigure[]; // cut-outs standing on the step, 2–3
  cards: string[]; // right column: who / where, each with its number
  flags?: string[]; // images/<id>/flag-*.svg, white cards in the evidence row
  logos?: string[]; // images/kit/*.svg
  clip?: string; // media/<id>/*.mp4, one tile in the evidence row
  up: string; // «КАК ПОДНЯТЬСЯ» line
  numbers: string[]; // particles drifting behind
  spike?: { value: string; label: string }; // the apex above the top step
  strip?: { src: string; label: string; logo?: string; pos?: string }[]; // wide photo tiles under «КАК ПОДНЯТЬСЯ», 1–2
};
export type LadderData = {
  series: string;
  episode: string;
  voiceoverDir: string;
  rate: number;
  hookRate?: number;
  hook: {
    words: string[];
    hero?: number[];
    sub: string;
    top: string;
    bottom: string;
    clip?: string;
    // a cut-out (png, height h) or, with card, a meme frame on a white card (width w)
    figure?: { src: string; h: number; caption: string; card?: boolean; w?: number };
    stamp: string;
    pointer: string;
    numbers?: string[]; // particles drifting behind the cover
    artifacts?: { photo?: string; cards: string[] }; // evidence row under the pyramid
  };
  steps: LadderStep[]; // index 0 = bottom step (5) … index 4 = top step (1)
  labels: { step: string; us: string; who: string; up: string; people: string };
  final: { line: string; stamp: string; note: string; sources: string };
};

/* ---------------------------------------------------------- timing */

export const makeLadder = (data: LadderData, D: Record<string, number>) => {
  const keys = Object.keys(D); // 01-hook, 02…06 steps bottom→top, 07-final
  const r = data.rate;
  const hr = data.hookRate ?? r;
  const v = (k: string) => (D[k] ?? 2) / r;
  const hookVoice = (D[keys[0]] ?? 5) / hr;
  // the hook scene is capped at 5.6 s (PLAYBOOK §16); a longer read runs on
  // into the first step, whose own line waits for it
  const hook = Math.min(hookVoice + 0.4, 5.6);
  const lead5 = Math.max(0.15, hookVoice + 0.3 - hook);
  const fin = v(keys[6]) + 1.6;
  let room = 2.8;
  const stepLen = (i: number) => Math.max(3.6, v(keys[i + 1]) + room + (i === 0 ? lead5 : 0.15));
  const total = () => hook + fin + [0, 1, 2, 3, 4].reduce((s, i) => s + stepLen(i), 0);
  while (total() > 29.8 && room > 0.5) room -= 0.1;
  const SCENES = buildScenes({
    hook,
    s5: stepLen(0),
    s4: stepLen(1),
    s3: stepLen(2),
    s2: stepLen(3),
    s1: stepLen(4),
    final: fin,
  });
  const order = ["hook", "s5", "s4", "s3", "s2", "s1", "final"] as const;
  const VOICEOVER = defineVoiceover(
    D,
    keys.slice(0, 7).map((file, i) => ({
      file,
      start: SCENES[order[i]].from + (i === 0 ? 0 : i === 1 ? lead5 : 0.15),
      rate: i === 0 ? hr : r,
    })),
  );
  return { SCENES, VOICEOVER, DURATION: scenesDuration(SCENES) };
};

/* ---------------------------------------------------------- geometry */

const SX = 60; // stack left edge
const SW = 500; // the widest step
const SH = 100; // step height
const GAP = 12;
const STACK_TOP = 780; // top of step 1
const N = 5;
const stepTop = (idx: number) => STACK_TOP + (N - 1 - idx) * (SH + GAP); // idx 0 = bottom step
const STEREO = [500, 440, 380, 320, 260]; // the pyramid everyone imagines, bottom → top
const MIN_W = 64;

const honestW = (steps: LadderStep[], idx: number) => {
  const max = Math.max(...steps.map((s) => s.share));
  return Math.max(MIN_W, Math.round((steps[idx].share / max) * SW));
};

const DEPTH = 16; // the slab's extrusion, up and to the right
const toneBg = (t: LadderStep["tone"]) => (t === "bad" ? colors.bad : t === "hero" ? palette.primary : colors.paper);
const toneFg = (t: LadderStep["tone"]) => (t === "bad" ? colors.white : colors.ink);

/** Mix a palette hex toward white (amt > 0) or black (amt < 0). */
const shade = (hex: string, amt: number) => {
  const n = parseInt(hex.slice(1), 16);
  const to = amt > 0 ? 255 : 0;
  const a = Math.abs(amt);
  const ch = (s: number) => Math.round(((n >> s) & 255) * (1 - a) + to * a);
  return `rgb(${ch(16)}, ${ch(8)}, ${ch(0)})`;
};
/** front gradient top/bottom, top face, side face */
const faces = (base: string) => ({ hi: shade(base, 0.14), lo: shade(base, -0.16), top: shade(base, 0.42), side: shade(base, -0.45) });

const fitWord = (s: string, max: number, width = 952) => {
  const longest = Math.max(...s.split(" ").map((w) => w.length));
  return Math.max(60, Math.min(max, Math.floor(width / (longest * 0.8))));
};

/* ---------------------------------------------------------- pieces */

const Paper: React.FC<{ children: React.ReactNode; delay?: number; size?: number; rotate?: number; style?: React.CSSProperties }> = ({ children, delay = 0, size = 26, rotate = -1, style }) => {
  const p = useIn(delay, "snappy");
  return (
    <div style={{ alignSelf: "flex-start", padding: `${size * 0.35}px ${size * 0.7}px`, background: colors.paper, color: colors.ink, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: size, letterSpacing: "0.06em", lineHeight: 1.25, boxShadow: colors.paperShadow, opacity: p, transform: `translateY(${interpolate(p, [0, 1], [16, 0])}px) rotate(${rotate}deg)`, ...style }}>
      {children}
    </div>
  );
};

/** Numbers drifting up behind everything. */
const Numbers: React.FC<{ items: string[] }> = ({ items }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}>
      {Array.from({ length: 12 }, (_, k) => {
        const y = 1900 - ((frame * (2 + (k % 3)) + k * 160) % 2000);
        const x = 30 + ((k * 211) % 980);
        return <div key={k} style={{ position: "absolute", left: x, top: y, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 28 + (k % 3) * 10, color: k % 4 === 0 ? colors.bad : palette.primary, opacity: 0.16 }}>{items[k % items.length]}</div>;
      })}
    </div>
  );
};

/** One step of the stack: an extruded block (front, top and side faces), the
 *  number in outline on dark steps, solid on lit ones. `w` is animated by the
 *  caller. `redact` puts a hidden-sum bar on a dark step (the hook). */
const Slab: React.FC<{ idx: number; w: number; mode: "dark" | "active" | "past" | "final"; tone: LadderStep["tone"]; label?: string; side?: string; glow?: boolean; redact?: boolean }> = ({ idx, w, mode, tone, label, side, glow, redact }) => {
  const frame = useCurrentFrame();
  const top = stepTop(idx);
  const dark = mode === "dark";
  const f = faces(dark ? colors.surfaceLift : toneBg(tone));
  const fg = dark ? palette.textDim : toneFg(tone);
  const opacity = mode === "past" ? 0.45 : 1;
  const breathe = mode === "active" ? 1 + Math.sin(frame / 9) * 0.006 : 1;
  const narrow = w < 220;
  const sheen = interpolate((frame + idx * 14) % 120, [0, 40], [-0.3, 1.3], { easing: theme.ease.inOut, ...clamp });
  const num = (big: boolean) => (
    <span style={{ fontFamily: theme.fonts.wide, fontWeight: 900, fontSize: big ? 58 : 54, lineHeight: 1, color: dark ? "transparent" : fg, WebkitTextStroke: dark ? `2px ${palette.textDim}` : undefined }}>{N - idx}</span>
  );
  return (
    <>
      <div style={{ position: "absolute", left: SX, top: top - DEPTH, width: w + DEPTH, height: SH + DEPTH, opacity, transform: `scaleY(${breathe})`, transformOrigin: "50% 100%", filter: glow ? `drop-shadow(0 0 26px ${palette.glow})` : mode === "active" ? `drop-shadow(0 24px 40px rgba(0,0,0,0.7))` : undefined }}>
        <svg width={w + DEPTH} height={SH + DEPTH} style={{ position: "absolute", inset: 0, display: "block", overflow: "visible" }}>
          <path d={`M0 ${DEPTH} L${DEPTH} 0 L${w + DEPTH} 0 L${w} ${DEPTH} Z`} fill={f.top} opacity={dark ? 0.55 : 1} />
          <path d={`M${w} ${DEPTH} L${w + DEPTH} 0 L${w + DEPTH} ${SH} L${w} ${SH + DEPTH} Z`} fill={f.side} />
        </svg>
        <div style={{ position: "absolute", left: 0, top: DEPTH, width: w, height: SH, boxSizing: "border-box", background: dark ? `repeating-linear-gradient(135deg, ${colors.line} 0 2px, transparent 2px 12px), linear-gradient(180deg, ${f.hi}, ${f.lo})` : `linear-gradient(180deg, ${f.hi}, ${f.lo})`, borderLeft: dark ? `4px solid ${palette.primary}55` : "none", boxShadow: `inset 0 1px 0 ${colors.lineStrong}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: narrow ? 0 : "0 22px", overflow: "hidden" }}>
          {/* a light sweep across lit steps */}
          {!dark && <div style={{ position: "absolute", top: 0, bottom: 0, width: 90, left: `${sheen * 100}%`, background: `linear-gradient(90deg, transparent, ${colors.white}38, transparent)`, transform: "skewX(-20deg)" }} />}
          {!narrow && num(!dark)}
          {!narrow && label && <span style={{ position: "relative", fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 22, color: fg, letterSpacing: "0.04em", textAlign: "right", lineHeight: 1.1 }}>{label}</span>}
          {!narrow && redact && (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: Math.min(150, w - 150), height: 26, borderRadius: 4, background: `repeating-linear-gradient(90deg, ${colors.lineStrong} 0 18px, transparent 18px 26px)`, opacity: 0.7 + Math.sin(frame / 6 + idx) * 0.2 }} />
              <span style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 26, color: palette.textDim }}>₽</span>
            </div>
          )}
        </div>
      </div>
      {narrow && (
        <div style={{ position: "absolute", left: SX + w + DEPTH + 14, top: top + 18, display: "flex", alignItems: "center", gap: 14, opacity, whiteSpace: "nowrap" }}>
          <span style={{ fontFamily: theme.fonts.wide, fontWeight: 900, fontSize: 54, color: dark ? "transparent" : palette.text, WebkitTextStroke: dark ? `2px ${palette.textDim}` : undefined, lineHeight: 1 }}>{N - idx}</span>
          {label && <span style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 22, color: palette.text, letterSpacing: "0.04em" }}>{label}</span>}
          {side && <span style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 22, color: palette.textDim, letterSpacing: "0.06em" }}>{side}</span>}
        </div>
      )}
      {side && !narrow && <div style={{ position: "absolute", left: SX + w + DEPTH + 14, top: top + 36, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 22, color: palette.textDim, letterSpacing: "0.06em", opacity, whiteSpace: "nowrap" }}>{side}</div>}
    </>
  );
};

/** Where the «ТЫ?» tag sits for a step of width w: right after the slab (or
 *  after the number beside a narrow one), never past x 440, so it stays clear
 *  of the right column; on a wide step it overlaps the slab's own end. */
const pointerX = (w: number) => (w < 220 ? SX + w + DEPTH + 14 + 62 : Math.min(SX + w + DEPTH + 10, 440));

/** A soft floor under the stack. */
const Floor: React.FC = () => (
  <div style={{ position: "absolute", left: SX - 40, top: stepTop(0) + SH - 30, width: SW + 160, height: 90, background: `radial-gradient(ellipse at 40% 50%, ${palette.glow}, transparent 70%)`, opacity: 0.35, filter: "blur(10px)" }} />
);

/** The «ТЫ?» tag: a paper flag with an arrow, right of a step's end. */
const Pointer: React.FC<{ text: string; x: number; y: number; delay?: number }> = ({ text, x, y, delay = 0 }) => {
  const frame = useCurrentFrame();
  const p = useIn(delay, "bouncy");
  const bob = Math.sin(frame / 7) * 6;
  return (
    <div style={{ position: "absolute", left: x, top: y - 30 + bob, zIndex: 7, display: "flex", alignItems: "center", opacity: p, transform: `translateX(${(1 - p) * 60}px) scale(${interpolate(p, [0, 1], [0.6, 1])})` }}>
      <svg width={34} height={60} style={{ display: "block" }}>
        <path d="M30 4 L4 30 L30 56 Z" fill={colors.bad} />
      </svg>
      <div style={{ padding: "10px 16px", background: colors.bad, color: colors.white, fontFamily: theme.fonts.wide, fontWeight: 900, fontSize: 32, lineHeight: 1, boxShadow: colors.shadow, transform: "rotate(-2deg)" }}>{text}</div>
    </div>
  );
};

/** Real people standing on the step, feet on its top edge. */
const Figures: React.FC<{ who: LadderFigure[]; idx: number; w: number; at: number }> = ({ who, idx, w, at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const n = who.length;
  const spread = Math.max(170, Math.min(230, w / Math.max(1, n)));
  const cx = SX + Math.max(w, 420) / 2;
  const foot = stepTop(idx) + 6;
  return (
    <>
      {who.map((f, i) => {
        const p = spring({ frame: frame - at - i * 6, fps, config: theme.spring.snappy });
        const x = cx + (i - (n - 1) / 2) * spread;
        const sway = Math.sin(frame / 20 + i * 1.3) * 1.6;
        return (
          <div key={f.src} style={{ position: "absolute", left: x, top: foot - f.h, zIndex: 5, opacity: Math.min(1, p * 1.4), transform: `translate(-50%, ${(1 - p) * 70}px) rotate(${sway}deg)`, transformOrigin: "50% 100%" }}>
            <Img src={media(f.src)} style={{ height: f.h, display: "block", filter: "drop-shadow(0 18px 24px rgba(0,0,0,0.75)) contrast(1.05)" }} />
            <div style={{ position: "absolute", left: "50%", bottom: 44, transform: "translateX(-50%) rotate(-2deg)", padding: "4px 10px", background: colors.paper, color: colors.ink, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 19, letterSpacing: "0.06em", whiteSpace: "nowrap", boxShadow: colors.paperShadow }}>{f.label}</div>
          </div>
        );
      })}
    </>
  );
};

/** Right column: who is here, with their numbers, popping one by one. */
const Cards: React.FC<{ head: string; items: string[]; at: number; top: number }> = ({ head, items, at, top }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: 600, width: 420, top, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 14, zIndex: 6 }}>
      <Chip delay={at - 6} tone="paper" size={20}>{head}</Chip>
      {items.map((t, i) => {
        const d = at + i * 8;
        const q = interpolate(frame - d, [0, 9], [0, 1], { easing: theme.ease.out, ...clamp });
        const pop = interpolate(frame - d, [0, 4, 10], [0, 1.1, 1], clamp);
        const bob = Math.sin(frame / 15 + i) * 3;
        return (
          <div key={t} style={{ maxWidth: 420, padding: "12px 16px", background: i % 2 ? palette.primary : colors.paper, color: colors.ink2, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 24, lineHeight: 1.25, boxShadow: colors.shadow, opacity: q, transform: `translateX(${(1 - q) * 220}px) translateY(${bob}px) rotate(${i % 2 ? 2 : -2}deg) scale(${frame >= d ? pop : 0.01})` }}>{t}</div>
        );
      })}
    </div>
  );
};

/** The evidence row: a clip tile, flags and logos on white cards. */
const Evidence: React.FC<{ clip?: string; flags?: string[]; logos?: string[]; at: number }> = ({ clip, flags, logos, at }) => {
  const frame = useCurrentFrame();
  const tiles: React.ReactNode[] = [];
  const H = 132;
  if (clip) tiles.push(
    <div style={{ width: 210, height: H, borderRadius: 14, overflow: "hidden", border: `3px solid ${colors.lineStrong}`, boxShadow: colors.shadow }}>
      <OffthreadVideo src={media(clip)} muted style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(0.3) contrast(1.1) brightness(0.85)" }} />
    </div>,
  );
  for (const f of flags ?? []) tiles.push(
    <div style={{ height: H, width: 176, padding: 10, boxSizing: "border-box", background: colors.white, borderRadius: 12, boxShadow: colors.paperShadow, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Img src={media(f)} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", display: "block" }} />
    </div>,
  );
  for (const l of logos ?? []) tiles.push(
    <div style={{ height: H, width: 220, padding: "14px 18px", boxSizing: "border-box", background: colors.white, borderRadius: 12, boxShadow: colors.paperShadow, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Img src={media(l)} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", display: "block" }} />
    </div>,
  );
  if (!tiles.length) return null;
  return (
    <div style={{ position: "absolute", left: SX, top: 1352, display: "flex", gap: 14, zIndex: 4 }}>
      {tiles.map((t, i) => {
        const q = interpolate(frame - at - i * 5, [0, 12], [0, 1], { easing: theme.ease.out, ...clamp });
        const bob = Math.sin(frame / 16 + i * 1.7) * 4;
        return <div key={i} style={{ opacity: q, transform: `translateY(${interpolate(q, [0, 1], [60, 0]) + bob}px) rotate(${(i % 2 ? 1.5 : -1.5)}deg) scale(${interpolate(q, [0, 1], [0.8, 1])})` }}>{t}</div>;
      })}
    </div>
  );
};

/** «КАК ПОДНЯТЬСЯ»: the one lever, slammed onto paper. */
const Up: React.FC<{ head: string; text: string; at: number }> = ({ head, text, at }) => {
  const frame = useCurrentFrame();
  const q = interpolate(frame - at, [0, 10], [0, 1], { easing: theme.ease.out, ...clamp });
  const slam = interpolate(frame - at, [0, 5, 11], [1.3, 0.97, 1], clamp);
  return (
    <div style={{ position: "absolute", left: SX, right: SX, top: 1506, zIndex: 6, opacity: q, transform: `scale(${frame >= at ? slam : 0.01}) rotate(-1deg)`, transformOrigin: "50% 50%" }}>
      <div style={{ background: colors.paper, color: colors.ink, boxShadow: colors.paperShadow, padding: "16px 22px 18px", display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 20, letterSpacing: "0.14em", color: colors.inkFaded }}>
          <svg width={26} height={26} style={{ display: "block" }}><path d="M13 24 V5 M4 13 L13 4 L22 13" stroke={colors.bad} strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
          {head}
        </div>
        <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 29, lineHeight: 1.2 }}>{text}</div>
      </div>
    </div>
  );
};

/** Wide photo tiles under «КАК ПОДНЯТЬСЯ»: Ken Burns, a label, an optional logo badge. */
const Strip: React.FC<{ items: NonNullable<LadderStep["strip"]>; at: number }> = ({ items, at }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const n = items.length;
  const W = Math.floor((1080 - 2 * SX - (n - 1) * 16) / n);
  return (
    <div style={{ position: "absolute", left: SX, top: 1668, display: "flex", gap: 16, zIndex: 5 }}>
      {items.map((it, i) => {
        const q = interpolate(frame - at - i * 5, [0, 12], [0, 1], { easing: theme.ease.out, ...clamp });
        const kb = interpolate(frame, [0, durationInFrames], [1.04, 1.14], { easing: theme.ease.inOut, ...clamp });
        const bob = Math.sin(frame / 17 + i * 1.9) * 3;
        return (
          <div key={it.src} style={{ position: "relative", width: W, height: 168, borderRadius: 14, overflow: "hidden", border: `3px solid ${colors.lineStrong}`, boxShadow: colors.shadow, opacity: q, transform: `translateY(${interpolate(q, [0, 1], [70, 0]) + bob}px) rotate(${i % 2 ? 1.2 : -1.2}deg) scale(${interpolate(q, [0, 1], [0.85, 1])})` }}>
            <Img src={media(it.src)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: it.pos ?? "50% 30%", transform: `scale(${kb}) translateX(${(i % 2 ? -1 : 1) * (kb - 1) * 80}px)`, filter: "contrast(1.08) saturate(0.9)" }} />
            <div style={{ position: "absolute", inset: 0, background: `linear-gradient(0deg, ${palette.bg}CC, transparent 55%)` }} />
            <div style={{ position: "absolute", left: 12, bottom: 12, padding: "5px 10px", background: colors.paper, color: colors.ink, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 20, letterSpacing: "0.05em", whiteSpace: "nowrap", boxShadow: colors.paperShadow, transform: "rotate(-1.5deg)" }}>{it.label}</div>
            {it.logo && (
              <div style={{ position: "absolute", right: 12, top: 12, width: 120, height: 64, padding: "8px 12px", boxSizing: "border-box", background: colors.white, borderRadius: 10, boxShadow: colors.paperShadow, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Img src={media(it.logo)} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", display: "block" }} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

/** Hook evidence under the pyramid: a photo tile and receipt cards with numbers. */
const Artifacts: React.FC<{ photo?: string; cards: string[]; at: number }> = ({ photo, cards, at }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const pIn = interpolate(frame - at, [0, 12], [0, 1], { easing: theme.ease.out, ...clamp });
  const kb = interpolate(frame, [0, durationInFrames], [1.05, 1.16], { easing: theme.ease.inOut, ...clamp });
  return (
    <div style={{ position: "absolute", left: SX, right: SX, top: 1420, height: 190, zIndex: 4 }}>
      {photo && (
        <div style={{ position: "absolute", left: 0, top: 6, width: 300, height: 176, borderRadius: 14, overflow: "hidden", border: `3px solid ${colors.lineStrong}`, boxShadow: colors.shadow, opacity: pIn, transform: `translateY(${interpolate(pIn, [0, 1], [60, Math.sin(frame / 15) * 4])}px) rotate(-3deg) scale(${interpolate(pIn, [0, 1], [0.8, 1])})` }}>
          <Img src={media(photo)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${kb})` }} />
        </div>
      )}
      {cards.map((t, i) => {
        const d = at + 6 + i * 6;
        const q = interpolate(frame - d, [0, 10], [0, 1], { easing: theme.ease.out, ...clamp });
        const pop = interpolate(frame - d, [0, 4, 10], [0, 1.1, 1], clamp);
        const rot = [-2, 2.5, -1.5][i % 3];
        return (
          <div key={t} style={{ position: "absolute", left: photo ? 330 + (i % 2) * 70 : i * 60, top: i * 62, padding: "10px 16px", background: i === 1 ? palette.primary : colors.paper, color: colors.ink2, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 26, letterSpacing: "0.04em", whiteSpace: "nowrap", boxShadow: colors.shadow, opacity: q, transform: `translateX(${(1 - q) * 200}px) translateY(${Math.sin(frame / 14 + i) * 3}px) rotate(${rot}deg) scale(${frame >= d ? pop : 0.01})` }}>{t}</div>
        );
      })}
    </div>
  );
};

/* ----------------------------------------------------------- scenes */

const Hook: React.FC<{ data: LadderData }> = ({ data }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const n = data.hook.words.length;
  const every = Math.round(fps * 0.42);
  // frame 0 is the cover: the question, the whole pyramid and its labels are
  // already on screen; the pointer, the figure and the stamp move after it
  const clipIn = useIn(-40, "smooth");
  const stampAt = Math.round(durationInFrames * 0.78);
  const stamp = usePunch(stampAt, 18);
  const figP = useIn(2, "bouncy");
  // the pointer hops down the pyramid while the voice promises the climb
  const hop = Math.floor(frame / 11) % N;
  const hopIdx = N - 1 - hop;
  const settle = spring({ frame: frame + 6, fps, config: theme.spring.smooth });
  return (
    <SceneShell exit={false} shake={stamp.shake * 0.7}>
      {data.hook.clip && (
        <div style={{ position: "absolute", inset: 0, opacity: 0.32 * clipIn }}>
          <OffthreadVideo src={media(data.hook.clip)} muted style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(0.6) brightness(0.5)" }} />
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${palette.bg}EE, ${palette.bg}55 45%, ${palette.bg}F2)` }} />
        </div>
      )}
      {data.hook.numbers && <Numbers items={data.hook.numbers} />}
      <BrandBar series={data.series} episode={data.episode} delay={-30} />
      <div style={{ position: "absolute", left: 64, right: 64, top: 230, display: "flex", flexDirection: "column", gap: 16 }}>
        <Kinetic text={data.hook.words.join(" ")} size={fitWord(data.hook.words.join(" "), 150)} delay={-40} per={every} mode="snap" hero={data.hook.hero} glow lineHeight={1} />
        <Paper delay={-40} size={26}>{data.hook.sub}</Paper>
      </div>
      {/* the stereotype: five dark steps, sums hidden */}
      <Floor />
      {data.steps.map((s, i) => (
        <div key={i} style={{ transform: `translateY(${(1 - settle) * 20}px)` }}><Slab idx={i} w={STEREO[i]} mode="dark" tone={s.tone} redact /></div>
      ))}
      <div style={{ position: "absolute", left: SX, top: STACK_TOP - 74 }}><Chip delay={-30} tone="hero" filled size={20}>{data.hook.top}</Chip></div>
      <div style={{ position: "absolute", left: SX, top: stepTop(0) + SH + 14 }}><Chip delay={-30} tone="bad" filled size={20}>{data.hook.bottom}</Chip></div>
      <Pointer text={data.hook.pointer} x={pointerX(STEREO[hopIdx])} y={stepTop(hopIdx) + SH / 2} delay={-20} />
      {data.hook.figure && !data.hook.figure.card && (
        <div style={{ position: "absolute", right: 40, top: stepTop(0) + SH - data.hook.figure.h, zIndex: 5, opacity: figP, transform: `translateX(${(1 - figP) * 400}px) rotate(${(1 - figP) * 20 + Math.sin(frame / 18) * 1.5}deg)`, transformOrigin: "50% 100%" }}>
          <Img src={media(data.hook.figure.src)} style={{ height: data.hook.figure.h, display: "block", filter: "drop-shadow(0 24px 30px rgba(0,0,0,0.8))" }} />
          <div style={{ position: "absolute", left: "50%", top: -10, transform: "translateX(-50%) rotate(3deg)", padding: "8px 14px", background: colors.paper, color: colors.ink, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 22, whiteSpace: "nowrap", boxShadow: colors.paperShadow }}>{data.hook.figure.caption}</div>
        </div>
      )}
      {data.hook.figure?.card && (() => {
        const w = data.hook.figure.w ?? 440;
        const kb = interpolate(frame, [0, durationInFrames], [1.0, 1.08], { easing: theme.ease.inOut, ...clamp });
        return (
          <div style={{ position: "absolute", right: 36, top: stepTop(3) - 10, zIndex: 5, width: w, padding: 10, boxSizing: "border-box", background: colors.white, boxShadow: colors.shadow, opacity: figP, transform: `translateX(${(1 - figP) * 420}px) rotate(${(1 - figP) * 18 + 3 + Math.sin(frame / 18) * 1.2}deg)` }}>
            <div style={{ width: "100%", height: data.hook.figure.h, overflow: "hidden" }}>
              <Img src={media(data.hook.figure.src)} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transform: `scale(${kb})` }} />
            </div>
            <div style={{ position: "absolute", left: "50%", top: -26, transform: "translateX(-50%) rotate(-3deg)", padding: "8px 14px", background: colors.paper, color: colors.ink, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 24, whiteSpace: "nowrap", boxShadow: colors.paperShadow }}>{data.hook.figure.caption}</div>
          </div>
        );
      })()}
      {data.hook.artifacts && <Artifacts photo={data.hook.artifacts.photo} cards={data.hook.artifacts.cards} at={Math.round(fps * 0.6)} />}
      {frame >= stampAt && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1630, display: "flex", justifyContent: "center", zIndex: 8 }}>
          <Stamp tone="hero" size={104} rotate={-6} delay={stampAt} style={{ background: `${palette.bg}E0` }}>{data.hook.stamp}</Stamp>
        </div>
      )}
      <Flash amount={stamp.energy} />
    </SceneShell>
  );
};

const Step: React.FC<{ data: LadderData; idx: number }> = ({ data, idx }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const S = data.steps[idx];
  const hit = usePunch(4, 16);
  const morph = spring({ frame: frame - 6, fps, config: theme.spring.smooth });
  const wNow = Math.round(STEREO[idx] + (honestW(data.steps, idx) - STEREO[idx]) * morph);
  const tear = interpolate(frame, [0, 1, 8], [0, 0.8, 0], clamp);
  const stampAt = Math.round(durationInFrames * 0.5);
  const stamp = usePunch(stampAt, 16);
  const upAt = Math.round(durationInFrames * 0.42);
  const prevIdx = Math.max(0, idx - 1);
  const prevW = idx === 0 ? STEREO[0] : honestW(data.steps, prevIdx);
  const climb = spring({ frame: frame - 2, fps, config: theme.spring.bouncy });
  // the pointer sits past the people standing on the step, not past the slab
  const px = pointerX(prevW) + (pointerX(wNow) - pointerX(prevW)) * climb;
  const py = stepTop(prevIdx) + SH / 2 + (stepTop(idx) - stepTop(prevIdx)) * climb;
  const zoom = 1 + interpolate(frame, [0, durationInFrames], [0, 0.04], clamp);
  const headColor = S.tone === "bad" ? colors.bad : S.tone === "hero" ? palette.primary : palette.text;
  return (
    <SceneShell shake={hit.shake * 0.7 + stamp.shake * 0.5}>
      <Numbers items={S.numbers} />
      <BrandBar series={data.series} episode={data.episode} delay={-30} />
      <div style={{ position: "absolute", left: 64, right: 64, top: 215, display: "flex", flexDirection: "column", gap: 12, zIndex: 3 }}>
        <div style={{ display: "flex", gap: 12 }}>
          <Chip delay={2} tone="paper" size={22}>{`${data.labels.step} ${N - idx}`}</Chip>
          {S.marker && <Chip delay={8} tone="hero" filled size={22}>{S.marker}</Chip>}
        </div>
        <Glitch amount={tear}>
          <Kinetic text={S.range} size={fitWord(S.range, 118)} delay={3} per={2} mode="snap" color={headColor} glow={S.tone === "hero"} lineHeight={1} />
        </Glitch>
        <Paper delay={10} size={26}>{`${S.pct} ${data.labels.us} · ${S.every}`}</Paper>
      </div>
      {/* the stack: the camera leans in a hair over the scene */}
      <div style={{ position: "absolute", inset: 0, transform: `scale(${zoom})`, transformOrigin: `${SX + wNow / 2}px ${stepTop(idx) + SH / 2}px` }}>
        <Floor />
        {data.steps.map((s, i) => {
          const mode = i < idx ? "past" : i === idx ? "active" : "dark";
          const w = i < idx ? honestW(data.steps, i) : i === idx ? wNow : STEREO[i];
          return <Slab key={i} idx={i} w={w} mode={mode} tone={s.tone} glow={i === idx && S.tone === "hero"} />;
        })}
        {S.spike && (
          <div style={{ position: "absolute", left: 600, width: 420, top: 1130, zIndex: 6, display: "flex", flexDirection: "column", alignItems: "flex-end", textAlign: "right", gap: 6, opacity: interpolate(frame, [stampAt, stampAt + 10], [0, 1], clamp), transform: `translateY(${interpolate(frame, [stampAt, stampAt + 12], [40, 0], { easing: theme.ease.out, ...clamp })}px)` }}>
            <div style={{ fontFamily: `${theme.fonts.wide}, ${theme.fonts.mono}`, fontWeight: 900, fontSize: 40, color: palette.primary, lineHeight: 1, filter: `drop-shadow(0 0 14px ${palette.glow})` }}>{S.spike.value}</div>
            <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 19, color: palette.text, letterSpacing: "0.06em" }}>{S.spike.label}</div>
          </div>
        )}
        <Figures who={S.who} idx={idx} w={wNow} at={10} />
        <Pointer text={data.hook.pointer} x={px} y={py} delay={0} />
      </div>
      <Cards head={data.labels.who} items={S.cards} at={14} top={stepTop(0) - 440} />
      {frame >= stampAt && (
        // the head count sits in the free slot under the headline, on a dark
        // backing so the drifting numbers never show through it
        <div style={{ position: "absolute", left: 560, width: 460, top: 612, zIndex: 7, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
          <Stamp tone={S.tone === "hero" ? "hero" : "bad"} size={Math.min(72, Math.floor(400 / (S.count.length * 0.8)))} rotate={-4} delay={stampAt} style={{ background: `${palette.bg}E6` }}>{S.count}</Stamp>
          <Paper delay={stampAt + 6} size={20} rotate={2} style={{ alignSelf: "flex-end" }}>{data.labels.people}</Paper>
        </div>
      )}
      <Evidence clip={S.clip} flags={S.flags} logos={S.logos} at={Math.round(durationInFrames * 0.3)} />
      <Up head={data.labels.up} text={S.up} at={upAt} />
      {S.strip && <Strip items={S.strip} at={upAt - 6} />}
      <Flash amount={hit.energy * 0.5} color={S.tone === "bad" ? colors.bad : palette.primary} />
      <Flash amount={stamp.energy * 0.8} color={S.tone === "hero" ? palette.primary : colors.bad} />
    </SceneShell>
  );
};

const Final: React.FC<{ data: LadderData }> = ({ data }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const stampAt = Math.round(durationInFrames * 0.3);
  const hit = usePunch(stampAt, 20);
  const hop = Math.floor(frame / 9) % (2 * N - 2);
  const hopIdx = hop < N ? hop : 2 * N - 2 - hop;
  const top = data.steps[N - 1];
  return (
    <SceneShell exit={false} shake={hit.shake * 0.6}>
      <BrandBar series={data.series} episode={data.episode} delay={-30} />
      <div style={{ position: "absolute", left: 64, right: 64, top: 230, display: "flex", flexDirection: "column", gap: 16, zIndex: 3 }}>
        <Kinetic text={data.final.line} size={fitWord(data.final.line, 112)} delay={2} per={2} mode="snap" hero={[data.final.line.split(" ").length - 1]} glow lineHeight={1} />
      </div>
      <Floor />
      {data.steps.map((s, i) => (
        <Slab key={i} idx={i} w={honestW(data.steps, i)} mode="final" tone={s.tone} label={s.pct} side={s.short} />
      ))}
      {top.spike && (
        <div style={{ position: "absolute", left: 600, width: 420, top: 610, zIndex: 6, display: "flex", flexDirection: "column", alignItems: "flex-end", textAlign: "right", gap: 4 }}>
          <div style={{ fontFamily: `${theme.fonts.wide}, ${theme.fonts.mono}`, fontWeight: 900, fontSize: 36, color: palette.primary, lineHeight: 1 }}>{top.spike.value}</div>
          <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 18, color: palette.textDim, letterSpacing: "0.06em" }}>{top.spike.label}</div>
        </div>
      )}
      {/* the pointer hops down and up the whole ladder in its own column */}
      <Pointer text={data.hook.pointer} x={SX + SW + 330} y={stepTop(hopIdx) + SH / 2} delay={0} />
      <div style={{ position: "absolute", left: 64, right: 64, top: 1322, display: "flex", zIndex: 6 }}>
        <Paper delay={6} size={24} rotate={-1}>{data.final.note}</Paper>
      </div>
      {frame >= stampAt && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1410, zIndex: 7, display: "flex", justifyContent: "center" }}>
          <Stamp tone="bad" size={fitWord(data.final.stamp, 84)} rotate={-5} delay={stampAt}>{data.final.stamp}</Stamp>
        </div>
      )}
      <div style={{ position: "absolute", left: 64, right: 64, top: 1600, display: "flex", flexDirection: "column", gap: 10, zIndex: 4 }}>
        <Paper delay={stampAt + 8} size={19} rotate={0}>{data.final.sources}</Paper>
      </div>
      <Flash amount={hit.energy} color={colors.bad} />
    </SceneShell>
  );
};

export const Ladder: React.FC<{ data: LadderData; D: Record<string, number> }> = ({ data, D }) => {
  const { SCENES, VOICEOVER } = makeLadder(data, D);
  return (
    <Reel palette={palette} voiceoverDir={data.voiceoverDir} voiceover={VOICEOVER} voRate={data.rate} captions={false} gradeOpacity={0.08}>
      <Scene spec={SCENES.hook} name="01 hook"><Hook data={data} /></Scene>
      <Scene spec={SCENES.s5} name="02 step 5"><Step data={data} idx={0} /></Scene>
      <Scene spec={SCENES.s4} name="03 step 4"><Step data={data} idx={1} /></Scene>
      <Scene spec={SCENES.s3} name="04 step 3"><Step data={data} idx={2} /></Scene>
      <Scene spec={SCENES.s2} name="05 step 2"><Step data={data} idx={3} /></Scene>
      <Scene spec={SCENES.s1} name="06 step 1"><Step data={data} idx={4} /></Scene>
      <Scene spec={SCENES.final} name="07 final"><Final data={data} /></Scene>
    </Reel>
  );
};
