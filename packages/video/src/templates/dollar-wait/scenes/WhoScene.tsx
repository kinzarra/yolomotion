// Beat 9 — who actually needs the currency. The receipt prints four real
// reasons, each ticked, then a rule and the one line that gets a red cross:
// the ruble cushion, which stays in rubles. The lime chip at the bottom is the
// instruction the ticks add up to.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import {
  BrandBar,
  Chip,
  Eyebrow,
  Kinetic,
  Receipt,
  ReceiptLine,
  ReceiptRule,
  SceneShell,
} from "../ui";

const HEAD = 4;
const PRINT = 10;
const L1 = 24;
const STEP = 18;
const CUSHION = 118;
const RULE = 162;

export const WhoScene: React.FC<{ series: string; episode: string }> = ({ series, episode }) => {
  const frame = useCurrentFrame();
  return (
    <SceneShell>
      <BrandBar series={series} episode={episode} />

      <div style={{ position: "absolute", left: 90, top: 300 }}>
        <Eyebrow delay={0}>КОМУ ПОКУПАТЬ УЖЕ СЕЙЧАС</Eyebrow>
      </div>

      <div style={{ position: "absolute", left: 90, right: 90, top: 362 }}>
        <Kinetic text="ЕСТЬ РАСХОД В ВАЛЮТЕ?" delay={HEAD} per={4} size={80} mode="rise" />
      </div>

      <AbsoluteFill style={{ alignItems: "center", paddingTop: 576 }}>
        <Receipt width={760} printFrom={PRINT} printFrames={24} title="ЗАЧЕМ ВАМ ВАЛЮТА" number="№ 04">
          <ReceiptLine label="ПОЕЗДКА ЗА ГРАНИЦУ" mark="check" delay={L1} size={29} />
          <ReceiptLine label="УЧЁБА" mark="check" delay={L1 + STEP} size={29} />
          <ReceiptLine label="ЛЕЧЕНИЕ" mark="check" delay={L1 + STEP * 2} size={29} />
          <ReceiptLine label="ПЛАТЕЖИ ЗА РУБЕЖ" mark="check" delay={L1 + STEP * 3} size={29} />
          <ReceiptRule strong />
          <ReceiptLine
            label="РУБЛЁВАЯ ПОДУШКА"
            value="В РУБЛЯХ"
            mark="cross"
            delay={CUSHION}
            size={29}
            strong
          />
        </Receipt>
      </AbsoluteFill>

      {frame >= RULE && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1230, display: "flex", justifyContent: "center" }}>
          <Chip delay={RULE} tone="hero" size={30}>
            ЕСТЬ РАСХОД → ПОКУПАТЬ ЧАСТЯМИ
          </Chip>
        </div>
      )}
    </SceneShell>
  );
};
