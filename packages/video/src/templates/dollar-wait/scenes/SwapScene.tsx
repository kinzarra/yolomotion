// Beat 8 — the pivot of the whole reel, done literally: the wrong question is
// struck out and pushed off the top of the frame, and the right one rises in
// its place with a shockwave. Short beat, one idea, nothing else on screen.
import React from "react";
import { useCurrentFrame } from "remotion";
import { dwColors, dwPalette } from "../palette";
import { BrandBar, Chip, Kinetic, SceneShell, Shockwave, Strike, useExit } from "../ui";

const OLD = 2;
const CUT = 30;
const OUT = 44;
const NEW = 56;

export const SwapScene: React.FC<{ series: string; episode: string }> = ({ series, episode }) => {
  const frame = useCurrentFrame();
  const out = useExit(OUT, 11);

  return (
    <SceneShell>
      <BrandBar series={series} episode={episode} />

      {/* the question to stop asking */}
      {frame < OUT + 11 && (
        <div
          style={{
            position: "absolute",
            left: 90,
            right: 90,
            top: 560,
            opacity: 1 - out,
            transform: `translateY(${out * -110}px) scale(${1 - out * 0.08})`,
          }}
        >
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 22 }}>
            <Chip delay={OLD} tone="bad" filled size={26}>
              НЕ
            </Chip>
          </div>
          <div style={{ position: "relative" }}>
            <Kinetic
              text="КАКОЙ БУДЕТ КУРС?"
              delay={OLD}
              per={4}
              size={84}
              mode="rise"
              align="center"
              color={dwColors.paper}
            />
            {frame >= CUT && <Strike delay={CUT} thick={16} tilt={-2.5} />}
          </div>
        </div>
      )}

      {/* the question to ask instead */}
      {frame >= NEW && (
        <div style={{ position: "absolute", left: 70, right: 70, top: 720 }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
            <Chip delay={NEW} tone="hero" size={26}>
              А
            </Chip>
          </div>
          <Kinetic
            text="КОГДА МНЕ НУЖНА ВАЛЮТА?"
            delay={NEW + 4}
            per={4}
            size={88}
            mode="snap"
            align="center"
            hero={[0, 1, 2, 3]}
            glow
          />
        </div>
      )}

      <Shockwave at={NEW + 4} life={26} color={dwPalette.primary} size={1600} />
    </SceneShell>
  );
};
