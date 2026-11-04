// Primitives of the night-sky chart: sky, axes, trails, heads, tags, stars,
// legend cells. The series kit is re-exported for Stamp / Flash / rnd.
import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../theme";
import { rnd } from "../digital-ruble/ui";
import { fwColors, fourWalletsPalette } from "./palette";
import { Hero } from "./data";
import { AGE_FROM, AGE_TO } from "./timeline";

export * from "../digital-ruble/ui";

/* ------------------------------------------------------------ geometry */

export const CH = { left: 200, right: 985, top: 560, bottom: 1330 } as const;
const G_MAX = Math.sqrt(75);
const G_MIN = -Math.sqrt(3);
/** Square-root money scale: a 2 млн life and a 70 млн life both stay readable. */
const g = (v: number) => Math.sign(v) * Math.sqrt(Math.abs(v));
export const yOf = (v: number) => CH.bottom - ((g(v) - G_MIN) / (G_MAX - G_MIN)) * (CH.bottom - CH.top);
export const xOf = (age: number) => CH.left + ((age - AGE_FROM) / (AGE_TO - AGE_FROM)) * (CH.right - CH.left);

/** Lanes keep lives that share a value (three zeros at 18) apart, as parallel strands. */
const LANE: Record<Hero["key"], number> = { worker: 21, business: 7, wife: -7, major: -21 };

export const valueAt = (h: Hero, age: number) => {
  const k = h.keys;
  if (age <= k[0][0]) return k[0][1];
  for (let i = 0; i < k.length - 1; i += 1) {
    const [a0, v0] = k[i];
    const [a1, v1] = k[i + 1];
    if (age <= a1) return interpolate(age, [a0, a1], [v0, v1], { easing: theme.ease.inOut });
  }
  return k[k.length - 1][1];
};

export const pointAt = (h: Hero, age: number) => {
  const wobble = Math.sin(age * 1.7 + h.phase) * 5 * Math.min(1, (age - AGE_FROM) / 1.5);
  return { x: xOf(age), y: yOf(valueAt(h, age)) + LANE[h.key] + wobble };
};

/* ---------------------------------------------------------------- text */

/** Unbounded has no ₽ − →: those glyphs fall to mono, everything else stays wide. */
export const Txt: React.FC<{ children: string }> = ({ children }) => (
  <>
    {children.split(/([₽−→])/).map((part, i) =>
      /^[₽−→]$/.test(part) ? (
        <span key={i} style={{ fontFamily: theme.fonts.mono, fontWeight: 800 }}>
          {part}
        </span>
      ) : (
        <React.Fragment key={i}>{part}</React.Fragment>
      ),
    )}
  </>
);

export const money = (v: number) => {
  const a = Math.abs(v);
  if (a < 0.05) return "0 ₽";
  const sign = v < 0 ? "−" : "";
  if (a < 1) return `${sign}${Math.round(a * 100) * 10} ТЫС ₽`;
  if (a < 10) return `${sign}${a.toFixed(1).replace(".", ",").replace(",0", "")} МЛН ₽`;
  return `${sign}${Math.round(a)} МЛН ₽`;
};

export const yearsWord = (n: number) => {
  const d = n % 10;
  const dd = n % 100;
  if (d === 1 && dd !== 11) return "ГОД";
  if (d >= 2 && d <= 4 && (dd < 12 || dd > 14)) return "ГОДА";
  return "ЛЕТ";
};

/* ---------------------------------------------------------------- motion */

export const useT = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return { t: frame / fps, frame, fps };
};

/** Spring that starts at second `at`. */
export const usePop = (at: number, cfg: keyof typeof theme.spring = "snappy") => {
  const { frame, fps } = useT();
  return spring({ frame: frame - Math.round(at * fps), fps, config: theme.spring[cfg] });
};

/** 1 → 0 over `len` seconds before `end`, eased in: exits are faster than entrances. */
export const exitOf = (t: number, end: number, len = 0.3) =>
  interpolate(t, [end - len, end], [1, 0], { easing: theme.ease.in, extrapolateLeft: "clamp", extrapolateRight: "clamp" });

/* ----------------------------------------------------------------- sky */

const STARS = Array.from({ length: 190 }, (_, i) => ({
  x: rnd(i + 1) * 1080,
  y: rnd(i + 101) * 1920,
  r: 0.6 + rnd(i + 201) ** 3 * 2.4,
  tw: 0.6 + rnd(i + 301) * 2.2,
  ph: rnd(i + 401) * 6.28,
}));

export const Sky: React.FC = () => {
  const { t } = useT();
  const drift = t * 3;
  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${fwColors.skyTop} 0%, ${fwColors.skyMid} 45%, ${fwColors.skyBottom} 100%)` }}>
      <div
        style={{
          position: "absolute",
          left: 120 + Math.sin(t / 5) * 40,
          top: 380,
          width: 900,
          height: 700,
          borderRadius: "50%",
          background: `radial-gradient(closest-side, ${fwColors.nebulaA}, transparent)`,
          filter: "blur(30px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: -260 + Math.cos(t / 6) * 50,
          top: 60,
          width: 900,
          height: 620,
          borderRadius: "50%",
          background: `radial-gradient(closest-side, ${fwColors.nebulaB}, transparent)`,
          filter: "blur(40px)",
        }}
      />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {STARS.map((s, i) => (
          <circle
            key={i}
            cx={s.x}
            cy={(s.y - drift * (0.4 + s.r / 3) + 1920) % 1920}
            r={s.r}
            fill={fwColors.star}
            opacity={0.25 + 0.55 * (0.5 + 0.5 * Math.sin(t * s.tw + s.ph)) * Math.min(1, s.r / 1.6)}
          />
        ))}
      </svg>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------------- axes */

const GRID = [70, 40, 20, 10, 5, 1, 0, -2];

export const Axes: React.FC<{ show: number }> = ({ show }) => (
  <AbsoluteFill style={{ opacity: show }}>
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      {GRID.map((v) => (
        <line
          key={v}
          x1={CH.left}
          x2={CH.right}
          y1={yOf(v)}
          y2={yOf(v)}
          stroke={v === 0 ? fwColors.gridZero : fwColors.grid}
          strokeWidth={v === 0 ? 2 : 1.5}
          strokeDasharray={v === 0 ? undefined : "3 9"}
        />
      ))}
      {[20, 30, 40, 50, 60].map((a) => (
        <line key={a} x1={xOf(a)} x2={xOf(a)} y1={CH.bottom + 6} y2={CH.bottom + 16} stroke={fwColors.gridZero} strokeWidth={2} />
      ))}
    </svg>
    {GRID.map((v) => (
      <div
        key={v}
        style={{
          position: "absolute",
          right: 1080 - CH.left + 16,
          top: yOf(v) - 13,
          fontFamily: theme.fonts.mono,
          fontSize: 21,
          fontWeight: 600,
          color: fwColors.axisText,
          whiteSpace: "nowrap",
        }}
      >
        {v === 0 ? "0" : `${v < 0 ? "−" : ""}${Math.abs(v)} МЛН`}
      </div>
    ))}
    {[20, 30, 40, 50, 60].map((a) => (
      <div
        key={a}
        style={{
          position: "absolute",
          left: xOf(a) - 60,
          width: 120,
          top: CH.bottom + 22,
          textAlign: "center",
          fontFamily: theme.fonts.mono,
          fontSize: 22,
          fontWeight: 600,
          color: fwColors.axisText,
        }}
      >
        {a === 20 ? "20 ЛЕТ" : a}
      </div>
    ))}
  </AbsoluteFill>
);

/* --------------------------------------------------------------- trail */

export const Trail: React.FC<{ hero: Hero; age: number; show: number }> = ({ hero, age, show }) => {
  if (age <= AGE_FROM + 0.01 || show <= 0) return null;
  const pts: string[] = [];
  for (let a = AGE_FROM; a < age; a += 0.15) {
    const p = pointAt(hero, a);
    pts.push(`${p.x.toFixed(1)},${p.y.toFixed(1)}`);
  }
  const head = pointAt(hero, age);
  pts.push(`${head.x.toFixed(1)},${head.y.toFixed(1)}`);
  const d = `M${pts.join(" L")}`;
  const id = `fw-grad-${hero.key}`;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: show, overflow: "visible" }}>
      <defs>
        <linearGradient id={id} gradientUnits="userSpaceOnUse" x1={CH.left} y1={0} x2={Math.max(CH.left + 1, head.x)} y2={0}>
          <stop offset="0" stopColor={hero.color} stopOpacity={0.12} />
          <stop offset="0.75" stopColor={hero.color} stopOpacity={0.7} />
          <stop offset="1" stopColor={hero.color} stopOpacity={1} />
        </linearGradient>
        <filter id={`${id}-blur`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation={7} />
        </filter>
      </defs>
      <path d={d} fill="none" stroke={`url(#${id})`} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" opacity={0.45} filter={`url(#${id}-blur)`} />
      <path d={d} fill="none" stroke={`url(#${id})`} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} fill="none" stroke={fwColors.white} strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" opacity={0.35} />
    </svg>
  );
};

/** The living point of a life: white core, coloured halo, a ring on every event. */
export const Head: React.FC<{ hero: Hero; age: number; show: number; pulse: number }> = ({ hero, age, show, pulse }) => {
  const { t } = useT();
  const p = pointAt(hero, age);
  const breathe = 1 + Math.sin(t * 3 + hero.phase) * 0.08;
  return (
    <div style={{ position: "absolute", left: p.x, top: p.y, opacity: show, transform: `scale(${show})` }}>
      <div
        style={{
          position: "absolute",
          left: -34,
          top: -34,
          width: 68,
          height: 68,
          borderRadius: "50%",
          background: `radial-gradient(closest-side, ${hero.color}, transparent)`,
          opacity: 0.55,
          transform: `scale(${breathe})`,
        }}
      />
      {pulse > 0 && pulse < 1 && (
        <div
          style={{
            position: "absolute",
            left: -70 * pulse - 10,
            top: -70 * pulse - 10,
            width: 140 * pulse + 20,
            height: 140 * pulse + 20,
            borderRadius: "50%",
            border: `${Math.round(6 * (1 - pulse)) + 1}px solid ${hero.color}`,
            opacity: 1 - pulse,
          }}
        />
      )}
      <div
        style={{
          position: "absolute",
          left: -9,
          top: -9,
          width: 18,
          height: 18,
          borderRadius: "50%",
          background: fwColors.white,
          boxShadow: `0 0 18px 6px ${hero.color}`,
        }}
      />
    </div>
  );
};

/* ----------------------------------------------------------------- tag */

/** An event label pinned near the point where it happened, with a hairline to it. */
export const Tag: React.FC<{
  hero: Hero;
  title: string;
  sub: string;
  loss?: boolean;
  at: number; // second it appears
  life: number;
  anchor: { x: number; y: number };
}> = ({ hero, title, sub, loss, at, life, anchor }) => {
  const { t } = useT();
  const p = usePop(at, "snappy");
  const out = exitOf(t, at + life, 0.28);
  if (t < at - 0.02 || t > at + life) return null;
  const above = anchor.y - 200 > CH.top + 10;
  const cx = Math.min(780, Math.max(300, anchor.x));
  const boxY = above ? anchor.y - 64 : anchor.y + 64;
  const a = p * out;
  return (
    <>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: a }}>
        <line x1={anchor.x} y1={anchor.y} x2={cx} y2={boxY} stroke={hero.color} strokeWidth={2} strokeDasharray="4 5" />
      </svg>
      <div
        style={{
          position: "absolute",
          left: cx,
          top: boxY,
          transform: `translate(-50%, ${above ? "-100%" : "0"}) translateY(${interpolate(p, [0, 1], [above ? 24 : -24, 0])}px) scale(${interpolate(p, [0, 1], [0.86, 1])})`,
          opacity: a,
          padding: "14px 24px 16px",
          borderRadius: 18,
          background: fwColors.surface,
          border: `2px solid ${hero.color}`,
          boxShadow: `0 0 34px -6px ${hero.color}`,
          textAlign: "center",
          whiteSpace: "nowrap",
        }}
      >
        <div style={{ fontFamily: theme.fonts.mono, fontSize: 18, fontWeight: 700, letterSpacing: "0.12em", color: hero.color }}>
          {hero.name}
        </div>
        <div style={{ fontFamily: theme.fonts.wide, fontSize: 34, fontWeight: 800, color: fwColors.white, marginTop: 4, lineHeight: 1.1 }}>
          <Txt>{title}</Txt>
        </div>
        <div
          style={{
            fontFamily: theme.fonts.wide,
            fontSize: 25,
            fontWeight: 700,
            color: loss ? fwColors.loss : fourWalletsPalette.text,
            marginTop: 6,
            textShadow: loss ? `0 0 18px ${fwColors.lossGlow}` : undefined,
          }}
        >
          <Txt>{sub}</Txt>
        </div>
      </div>
    </>
  );
};

/* ---------------------------------------------------------------- star */

/** Four-point sparkle left where a life was richest. */
export const PeakStar: React.FC<{ hero: Hero; x: number; y: number; at: number; label: string; below?: boolean }> = ({ hero, x, y, at, label, below }) => {
  const { t } = useT();
  const p = usePop(at, "bouncy");
  if (t < at) return null;
  const tw = 1 + Math.sin(t * 2.4 + hero.phase) * 0.12;
  const s = 30 * p * tw;
  const path = `M0,${-s} C${s * 0.12},${-s * 0.12} ${s * 0.12},${-s * 0.12} ${s},0 C${s * 0.12},${s * 0.12} ${s * 0.12},${s * 0.12} 0,${s} C${-s * 0.12},${s * 0.12} ${-s * 0.12},${s * 0.12} ${-s},0 C${-s * 0.12},${-s * 0.12} ${-s * 0.12},${-s * 0.12} 0,${-s} Z`;
  return (
    <>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <g transform={`translate(${x} ${y}) rotate(${t * 12})`}>
          <path d={path} fill={hero.color} opacity={0.5} style={{ filter: "blur(6px)" }} />
          <path d={path} fill={fwColors.white} />
        </g>
      </svg>
      <div
        style={{
          position: "absolute",
          left: x,
          top: below ? y + 34 : y - 58,
          transform: `translateX(-50%) scale(${p})`,
          fontFamily: theme.fonts.mono,
          fontSize: 19,
          fontWeight: 800,
          letterSpacing: "0.08em",
          color: hero.color,
          whiteSpace: "nowrap",
          textShadow: `0 0 12px ${fwColors.skyMid}`,
        }}
      >
        {label}
      </div>
    </>
  );
};

/* -------------------------------------------------------------- legend */

export const Avatar: React.FC<{ hero: Hero; size: number }> = ({ hero, size }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      overflow: "hidden",
      flexShrink: 0,
      border: `4px solid ${hero.color}`,
      boxShadow: `0 0 22px -2px ${hero.color}`,
      background: `radial-gradient(circle at 50% 30%, ${fwColors.skyTop}, ${fwColors.skyBottom})`,
      position: "relative",
    }}
  >
    <Img src={staticFile(hero.face)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
  </div>
);

export const LegendCell: React.FC<{ hero: Hero; value: number; rank?: number; rankPop: number }> = ({ hero, value, rank, rankPop }) => (
  <div
    style={{
      width: 470,
      height: 124,
      display: "flex",
      alignItems: "center",
      gap: 18,
      padding: "0 18px",
      borderRadius: 22,
      background: fwColors.surface,
      border: `1.5px solid ${fwColors.surfaceLine}`,
      position: "relative",
    }}
  >
    <Avatar hero={hero} size={92} />
    <div style={{ minWidth: 0 }}>
      <div style={{ fontFamily: theme.fonts.mono, fontSize: 17, fontWeight: 700, letterSpacing: "0.08em", color: hero.color, whiteSpace: "nowrap" }}>
        {hero.name}
      </div>
      <div
        style={{
          fontFamily: theme.fonts.wide,
          fontSize: 38,
          fontWeight: 800,
          color: value < -0.05 ? fwColors.loss : fwColors.white,
          marginTop: 4,
          whiteSpace: "nowrap",
        }}
      >
        <Txt>{money(value)}</Txt>
      </div>
    </div>
    {rank !== undefined && rankPop > 0 && (
      <div
        style={{
          position: "absolute",
          right: 16,
          top: 16,
          width: 50,
          height: 50,
          borderRadius: "50%",
          background: hero.color,
          color: fwColors.skyBottom,
          fontFamily: theme.fonts.wide,
          fontWeight: 900,
          fontSize: 26,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${rankPop}) rotate(${interpolate(rankPop, [0, 1], [-40, 0])}deg)`,
        }}
      >
        {rank}
      </div>
    )}
  </div>
);
