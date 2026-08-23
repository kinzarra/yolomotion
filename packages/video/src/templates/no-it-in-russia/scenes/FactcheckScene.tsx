// 08 factcheck — the counterweight, and the first lime in the reel. Seven
// beats of red have to be paid for: the scan runs the listings, the counter
// climbs, and the stamp says the replacement did not happen. Lime lands here
// and nowhere earlier, which is what makes it mean anything.
import React from "react";
import { theme } from "../../../theme";
import { useIn } from "../../../reel";
import { itColors, itPalette } from "../palette";
import {
  BrandBar,
  Check,
  Counter,
  Eyebrow,
  Kinetic,
  SceneShell,
  ScanRows,
  Stamp,
} from "../ui";

const STAMP = 132;

export const FactcheckScene: React.FC<{
  series: string;
  episode: string;
  scanned: number;
}> = ({ series, episode, scanned }) => {
  const labelIn = useIn(28, "snappy");
  return (
    <SceneShell>
      <BrandBar series={series} episode={episode} />

      <div style={{ position: "absolute", left: 90, top: 300 }}>
        <Eyebrow delay={0}>ФАКТЧЕК</Eyebrow>
      </div>

      <div style={{ position: "absolute", left: 90, right: 90, top: 366 }}>
        <Kinetic text="ЧТО ГОВОРЯТ ДАННЫЕ" delay={4} per={4} size={82} mode="rise" />
      </div>

      <div style={{ position: "absolute", left: 90, top: 580 }}>
        <ScanRows rows={13} width={900} height={340} delay={14} seed={21} />
      </div>

      <div
        style={{
          position: "absolute",
          left: 90,
          top: 990,
          display: "flex",
          alignItems: "baseline",
          gap: 22,
          opacity: labelIn,
          transform: `translateY(${(1 - labelIn) * 18}px)`,
        }}
      >
        <Counter to={scanned} delay={24} size={112} color={itPalette.text} />
        <span
          style={{
            fontFamily: theme.fonts.mono,
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: "0.14em",
            color: itPalette.textDim,
          }}
        >
          ВАКАНСИЙ ПРОВЕРЕНО
        </span>
      </div>

      <div
        style={{
          position: "absolute",
          left: 90,
          right: 90,
          top: 1186,
          display: "flex",
          alignItems: "center",
          gap: 24,
        }}
      >
        {/* 40, not 62: nineteen characters of Unbounded 900 at 62px are wider
            than the 900px column and the last letter fell off the frame. */}
        <Check delay={STAMP} size={64} />
        <Stamp delay={STAMP + 6} tone="hero" size={40} rotate={-2}>
          МАССОВОЙ ЗАМЕНЫ НЕТ
        </Stamp>
      </div>

      {/* The hairline the counter and the stamp both sit against. */}
      <div
        style={{
          position: "absolute",
          left: 90,
          top: 1152,
          width: 900,
          height: 1,
          background: itColors.line,
        }}
      />
    </SceneShell>
  );
};
