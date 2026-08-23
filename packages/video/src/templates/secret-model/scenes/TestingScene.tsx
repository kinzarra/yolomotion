// Beat 4 — the barrage, then the log.
//
// Three hard-cut cards in under a second (MYTHOS / FABLE / INTERNAL TESTING),
// each in the color of its status, then an eval run whose every number is a
// redaction bar. Nothing invented: the brief asked for a benchmark chart, and
// any chart here would have had to make its numbers up, so the shot carries
// "they are measuring something you can't see" instead of pretending to know
// what the measurement said.
import React from "react";
import { AbsoluteFill } from "remotion";
import { smPalette } from "../palette";
import { BrandBar, Chip, Eyebrow, FlashCard, SceneShell, Terminal } from "../ui";

const LINES = [
  { kind: "cmd" as const, text: "eval --checkpoint", redact: 210 },
  { kind: "log" as const, text: "suite: reasoning · coding · safety" },
  { kind: "log" as const, text: "runs: 12  ·  visibility: internal" },
  { kind: "out" as const, text: "score", redact: 240, tone: "hero" as const },
  { kind: "log" as const, text: "not cleared for release" },
];

export const TestingScene: React.FC<{ brandName: string; chapter: string }> = ({
  brandName,
  chapter,
}) => (
  <SceneShell>
    <BrandBar brandName={brandName} chapter={chapter} />

    <AbsoluteFill style={{ alignItems: "center", paddingTop: 496 }}>
      <Eyebrow delay={30} color={smPalette.primary}>
        Reported · unverified
      </Eyebrow>

      <div style={{ marginTop: 44 }}>
        <Terminal
          title="internal-eval"
          lines={LINES}
          delay={34}
          per={9}
          width={916}
          fontSize={32}
        />
      </div>

      <div style={{ marginTop: 48 }}>
        <Chip delay={112} tone="hero" size={28} dashed>
          REPORTED · NOT CONFIRMED
        </Chip>
      </div>
    </AbsoluteFill>

    {/* The barrage owns the first 0.9s outright — full-frame, no background
        showing through, so each cut reads as a splice rather than a fade. */}
    <FlashCard text="MYTHOS" at={0} life={9} color={smPalette.primary} sub="REPORTED" />
    <FlashCard text="FABLE" at={9} life={9} color={smPalette.accent} sub="SHIPPING" />
    <FlashCard
      text="INTERNAL TESTING"
      at={18}
      life={11}
      color={smPalette.primary}
      size={128}
      sub="REPORTED"
    />
  </SceneShell>
);
