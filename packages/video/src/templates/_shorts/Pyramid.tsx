// «Ты в каком слое?»: one stock of 1 000 people-dots (the hit mechanic: one
// object that melts), lit layer by layer as the share shrinks: everyone →
// online → weekly AI users → paying. Then one country on its own 100-dot
// grid, then the top layer with «ТЫ ЗДЕСЬ?». Each layer: headline number,
// what it is on paper, a licensed clip as evidence, logos. Data-driven.
import React from "react";
import { Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../theme";
import { Reel, Scene, buildScenes, defineVoiceover, scenesDuration, useIn, usePunch } from "../../reel";
import { drColors as colors, drPalette as palette } from "../digital-ruble/palette";
import { BrandBar, Chip, Flash, Glitch, Kinetic, SceneShell, Stamp } from "../digital-ruble/ui";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const media = (f: string) => staticFile(f);

export type PyramidLayer = {
  share: number; // 0..1 of the 1 000 dots lit
  value: string; // big number
  label: string; // what it is, on paper
  clip?: string; // evidence, media/kit-ai/…
  logos?: string[]; // images/kit/…
  photos?: { src: string; w: number; cut?: boolean; label?: string }[]; // extra real photos, right of the clip
  bills?: string[]; // real banknotes fanned over the stock
  side?: { left?: string[]; right?: string[] }; // info cards popping on both sides (TikTok-style)
  tiers?: { price: string; label: string }[]; // subscription prices as tags
  numbers?: string[]; // number particles drifting behind
  stamp?: { text: string; tone: "bad" | "hero" };
  chips?: string[];
};
export type PyramidData = {
  series: string;
  episode: string;
  voiceoverDir: string;
  rate: number;
  hook: { words: string[]; total: string; sub: string; clip: string; faces?: string[]; bills?: string[]; presenter?: { file: string; from: number; duration: number; caption: string } };
  layers: PyramidLayer[]; // 3: online, weekly, paying
  country: { value: string; label: string; share: number; flag?: string; photo?: string; logos?: string[]; stamp: { text: string; tone: "bad" | "hero" }; note: string; sprite?: { dir: string; count: number; fps: number; h: number }; flyIn?: { src: string; w: number }; spin?: { src: string; w: number; label: string }; side?: { left?: string[]; right?: string[] } };
  final: { pointer: string; stamp: string; sources: string };
  dotLabel?: string; // «1 ТОЧКА ≈ 8 МЛН ЧЕЛОВЕК»
};

export const makePyramid = (data: PyramidData, D: Record<string, number>) => {
  const k = Object.keys(D);
  const v = (i: number) => (D[k[i]] ?? 2) / data.rate;
  const SCENES = buildScenes({
    hook: v(0) + 0.5,
    l1: v(1) + 1.0,
    l2: v(2) + 1.1,
    l3: v(3) + 1.5,
    country: v(4) + 1.2,
    final: v(5) + 2.2,
  });
  const order = ["hook", "l1", "l2", "l3", "country", "final"] as const;
  const VOICEOVER = defineVoiceover(D, k.slice(0, 6).map((file, i) => ({ file, start: SCENES[order[i]].from + (i ? 0.15 : 0), rate: data.rate })));
  return { SCENES, VOICEOVER, DURATION: scenesDuration(SCENES) };
};

/* ---------------------------------------------------------- the stock */

const COLS = 40;
const ROWS = 25; // 1 000 dots, one dot ≈ 8,1 million people
const DOT = 22;

/** Lit dots form a pyramid from the top: the brightest, smallest layer sits at its peak. */
const order1000 = (() => {
  const idx: { i: number; d: number }[] = [];
  for (let r = 0; r < ROWS; r += 1) for (let c = 0; c < COLS; c += 1) idx.push({ i: r * COLS + c, d: r * 2.2 + Math.abs(c - (COLS - 1) / 2) });
  return idx.sort((a, b) => a.d - b.d).map((x) => x.i);
})();

const Stock: React.FC<{ from: number; to: number; at: number; tone?: "hero" | "bad"; pulseTop?: number }> = ({ from, to, at, tone = "hero", pulseTop = 0 }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - at, [0, 22], [0, 1], { easing: theme.ease.inOut, ...clamp });
  const lit = Math.round((from + (to - from) * p) * 1000);
  const rank = new Map(order1000.map((i, n) => [i, n]));
  const lime = tone === "hero" ? palette.primary : colors.bad;
  return (
    <svg width={COLS * DOT} height={ROWS * DOT} style={{ display: "block", overflow: "visible" }}>
      {Array.from({ length: COLS * ROWS }, (_, i) => {
        const n = rank.get(i) ?? 0;
        const on = n < lit;
        const top = n < pulseTop;
        const r = top ? 8 + Math.sin(frame / 4 + n) * 2 : on ? 7 : 5;
        return (
          <circle
            key={i}
            cx={(i % COLS) * DOT + DOT / 2}
            cy={Math.floor(i / COLS) * DOT + DOT / 2}
            r={r}
            fill={top ? lime : on ? (tone === "hero" ? "#E6F7B8" : "#FFD0D0") : colors.surfaceLift}
            opacity={top ? 1 : on ? 0.92 : 0.55}
            style={top ? { filter: `drop-shadow(0 0 6px ${palette.glow})` } : undefined}
          />
        );
      })}
    </svg>
  );
};

const Paper: React.FC<{ children: React.ReactNode; delay?: number; size?: number }> = ({ children, delay = 0, size = 26 }) => {
  const p = useIn(delay, "snappy");
  return (
    <div style={{ alignSelf: "flex-start", padding: `${size * 0.35}px ${size * 0.7}px`, background: colors.paper, color: colors.ink, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: size, letterSpacing: "0.08em", lineHeight: 1.25, boxShadow: colors.paperShadow, opacity: p, transform: `translateY(${interpolate(p, [0, 1], [16, 0])}px) rotate(-1deg)` }}>
      {children}
    </div>
  );
};

const fit = (s: string, max: number) => Math.max(56, Math.min(max, Math.floor(960 / (s.replace(/ /g, "").length * 0.92 + (s.split(" ").length - 1) * 0.33))));

const Evidence: React.FC<{ clip?: string; logos?: string[]; photos?: PyramidLayer["photos"]; at: number }> = ({ clip, logos, photos, at }) => {
  const frame = useCurrentFrame();
  if (!clip && !logos && !photos) return null;
  // one centred row, every tile the same height; staggered spring entrances,
  // each tile breathing on its own phase (author notes 13–16)
  const H = 300;
  const tiles: React.ReactNode[] = [];
  if (clip) tiles.push(
    <div style={{ width: 225, height: H, borderRadius: 18, overflow: "hidden", border: `3px solid ${colors.lineStrong}`, boxShadow: colors.shadow }}>
      <OffthreadVideo src={media(clip)} muted style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(0.3) contrast(1.1) brightness(0.85)" }} />
    </div>,
  );
  for (const ph of photos ?? []) tiles.push(
    <div style={{ position: "relative", height: H, borderRadius: ph.cut ? 0 : 18, overflow: "hidden", boxShadow: ph.cut ? "none" : colors.shadow, border: ph.cut ? "none" : `3px solid ${colors.lineStrong}` }}>
      <Img src={media(ph.src)} style={{ height: H, width: ph.cut ? "auto" : ph.w, objectFit: "cover", display: "block", filter: `${ph.cut ? "drop-shadow(0 18px 24px rgba(0,0,0,0.7)) " : ""}contrast(1.05)` }} />
      {ph.label && <div style={{ position: "absolute", left: 10, bottom: 10, padding: "4px 10px", background: colors.paper, color: colors.ink, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 18 }}>{ph.label}</div>}
    </div>,
  );
  if (logos?.length) tiles.push(
    <div style={{ height: H, display: "flex", flexDirection: "column", justifyContent: "center", gap: 14 }}>
      {logos.map((l) => (
        <div key={l} style={{ width: 230, height: 84, padding: "14px 20px", boxSizing: "border-box", background: colors.white, borderRadius: 12, boxShadow: colors.paperShadow, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Img src={media(l)} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", display: "block" }} />
        </div>
      ))}
    </div>,
  );
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 1300, zIndex: 4, display: "flex", justifyContent: "center", alignItems: "center", gap: 18 }}>
      {tiles.map((t, i) => {
        const q = interpolate(frame - at - i * 5, [0, 14], [0, 1], { easing: theme.ease.out, ...clamp });
        const bob = Math.sin(frame / 16 + i * 1.7) * 6;
        const tilt = (i % 2 ? 2 : -2) + Math.sin(frame / 23 + i) * 1.2;
        return (
          <div key={i} style={{ opacity: q, transform: `translateY(${interpolate(q, [0, 1], [90, 0]) + bob}px) rotate(${tilt}deg) scale(${interpolate(q, [0, 1], [0.7, 1])})` }}>
            {t}
          </div>
        );
      })}
    </div>
  );
};

/** Real faces, a mosaic strip: «8,1 млрд» is people, not dots. */
const Faces: React.FC<{ srcs: string[] }> = ({ srcs }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: 30, right: 30, top: 1330, display: "grid", gridTemplateColumns: `repeat(${Math.ceil(srcs.length / 2)}, 1fr)`, gap: 8 }}>
      {srcs.map((s, i) => {
        const q = interpolate(frame - 4 - i * 2, [0, 10], [0, 1], { easing: theme.ease.out, ...clamp });
        return (
          <div key={s} style={{ height: 170, borderRadius: 12, overflow: "hidden", opacity: q, transform: `scale(${interpolate(q, [0, 1], [0.6, 1])})`, boxShadow: colors.shadow }}>
            <Img src={media(s)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "contrast(1.05) saturate(0.85)" }} />
          </div>
        );
      })}
    </div>
  );
};

/** Real banknotes: a fan that lands, then more notes keep raining past it. */
const Bills: React.FC<{ srcs: string[]; at: number; top: number; small?: boolean }> = ({ srcs, at, top, small }) => {
  const frame = useCurrentFrame();
  const w = small ? 300 : 380;
  const t = frame - at;
  return (
    <>
      <div style={{ position: "absolute", right: small ? 40 : 60, top, width: w + 120, height: 260, zIndex: 3 }}>
        {srcs.map((s, i) => {
          const q = interpolate(t - i * 5, [0, 12], [0, 1], { easing: theme.ease.out, ...clamp });
          return <Img key={s + i} src={media(s)} style={{ position: "absolute", left: i * 60, top: i * 26 + (1 - q) * -260, width: w, opacity: q, transform: `rotate(${-14 + i * 12 + Math.sin(frame / 18 + i) * 2}deg)`, boxShadow: "0 18px 30px rgba(0,0,0,0.7)", borderRadius: 4 }} />;
        })}
      </div>
      {!small && t > 10 && Array.from({ length: 7 }, (_, k) => {
        const y = 470 + ((t * (5 + (k % 3)) + k * 260) % 1500); // below the headline, behind the stamp
        const x = 60 + ((k * 157) % 900);
        return <Img key={`r${k}`} src={media(srcs[k % srcs.length])} style={{ position: "absolute", left: x, top: y, width: 190, opacity: 0.55, transform: `rotate(${(t * (k % 2 ? 3 : -3) + k * 40) % 360}deg)`, boxShadow: "0 10px 20px rgba(0,0,0,0.6)", zIndex: 0 }} />;
      })}
    </>
  );
};

/** Info cards popping in on the left and right edges, one by one, with a punch (TikTok-style). */
const SideCards: React.FC<{ left?: string[]; right?: string[]; at: number; top?: number }> = ({ left = [], right = [], at, top = 700 }) => {
  const frame = useCurrentFrame();
  const card = (t: string, i: number, side: "l" | "r") => {
    const d = at + i * 7 + (side === "r" ? 3 : 0);
    const q = interpolate(frame - d, [0, 8], [0, 1], { easing: theme.ease.out, ...clamp });
    const pop = interpolate(frame - d, [0, 4, 10], [0, 1.12, 1], clamp);
    const bob = Math.sin(frame / 15 + i + (side === "r" ? 2 : 0)) * 4;
    return (
      <div key={side + i} style={{ alignSelf: side === "l" ? "flex-start" : "flex-end", maxWidth: 380, padding: "12px 16px", background: i % 2 ? colors.paper : palette.primary, color: colors.ink2, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 25, lineHeight: 1.25, boxShadow: colors.shadow, opacity: q, transform: `translateX(${(1 - q) * (side === "l" ? -200 : 200)}px) translateY(${bob}px) rotate(${side === "l" ? -3 : 3}deg) scale(${pop || 0.01})` }}>{t}</div>
    );
  };
  return (
    <>
      <div style={{ position: "absolute", left: 30, top, display: "flex", flexDirection: "column", gap: 18, zIndex: 5 }}>{left.map((t, i) => card(t, i, "l"))}</div>
      <div style={{ position: "absolute", right: 30, top: top + 60, display: "flex", flexDirection: "column", gap: 18, zIndex: 5 }}>{right.map((t, i) => card(t, i, "r"))}</div>
    </>
  );
};

/** Subscription prices as paper tags slapped one after another. */
const Tiers: React.FC<{ items: { price: string; label: string }[]; at: number }> = ({ items, at }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: 60, top: 450, display: "flex", gap: 16, zIndex: 5 }}>
      {items.map((t, i) => {
        const d = at + i * 8;
        const q = interpolate(frame - d, [0, 8], [0, 1], { easing: theme.ease.out, ...clamp });
        const slam = interpolate(frame - d, [0, 5, 10], [1.6, 0.95, 1], clamp);
        return (
          <div key={t.price} style={{ padding: "10px 16px", background: i === items.length - 1 ? colors.bad : colors.paper, color: i === items.length - 1 ? colors.white : colors.ink, boxShadow: colors.paperShadow, opacity: q, transform: `rotate(${(i - 1) * 4}deg) scale(${frame >= d ? slam : 0})`, textAlign: "center" }}>
            <div style={{ fontFamily: theme.fonts.wide, fontWeight: 900, fontSize: 44, lineHeight: 1 }}>{t.price}</div>
            <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 16, marginTop: 4 }}>{t.label}</div>
          </div>
        );
      })}
    </div>
  );
};

/** Numbers drifting up behind everything. */
const Numbers: React.FC<{ items: string[] }> = ({ items }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}>
      {Array.from({ length: 14 }, (_, k) => {
        const y = 1900 - ((frame * (2 + (k % 3)) + k * 140) % 2000);
        const x = 30 + ((k * 211) % 980);
        return <div key={k} style={{ position: "absolute", left: x, top: y, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 30 + (k % 3) * 10, color: k % 4 === 0 ? colors.bad : palette.primary, opacity: 0.2 }}>{items[k % items.length]}</div>;
      })}
    </div>
  );
};

/** A cut-out animation from frames (the author's gif), looping. */
const Sprite: React.FC<{ dir: string; count: number; fps: number; h: number; at: number }> = ({ dir, count, fps: sfps, h, at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const q = interpolate(frame - at, [0, 12], [0, 1], { easing: theme.ease.out, ...clamp });
  const i = Math.floor(((Math.max(0, frame - at) / fps) * sfps) % count) + 1;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 560, display: "flex", justifyContent: "center", zIndex: 2, opacity: q, transform: `translateY(${(1 - q) * 200}px)` }}>
      <Img src={media(`${dir}/f${String(i).padStart(2, "0")}.png`)} style={{ height: h, display: "block", filter: "drop-shadow(0 30px 40px rgba(0,0,0,0.8))" }} />
    </div>
  );
};

/** A cut-out flying in from the right edge and settling. */
const FlyIn: React.FC<{ src: string; w: number; at: number }> = ({ src, w, at }) => {
  const frame = useCurrentFrame();
  const q = interpolate(frame - at, [0, 14], [0, 1], { easing: theme.ease.out, ...clamp });
  return (
    <div style={{ position: "absolute", right: 30, top: 600, width: w, zIndex: 3, opacity: q, transform: `translateX(${(1 - q) * 700}px) rotate(${(1 - q) * 40 + Math.sin(frame / 14) * 4}deg)` }}>
      <Img src={media(src)} style={{ width: w, display: "block", filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.8))" }} />
    </div>
  );
};

/** A DNA cut-out spinning on its vertical axis, with what it stands for. */
const Spin: React.FC<{ src: string; w: number; label: string; at: number }> = ({ src, w, label, at }) => {
  const frame = useCurrentFrame();
  const q = interpolate(frame - at, [0, 12], [0, 1], { easing: theme.ease.out, ...clamp });
  const ang = (frame - at) * 6;
  return (
    <div style={{ position: "absolute", left: 30, top: 640, width: w, zIndex: 3, opacity: q, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, perspective: 800 }}>
      <Img src={media(src)} style={{ width: w, display: "block", transform: `rotateY(${ang}deg)`, filter: "drop-shadow(0 0 20px rgba(255,59,59,0.35))" }} />
      <div style={{ padding: "4px 10px", background: colors.paper, color: colors.ink, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 18 }}>{label}</div>
    </div>
  );
};

/* ----------------------------------------------------------- scenes */

const STOCK_TOP = 660;
const stockLeft = (1080 - COLS * DOT) / 2;

const Hook: React.FC<{ data: PyramidData }> = ({ data }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const n = data.hook.words.length;
  const every = Math.min(0.5, (durationInFrames / fps - 1.4) / n);
  const last = usePunch(Math.round((n - 1) * every * fps), 16);
  const clipIn = useIn(0, "smooth");
  return (
    <SceneShell exit={false} shake={last.shake * 0.6}>
      <div style={{ position: "absolute", inset: 0, opacity: 0.35 * clipIn }}>
        <OffthreadVideo src={media(data.hook.clip)} muted style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(0.6) brightness(0.5)" }} />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${palette.bg}DD, ${palette.bg}66 40%, ${palette.bg}EE)` }} />
      </div>
      <BrandBar series={data.series} episode={data.episode} delay={-30} />
      <div style={{ position: "absolute", left: 64, right: 64, top: 240 }}>
        <Kinetic text={data.hook.total} size={fit(data.hook.total, 150)} delay={-10} per={1} mode="snap" hero={[0]} glow lineHeight={1} />
        <div style={{ marginTop: 14 }}>
          <Kinetic text={data.hook.words.join(" ")} size={50} delay={Math.round(every * fps)} per={Math.max(2, Math.round(every * fps * 0.6))} mode="snap" bad={[data.hook.words.length - 1]} lineHeight={1.06} />
        </div>
      </div>
      <div style={{ position: "absolute", left: stockLeft, top: STOCK_TOP }}>
        <Stock from={1} to={1} at={0} />
      </div>
      <div style={{ position: "absolute", left: 64, right: 64, top: 1240, display: "flex" }}>
        <Paper delay={8} size={30}>{data.hook.sub}</Paper>
      </div>
      {data.hook.faces && <Faces srcs={data.hook.faces} />}
      {data.hook.bills && <Bills srcs={data.hook.bills} at={Math.round(every * fps) + 4} top={1060} small />}
      {data.hook.presenter && <Presenter p={data.hook.presenter} rate={data.rate} />}
      <Flash amount={last.energy * 0.5} />
    </SceneShell>
  );
};

/**
 * The author's HeyGen podcaster, full frame (face-fullscreen rule): lip-synced
 * to the house clip, so it starts where its slice of the clip starts and plays
 * at the voice rate, muted. A cut in and a cut out, the caption on paper.
 */
const Presenter: React.FC<{ p: { file: string; from: number; duration: number; caption: string }; rate: number }> = ({ p, rate }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = Math.round((p.from / rate) * fps);
  const len = Math.round((p.duration / rate) * fps);
  if (frame < at || frame >= at + len) return null;
  const k = frame - at;
  const inP = interpolate(k, [0, 6], [0, 1], { easing: theme.ease.out, ...clamp });
  const out = interpolate(k, [len - 5, len], [0, 1], { easing: theme.ease.in, ...clamp });
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 10, opacity: 1 - out, transform: `scale(${interpolate(inP, [0, 1], [1.08, 1]) + k * 0.0008})` }}>
      {/* HeyGen renders the 16:9 look letterboxed in a 9:16 frame (picture at y 656–1263): fill the height */}
      {/* the clip must start where the face appears, not at the scene start: a Sequence resets its clock (the bug: lips ahead of the voice, then a frozen last frame) */}
      <Sequence from={at} layout="none">
        <OffthreadVideo src={media(p.file)} muted playbackRate={rate} style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scale(3.3)", transformOrigin: "50% 50%" }} />
      </Sequence>
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, transparent 60%, ${palette.bg}CC 92%)` }} />
      <div style={{ position: "absolute", left: 64, right: 64, top: 1430, display: "flex", justifyContent: "center", opacity: inP }}>
        <div style={{ padding: "14px 24px", background: colors.paper, color: colors.ink, fontFamily: theme.fonts.wide, fontWeight: 900, fontSize: 46, lineHeight: 1.1, textAlign: "center", boxShadow: colors.paperShadow, transform: "rotate(-1.5deg)" }}>{p.caption}</div>
      </div>
      <Flash amount={interpolate(k, [0, 4], [0.8, 0], clamp)} />
    </div>
  );
};

const Layer: React.FC<{ data: PyramidData; index: number }> = ({ data, index }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const L = data.layers[index];
  const prev = index === 0 ? 1 : data.layers[index - 1].share;
  const hit = usePunch(4, 16);
  const stampAt = Math.round(durationInFrames * 0.55);
  const stamp = usePunch(stampAt, 16);
  const tear = interpolate(frame, [0, 1, 7], [0, 0.8, 0], clamp);
  const last = index === data.layers.length - 1;
  return (
    <SceneShell shake={hit.shake * 0.6 + stamp.shake * 0.6}>
      <div style={{ position: "absolute", left: 64, right: 64, top: 220 }}>
        <Glitch amount={tear}>
          <Kinetic text={L.value} size={fit(L.value, 150)} delay={2} per={2} mode="snap" hero={L.value.split(" ").map((_, i) => i)} glow lineHeight={1} />
        </Glitch>
        <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
          <Paper delay={8} size={28}>{L.label}</Paper>
        </div>
      </div>
      {L.chips && (
        <div style={{ position: "absolute", right: 60, top: 160, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
          {L.chips.map((c, i) => (
            <Chip key={c} delay={10 + i * 6} tone={i === 0 ? "hero" : "neutral"} filled={i === 0} size={20}>{c}</Chip>
          ))}
        </div>
      )}
      <div style={{ position: "absolute", left: stockLeft, top: STOCK_TOP }}>
        <Stock from={prev} to={L.share} at={4} pulseTop={last ? Math.max(1, Math.round(L.share * 1000)) : 0} tone={last ? "bad" : "hero"} />
      </div>
      <div style={{ position: "absolute", left: stockLeft, top: STOCK_TOP + ROWS * DOT + 8, width: COLS * DOT, display: "flex", justifyContent: "space-between", fontFamily: theme.fonts.mono, fontSize: 18, color: palette.textDim, letterSpacing: "0.06em" }}>
        <span>{data.dotLabel ?? "1 ТОЧКА ≈ 8 МЛН ЧЕЛОВЕК"}</span>
        <span>{Math.round(L.share * 1000)} / {data.dotLabel ? "1,000" : "1 000"}</span>
      </div>
      {L.numbers && <Numbers items={L.numbers} />}
      {L.side && <SideCards left={L.side.left} right={L.side.right} at={12} />}
      {L.tiers && <Tiers items={L.tiers} at={16} />}
      <Evidence clip={L.clip} logos={L.logos} photos={L.photos} at={10} />
      {L.bills && <Bills srcs={L.bills} at={14} top={560} />}
      {L.stamp && frame >= stampAt && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 920, zIndex: 6, display: "flex", justifyContent: "center" }}>
          <Stamp tone={L.stamp.tone} size={fit(L.stamp.text, 110)} rotate={-6} delay={stampAt}>{L.stamp.text}</Stamp>
        </div>
      )}
      <Flash amount={hit.energy * 0.5} />
      <Flash amount={stamp.energy} color={L.stamp?.tone === "bad" ? colors.bad : palette.primary} />
    </SceneShell>
  );
};

const Country: React.FC<{ data: PyramidData }> = ({ data }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const C = data.country;
  const lit = Math.round(interpolate(frame, [6, 30], [0, C.share * 100], { easing: theme.ease.out, ...clamp }));
  const flag = useIn(2, "smooth");
  const stampAt = Math.round(durationInFrames * 0.55);
  const hit = usePunch(stampAt, 16);
  return (
    <SceneShell shake={hit.shake * 0.6}>
      {C.flag && (
        <div style={{ position: "absolute", right: 50, top: 190, width: 260, opacity: flag, transform: `rotate(${4 + Math.sin(frame / 18) * 2}deg) translateY(${interpolate(flag, [0, 1], [-60, 0])}px)`, boxShadow: colors.shadow }}>
          <Img src={media(C.flag)} style={{ width: 260, display: "block" }} />
        </div>
      )}
      {C.photo && (
        <div style={{ position: "absolute", left: 80, right: 80, top: 560, display: "flex", justifyContent: "center", opacity: flag, transform: `translateY(${interpolate(flag, [0, 1], [200, 0])}px) scale(${1 + frame * 0.0006})`, maskImage: "linear-gradient(180deg, #000 70%, transparent 98%)", WebkitMaskImage: "linear-gradient(180deg, #000 70%, transparent 98%)" }}>
          <Img src={media(C.photo)} style={{ height: 820, display: "block", filter: "grayscale(0.35) contrast(1.08) drop-shadow(0 30px 40px rgba(0,0,0,0.8))" }} />
        </div>
      )}
      {C.sprite && <Sprite dir={C.sprite.dir} count={C.sprite.count} fps={C.sprite.fps} h={C.sprite.h} at={4} />}
      {C.spin && <Spin src={C.spin.src} w={C.spin.w} label={C.spin.label} at={Math.round(durationInFrames * 0.3)} />}
      {C.flyIn && <FlyIn src={C.flyIn.src} w={C.flyIn.w} at={Math.round(durationInFrames * 0.35)} />}
      {C.side && <SideCards left={C.side.left} right={C.side.right} at={Math.round(durationInFrames * 0.45)} top={1130} />}
      {C.logos && (
        <div style={{ position: "absolute", left: 64, right: 64, top: 1330, display: "flex", gap: 14, justifyContent: "center", opacity: flag }}>
          {C.logos.map((l) => (
            <div key={l} style={{ padding: "12px 18px", background: colors.white, borderRadius: 10, boxShadow: colors.paperShadow }}>
              <Img src={media(l)} style={{ height: 50, display: "block" }} />
            </div>
          ))}
        </div>
      )}
      <div style={{ position: "absolute", left: 64, right: C.flag ? 340 : 64, top: 220 }}>
        <Kinetic text={C.value} size={fit(C.value, 150)} delay={2} per={2} mode="snap" hero={[0]} glow lineHeight={1} />
        <div style={{ marginTop: 14, display: "flex" }}>
          <Paper delay={8} size={26}>{C.label}</Paper>
        </div>
      </div>
      {C.share > 0 && <div style={{ position: "absolute", left: (1080 - 10 * 76) / 2, top: 640, display: "grid", gridTemplateColumns: "repeat(10, 64px)", gap: 12 }}>
        {Array.from({ length: 100 }, (_, i) => (
          <div key={i} style={{ width: 64, height: 64, borderRadius: 32, background: i < lit ? palette.primary : colors.surfaceLift, opacity: i < lit ? 0.95 : 0.6, boxShadow: i < lit ? `0 0 10px ${palette.glow}` : "none" }} />
        ))}
      </div>}
      {frame >= stampAt && (
        <div style={{ position: "absolute", left: 0, right: 0, top: C.photo ? 1450 : 1420, display: "flex", flexDirection: "column", alignItems: "center", gap: 12, zIndex: 4 }}>
          <Stamp tone={C.stamp.tone} size={fit(C.stamp.text, 92)} rotate={-5} delay={stampAt}>{C.stamp.text}</Stamp>
          <Paper delay={stampAt + 8} size={22}>{C.note}</Paper>
        </div>
      )}
      <Flash amount={hit.energy * 0.8} />
    </SceneShell>
  );
};

const Final: React.FC<{ data: PyramidData }> = ({ data }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const top = data.layers[data.layers.length - 1].share;
  const stampAt = Math.round(durationInFrames * 0.35);
  const hit = usePunch(stampAt, 20);
  const bob = Math.sin(frame / 6) * 10;
  return (
    <SceneShell exit={false} shake={hit.shake}>
      <div style={{ position: "absolute", left: 64, right: 64, top: 230 }}>
        <Kinetic text={data.final.pointer} size={fit(data.final.pointer, 120)} delay={2} per={2} mode="snap" hero={[0]} glow lineHeight={1} />
      </div>
      <div style={{ position: "absolute", left: stockLeft, top: STOCK_TOP }}>
        <Stock from={top} to={top} at={0} pulseTop={Math.max(1, Math.round(top * 1000))} tone="bad" />
      </div>
      {/* the pointer: a TikTok arrow bouncing at the peak */}
      <svg width={200} height={220} style={{ position: "absolute", left: 540 - 100, top: STOCK_TOP - 200 + bob }}>
        <path d="M100 40 L100 160" stroke={colors.bad} strokeWidth={14} strokeLinecap="round" />
        <path d="M50 140 L100 200 L150 140 Z" fill={colors.bad} />
      </svg>
      {frame >= stampAt && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1280, display: "flex", justifyContent: "center" }}>
          <Stamp tone="bad" size={fit(data.final.stamp, 96)} rotate={-5} delay={stampAt}>{data.final.stamp}</Stamp>
        </div>
      )}
      <div style={{ position: "absolute", left: 64, right: 64, top: 1560, textAlign: "center", fontFamily: theme.fonts.mono, fontSize: 17, lineHeight: 1.4, color: palette.textDim }}>{data.final.sources}</div>
      <Flash amount={hit.energy} color={colors.bad} />
    </SceneShell>
  );
};

export const Pyramid: React.FC<{ data: PyramidData; D: Record<string, number> }> = ({ data, D }) => {
  const { SCENES, VOICEOVER } = makePyramid(data, D);
  return (
    <Reel palette={palette} voiceoverDir={data.voiceoverDir} voiceover={VOICEOVER} voRate={1} captions={false} gradeOpacity={0.08}>
      <Scene spec={SCENES.hook} name="01 hook"><Hook data={data} /></Scene>
      <Scene spec={SCENES.l1} name="02 online"><Layer data={data} index={0} /></Scene>
      <Scene spec={SCENES.l2} name="03 weekly"><Layer data={data} index={1} /></Scene>
      <Scene spec={SCENES.l3} name="04 paying"><Layer data={data} index={2} /></Scene>
      <Scene spec={SCENES.country} name="05 country or makers"><Country data={data} /></Scene>
      <Scene spec={SCENES.final} name="06 final"><Final data={data} /></Scene>
    </Reel>
  );
};
