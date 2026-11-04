// The year's sum: «четырнадцать тысяч» rolls up (the exact 13 881 printed under it), four
// bars say where it goes, the same money as working days and as fuel, the next rise,
// the question to the viewer, then like + subscribe on the last line.
import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { usePunch } from "../../../reel";
import { BrandBar, Chip, Flash, Glitch, Kinetic, SceneShell, Stamp } from "../../digital-ruble/ui";
import { zhkhReceiptColors as colors, zhkhReceiptPalette as palette } from "../palette";
import { EPISODE, SERIES, TOTAL } from "../data";
import { CTA_AT, CUES, LEAD, VO_RATE } from "../timeline";
import { Bar, Card, CtaRow, Cutout, Drift, Paper, Roll, SourceLine, clamp } from "../ui";

export const TotalScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (s: number) => Math.round((LEAD + s / VO_RATE) * fps);
  const numAt = 6;
  const daysAt = at(CUES.total.days);
  const fuelAt = at(CUES.total.fuel);
  const nextAt = fuelAt + 30;
  const youAt = nextAt + 18;
  const ctaAt = Math.round(CTA_AT * fps);
  const hit = usePunch(numAt, 18);
  const days = usePunch(daysAt, 16);
  const fuel = usePunch(fuelAt, 14);
  const cta = usePunch(ctaAt + 12, 14);
  const tear = interpolate(frame, [0, 1, 8], [0, 0.9, 0], clamp);
  return (
    <SceneShell exit={false} shake={hit.shake + days.shake + fuel.shake * 0.5 + cta.shake * 0.5}>
      <Glitch amount={tear} style={{ position: "absolute", inset: 0 }}>
        <Drift items={["+14 000 ₽", "4 ДНЯ", "3,5 БАКА", "+11%", "₽"]} />
      </Glitch>
      <BrandBar series={SERIES} episode={EPISODE} delay={-30} />
      <div style={{ position: "absolute", left: 64, right: 64, top: 212, zIndex: 2, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 12 }}>
        <Kinetic text="ИТОГО ЗА ГОД" size={84} delay={0} per={3} mode="snap" lineHeight={1} />
        <div style={{ transform: `scale(${1 + hit.pop * 0.05})`, transformOrigin: "left center" }}>
          <Roll to={TOTAL.spoken} at={numAt} size={150} color={palette.primary} prefix="+" glow />
        </div>
        <Paper delay={numAt + 10} size={20}>
          {TOTAL.label}
        </Paper>
      </div>
      <div style={{ position: "absolute", left: 64, right: 64, top: 600, display: "flex", flexDirection: "column", gap: 10, zIndex: 2 }}>
        {TOTAL.bars.map(([label, v], i) => (
          <Bar key={label} label={label} value={v} max={TOTAL.bars[0][1]} at={numAt + 20 + i * 5} />
        ))}
      </div>
      {frame >= daysAt && (
        <div style={{ position: "absolute", left: 64, top: 900, zIndex: 5, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 10 }}>
          <Stamp tone="bad" size={84} rotate={-5} delay={daysAt}>
            {TOTAL.days}
          </Stamp>
          <Paper delay={daysAt + 8} size={19}>
            {TOTAL.daysLabel}
          </Paper>
        </div>
      )}
      <Cutout src={TOTAL.fuelPhoto} x={800} y={880} w={220} ratio={376 / 900} at={fuelAt} rot={8} z={3} />
      {frame >= fuelAt && (
        <div style={{ position: "absolute", left: 64, top: 1170, zIndex: 5, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 10 }}>
          <Chip delay={fuelAt + 2} tone="hero" filled size={30}>
            {TOTAL.fuel}
          </Chip>
          <Paper delay={fuelAt + 8} size={19}>
            {TOTAL.fuelLabel}
          </Paper>
        </div>
      )}
      {frame >= nextAt && (
        <div style={{ position: "absolute", left: 64, top: 1320, zIndex: 6 }}>
          <Card title={TOTAL.nextLabel} text={TOTAL.next} at={nextAt} />
        </div>
      )}
      {frame >= youAt && (
        <div style={{ position: "absolute", left: 64, top: 1460, zIndex: 6 }}>
          <Chip delay={youAt} tone="bad" filled size={21}>
            {TOTAL.you}
          </Chip>
        </div>
      )}
      <div style={{ position: "absolute", left: 0, right: 0, top: 1545 }}>
        <CtaRow at={ctaAt} like={TOTAL.like} subscribe={TOTAL.subscribe} />
      </div>
      <SourceLine text={TOTAL.sources} top={1790} />
      <Flash amount={hit.energy * 0.8} />
      <Flash amount={days.energy} color={colors.bad} />
      <Flash amount={cta.energy * 0.6} />
    </SceneShell>
  );
};
