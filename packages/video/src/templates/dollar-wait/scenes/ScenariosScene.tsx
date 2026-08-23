// Beat 11 — the honest range of outcomes. Three lanes draw themselves: the
// weakening (red, up), the strengthening (paper, down) and the chop that ruins
// anyone trying to time it. Then all three grey out at once and the only line
// that matters lands across them in lime.
import React from "react";
import { useCurrentFrame } from "remotion";
import { theme } from "../../../theme";
import { useRamp } from "../../../reel";
import { dwPalette } from "../palette";
import { BrandBar, Eyebrow, Kinetic, Lane, SceneShell, Shockwave } from "../ui";

const HEAD = 4;
const L1 = 20;
const L2 = 46;
const L3 = 72;
const DIM = 190;
const VERDICT = 198;

export const ScenariosScene: React.FC<{ series: string; episode: string }> = ({
  series,
  episode,
}) => {
  const frame = useCurrentFrame();
  const dim = useRamp(DIM, DIM + 14, theme.ease.out);

  return (
    <SceneShell>
      <BrandBar series={series} episode={episode} />

      <div style={{ position: "absolute", left: 90, top: 300 }}>
        <Eyebrow delay={0}>ЧТО МОЖЕТ БЫТЬ ДАЛЬШЕ</Eyebrow>
      </div>

      <div style={{ position: "absolute", left: 90, right: 90, top: 352 }}>
        <Kinetic text="ТРИ СЦЕНАРИЯ" delay={HEAD} per={4} size={78} mode="rise" />
      </div>

      <div
        style={{
          position: "absolute",
          left: 90,
          top: 560,
          display: "flex",
          flexDirection: "column",
          gap: 26,
        }}
      >
        <Lane id="lane-weak" label="ОСЛАБЛЕНИЕ" dir="up" delay={L1} width={900} height={118} dim={dim} />
        <Lane id="lane-strong" label="УКРЕПЛЕНИЕ" dir="down" delay={L2} width={900} height={118} dim={dim} />
        <Lane id="lane-chop" label="ВОЛАТИЛЬНОСТЬ" dir="chop" delay={L3} width={900} height={118} dim={dim} />
      </div>

      {frame >= VERDICT && (
        <div style={{ position: "absolute", left: 70, right: 70, top: 1032 }}>
          <Kinetic
            text="НЕ УГАДЫВАТЬ — УПРАВЛЯТЬ РИСКОМ"
            delay={VERDICT}
            per={4}
            size={70}
            mode="snap"
            align="center"
            hero={[3, 4]}
          />
        </div>
      )}

      <Shockwave at={VERDICT} life={26} color={dwPalette.primary} size={1600} />
    </SceneShell>
  );
};
