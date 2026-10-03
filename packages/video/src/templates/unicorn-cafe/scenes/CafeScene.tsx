// 02 cafe — the camera finds the friends, and the punchline word lands.
//
// The slam is timed to the recording: «единорога» is spoken at src 5.82s,
// which is 2.02s into this beat. It is the reel's first big magenta, and the
// caption track is deliberately silent across it (the word is dropped in
// scripts/cuts/unicorn-cafe.json) so the stamp is the only thing to read.
import React from "react";
import { AbsoluteFill } from "remotion";
import { useRamp } from "../../../reel";
import { theme } from "../../../theme";
import { ucPalette } from "../palette";
import { Footage, ScanLine, Slam } from "../ui";

// src 5.82s − scene start 3.8s = 2.02s at 30fps.
export const SLAM_AT = 61;

export const CafeScene: React.FC<{ slamWord: string }> = ({ slamWord }) => {
  // The stamp needs a ground: the café is beige and busy, and magenta type on
  // it alone reads as a sticker.
  const dim = useRamp(SLAM_AT, SLAM_AT + 8, theme.ease.out);
  return (
    <AbsoluteFill>
      <Footage shot="cafe" focus={0.44} zoom={[1.02, 1.1]} />
      <ScanLine from={2} to={26} />
      <AbsoluteFill style={{ background: ucPalette.bg, opacity: dim * 0.52 }} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <Slam word={slamWord} delay={SLAM_AT} size={116} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
