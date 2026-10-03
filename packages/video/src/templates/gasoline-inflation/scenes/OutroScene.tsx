import React from "react";
import { interpolate } from "remotion";
import { theme } from "../../../theme";
import { useIn } from "../../../reel";
import { gasColors, gasPalette } from "../palette";
import { Brand, PhotoBg, SceneShell } from "../ui";

const Row: React.FC<{ label: string; delay: number }> = ({ label, delay }) => {
  const p = useIn(delay, "smooth");
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "17px 0",
        borderBottom: `2px dashed ${gasColors.inkRule}`,
        opacity: p,
        transform: `translateX(${interpolate(p, [0, 1], [55, 0])}px)`,
      }}
    >
      <span>{label}</span><span>₽</span>
    </div>
  );
};

export const OutroScene: React.FC<{ series: string; episode: string }> = ({ series, episode }) => {
  const answer = useIn(28, "snappy");
  return (
    <SceneShell exit={false}>
      <PhotoBg src="checkout.jpg" dark={0.62} scaleTo={1.1} />
      <Brand series={series} episode={episode} />
      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          top: 330,
          padding: "38px 42px 42px",
          background: gasColors.paper,
          color: gasColors.ink,
          boxShadow: gasColors.paperShadow,
          font: `800 31px ${theme.fonts.mono}`,
          textTransform: "uppercase",
          transform: "rotate(0.8deg)",
        }}
      >
        <div style={{ textAlign: "center", font: `900 41px ${theme.fonts.wide}` }}>ТВОЙ ЧЕК</div>
        <div style={{ marginTop: 24 }}>
          <Row label="ХЛЕБ" delay={7} />
          <Row label="МОЛОКО" delay={13} />
          <Row label="ДОСТАВКА" delay={19} />
        </div>
        <div style={{ marginTop: 30, color: gasColors.inkFaded, fontSize: 22, textAlign: "center" }}>В ЦЕНЕ УЖЕ ЕСТЬ ТОПЛИВО</div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 64,
          right: 64,
          top: 1070,
          padding: "28px 30px",
          background: gasPalette.primary,
          color: gasColors.ink2,
          font: `900 66px/1.02 ${theme.fonts.wide}`,
          letterSpacing: "-0.05em",
          textAlign: "center",
          textTransform: "uppercase",
          opacity: answer,
          transform: `scale(${interpolate(answer, [0, 1], [1.4, 1])}) rotate(-1deg)`,
          boxShadow: `0 0 60px ${gasPalette.glow}`,
        }}
      >
        АЗС → ТВОЙ ЧЕК
      </div>

      <div
        style={{
          position: "absolute",
          left: 52,
          right: 52,
          bottom: 38,
          color: gasPalette.textDim,
          font: `500 14px/1.35 ${theme.fonts.mono}`,
          textAlign: "center",
        }}
      >
        Медиа: C. Matthews · Shixart1985 · Sillerkiil · T. Hososhima · Lycée G. Baptiste · Sonny doe / Wikimedia Commons
      </div>
    </SceneShell>
  );
};
