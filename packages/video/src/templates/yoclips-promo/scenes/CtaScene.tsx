// Beat 9 — the close. The wordmark, the promise, the address.
// `exit={false}`: the last frame is the one that gets screenshotted and the
// one a replay cuts back from, so it holds rather than lifting away.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Chip, Kinetic, SceneShell, Wordmark } from "../ui";

export const CtaScene: React.FC<{ ctaLabel: string }> = ({ ctaLabel }) => (
  <SceneShell exit={false}>
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 52 }}>
      <Wordmark delay={2} size={148} />
      <div style={{ width: 900 }}>
        <Kinetic
          text="КАНАЛ, КОТОРЫЙ"
          delay={14}
          per={4}
          size={66}
          align="center"
          style={{ justifyContent: "center" }}
        />
        <Kinetic
          text="СНИМАЕТ САМ СЕБЯ"
          delay={20}
          per={4}
          size={66}
          align="center"
          style={{ justifyContent: "center" }}
        />
      </div>
      <Chip delay={34} tone="hero" size={36} filled>
        {ctaLabel}
      </Chip>
    </AbsoluteFill>
  </SceneShell>
);
