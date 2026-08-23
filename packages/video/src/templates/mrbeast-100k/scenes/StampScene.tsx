import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { usePunch } from "../../../reel";
import { theme } from "../../../theme";
import { mbColors } from "../palette";
import { BrandBar, PlayerCard, SceneShell, SourceLabel, Stamp } from "../ui";

// 8.5–14s. The tape stops: freeze-frame with registration brackets, and the
// verdict gets stamped on it. STUPID IDEA? holds long enough to be believed,
// then it is torn off and GENIUS FORMAT. bites down in its place.
const STUPID_AT = 36; // with "the dumbest"
const STUPID_OUT = 112;
const GENIUS_AT = 120; // with "genius about it"

export const StampScene: React.FC<{ sourceLabel: string; photo: string }> = ({
  sourceLabel,
  photo,
}) => {
  const frame = useCurrentFrame();
  const hit = usePunch(GENIUS_AT, 16);

  // The freeze itself: the card desaturates and stops dead the moment the
  // first stamp lands.
  const held = interpolate(frame, [STUPID_AT - 4, STUPID_AT + 6], [1, 0.55], {
    easing: theme.ease.inOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <SceneShell>
      <AbsoluteFill
        style={{ transform: `translate(${hit.shake * 0.4}px, ${hit.shake * 0.8}px)` }}
      >
        <BrandBar chapter="03 · THE VERDICT" />

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 520,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 34,
            opacity: held,
          }}
        >
          <PlayerCard
            width={800}
            photo={photo}
            progress={1}
            timecode="40:12:41"
            frozen
            delay={0}
          />
          <SourceLabel delay={8}>{sourceLabel}</SourceLabel>
        </div>

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 660,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Stamp text="STUPID IDEA?" at={STUPID_AT} until={STUPID_OUT} rotate={-8} size={96} />
          <Stamp text="GENIUS FORMAT." at={GENIUS_AT} rotate={4} size={88} solid />
        </div>

        <AbsoluteFill
          style={{
            background: mbColors.white,
            opacity: hit.energy * 0.12,
            pointerEvents: "none",
          }}
        />
      </AbsoluteFill>
    </SceneShell>
  );
};
