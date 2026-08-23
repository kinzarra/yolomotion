// Beat 5 — the causes, printed. Three lines come off a thermal receipt, one
// per factor, and the third one gets a dial: the key rate swinging down to
// where it is now. Paper carries the facts; the dial is the only lit thing.
import React from "react";
import { AbsoluteFill } from "remotion";
import {
  BrandBar,
  Eyebrow,
  Kinetic,
  RateDial,
  Receipt,
  ReceiptLine,
  ReceiptRule,
  SceneShell,
} from "../ui";

const HEAD = 4;
const PRINT = 8;
const L1 = 22;
const L2 = 42;
const L3 = 62;
const DIAL = 84;

export const WhyScene: React.FC<{ series: string; episode: string; keyRate: string }> = ({
  series,
  episode,
  keyRate,
}) => (
  <SceneShell>
    <BrandBar series={series} episode={episode} />

    <div style={{ position: "absolute", left: 90, top: 300 }}>
      <Eyebrow delay={0}>БЕЗ МАГИИ И БЕЗ ОДНОЙ ПРИЧИНЫ</Eyebrow>
    </div>

    <div style={{ position: "absolute", left: 90, right: 90, top: 362 }}>
      <Kinetic text="ТРИ ПРИЧИНЫ" delay={HEAD} per={4} size={78} mode="rise" />
    </div>

    <AbsoluteFill style={{ alignItems: "center", paddingTop: 552 }}>
      <Receipt width={700} printFrom={PRINT} printFrames={22} title="ПОЧЕМУ РУБЛЬ ОСЛАБ" number="№ 03">
        <ReceiptLine label="1  ЭКСПОРТНАЯ ВЫРУЧКА" value="↓" delay={L1} size={30} strong />
        <ReceiptRule />
        <ReceiptLine label="2  СПРОС НА ИМПОРТ" value="↑" delay={L2} size={30} strong />
        <ReceiptRule />
        <ReceiptLine label="3  КЛЮЧЕВАЯ СТАВКА" value="↓" delay={L3} size={30} strong />
      </Receipt>
    </AbsoluteFill>

    <AbsoluteFill style={{ alignItems: "center", paddingTop: 986 }}>
      <RateDial
        from={16}
        to={14}
        max={20}
        label="КЛЮЧЕВАЯ СТАВКА"
        value={keyRate}
        delay={DIAL}
        size={340}
      />
    </AbsoluteFill>
  </SceneShell>
);
