// Beat 5 — the fix, replayed in the correct order, top to bottom.
// A takes the lock and commits; the row goes to 0; B arrives at a closed lock
// and is told the truth. The layout is a vertical sequence on purpose: you
// should be able to read "one finishes before the other" off the geometry.
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { theme } from "../../../theme";
import { useRamp } from "../../../reel";
import { rcColors, rcPalette } from "../palette";
import { BrandBar, Chip, Panel, RequestBeam, RowCard, SceneShell } from "../ui";

const A_ENTER = 26; // A's request reaches the lock
const COMMIT = 74; // the row drops to 0
const B_ENTER = 118; // B's request reaches the lock
const B_DENIED = 152; // B is told SOLD OUT

export const LockScene: React.FC<{ brandName: string; chapter: string }> = ({
  brandName,
  chapter,
}) => {
  const rewind = useRamp(0, 16);
  const aTravel = useRamp(10, A_ENTER, theme.ease.inOut);
  const lockIn = useRamp(A_ENTER - 8, A_ENTER + 8);
  const held = useRamp(A_ENTER, A_ENTER + 10);
  const commit = useRamp(COMMIT, COMMIT + 8);
  const released = useRamp(COMMIT + 14, COMMIT + 26);
  const bTravel = useRamp(100, B_ENTER, theme.ease.inOut);
  const denied = useRamp(B_DENIED, B_DENIED + 12);

  // The lock glows only while it is actually holding the row.
  const holding = held * (1 - released);

  return (
    <SceneShell>
      <BrandBar brandName={brandName} chapter={chapter} />

      <AbsoluteFill style={{ opacity: rewind }}>
        <div style={{ position: "absolute", left: 82, top: 300 }}>
          <Chip delay={0} tone="hero" size={28}>
            REPLAY · THE CORRECT ORDER
          </Chip>
        </div>

        {/* 1 — User A */}
        <div
          style={{
            position: "absolute",
            left: 82,
            top: 392,
            display: "flex",
            alignItems: "center",
            gap: 20,
          }}
        >
          <span
            style={{
              fontFamily: theme.fonts.display,
              fontSize: 46,
              fontWeight: 800,
              letterSpacing: "-0.02em",
              color: rcPalette.text,
            }}
          >
            User A
          </span>
          <span
            style={{
              fontFamily: theme.fonts.mono,
              fontSize: 26,
              letterSpacing: "0.1em",
              color: rcColors.req,
            }}
          >
            BEGIN
          </span>
        </div>

        <RequestBeam
          progress={aTravel}
          color={rcColors.req}
          x={140}
          top={452}
          height={168}
        />

        {/* 2 — the lock, holding the row */}
        <div style={{ position: "absolute", left: 82, top: 636 }}>
          <Panel
            delay={A_ENTER - 8}
            tone="hero"
            glow={holding > 0.4}
            style={{ width: 916, padding: "30px 34px 34px" }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 22,
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 16,
                  fontFamily: theme.fonts.mono,
                  fontSize: 30,
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  color: rcPalette.primary,
                }}
              >
                <LockGlyph closed={holding} />
                TRANSACTION · LOCK
              </span>
              <span
                style={{
                  fontFamily: theme.fonts.mono,
                  fontSize: 26,
                  letterSpacing: "0.1em",
                  color: holding > 0.4 ? rcPalette.primary : rcPalette.textDim,
                  opacity: lockIn,
                }}
              >
                {released > 0.5 ? "COMMITTED" : "HELD BY A"}
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
              <RowCard
                value={
                  <span
                    style={{
                      color: commit > 0.5 ? rcPalette.textDim : rcPalette.primary,
                    }}
                  >
                    {commit > 0.5 ? 0 : 1}
                  </span>
                }
                delay={A_ENTER - 4}
                tone="hero"
                flash={holding}
                label="row · tickets"
                width={420}
              />
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <Chip delay={A_ENTER + 6} tone="req" size={26}>
                  A reads 1
                </Chip>
                <Chip delay={COMMIT} tone="good" size={26}>
                  A buys · writes 0
                </Chip>
              </div>
            </div>
          </Panel>
        </div>

        {/* 3 — User B, arriving after, getting the truth */}
        <RequestBeam
          progress={bTravel}
          color={rcColors.req}
          x={140}
          top={1002}
          height={120}
          dir={-1}
        />

        <div
          style={{
            position: "absolute",
            left: 82,
            top: 1136,
            display: "flex",
            alignItems: "center",
            gap: 24,
            opacity: bTravel,
          }}
        >
          <span
            style={{
              fontFamily: theme.fonts.display,
              fontSize: 46,
              fontWeight: 800,
              letterSpacing: "-0.02em",
              color: rcPalette.text,
            }}
          >
            User B
          </span>
          <span
            style={{
              padding: "12px 26px",
              borderRadius: 999,
              border: `2px solid ${rcColors.danger}`,
              background: rcColors.dangerSoft,
              fontFamily: theme.fonts.display,
              fontSize: 34,
              fontWeight: 800,
              letterSpacing: "0.04em",
              color: rcColors.danger,
              opacity: denied,
              transform: `scale(${interpolate(denied, [0, 1], [0.86, 1])})`,
            }}
          >
            SOLD OUT
          </span>
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};

/** Padlock that closes as the transaction takes hold. Drawn, never an emoji. */
const LockGlyph: React.FC<{ closed: number }> = ({ closed }) => (
  <svg width={34} height={40} viewBox="0 0 34 40">
    <path
      d={`M9 ${18 - closed * 0}V13a8 8 0 0 1 16 0v5`}
      fill="none"
      stroke={rcPalette.primary}
      strokeWidth={3.2}
      strokeLinecap="round"
      // The shackle drops into the body as the lock engages.
      transform={`translate(${-4 + closed * 4}, ${-2 + closed * 2})`}
    />
    <rect
      x={5}
      y={18}
      width={24}
      height={18}
      rx={4}
      fill="none"
      stroke={rcPalette.primary}
      strokeWidth={3.2}
    />
    <circle cx={17} cy={27} r={2.6} fill={rcPalette.primary} opacity={closed} />
  </svg>
);
