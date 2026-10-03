// 01 hook — the paradox in one frame. The night skyline is the evidence for
// «небоскрёбы» (Robert Bock, CC0), pushed toward the tower; a red «≈1%»
// slams over the water with a shockwave and a glitch, then makes way for the
// question the whole reel answers. No brand bar: the hook is the photo.
import React from "react";
import { useVideoConfig } from "remotion";
import { usePunch } from "../../../reel";
import { deColors } from "../palette";
import {
  BigNum,
  Eyebrow,
  Flash,
  Glitch,
  Kinetic,
  Photo,
  Scrim,
  SceneShell,
  Shockwave,
  Sweep,
  useExit,
} from "../ui";

export const HookScene: React.FC = () => {
  const { fps, durationInFrames } = useVideoConfig();
  const slam = Math.round(0.25 * fps);
  const ask = Math.round(3.0 * fps); // «Откуда тогда небоскрёбы?»
  const hit = usePunch(slam, 16);
  const ask2 = usePunch(ask + 4, 12);
  const numOut = useExit(ask - 8, 8);
  const askDim = useExit(ask - 8, 14);
  return (
    <SceneShell shake={hit.shake + ask2.shake * 0.5}>
      <Photo file="01-hook-skyline.jpg" len={durationInFrames} focus={[0.555, 0.3]} zoom={[1.0, 1.22]} drift={-40} />
      <Scrim top={0.55} mid={0.05 + askDim * 0.5} bottom={0.92} />
      <Sweep at={ask} life={30} />

      <div style={{ position: "absolute", left: 90, right: 90, top: 780, opacity: 1 - numOut }}>
        <Eyebrow delay={2} color={deColors.bad}>
          НЕФТЬ В ЭКОНОМИКЕ ДУБАЯ
        </Eyebrow>
        <Glitch amount={hit.energy * 0.9} style={{ marginTop: 70 }}>
          <BigNum size={330} color={deColors.bad} delay={slam - 6} glow={deColors.badGlow}>
            ≈1%
          </BigNum>
        </Glitch>
      </div>

      <div style={{ position: "absolute", left: 90, right: 90, top: 900 }}>
        <Glitch amount={ask2.energy * 0.6}>
          <Kinetic text="ОТКУДА ТОГДА НЕБОСКРЁБЫ?" delay={ask} per={4} size={92} mode="snap" />
        </Glitch>
      </div>

      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920 }}>
        <Shockwave at={slam} color={deColors.bad} size={1500} />
      </div>
      <Flash amount={hit.energy} color={deColors.bad} />
    </SceneShell>
  );
};
