// 03 break — the turn. The brief asks for «ИИ» to split into three parts, so
// it does: three horizontal shards of the same word drifting apart, and the
// correction lands underneath while they are still moving. The shortest beat
// in the reel (4s) and the only one with a single object in frame.
import React from "react";
import { usePunch } from "../../../reel";
import { itColors } from "../palette";
import { BrandBar, Eyebrow, Flash, Kinetic, SceneShell, Shards } from "../ui";

// Late enough that «ИИ» is legible for a beat first — the split is the
// punchline of the shot, not its entrance.
const SPLIT = 36;

export const BreakScene: React.FC<{ series: string; episode: string }> = ({ series, episode }) => {
  const punch = usePunch(SPLIT, 20);
  return (
    <SceneShell shake={punch.shake}>
      <BrandBar series={series} episode={episode} />

      <div style={{ position: "absolute", left: 90, top: 300 }}>
        <Eyebrow delay={0}>НО</Eyebrow>
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, top: 540 }}>
        <Shards text="ИИ" pieces={3} at={SPLIT} size={330} spread={64} color={itColors.bad} />
      </div>

      <div style={{ position: "absolute", left: 90, right: 90, top: 1010 }}>
        <Kinetic
          // 76: «ЕДИНСТВЕННАЯ» is twelve characters of Unbounded 800 and at
          // 92px it ran 85px past the right margin.
          text="НЕ ЕДИНСТВЕННАЯ ПРИЧИНА"
          delay={SPLIT + 8}
          per={4}
          size={76}
          mode="snap"
        />
      </div>

      <Flash amount={punch.energy * 0.7} color={itColors.bad} />
    </SceneShell>
  );
};
