// Beat 12 — the answer in two lines, the poll, the small print. Then, in the
// last second and a half, everything clears and the «КУПИТЬ» button rises back
// to exactly where the hook left it, with the cursor hovering above it — so
// the last frame of the reel is the first frame of the reel.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { theme } from "../../../theme";
import { useRamp } from "../../../reel";
import { dwColors, dwPalette } from "../palette";
import { BrandBar, BuyButton, Chip, Cursor, Eyebrow, Kinetic, SceneShell, useExit } from "../ui";
import { BUY, CHART, CURSOR } from "./shared";

const YES = 6;
const BUT = 28;
const ASK = 58;
const OPT = 76;
const OPT_STEP = 9;
const SMALL = 118;
const CLEAR = 264; // the finale leaves
const RISE = 268; // the button comes back
const POINT = 284; // and the cursor is over it again, settled by the last frame

// Plain eased ramp — not a hook, so it can be called inline in the JSX that
// only renders during the loop tail.
const rampAt = (frame: number, at: number, life = 14) =>
  interpolate(frame, [at, at + life], [0, 1], {
    easing: theme.ease.out,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

export const CtaScene: React.FC<{
  series: string;
  episode: string;
  footnote: string;
  disclaimer: string;
}> = ({ series, episode, footnote, disclaimer }) => {
  const frame = useCurrentFrame();
  const out = useExit(CLEAR, 12);
  const rise = useRamp(RISE, RISE + 30, theme.ease.out);
  const small = useRamp(SMALL, SMALL + 18, theme.ease.out);

  return (
    <SceneShell exit={false}>
      <BrandBar series={series} episode={episode} />

      <div style={{ position: "absolute", inset: 0, opacity: 1 - out, transform: `translateY(${-out * 60}px)` }}>
        <div style={{ position: "absolute", left: 70, right: 70, top: 396 }}>
          <Kinetic
            text="НЕ ПОЗДНО"
            delay={YES}
            per={4}
            size={100}
            mode="snap"
            align="center"
            hero={[0, 1]}
            glow
          />
        </div>
        <div style={{ position: "absolute", left: 70, right: 70, top: 552 }}>
          <Kinetic
            text="НО ТОЛЬКО ЧАСТЯМИ"
            delay={BUT}
            per={4}
            size={62}
            mode="rise"
            align="center"
            color={dwColors.paper}
          />
        </div>

        {frame >= ASK && (
          <div style={{ position: "absolute", left: 0, right: 0, top: 760, display: "flex", justifyContent: "center" }}>
            <Chip delay={ASK} tone="paper" size={24}>
              НАПИШИТЕ ОДНИМ СЛОВОМ
            </Chip>
          </div>
        )}
        {frame >= OPT && (
          <div
            style={{
              position: "absolute",
              left: 70,
              right: 70,
              top: 848,
              display: "flex",
              justifyContent: "center",
              gap: 18,
            }}
          >
            <Chip delay={OPT} size={30}>
              ПОКУПАЮ
            </Chip>
            <Chip delay={OPT + OPT_STEP} size={30}>
              ЖДУ
            </Chip>
            <Chip delay={OPT + OPT_STEP * 2} size={30}>
              НЕ НУЖНА
            </Chip>
          </div>
        )}

        {/* the mandatory line, and where the numbers came from */}
        <div
          style={{
            position: "absolute",
            left: 130,
            right: 130,
            // 950, not 1074: the presenter bubble for the CTA ask sits in the
            // band below it (1070–1370), between this and the captions.
            top: 950,
            padding: "22px 26px",
            border: `2px solid ${dwColors.line}`,
            background: dwColors.surface,
            textAlign: "center",
            fontFamily: theme.fonts.body,
            fontSize: 25,
            fontWeight: 500,
            lineHeight: 1.42,
            letterSpacing: "0.01em",
            color: dwPalette.textDim,
            opacity: small * 0.95,
            transform: `translateY(${(1 - small) * 18}px)`,
          }}
        >
          {disclaimer}
        </div>
        <div
          style={{
            position: "absolute",
            left: 90,
            right: 90,
            top: 1608,
            textAlign: "center",
            fontFamily: theme.fonts.body,
            fontSize: 26,
            fontWeight: 500,
            color: dwPalette.text,
            opacity: small * 0.7,
            transform: `translateY(${(1 - small) * 14}px)`,
          }}
        >
          {footnote}
        </div>
      </div>

      {/* the loop: the button the reel opened on comes back, and so does the
          hook's chart label — everything frame 0 of the reel already has on
          screen has to be here on the last frame, or it pops on the wrap */}
      {frame >= RISE && (
        <>
          <div
            style={{
              position: "absolute",
              left: CHART.left,
              top: 262,
              opacity: rampAt(frame, RISE + 8, 12),
            }}
          >
            <Eyebrow delay={RISE + 8}>USD / RUB</Eyebrow>
          </div>
          <div
            style={{
              position: "absolute",
              left: BUY.left,
              top: interpolate(rise, [0, 1], [1920, BUY.top]),
              transform: `scale(${interpolate(rise, [0, 1], [0.88, 1])})`,
              transformOrigin: "top center",
            }}
          >
            <BuyButton width={BUY.width} height={BUY.height} delay={-40} />
          </div>
          <Cursor x={CURSOR.x + (1 - rampAt(frame, POINT)) * 46} y={CURSOR.y} delay={POINT} />
        </>
      )}
    </SceneShell>
  );
};
