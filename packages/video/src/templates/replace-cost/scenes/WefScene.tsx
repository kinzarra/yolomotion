import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../../theme";
import { rcColors, rcPalette } from "../palette";
import { cue } from "../cues";
import { BrandBarWide, Kinetic, Logo, Odometer, SceneShell, Source, ramp } from "../ui";

const Column: React.FC<{ value: number; sign: "−" | "+"; label: string; delay: number; up: boolean }> = ({ value, sign, label, delay, up }) => {
  const frame = useCurrentFrame();
  const p = ramp(frame, delay, delay + 34, theme.ease.out);
  const color = up ? rcPalette.primary : rcColors.bad;
  const h = (value / 170) * 380;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, width: 420 }}>
      <Odometer to={value} prefix={sign} suffix=" МЛН" delay={delay} dur={34} size={66} color={color} />
      <div style={{ height: 390, width: 220, display: "flex", alignItems: "flex-end", borderBottom: `2px solid ${rcColors.lineStrong}` }}>
        <div
          style={{
            width: "100%",
            height: h * p,
            background: color,
            boxShadow: `0 0 30px ${up ? rcPalette.glow : rcColors.badGlow}`,
            transform: `translateY(${interpolate(p, [0, 1], [10, 0])}px)`,
          }}
        />
      </div>
      <div style={{ fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: 24, letterSpacing: "0.14em", color: rcPalette.text, opacity: p }}>{label}</div>
    </div>
  );
};

// Beat 11 — the second turn: the WEF count to 2030, −92M jobs / +170M jobs,
// and the question that opens the back half: ЧЬИ?
export const WefScene: React.FC<{ series: string; episode: string }> = ({ series, episode }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const c = (p: number) => cue("wef", "15-wef", p, fps);
  const q = ramp(frame, c(5) - 4, c(5) + 6);
  return (
    <SceneShell>
      <BrandBarWide series={series} episode={episode} />
      <div style={{ position: "absolute", left: 96, top: 140, display: "flex", alignItems: "center", gap: 26 }}>
        <Logo file="logo-wef.svg" height={46} delay={2} />
        <div style={{ fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: 24, letterSpacing: "0.14em", color: rcPalette.textDim, opacity: ramp(frame, 8, 18) }}>
          FUTURE OF JOBS 2025 · ПРОГНОЗ ДО 2030
        </div>
      </div>
      <div style={{ position: "absolute", left: 160, top: 250, display: "flex", gap: 60, opacity: 1 - q * 0.6, transform: `scale(${1 - q * 0.04})`, transformOrigin: "left center" }}>
        <Column value={92} sign="−" label="ИСЧЕЗНУТ" delay={c(2)} up={false} />
        <Column value={170} sign="+" label="ПОЯВЯТСЯ" delay={c(4)} up />
      </div>
      <div style={{ position: "absolute", left: 1200, top: 380 }}>
        <Kinetic text="ЧЬИ?" size={170} delay={c(5)} mode="snap" hero={[0]} glow />
      </div>
      <div style={{ position: "absolute", left: 96, top: 848 }}>
        <Source delay={8}>WORLD ECONOMIC FORUM, 07.01.2025 · НЕ ТОЛЬКО ИЗ-ЗА ИИ</Source>
      </div>
    </SceneShell>
  );
};
