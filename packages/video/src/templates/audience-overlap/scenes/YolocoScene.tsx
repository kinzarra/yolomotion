import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { theme } from "../../../theme";
import { ovColors, ovPalette } from "../palette";
import {
  BrandBar,
  Chip,
  Counter,
  FIXED_REACH,
  SceneShell,
  UNIQUE_REACH,
  useIn,
  useRamp,
  YolocoTile,
} from "../ui";

// 20–26s — the fix. A Yoloco analysis panel: five creator circles with their
// intersections exposed, the two worst-overlapping creators get cut and
// replaced by creators who bring new segments, and unique reach expands while
// the campaign cost stays put. Green owns this scene.
const R = 112;

type Circle = {
  handle: string;
  from: { x: number; y: number };
  to: { x: number; y: number };
  kind: "keep" | "cut" | "new";
  enter: number; // frame the circle appears
};

const CIRCLES: Circle[] = [
  { handle: "@lily.fit", from: { x: 250, y: 235 }, to: { x: 170, y: 240 }, kind: "keep", enter: 8 },
  { handle: "@max.travels", from: { x: 360, y: 200 }, to: { x: 360, y: 200 }, kind: "cut", enter: 12 },
  { handle: "@nova.beauty", from: { x: 300, y: 330 }, to: { x: 300, y: 330 }, kind: "cut", enter: 16 },
  { handle: "@tech.tom", from: { x: 600, y: 215 }, to: { x: 450, y: 150 }, kind: "keep", enter: 20 },
  { handle: "@chef.mila", from: { x: 700, y: 350 }, to: { x: 730, y: 240 }, kind: "keep", enter: 24 },
  { handle: "@ari.moto", from: { x: -260, y: 390 }, to: { x: 300, y: 390 }, kind: "new", enter: 74 },
  { handle: "@kai.games", from: { x: 1150, y: 390 }, to: { x: 600, y: 390 }, kind: "new", enter: 82 },
];

const CUT_AT = 46;
const MOVE = { from: 70, to: 94 };

export const YolocoScene: React.FC = () => {
  const frame = useCurrentFrame();

  const panel = useIn(0, "smooth");
  const headerIn = useIn(6, "snappy");
  const move = useRamp(MOVE.from, MOVE.to, theme.ease.inOut);
  const lensFade = interpolate(frame, [CUT_AT + 4, CUT_AT + 16], [1, 0], {
    easing: theme.ease.inOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Metrics live in the panel from the start — the reach number sits at the
  // deflated 1.58M in white, then flips green and expands once the new
  // creators land.
  const metricsIn = useIn(16, "smooth");
  const reachHero = frame >= 104;

  const pos = (c: Circle) => {
    if (c.kind === "new") {
      const p = interpolate(frame, [c.enter, c.enter + 18], [0, 1], {
        easing: theme.ease.out,
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      return { x: c.from.x + (c.to.x - c.from.x) * p, y: c.to.y, p };
    }
    return {
      x: c.from.x + (c.to.x - c.from.x) * move,
      y: c.from.y + (c.to.y - c.from.y) * move,
      p: 1,
    };
  };

  // Cut circles: struck at CUT_AT, thrown out of the panel just after.
  const cutOut = interpolate(frame, [CUT_AT + 10, CUT_AT + 24], [0, 1], {
    easing: theme.ease.in,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const lensA = CIRCLES[0].from;
  const lensB = CIRCLES[1].from;
  const lensC = CIRCLES[2].from;

  return (
    <SceneShell>
      <BrandBar chapter="05 · THE FIX" />

      {/* the analysis panel */}
      <div
        style={{
          position: "absolute",
          left: 60,
          right: 60,
          top: 380,
          height: 950,
          borderRadius: 40,
          border: `1px solid ${ovColors.greenLine}`,
          background: ovColors.surface,
          boxShadow: `0 30px 90px -40px ${ovPalette.glow}`,
          opacity: panel,
          transform: `translateY(${interpolate(panel, [0, 1], [60, 0])}px) scale(${interpolate(panel, [0, 1], [0.94, 1])})`,
          overflow: "hidden",
        }}
      >
        {/* header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "34px 40px 0",
            opacity: headerIn,
            transform: `translateY(${interpolate(headerIn, [0, 1], [-16, 0])}px)`,
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <YolocoTile size={46} />
            <span
              style={{
                fontFamily: theme.fonts.display,
                fontSize: 42,
                fontWeight: 700,
                letterSpacing: "-0.03em",
                color: ovPalette.text,
              }}
            >
              Audience Overlap
            </span>
          </span>
          <Chip delay={10} tone="hero" size={20}>
            LIVE ANALYSIS
          </Chip>
        </div>

        {/* venn field */}
        <div style={{ position: "relative", margin: "24px 40px 0", height: 510 }}>
          <svg width={880} height={510} style={{ overflow: "visible" }}>
            <defs>
              <clipPath id="ov-lens-a">
                <circle cx={lensA.x} cy={lensA.y} r={R} />
              </clipPath>
            </defs>

            {/* red intersection lenses (A∩B, A∩C) — the exposed overlap */}
            {lensFade > 0.01 && (
              <g clipPath="url(#ov-lens-a)" opacity={lensFade * rampAt(frame, 26, 40)}>
                <circle cx={lensB.x} cy={lensB.y} r={R} fill="rgba(255, 59, 77, 0.30)" />
                <circle cx={lensC.x} cy={lensC.y} r={R} fill="rgba(255, 59, 77, 0.30)" />
              </g>
            )}

            {CIRCLES.map((c) => {
              const { x, y, p } = pos(c);
              const born = interpolate(frame, [c.enter, c.enter + 12], [0, 1], {
                easing: theme.ease.out,
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              const gone = c.kind === "cut" ? cutOut : 0;
              const stroke =
                c.kind === "new"
                  ? ovPalette.primary
                  : c.kind === "cut" && frame >= CUT_AT
                    ? ovColors.badLine
                    : ovColors.lineStrong;
              const fill =
                c.kind === "new" ? "rgba(0, 255, 133, 0.10)" : "rgba(228, 244, 234, 0.06)";
              return (
                <g
                  key={c.handle}
                  opacity={born * (1 - gone)}
                  transform={`translate(${x}, ${y + gone * 420}) scale(${
                    (0.6 + 0.4 * born) * (1 - gone * 0.4) * (c.kind === "new" ? 0.6 + 0.4 * p : 1)
                  })`}
                >
                  <circle r={R} fill={fill} stroke={stroke} strokeWidth={c.kind === "new" ? 5 : 3} />
                  <text
                    y={c.kind === "new" ? -6 : 8}
                    textAnchor="middle"
                    fontFamily={theme.fonts.mono}
                    fontSize={24}
                    fontWeight={700}
                    fill={ovPalette.text}
                  >
                    {c.handle}
                  </text>
                  {c.kind === "new" && (
                    <text
                      y={30}
                      textAnchor="middle"
                      fontFamily={theme.fonts.mono}
                      fontSize={22}
                      fontWeight={700}
                      letterSpacing="0.1em"
                      fill={ovPalette.primary}
                    >
                      +NEW REACH
                    </text>
                  )}
                  {/* the cut mark */}
                  {c.kind === "cut" && frame >= CUT_AT && (
                    <g
                      opacity={interpolate(frame, [CUT_AT, CUT_AT + 6], [0, 1], {
                        easing: theme.ease.out,
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                      })}
                    >
                      <line x1={-46} y1={-46} x2={46} y2={46} stroke={ovColors.bad} strokeWidth={14} strokeLinecap="round" />
                      <line x1={46} y1={-46} x2={-46} y2={46} stroke={ovColors.bad} strokeWidth={14} strokeLinecap="round" />
                    </g>
                  )}
                </g>
              );
            })}
          </svg>

          {/* overlap % flags over the lenses */}
          <div style={{ position: "absolute", left: 240, top: 130, opacity: lensFade }}>
            <Chip delay={28} tone="bad" size={22}>
              61% OVERLAP
            </Chip>
          </div>
          <div style={{ position: "absolute", left: 46, top: 404, opacity: lensFade }}>
            <Chip delay={34} tone="bad" size={22}>
              48% OVERLAP
            </Chip>
          </div>
        </div>

        {/* metrics: reach expands, cost stays */}
        <div
          style={{
            display: "flex",
            gap: 28,
            padding: "20px 40px 0",
            opacity: metricsIn,
            transform: `translateY(${interpolate(metricsIn, [0, 1], [40, 0])}px)`,
          }}
        >
          <div
            style={{
              flex: 1.25,
              borderRadius: 26,
              border: `1px solid ${ovColors.greenLine}`,
              background: ovColors.greenSoft,
              padding: "24px 30px",
            }}
          >
            <div
              style={{
                fontFamily: theme.fonts.mono,
                fontSize: 23,
                fontWeight: 700,
                letterSpacing: "0.14em",
                color: ovPalette.accent,
              }}
            >
              UNIQUE REACH
            </div>
            <div
              style={{
                marginTop: 10,
                fontFamily: theme.fonts.display,
                fontSize: 74,
                fontWeight: 700,
                letterSpacing: "-0.03em",
                color: reachHero ? ovPalette.primary : ovPalette.text,
                textShadow: reachHero ? `0 0 46px ${ovPalette.glow}` : "none",
              }}
            >
              <Counter to={FIXED_REACH} from={UNIQUE_REACH} delay={106} duration={44} />
            </div>
          </div>
          <div
            style={{
              flex: 1,
              borderRadius: 26,
              border: `1px solid ${ovColors.line}`,
              background: ovColors.surfaceStrong,
              padding: "24px 30px",
            }}
          >
            <div
              style={{
                fontFamily: theme.fonts.mono,
                fontSize: 23,
                fontWeight: 700,
                letterSpacing: "0.14em",
                color: ovPalette.textDim,
              }}
            >
              CAMPAIGN COST
            </div>
            <div
              style={{
                marginTop: 10,
                display: "flex",
                alignItems: "baseline",
                gap: 18,
                fontFamily: theme.fonts.display,
                fontSize: 64,
                fontWeight: 700,
                letterSpacing: "-0.03em",
                color: ovPalette.text,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              $12,000
              <span
                style={{
                  fontFamily: theme.fonts.mono,
                  fontSize: 21,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  color: ovPalette.textDim,
                  border: `1px solid ${ovColors.line}`,
                  borderRadius: 999,
                  padding: "6px 14px",
                }}
              >
                UNCHANGED
              </span>
            </div>
          </div>
        </div>
      </div>
    </SceneShell>
  );
};

// Local eased ramp helper for use inside JSX (not a hook).
const rampAt = (frame: number, from: number, to: number) =>
  interpolate(frame, [from, to], [0, 1], {
    easing: theme.ease.out,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
