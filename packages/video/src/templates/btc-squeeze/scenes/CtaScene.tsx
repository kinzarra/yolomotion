// Beat 9 — the twist. The line freezes, two indicators light up — ETF-ПРИТОКИ
// (lime ↑) and ДОХОДНОСТИ (red ?) — the headline swaps to СМОТРИ НА ДЕНЬГИ,
// А НЕ НА СВЕЧИ, and the chain prints as a receipt with ЦЕНА as its last line.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { theme } from "../../../theme";
import { useIn } from "../../../reel";
import { btcPalette } from "../palette";
import { BrandBar, Eyebrow, Indicator, Kinetic, Receipt, ReceiptLine, ReceiptRule, SceneShell, useExit } from "../ui";

const HEAD = 4;
const TILE_A = 72; // «деньги в ETF»
const TILE_B = 142; // «доходности вверх»
const SWAP = 198; // «Сохрани эту цепочку»
const RECEIPT = 128;
const PRICE = 250; // «Цена — последнее звено»
const NOTE = 16;

export const CtaScene: React.FC<{ series: string; episode: string; dataDate: string; footnote: string }> = ({
  series,
  episode,
  dataDate,
  footnote,
}) => {
  const frame = useCurrentFrame();
  const headOut = useExit(SWAP - 10, 10);
  const note = useIn(NOTE, "smooth");

  return (
    <SceneShell exit={false}>
      <BrandBar series={series} episode={episode} />

      <AbsoluteFill style={{ alignItems: "center", paddingTop: 330 }}>
        <Eyebrow delay={2}>Что смотреть дальше</Eyebrow>
        <div style={{ position: "relative", width: 960, marginTop: 18, minHeight: 190 }}>
          {headOut < 1 && (
            <div style={{ position: "absolute", inset: 0, opacity: 1 - headOut, transform: `translateY(${-headOut * 40}px)` }}>
              <Kinetic text="ДВЕ ВЕЩИ" delay={HEAD} per={5} size={110} align="center" mode="snap" style={{ justifyContent: "center" }} />
            </div>
          )}
          {frame >= SWAP && (
            <Kinetic
              text="СМОТРИ НА ДЕНЬГИ, А НЕ НА СВЕЧИ"
              delay={SWAP}
              per={4}
              size={66}
              align="center"
              mode="snap"
              hero={[2]}
              bad={[6]}
              style={{ justifyContent: "center" }}
            />
          )}
        </div>
        <div style={{ display: "flex", gap: 40, marginTop: 30 }}>
          <Indicator label="ETF-ПРИТОКИ" tone="hero" glyph="up" delay={TILE_A} width={440} />
          <Indicator label="ДОХОДНОСТИ" tone="bad" glyph="question" delay={TILE_B} width={440} />
        </div>
      </AbsoluteFill>

      <AbsoluteFill style={{ alignItems: "center", paddingTop: 1010 }}>
        <Receipt width={700} printFrom={RECEIPT} printFrames={30} title="ЦЕПОЧКА · СОХРАНИ" number={dataDate} tilt={-1.2}>
          <ReceiptLine label="ГОСДОЛГ → ПРАВИЛА" size={25} delay={RECEIPT + 6} />
          <ReceiptLine label="→ ШОРТЫ → ETF" size={25} delay={RECEIPT + 14} />
          <ReceiptRule strong />
          <ReceiptLine label="ПОСЛЕДНЕЕ ЗВЕНО" value="ЦЕНА" strong size={27} mark="check" delay={PRICE} />
        </Receipt>
      </AbsoluteFill>

      {/* the disclaimer: always on, under the captions, inside the safe zone */}
      <div
        style={{
          position: "absolute",
          left: 90,
          right: 90,
          top: 1610,
          textAlign: "center",
          fontFamily: theme.fonts.body,
          fontSize: 26,
          fontWeight: 500,
          letterSpacing: "0.02em",
          lineHeight: 1.3,
          color: btcPalette.text,
          opacity: note * 0.7,
          transform: `translateY(${(1 - note) * 14}px)`,
        }}
      >
        {footnote}
      </div>
    </SceneShell>
  );
};
