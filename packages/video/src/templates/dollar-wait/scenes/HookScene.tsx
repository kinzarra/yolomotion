// Beat 1 — the scroll-stopper. The USD/RUB line rips up and off the top right
// of its grid, the huge lime «КУПИТЬ» rises under it, a cursor drops in and
// hovers over the button without ever pressing it, and three red questions
// snap on. Readable without sound inside two seconds. The reel loops into
// this frame, so the button and the brand bar enter with a negative delay.
import React from "react";
import { useCurrentFrame } from "remotion";
import { theme } from "../../../theme";
import { useRamp } from "../../../reel";
import { dwColors } from "../palette";
import {
  BrandBar,
  BuyButton,
  Cursor,
  Eyebrow,
  Kinetic,
  RateChart,
  SceneShell,
  spikeLine,
} from "../ui";
import { BUY, CHART, CURSOR } from "./shared";

const CHART_H = 380;
const CHART_TOP = 330;
const RIP = 2; // the line starts moving in the first frames
const QUESTIONS = 34;

// Only the run-up — peakAt 1 keeps the whole shape climbing across the full
// width, so the line is still going when the beat cuts. The retrace that
// follows in reality is beat 4's reveal, not the hook's.
const PTS = spikeLine(CHART.width, CHART_H, 30, 1, 5);

export const HookScene: React.FC<{ series: string; episode: string }> = ({ series, episode }) => {
  const frame = useCurrentFrame();
  const draw = useRamp(RIP, RIP + 28, theme.ease.out);
  const float = Math.sin(frame / 13) * 9;
  const nudge = Math.sin(frame / 17) * 5;

  return (
    <SceneShell>
      <BrandBar series={series} episode={episode} delay={-40} />

      <div style={{ position: "absolute", left: CHART.left, top: 262 }}>
        <Eyebrow delay={-30}>USD / RUB</Eyebrow>
      </div>

      <div style={{ position: "absolute", left: CHART.left, top: CHART_TOP }}>
        <RateChart
          id="hook-rate"
          width={CHART.width}
          height={CHART_H}
          pts={PTS}
          progress={draw}
          color={dwColors.bad}
          thick={9}
          tip
          area
        />
      </div>

      <div style={{ position: "absolute", left: 70, right: 70, top: 786 }}>
        <Kinetic
          text="ПОКУПАТЬ? ЖДАТЬ? УЖЕ ПОЗДНО?"
          delay={QUESTIONS}
          per={5}
          size={66}
          mode="snap"
          align="center"
          bad={[0, 1, 2, 3]}
        />
      </div>

      <div style={{ position: "absolute", left: BUY.left, top: BUY.top, transform: `translateX(${nudge}px)` }}>
        <BuyButton width={BUY.width} height={BUY.height} delay={-40} />
      </div>

      {/* present from frame 0 — the CTA hands the loop back with it already
          hovering here, so it must not re-enter */}
      <Cursor x={CURSOR.x} y={CURSOR.y} delay={-40} float={float} />
    </SceneShell>
  );
};
