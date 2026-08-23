// Beat 4 — the coin hit. ₽1 slams in from the left, 1 ЦИФРОВОЙ ₽ from the
// right, and the lime = punches into the middle with a shockwave. Captions
// are hidden here: the frame is the line.
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../../theme";
import { usePunch } from "../../../reel";
import { drPalette } from "../palette";
import { BrandBar, Eyebrow, Flash, Glitch, Kinetic, SceneShell, Shockwave } from "../ui";

const LEFT = 4;
const RIGHT = 10;
const EQUALS = 26;

export const ParityScene: React.FC<{ series: string; episode: string }> = ({ series, episode }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const punch = usePunch(EQUALS, 20);
  const l = spring({ frame: frame - LEFT, fps, config: theme.spring.smooth });
  const r = spring({ frame: frame - RIGHT, fps, config: theme.spring.smooth });
  const eq = spring({ frame: frame - EQUALS, fps, config: theme.spring.bouncy });
  const glitch = interpolate(frame, [EQUALS, EQUALS + 2, EQUALS + 12], [0, 1, 0], {
    easing: theme.ease.out,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const breathe = 1 + Math.sin(frame / 18) * 0.02;

  return (
    <SceneShell shake={punch.shake}>
      <BrandBar series={series} episode={episode} />

      <AbsoluteFill style={{ alignItems: "center", paddingTop: 330 }}>
        <Eyebrow delay={2}>Курс зафиксирован</Eyebrow>
      </AbsoluteFill>

      {/* ₽1 */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 470,
          display: "flex",
          justifyContent: "center",
          opacity: l,
          transform: `translateX(${interpolate(l, [0, 1], [-900, 0])}px) skewX(${interpolate(l, [0, 1], [-18, 0])}deg)`,
        }}
      >
        <Kinetic text="₽1" size={300} weight={900} lineHeight={1} />
      </div>

      {/* = */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 820,
          display: "flex",
          justifyContent: "center",
          opacity: Math.min(1, eq * 2),
          transform: `scale(${interpolate(eq, [0, 1], [2.2, 1]) * breathe})`,
        }}
      >
        <Glitch amount={glitch} bands={4}>
          <div
            style={{
              fontFamily: theme.fonts.wide,
              fontSize: 240,
              fontWeight: 900,
              lineHeight: 1,
              color: drPalette.primary,
              textShadow: `0 0 60px ${drPalette.glow}, 0 0 140px ${drPalette.primary}44`,
            }}
          >
            =
          </div>
        </Glitch>
      </div>

      {/* 1 ЦИФРОВОЙ ₽ */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1110,
          display: "flex",
          justifyContent: "center",
          opacity: r,
          transform: `translateX(${interpolate(r, [0, 1], [900, 0])}px) skewX(${interpolate(r, [0, 1], [18, 0])}deg)`,
        }}
      >
        <Kinetic text="1 ЦИФРОВОЙ ₽" size={92} weight={900} align="center" delay={RIGHT} per={4} style={{ justifyContent: "center" }} />
      </div>

      <Shockwave at={EQUALS} life={26} />
      <Shockwave at={EQUALS + 6} life={30} size={1800} />
      <Flash amount={punch.pop * 0.9} />
    </SceneShell>
  );
};
