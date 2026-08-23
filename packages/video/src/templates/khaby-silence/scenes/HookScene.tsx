import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../../theme";
import { ksPalette } from "../palette";
import {
  Eyebrow,
  Flash,
  Kinetic,
  Num,
  Photo,
  SceneShell,
  Slam,
  useIn,
  usePunch,
  useRamp,
} from "../ui";

// 0–5s. Black for 0.4s, then 0 slams, then WORDS., then the portrait rises up
// through the type: the zero sits behind his head (only its ring survives),
// WORDS. crosses his collar in front. The editorial block lands top-left and
// the follower count steps 1M → 100M+ in the last second, set into the page
// like a folio number. The hook's type is the caption — no karaoke here.
const ZERO_AT = 12;
const WORDS_AT = 22;
const PORTRAIT_AT = 30;
const COUNT_AT = 90;
const STEPS = [
  { at: 98, label: "1M" },
  { at: 108, label: "10M" },
  { at: 118, label: "50M" },
  { at: 130, label: "100M+" },
];

export const HookScene: React.FC<{ photo: string }> = ({ photo }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const zeroHit = usePunch(ZERO_AT, 14);
  const wordsHit = usePunch(WORDS_AT, 14);
  const shake = zeroHit.shake * 0.45 + wordsHit.shake * 0.35;

  // Slow push on the whole composition once the portrait is in.
  const cam = interpolate(frame, [PORTRAIT_AT, durationInFrames], [1, 1.035], {
    easing: theme.ease.inOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scrim = useRamp(PORTRAIT_AT + 8, PORTRAIT_AT + 30, theme.ease.out);

  const step = STEPS.filter((s) => frame >= s.at).pop();
  const stepHit = usePunch(step?.at ?? 10_000, 12);
  const counterIn = useIn(COUNT_AT, "smooth");

  return (
    <SceneShell>
      <AbsoluteFill
        style={{
          transform: `translate(${shake * 0.4}px, ${shake}px) scale(${cam})`,
          transformOrigin: "50% 58%",
        }}
      >
        {/* 0 — behind the head */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 470,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Slam
            text="0"
            at={ZERO_AT}
            size={820}
            font={theme.fonts.wide}
            weight={900}
            tracking="-0.04em"
          />
        </div>

        {/* the portrait rises through the type */}
        <div style={{ position: "absolute", left: 40, top: 380 }}>
          <Photo src={photo} width={1000} delay={PORTRAIT_AT} rise={420} kb={1.06} fade={240} />
        </div>

        {/* the page darkens under the folio */}
        <AbsoluteFill
          style={{
            background: `linear-gradient(180deg, transparent 60%, ${ksPalette.bg} 93%)`,
            opacity: scrim,
            pointerEvents: "none",
          }}
        />

        {/* WORDS. — in front of the collar */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 1190,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Slam text="WORDS." at={WORDS_AT} size={212} />
        </div>
      </AbsoluteFill>

      {/* editorial block */}
      <div
        style={{
          position: "absolute",
          left: 72,
          top: 230,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 16,
        }}
      >
        <Eyebrow delay={46}>One of the world's biggest creators</Eyebrow>
        <Kinetic text="KHABY LAME" delay={56} per={4} size={66} align="flex-start" />
        <Kinetic
          text="THE POWER OF Silence"
          delay={64}
          per={3}
          size={42}
          weight={500}
          align="flex-start"
          italic={[3]}
          color={ksPalette.text}
        />
      </div>

      {/* folio: the follower count */}
      <div
        style={{
          position: "absolute",
          right: 72,
          top: 1496,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: 16,
          opacity: counterIn,
          transform: `translateY(${interpolate(counterIn, [0, 1], [30, 0])}px)`,
        }}
      >
        <Eyebrow delay={COUNT_AT} align="right">
          Followers
        </Eyebrow>
        <Num
          size={150}
          style={{
            transform: `scale(${1 + stepHit.pop * 0.07})`,
            transformOrigin: "right bottom",
          }}
        >
          {step?.label ?? "0"}
        </Num>
      </div>

      <Flash energy={Math.max(zeroHit.energy, wordsHit.energy)} strength={0.16} />
    </SceneShell>
  );
};
