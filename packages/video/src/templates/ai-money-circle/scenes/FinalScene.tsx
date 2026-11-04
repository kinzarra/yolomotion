// The last beat: the cover again. The ten tags pop back to the ring, every
// arrow of the reel draws in a sweep, «ВСЕ КУПИЛИ ВСЕХ» slams with the voice,
// the Spider-Men point at each other, the legend prints. The last frame
// equals frame 0, so the reel loops.
import React from "react";
import { usePunch } from "../../../reel";
import { colors } from "../palette";
import { BrandBar, Flash, SceneShell } from "../ui";
import { Arrow, Figure, HeaderStrip, Legend, Meme, StampBlock, Tag, arrowCurve, ringPos } from "../parts";
import { COVER_ARROWS, NODE_IDS } from "../map";
import { COVER_BEND } from "./CoverScene";

const STAMP = 12;

export const FinalScene: React.FC<{ series: string; episode: string }> = ({ series, episode }) => {
  const hit = usePunch(STAMP, 20);
  return (
    <SceneShell exit={false} shake={hit.shake}>
      <BrandBar series={series} episode={episode} delay={-30} />
      <HeaderStrip text="КТО КОМУ ДОЛЖЕН В ИИ" at={0} />

      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, zIndex: 2 }}>
        {COVER_ARROWS.map((a, i) => (
          <Arrow key={`${a.from}-${a.to}`} c={arrowCurve(ringPos(a.from), ringPos(a.to), 1, 1, COVER_BEND)} tone={a.tone} at={2 + i} draw={10} width={4} />
        ))}
      </svg>

      {NODE_IDS.map((id, i) => (
        <Tag key={id} id={id} pos={ringPos(id)} at={i * 2} seed={i} />
      ))}

      <Figure num="$300" unit="МЛРД" caption="САМАЯ БОЛЬШАЯ СТРЕЛКА · OPENAI → ORACLE" at={4} tone="pay" />
      <Meme at={18} />
      <StampBlock lines={["ВСЕ КУПИЛИ ВСЕХ"]} tone="bad" at={STAMP} sub="10 КОМПАНИЙ · ОДИН КОШЕЛЁК" />
      <Legend at={STAMP + 10} />

      <Flash amount={hit.energy} color={colors.bad} />
    </SceneShell>
  );
};
