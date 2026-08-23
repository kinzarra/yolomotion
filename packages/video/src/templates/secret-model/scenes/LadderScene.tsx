// Beat 3 — the lineup, stacked against the only axis this reel is actually
// about: not "which model is smarter", but "which model can you call".
//
// Below the boundary, four models that answer to an API key today: crisp,
// blue, solid. Above it, one slot that does not: dashed, orange, out of
// focus. The stack is an availability axis, never a capability ranking —
// nothing here claims one model beats another.
import React from "react";
import { AbsoluteFill } from "remotion";
import { theme } from "../../../theme";
import { useRamp } from "../../../reel";
import { smColors, smPalette } from "../palette";
import { BrandBar, Chip, Eyebrow, ModelRow, ScanSweep, SceneShell } from "../ui";

const SHIPPING = ["FABLE 5", "OPUS 5", "SONNET 5", "HAIKU 4.5"];

const Boundary: React.FC<{ delay: number }> = ({ delay }) => {
  const draw = useRamp(delay, delay + 16, theme.ease.inOut);
  const pill = useRamp(delay + 10, delay + 22);
  return (
    <div
      style={{
        position: "relative",
        width: 860,
        height: 44,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "50%",
          width: 860 * draw,
          marginLeft: -430 * draw,
          borderTop: `2px dashed ${smColors.lineStrong}`,
        }}
      />
      <span
        style={{
          position: "relative",
          padding: "7px 22px",
          borderRadius: 999,
          background: smPalette.bg,
          border: `1px solid ${smColors.line}`,
          fontFamily: theme.fonts.mono,
          fontSize: 22,
          fontWeight: 700,
          letterSpacing: "0.2em",
          color: smPalette.textDim,
          opacity: pill,
          transform: `scale(${0.86 + pill * 0.14})`,
        }}
      >
        PUBLIC API
      </span>
    </div>
  );
};

export const LadderScene: React.FC<{ brandName: string; chapter: string }> = ({
  brandName,
  chapter,
}) => {
  // "Fable is real" lands around frame 100 of this beat — the glow is timed
  // to the word, not to the beat, and decays before the closing chip so no
  // frame holds two lit things.
  const shine = useRamp(96, 108) * (1 - useRamp(126, 138));

  return (
    <SceneShell>
      <BrandBar brandName={brandName} chapter={chapter} />

      <AbsoluteFill style={{ alignItems: "center", paddingTop: 288 }}>
        <Eyebrow delay={-6}>The lineup · today</Eyebrow>

        <div style={{ marginTop: 40 }}>
          {/* A question mark, not a name. The slot's whole content is "reports
              say there is something here", and that is all it is allowed to
              say until the next beat attributes a name to it. Crisp, because
              a "?" asserts nothing there is anything to be unsure about. */}
          <ModelRow name="?" status="reported" delay={40} blur={0} note="NOT PUBLIC" />
        </div>

        <div style={{ marginTop: 20 }}>
          <Boundary delay={22} />
        </div>

        <div
          style={{
            marginTop: 20,
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          {SHIPPING.map((name, i) => (
            <ModelRow
              key={name}
              name={name}
              status="shipping"
              // Entering bottom-up, and starting before frame 0: the list you
              // already know builds under your feet across the cut, so the
              // beat opens on a stack rather than on an empty frame.
              delay={-i * 4}
              highlight={i === 0 ? shine : 0}
            />
          ))}
        </div>

        <div style={{ marginTop: 42 }}>
          <Chip delay={130} tone="hero" size={28} dashed>
            REPORTED · NOT CONFIRMED
          </Chip>
        </div>
      </AbsoluteFill>

      {/* Mid-beat texture: the stack gets scanned. Keeps something moving
          through the hold between the slot arriving and FABLE lighting up. */}
      <ScanSweep from={66} to={102} />
    </SceneShell>
  );
};
