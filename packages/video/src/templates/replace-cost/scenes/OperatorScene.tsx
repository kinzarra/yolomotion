import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../../theme";
import { rcColors, rcPalette } from "../palette";
import { cue, lineStart } from "../cues";
import {
  BrandBarWide,
  CLIP_MAX,
  DotField,
  Logo,
  NumTitle,
  Odometer,
  Part,
  Ring,
  SceneShell,
  Screen,
  Shots,
  Source,
  Stamp,
  VersusReceipt,
  ramp,
} from "../ui";

const Label: React.FC<{ children: React.ReactNode; at: number; color?: string }> = ({ children, at, color = rcPalette.text }) => {
  const frame = useCurrentFrame();
  const p = ramp(frame, at, at + 10);
  return (
    <div
      style={{
        fontFamily: theme.fonts.mono,
        fontWeight: 700,
        fontSize: 24,
        letterSpacing: "0.1em",
        color,
        opacity: p,
        transform: `translateY(${(1 - p) * 10}px)`,
      }}
    >
      {children}
    </div>
  );
};

// Beat 5 — №2 ОПЕРАТОР. Part A: Klarna's assistant, 2.3M chats in a month =
// 700 operators (the screen cuts to 700 dots, which go out), $40M.
// Part B: Т-Банк 40% without a human; a bot minute 4 ₽ vs 1M ₽ a year.
export const OperatorScene: React.FC<{ series: string; episode: string }> = ({ series, episode }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = (p: number) => cue("operator", "06-operator", p, fps);
  const bStart = lineStart("operator", "07-operator-ru", fps) - 6;
  const b = (p: number) => cue("operator", "07-operator-ru", p, fps) - bStart;
  const toDots = a(4);
  return (
    <SceneShell>
      <BrandBarWide series={series} episode={episode} />
      <Part from={0} len={bStart}>
        <div style={{ position: "absolute", left: 96, top: 140 }}>
          <NumTitle n={2} name="ОПЕРАТОР КОЛЛ-ЦЕНТРА" delay={2} size={72} />
        </div>
        <div style={{ position: "absolute", left: 96, top: 270 }}>
          <Logo file="logo-klarna.svg" height={48} delay={a(1)} />
        </div>
        <div style={{ position: "absolute", left: 96, top: 400, display: "flex", flexDirection: "column", gap: 10 }}>
          <Odometer to={2300000} delay={a(3)} dur={40} size={120} color={rcPalette.primary} />
          <Label at={a(3) + 8}>ДИАЛОГОВ ЗА ПЕРВЫЙ МЕСЯЦ · ИИ-АССИСТЕНТ</Label>
        </div>
        <div style={{ position: "absolute", left: 96, top: 640, display: "flex", alignItems: "baseline", gap: 22 }}>
          <Odometer to={700} delay={a(5)} dur={30} size={96} prefix="= " />
          <Label at={a(5) + 6}>ОПЕРАТОРОВ</Label>
        </div>
        <div style={{ position: "absolute", left: 1150, top: 430 }}>
          <Stamp delay={a(7)} tone="hero" size={60} rotate={-6}>
            $40 МЛН ЭКОНОМИИ
          </Stamp>
        </div>
        <Screen width={820} height={461} delay={4} label={frame < toDots ? "ПОДДЕРЖКА · КОЛЛ-ЦЕНТР" : "700 ОПЕРАТОРОВ"} style={{ left: 1004, top: 250 }}>
          {frame < toDots ? (
            <Shots
              shots={[
                { file: "clip-callcenter.mp4", len: CLIP_MAX },
                { file: "callcenter.jpg", len: toDots - CLIP_MAX, focus: [0.5, 0.4] },
              ]}
            />
          ) : (
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: rcColors.surfaceStrong }}>
              <DotField count={700} cols={35} dot={13} gap={8} delay={toDots} offAt={a(6)} />
            </div>
          )}
        </Screen>
        <div style={{ position: "absolute", left: 96, top: 848 }}>
          <Source delay={a(1)}>KLARNA, ПРЕСС-РЕЛИЗ 27.02.2024 · ЭКОНОМИЯ — ПРОГНОЗ НА 2024</Source>
        </div>
      </Part>
      <Part from={bStart} exit={false}>
        <div style={{ position: "absolute", left: 96, top: 150 }}>
          <Logo file="logo-tbank.svg" height={52} delay={4} />
        </div>
        <div style={{ position: "absolute", left: 120, top: 300 }}>
          <Ring value={40} size={440} delay={b(1)} label="ОБРАЩЕНИЙ БЕЗ ЧЕЛОВЕКА" />
        </div>
        <div style={{ position: "absolute", left: 900, top: 230 }}>
          <VersusReceipt
            role="ОПЕРАТОР"
            delay={b(6) - 8}
            machineAt={b(4)}
            scale={0.92}
            human={{ label: "ОБХОДИТСЯ БИЗНЕСУ", value: "1 000 000 ₽", unit: "В ГОД · С НАЛОГАМИ" }}
            machine={{ label: "МИНУТА ГОЛОСОВОГО БОТА", value: "≈4 ₽", unit: "ЗА МИНУТУ · ОЦЕНКА" }}
          />
        </div>
        <div style={{ position: "absolute", left: 96, top: 848 }}>
          <Source delay={8}>Т-БАНК, 2026 · Т-Ж, 27.05.2026 (РАСЧЁТ ВЕНДОРА)</Source>
        </div>
      </Part>
    </SceneShell>
  );
};
