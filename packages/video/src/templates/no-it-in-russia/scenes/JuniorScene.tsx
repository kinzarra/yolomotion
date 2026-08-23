// 07 junior — who actually pays. The staircase is the standard career ladder;
// the bottom two steps dissolve in red and the figure standing on the floor
// has nothing left to step onto. The ladder above it is untouched on purpose:
// the beat is about the entrance, not about the profession.
import React from "react";
import { theme } from "../../../theme";
import { useRamp } from "../../../reel";
import { itColors, itPalette } from "../palette";
import { BrandBar, Eyebrow, Figure, Kinetic, SceneShell, Stairs } from "../ui";

const GONE = 96;

export const JuniorScene: React.FC<{ series: string; episode: string }> = ({ series, episode }) => {
  // Once the steps are gone the figure tries once and settles — a loop of
  // hopping would read as comedy, and this is the beat that has to land.
  const reach = useRamp(GONE + 22, GONE + 40, theme.ease.inOut);
  const lift = Math.sin(reach * Math.PI) * 26;
  return (
    <SceneShell>
      <BrandBar series={series} episode={episode} />

      <div style={{ position: "absolute", left: 90, top: 300 }}>
        <Eyebrow delay={0}>КТО ПОД УДАРОМ</Eyebrow>
      </div>

      <div style={{ position: "absolute", left: 90, right: 90, top: 366 }}>
        <Kinetic
          text="ВХОД В ПРОФЕССИЮ СУЗИЛСЯ"
          delay={4}
          per={4}
          size={82}
          mode="rise"
          bad={[2]}
        />
      </div>

      <div style={{ position: "absolute", left: 150, top: 700 }}>
        <Stairs
          steps={5}
          gone={2}
          goneAt={GONE}
          labels={["СТАЖЁР", "JUNIOR", "MIDDLE", "SENIOR", "LEAD"]}
          width={800}
          height={470}
          delay={16}
        />
      </div>

      {/* The junior, standing where the first step used to be. */}
      <div
        style={{
          position: "absolute",
          // 104 × 1.28 = 133 tall, floor rule at 1172 → top 1039 puts its
          // feet on the line rather than through it. x=300 is the far edge of
          // the hole: standing at 170 the figure covered the «СТАЖЁР» label of
          // the step it is missing, and standing at the gap's edge reads as
          // "the next rung is out of reach" instead.
          left: 300,
          top: 1039,
          transform: `translateY(${-lift}px)`,
        }}
      >
        <Figure size={104} delay={54} tone="bad" breathe />
      </div>

      {/* The floor the whole thing stands on, so the missing steps read as a
          hole rather than as two objects that failed to appear. */}
      <div
        style={{
          position: "absolute",
          left: 90,
          top: 1172,
          width: 900,
          height: 3,
          background: itColors.lineStrong,
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 90,
          top: 1206,
          fontFamily: theme.fonts.mono,
          fontSize: 22,
          fontWeight: 700,
          letterSpacing: "0.14em",
          color: itPalette.textDim,
        }}
      >
        ПЕРВЫЕ СТУПЕНИ <span style={{ color: itColors.bad }}>ЗАБРАЛА НЕЙРОСЕТЬ</span>
      </div>
    </SceneShell>
  );
};
