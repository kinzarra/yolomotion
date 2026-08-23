// 02 money — 6–14s. Black page. The money ladder climbs the column: $10,000,
// $100,000, $1,000,000+. Each rung flies up from its own baseline and the one
// above steps back, so the eye is always on the newest number. Then the column
// freezes, the footnote sets the record straight about what these figures are,
// and the page clears for BUT THERE'S A CATCH.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { theme } from "../../../theme";
import { bpmColors } from "../palette";
import {
  Eyebrow,
  Flash,
  Footnote,
  Kinetic,
  MoneyStep,
  Rule,
  SceneShell,
  ramp,
  usePunch,
} from "../ui";

const A_AT = 10;
const B_AT = 50;
const C_AT = 86;
const NOTE_AT = 112;
// The clip's last caption page is hidden and starts around frame 189, which is
// where the slam has to land so the frame is never saying the line twice.
const CLEAR_AT = 180;
const CATCH_AT = 189;

export const MoneyScene: React.FC = () => {
  const frame = useCurrentFrame();
  const hit = usePunch(C_AT, 18);
  const clear = ramp(frame, CLEAR_AT, CLEAR_AT + 10, theme.ease.in);

  return (
    <SceneShell>
      <AbsoluteFill
        style={{
          opacity: 1 - clear,
          transform: `translateY(${clear * -50}px) scale(${1 - clear * 0.04})`,
        }}
      >
        <div style={{ position: "absolute", left: 72, top: 372 }}>
          <Eyebrow delay={0}>Creator brand deals</Eyebrow>
        </div>
        <Rule
          width={936}
          delay={6}
          color={bpmColors.line}
          style={{ position: "absolute", left: 72, top: 424 }}
        />

        {/* The ladder — the column grows downward and the type grows with it.
            Unbounded is wide: "$1,000,000+" is eleven glyphs, and anything
            over ~130px runs off the right edge of a 1080 frame. The escalation
            is carried by the 72 → 100 → 128 ramp plus the accent, not by
            pushing the last rung past the margin. */}
        <div style={{ position: "absolute", left: 72, top: 486 }}>
          <MoneyStep value="$10,000" at={A_AT} size={72} dimAt={B_AT} />
        </div>
        <div style={{ position: "absolute", left: 72, top: 618 }}>
          <MoneyStep value="$100,000" at={B_AT} size={100} dimAt={C_AT} />
        </div>
        <div
          style={{
            position: "absolute",
            left: 72,
            top: 786,
            transform: `scale(${1 + hit.pop * 0.045})`,
            transformOrigin: "left bottom",
          }}
        >
          <MoneyStep value="$1,000,000+" at={C_AT} size={128} accent />
        </div>

        <Rule
          width={936}
          delay={NOTE_AT}
          color={bpmColors.line}
          style={{ position: "absolute", left: 72, top: 936 }}
        />
        <Footnote delay={NOTE_AT} style={{ position: "absolute", left: 72, top: 970 }}>
          Reported upper end — not a typical deal
        </Footnote>
        <Footnote delay={NOTE_AT + 8} style={{ position: "absolute", left: 72, top: 1006 }}>
          Range of publicly reported AI brand offers
        </Footnote>
      </AbsoluteFill>

      {frame >= CATCH_AT && (
        <div style={{ position: "absolute", left: 72, right: 72, top: 760 }}>
          <Kinetic text="BUT THERE'S A CATCH." delay={CATCH_AT} per={4} size={116} />
        </div>
      )}

      <Flash energy={hit.energy} strength={0.1} />
    </SceneShell>
  );
};
