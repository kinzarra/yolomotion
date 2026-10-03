// 03 stare — 1.5 seconds of nobody saying anything.
//
// This beat exists because the recording has a hole in it: after «единорога»
// the table goes quiet. Rather than cut the silence out, the reel leans on it
// — three hard digital punch-ins, the stamp still standing, and no captions
// (the words either side are dropped, so the track has nothing to show).
//
// The stamp carries over from beat 02 with a NEGATIVE delay, the same trick
// the looping reels use for elements that must be settled at frame 0.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { theme } from "../../../theme";
import { ucColors, ucPalette } from "../palette";
import { Footage, Mono, Slam } from "../ui";
import { SLAM_AT } from "./CafeScene";

// The cafe beat is 95 frames long, so the stamp is 95 − SLAM_AT frames old
// when this one starts.
const CARRIED = SLAM_AT - 95;

const STEPS = [1, 1.09, 1.19];

export const StareScene: React.FC<{ slamWord: string }> = ({ slamWord }) => {
  const frame = useCurrentFrame();
  // Hard steps, not a ramp: a smooth zoom would read as drama, and the joke
  // needs the camera to jump like a meme edit.
  const scale = interpolate(
    frame,
    [0, 2, 15, 17, 30, 32],
    [STEPS[0], STEPS[0], STEPS[0], STEPS[1], STEPS[1], STEPS[2]],
    { easing: theme.ease.out, extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  // Each step rings the frame for a few frames.
  const ring = (at: number) => {
    const since = frame - at;
    return since >= 0 && since < 7 ? Math.sin(since * 2.2) * (7 - since) * 1.4 : 0;
  };
  const shake = ring(17) + ring(32);

  return (
    <AbsoluteFill style={{ transform: `translateX(${shake}px)` }}>
      <Footage shot="stare" focus={0.42} zoom={[1, 1.02]} scale={scale} />
      <AbsoluteFill style={{ background: ucPalette.bg, opacity: 0.52 }} />
      <AbsoluteFill
        style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 34 }}
      >
        <Slam word={slamWord} delay={CARRIED} size={116} />
        <div style={{ display: "flex", gap: 16 }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: 12,
                height: 12,
                borderRadius: 6,
                background: ucColors.bone,
                opacity: frame > 8 + i * 9 ? 0.85 : 0,
              }}
            />
          ))}
        </div>
        <Mono size={22} color={ucColors.dim} style={{ opacity: frame > 34 ? 1 : 0 }}>
          no comment
        </Mono>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
