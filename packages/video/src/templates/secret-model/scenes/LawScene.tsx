// Beat 7 — the close. Captions hand the frame over here, so the type owns it.
// The last line is the only hero-colored element in the shot; the brand mark
// stays deliberately quiet under it.
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { useRamp } from "../../../reel";
import { smColors, smPalette } from "../palette";
import { theme } from "../../../theme";
import { BrandBar, Kinetic, SceneShell, VibeMark } from "../ui";

export const LawScene: React.FC<{
  brandName: string;
  chapter: string;
  closingLine: string;
  signOff: string;
}> = ({ brandName, chapter, closingLine, signOff }) => {
  const rule = useRamp(34, 50);
  const sign = useRamp(44, 64);
  const lines = closingLine.split("|");

  return (
    <SceneShell exit={false}>
      <BrandBar brandName={brandName} chapter={chapter} />

      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          padding: "0 74px",
        }}
      >
        <div style={{ width: 932 }}>
          {lines.map((line, i) => (
            <Kinetic
              key={line}
              text={line}
              delay={-6 + i * 7}
              per={3}
              size={94}
              align="center"
              color={i === lines.length - 1 ? smPalette.primary : smPalette.text}
              glow={i === lines.length - 1}
              style={{ justifyContent: "center" }}
            />
          ))}
        </div>

        <div
          style={{
            marginTop: 56,
            width: 320 * rule,
            height: 2,
            background: smColors.lineStrong,
          }}
        />

        <div
          style={{
            marginTop: 40,
            display: "flex",
            alignItems: "center",
            gap: 20,
            opacity: sign,
            transform: `translateY(${interpolate(sign, [0, 1], [22, 0])}px)`,
          }}
        >
          <VibeMark size={54} delay={44} />
          <span
            style={{
              fontFamily: theme.fonts.display,
              fontSize: 42,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: smPalette.textDim,
            }}
          >
            {signOff}
          </span>
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};
