// Beat 3 — the correction to the headline everybody repeats. The word
// ЛИХОРАДИТ arrives in red, and under it the line stops being a trend and
// becomes a tremor: the same grid, but the shape has no direction. The month's
// move hangs off it as a red tag.
import React from "react";
import { useCurrentFrame } from "remotion";
import { theme } from "../../../theme";
import { useRamp } from "../../../reel";
import { dwColors } from "../palette";
import { BrandBar, Eyebrow, Kinetic, RateChart, RateTag, SceneShell, feverLine } from "../ui";
import { CHART } from "./shared";

const HEAD = 4;
const DRAW = 26;
const TAG = 96;
const CHART_H = 400;
const CHART_TOP = 700;

const PTS = feverLine(CHART.width, CHART_H, 34, 0.2, 3);

export const FeverScene: React.FC<{ series: string; episode: string; monthDelta: string }> = ({
  series,
  episode,
  monthDelta,
}) => {
  const frame = useCurrentFrame();
  const draw = useRamp(DRAW, DRAW + 52, theme.ease.inOut);
  // the whole chart trembles a hair once it is drawn — it is a fever, not a line
  const tremor = frame > DRAW + 20 ? Math.sin(frame * 1.9) * 2.4 : 0;

  return (
    <SceneShell>
      <BrandBar series={series} episode={episode} />

      <div style={{ position: "absolute", left: 90, top: 300 }}>
        <Eyebrow delay={0}>ВАЖНАЯ ПОПРАВКА</Eyebrow>
      </div>

      <div style={{ position: "absolute", left: 90, right: 90, top: 366 }}>
        <Kinetic
          text="РУБЛЬ НЕ ПАДАЕТ. ЕГО ЛИХОРАДИТ."
          delay={HEAD}
          per={4}
          size={86}
          mode="rise"
          bad={[4]}
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: CHART.left,
          top: CHART_TOP,
          transform: `translateX(${tremor}px)`,
        }}
      >
        <RateChart
          id="fever-rate"
          width={CHART.width}
          height={CHART_H}
          pts={PTS}
          progress={draw}
          color={dwColors.bad}
          thick={7}
          tip
          gridCols={8}
        />
      </div>

      <div style={{ position: "absolute", left: CHART.left + 596, top: 1150 }}>
        <RateTag value={monthDelta} note="ИЮЛЬ К ДОЛЛАРУ" tone="bad" delay={TAG} size={54} stem={0} />
      </div>
    </SceneShell>
  );
};
