// 09 answer — the payoff, and the only frame in the reel where lime is the
// biggest thing on screen. The bar under it is the argument the headline
// cannot make: the floor of the profession did not disappear, it moved up.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { theme } from "../../../theme";
import { useIn, useRamp, usePunch } from "../../../reel";
import { itColors, itPalette } from "../palette";
import { BrandBar, Eyebrow, Flash, Kinetic, SceneShell } from "../ui";

const BAR_TOP = 910;
const BAR_LIFT = 150;
const RAISE = 62;

export const AnswerScene: React.FC<{ series: string; episode: string }> = ({ series, episode }) => {
  const frame = useCurrentFrame();
  const raise = useRamp(RAISE, RAISE + 30, theme.ease.inOut);
  const punch = usePunch(RAISE + 24, 18);
  const capIn = useIn(RAISE + 22, "snappy");
  // The old floor stays visible under the new one — a bar that simply moved
  // would read as an animation, not as a change.
  const ghost = 1 - useRamp(RAISE + 30, RAISE + 52, theme.ease.in) * 0.7;

  return (
    <SceneShell shake={punch.shake * 0.5}>
      <BrandBar series={series} episode={episode} />

      <div style={{ position: "absolute", left: 90, top: 300 }}>
        <Eyebrow delay={0}>ФИНАЛЬНЫЙ ОТВЕТ</Eyebrow>
      </div>

      {/* 104, not 132: at 132 the three words broke over two lines and the
          sub-headline below landed inside them. */}
      <div style={{ position: "absolute", left: 90, right: 90, top: 370 }}>
        <Kinetic
          text="IT НЕ УМЕР"
          delay={4}
          per={5}
          size={104}
          mode="snap"
          hero={[0, 1, 2]}
          glow
        />
      </div>

      <div style={{ position: "absolute", left: 90, right: 90, top: 530 }}>
        <Kinetic text="УМЕРЛА РУТИНА" delay={26} per={4} size={66} mode="rise" />
      </div>

      {/* The entry bar, lifting. */}
      <div style={{ position: "absolute", left: 90, top: BAR_TOP - BAR_LIFT, width: 900, height: BAR_LIFT + 90 }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: BAR_LIFT,
            width: 900,
            height: 3,
            background: itColors.lineStrong,
            opacity: ghost,
          }}
        />
        {/* «БЫЛО» belongs to the OLD floor and must not travel with the bar —
            the first cut pinned it to the moving edge, which made the label
            say that the old level had gone up. */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: BAR_LIFT + 12,
            fontFamily: theme.fonts.mono,
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: "0.14em",
            color: itPalette.textDim,
            opacity: ghost * 0.8,
          }}
        >
          БЫЛО
        </div>
        <div
          style={{
            position: "absolute",
            right: 0,
            top: interpolate(raise, [0, 1], [BAR_LIFT, 0]) - 34,
            fontFamily: theme.fonts.mono,
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: "0.14em",
            color: itPalette.primary,
            opacity: raise,
          }}
        >
          СТАЛО
        </div>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: interpolate(raise, [0, 1], [BAR_LIFT, 0]),
            width: 900,
            height: 6,
            background: itPalette.primary,
            boxShadow: `0 0 ${26 + punch.pop * 30}px ${itPalette.glow}`,
            transform: `scaleX(${interpolate(raise, [0, 1], [0.2, 1])})`,
            transformOrigin: "left",
          }}
        />
        {/* the rising marker, so the eye follows the move rather than finding
            the bar already at the top */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: interpolate(raise, [0, 1], [BAR_LIFT, 0]) - 44,
            // Unbounded has no ↑ — the arrow is set in the mono face on
            // purpose rather than being left to fall back mid-line.
            fontFamily: theme.fonts.mono,
            fontSize: 34,
            fontWeight: 900,
            letterSpacing: "-0.01em",
            color: itPalette.primary,
            opacity: raise,
          }}
        >
          ↑
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 90,
          right: 90,
          top: 1080,
          opacity: capIn,
          transform: `translateY(${(1 - capIn) * 20}px)`,
        }}
      >
        <span
          style={{
            fontFamily: theme.fonts.wide,
            fontSize: 58,
            fontWeight: 900,
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
            color: itPalette.text,
            display: "inline-block",
            transform: `scale(${1 + Math.sin(frame / 24) * 0.004})`,
          }}
        >
          ПЛАНКА ВХОДА ВЫРОСЛА
        </span>
      </div>

      <Flash amount={punch.energy * 0.4} />
    </SceneShell>
  );
};
