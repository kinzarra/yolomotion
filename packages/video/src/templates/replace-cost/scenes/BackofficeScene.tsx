import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../../theme";
import { rcColors, rcPalette } from "../palette";
import { cue } from "../cues";
import {
  BrandBarWide,
  CLIP_MAX,
  Chip,
  Logo,
  NumTitle,
  Odometer,
  SceneShell,
  Screen,
  Shots,
  Source,
  Stamp,
  ramp,
} from "../ui";

// Beat 7 — №3 БЭК-ОФИС БАНКА. Sber's headcount rolls down 308 092 → 294 578,
// −13 514 stamps red, and the bank's own explanation: GigaChat.
export const BackofficeScene: React.FC<{ series: string; episode: string }> = ({ series, episode }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const c = (p: number) => cue("backoffice", "10-backoffice", p, fps);
  return (
    <SceneShell>
      <BrandBarWide series={series} episode={episode} />
      <div style={{ position: "absolute", left: 96, top: 140 }}>
        <NumTitle n={3} name="БЭК-ОФИС БАНКА" delay={2} size={76} />
      </div>
      <div style={{ position: "absolute", left: 96, top: 270 }}>
        <Logo file="logo-sber.svg" height={52} delay={c(1)} />
      </div>
      <div style={{ position: "absolute", left: 96, top: 400 }}>
        <div
          style={{
            fontFamily: theme.fonts.mono,
            fontWeight: 700,
            fontSize: 22,
            letterSpacing: "0.12em",
            color: rcPalette.textDim,
            marginBottom: 10,
            opacity: ramp(frame, c(1), c(1) + 10),
          }}
        >
          СОТРУДНИКОВ · 31.12.2024 → 30.09.2025
        </div>
        <Odometer from={308092} to={294578} delay={c(2)} dur={50} size={128} />
      </div>
      <div style={{ position: "absolute", left: 140, top: 620 }}>
        <Stamp delay={c(3)} tone="bad" size={80} rotate={-5}>
          −13 514
        </Stamp>
      </div>
      <div style={{ position: "absolute", left: 560, top: 650 }}>
        <Chip delay={c(5)} tone="hero" size={28}>
          ПРИЧИНА · GIGACHAT
        </Chip>
      </div>
      <Screen width={820} height={461} delay={4} label="ЦЕНТРАЛЬНЫЙ ОФИС" style={{ left: 1004, top: 200 }}>
        <Shots
          shots={[
            { file: "clip-office.mp4", len: CLIP_MAX },
            { file: "office.jpg", len: durationInFrames - CLIP_MAX, focus: [0.5, 0.5] },
          ]}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: rcColors.bad,
            mixBlendMode: "multiply",
            opacity: ramp(frame, c(3), c(3) + 8) * 0.25,
          }}
        />
      </Screen>
      <div style={{ position: "absolute", left: 96, top: 848 }}>
        <Source delay={c(1)}>REUTERS / THE MOSCOW TIMES, 28.10.2025 — ОТЧЁТНОСТЬ СБЕРА</Source>
      </div>
    </SceneShell>
  );
};
