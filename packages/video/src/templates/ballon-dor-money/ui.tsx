// ВЫПУСК 22 kit: the TikTok kit of ВЫПУСК 21 (which re-exports the series kit),
// plus the episode's object: the golden ball with its climbing price tag, a
// paper ticket stub, a share ring and a two-bar rise.
import React from "react";
import { Img, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../theme";
import { useIn } from "../../reel";
import { bdColors as colors, bdPalette as palette } from "./palette";
import { Label, Slam, clamp, media } from "../serbia-economy/ui";

export * from "../serbia-economy/ui";

export const WIDE = `${theme.fonts.wide}, ${theme.fonts.mono}`;
// a round crop of the 2008 trophy photo: the whole sphere, no flat base edge (author note 2)
export const BALL = { src: "images/ballon-dor-money/ball.png", ratio: 1 };

/**
 * The object of the episode. A slow turn (squash on X), a breath, a sheen
 * sweep and a halo; `at` drops it in with a bounce.
 */
export const GoldBall: React.FC<{ x: number; y: number; w: number; at?: number; z?: number; halo?: boolean }> = ({ x, y, w, at = -30, z = 4, halo = true }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - at, fps, config: theme.spring.bouncy });
  if (frame < at) return null;
  const turn = 1 - Math.abs(Math.sin(frame / 38)) * 0.06;
  const breathe = 1 + Math.sin(frame / 14) * 0.015;
  const sheen = ((frame * 9) % 900) - 300;
  const h = w / BALL.ratio;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, zIndex: z, opacity: Math.min(1, p * 1.5), transform: `translateY(${interpolate(p, [0, 1], [-300, 0])}px) scale(${interpolate(p, [0, 1], [0.6, 1]) * breathe}) rotate(${Math.sin(frame / 30) * 3}deg)` }}>
      {halo && (
        <div style={{ position: "absolute", left: -w * 0.25, top: -w * 0.1, width: w * 1.5, height: w * 1.5, borderRadius: "50%", background: `radial-gradient(circle, ${palette.glow} 0%, transparent 62%)`, opacity: 0.8 + Math.sin(frame / 9) * 0.2 }} />
      )}
      <div style={{ position: "absolute", inset: 0, transform: `scaleX(${turn})`, WebkitMaskImage: `url(${media(BALL.src)})`, WebkitMaskSize: "100% 100%", filter: "drop-shadow(0 40px 50px rgba(0,0,0,0.75))" }}>
        <Img src={media(BALL.src)} style={{ width: "100%", height: "100%", display: "block", filter: "saturate(1.15) contrast(1.08)" }} />
        <div style={{ position: "absolute", top: 0, bottom: 0, left: (sheen / 600) * w, width: w * 0.22, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)", transform: "skewX(-18deg)", mixBlendMode: "overlay" }} />
      </div>
    </div>
  );
};

/** The price tag: «ЦЕНА ЗОЛОТОГО МЯЧА» eyebrow, the slammed figure, what it is. */
export const PriceTag: React.FC<{ at: number; text: string; size?: number; label: string; tone?: "hero" | "bad"; roll?: { from: number; to: number; prefix?: string; suffix?: string }; eyebrow?: string }> = ({ at, text, size = 150, label, tone = "hero", roll, eyebrow = "ЦЕНА ВОКРУГ МЯЧА" }) => {
  const p = useIn(at - 4, "snappy");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, alignItems: "flex-start" }}>
      <div style={{ padding: "6px 14px", background: tone === "bad" ? colors.bad : palette.primary, color: tone === "bad" ? colors.white : colors.ink2, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 24, letterSpacing: "0.14em", opacity: p, transform: `translateY(${interpolate(p, [0, 1], [20, 0])}px) rotate(-2deg)` }}>{eyebrow}</div>
      <Slam text={text} at={at} size={size} color={tone === "bad" ? colors.bad : palette.primary} roll={roll} />
      <Label at={at + 6} size={24}>{label}</Label>
    </div>
  );
};

/** A paper ticket stub with a perforation and the price printed on it. */
export const TicketStub: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - at, fps, config: theme.spring.bouncy });
  if (frame < at) return null;
  const tilt = interpolate(p, [0, 1], [-30, -6]) + Math.sin(frame / 18) * 1.5;
  return (
    <div style={{ width: 620, display: "flex", background: colors.paper, color: colors.ink, boxShadow: colors.paperShadow, opacity: Math.min(1, p * 1.4), transform: `translateX(${interpolate(p, [0, 1], [-700, 0])}px) rotate(${tilt}deg)` }}>
      <div style={{ flex: 1, padding: "24px 26px", display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 20, letterSpacing: "0.16em", color: colors.inkFaded }}>BALLON D'OR · 70-Я ЦЕРЕМОНИЯ</div>
        <div style={{ fontFamily: WIDE, fontWeight: 900, fontSize: 40, lineHeight: 1.05 }}>LONDON PALLADIUM</div>
        <div style={{ fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: 22, color: colors.ink }}>26.10.2026 · 20:00 · HOSPITALITY</div>
      </div>
      <div style={{ width: 0, borderLeft: `4px dashed ${colors.inkFaded}`, margin: "14px 0" }} />
      <div style={{ width: 170, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: WIDE, fontWeight: 900, fontSize: 40, transform: "rotate(-90deg)", whiteSpace: "nowrap" }}>£3 000</div>
    </div>
  );
};

/** A share ring filling around its number. */
export const Ring: React.FC<{ at: number; pct: number; size: number; prefix?: string }> = ({ at, pct, size, prefix = "" }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - at, [0, 22], [0, 1], { easing: theme.ease.out, ...clamp });
  const r = size / 2 - 22;
  const c = 2 * Math.PI * r;
  return (
    <div style={{ position: "relative", width: size, height: size, opacity: interpolate(frame - at, [0, 5], [0, 1], clamp), transform: `scale(${interpolate(frame - at, [0, 10], [0.6, 1], { easing: theme.ease.out, ...clamp })}) rotate(${Math.sin(frame / 30) * 3}deg)` }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill={colors.surface} stroke={colors.lineStrong} strokeWidth={34} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={palette.primary} strokeWidth={34} strokeDasharray={c} strokeDashoffset={c * (1 - (pct / 100) * p)} style={{ filter: `drop-shadow(0 0 16px ${palette.glow})` }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: WIDE, fontWeight: 900, color: palette.primary }}>
        {prefix && <span style={{ fontSize: size * 0.09, fontFamily: theme.fonts.mono, letterSpacing: "0.1em", color: palette.text }}>{prefix}</span>}
        <span style={{ fontSize: size * 0.22 }}>{Math.round(pct * p)}%</span>
      </div>
    </div>
  );
};

/** Before / after bars of a market value, € millions. */
export const Rise: React.FC<{ at: number; from: number; to: number; max: number; labels: [string, string] }> = ({ at, from, to, max, labels }) => {
  const frame = useCurrentFrame();
  const rows = [
    { name: labels[0], v: from, color: colors.surfaceLift, ink: palette.text },
    { name: labels[1], v: to, color: palette.primary, ink: colors.ink2 },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 520 }}>
      {rows.map((r, i) => {
        const p = interpolate(frame - at - i * 8, [0, 18], [0, 1], { easing: theme.ease.out, ...clamp });
        return (
          <div key={r.name} style={{ height: 66, width: `${(r.v / max) * 100 * p}%`, minWidth: p > 0 ? 60 : 0, background: r.color, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 18px", fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 24, color: r.ink, whiteSpace: "nowrap", overflow: "hidden", boxShadow: i === 1 ? `0 0 30px ${palette.glow}` : "none" }}>
            <span>{r.name}</span>
            <span style={{ fontFamily: WIDE, fontWeight: 900, fontSize: 30 }}>{Math.round(r.v * p)} МЛН €</span>
          </div>
        );
      })}
    </div>
  );
};

/** A small sponsor-category chip that pops in. */
export const Pill: React.FC<{ at: number; children: React.ReactNode; rot?: number }> = ({ at, children, rot = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - at, fps, config: theme.spring.bouncy });
  if (frame < at) return null;
  return (
    <div style={{ padding: "10px 18px", border: `3px solid ${palette.primary}`, background: colors.surface, color: palette.text, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 26, letterSpacing: "0.08em", opacity: p, transform: `scale(${interpolate(p, [0, 1], [0.3, 1])}) rotate(${rot + Math.sin(frame / 15 + rot) * 2}deg)` }}>
      {children}
    </div>
  );
};
