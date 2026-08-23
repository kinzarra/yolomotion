// Beat 6 — the law. Captions hand the frame over here, so the type owns it.
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { theme } from "../../../theme";
import { useRamp } from "../../../reel";
import { rcColors, rcPalette } from "../palette";
import { BrandBar, Kinetic, SceneShell, VibeMark } from "../ui";

export const LawScene: React.FC<{
  brandName: string;
  chapter: string;
  closingLine: string;
  signOff: string;
}> = ({ brandName, chapter, closingLine, signOff }) => {
  const rule = useRamp(52, 68);
  const sign = useRamp(62, 80);
  const lines = closingLine.split("|");

  return (
    <SceneShell exit={false}>
      <BrandBar brandName={brandName} chapter={chapter} />

      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          padding: "0 82px",
        }}
      >
        <div style={{ width: 916 }}>
          {lines.map((line, i) => (
            <Kinetic
              key={line}
              text={line}
              delay={4 + i * 7}
              per={3}
              size={96}
              align="center"
              color={i === lines.length - 1 ? rcPalette.primary : rcPalette.text}
              glow={i === lines.length - 1}
              style={{ justifyContent: "center" }}
            />
          ))}
        </div>

        <div
          style={{
            marginTop: 58,
            width: 320 * rule,
            height: 2,
            background: rcColors.lineStrong,
          }}
        />

        <div
          style={{
            marginTop: 42,
            display: "flex",
            alignItems: "center",
            gap: 20,
            opacity: sign,
            transform: `translateY(${interpolate(sign, [0, 1], [22, 0])}px)`,
          }}
        >
          <VibeMark size={54} delay={62} />
          <span
            style={{
              fontFamily: theme.fonts.display,
              fontSize: 44,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: rcPalette.textDim,
            }}
          >
            {signOff}
          </span>
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};
