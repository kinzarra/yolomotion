import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../../theme";
import { aiColors, aiPalette } from "../palette";
import { HerPixels } from "../her";
import { BrandBar, Kinetic, SceneShell, useIn } from "../ui";

// 15.5–21s — the contrast beat. Everything freezes, a status line fails to
// generate "trust", her face breaks apart into pixels, and WOULD YOU TRUST
// HER? lands with "TRUST" synced to the spoken word. Then: stillness.
const TYPED = "generating trust";

export const TrustScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = useIn(0, "smooth");
  const breakup = interpolate(frame, [60, 128], [0, 1], {
    easing: theme.ease.inOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Typewriter status line; FAILED stamps in red once it gives up.
  const typedChars = Math.round(
    interpolate(frame, [20, 50], [0, TYPED.length], {
      easing: theme.ease.out,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );
  const failed = useIn(56, "snappy");
  const caret = Math.sin(frame / 4) > 0 && frame < 56;

  return (
    <SceneShell>
      <BrandBar chapter="04 · THE CATCH" />

      <AbsoluteFill style={{ alignItems: "center" }}>
        {/* frozen — no breathe, no float. The stillness is the point. */}
        <div style={{ marginTop: 430, opacity: enter }}>
          <HerPixels width={620} progress={breakup} />
        </div>
      </AbsoluteFill>

      {/* status line */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1268,
          display: "flex",
          justifyContent: "center",
          gap: 18,
          fontFamily: theme.fonts.mono,
          fontSize: 32,
          fontWeight: 700,
          letterSpacing: "0.08em",
          opacity: enter * (1 - interpolate(frame, [112, 122], [0, 1], {
            easing: theme.ease.in,
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })),
        }}
      >
        <span style={{ color: aiPalette.textDim }}>
          &gt; {TYPED.slice(0, typedChars)}
          {caret ? "▌" : ""}
        </span>
        <span
          style={{
            color: aiPalette.primary,
            opacity: failed,
            transform: `scale(${interpolate(failed, [0, 1], [1.6, 1])})`,
            display: "inline-block",
          }}
        >
          ✕ FAILED
        </span>
      </div>

      {/* WOULD YOU TRUST HER? — TRUST lands on frame 127, with the voice */}
      <div
        style={{
          position: "absolute",
          left: 90,
          right: 90,
          top: 660,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 14,
        }}
      >
        <Kinetic text="WOULD YOU" delay={112} per={6} size={118} align="center" />
        <Kinetic
          text="TRUST"
          delay={127}
          size={210}
          align="center"
          mask={false}
          color={aiPalette.primary}
          style={{ textShadow: `0 0 60px ${aiPalette.glow}, 0 0 120px ${aiPalette.glow}` }}
        />
        <Kinetic text="HER?" delay={138} size={118} align="center" />
      </div>

      {/* faint red pulse behind the word as it lands */}
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background: `radial-gradient(circle at 50% 46%, ${aiColors.redSoft}, transparent 55%)`,
          opacity: interpolate(frame, [126, 131, 150, 164], [0, 1, 0.6, 0], {
            easing: theme.ease.out,
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      />
    </SceneShell>
  );
};
