// HUD, game pop-ups and the code editor for the shawarma reel. The street
// itself lives in toon.tsx; this file is everything drawn on top of it.
import React from "react";
import { interpolate, spring, useVideoConfig } from "remotion";
import { theme } from "../../theme";
import { sfColors as colors, sfPalette as palette, toon } from "./palette";
import { CODE } from "./code";

export * from "../digital-ruble/ui";

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const WIDE = `${theme.fonts.wide}, ${theme.fonts.mono}`;
export const X0 = 110;
export const X1 = 970;
export const SPLIT = 1180; // street above, code below

export const fmt = (n: number) => Math.round(n).toLocaleString("ru-RU").replace(/ /g, " ");

/** Spring from a moment in seconds, read at time t (seconds). */
export const springAt = (t: number, at: number, fps: number, cfg: keyof typeof theme.spring = "snappy") =>
  t < at ? 0 : spring({ frame: (t - at) * fps, fps, config: theme.spring[cfg] });

/* ------------------------------------------------------------- HUD */

export const Coin: React.FC<{ size?: number }> = ({ size = 44 }) => (
  <svg viewBox="0 0 44 44" width={size} height={size}>
    <circle cx={22} cy={22} r={19} fill={palette.primary} stroke={colors.ink2} strokeWidth={3} />
    <circle cx={22} cy={22} r={13} fill="none" stroke={colors.ink2} strokeWidth={2} opacity={0.35} />
    <text x={22} y={30} textAnchor="middle" fontFamily={theme.fonts.mono} fontWeight={800} fontSize={22} fill={colors.ink2}>₽</text>
  </svg>
);

const pillBase: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  height: 72,
  padding: "0 24px 0 14px",
  borderRadius: 40,
  background: "rgba(6, 8, 10, 0.78)",
  border: `2px solid ${colors.lineStrong}`,
  boxShadow: "0 14px 30px -12px rgba(0,0,0,0.8)",
};

export const HudPill: React.FC<{ icon: React.ReactNode; label: string; value: string; pop?: number; hero?: boolean; alarm?: boolean }> = ({ icon, label, value, pop = 0, hero = false, alarm = false }) => (
  <div style={{ ...pillBase, borderColor: alarm ? colors.bad : hero ? palette.primary : colors.lineStrong, background: alarm ? colors.bad : pillBase.background, transform: `scale(${1 + pop * 0.12})` }}>
    {icon}
    <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
      <span style={{ fontFamily: theme.fonts.mono, fontSize: 15, letterSpacing: "0.16em", color: alarm ? colors.white : palette.textDim }}>{label}</span>
      <span style={{ fontFamily: WIDE, fontWeight: 800, fontSize: 32, color: hero ? palette.primary : palette.text, marginTop: 4, textShadow: hero && pop > 0.05 ? `0 0 18px ${palette.glow}` : undefined }}>{value}</span>
    </div>
  </div>
);

export const PersonIcon: React.FC<{ size?: number }> = ({ size = 40 }) => (
  <svg viewBox="0 0 40 40" width={size} height={size}>
    <circle cx={14} cy={12} r={7} fill={palette.text} />
    <path d="M3 34 Q3 21 14 21 Q25 21 25 34 Z" fill={palette.text} />
    <circle cx={28} cy={14} r={6} fill={palette.textDim} />
    <path d="M22 34 Q22 23 28 23 Q38 23 38 34 Z" fill={palette.textDim} />
  </svg>
);

export const WrapIcon: React.FC<{ size?: number }> = ({ size = 40 }) => (
  <svg viewBox="0 0 40 40" width={size} height={size}>
    <path d="M13 6 Q20 1 27 6 L29 34 Q20 39 11 34 Z" fill={toon.lavash} stroke={colors.ink2} strokeWidth={2.4} />
    <path d="M11 22 L29 22 L29 34 Q20 39 11 34 Z" fill={colors.paper} stroke={colors.ink2} strokeWidth={2.4} />
    <path d="M14 8 Q20 13 26 8" stroke={toon.meatHi} strokeWidth={4} fill="none" />
  </svg>
);

/* ------------------------------------------------------- pop-ups */

/** «+500 ₽» rising from the counter, game style: outlined, overshoot, fade up. */
export const PayPop: React.FC<{ x: number; y: number; age: number; amount: number }> = ({ x, y, age, amount }) => {
  const { fps } = useVideoConfig();
  if (age < 0 || age > 1.25) return null;
  const s = spring({ frame: age * fps, fps, config: theme.spring.bouncy });
  const rise = interpolate(age, [0, 1.25], [0, -120], { easing: theme.ease.out, ...clamp });
  const fade = interpolate(age, [0.85, 1.25], [1, 0], { easing: theme.ease.in, ...clamp });
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y + rise,
        transform: `translate(-50%, -50%) scale(${interpolate(s, [0, 1], [0.3, 1])}) rotate(${interpolate(s, [0, 1], [-12, -4])}deg)`,
        opacity: fade,
        fontFamily: WIDE,
        fontWeight: 900,
        fontSize: 78,
        color: palette.primary,
        WebkitTextStroke: `7px ${colors.ink2}`,
        paintOrder: "stroke fill",
        textShadow: `0 8px 0 ${colors.ink2}, 0 0 34px ${palette.glow}`,
        whiteSpace: "nowrap",
        letterSpacing: "-0.02em",
      }}
    >
      +{fmt(amount)} <span style={{ fontFamily: theme.fonts.mono, fontWeight: 800 }}>₽</span>
    </div>
  );
};

/** Coins arc from the counter into the cash pill. */
export const CoinFly: React.FC<{ from: [number, number]; to: [number, number]; age: number; n?: number }> = ({ from, to, age, n = 4 }) => (
  <>
    {Array.from({ length: n }, (_, i) => {
      const k = interpolate(age - i * 0.06, [0.1, 0.75], [0, 1], { easing: theme.ease.inOut, ...clamp });
      if (k <= 0 || k >= 1) return null;
      const x = interpolate(k, [0, 1], [from[0] + (i - 1.5) * 18, to[0]]);
      const y = interpolate(k, [0, 1], [from[1], to[1]]) - Math.sin(k * Math.PI) * 180;
      return (
        <div key={i} style={{ position: "absolute", left: x - 18, top: y - 18, transform: `rotate(${k * 540}deg) scale(${1 - k * 0.35})` }}>
          <Coin size={36} />
        </div>
      );
    })}
  </>
);

/* ---------------------------------------------------------- editor */

const KEYWORDS = /^(export|const|let|for|if|return|type|import|from|null|true|false)$/;

/** Minimal TS colouring: comments dim, strings paper, numbers paper, keywords mint, the rest text. */
const colorize = (line: string): React.ReactNode[] => {
  const out: React.ReactNode[] = [];
  const ci = line.indexOf("//");
  const code = ci >= 0 ? line.slice(0, ci) : line;
  const re = /("[^"]*"|`[^`]*`|\b\d[\d_.]*\b|\b[A-Za-z_]\w*\b|\s+|.)/g;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(code))) {
    const tok = m[0];
    let color: string = palette.text;
    if (/^["`]/.test(tok)) color = colors.paper;
    else if (/^\d/.test(tok)) color = toon.codeNum;
    else if (KEYWORDS.test(tok)) color = palette.accent;
    else if (/^[A-Z][A-Z0-9_]+$/.test(tok)) color = colors.paper;
    else if (/^[^\w\s]$/.test(tok)) color = palette.textDim;
    out.push(<span key={k++} style={{ color }}>{tok}</span>);
  }
  if (ci >= 0) out.push(<span key={k++} style={{ color: palette.textDim, fontStyle: "italic" }}>{line.slice(ci)}</span>);
  return out;
};

const TOTAL = CODE.reduce((n, l) => n + l.length + 1, 0);

/**
 * The editor under the street: `typed` characters of the real sim source are
 * on screen, the newest line glows, the view scrolls to keep it in sight.
 */
export const Editor: React.FC<{ typed: number; t: number; top: number; height: number; label: string }> = ({ typed, t, top, height, label }) => {
  const LH = 37;
  const rows = Math.floor((height - 96) / LH);
  let left = Math.min(typed, TOTAL);
  const lines: { text: string; done: boolean }[] = [];
  for (const l of CODE) {
    if (left <= 0) break;
    const n = Math.min(l.length, left);
    lines.push({ text: l.slice(0, n), done: n === l.length && left > l.length });
    left -= l.length + 1;
  }
  const cur = lines.length - 1;
  const first = Math.max(0, cur - rows + 3);
  const shown = lines.slice(first, first + rows);
  const blink = Math.sin(t * 9) > -0.2;
  return (
    <div style={{ position: "absolute", left: 0, top, width: 1080, height, background: toon.editor, borderTop: `2px solid ${colors.lineStrong}` }}>
      {/* tab bar */}
      <div style={{ height: 64, display: "flex", alignItems: "center", padding: `0 ${1080 - X1}px 0 ${X0 - 40}px`, background: toon.editorBar, borderBottom: `1px solid ${colors.line}`, gap: 14 }}>
        {[colors.bad, colors.paperShade, palette.primary].map((c, i) => <div key={i} style={{ width: 16, height: 16, borderRadius: 8, background: c, opacity: 0.8 }} />)}
        <div style={{ marginLeft: 18, padding: "10px 18px", background: toon.editor, borderRadius: "10px 10px 0 0", fontFamily: theme.fonts.mono, fontSize: 22, color: palette.text, marginTop: 14 }}>shawarma.ts</div>
        <div style={{ flex: 1 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: theme.fonts.mono, fontSize: 20, letterSpacing: "0.1em", color: palette.primary }}>
          <div style={{ width: 12, height: 12, borderRadius: 6, background: palette.primary, opacity: blink ? 1 : 0.25, boxShadow: `0 0 12px ${palette.glow}` }} />
          {label}
        </div>
      </div>
      {/* code */}
      <div style={{ position: "absolute", top: 82, left: 0, right: 0 }}>
        {shown.map((l, i) => {
          const n = first + i;
          const isCur = n === cur;
          return (
            <div key={n} style={{ height: LH, display: "flex", alignItems: "center", background: isCur ? "rgba(205,255,59,0.07)" : undefined, borderLeft: isCur ? `4px solid ${palette.primary}` : "4px solid transparent" }}>
              <span style={{ width: X0 - 26, textAlign: "right", paddingRight: 22, fontFamily: theme.fonts.mono, fontSize: 19, color: isCur ? palette.primary : "rgba(138,145,140,0.5)" }}>{n + 1}</span>
              <span style={{ fontFamily: theme.fonts.mono, fontSize: 23, whiteSpace: "pre", maxWidth: 1080 - X0 - 20, overflow: "hidden" }}>
                {colorize(l.text)}
                {isCur && <span style={{ display: "inline-block", width: 13, height: 28, marginLeft: 2, verticalAlign: "middle", background: palette.primary, opacity: blink ? 1 : 0 }} />}
              </span>
            </div>
          );
        })}
      </div>
      {/* fade toward the platform caption zone */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 200, background: `linear-gradient(180deg, rgba(8,11,15,0), ${toon.editor} 85%)` }} />
    </div>
  );
};

export const CODE_TOTAL = TOTAL;
export { CODE };
