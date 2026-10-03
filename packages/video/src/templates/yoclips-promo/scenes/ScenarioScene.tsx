// Beat 3 — what the agent gives back.
// Two halves: the real beat table printing on the receipt (evidence for «читает
// пайплайн и прошлые выпуски»), then the three things a scenario actually
// contains, as receipt lines that tick off (evidence for «биты, реплики,
// текст на экране»).
import React from "react";
import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { Eyebrow, Kinetic, PhoneFrame, Receipt, ReceiptLine, ReceiptRule, SceneShell, Screencast, Scrim, TopBar, shotFrames } from "../ui";

export const ScenarioScene: React.FC = () => {
  const { durationInFrames, fps } = useVideoConfig();
  const shot = Math.min(shotFrames("03-scenario", fps), durationInFrames);

  return (
    <SceneShell>
      <Sequence durationInFrames={shot} layout="none">
        {/* The push ends on the beat rows, not the header: that table is the
            thing being claimed. */}
        <PhoneFrame>
          <Screencast shot="03-scenario" len={shot} focus={0.38} zoom={[1, 1.06]} />
        </PhoneFrame>
        <Scrim from="bottom" height={820} solid={0.55} />
        <TopBar>
          <Eyebrow delay={4}>Шаг 02 · агент пишет сценарий</Eyebrow>
        </TopBar>
      </Sequence>

      <Sequence from={shot} layout="none">
        <AbsoluteFill style={{ padding: "220px 90px 0", alignItems: "center" }}>
          <Receipt width={780} printFrom={0} printFrames={15} title="СЦЕНАРИЙ" number="ФОРМАТ РЕПОЗИТОРИЯ">
            <ReceiptLine label="БИТЫ" value="9" mark="check" delay={12} />
            <ReceiptLine label="РЕПЛИКИ" value="ОЗВУЧКА" mark="check" delay={18} />
            <ReceiptLine label="ТЕКСТ НА ЭКРАНЕ" value="КАДР" mark="check" delay={24} />
            <ReceiptRule strong />
            <ReceiptLine label="ЧЕРНОВИК" value="ГОТОВ" strong delay={32} />
          </Receipt>
          <div style={{ width: 900, marginTop: 54 }}>
            <Kinetic text="БЕЗ ВЁРСТКИ" delay={42} per={4} size={78} align="center" hero={[1]} style={{ justifyContent: "center" }} />
          </div>
        </AbsoluteFill>
      </Sequence>
    </SceneShell>
  );
};
