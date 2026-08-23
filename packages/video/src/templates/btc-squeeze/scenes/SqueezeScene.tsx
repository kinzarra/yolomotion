// Beat 6 — the loop. A lime portal with the ₿ coin breathing in it, four
// nodes on the ring — РОСТ → ЛИКВИДАЦИЯ → ПОКУПКА → РОСТ — and a lime dot
// that runs the ring and lights each node as it passes. Buying breeds buying.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { theme } from "../../../theme";
import { btcColors, btcPalette } from "../palette";
import { BrandBar, Chip, Coin, Eyebrow, Kinetic, Portal, SceneShell } from "../ui";

const HEAD = 76; // «Покупка поднимала цену»
const CX = 540;
const CY = 960;
const R = 330;
const NODES = [
  { label: "РОСТ", angle: -90 },
  { label: "ЛИКВИДАЦИЯ", angle: 0 },
  { label: "ПОКУПКА", angle: 90 },
  { label: "РОСТ ×2", angle: 180 },
];

const angDist = (a: number, b: number) => {
  const d = Math.abs(((a - b) % 360) + 360) % 360;
  return Math.min(d, 360 - d);
};

export const SqueezeScene: React.FC<{ series: string; episode: string }> = ({ series, episode }) => {
  const frame = useCurrentFrame();
  const runner = -90 + frame * 3.6; // one lap per 100 frames, clockwise from the top
  const rad = (runner * Math.PI) / 180;
  const dot = { x: CX + Math.cos(rad) * R, y: CY + Math.sin(rad) * R };

  return (
    <SceneShell>
      <BrandBar series={series} episode={episode} />

      <AbsoluteFill style={{ alignItems: "center", paddingTop: 330 }}>
        <Eyebrow delay={2}>Механика сквиза</Eyebrow>
        <div style={{ width: 960, marginTop: 14, minHeight: 200 }}>
          {frame >= HEAD && (
            <Kinetic text="ПОКУПКА ПОРОЖДАЕТ ПОКУПКУ" delay={HEAD} per={5} size={66} align="center" mode="snap" hero={[0]} style={{ justifyContent: "center" }} />
          )}
        </div>
      </AbsoluteFill>

      {/* the ring */}
      <div
        style={{
          position: "absolute",
          left: CX - R,
          top: CY - R,
          width: R * 2,
          height: R * 2,
          borderRadius: "50%",
          border: `3px dashed ${btcColors.lineStrong}`,
          transform: `rotate(${frame * 0.4}deg)`,
        }}
      />
      {/* arrows on the ring, between the nodes */}
      {[-45, 45, 135, 225].map((a) => {
        const r = (a * Math.PI) / 180;
        return (
          <div
            key={a}
            style={{
              position: "absolute",
              left: CX + Math.cos(r) * R - 16,
              top: CY + Math.sin(r) * R - 16,
              width: 32,
              height: 32,
              fontFamily: theme.fonts.mono,
              fontSize: 34,
              fontWeight: 800,
              lineHeight: "32px",
              textAlign: "center",
              color: btcPalette.textDim,
              transform: `rotate(${a + 90}deg)`,
            }}
          >
            ▼
          </div>
        );
      })}

      {/* the coin in the well */}
      <div style={{ position: "absolute", left: CX - 230, top: CY - 230 }}>
        <Portal size={460} delay={0} />
      </div>
      <div style={{ position: "absolute", left: CX - 110, top: CY - 110 }}>
        <Coin size={220} delay={6} lit={false} />
      </div>

      {/* the nodes — lit when the runner is near */}
      {NODES.map((n, i) => {
        const r = (n.angle * Math.PI) / 180;
        const near = Math.max(0, 1 - angDist(runner, n.angle) / 30);
        return (
          <div
            key={n.label}
            style={{
              position: "absolute",
              left: CX + Math.cos(r) * R,
              top: CY + Math.sin(r) * R,
              transform: `translate(-50%, -50%) scale(${1 + near * 0.08})`,
            }}
          >
            <Chip delay={8 + i * 6} tone={near > 0.5 ? "hero" : "neutral"} filled={near > 0.5} size={24}>
              {n.label}
            </Chip>
          </div>
        );
      })}

      {/* the runner */}
      <div
        style={{
          position: "absolute",
          left: dot.x - 12,
          top: dot.y - 12,
          width: 24,
          height: 24,
          borderRadius: "50%",
          background: btcPalette.primary,
          boxShadow: `0 0 24px ${btcPalette.glow}, 0 0 60px ${btcPalette.primary}55`,
        }}
      />
    </SceneShell>
  );
};
