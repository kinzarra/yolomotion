// 10 cta — one question, two answers, nothing else. The chips are deliberately
// the same weight: an argument that has spent nine beats saying "it is harder,
// not over" cannot then colour one of the two answers as the right one.
import React from "react";
import { theme } from "../../../theme";
import { useIn } from "../../../reel";
import { itColors, itPalette } from "../palette";
import { BrandBar, Eyebrow, Kinetic, SceneShell } from "../ui";

const ANSWERS = ["ДА", "НЕТ"];

export const CtaScene: React.FC<{
  series: string;
  episode: string;
  footnote: string;
}> = ({ series, episode, footnote }) => {
  const foot = useIn(74, "smooth");
  return (
    <SceneShell exit={false}>
      <BrandBar series={series} episode={episode} />

      <div style={{ position: "absolute", left: 90, top: 300 }}>
        <Eyebrow delay={0}>ВОПРОС К ВАМ</Eyebrow>
      </div>

      <div style={{ position: "absolute", left: 90, right: 90, top: 400 }}>
        {/* «СЕГОДНЯ» dropped: it pushed the question onto a third line that
            held nothing but «IT?». */}
        <Kinetic text="ПОШЛИ БЫ В IT?" delay={6} per={4} size={106} mode="rise" />
      </div>

      <div
        style={{
          position: "absolute",
          left: 90,
          right: 90,
          top: 810,
          display: "flex",
          gap: 26,
        }}
      >
        {ANSWERS.map((a, i) => (
          <Answer key={a} label={a} delay={44 + i * 8} />
        ))}
      </div>

      <div
        style={{
          position: "absolute",
          left: 90,
          right: 90,
          top: 1054,
          fontFamily: theme.fonts.mono,
          fontSize: 24,
          fontWeight: 700,
          letterSpacing: "0.14em",
          color: itPalette.textDim,
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
          top: 1136,
          fontFamily: theme.fonts.body,
          fontSize: 22,
          lineHeight: 1.45,
          color: itPalette.textDim,
          opacity: foot * 0.85,
        }}
      >
        {footnote}
      </div>
    </SceneShell>
  );
};

/** One of the two poll answers: a half-width slab that snaps in. */
const Answer: React.FC<{ label: string; delay: number }> = ({ label, delay }) => {
  const p = useIn(delay, "snappy");
  return (
    <div
      style={{
        flex: 1,
        padding: "42px 0",
        textAlign: "center",
        border: `3px solid ${itColors.lineStrong}`,
        background: itColors.surface,
        fontFamily: theme.fonts.wide,
        fontSize: 76,
        fontWeight: 900,
        letterSpacing: "-0.02em",
        color: itPalette.text,
        opacity: p,
        transform: `translateY(${(1 - p) * 34}px) scale(${0.92 + p * 0.08})`,
      }}
    >
      {label}
    </div>
  );
};
