import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../../theme";
import { ovColors, ovPalette } from "../palette";
import {
  CARD_POS,
  Chip,
  FrameGlitch,
  Kinetic,
  SceneShell,
  Strike,
  useIn,
  YolocoMark,
  YolocoWordmark,
} from "../ui";

// 26–30s — black screen. STOP BUYING FOLLOWERS is violently replaced by
// START BUYING UNIQUE REACH, then the Yoloco lockup and CTA. The last frames
// glitch out while five circles fly to the opening card positions, so the
// loop cuts straight back into the five profile slams of frame 0.
const SWAP = 38;
const LOGO = 74;

export const FinaleScene: React.FC<{ tagline: string; ctaLabel: string }> = ({
  tagline,
  ctaLabel,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const stopOut = interpolate(frame, [SWAP - 6, SWAP + 2], [0, 1], {
    easing: theme.ease.in,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const swapBurst = interpolate(frame, [SWAP - 4, SWAP, SWAP + 4, SWAP + 9], [0, 1, 1, 0], {
    easing: theme.ease.inOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const startOut = interpolate(frame, [LOGO - 6, LOGO + 2], [0, 1], {
    easing: theme.ease.in,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const taglineIn = useIn(LOGO + 10, "snappy");
  const glowPulse = 0.5 + Math.sin(frame / 11) * 0.5;

  // Loop seam: glitch-out + five circles fly home to the opening layout.
  const loopOut = interpolate(frame, [durationInFrames - 13, durationInFrames - 1], [0, 1], {
    easing: theme.ease.in,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <SceneShell flat exit={false}>
      {/* a single faint pool of green light on the black */}
      <div
        style={{
          position: "absolute",
          left: 540 - 520,
          top: 850 - 520,
          width: 1040,
          height: 1040,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${ovPalette.primary}12, transparent 62%)`,
          transform: `scale(${1 + Math.sin(frame / 40) * 0.05})`,
        }}
      />

      {/* STOP BUYING FOLLOWERS. */}
      {frame < SWAP + 2 && (
        <div
          style={{
            position: "absolute",
            left: 70,
            right: 70,
            top: 730,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 14,
            opacity: 1 - stopOut,
            transform: `scale(${1 + stopOut * 0.35})`,
          }}
        >
          <Kinetic text="STOP BUYING" delay={4} per={5} size={124} align="center" />
          <div style={{ position: "relative", padding: "0 14px" }}>
            <Kinetic text="FOLLOWERS." delay={14} size={150} align="center" />
            <Strike delay={26} width={14} rot={-5} />
          </div>
        </div>
      )}

      {/* START BUYING UNIQUE REACH. */}
      {frame >= SWAP + 2 && frame < LOGO + 2 && (
        <div
          style={{
            position: "absolute",
            left: 70,
            right: 70,
            top: 730,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 14,
            opacity: 1 - startOut,
            transform: `scale(${1 + startOut * 0.3})`,
          }}
        >
          <Kinetic text="START BUYING" delay={SWAP + 2} per={5} size={124} align="center" />
          <Kinetic
            text="UNIQUE REACH."
            delay={SWAP + 12}
            per={5}
            size={144}
            align="center"
            mask={false}
            color={ovPalette.primary}
            style={{ textShadow: `0 0 60px ${ovPalette.glow}, 0 0 120px ${ovPalette.glow}` }}
          />
        </div>
      )}

      {/* Yoloco lockup + CTA */}
      {frame >= LOGO && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 620,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            opacity: 1 - loopOut * 0.85,
          }}
        >
          <YolocoMark size={168} delay={LOGO} />
          <div style={{ marginTop: 34 }}>
            <YolocoWordmark delay={LOGO + 6} size={96} />
          </div>
          <div
            style={{
              marginTop: 30,
              fontFamily: theme.fonts.mono,
              fontSize: 29,
              fontWeight: 700,
              letterSpacing: "0.2em",
              color: ovPalette.textDim,
              opacity: taglineIn,
              transform: `translateY(${interpolate(taglineIn, [0, 1], [22, 0])}px)`,
            }}
          >
            {tagline}
          </div>
          <div style={{ marginTop: 44 }}>
            <Chip delay={LOGO + 16} tone="hero" size={34}>
              <span
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  background: ovPalette.primary,
                  display: "inline-block",
                  opacity: 0.4 + glowPulse * 0.6,
                }}
              />
              {ctaLabel}
            </Chip>
          </div>
        </div>
      )}

      {/* loop seam: circles fly back to the five opening cards */}
      {loopOut > 0.01 &&
        CARD_POS.map((posn, i) => {
          const p = spring({
            frame: frame - (durationInFrames - 13) - i * 1.5,
            fps,
            config: theme.spring.snappy,
          });
          const x = 540 + (posn.x - 540) * p;
          const y = 800 + (posn.y - 800) * p;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: x - 44,
                top: y - 44,
                width: 88,
                height: 88,
                borderRadius: "50%",
                border: `3px solid ${ovPalette.accent}`,
                opacity: Math.min(p, 1) * 0.55 * loopOut,
                transform: `scale(${0.4 + p * 0.8})`,
              }}
            />
          );
        })}

      <FrameGlitch intensity={Math.max(swapBurst * 0.7, loopOut)} seed="finale" tone={frame < SWAP + 4 ? "bad" : "hero"} />
    </SceneShell>
  );
};
