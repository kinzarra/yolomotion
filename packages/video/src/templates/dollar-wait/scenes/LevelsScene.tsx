// Beat 4 — the whole argument in one chart. The line runs up in red to the
// August peak, where a tag pins the level, and then keeps going: the retrace
// draws in paper white down to where the rate actually is. The peak tag stays
// on screen the whole way down, so «купил на максимуме» is something the
// viewer sees rather than something the voice claims.
import React from "react";
import { useCurrentFrame } from "remotion";
import { theme } from "../../../theme";
import { useRamp } from "../../../reel";
import { dwColors } from "../palette";
import {
  BrandBar,
  Chip,
  Eyebrow,
  Kinetic,
  RateChart,
  RateTag,
  SceneShell,
  spikeIndex,
  spikeLine,
} from "../ui";
import { CHART } from "./shared";

const CHART_H = 500;
const CHART_TOP = 470;
const PEAK_AT = 0.6;
const N = 30;

const DRAW = 2; // the line is already moving on the first frame of the cut
const DRAW_END = 172;
const PEAK_TAG = 112;
const NOW_TAG = 180;
const VERDICT = 208;
const LESSON = 234;

const PTS = spikeLine(CHART.width, CHART_H, N, PEAK_AT, 5);
const PEAK = PTS[spikeIndex(N, PEAK_AT)];
const END = PTS[N - 1];

export const LevelsScene: React.FC<{
  series: string;
  episode: string;
  rateHigh: string;
  rateNow: string;
}> = ({ series, episode, rateHigh, rateNow }) => {
  const frame = useCurrentFrame();
  const draw = useRamp(DRAW, DRAW_END, theme.ease.inOut);

  return (
    <SceneShell>
      <BrandBar series={series} episode={episode} />

      <div style={{ position: "absolute", left: 90, top: 300 }}>
        <Eyebrow delay={0}>АВГУСТ</Eyebrow>
      </div>

      <div style={{ position: "absolute", left: CHART.left, top: CHART_TOP }}>
        <RateChart
          id="levels-rate"
          width={CHART.width}
          height={CHART_H}
          pts={PTS}
          progress={draw}
          color={dwColors.bad}
          split={PEAK_AT}
          afterColor={dwColors.paper}
          thick={9}
          tip
          area
        />
      </div>

      {/* the top nobody should have bought */}
      <div
        style={{
          position: "absolute",
          left: CHART.left + PEAK.x,
          top: CHART_TOP + PEAK.y - 186,
          transform: "translateX(-50%)",
        }}
      >
        <RateTag
          value={rateHigh}
          note="СЕРЕДИНА АВГУСТА"
          tone="bad"
          delay={PEAK_TAG}
          size={50}
          stem={74}
        />
      </div>

      {/* where it actually came back to */}
      <div
        style={{
          position: "absolute",
          left: CHART.left + Math.min(END.x, CHART.width - 90),
          top: CHART_TOP + END.y + 42,
          transform: "translateX(-50%)",
        }}
      >
        <RateTag value={rateNow} note="22 АВГУСТА" tone="paper" delay={NOW_TAG} size={46} stem={0} />
      </div>

      {frame >= VERDICT && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 1072,
            display: "flex",
            justifyContent: "center",
            transform: "rotate(-1.5deg)",
          }}
        >
          <Chip delay={VERDICT} tone="bad" filled size={28}>
            КУПИЛ НА МАКСИМУМЕ — УВИДЕЛ МИНУС
          </Chip>
        </div>
      )}

      <div style={{ position: "absolute", left: 90, right: 90, top: 1176 }}>
        <Kinetic
          text="КУРС НЕ ХОДИТ ПО ПРЯМОЙ"
          delay={LESSON}
          per={4}
          size={74}
          mode="snap"
          align="center"
        />
      </div>
    </SceneShell>
  );
};
