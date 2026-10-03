import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../../theme";
import { useIn } from "../../../reel";
import { gasColors, gasPalette } from "../palette";
import { Brand, SceneShell, VideoBg } from "../ui";

export const FieldScene: React.FC<{ series: string; episode: string }> = ({ series, episode }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = useIn(5, "snappy");
  const fuel = interpolate(frame, [8, durationInFrames - 20], [0.88, 0.24], {
    easing: theme.ease.inOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <SceneShell>
      <VideoBg src="combine.mp4" dark={0.28} />
      <Brand series={series} episode={episode} />
      <div
        style={{
          position: "absolute",
          left: 70,
          top: 330,
          padding: "16px 24px",
          background: gasPalette.primary,
          color: gasColors.ink2,
          font: `900 38px ${theme.fonts.wide}`,
          opacity: p,
          transform: `translateX(${interpolate(p, [0, 1], [-90, 0])}px) rotate(-1deg)`,
        }}
      >
        01 / ПОЛЕ
      </div>
      <div
        style={{
          position: "absolute",
          left: 72,
          right: 72,
          top: 870,
          color: gasPalette.text,
          font: `900 88px/1.02 ${theme.fonts.wide}`,
          letterSpacing: "-0.05em",
          textTransform: "uppercase",
        }}
      >
        Трактору<br />нужно топливо
      </div>

      <div style={{ position: "absolute", left: 72, right: 72, top: 1210 }}>
        <div style={{ display: "flex", justifyContent: "space-between", color: gasPalette.textDim, font: `700 24px ${theme.fonts.mono}` }}>
          <span>БАК</span><span>{Math.round(fuel * 100)}%</span>
        </div>
        <div style={{ marginTop: 14, height: 38, border: `3px solid ${gasPalette.text}`, padding: 5 }}>
          <div style={{ width: `${fuel * 100}%`, height: "100%", background: fuel < 0.4 ? gasColors.bad : gasPalette.primary }} />
        </div>
      </div>
    </SceneShell>
  );
};
