import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../../theme";
import { ksColors, ksPalette } from "../palette";
import {
  Kinetic,
  Mono,
  Num,
  Rise,
  SceneShell,
  Slam,
  Strike,
  useIn,
  useRamp,
} from "../ui";

// 5–12.5s. 2020 enormous, FACTORY JOB struck through, LOST. — then the page
// clears and the beat goes quiet: a ladder FACTORY ↓ BEDROOM ↓ TIKTOK on the
// left, a phone tilting in on the right with the handle and 0 FOLLOWERS, a
// slab of window light drifting behind. No flashes, no slams after LOST.
const YEAR_AT = 2;
const JOB_AT = 22;
const STRIKE_AT = 46;
const LOST_AT = 60;
const CLEAR_AT = 84;
const LADDER = [
  { label: "FACTORY", at: 92 },
  { label: "BEDROOM", at: 112 },
  { label: "TIKTOK", at: 140 },
];
const PHONE_AT = 150;
const ZERO_AT = 185;

export const JobScene: React.FC<{ handle: string }> = ({ handle }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const strike = useRamp(STRIKE_AT, STRIKE_AT + 12, theme.ease.out);
  const clear = useRamp(CLEAR_AT, CLEAR_AT + 8, theme.ease.in);
  const room = useRamp(CLEAR_AT + 4, CLEAR_AT + 40, theme.ease.out);
  const phone = useIn(PHONE_AT, "smooth");
  const zero = useIn(ZERO_AT, "snappy");
  const float = Math.sin(t * 1.4) * 5;

  return (
    <SceneShell>
      {/* window light — the bedroom, abstracted to one slab of light */}
      <div
        style={{
          position: "absolute",
          left: 600,
          top: -120,
          width: 560,
          height: 1600,
          opacity: room * 0.9,
          background: `linear-gradient(180deg, rgba(237,232,223,0.075), rgba(237,232,223,0.02) 55%, transparent 80%)`,
          transform: `skewX(-16deg) translateX(${Math.sin(t * 0.5) * 14}px)`,
        }}
      />

      {/* act 1: the year, the job, the loss */}
      <AbsoluteFill
        style={{
          opacity: 1 - clear,
          transform: `translateY(${clear * -50}px)`,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 520,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Slam
            text="2020"
            at={YEAR_AT}
            size={250}
            font={theme.fonts.wide}
            weight={900}
            tracking="-0.05em"
          />
        </div>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 860,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div style={{ position: "relative" }}>
            <Kinetic text="FACTORY JOB" delay={JOB_AT} per={5} size={112} />
            <Strike progress={strike} thickness={9} />
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 1010,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Slam text="LOST." at={LOST_AT} size={150} color={ksPalette.text} />
        </div>
      </AbsoluteFill>

      {/* act 2: the ladder */}
      <div
        style={{
          position: "absolute",
          left: 72,
          top: 650,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 10,
        }}
      >
        {LADDER.map((rung, i) => (
          <React.Fragment key={rung.label}>
            {i > 0 && (
              <Rise delay={rung.at - 8} distance={16}>
                <Mono size={34} color={ksPalette.textDim} style={{ lineHeight: 1, paddingLeft: 6 }}>
                  ↓
                </Mono>
              </Rise>
            )}
            <Kinetic text={rung.label} delay={rung.at} size={86} align="flex-start" />
          </React.Fragment>
        ))}
      </div>

      {/* act 2: the phone */}
      <div
        style={{
          position: "absolute",
          left: 590,
          top: 560,
          width: 400,
          height: 820,
          opacity: phone,
          transform: `perspective(1700px) translateX(${interpolate(phone, [0, 1], [140, 0])}px) translateY(${float}px) rotateY(${interpolate(phone, [0, 1], [-38, -16])}deg) rotateX(${4 + Math.sin(t * 0.9) * 1.5}deg)`,
          transformOrigin: "50% 50%",
          borderRadius: 54,
          background: ksColors.surfaceStrong,
          border: `2px solid ${ksColors.lineStrong}`,
          boxShadow: ksColors.shadow,
          overflow: "hidden",
        }}
      >
        {/* glass sheen */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(115deg, rgba(237,232,223,0.07), transparent 45%)`,
          }}
        />
        {/* notch */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: 18,
            width: 120,
            height: 30,
            marginLeft: -60,
            borderRadius: 15,
            background: ksColors.ink,
          }}
        />
        {/* avatar */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: 110,
            width: 112,
            height: 112,
            marginLeft: -56,
            borderRadius: "50%",
            background: ksColors.dim,
            border: `2px solid ${ksColors.lineStrong}`,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: 22,
              width: 40,
              height: 40,
              marginLeft: -20,
              borderRadius: "50%",
              background: ksColors.surfaceStrong,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: 70,
              width: 76,
              height: 60,
              marginLeft: -38,
              borderRadius: "38px 38px 0 0",
              background: ksColors.surfaceStrong,
            }}
          />
        </div>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 250,
            textAlign: "center",
            fontFamily: theme.fonts.mono,
            fontSize: 30,
            fontWeight: 600,
            letterSpacing: "0.02em",
            color: ksColors.bone,
          }}
        >
          {handle}
        </div>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 340,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 14,
            opacity: zero,
            transform: `scale(${interpolate(zero, [0, 1], [1.4, 1])})`,
          }}
        >
          <Num size={124}>0</Num>
          <Mono size={20} color={ksPalette.textDim}>
            Followers
          </Mono>
        </div>
        {/* the empty grid — nothing posted yet */}
        <div
          style={{
            position: "absolute",
            left: 22,
            right: 22,
            top: 560,
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 6,
          }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              style={{
                aspectRatio: "1 / 1",
                background: ksColors.surface,
                border: `1px solid ${ksColors.line}`,
                borderRadius: 4,
              }}
            />
          ))}
        </div>
      </div>
    </SceneShell>
  );
};
