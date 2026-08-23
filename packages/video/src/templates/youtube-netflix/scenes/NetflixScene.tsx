// 03 netflix — 10.0–14.5s. The cinematic beat.
//
// A title card, built the way a title card is built: black, then one red line
// drawn across the dark, then the mark rising out of it bar by bar — the
// diagonal last, because until it lands the mark is two rectangles and could
// be anything. Only then does the camera pull back far enough to show what it
// was standing next to.
//
// THE CREATOR WAR is set as a masthead — flat bone, no glow, no outline, no
// bevel. The brief's one prohibition for this beat is that it must not look
// like a gaming thumbnail, and everything that would make it look like one is
// a light effect.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { theme } from "../../../theme";
import { ynColors, ynPalette } from "../palette";
import {
  Flash,
  Kinetic,
  Mono,
  NetflixMark,
  SceneShell,
  YouTubeMark,
  ramp,
  usePunch,
} from "../ui";

const LINE_AT = 4;
const N_AT = 20;
const BACK_AT = 58;
const UP_AT = 80;
const WAR_AT = 92;

export const NetflixScene: React.FC = () => {
  const frame = useCurrentFrame();

  const line = ramp(frame, LINE_AT, LINE_AT + 20, theme.ease.out);
  const build = ramp(frame, N_AT, N_AT + 34, theme.ease.out);
  const back = ramp(frame, BACK_AT, BACK_AT + 20, theme.ease.inOut);
  const up = ramp(frame, UP_AT, UP_AT + 18, theme.ease.inOut);
  const hit = usePunch(N_AT + 30, 18);

  // One block holds the whole versus composition, so the pull-back and the
  // lift are two numbers rather than six.
  const rowScale = interpolate(back, [0, 1], [1, 0.36]) * interpolate(up, [0, 1], [1, 0.78]);
  const rowY = interpolate(back, [0, 1], [0, 300]) - up * 380;

  return (
    <SceneShell light={0.35}>
      {/* the line the mark stands on */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 985 + rowY,
          height: 3,
          background: ynPalette.primary,
          transform: `scaleX(${line})`,
          opacity: 0.85 - up * 0.5,
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: rowY,
          height: 1920,
          transform: `scale(${rowScale})`,
          transformOrigin: "50% 52%",
        }}
      >
        {/* NETFLIX — centre of the frame while it is the only thing in it,
            then it settles to the right of the line. */}
        <NetflixMark
          height={640}
          progress={build}
          style={{
            position: "absolute",
            left: interpolate(back, [0, 1], [341, 1180]),
            top: interpolate(back, [0, 1], [345, 620]),
            transform: `scale(${1 + hit.pop * 0.03})`,
          }}
        />
        <Mono
          size={30}
          color={ynColors.bone}
          style={{
            position: "absolute",
            left: 1180,
            top: 1300,
            opacity: back,
          }}
        >
          NETFLIX
        </Mono>

        {/* YOUTUBE arrives on the far side of the same line. */}
        <YouTubeMark
          width={420}
          progress={back}
          style={{ position: "absolute", left: -520, top: 690 }}
        />
        <Mono
          size={30}
          color={ynColors.bone}
          style={{ position: "absolute", left: -520, top: 1300, opacity: back }}
        >
          YOUTUBE
        </Mono>

        {/* and between them, the thing they are both reaching for */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 880,
            textAlign: "center",
            opacity: ramp(frame, BACK_AT + 12, BACK_AT + 28),
            transform: `scale(${interpolate(ramp(frame, BACK_AT + 12, BACK_AT + 28), [0, 1], [0.6, 1])})`,
          }}
        >
          <span
            style={{
              display: "inline-block",
              padding: "26px 44px",
              border: `3px solid ${ynColors.lineStrong}`,
              fontFamily: theme.fonts.mono,
              fontSize: 62,
              fontWeight: 700,
              letterSpacing: "0.2em",
              color: ynColors.bone,
            }}
          >
            CREATORS
          </span>
        </div>
      </div>

      {/* the masthead */}
      <div style={{ position: "absolute", left: 60, right: 60, top: 660 }}>
        <Kinetic text="THE" delay={WAR_AT} size={186} align="flex-start" weight={700} />
        <Kinetic
          text="CREATOR"
          delay={WAR_AT + 5}
          size={186}
          align="flex-start"
          weight={700}
        />
        <Kinetic
          text="WAR"
          delay={WAR_AT + 10}
          size={186}
          align="flex-start"
          weight={700}
          color={ynPalette.primary}
        />
      </div>

      <Flash energy={hit.energy} strength={0.16} />
    </SceneShell>
  );
};
