import React from "react";
import { theme } from "../../../theme";
import { useIn } from "../../../reel";
import { gasColors, gasPalette } from "../palette";
import { Arrow, Brand, GlassCard, PhotoBg, SceneShell, SceneTitle } from "../ui";

export const ShortageScene: React.FC<{ series: string; episode: string }> = ({ series, episode }) => {
  const equals = useIn(28, "snappy");
  return (
    <SceneShell>
      <PhotoBg src="gas-queue.jpg" dark={0.5} scaleTo={1.12} />
      <Brand series={series} episode={episode} />
      <SceneTitle top={300} size={78}>Как работает<br />дефицит?</SceneTitle>

      <div style={{ position: "absolute", left: 78, right: 78, top: 590, display: "grid", gap: 24 }}>
        <GlassCard delay={10} accent={gasColors.bad}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ font: `800 48px ${theme.fonts.wide}`, color: gasPalette.text }}>ТОПЛИВА</span>
            <span style={{ font: `900 86px ${theme.fonts.wide}`, color: gasColors.bad }}>↓</span>
          </div>
        </GlassCard>
        <GlassCard delay={18}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ font: `800 48px ${theme.fonts.wide}`, color: gasPalette.text }}>СПРОС</span>
            <span style={{ font: `900 62px ${theme.fonts.wide}`, color: gasPalette.primary }}>=</span>
          </div>
        </GlassCard>
      </div>

      <div
        style={{
          position: "absolute",
          left: 78,
          right: 78,
          top: 1060,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 30,
          opacity: equals,
        }}
      >
        <Arrow delay={28} />
        <div style={{ color: gasPalette.text, font: `800 50px ${theme.fonts.wide}` }}>ЦЕНА</div>
        <div style={{ color: gasColors.bad, font: `900 112px ${theme.fonts.wide}` }}>↑</div>
      </div>
    </SceneShell>
  );
};
