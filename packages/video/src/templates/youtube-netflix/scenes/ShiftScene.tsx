// 08 shift — 36.8–42.3s. The key moment.
//
// The versus block does not dissolve into the new one, it TURNS: one physical
// flip on its own horizontal axis, old face out, new face in. The information
// is that the fight changed sides — creators are no longer the challenger, they
// are the prize — and a flip is the only transition that says "same object,
// other side".
//
// Then FOR CREATORS. takes 90% of the width, and the frame fills with the
// furniture of a signing: shutter flashes, contract rules, deal terms.
//
// Screenshot frame #2.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { theme } from "../../../theme";
import { ynColors, ynPalette } from "../palette";
import { Flash, Folio, SceneShell, Slam, ramp, usePunch } from "../ui";

const FLIP_AT = 46;
const LIFT_AT = 62;
const FOR_AT = 84;
const TERMS_AT = 118;

const TERMS = ["EXCLUSIVITY", "TERM", "FINANCING", "BRAND RIGHTS"];

// The platform marks are deliberately absent from this beat. They have been
// established for thirty seconds by now, and two red plates either side of two
// red words is four accents in one frame — the words alone are unmistakable.
const Side: React.FC<{
  label: string;
  color: string;
  align: "left" | "right";
}> = ({ label, color, align }) => (
  <div
    style={{
      textAlign: align,
      fontFamily: theme.fonts.display,
      fontSize: 122,
      fontWeight: 700,
      letterSpacing: "-0.05em",
      lineHeight: 1,
      whiteSpace: "nowrap",
      color,
    }}
  >
    {label}
  </div>
);

// VS, centred, with a rule running out of it both ways — the graphic device a
// fixture card uses, and the thing that makes the two words read as opposed
// rather than merely stacked.
const Versus: React.FC<{ color: string }> = ({ color }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 22, margin: "22px 0" }}>
    <div style={{ flex: 1, height: 2, background: ynColors.line }} />
    <span
      style={{
        fontFamily: theme.fonts.mono,
        fontSize: 34,
        fontWeight: 700,
        letterSpacing: "0.28em",
        color,
      }}
    >
      VS
    </span>
    <div style={{ flex: 1, height: 2, background: ynColors.line }} />
  </div>
);

export const ShiftScene: React.FC = () => {
  const frame = useCurrentFrame();

  const flip = ramp(frame, FLIP_AT, FLIP_AT + 26, theme.ease.inOut);
  const angle = flip * 180;
  const back = angle >= 90;
  const lift = ramp(frame, LIFT_AT, LIFT_AT + 22, theme.ease.inOut);

  const bulbA = usePunch(FOR_AT + 12, 14);
  const bulbB = usePunch(FOR_AT + 32, 14);
  const bulbC = usePunch(FOR_AT + 54, 14);
  const flash = bulbA.energy + bulbB.energy * 0.8 + bulbC.energy * 0.6;

  return (
    <SceneShell light={0.4}>
      <Folio left="06 · THE REAL SHIFT" right="TRANSFER MARKET" delay={-6} />

      {/* ------------------------------------------------ the block that turns */}
      <div
        style={{
          position: "absolute",
          left: 70,
          right: 70,
          top: 560,
          transform: `translateY(${-lift * 250}px) scale(${interpolate(lift, [0, 1], [1, 0.74])})`,
          transformOrigin: "50% 0%",
          // Once the conclusion is on the page the fixture card is context —
          // dimming it keeps FOR CREATORS. the thing the eye lands on.
          opacity: 1 - ramp(frame, FOR_AT - 4, FOR_AT + 14) * 0.4,
        }}
      >
        <div
          style={{
            transform: `perspective(1800px) rotateX(${back ? angle - 180 : angle}deg)`,
            transformOrigin: "50% 50%",
          }}
        >
          {back ? (
            <>
              <Side label="YOUTUBE" color={ynPalette.primary} align="left" />
              <Versus color={ynColors.dim} />
              <Side label="NETFLIX" color={ynPalette.primary} align="right" />
            </>
          ) : (
            <>
              <Side label="CREATORS" color={ynColors.bone} align="left" />
              <Versus color={ynColors.dim} />
              <Side label="HOLLYWOOD" color={ynColors.bone} align="right" />
            </>
          )}
        </div>
      </div>

      {/* --------------------------------------------------- the conclusion */}
      <div style={{ position: "absolute", left: 66, top: 940 }}>
        <Slam text="FOR" at={FOR_AT} size={92} align="left" color={ynPalette.textDim} />
      </div>
      <div style={{ position: "absolute", left: 60, top: 1024 }}>
        <Slam text="CREATORS." at={FOR_AT + 6} size={182} align="left" />
      </div>
      <div
        style={{
          position: "absolute",
          left: 66,
          top: 1272,
          width: 948 * ramp(frame, FOR_AT + 14, FOR_AT + 34),
          height: 4,
          background: ynPalette.primary,
        }}
      />

      {/* deal terms ticking in along the bottom rule — the paperwork of a
          transfer, kept to mono so it never competes with the headline */}
      <div
        style={{
          position: "absolute",
          left: 66,
          right: 66,
          top: 1306,
          display: "flex",
          justifyContent: "space-between",
          fontFamily: theme.fonts.mono,
          fontSize: 21,
          fontWeight: 500,
          letterSpacing: "0.16em",
          color: ynColors.dim,
        }}
      >
        {TERMS.map((t, i) => (
          <span key={t} style={{ opacity: ramp(frame, TERMS_AT + i * 6, TERMS_AT + i * 6 + 12) }}>
            {t}
          </span>
        ))}
      </div>

      {/* shutters */}
      <Flash energy={flash} strength={0.13} />
    </SceneShell>
  );
};
