// Beat 2 — the evidence, or rather the shape of the hole where it would be.
//
// The card claims nothing: every field on it is a redaction bar, which is the
// literally true rendering of what the public knows about a model that has not
// shipped. The joke and the honesty are the same object. Then INTERNAL slams
// across it — the visual stand-in for the brief's opening bass hit, since this
// repo ships voiceover only.
import React from "react";
import { AbsoluteFill } from "remotion";
import { usePunch } from "../../../reel";
import { smPalette } from "../palette";
import {
  BrandBar,
  Eyebrow,
  Flash,
  ModelCard,
  Redacted,
  ScanSweep,
  SceneShell,
  Stamp,
} from "../ui";

const SLAM = 22;
// Opens mid-entrance so the cut lands on a card, not on an empty frame.
const IN = -8;

export const InternalScene: React.FC<{ brandName: string; chapter: string }> = ({
  brandName,
  chapter,
}) => {
  const punch = usePunch(SLAM, 20);

  return (
    <SceneShell>
      <BrandBar brandName={brandName} chapter={chapter} />

      <AbsoluteFill
        style={{
          alignItems: "center",
          paddingTop: 344,
          transform: `translate(${punch.shake * 0.5}px, ${punch.energy * 7}px)`,
        }}
      >
        <Eyebrow delay={IN} color={smPalette.primary}>
          What you get to see
        </Eyebrow>

        <div style={{ marginTop: 46, position: "relative" }}>
          <ModelCard
            name={<Redacted width={430} height={86} delay={0} tone="hero" />}
            status="internal"
            delay={IN}
            glow
            width={812}
            rows={[
              { label: "PARAMETERS", redact: 200 },
              { label: "BENCHMARKS", redact: 250 },
              { label: "RELEASE DATE", redact: 170 },
              { label: "AVAILABLE TO YOU", value: "NO" },
            ]}
          />

          {/* Hangs off the card's bottom edge — a stamp that fits neatly
              inside its box reads as a badge, not as something slammed on.
              Centred on the card, though: the slam scales about the element's
              own centre, so an off-centre stamp runs off the left of the frame
              mid-fall while it is still oversized. */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: -54,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Stamp text="INTERNAL" at={SLAM} size={70} rotate={-9} />
          </div>
        </div>
      </AbsoluteFill>

      <ScanSweep from={SLAM + 8} to={SLAM + 44} color={smPalette.primary} />
      <Flash amount={punch.pop} color={smPalette.primary} />
    </SceneShell>
  );
};
