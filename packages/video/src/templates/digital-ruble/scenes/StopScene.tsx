// Beat 2 — СТОП. Three candidates for "what is it": ₿, a banknote, the ₽
// mark. The first two get crossed out and thrown out of the frame; the mark
// takes the middle. A receipt below keeps score.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { theme } from "../../../theme";
import { usePunch } from "../../../reel";
import { drColors, drPalette } from "../palette";
import { Banknote, BrandBar, Cross, Flash, Receipt, ReceiptLine, RubleMark, SceneShell, Stamp, Token } from "../ui";

const STAMP = 2;
const CARDS = 22;
const CROSS_A = 46;
const CROSS_B = 58;
const THROW = 74;
const CENTER = 90;

export const StopScene: React.FC<{ series: string; episode: string }> = ({ series, episode }) => {
  const frame = useCurrentFrame();
  const punch = usePunch(STAMP + 6, 18);
  const throwP = interpolate(frame, [THROW, THROW + 12], [0, 1], {
    easing: theme.ease.in,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const center = interpolate(frame, [CENTER, CENTER + 22], [0, 1], {
    easing: theme.ease.out,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const float = Math.sin(frame / 24) * 5;

  return (
    <SceneShell shake={punch.shake}>
      <BrandBar series={series} episode={episode} />

      <AbsoluteFill style={{ alignItems: "center", paddingTop: 350 }}>
        <Stamp delay={STAMP} size={150} rotate={-6}>
          СТОП.
        </Stamp>
      </AbsoluteFill>

      {/* the three candidates, one row */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 700,
          height: 260,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 40,
        }}
      >
        {/* ₿ — crossed, thrown left */}
        <div
          style={{
            position: "relative",
            transform: `translate(${-throwP * 760}px, ${throwP * 220}px) rotate(${-throwP * 70}deg) translateY(${float}px)`,
            opacity: 1 - throwP,
          }}
        >
          <Token size={240} tone="dark" delay={CARDS} label="₿" />
          {frame >= CROSS_A && (
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Cross delay={CROSS_A} size={210} thick={20} />
            </div>
          )}
        </div>
        {/* the note — crossed, thrown right */}
        <div
          style={{
            position: "relative",
            transform: `translate(${throwP * 780}px, ${throwP * 260}px) rotate(${throwP * 60}deg) translateY(${-float}px)`,
            opacity: 1 - throwP,
          }}
        >
          <Banknote width={380} delay={CARDS + 5} />
          {frame >= CROSS_B && (
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Cross delay={CROSS_B} size={210} thick={20} />
            </div>
          )}
        </div>
        {/* the mark — stays, slides to the middle once the others are gone */}
        <div
          style={{
            transform: `translateX(${center * -350}px) scale(${1 + center * 0.2}) translateY(${float * 0.5}px)`,
          }}
        >
          <RubleMark size={240} delay={CARDS + 10} lit={frame >= CENTER} />
        </div>
      </div>

      <AbsoluteFill style={{ alignItems: "center", paddingTop: 1040 }}>
        <Receipt width={640} printFrom={CROSS_A - 8} printFrames={34} title="ПРОВЕРКА" number="№ 0002">
          <ReceiptLine label="НЕ КРИПТА" mark="cross" delay={CROSS_A + 2} />
          <ReceiptLine label="НАЛИЧНЫЕ НЕ ОТМЕНЯЮТ" mark="cross" delay={CROSS_B + 2} />
        </Receipt>
      </AbsoluteFill>

      <Flash amount={punch.pop * 0.7} color={drColors.bad} />
      {/* the mark's arrival gets a lime tick of light, not a red one */}
      <Flash amount={interpolate(frame, [CENTER, CENTER + 3, CENTER + 14], [0, 0.5, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} color={drPalette.primary} />
    </SceneShell>
  );
};
