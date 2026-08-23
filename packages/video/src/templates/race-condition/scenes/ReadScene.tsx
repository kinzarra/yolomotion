// Beat 2 — both requests reach the row together and both read 1.
// The split is literal: one screen, two symmetric halves, one shared row at
// the bottom that both beams land on at the same frame.
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { theme } from "../../../theme";
import { useRamp } from "../../../reel";
import { rcColors, rcPalette } from "../palette";
import { BrandBar, Chip, RequestBeam, RowCard, SceneShell } from "../ui";

const BEAM_TOP = 470;
const BEAM_LEN = 400;
const ARRIVE = 44; // frame both heads touch the row

export const ReadScene: React.FC<{ brandName: string; chapter: string }> = ({
  brandName,
  chapter,
}) => {
  const split = useRamp(0, 14, theme.ease.out);
  const travel = useRamp(16, ARRIVE, theme.ease.inOut);
  // The row is touched by both at once; the flash decays over 14 frames.
  const flash = useRamp(ARRIVE, ARRIVE + 14, theme.ease.out);
  const touched = 1 - flash;
  const verdict = useRamp(ARRIVE + 8, ARRIVE + 24);
  // Hooks stay at the top level — never inside the map below.
  const labelA = useRamp(2, 16);
  const labelB = useRamp(4, 18);
  const labelIn = [labelA, labelB];

  return (
    <SceneShell>
      <BrandBar brandName={brandName} chapter={chapter} />

      {/* The divider that makes the two halves read as simultaneous, not sequential. */}
      <div
        style={{
          position: "absolute",
          left: 539,
          top: 300,
          width: 2,
          height: 1040 * split,
          background: `linear-gradient(180deg, transparent, ${rcColors.line}, transparent)`,
        }}
      />

      <AbsoluteFill>
        {(["A", "B"] as const).map((who, i) => (
          <div
            key={who}
            style={{
              position: "absolute",
              left: i === 0 ? 82 : 580,
              top: 330,
              width: 418,
              textAlign: i === 0 ? "left" : "right",
              opacity: labelIn[i],
            }}
          >
            <div
              style={{
                fontFamily: theme.fonts.display,
                fontSize: 48,
                fontWeight: 800,
                letterSpacing: "-0.02em",
                color: rcPalette.text,
              }}
            >
              User {who}
            </div>
            <div
              style={{
                marginTop: 8,
                fontFamily: theme.fonts.mono,
                fontSize: 27,
                letterSpacing: "0.1em",
                color: rcColors.req,
              }}
            >
              SELECT tickets
            </div>
          </div>
        ))}

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
            value={<span style={{ color: rcPalette.primary }}>1</span>}
            delay={8}
            tone="hero"
            flash={touched}
            label="row · tickets"
          />
        </div>

        {/* Both halves report the same answer — that is the trap. */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 1178,
            display: "flex",
            justifyContent: "center",
            gap: 26,
            opacity: verdict,
            transform: `translateY(${interpolate(verdict, [0, 1], [18, 0])}px)`,
          }}
        >
          <Chip delay={ARRIVE + 8} tone="req" size={29}>
            A reads 1
          </Chip>
          <Chip delay={ARRIVE + 12} tone="req" size={29}>
            B reads 1
          </Chip>
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};
