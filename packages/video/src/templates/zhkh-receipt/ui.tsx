// Primitives of this episode: the receipt as the one object, a struck tariff,
// the yearly number, a cut-out photo, the face in a circle, bars, pips. Kit
// pieces (SceneShell, Kinetic, Chip, Stamp, Receipt…) come from digital-ruble/ui.
import React from "react";
import { Img, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../theme";
import { useIn } from "../../reel";
import { Chip, Glitch, Receipt, ReceiptLine, ReceiptRule } from "../digital-ruble/ui";
import { zhkhReceiptColors as colors, zhkhReceiptPalette as palette } from "./palette";
import { RECEIPT } from "./data";

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
/** Unbounded has no ₽ and no arrows: the mono face supplies them. */
export const WIDE = `${theme.fonts.wide}, ${theme.fonts.mono}`;
export const media = (f: string) => staticFile(f);
/** 13881 → «13 881» with thin spaces that never wrap. */
export const nbsp = (n: number) => n.toLocaleString("ru-RU").replace(/[ \s]/g, " ");
/** Unbounded Black ≈ 0.92 em per capital; size so the longest word fits 952 px. */
export const fitWord = (text: string, max: number) => {
  const longest = text.split(" ").reduce((a, b) => (a.length > b.length ? a : b));
  return Math.max(56, Math.min(max, Math.floor(952 / (longest.length * 0.92))));
};

/** Digits in the wide face (or mono inside paper), the ₽ always in mono. */
export const Money: React.FC<{
  value: string | number;
  size?: number;
  color?: string;
  prefix?: string;
  glow?: boolean;
  font?: "wide" | "mono";
  style?: React.CSSProperties;
}> = ({ value, size = 120, color = palette.text, prefix = "", glow, font = "wide", style }) => (
  <span
    style={{
      fontFamily: font === "wide" ? WIDE : theme.fonts.mono,
      fontSize: size,
      fontWeight: font === "wide" ? 900 : 800,
      letterSpacing: font === "wide" ? "-0.02em" : "0.02em",
      lineHeight: 1,
      color,
      fontVariantNumeric: "tabular-nums",
      whiteSpace: "nowrap",
      filter: glow ? `drop-shadow(0 0 ${Math.round(size * 0.3)}px ${palette.glow})` : undefined,
      ...style,
    }}
  >
    {prefix}
    {typeof value === "number" ? nbsp(value) : value}
    <span style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: Math.round(size * 0.8), marginLeft: Math.round(size * 0.14) }}>₽</span>
  </span>
);

/** A number rolling from → to on a heavy spring, then held. */
export const Roll: React.FC<{
  from?: number;
  to: number;
  at: number;
  size?: number;
  color?: string;
  prefix?: string;
  glow?: boolean;
  font?: "wide" | "mono";
  style?: React.CSSProperties;
}> = ({ from = 0, to, at, size, color, prefix, glow, font, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - at, fps, config: { damping: 30, stiffness: 46, mass: 1 } });
  const v = Math.round(interpolate(p, [0, 1], [from, to]));
  return <Money value={v} size={size} color={color} prefix={prefix} glow={glow} font={font} style={style} />;
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

/** The bill: every line printed, one line lit in lime when a beat is about it. */
export const ReceiptPanel: React.FC<{
  width?: number;
  tilt?: number;
  printFrom?: number;
  printFrames?: number;
  active?: string;
  size?: number;
  total: React.ReactNode;
  compact?: boolean; // the small receipt of a service beat: head without the flat line
  style?: React.CSSProperties;
}> = ({ width = 560, tilt = -2, printFrom = 0, printFrames = 1, active, size = 22, total, compact, style }) => (
  <Receipt width={width} tilt={tilt} printFrom={printFrom} printFrames={printFrames} title={RECEIPT.title} number={compact ? undefined : RECEIPT.number} style={style}>
    {RECEIPT.rows.map((r, i) => {
      const on = active === r.key;
      const dim = active !== undefined && !on;
      return (
        <div
          key={r.label}
          style={{
            margin: "0 -14px",
            padding: "0 14px",
            borderRadius: 6,
            background: on ? palette.primary : "transparent",
            boxShadow: on ? `0 0 26px ${palette.glow}` : undefined,
            opacity: dim ? 0.38 : 1,
          }}
        >
          <ReceiptLine label={r.label} value={r.after} size={size} strong={on} delay={printFrom + Math.round((printFrames * (i + 1)) / (RECEIPT.rows.length + 2))} />
        </div>
      );
    })}
    <ReceiptRule strong />
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", fontSize: Math.round(size * 1.2), fontWeight: 800, letterSpacing: "0.1em" }}>
      <span>ИТОГО</span>
      <span>{total}</span>
    </div>
  </Receipt>
);

/** Old tariff struck in red, the new one popping in, the unit after. */
export const TariffRow: React.FC<{ oldV: string; newV: string; unit: string; at?: number; size?: number }> = ({ oldV, newV, unit, at = 0, size = 40 }) => {
  const frame = useCurrentFrame();
  const q = useIn(at, "snappy");
  const strike = interpolate(frame - at - 6, [0, 8], [0, 1], { easing: theme.ease.out, ...clamp });
  const pop = useIn(at + 10, "bouncy");
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "baseline",
        gap: Math.round(size * 0.4),
        padding: `${Math.round(size * 0.3)}px ${Math.round(size * 0.5)}px`,
        background: colors.paper,
        color: colors.ink,
        boxShadow: colors.paperShadow,
        fontFamily: theme.fonts.mono,
        fontWeight: 800,
        fontSize: size,
        whiteSpace: "nowrap",
        opacity: q,
        transform: `translateY(${interpolate(q, [0, 1], [24, 0])}px) rotate(-1.2deg)`,
      }}
    >
      <span style={{ position: "relative", color: colors.inkFaded }}>
        {oldV}
        <span style={{ position: "absolute", left: -4, right: -4, top: "50%", height: Math.max(4, Math.round(size * 0.12)), background: colors.bad, transform: `scaleX(${strike})`, transformOrigin: "left center" }} />
      </span>
      <span style={{ display: "inline-block", color: colors.bad, opacity: pop, transform: `translateX(${interpolate(pop, [0, 1], [-12, 0])}px)` }}>→</span>
      <span style={{ display: "inline-block", opacity: pop, transform: `scale(${interpolate(pop, [0, 1], [1.5, 1])})`, transformOrigin: "left bottom" }}>{newV}</span>
      <span style={{ fontSize: Math.round(size * 0.5), letterSpacing: "0.12em", color: colors.inkFaded }}>{unit}</span>
    </div>
  );
};

/** «ЗА ГОД» + the lime number + the assumption it rests on. */
export const YearBlock: React.FC<{ year: number; volume: string; at: number; note?: string; size?: number }> = ({ year, volume, at, note, size = 110 }) => {
  const q = useIn(at, "snappy");
  return (
    <div style={{ position: "absolute", left: 64, top: 1190, zIndex: 4, display: "flex", flexDirection: "column", gap: 12, opacity: q, transform: `translateY(${interpolate(q, [0, 1], [40, 0])}px)` }}>
      <Chip delay={at} tone="hero" filled size={24}>
        ЗА ГОД
      </Chip>
      <Roll to={year} at={at + 3} size={size} color={palette.primary} prefix="+" glow />
      <Paper delay={at + 10} size={20}>{volume}</Paper>
      {note && (
        <Paper delay={at + 16} size={19} rotate={1} tone="bad">
          {note}
        </Paper>
      )}
    </div>
  );
};

/** A real photo, cut out (or on a white card), sliding in and breathing. */
export const Cutout: React.FC<{ src: string; x: number; y: number; w: number; ratio: number; at?: number; until?: number; rot?: number; card?: boolean; z?: number }> = ({
  src,
  x,
  y,
  w,
  ratio,
  at = 0,
  until,
  rot = 0,
  card,
  z = 2,
}) => {
  const frame = useCurrentFrame();
  const q = useIn(at, "smooth");
  const out = until === undefined ? 0 : interpolate(frame, [until - 6, until], [0, 1], { easing: theme.ease.in, ...clamp });
  if (out >= 1) return null;
  const bob = Math.sin((frame - at) / 19) * 7;
  const r = rot + Math.sin((frame - at) / 29) * 1.6;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, zIndex: z, opacity: q * (1 - out), transform: `translateY(${interpolate(q, [0, 1], [120, 0]) + bob + out * 90}px) rotate(${r}deg) scale(${interpolate(q, [0, 1], [0.7, 1])})` }}>
      {card ? (
        <div style={{ padding: 10, background: colors.white, boxShadow: colors.shadow }}>
          <Img src={media(src)} style={{ width: "100%", height: (w - 20) / ratio, objectFit: "cover", display: "block", filter: "grayscale(0.35) contrast(1.08)" }} />
        </div>
      ) : (
        <Img src={media(src)} style={{ width: w, height: w / ratio, display: "block", filter: "grayscale(0.3) contrast(1.08) drop-shadow(0 26px 30px rgba(0,0,0,0.75))" }} />
      )}
    </div>
  );
};

/** The supplier, as a paper wordmark. */
export const Wordmark: React.FC<{ text: string; at?: number; x?: number; y?: number; right?: number }> = ({ text, at = 0, x, y = 1360, right = 60 }) => (
  <div style={{ position: "absolute", left: x, right: x === undefined ? right : undefined, top: y, zIndex: 3 }}>
    <Chip delay={at} tone="paper" size={22}>
      {text}
    </Chip>
  </div>
);

/** The author's face in a lime ring; a dashed ring with a label until the clip exists. */
export const FaceCircle: React.FC<{ at: number; len: number; file: string; rate: number; size?: number; x: number; y: number; enabled: boolean }> = ({
  at,
  len,
  file,
  rate,
  size = 440,
  x,
  y,
  enabled,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < at || frame >= at + len) return null;
  const k = frame - at;
  const p = spring({ frame: k, fps, config: theme.spring.bouncy });
  const out = interpolate(k, [len - 6, len], [0, 1], { easing: theme.ease.in, ...clamp });
  const breathe = 1 + Math.sin(k / 14) * 0.012;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: size, height: size, zIndex: 10, opacity: 1 - out, transform: `scale(${interpolate(p, [0, 1], [0.4, 1]) * breathe}) rotate(${interpolate(p, [0, 1], [-14, 0])}deg)` }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          overflow: "hidden",
          border: `8px ${enabled ? "solid" : "dashed"} ${palette.primary}`,
          boxShadow: `0 0 44px ${palette.glow}, ${colors.shadow}`,
          background: colors.surfaceStrong,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {enabled ? (
          <Sequence from={at} layout="none">
            {/* HeyGen returns the whole studio in 1:1; push in so the face fills the ring */}
            <OffthreadVideo src={media(file)} muted playbackRate={rate} style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scale(2.35)", transformOrigin: "50% 44%" }} />
          </Sequence>
        ) : (
          <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 26, letterSpacing: "0.12em", color: palette.primary, textAlign: "center", lineHeight: 1.4 }}>
            ЛИЦО
            <br />
            3 С
          </div>
        )}
      </div>
    </div>
  );
};

/** Progress through the four lines of the bill. */
export const Pips: React.FC<{ active: number; count?: number }> = ({ active, count = 4 }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: 1750, display: "flex", justifyContent: "center", gap: 14, zIndex: 3 }}>
    {Array.from({ length: count }, (_, i) => (
      <div key={i} style={{ width: i === active ? 70 : 22, height: 22, borderRadius: 11, background: i <= active ? palette.primary : colors.lineStrong, boxShadow: i === active ? `0 0 20px ${palette.glow}` : "none" }} />
    ))}
  </div>
);

/** Faint figures drifting up behind everything: the accounting texture. */
export const Drift: React.FC<{ items: string[] }> = ({ items }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}>
      {Array.from({ length: 12 }, (_, k) => {
        const y = 1900 - ((frame * (2 + (k % 3)) + k * 160) % 2000);
        const x = 30 + ((k * 233) % 980);
        return (
          <div key={k} style={{ position: "absolute", left: x, top: y, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 28 + (k % 3) * 10, color: k % 4 === 0 ? colors.bad : palette.primary, opacity: 0.13 }}>
            {items[k % items.length]}
          </div>
        );
      })}
    </div>
  );
};

/** One bar of the year's breakdown: label, bar, lime value. */
export const Bar: React.FC<{ label: string; value: number; max: number; at: number }> = ({ label, value, max, at }) => {
  const q = useIn(at, "smooth");
  const w = Math.max(10, interpolate(q, [0, 1], [0, 520 * (value / max)]));
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, opacity: q }}>
      <div style={{ width: 210, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 20, letterSpacing: "0.08em", color: palette.text }}>{label}</div>
      <div style={{ position: "relative", flex: 1, height: 44 }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: w, background: colors.surfaceLift, border: `2px solid ${colors.lineStrong}` }} />
        <div style={{ position: "absolute", left: w + 14, top: 6, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 26, color: palette.primary, whiteSpace: "nowrap" }}>+{nbsp(value)} ₽</div>
      </div>
    </div>
  );
};

/** A dated card on paper with a red edge: the next rise. */
export const Card: React.FC<{ title: string; text: string; at: number }> = ({ title, text, at }) => {
  const q = useIn(at, "snappy");
  return (
    <div style={{ width: 600, padding: "14px 18px", background: colors.paper, borderLeft: `10px solid ${colors.bad}`, boxShadow: colors.paperShadow, opacity: q, transform: `translateX(${interpolate(q, [0, 1], [-80, 0])}px)` }}>
      <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 18, letterSpacing: "0.14em", color: colors.bad, marginBottom: 6 }}>{title}</div>
      <div style={{ fontFamily: WIDE, fontWeight: 900, fontSize: 34, lineHeight: 1.12, color: colors.ink }}>{text}</div>
    </div>
  );
};

export const SourceLine: React.FC<{ text: string; top?: number }> = ({ text, top = 1760 }) => (
  <div style={{ position: "absolute", left: 64, right: 64, top, textAlign: "center", fontFamily: theme.fonts.mono, fontSize: 16, lineHeight: 1.4, color: palette.textDim, letterSpacing: "0.04em" }}>{text}</div>
);

/* ------------------------------------------------ added for the author's notes (2026-10-23) */

/** A licensed clip in a tilted screen tile: cover-cropped, graded, scrimmed, breathing. */
export const ClipTile: React.FC<{ src: string; x: number; y: number; w: number; h: number; rot?: number; at?: number; z?: number }> = ({
  src,
  x,
  y,
  w,
  h,
  rot = 2,
  at = 0,
  z = 1,
}) => {
  const frame = useCurrentFrame();
  const q = useIn(at, "smooth");
  const breathe = 1 + Math.sin((frame - at) / 23) * 0.01;
  const r = rot + Math.sin((frame - at) / 31) * 0.8;
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
        <OffthreadVideo src={media(src)} muted style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(0.25) contrast(1.1) brightness(0.9)" }} />
      </Sequence>
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${palette.bg}00 50%, ${palette.bg}B0 100%)` }} />
      <div style={{ position: "absolute", left: 14, top: 12, padding: "4px 10px", background: colors.bad, color: colors.white, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 16, letterSpacing: "0.14em" }}>LIVE</div>
    </div>
  );
};

/** Headline words landing one by one inside a lime block that burns off (the TikTok drop). */
export const BurnWords: React.FC<{ words: string[]; every?: number; size?: number; start?: number }> = ({ words, every = 5, size = 92, start = 0 }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", flexWrap: "wrap", columnGap: 22, rowGap: 4, fontFamily: WIDE, fontSize: size, fontWeight: 900, lineHeight: 1.0, letterSpacing: "-0.02em" }}>
      {words.map((w, i) => {
        const at = start + i * every;
        const p = interpolate(frame - at, [0, 8], [0, 1], { easing: theme.ease.out, ...clamp });
        const burn = interpolate(frame - at, [2, 14], [1, 0], { easing: theme.ease.out, ...clamp });
        return (
          <span key={i} style={{ position: "relative", display: "inline-block", opacity: frame >= at ? 1 : 0, transform: `translateY(${interpolate(p, [0, 1], [-60, 0])}px) scale(${interpolate(p, [0, 1], [1.4, 1])})`, transformOrigin: "left bottom" }}>
            <span style={{ position: "absolute", inset: "-0.04em -0.1em -0.02em", background: palette.primary, opacity: burn, boxShadow: `0 0 ${size * 0.6}px ${palette.glow}` }} />
            <span style={{ position: "relative", color: burn > 0.5 ? colors.ink2 : palette.text }}>{w}</span>
          </span>
        );
      })}
    </div>
  );
};

/** A TikTok-style hand-drawn arrow, lime, wobbling, pointing at the main object. */
export const Arrow: React.FC<{ x: number; y: number; rot?: number; at?: number; until?: number; size?: number; color?: string }> = ({ x, y, rot = 0, at = 0, until, size = 180, color = palette.primary }) => {
  const frame = useCurrentFrame();
  const q = useIn(at, "bouncy");
  if (frame < at || (until !== undefined && frame >= until)) return null;
  const wob = Math.sin((frame - at) / 5) * 4;
  return (
    <svg viewBox="0 0 100 60" width={size} height={size * 0.6} style={{ position: "absolute", left: x, top: y, zIndex: 8, opacity: q, transform: `rotate(${rot + wob}deg) scale(${interpolate(q, [0, 1], [0.3, 1])})`, transformOrigin: "100% 50%", filter: `drop-shadow(0 0 14px ${palette.glow})` }}>
      <path d="M4 48 C 30 46, 55 40, 80 22" fill="none" stroke={color} strokeWidth={9} strokeLinecap="round" />
      <path d="M62 14 L 86 18 L 74 40" fill="none" stroke={color} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

/** A meme popping in like a sticker: bounce, tilt, a tear of glitch on arrival. Cut-outs sit bare, photos on a white card. */
export const Sticker: React.FC<{ src: string; x: number; y: number; w: number; ratio: number; cut?: boolean; at?: number; rot?: number; z?: number }> = ({ src, x, y, w, ratio, cut, at = 0, rot = 6, z = 7 }) => {
  const frame = useCurrentFrame();
  const q = useIn(at, "bouncy");
  if (frame < at) return null;
  const k = frame - at;
  const tear = interpolate(k, [0, 2, 12], [0, 0.9, 0], clamp);
  const r = rot + Math.sin(k / 9) * 2.5;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, zIndex: z, opacity: q, transform: `rotate(${r}deg) scale(${interpolate(q, [0, 1], [0.3, 1])})` }}>
      <Glitch amount={tear}>
        {cut ? (
          <Img src={media(src)} style={{ width: w, height: w / ratio, display: "block", filter: "contrast(1.08) drop-shadow(0 20px 26px rgba(0,0,0,0.75))" }} />
        ) : (
          <div style={{ padding: 8, background: colors.white, boxShadow: colors.shadow }}>
            <Img src={media(src)} style={{ width: "100%", height: (w - 16) / ratio, objectFit: "cover", display: "block" }} />
          </div>
        )}
      </Glitch>
    </div>
  );
};

/** Like + subscribe, the way the platform draws them: a thumb that fills lime, a red button that slams, a bell that rings. */
export const CtaRow: React.FC<{ at: number; like: string; subscribe: string }> = ({ at, like, subscribe }) => {
  const frame = useCurrentFrame();
  // hooks before the early return: a hook count that changes between frames crashes the render
  const thumb = useIn(at, "bouncy");
  const btn = useIn(at + 12, "snappy");
  if (frame < at) return null;
  const k = frame - at;
  const fill = interpolate(k, [10, 16], [0, 1], { easing: theme.ease.out, ...clamp });
  const burst = interpolate(k, [12, 26], [0, 1], { easing: theme.ease.out, ...clamp });
  const ring = k > 18 ? Math.sin((k - 18) / 1.6) * interpolate(k, [18, 40], [16, 0], clamp) : 0;
  const thumbColor = fill > 0.5 ? palette.primary : palette.text;
  return (
    <div style={{ position: "absolute", left: 64, right: 64, display: "flex", alignItems: "center", gap: 22, zIndex: 9 }}>
      <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 12, opacity: thumb, transform: `scale(${interpolate(thumb, [0, 1], [0.4, 1]) * (1 + (fill > 0 && fill < 1 ? 0.25 : 0))})` }}>
        {burst > 0 && burst < 1 && (
          <div style={{ position: "absolute", left: 10, top: 6, width: 60, height: 60, borderRadius: "50%", border: `3px solid ${palette.primary}`, opacity: 1 - burst, transform: `scale(${1 + burst * 2.2})` }} />
        )}
        <svg viewBox="0 0 24 24" width={76} height={76} style={{ filter: fill > 0.5 ? `drop-shadow(0 0 16px ${palette.glow})` : undefined }}>
          <path d="M2 10h4v11H2zM7 10l4.2-7.6c.4-.7 1.3-.9 1.9-.4.5.4.7 1 .6 1.6L13 9h6.3c1.3 0 2.3 1.2 2 2.5l-1.6 7.4A2.5 2.5 0 0 1 17.3 21H7z" fill={fill > 0.5 ? palette.primary : "none"} stroke={thumbColor} strokeWidth={1.6} strokeLinejoin="round" />
        </svg>
        <span style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 30, letterSpacing: "0.1em", color: thumbColor }}>{like}</span>
      </div>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 14, padding: "16px 28px", borderRadius: 40, background: colors.bad, color: colors.white, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 30, letterSpacing: "0.08em", boxShadow: `0 0 34px ${colors.badGlow}`, opacity: btn, transform: `scale(${interpolate(btn, [0, 1], [1.6, 1])}) rotate(${interpolate(btn, [0, 1], [-6, 0])}deg)` }}>
        {subscribe}
        <svg viewBox="0 0 24 24" width={38} height={38} style={{ transform: `rotate(${ring}deg)`, transformOrigin: "50% 15%" }}>
          <path d="M12 2a6 6 0 0 0-6 6v4l-2 3v1h16v-1l-2-3V8a6 6 0 0 0-6-6zm-2 17a2 2 0 0 0 4 0" fill={colors.white} />
        </svg>
      </div>
    </div>
  );
};

/** A service icon on a dark tile: lime glyph with a glow, the rise under it in red. Drawn in SVG, never an emoji. */
const GLYPH: Record<"drop" | "bolt" | "flame" | "radiator", React.ReactNode> = {
  drop: <path d="M12 2.5c-3.6 5-7 8.6-7 12.5a7 7 0 0 0 14 0c0-3.9-3.4-7.5-7-12.5z" />,
  bolt: <path d="M13.5 2 4.5 13.5h6l-1.2 8.5 9.2-12h-6.2z" />,
  flame: <path d="M12.5 2c.8 4.2 5.5 6.3 5.5 11.3A6 6 0 0 1 6 13.3c0-2.2 1-3.6 2.3-4.8.1 2 1.1 3.2 2.4 3.4-.6-3.3-.3-6.9 1.8-9.9z" />,
  radiator: (
    <>
      <rect x="3" y="7" width="3.2" height="12" rx="1.2" />
      <rect x="7.4" y="7" width="3.2" height="12" rx="1.2" />
      <rect x="11.8" y="7" width="3.2" height="12" rx="1.2" />
      <rect x="16.2" y="7" width="3.2" height="12" rx="1.2" />
      <rect x="2" y="4" width="20" height="2" rx="1" />
    </>
  ),
};

export const Icon: React.FC<{ kind: keyof typeof GLYPH; label: string; value: string; x: number; y: number; at?: number; until?: number; rot?: number; size?: number }> = ({
  kind,
  label,
  value,
  x,
  y,
  at = 0,
  until,
  rot = 0,
  size = 170,
}) => {
  const frame = useCurrentFrame();
  const q = useIn(at, "bouncy");
  const out = until === undefined ? 0 : interpolate(frame, [until - 6, until], [0, 1], { easing: theme.ease.in, ...clamp });
  if (frame < at || out >= 1) return null;
  const k = frame - at;
  const bob = Math.sin(k / 17) * 5;
  const pulse = 1 + Math.sin(k / 11) * 0.03;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: size,
        zIndex: 4,
        opacity: q * (1 - out),
        transform: `translateY(${interpolate(q, [0, 1], [70, 0]) + bob + out * 80}px) rotate(${rot + Math.sin(k / 23) * 1.5}deg) scale(${interpolate(q, [0, 1], [0.5, 1])})`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
      }}
    >
      <div
        style={{
          width: size,
          height: size,
          borderRadius: Math.round(size * 0.22),
          background: `linear-gradient(160deg, ${colors.surfaceLift}, ${colors.surfaceStrong})`,
          border: `2px solid ${colors.lineStrong}`,
          boxShadow: `inset 0 0 ${Math.round(size * 0.35)}px ${palette.primary}22, ${colors.shadow}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg viewBox="0 0 24 24" width={size * 0.58} height={size * 0.58} fill={palette.primary} style={{ filter: `drop-shadow(0 0 ${Math.round(size * 0.12)}px ${palette.glow})`, transform: `scale(${pulse})` }}>
          {GLYPH[kind]}
        </svg>
      </div>
      <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 16, letterSpacing: "0.14em", color: palette.textDim }}>{label}</div>
      <div style={{ marginTop: -4, padding: "3px 10px", background: colors.bad, color: colors.white, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 20, letterSpacing: "0.04em", transform: "rotate(-2deg)" }}>{value}</div>
    </div>
  );
};
