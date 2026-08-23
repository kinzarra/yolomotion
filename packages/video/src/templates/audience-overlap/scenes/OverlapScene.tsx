import React from "react";
import { interpolate, random, useCurrentFrame } from "remotion";
import { theme } from "../../../theme";
import { ovColors, ovPalette } from "../palette";
import { Avatar, BrandBar, Chip, SceneShell, useIn } from "../ui";

// 6–10.5s — each creator's followers burst into a cloud of profile dots; the
// five clouds migrate to the center and most dots turn out to be the same
// people (they flip red inside a pulsing warning ring).
const CX = 540;
const CY = 850;
const ORIGIN_R = 340;
const DOTS_PER_GROUP = 24;
const SHARED_RATIO = 0.62;

type Dot = {
  group: number;
  sx: number;
  sy: number;
  tx: number;
  ty: number;
  shared: boolean;
  delay: number;
  size: number;
};

const DOTS: Dot[] = Array.from({ length: 5 }).flatMap((_, g) => {
  const angle = ((-90 + g * 72) * Math.PI) / 180;
  const ox = CX + Math.cos(angle) * ORIGIN_R;
  const oy = CY + Math.sin(angle) * ORIGIN_R;
  return Array.from({ length: DOTS_PER_GROUP }).map((_, i) => {
    const r = (k: string) => random(`ov-${g}-${i}-${k}`);
    const ca = r("ca") * Math.PI * 2;
    const cr = 30 + r("cr") * 95;
    const shared = r("sh") < SHARED_RATIO;
    // Shared dots pile into the tight center cluster; unique ones settle on a
    // wider ring biased back toward their own creator.
    const ta = shared ? r("ta") * Math.PI * 2 : angle + (r("ta") - 0.5) * 1.5;
    const tr = shared ? 18 + r("tr") * 115 : 195 + r("tr") * 75;
    return {
      group: g,
      sx: ox + Math.cos(ca) * cr,
      sy: oy + Math.sin(ca) * cr * 0.9,
      tx: CX + Math.cos(ta) * tr,
      ty: CY + Math.sin(ta) * tr * 0.92,
      shared,
      delay: g * 3 + i * 0.7,
      size: 11 + Math.round(r("sz") * 6),
    };
  });
});

// Extracted so the entrance spring is a hook call at component top level.
const OriginAvatar: React.FC<{ g: number }> = ({ g }) => {
  const frame = useCurrentFrame();
  const p = useIn(2 + g * 3, "bouncy");
  const angle = ((-90 + g * 72) * Math.PI) / 180;
  const x = CX + Math.cos(angle) * ORIGIN_R;
  const y = CY + Math.sin(angle) * ORIGIN_R;
  const emptied = interpolate(frame, [46, 92], [1, 0.32], {
    easing: theme.ease.inOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        left: x - 34,
        top: y - 34,
        opacity: p * emptied,
        transform: `scale(${interpolate(p, [0, 1], [0.5, 1])}) translateY(${Math.sin(frame / 26 + g) * 5}px)`,
      }}
    >
      <Avatar variant={g} size={68} />
    </div>
  );
};

export const OverlapScene: React.FC = () => {
  const frame = useCurrentFrame();
  const ringIn = useIn(66, "bouncy");
  const pulse = 1 + Math.sin(frame / 9) * 0.035;

  return (
    <SceneShell>
      <BrandBar chapter="02 · THE OVERLAP" />

      {/* creator origins — they empty out as the dots leave */}
      {Array.from({ length: 5 }).map((_, g) => (
        <OriginAvatar key={g} g={g} />
      ))}

      {/* the follower dots */}
      {DOTS.map((d, i) => {
        const born = interpolate(frame, [6 + d.delay, 14 + d.delay], [0, 1], {
          easing: theme.ease.out,
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const p = interpolate(frame, [38 + d.delay, 88 + d.delay], [0, 1], {
          easing: theme.ease.inOut,
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const x = d.sx + (d.tx - d.sx) * p;
        const y = d.sy + (d.ty - d.sy) * p + Math.sin(p * Math.PI) * 26 * (d.group % 2 === 0 ? 1 : -1);
        const flipped = d.shared && p > 0.72;
        const flipPulse = d.shared
          ? Math.sin(
              interpolate(p, [0.72, 0.95], [0, Math.PI], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            )
          : 0;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x - d.size / 2,
              top: y - d.size / 2,
              width: d.size,
              height: d.size,
              borderRadius: "50%",
              background: flipped ? ovColors.bad : "rgba(228, 244, 234, 0.78)",
              opacity: born * (flipped ? 1 : 0.85),
              transform: `scale(${born * (1 + flipPulse * 0.55)})`,
            }}
          />
        );
      })}

      {/* warning ring around the pile-up */}
      <div
        style={{
          position: "absolute",
          left: CX - 172,
          top: CY - 162,
          width: 344,
          height: 324,
          borderRadius: "50%",
          border: `3px dashed ${ovColors.badLine}`,
          boxShadow: `0 0 70px ${ovColors.badGlow}, inset 0 0 70px rgba(255, 59, 77, 0.12)`,
          opacity: ringIn,
          transform: `scale(${interpolate(ringIn, [0, 1], [0.6, pulse])})`,
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1235,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Chip delay={76} tone="bad" size={30}>
          SAME PEOPLE — COUNTED 5×
        </Chip>
      </div>
    </SceneShell>
  );
};
