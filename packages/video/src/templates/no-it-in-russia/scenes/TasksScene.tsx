// 05 tasks — what the assistant actually took. Four cards, taken one at a
// time in the order the voice names them, each with a lime sweep and an AI
// tag. The stagger is the point: a simultaneous grey-out would say "all
// programming", and the script says "the simple half of it".
import React from "react";
import { theme } from "../../../theme";
import { useIn } from "../../../reel";
import { itPalette } from "../palette";
import { BrandBar, Chip, Eyebrow, Kinetic, SceneShell, TaskCard } from "../ui";

// Card n enters 6 frames after n-1 and is taken 34 frames apart, which tracks
// the read: «шаблонный код, тесты, документацию, поиск ошибок и первую линию».
const CARDS = [
  { label: "ШАБЛОННЫЙ КОД", taken: 70 },
  { label: "ТЕСТЫ", taken: 104 },
  { label: "ДОКУМЕНТАЦИЯ", taken: 138 },
  { label: "ПЕРВАЯ ЛИНИЯ", taken: 172 },
];

export const TasksScene: React.FC<{ series: string; episode: string }> = ({ series, episode }) => {
  const tally = useIn(196, "snappy");
  return (
    <SceneShell>
      <BrandBar series={series} episode={episode} />

      <div style={{ position: "absolute", left: 90, top: 300 }}>
        <Eyebrow delay={0}>ЧТО ЗАБИРАЕТ ИИ</Eyebrow>
      </div>

      <div style={{ position: "absolute", left: 90, right: 90, top: 366 }}>
        <Kinetic text="ПРОСТОЕ УХОДИТ ПЕРВЫМ" delay={4} per={4} size={86} mode="rise" />
      </div>

      <div
        style={{
          position: "absolute",
          left: 90,
          top: 660,
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
        {CARDS.map((c, i) => (
          <TaskCard key={c.label} label={c.label} delay={16 + i * 6} taken={c.taken} width={760} />
        ))}
      </div>

      <div
        style={{
          position: "absolute",
          left: 90,
          top: 1160,
          display: "flex",
          alignItems: "center",
          gap: 18,
          opacity: tally,
          transform: `translateY(${(1 - tally) * 16}px)`,
        }}
      >
        <Chip delay={196} tone="hero" size={30} filled>
          РУТИНА
        </Chip>
        <span
          style={{
            fontFamily: theme.fonts.mono,
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: "0.14em",
            color: itPalette.textDim,
          }}
        >
          НЕ ПРОФЕССИЯ
        </span>
      </div>
    </SceneShell>
  );
};
