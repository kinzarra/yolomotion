import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../../theme";
import { rcColors, rcPalette } from "../palette";
import { cue, lineStart } from "../cues";
import {
  BrandBarWide,
  Figure,
  Kinetic,
  Logo,
  Part,
  Receipt,
  ReceiptLine,
  ReceiptRule,
  SceneShell,
  Screen,
  Shots,
  Stamp,
  Strike,
  ramp,
} from "../ui";

// Beat 12 — the formula. Part A: a receipt titled ИНСТРУКЦИЯ prints three
// lines (пробил / ответил / отвёз), each flashing its shot from earlier in
// the film. Part B: what is expensive to replace — the one who decides when
// the instruction fails; Klarna burned on exactly that.
export const FormulaScene: React.FC<{ series: string; episode: string }> = ({ series, episode }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = (p: number) => cue("formula", "16-formula", p, fps);
  const bStart = lineStart("formula", "17-answer", fps) - 6;
  const b = (p: number) => cue("formula", "17-answer", p, fps) - bStart;
  const s1 = a(3);
  const s2 = a(4);
  const s3 = a(5);
  return (
    <SceneShell>
      <BrandBarWide series={series} episode={episode} />
      <Part from={0} len={bStart}>
        <div style={{ position: "absolute", left: 96, top: 150 }}>
          <Kinetic text="ИНСТРУКЦИЯ = ЦЕННИК" size={84} per={4} delay={4} hero={[2]} />
        </div>
        <div style={{ position: "absolute", left: 110, top: 300 }}>
          <Receipt width={720} printFrom={a(1)} printFrames={20} title="ИНСТРУКЦИЯ" number="ШАГ 1–3" tilt={-1.2}>
            <ReceiptLine label="ПРОБИЛ ТОВАР" value="КАССА" mark="check" delay={s1} size={28} />
            <ReceiptLine label="ОТВЕТИЛ ПО СКРИПТУ" value="БОТ" mark="check" delay={s2} size={28} />
            <ReceiptLine label="ОТВЁЗ ИЗ А В Б" value="РОВЕР" mark="check" delay={s3} size={28} />
            <ReceiptRule strong />
            <ReceiptLine label="ЗАМЕНА" value="ДЁШЕВО" strong delay={s3 + 14} size={28} />
          </Receipt>
        </div>
        <Screen width={760} height={428} delay={a(1)} label="ПОВТОР" style={{ left: 1064, top: 230 }}>
          <Shots
            shots={[
              { file: "office.jpg", len: s1, focus: [0.5, 0.5] },
              { file: "clip-selfcheckout.mp4", len: s2 - s1 },
              { file: "clip-callcenter.mp4", len: s3 - s2 },
              { file: "clip-robot.mp4", len: bStart - s3 },
            ]}
          />
        </Screen>
      </Part>
      <Part from={bStart} exit={false}>
        <div style={{ position: "absolute", left: 96, top: 150 }}>
          <Kinetic text="ДОРОГО — ТОТ, КТО РЕШАЕТ," size={88} per={4} delay={2} hero={[2, 3, 4]} />
        </div>
        <div style={{ position: "absolute", left: 96, top: 270 }}>
          <Kinetic text="КОГДА ИНСТРУКЦИЯ НЕ РАБОТАЕТ" size={56} per={3} delay={b(1) - 4} color={rcPalette.textDim} />
        </div>
        <div style={{ position: "absolute", left: 140, top: 400 }}>
          <div style={{ position: "relative" }}>
            <Receipt width={560} printFrom={-30} printFrames={1} title="ИНСТРУКЦИЯ" number="СБОЙ" tilt={-1.2}>
              <ReceiptLine label="КЛИЕНТ ЗЛИТСЯ" value="?" />
              <ReceiptLine label="СКРИПТА НЕТ" value="?" />
            </Receipt>
            <Strike delay={b(1) + 6} thick={12} tilt={-8} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 800, top: 400 }}>
          <Figure size={170} tone="hero" delay={b(1)} breathe />
        </div>
        <div style={{ position: "absolute", left: 1150, top: 430, display: "flex", flexDirection: "column", gap: 24, alignItems: "flex-start" }}>
          <Logo file="logo-klarna.svg" height={44} delay={b(2)} />
          <Stamp delay={b(3)} tone="bad" size={54} rotate={-6}>
            ОБОЖГЛАСЬ
          </Stamp>
        </div>
        <div
          style={{
            position: "absolute",
            left: 800,
            top: 640,
            fontFamily: theme.fonts.mono,
            fontWeight: 700,
            fontSize: 20,
            letterSpacing: "0.14em",
            color: rcColors.paper,
            opacity: ramp(frame - bStart, b(1) + 10, b(1) + 20),
          }}
        >
          ЧЕЛОВЕК
        </div>
      </Part>
    </SceneShell>
  );
};
