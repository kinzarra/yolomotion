// 08 model — the second turn: the city works like an airport. Terminal 3
// (EditQ, CC0) for exactly «Дубай устроен как аэропорт», then the diagram:
// the gate costs 0, the tills inside take the money, coins drop into the
// treasury. The CTA question is planted here once, before the average exit.
import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { useIn } from "../../../reel";
import { theme } from "../../../theme";
import { deColors, dePalette } from "../palette";
import {
  BrandBar,
  Chip,
  Coin,
  Eyebrow,
  Flash,
  Kinetic,
  Photo,
  Scrim,
  SceneShell,
  ramp,
} from "../ui";

const TILLS = ["ЖИЛЬЁ", "ОТЕЛИ", "СДЕЛКИ"];

export const ModelScene: React.FC<{ series: string; episode: string; question: string }> = ({
  series,
  episode,
  question,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const cut = Math.round(2.3 * fps); // after «как аэропорт»
  const tillAt = [5.0, 5.6, 6.2].map((s) => Math.round(s * fps)); // «жильё, отели, сделки»
  const flash = interpolate(frame, [cut, cut + 6], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const gate = useIn(cut + 4, "bouncy");
  const fill = ramp(frame, tillAt[0], durationInFrames - 10, theme.ease.inOut);
  const ask = useIn(tillAt[2] + 4, "smooth");
  if (frame < cut) {
    return (
      <SceneShell exit={false}>
        <Photo file="08-model-terminal.jpg" len={cut} focus={[0.62, 0.55]} zoom={[1.05, 1.18]} drift={30} />
        <Scrim top={0.7} mid={0.1} bottom={0.9} />
        <div style={{ position: "absolute", left: 90, right: 90, top: 300 }}>
          <Kinetic text="ДУБАЙ — КАК АЭРОПОРТ" delay={2} per={4} size={92} mode="snap" hero={[3]} />
        </div>
      </SceneShell>
    );
  }
  return (
    <SceneShell>
      <BrandBar series={series} episode={episode} />
      <div style={{ position: "absolute", left: 90, top: 290 }}>
        <Eyebrow delay={cut}>КАК ЗАРАБАТЫВАЕТ ГОРОД</Eyebrow>
      </div>

      {/* the gate */}
      <div
        style={{
          position: "absolute",
          left: 90,
          top: 370,
          right: 90,
          display: "flex",
          alignItems: "center",
          gap: 26,
          opacity: gate,
          transform: `translateY(${(1 - gate) * 30}px)`,
        }}
      >
        <div style={{ fontFamily: theme.fonts.wide, fontWeight: 900, fontSize: 82, color: dePalette.text }}>ВХОД</div>
        <div style={{ flex: 1, height: 4, background: deColors.lineStrong }} />
        <div style={{ fontFamily: theme.fonts.wide, fontWeight: 900, fontSize: 120, color: dePalette.text }}>0</div>
      </div>

      {/* the tills */}
      {TILLS.map((t, i) => (
        <Till key={t} label={t} y={560 + i * 140} at={tillAt[i]} />
      ))}

      {/* the treasury */}
      <div style={{ position: "absolute", left: 90, right: 90, top: 1000 }}>
        <div
          style={{
            fontFamily: theme.fonts.mono,
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: "0.16em",
            color: dePalette.textDim,
            marginBottom: 12,
          }}
        >
          КАЗНА ГОРОДА
        </div>
        <div style={{ height: 56, border: `3px solid ${deColors.lineStrong}`, position: "relative" }}>
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: `${fill * 100}%`,
              background: dePalette.primary,
              boxShadow: `0 0 30px ${dePalette.glow}`,
            }}
          />
        </div>
      </div>

      <div style={{ position: "absolute", left: 90, top: 1200, opacity: ask, transform: `translateY(${(1 - ask) * 24}px)` }}>
        <Chip size={30}>{question} ДА / НЕТ</Chip>
      </div>
      <Flash amount={flash} color={deColors.white} />
    </SceneShell>
  );
};

/** One till inside the terminal: a dark row that snaps in and drops coins. */
const Till: React.FC<{ label: string; y: number; at: number }> = ({ label, y, at }) => {
  const frame = useCurrentFrame();
  const p = useIn(at, "snappy");
  return (
    <div style={{ position: "absolute", left: 90, right: 90, top: y, height: 110 }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: deColors.surface,
          border: `2px solid ${deColors.line}`,
          display: "flex",
          alignItems: "center",
          padding: "0 34px",
          fontFamily: theme.fonts.wide,
          fontWeight: 800,
          fontSize: 50,
          color: dePalette.text,
          opacity: p,
          transform: `translateX(${(1 - p) * -60}px)`,
        }}
      >
        {label}
      </div>
      {[0, 1, 2].map((k) => {
        const s = at + 6 + k * 7;
        const t = ramp(frame, s, s + 16, theme.ease.in);
        return t > 0 && t < 1 ? (
          <Coin
            key={k}
            size={54}
            style={{ position: "absolute", left: 700 + k * 70, top: 28 + t * 380, opacity: 1 - t * 0.3 }}
          />
        ) : null;
      })}
    </div>
  );
};
