import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../../theme";
import { rcColors, rcPalette } from "../palette";
import { cue, lineStart } from "../cues";
import {
  BrandBarWide,
  Chip,
  CLIP_MAX,
  Cross,
  Logo,
  NumTitle,
  Odometer,
  Part,
  PrintedPhoto,
  SceneShell,
  Screen,
  Shots,
  Source,
  VersusReceipt,
  WIDE,
  ramp,
} from "../ui";

const Bar: React.FC<{ label: string; value: string; share: number; delay: number; tone: "hero" | "bone" }> = ({
  label,
  value,
  share,
  delay,
  tone,
}) => {
  const frame = useCurrentFrame();
  const p = ramp(frame, delay, delay + 30, theme.ease.out);
  const color = tone === "hero" ? rcPalette.primary : rcPalette.text;
  return (
    <div style={{ width: 760, opacity: Math.min(1, p * 3), transform: `translateX(${interpolate(p, [0, 1], [-20, 0])}px)` }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontFamily: theme.fonts.mono,
          fontWeight: 700,
          fontSize: 20,
          letterSpacing: "0.12em",
          color: rcPalette.textDim,
          marginBottom: 8,
        }}
      >
        <span>{label}</span>
        <span style={{ color, fontFamily: WIDE, fontSize: 30, letterSpacing: "-0.01em" }}>{value}</span>
      </div>
      <div style={{ height: 26, background: rcColors.line }}>
        <div
          style={{
            height: "100%",
            width: `${share * p * 100}%`,
            background: color,
            boxShadow: tone === "hero" ? `0 0 22px ${rcPalette.glow}` : undefined,
          }}
        />
      </div>
    </div>
  );
};

/** Three month tiles fill one by one: the kiosk pays for itself. */
const Months: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      {[0, 1, 2].map((i) => {
        const p = ramp(frame, delay + i * 7, delay + i * 7 + 12, theme.ease.out);
        return (
          <div
            key={i}
            style={{
              width: 92,
              height: 92,
              border: `3px solid ${i < 2 ? rcColors.paper : rcColors.lineStrong}`,
              background: i < 2 ? `${rcColors.paper}` : "transparent",
              color: rcColors.ink,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: WIDE,
              fontWeight: 900,
              fontSize: 40,
              opacity: p,
              transform: `translateY(${interpolate(p, [0, 1], [24, 0])}px) scale(${interpolate(p, [0, 1], [0.8, 1])})`,
            }}
          >
            <span style={{ color: i < 2 ? rcColors.ink : rcPalette.textDim }}>{i + 1}</span>
          </div>
        );
      })}
      <div
        style={{
          marginLeft: 18,
          fontFamily: WIDE,
          fontWeight: 900,
          fontSize: 44,
          color: rcPalette.text,
          opacity: ramp(frame, delay + 20, delay + 32),
        }}
      >
        = 2–3 МЕСЯЦА
      </div>
    </div>
  );
};

// Beat 4 — №1 КАССИР. Part A: 42% pay without a cashier, 69 000 kiosks vs
// ~70 000 tills; the screen cuts from the kiosk to a human till on «обычных».
// Part B: the kiosk costs 2–3 months of a cashier's pay, no sick days.
export const CashierScene: React.FC<{ series: string; episode: string }> = ({ series, episode }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = (p: number) => cue("cashier", "04-cashier", p, fps);
  const bStart = lineStart("cashier", "05-cashier-price", fps) - 6;
  const b = (p: number) => cue("cashier", "05-cashier-price", p, fps) - bStart;
  const cutToTill = a(6);
  return (
    <SceneShell>
      <BrandBarWide series={series} episode={episode} />
      <Part from={0} len={bStart}>
        <div style={{ position: "absolute", left: 96, top: 140 }}>
          <NumTitle n={1} name="КАССИР" delay={2} />
        </div>
        <div style={{ position: "absolute", left: 96, top: 290, display: "flex", alignItems: "center", gap: 30 }}>
          <Odometer to={42} suffix="%" delay={a(2)} size={200} color={rcPalette.primary} />
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: 24, letterSpacing: "0.1em", color: rcPalette.text, maxWidth: 330, opacity: ramp(frame, a(3), a(3) + 10) }}>
              ПЛАТЯТ БЕЗ КАССИРА
            </div>
            <Logo file="logo-pyaterochka.svg" height={44} delay={a(1)} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 96, top: 560, display: "flex", flexDirection: "column", gap: 26 }}>
          <Bar label="КАССЫ САМООБСЛУЖИВАНИЯ" value="69 000+" share={0.985} delay={a(4)} tone="hero" />
          <Bar label="ОБЫЧНЫЕ КАССЫ" value="≈70 000" share={1} delay={a(6)} tone="bone" />
        </div>
        <div style={{ position: "absolute", left: 890, top: 548 }}>
          <Logo file="logo-x5.svg" height={40} delay={a(4) + 4} tilt={3} />
        </div>
        <Screen width={820} height={461} delay={4} label="КАССА · ПЯТЁРОЧКА" style={{ left: 1004, top: 200 }}>
          <Shots
            shots={[
              { file: "clip-selfcheckout.mp4", len: CLIP_MAX },
              { file: "selfcheckout.jpg", len: cutToTill - CLIP_MAX, focus: [0.5, 0.5] },
              { file: "clip-cashier.mp4", len: bStart - cutToTill },
            ]}
          />
        </Screen>
        <div style={{ position: "absolute", left: 96, top: 848 }}>
          <Source delay={a(2)}>X5 MEDIA, 22.09.2025 · X5, 18.05.2026</Source>
        </div>
      </Part>
      <Part from={bStart} exit={false}>
        <div style={{ position: "absolute", left: 96, top: 150 }}>
          <VersusReceipt
            role="КАССИР"
            delay={4}
            machineAt={b(1)}
            scale={0.9}
            human={{ label: "ЗАРПЛАТА", value: "53 040 ₽", unit: "В МЕСЯЦ · МЕДИАНА 2025" }}
            machine={{ label: "КАССА САМООБСЛУЖИВАНИЯ", value: "≈130 000 ₽", unit: "ОДИН РАЗ · ЖЕЛЕЗО" }}
          />
        </div>
        <div style={{ position: "absolute", left: 96, top: 560 }}>
          <Months delay={b(2)} />
        </div>
        <div style={{ position: "absolute", left: 96, top: 710, display: "flex", gap: 22 }}>
          {[
            ["БОЛЬНИЧНЫЕ", b(5)],
            ["ОТПУСК", b(5) + 12],
          ].map(([label, d]) => (
            <div key={label as string} style={{ position: "relative" }}>
              <Chip delay={d as number} tone="neutral" size={24}>
                {label}
                <Cross delay={(d as number) + 6} size={26} thick={5} />
              </Chip>
            </div>
          ))}
        </div>
        <PrintedPhoto
          file="selfcheckout.jpg"
          width={640}
          height={430}
          len={300}
          printFrom={2}
          focus={[0.5, 0.45]}
          tilt={2}
          caption={
            <>
              <span>КСО · 1 ШТ.</span>
              <span>≈130 000 ₽</span>
            </>
          }
          style={{ left: 1150, top: 180 }}
        />
        <div style={{ position: "absolute", left: 96, top: 848 }}>
          <Source delay={6}>RETAIL.RU, 2026 · ЦЕНА АТОЛ КСО — РОЗНИЦА, РАСЧЁТ АВТОРА</Source>
        </div>
      </Part>
    </SceneShell>
  );
};
