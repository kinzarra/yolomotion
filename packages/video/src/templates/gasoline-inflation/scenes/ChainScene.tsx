import React from "react";
import { theme } from "../../../theme";
import { gasPalette } from "../palette";
import { Arrow, Brand, Pill, SceneShell, SceneTitle, VideoBg } from "../ui";

export const ChainScene: React.FC<{ series: string; episode: string }> = ({ series, episode }) => (
  <SceneShell>
    <VideoBg src="bakery.mp4" trimBefore={510} dark={0.45} />
    <Brand series={series} episode={episode} />
    <SceneTitle top={292} size={69}>Путь одной<br />буханки</SceneTitle>
    <div
      style={{
        position: "absolute",
        left: 74,
        right: 74,
        top: 630,
        display: "grid",
        gridTemplateColumns: "1fr auto 1fr",
        alignItems: "center",
        gap: 14,
      }}
    >
      <Pill delay={8} filled style={{ width: "100%", boxSizing: "border-box", fontSize: 29 }}>МЕЛЬНИЦА</Pill>
      <Arrow delay={14} />
      <Pill delay={18} style={{ width: "100%", boxSizing: "border-box", fontSize: 27 }}>ХЛЕБОЗАВОД</Pill>
      <div />
      <Arrow delay={26} vertical />
      <div />
      <Pill delay={28} style={{ width: "100%", boxSizing: "border-box", fontSize: 30 }}>СКЛАД</Pill>
      <Arrow delay={32} color={gasPalette.text} />
      <Pill delay={38} style={{ width: "100%", boxSizing: "border-box", fontSize: 30 }}>МАГАЗИН</Pill>
    </div>
    <div
      style={{
        position: "absolute",
        left: 74,
        right: 74,
        top: 1190,
        color: gasPalette.text,
        font: `800 45px/1.18 ${theme.fonts.wide}`,
        textTransform: "uppercase",
      }}
    >
      И между каждым<br />этапом — <span style={{ color: gasPalette.primary }}>дорога.</span>
    </div>
  </SceneShell>
);
