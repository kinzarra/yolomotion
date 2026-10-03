// Beat 2 — THE TURN, and it is deliberately the shortest beat in the reel.
// The whole product claim is that the operator's job is one paragraph, so the
// beat lasts about as long as it takes to read one: the real cabinet, the
// brief being typed into it, and nothing else on screen.
import React from "react";
import { useVideoConfig } from "remotion";
import { Caret, Eyebrow, PhoneFrame, SceneShell, Screencast, Scrim, TopBar, shotFrames } from "../ui";

export const BriefScene: React.FC = () => {
  const { durationInFrames, fps } = useVideoConfig();
  // The clip is longer than the beat; the beat is what governs, and the push
  // is spread across the beat so it never freezes on a held last frame.
  const len = Math.min(durationInFrames, shotFrames("02-brief", fps));

  return (
    <SceneShell>
      <PhoneFrame>
        <Screencast shot="02-brief" len={len} focus={0.37} zoom={[1, 1.06]} />
      </PhoneFrame>
      <Scrim from="bottom" height={820} solid={0.55} />
      <TopBar>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 16 }}>
          <Eyebrow delay={4}>Шаг 01 · вы пишете абзац</Eyebrow>
          <Caret height={30} delay={10} />
        </span>
      </TopBar>
    </SceneShell>
  );
};
