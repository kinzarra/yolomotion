import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../../theme";
import { rcColors, rcPalette } from "../palette";
import { cue } from "../cues";
import {
  BrandBarWide,
  CLIP_MAX,
  Figure,
  Logo,
  NumTitle,
  Odometer,
  SceneShell,
  Screen,
  Shots,
  Source,
  ramp,
} from "../ui";

/** One operator, twelve rovers: the lines draw out to each one in turn. */
const Fleet: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const cols = 4;
  const rover = (i: number) => {
    const x = 330 + (i % cols) * 110;
    const y = 30 + Math.floor(i / cols) * 92;
    return { x, y };
  };
  return (
    <div style={{ position: "relative", width: 800, height: 300 }}>
      <svg width={800} height={300} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        {Array.from({ length: 12 }, (_, i) => {
          const p = ramp(frame, delay + i * 3, delay + i * 3 + 14);
          const { x, y } = rover(i);
          const x0 = 110;
          const y0 = 140;
          return (
            <line
              key={i}
              x1={x0}
              y1={y0}
              x2={x0 + (x + 20 - x0) * p}
              y2={y0 + (y + 22 - y0) * p}
              stroke={rcPalette.primary}
              strokeWidth={2}
              strokeDasharray="6 6"
              opacity={0.65}
            />
          );
        })}
      </svg>
      <div style={{ position: "absolute", left: 70, top: 80 }}>
        <Figure size={80} tone="bone" delay={delay - 6} breathe />
      </div>
      {Array.from({ length: 12 }, (_, i) => {
        const p = ramp(frame, delay + 8 + i * 3, delay + 20 + i * 3, theme.ease.out);
        const { x, y } = rover(i);
        const bob = Math.sin((frame + i * 7) / 12) * 2;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y + bob,
              width: 46,
              height: 40,
              opacity: p,
              transform: `scale(${interpolate(p, [0, 1], [0.4, 1])})`,
            }}
          >
            <div style={{ width: 46, height: 30, borderRadius: 8, background: rcPalette.primary, boxShadow: `0 0 12px ${rcPalette.glow}` }} />
            <div style={{ display: "flex", justifyContent: "space-between", padding: "0 4px" }}>
              {[0, 1, 2].map((k) => (
                <div key={k} style={{ width: 9, height: 9, borderRadius: 5, background: rcColors.paper, marginTop: 2 }} />
              ))}
            </div>
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 290,
          fontFamily: theme.fonts.mono,
          fontWeight: 700,
          fontSize: 22,
          letterSpacing: "0.12em",
          color: rcPalette.text,
          opacity: ramp(frame, delay + 30, delay + 40),
        }}
      >
        1 ОПЕРАТОР = 12 РОБОТОВ
      </div>
    </div>
  );
};

// Beat 9 — №4 КУРЬЕР. The 295 000 rover from beat 2 returns; one operator
// watches twelve; 80 rovers today → 20 000 planned by end of 2027.
export const CourierScene: React.FC<{ series: string; episode: string }> = ({ series, episode }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const c = (p: number) => cue("courier", "12-courier", p, fps);
  const fleetOut = ramp(frame, c(5) - 8, c(5));
  return (
    <SceneShell>
      <BrandBarWide series={series} episode={episode} />
      <div style={{ position: "absolute", left: 96, top: 140 }}>
        <NumTitle n={4} name="КУРЬЕР" delay={2} />
      </div>
      <div style={{ position: "absolute", left: 96, top: 270, display: "flex", alignItems: "baseline", gap: 20 }}>
        <Odometer to={295000} suffix=" ₽" delay={c(2)} dur={30} size={96} color={rcPalette.primary} />
        <div style={{ fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: 22, letterSpacing: "0.12em", color: rcPalette.textDim, opacity: ramp(frame, c(2) + 10, c(2) + 20) }}>
          В ГОД ЗА РОБОТА
        </div>
      </div>
      <div style={{ position: "absolute", left: 96, top: 420, opacity: 1 - fleetOut, transform: `translateY(${-fleetOut * 20}px)` }}>
        <Fleet delay={c(3)} />
      </div>
      <div style={{ position: "absolute", left: 96, top: 440, display: "flex", flexDirection: "column", gap: 12, opacity: ramp(frame, c(5), c(5) + 6) }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 26 }}>
          <Odometer from={80} to={20000} delay={c(5)} dur={c(7) - c(5)} size={150} color={rcPalette.primary} />
          <div style={{ fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: 24, letterSpacing: "0.12em", color: rcPalette.text }}>РОБОТОВ</div>
        </div>
        <div style={{ fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: 22, letterSpacing: "0.12em", color: rcPalette.textDim }}>
          ПЛАН ЯНДЕКСА К КОНЦУ 2027 · СЕЙЧАС — 80
        </div>
        <div style={{ marginTop: 10 }}>
          <Logo file="logo-yandex.png" height={40} delay={c(6)} />
        </div>
      </div>
      <Screen width={820} height={461} delay={4} label="РОВЕР · ТРОТУАР" style={{ left: 1004, top: 250 }}>
        <Shots
          shots={[
            { file: "clip-robot.mp4", len: CLIP_MAX },
            { file: "yandex-rover.jpg", len: durationInFrames, focus: [0.5, 0.6], zoom: [1.04, 1.3] },
          ]}
        />
      </Screen>
      <div style={{ position: "absolute", left: 96, top: 848 }}>
        <Source delay={c(2)}>СОВКОМБАНК / ВЕДОМОСТИ, 2026 · ЯНДЕКС</Source>
      </div>
    </SceneShell>
  );
};
