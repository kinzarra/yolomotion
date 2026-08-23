// Beat 1 — the question, at full width, with the answer half covered up.
// Hits: eyebrow → words slam up → the redaction wipes off STRONGEST MODEL? →
// scan sweep → the "reported" chip that sets the rules for the whole reel.
import React from "react";
import { AbsoluteFill } from "remotion";
import { usePunch } from "../../../reel";
import { smPalette } from "../palette";
import { BrandBar, Chip, Eyebrow, Flash, Kinetic, ScanSweep, SceneShell } from "../ui";

// The frame kicks when the last word is uncovered — the reveal is the hit.
const REVEAL = 34;
// Negative: the first word is already ~70% in at frame 0. A spring started
// at 0 renders an empty frame, and frame 0 of a Short is the whole retention
// decision. Every scene in this reel opens mid-entrance for the same reason.
const IN = -6;

export const HookScene: React.FC<{
  brandName: string;
  chapter: string;
  headline: string;
}> = ({ brandName, chapter, headline }) => {
  const punch = usePunch(REVEAL, 18);
  const words = headline.split(" ");
  // The last word carries the question mark; it is the one hero-colored
  // element in the frame, and the last thing the redaction lets go of.
  const last = words.length - 1;

  return (
    <SceneShell>
      <BrandBar brandName={brandName} chapter={chapter} />

      <AbsoluteFill
        style={{
          alignItems: "center",
          paddingTop: 396,
          transform: `translateX(${punch.shake * 0.3}px)`,
        }}
      >
        <Eyebrow delay={IN}>Breaking · AI</Eyebrow>

        <div style={{ width: 916, marginTop: 62 }}>
          <Kinetic
            text={headline}
            delay={IN}
            per={3}
            size={122}
            align="center"
            hero={[last]}
            redact={{ from: Math.max(0, last - 1), per: 7 }}
            style={{ justifyContent: "center" }}
          />
        </div>

        <div style={{ marginTop: 74 }}>
          <Chip delay={REVEAL + 14} tone="hero" size={30} dashed>
            REPORTED · NOT CONFIRMED
          </Chip>
        </div>
      </AbsoluteFill>

      <ScanSweep from={REVEAL + 4} to={REVEAL + 40} />
      <Flash amount={punch.pop * 0.8} color={smPalette.primary} />
    </SceneShell>
  );
};
