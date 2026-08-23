import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { usePunch } from "../../../reel";
import { theme } from "../../../theme";
import { mbColors, mbPalette } from "../palette";
import {
  BrandBar,
  Chip,
  Cursor,
  Cutout,
  SceneShell,
  Scanlines,
  YolocoMark,
  YolocoWordmark,
  useIn,
  useRamp,
} from "../ui";

// 43–50s. The turn: the pointer that has been hovering since beat 04 finally
// clicks, the curve leaves the floor, and the piece resolves into the brand.
// The click is the only red impact in the scene; the curve inherits it.
const CLICK = 116; // lands on the spoken word "click"
const DRAW = { from: 118, to: 150 };
const BRAND_AT = 154;

const G_W = 800;
const G_H = 300;
const CURVE =
  "M 0 288 L 108 280 L 216 268 L 322 256 L 424 236 L 512 198 L 578 136 L 630 66 L 668 10";
// The pre-click stretch of the same curve — drawn dim while the pointer is
// still travelling, so the panel is never an empty box waiting for the click.
const FLAT = "M 0 288 L 108 280 L 216 268 L 322 256 L 424 236";

export const YolocoScene: React.FC<{
  tagline: string;
  ctaLabel: string;
  photo: string;
  credit: string;
}> = ({ tagline, ctaLabel, photo, credit }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const card = useIn(0, "smooth");
  const panel = useIn(14, "smooth");
  const hit = usePunch(CLICK, 18);
  const draw = useRamp(DRAW.from, DRAW.to, theme.ease.inOut);
  const tip = useIn(DRAW.to - 6, "bouncy");
  const flat = useRamp(20, 86, theme.ease.out);

  // The pointer comes back in and lands on the thumbnail.
  const travel = useRamp(52, CLICK - 4, theme.ease.inOut);
  const cx = interpolate(travel, [0, 1], [1010, 566]);
  const cy = interpolate(travel, [0, 1], [1560, 470]);
  const clickRing = interpolate(frame, [CLICK, CLICK + 16], [1, 0], {
    easing: theme.ease.out,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // 0 → 1 over the click, which is exactly how the ring reads: born small
  // and bright at the pointer, gone by the time the curve leaves the floor.
  const clicking = frame >= CLICK && frame < CLICK + 16 ? 1 - clickRing : 0;

  // The card hands the frame over to the brand.
  const cardOut = interpolate(frame, [BRAND_AT - 12, BRAND_AT + 4], [1, 0], {
    easing: theme.ease.in,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const dim = interpolate(frame, [BRAND_AT - 6, BRAND_AT + 14], [1, 0.22], {
    easing: theme.ease.inOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const [line1, line2] = tagline.split("|");
  const tagIn = useIn(BRAND_AT + 12, "smooth");
  const creditIn = useIn(BRAND_AT + 34, "smooth");
  const breathe = Math.sin((frame / fps) * 1.9) * 3;

  return (
    <SceneShell exit={false}>
      <AbsoluteFill
        style={{ transform: `translate(${hit.shake * 0.4}px, ${hit.shake * 0.8}px)` }}
      >
        <BrandBar chapter="08 · THE CLICK" />

        {/* the thumbnail, one last time */}
        <div
          style={{
            position: "absolute",
            left: (1080 - 480) / 2,
            top: 340,
            width: 480,
            height: 270,
            borderRadius: 20,
            overflow: "hidden",
            background: mbColors.tape,
            border: `1px solid ${mbColors.line}`,
            boxShadow: mbColors.shadow,
            opacity: card * cardOut,
            transform: `translateY(${interpolate(card, [0, 1], [44, 0])}px) scale(${interpolate(card, [0, 1], [0.9, 1]) * (1 + hit.pop * 0.06)})`,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `radial-gradient(circle at 50% 46%, ${mbColors.tapeLift}, ${mbColors.tape} 72%)`,
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              paddingLeft: 22,
              fontFamily: theme.fonts.display,
              fontSize: 62,
              fontWeight: 800,
              letterSpacing: "-0.05em",
              color: mbColors.white,
              textShadow: `4px 4px 0 ${mbPalette.primary}`,
            }}
          >
            100,000
          </div>
          <Cutout photo={photo} height={224} delay={2} tilt={-1.5} style={{ right: 4 }} />
          <Scanlines opacity={0.18} period={5} />
        </div>

        {/* what the click does */}
        <div
          style={{
            position: "absolute",
            left: (1080 - G_W) / 2,
            top: 690,
            width: G_W,
            opacity: panel * dim,
            transform: `translateY(${interpolate(panel, [0, 1], [40, 0])}px)`,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: 18,
              fontFamily: theme.fonts.mono,
              fontSize: 25,
              fontWeight: 700,
              letterSpacing: "0.14em",
              color: mbPalette.textDim,
            }}
          >
            <span>VIEWS</span>
            <span>AFTER THE CLICK</span>
          </div>
          <div
            style={{
              position: "relative",
              width: G_W,
              height: G_H,
              borderLeft: `2px solid ${mbColors.lineStrong}`,
              borderBottom: `2px solid ${mbColors.lineStrong}`,
            }}
          >
            {[0.25, 0.5, 0.75].map((g) => (
              <div
                key={g}
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: G_H * g,
                  height: 1,
                  background: mbColors.line,
                }}
              />
            ))}
            <svg
              width={G_W}
              height={G_H}
              viewBox={`0 0 ${G_W} ${G_H}`}
              style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}
            >
              <path
                d={FLAT}
                fill="none"
                stroke={mbColors.lineStrong}
                strokeWidth={6}
                strokeLinecap="round"
                strokeLinejoin="round"
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - flat}
              />
              <path
                d={CURVE}
                fill="none"
                stroke={mbPalette.primary}
                strokeWidth={9}
                strokeLinecap="round"
                strokeLinejoin="round"
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - draw}
                style={{
                  filter:
                    dim > 0.9 ? `drop-shadow(0 0 26px ${mbPalette.glow})` : undefined,
                }}
              />
            </svg>
            {draw > 0.92 && (
              <div
                style={{
                  position: "absolute",
                  left: 668,
                  top: 10,
                  width: 26,
                  height: 26,
                  marginLeft: -13,
                  marginTop: -13,
                  borderRadius: "50%",
                  background: mbPalette.primary,
                  boxShadow: `0 0 44px ${mbPalette.glow}`,
                  transform: `scale(${interpolate(tip, [0, 1], [0.2, 1])})`,
                }}
              />
            )}
          </div>
        </div>

        {/* brand resolve */}
        <div
          style={{
            position: "absolute",
            left: 60,
            right: 60,
            top: 1130,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 34,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 26,
              transform: `translateY(${breathe}px)`,
            }}
          >
            <YolocoMark size={116} delay={BRAND_AT} />
            <YolocoWordmark delay={BRAND_AT + 6} size={92} />
          </div>
          <div
            style={{
              textAlign: "center",
              fontFamily: theme.fonts.display,
              fontSize: 52,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.22,
              color: mbPalette.text,
              opacity: tagIn,
              transform: `translateY(${interpolate(tagIn, [0, 1], [26, 0])}px)`,
            }}
          >
            {line1}
            <br />
            <span style={{ color: mbPalette.textDim }}>{line2}</span>
          </div>
          <Chip delay={BRAND_AT + 24} size={31}>
            {ctaLabel}
          </Chip>
        </div>

        {/* Attribution, not decoration: both photographs are CC BY. */}
        <div
          style={{
            position: "absolute",
            left: 90,
            right: 90,
            top: 1596,
            textAlign: "center",
            fontFamily: theme.fonts.mono,
            fontSize: 18,
            letterSpacing: "0.02em",
            whiteSpace: "nowrap",
            color: mbPalette.textDim,
            opacity: creditIn * 0.66,
          }}
        >
          {credit}
        </div>

        <AbsoluteFill style={{ pointerEvents: "none", opacity: cardOut }}>
          <Cursor x={cx} y={cy} click={clicking} size={46} />
        </AbsoluteFill>

        <AbsoluteFill
          style={{
            background: mbColors.white,
            opacity: hit.energy * 0.14,
            pointerEvents: "none",
          }}
        />
      </AbsoluteFill>
    </SceneShell>
  );
};
