import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { usePunch } from "../../../reel";
import { theme } from "../../../theme";
import { mbColors, mbPalette } from "../palette";
import { BrandBar, Eyebrow, SceneShell, useIn } from "../ui";

// 20–28.5s. The formula builds into empty slots that are on screen from the
// first frame, so the viewer is waiting for the answer before it arrives. On
// "extreme" the middle term floods the frame and the rest of the equation
// drops away — the typography IS the argument.
const SIMPLE_AT = 110;
const PLUS_AT = 132;
const EXTREME_AT = 163;
const EQUALS_AT = 194;
const STORY_AT = 202;

// Flood: EXTREME takes the frame while everything else recedes, then settles.
const FLOOD = [163, 177, 188, 198] as const;

const Slot: React.FC<{
  text: string;
  at: number;
  appear: number;
  size: number;
  width: number;
  color?: string;
  glow?: boolean;
  scale?: number;
}> = ({ text, at, appear, size, width, color = mbPalette.text, glow = false, scale = 1 }) => {
  const frame = useCurrentFrame();
  const p = useIn(at, "snappy");
  const ph = useIn(appear, "smooth");
  const ghost = ph * Math.max(0, 1 - p * 2.2);
  return (
    <div
      style={{
        position: "relative",
        height: Math.round(size * 1.22),
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg
        width={width}
        height={Math.round(size * 1.16)}
        style={{
          position: "absolute",
          opacity: ghost * 0.85,
          transform: `scale(${interpolate(ph, [0, 1], [0.9, 1])})`,
        }}
      >
        <rect
          x={1.5}
          y={1.5}
          width={width - 3}
          height={Math.round(size * 1.16) - 3}
          rx={20}
          fill="none"
          stroke={mbColors.lineStrong}
          strokeWidth={3}
          strokeDasharray="16 13"
          strokeDashoffset={-frame * 0.9}
        />
      </svg>
      <div
        style={{
          fontFamily: theme.fonts.display,
          fontSize: size,
          fontWeight: 800,
          letterSpacing: "-0.05em",
          lineHeight: 1,
          whiteSpace: "nowrap",
          color,
          textShadow: glow ? `0 0 56px ${mbPalette.glow}, 0 0 120px ${mbPalette.glow}` : undefined,
          opacity: p,
          transform: `translateY(${interpolate(p, [0, 1], [size * 0.3, 0])}px) scale(${interpolate(p, [0, 1], [0.82, 1]) * scale})`,
        }}
      >
        {text}
      </div>
    </div>
  );
};

const Operator: React.FC<{ symbol: string; at: number; dim: number }> = ({
  symbol,
  at,
  dim,
}) => {
  const p = useIn(at, "bouncy");
  return (
    <div
      style={{
        fontFamily: theme.fonts.mono,
        fontSize: 64,
        fontWeight: 700,
        lineHeight: 1,
        color: mbPalette.textDim,
        opacity: (0.5 + p * 0.5) * (1 - dim),
        transform: `scale(${interpolate(p, [0, 1], [0.6, 1])}) rotate(${interpolate(p, [0, 1], [-30, 0])}deg)`,
      }}
    >
      {symbol}
    </div>
  );
};

export const FormulaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const hit = usePunch(EXTREME_AT, 18);
  const flood = interpolate(frame, [...FLOOD], [0, 1, 1, 0], {
    easing: theme.ease.inOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const recede = 1 - flood * 0.84;

  return (
    <SceneShell>
      <AbsoluteFill
        style={{ transform: `translate(${hit.shake * 0.3}px, ${hit.shake * 0.6}px)` }}
      >
        <BrandBar chapter="05 · THE FORMULA" />

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 360,
            display: "flex",
            justifyContent: "center",
            opacity: recede,
          }}
        >
          <Eyebrow delay={4}>The formula</Eyebrow>
        </div>

        <div
          style={{
            position: "absolute",
            left: 60,
            right: 60,
            top: 470,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 26,
            transform: `translateY(${flood * 150}px)`,
          }}
        >
          <div style={{ opacity: recede, width: "100%" }}>
            <Slot text="SIMPLE IDEA" at={SIMPLE_AT} appear={6} size={86} width={620} />
          </div>
          <Operator symbol="+" at={PLUS_AT} dim={flood} />

          {/* the middle term — this is the one that floods */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <Slot
              text="EXTREME"
              at={EXTREME_AT}
              appear={12}
              size={124}
              width={620}
              scale={1 + flood * 0.75}
            />
            <div style={{ opacity: recede }}>
              <Slot text="EXECUTION" at={EXTREME_AT + 6} appear={12} size={76} width={520} />
            </div>
          </div>

          <div style={{ opacity: recede }}>
            <Operator symbol="=" at={EQUALS_AT} dim={0} />
          </div>
          <div style={{ opacity: recede, width: "100%" }}>
            <Slot
              text="IRRESISTIBLE STORY"
              at={STORY_AT}
              appear={18}
              size={80}
              width={860}
              color={mbPalette.primary}
              glow
            />
          </div>
        </div>

        <AbsoluteFill
          style={{
            background: mbColors.white,
            opacity: hit.energy * 0.1,
            pointerEvents: "none",
          }}
        />
      </AbsoluteFill>
    </SceneShell>
  );
};
