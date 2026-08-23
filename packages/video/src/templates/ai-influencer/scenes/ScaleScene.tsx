import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../../theme";
import { aiColors, aiPalette } from "../palette";
import { BrandBar, Chip, SceneShell, useRamp } from "../ui";

// 21–25.5s — a balance scale: AI SCALE vs HUMAN AUTHENTICITY. It rocks, then
// settles dead level — neither side wins — and THE AUDIENCE DECIDES stamps in
// as the voice says "whoever the audience believes".
const PIVOT_X = 540;
const PIVOT_Y = 740;
const R = 300;
const CHAIN = 120;

const Pan: React.FC<{ x: number; y: number; drop: number; children: React.ReactNode }> = ({
  x,
  y,
  drop,
  children,
}) => (
  <div
    style={{
      position: "absolute",
      left: x - 150,
      top: y,
      width: 300,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      opacity: drop,
      transform: `translateY(${interpolate(drop, [0, 1], [-30, 0])}px)`,
    }}
  >
    {/* chains */}
    <svg width={300} height={CHAIN} style={{ display: "block" }}>
      <line x1={150} y1={0} x2={40} y2={CHAIN - 4} stroke={aiColors.lineStrong} strokeWidth={3} />
      <line x1={150} y1={0} x2={260} y2={CHAIN - 4} stroke={aiColors.lineStrong} strokeWidth={3} />
      <line x1={150} y1={0} x2={150} y2={CHAIN - 4} stroke={aiColors.lineStrong} strokeWidth={3} />
    </svg>
    {/* dish */}
    <div
      style={{
        width: 280,
        height: 24,
        borderRadius: 24,
        background: aiColors.surfaceLift,
        border: `1.5px solid ${aiColors.lineStrong}`,
        boxShadow: aiColors.shadow,
      }}
    />
    <div style={{ marginTop: 26 }}>{children}</div>
  </div>
);

export const ScaleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const pillar = useRamp(0, 14, theme.ease.out);
  const beamIn = useRamp(8, 22, theme.ease.out);
  const drop = useRamp(16, 30, theme.ease.out);
  const settleIn = useRamp(18, 24, theme.ease.inOut);

  // Damped rocking that dies out to a perfectly level beam.
  const angle = 11 * Math.sin((t - 0.5) * 3.1) * Math.exp(-t * 0.72) * settleIn;
  const rad = (angle * Math.PI) / 180;
  const leftX = PIVOT_X - R * Math.cos(rad);
  const leftY = PIVOT_Y - R * Math.sin(rad);
  const rightX = PIVOT_X + R * Math.cos(rad);
  const rightY = PIVOT_Y + R * Math.sin(rad);

  return (
    <SceneShell>
      <BrandBar chapter="05 · THE SCALE" />

      <AbsoluteFill>
        {/* pillar + base */}
        <div
          style={{
            position: "absolute",
            left: PIVOT_X - 12,
            top: PIVOT_Y,
            width: 24,
            height: 420,
            borderRadius: 12,
            background: aiColors.surfaceLift,
            border: `1.5px solid ${aiColors.lineStrong}`,
            transform: `scaleY(${pillar})`,
            transformOrigin: "bottom",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: PIVOT_X - 170,
            top: PIVOT_Y + 412,
            width: 340,
            height: 22,
            borderRadius: 22,
            background: aiColors.surfaceLift,
            border: `1.5px solid ${aiColors.lineStrong}`,
            transform: `scaleX(${pillar})`,
          }}
        />
        {/* beam */}
        <div
          style={{
            position: "absolute",
            left: PIVOT_X - R,
            top: PIVOT_Y - 6,
            width: R * 2,
            height: 12,
            borderRadius: 12,
            background: aiPalette.text,
            transform: `rotate(${angle}deg) scaleX(${beamIn})`,
            transformOrigin: "center",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: PIVOT_X - 17,
            top: PIVOT_Y - 17,
            width: 34,
            height: 34,
            borderRadius: "50%",
            background: aiColors.surfaceLift,
            border: `2px solid ${aiPalette.text}`,
            transform: `scale(${beamIn})`,
          }}
        />

        {/* pans track the beam ends */}
        <Pan x={leftX} y={leftY} drop={drop}>
          <Chip delay={26} size={27}>
            AI SCALE
          </Chip>
        </Pan>
        <Pan x={rightX} y={rightY} drop={drop}>
          <Chip delay={32} size={27}>
            HUMAN AUTHENTICITY
          </Chip>
        </Pan>

        {/* the verdict — synced to "the audience believes" */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 490,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Chip delay={110} red size={38}>
            THE AUDIENCE DECIDES
          </Chip>
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};
