import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { usePunch } from "../../../reel";
import { theme } from "../../../theme";
import { mbColors, mbPalette } from "../palette";
import {
  BrandBar,
  Odometer,
  PlayerCard,
  SceneShell,
  Slam,
  SourceLabel,
} from "../ui";

// 0–3.5s. The counter is already running when the video starts — that is the
// hook. It ticks under the citation for a beat, then 40 HOURS. slams over it,
// then a hard cut (no fade, that is the point) to COUNTING. in red.
const HOURS_AT = 33; // lands with the spoken word "forty"
const CUT_AT = 68; // hard cut — 40 HOURS. is gone for two frames
const COUNT_AT = 70;

export const HookScene: React.FC<{ sourceLabel: string; photo: string }> = ({
  sourceLabel,
  photo,
}) => {
  const frame = useCurrentFrame();
  const hoursHit = usePunch(HOURS_AT, 14);
  const countHit = usePunch(COUNT_AT, 16);
  const shake = hoursHit.shake + countHit.shake;

  // The card steps back the moment the type takes the frame.
  const dim = interpolate(frame, [HOURS_AT - 3, HOURS_AT + 8], [1, 0.26], {
    easing: theme.ease.inOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ticks = 98421 + frame * 3;

  return (
    <SceneShell>
      <AbsoluteFill style={{ transform: `translate(${shake * 0.5}px, ${shake}px)` }}>
        <BrandBar chapter="01 · 2017" />

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 380,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 30,
            opacity: dim,
          }}
        >
          <PlayerCard
            width={700}
            photo={photo}
            count={ticks}
            progress={interpolate(frame, [0, 105], [0.06, 0.14])}
            timecode="12:41:07"
            delay={2}
          />
          <SourceLabel delay={10}>{sourceLabel}</SourceLabel>
        </div>

        {/* The counter, blown up — then hard-cut out by the headline. */}
        {frame < HOURS_AT && (
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 930,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Odometer value={ticks} size={186} color={mbColors.white} />
          </div>
        )}

        <div
          style={{
            position: "absolute",
            left: 60,
            right: 60,
            top: 900,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Slam text="40 HOURS." at={HOURS_AT} until={CUT_AT} size={178} />
          <Slam
            text="COUNTING."
            at={COUNT_AT}
            size={184}
            color={mbPalette.primary}
            glow
          />
        </div>

        {/* Impact flash — one frame of light on each slam, never a fade. */}
        <AbsoluteFill
          style={{
            background: mbColors.white,
            opacity: Math.max(hoursHit.energy, countHit.energy) * 0.14,
            pointerEvents: "none",
          }}
        />
      </AbsoluteFill>
    </SceneShell>
  );
};
