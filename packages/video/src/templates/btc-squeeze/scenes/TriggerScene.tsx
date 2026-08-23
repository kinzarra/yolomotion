// Beat 2 — the real trigger. A mountain of Treasury slips stacks up, the
// receipt prints МИНФИН США · 19 АВГ, and the figure at the top glitches
// from $2B to $4B on «удвоил», then punches again on «четырёх».
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { theme } from "../../../theme";
import { usePunch } from "../../../reel";
import { btcColors, btcPalette } from "../palette";
import { BrandBar, Chip, Eyebrow, Flash, Glitch, Kinetic, PaperSlip, Receipt, ReceiptLine, ReceiptRule, SceneShell, Shockwave } from "../ui";

const FIGURE = 6; // $2B lands
const RECEIPT = 92; // «Девятнадцатого августа»
const FLIP = 172; // «удвоил»
const FOUR = 288; // «четырёх»

// the pile: three rows, bottom to top
const PILE: { x: number; y: number; tilt: number; d: number }[] = [
  { x: 40, y: 180, tilt: -2, d: 0 },
  { x: 270, y: 186, tilt: 1.5, d: 4 },
  { x: 500, y: 178, tilt: -1, d: 8 },
  { x: 720, y: 188, tilt: 2.5, d: 12 },
  { x: 150, y: 96, tilt: 1, d: 18 },
  { x: 385, y: 90, tilt: -2, d: 22 },
  { x: 615, y: 98, tilt: 1.5, d: 26 },
  { x: 268, y: 8, tilt: -1.5, d: 32 },
  { x: 500, y: 4, tilt: 2, d: 36 },
];

export const TriggerScene: React.FC<{ series: string; episode: string }> = ({ series, episode }) => {
  const frame = useCurrentFrame();
  const flip = usePunch(FLIP, 22);
  const four = usePunch(FOUR, 16);
  const glitch = interpolate(frame, [FLIP - 2, FLIP + 1, FLIP + 12], [0, 1, 0], {
    easing: theme.ease.out,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const doubled = frame >= FLIP;
  const pileFloat = Math.sin(frame / 30) * 4;

  return (
    <SceneShell shake={flip.shake * 0.7 + four.shake * 0.4}>
      <BrandBar series={series} episode={episode} />

      <AbsoluteFill style={{ alignItems: "center", paddingTop: 330 }}>
        <Eyebrow delay={2}>Рынок госдолга США</Eyebrow>
        <div style={{ marginTop: 18, minHeight: 240, display: "flex", alignItems: "center" }}>
          <Glitch amount={glitch} bands={6}>
            <div style={{ transform: `scale(${1 + flip.pop * 0.1 + four.pop * 0.06})` }}>
              {doubled ? (
                <Kinetic text="$4B" delay={FLIP} per={0} size={230} weight={900} hero={[0]} glow mode="snap" lineHeight={1} />
              ) : (
                <Kinetic text="$2B" delay={FIGURE} per={0} size={230} weight={900} color={btcPalette.text} mode="snap" lineHeight={1} />
              )}
            </div>
          </Glitch>
        </div>
        <div style={{ marginTop: 8, display: "flex", gap: 16 }}>
          <Chip delay={FIGURE + 12} tone="neutral" size={26}>
            ВЫКУП ДЛИННЫХ ОБЛИГАЦИЙ
          </Chip>
          {doubled && (
            <Chip delay={FLIP + 6} tone="hero" size={26} filled>
              ×2
            </Chip>
          )}
        </div>
      </AbsoluteFill>

      {/* the mountain of paper */}
      <div style={{ position: "absolute", left: 72, top: 760, width: 936, height: 330, transform: `translateY(${pileFloat}px)` }}>
        {PILE.map((s, i) => (
          <div key={i} style={{ position: "absolute", left: s.x, top: s.y }}>
            <PaperSlip width={200} delay={s.d} tilt={s.tilt} figure={i % 3 === 0 ? "30Y" : i % 3 === 1 ? "20Y" : "10Y"} />
          </div>
        ))}
      </div>

      {/* the receipt */}
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 1090 }}>
        <Receipt width={700} printFrom={RECEIPT} printFrames={28} title="МИНФИН США · BUYBACK" number="19 АВГ 2026" tilt={-1}>
          <ReceiptLine label="ВЫКУП ДЛИННЫХ ОБЛИГАЦИЙ" size={24} delay={RECEIPT + 6} />
          <ReceiptRule />
          <ReceiptLine label="ЗА ОПЕРАЦИЮ" value={doubled ? "МИН. $4B" : "$2B"} strong size={26} delay={RECEIPT + 14} />
        </Receipt>
      </AbsoluteFill>

      <Shockwave at={FLIP} life={26} />
      <Flash amount={flip.pop * 0.8} />
      <Flash amount={four.pop * 0.4} />
    </SceneShell>
  );
};
