// Beat 6 — the provocative frame. Captions are hidden for this line: the
// split IS the sentence, and a smaller copy of it at the bottom of the screen
// would only compete with itself.
//
// Above the tear, blue — the model you can call. Below it, orange — the one
// you can't. The top half dims as the bottom lands, so the eye is pulled
// across the divide rather than asked to read both at once.
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { theme } from "../../../theme";
import { usePunch, useRamp } from "../../../reel";
import { smColors, smPalette } from "../palette";
import { BrandBar, Flash, Kinetic, SceneShell } from "../ui";

const HIT = 62; // the bottom line has fully landed

export const GapScene: React.FC<{ brandName: string; chapter: string }> = ({
  brandName,
  chapter,
}) => {
  const rule = useRamp(22, 40, theme.ease.inOut);
  const pill = useRamp(30, 44);
  const dimTop = useRamp(46, 64);
  const tag = useRamp(HIT + 8, HIT + 24);
  const punch = usePunch(HIT, 18);

  return (
    <SceneShell>
      <BrandBar brandName={brandName} chapter={chapter} />

      <AbsoluteFill style={{ transform: `translateX(${punch.shake * 0.22}px)` }}>
        <div
          style={{
            position: "absolute",
            left: 60,
            right: 60,
            top: 496,
            // Dimmed, not switched off: the top half stays legible so the
            // frame still reads as one sentence with a hinge in it.
            opacity: 1 - dimTop * 0.38,
          }}
        >
          <Kinetic
            text="YOU USE TODAY'S MODEL"
            delay={-6}
            per={4}
            size={104}
            align="center"
            color={smPalette.accent}
            style={{ justifyContent: "center" }}
          />
        </div>

        {/* the tear */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: 862,
            width: 960 * rule,
            marginLeft: -480 * rule,
            height: 2,
            background: `linear-gradient(90deg, ${smColors.line}00, ${smColors.lineStrong}, ${smColors.line}00)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 840,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              padding: "9px 26px",
              borderRadius: 999,
              background: smPalette.bg,
              border: `1px solid ${smColors.line}`,
              fontFamily: theme.fonts.mono,
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: "0.24em",
              color: smPalette.textDim,
              opacity: pill,
              transform: `scale(${0.84 + pill * 0.16})`,
            }}
          >
            MEANWHILE
          </span>
        </div>

        <div
          style={{
            position: "absolute",
            left: 60,
            right: 60,
            top: 972,
            transform: `scale(${1 + punch.pop * 0.03})`,
          }}
        >
          <Kinetic
            text="THEY'RE ALREADY TESTING TOMORROW'S"
            delay={38}
            per={4}
            size={88}
            align="center"
            color={smPalette.primary}
            glow
            style={{ justifyContent: "center" }}
          />
        </div>

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 1302,
            display: "flex",
            justifyContent: "center",
            fontFamily: theme.fonts.mono,
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: "0.2em",
            color: smPalette.textDim,
            opacity: tag,
            transform: `translateY(${interpolate(tag, [0, 1], [18, 0])}px)`,
          }}
        >
          REPORTED · NOT CONFIRMED
        </div>
      </AbsoluteFill>

      <Flash amount={punch.pop * 0.7} color={smPalette.primary} />
    </SceneShell>
  );
};
