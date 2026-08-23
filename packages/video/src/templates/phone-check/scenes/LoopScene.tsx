// Beat 3 — the open loop. The frame dims; a stack of notes hangs exactly
// halfway between a hooded figure and a bank; КТО ВЕРНЁТ ДЕНЬГИ? lands and
// one heartbeat pulses through the money. A hold. The answer is beat 8.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { theme } from "../../../theme";
import { usePunch, useRamp } from "../../../reel";
import { BrandBar, Eyebrow, Kinetic, SceneShell, Shockwave } from "../ui";
import { Standoff } from "./Standoff";

const DIM = 0;
const QUESTION = 84; // «А кто вернёт деньги»
const BEAT = 100; // one heartbeat

export const LoopScene: React.FC<{ series: string; episode: string }> = ({ series, episode }) => {
  const frame = useCurrentFrame();
  const dim = useRamp(DIM, DIM + 14, theme.ease.inOut);
  const beat = usePunch(BEAT, 18);

  return (
    <SceneShell>
      <BrandBar series={series} episode={episode} />
      {/* the lights go down */}
      <div style={{ position: "absolute", inset: 0, background: "#000", opacity: dim * 0.5 }} />

      <AbsoluteFill style={{ alignItems: "center", paddingTop: 330 }}>
        <Eyebrow delay={4}>Самое интересное</Eyebrow>
        <div style={{ width: 960, marginTop: 26, minHeight: 220 }}>
          {frame >= QUESTION && (
            <Kinetic text="КТО ВЕРНЁТ ДЕНЬГИ?" delay={QUESTION} per={5} size={104} align="center" mode="rise" style={{ justifyContent: "center" }} />
          )}
        </div>
      </AbsoluteFill>

      <Standoff hood={10} bank={18} notes={4} notePop={beat.pop} />

      <div style={{ position: "absolute", left: 0, top: -60, width: 1080, height: 1920, pointerEvents: "none" }}>
        <Shockwave at={BEAT} life={28} size={900} />
      </div>
    </SceneShell>
  );
};
