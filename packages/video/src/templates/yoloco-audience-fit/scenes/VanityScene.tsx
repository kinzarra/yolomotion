import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../../theme";
import { yoColors, yoPalette } from "../palette";
import { BrandBar, Kinetic, Rise, SceneShell, useIn } from "../ui";

// 9.0–12.0s — name the thing. One line, stamped.
export const VanityScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const stamp = useIn(0.72 * fps, "bouncy");
  // The dead number drifts up and out behind the verdict.
  const ghost = interpolate(frame, [0, 2.6 * fps], [0, 1], {
    easing: theme.ease.inOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <SceneShell>
      <BrandBar chapter="03 · THE METRIC" />
      <AbsoluteFill
        style={{
          padding: "0 82px",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 62,
            right: 62,
            top: 430,
            textAlign: "center",
            fontFamily: theme.fonts.display,
            fontSize: 200,
            fontWeight: 700,
            letterSpacing: "-0.07em",
            color: yoColors.dim,
            opacity: 0.3 * (1 - ghost),
            transform: `translateY(${ghost * -120}px) scale(${1 + ghost * 0.12})`,
          }}
        >
          1,000,000
        </div>

        <div style={{ marginTop: 40 }}>
          <Kinetic
            text="FOLLOWER COUNT"
            delay={0}
            per={3}
            size={112}
            color={yoPalette.textDim}
          />
          <div
            style={{
              marginTop: 30,
              display: "inline-block",
              width: "fit-content",
              padding: "18px 32px",
              borderRadius: 20,
              border: `4px solid ${yoColors.bad}`,
              background: yoColors.badSoft,
              opacity: stamp,
              transform: `rotate(-2deg) scale(${interpolate(stamp, [0, 1], [1.28, 1])})`,
              transformOrigin: "left center",
            }}
          >
            <span
              style={{
                fontFamily: theme.fonts.display,
                fontSize: 104,
                fontWeight: 700,
                lineHeight: 1,
                letterSpacing: "-0.05em",
                color: yoColors.bad,
              }}
            >
              IS A VANITY
              <br />
              METRIC
            </span>
          </div>
        </div>

        <Rise delay={1.5 * fps} distance={28} style={{ marginTop: 68 }}>
          <div
            style={{
              fontFamily: theme.fonts.body,
              fontSize: 52,
              fontWeight: 600,
              lineHeight: 1.3,
              color: yoPalette.textDim,
            }}
          >
            It measures <span style={{ color: yoPalette.text }}>reach</span>.
            <br />
            It says nothing about{" "}
            <span
              style={{
                color: yoPalette.primary,
                textShadow: `0 0 40px ${yoPalette.glow}`,
              }}
            >
              revenue
            </span>
            .
          </div>
        </Rise>
      </AbsoluteFill>
    </SceneShell>
  );
};
