import React from "react";
import {
  AbsoluteFill,
  interpolate,
  random,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { theme } from "../../../theme";
import { aiPalette } from "../palette";
import { Her } from "../her";
import { BrandBar, Chip, FrameGlitch, Kinetic, SceneShell } from "../ui";

// 0–4.5s — slow push-in on the portrait, a glitch that flashes her wireframe,
// then SHE DOESN'T EXIST lands word-by-word with the voiceover. Opens with a
// settling glitch so the finale's glitch-out cuts back here seamlessly.
const flicker = (
  frame: number,
  a: number,
  b: number,
  c: number,
  d: number,
) =>
  interpolate(frame, [a, b, c, d], [0, 1, 1, 0], {
    easing: theme.ease.inOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

export const HookScene: React.FC<{ handle: string; followers: string }> = ({
  handle,
  followers,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Loop seam: the video ends in a full glitch, so it starts settling out of one.
  const settle = interpolate(frame, [0, 8], [1, 0], {
    easing: theme.ease.out,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // The reveal glitch: two quick flickers while the VO says "one problem".
  const burst = Math.max(
    flicker(frame, 55, 58, 64, 70),
    flicker(frame, 72, 74, 78, 83),
  );
  const glitch = Math.max(settle, burst);

  const push = interpolate(frame, [0, durationInFrames], [1, 1.12], {
    easing: theme.ease.inOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const float = Math.sin(frame / 30) * 3;
  const jitter = glitch > 0.05 ? (random(`hk-${Math.floor(frame / 2)}`) - 0.5) * 14 * glitch : 0;

  // Portrait steps back once the headline takes the frame.
  const dim = interpolate(frame, [98, 112], [1, 0.3], {
    easing: theme.ease.inOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <SceneShell>
      <BrandBar chapter="01 · THE INFLUENCER" />

      <AbsoluteFill style={{ alignItems: "center" }}>
        <div
          style={{
            marginTop: 440,
            opacity: dim,
            transform: `translate(${jitter}px, ${float}px) scale(${push})`,
          }}
        >
          <Her width={600} wire={burst} split={glitch * 12} />
        </div>
      </AbsoluteFill>

      {/* handle + followers — she looks like any other creator */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1226,
          display: "flex",
          justifyContent: "center",
          gap: 24,
          opacity: dim,
        }}
      >
        <Chip delay={10} size={27}>
          {handle}
        </Chip>
        <Chip delay={15} size={27}>
          {followers}
        </Chip>
      </div>

      {/* SHE DOESN'T EXIST — words land with the spoken words */}
      <div
        style={{
          position: "absolute",
          left: 90,
          right: 90,
          top: 640,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 18,
        }}
      >
        <Kinetic text="SHE DOESN'T" delay={103} per={7} size={136} align="center" />
        <Kinetic
          text="EXIST."
          delay={117}
          size={200}
          align="center"
          mask={false}
          color={aiPalette.primary}
          style={{ textShadow: `0 0 60px ${aiPalette.glow}, 0 0 120px ${aiPalette.glow}` }}
        />
      </div>

      <FrameGlitch intensity={glitch} seed="hook" />
    </SceneShell>
  );
};
