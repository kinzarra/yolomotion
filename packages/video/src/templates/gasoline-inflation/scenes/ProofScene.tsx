import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../../theme";
import { useIn } from "../../../reel";
import { gasColors, gasPalette } from "../palette";
import { Brand, PhotoBg, SceneShell, TinySource } from "../ui";

export const ProofScene: React.FC<{
  series: string;
  episode: string;
  gasolineIncrease: string;
  inflation: string;
  source: string;
}> = ({ series, episode, gasolineIncrease, inflation, source }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const gasIn = useIn(5, "snappy");
  const cpiIn = useIn(20, "smooth");
  const pulse = 1 + Math.sin(frame / (fps * 0.14)) * 0.018;
  return (
    <SceneShell>
      <PhotoBg src="fuel-nozzle.jpg" dark={0.58} scaleTo={1.15} filter="saturate(0.5) contrast(1.2)" />
      <Brand series={series} episode={episode} />
      <div style={{ position: "absolute", left: 76, right: 76, top: 330 }}>
        <div style={{ color: gasPalette.textDim, font: `700 28px ${theme.fonts.mono}`, letterSpacing: "0.12em" }}>
          С НАЧАЛА 2026 ГОДА
        </div>
        <div
          style={{
            marginTop: 42,
            color: gasColors.bad,
            fontFamily: theme.fonts.wide,
            fontSize: 208,
            fontWeight: 900,
            lineHeight: 0.88,
            letterSpacing: "-0.07em",
            opacity: gasIn,
            transform: `scale(${interpolate(gasIn, [0, 1], [1.8, pulse])})`,
            transformOrigin: "left center",
            filter: `drop-shadow(0 0 54px ${gasColors.badGlow})`,
          }}
        >
          {gasolineIncrease}
        </div>
        <div style={{ color: gasPalette.text, font: `900 63px ${theme.fonts.wide}`, marginTop: 22 }}>БЕНЗИН</div>

        <div
          style={{
            marginTop: 98,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: `3px solid ${gasColors.lineStrong}`,
            paddingTop: 38,
            opacity: cpiIn,
            transform: `translateY(${interpolate(cpiIn, [0, 1], [60, 0])}px)`,
          }}
        >
          <span style={{ color: gasPalette.textDim, font: `700 32px ${theme.fonts.mono}` }}>ОБЩАЯ ИНФЛЯЦИЯ</span>
          <span style={{ color: gasPalette.primary, font: `900 94px ${theme.fonts.wide}` }}>{inflation}</span>
        </div>
      </div>
      <TinySource top={1270}>{source}</TinySource>
    </SceneShell>
  );
};
