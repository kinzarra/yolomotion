// Beat 4 — the money beat, and the one an investor is watching.
// The real смета prints on screen while the voice says nothing is bought until
// it is confirmed; the push lands on ИТОГО ДЕНЬГАМИ, and the moment the clip
// ends the figure slams out of the receipt as the reel's own number.
import React from "react";
import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { usePunch } from "../../../reel";
import { ycColors } from "../palette";
import { Check, Chip, Eyebrow, Flash, PhoneFrame, Price, SceneShell, Screencast, Scrim, TopBar, shotFrames } from "../ui";

export const BudgetScene: React.FC = () => {
  const { durationInFrames, fps } = useVideoConfig();
  const shot = Math.min(shotFrames("04-budget", fps), durationInFrames - 40);

  return (
    <SceneShell>
      <Sequence durationInFrames={shot} layout="none">
        {/* Focus low: ИТОГО ДЕНЬГАМИ and ПОДТВЕРДИТЬ СМЕТУ live in the bottom
            third of the receipt, and that is where the sentence ends. */}
        <PhoneFrame>
          <Screencast shot="04-budget" len={shot} focus={0.40} zoom={[1, 1.06]} />
        </PhoneFrame>
        <Scrim from="bottom" height={820} solid={0.55} />
        <TopBar>
          <Eyebrow delay={4}>Шаг 03 · смета до покупки</Eyebrow>
        </TopBar>
      </Sequence>

      <Sequence from={shot} layout="none">
        <Total />
      </Sequence>
    </SceneShell>
  );
};

const SLAM = 3;

const Total: React.FC = () => {
  const punch = usePunch(SLAM, 18);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 40 }}>
      <Flash amount={punch.energy} />
      <div
        style={{
          transform: `scale(${1 + punch.pop * 0.07})`,
          display: "flex",
          alignItems: "center",
          gap: 34,
        }}
      >
        <Price value="$0.25" delay={SLAM} size={236} />
        <Check delay={SLAM + 12} size={92} />
      </div>
      <Chip delay={SLAM + 16} tone="paper" size={30}>
        ВЕСЬ РОЛИК · ОЗВУЧКА + ЛИЦО + РЕНДЕР
      </Chip>
      <div
        style={{
          width: 760,
          borderTop: `2px dotted ${ycColors.lineStrong}`,
          opacity: punch.energy,
        }}
      />
    </AbsoluteFill>
  );
};
