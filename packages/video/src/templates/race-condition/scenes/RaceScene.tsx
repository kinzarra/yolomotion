// Beat 4 — naming it. Two requests literally race down two lanes for the same
// row, the headline lands on top of the race, and the punchline explains that
// nothing was broken except the order.
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { theme } from "../../../theme";
import { useRamp } from "../../../reel";
import { rcColors, rcPalette } from "../palette";
import { BrandBar, Chip, Kinetic, SceneShell } from "../ui";

const LANE_X = 132;
const LANE_W = 700;
const FINISH = LANE_X + LANE_W;

export const RaceScene: React.FC<{ brandName: string; chapter: string }> = ({
  brandName,
  chapter,
}) => {
  // The two racers are a hair apart — close enough to be simultaneous, far
  // enough that you can see there are two of them.
  const runA = useRamp(4, 36, theme.ease.inOut);
  const runB = useRamp(6, 38, theme.ease.inOut);
  const lanes = useRamp(0, 12);
  const headline = useRamp(34, 46);
  const dim = useRamp(34, 48);
  const punchline = useRamp(92, 106);

  // Lanes sit low enough that the dimmed track still reads as the ground the
  // headline lands on, rather than leaving a dead band above it.
  const racers = [
    { p: runA, y: 552, label: "A" },
    { p: runB, y: 668, label: "B" },
  ];

  return (
    <SceneShell>
      <BrandBar brandName={brandName} chapter={chapter} />

      {/* The race track, dimmed once the headline takes the frame. */}
      <AbsoluteFill style={{ opacity: 1 - dim * 0.72 }}>
        {racers.map((r) => (
          <React.Fragment key={r.label}>
            <div
              style={{
                position: "absolute",
                left: LANE_X,
                top: r.y,
                width: LANE_W * lanes,
                height: 3,
                background: rcColors.line,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: LANE_X,
                top: r.y - 1,
                width: LANE_W * r.p,
                height: 5,
                borderRadius: 3,
                background: `linear-gradient(90deg, ${rcColors.req}00, ${rcColors.req})`,
                boxShadow: `0 0 24px ${rcColors.req}88`,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: LANE_X + LANE_W * r.p - 13,
                top: r.y - 13,
                width: 26,
                height: 26,
                borderRadius: 13,
                background: rcColors.req,
                boxShadow: `0 0 34px 8px ${rcColors.req}`,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: LANE_X - 46,
                top: r.y - 22,
                fontFamily: theme.fonts.display,
                fontSize: 38,
                fontWeight: 800,
                color: rcPalette.textDim,
              }}
            >
              {r.label}
            </div>
          </React.Fragment>
        ))}

        {/* The finish line is the contested row — both lanes end on it. */}
        <div
          style={{
            position: "absolute",
            left: FINISH,
            top: 506,
            width: 6,
            height: 208,
            borderRadius: 3,
            background: rcPalette.primary,
            boxShadow: `0 0 40px ${rcPalette.glow}`,
            opacity: lanes,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: FINISH - 44,
            top: 736,
            fontFamily: theme.fonts.mono,
            fontSize: 25,
            letterSpacing: "0.14em",
            color: rcPalette.primary,
            opacity: lanes,
          }}
        >
          ROW
        </div>
      </AbsoluteFill>

      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 916, opacity: headline }}>
          <Kinetic
            text="RACE CONDITION"
            delay={34}
            per={4}
            size={162}
            align="center"
            color={rcPalette.text}
            style={{ justifyContent: "center" }}
          />
        </div>

        <div
          style={{
            marginTop: 46,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 18,
            opacity: punchline,
            transform: `translateY(${interpolate(punchline, [0, 1], [26, 0])}px)`,
          }}
        >
          <div
            style={{
              fontFamily: theme.fonts.display,
              fontSize: 52,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: rcPalette.textDim,
              textAlign: "center",
            }}
          >
            Your code worked perfectly.
          </div>
          <Chip delay={96} tone="danger" size={32}>
            IN THE WRONG ORDER
          </Chip>
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};
