// «Проверь себя»: top-5 skills as one data-driven reel. Hook (five empty boxes,
// «у тебя: ?/5»), five skill beats packed for a pause or a rewatch (one word,
// an example drawn in one frame, a number, a meme sticker that flies in, the
// box that ticks, «как качать»), final (the five boxes tick, «сколько у тебя?»).
// A new language is a data file + a voiceover manifest; nothing here changes.
import React from "react";
import { Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../theme";
import { Reel, Scene, buildScenes, defineVoiceover, scenesDuration, useIn, usePunch, useRamp } from "../../reel";
import { drColors as colors, drPalette as palette } from "../digital-ruble/palette";
import { BrandBar, Chip, Flash, Glitch, Kinetic, SceneShell, Stamp } from "../digital-ruble/ui";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const media = (f: string) => staticFile(f);
const WIDE = `${theme.fonts.wide}, ${theme.fonts.mono}`;

type Tone = "bad" | "hero";
export type Half = { label: string; img: string; caption: string; tone: Tone; dull?: boolean; cross?: boolean };
export type Example =
  | { kind: "story"; photo: string; lines: string[]; stamp: string; badge?: string }
  | { kind: "split"; left: Half; right: Half; badge?: string }
  | { kind: "chat"; photo: string; user: string; bot: string; verdict: string; badge?: string };
export type SkillBeat = {
  word: string; // the skill, one word, huge
  clip: string; // background footage
  example: Example;
  num: { value: string; label: string };
  meme: { img: string; top: string; bottom: string };
  check: string; // «у меня есть …», ticks in the box
  tip: string; // how to train it
};
export type SkillData = {
  series: string;
  episode: string;
  voiceoverDir: string;
  rate: number;
  hook: { kicker: string; words: string[]; sub: string; clip: string; counter: string; props: { src: string; x: number; y: number; w: number; rot: number }[]; teasers: string[] };
  beats: SkillBeat[]; // index 0 = 5th … index 4 = 1st
  labels: { example: string; train: string; you: string; place: string };
  final: { line: string; stamp: string; counter: string };
  sources: string;
};

/* ---------------------------------------------------------- timing */

export const makeSkillCheck = (data: SkillData, D: Record<string, number>) => {
  const keys = Object.keys(D);
  const v = (k: string) => (D[k] ?? 2) / data.rate;
  const hook = v(keys[0]) + 0.4;
  const fin = Math.max(2.2, v(keys[6]) + 0.8);
  // every beat is its voiced line plus room to read; the room shrinks until the reel fits 29.8 s
  let room = 1.6;
  const len = (i: number) => Math.max(3.4, v(keys[i + 1]) + room);
  const total = () => hook + fin + [0, 1, 2, 3, 4].reduce((t, i) => t + len(i), 0);
  while (total() > 29.8 && room > 0.25) room -= 0.05;
  const SCENES = buildScenes({ hook, p5: len(0), p4: len(1), p3: len(2), p2: len(3), p1: len(4), final: fin });
  const order = ["hook", "p5", "p4", "p3", "p2", "p1", "final"] as const;
  const VOICEOVER = defineVoiceover(
    D,
    keys.slice(0, 7).map((file, i) => ({ file, start: SCENES[order[i]].from + (i === 0 ? 0 : 0.1), rate: data.rate })),
  );
  return { SCENES, VOICEOVER, DURATION: scenesDuration(SCENES) };
};

/* ----------------------------------------------------------- parts */

const BgClip: React.FC<{ src: string; dim?: number }> = ({ src, dim = 0.55 }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const zoom = interpolate(frame, [0, durationInFrames], [1.05, 1.18], clamp);
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <OffthreadVideo src={media(src)} muted startFrom={Math.round(0.5 * fps)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${zoom})`, filter: `saturate(1.25) contrast(1.1) brightness(${1 - dim})` }} />
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${palette.bg}F0 0%, ${palette.bg}66 26%, ${palette.bg}88 60%, ${palette.bg}F4 90%)` }} />
    </div>
  );
};

/** A still that never sits still: slow push and pan. */
const Ken: React.FC<{ src: string; style?: React.CSSProperties; filter?: string; seed?: number }> = ({ src, style, filter, seed = 0 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const k = interpolate(frame, [0, durationInFrames], [1.02, 1.12], clamp);
  const x = interpolate(frame, [0, durationInFrames], [0, seed % 2 ? -18 : 18], clamp);
  return (
    <div style={{ overflow: "hidden", ...style }}>
      <Img src={media(src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${k}) translateX(${x}px)`, filter }} />
    </div>
  );
};

const Box: React.FC<{ on: number; size: number; tone?: Tone }> = ({ on, size, tone = "hero" }) => {
  const c = tone === "hero" ? palette.primary : colors.bad;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ flex: "none" }}>
      <rect x={6} y={6} width={88} height={88} rx={14} fill={on > 0 ? `${c}26` : "rgba(0,0,0,0.35)"} stroke={on > 0 ? c : colors.lineStrong} strokeWidth={8} />
      <path d="M24 52 L43 70 L78 30" fill="none" stroke={c} strokeWidth={13} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - on} opacity={on > 0 ? 1 : 0} />
    </svg>
  );
};

/** Five boxes top right: which skill we are on, and which already ticked. */
const Tally: React.FC<{ index: number; tickAt: number; label: string }> = ({ index, tickAt, label }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", right: 52, top: 218, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
      <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 20, letterSpacing: "0.12em", color: palette.textDim }}>{label}</div>
      <div style={{ display: "flex", gap: 8 }}>
        {[0, 1, 2, 3, 4].map((i) => {
          const on = i < index ? 1 : i === index ? interpolate(frame - tickAt, [0, 10], [0, 1], { easing: theme.ease.out, ...clamp }) : 0;
          const pulse = i === index ? 1 + Math.sin(frame / 5) * 0.06 : 1;
          return <div key={i} style={{ transform: `scale(${pulse})`, opacity: i > index ? 0.45 : 1 }}><Box on={on} size={46} /></div>;
        })}
      </div>
    </div>
  );
};

/** Impact-style caption on a meme: white with a black outline. */
const MemeText: React.FC<{ text: string; size: number }> = ({ text, size }) => (
  <div style={{ fontFamily: WIDE, fontWeight: 900, fontSize: size, lineHeight: 1.02, color: colors.white, textAlign: "center", WebkitTextStroke: `${Math.max(3, size * 0.09)}px #000`, paintOrder: "stroke fill", textShadow: "0 4px 0 #000" }}>{text}</div>
);

/** The meme flies in TikTok-style: off-screen spin, overshoot, then wobbles like a sticker. */
const Meme: React.FC<{ m: SkillBeat["meme"]; at: number; x: number; y: number; w: number }> = ({ m, at, x, y, w }) => {
  const frame = useCurrentFrame();
  const q = useIn(at, "bouncy");
  if (frame < at) return null;
  const k = frame - at;
  const h = w * 1.12;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, zIndex: 8, transform: `translate(${interpolate(q, [0, 1], [620, 0])}px, ${interpolate(q, [0, 1], [-260, 0])}px) rotate(${interpolate(q, [0, 1], [48, 5]) + Math.sin(k / 7) * 2.5}deg) scale(${interpolate(q, [0, 1], [0.35, 1]) + Math.sin(k / 11) * 0.015})` }}>
      <div style={{ position: "relative", padding: 10, background: colors.white, borderRadius: 14, boxShadow: "0 40px 70px -20px rgba(0,0,0,0.9)" }}>
        <Ken src={m.img} seed={1} style={{ width: w - 20, height: h, borderRadius: 6 }} />
        <div style={{ position: "absolute", left: 18, right: 18, top: 22 }}><MemeText text={m.top} size={40} /></div>
        <div style={{ position: "absolute", left: 18, right: 18, bottom: 26 }}><MemeText text={m.bottom} size={46} /></div>
      </div>
    </div>
  );
};

const Label: React.FC<{ text: string; tone: Tone; at: number; size?: number; rotate?: number }> = ({ text, tone, at, size = 26, rotate = -2 }) => {
  const q = useIn(at, "snappy");
  return (
    <div style={{ alignSelf: "flex-start", padding: `${size * 0.3}px ${size * 0.55}px`, background: tone === "bad" ? colors.bad : palette.primary, color: tone === "bad" ? colors.white : colors.ink2, fontFamily: WIDE, fontWeight: 900, fontSize: size, lineHeight: 1.05, opacity: q, transform: `translateY(${interpolate(q, [0, 1], [18, 0])}px) rotate(${rotate}deg) scale(${interpolate(q, [0, 1], [1.2, 1])})`, boxShadow: colors.paperShadow }}>{text}</div>
  );
};

const Badge: React.FC<{ text: string; at: number }> = ({ text, at }) => {
  const q = useIn(at, "snappy");
  return <div style={{ position: "absolute", left: 14, bottom: 14, padding: "6px 12px", background: "rgba(0,0,0,0.78)", color: palette.text, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 19, letterSpacing: "0.06em", borderRadius: 6, opacity: q, zIndex: 3 }}>{text}</div>;
};

/** A red stroke drawn across, for the «wrong way» half. */
const Strike: React.FC<{ at: number }> = ({ at }) => {
  const p = useRamp(at, at + 8, theme.ease.out);
  return (
    <svg style={{ position: "absolute", inset: 0, zIndex: 4 }} width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
      <line x1={8} y1={12} x2={8 + 84 * p} y2={12 + 76 * p} stroke={colors.bad} strokeWidth={4} strokeLinecap="round" vectorEffect="non-scaling-stroke" style={{ strokeWidth: 14 }} />
    </svg>
  );
};

const PANEL = { top: 380, h: 560 } as const;

const Story: React.FC<{ e: Extract<Example, { kind: "story" }>; at: number }> = ({ e, at }) => {
  const q = useIn(at, "smooth");
  const stamp = usePunch(at + 30, 14);
  return (
    <div style={{ position: "absolute", left: 52, right: 52, top: PANEL.top, height: PANEL.h, display: "flex", gap: 22, opacity: q, transform: `translateY(${interpolate(q, [0, 1], [60, 0])}px)` }}>
      <div style={{ position: "relative", width: 420, height: PANEL.h, borderRadius: 18, overflow: "hidden", border: `4px solid ${colors.white}`, boxShadow: colors.shadow, flex: "none" }}>
        <Ken src={e.photo} style={{ width: "100%", height: "100%" }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 230, display: "flex", justifyContent: "center", zIndex: 3, transform: `scale(${1 + stamp.pop * 0.1})` }}>
          <Stamp tone="bad" size={50} rotate={-12} delay={at + 30}>{e.stamp}</Stamp>
        </div>
        {e.badge && <Badge text={e.badge} at={at + 10} />}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14, justifyContent: "center" }}>
        {e.lines.map((l, i) => (
          <Line key={l} text={l} at={at + 6 + i * 8} n={i + 1} />
        ))}
      </div>
    </div>
  );
};

const Line: React.FC<{ text: string; at: number; n: number }> = ({ text, at, n }) => {
  const q = useIn(at, "snappy");
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "flex-start", opacity: q, transform: `translateX(${interpolate(q, [0, 1], [70, 0])}px)` }}>
      <div style={{ flex: "none", width: 44, height: 44, borderRadius: 22, background: palette.primary, color: colors.ink2, fontFamily: WIDE, fontWeight: 900, fontSize: 24, display: "flex", alignItems: "center", justifyContent: "center" }}>{n}</div>
      <div style={{ padding: "8px 14px", background: colors.paper, color: colors.ink, fontFamily: WIDE, fontWeight: 900, fontSize: 31, lineHeight: 1.1, boxShadow: colors.paperShadow }}>{text}</div>
    </div>
  );
};

const HalfCard: React.FC<{ h: Half; at: number; seed: number }> = ({ h, at, seed }) => {
  const q = useIn(at, "smooth");
  const w = 476;
  return (
    <div style={{ width: w, display: "flex", flexDirection: "column", gap: 10, opacity: q, transform: `translateY(${interpolate(q, [0, 1], [70, 0])}px) rotate(${seed ? 1.2 : -1.2}deg)` }}>
      <Label text={h.label} tone={h.tone} at={at + 2} size={23} />
      <div style={{ position: "relative", width: w, height: 380, borderRadius: 18, overflow: "hidden", border: `4px solid ${h.tone === "bad" ? colors.bad : palette.primary}`, boxShadow: h.tone === "hero" ? `0 0 46px ${palette.glow}` : `0 0 30px ${colors.badGlow}` }}>
        <Ken src={h.img} seed={seed} style={{ width: "100%", height: "100%" }} filter={h.dull ? "grayscale(1) blur(3px) brightness(0.75) contrast(0.8)" : "saturate(1.45) contrast(1.08)"} />
        {h.cross && <Strike at={at + 14} />}
      </div>
      <div style={{ padding: "8px 12px", background: colors.paper, color: colors.ink, fontFamily: WIDE, fontWeight: 900, fontSize: 25, lineHeight: 1.1, boxShadow: colors.paperShadow }}>{h.caption}</div>
    </div>
  );
};

const Split: React.FC<{ e: Extract<Example, { kind: "split" }>; at: number }> = ({ e, at }) => (
  <div style={{ position: "absolute", left: 48, right: 48, top: PANEL.top + 8, display: "flex", justifyContent: "space-between" }}>
    <HalfCard h={e.left} at={at} seed={0} />
    <HalfCard h={e.right} at={at + 10} seed={1} />
  </div>
);

const Bubble: React.FC<{ text: string; who: "user" | "bot"; at: number }> = ({ text, who, at }) => {
  const q = useIn(at, "bouncy");
  const user = who === "user";
  return (
    <div style={{ alignSelf: user ? "flex-end" : "flex-start", maxWidth: 470, padding: "16px 20px", borderRadius: 26, borderBottomRightRadius: user ? 6 : 26, borderBottomLeftRadius: user ? 26 : 6, background: user ? palette.primary : colors.white, color: colors.ink2, fontFamily: WIDE, fontWeight: 900, fontSize: 30, lineHeight: 1.12, boxShadow: colors.paperShadow, opacity: q, transform: `scale(${interpolate(q, [0, 1], [0.5, 1])})`, transformOrigin: user ? "right bottom" : "left bottom" }}>
      {!user && <div style={{ fontFamily: theme.fonts.mono, fontSize: 17, letterSpacing: "0.1em", color: colors.inkFaded, marginBottom: 4 }}>ЧАТ-БОТ</div>}
      {text}
    </div>
  );
};

const Chat: React.FC<{ e: Extract<Example, { kind: "chat" }>; at: number }> = ({ e, at }) => {
  const q = useIn(at, "smooth");
  const hit = usePunch(at + 34, 16);
  return (
    <div style={{ position: "absolute", left: 52, right: 52, top: PANEL.top, height: PANEL.h, opacity: q }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 380, height: PANEL.h, borderRadius: 18, overflow: "hidden", border: `4px solid ${colors.white}`, boxShadow: colors.shadow, transform: "rotate(-2deg)" }}>
        <Ken src={e.photo} style={{ width: "100%", height: "100%" }} />
        {e.badge && <Badge text={e.badge} at={at + 8} />}
      </div>
      <div style={{ position: "absolute", left: 330, right: 0, top: 40, display: "flex", flexDirection: "column", gap: 18 }}>
        <Bubble text={e.user} who="user" at={at + 6} />
        <Bubble text={e.bot} who="bot" at={at + 18} />
      </div>
      <div style={{ position: "absolute", left: 330, right: 0, top: 400, display: "flex", justifyContent: "center", transform: `scale(${1 + hit.pop * 0.12})` }}>
        <Stamp tone="bad" size={58} rotate={-7} delay={at + 34}>{e.verdict}</Stamp>
      </div>
    </div>
  );
};

/** Number particles drifting up behind: the TikTok «data» texture. */
const Drift: React.FC<{ items: string[] }> = ({ items }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {Array.from({ length: 12 }, (_, k) => (
        <div key={k} style={{ position: "absolute", left: 30 + ((k * 211) % 980), top: 1900 - ((frame * (2 + (k % 3)) + k * 160) % 2000), fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 28 + (k % 3) * 10, color: k % 4 === 0 ? colors.bad : palette.primary, opacity: 0.2 }}>{items[k % items.length]}</div>
      ))}
    </div>
  );
};

// Unbounded Black digits ≈ 0.95 em; a 560 px column for the number.
const fitNum = (s: string) => Math.max(70, Math.min(150, Math.floor(560 / (s.replace(/ /g, "").length * 0.9 + 0.3))));

/* ---------------------------------------------------------- scenes */

const Hook: React.FC<{ data: SkillData }> = ({ data }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const h = data.hook;
  const boxesAt = Math.round(0.9 * fps);
  const hit = usePunch(boxesAt, 14);
  const counterAt = Math.round(2.6 * fps);
  const counter = usePunch(counterAt, 14);
  return (
    <SceneShell exit={false} shake={hit.shake * 0.6 + counter.shake * 0.5}>
      <BgClip src={h.clip} dim={0.62} />
      <Drift items={h.teasers} />
      {h.props.map((p, i) => {
        const q = interpolate(frame - (6 + i * 5), [0, 12], [0, 1], { easing: theme.ease.out, ...clamp });
        return (
          <div key={p.src} style={{ position: "absolute", left: p.x, top: p.y, width: p.w, padding: 8, background: colors.white, boxShadow: colors.shadow, opacity: q, transform: `translateY(${interpolate(q, [0, 1], [90, 0]) + Math.sin(frame / 17 + i) * 6}px) rotate(${p.rot + Math.sin(frame / 23 + i) * 1.5}deg)`, zIndex: 1 }}>
            <Ken src={p.src} seed={i} style={{ width: p.w - 16, height: (p.w - 16) * 1.25 }} />
          </div>
        );
      })}
      <BrandBar series={data.series} episode={data.episode} delay={-30} />
      <div style={{ position: "absolute", left: 64, right: 64, top: 230, zIndex: 3 }}>
        <div style={{ display: "inline-block", marginBottom: 16, padding: "8px 16px", background: colors.bad, color: colors.white, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 30, letterSpacing: "0.12em", transform: "rotate(-2deg)", boxShadow: `0 0 30px ${colors.badGlow}` }}>{h.kicker}</div>
        <Kinetic text={h.words.join(" ")} size={104} delay={-12} per={3} mode="snap" hero={[0]} glow lineHeight={1.02} />
        <div style={{ marginTop: 22, display: "inline-block", padding: "10px 18px", background: colors.paper, color: colors.ink, fontFamily: WIDE, fontWeight: 900, fontSize: 34, boxShadow: colors.paperShadow, transform: "rotate(-1deg)" }}>{h.sub}</div>
      </div>
      {/* five empty boxes, the self-check */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 760, display: "flex", justifyContent: "center", gap: 22, zIndex: 3 }}>
        {[0, 1, 2, 3, 4].map((i) => {
          const q = interpolate(frame - boxesAt - i * 4, [0, 10], [0, 1], { easing: theme.ease.out, ...clamp });
          return (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, opacity: q, transform: `translateY(${interpolate(q, [0, 1], [80, 0]) + Math.sin(frame / 9 + i) * 4}px) scale(${interpolate(q, [0, 1], [1.5, 1])})` }}>
              <Box on={0} size={150} />
              <div style={{ fontFamily: WIDE, fontWeight: 900, fontSize: 40, color: palette.primary, textShadow: `0 0 20px ${palette.glow}`, opacity: 0.55 + Math.sin(frame / 5 + i) * 0.4 }}>?</div>
            </div>
          );
        })}
      </div>
      {frame >= counterAt && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1030, display: "flex", justifyContent: "center", zIndex: 4, transform: `scale(${1 + counter.pop * 0.1})` }}>
          <Stamp tone="hero" size={76} rotate={-4} delay={counterAt}>{h.counter}</Stamp>
        </div>
      )}
      <Flash amount={hit.energy * 0.5} />
    </SceneShell>
  );
};

const Beat: React.FC<{ data: SkillData; index: number }> = ({ data, index }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const b = data.beats[index];
  const rank = 5 - index;
  const slam = usePunch(0, 16);
  const dock = useRamp(6, 14, theme.ease.inOut);
  const exAt = 12;
  const numAt = Math.round(1.3 * fps);
  const memeAt = Math.round(1.7 * fps);
  const tickAt = Math.round(durationInFrames * 0.62);
  const tipAt = Math.round(2.2 * fps);
  const num = usePunch(numAt, 14);
  const tick = usePunch(tickAt, 12);
  const tear = interpolate(frame, [0, 1, 8], [0, 0.9, 0], clamp);
  const tipQ = useIn(tipAt, "smooth");
  const checkQ = useIn(tickAt - 6, "snappy");
  return (
    <SceneShell shake={slam.shake + num.shake * 0.5 + tick.shake * 0.4}>
      <Glitch amount={tear} style={{ position: "absolute", inset: 0 }}>
        <BgClip src={b.clip} />
      </Glitch>
      <BrandBar series={data.series} episode={data.episode} delay={-30} />
      {/* rank + the one word: slams full frame, docks top left */}
      <div style={{ position: "absolute", left: interpolate(dock, [0, 1], [0, 56]), top: interpolate(dock, [0, 1], [640, 200]), width: interpolate(dock, [0, 1], [1080, 700]), display: "flex", justifyContent: dock > 0.5 ? "flex-start" : "center", alignItems: "center", gap: 18, zIndex: 5 }}>
        <span style={{ fontFamily: WIDE, fontWeight: 900, fontSize: interpolate(dock, [0, 1], [380, 130]), lineHeight: 0.9, color: palette.primary, textShadow: `0 0 ${interpolate(dock, [0, 1], [110, 34])}px ${palette.glow}`, transform: `scale(${1 + slam.pop * 0.12})` }}>{rank}</span>
        <span style={{ fontFamily: WIDE, fontWeight: 900, fontSize: interpolate(dock, [0, 1], [110, b.word.length > 7 ? 60 : b.word.length > 6 ? 66 : 76]), lineHeight: 1, color: palette.text, letterSpacing: "-0.02em" }}>{b.word}</span>
      </div>
      <Tally index={index} tickAt={tickAt} label={data.labels.you} />
      {/* the example, one frame */}
      <div style={{ position: "absolute", left: 56, top: 340, zIndex: 4 }}>
        {frame >= exAt && (
          <div style={{ display: "flex", gap: 10 }}>
            <Chip delay={exAt} tone="hero" filled size={20}>{data.labels.example}</Chip>
            {b.example.kind === "split" && b.example.badge && <Chip delay={exAt + 8} tone="neutral" filled size={20}>{b.example.badge}</Chip>}
          </div>
        )}
      </div>
      {frame >= exAt && b.example.kind === "story" && <Story e={b.example} at={exAt} />}
      {frame >= exAt && b.example.kind === "split" && <Split e={b.example} at={exAt} />}
      {frame >= exAt && b.example.kind === "chat" && <Chat e={b.example} at={exAt} />}
      {/* the number */}
      {frame >= numAt && (
        <div style={{ position: "absolute", left: 56, top: 990, width: 560, zIndex: 6, display: "flex", flexDirection: "column", gap: 12, transform: `scale(${1 + num.pop * 0.07})`, transformOrigin: "left center" }}>
          <Kinetic text={b.num.value} size={fitNum(b.num.value)} delay={numAt} per={2} mode="snap" hero={b.num.value.split(" ").map((_, i) => i)} glow lineHeight={1} />
          <div style={{ alignSelf: "flex-start", padding: "8px 14px", background: colors.paper, color: colors.ink, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 23, letterSpacing: "0.04em", lineHeight: 1.25, boxShadow: colors.paperShadow }}>{b.num.label}</div>
        </div>
      )}
      <Meme m={b.meme} at={memeAt} x={640} y={960} w={390} />
      {/* the box that ticks: «у меня есть …» */}
      <div style={{ position: "absolute", left: 56, top: 1262, width: 580, display: "flex", alignItems: "center", gap: 16, zIndex: 6, opacity: checkQ, transform: `translateX(${interpolate(checkQ, [0, 1], [-60, 0])}px) scale(${1 + tick.pop * 0.06})` }}>
        <Box on={interpolate(frame - tickAt, [0, 10], [0, 1], { easing: theme.ease.out, ...clamp })} size={78} />
        <div style={{ fontFamily: WIDE, fontWeight: 900, fontSize: 30, lineHeight: 1.08, color: palette.text, textShadow: "0 3px 12px rgba(0,0,0,0.9)" }}>{b.check}</div>
      </div>
      {/* how to train it */}
      <div style={{ position: "absolute", left: 44, right: 44, top: 1420, zIndex: 7, opacity: tipQ, transform: `translateY(${interpolate(tipQ, [0, 1], [120, 0])}px) rotate(${-0.8 + Math.sin(frame / 20) * 0.3}deg)` }}>
        <div style={{ padding: "18px 24px 22px", background: palette.primary, color: colors.ink2, borderRadius: 16, boxShadow: `0 0 50px ${palette.glow}, ${colors.shadow}` }}>
          <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 22, letterSpacing: "0.16em", marginBottom: 8 }}>{data.labels.train}</div>
          <div style={{ fontFamily: WIDE, fontWeight: 900, fontSize: 38, lineHeight: 1.1 }}>{b.tip}</div>
        </div>
      </div>
      <Flash amount={num.energy * 0.5} />
      <Flash amount={tick.energy * 0.5} color={palette.primary} />
    </SceneShell>
  );
};

const Final: React.FC<{ data: SkillData }> = ({ data }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const stampAt = Math.round(durationInFrames * 0.5);
  const hit = usePunch(stampAt, 18);
  return (
    <SceneShell exit={false} shake={hit.shake}>
      <BgClip src={data.hook.clip} dim={0.7} />
      <div style={{ position: "absolute", left: 64, right: 64, top: 220 }}>
        <Kinetic text={data.final.line} size={96} delay={2} per={3} mode="snap" hero={[1]} glow lineHeight={1.04} />
      </div>
      <div style={{ position: "absolute", left: 64, right: 64, top: 520, display: "flex", flexDirection: "column", gap: 18 }}>
        {data.beats.map((b, i) => {
          const at = 4 + i * Math.round(0.18 * fps);
          const q = interpolate(frame - at, [0, 10], [0, 1], { easing: theme.ease.out, ...clamp });
          const on = interpolate(frame - at - 6, [0, 8], [0, 1], { easing: theme.ease.out, ...clamp });
          return (
            <div key={b.word} style={{ display: "flex", alignItems: "center", gap: 22, opacity: q, transform: `translateX(${interpolate(q, [0, 1], [-80, 0])}px)` }}>
              <Box on={on} size={96} />
              <span style={{ fontFamily: WIDE, fontWeight: 900, fontSize: 40, color: palette.primary, width: 44 }}>{5 - i}</span>
              <span style={{ fontFamily: WIDE, fontWeight: 900, fontSize: 62, color: palette.text }}>{b.word}</span>
            </div>
          );
        })}
      </div>
      {frame >= stampAt && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1240, display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
          <Stamp tone="hero" size={88} rotate={-4} delay={stampAt}>{data.final.counter}</Stamp>
          <Stamp tone="bad" size={54} rotate={3} delay={stampAt + 6}>{data.final.stamp}</Stamp>
        </div>
      )}
      <div style={{ position: "absolute", left: 64, right: 64, top: 1600, textAlign: "center", fontFamily: theme.fonts.mono, fontSize: 17, lineHeight: 1.4, color: palette.textDim }}>{data.sources}</div>
      <Flash amount={hit.energy} color={palette.primary} />
    </SceneShell>
  );
};

export const SkillCheck: React.FC<{ data: SkillData; D: Record<string, number> }> = ({ data, D }) => {
  const { SCENES, VOICEOVER } = makeSkillCheck(data, D);
  const order = ["p5", "p4", "p3", "p2", "p1"] as const;
  return (
    <Reel palette={palette} voiceoverDir={data.voiceoverDir} voiceover={VOICEOVER} voRate={1} captions={false} gradeOpacity={0.08}>
      <Scene spec={SCENES.hook} name="01 hook">
        <Hook data={data} />
      </Scene>
      {order.map((k, i) => (
        <Scene key={k} spec={SCENES[k]} name={`0${i + 2} skill ${5 - i}`}>
          <Beat data={data} index={i} />
        </Scene>
      ))}
      <Scene spec={SCENES.final} name="07 final">
        <Final data={data} />
      </Scene>
    </Reel>
  );
};
