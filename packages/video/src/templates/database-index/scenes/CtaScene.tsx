import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { theme } from "../../../theme";
import { idxColors, idxPalette } from "../palette";
import { Kinetic, SceneShell, VibeMark, useIn, useRamp } from "../ui";

/** 25.6–30.0s — "That's why indexes matter." Minimal end card, no pitch. */
export const CtaScene: React.FC<{
  brandName: string;
  chapter: string;
  closingLine: string;
}> = ({ brandName, chapter, closingLine }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rule = useRamp(34, 54, theme.ease.out);
  const mark = useIn(46, "bouncy");
  const foot = useIn(58, "smooth");
  const breathe = 1 + Math.sin((frame / fps) * 1.6) * 0.006;

  return (
    <SceneShell exit={false}>
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
          text={closingLine}
          size={100}
          delay={4}
          per={3}
          align="center"
          style={{ justifyContent: "center" }}
        />

        <div
          style={{
            marginTop: 76,
            width: 260 * rule,
            height: 2,
            background: idxColors.lineStrong,
          }}
        />

        <div
          style={{
            marginTop: 66,
            display: "flex",
            alignItems: "center",
            gap: 22,
            opacity: mark,
            transform: `translateY(${interpolate(mark, [0, 1], [26, 0])}px)`,
          }}
        >
          <VibeMark size={78} delay={46} />
          <span
            style={{
              fontFamily: theme.fonts.display,
              fontSize: 58,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: idxPalette.text,
            }}
          >
            {brandName}
          </span>
        </div>

        <div
          style={{
            marginTop: 30,
            fontFamily: theme.fonts.mono,
            fontSize: 24,
            letterSpacing: "0.2em",
            color: idxPalette.textDim,
            opacity: foot * 0.9,
            transform: `translateY(${interpolate(foot, [0, 1], [16, 0])}px)`,
          }}
        >
          {chapter}
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};
