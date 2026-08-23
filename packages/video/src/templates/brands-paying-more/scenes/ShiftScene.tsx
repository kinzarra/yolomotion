// 07 shift — 39–46s. The cleanest frame in the reel: no cards, no numbers, no
// accent. REACH is set, then taken apart letter by letter; TRUST slams into
// the space it left; then the two of them resolve into the ladder the whole
// argument has been climbing. Typography only, which is what the brief asked
// this frame to be.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { theme } from "../../../theme";
import { bpmColors, bpmPalette } from "../palette";
import { ArrowDown, Mono, SceneShell, Slam, ramp, usePunch } from "../ui";

const REACH_AT = 0;
const REACH_OUT = 54;
const TRUST_AT = 70;
const TRUST_OUT = 116;
const LADDER_AT = 124;

const RUNGS = ["ATTENTION", "TRUST", "INFLUENCE"] as const;

const Rung: React.FC<{ text: string; at: number; strong: boolean }> = ({ text, at, strong }) => {
  const frame = useCurrentFrame();
  const p = ramp(frame, at, at + 18);
  return (
    <div
      style={{
        fontFamily: theme.fonts.display,
        fontSize: 106,
        fontWeight: 700,
        letterSpacing: "-0.045em",
        lineHeight: 1,
        color: strong ? bpmColors.bone : bpmPalette.textDim,
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [30, 0])}px) scale(${interpolate(
          p,
          [0, 1],
          [0.94, 1],
        )})`,
      }}
    >
      {text}
    </div>
  );
};

export const ShiftScene: React.FC = () => {
  const frame = useCurrentFrame();
  // REACH does not fade: it loosens, drifts up and lets go.
  const loosen = ramp(frame, REACH_OUT, REACH_OUT + 16, theme.ease.in);
  const trustOut = ramp(frame, TRUST_OUT, TRUST_OUT + 10, theme.ease.in);
  const hit = usePunch(TRUST_AT, 18);

  return (
    <SceneShell>
      {frame < REACH_OUT + 16 && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          {/* The label rides in with REACH. Left static it was one orphan
              line in an otherwise black frame for the twenty frames the
              headline takes to arrive. */}
          <div
            style={{
              transform: "translateY(-70px)",
              textAlign: "center",
              opacity: ramp(frame, REACH_AT, REACH_AT + 14) * (1 - loosen),
            }}
          >
            <Mono size={23} style={{ marginBottom: 34 }}>
              Brands used to buy
            </Mono>
            <div
              style={{
                fontFamily: theme.fonts.display,
                fontSize: 224,
                fontWeight: 700,
                lineHeight: 0.92,
                color: bpmColors.bone,
                opacity: (1 - loosen) * ramp(frame, REACH_AT, REACH_AT + 20),
                letterSpacing: `${interpolate(
                  ramp(frame, REACH_AT, REACH_AT + 20),
                  [0, 1],
                  [0.22, -0.05],
                ) + loosen * 0.5}em`,
                transform: `translateY(${loosen * -60}px) scale(${1 - loosen * 0.06})`,
              }}
            >
              REACH
            </div>
          </div>
        </AbsoluteFill>
      )}

      {frame >= TRUST_AT && frame < TRUST_OUT + 10 && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          <div
            style={{
              transform: `translateY(-70px) scale(${(1 + hit.pop * 0.05) * (1 - trustOut * 0.14)})`,
              opacity: 1 - trustOut,
              textAlign: "center",
            }}
          >
            <Mono size={23} style={{ marginBottom: 34 }}>
              Now they buy
            </Mono>
            <Slam text="TRUST" at={TRUST_AT} size={296} />
          </div>
        </AbsoluteFill>
      )}

      {frame >= LADDER_AT && (
        <AbsoluteFill
          style={{
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <div style={{ transform: "translateY(-70px)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <Rung text={RUNGS[0]} at={LADDER_AT} strong={false} />
            <ArrowDown size={56} progress={ramp(frame, LADDER_AT + 10, LADDER_AT + 24)} />
            <Rung text={RUNGS[1]} at={LADDER_AT + 16} strong />
            <ArrowDown size={56} progress={ramp(frame, LADDER_AT + 26, LADDER_AT + 40)} />
            <Rung text={RUNGS[2]} at={LADDER_AT + 32} strong={false} />
          </div>
        </AbsoluteFill>
      )}
    </SceneShell>
  );
};
