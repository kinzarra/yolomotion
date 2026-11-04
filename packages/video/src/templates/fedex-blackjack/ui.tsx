// HTML overlays for the FedEx reel: headlines, game pills, paper cards,
// stamps, the fuel bar and the subscribe finale. The cartoon is in toon.tsx.
import React from "react";
import { interpolate, spring } from "remotion";
import { theme } from "../../theme";
import { fx } from "./palette";
import { WIDE } from "./toon";

export * from "../digital-ruble/ui";

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const X0 = 110;
export const X1 = 970;
export const MONO = theme.fonts.mono;

/** Spring of an age in seconds (0 before it starts). */
export const sp = (age: number, fps: number, cfg: keyof typeof theme.spring = "snappy") =>
  age <= 0 ? 0 : spring({ frame: age * fps, fps, config: theme.spring[cfg] });

/** 1 → 0 over the last `k` seconds of a `len`-long life. */
export const out = (age: number, len: number, k = 0.25) =>
  interpolate(age, [len - k, len], [1, 0], { easing: theme.ease.in, ...clamp });

/** Eased 0..1 between two moments. */
export const ramp = (t: number, a: number, b: number, ease: keyof typeof theme.ease = "inOut") =>
  interpolate(t, [a, b], [0, 1], { easing: theme.ease[ease], ...clamp });

export const usd = (n: number) => "$" + String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, " ");

/* ------------------------------------------------------------ type */

export const Eyebrow: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = fx.orange }) => (
  <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 30, letterSpacing: "0.2em", color }}>{children}</div>
);

/**
 * Top-left headline: mono eyebrow, then wide lines staggered in. `accent`
 * lines are orange. `age` < 0 hides it; frame-0 headlines pass a large age.
 */
export const Headline: React.FC<{ age: number; fps: number; eyebrow: string; lines: string[]; accent?: number[]; size?: number; len?: number; sub?: string }> = ({ age, fps, eyebrow, lines, accent = [], size = 92, len = 99, sub }) => {
  if (age < 0 || age > len) return null;
  const o = out(age, len, 0.2);
  const e = sp(age, fps);
  return (
    <div style={{ position: "absolute", left: X0, top: 150, right: 60, opacity: o }}>
      <div style={{ opacity: e, transform: `translateY(${interpolate(e, [0, 1], [-24, 0])}px)` }}>
        <Eyebrow>{eyebrow}</Eyebrow>
      </div>
      <div style={{ marginTop: 18 }}>
        {lines.map((l, i) => {
          const s = sp(age - 0.06 - i * 0.1, fps, "bouncy");
          return (
            <div
              key={i}
              style={{
                fontFamily: WIDE,
                fontWeight: 900,
                fontSize: size,
                lineHeight: 1.02,
                color: accent.includes(i) ? fx.orange : fx.white,
                opacity: Math.min(1, s * 1.6),
                transform: `translateY(${interpolate(s, [0, 1], [50, 0])}px) scale(${interpolate(s, [0, 1], [0.85, 1])})`,
                transformOrigin: "left bottom",
                textShadow: `0 8px 0 ${fx.outline}`,
                whiteSpace: "nowrap",
              }}
            >
              {l}
            </div>
          );
        })}
      </div>
      {sub && (
        <div style={{ fontFamily: WIDE, fontWeight: 700, fontSize: 34, color: fx.white, opacity: 0.85 * sp(age - 0.3, fps), marginTop: 18 }}>{sub}</div>
      )}
    </div>
  );
};

/* ------------------------------------------------------------ HUD */

export const Pill: React.FC<{ label: string; value: string; tone?: "plain" | "hero" | "bad"; pop?: number; style?: React.CSSProperties }> = ({ label, value, tone = "plain", pop = 0, style }) => {
  const filled = tone !== "plain";
  return (
    <div
      style={{
        display: "inline-flex",
        flexDirection: "column",
        justifyContent: "center",
        height: 96,
        padding: "0 28px",
        borderRadius: 22,
        background: tone === "hero" ? fx.orange : tone === "bad" ? fx.red : fx.paper,
        border: `4px solid ${fx.outline}`,
        boxShadow: `0 10px 0 ${fx.outline}`,
        lineHeight: 1,
        transform: `scale(${1 + pop * 0.14})`,
        transformOrigin: "left center",
        ...style,
      }}
    >
      <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 18, letterSpacing: "0.16em", color: filled ? fx.white : fx.purple }}>{label}</span>
      <span style={{ fontFamily: WIDE, fontWeight: 900, fontSize: 40, marginTop: 8, color: filled ? fx.white : fx.ink, whiteSpace: "nowrap" }}>{value}</span>
    </div>
  );
};

/** Pops a pill in at `age` (bouncy scale + rise + fade). */
export const PopIn: React.FC<{ age: number; fps: number; children: React.ReactNode; style?: React.CSSProperties; from?: number; rot?: number }> = ({ age, fps, children, style, from = 0.4, rot = 0 }) => {
  if (age < 0) return null;
  const s = sp(age, fps, "bouncy");
  return (
    <div style={{ position: "absolute", opacity: Math.min(1, s * 2), transform: `translateY(${interpolate(s, [0, 1], [40, 0])}px) scale(${interpolate(s, [0, 1], [from, 1])}) rotate(${rot}deg)`, ...style }}>
      {children}
    </div>
  );
};

/** A paper sheet (bill, application, ticket) with an orange header band. */
export const Paper: React.FC<{ head: string; children: React.ReactNode; width?: number }> = ({ head, children, width = 470 }) => (
  <div style={{ width, background: fx.paper, border: `4px solid ${fx.outline}`, borderRadius: 18, boxShadow: `0 14px 0 ${fx.outline}`, overflow: "hidden" }}>
    <div style={{ background: fx.purple, color: fx.white, fontFamily: MONO, fontWeight: 700, fontSize: 22, letterSpacing: "0.16em", padding: "14px 24px", borderBottom: `4px solid ${fx.orange}` }}>{head}</div>
    <div style={{ padding: "18px 24px 22px" }}>{children}</div>
  </div>
);

/** A rubber stamp slammed onto whatever is under it. */
export const Slam: React.FC<{ age: number; fps: number; text: string; tone?: "bad" | "hero"; size?: number; rot?: number; style?: React.CSSProperties }> = ({ age, fps, text, tone = "bad", size = 84, rot = -9, style }) => {
  if (age < 0) return null;
  const s = sp(age, fps, "snappy");
  const c = tone === "bad" ? fx.red : fx.orange;
  return (
    <div
      style={{
        position: "absolute",
        padding: `${size * 0.1}px ${size * 0.28}px`,
        border: `${size * 0.09}px solid ${c}`,
        borderRadius: 14,
        color: c,
        fontFamily: WIDE,
        fontWeight: 900,
        fontSize: size,
        lineHeight: 1,
        whiteSpace: "nowrap",
        background: "rgba(255,255,255,0.92)",
        opacity: Math.min(1, s * 1.8),
        transform: `rotate(${rot}deg) scale(${interpolate(s, [0, 1], [2.6, 1])})`,
        boxShadow: `0 10px 0 ${fx.outline}`,
        ...style,
      }}
    >
      {text}
    </div>
  );
};

/** Floating game pop: «+$5 000» / «−$7 000», rises and fades. */
export const MoneyPop: React.FC<{ x: number; y: number; age: number; fps: number; text: string; bad?: boolean; len?: number; size?: number }> = ({ x, y, age, fps, text, bad = false, len = 1.1, size = 76 }) => {
  if (age < 0 || age > len) return null;
  const s = sp(age, fps, "bouncy");
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y - age * 70,
        transform: `translate(-50%, -50%) scale(${interpolate(s, [0, 1], [0.3, 1])}) rotate(-5deg)`,
        opacity: out(age, len, 0.3),
        fontFamily: WIDE,
        fontWeight: 900,
        fontSize: size,
        color: bad ? fx.red : fx.orange,
        WebkitTextStroke: `8px ${fx.outline}`,
        paintOrder: "stroke fill",
        textShadow: `0 7px 0 ${fx.outline}`,
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </div>
  );
};

/** The fuel bar: how much of the $24 000 bill the bankroll covers. */
export const FuelBar: React.FC<{ bank: number; need: number; t: number; hit: number; bad: boolean }> = ({ bank, need, t, hit, bad }) => {
  const k = Math.min(1, bank / need);
  const over = bank >= need;
  const W = 860;
  return (
    <div style={{ position: "absolute", left: X0, top: 420, width: W }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", fontFamily: MONO, fontWeight: 700, fontSize: 24, letterSpacing: "0.14em", color: fx.white }}>
        <span>НА ТОПЛИВО</span>
        <span style={{ color: over ? fx.orange : fx.grey }}>{over ? "ХВАТАЕТ!" : `НУЖНО ${usd(need)}`}</span>
      </div>
      <div style={{ position: "relative", marginTop: 12, height: 74, borderRadius: 37, background: fx.purpleLo, border: `4px solid ${fx.outline}`, overflow: "hidden", boxShadow: `0 10px 0 ${fx.outline}`, transform: `translateX(${bad ? Math.sin(t * 60) * 10 * hit : 0}px) scale(${1 + hit * 0.04})` }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: `${k * 100}%`,
            background: bad && hit > 0.2 ? fx.red : fx.orange,
            backgroundImage: `repeating-linear-gradient(115deg, rgba(255,255,255,0.0) 0 22px, rgba(255,255,255,0.16) 22px 44px)`,
            backgroundPosition: `${t * 120}px 0`,
          }}
        />
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", paddingLeft: 26, fontFamily: WIDE, fontWeight: 900, fontSize: 40, color: fx.white, textShadow: `0 4px 0 ${fx.outline}` }}>{usd(bank)}</div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------ finale */

const Pointer: React.FC<{ x: number; y: number; pressed: boolean }> = ({ x, y, pressed }) => (
  <svg viewBox="0 0 40 52" width={58} height={76} style={{ position: "absolute", left: x - 10, top: y - 4, transform: `scale(${pressed ? 0.88 : 1})`, filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.6))" }}>
    <path d="M14 4 Q14 0 18 0 Q22 0 22 4 L22 22 L30 23 Q38 25 37 33 L35 44 Q34 50 28 50 L16 50 Q12 50 9 46 L2 34 Q0 30 4 28 Q7 27 10 30 L14 34 Z" fill={fx.white} stroke={fx.outline} strokeWidth={2.5} strokeLinejoin="round" />
  </svg>
);

/** Subscribe (pressed → «ВЫ ПОДПИСАНЫ», bell rings), like, comment bubble. */
export const Subscribe: React.FC<{ t: number; at: number; tapAt: number; fps: number; top: number; ask: string }> = ({ t, at, tapAt, fps, top, ask }) => {
  const age = t - at;
  if (age < 0) return null;
  const row = sp(age, fps);
  const subbed = t > tapAt;
  const tap = t - tapAt;
  const ring = subbed ? Math.sin(tap * 22) * interpolate(tap, [0, 0.9], [24, 0], clamp) : 0;
  const likeAt = tapAt + 0.55;
  const liked = t > likeAt;
  const likeHit = sp(t - likeAt, fps, "bouncy");
  const point = interpolate(t, [tapAt - 0.6, tapAt - 0.05], [0, 1], { easing: theme.ease.out, ...clamp });
  const bubble = sp(age - 0.35, fps, "bouncy");
  const pill: React.CSSProperties = { position: "relative", display: "inline-flex", alignItems: "center", gap: 14, height: 100, padding: "0 34px", borderRadius: 50, fontFamily: MONO, fontWeight: 800, fontSize: 34, letterSpacing: "0.05em", whiteSpace: "nowrap", border: `4px solid ${fx.outline}`, boxShadow: `0 10px 0 ${fx.outline}` };
  return (
    <div style={{ position: "absolute", left: X0, top }}>
      <div style={{ display: "flex", gap: 16, alignItems: "center", opacity: row, transform: `translateY(${interpolate(row, [0, 1], [60, 0])}px)` }}>
        <div style={{ ...pill, background: subbed ? fx.purpleLo : fx.red, color: fx.white, transform: `scale(${tap > -0.1 && tap < 0.12 ? 0.9 : 1 + (subbed ? 0 : Math.sin(t * 8) * 0.025)})` }}>
          {subbed ? "ВЫ ПОДПИСАНЫ" : "ПОДПИСАТЬСЯ"}
          <svg viewBox="0 0 24 24" width={42} height={42} style={{ transform: `rotate(${ring}deg)`, transformOrigin: "50% 15%" }}>
            <path d="M12 2a6 6 0 0 0-6 6v4l-2 3v1h16v-1l-2-3V8a6 6 0 0 0-6-6zm-2 17a2 2 0 0 0 4 0" fill={fx.white} />
          </svg>
          {!subbed && point > 0 && <Pointer x={170 + (1 - point) * 140} y={56 + (1 - point) * 140} pressed={tap > -0.1} />}
        </div>
        <div style={{ ...pill, padding: "0 28px", background: liked ? fx.orange : fx.paper, color: fx.ink, transform: `scale(${liked ? 1 + (1 - likeHit) * 0.35 : 1})` }}>
          <svg viewBox="0 0 24 24" width={44} height={44}>
            <path d="M2 10h4v11H2zM7 10l4.2-7.6c.4-.7 1.3-.9 1.9-.4.5.4.7 1 .6 1.6L13 9h6.3c1.3 0 2.3 1.2 2 2.5l-1.6 7.4A2.5 2.5 0 0 1 17.3 21H7z" fill={liked ? fx.white : "none"} stroke={liked ? fx.white : fx.ink} strokeWidth={1.6} strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      <div style={{ marginTop: 26, opacity: Math.min(1, bubble * 1.5), transform: `translateY(${Math.sin(t * 4) * 3}px) scale(${interpolate(bubble, [0, 1], [0.5, 1])})`, transformOrigin: "left top" }}>
        <div style={{ ...pill, height: 84, fontSize: 30, background: fx.paper, color: fx.purple, borderRadius: "42px 42px 42px 8px" }}>
          <svg viewBox="0 0 24 24" width={34} height={34}><path d="M4 4h16v12H8l-4 4z" fill="none" stroke={fx.purple} strokeWidth={2.4} strokeLinejoin="round" /></svg>
          {ask}
        </div>
      </div>
    </div>
  );
};
