import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { usePunch } from "../../../reel";
import { theme } from "../../../theme";
import { mbColors, mbPalette } from "../palette";
import {
  BrandBar,
  Odometer,
  PlayerCard,
  SceneShell,
  expCount,
  useIn,
  useRamp,
} from "../ui";

// 3.5–8.5s. The number climbs on a log scale — 1 → 100 → 1,000 → 10,000 →
// 100,000 — because a linear count to a hundred thousand reads as a bug. The
// camera pushes in the whole way, and 100,000 lands as an impact: red, glow,
// ring, screen shake.
const CLIMB = { from: 6, to: 112 };
const IMPACT = 112;

// Log-scale positions of the milestones on the rail: power / 5.
const MARKS = [
  { label: "1", at: 0 },
  { label: "100", at: 0.4 },
  { label: "1K", at: 0.6 },
  { label: "10K", at: 0.8 },
  { label: "100K", at: 1 },
];

const RAIL = 780;

export const CountScene: React.FC<{ photo: string }> = ({ photo }) => {
  const frame = useCurrentFrame();
  const climb = useRamp(CLIMB.from, CLIMB.to, theme.ease.inOut);
  const hit = usePunch(IMPACT, 18);
  const landed = frame >= IMPACT;
  const railIn = useIn(10, "smooth");

  const push = interpolate(frame, [0, 150], [0.95, 1.16], {
    easing: theme.ease.inOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const breathe = landed ? 1 + Math.sin((frame - IMPACT) / 14) * 0.012 : 1;

  return (
    <SceneShell>
      <AbsoluteFill
        style={{ transform: `translate(${hit.shake * 0.6}px, ${hit.shake}px)` }}
      >
        <BrandBar chapter="02 · THE COUNT" />

        {/* the tape keeps rolling above the number it is producing */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 330,
            display: "flex",
            justifyContent: "center",
            opacity: 0.5,
          }}
        >
          <PlayerCard
            width={430}
            photo={photo}
            count={expCount(climb)}
            progress={climb}
            timecode="40:12:41"
            delay={2}
          />
        </div>

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 700,
            display: "flex",
            justifyContent: "center",
            transform: `scale(${push * breathe * (1 + hit.pop * 0.09)})`,
          }}
        >
          <Odometer
            value={expCount(climb)}
            size={150}
            color={landed ? mbPalette.primary : mbColors.white}
            glow={landed}
          />
        </div>

        {/* the rail: log axis, so each decade is a visible step */}
        <div
          style={{
            position: "absolute",
            left: (1080 - RAIL) / 2,
            top: 990,
            width: RAIL,
            opacity: railIn,
            transform: `translateY(${interpolate(railIn, [0, 1], [26, 0])}px)`,
          }}
        >
          <div
            style={{
              position: "relative",
              height: 6,
              borderRadius: 3,
              background: mbColors.line,
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: `${climb * 100}%`,
                borderRadius: 3,
                background: landed ? mbPalette.primary : "rgba(246,246,248,0.85)",
              }}
            />
          </div>
          {MARKS.map((m) => {
            const passed = climb >= m.at - 0.001;
            return (
              <div
                key={m.label}
                style={{
                  position: "absolute",
                  left: m.at * RAIL,
                  top: -9,
                  transform: "translateX(-50%)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 14,
                }}
              >
                <div
                  style={{
                    width: passed ? 14 : 10,
                    height: passed ? 14 : 10,
                    borderRadius: "50%",
                    background: passed ? mbColors.white : mbColors.dim,
                    transform: `scale(${passed ? 1 : 0.8})`,
                  }}
                />
                <div
                  style={{
                    fontFamily: theme.fonts.mono,
                    fontSize: 26,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    color: passed ? mbPalette.text : mbColors.dim,
                    opacity: passed ? 1 : 0.7,
                  }}
                >
                  {m.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* impact ring + flash */}
        {hit.energy > 0.01 && (
          <div
            style={{
              position: "absolute",
              left: 540,
              top: 782,
              width: 200 + (1 - hit.energy) * 900,
              height: 200 + (1 - hit.energy) * 900,
              marginLeft: -(100 + (1 - hit.energy) * 450),
              marginTop: -(100 + (1 - hit.energy) * 450),
              borderRadius: "50%",
              border: `6px solid ${mbPalette.primary}`,
              opacity: hit.energy * 0.7,
              pointerEvents: "none",
            }}
          />
        )}
        <AbsoluteFill
          style={{
            background: mbColors.white,
            opacity: hit.energy * 0.16,
            pointerEvents: "none",
          }}
        />
      </AbsoluteFill>
    </SceneShell>
  );
};
