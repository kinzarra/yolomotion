// 04 economy — cause №1. Five people who already work here stay; the two
// positions the company had budgeted arrive as dashed outlines and are struck
// out. Then the receipt prints what that costs, in the series' paper voice.
import React from "react";
import { theme } from "../../../theme";
import { useRamp } from "../../../reel";
import { itColors, itPalette } from "../palette";
import {
  BrandBar,
  Cross,
  Eyebrow,
  Figure,
  Kinetic,
  Receipt,
  ReceiptLine,
  ReceiptRule,
  SceneShell,
} from "../ui";

const TEAM = 5;
const GHOSTS = 2;
const GHOST_IN = 44;
const CROSS = 62;

export const EconomyScene: React.FC<{ series: string; episode: string }> = ({ series, episode }) => {
  // The dashed hires fade back out once they are crossed — they were never
  // there, and leaving them standing would read as "two people got fired".
  const gone = useRamp(CROSS + 16, CROSS + 34, theme.ease.in);
  // The tally has to arrive WITH the dashed hires, not before them: shown from
  // frame 0 it announced «+2 НЕ ВЫШЛИ» a second and a half before there was
  // anything on screen that had not turned up.
  const tally = useRamp(GHOST_IN, GHOST_IN + 12, theme.ease.out);
  return (
    <SceneShell>
      <BrandBar series={series} episode={episode} />

      <div style={{ position: "absolute", left: 90, top: 300 }}>
        <Eyebrow delay={0}>ПРИЧИНА №1</Eyebrow>
      </div>

      <div style={{ position: "absolute", left: 90, right: 90, top: 366 }}>
        <Kinetic text="ЭКОНОМИКА ЗАМЕДЛЯЕТСЯ" delay={4} per={4} size={86} mode="rise" />
      </div>

      {/* The team, then the gap where the two hires were meant to go. */}
      <div
        style={{
          position: "absolute",
          left: 90,
          top: 640,
          display: "flex",
          alignItems: "flex-end",
          gap: 26,
        }}
      >
        {Array.from({ length: TEAM }, (_, i) => (
          <Figure key={i} size={96} delay={14 + i * 4} tone="bone" breathe />
        ))}
        <div style={{ width: 22 }} />
        {Array.from({ length: GHOSTS }, (_, i) => (
          <div key={i} style={{ position: "relative", opacity: 1 - gone * 0.82 }}>
            <Figure size={96} delay={GHOST_IN + i * 5} tone="bad" ghost />
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 8,
                width: 96,
                height: 96,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Cross delay={CROSS + i * 5} size={92} thick={11} />
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          position: "absolute",
          left: 90,
          top: 790,
          fontFamily: theme.fonts.mono,
          fontSize: 21,
          fontWeight: 700,
          letterSpacing: "0.14em",
          color: itPalette.textDim,
          opacity: tally,
          transform: `translateY(${(1 - tally) * 10}px)`,
        }}
      >
        КОМАНДА 5 <span style={{ color: itColors.bad }}>+2 НЕ ВЫШЛИ</span>
      </div>

      <div style={{ position: "absolute", left: 90, top: 880 }}>
        <Receipt width={640} printFrom={72} printFrames={34} title="ЧТО РЕШИЛА КОМПАНИЯ" number="Q3">
          <ReceiptLine label="НОВЫЕ ПРОЕКТЫ" value="ОТЛОЖЕНЫ" mark="cross" delay={96} />
          <ReceiptLine label="НАЙМ" value="ЗАМОРОЖЕН" mark="cross" delay={108} />
          <ReceiptRule />
          <ReceiptLine label="ЗАДАЧ БОЛЬШЕ — ЛЮДЕЙ СТОЛЬКО ЖЕ" strong delay={120} />
        </Receipt>
      </div>
    </SceneShell>
  );
};
