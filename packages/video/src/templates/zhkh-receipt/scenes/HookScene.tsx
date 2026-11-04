// The bill is on frame 0 (the cover) while the headline burns in; evidence cut-outs
// (service icons) gather round it; the total rolls 9 410 → 10 567 with an arrow and the red stamp;
// the face lands beside the bill, the meme pops on «Ого», «ЗА ЧТО?» on the last words.
import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { usePunch } from "../../../reel";
import { theme } from "../../../theme";
import { BrandBar, Chip, Flash, Kinetic, SceneShell, Stamp } from "../../digital-ruble/ui";
import { zhkhReceiptColors as colors } from "../palette";
import { EPISODE, HOOK, RECEIPT, SERIES } from "../data";
import { PRESENTER } from "../presenter";
import { CUES, LEAD, VO_RATE } from "../timeline";
import { Arrow, BurnWords, Drift, FaceCircle, Icon, ReceiptPanel, Roll, Sticker } from "../ui";

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (s: number) => Math.round((LEAD + s / VO_RATE) * fps);
  const numAt = at(CUES.hook.number);
  const faceAt = at(CUES.hook.face);
  const ogoAt = at(CUES.hook.ogo);
  const whyAt = at(CUES.hook.why);
  const stampAt = numAt + 8;
  const hit = usePunch(numAt, 16);
  const why = usePunch(whyAt, 14);
  return (
    <SceneShell exit={false} shake={hit.shake + why.shake * 0.6}>
      <Drift items={["+9,9%", "+15%", "+22%", "₽", "+18,9%", "ОКТЯБРЬ"]} />
      <BrandBar series={SERIES} episode={EPISODE} delay={-30} />
      <div style={{ position: "absolute", left: 64, right: 64, top: 212, zIndex: 2 }}>
        <BurnWords words={HOOK.words} every={5} size={92} start={0} />
        <div style={{ marginTop: 16 }}>
          <Chip delay={10} tone="bad" filled size={24}>
            С 1 ОКТЯБРЯ 2026 · ТАРИФЫ ВЫРОСЛИ
          </Chip>
        </div>
      </div>
      <div style={{ position: "absolute", left: 64, top: 490, zIndex: 3 }}>
        <ReceiptPanel width={520} tilt={-2} printFrom={-40} printFrames={30} size={21} total={<Roll from={RECEIPT.before} to={RECEIPT.after} at={numAt} size={30} color={colors.ink} font="mono" />} />
      </div>
      {/* the four services as icons round the bill until the face takes that side */}
      {HOOK.icons.map((ic, i) => (
        <Icon key={ic.kind} kind={ic.kind} label={ic.label} value={ic.value} x={ic.x} y={ic.y} at={12 + i * 4} until={faceAt} rot={ic.rot} size={150} />
      ))}
      <Arrow x={430} y={880} rot={20} at={numAt} until={faceAt + 4} size={200} />
      {frame >= stampAt && (
        <div style={{ position: "absolute", left: 64, top: 1060, zIndex: 6 }}>
          <Stamp tone="bad" size={64} rotate={-5} delay={stampAt}>
            {/* Unbounded has no ₽ and the render server has no fallback face: the sign is set in mono */}
            {RECEIPT.deltaNum} <span style={{ fontFamily: theme.fonts.mono }}>₽</span> {RECEIPT.deltaUnit}
          </Stamp>
        </div>
      )}
      <div style={{ position: "absolute", left: 64, top: 1190, width: 640, display: "flex", flexWrap: "wrap", gap: 10, zIndex: 5 }}>
        {HOOK.chips.map((c, i) => (
          <Chip key={c} delay={numAt + 16 + i * 5} tone={i === 0 ? "hero" : i === 1 ? "neutral" : "bad"} filled={i !== 1} size={20}>
            {c}
          </Chip>
        ))}
      </div>
      <FaceCircle
        at={faceAt}
        len={Math.round((PRESENTER.punch.duration / VO_RATE) * fps)}
        file={`presenter/zhkh-receipt/${PRESENTER.punch.file}`}
        rate={VO_RATE}
        size={420}
        x={600}
        y={600}
        enabled={PRESENTER.punch.enabled}
      />
      <Sticker src={HOOK.meme.src} x={720} y={1250} w={HOOK.meme.w} ratio={HOOK.meme.ratio} cut={HOOK.meme.cut} at={ogoAt} rot={8} />
      {frame >= whyAt && (
        <div style={{ position: "absolute", left: 64, top: 1300, zIndex: 7 }}>
          <Kinetic text="ЗА ЧТО?" size={150} delay={whyAt} per={4} mode="snap" hero={[0, 1]} glow lineHeight={1} />
        </div>
      )}
      <Flash amount={hit.energy * 0.7} color={colors.bad} />
      <Flash amount={why.energy * 0.6} />
    </SceneShell>
  );
};
