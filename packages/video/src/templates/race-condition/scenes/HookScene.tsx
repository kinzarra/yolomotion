// Beat 1 — the setup. One ticket, two people, one frame.
// Hits: eyebrow → the giant 1 → both users arrive → both BUY slam together.
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { theme } from "../../../theme";
import { usePunch, useRamp } from "../../../reel";
import { rcColors, rcPalette } from "../palette";
import { BrandBar, Chip, Eyebrow, Panel, SceneShell, UserCard } from "../ui";

const SLAM = 46; // both buttons go down on the same frame — that is the story

export const HookScene: React.FC<{
  brandName: string;
  chapter: string;
  itemLabel: string;
}> = ({ brandName, chapter, itemLabel }) => {
  const punch = usePunch(SLAM, 20);
  const countIn = useRamp(6, 22);
  const labelIn = useRamp(14, 26);
  // The buttons stay down after the slam — the impact decays, the state does
  // not. Without this the frame snaps back to "nothing has happened yet".
  const held = useRamp(SLAM, SLAM + 4);
  const chipIn = useRamp(SLAM + 2, SLAM + 12);
  const pressed = Math.max(punch.energy, held * 0.42);

  return (
    <SceneShell>
      <BrandBar brandName={brandName} chapter={chapter} />

      <AbsoluteFill
        style={{
          alignItems: "center",
          paddingTop: 292,
          // The slam shakes the whole frame, not just the buttons.
          transform: `translateX(${punch.shake * 0.35}px)`,
        }}
      >
        <Eyebrow delay={2}>Checkout · last one</Eyebrow>

        <Panel
          delay={6}
          tone="hero"
          glow
          style={{
            marginTop: 34,
            width: 640,
            padding: "34px 40px 44px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontFamily: theme.fonts.display,
              fontSize: 300,
              fontWeight: 800,
              lineHeight: 1,
              letterSpacing: "-0.06em",
              color: rcPalette.primary,
              textShadow: `0 0 90px ${rcPalette.glow}`,
              opacity: countIn,
              transform: `scale(${interpolate(countIn, [0, 1], [0.82, 1])})`,
            }}
          >
            1
          </div>
          <div
            style={{
              marginTop: 6,
              fontFamily: theme.fonts.mono,
              fontSize: 46,
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: rcPalette.textDim,
              opacity: labelIn,
            }}
          >
            {itemLabel} left
          </div>
        </Panel>

        <div style={{ display: "flex", gap: 40, marginTop: 52 }}>
          <UserCard name="User A" tone="req" delay={26} pressed={pressed} />
          <UserCard name="User B" tone="req" delay={30} pressed={pressed} />
        </div>

        <div style={{ marginTop: 40, opacity: chipIn }}>
          <Chip delay={SLAM} tone="danger" size={32}>
            BOTH · SAME MILLISECOND
          </Chip>
        </div>
      </AbsoluteFill>

      {/* The impact ring — one frame's worth of energy, drawn behind nothing. */}
      {punch.pop > 0.01 ? (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: 1010,
            width: 40,
            height: 40,
            marginLeft: -20,
            borderRadius: "50%",
            border: `3px solid ${rcColors.req}`,
            opacity: punch.pop * 0.7,
            transform: `scale(${1 + (1 - punch.energy) * 14})`,
          }}
        />
      ) : null}
    </SceneShell>
  );
};
