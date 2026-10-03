// Beat 7 — the investor's objection, answered before it is asked.
// The wizard screen is the evidence: the owner's own API key, masked, with the
// platform's promise under it. The graphic half states the consequence — the
// bills land on the owner's card, so the platform carries no margin risk and
// the owner carries no lock-in.
import React from "react";
import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { Check, Chip, Eyebrow, Kinetic, PhoneFrame, SceneShell, Screencast, Scrim, TopBar, shotFrames } from "../ui";

export const KeysScene: React.FC = () => {
  const { durationInFrames, fps } = useVideoConfig();
  const shot = Math.min(shotFrames("07-keys", fps), durationInFrames - 48);

  return (
    <SceneShell>
      <Sequence durationInFrames={shot} layout="none">
        <PhoneFrame>
          <Screencast shot="07-keys" len={shot} focus={0.36} zoom={[1, 1.05]} />
        </PhoneFrame>
        <Scrim from="bottom" height={820} solid={0.55} />
        <TopBar>
          <Eyebrow delay={4}>Ключи · ваши</Eyebrow>
        </TopBar>
      </Sequence>

      <Sequence from={shot} layout="none">
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 44 }}>
          <Check delay={2} size={128} />
          <div style={{ width: 900 }}>
            <Kinetic
              text="СЧЕТА ПРИХОДЯТ ВАМ"
              delay={8}
              per={4}
              size={82}
              align="center"
              hero={[2]}
              style={{ justifyContent: "center" }}
            />
          </div>
          <Chip delay={26} tone="paper" size={30}>
            ШИФРУЮТСЯ ВАШИМ ПАРОЛЕМ
          </Chip>
        </AbsoluteFill>
      </Sequence>
    </SceneShell>
  );
};
