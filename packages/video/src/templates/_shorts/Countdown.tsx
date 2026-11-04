// The «ДЕНЬГИ · ПРОСТО» countdown, as one data-driven reel: hook (words drop,
// five teaser screens), five places (full-bleed licensed clip, rank slam,
// title, chips, number with its caption, stamp), final (the five side by
// side, the line, the stamp held to the last frame). A new top-5 is a data
// file + a voiceover manifest; nothing here changes. Under 30 s by design
// (PLAYBOOK §16): lengths come from the measured clips and are capped.
import React from "react";
import { Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../theme";
import { Reel, Scene, buildScenes, defineVoiceover, scenesDuration, useIn, usePunch, useRamp } from "../../reel";
import { drColors as colors, drPalette as palette } from "../digital-ruble/palette";
import { BrandBar, Chip, Flash, Glitch, Kinetic, SceneShell, Stamp } from "../digital-ruble/ui";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export type CountdownPlace = {
  title: string; // what the voice names, big
  chips: string[]; // 2–3 short facts, top right
  clip: string; // media/<kit>/<file>.mp4
  logo?: string; // images/kit/<file>, on a white card
  num: { value: string; label: string };
  stamp: { text: string; tone: "bad" | "hero"; label?: string };
  credit?: string;
  person?: { src: string; w: number; ratio: number }; // cut-out worker, rises bottom right
  why?: string; // «почему ИИ», red paper under the title
  whyTitle?: string; // «ПОЧЕМУ ИИ» / «WHY AI»
  logos?: string[]; // extra logos in the why box
  photo?: string; // a small real photo when there is no person
  props?: Prop[]; // extra real cut-outs / photos floating in the frame
  numbers?: string[]; // number particles drifting behind
};
export type Prop = { src: string; x: number; y: number; w: number; rot?: number; at?: number; card?: boolean; z?: number };
export type CountdownData = {
  series: string;
  episode: string;
  voiceoverDir: string;
  rate: number;
  hook: { words: string[]; badWord?: number; sub: string; clip: string; chips: string[]; meme?: string; killer?: string; skull?: boolean; sign?: string; kicker?: string; kill?: boolean; presenter?: { file: string; from: number; duration: number; caption: string }; props?: Prop[]; numbers?: string[] };
  places: CountdownPlace[]; // index 0 = 5th place … index 4 = 1st
  final: { line: string; badWords?: number[]; stamp: string };
  rankWord: string; // «МЕСТО» / «PLACE»
  sources: string; // the line printed in the final
  dark?: boolean; // grim look: darker footage, red edge glow, scanline flicker
};

/* ---------------------------------------------------------- timing */

export const makeCountdown = (data: CountdownData, D: Record<string, number>) => {
  const keys = Object.keys(D); // 01-hook, 02…06 places, 07-final
  const r = data.rate;
  const v = (k: string) => (D[k] ?? 2) / r;
  const hook = v(keys[0]) + 0.5;
  const fin = v(keys[6]) + 1.6;
  // a place is its line plus room to read; shrink the room until it fits 29.8 s
  let room = 2.4;
  const placeLen = (i: number) => Math.max(3.4, v(keys[i + 1]) + room);
  const total = () => hook + fin + [0, 1, 2, 3, 4].reduce((s, i) => s + placeLen(i), 0);
  while (total() > 29.8 && room > 0.6) room -= 0.1;
  const SCENES = buildScenes({
    hook,
    p5: placeLen(0),
    p4: placeLen(1),
    p3: placeLen(2),
    p2: placeLen(3),
    p1: placeLen(4),
    final: fin,
  });
  const order = ["hook", "p5", "p4", "p3", "p2", "p1", "final"] as const;
  const VOICEOVER = defineVoiceover(
    D,
    keys.slice(0, 7).map((file, i) => ({ file, start: SCENES[order[i]].from + (i === 0 ? 0 : 0.12), rate: r })),
  );
  return { SCENES, VOICEOVER, DURATION: scenesDuration(SCENES) };
};

/* ----------------------------------------------------------- parts */

const media = (f: string) => staticFile(f);

/** A licensed clip filling the frame, graded into the series, slow push-in. */
const BgClip: React.FC<{ src: string; dim?: number; dark?: boolean }> = ({ src, dim = 0.5, dark }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const zoom = interpolate(frame, [0, durationInFrames], [1.04, 1.16], clamp);
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <OffthreadVideo
        src={media(src)}
        muted
        startFrom={Math.round(0.3 * fps)}
        style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${zoom})`, filter: `grayscale(0.35) contrast(1.12) brightness(${1 - dim})` }}
      />
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${palette.bg}EE 0%, ${palette.bg}55 30%, ${palette.bg}44 55%, ${palette.bg}F2 88%)` }} />
      {dark && <Grim />}
    </div>
  );
};

/** The grim layer: red edge glow that breathes, a flickering bar, film noise lines. */
const Grim: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = 0.55 + Math.sin(frame / 9) * 0.15;
  const flick = (frame % 47 < 2) ? 0.35 : 0;
  return (
    <>
      <div style={{ position: "absolute", inset: 0, boxShadow: `inset 0 0 260px rgba(255,40,40,${(0.35 * pulse).toFixed(3)})` }} />
      <div style={{ position: "absolute", inset: 0, background: "rgba(120,0,0,0.12)", mixBlendMode: "multiply" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: (frame * 37) % 1920, height: 3, background: "rgba(255,255,255,0.08)" }} />
      <div style={{ position: "absolute", inset: 0, background: "#000", opacity: flick }} />
    </>
  );
};

/** Each word lands inside a lime block that burns off (the usd-five-people hook). */
const DropWords: React.FC<{ words: string[]; bad?: number; every: number; size: number; pre?: boolean }> = ({ words, bad, every, size, pre }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ display: "flex", flexWrap: "wrap", columnGap: 22, rowGap: 6, fontFamily: `${theme.fonts.wide}, ${theme.fonts.mono}`, fontSize: size, fontWeight: 900, lineHeight: 1.02, letterSpacing: "-0.02em" }}>
      {words.map((w, i) => {
        // pre: the whole headline is already down on frame 0 (the cover), when a face takes the next seconds
        const at = pre ? -40 + i * 4 : i === 0 ? -10 : Math.round(i * every * fps);
        const p = interpolate(frame - at, [0, 8], [0, 1], { easing: theme.ease.out, ...clamp });
        const burn = interpolate(frame - at, [2, 14], [1, 0], { easing: theme.ease.out, ...clamp });
        const color = i === bad ? colors.bad : i === words.length - 1 ? palette.primary : palette.text;
        return (
          <span key={i} style={{ position: "relative", display: "inline-block", opacity: frame >= at ? 1 : 0, transform: `translateY(${interpolate(p, [0, 1], [-60, 0])}px) scale(${interpolate(p, [0, 1], [1.4, 1])})`, transformOrigin: "left bottom" }}>
            <span style={{ position: "absolute", inset: "-0.04em -0.1em -0.02em", background: palette.primary, opacity: burn, boxShadow: `0 0 ${size * 0.6}px ${palette.glow}` }} />
            <span style={{ position: "relative", color: burn > 0.5 ? colors.ink2 : color }}>{w}</span>
          </span>
        );
      })}
    </div>
  );
};

const Paper: React.FC<{ children: React.ReactNode; delay?: number; size?: number; rotate?: number }> = ({ children, delay = 0, size = 24, rotate = -1 }) => {
  const p = useIn(delay, "snappy");
  return (
    <div style={{ alignSelf: "flex-start", padding: `${size * 0.35}px ${size * 0.7}px`, background: colors.paper, color: colors.ink, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: size, letterSpacing: "0.08em", lineHeight: 1.25, boxShadow: colors.paperShadow, opacity: p, transform: `translateY(${interpolate(p, [0, 1], [16, 0])}px) rotate(${rotate}deg)` }}>
      {children}
    </div>
  );
};

/** 5 progress pips: the countdown position, TikTok style. */
const Pips: React.FC<{ active: number }> = ({ active }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: 1700, display: "flex", justifyContent: "center", gap: 14 }}>
    {[5, 4, 3, 2, 1].map((n, i) => (
      <div key={n} style={{ width: i === active ? 70 : 22, height: 22, borderRadius: 11, background: i <= active ? palette.primary : colors.lineStrong, boxShadow: i === active ? `0 0 20px ${palette.glow}` : "none" }} />
    ))}
  </div>
);

// Unbounded Black digits ≈ 0.95 em, a space ≈ 0.35 em; 960 px column.
const fit = (s: string, max: number) => Math.max(54, Math.min(max, Math.floor(960 / (s.replace(/ /g, "").length * 0.92 + (s.split(" ").length - 1) * 0.33))));

/** The author's HeyGen podcaster, full frame (16:9 look letterboxed in 9:16 by HeyGen, so it is scaled to fill). */
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
    <div style={{ position: "absolute", inset: 0, zIndex: 10, overflow: "hidden", opacity: 1 - out, transform: `scale(${interpolate(inP, [0, 1], [1.08, 1]) + k * 0.0008})` }}>
      {/* the clip must start where the face appears, not at the scene start: a Sequence resets its clock (the bug: lips ahead of the voice, then a frozen last frame) */}
      <Sequence from={at} layout="none">
        <OffthreadVideo src={media(p.file)} muted playbackRate={rate} style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scale(3.3)", transformOrigin: "50% 50%" }} />
      </Sequence>
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, transparent 60%, ${palette.bg}CC 92%)` }} />
      <div style={{ position: "absolute", left: 64, right: 64, top: 1430, display: "flex", justifyContent: "center", opacity: inP }}>
        <div style={{ padding: "14px 24px", background: colors.paper, color: colors.ink, fontFamily: `${theme.fonts.wide}, ${theme.fonts.mono}`, fontWeight: 900, fontSize: 46, lineHeight: 1.1, textAlign: "center", boxShadow: colors.paperShadow, transform: "rotate(-1.5deg)" }}>{p.caption}</div>
      </div>
      <Flash amount={interpolate(k, [0, 4], [0.8, 0], clamp)} />
    </div>
  );
};

/** Real cut-outs and photos scattered in the frame, each sliding in and breathing. */
const Props: React.FC<{ items: Prop[]; base?: number }> = ({ items, base = 0 }) => {
  const frame = useCurrentFrame();
  return (
    <>
      {items.map((it, i) => {
        const at = base + (it.at ?? i * 4);
        const q = interpolate(frame - at, [0, 12], [0, 1], { easing: theme.ease.out, ...clamp });
        const bob = Math.sin(frame / 18 + i * 1.3) * 6;
        const rot = (it.rot ?? 0) + Math.sin(frame / 27 + i) * 1.5;
        return (
          <div key={it.src + i} style={{ position: "absolute", left: it.x, top: it.y, width: it.w, zIndex: it.z ?? 2, opacity: q, transform: `translateY(${interpolate(q, [0, 1], [80, 0]) + bob}px) rotate(${rot}deg) scale(${interpolate(q, [0, 1], [0.6, 1])})` }}>
            {it.card ? (
              <div style={{ padding: 6, background: colors.white, boxShadow: colors.shadow }}>
                <Img src={media(it.src)} style={{ width: "100%", display: "block" }} />
              </div>
            ) : (
              <Img src={media(it.src)} style={{ width: "100%", display: "block", filter: "drop-shadow(0 20px 26px rgba(0,0,0,0.75)) contrast(1.05)" }} />
            )}
          </div>
        );
      })}
    </>
  );
};

/** Numbers drifting up behind everything: accounting noise, the TikTok «data» texture. */
const Numbers: React.FC<{ items: string[] }> = ({ items }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}>
      {Array.from({ length: 14 }, (_, k) => {
        const y = 1900 - ((frame * (2 + (k % 3)) + k * 140) % 2000);
        const x = 30 + ((k * 211) % 980);
        return (
          <div key={k} style={{ position: "absolute", left: x, top: y, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 30 + (k % 3) * 10, color: k % 4 === 0 ? colors.bad : palette.primary, opacity: 0.22 }}>
            {items[k % items.length]}
          </div>
        );
      })}
    </div>
  );
};

/** A real warning sign blinking over the podcaster, TikTok-style: hard on/off with a punch. */
const BlinkSign: React.FC<{ src: string }> = ({ src }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = Math.round(1.2 * fps);
  if (frame < at || frame > at + 3 * fps) return null;
  const k = frame - at;
  const on = Math.floor(k / 4) % 2 === 0;
  const pop = interpolate(k % 8, [0, 3, 8], [1.25, 1, 1], clamp);
  return (
    <div style={{ position: "absolute", right: 60, top: 880, width: 280, zIndex: 12, opacity: on ? 1 : 0.15, transform: `rotate(6deg) scale(${pop})`, boxShadow: `0 0 40px ${colors.badGlow}` }}>
      <Img src={media(src)} style={{ width: "100%", display: "block" }} />
    </div>
  );
};

/* ---------------------------------------------------- extra evidence */

/** The worker, a real cut-out photo, rising bottom right and breathing. */
const Person: React.FC<{ p: { src: string; w: number; ratio: number }; at: number }> = ({ p, at }) => {
  const frame = useCurrentFrame();
  const q = useIn(at, "smooth");
  return (
    <div style={{ position: "absolute", right: -40, bottom: 230, width: p.w, opacity: q, transform: `translateY(${interpolate(q, [0, 1], [300, 0]) + Math.sin(frame / 28) * 4}px)`, maskImage: "linear-gradient(180deg, #000 70%, transparent 98%)", WebkitMaskImage: "linear-gradient(180deg, #000 70%, transparent 98%)", zIndex: 1 }}>
      <Img src={media(p.src)} style={{ width: p.w, height: p.w / p.ratio, display: "block", filter: "grayscale(0.4) contrast(1.08) drop-shadow(0 30px 40px rgba(0,0,0,0.8))" }} />
    </div>
  );
};

/** «Почему ИИ»: the reason on red-edged paper, with logos or a photo. */
const Why: React.FC<{ text: string; title?: string; logos?: string[]; photo?: string; at: number }> = ({ text, title, logos, photo, at }) => {
  const q = useIn(at, "snappy");
  const hit = usePunch(at, 12);
  return (
    <div style={{ position: "absolute", left: 64, top: 680, width: 560, display: "flex", flexDirection: "column", gap: 12, opacity: q, transform: `translateX(${interpolate(q, [0, 1], [-80, 0])}px) scale(${1 + hit.pop * 0.05})`, zIndex: 3 }}>
      <div style={{ padding: "14px 18px", background: colors.paper, borderLeft: `10px solid ${colors.bad}`, boxShadow: colors.paperShadow }}>
        <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 18, letterSpacing: "0.14em", color: colors.bad, marginBottom: 6 }}>{title ?? "ПОЧЕМУ ИИ"}</div>
        <div style={{ fontFamily: `${theme.fonts.wide}, ${theme.fonts.mono}`, fontWeight: 900, fontSize: 30, lineHeight: 1.12, color: colors.ink }}>{text}</div>
      </div>
      {(logos || photo) && (
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {photo && <Img src={media(photo)} style={{ width: 220, borderRadius: 12, boxShadow: colors.shadow }} />}
          {(logos ?? []).map((l) => (
            <div key={l} style={{ padding: "10px 14px", background: colors.white, borderRadius: 10 }}>
              <Img src={media(l)} style={{ height: 58, display: "block" }} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/** The death sign: a red skull slammed over the hook, pulsing. */
const Skull: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const q = useIn(at, "bouncy");
  if (frame < at) return null;
  const pulse = 1 + Math.sin((frame - at) / 4) * 0.04;
  return (
    <svg viewBox="0 0 100 110" width={230} height={253} style={{ position: "absolute", right: 70, top: 660, opacity: q, transform: `scale(${interpolate(q, [0, 1], [2.2, 1]) * pulse}) rotate(-8deg)`, filter: `drop-shadow(0 0 30px ${colors.badGlow})`, zIndex: 4 }}>
      <path d="M50 4 C 22 4, 6 24, 8 50 C 9 64, 16 72, 22 76 L22 92 C22 98, 28 102, 34 102 L66 102 C72 102, 78 98, 78 92 L78 76 C84 72, 91 64, 92 50 C 94 24, 78 4, 50 4 Z" fill={colors.bad} />
      <ellipse cx={33} cy={50} rx={12} ry={14} fill={colors.ink2} />
      <ellipse cx={67} cy={50} rx={12} ry={14} fill={colors.ink2} />
      <path d="M50 62 L43 76 L57 76 Z" fill={colors.ink2} />
      {[0, 1, 2, 3].map((i) => <rect key={i} x={33 + i * 10} y={84} width={5} height={16} fill={colors.ink2} />)}
    </svg>
  );
};

/** The killer: the mask the author picked, glitching in under the headline. */
const Killer: React.FC<{ src: string; at: number }> = ({ src, at }) => {
  const frame = useCurrentFrame();
  const q = useIn(at, "smooth");
  if (frame < at) return null;
  const tear = interpolate(frame - at, [0, 2, 10], [0, 0.9, 0], clamp);
  return (
    <div style={{ position: "absolute", left: 60, top: 790, width: 300, opacity: q * 0.95, transform: `scale(${interpolate(q, [0, 1], [1.2, 1])})`, zIndex: 2 }}>
      <Glitch amount={tear}>
        <Img src={media(src)} style={{ width: 300, display: "block", filter: "drop-shadow(0 0 30px rgba(255,59,59,0.45))" }} />
      </Glitch>
    </div>
  );
};

/** A meme pops in, rotated, like a sticker. */
const Meme: React.FC<{ src: string; at: number }> = ({ src, at }) => {
  const frame = useCurrentFrame();
  const q = useIn(at, "bouncy");
  if (frame < at) return null;
  return (
    <div style={{ position: "absolute", right: 40, top: 1510, width: 240, padding: 8, background: colors.white, boxShadow: colors.shadow, opacity: q, transform: `rotate(${6 + Math.sin(frame / 10) * 2}deg) scale(${interpolate(q, [0, 1], [0.4, 1])})`, zIndex: 5 }}>
      <Img src={media(src)} style={{ width: "100%", display: "block" }} />
    </div>
  );
};

/** Red crosses slashed over the five teaser screens, one by one. */
const KillMarks: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: 40, right: 40, top: 960, display: "flex", justifyContent: "center", gap: 14, zIndex: 3, pointerEvents: "none" }}>
      {[0, 1, 2, 3, 4].map((i) => {
        const p = interpolate(frame - at - i * 3, [0, 6], [0, 1], { easing: theme.ease.out, ...clamp });
        return (
          <svg key={i} width={186} height={330} style={{ transform: `rotate(${(i - 2) * 3}deg) translateY(${Math.abs(i - 2) * 18}px)` }}>
            <line x1={20} y1={40} x2={20 + 146 * p} y2={40 + 250 * p} stroke={colors.bad} strokeWidth={14} strokeLinecap="round" />
            <line x1={166} y1={40} x2={166 - 146 * p} y2={40 + 250 * p} stroke={colors.bad} strokeWidth={14} strokeLinecap="round" opacity={p > 0.5 ? 1 : 0} />
          </svg>
        );
      })}
    </div>
  );
};

/* ---------------------------------------------------------- scenes */

const Hook: React.FC<{ data: CountdownData }> = ({ data }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const n = data.hook.words.length;
  const every = Math.min(0.42, (durationInFrames / fps - 1.6) / n);
  const tiles = useIn(Math.round((n * every + 0.1) * fps), "smooth");
  const lastHit = usePunch(Math.round((n - 1) * every * fps), 16);
  const sub = Math.round((n * every) * fps);
  return (
    <SceneShell exit={false} shake={lastHit.shake * 0.6}>
      <BgClip src={data.hook.clip} dim={0.62} dark={data.dark} />
      <BrandBar series={data.series} episode={data.episode} delay={-30} />
      <div style={{ position: "absolute", left: 64, right: 64, top: 250 }}>
        {data.hook.kicker && (
          <div style={{ display: "inline-block", marginBottom: 14, padding: "8px 16px", background: colors.bad, color: colors.white, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 28, letterSpacing: "0.12em", transform: "rotate(-2deg)", boxShadow: `0 0 30px ${colors.badGlow}` }}>{data.hook.kicker}</div>
        )}
        <DropWords pre={!!data.hook.presenter || !!data.hook.kicker} words={data.hook.words} bad={data.hook.badWord} every={every} size={fit(data.hook.words.reduce((a, b) => (a.length > b.length ? a : b)), 112) > 100 ? 104 : 92} />
        <div style={{ marginTop: 26, display: "flex", flexDirection: "column", gap: 10 }}>
          <Paper delay={sub} size={30}>{data.hook.sub}</Paper>
        </div>
      </div>
      {/* the five, as teaser screens with «?», fanned under the title */}
      <div style={{ position: "absolute", left: 40, right: 40, top: 960, display: "flex", justifyContent: "center", gap: 14, opacity: tiles, transform: `translateY(${interpolate(tiles, [0, 1], [120, 0])}px)` }}>
        {data.places.map((p, i) => {
          const q = interpolate(frame - (Math.round((n * every + 0.1) * fps) + i * 3), [0, 10], [0, 1], { easing: theme.ease.out, ...clamp });
          return (
            <div key={i} style={{ position: "relative", width: 186, height: 330, borderRadius: 16, overflow: "hidden", border: `3px solid ${colors.lineStrong}`, boxShadow: colors.shadow, transform: `rotate(${(i - 2) * 3}deg) translateY(${Math.abs(i - 2) * 18 + (1 - q) * 80}px)`, opacity: q }}>
              <OffthreadVideo src={media(p.clip)} muted style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(0.8) brightness(0.45) blur(2px)" }} />
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.wide, fontWeight: 900, fontSize: 120, color: palette.primary, textShadow: `0 0 30px ${palette.glow}`, opacity: 0.6 + Math.sin(frame / 5 + i) * 0.35 }}>?</div>
              <div style={{ position: "absolute", left: 10, top: 8, fontFamily: theme.fonts.wide, fontWeight: 900, fontSize: 44, color: palette.text }}>{5 - i}</div>
            </div>
          );
        })}
      </div>
      {data.hook.numbers && <Numbers items={data.hook.numbers} />}
      {data.hook.props && <Props items={data.hook.props} />}
      {data.hook.kill && <KillMarks at={Math.round((n * every + 0.5) * fps)} />}
      {data.hook.skull && <Skull at={Math.round((n - 1) * every * fps)} />}
      {data.hook.killer && <Killer src={data.hook.killer} at={Math.round((n - 1) * every * fps) + 2} />}
      {data.hook.meme && <Meme src={data.hook.meme} at={sub + 8} />}
      <div style={{ position: "absolute", left: 64, right: 64, top: 1360, display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
        {data.hook.chips.map((c, i) => (
          <Chip key={c} delay={sub + 6 + i * 5} tone={i === 0 ? "hero" : "neutral"} filled={i === 0} size={24}>{c}</Chip>
        ))}
      </div>
      {data.hook.presenter && <Presenter p={data.hook.presenter} rate={data.rate} />}
      {data.hook.sign && <BlinkSign src={data.hook.sign} />}
      <Flash amount={lastHit.energy * 0.6} />
    </SceneShell>
  );
};

const Place: React.FC<{ data: CountdownData; index: number }> = ({ data, index }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const p = data.places[index];
  const rank = 5 - index;
  const slam = usePunch(0, 18);
  const dock = useRamp(8, 18, theme.ease.inOut);
  const titleAt = 19; // after the rank has docked
  const numAt = Math.round(Math.min(durationInFrames * 0.42, 1.5 * fps));
  const stampAt = Math.round(durationInFrames * 0.68);
  const num = usePunch(numAt, 14);
  const stamp = usePunch(stampAt, 16);
  const logoIn = useIn(titleAt + 8, "snappy");
  const tear = interpolate(frame, [0, 1, 8], [0, 0.9, 0], clamp);
  return (
    <SceneShell shake={slam.shake + num.shake * 0.5 + stamp.shake * 0.7}>
      <Glitch amount={tear} style={{ position: "absolute", inset: 0 }}>
        <BgClip src={p.clip} dim={data.dark ? 0.55 : 0.45} dark={data.dark} />
      </Glitch>
      {/* rank: slams full frame, docks top-left */}
      <div style={{ position: "absolute", left: interpolate(dock, [0, 1], [0, 64]), top: interpolate(dock, [0, 1], [520, 210]), width: interpolate(dock, [0, 1], [1080, 520]), display: "flex", justifyContent: dock > 0.5 ? "flex-start" : "center", alignItems: "baseline", gap: 14 }}>
        <span style={{ fontFamily: theme.fonts.wide, fontWeight: 900, fontSize: interpolate(dock, [0, 1], [460, 110]), lineHeight: 0.9, color: palette.primary, textShadow: `0 0 ${interpolate(dock, [0, 1], [120, 30])}px ${palette.glow}`, transform: `scale(${1 + slam.pop * 0.12})` }}>{rank}</span>
        <span style={{ fontFamily: theme.fonts.wide, fontWeight: 900, fontSize: interpolate(dock, [0, 1], [120, 52]), color: palette.text }}>{data.rankWord}</span>
      </div>
      {/* the title */}
      {frame >= titleAt && (
        <div style={{ position: "absolute", left: 64, right: 64, top: 400 }}>
          <Kinetic text={p.title} size={fit(p.title, 96) > 88 ? 92 : 78} delay={titleAt} per={3} mode="snap" lineHeight={1.02} />
          {p.logo && (
            <div style={{ marginTop: 16, display: "inline-block", padding: "12px 18px", background: colors.white, borderRadius: 10, boxShadow: colors.paperShadow, opacity: logoIn, transform: `translateY(${interpolate(logoIn, [0, 1], [20, 0])}px)` }}>
              <Img src={media(p.logo)} style={{ height: 76, display: "block" }} />
            </div>
          )}
        </div>
      )}
      {p.numbers && <Numbers items={p.numbers} />}
      {p.props && <Props items={p.props} base={titleAt} />}
      {p.person && <Person p={p.person} at={titleAt + 4} />}
      {p.why && <Why text={p.why} title={p.whyTitle} logos={p.logos} photo={p.photo} at={titleAt + 14} />}
      {/* chips, top right */}
      <div style={{ position: "absolute", right: 60, top: 214, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10 }}>
        {p.chips.map((c, i) => (
          <Chip key={c} delay={titleAt + 6 + i * 6} tone={i === 0 ? "hero" : i === 1 ? "bad" : "neutral"} filled={i < 2} size={21}>{c}</Chip>
        ))}
      </div>
      {/* the number with what it is */}
      {frame >= numAt && (
        <div style={{ position: "absolute", left: 64, right: 64, top: 1060, zIndex: 4, display: "flex", flexDirection: "column", gap: 14, transform: `scale(${1 + num.pop * 0.06})`, transformOrigin: "left center" }}>
          <Kinetic text={p.num.value} size={fit(p.num.value, 150)} delay={numAt} per={2} mode="snap" hero={p.num.value.split(" ").map((_, i) => i)} glow lineHeight={1} />
          <Paper delay={numAt + 6} size={26}>{p.num.label}</Paper>
        </div>
      )}
      {/* the stamp */}
      {frame >= stampAt && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1400, zIndex: 5, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <Stamp tone={p.stamp.tone} size={fit(p.stamp.text, 92)} rotate={-6} delay={stampAt}>{p.stamp.text}</Stamp>
          {p.stamp.label && <Paper delay={stampAt + 8} size={22}>{p.stamp.label}</Paper>}
        </div>
      )}
      {p.credit && <div style={{ position: "absolute", left: 0, right: 0, top: 1660, textAlign: "center", fontFamily: theme.fonts.mono, fontSize: 16, color: palette.textDim, letterSpacing: "0.06em" }}>{p.credit}</div>}
      <Pips active={index} />
      <Flash amount={num.energy * 0.7} />
      <Flash amount={stamp.energy} color={p.stamp.tone === "bad" ? colors.bad : palette.primary} />
    </SceneShell>
  );
};

const Final: React.FC<{ data: CountdownData }> = ({ data }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const stampAt = Math.round(durationInFrames * 0.42);
  const hit = usePunch(stampAt, 20);
  const row = useIn(0, "smooth");
  return (
    <SceneShell exit={false} shake={hit.shake}>
      <div style={{ position: "absolute", left: 64, right: 64, top: 230 }}>
        <Kinetic text={data.final.line} size={86} delay={2} per={3} mode="snap" bad={data.final.badWords} lineHeight={1.04} />
      </div>
      <div style={{ position: "absolute", left: 30, right: 30, top: 700, display: "flex", justifyContent: "center", gap: 12, opacity: row, transform: `translateY(${interpolate(row, [0, 1], [100, 0])}px)` }}>
        {data.places.map((p, i) => {
          const q = interpolate(frame - i * 3, [0, 10], [0, 1], { easing: theme.ease.out, ...clamp });
          return (
            <div key={i} style={{ width: 190, display: "flex", flexDirection: "column", gap: 10, alignItems: "center", opacity: q, transform: `translateY(${(1 - q) * 60 + Math.sin(frame / 20 + i) * 5}px)` }}>
              <div style={{ position: "relative", width: 190, height: 340, borderRadius: 16, overflow: "hidden", border: `3px solid ${i === 4 ? palette.primary : colors.lineStrong}`, boxShadow: i === 4 ? `0 0 30px ${palette.glow}` : colors.shadow }}>
                <OffthreadVideo src={media(p.clip)} muted style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(0.4) brightness(0.7)" }} />
                <div style={{ position: "absolute", left: 10, top: 6, fontFamily: theme.fonts.wide, fontWeight: 900, fontSize: 52, color: palette.primary, textShadow: `0 0 20px ${palette.glow}` }}>{5 - i}</div>
              </div>
              <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 18, letterSpacing: "0.04em", color: palette.text, textAlign: "center", lineHeight: 1.2 }}>{p.title}</div>
              <div style={{ padding: "4px 8px", background: colors.paper, color: colors.ink, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 15, whiteSpace: "nowrap" }}>{p.num.value}</div>
            </div>
          );
        })}
      </div>
      {frame >= stampAt && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1300, display: "flex", justifyContent: "center" }}>
          <Stamp tone="bad" size={fit(data.final.stamp, 88)} rotate={-5} delay={stampAt}>{data.final.stamp}</Stamp>
        </div>
      )}
      <div style={{ position: "absolute", left: 64, right: 64, top: 1560, textAlign: "center", fontFamily: theme.fonts.mono, fontSize: 17, lineHeight: 1.4, color: palette.textDim }}>{data.sources}</div>
      <Flash amount={hit.energy} color={colors.bad} />
    </SceneShell>
  );
};

export const Countdown: React.FC<{ data: CountdownData; D: Record<string, number> }> = ({ data, D }) => {
  const { SCENES, VOICEOVER } = makeCountdown(data, D);
  const order = ["p5", "p4", "p3", "p2", "p1"] as const;
  return (
    <Reel palette={palette} voiceoverDir={data.voiceoverDir} voiceover={VOICEOVER} voRate={1} captions={false} gradeOpacity={0.08}>
      <Scene spec={SCENES.hook} name="01 hook">
        <Hook data={data} />
      </Scene>
      {order.map((k, i) => (
        <Scene key={k} spec={SCENES[k]} name={`0${i + 2} place ${5 - i}`}>
          <Place data={data} index={i} />
        </Scene>
      ))}
      <Scene spec={SCENES.final} name="07 final">
        <Final data={data} />
      </Scene>
    </Reel>
  );
};
