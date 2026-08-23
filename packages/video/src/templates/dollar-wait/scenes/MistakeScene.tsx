// Beat 7 — the viewer's own behaviour, acted out. While the board is quiet
// the figure walks straight past it. The moment the board goes red the same
// figure comes sprinting back from off-frame. The headline swaps under the
// action: покупают не когда нужно — а когда страшно.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { theme } from "../../../theme";
import { useRamp } from "../../../reel";
import { dwColors } from "../palette";
import { BrandBar, Chip, Eyebrow, Kinetic, RateBoard, SceneShell, Walker, useExit } from "../ui";
import { digits } from "./shared";

const HEAD = 4;
const SWAP = 84;
const HEAD2 = 94;
const HOT = 88;
const WALK_OUT = 0; // strolls past, left → right
const RUSH = 98; // sprints back from the right

export const MistakeScene: React.FC<{
  series: string;
  episode: string;
  rateHigh: string;
  rateNow: string;
}> = ({ series, episode, rateHigh, rateNow }) => {
  const frame = useCurrentFrame();
  const hot = useRamp(HOT, HOT + 12, theme.ease.out);
  const headOut = useExit(SWAP, 9);
  // A long ease-out window: he enters briskly in the first half-second and
  // drifts off the right edge around frame 55, well before the board turns.
  const stroll = useRamp(WALK_OUT, WALK_OUT + 170, theme.ease.out);
  const rush = useRamp(RUSH, RUSH + 26, theme.ease.out);

  const rushing = frame >= RUSH;
  // strolling left → right, then sprinting back in from the right and stopping
  const x = rushing
    ? interpolate(rush, [0, 1], [1220, 540])
    : interpolate(stroll, [0, 1], [-260, 1300]);
  const arrived = rushing && rush > 0.98;
  // Standing still is a pose, not frame 0: 6.28 lands sin() at its peak, so he
  // stops with his legs a full stride apart — someone who just ran up.
  const walkPhase = arrived ? 6.28 : rushing ? frame * 2.4 : frame;

  const low = digits(rateNow);
  const high = digits(rateHigh);

  return (
    <SceneShell>
      <BrandBar series={series} episode={episode} />

      <div style={{ position: "absolute", left: 90, top: 300 }}>
        <Eyebrow delay={0}>ГЛАВНАЯ ОШИБКА</Eyebrow>
      </div>

      {/* the headline swaps mid-beat */}
      <div style={{ position: "absolute", left: 90, right: 90, top: 362 }}>
        {frame < SWAP + 9 ? (
          <div style={{ opacity: 1 - headOut, transform: `translateY(${headOut * -44}px)` }}>
            <Kinetic text="ПОКУПАЮТ НЕ КОГДА НУЖНО" delay={HEAD} per={4} size={76} mode="rise" />
          </div>
        ) : (
          <Kinetic text="А КОГДА СТРАШНО" delay={HEAD2} per={4} size={92} mode="snap" bad={[2]} />
        )}
      </div>

      <AbsoluteFill style={{ alignItems: "center", paddingTop: 620 }}>
        <RateBoard
          buy={rushing ? high : low}
          sell={rushing ? "86,20" : "84,10"}
          hot={hot}
          delay={10}
          width={720}
        />
      </AbsoluteFill>

      {/* the ground the figure walks on */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1218,
          height: 2,
          background: dwColors.lineStrong,
          opacity: 0.5,
        }}
      />
      <div style={{ position: "absolute", left: x, top: 988 }}>
        <Walker height={230} delay={-20} walk={walkPhase} flip={rushing} />
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, top: 1272, display: "flex", justifyContent: "center" }}>
        {rushing ? (
          <Chip delay={RUSH + 14} tone="bad" filled size={26}>
            ВЕЗДЕ НОВОСТИ — ПОРА!
          </Chip>
        ) : (
          <Chip delay={40} tone="paper" size={24}>
            КУРС НИЖЕ — О НЁМ НИКТО НЕ ГОВОРИТ
          </Chip>
        )}
      </div>
    </SceneShell>
  );
};
