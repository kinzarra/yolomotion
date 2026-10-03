// 07 tax — then the taxes. A payslip prints, the income-tax line comes out
// as 0%, and a lime 0% stamp lands on «ноль»; «целиком» brings the
// 100%-ownership chip.
import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { usePunch } from "../../../reel";
import {
  BrandBar,
  Chip,
  Dust,
  Eyebrow,
  Flash,
  Receipt,
  ReceiptLine,
  ReceiptRule,
  SceneShell,
  Shockwave,
  Stamp,
} from "../ui";

export const TaxScene: React.FC<{ series: string; episode: string }> = ({ series, episode }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const zero = Math.round(2.4 * fps); // «На зарплату — ноль»
  const own = Math.round(4.4 * fps); // «владеет своим бизнесом целиком»
  const hit = usePunch(zero, 14);
  return (
    <SceneShell shake={hit.shake * 0.6}>
      <Dust seed={7} opacity={0.35} />
      <BrandBar series={series} episode={episode} />
      <div style={{ position: "absolute", left: 90, top: 290 }}>
        <Eyebrow delay={0}>НАЛОГИ В ДУБАЕ</Eyebrow>
      </div>

      <div style={{ position: "absolute", left: 120, top: 370, transform: "scale(1.25)", transformOrigin: "top left" }}>
        <Receipt width={670} printFrom={4} printFrames={30} title="РАСЧЁТНЫЙ ЛИСТ" number="AED" tilt={1.5}>
          <ReceiptLine label="ЗАРПЛАТА" value="100%" delay={16} size={32} />
          <ReceiptLine label="НАЛОГ НА ДОХОД" value="0%" delay={zero - 8} size={32} strong />
          <ReceiptRule strong />
          <ReceiptLine label="НА РУКИ" value="100%" mark="check" delay={zero + 6} size={32} strong />
        </Receipt>
      </div>

      <div style={{ position: "absolute", left: 600, top: 830 }}>
        {frame >= zero && (
          <Stamp delay={zero} tone="hero" size={150} rotate={-10}>
            0%
          </Stamp>
        )}
      </div>
      <div style={{ position: "absolute", left: 750, top: 920, width: 0, height: 0 }}>
        <Shockwave at={zero} size={1100} />
      </div>

      <div style={{ position: "absolute", left: 90, top: 1100, display: "flex", flexDirection: "column", gap: 18 }}>
        <Chip delay={own - 16} size={38}>
          ИНОСТРАНЕЦ
        </Chip>
        <Chip delay={own} size={38} tone="paper">
          БИЗНЕС — 100% ТВОЙ
        </Chip>
      </div>
      <Flash amount={hit.energy * 0.6} />
    </SceneShell>
  );
};
