// Episode pieces on top of the series kit: the ring of company tags, the
// arrows that draw between them (lime = investment, red = a promise to pay),
// the one big figure, the person cut-outs, the clip band, the stamp block.
// Colors / easings come from the palette and theme.
import React from "react";
import { Img, OffthreadVideo, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../theme";
import { useIn, usePunch } from "../../reel";
import { colors, palette } from "./palette";
import { Kinetic, Stamp } from "./ui";
import { Face, NODES, NodeId, Tone } from "./map";
import { FootageShot } from "./footage";

export const asset = (f: string) => staticFile(`images/ai-money-circle/${f}`);
export const footage = (s: FootageShot) => staticFile(`footage/ai-money-circle/${s}.mp4`);

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const toneColor = (tone: Tone) => (tone === "invest" ? palette.primary : colors.bad);
const toneGlow = (tone: Tone) => (tone === "invest" ? palette.glow : colors.badGlow);

/* ----------------------------------------------------------- geometry */

export type Pt = { x: number; y: number };

/** The ring: an ellipse under the figure, above the stamp. */
export const RING = { cx: 540, cy: 1000, rx: 400, ry: 320 };
export const CENTER: Pt = { x: RING.cx, y: RING.cy };
export const TAG = { w: 230, h: 70 };
export const FOCUS_SCALE = 1.4;

export const ringPos = (id: NodeId): Pt => {
  const a = (NODES[id].angle * Math.PI) / 180;
  return { x: RING.cx + RING.rx * Math.cos(a), y: RING.cy + RING.ry * Math.sin(a) };
};

/** Where a line from a tag's centre towards `to` leaves the tag's box. */
export const edgePoint = (from: Pt, to: Pt, scale = 1, pad = 12): Pt => {
  const hw = (TAG.w / 2) * scale + pad;
  const hh = (TAG.h / 2) * scale + pad;
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const t = Math.min(dx === 0 ? Infinity : Math.abs(hw / dx), dy === 0 ? Infinity : Math.abs(hh / dy));
  return { x: from.x + dx * t, y: from.y + dy * t };
};

export type Curve = { d: string; len: number; tip: Pt; dir: Pt; at: (t: number) => Pt };

/** A quadratic curve from a to b, bowed `bend` px to the right of travel. */
export const curve = (a: Pt, b: Pt, bend: number): Curve => {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const L = Math.hypot(dx, dy) || 1;
  const c = { x: (a.x + b.x) / 2 + (-dy / L) * bend, y: (a.y + b.y) / 2 + (dx / L) * bend };
  const at = (t: number): Pt => ({
    x: (1 - t) * (1 - t) * a.x + 2 * (1 - t) * t * c.x + t * t * b.x,
    y: (1 - t) * (1 - t) * a.y + 2 * (1 - t) * t * c.y + t * t * b.y,
  });
  let len = 0;
  let prev = a;
  for (let i = 1; i <= 32; i += 1) {
    const p = at(i / 32);
    len += Math.hypot(p.x - prev.x, p.y - prev.y);
    prev = p;
  }
  const near = at(0.96);
  const dl = Math.hypot(b.x - near.x, b.y - near.y) || 1;
  return { d: `M${a.x} ${a.y} Q${c.x} ${c.y} ${b.x} ${b.y}`, len, tip: b, dir: { x: (b.x - near.x) / dl, y: (b.y - near.y) / dl }, at };
};

/** Arrow between two tags, each possibly scaled (the focus one is). */
export const arrowCurve = (from: Pt, to: Pt, fromScale: number, toScale: number, bend: number): Curve =>
  curve(edgePoint(from, to, fromScale), edgePoint(to, from, toScale), bend);

/* ------------------------------------------------------------- arrows */

/**
 * One arrow inside the shared <svg>: draws itself on from `at` over `draw`
 * frames (the head lands at at+draw), then money runs along it as dots.
 */
export const Arrow: React.FC<{
  c: Curve;
  tone: Tone;
  at: number;
  draw?: number;
  width?: number;
  opacity?: number;
  dots?: boolean;
}> = ({ c, tone, at, draw = 12, width = 7, opacity = 1, dots = true }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + draw], [0, 1], { easing: theme.ease.out, ...clamp });
  if (p <= 0 || opacity <= 0.001) return null;
  const color = toneColor(tone);
  const head = 10 + width * 1.6;
  const n = { x: -c.dir.y, y: c.dir.x };
  const base = { x: c.tip.x - c.dir.x * head, y: c.tip.y - c.dir.y * head };
  const headOpacity = interpolate(p, [0.85, 1], [0, 1], clamp);
  return (
    <g opacity={opacity}>
      <path d={c.d} stroke={color} strokeWidth={width} fill="none" strokeLinecap="round" strokeDasharray={c.len} strokeDashoffset={c.len * (1 - p)} />
      {dots && p >= 1 && (
        <path
          d={c.d}
          stroke={colors.white}
          strokeWidth={Math.max(3, width * 0.5)}
          fill="none"
          strokeLinecap="round"
          strokeDasharray="4 22"
          strokeDashoffset={-((frame - at) * 3.2)}
          opacity={0.7}
        />
      )}
      <polygon
        points={`${c.tip.x},${c.tip.y} ${base.x + n.x * head * 0.55},${base.y + n.y * head * 0.55} ${base.x - n.x * head * 0.55},${base.y - n.y * head * 0.55}`}
        fill={color}
        opacity={headOpacity}
      />
    </g>
  );
};

/** The amount printed on paper at the middle of its arrow, after it lands. */
export const ArrowLabel: React.FC<{ c: Curve; text: string; tone: Tone; at: number; t?: number; size?: number }> = ({ c, text, tone, at, t = 0.5, size = 19 }) => {
  const frame = useCurrentFrame();
  const p = useIn(at, "snappy");
  if (frame < at) return null;
  const pos = c.at(t);
  return (
    <div
      style={{
        position: "absolute",
        left: pos.x,
        top: pos.y,
        transform: `translate(-50%, -50%) scale(${interpolate(p, [0, 1], [0.6, 1])})`,
        opacity: p,
        padding: "5px 11px",
        background: colors.paper,
        color: colors.ink,
        borderLeft: `5px solid ${toneColor(tone)}`,
        fontFamily: theme.fonts.mono,
        fontWeight: 800,
        fontSize: size,
        letterSpacing: "0.06em",
        whiteSpace: "nowrap",
        boxShadow: colors.paperShadow,
        zIndex: 5,
      }}
    >
      {text}
    </div>
  );
};

/* --------------------------------------------------------------- tags */

/**
 * A company as a thermal-paper tag with its wordmark printed in ink
 * (Commons SVG, editorial use). `lit` adds the lime ring: the focus.
 * `alarm` flashes it red (the weak spots).
 */
export const Tag: React.FC<{
  id: NodeId;
  pos: Pt;
  scale?: number;
  dim?: number; // 0..1
  lit?: boolean;
  alarm?: number; // 0..1
  at?: number; // entrance frame; negative = already there
  seed?: number;
}> = ({ id, pos, scale = 1, dim = 0, lit = false, alarm = 0, at = -100, seed = 0 }) => {
  const frame = useCurrentFrame();
  const node = NODES[id];
  const p = useIn(at, "snappy");
  const breathe = Math.sin(frame / 28 + seed * 1.3) * 3;
  const ring = lit ? `0 0 0 4px ${palette.primary}, 0 0 44px ${palette.glow}` : alarm > 0 ? `0 0 0 ${4 * alarm}px ${colors.bad}, 0 0 ${50 * alarm}px ${colors.badGlow}` : "none";
  return (
    <div
      style={{
        position: "absolute",
        left: pos.x - TAG.w / 2,
        top: pos.y - TAG.h / 2 + breathe,
        width: TAG.w,
        height: TAG.h,
        borderRadius: 16,
        background: alarm > 0.5 ? colors.bad : colors.paper,
        boxShadow: `${ring}, ${colors.paperShadow}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: p * (1 - dim * 0.62),
        filter: `brightness(${1 - dim * 0.35})`,
        transform: `scale(${scale * interpolate(p, [0, 1], [0.5, 1])})`,
        zIndex: lit ? 4 : 3,
      }}
    >
      {node.logo ? (
        <Img
          src={asset(node.logo)}
          style={{ width: 196, height: node.logoH ?? 40, objectFit: "contain", display: "block", filter: "brightness(0)" }}
        />
      ) : (
        <span style={{ fontFamily: theme.fonts.wide, fontWeight: 800, fontSize: 25, letterSpacing: "-0.01em", color: colors.ink }}>{node.label}</span>
      )}
    </div>
  );
};

/** A round portrait pinned to a ring tag's outer corner, cut out of a real photo. */
export const FaceDot: React.FC<{ face: Face; pos: Pt; at: number; size?: number }> = ({ face, pos, at, size = 96 }) => {
  const frame = useCurrentFrame();
  const p = useIn(at, "bouncy");
  if (frame < at) return null;
  // outside the tag, never over its wordmark: beside it on the ring's sides,
  // above it at the far left / right, off to a free corner at the top and bottom
  const dx = pos.x - CENTER.x;
  const dy = pos.y - CENTER.y;
  const cos = dx / RING.rx;
  const sin = dy / RING.ry;
  let off: Pt;
  if (sin <= -0.9) off = { x: -140, y: -30 };
  else if (sin >= 0.9) off = { x: 150, y: 20 };
  else if (Math.abs(cos) >= 0.9) off = { x: 0, y: -(TAG.h / 2 + 50) };
  else off = { x: Math.sign(cos) * (TAG.w / 2 + 52), y: 0 };
  const cx = pos.x + off.x;
  const cy = pos.y + off.y;
  return (
    <div
      style={{
        position: "absolute",
        left: cx - size / 2,
        top: cy - size / 2,
        width: size,
        height: size,
        borderRadius: "50%",
        overflow: "hidden",
        border: `4px solid ${colors.paper}`,
        background: colors.surfaceStrong,
        boxShadow: colors.shadow,
        opacity: p,
        transform: `scale(${interpolate(p, [0, 1], [0.3, 1])})`,
        zIndex: 6,
      }}
    >
      <Img src={asset(face.src)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 12%", filter: "grayscale(0.5) contrast(1.1)" }} />
    </div>
  );
};

/* -------------------------------------------------------------- type */

/** The beat's title on a paper strip, top left. */
export const HeaderStrip: React.FC<{ text: string; bad?: number[]; at?: number; size?: number }> = ({ text, bad, at = 0, size = 36 }) => {
  const p = useIn(at, "snappy");
  return (
    <div
      style={{
        position: "absolute",
        left: 60,
        top: 222,
        padding: "12px 22px 14px",
        background: colors.paper,
        boxShadow: colors.paperShadow,
        opacity: p,
        transform: `translateX(${interpolate(p, [0, 1], [-30, 0])}px) rotate(-1deg)`,
        zIndex: 7,
      }}
    >
      <Kinetic text={text} size={size} delay={at} per={2} mode="snap" color={colors.ink} bad={bad} lineHeight={1} weight={900} style={{ columnGap: 15 }} />
    </div>
  );
};

// Unbounded Black digits run ≈ 0.95em; the figure column is 600px wide.
const fitNum = (value: string) => Math.max(72, Math.min(150, Math.floor(600 / (value.length * 0.92))));

/** THE one figure of the frame: number in lime, unit under it, caption on paper. */
export const Figure: React.FC<{ num: string; unit: string; caption: string; at: number; out?: number; tone?: Tone; calmAt?: number }> = ({ num, unit, caption, at, out, tone = "invest", calmAt }) => {
  const frame = useCurrentFrame();
  const p = useIn(at, "snappy");
  const hit = usePunch(at, 16);
  const cap = useIn(at + 6, "snappy");
  const leave = out === undefined ? 0 : interpolate(frame, [out - 7, out], [0, 1], { easing: theme.ease.in, ...clamp });
  if (frame < at || (out !== undefined && frame >= out)) return null;
  const color = toneColor(tone);
  const size = fitNum(num);
  // the stamp takes the glow when it lands: one glowing element per frame
  const glow = calmAt === undefined ? 1 : interpolate(frame, [calmAt, calmAt + 8], [1, 0], clamp);
  return (
    <div
      style={{
        position: "absolute",
        left: 60,
        top: 318,
        width: 620,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 10,
        zIndex: 7,
        opacity: p * (1 - leave),
        transform: `translateY(${interpolate(p, [0, 1], [40, 0]) - leave * 50}px) scale(${1 + hit.pop * 0.07})`,
        transformOrigin: "left top",
      }}
    >
      <div
        style={{
          fontFamily: `${theme.fonts.wide}, ${theme.fonts.mono}`,
          fontWeight: 900,
          fontSize: size,
          lineHeight: 0.95,
          letterSpacing: "-0.03em",
          color,
          textShadow: glow > 0.01 ? `0 0 ${(36 + hit.energy * 60) * glow}px ${toneGlow(tone)}` : undefined,
          whiteSpace: "nowrap",
        }}
      >
        {num}
      </div>
      <div style={{ fontFamily: theme.fonts.wide, fontWeight: 800, fontSize: 46, lineHeight: 1, letterSpacing: "-0.01em", color, whiteSpace: "nowrap" }}>{unit}</div>
      <div
        style={{
          padding: "7px 14px",
          background: colors.paper,
          color: colors.ink,
          fontFamily: theme.fonts.mono,
          fontWeight: 800,
          fontSize: 21,
          letterSpacing: "0.06em",
          whiteSpace: "nowrap",
          boxShadow: colors.paperShadow,
          opacity: cap,
          transform: `translateY(${interpolate(cap, [0, 1], [14, 0])}px)`,
        }}
      >
        {caption}
      </div>
    </div>
  );
};

const stampSize = (lines: string[]) => {
  const longest = Math.max(...lines.map((l) => l.replace(/ /g, "").length * 0.9 + (l.split(" ").length - 1) * 0.3));
  return Math.max(40, Math.min(68, Math.floor(940 / longest)));
};

/** The stamp of the beat, centred low, with an optional paper line under it. */
export const StampBlock: React.FC<{ lines: string[]; tone: "hero" | "bad"; at: number; sub?: string; top?: number }> = ({ lines, tone, at, sub, top = 1440 }) => {
  const frame = useCurrentFrame();
  const subIn = useIn(at + 8, "snappy");
  if (frame < at) return null;
  const size = stampSize(lines);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, zIndex: 9 }}>
      <Stamp tone={tone} size={size} rotate={-5} delay={at} style={{ textAlign: "center", background: "rgba(6,8,10,0.55)" }}>
        {lines.map((l, i) => (
          <React.Fragment key={i}>
            {i > 0 && <br />}
            {l}
          </React.Fragment>
        ))}
      </Stamp>
      {sub && (
        <div
          style={{
            padding: "7px 14px",
            background: colors.paper,
            color: colors.ink,
            fontFamily: theme.fonts.mono,
            fontWeight: 800,
            fontSize: 20,
            letterSpacing: "0.08em",
            whiteSpace: "nowrap",
            boxShadow: colors.paperShadow,
            opacity: subIn,
            transform: `translateY(${interpolate(subIn, [0, 1], [14, 0])}px)`,
          }}
        >
          {sub}
        </div>
      )}
    </div>
  );
};

/* ------------------------------------------------------------- people */

/** A real person, cut out (matte.swift), graded, standing top right. */
export const Person: React.FC<{ face: Face; at: number; out?: number; height?: number; maxWidth?: number; right?: number }> = ({ face, at, out, height = 430, maxWidth = 430, right = 36 }) => {
  const frame = useCurrentFrame();
  const p = useIn(at, "smooth");
  const leave = out === undefined ? 0 : interpolate(frame, [out - 8, out], [0, 1], { easing: theme.ease.in, ...clamp });
  if (frame < at || (out !== undefined && frame >= out)) return null;
  let w = height * face.ratio;
  let h = height;
  if (w > maxWidth) {
    w = maxWidth;
    h = maxWidth / face.ratio;
  }
  const breathe = Math.sin(frame / 30 + at) * 3;
  const kb = interpolate(frame, [at, at + 150], [1, 1.05], clamp);
  return (
    <div
      style={{
        position: "absolute",
        right: face.right ?? right,
        top: 300 + (height - h),
        width: w,
        height: h,
        zIndex: 6,
        opacity: p * (1 - leave),
        transform: `translateY(${interpolate(p, [0, 1], [120, 0]) + breathe + leave * 40}px) scale(${interpolate(p, [0, 1], [1.08, 1]) * kb})`,
        transformOrigin: "bottom center",
        filter: "grayscale(0.5) contrast(1.08) brightness(0.94) drop-shadow(0 24px 34px rgba(0,0,0,0.8))",
        maskImage: "linear-gradient(180deg, #000 66%, transparent 98%)",
        WebkitMaskImage: "linear-gradient(180deg, #000 66%, transparent 98%)",
      }}
    >
      <Img src={asset(face.src)} style={{ width: w, height: h, display: "block" }} />
    </div>
  );
};

/** CC BY needs the credit on screen while the photo is. */
export const CreditLine: React.FC<{ text: string; at: number; out?: number }> = ({ text, at, out }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [at + 8, at + 20, out === undefined ? 1e9 : out - 8, out === undefined ? 1e9 + 1 : out], [0, 0.8, 0.8, 0], clamp);
  if (frame < at + 8) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 1766,
        textAlign: "center",
        fontFamily: theme.fonts.mono,
        fontSize: 15,
        letterSpacing: "0.06em",
        color: palette.textDim,
        opacity: o,
        zIndex: 9,
      }}
    >
      {text}
    </div>
  );
};

/* --------------------------------------------------------------- clip */

/** A licensed clip as a graded band under the stamp, scrimmed into the dark. */
export const ClipBand: React.FC<{ shot: FootageShot; at: number; label: string; top?: number; height?: number }> = ({ shot, at, label, top = 1384, height = 340 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = useIn(at, "smooth");
  const labelIn = useIn(at + 10, "snappy");
  if (frame < at) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top,
        height,
        overflow: "hidden",
        opacity: p,
        transform: `scaleY(${interpolate(p, [0, 1], [0.6, 1])})`,
        transformOrigin: "50% 100%",
        maskImage: "linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)",
        WebkitMaskImage: "linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)",
        zIndex: 1,
      }}
    >
      <div style={{ position: "absolute", inset: 0, transform: `scale(${1 + (frame - at) * 0.0007})`, filter: "grayscale(0.45) contrast(1.12) brightness(0.55) saturate(0.8)" }}>
        <OffthreadVideo src={footage(shot)} startFrom={0} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${palette.bg} 0%, transparent 30%, transparent 62%, ${palette.bg} 100%)` }} />
      <div style={{ position: "absolute", inset: 0, boxShadow: `inset 0 0 0 2px ${palette.primary}22` }} />
      <div
        style={{
          position: "absolute",
          left: 60,
          top: 22,
          padding: "6px 12px",
          background: colors.paper,
          color: colors.ink,
          fontFamily: theme.fonts.mono,
          fontWeight: 800,
          fontSize: 18,
          letterSpacing: "0.1em",
          whiteSpace: "nowrap",
          opacity: labelIn,
          transform: `translateY(${interpolate(labelIn, [0, 1], [10, 0])}px)`,
        }}
      >
        {label}
      </div>
    </div>
  );
};

/* -------------------------------------------------------------- props */

/** The ouroboros engraving (Lucas Jennis, public domain) printed on a parchment card. */
export const Engraving: React.FC<{ at: number; size?: number; pos?: Pt }> = ({ at, size = 250, pos = CENTER }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - at, fps, config: theme.spring.bouncy });
  if (frame < at) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: pos.x - size / 2,
        top: pos.y - size / 2,
        width: size,
        height: size,
        padding: 10,
        background: colors.paperShade,
        boxShadow: colors.paperShadow,
        opacity: Math.min(1, p * 1.5),
        transform: `scale(${interpolate(p, [0, 1], [0.2, 1])}) rotate(${interpolate(p, [0, 1], [-30, -5]) + Math.sin(frame / 40) * 1.2}deg)`,
        zIndex: 4,
      }}
    >
      <Img src={asset("ouroboros.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", filter: "contrast(1.25) sepia(0.35)", mixBlendMode: "multiply" }} />
    </div>
  );
};

/** The meme (Spider-Man pointing at Spider-Man), the author's call. */
export const Meme: React.FC<{ at: number; width?: number }> = ({ at, width = 430 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - at, fps, config: theme.spring.bouncy });
  if (frame < at) return null;
  const h = width / (418 / 234);
  return (
    <div
      style={{
        position: "absolute",
        right: 30,
        top: 470,
        width,
        height: h,
        opacity: Math.min(1, p * 1.5),
        transform: `scale(${interpolate(p, [0, 1], [0.3, 1])}) rotate(${Math.sin(frame / 22) * 1.5}deg)`,
        filter: "grayscale(0.25) contrast(1.1) drop-shadow(0 20px 30px rgba(0,0,0,0.8))",
        zIndex: 6,
      }}
    >
      <Img src={asset("meme-spiderman.png")} style={{ width, height: h, display: "block" }} />
    </div>
  );
};

/* ------------------------------------------------------------- legend */

/** What the two arrow colours mean, printed on two paper chips under the stamp. */
export const Legend: React.FC<{ at: number; top?: number }> = ({ at, top = 1628 }) => {
  const frame = useCurrentFrame();
  const p = useIn(at, "snappy");
  if (frame < at) return null;
  const chip = (color: string, text: string, delay: number) => (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        padding: "6px 12px",
        background: colors.paper,
        color: colors.ink,
        fontFamily: theme.fonts.mono,
        fontWeight: 800,
        fontSize: 18,
        letterSpacing: "0.08em",
        whiteSpace: "nowrap",
        boxShadow: colors.paperShadow,
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [12 + delay, 0])}px)`,
      }}
    >
      <span style={{ width: 16, height: 16, background: color }} />
      {text}
    </div>
  );
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top, display: "flex", justifyContent: "center", gap: 14, zIndex: 9 }}>
      {chip(palette.primary, "ДАЛ ДЕНЬГИ", 0)}
      {chip(colors.bad, "ОБЕЩАЛ ЗАПЛАТИТЬ", 6)}
    </div>
  );
};
