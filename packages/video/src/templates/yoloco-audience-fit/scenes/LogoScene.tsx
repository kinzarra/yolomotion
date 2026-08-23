import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../../theme";
import { yoColors, yoPalette } from "../palette";
import {
  Rise,
  SceneShell,
  YolocoMark,
  YolocoWordmark,
  useIn,
  useRamp,
} from "../ui";

// 26.0–30.0s — mark, wordmark, tagline, one ask. Holds for the loop.
export const LogoScene: React.FC<{ tagline: string; cta: string }> = ({
  tagline,
  cta,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rule = useRamp(1.5 * fps, 1.95 * fps, theme.ease.out);
  const ctaIn = useIn(2.0 * fps, "bouncy");
  const pulse = 1 + Math.sin(frame / 15) * 0.014;

  return (
    <SceneShell exit={false}>
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: "0 82px",
        }}
      >
        <div style={{ marginTop: -140 }}>
          <YolocoMark size={190} delay={0} />
        </div>

        <div style={{ marginTop: 56 }}>
          <YolocoWordmark delay={0.4 * fps} size={132} />
        </div>

        <div
          style={{
            marginTop: 34,
            width: 380,
            height: 2,
            background: yoPalette.primary,
            transform: `scaleX(${rule})`,
            opacity: 0.7,
          }}
        />

        <Rise delay={0.95 * fps} distance={26} style={{ marginTop: 34 }}>
          <span
            style={{
              fontFamily: theme.fonts.body,
              fontSize: 48,
              fontWeight: 500,
              letterSpacing: "-0.01em",
              color: yoPalette.textDim,
              textAlign: "center",
              display: "block",
            }}
          >
            {tagline}
          </span>
        </Rise>

        <div
          style={{
            position: "absolute",
            left: 82,
            right: 82,
            bottom: 300,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 20,
              padding: "24px 40px",
              borderRadius: 999,
              border: `1px solid ${yoColors.lineStrong}`,
              background: yoColors.surface,
              opacity: ctaIn,
              transform: `translateY(${interpolate(ctaIn, [0, 1], [40, 0])}px) scale(${interpolate(ctaIn, [0, 1], [0.88, pulse])})`,
            }}
          >
            <span
              style={{
                width: 16,
                height: 16,
                borderRadius: "50%",
                background: yoPalette.primary,
                boxShadow: `0 0 26px ${yoPalette.glow}`,
              }}
            />
            <span
              style={{
                fontFamily: theme.fonts.body,
                fontSize: 40,
                fontWeight: 600,
                color: yoPalette.text,
              }}
            >
              {cta}
            </span>
          </div>
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};
