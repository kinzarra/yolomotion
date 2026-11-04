import React from "react";
import { Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../../theme";
import { rcColors, rcPalette } from "../palette";
import { cue, lineEnd, lineStart } from "../cues";
import { FACE, faceSeconds, faceSrc } from "../face";
import {
  BrandBarWide,
  Chip,
  DotField,
  Face,
  Glitch,
  Kinetic,
  Logo,
  Part,
  PrintedPhoto,
  SceneShell,
  ScrimWide,
  Source,
  Stamp,
  ramp,
  rnd,
} from "../ui";

// Beat 6 — THE TURN. Part A: ПОВОРОТ glitches in; Klarna's CEO prints; the
// stamp ПЕРЕГНУЛИ; the 700 dots that went out come back on. Part B: the face
// says why (a cheap bot that annoys customers costs more than a person), and
// when the insert ends the frame keeps «ЗАПОМНИ ЭТО».
export const TwistScene: React.FC<{ series: string; episode: string; face: boolean }> = ({ series, episode, face }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = (p: number) => cue("twist", "08-twist", p, fps);
  const bStart = lineStart("twist", "09-twist-face", fps);
  const faceLen = Math.round(faceSeconds("twist") * fps);
  const b = (p: number) => cue("twist", "09-twist-face", p, fps) - bStart;
  const g = frame < 12 ? 0.9 - frame * 0.06 : rnd(Math.floor(frame / 4)) > 0.93 ? 0.4 : 0;
  return (
    <SceneShell>
      <Part from={0} len={bStart}>
        <BrandBarWide series={series} episode={episode} />
        <div style={{ position: "absolute", left: 96, top: 150 }}>
          <Glitch amount={g}>
            <Kinetic text="А ТЕПЕРЬ ПОВОРОТ" size={92} per={3} mode="snap" delay={0} hero={[2]} />
          </Glitch>
        </div>
        <PrintedPhoto
          file="klarna-ceo.jpg"
          width={520}
          height={500}
          len={bStart}
          printFrom={a(1) - 10}
          focus={[0.5, 0.3]}
          tilt={-2.5}
          caption={
            <>
              <span>ГЛАВА KLARNA</span>
              <span>2025</span>
            </>
          }
          style={{ left: 1260, top: 150 }}
        />
        <div style={{ position: "absolute", left: 1230, top: 130 }}>
          <Logo file="logo-klarna.svg" height={34} delay={a(1)} tilt={-6} />
        </div>
        <div style={{ position: "absolute", left: 640, top: 380 }}>
          <Stamp delay={a(2)} tone="bad" size={96} rotate={-7}>
            ПЕРЕГНУЛИ
          </Stamp>
        </div>
        <div style={{ position: "absolute", left: 110, top: 420 }}>
          <DotField count={700} cols={35} dot={10} gap={5} delay={-40} offAt={-30} backAt={a(3)} backShare={0.45} />
        </div>
        <div style={{ position: "absolute", left: 110, top: 740 }}>
          <Chip delay={a(4)} tone="hero" size={26}>
            НАНИМАЮТ ЛЮДЕЙ ОБРАТНО
          </Chip>
        </div>
        <div style={{ position: "absolute", left: 96, top: 848 }}>
          <Source delay={a(1)}>ЗАЯВЛЕНИЯ CEO KLARNA, 2025</Source>
        </div>
      </Part>
      <Part from={bStart} exit={false}>
        <Sequence from={0} durationInFrames={faceLen} layout="none">
          <Face live={face} src={faceSrc("twist")} id={FACE.twist.id} says={FACE.twist.says} seconds={faceSeconds("twist")} />
          <ScrimWide left={0.6} bottom={0.9} top={0.1} />
          <div style={{ position: "absolute", left: 96, top: 640 }}>
            <Kinetic text="ДОРОЖЕ ЧЕЛОВЕКА" size={92} per={4} mode="snap" delay={b(3)} bad={[0]} />
          </div>
        </Sequence>
        <Sequence from={faceLen} layout="none">
          <BrandBarWide series={series} episode={episode} />
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 26,
            }}
          >
            <Kinetic text="ЗАПОМНИ ЭТО" size={130} per={4} mode="snap" hero={[1]} glow align="center" />
            <div
              style={{
                fontFamily: theme.fonts.mono,
                fontWeight: 700,
                fontSize: 26,
                letterSpacing: "0.18em",
                color: rcPalette.textDim,
                opacity: ramp(frame - bStart - faceLen, 8, 18),
              }}
            >
              ДЕШЁВЫЙ БОТ ≠ ДЕШЁВАЯ ЗАМЕНА
            </div>
            <div style={{ width: 420, height: 2, background: rcColors.lineStrong, transform: `scaleX(${ramp(frame - bStart - faceLen, 4, 22)})` }} />
          </div>
        </Sequence>
      </Part>
    </SceneShell>
  );
};
