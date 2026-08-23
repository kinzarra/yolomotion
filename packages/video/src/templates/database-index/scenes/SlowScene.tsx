import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { theme } from "../../../theme";
import { idxColors, idxPalette } from "../palette";
import {
  BrandBar,
  Chip,
  Counter,
  Kinetic,
  RowField,
  SceneShell,
  usePunch,
  useRamp,
} from "../ui";

const COUNT = 170;
const HIT = 42; // the single impact of the video: "100,000 USERS"

/** 3.0–7.0s — "Then you get a hundred thousand… and your database dies." */
export const SlowScene: React.FC<{
  brandName: string;
  chapter: string;
}> = ({ brandName, chapter }) => {
  const frame = useCurrentFrame();
  // The four fat rows of the previous scene collapse into a dense field.
  const grow = useRamp(8, 46, theme.ease.inOut);
  const rowH = interpolate(grow, [0, 1], [92, 13], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const offset = interpolate(frame, [26, 120], [0, -430], {
    easing: theme.ease.out,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const punch = usePunch(HIT, 22);
  // The first screenful of fat rows is there from frame 0; everything below
  // cascades in as the row height collapses.
  const fade = (i: number) =>
    i < 16
      ? 1
      : interpolate(
          grow,
          [(i / COUNT) * 0.5, (i / COUNT) * 0.5 + 0.14],
          [0, 1],
          {
            easing: theme.ease.out,
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          },
        );

  return (
    <SceneShell>
      <BrandBar brandName={brandName} chapter={chapter} />
      <AbsoluteFill
        style={{
          transform: `translate(${punch.shake}px, 0px) scale(${1 + punch.pop * 0.03})`,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 82,
            right: 82,
            top: 250,
            bottom: 180,
            borderRadius: 30,
            border: `1px solid ${idxColors.line}`,
            background: idxColors.surface,
            overflow: "hidden",
          }}
        >
          <RowField
            count={COUNT}
            rowH={rowH}
            height={1490}
            offset={offset}
            fade={fade}
          />
        </div>

        {/* Scrim so the headline never fights the row texture. */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(180deg, ${idxPalette.bg}00 18%, ${idxPalette.bg}D9 38%, ${idxPalette.bg}D9 68%, ${idxPalette.bg}00 88%)`,
          }}
        />
        {/* The alarm flash rides the same decay as the shake. */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: idxColors.danger,
            mixBlendMode: "soft-light",
            opacity: punch.energy * 0.5,
          }}
        />

        <AbsoluteFill
          style={{
            padding: "0 82px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontFamily: theme.fonts.display,
              fontSize: 138,
              fontWeight: 700,
              letterSpacing: "-0.05em",
              lineHeight: 1,
              color: idxPalette.text,
              transform: `scale(${1 + punch.pop * 0.09})`,
              transformOrigin: "left center",
            }}
          >
            <Counter
              from={100}
              to={100000}
              delay={8}
              duration={34}
              easing={theme.ease.inOut}
            />
          </div>
          <Kinetic text="USERS" size={138} delay={-10} />
          <div style={{ marginTop: 58 }}>
            <Kinetic
              text="WHY IS IT"
              size={96}
              delay={HIT + 12}
              color={idxColors.danger}
            />
            <Kinetic
              text="SO SLOW?!"
              size={96}
              delay={HIT + 18}
              color={idxColors.danger}
              glow
            />
          </div>
          <div style={{ marginTop: 54, display: "flex", gap: 20 }}>
            <Chip delay={HIT + 32} tone="danger" dot={false}>
              <Counter
                from={12}
                to={4300}
                delay={HIT + 32}
                duration={26}
                easing={theme.ease.inOut}
              />
              &nbsp;ms
            </Chip>
            <Chip delay={HIT + 38} dot={false}>
              same query
            </Chip>
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
    </SceneShell>
  );
};
