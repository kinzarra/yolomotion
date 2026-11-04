// 11 answer — the conclusion as a receipt: not oil, service. What the city
// sells prints line by line and totals to УДОБСТВО.
import React from "react";
import { useVideoConfig } from "remotion";
import {
  BrandBar,
  Dust,
  Eyebrow,
  Kinetic,
  Receipt,
  ReceiptLine,
  ReceiptRule,
  SceneShell,
} from "../ui";

export const AnswerScene: React.FC<{ series: string; episode: string }> = ({ series, episode }) => {
  const { fps } = useVideoConfig();
  const sells = Math.round(3.4 * fps); // «который продаёт удобство»
  return (
    <SceneShell>
      <Dust seed={11} />
      <BrandBar series={series} episode={episode} />
      <div style={{ position: "absolute", left: 90, top: 290 }}>
        <Eyebrow delay={0}>ИТОГ</Eyebrow>
      </div>
      <div style={{ position: "absolute", left: 90, right: 90, top: 350 }}>
        <Kinetic text="НЕ НЕФТЬ. СЕРВИС." delay={8} per={5} size={104} bad={[1]} hero={[2]} />
      </div>
      <div style={{ position: "absolute", left: 120, top: 640, transform: "scale(1.25)", transformOrigin: "top left" }}>
        <Receipt width={670} printFrom={24} printFrames={40} title="ДУБАЙ ПРОДАЁТ" number="ЧЕК № 07" tilt={-1.5}>
          <ReceiptLine label="ДОЛЕТЕТЬ ЗА 8 Ч" mark="check" delay={40} />
          <ReceiptLine label="ОТКРЫТЬ КОМПАНИЮ" mark="check" delay={50} />
          <ReceiptLine label="НАЛОГ НА ЗАРПЛАТУ" value="0%" delay={60} />
          <ReceiptRule strong />
          <ReceiptLine label="ИТОГО" value="УДОБСТВО" delay={sells} size={34} strong />
        </Receipt>
      </div>
    </SceneShell>
  );
};
