import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { theme } from "../../../theme";
import { useIn, usePunch } from "../../../reel";
import { gasColors, gasPalette } from "../palette";
import { Brand, Flash, GlassCard, SceneShell } from "../ui";

export const DefinitionScene: React.FC<{ series: string; episode: string }> = ({ series, episode }) => {
  const frame = useCurrentFrame();
  const title = useIn(4, "snappy");
  const hit = usePunch(24, 16);
  return (
    <SceneShell shake={hit.shake * 0.35}>
      <Brand series={series} episode={episode} />
      <div
        style={{
          position: "absolute",
          left: 70,
          right: 70,
          top: 320,
          color: gasPalette.text,
          font: `900 86px/0.96 ${theme.fonts.wide}`,
          letterSpacing: "-0.055em",
          textTransform: "uppercase",
          opacity: title,
          transform: `scale(${interpolate(title, [0, 1], [1.45, 1])})`,
          transformOrigin: "left center",
        }}
      >
        Инфляция<br /><span style={{ color: gasPalette.primary }}>издержек</span>
      </div>

      <div style={{ position: "absolute", left: 72, right: 72, top: 700, display: "grid", gap: 28 }}>
        <GlassCard delay={18} accent={gasColors.bad}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: gasPalette.textDim, font: `800 38px ${theme.fonts.wide}` }}>АЖИОТАЖ</span>
            <span style={{ color: gasColors.bad, font: `900 76px ${theme.fonts.wide}` }}>×</span>
          </div>
        </GlassCard>
        <GlassCard delay={26}>
          <div style={{ color: gasPalette.text, font: `800 36px ${theme.fonts.wide}` }}>СЕБЕСТОИМОСТЬ</div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 18 }}>
            <div style={{ flex: 1, height: 26, background: gasColors.lineStrong, overflow: "hidden" }}>
              <div
                style={{
                  width: `${Math.min(100, Math.max(0, (frame - 25) * 2.6))}%`,
                  height: "100%",
                  background: gasPalette.primary,
                }}
              />
            </div>
            <span style={{ marginLeft: 24, color: gasPalette.primary, font: `900 74px ${theme.fonts.wide}` }}>↑</span>
          </div>
        </GlassCard>
      </div>

      <div
        style={{
          position: "absolute",
          left: 74,
          right: 74,
          top: 1210,
          color: gasPalette.text,
          font: `800 43px/1.18 ${theme.fonts.wide}`,
          textTransform: "uppercase",
        }}
      >
        Дороже <span style={{ color: gasPalette.primary }}>произвести</span><br />и <span style={{ color: gasPalette.primary }}>привезти.</span>
      </div>
      <Flash amount={hit.energy * 0.45} />
    </SceneShell>
  );
};
