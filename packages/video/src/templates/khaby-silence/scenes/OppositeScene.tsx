import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { theme } from "../../../theme";
import { ksColors, ksPalette } from "../palette";
import { Eyebrow, Kinetic, Mono, Photo, SceneShell, Slam, useRamp } from "../ui";

// 23.5–28s. The reset. Black, then THE OPPOSITE.; one object (the banana,
// as a single line), one instruction (1. PEEL.), and the gesture rises in
// under it. Then THE OPPOSITE. is hard-cut for THAT'S IT. — and it holds.
const TITLE_AT = 14;
const OBJECT_AT = 50;
const PHOTO_AT = 56;
const SWAP_AT = 92;

export const OppositeScene: React.FC<{ photo: string }> = ({ photo }) => {
  const frame = useCurrentFrame();
  const draw = useRamp(OBJECT_AT, OBJECT_AT + 18, theme.ease.out);
  const label = useRamp(OBJECT_AT + 16, OBJECT_AT + 26, theme.ease.out);

  return (
    <SceneShell>
      {/* headline slot — one idea at a time */}
      <div
        style={{
          position: "absolute",
          left: 72,
          right: 72,
          top: 300,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 22,
        }}
      >
        {frame < SWAP_AT ? (
          <>
            <Eyebrow delay={TITLE_AT - 4}>So Khaby did</Eyebrow>
            <div style={{ display: "flex", gap: 30, alignItems: "baseline" }}>
              <Kinetic text="THE" delay={TITLE_AT + 4} size={124} />
              <Kinetic text="OPPOSITE." delay={TITLE_AT + 8} size={124} color={ksPalette.primary} />
            </div>
          </>
        ) : (
          <Slam text="THAT'S IT." at={SWAP_AT} size={156} />
        )}
      </div>

      {/* one object, one instruction */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 600,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 26,
        }}
      >
        <svg width={300} height={150} viewBox="0 0 300 150">
          <path
            d="M30,118 C60,48 170,24 262,62 C196,56 102,80 50,136 Z"
            fill="none"
            stroke={ksColors.bone}
            strokeWidth={3}
            strokeLinejoin="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - draw}
          />
          <path
            d="M262,62 L284,50"
            fill="none"
            stroke={ksColors.bone}
            strokeWidth={3}
            strokeLinecap="round"
            opacity={draw > 0.9 ? 1 : 0}
          />
        </svg>
        <Mono size={26} color={ksColors.bone} style={{ opacity: label, transform: `translateY(${(1 - label) * 12}px)` }}>
          1. Peel.
        </Mono>
      </div>

      {/* the gesture */}
      <AbsoluteFill style={{ alignItems: "center" }}>
        <div style={{ position: "absolute", left: 60, top: 900 }}>
          <Photo src={photo} width={960} delay={PHOTO_AT} rise={180} kb={1.03} fade={260} />
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};
