// Primitives of this episode: the tombstone, the face full-screen, the ladder of
// layers, the era header, the punch-card bits, the code panel, the bricks, the chat.
// Kit pieces (SceneShell, Kinetic, Chip, Stamp, Receipt, Glitch…) come from digital-ruble/ui;
// ClipTile / Cutout / Paper / CtaRow follow zhkh-receipt (ВЫПУСК 19).
import React from "react";
import { Img, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../theme";
import { useIn } from "../../reel";
import { Chip, Glitch } from "../digital-ruble/ui";
import { vibecodingLayersColors as colors, vibecodingLayersPalette as palette } from "./palette";
import { GRAVE, LAYERS } from "./data";
import { LEAD, VO_RATE } from "./timeline";

export * from "../digital-ruble/ui";

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
/** Unbounded lacks ₽ and arrows: the mono face supplies them. */
export const WIDE = `${theme.fonts.wide}, ${theme.fonts.mono}`;
export const media = (f: string) => staticFile(f);

/** Frame (inside a scene) of a word that starts `s` seconds into the scene's clip. */
export const useCue = () => {
  const { fps } = useVideoConfig();
  return (s: number, lead = LEAD) => Math.round((lead + s / VO_RATE) * fps);
};

/** Mono text on a tilted paper slip. */
export const Paper: React.FC<{ children: React.ReactNode; delay?: number; size?: number; rotate?: number; tone?: "ink" | "bad" }> = ({
  children,
  delay = 0,
  size = 24,
  rotate = -1,
  tone = "ink",
}) => {
  const p = useIn(delay, "snappy");
  return (
    <div
      style={{
        alignSelf: "flex-start",
        padding: `${size * 0.35}px ${size * 0.7}px`,
        background: colors.paper,
        color: tone === "bad" ? colors.bad : colors.ink,
        fontFamily: theme.fonts.mono,
        fontWeight: 800,
        fontSize: size,
        letterSpacing: "0.08em",
        lineHeight: 1.25,
        boxShadow: colors.paperShadow,
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [16, 0])}px) rotate(${rotate}deg)`,
      }}
    >
      {children}
    </div>
  );
};

/** A licensed clip in a tilted screen tile: cover-cropped, graded, scrimmed, breathing. */
export const ClipTile: React.FC<{ src: string; x: number; y: number; w: number; h: number; rot?: number; at?: number; z?: number; tag?: string; focus?: string }> = ({
  src,
  x,
  y,
  w,
  h,
  rot = 2,
  at = 0,
  z = 1,
  tag,
  focus = "50% 50%",
}) => {
  const frame = useCurrentFrame();
  const q = useIn(at, "smooth");
  const k = frame - at;
  const breathe = 1 + Math.sin(k / 23) * 0.01;
  const push = interpolate(k, [0, 150], [1.04, 1.14], { easing: theme.ease.inOut, ...clamp });
  const r = rot + Math.sin(k / 31) * 0.8;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        zIndex: z,
        borderRadius: 18,
        overflow: "hidden",
        border: `3px solid ${colors.lineStrong}`,
        boxShadow: colors.shadow,
        background: colors.surfaceStrong,
        opacity: q,
        transform: `translateY(${interpolate(q, [0, 1], [90, 0])}px) rotate(${r}deg) scale(${interpolate(q, [0, 1], [0.85, 1]) * breathe})`,
      }}
    >
      <Sequence from={at} layout="none">
        <OffthreadVideo src={media(src)} muted style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: focus, transform: `scale(${push})`, filter: "grayscale(0.3) contrast(1.1) brightness(0.9)" }} />
      </Sequence>
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${palette.bg}00 55%, ${palette.bg}B0 100%)` }} />
      {tag && (
        <div style={{ position: "absolute", left: 14, bottom: 14, padding: "4px 10px", background: colors.paper, color: colors.ink, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 18, letterSpacing: "0.12em" }}>{tag}</div>
      )}
    </div>
  );
};

/** A real photo on a white card, sliding in, drifting towards its subject, breathing. */
export const PhotoCard: React.FC<{ src: string; x: number; y: number; w: number; ratio: number; at?: number; rot?: number; z?: number; caption?: string; focus?: string; gray?: boolean }> = ({
  src,
  x,
  y,
  w,
  ratio,
  at = 0,
  rot = -3,
  z = 2,
  caption,
  focus = "50% 40%",
  gray = true,
}) => {
  const frame = useCurrentFrame();
  const q = useIn(at, "smooth");
  const k = frame - at;
  const bob = Math.sin(k / 19) * 6;
  const r = rot + Math.sin(k / 29) * 1.4;
  const zoom = interpolate(k, [0, 180], [1, 1.12], { easing: theme.ease.inOut, ...clamp });
  const inner = w - 20;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, zIndex: z, opacity: q, transform: `translateY(${interpolate(q, [0, 1], [120, 0]) + bob}px) rotate(${r}deg) scale(${interpolate(q, [0, 1], [0.7, 1])})` }}>
      <div style={{ padding: 10, paddingBottom: caption ? 12 : 10, background: colors.white, boxShadow: colors.shadow }}>
        <div style={{ width: inner, height: inner / ratio, overflow: "hidden" }}>
          <Img src={media(src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${zoom})`, transformOrigin: focus, filter: gray ? "grayscale(1) contrast(1.12)" : "contrast(1.05)" }} />
        </div>
        {caption && <div style={{ marginTop: 10, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 17, letterSpacing: "0.1em", color: colors.ink }}>{caption}</div>}
      </div>
    </div>
  );
};

/** The era header: the year burns in, the name snaps under it. */
export const EraHeader: React.FC<{ year?: string; title: string; at?: number; titleAt?: number; size?: number }> = ({ year, title, at = 0, titleAt = 8, size = 96 }) => {
  const frame = useCurrentFrame();
  const y = useIn(at, "snappy");
  const t = useIn(titleAt, "snappy");
  const burn = interpolate(frame - at, [2, 16], [1, 0], { easing: theme.ease.out, ...clamp });
  return (
    <div style={{ position: "absolute", left: 64, right: 64, top: 214, zIndex: 5, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 10 }}>
      {year && (
        <div style={{ position: "relative", fontFamily: WIDE, fontWeight: 900, fontSize: 130, lineHeight: 1, letterSpacing: "-0.03em", opacity: y, transform: `translateY(${interpolate(y, [0, 1], [-50, 0])}px) scale(${interpolate(y, [0, 1], [1.3, 1])})`, transformOrigin: "left bottom" }}>
          <span style={{ position: "absolute", inset: "-0.02em -0.08em", background: palette.primary, opacity: burn, boxShadow: `0 0 70px ${palette.glow}` }} />
          <span style={{ position: "relative", color: burn > 0.5 ? colors.ink2 : palette.text }}>{year}</span>
        </div>
      )}
      <div style={{ fontFamily: WIDE, fontWeight: 900, fontSize: size, lineHeight: 1, letterSpacing: "-0.02em", color: palette.text, opacity: t, transform: `translateX(${interpolate(t, [0, 1], [-40, 0])}px) skewX(${interpolate(t, [0, 1], [-12, 0])}deg)` }}>{title}</div>
    </div>
  );
};

/** The ladder of what you had to know: the current layer lit, the old ones struck out. */
export const Meter: React.FC<{ active: number; at?: number; top?: number }> = ({ active, at = 6, top = 1586 }) => {
  const frame = useCurrentFrame();
  const q = useIn(at, "bouncy");
  return (
    <div style={{ position: "absolute", left: 64, right: 64, top, zIndex: 6 }}>
      <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 19, letterSpacing: "0.18em", color: palette.textDim, marginBottom: 10 }}>ЧТО НАДО ЗНАТЬ</div>
      <div style={{ display: "flex", gap: 8 }}>
        {LAYERS.map((l, i) => {
          const on = i === active;
          const past = i < active;
          const strike = past ? interpolate(frame - at - i * 3, [0, 8], [0, 1], { easing: theme.ease.out, ...clamp }) : 0;
          return (
            <div
              key={l}
              style={{
                position: "relative",
                flex: on ? 1.5 : 1,
                height: 58,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: on ? palette.primary : past ? colors.surfaceLift : "transparent",
                border: `2px solid ${on ? palette.primary : colors.lineStrong}`,
                color: on ? colors.ink2 : past ? palette.textDim : colors.lineStrong,
                fontFamily: theme.fonts.mono,
                fontWeight: 800,
                fontSize: on ? 21 : 15,
                letterSpacing: "0.06em",
                boxShadow: on ? `0 0 ${Math.round(30 * q)}px ${palette.glow}` : "none",
                transform: on ? `scale(${interpolate(q, [0, 1], [1.25, 1])})` : undefined,
              }}
            >
              {l}
              {past && <span style={{ position: "absolute", left: 8, right: 8, top: "50%", height: 3, background: colors.bad, transform: `scaleX(${strike})`, transformOrigin: "left" }} />}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/** The grave of the craft. Stone from the dark surfaces, the name in the wide face. */
export const Tombstone: React.FC<{ x: number; y: number; w?: number; at?: number; drop?: boolean; z?: number }> = ({ x, y, w = 700, at = 0, drop = true, z = 6 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = drop ? spring({ frame: frame - at, fps, config: theme.spring.bouncy }) : 1;
  const k = frame - at;
  const h = w * 0.68;
  const name = Math.floor((w * 0.86) / (GRAVE.name.length * 0.84));
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, zIndex: z, transform: `translateY(${interpolate(p, [0, 1], [-260, 0])}px) rotate(${Math.sin(k / 37) * 0.6}deg)`, opacity: Math.min(1, p * 2) }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: `${w / 2}px ${w / 2}px 10px 10px / ${h * 0.42}px ${h * 0.42}px 10px 10px`,
          background: `linear-gradient(170deg, ${colors.surfaceLift}, ${colors.surfaceStrong} 70%)`,
          border: `3px solid ${colors.lineStrong}`,
          boxShadow: `${colors.shadow}, inset 0 0 60px rgba(0,0,0,0.6)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: w * 0.025,
          paddingTop: h * 0.12,
        }}
      >
        <div style={{ width: w * 0.08, height: w * 0.12, position: "relative" }}>
          <div style={{ position: "absolute", left: "42%", top: 0, width: "16%", height: "100%", background: palette.textDim }} />
          <div style={{ position: "absolute", left: 0, top: "26%", width: "100%", height: "16%", background: palette.textDim }} />
        </div>
        <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: Math.round(w * 0.03), letterSpacing: "0.3em", color: palette.textDim }}>{GRAVE.rip}</div>
        <div style={{ fontFamily: WIDE, fontWeight: 900, fontSize: name, letterSpacing: "-0.01em", color: palette.text }}>{GRAVE.name}</div>
        <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: Math.round(w * 0.062), letterSpacing: "0.12em", color: colors.bad }}>{GRAVE.years}</div>
      </div>
      {/* the ground */}
      <div style={{ position: "absolute", left: -w * 0.12, right: -w * 0.12, bottom: -18, height: 30, borderRadius: 15, background: colors.surfaceStrong, boxShadow: "0 0 40px rgba(0,0,0,0.9)" }} />
    </div>
  );
};

/** The black mourning ribbon across the top-left corner. */
export const Ribbon: React.FC<{ at?: number }> = ({ at = 0 }) => {
  const q = useIn(at, "snappy");
  return (
    <div style={{ position: "absolute", left: -230, top: 40, width: 560, height: 64, zIndex: 9, background: colors.ink2, borderTop: `3px solid ${palette.textDim}`, borderBottom: `3px solid ${palette.textDim}`, transform: `rotate(-38deg) translateX(${interpolate(q, [0, 1], [-300, 0])}px)` }} />
  );
};

/** The author's face full-bleed; a dashed frame over the candle until the HeyGen clip exists. */
export const FaceFull: React.FC<{ at: number; len: number; file: string; enabled: boolean; label: string }> = ({ at, len, file, enabled, label }) => {
  const frame = useCurrentFrame();
  if (frame < at || frame >= at + len) return null;
  const k = frame - at;
  const breathe = 1 + Math.sin(k / 16) * 0.008;
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 0, overflow: "hidden" }}>
      {enabled ? (
        <Sequence from={at} layout="none">
          {/* HeyGen returns a 1:1 studio: cover-crop it to 9:16 round the face */}
          <OffthreadVideo src={media(file)} muted playbackRate={VO_RATE} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 40%", transform: `scale(${breathe})` }} />
        </Sequence>
      ) : (
        <>
          <Sequence from={at} layout="none">
            <OffthreadVideo src={media("footage/vibecoding-layers/candle.mp4")} muted style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.05 * breathe})`, filter: "brightness(0.85)" }} />
          </Sequence>
          <div style={{ position: "absolute", left: 120, right: 120, top: 420, height: 640, border: `6px dashed ${palette.primary}`, borderRadius: 28, display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: 24 }}>
            <div style={{ padding: "8px 16px", background: colors.ink2, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 26, letterSpacing: "0.14em", color: palette.primary }}>{label}</div>
          </div>
        </>
      )}
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${palette.bg}CC 0%, ${palette.bg}00 22%, ${palette.bg}00 52%, ${palette.bg}E6 82%)` }} />
    </div>
  );
};

/** One row of punch-card cells: holes punched one by one, the digit under each, one hole wrong. */
export const Bits: React.FC<{ bits: readonly number[]; at: number; every?: number; wrong?: number; wrongAt?: number; labelsAt: number; cell?: number }> = ({
  bits,
  at,
  every = 4,
  wrong,
  wrongAt = 1e9,
  labelsAt,
  cell = 104,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const card = useIn(at - 6, "smooth");
  return (
    <div style={{ display: "inline-flex", flexDirection: "column", gap: 12, opacity: card, transform: `translateY(${interpolate(card, [0, 1], [50, 0])}px)` }}>
      <div style={{ display: "flex", gap: 10, padding: 16, background: colors.paper, boxShadow: colors.paperShadow, transform: "rotate(-1deg)" }}>
        {bits.map((b, i) => {
          const isWrong = wrong === i && frame >= wrongAt;
          const hole = b === 1 || isWrong;
          const t = isWrong ? wrongAt : at + i * every;
          const p = spring({ frame: frame - t, fps, config: theme.spring.snappy });
          return (
            <div key={i} style={{ width: cell, height: cell * 1.3, display: "flex", alignItems: "center", justifyContent: "center", border: `2px solid ${colors.inkRule}`, background: isWrong ? `${colors.bad}22` : "transparent" }}>
              {hole && (
                <div style={{ width: cell * 0.46, height: cell * 0.78, borderRadius: 6, background: isWrong ? colors.bad : colors.ink2, transform: `scale(${interpolate(p, [0, 1], [0, 1])})`, boxShadow: isWrong ? `0 0 26px ${colors.badGlow}` : "none" }} />
              )}
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: 10, paddingLeft: 16 }}>
        {bits.map((b, i) => {
          const isWrong = wrong === i && frame >= wrongAt;
          const q = interpolate(frame - labelsAt - i * 2, [0, 6], [0, 1], { easing: theme.ease.out, ...clamp });
          return (
            <div key={i} style={{ width: cell, textAlign: "center", fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 46, color: isWrong ? colors.bad : b ? palette.text : palette.textDim, opacity: q, transform: `translateY(${interpolate(q, [0, 1], [-14, 0])}px)` }}>
              {isWrong ? "1" : b}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/** A dark code panel: lines type in at their own frames, one line lit, an optional red caret. */
export const CodePanel: React.FC<{
  lines: { text: React.ReactNode; at: number; note?: string; noteAt?: number }[];
  lit?: number;
  width?: number;
  size?: number;
  title?: string;
  at?: number;
  error?: number;
}> = ({ lines, lit = -1, width = 952, size = 38, title, at = 0, error }) => {
  const frame = useCurrentFrame();
  const q = useIn(at, "smooth");
  return (
    <div style={{ width, padding: "22px 28px 28px", background: colors.surfaceStrong, border: `2px solid ${error !== undefined && frame >= error ? colors.bad : colors.lineStrong}`, borderRadius: 16, boxShadow: colors.shadow, opacity: q, transform: `translateY(${interpolate(q, [0, 1], [60, 0])}px) scale(${interpolate(q, [0, 1], [0.94, 1])})` }}>
      {title && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          {[colors.bad, palette.textDim, palette.textDim].map((c, i) => (
            <span key={i} style={{ width: 14, height: 14, borderRadius: 7, background: c }} />
          ))}
          <span style={{ marginLeft: 10, fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: 18, letterSpacing: "0.14em", color: palette.textDim }}>{title}</span>
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: Math.round(size * 0.35) }}>
        {lines.map((l, i) => {
          const p = interpolate(frame - l.at, [0, 7], [0, 1], { easing: theme.ease.out, ...clamp });
          const on = i === lit;
          const nq = l.noteAt === undefined ? 0 : interpolate(frame - l.noteAt, [0, 6], [0, 1], { easing: theme.ease.out, ...clamp });
          return (
            <div key={i} style={{ position: "relative", display: "flex", alignItems: "center", gap: 18, opacity: p, transform: `translateX(${interpolate(p, [0, 1], [-30, 0])}px)` }}>
              <span style={{ width: size * 0.9, fontFamily: theme.fonts.mono, fontSize: size * 0.6, color: colors.lineStrong }}>{i + 1}</span>
              <span
                style={{
                  padding: "2px 10px",
                  margin: "-2px -10px",
                  background: on ? palette.primary : "transparent",
                  color: on ? colors.ink2 : palette.text,
                  fontFamily: theme.fonts.mono,
                  fontWeight: 700,
                  fontSize: size,
                  whiteSpace: "pre",
                  boxShadow: on ? `0 0 24px ${palette.glow}` : "none",
                }}
              >
                {l.text}
              </span>
              {l.note && (
                <span style={{ marginLeft: "auto", padding: "4px 12px", background: colors.paper, color: colors.ink, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 20, letterSpacing: "0.1em", opacity: nq, transform: `scale(${interpolate(nq, [0, 1], [1.4, 1])}) rotate(-2deg)` }}>{l.note}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/** A ready-made brick with studs, dropping onto the stack and clicking in. */
export const Brick: React.FC<{ label: string; at: number; w?: number; tone?: "hero" | "paper" | "dim" }> = ({ label, at, w = 520, tone = "paper" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - at, fps, config: theme.spring.bouncy });
  if (frame < at) return <div style={{ height: 112 }} />;
  const bg = tone === "hero" ? palette.primary : tone === "dim" ? colors.surfaceLift : colors.paper;
  const fg = tone === "dim" ? palette.textDim : colors.ink2;
  return (
    <div style={{ position: "relative", width: w, height: 112, transform: `translateY(${interpolate(p, [0, 1], [-220, 0])}px) rotate(${interpolate(p, [0, 1], [-8, 0])}deg)`, opacity: Math.min(1, p * 2) }}>
      <div style={{ position: "absolute", top: 0, left: 24, right: 24, display: "flex", justifyContent: "space-between" }}>
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} style={{ width: 70, height: 22, borderRadius: "10px 10px 0 0", background: bg, filter: "brightness(0.9)" }} />
        ))}
      </div>
      <div style={{ position: "absolute", top: 20, left: 0, right: 0, bottom: 0, background: bg, borderRadius: 8, boxShadow: tone === "hero" ? `0 0 40px ${palette.glow}` : colors.paperShadow, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: WIDE, fontWeight: 900, fontSize: 46, letterSpacing: "0.02em", color: fg }}>
        {label}
      </div>
    </div>
  );
};

/** A chat bubble typing the request letter by letter, a caret blinking at the end. */
export const ChatBubble: React.FC<{ text: string; at: number; cps?: number; width?: number }> = ({ text, at, cps = 34, width = 952 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const q = useIn(at - 4, "snappy");
  const n = Math.max(0, Math.min(text.length, Math.floor(((frame - at) / fps) * cps)));
  const caret = Math.floor(frame / 8) % 2 === 0;
  return (
    <div style={{ width, opacity: q, transform: `translateY(${interpolate(q, [0, 1], [40, 0])}px)` }}>
      <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 18, letterSpacing: "0.16em", color: palette.textDim, marginBottom: 8 }}>ТЫ ПИШЕШЬ AI:</div>
      <div style={{ padding: "22px 28px", background: colors.paper, borderRadius: "26px 26px 26px 6px", boxShadow: colors.paperShadow, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 40, lineHeight: 1.25, color: colors.ink, minHeight: 60 }}>
        {text.slice(0, n)}
        <span style={{ display: "inline-block", width: 18, height: 40, marginLeft: 4, verticalAlign: "-6px", background: caret ? colors.ink : "transparent" }} />
      </div>
    </div>
  );
};

/** Faint symbols drifting up behind everything: the texture of the era. */
export const Drift: React.FC<{ items: string[] }> = ({ items }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}>
      {Array.from({ length: 12 }, (_, k) => {
        const y = 1900 - ((frame * (2 + (k % 3)) + k * 160) % 2000);
        const x = 30 + ((k * 233) % 980);
        return (
          <div key={k} style={{ position: "absolute", left: x, top: y, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 28 + (k % 3) * 10, color: k % 4 === 0 ? colors.bad : palette.primary, opacity: 0.12 }}>
            {items[k % items.length]}
          </div>
        );
      })}
    </div>
  );
};

export const SourceLine: React.FC<{ text: string; top?: number }> = ({ text, top = 1770 }) => (
  <div style={{ position: "absolute", left: 64, right: 64, top, textAlign: "center", fontFamily: theme.fonts.mono, fontSize: 14, lineHeight: 1.4, color: palette.textDim, letterSpacing: "0.04em", zIndex: 8 }}>{text}</div>
);

/** A glitch tear on the cut: wrap the scene's content. */
export const CutTear: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const tear = interpolate(frame, [0, 1, 8], [0, 0.9, 0], clamp);
  return (
    <Glitch amount={tear} style={{ position: "absolute", inset: 0 }}>
      {children}
    </Glitch>
  );
};

/** Like + subscribe, the way the platform draws them: a thumb that fills lime, a red button, a bell that rings. */
export const CtaRow: React.FC<{ at: number; like: string; subscribe: string; top: number }> = ({ at, like, subscribe, top }) => {
  const frame = useCurrentFrame();
  // hooks before the early return: a hook count that changes between frames crashes the render
  const thumb = useIn(at, "bouncy");
  const btn = useIn(at + 10, "snappy");
  if (frame < at) return null;
  const k = frame - at;
  const fill = interpolate(k, [8, 14], [0, 1], { easing: theme.ease.out, ...clamp });
  const burst = interpolate(k, [10, 24], [0, 1], { easing: theme.ease.out, ...clamp });
  const ring = k > 16 ? Math.sin((k - 16) / 1.6) * interpolate(k, [16, 40], [16, 0], clamp) : 0;
  const thumbColor = fill > 0.5 ? palette.primary : palette.text;
  return (
    <div style={{ position: "absolute", left: 64, right: 64, top, display: "flex", alignItems: "center", justifyContent: "center", gap: 26, zIndex: 9 }}>
      <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 12, opacity: thumb, transform: `scale(${interpolate(thumb, [0, 1], [0.4, 1]) * (1 + (fill > 0 && fill < 1 ? 0.25 : 0))})` }}>
        {burst > 0 && burst < 1 && (
          <div style={{ position: "absolute", left: 10, top: 6, width: 60, height: 60, borderRadius: "50%", border: `3px solid ${palette.primary}`, opacity: 1 - burst, transform: `scale(${1 + burst * 2.2})` }} />
        )}
        <svg viewBox="0 0 24 24" width={80} height={80} style={{ filter: fill > 0.5 ? `drop-shadow(0 0 16px ${palette.glow})` : undefined }}>
          <path d="M2 10h4v11H2zM7 10l4.2-7.6c.4-.7 1.3-.9 1.9-.4.5.4.7 1 .6 1.6L13 9h6.3c1.3 0 2.3 1.2 2 2.5l-1.6 7.4A2.5 2.5 0 0 1 17.3 21H7z" fill={fill > 0.5 ? palette.primary : "none"} stroke={thumbColor} strokeWidth={1.6} strokeLinejoin="round" />
        </svg>
        <span style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 32, letterSpacing: "0.1em", color: thumbColor }}>{like}</span>
      </div>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 14, padding: "18px 30px", borderRadius: 40, background: colors.bad, color: colors.white, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 32, letterSpacing: "0.08em", boxShadow: `0 0 34px ${colors.badGlow}`, opacity: btn, transform: `scale(${interpolate(btn, [0, 1], [1.6, 1])}) rotate(${interpolate(btn, [0, 1], [-6, 0])}deg)` }}>
        {subscribe}
        <svg viewBox="0 0 24 24" width={40} height={40} style={{ transform: `rotate(${ring}deg)`, transformOrigin: "50% 15%" }}>
          <path d="M12 2a6 6 0 0 0-6 6v4l-2 3v1h16v-1l-2-3V8a6 6 0 0 0-6-6zm-2 17a2 2 0 0 0 4 0" fill={colors.white} />
        </svg>
      </div>
    </div>
  );
};

/** A chip that appears at a frame and holds. Thin wrapper so scenes read as a list. */
export const Tag: React.FC<{ at: number; x: number; y: number; tone?: "neutral" | "hero" | "bad" | "paper"; filled?: boolean; size?: number; children: React.ReactNode; z?: number }> = ({
  at,
  x,
  y,
  tone = "paper",
  filled,
  size = 22,
  children,
  z = 7,
}) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, zIndex: z }}>
      <Chip delay={at} tone={tone} filled={filled} size={size}>
        {children}
      </Chip>
    </div>
  );
};

/* ------------------------------------------------ added for the author's notes (2026-10-24) */

/** The church candle full-bleed: the first frames and the last ones (the loop). */
export const CandleBg: React.FC<{ until?: number }> = ({ until }) => {
  const frame = useCurrentFrame();
  if (until !== undefined && frame >= until) return null;
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 0, overflow: "hidden" }}>
      <Sequence layout="none">
        <OffthreadVideo src={media("footage/vibecoding-layers/candle.mp4")} muted style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.06 + frame * 0.0005})`, filter: "brightness(0.9) contrast(1.05)" }} />
      </Sequence>
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${palette.bg}CC 0%, ${palette.bg}00 24%, ${palette.bg}00 50%, ${palette.bg}D9 80%)` }} />
    </div>
  );
};

/** The picture rows inside HeyGen's 1080×1080 file (measured on promise.mp4: white above 236 and below 844). */
export const FACE_BAND = { size: 1080, top: 238, bottom: 842 };

/** The author's face in a big panel; a dashed panel with a label until the HeyGen clip exists. */
export const FacePanel: React.FC<{ at: number; len: number; file: string; enabled: boolean; label: string; x: number; y: number; w: number; h: number }> = ({ at, len, file, enabled, label, x, y, w, h }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < at || frame >= at + len) return null;
  const k = frame - at;
  const p = spring({ frame: k, fps, config: theme.spring.snappy });
  const breathe = 1 + Math.sin(k / 15) * 0.006;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, zIndex: 6, borderRadius: 30, overflow: "hidden", border: `6px ${enabled ? "solid" : "dashed"} ${palette.primary}`, boxShadow: `0 0 50px ${palette.glow}, ${colors.shadow}`, background: colors.surfaceStrong, opacity: Math.min(1, p * 1.5), transform: `translateY(${interpolate(p, [0, 1], [140, 0])}px) scale(${interpolate(p, [0, 1], [0.9, 1]) * breathe})` }}>
      {enabled ? (
        <Sequence from={at} layout="none">
          {/* HeyGen letterboxes the 16:9 studio inside its 1:1 file: scale so only the picture band fills the panel */}
          <OffthreadVideo src={media(file)} muted playbackRate={VO_RATE} style={{ position: "absolute", width: (FACE_BAND.size * h) / (FACE_BAND.bottom - FACE_BAND.top), height: (FACE_BAND.size * h) / (FACE_BAND.bottom - FACE_BAND.top), left: (w - (FACE_BAND.size * h) / (FACE_BAND.bottom - FACE_BAND.top)) / 2, top: (-FACE_BAND.top * h) / (FACE_BAND.bottom - FACE_BAND.top), maxWidth: "none" }} />
        </Sequence>
      ) : (
        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 32, letterSpacing: "0.14em", color: palette.primary }}>{label}</div>
      )}
    </div>
  );
};

/** The Moon (NASA LRO), round, slowly turning, a cold rim light and a soft terminator. */
export const Moon: React.FC<{ x: number; y: number; size: number; at: number }> = ({ x, y, size, at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - at, fps, config: theme.spring.smooth });
  if (frame < at) return null;
  const k = frame - at;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: size, height: size, zIndex: 3, opacity: Math.min(1, p * 1.4), transform: `translateY(${interpolate(p, [0, 1], [120, 0]) + Math.sin(k / 24) * 6}px) scale(${interpolate(p, [0, 1], [0.6, 1])})` }}>
      <div style={{ position: "absolute", inset: -size * 0.12, borderRadius: "50%", background: `radial-gradient(circle, ${palette.text}33 52%, transparent 70%)` }} />
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", overflow: "hidden", boxShadow: `0 0 ${size * 0.25}px ${palette.text}40` }}>
        <Img src={media("images/vibecoding-layers/moon.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(1.02) rotate(${k * 0.15}deg)`, filter: "contrast(1.15) brightness(1.05)" }} />
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 30% 30%, transparent 45%, ${colors.ink2}D0 95%)` }} />
      </div>
    </div>
  );
};

/** A cut-out person as a TikTok sticker: white outline, pop with a tilt, a tear of glitch, then breathing. */
export const CutSticker: React.FC<{ src: string; x: number; y: number; w: number; ratio: number; at: number; rot?: number; z?: number; outline?: number }> = ({ src, x, y, w, ratio, at, rot = 0, z = 6, outline = 5 }) => {
  const frame = useCurrentFrame();
  const q = useIn(at, "bouncy");
  if (frame < at) return null;
  const k = frame - at;
  const tear = interpolate(k, [0, 2, 10], [0, 0.8, 0], clamp);
  const o = outline;
  const white = colors.white;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, zIndex: z, opacity: q, transform: `translateY(${Math.sin(k / 17) * 5}px) rotate(${rot + Math.sin(k / 23) * 1.5}deg) scale(${interpolate(q, [0, 1], [0.3, 1])})` }}>
      <Glitch amount={tear}>
        <Img
          src={media(src)}
          style={{
            width: w,
            height: w / ratio,
            display: "block",
            filter: `drop-shadow(${o}px 0 0 ${white}) drop-shadow(-${o}px 0 0 ${white}) drop-shadow(0 ${o}px 0 ${white}) drop-shadow(0 -${o}px 0 ${white}) drop-shadow(0 24px 30px rgba(0,0,0,0.7))`,
          }}
        />
      </Glitch>
    </div>
  );
};
