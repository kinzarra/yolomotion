// 03 netflix — 10.0–14.5s. The cinematic beat.
//
// A title card, built the way a title card is built: the red line the N
// arrived on in beat 02 is still lying across the dark, and the mark rises out
// of it bar by bar — the diagonal last, because until it lands the mark is two
// rectangles and could be anything. Only then does the camera pull back far
// enough to show what it was standing next to.
//
// The whole versus group lives in one wrapper whose transform-origin is the
// line itself, so the pull-back and the lift are two numbers and the group can
// never drift down into the caption band at y=1408.
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

const LINE_Y = 1000;
const N_AT = 8;
const BACK_AT = 52;
const UP_AT = 76;
const WAR_AT = 88;

export const NetflixScene: React.FC = () => {
  const frame = useCurrentFrame();

  // The line does not start from nothing: it is the one Netflix cut in on at
  // the end of beat 02, so the first frame of this beat is not a black frame.
  const line = 0.34 + ramp(frame, 0, 16, theme.ease.out) * 0.66;
  const build = ramp(frame, N_AT, N_AT + 32, theme.ease.out);
  const back = ramp(frame, BACK_AT, BACK_AT + 22, theme.ease.inOut);
  const up = ramp(frame, UP_AT, UP_AT + 18, theme.ease.inOut);
  const hit = usePunch(N_AT + 28, 18);

  const nH = interpolate(back, [0, 1], [612, 208]);
  const nW = nH * 0.62;
  const nLeft = interpolate(back, [0, 1], [(1080 - 612 * 0.62) / 2, 806]);
  const ytW = 268;

  return (
    <SceneShell light={0.3}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translateY(${-up * 430}px) scale(${1 - up * 0.34})`,
          transformOrigin: `50% ${(LINE_Y / 1920) * 100}%`,
          // Once the masthead lands the versus group is context, not subject —
          // and dimming it keeps the frame down to one full-strength red.
          opacity: 1 - ramp(frame, WAR_AT - 6, WAR_AT + 10) * 0.45,
        }}
      >
        {/* the line the mark stands on */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: LINE_Y,
            height: 3,
            background: ynPalette.primary,
            transform: `scaleX(${line})`,
            opacity: 0.9,
          }}
        />

        <NetflixMark
          height={nH}
          progress={build}
          style={{
            position: "absolute",
            left: nLeft,
            top: LINE_Y - nH - 8,
            transform: `scale(${1 + hit.pop * 0.03})`,
            transformOrigin: "50% 100%",
          }}
        />
        <div style={{ position: "absolute", left: 806, top: LINE_Y + 30, opacity: back }}>
          <Mono size={27} color={ynColors.bone}>
            NETFLIX
          </Mono>
        </div>

        <YouTubeMark
          width={ytW}
          progress={back}
          style={{
            position: "absolute",
            left: 92,
            top: LINE_Y - ytW * 0.7 - 8,
            opacity: back,
          }}
        />
        <div style={{ position: "absolute", left: 92, top: LINE_Y + 30, opacity: back }}>
          <Mono size={27} color={ynColors.bone}>
            YOUTUBE
          </Mono>
        </div>

        {/* and between them, the thing they are both reaching for */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: LINE_Y - 60,
            textAlign: "center",
            opacity: ramp(frame, BACK_AT + 12, BACK_AT + 28),
            transform: `scale(${interpolate(ramp(frame, BACK_AT + 12, BACK_AT + 28), [0, 1], [0.6, 1])})`,
          }}
        >
          <span
            style={{
              display: "inline-block",
              padding: "18px 26px",
              background: ynPalette.bg,
              border: `2px solid ${ynColors.lineStrong}`,
              fontFamily: theme.fonts.mono,
              fontSize: 30,
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
      <div style={{ position: "absolute", left: 62, right: 62, top: 790 }}>
        <Kinetic text="THE" delay={WAR_AT} size={178} align="flex-start" weight={700} />
        <Kinetic text="CREATOR" delay={WAR_AT + 5} size={178} align="flex-start" weight={700} />
        {/* WAR stays bone. In red it becomes a gaming thumbnail, which is the
            one thing the brief forbids for this beat — and the red is already
            spoken for by the line and the two marks above it. */}
        <Kinetic text="WAR" delay={WAR_AT + 10} size={178} align="flex-start" weight={700} />
      </div>

      <Flash energy={hit.energy} strength={0.16} />
    </SceneShell>
  );
};
