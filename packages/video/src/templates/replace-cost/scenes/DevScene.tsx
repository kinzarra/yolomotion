import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../../theme";
import { rcColors, rcPalette } from "../palette";
import { cue, lineStart } from "../cues";
import {
  BrandBarWide,
  CLIP_MAX,
  Glitch,
  Logo,
  Wordmark,
  NumTitle,
  Part,
  PrintedPhoto,
  Ring,
  SceneShell,
  Screen,
  Shots,
  Source,
  VersusReceipt,
  WIDE,
  ramp,
} from "../ui";

/** Two vacancy bars, H1 → H2 2025: the second drops 38% and turns red. */
const Vacancies: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const h = 420;
  const p1 = ramp(frame, delay, delay + 20, theme.ease.out);
  const p2 = ramp(frame, delay + 10, delay + 30, theme.ease.out);
  const drop = ramp(frame, delay + 34, delay + 56, theme.ease.inOut);
  const h2 = interpolate(drop, [0, 1], [1, 0.62]);
  const bar = (label: string, frac: number, p: number, bad: boolean, value: string) => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, width: 200 }}>
      <div style={{ fontFamily: WIDE, fontWeight: 900, fontSize: 36, color: bad ? rcColors.bad : rcPalette.text, opacity: p }}>{value}</div>
      <div style={{ height: h, width: 150, display: "flex", alignItems: "flex-end" }}>
        <div style={{ width: "100%", height: h * frac * p, background: bad ? rcColors.bad : rcColors.paper, boxShadow: bad ? `0 0 26px ${rcColors.badGlow}` : undefined }} />
      </div>
      <div style={{ fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: 20, letterSpacing: "0.12em", color: rcPalette.textDim, opacity: p, whiteSpace: "nowrap" }}>{label}</div>
    </div>
  );
  return (
    <div style={{ display: "flex", gap: 40, alignItems: "flex-end" }}>
      {bar("I ПОЛУГ. 2025", 1, p1, false, "100%")}
      {bar("II ПОЛУГ. 2025", h2, p2, drop > 0.5, drop > 0.5 ? "−38%" : "…")}
    </div>
  );
};

// Beat 10 — №5 ПРОГРАММИСТ: the locked card from beat 3 opens. Part A: 69%
// of the code Sber's teams accept is written by AI; Google, more than a
// third. Part B: a $10 subscription vs a 50 000 ₽ junior; Habr Career
// vacancies −38% in half a year.
export const DevScene: React.FC<{ series: string; episode: string }> = ({ series, episode }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = (p: number) => cue("dev", "13-dev", p, fps);
  const bStart = lineStart("dev", "14-dev-price", fps) - 6;
  const b = (p: number) => cue("dev", "14-dev-price", p, fps) - bStart;
  const unlock = frame < 10 ? 0.9 - frame * 0.08 : 0;
  return (
    <SceneShell>
      <BrandBarWide series={series} episode={episode} />
      <Part from={0} len={bStart}>
        <div style={{ position: "absolute", left: 96, top: 140 }}>
          <Glitch amount={unlock}>
            <NumTitle n={5} name="ПРОГРАММИСТ" delay={0} />
          </Glitch>
        </div>
        <div style={{ position: "absolute", left: 96, top: 270, fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: 22, letterSpacing: "0.12em", color: rcPalette.textDim, opacity: ramp(frame, a(1), a(1) + 10) }}>
          ТА САМАЯ «ЗАЩИЩЁННАЯ»
        </div>
        <div style={{ position: "absolute", left: 96, top: 330, display: "flex", gap: 50, alignItems: "flex-start" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
            <Ring value={69} size={340} delay={a(4)} label="КОДА ПИШЕТ ИИ" />
            <Logo file="logo-sber.svg" height={34} delay={a(3)} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
            <Ring value={30} prefix=">" size={250} delay={a(8)} tone="bone" label="НОВОГО КОДА" />
            <Logo file="logo-google.svg" height={30} delay={a(7)} />
          </div>
        </div>
        <Screen width={820} height={461} delay={4} label="IDE · КОД-РЕВЬЮ" style={{ left: 1004, top: 250 }}>
          <Shots
            shots={[
              { file: "clip-code.mp4", len: CLIP_MAX },
              { file: "code.jpg", len: bStart - CLIP_MAX, focus: [0.4, 0.5], zoom: [1.05, 1.25] },
            ]}
          />
        </Screen>
        <div style={{ position: "absolute", left: 96, top: 848 }}>
          <Source delay={a(4)}>СБЕР (GIGACODE), ИТОГИ 2025 · GOOGLE, ОТЧЁТ ЗА I КВ. 2025</Source>
        </div>
      </Part>
      <Part from={bStart} exit={false}>
        <div style={{ position: "absolute", left: 96, top: 160 }}>
          <VersusReceipt
            role="ДЖУН"
            delay={b(2) - 8}
            machineAt={b(0) + 4}
            scale={0.88}
            human={{ label: "ЗАРПЛАТА ДЖУНА", value: "50 000 ₽", unit: "В МЕСЯЦ · ОЖИДАНИЯ" }}
            machine={{ label: "ИИ-АССИСТЕНТ", value: "$10", unit: "В МЕСЯЦ · ПОДПИСКА" }}
          />
        </div>
        <PrintedPhoto
          file="code.jpg"
          width={620}
          height={250}
          len={600}
          printFrom={b(1) - 8}
          focus={[0.4, 0.5]}
          tilt={-1.5}
          caption={
            <>
              <span>КОД · АССИСТЕНТ</span>
              <span>$10/МЕС</span>
            </>
          }
          style={{ left: 110, top: 480 }}
        />
        <div style={{ position: "absolute", left: 620, top: 450 }}>
          <Logo file="logo-github.svg" height={36} delay={b(1) + 6} tilt={4} />
        </div>
        <div style={{ position: "absolute", left: 1120, top: 190 }}>
          <Wordmark height={38} delay={b(4)} tilt={-3}>ХАБР КАРЬЕРА</Wordmark>
        </div>
        <div style={{ position: "absolute", left: 1120, top: 300 }}>
          <Vacancies delay={b(4) + 6} />
        </div>
        <div style={{ position: "absolute", left: 1120, top: 836, fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: 20, letterSpacing: "0.12em", color: rcPalette.textDim, opacity: ramp(frame - bStart, b(5), b(5) + 10) }}>
          ВАКАНСИИ ДЛЯ РАЗРАБОТЧИКОВ
        </div>
        <div style={{ position: "absolute", left: 96, top: 848 }}>
          <Source delay={8}>HH.RU · ХАБР КАРЬЕРА, ИТОГИ 2025</Source>
        </div>
      </Part>
    </SceneShell>
  );
};
