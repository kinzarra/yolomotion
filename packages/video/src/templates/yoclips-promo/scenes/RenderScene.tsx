// Beat 6 — the part the operator never touches.
// Evidence first: the publication block the agent wrote — title, description,
// tags, the first comment — then the worker's real stage list walking itself
// to upload. The stage names are the ones in packages/worker/src/stages/.
import React from "react";
import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { Eyebrow, PhoneFrame, SceneShell, Screencast, Scrim, StageChain, TopBar, shotFrames } from "../ui";

export const RenderScene: React.FC = () => {
  const { durationInFrames, fps } = useVideoConfig();
  const shot = Math.min(shotFrames("06-render", fps), durationInFrames - 64);

  return (
    <SceneShell>
      <Sequence durationInFrames={shot} layout="none">
        <PhoneFrame>
          <Screencast shot="06-render" len={shot} focus={0.37} zoom={[1, 1.06]} />
        </PhoneFrame>
        <Scrim from="bottom" height={820} solid={0.55} />
        <TopBar>
          <Eyebrow delay={4}>Шаг 05 · готовый пост</Eyebrow>
        </TopBar>
      </Sequence>

      <Sequence from={shot} layout="none">
        <AbsoluteFill style={{ padding: "0 90px", alignItems: "center", justifyContent: "center", gap: 44 }}>
          <StageChain
            stages={["footage", "template", "voiceover", "presenter", "render", "upload"]}
            delay={2}
            per={4}
            width={900}
          />
        </AbsoluteFill>
      </Sequence>
    </SceneShell>
  );
};
