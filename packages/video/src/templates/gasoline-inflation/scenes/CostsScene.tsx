import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { theme } from "../../../theme";
import { useIn } from "../../../reel";
import { gasColors, gasPalette } from "../palette";
import { Brand, PhotoBg, SceneShell, SceneTitle } from "../ui";

const ReceiptRow: React.FC<{ label: string; delay: number; amount: string }> = ({ label, delay, amount }) => {
  const p = useIn(delay, "smooth");
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "25px 0",
        borderBottom: `2px dashed ${gasColors.inkRule}`,
        opacity: p,
        transform: `translateX(${interpolate(p, [0, 1], [80, 0])}px)`,
      }}
    >
      <span>{label}</span><span style={{ color: gasColors.bad }}>{amount}</span>
    </div>
  );
};

export const CostsScene: React.FC<{ series: string; episode: string }> = ({ series, episode }) => {
  const frame = useCurrentFrame();
  const total = useIn(44, "snappy");
  const barcodeX = (frame * 5) % 24;
  return (
    <SceneShell>
      <PhotoBg src="delivery-truck.jpg" dark={0.68} scaleTo={1.06} filter="grayscale(1) contrast(1.15)" />
      <Brand series={series} episode={episode} />
      <SceneTitle top={285} size={66}>Расходы идут<br />по цепочке</SceneTitle>
      <div
        style={{
          position: "absolute",
          left: 84,
          right: 84,
          top: 560,
          padding: "46px 46px 52px",
          background: gasColors.paper,
          color: gasColors.ink,
          boxShadow: gasColors.paperShadow,
          font: `800 34px ${theme.fonts.mono}`,
          textTransform: "uppercase",
        }}
      >
        <div style={{ font: `900 42px ${theme.fonts.wide}`, textAlign: "center" }}>СЧЁТ № 0042</div>
        <div style={{ textAlign: "center", marginTop: 10, color: gasColors.inkFaded, fontSize: 22 }}>КАЖДЫЙ ЭТАП ДОБАВЛЯЕТ СВОЁ</div>
        <div style={{ marginTop: 30 }}>
          <ReceiptRow label="ПЕРЕВОЗКА" amount="+" delay={10} />
          <ReceiptRow label="ХРАНЕНИЕ" amount="+" delay={20} />
          <ReceiptRow label="УПАКОВКА" amount="+" delay={30} />
        </div>
        <div
          style={{
            marginTop: 38,
            padding: "22px 20px",
            background: gasColors.ink,
            color: gasPalette.primary,
            font: `900 44px ${theme.fonts.wide}`,
            textAlign: "center",
            opacity: total,
            transform: `scale(${interpolate(total, [0, 1], [1.35, 1])})`,
          }}
        >
          ИТОГО: ДОРОЖЕ
        </div>
        <div
          style={{
            height: 44,
            marginTop: 30,
            backgroundImage: `repeating-linear-gradient(90deg, ${gasColors.ink} 0 4px, transparent 4px 9px, ${gasColors.ink} 9px 13px, transparent 13px 18px)`,
            backgroundPositionX: barcodeX,
          }}
        />
      </div>
    </SceneShell>
  );
};
