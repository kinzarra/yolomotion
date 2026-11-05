import React from "react";
import { Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../../theme";
import { rcColors, rcPalette } from "../palette";
import { lineAt } from "../timeline";
import { FACE, faceSeconds, faceSrc } from "../face";
import { BrandBarWide, Chip, Face, Kinetic, SceneShell, ScrimWide, WIDE, ramp } from "../ui";

const STACK = [
  ["КАССИР", "≈130 000 ₽"],
  ["ОПЕРАТОР", "≈4 ₽/МИН"],
  ["БЭК-ОФИС", "GIGACHAT"],
  ["КУРЬЕР", "295 000 ₽"],
  ["ПРОГРАММИСТ", "$10/МЕС"],
] as const;

// Beat 13 — the face asks the question; then the end card holds it, with the
// five price tags of the film stacked as receipts, and the credits.
export const CtaScene: React.FC<{
  series: string;
  episode: string;
  face: boolean;
  question: string;
  credits: string;
  sources: string;
}> = ({ series, episode, face, question, credits, sources }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const voice = Math.round(lineAt("cta") * fps);
  const faceLen = voice + Math.round(faceSeconds("cta") * fps);
  const k = frame - faceLen;
  return (
    <SceneShell exit={false}>
      <Sequence from={0} durationInFrames={faceLen} layout="none">
        <Sequence from={face ? voice : 0} layout="none">
          <Face live={face} src={faceSrc("cta")} id={FACE.cta.id} says={FACE.cta.says} seconds={faceSeconds("cta")} />
        </Sequence>
        <ScrimWide left={0.7} bottom={0.9} top={0.1} />
        <div style={{ position: "absolute", left: 96, top: 560, width: 1200 }}>
          <Kinetic text={question} size={84} per={3} delay={voice} mode="snap" hero={[3]} />
        </div>
      </Sequence>
      <Sequence from={faceLen} layout="none">
        <BrandBarWide series={series} episode={episode} />
        <div style={{ position: "absolute", left: 96, top: 170, width: 1100 }}>
          <Kinetic text={question} size={80} per={3} delay={0} hero={[3]} />
        </div>
        <div style={{ position: "absolute", left: 96, top: 440 }}>
          <Chip delay={14} tone="hero" filled size={30}>
            НАПИШИ СВОЮ ПРОФЕССИЮ В КОММЕНТАРИЯХ
          </Chip>
        </div>
        <div style={{ position: "absolute", left: 1240, top: 170, width: 560, height: 560 }}>
          {STACK.map(([role, price], i) => {
            const p = spring({ frame: k - 6 - i * 5, fps, config: theme.spring.snappy });
            return (
              <div
                key={role}
                style={{
                  position: "absolute",
                  left: 0,
                  top: i * 92,
                  width: 540,
                  padding: "18px 28px",
                  background: rcColors.paper,
                  display: "flex",
                  justifyContent: "space-between",
                  fontFamily: theme.fonts.mono,
                  fontWeight: 700,
                  fontSize: 24,
                  letterSpacing: "0.08em",
                  color: rcColors.ink,
                  filter: `drop-shadow(${rcColors.paperShadow})`,
                  opacity: Math.min(1, p * 1.5),
                  transform: `translateX(${interpolate(p, [0, 1], [120, 0])}px) rotate(${(i % 2 ? 1 : -1) * 1.4 + Math.sin((frame + i * 11) / 30) * 0.4}deg)`,
                }}
              >
                <span>№{i + 1} {role}</span>
                <span style={{ fontFamily: WIDE, fontWeight: 900 }}>{price}</span>
              </div>
            );
          })}
        </div>
        <div
          style={{
            position: "absolute",
            left: 96,
            right: 96,
            top: 760,
            display: "flex",
            flexDirection: "column",
            gap: 8,
            fontFamily: theme.fonts.mono,
            fontWeight: 700,
            fontSize: 16,
            letterSpacing: "0.1em",
            color: rcPalette.textDim,
            opacity: ramp(k, 20, 32),
          }}
        >
          <span>ДАННЫЕ: {sources}</span>
          <span>{credits}</span>
        </div>
      </Sequence>
    </SceneShell>
  );
};
