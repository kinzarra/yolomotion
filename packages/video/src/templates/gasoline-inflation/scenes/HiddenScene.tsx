import React from "react";
import { theme } from "../../../theme";
import { gasColors, gasPalette } from "../palette";
import { Arrow, Brand, PhotoBg, Pill, SceneShell, SceneTitle } from "../ui";

export const HiddenScene: React.FC<{ series: string; episode: string }> = ({ series, episode }) => (
  <SceneShell>
    <PhotoBg src="fuel-nozzle.jpg" dark={0.76} scaleTo={1.05} filter="grayscale(1) contrast(1.2)" />
    <Brand series={series} episode={episode} />
    <SceneTitle top={286} size={67}>Один литр<br />платят много раз</SceneTitle>
    <div
      style={{
        position: "absolute",
        left: 70,
        right: 70,
        top: 590,
        display: "grid",
        gridTemplateColumns: "1fr auto 1fr",
        alignItems: "center",
        gap: 15,
      }}
    >
      <Pill delay={8} color={gasColors.bad} style={{ width: "100%", boxSizing: "border-box", fontSize: 29 }}>⛽ ПОЛЕ</Pill>
      <Arrow delay={12} color={gasColors.bad} />
      <Pill delay={16} color={gasColors.bad} style={{ width: "100%", boxSizing: "border-box", fontSize: 29 }}>⛽ ФУРА</Pill>
      <Pill delay={32} color={gasColors.bad} style={{ width: "100%", boxSizing: "border-box", fontSize: 28 }}>⛽ МАГАЗИН</Pill>
      <Arrow delay={28} color={gasColors.bad} />
      <Pill delay={24} color={gasColors.bad} style={{ width: "100%", boxSizing: "border-box", fontSize: 27 }}>⛽ ЗАВОД</Pill>
    </div>
    <div
      style={{
        position: "absolute",
        left: 72,
        right: 72,
        top: 1080,
        padding: "34px 36px",
        background: gasPalette.primary,
        color: gasColors.ink2,
        font: `900 52px/1.12 ${theme.fonts.wide}`,
        letterSpacing: "-0.035em",
        textTransform: "uppercase",
        transform: "rotate(-1deg)",
      }}
    >
      Спрятан в цене<br />несколько раз
    </div>
  </SceneShell>
);
