import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { theme } from "../../../theme";
import { secColors, secPalette } from "../palette";
import { Kinetic, SceneShell, VibeMark, useIn, useRamp } from "../ui";

/** 24.6–30.0s — almost-black frame, the rule, then the quiet sign-off. */
export const EndScene: React.FC<{
  brandName: string;
  closingLine: string;
  tagline: string;
}> = ({ brandName, closingLine, tagline }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [top, bottom] = closingLine.split("|");
  const rule = useRamp(78, 96, theme.ease.out);
  const foot = useIn(104, "smooth");
  const mark = useIn(116, "bouncy");
  const breathe = 1 + Math.sin((frame / fps) * 1.6) * 0.006;

  return (
    <SceneShell exit={false} quiet>
      <AbsoluteFill
        style={{
          padding: "360px 90px 320px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          transform: `scale(${breathe})`,
        }}
      >
        <Kinetic
          text={top}
          size={104}
          delay={8}
          per={3}
          align="center"
          style={{ justifyContent: "center" }}
        />
        <div style={{ marginTop: 26 }}>
          <Kinetic
            text={bottom ?? ""}
            size={112}
            delay={34}
            per={3}
            align="center"
            color={secPalette.primary}
            glow
            style={{ justifyContent: "center" }}
          />
        </div>

        <div
          style={{
            marginTop: 74,
            width: 260 * rule,
            height: 2,
            background: secColors.lineStrong,
          }}
        />

        <div
          style={{
            marginTop: 60,
            fontFamily: theme.fonts.mono,
            fontSize: 30,
            letterSpacing: "0.16em",
            color: secPalette.textDim,
            opacity: foot * 0.95,
            transform: `translateY(${interpolate(foot, [0, 1], [18, 0])}px)`,
          }}
        >
          {tagline}
        </div>

        <div
          style={{
            marginTop: 54,
            display: "flex",
            alignItems: "center",
            gap: 20,
            opacity: mark * 0.9,
            transform: `translateY(${interpolate(mark, [0, 1], [22, 0])}px)`,
          }}
        >
          <VibeMark size={64} delay={116} />
          <span
            style={{
              fontFamily: theme.fonts.display,
              fontSize: 46,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: secPalette.text,
            }}
          >
            {brandName}
          </span>
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};
