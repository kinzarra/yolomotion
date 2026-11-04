// 1950-е. The real card on top, the 1957 machine room beside it, and one row of the card
// big: holes punch in, each turns into 1 or 0 (да / нет). On «Ошибся» one hole goes red,
// the stamp lands, «ВСЮ КАРТУ ЗАНОВО».
import React from "react";
import { useCurrentFrame } from "remotion";
import { usePunch } from "../../../reel";
import { vibecodingLayersColors as colors } from "../palette";
import { BITS, EPISODE, SERIES, WRONG_BIT } from "../data";
import { CUES } from "../timeline";
import { Bits, BrandBar, ClipTile, CutTear, Drift, EraHeader, Flash, Meter, Paper, PhotoCard, SceneShell, Stamp, Tag, useCue } from "../ui";

export const PunchScene: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const c = CUES.punch;
  const holesAt = cue(c.computer);
  const oopsAt = cue(c.oops);
  const swapAt = cue(c.hole);
  const oops = usePunch(oopsAt, 18);
  const again = usePunch(cue(c.again), 14);
  return (
    <SceneShell shake={oops.shake + again.shake * 0.6}>
      <CutTear>
        <Drift items={["0", "1", "1", "0"]} />
      </CutTear>
      <BrandBar series={SERIES} episode={EPISODE} delay={-30} />
      <EraHeader year="1950-е" title="ПЕРФОКАРТЫ" at={0} titleAt={cue(c.cards)} />
      <PhotoCard src="images/vibecoding-layers/punchcard.png" x={56} y={520} w={600} ratio={1920 / 864} at={6} rot={-4} caption="ПЕРФОКАРТА IBM · 80 КОЛОНОК" focus="30% 50%" z={3} />
      <ClipTile src="footage/vibecoding-layers/machines-a.mp4" x={620} y={500} w={400} h={330} rot={3} at={6} tag="1957" z={2} />
      {frame >= swapAt && <ClipTile src="footage/vibecoding-layers/machines-b.mp4" x={620} y={500} w={400} h={330} rot={3} at={swapAt} tag="1957" z={2} />}
      <Tag at={holesAt - 4} x={64} y={905} tone="neutral" size={22}>
        КОМПЬЮТЕР ПОНИМАЕТ ТОЛЬКО
      </Tag>
      <div style={{ position: "absolute", left: 64, top: 975, zIndex: 4, transform: `translateX(${oops.shake * 2}px)` }}>
        <Bits bits={BITS} at={holesAt} every={4} wrong={WRONG_BIT} wrongAt={oopsAt} labelsAt={cue(c.yesno)} />
      </div>
      <div style={{ position: "absolute", left: 64, top: 1240, zIndex: 5, display: "flex", flexDirection: "column", gap: 14 }}>
        {frame >= cue(c.hole) && (
          <Paper delay={cue(c.hole)} size={30}>
            ДЫРКА ЕСТЬ = ДА = 1
          </Paper>
        )}
        {frame >= cue(c.nohole) && (
          <Paper delay={cue(c.nohole)} size={30} rotate={1}>
            ДЫРКИ НЕТ = НЕТ = 0
          </Paper>
        )}
      </div>
      {frame >= oopsAt && (
        <div style={{ position: "absolute", left: 500, top: 1250, zIndex: 7 }}>
          <Stamp tone="bad" size={78} rotate={-8} delay={oopsAt}>
            ОШИБКА
          </Stamp>
        </div>
      )}
      {frame >= cue(c.again) && (
        <div style={{ position: "absolute", left: 500, top: 1400, zIndex: 7 }}>
          <Paper delay={cue(c.again)} size={30} tone="bad" rotate={-2}>
            ВСЮ КАРТУ ЗАНОВО
          </Paper>
        </div>
      )}
      <Meter active={0} />
      <Flash amount={oops.energy} color={colors.bad} />
    </SceneShell>
  );
};
