// 09 crisis — the third turn: 2009. Half-built towers under cranes, a red
// debt line climbing across them; on «платить стало нечем» it snaps, the
// frame shakes and goes red for four frames. Graphic on purpose: the only
// «crane forest» photo on Commons turned out to be Doha, not Dubai.
import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { usePunch } from "../../../reel";
import { deColors } from "../palette";
import {
  BrandBar,
  Chip,
  Crane,
  DebtLine,
  Flash,
  Glitch,
  SceneShell,
  Skyline,
  Stamp,
  Tower,
} from "../ui";

const GROUND = 1330;
const TOWERS: Tower[] = [
  { x: 60, w: 120, h: 380 },
  { x: 200, w: 90, h: 520 },
  { x: 310, w: 140, h: 300 },
  { x: 470, w: 110, h: 620 },
  { x: 600, w: 150, h: 420 },
  { x: 770, w: 100, h: 560 },
  { x: 890, w: 130, h: 340 },
];
const BUILT = [0.9, 0.55, 1, 0.45, 0.7, 0.5, 0.85];

export const CrisisScene: React.FC<{ series: string; episode: string }> = ({ series, episode }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const debt = Math.round(3.6 * fps); // «стройка шла в долг»
  const snap = Math.round(5.6 * fps); // «и платить стало нечем»
  const hit = usePunch(snap, 18);
  const open = usePunch(2, 12);
  return (
    <SceneShell shake={hit.shake}>
      <BrandBar series={series} episode={episode} />
      <div style={{ position: "absolute", left: 90, top: 300 }}>
        <Glitch amount={Math.max(open.energy, hit.energy) * 0.8}>
          <Stamp delay={2} tone="bad" size={120} rotate={-6}>
            2009
          </Stamp>
        </Glitch>
      </div>
      <div style={{ position: "absolute", right: 90, top: 330 }}>
        <Chip delay={20} size={28}>
          МИРОВОЙ КРИЗИС
        </Chip>
      </div>

      <Skyline towers={TOWERS} ground={GROUND} delay={6} per={3} built={BUILT} />
      <Crane x={250} ground={GROUND - 520 * 0.55} height={300} delay={18} swing={1.5} />
      <Crane x={510} ground={GROUND - 620 * 0.45} height={360} delay={24} swing={-1.2} />
      <Crane x={810} ground={GROUND - 560 * 0.5} height={280} delay={30} swing={1} />
      <div style={{ position: "absolute", left: 0, right: 0, top: GROUND, height: 4, background: deColors.lineStrong }} />

      <div style={{ position: "absolute", left: 90, top: 640 }}>
        <DebtLine width={900} height={560} delay={debt - 30} frames={snap - debt + 30} snapAt={snap} />
      </div>
      <div style={{ position: "absolute", left: 640, top: 560 }}>
        {frame >= debt && (
          <Chip delay={debt} tone="bad" size={30}>
            ДОЛГ
          </Chip>
        )}
      </div>
      <Flash amount={hit.energy * 1.4} color={deColors.bad} />
    </SceneShell>
  );
};
