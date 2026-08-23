// Beat 8 — what you don't get. КЕШБЭК? ПРОЦЕНТЫ? КРЕДИТ? stack up, a lime
// portal opens and the % signs and a credit card spiral into it; the red
// НЕ ПРЕДУСМОТРЕНЫ stamp lands across the middle.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { theme } from "../../../theme";
import { usePunch } from "../../../reel";
import { drColors, drPalette } from "../palette";
import { BankCard, BrandBar, Flash, Kinetic, Portal, SceneShell, Stamp } from "../ui";

const PORTAL = 28;
const SUCK = 44;
const STAMP = 118;
const CLOSE = STAMP - 6;
const PORTAL_X = 540;
const PORTAL_Y = 980;

const ITEMS = [
  { kind: "pct", x: 190, y: 700, size: 150, delay: 6 },
  { kind: "pct", x: 880, y: 640, size: 120, delay: 12 },
  { kind: "pct", x: 820, y: 1230, size: 130, delay: 18 },
  { kind: "card", x: 250, y: 1200, size: 340, delay: 22 },
] as const;

export const ConsScene: React.FC<{ series: string; episode: string }> = ({ series, episode }) => {
  const frame = useCurrentFrame();
  const punch = usePunch(STAMP, 18);
  const ramp = (from: number, to: number, easing = theme.ease.out) =>
    interpolate(frame, [from, to], [0, 1], { easing, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const close = ramp(CLOSE, CLOSE + 10, theme.ease.in);

  return (
    <SceneShell shake={punch.shake}>
      <BrandBar series={series} episode={episode} />

      <AbsoluteFill style={{ paddingLeft: 72, paddingTop: 320 }}>
        <Kinetic text="КЕШБЭК?" delay={2} per={3} size={90} />
        <Kinetic text="ПРОЦЕНТЫ?" delay={12} per={3} size={90} color={drPalette.textDim} />
        <Kinetic text="КРЕДИТ?" delay={22} per={3} size={90} />
      </AbsoluteFill>

      {/* portal */}
      {close < 1 && (
        <div
          style={{
            position: "absolute",
            left: PORTAL_X - 230,
            top: PORTAL_Y - 230,
            transform: `scale(${1 - close})`,
            opacity: 1 - close,
          }}
        >
          <Portal size={460} delay={PORTAL} />
        </div>
      )}

      {/* things that get pulled in */}
      {ITEMS.map((it, i) => {
        const inP = interpolate(frame, [it.delay, it.delay + 16], [0, 1], {
          easing: theme.ease.out,
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const s = interpolate(frame, [SUCK + i * 9, SUCK + i * 9 + 30], [0, 1], {
          easing: theme.ease.in,
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        if (s >= 1) return null;
        const x = interpolate(s, [0, 1], [it.x, PORTAL_X]);
        const y = interpolate(s, [0, 1], [it.y, PORTAL_Y]);
        // a little orbit on the way in
        const orbit = Math.sin(s * Math.PI) * 90;
        const scale = (1 - s) * interpolate(inP, [0, 1], [0.6, 1]);
        const wob = Math.sin(frame / 14 + i) * 4;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y + wob,
              opacity: inP * (1 - s * 0.5),
              transform: `translate(-50%, -50%) translate(${orbit}px, ${-orbit * 0.6}px) rotate(${s * 540 + interpolate(inP, [0, 1], [-20, 0])}deg) scale(${scale})`,
            }}
          >
            {it.kind === "pct" ? (
              <div
                style={{
                  fontFamily: theme.fonts.wide,
                  fontSize: it.size,
                  fontWeight: 900,
                  lineHeight: 1,
                  color: drColors.paper,
                }}
              >
                %
              </div>
            ) : (
              <BankCard width={it.size} tone="paper" delay={-99} />
            )}
          </div>
        );
      })}

      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingTop: 140 }}>
        {frame >= STAMP && (
          <Stamp delay={STAMP} size={72} rotate={-5} style={{ textAlign: "center" }}>
            НЕ
            <br />
            ПРЕДУСМОТРЕНЫ
          </Stamp>
        )}
      </AbsoluteFill>

      <Flash amount={punch.pop * 0.8} color={drColors.bad} />
    </SceneShell>
  );
};
