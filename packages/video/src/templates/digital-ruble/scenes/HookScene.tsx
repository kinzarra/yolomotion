// Beat 1 — the card you know, the alarm, and what it turns into.
// Hits: card floats in → ALARM (red flash + shake, glitch tears the card) →
// the card collapses into the lime pixel ₽ → the headline prints above it →
// a red КОНТРОЛЬ? chip flickers when the question is asked.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { theme } from "../../../theme";
import { usePunch } from "../../../reel";
import { drColors } from "../palette";
import { BankCard, BrandBar, Chip, Eyebrow, Flash, Glitch, Kinetic, RubleMark, SceneShell } from "../ui";

const ALARM = 24; // the card tears
const MARK = ALARM + 7; // the ₽ lands
const QUESTION = 124; // «…контролировать государство?»

export const HookScene: React.FC<{ series: string; episode: string }> = ({ series, episode }) => {
  const frame = useCurrentFrame();
  const punch = usePunch(ALARM, 20);
  const ask = usePunch(QUESTION, 16);

  // The card collapses on its vertical axis as the glitch peaks; the mark
  // inherits the spot.
  const collapse = interpolate(frame, [ALARM + 1, ALARM + 8], [1, 0], {
    easing: theme.ease.in,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const glitch = interpolate(frame, [ALARM - 2, ALARM, ALARM + 14], [0, 1, 0], {
    easing: theme.ease.out,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const askGlitch = interpolate(frame, [QUESTION, QUESTION + 3, QUESTION + 12], [0, 0.6, 0], {
    easing: theme.ease.out,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const float = Math.sin(frame / 26) * 6;
  const tilt = -7 + Math.sin(frame / 40) * 2;
  const flicker = frame >= QUESTION ? (Math.sin(frame * 1.9) > -0.2 ? 1 : 0.3) : 0;

  return (
    <SceneShell shake={punch.shake + ask.shake * 0.3}>
      <BrandBar series={series} episode={episode} />

      <AbsoluteFill style={{ alignItems: "center", paddingTop: 330 }}>
        <Eyebrow delay={2}>Разбор · деньги</Eyebrow>
        <div style={{ width: 940, marginTop: 40, minHeight: 250 }}>
          <Kinetic
            text="ЦИФРОВОЙ РУБЛЬ"
            delay={MARK + 6}
            per={5}
            size={100}
            align="center"
            style={{ justifyContent: "center" }}
          />
        </div>
        <div style={{ marginTop: 22 }}>
          <Chip delay={MARK + 22} tone="paper" size={30}>
            УЖЕ С 1 СЕНТЯБРЯ
          </Chip>
        </div>
      </AbsoluteFill>

      {/* the object: card → mark, same spot */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingTop: 300 }}>
        {collapse > 0 && (
          <Glitch amount={glitch} bands={6}>
            <div
              style={{
                transform: `translateY(${float}px) rotate(${tilt}deg) scaleX(${collapse}) scaleY(${0.6 + collapse * 0.4})`,
              }}
            >
              <BankCard width={680} delay={-4} />
            </div>
          </Glitch>
        )}
        {frame >= MARK && (
          <div style={{ position: "absolute", transform: `translateY(${float * 0.6}px)` }}>
            <Glitch amount={askGlitch} bands={4}>
              <RubleMark size={400} delay={MARK} />
            </Glitch>
          </div>
        )}
        {frame >= QUESTION && (
          <div
            style={{
              position: "absolute",
              right: 96,
              top: 760,
              opacity: flicker,
              transform: `rotate(6deg)`,
            }}
          >
            <Chip tone="bad" size={28} filled>
              КОНТРОЛЬ?
            </Chip>
          </div>
        )}
      </AbsoluteFill>

      <Flash amount={punch.pop} color={drColors.bad} />
      <Flash amount={ask.pop * 0.5} color={drColors.bad} />
    </SceneShell>
  );
};
