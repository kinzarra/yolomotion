import React from "react";
import { interpolate, random, useCurrentFrame } from "remotion";
import { theme } from "../../../theme";
import { ovColors, ovPalette } from "../palette";
import {
  Avatar,
  BrandBar,
  FrameGlitch,
  INFLUENCERS,
  Kinetic,
  Rise,
  SceneShell,
  Strike,
  TOTAL_FOLLOWERS,
  UNIQUE_REACH,
  useIn,
} from "../ui";

// 10.5–15.5s — TOTAL FOLLOWERS races to 4,377,000, holds… then the illusion
// breaks: the label is struck out and the number deflates into a much smaller
// UNIQUE REACH, in red. The five avatars that fed the sum dim out behind it.
const FLIP = 74;

export const CounterScene: React.FC = () => {
  const frame = useCurrentFrame();

  const up = interpolate(frame, [8, 64], [0, TOTAL_FOLLOWERS], {
    easing: theme.ease.out,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const down = interpolate(frame, [FLIP + 2, FLIP + 42], [TOTAL_FOLLOWERS, UNIQUE_REACH], {
    easing: theme.ease.inOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const value = frame < FLIP ? up : down;

  const burst = interpolate(frame, [FLIP - 2, FLIP + 1, FLIP + 5, FLIP + 10], [0, 1, 1, 0], {
    easing: theme.ease.inOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const shake = burst > 0.05 ? (random(`cn-${Math.floor(frame / 2)}`) - 0.5) * 16 * burst : 0;
  const dimAvatars = interpolate(frame, [FLIP, FLIP + 10], [1, 0.3], {
    easing: theme.ease.inOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const eyebrow = useIn(2, "snappy");
  const label = useIn(6, "smooth");
  const numberIn = useIn(8, "smooth");
  const ghostIn = useIn(FLIP + 2, "snappy");
  const breathe = 1 + Math.sin(frame / 24) * 0.012;

  return (
    <SceneShell>
      <BrandBar chapter="03 · THE ILLUSION" />

      {/* eyebrow */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 470,
          display: "flex",
          justifyContent: "center",
          opacity: eyebrow * 0.9,
          transform: `translateY(${interpolate(eyebrow, [0, 1], [-18, 0])}px)`,
          fontFamily: theme.fonts.mono,
          fontSize: 27,
          fontWeight: 700,
          letterSpacing: "0.16em",
          color: ovPalette.textDim,
        }}
      >
        YOUR DASHBOARD SAYS
      </div>

      {/* struck-out ghost of the vanity metric, after the flip */}
      {frame >= FLIP && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 548,
            display: "flex",
            justifyContent: "center",
            opacity: ghostIn * 0.75,
            transform: `translateY(${interpolate(ghostIn, [0, 1], [16, 0])}px)`,
          }}
        >
          <span
            style={{
              position: "relative",
              fontFamily: theme.fonts.mono,
              fontSize: 32,
              fontWeight: 700,
              letterSpacing: "0.08em",
              color: ovPalette.textDim,
              padding: "4px 10px",
            }}
          >
            TOTAL FOLLOWERS — 4,377,000
            <Strike delay={FLIP + 5} width={8} rot={-3} />
          </span>
        </div>
      )}

      {/* the label: TOTAL FOLLOWERS → UNIQUE REACH */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: frame < FLIP ? 560 : 640,
          display: "flex",
          justifyContent: "center",
        }}
      >
        {frame < FLIP ? (
          <div
            style={{
              opacity: label,
              transform: `translateY(${interpolate(label, [0, 1], [30, 0])}px)`,
              fontFamily: theme.fonts.display,
              fontSize: 60,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: ovPalette.text,
            }}
          >
            TOTAL FOLLOWERS
          </div>
        ) : (
          <Kinetic
            text="UNIQUE REACH"
            delay={FLIP + 3}
            per={4}
            size={72}
            align="center"
            mask={false}
            color={ovColors.bad}
            style={{ textShadow: `0 0 50px ${ovColors.badGlow}` }}
          />
        )}
      </div>

      {/* the big number */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: frame < FLIP ? 680 : 770,
          display: "flex",
          justifyContent: "center",
          opacity: numberIn,
          transform: `translate(${shake}px, ${interpolate(numberIn, [0, 1], [40, 0])}px) scale(${(frame < FLIP ? 1 : 0.86) * breathe})`,
          fontFamily: theme.fonts.display,
          fontSize: 148,
          fontWeight: 700,
          letterSpacing: "-0.04em",
          fontVariantNumeric: "tabular-nums",
          color: frame < FLIP ? ovPalette.text : ovColors.bad,
          textShadow: frame < FLIP ? "none" : `0 0 70px ${ovColors.badGlow}`,
        }}
      >
        {Math.round(value).toLocaleString("en-US")}
      </div>

      {/* the five sources of the sum */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1030,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 18,
          opacity: dimAvatars,
        }}
      >
        {INFLUENCERS.map((inf, i) => (
          <React.Fragment key={inf.handle}>
            {i > 0 && (
              <span
                style={{
                  fontFamily: theme.fonts.mono,
                  fontSize: 40,
                  fontWeight: 700,
                  color: ovPalette.textDim,
                }}
              >
                +
              </span>
            )}
            <Rise delay={12 + i * 4} config="snappy" distance={30}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                <Avatar variant={i} size={104} dim={frame >= FLIP} />
                <span
                  style={{
                    fontFamily: theme.fonts.mono,
                    fontSize: 24,
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    color: ovPalette.textDim,
                  }}
                >
                  {inf.followers}
                </span>
              </div>
            </Rise>
          </React.Fragment>
        ))}
      </div>

      {/* red flash on the flip */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: ovColors.badSoft,
          opacity: burst * 0.8,
          pointerEvents: "none",
        }}
      />
      <FrameGlitch intensity={burst * 0.7} seed="counter" tone="bad" />
    </SceneShell>
  );
};
