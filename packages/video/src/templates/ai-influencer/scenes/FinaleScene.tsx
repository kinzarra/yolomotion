import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { theme } from "../../../theme";
import { aiColors, aiPalette } from "../palette";
import { Her } from "../her";
import { BrandBar, Chip, FrameGlitch, SceneShell, useIn } from "../ui";

// 25.5–30s — extreme close-up on her eyes while the question is asked; the
// right eye glitches twice. YES / NO pop in, then COMMENT BELOW. The last ten
// frames glitch out completely so the loop cuts back to the opening portrait.
const flicker = (frame: number, a: number, b: number, c: number, d: number) =>
  interpolate(frame, [a, b, c, d], [0, 1, 1, 0], {
    easing: theme.ease.inOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

// Her is rendered 700px wide → 910px tall; both eyes sit at (350, 395.5) in
// that box. The wrapper scales about that exact point so it stays pinned.
const EYE_X = 350;
const EYE_Y = 395.5;

export const FinaleScene: React.FC<{ ctaLabel: string }> = ({ ctaLabel }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const eyeGlitch = Math.max(
    flicker(frame, 30, 33, 40, 46),
    flicker(frame, 62, 65, 71, 77),
  );
  const zoom = interpolate(frame, [0, durationInFrames], [6.0, 6.35], {
    easing: theme.ease.inOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const enter = useIn(0, "smooth");

  // CTA block
  const yesIn = useIn(81, "bouncy");
  const noIn = useIn(86, "bouncy");
  const commentIn = useIn(99, "bouncy");
  const dimBack = interpolate(frame, [74, 86], [0, 0.75], {
    easing: theme.ease.inOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Loop seam: full glitch-out over the last 12 frames.
  const loopOut = interpolate(frame, [durationInFrames - 12, durationInFrames - 1], [0, 1], {
    easing: theme.ease.in,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const wiggle = Math.sin(frame / 18) * 1.2;

  return (
    <SceneShell exit={false}>
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <div
          style={{
            position: "absolute",
            left: 540 - EYE_X,
            top: 860 - EYE_Y,
            opacity: enter,
            transform: `scale(${zoom * (1 - loopOut * 0.05)})`,
            transformOrigin: `${EYE_X}px ${EYE_Y}px`,
          }}
        >
          <Her width={700} closeup eyeGlitch={eyeGlitch} split={eyeGlitch * 3 + loopOut * 4} />
        </div>
        {/* keep the close-up moody at the edges */}
        <AbsoluteFill
          style={{
            background: `radial-gradient(circle at 50% 45%, transparent 30%, ${aiPalette.bg}D9 82%)`,
          }}
        />
        {/* top + bottom scrims: the brand strip and captions sit on skin */}
        <AbsoluteFill
          style={{
            background: `linear-gradient(180deg, ${aiPalette.bg}B3, transparent 22%, transparent 60%, ${aiPalette.bg}E6 92%)`,
          }}
        />
        <AbsoluteFill style={{ background: aiPalette.bg, opacity: dimBack * 0.6 + loopOut * 0.55 }} />
      </AbsoluteFill>

      <BrandBar chapter="06 · YOUR CALL" />

      {/* YES / NO */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1100,
          display: "flex",
          justifyContent: "center",
          gap: 56,
          opacity: 1 - loopOut * 0.8,
        }}
      >
        <div
          style={{
            width: 310,
            height: 176,
            borderRadius: 40,
            background: aiColors.white,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: theme.fonts.display,
            fontSize: 86,
            fontWeight: 700,
            letterSpacing: "-0.03em",
            color: aiColors.ink,
            boxShadow: aiColors.shadow,
            opacity: yesIn,
            transform: `translateY(${interpolate(yesIn, [0, 1], [50, 0])}px) scale(${interpolate(yesIn, [0, 1], [0.6, 1])}) rotate(${interpolate(yesIn, [0, 1], [-7, wiggle])}deg)`,
          }}
        >
          YES
        </div>
        <div
          style={{
            width: 310,
            height: 176,
            borderRadius: 40,
            border: `3px solid ${aiColors.lineStrong}`,
            background: aiColors.surface,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: theme.fonts.display,
            fontSize: 86,
            fontWeight: 700,
            letterSpacing: "-0.03em",
            color: aiPalette.text,
            opacity: noIn,
            transform: `translateY(${interpolate(noIn, [0, 1], [50, 0])}px) scale(${interpolate(noIn, [0, 1], [0.6, 1])}) rotate(${interpolate(noIn, [0, 1], [7, -wiggle])}deg)`,
          }}
        >
          NO
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1296,
          display: "flex",
          justifyContent: "center",
          opacity: (1 - loopOut * 0.8) * commentIn,
          transform: `translateY(${interpolate(commentIn, [0, 1], [30, 0])}px)`,
        }}
      >
        <Chip delay={99} red size={34}>
          <span
            style={{
              width: 16,
              height: 16,
              borderRadius: "50%",
              background: aiPalette.primary,
              display: "inline-block",
            }}
          />
          {ctaLabel}
        </Chip>
      </div>

      <FrameGlitch intensity={Math.max(eyeGlitch * 0.35, loopOut)} seed="finale" />
    </SceneShell>
  );
};
