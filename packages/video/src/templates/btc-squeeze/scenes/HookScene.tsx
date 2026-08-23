// Beat 1 — the pump. A red line stalls sideways, snaps up lime with a glitch,
// +20% slams in on a shockwave, and the ₿ coin punches through the frame.
// On «не в крипте» a red ПАМП? chip flickers and the coin loses its glow:
// the cause is somewhere else.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { theme } from "../../../theme";
import { usePunch, useRamp } from "../../../reel";
import { btcColors } from "../palette";
import { BrandBar, Chip, Coin, Cross, Eyebrow, Flash, Glitch, Kinetic, PriceChart, SceneShell, Shockwave, flatLine, upLine } from "../ui";

const BREAK = 14; // the line turns
const NUMBER = 22; // +20%
const COIN = 38; // ₿ punches through
const PUMP = 126; // «памп»
const NOT = 165; // «не в крипте»

const W = 936;
const H = 440;
const FLAT = flatLine(W * 0.46, H * 0.72, 18, 16, 3);
const UP = upLine(FLAT[FLAT.length - 1], { x: W, y: H * 0.1 }, 12, 5);

export const HookScene: React.FC<{ series: string; episode: string }> = ({ series, episode }) => {
  const frame = useCurrentFrame();
  const punch = usePunch(COIN, 22);
  const hit = usePunch(NUMBER, 16);
  const ask = usePunch(PUMP, 14);

  const flat = useRamp(0, BREAK, theme.ease.inOut);
  const up = useRamp(BREAK, BREAK + 22, theme.ease.out);
  const glitch = interpolate(frame, [BREAK - 1, BREAK + 1, BREAK + 12], [0, 1, 0], {
    easing: theme.ease.out,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const askGlitch = interpolate(frame, [PUMP, PUMP + 2, PUMP + 10], [0, 0.7, 0], {
    easing: theme.ease.out,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const flicker = frame >= PUMP ? (Math.sin(frame * 1.7) > -0.3 ? 1 : 0.25) : 0;
  const float = Math.sin(frame / 24) * 5;

  return (
    <SceneShell shake={punch.shake + hit.shake * 0.4}>
      <BrandBar series={series} episode={episode} />

      <AbsoluteFill style={{ alignItems: "center", paddingTop: 330 }}>
        <Eyebrow delay={2}>Разбор · рынок</Eyebrow>
        <div style={{ marginTop: 26, minHeight: 250, display: "flex", alignItems: "center" }}>
          <Kinetic
            text="+20%"
            delay={NUMBER}
            per={0}
            size={250}
            weight={900}
            color={btcColors.white}
            hero={[0]}
            glow
            mode="snap"
            lineHeight={1}
            style={{ transform: `scale(${1 + hit.pop * 0.08})` }}
          />
        </div>
        <div style={{ marginTop: 10 }}>
          <Chip delay={NUMBER + 10} tone="paper" size={30}>
            ЗА 4 ДНЯ
          </Chip>
        </div>
      </AbsoluteFill>

      {/* the chart */}
      <div style={{ position: "absolute", left: 72, top: 790, width: W, height: H }}>
        <Glitch amount={glitch} bands={6}>
          <PriceChart id="hook" width={W} height={H} flat={FLAT} up={UP} flatProgress={flat} upProgress={up} />
        </Glitch>
      </div>

      {/* the coin, through the frame */}
      {frame >= COIN && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 870, display: "flex", justifyContent: "center" }}>
          <Glitch amount={askGlitch} bands={4}>
            <div
              style={{
                transform: `translateY(${float}px)`,
                opacity: interpolate(frame, [NOT, NOT + 10], [1, 0.4], {
                  easing: theme.ease.inOut,
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
              }}
            >
              <Coin size={300} delay={COIN} from={3.2} lit={false} />
            </div>
          </Glitch>
        </div>
      )}

      {/* ПАМП? — not here */}
      {frame >= PUMP && (
        <div style={{ position: "absolute", left: 110, top: 800, opacity: flicker, transform: "rotate(-6deg)" }}>
          <div style={{ position: "relative" }}>
            <Chip tone="bad" size={30} filled>
              ПАМП?
            </Chip>
            {frame >= NOT && (
              <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}>
                <Cross delay={NOT} size={130} thick={14} />
              </div>
            )}
          </div>
        </div>
      )}

      <Shockwave at={NUMBER} life={24} />
      <Shockwave at={COIN + 2} life={30} size={1900} />
      <Flash amount={punch.pop} />
      <Flash amount={ask.pop * 0.5} color={btcColors.bad} />
    </SceneShell>
  );
};
