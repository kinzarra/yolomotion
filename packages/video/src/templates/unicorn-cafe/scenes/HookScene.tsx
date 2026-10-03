// 01 hook — the raw selfie, claimed.
//
// The footage is the hook: a phone shot that looks like nothing, with a line
// on top saying it was cut by code. The claim is bone, not magenta — the
// caption's active word is already carrying the accent from 0.72s, and two
// magenta elements in one frame would split the eye.
import React from "react";
import { AbsoluteFill } from "remotion";
import { ucColors } from "../palette";
import { Footage, MaskLines, Mono, Rule, Scrim, useExit } from "../ui";

export const HookScene: React.FC<{ claim: string[] }> = ({ claim }) => {
  const exit = useExit(9);
  return (
    <AbsoluteFill>
      <Footage shot="hook" focus={0.4} zoom={[1, 1.08]} />
      {/* The ceiling and window blinds are the brightest part of the frame and
          sit exactly where the claim goes. */}
      <Scrim from="top" height={760} strength={0.88} />
      <Scrim from="bottom" height={620} strength={0.6} />

      <div style={{ position: "absolute", left: 90, top: 246, ...exit }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 22 }}>
          <Mono size={24} color={ucColors.bone}>
            no crew
          </Mono>
          <Rule width={90} delay={4} thickness={2} />
          <Mono size={24}>no editor</Mono>
        </div>
        {/* 84, not 92: Unbounded runs ~0.78em per Cyrillic capital, so
            «СМОНТИРОВАЛ» at 92 reaches x≈1030 and leaves 50px of margin. */}
        <MaskLines lines={claim} size={84} delay={0} per={4} />
      </div>
    </AbsoluteFill>
  );
};
