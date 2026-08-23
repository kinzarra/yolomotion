import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../../theme";
import { yoColors, yoPalette } from "../palette";
import { BrandBar, Counter, Kinetic, Rise, SceneShell, Strike, useIn } from "../ui";

// 0.0–3.5s — the number fills the frame, then gets destroyed.
export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const strikeAt = 1.4 * fps;
  const slamAt = 1.68 * fps;

  const numberIn = useIn(-6, "snappy");
  // Everything above the strike loses its authority once the line lands.
  const devalue = interpolate(frame, [strikeAt, strikeAt + 14], [0, 1], {
    easing: theme.ease.out,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // The verdict slams in from oversize with a settle, not a fade.
  const slam = useIn(slamAt, "bouncy");
  const shift = interpolate(frame, [slamAt, slamAt + 16], [200, 0], {
    easing: theme.ease.out,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const shake = interpolate(frame, [slamAt, slamAt + 10], [1, 0], {
    easing: theme.ease.out,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <SceneShell>
      <BrandBar chapter="01 · THE TRAP" />
      <AbsoluteFill
        style={{
          padding: "0 82px",
          justifyContent: "center",
          transform: `translateY(${shift - 150}px)`,
        }}
      >
        <div style={{ position: "relative" }}>
          <div
            style={{
              filter: `saturate(${1 - devalue * 0.9}) blur(${devalue * 1.4}px)`,
              opacity: 1 - devalue * 0.38,
              transform: `scale(${1 - devalue * 0.03})`,
            }}
          >
            <div
              style={{
                fontFamily: theme.fonts.display,
                fontSize: 205,
                fontWeight: 700,
                letterSpacing: "-0.06em",
                lineHeight: 0.94,
                color: yoPalette.text,
                opacity: numberIn,
                transform: `translateY(${interpolate(numberIn, [0, 1], [70, 0])}px) scale(${interpolate(numberIn, [0, 1], [0.9, 1])})`,
              }}
            >
              <Counter from={618000} to={1000000} duration={0.72 * fps} />
            </div>
            <Kinetic
              text="FOLLOWERS"
              delay={-6}
              per={0}
              size={158}
              color={yoPalette.primary}
              style={{ marginTop: 6 }}
            />
          </div>
          <div style={{ opacity: 1 - devalue * 0.55 }}>
            <Strike delay={strikeAt} />
          </div>
        </div>

        <div
          style={{
            marginTop: 132,
            opacity: slam,
            transform: `translateY(${Math.sin(shake * 34) * 9 * shake}px) scale(${interpolate(slam, [0, 1], [1.1, 1])})`,
            transformOrigin: "left center",
          }}
        >
          <div
            style={{
              display: "inline-block",
              padding: "22px 34px",
              borderRadius: 22,
              background: yoColors.bad,
              transform: "rotate(-2.2deg)",
            }}
          >
            <span
              style={{
                fontFamily: theme.fonts.display,
                fontSize: 84,
                fontWeight: 700,
                letterSpacing: "-0.04em",
                color: yoPalette.text,
              }}
            >
              DOESN'T MEAN SALES
            </span>
          </div>
        </div>

        <Rise delay={2.5 * fps} distance={26} style={{ marginTop: 46 }}>
          <span
            style={{
              fontFamily: theme.fonts.body,
              fontSize: 44,
              fontWeight: 500,
              color: yoPalette.textDim,
            }}
          >
            A million followers ≠ a million customers.
          </span>
        </Rise>
      </AbsoluteFill>
    </SceneShell>
  );
};
