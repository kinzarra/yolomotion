// 12 cta — one question, two equal answers, and the footage credits. The
// chips weigh the same: the reel explains a model, it does not sell a move.
import React from "react";
import { theme } from "../../../theme";
import { useIn } from "../../../reel";
import { deColors, dePalette } from "../palette";
import { BrandBar, Dust, Eyebrow, Kinetic, SceneShell } from "../ui";

const ANSWERS = ["ДА", "НЕТ"];

export const CtaScene: React.FC<{ series: string; episode: string; question: string; credits: string }> = ({
  series,
  episode,
  question,
  credits,
}) => {
  const foot = useIn(60, "smooth");
  return (
    <SceneShell exit={false}>
      <Dust seed={13} />
      <BrandBar series={series} episode={episode} />
      <div style={{ position: "absolute", left: 90, top: 300 }}>
        <Eyebrow delay={0}>ВОПРОС К ВАМ</Eyebrow>
      </div>
      <div style={{ position: "absolute", left: 90, right: 90, top: 390 }}>
        <Kinetic text={question} delay={4} per={4} size={96} hero={[3]} />
      </div>
      <div style={{ position: "absolute", left: 90, right: 90, top: 820, display: "flex", gap: 26 }}>
        {ANSWERS.map((a, i) => (
          <Answer key={a} label={a} delay={30 + i * 8} />
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          left: 90,
          right: 90,
          top: 1060,
          fontFamily: theme.fonts.mono,
          fontSize: 24,
          fontWeight: 700,
          letterSpacing: "0.14em",
          color: dePalette.textDim,
          opacity: foot,
          transform: `translateY(${(1 - foot) * 14}px)`,
        }}
      >
        НАПИШИТЕ ОДНИМ СЛОВОМ
      </div>
      <div
        style={{
          position: "absolute",
          left: 90,
          right: 90,
          top: 1140,
          fontFamily: theme.fonts.body,
          fontSize: 22,
          lineHeight: 1.45,
          color: dePalette.textDim,
          opacity: foot * 0.85,
        }}
      >
        {credits}
      </div>
    </SceneShell>
  );
};

const Answer: React.FC<{ label: string; delay: number }> = ({ label, delay }) => {
  const p = useIn(delay, "snappy");
  return (
    <div
      style={{
        flex: 1,
        padding: "42px 0",
        textAlign: "center",
        border: `3px solid ${deColors.lineStrong}`,
        background: deColors.surface,
        fontFamily: theme.fonts.wide,
        fontSize: 76,
        fontWeight: 900,
        letterSpacing: "-0.02em",
        color: dePalette.text,
        opacity: p,
        transform: `translateY(${(1 - p) * 34}px) scale(${0.92 + p * 0.08})`,
      }}
    >
      {label}
    </div>
  );
};
