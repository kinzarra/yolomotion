// Evidence that lives inside one year's frame (author's notes 6–11):
//   2014 — a torn «BLACK TUESDAY» headline + a crashing exchange panel
//   2018 — cut-out Putin with the World Cup + the Russia 2018 logo
//   2022 — SWIFT, VISA, Mastercard cards, each crossed out; reasons row
//   2025 — reasons row
// Each piece enters on its year's cut and leaves with it.
import React from "react";
import { Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from "remotion";
import { theme } from "../../../theme";
import { useIn } from "../../../reel";
import { colors, palette } from "../palette";
import { Chip, Cross } from "../ui";
import { BRAND } from "../parts";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const img = (f: string) => staticFile(`images/salary-2013/${f}`);

/** Slam-in envelope shared by every extra: scale + rotate + opacity. */
const useSlam = (at: number, from = 1.4) => {
  const p = useIn(at, "snappy");
  return {
    opacity: Math.min(1, p * 1.7),
    scale: interpolate(p, [0, 1], [from, 1]),
    p,
  };
};

/* --------------------------------------------------------------- 2014 */

const TORN = "polygon(0% 4%, 6% 0%, 14% 5%, 23% 1%, 31% 4%, 42% 0%, 53% 5%, 61% 1%, 72% 4%, 83% 0%, 92% 5%, 100% 2%, 100% 95%, 93% 100%, 84% 96%, 75% 100%, 63% 95%, 52% 100%, 41% 96%, 30% 100%, 19% 95%, 9% 100%, 0% 96%)";

const BlackTuesday: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const s = useSlam(at + 8, 1.7);
  const drift = Math.sin(frame / 22) * 1.2;
  return (
    <div
      style={{
        position: "absolute",
        left: 60,
        top: 560,
        width: 460,
        zIndex: 18,
        opacity: s.opacity,
        transform: `rotate(${-5 + drift}deg) scale(${s.scale})`,
        filter: "drop-shadow(0 22px 30px rgba(0,0,0,0.7))",
      }}
    >
      <div style={{ clipPath: TORN, background: colors.paper }}>
        <Img src={img("black-tuesday.jpg")} style={{ width: "100%", display: "block", filter: "contrast(1.15) sepia(0.15)" }} />
      </div>
    </div>
  );
};

/** Falling line drawn over a live exchange board. */
const CrashPanel: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const s = useSlam(at + 14, 1.3);
  const draw = interpolate(frame, [at + 18, at + 48], [0, 1], { easing: theme.ease.out, ...clamp });
  const pts = [
    [0, 30], [40, 42], [70, 34], [105, 70], [130, 60], [165, 112], [190, 98], [225, 160], [260, 150], [300, 214],
  ];
  const path = pts.map(([x, y], k) => `${k ? "L" : "M"}${x} ${y}`).join(" ");
  const len = 520;
  return (
    <div
      style={{
        position: "absolute",
        left: 610,
        top: 640,
        width: 400,
        height: 250,
        zIndex: 17,
        border: `6px solid ${colors.paper}`,
        overflow: "hidden",
        opacity: s.opacity,
        transform: `rotate(3deg) scale(${s.scale})`,
        boxShadow: colors.shadow,
      }}
    >
      <OffthreadVideo
        src={staticFile("media/salary-2013/crash-screen.mp4")}
        muted
        style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scale(1.2)" }}
      />
      <div style={{ position: "absolute", inset: 0, background: "rgba(255,59,59,0.28)", mixBlendMode: "multiply" }} />
      <svg viewBox="0 0 300 240" style={{ position: "absolute", left: 30, top: 10, width: 340, height: 230 }}>
        <path
          d={path}
          fill="none"
          stroke={colors.bad}
          strokeWidth={9}
          strokeLinejoin="round"
          strokeDasharray={len}
          strokeDashoffset={len * (1 - draw)}
          style={{ filter: `drop-shadow(0 0 10px ${colors.badGlow})` }}
        />
      </svg>
      <div style={{ position: "absolute", left: 12, bottom: 12 }}>
        <Chip tone="bad" filled size={20} delay={at + 30}>
          БИРЖИ В КРАСНОМ
        </Chip>
      </div>
    </div>
  );
};

/* --------------------------------------------------------------- 2018 */

const WorldCup: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const putin = useSlam(at + 8, 1.0);
  const logo = useSlam(at + 16, 1.6);
  const rise = interpolate(putin.p, [0, 1], [240, 0]);
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 30,
          top: 510,
          width: 330,
          height: 408,
          zIndex: 16,
          opacity: putin.opacity,
          transform: `translateY(${rise}px)`,
          filter: "drop-shadow(0 26px 30px rgba(0,0,0,0.75))",
          maskImage: "linear-gradient(90deg, transparent 0%, #000 14%, #000 100%), linear-gradient(180deg, #000 78%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(180deg, #000 78%, transparent 100%)",
          maskComposite: "intersect",
        }}
      >
        <Img src={img("putin-cup.png")} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 380,
          top: 540,
          width: 200,
          zIndex: 17,
          opacity: logo.opacity,
          transform: `rotate(${-4 + Math.sin(frame / 18) * 2}deg) scale(${logo.scale})`,
          filter: "drop-shadow(0 18px 24px rgba(0,0,0,0.6))",
        }}
      >
        <Img src={img("wc2018.png")} style={{ width: "100%" }} />
      </div>
      <div style={{ position: "absolute", left: 600, top: 650, zIndex: 18 }}>
        <Chip tone="paper" size={26} delay={at + 22}>
          ЧМ-2018 В РОССИИ
        </Chip>
      </div>
    </>
  );
};

/* --------------------------------------------------------------- 2022 */

const LogoCard: React.FC<{ children: React.ReactNode; at: number; x: number; rot: number }> = ({ children, at, x, rot }) => {
  const s = useSlam(at, 1.5);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: 572,
        width: 290,
        height: 150,
        zIndex: 17,
        background: colors.white,
        borderRadius: 14,
        boxShadow: colors.shadow,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: s.opacity,
        transform: `rotate(${rot}deg) scale(${s.scale})`,
      }}
    >
      {children}
      {/* blocked: a red cross + label */}
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Cross delay={at + 10} size={150} thick={16} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: -22, display: "flex", justifyContent: "center" }}>
        <Chip tone="bad" filled size={18} delay={at + 14}>
          ЗАБЛОКИРОВАНО
        </Chip>
      </div>
    </div>
  );
};

const Blocked2022: React.FC<{ at: number }> = ({ at }) => (
  <>
    <LogoCard at={at + 8} x={50} rot={-5}>
      <span style={{ fontFamily: theme.fonts.display, fontSize: 70, fontWeight: 800, letterSpacing: "-0.03em", color: BRAND.swift }}>
        swift
      </span>
    </LogoCard>
    <LogoCard at={at + 16} x={395} rot={3}>
      <span style={{ fontFamily: theme.fonts.display, fontSize: 84, fontWeight: 900, fontStyle: "italic", letterSpacing: "-0.02em", color: BRAND.visa }}>
        VISA
      </span>
    </LogoCard>
    <LogoCard at={at + 24} x={740} rot={-3}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
        <div style={{ position: "relative", width: 120, height: 76 }}>
          <div style={{ position: "absolute", left: 0, top: 0, width: 76, height: 76, borderRadius: "50%", background: BRAND.mcRed }} />
          <div style={{ position: "absolute", left: 44, top: 0, width: 76, height: 76, borderRadius: "50%", background: BRAND.mcYellow, mixBlendMode: "multiply" }} />
        </div>
        <span style={{ fontFamily: theme.fonts.display, fontSize: 24, fontWeight: 700, color: colors.ink }}>mastercard</span>
      </div>
    </LogoCard>
  </>
);

/* ------------------------------------------------------------ reasons */

const Reasons: React.FC<{ at: number; items: string[] }> = ({ at, items }) => {
  const head = useIn(at + 20, "snappy");
  return (
    <div
      style={{
        position: "absolute",
        left: 60,
        right: 60,
        top: 1625,
        display: "flex",
        flexWrap: "wrap",
        gap: 12,
        alignItems: "center",
        zIndex: 30,
      }}
    >
      <span
        style={{
          fontFamily: theme.fonts.mono,
          fontSize: 24,
          fontWeight: 800,
          letterSpacing: "0.14em",
          color: palette.textDim,
          opacity: head,
        }}
      >
        ПОЧЕМУ:
      </span>
      {items.map((t, k) => (
        <Chip key={t} tone="paper" size={22} delay={at + 24 + k * 5}>
          {t}
        </Chip>
      ))}
    </div>
  );
};

/* --------------------------------------------------------------- mount */

/** Everything extra for the year on screen; `i` indexes YEARS. */
export const YearExtras: React.FC<{ i: number; at: number }> = ({ i, at }) => {
  if (i === 1)
    return (
      <>
        <BlackTuesday at={at} />
        <CrashPanel at={at} />
      </>
    );
  if (i === 2) return <WorldCup at={at} />;
  if (i === 3)
    return (
      <>
        <Blocked2022 at={at} />
        {/* ЦБ, 28.02.2022: ключевая ставка 20%; уход брендов; отключение части банков от SWIFT */}
        <Reasons at={at} items={["СТАВКА ЦБ 20%", "УХОД ЗАПАДНЫХ БРЕНДОВ", "БАНКИ ОТКЛЮЧЕНЫ ОТ SWIFT"]} />
      </>
    );
  if (i === 4)
    // ЦБ: 21% с 28.10.2024 по 06.06.2025; безработица — исторический минимум (Росстат)
    return <Reasons at={at} items={["НЕХВАТКА ЛЮДЕЙ", "БЕЗРАБОТИЦА — РЕКОРДНО НИЗКАЯ", "КОМПАНИИ ПЕРЕКУПАЮТ КАДРЫ", "СТАВКА ЦБ 21%"]} />;
  return null;
};
