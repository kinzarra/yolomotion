// Beat 7 — the receipt that says 0 ₽ on every line. The one place the paper
// world gets the whole frame: headline, then the receipt prints, then the
// "in your bank app" chip.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { theme } from "../../../theme";
import { drColors, drPalette } from "../palette";
import { BrandBar, Chip, Eyebrow, Kinetic, Receipt, ReceiptLine, ReceiptRule, SceneShell, rnd } from "../ui";

const PRINT = 12;
const APP = 132;

const Barcode: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [delay, delay + 12], [0, 1], {
    easing: theme.ease.out,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div style={{ display: "flex", gap: 3, height: 54, marginTop: 22, opacity: p, alignItems: "flex-end" }}>
      {Array.from({ length: 46 }, (_, i) => (
        <div
          key={i}
          style={{
            width: 2 + Math.round(rnd(i) * 6),
            height: "100%",
            background: drColors.ink,
            opacity: rnd(i + 99) > 0.3 ? 1 : 0,
          }}
        />
      ))}
    </div>
  );
};

export const ProsScene: React.FC<{ series: string; episode: string }> = ({ series, episode }) => {
  const frame = useCurrentFrame();
  const float = Math.sin(frame / 30) * 4;

  return (
    <SceneShell>
      <BrandBar series={series} episode={episode} />

      <AbsoluteFill style={{ paddingLeft: 72, paddingTop: 330 }}>
        <Eyebrow delay={2}>Плюсы</Eyebrow>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 30, marginTop: 14 }}>
          <Kinetic text="0 ₽" delay={4} per={3} size={150} weight={900} color={drPalette.primary} glow lineHeight={1} />
          <div style={{ paddingBottom: 22 }}>
            <Kinetic text="КОМИССИИ*" delay={10} per={3} size={62} />
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill style={{ alignItems: "center", paddingTop: 620 }}>
        <div style={{ transform: `translateY(${float}px)` }}>
          <Receipt width={700} printFrom={PRINT} printFrames={54} title="ЧЕК · ЦИФРОВОЙ КОШЕЛЁК" number="№ 0007" tilt={-1.5}>
            <ReceiptLine label="ПЕРЕВОД ДРУГУ" value="0 ₽" delay={PRINT + 6} />
            <ReceiptLine label="ОПЛАТА ПОКУПКИ" value="0 ₽" delay={PRINT + 14} />
            <ReceiptLine label="ПЕРЕВОД СЕБЕ" value="0 ₽" delay={PRINT + 22} />
            <ReceiptRule strong />
            <ReceiptLine label="ИТОГО КОМИССИЯ" value="0 ₽*" strong size={34} delay={PRINT + 34} />
            <ReceiptRule />
            <div
              style={{
                fontFamily: theme.fonts.body,
                fontSize: 21,
                fontWeight: 500,
                letterSpacing: 0,
                color: drColors.inkFaded,
                lineHeight: 1.3,
              }}
            >
              * для операций граждан с цифровыми рублями
            </div>
            <Barcode delay={PRINT + 46} />
          </Receipt>
        </div>
      </AbsoluteFill>

      <AbsoluteFill style={{ alignItems: "center", paddingTop: 1236 }}>
        <Chip delay={APP} tone="neutral" size={28}>
          <span
            style={{
              display: "inline-block",
              width: 16,
              height: 26,
              borderRadius: 4,
              border: `2px solid ${drPalette.text}`,
            }}
          />
          В ПРИЛОЖЕНИИ БАНКА
        </Chip>
      </AbsoluteFill>
    </SceneShell>
  );
};
