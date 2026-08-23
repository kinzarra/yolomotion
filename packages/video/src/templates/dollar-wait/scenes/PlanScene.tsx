// Beat 10 — the payoff, and the one picture the reel exists for. A single
// heavy red token drops on one day of the calendar and kicks the frame: that
// is «на всё сразу», and its whole outcome hangs on one date. Then it clears
// and the same money comes down as four light lime tokens on four different
// days. Only after the picture lands do the three rules appear.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { usePunch } from "../../../reel";
import { dwColors } from "../palette";
import {
  BrandBar,
  Chip,
  DayStrip,
  Drop,
  Eyebrow,
  Flash,
  Kinetic,
  PlanRow,
  SceneShell,
  useExit,
} from "../ui";

const LUMP = 26; // the single purchase falls
const HIT = 40; // and lands
const CLEAR = 92; // it leaves
const SPLIT = 106; // the parts start falling
const PART_STEP = 14;
const ROWS = 200;
const ROW_STEP = 26;
const NOTE = 302;

const STRIP = { left: 110, top: 500, width: 860, cells: 8 } as const;
const LUMP_DAY = 3;
const PART_DAYS = [0, 2, 4, 6];

export const PlanScene: React.FC<{ series: string; episode: string }> = ({ series, episode }) => {
  const frame = useCurrentFrame();
  const punch = usePunch(HIT, 20);
  const lumpOut = useExit(CLEAR, 10);
  const split = frame >= SPLIT;

  const drops: Drop[] = split
    ? PART_DAYS.map((index, i) => ({
        index,
        at: SPLIT + i * PART_STEP,
        tone: "hero" as const,
        size: 58,
      }))
    : frame < CLEAR + 10
      ? // deliberately wider than a day cell: the whole point is that one
        // purchase does not fit into one day
        [{ index: LUMP_DAY, at: LUMP, tone: "bad" as const, size: 132 }]
      : [];

  return (
    <SceneShell shake={punch.shake}>
      <BrandBar series={series} episode={episode} />

      <div style={{ position: "absolute", left: 90, top: 300 }}>
        <Eyebrow delay={0}>АЛГОРИТМ</Eyebrow>
      </div>

      {/* the label над стрипом swaps with the picture under it */}
      <div style={{ position: "absolute", left: 90, right: 90, top: 356 }}>
        {split ? (
          <Kinetic text="ЧАСТЯМИ" delay={SPLIT} per={4} size={100} mode="snap" hero={[0]} />
        ) : (
          <div style={{ opacity: 1 - lumpOut, transform: `translateY(${lumpOut * -40}px)` }}>
            <Kinetic text="ВСЁ СРАЗУ" delay={4} per={4} size={100} mode="rise" bad={[0, 1]} />
          </div>
        )}
      </div>

      <div style={{ position: "absolute", left: STRIP.left, top: STRIP.top }}>
        <DayStrip
          cells={STRIP.cells}
          width={STRIP.width}
          delay={-10}
          label="ОДИН МЕСЯЦ"
          drops={drops}
          highlight={split ? [...PART_DAYS] : [LUMP_DAY]}
        />
      </div>

      {/* the three rules */}
      {frame >= ROWS && (
        <div
          style={{
            position: "absolute",
            left: STRIP.left,
            top: 796,
            display: "flex",
            flexDirection: "column",
            gap: 22,
          }}
        >
          <PlanRow when="ДО 3 МЕСЯЦЕВ" then="ЧАСТЯМИ ПО ГРАФИКУ" delay={ROWS} width={860} />
          <PlanRow when="3–12 МЕСЯЦЕВ" then="РАВНЫМИ ПОКУПКАМИ" delay={ROWS + ROW_STEP} width={860} />
          <PlanRow
            when="ЦЕЛИ НЕТ"
            then="НЕ ПОКУПАТЬ ПОСЛЕ СКАЧКА"
            tone="bad"
            delay={ROWS + ROW_STEP * 2}
            width={860}
          />
        </div>
      )}

      {frame >= NOTE && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1196, display: "flex", justifyContent: "center" }}>
          <Chip delay={NOTE} tone="paper" size={24}>
            СРАВНИВАЙТЕ КУРС БАНКА, КОМИССИЮ И СПРЕД
          </Chip>
        </div>
      )}

      <Flash amount={punch.pop * 0.8} color={dwColors.bad} />
    </SceneShell>
  );
};
