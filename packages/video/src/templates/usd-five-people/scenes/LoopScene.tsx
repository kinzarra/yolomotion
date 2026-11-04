// The loop: the stage rebuilds into the hook's first frame, so the last frame
// of the reel IS frame 0 and the feed replays it without a seam. No voice.
import React from "react";
import { Freeze, interpolate, useCurrentFrame } from "remotion";
import { theme } from "../../../theme";
import { HookScene } from "./HookScene";

export const LoopScene: React.FC<{ series: string; episode: string; rate: string }> = (props) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, 14], [0, 1], {
    easing: theme.ease.out,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: p,
        transform: `scale(${interpolate(p, [0, 1], [1.12, 1])})`,
        filter: `blur(${(1 - p) * 14}px)`,
      }}
    >
      <Freeze frame={0}>
        <HookScene {...props} />
      </Freeze>
    </div>
  );
};
