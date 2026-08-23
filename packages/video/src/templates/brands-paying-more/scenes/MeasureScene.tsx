// 08 measure — 46–52s. What a follower count gives you, and what it doesn't.
// The number is exact and ticks itself off; the three things a brand actually
// needs are question marks. Then the camera pulls back until the block is one
// item in a field of hundreds, and the beat asks the question the last beat
// answers.
//
// The three ??? are this half's single spark of vermilion — they read as one
// column, one element, and nothing else in the frame is coloured.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { theme } from "../../../theme";
import { bpmColors, bpmPalette } from "../palette";
import {
  Eyebrow,
  Field,
  FIELD_CHOSEN,
  Kinetic,
  Mono,
  Num,
  Rule,
  SceneShell,
  Tick,
  ramp,
  useIn,
} from "../ui";

const COUNT_AT = 0;
const TICK_AT = 28;
const UNKNOWN_AT = 40;
const BACK_AT = 100;
const ASK_AT = 138;

const UNKNOWNS = ["Trust", "Brand fit", "Audience sentiment"] as const;

const Unknown: React.FC<{ label: string; at: number }> = ({ label, at }) => {
  const p = useIn(at, "snappy");
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        justifyContent: "space-between",
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [24, 0])}px)`,
      }}
    >
      <Mono size={26} color={bpmColors.bone}>
        {label}
      </Mono>
      <div
        style={{
          fontFamily: theme.fonts.wide,
          fontSize: 62,
          fontWeight: 800,
          letterSpacing: "-0.02em",
          lineHeight: 1,
          color: bpmPalette.primary,
        }}
      >
        ???
      </div>
    </div>
  );
};

export const MeasureScene: React.FC = () => {
  const frame = useCurrentFrame();
  const countIn = useIn(COUNT_AT, "smooth");
  const tick = ramp(frame, TICK_AT, TICK_AT + 16);
  // The pull-back: the block shrinks toward the middle of the page and the
  // haystack it was hiding fades up around it.
  const back = ramp(frame, BACK_AT, BACK_AT + 40, theme.ease.inOut);

  return (
    <SceneShell>
      <Field t={0} dim={back * 0.5} chosen={FIELD_CHOSEN} />

      <AbsoluteFill
        style={{
          transform: `scale(${1 - back * 0.55}) translateY(${back * -70}px)`,
          transformOrigin: "50% 44%",
        }}
      >
        <div style={{ position: "absolute", left: 72, top: 404 }}>
          <Eyebrow delay={COUNT_AT}>Easy to measure</Eyebrow>
        </div>
        <div
          style={{
            position: "absolute",
            left: 72,
            right: 72,
            top: 452,
            display: "flex",
            alignItems: "center",
            gap: 28,
            opacity: countIn,
            transform: `translateY(${interpolate(countIn, [0, 1], [28, 0])}px)`,
          }}
        >
          <Num size={112}>4,829,103</Num>
          <Tick size={66} progress={tick} />
        </div>

        <Rule
          width={936}
          delay={UNKNOWN_AT - 8}
          color={bpmColors.line}
          style={{ position: "absolute", left: 72, top: 640 }}
        />
        <div style={{ position: "absolute", left: 72, top: 682 }}>
          <Eyebrow delay={UNKNOWN_AT - 4} color={bpmPalette.textDim}>
            Hard to measure
          </Eyebrow>
        </div>

        <div
          style={{
            position: "absolute",
            left: 72,
            right: 72,
            top: 750,
            display: "flex",
            flexDirection: "column",
            gap: 34,
          }}
        >
          {UNKNOWNS.map((label, i) => (
            <Unknown key={label} label={label} at={UNKNOWN_AT + i * 9} />
          ))}
        </div>
      </AbsoluteFill>

      {frame >= ASK_AT && (
        <div style={{ position: "absolute", left: 72, right: 72, top: 1176 }}>
          <Kinetic
            text="SO HOW DO YOU choose?"
            delay={ASK_AT}
            per={4}
            size={96}
            italic={[4]}
            lineHeight={1.02}
          />
        </div>
      )}
    </SceneShell>
  );
};
