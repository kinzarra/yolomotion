// Beat 3 — both write 0, and the same ticket is sold twice.
// Same spatial layout as the read beat so the frame reads as a continuation:
// same two beams, same row, opposite direction of damage.
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { theme } from "../../../theme";
import { usePunch, useRamp } from "../../../reel";
import { rcColors, rcPalette } from "../palette";
import {
  BrandBar,
  Flash,
  Kinetic,
  RequestBeam,
  RowCard,
  SceneShell,
  Skull,
} from "../ui";

const BEAM_TOP = 470;
const BEAM_LEN = 400;
const WRITE = 34; // both writes land
const SLAM = 62; // SOLD TWICE

export const SoldScene: React.FC<{ brandName: string; chapter: string }> = ({
  brandName,
  chapter,
}) => {
  const travel = useRamp(6, WRITE, theme.ease.inOut);
  const flash = useRamp(WRITE, WRITE + 14, theme.ease.out);
  const punch = usePunch(SLAM, 22);
  // The row drops to 0 on the first write and simply stays there for the
  // second — nothing in the database notices anything went wrong.
  const zeroed = useRamp(WRITE, WRITE + 6);
  const slamIn = useRamp(SLAM, SLAM + 10);
  // Every ramp is read here, at the top level. Remotion re-renders the
  // component once per frame, so a hook called inside a conditional branch
  // would change the hook count mid-timeline and blow up React.
  const sqlA = useRamp(0, 12);
  const sqlB = useRamp(2, 14);
  const subline = useRamp(SLAM + 14, SLAM + 26);

  return (
    <SceneShell>
      <BrandBar brandName={brandName} chapter={chapter} />

      {/* The base layer fades under the slam so the beams do not poke out
          from behind the card as orphan stubs. */}
      <AbsoluteFill
        style={{
          transform: `translateX(${punch.shake}px)`,
          opacity: 1 - slamIn * 0.82,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 82,
            top: 340,
            fontFamily: theme.fonts.mono,
            fontSize: 27,
            letterSpacing: "0.1em",
            color: rcColors.req,
            opacity: sqlA,
          }}
        >
          UPDATE tickets = 0
        </div>
        <div
          style={{
            position: "absolute",
            right: 82,
            top: 340,
            fontFamily: theme.fonts.mono,
            fontSize: 27,
            letterSpacing: "0.1em",
            color: rcColors.req,
            opacity: sqlB,
          }}
        >
          UPDATE tickets = 0
        </div>

        <RequestBeam
          progress={travel}
          color={rcColors.req}
          x={292}
          top={BEAM_TOP}
          height={BEAM_LEN}
        />
        <RequestBeam
          progress={travel}
          color={rcColors.req}
          x={788}
          top={BEAM_TOP}
          height={BEAM_LEN}
        />

        <div style={{ position: "absolute", left: 280, top: 900 }}>
          <RowCard
            value={
              <span style={{ color: zeroed > 0.5 ? rcColors.danger : rcPalette.primary }}>
                {zeroed > 0.5 ? 0 : 1}
              </span>
            }
            delay={-6}
            tone={zeroed > 0.5 ? "danger" : "hero"}
            flash={1 - flash}
            label="row · tickets"
          />
        </div>
      </AbsoluteFill>

      {/* The slam sits above everything, centred, and owns the last 2s. */}
      {slamIn > 0.001 ? (
        <AbsoluteFill
          style={{
            alignItems: "center",
            justifyContent: "center",
            transform: `translateX(${punch.shake}px) scale(${1 + punch.pop * 0.06})`,
          }}
        >
          <div
            style={{
              width: 940,
              padding: "56px 40px 64px",
              borderRadius: 40,
              background: rcColors.surfaceStrong,
              border: `2px solid ${rcColors.danger}`,
              boxShadow: `0 0 120px -20px ${rcColors.dangerGlow}, ${rcColors.shadow}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              opacity: slamIn,
              transform: `translateY(${interpolate(slamIn, [0, 1], [40, 0])}px)`,
            }}
          >
            <Skull size={104} opacity={slamIn} />
            <div style={{ marginTop: 26 }}>
              <Kinetic
                text="SOLD TWICE"
                delay={SLAM + 2}
                size={148}
                align="center"
                color={rcColors.danger}
                // No glow here: Kinetic clips each word to a mask so the
                // reveal can slide, and a text-shadow gets cut into a visible
                // rectangle at the mask edge. The panel carries the glow.
                style={{ width: 840, justifyContent: "center" }}
              />
            </div>
            <div
              style={{
                marginTop: 20,
                fontFamily: theme.fonts.mono,
                fontSize: 30,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: rcPalette.textDim,
                opacity: subline,
              }}
            >
              one seat · two buyers
            </div>
          </div>
        </AbsoluteFill>
      ) : null}

      <Flash amount={punch.pop} />
    </SceneShell>
  );
};
