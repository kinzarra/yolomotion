// Beat 5 — the explosion. Weeks of боковик draw as a red flat line, SHORT
// dominoes pop up along it, the price snaps up lime and touches the first
// block, and the cascade runs with an accelerating stagger while the counter
// races to $2.75B. Red ЛИКВИДИРОВАНО slams across the wreckage.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { theme } from "../../../theme";
import { usePunch, useRamp } from "../../../reel";
import { btcColors } from "../palette";
import { BrandBar, Chip, DecimalCounter, Domino, Eyebrow, Flash, Glitch, Kinetic, PriceChart, SceneShell, Shockwave, Stamp, flatLine, upLine, useExit } from "../ui";

const HEAD = 4;
const FLAT_FROM = 10;
const FLAT_TO = 110; // weeks of sideways
const SIDEWAYS = 66; // «после нескольких недель боковика»
const DOMINO = 96; // «набрали шорты»
const BREAK = 206; // «вверх»
const CASCADE = 222; // first block goes
const COUNT = 250; // «закрыли»
const STAMP = 306;

const W = 936;
const H = 420;
const FLAT = flatLine(W * 0.36, H * 0.74, 12, 14, 9);
const UP = upLine(FLAT[FLAT.length - 1], { x: W - 10, y: H * 0.06 }, 14, 4);

const N = 8;
// accelerating stagger: the gaps shrink as the cascade picks up speed
const FALL_AT = Array.from({ length: N }, (_, i) => CASCADE + Math.round(26 * (1 - Math.pow(1 - i / (N - 1), 1.8)) * 2.2));

export const ShortsScene: React.FC<{ series: string; episode: string }> = ({ series, episode }) => {
  const frame = useCurrentFrame();
  const hit = usePunch(BREAK, 18);
  const slam = usePunch(STAMP, 20);
  const flat = useRamp(FLAT_FROM, FLAT_TO, theme.ease.inOut);
  const up = useRamp(BREAK, BREAK + 28, theme.ease.out);
  const headOut = useExit(COUNT - 14, 10);
  const glitch = interpolate(frame, [BREAK - 1, BREAK + 1, BREAK + 10], [0, 1, 0], {
    easing: theme.ease.out,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <SceneShell shake={hit.shake * 0.5 + slam.shake}>
      <BrandBar series={series} episode={episode} />

      <AbsoluteFill style={{ alignItems: "center", paddingTop: 330 }}>
        <Eyebrow delay={2} color={btcColors.bad}>
          Деривативы · ликвидации
        </Eyebrow>
        <div style={{ position: "relative", width: 960, marginTop: 22, minHeight: 250 }}>
          {headOut < 1 && (
            <div style={{ position: "absolute", inset: 0, opacity: 1 - headOut, transform: `translateY(${-headOut * 50}px)` }}>
              <Kinetic text="ВЗРЫВ ШОРТОВ" delay={HEAD} per={5} size={104} align="center" bad={[1]} style={{ justifyContent: "center" }} />
            </div>
          )}
          {frame >= COUNT && (
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
              <DecimalCounter to={2.75} delay={COUNT} frames={96} size={190} prefix="$" suffix="B" />
              <Chip delay={COUNT + 8} tone="bad" size={26}>
                ШОРТОВ ЛИКВИДИРОВАНО
              </Chip>
            </div>
          )}
        </div>
      </AbsoluteFill>

      {/* the chart and the dominoes share a floor */}
      <div style={{ position: "absolute", left: 72, top: 740, width: W, height: H + 40 }}>
        <Glitch amount={glitch} bands={5}>
          <PriceChart id="shorts" width={W} height={H} flat={FLAT} up={UP} flatProgress={flat} upProgress={up} gridRows={3} />
        </Glitch>
        {/* floor */}
        <div style={{ position: "absolute", left: 0, right: 0, top: H + 2, height: 3, background: btcColors.lineStrong }} />
        <div style={{ position: "absolute", left: W * 0.4, top: H - 168, display: "flex", gap: 30 }}>
          {Array.from({ length: N }, (_, i) => {
            const fall = interpolate(frame, [FALL_AT[i], FALL_AT[i] + 14], [0, 1], {
              easing: theme.ease.in,
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            return <Domino key={i} width={54} height={170} fall={fall} delay={DOMINO + i * 7} />;
          })}
        </div>
        <div style={{ position: "absolute", left: 0, top: 10 }}>
          <Chip delay={SIDEWAYS} tone="neutral" size={22}>
            БОКОВИК · НЕСКОЛЬКО НЕДЕЛЬ
          </Chip>
        </div>
        {frame >= STAMP && (
          <div style={{ position: "absolute", left: "50%", top: H * 0.42, transform: "translateX(-50%)" }}>
            <Stamp delay={STAMP} size={62} rotate={-6}>
              ЛИКВИДИРОВАНО
            </Stamp>
          </div>
        )}
      </div>

      <Shockwave at={BREAK} life={24} size={1300} />
      <Flash amount={hit.pop * 0.6} />
      <Flash amount={slam.pop * 0.7} color={btcColors.bad} />
    </SceneShell>
  );
};
