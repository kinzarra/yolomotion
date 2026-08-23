import React from "react";
import {
  AbsoluteFill,
  interpolate,
  random,
  useCurrentFrame,
} from "remotion";
import { theme } from "../../../theme";
import { ovColors, ovPalette } from "../palette";
import {
  BrandBar,
  CARD_POS,
  FrameGlitch,
  INFLUENCERS,
  Kinetic,
  ProfileCard,
  SceneShell,
} from "../ui";

// 0–6s — five profile cards slam in with payment toasts, "5 INFLUENCERS"
// takes the frame, then a violent burst replaces it with "1 AUDIENCE" in red.
// Opens settling out of a glitch so the finale's glitch-out loops seamlessly.
const flicker = (frame: number, a: number, b: number, c: number, d: number) =>
  interpolate(frame, [a, b, c, d], [0, 1, 1, 0], {
    easing: theme.ease.inOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Loop seam: the video ends in a full glitch, so it starts settling out of one.
  const settle = interpolate(frame, [0, 8], [1, 0], {
    easing: theme.ease.out,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // The violent replacement burst while the VO reaches "the same audience".
  const burst = flicker(frame, 112, 116, 122, 128);
  const glitch = Math.max(settle, burst);
  const jitter =
    glitch > 0.05 ? (random(`hk-${Math.floor(frame / 2)}`) - 0.5) * 14 * glitch : 0;

  // Cards step back once the headline takes the frame, and further on AUDIENCE.
  const dim = interpolate(frame, [46, 58, 116, 126], [1, 0.4, 0.4, 0.22], {
    easing: theme.ease.inOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const drift = Math.sin(frame / 34) * 4;

  // "5 INFLUENCERS" is shredded away by the burst.
  const fiveOut = interpolate(frame, [112, 121], [0, 1], {
    easing: theme.ease.in,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <SceneShell>
      <BrandBar chapter="01 · THE CAMPAIGN" />

      {/* five creators, staggered slams + payment toasts */}
      <div style={{ position: "absolute", inset: 0, opacity: dim }}>
        {INFLUENCERS.map((inf, i) => {
          const pos = CARD_POS[i];
          return (
            <div
              key={inf.handle}
              style={{
                position: "absolute",
                left: pos.x - 230,
                top: pos.y - 92,
                transform: `rotate(${pos.rot}deg) translate(${jitter * (i % 2 === 0 ? 1 : -1)}px, ${drift * (i % 2 === 0 ? 1 : -1)}px)`,
              }}
            >
              <ProfileCard influencer={inf} variant={i} delay={4 + i * 6} toastDelay={14 + i * 6} />
            </div>
          );
        })}
      </div>

      {/* 5 INFLUENCERS → 1 AUDIENCE */}
      <div
        style={{
          position: "absolute",
          left: 70,
          right: 70,
          top: 700,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {frame < 122 && (
          <div
            style={{
              opacity: 1 - fiveOut,
              transform: `scale(${1 + fiveOut * 0.4}) translateX(${jitter * 2}px)`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
            }}
          >
            <Kinetic text="5" delay={52} size={210} align="center" />
            <Kinetic text="INFLUENCERS" delay={58} per={4} size={132} align="center" />
          </div>
        )}
        {frame >= 122 && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <Kinetic
              text="1"
              delay={122}
              size={230}
              align="center"
              mask={false}
              color={ovColors.bad}
              style={{ textShadow: `0 0 60px ${ovColors.badGlow}, 0 0 120px ${ovColors.badGlow}` }}
            />
            <Kinetic
              text="AUDIENCE"
              delay={127}
              size={150}
              align="center"
              mask={false}
              color={ovColors.bad}
              style={{ textShadow: `0 0 60px ${ovColors.badGlow}` }}
            />
          </div>
        )}
      </div>

      <FrameGlitch intensity={glitch} seed="hook" tone={frame < 60 ? "hero" : "bad"} />
    </SceneShell>
  );
};
