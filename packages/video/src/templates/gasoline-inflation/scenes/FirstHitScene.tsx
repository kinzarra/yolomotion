import React from "react";
import { theme } from "../../../theme";
import { gasColors, gasPalette } from "../palette";
import { Brand, PhotoBg, Pill, SceneShell, SceneTitle } from "../ui";

export const FirstHitScene: React.FC<{ series: string; episode: string }> = ({ series, episode }) => (
  <SceneShell>
    <PhotoBg src="delivery-truck.jpg" dark={0.46} scaleTo={1.1} />
    <Brand series={series} episode={episode} />
    <SceneTitle top={300} size={78}>Первыми<br />платят они</SceneTitle>
    <div
      style={{
        position: "absolute",
        left: 76,
        right: 76,
        top: 690,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 24,
      }}
    >
      <Pill delay={10} color={gasColors.bad} style={{ fontSize: 43 }}>🚛 ФУРЫ</Pill>
      <Pill delay={18} style={{ fontSize: 43 }}>🌾 ФЕРМЕРЫ</Pill>
      <Pill delay={26} filled style={{ fontSize: 43 }}>📦 ДОСТАВКА</Pill>
    </div>
    <div
      style={{
        position: "absolute",
        left: 76,
        right: 76,
        top: 1165,
        color: gasPalette.text,
        font: `800 48px/1.18 ${theme.fonts.wide}`,
        textTransform: "uppercase",
      }}
    >
      Машина не нужна.<br />Транспорт уже есть<br /><span style={{ color: gasColors.bad }}>в цене товара.</span>
    </div>
  </SceneShell>
);
