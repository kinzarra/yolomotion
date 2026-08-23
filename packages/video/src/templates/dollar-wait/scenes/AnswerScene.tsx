// Beat 2 — the answer up front, before anyone can scroll away. The lime stamp
// НЕ ПОЗДНО slams in with a shockwave, then the counterweight slides under it:
// НО НЕ НА ВСЕ СБЕРЕЖЕНИЯ, and the red chip names the trap. The lime stamp is
// the only glowing thing in the frame; the red is a filled chip, not a second
// glow.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { usePunch } from "../../../reel";
import { dwPalette } from "../palette";
import { BrandBar, Chip, Eyebrow, Flash, Kinetic, SceneShell, Shockwave, Stamp } from "../ui";

const SLAM = 6;
const WARN = 54;
const TRAP = 92;
const NOTE = 132;

export const AnswerScene: React.FC<{ series: string; episode: string }> = ({ series, episode }) => {
  const frame = useCurrentFrame();
  const punch = usePunch(SLAM, 20);
  const breathe = Math.sin(frame / 26) * 4;

  return (
    <SceneShell shake={punch.shake}>
      <BrandBar series={series} episode={episode} />

      <div style={{ position: "absolute", left: 90, top: 300 }}>
        <Eyebrow delay={0}>КОРОТКИЙ ОТВЕТ</Eyebrow>
      </div>

      <AbsoluteFill style={{ alignItems: "center", paddingTop: 386 }}>
        <div style={{ transform: `translateY(${breathe}px)` }}>
          <Stamp delay={SLAM} tone="hero" size={106} rotate={-4}>
            НЕ ПОЗДНО
          </Stamp>
        </div>
      </AbsoluteFill>

      <div style={{ position: "absolute", left: 90, right: 90, top: 716 }}>
        <Kinetic
          text="НО НЕ НА ВСЕ СБЕРЕЖЕНИЯ СРАЗУ"
          delay={WARN}
          per={4}
          size={68}
          mode="rise"
          align="center"
          bad={[3, 4]}
        />
      </div>

      {frame >= TRAP && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 964,
            display: "flex",
            justifyContent: "center",
            transform: "rotate(-2deg)",
          }}
        >
          <Chip delay={TRAP} tone="bad" filled size={32}>
            КЛАССИЧЕСКАЯ ОШИБКА ТОЛПЫ
          </Chip>
        </div>
      )}

      {frame >= NOTE && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1150, display: "flex", justifyContent: "center" }}>
          <Chip delay={NOTE} tone="paper" size={26}>
            ТОЛЬКО ФАКТЫ И СЦЕНАРИИ
          </Chip>
        </div>
      )}

      <Shockwave at={SLAM} life={26} color={dwPalette.primary} size={1700} />
      <Flash amount={punch.pop} color={dwPalette.primary} />
    </SceneShell>
  );
};
