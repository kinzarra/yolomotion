// 02 numbers — the shock figures. A year of openings grows DOWNWARD out of a
// top rule and turns red on the way, while résumés keep falling on top of it:
// two motions in opposite directions, which is the whole argument of the beat.
// The brief asks for «звуки массовых уведомлений „Отказ"» — the series has no
// SFX, so the volume is carried visually by the downpour instead.
import React from "react";
import { theme } from "../../../theme";
import { itColors, itPalette } from "../palette";
import {
  BrandBar,
  Chip,
  Eyebrow,
  FallingBars,
  Kinetic,
  ResumeRain,
  SceneShell,
} from "../ui";

// A year of openings: high and noisy at the start, sagging, then giving way.
// Bars are drawn downward, so a bigger number is a longer bar and more work.
const YEAR = [0.95, 0.9, 0.94, 0.86, 0.83, 0.86, 0.76, 0.71, 0.68, 0.6, 0.64, 0.55];

export const NumbersScene: React.FC<{
  series: string;
  episode: string;
  vacancyDelta: string;
}> = ({ series, episode, vacancyDelta }) => (
  <SceneShell>
    <BrandBar series={series} episode={episode} />

    <div style={{ position: "absolute", left: 90, top: 300 }}>
      <Eyebrow delay={0}>РЫНОК ЗА ГОД</Eyebrow>
    </div>

    <div style={{ position: "absolute", left: 90, right: 90, top: 366 }}>
      <Kinetic
        // Two words per line, and no free-standing em dash: the dash counted
        // as a word of its own and pushed «БОЛЬШЕ» onto a third line that ran
        // into the top of the chart.
        text="МЕСТ МЕНЬШЕ. ЛЮДЕЙ БОЛЬШЕ."
        delay={4}
        per={4}
        size={78}
        mode="rise"
        bad={[1]}
      />
    </div>

    <div style={{ position: "absolute", left: 90, top: 700 }}>
      <FallingBars values={YEAR} width={900} height={320} delay={18} per={3} badFrom={0.55} />
    </div>

    {/* In front of the bars: the résumés land on the market, not behind it. */}
    <ResumeRain count={20} from={26} seed={11} top={600} height={560} />

    <div
      style={{
        position: "absolute",
        left: 90,
        right: 90,
        top: 1080,
        display: "flex",
        gap: 20,
        alignItems: "center",
      }}
    >
      <Chip delay={64} tone="bad" size={30}>
        ВАКАНСИИ {vacancyDelta}
      </Chip>
      {/* Unbounded has no ↑ — Chip is set in the mono face, which does. */}
      <Chip delay={76} size={30}>
        РЕЗЮМЕ ↑
      </Chip>
    </div>

    {/* The rule the bars hang from, repeated under the tags so the block reads
        as one panel rather than a chart with two loose chips. */}
    <div
      style={{
        position: "absolute",
        left: 90,
        top: 1188,
        width: 900,
        height: 1,
        background: itColors.line,
      }}
    />
    <div
      style={{
        position: "absolute",
        left: 90,
        top: 1208,
        fontFamily: theme.fonts.mono,
        fontSize: 21,
        fontWeight: 700,
        letterSpacing: "0.14em",
        color: itPalette.textDim,
      }}
    >
      12 МЕСЯЦЕВ
    </div>
  </SceneShell>
);
