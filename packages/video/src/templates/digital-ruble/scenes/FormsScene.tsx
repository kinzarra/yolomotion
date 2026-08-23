// Beat 3 — one ruble, three forms. A paper token pops in the middle, splits
// into three (paper / dark / lime) and each lands in a ledger row:
// НАЛИЧНЫЕ → КОШЕЛЁК, БЕЗНАЛИЧНЫЕ → БАНК, ЦИФРОВЫЕ → ПЛАТФОРМА ЦБ.
// The third row is the only lime thing in the frame.
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../../theme";
import { drColors, drPalette } from "../palette";
import { BrandBar, Chip, Eyebrow, Kinetic, SceneShell, Token } from "../ui";

const POP = 4; // the single token
const SPLIT = 34; // it becomes three
const ROW_TOP = 640;
const ROW_PITCH = 215;
const ROW_H = 175;
const TOKEN = 124;
const CENTER_Y = ROW_TOP + ROW_PITCH + ROW_H / 2; // middle row centre

const ROWS = [
  { label: "НАЛИЧНЫЕ", to: "КОШЕЛЁК", tone: "paper" as const },
  { label: "БЕЗНАЛИЧНЫЕ", to: "БАНК", tone: "dark" as const },
  { label: "ЦИФРОВЫЕ", to: "ПЛАТФОРМА ЦБ", tone: "hero" as const },
];

export const FormsScene: React.FC<{ series: string; episode: string }> = ({ series, episode }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ramp = (from: number, to: number, easing = theme.ease.out) =>
    interpolate(frame, [from, to], [0, 1], { easing, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const breathe = Math.sin(frame / 28) * 4;

  return (
    <SceneShell>
      <BrandBar series={series} episode={episode} />

      <AbsoluteFill style={{ paddingLeft: 72, paddingTop: 330 }}>
        <Eyebrow delay={2}>Одни деньги · три формы</Eyebrow>
        <div style={{ width: 940, marginTop: 28 }}>
          <Kinetic text="ТРЕТЬЯ ФОРМА РУБЛЯ" delay={6} per={4} size={84} />
        </div>
      </AbsoluteFill>

      {/* ledger rows */}
      {ROWS.map((row, i) => {
        const p = spring({ frame: frame - (SPLIT + 4 + i * 8), fps, config: theme.spring.smooth });
        const isHero = row.tone === "hero";
        return (
          <div
            key={row.label}
            style={{
              position: "absolute",
              left: 72,
              right: 72,
              top: ROW_TOP + i * ROW_PITCH,
              height: ROW_H,
              display: "flex",
              alignItems: "center",
              gap: 28,
              paddingLeft: TOKEN + 40,
              paddingRight: 28,
              background: drColors.surface,
              border: `2px solid ${isHero ? drPalette.primary : drColors.line}`,
              boxShadow: isHero ? `0 0 60px ${drPalette.primary}22` : undefined,
              opacity: p,
              transform: `translateX(${interpolate(p, [0, 1], [90, 0])}px) translateY(${breathe * (i % 2 ? -1 : 1) * 0.5}px)`,
            }}
          >
            <span
              style={{
                fontFamily: theme.fonts.wide,
                fontSize: 40,
                fontWeight: 800,
                letterSpacing: "-0.02em",
                color: drPalette.text,
                whiteSpace: "nowrap",
              }}
            >
              {row.label}
            </span>
            <span
              style={{
                fontFamily: theme.fonts.mono,
                fontSize: 40,
                fontWeight: 700,
                color: isHero ? drPalette.primary : drPalette.textDim,
                transform: `translateX(${Math.sin(frame / 10 + i) * 3}px)`,
              }}
            >
              →
            </span>
            <span style={{ flex: 1 }} />
            <Chip delay={SPLIT + 16 + i * 8} tone={isHero ? "hero" : "neutral"} size={24} filled={isHero}>
              {row.to}
            </Chip>
          </div>
        );
      })}

      {/* the single token, then its three clones travelling to the rows */}
      {frame < SPLIT + 2 && (
        <div style={{ position: "absolute", left: 540 - 130, top: CENTER_Y - 130 }}>
          <Token size={260} tone="paper" delay={POP} />
        </div>
      )}
      {ROWS.map((row, i) => {
        const p = spring({ frame: frame - (SPLIT + i * 3), fps, config: theme.spring.smooth });
        if (frame < SPLIT) return null;
        const targetX = 72 + 26;
        const targetY = ROW_TOP + i * ROW_PITCH + (ROW_H - TOKEN) / 2;
        const startX = 540 - TOKEN / 2;
        const startY = CENTER_Y - TOKEN / 2;
        const x = interpolate(p, [0, 1], [startX, targetX]);
        const y = interpolate(p, [0, 1], [startY, targetY]);
        // Spin once on the way, and scale from the big token down to the slot.
        const s = interpolate(p, [0, 1], [260 / TOKEN, 1]);
        return (
          <div
            key={row.label}
            style={{
              position: "absolute",
              left: x,
              top: y,
              transform: `scale(${s}) rotate(${interpolate(p, [0, 1], [0, 360])}deg)`,
              transformOrigin: "center",
            }}
          >
            <Token size={TOKEN} tone={row.tone} delay={-99} />
          </div>
        );
      })}
      {/* clone flash */}
      <div
        style={{
          position: "absolute",
          left: 540 - 200,
          top: CENTER_Y - 200,
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${drColors.paper}AA, transparent 60%)`,
          opacity: interpolate(frame, [SPLIT, SPLIT + 2, SPLIT + 14], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          transform: `scale(${1 + ramp(SPLIT, SPLIT + 14) * 1.2})`,
          pointerEvents: "none",
        }}
      />
    </SceneShell>
  );
};
