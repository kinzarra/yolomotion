// 06 insight — the beat the whole reel exists for. Two desks: one with a
// developer working at it, one that was budgeted and never filled. The empty
// one does not get a person — it becomes the assistant. Nobody is fired on
// screen, because nobody is fired in the argument.
import React from "react";
import { theme } from "../../../theme";
import { useRamp, usePunch } from "../../../reel";
import { itColors, itPalette } from "../palette";
import { BrandBar, Desk, Eyebrow, Flash, Kinetic, SceneShell, Strike } from "../ui";

const SWAP = 132;

export const InsightScene: React.FC<{ series: string; episode: string }> = ({ series, episode }) => {
  // Crossfade rather than a hard swap: the dashed desk and the AI desk are the
  // same object, and a cut would read as two different desks.
  const morph = useRamp(SWAP, SWAP + 18, theme.ease.inOut);
  const punch = usePunch(SWAP, 20);
  return (
    <SceneShell shake={punch.shake * 0.6}>
      <BrandBar series={series} episode={episode} />

      <div style={{ position: "absolute", left: 90, top: 300 }}>
        <Eyebrow delay={0}>ГЛАВНОЕ</Eyebrow>
      </div>

      {/* The wrong reading, struck out, then the right one. */}
      {/* 64, not 86: at 86 «НЕ УВОЛЬНЕНИЕ» broke over two lines, the strike
          crossed the gap between them instead of the words, and the second
          headline landed on top of it. One line, struck through, then the
          correction well below it. */}
      <div style={{ position: "absolute", left: 90, right: 90, top: 380 }}>
        <div style={{ position: "relative", display: "inline-block" }}>
          <Kinetic text="НЕ УВОЛЬНЕНИЕ" delay={4} per={4} size={64} mode="rise" color={itPalette.textDim} />
          <Strike delay={40} thick={11} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 90, right: 90, top: 508 }}>
        <Kinetic text="А ОТМЕНА НАЙМА" delay={54} per={4} size={92} mode="snap" bad={[1, 2]} />
      </div>

      <div
        style={{
          position: "absolute",
          left: 90,
          right: 90,
          top: 790,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: 80,
        }}
      >
        <Desk state="taken" delay={44} width={320} label="РАЗРАБОТЧИК" labelDelay={58} />

        {/* One slot, two states. Both are mounted so the swap is a dissolve. */}
        <div style={{ position: "relative", width: 320 }}>
          <div style={{ opacity: 1 - morph }}>
            <Desk state="empty" delay={66} width={320} label="ВТОРОЙ — В ПЛАНЕ" labelDelay={78} />
          </div>
          <div style={{ position: "absolute", left: 0, top: 0, opacity: morph }}>
            <Desk state="ai" delay={SWAP} width={320} label="ВМЕСТО НЕГО" labelDelay={SWAP + 10} />
          </div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 90,
          right: 90,
          top: 1236,
          textAlign: "center",
          fontFamily: theme.fonts.mono,
          fontSize: 23,
          fontWeight: 700,
          letterSpacing: "0.14em",
          color: itPalette.textDim,
          opacity: morph,
        }}
      >
        ШТАТ ТОТ ЖЕ · <span style={{ color: itColors.bad }}>ВАКАНСИИ НЕТ</span>
      </div>

      <Flash amount={punch.energy * 0.45} />
    </SceneShell>
  );
};
