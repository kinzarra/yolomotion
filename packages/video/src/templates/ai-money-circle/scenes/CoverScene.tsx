// Beat 0 — the cover, with the voice saying what the reel is about.
// Frame 0 = the whole map lit (every arrow of the reel as a thin chord), the
// title, «$300 МЛРД» as the biggest arrow, the Spider-Men, the stamp
// «ВСЕ КУПИЛИ ВСЕХ», the colour legend. It breathes and holds while the
// voice promises «сейчас покажу, кто кому должен»; the circle beat takes it
// from here.
import React from "react";
import { useCurrentFrame } from "remotion";
import { BrandBar, SceneShell } from "../ui";
import { Arrow, Figure, HeaderStrip, Legend, Meme, StampBlock, Tag, arrowCurve, ringPos } from "../parts";
import { COVER_ARROWS, NODE_IDS } from "../map";

export const COVER_BEND = 58;

export const CoverScene: React.FC<{ series: string; episode: string }> = ({ series, episode }) => {
  const frame = useCurrentFrame();
  return (
    <SceneShell exit={false}>
      <BrandBar series={series} episode={episode} delay={-30} />
      <HeaderStrip text="КТО КОМУ ДОЛЖЕН В ИИ" at={-30} />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, zIndex: 2 }}>
        {COVER_ARROWS.map((a) => (
          <Arrow key={`${a.from}-${a.to}`} c={arrowCurve(ringPos(a.from), ringPos(a.to), 1, 1, COVER_BEND)} tone={a.tone} at={-40} width={4} />
        ))}
      </svg>
      {NODE_IDS.map((id, i) => (
        <Tag key={id} id={id} pos={ringPos(id)} seed={i} />
      ))}
      <Figure num="$300" unit="МЛРД" caption="САМАЯ БОЛЬШАЯ СТРЕЛКА · OPENAI → ORACLE" at={-30} tone="pay" />
      <Meme at={-30} />
      <StampBlock lines={["ВСЕ КУПИЛИ ВСЕХ"]} tone="bad" at={-30} sub="10 КОМПАНИЙ · ОДИН КОШЕЛЁК" />
      <Legend at={-30} />
      {frame < 0 && null}
    </SceneShell>
  );
};
