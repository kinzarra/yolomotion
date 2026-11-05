// ВЫПУСК 09 kit: the long-format chain re-exported (dev-myth → serbia-economy
// → digital-ruble), plus what this episode adds: the face (a placeholder until
// the HeyGen shots are approved), a short part card, growth bars, a token
// stream, a chat with a limit, a quote card and the conveyor for the recap.
import React from "react";
import { Img, Loop, OffthreadVideo, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FOOTAGE } from "./footage";
import { theme } from "../../theme";
import { usePunch } from "../../reel";
import { rnd } from "../digital-ruble/ui";
import { imColors as colors, imPalette as palette } from "./palette";
import { Burst, Drift, Flash, SceneShell, Slam, TopBar, WIDE, cl, media } from "../dev-myth/ui";
import { BgVideo } from "../dev-myth/fx2";
import { Still } from "../dev-myth/fx";
import { richText } from "../dev-myth/sym";
import { CARD, VO_RATE } from "./timeline";
import { FACE, FACE_DIR, FACE_PREVIEW } from "./face";

export * from "../dev-myth/ui";
export { Still, CodeBlock, LogoCard, Outlined, DropChart, BinaryGrid } from "../dev-myth/fx";
export { BgVideo, Hud, MediaCard, GlassChip, StatPlate, NodeNet, LogoPlate } from "../dev-myth/fx2";
export { Sym, richText } from "../dev-myth/sym";

export const I = "images/intellect-mine/";
export const L = "images/intellect-mine/";
export const V = "media/intellect-mine/";
export const mono = theme.fonts.mono;

/** Seconds → frames, rounded (all timing derives from fps). */
export const useSec = () => {
  const { fps } = useVideoConfig();
  return (s: number) => Math.round(s * fps);
};

/* ------------------------------------------------------------------ shell */

/** A background clip that loops at its measured length instead of freezing on its last frame. */
export const LoopBg: React.FC<{ src: string; dim?: number; tint?: number; startFrom?: number; blur?: number }> = ({ src, startFrom = 0, ...rest }) => {
  const { fps } = useVideoConfig();
  const len = (FOOTAGE[src.split("/").pop() ?? ""] ?? 7) - startFrom;
  return (
    <Loop durationInFrames={Math.max(30, Math.floor(len * fps) - 1)} layout="none">
      <BgVideo src={src} startFrom={startFrom} {...rest} />
    </Loop>
  );
};

/**
 * Every beat: a graded background (clip or still), the data weather, the top
 * bar, and the cut itself: a white flash, a 6% punch-in and a tear on the
 * first frames, so no cut is ever a plain one.
 */
export const BeatShell: React.FC<{
  bar: string;
  series: string;
  bg?: string;
  still?: boolean;
  dim?: number;
  tint?: number;
  startFrom?: number;
  drift?: string[];
  shake?: number;
  exit?: boolean;
  children: React.ReactNode;
}> = ({ bar, series, bg, still, dim = 0.7, tint = 0.3, startFrom = 0, drift, shake = 0, exit = true, children }) => {
  const frame = useCurrentFrame();
  const punch = interpolate(frame, [0, 9], [1.06, 1], { easing: theme.ease.out, ...cl });
  const flash = interpolate(frame, [0, 1, 6], [0.55, 0.55, 0], cl);
  return (
    <SceneShell shake={shake} exit={exit}>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${punch})` }}>
        {bg && (still ? <Still src={bg} dim={dim} tint={tint} /> : <LoopBg src={bg} dim={dim} tint={tint} startFrom={startFrom} />)}
        {drift && <Drift items={drift} opacity={0.12} />}
        {children}
      </div>
      <TopBar left={series} right={bar} />
      <Flash amount={flash} />
    </SceneShell>
  );
};

/* ------------------------------------------------------------------- face */

/**
 * The presenter, full frame, pushed right so the left third carries type.
 * Until the HeyGen shots are bought (FACE.ready) it is the avatar's own
 * preview still, breathing, marked as a placeholder.
 */
export const Face: React.FC<{ shot: keyof typeof FACE.shots; from: number; push?: number; until?: number }> = ({ shot, from, push = 230, until }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const s = FACE.shots[shot];
  const len = Math.round((s.duration / VO_RATE) * fps);
  const end = until ?? durationInFrames;
  void len;
  const k = frame - from;
  if (k < 0 || frame >= end) return null;
  const tear = interpolate(k, [0, 1, 6], [1, 1, 0], cl) + interpolate(frame, [end - 5, end - 1], [0, 1], cl);
  const breathe = 1 + Math.sin(frame / 22) * 0.004;
  const look: React.CSSProperties = { width: "100%", height: "100%", objectFit: "cover", transform: `translateX(${push}px) scale(${(1.12 + k * 0.0006) * breathe})`, transformOrigin: "50% 42%", filter: `blur(${tear * 6}px)` };
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 2, overflow: "hidden", background: palette.bg }}>
      {FACE.ready ? (
        <Sequence from={from} layout="none">
          <OffthreadVideo src={media(FACE_DIR + s.file)} muted playbackRate={VO_RATE} style={look} />
        </Sequence>
      ) : (
        <Img src={media(FACE_PREVIEW)} style={look} />
      )}
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(90deg, ${palette.bg}F5 0%, ${palette.bg}D0 30%, ${palette.bg}40 54%, transparent 72%)` }} />
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${palette.bg}80 0%, transparent 22%, transparent 70%, ${palette.bg}E0 100%)` }} />
      <div style={{ position: "absolute", inset: 0, background: palette.primary, mixBlendMode: "screen", opacity: tear * 0.25 }} />
      {!FACE.ready && (
        <div style={{ position: "absolute", right: 96, top: 130, padding: "10px 18px", border: `3px dashed ${colors.bad}`, color: colors.bad, fontFamily: mono, fontWeight: 800, fontSize: 22, letterSpacing: "0.12em", background: `${palette.bg}CC` }}>
          ЗАГЛУШКА · ЛИЦО HEYGEN ПОСЛЕ СОГЛАСОВАНИЯ
        </div>
      )}
    </div>
  );
};

/* -------------------------------------------------------------- part card */

/** «01 · ПЕСОК И ЧИП»: lime band sweeps, the number slams, the card breaks into shards. */
export const PartCard: React.FC<{ n: string; title: string; kicker: string; bg?: string }> = ({ n, title, kicker, bg }) => {
  const frame = useCurrentFrame();
  const sec = useSec();
  const hitAt = sec(CARD.hit);
  const breakAt = sec(CARD.shatter);
  const hit = usePunch(hitAt, 16);
  const brk = usePunch(breakAt, 10);
  const band = interpolate(frame, [0, hitAt], [-1920, 0], { easing: theme.ease.inOut, ...cl });
  const k = Math.max(0, frame - breakAt);
  const card = (
    <div style={{ position: "absolute", inset: 0 }}>
      {bg && <LoopBg src={bg} dim={0.82} tint={0.25} />}
      <div style={{ position: "absolute", left: band, top: 520, width: 1920, height: 12, background: palette.primary, boxShadow: `0 0 40px ${palette.glow}` }} />
      {frame >= hitAt && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 250, display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
          <div style={{ fontFamily: mono, fontWeight: 800, fontSize: 26, letterSpacing: "0.3em", color: palette.textDim }}>ЧАСТЬ</div>
          <Slam text={n} at={hitAt} size={230} />
          <div style={{ padding: "16px 34px", background: colors.paper, color: colors.ink, fontFamily: WIDE, fontWeight: 900, fontSize: 60, transform: "rotate(-1.5deg)", boxShadow: colors.paperShadow }}>{title}</div>
          <div style={{ fontFamily: mono, fontWeight: 700, fontSize: 24, letterSpacing: "0.14em", color: palette.text, opacity: interpolate(frame - hitAt, [4, 12], [0, 1], cl) }}>{kicker}</div>
        </div>
      )}
    </div>
  );
  if (frame < breakAt) {
    return (
      <SceneShell exit={false} shake={hit.shake}>
        {card}
        <Burst at={hitAt} x={960} y={420} />
        <Flash amount={hit.energy} />
      </SceneShell>
    );
  }
  const shards = Array.from({ length: 24 }, (_, i) => {
    const c = i % 6, r = Math.floor(i / 6);
    const x0 = (c / 6) * 100, x1 = ((c + 1) / 6) * 100, y0 = (r / 4) * 100, y1 = ((r + 1) / 4) * 100;
    return { poly: `polygon(${x0}% ${y0}%, ${x1}% ${y0}%, ${x1}% ${y1}%, ${x0}% ${y1}%)`, cx: (x0 + x1) / 2, cy: (y0 + y1) / 2, i };
  });
  const t = interpolate(k, [0, 12], [0, 1], { easing: theme.ease.in, ...cl });
  return (
    <SceneShell exit={false} shake={brk.shake}>
      {shards.map((sh) => {
        const dx = (sh.cx - 50) / 50, dy = (sh.cy - 50) / 50, spd = 1 + rnd(sh.i * 13);
        return (
          <div key={sh.i} style={{ position: "absolute", inset: 0, clipPath: sh.poly, transform: `translate(${dx * 900 * t * spd}px, ${dy * 600 * t * spd + 300 * t * t}px) rotate(${(dx + dy) * 50 * t}deg)`, transformOrigin: `${sh.cx}% ${sh.cy}%`, opacity: 1 - t }}>
            {card}
          </div>
        );
      })}
      <Flash amount={brk.energy * 0.8} />
    </SceneShell>
  );
};

/* ------------------------------------------------------------------- bars */

export type Bar = { label: string; value: number; text: string; tone?: "lime" | "bad" | "dim" };

/** Columns growing from a baseline, staggered, each with its figure and its year/label under it. */
export const Bars: React.FC<{ at: number; x: number; y: number; w: number; h: number; items: Bar[]; every?: number; title?: string; source?: string; log?: boolean }> = ({ at, x, y, w, h, items, every = 6, title, source, log = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < at) return null;
  const f = (v: number) => (log ? Math.log10(v + 1) : v);
  const max = Math.max(...items.map((b) => f(b.value)));
  const gap = 26;
  const bw = (w - gap * (items.length - 1)) / items.length;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h + 110, zIndex: 8 }}>
      {title && <div style={{ fontFamily: mono, fontWeight: 800, fontSize: 22, letterSpacing: "0.12em", color: palette.textDim, marginBottom: 12 }}>{title}</div>}
      <div style={{ position: "relative", height: h, borderBottom: `3px solid ${colors.lineStrong}` }}>
        {items.map((b, i) => {
          const p = spring({ frame: frame - at - i * every, fps, config: theme.spring.smooth });
          const c = b.tone === "bad" ? colors.bad : b.tone === "dim" ? colors.lineStrong : palette.primary;
          const bh = Math.max(6, (f(b.value) / max) * (h - 70)) * p;
          return (
            <div key={i} style={{ position: "absolute", left: i * (bw + gap), bottom: 0, width: bw }}>
              <div style={{ position: "absolute", bottom: bh + 10, left: 0, right: 0, textAlign: "center", fontFamily: WIDE, fontWeight: 900, fontSize: Math.min(44, bw / Math.max(3, b.text.length * 0.62)), color: b.tone === "dim" ? palette.text : c, opacity: Math.min(1, p * 2), whiteSpace: "nowrap" }}>{richText(b.text)}</div>
              <div style={{ height: bh, background: b.tone === "dim" ? colors.surfaceLift : c, border: `2px solid ${c}`, boxShadow: b.tone === "dim" ? undefined : `0 0 30px ${b.tone === "bad" ? colors.badGlow : palette.glow}` }} />
            </div>
          );
        })}
      </div>
      <div style={{ position: "relative", height: 40 }}>
        {items.map((b, i) => (
          <div key={i} style={{ position: "absolute", left: i * (bw + gap), width: bw, top: 10, textAlign: "center", fontFamily: mono, fontWeight: 800, fontSize: 22, letterSpacing: "0.06em", color: palette.textDim }}>{b.label}</div>
        ))}
      </div>
      {source && <div style={{ marginTop: 14, fontFamily: mono, fontWeight: 700, fontSize: 17, letterSpacing: "0.1em", color: palette.textDim }}>{source}</div>}
    </div>
  );
};

/* ----------------------------------------------------------------- tokens */

/** A sentence arriving token by token: paper and lime chips alternate so the cuts are visible. */
export const TokenStream: React.FC<{ at: number; x: number; y: number; w: number; tokens: string[]; every?: number; size?: number }> = ({ at, x, y, w, tokens, every = 5, size = 54 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < at) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, zIndex: 9, display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
      {tokens.map((t, i) => {
        const p = spring({ frame: frame - at - i * every, fps, config: theme.spring.bouncy });
        if (p <= 0.01) return null;
        const lime = i % 2 === 0;
        return (
          <div key={i} style={{ padding: `${size * 0.16}px ${size * 0.28}px`, background: lime ? palette.primary : colors.paper, color: colors.ink, fontFamily: WIDE, fontWeight: 900, fontSize: size, lineHeight: 1, transform: `translateY(${interpolate(p, [0, 1], [40, 0])}px) scale(${interpolate(p, [0, 1], [0.6, 1])})`, opacity: Math.min(1, p * 1.5), boxShadow: lime ? `0 0 24px ${palette.glow}` : colors.paperShadow, borderRadius: 6 }}>
            {t}
          </div>
        );
      })}
    </div>
  );
};

/* ------------------------------------------------------------------- chat */

/** A generic chat window (no brand): the question types, the answer streams, or the limit lands red. */
export const ChatMock: React.FC<{ at: number; x: number; y: number; w: number; question: string; answer?: string; limitAt?: number; limitText?: string }> = ({ at, x, y, w, question, answer, limitAt, limitText = "ВЫ ДОСТИГЛИ ЛИМИТА. ПОПРОБУЙТЕ ЧЕРЕЗ 5 ЧАСОВ" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - at, fps, config: theme.spring.smooth });
  if (frame < at) return null;
  const k = frame - at;
  const q = question.slice(0, Math.floor(k * 1.6));
  const aStart = question.length / 1.6 + 8;
  const a = answer ? answer.slice(0, Math.max(0, Math.floor((k - aStart) * 2.2))) : "";
  const lim = limitAt !== undefined && frame >= limitAt;
  const lp = limitAt !== undefined ? spring({ frame: frame - limitAt, fps, config: theme.spring.snappy }) : 0;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, zIndex: 8, transform: `translateY(${interpolate(p, [0, 1], [50, 0])}px)`, opacity: Math.min(1, p * 1.4), borderRadius: 22, overflow: "hidden", background: colors.surfaceStrong, border: `2px solid ${colors.lineStrong}`, boxShadow: colors.shadow, fontFamily: mono }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 20px", background: colors.surfaceLift, borderBottom: `1px solid ${colors.line}` }}>
        {[0, 1, 2].map((i) => <span key={i} style={{ width: 13, height: 13, borderRadius: 7, background: colors.lineStrong }} />)}
        <span style={{ marginLeft: 12, fontSize: 20, fontWeight: 700, letterSpacing: "0.12em", color: palette.textDim }}>ЧАТ С НЕЙРОСЕТЬЮ</span>
      </div>
      <div style={{ padding: 26, display: "flex", flexDirection: "column", gap: 18, minHeight: 200 }}>
        <div style={{ alignSelf: "flex-end", maxWidth: "80%", padding: "14px 20px", borderRadius: 18, background: colors.paper, color: colors.ink, fontSize: 28, fontWeight: 700 }}>{q}{q.length < question.length && <span style={{ opacity: Math.floor(frame / 6) % 2 }}>▍</span>}</div>
        {a && !lim && <div style={{ maxWidth: "88%", padding: "14px 20px", borderRadius: 18, background: colors.surfaceLift, color: palette.text, fontSize: 26, fontWeight: 600, lineHeight: 1.4 }}>{a}</div>}
        {lim && (
          <div style={{ alignSelf: "stretch", padding: "18px 22px", borderRadius: 16, border: `3px solid ${colors.bad}`, background: `${colors.bad}22`, color: colors.white, fontSize: 26, fontWeight: 800, letterSpacing: "0.04em", transform: `scale(${interpolate(lp, [0, 1], [1.2, 1])})`, boxShadow: `0 0 40px ${colors.badGlow}` }}>
            <span style={{ color: colors.bad }}>■ </span>{limitText}
          </div>
        )}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ quote */

/** A quote attributed on paper: who, where, when; never a fake screenshot. */
export const QuoteCard: React.FC<{ at: number; x: number; y: number; w: number; quote: string; ru?: string; who: string; meta: string; photo?: string; tilt?: number }> = ({ at, x, y, w, quote, ru, who, meta, photo, tilt = -2 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - at, fps, config: theme.spring.bouncy });
  if (frame < at) return null;
  const float = Math.sin(frame / 30) * 4;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, zIndex: 9, padding: "28px 34px", background: colors.paper, color: colors.ink, boxShadow: colors.paperShadow, transform: `translateY(${interpolate(p, [0, 1], [70, 0]) + float}px) rotate(${tilt}deg) scale(${interpolate(p, [0, 1], [0.8, 1])})`, opacity: Math.min(1, p * 1.5) }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 16 }}>
        {photo && <Img src={media(photo)} style={{ width: 84, height: 84, borderRadius: 42, objectFit: "cover", filter: "grayscale(1) contrast(1.1)" }} />}
        <div>
          <div style={{ fontFamily: WIDE, fontWeight: 900, fontSize: 30 }}>{who}</div>
          <div style={{ fontFamily: mono, fontWeight: 700, fontSize: 18, letterSpacing: "0.1em", color: colors.inkFaded }}>{meta}</div>
        </div>
      </div>
      <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 44, lineHeight: 1.15 }}>«{quote}»</div>
      {ru && <div style={{ marginTop: 12, fontFamily: mono, fontWeight: 700, fontSize: 22, color: colors.inkFaded }}>{ru}</div>}
    </div>
  );
};

/* --------------------------------------------------------------- conveyor */

export type Station = { name: string; sub: string; img?: string; flag?: string };

/**
 * The whole chain as one conveyor: a lime line runs left to right and lights
 * each station on its word; packets travel the lit part. Two rows of four.
 */
export const Conveyor: React.FC<{ stations: Station[]; lit: number[]; y?: number }> = ({ stations, lit, y = 150 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const per = 4;
  const cw = 380, ch = 300, gx = 52, gy = 70;
  const x0 = (1920 - (per * cw + (per - 1) * gx)) / 2;
  const pos = (i: number) => {
    const r = Math.floor(i / per), c = i % per;
    return { x: x0 + (r % 2 === 0 ? c : per - 1 - c) * (cw + gx), y: y + r * (ch + gy) };
  };
  const on = (i: number) => frame >= lit[i];
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 7 }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {stations.slice(0, -1).map((_, i) => {
          const a = pos(i), b = pos(i + 1);
          const p = interpolate(frame, [lit[i + 1] - 8, lit[i + 1]], [0, 1], { easing: theme.ease.out, ...cl });
          const ax = a.x + cw / 2, ay = a.y + ch / 2, bx = b.x + cw / 2, by = b.y + ch / 2;
          return (
            <g key={i}>
              <line x1={ax} y1={ay} x2={bx} y2={by} stroke={colors.line} strokeWidth={6} />
              <line x1={ax} y1={ay} x2={ax + (bx - ax) * p} y2={ay + (by - ay) * p} stroke={palette.primary} strokeWidth={6} style={{ filter: `drop-shadow(0 0 8px ${palette.glow})` }} />
              {p >= 1 && <circle cx={ax + (bx - ax) * ((frame / 20 + i * 0.3) % 1)} cy={ay + (by - ay) * ((frame / 20 + i * 0.3) % 1)} r={8} fill={palette.primary} />}
            </g>
          );
        })}
      </svg>
      {stations.map((s, i) => {
        const { x, y: yy } = pos(i);
        const p = spring({ frame: frame - lit[i], fps, config: theme.spring.bouncy });
        const live = on(i);
        return (
          <div key={i} style={{ position: "absolute", left: x, top: yy, width: cw, height: ch, borderRadius: 18, overflow: "hidden", background: colors.surfaceStrong, border: `3px solid ${live ? palette.primary : colors.line}`, boxShadow: live ? `0 0 40px ${palette.glow}` : colors.shadow, transform: `scale(${live ? interpolate(p, [0, 1], [1.15, 1]) : 0.94})`, opacity: live ? 1 : 0.35 }}>
            {s.img && <Img src={media(s.img)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: `grayscale(${live ? 0.5 : 1}) contrast(1.1) brightness(0.6)`, transform: `scale(${1.08 + Math.sin((frame + i * 20) / 40) * 0.02})` }} />}
            <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, transparent 30%, ${palette.bg}F0 100%)` }} />
            <div style={{ position: "absolute", left: 18, top: 14, fontFamily: WIDE, fontWeight: 900, fontSize: 40, color: live ? palette.primary : palette.textDim }}>{String(i + 1).padStart(2, "0")}</div>
            {s.flag && <Img src={media(s.flag)} style={{ position: "absolute", right: 16, top: 18, width: 70, borderRadius: 4, boxShadow: "0 6px 16px rgba(0,0,0,0.6)" }} />}
            <div style={{ position: "absolute", left: 18, right: 18, bottom: 16 }}>
              <div style={{ fontFamily: WIDE, fontWeight: 900, fontSize: 34, color: palette.text, lineHeight: 1.05 }}>{s.name}</div>
              <div style={{ fontFamily: mono, fontWeight: 700, fontSize: 18, letterSpacing: "0.08em", color: live ? palette.primary : palette.textDim, marginTop: 6 }}>{s.sub}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

/** A lime ring drawn around a detail, on a beat. */
export const Ring: React.FC<{ at: number; x: number; y: number; w: number; h: number; bad?: boolean }> = ({ at, x, y, w, h, bad = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - at, fps, config: theme.spring.snappy });
  if (frame < at) return null;
  const c = bad ? colors.bad : palette.primary;
  return <div style={{ position: "absolute", left: x, top: y, width: w, height: h, zIndex: 10, border: `6px solid ${c}`, borderRadius: 999, boxShadow: `0 0 26px ${bad ? colors.badGlow : palette.glow}`, transform: `scale(${interpolate(p, [0, 1], [1.4, 1])}) rotate(-3deg)`, opacity: Math.min(1, p * 1.5) }} />;
};
