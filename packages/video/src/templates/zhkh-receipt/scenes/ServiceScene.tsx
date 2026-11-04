// One line of the bill: the name, the tariff struck and replaced, the red %,
// the lit line on the receipt, a live clip in a tile with the real photo over it,
// «ЗА ГОД» in lime, the author's meme bottom left.
import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { usePunch } from "../../../reel";
import { BrandBar, Chip, Flash, Glitch, Kinetic, SceneShell, Stamp } from "../../digital-ruble/ui";
import { zhkhReceiptColors as colors } from "../palette";
import { EPISODE, RECEIPT, SERIES, Service } from "../data";
import { ClipTile, Cutout, Drift, Money, Paper, Pips, ReceiptPanel, Sticker, TariffRow, Wordmark, YearBlock, clamp, fitWord } from "../ui";

const TILE = { x: 540, y: 700, w: 480, h: 620 };

export const ServiceScene: React.FC<{ service: Service; index: number }> = ({ service: s, index }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const len = durationInFrames / fps;
  const slam = usePunch(0, 18);
  const tear = interpolate(frame, [0, 1, 8], [0, 0.9, 0], clamp);
  const stampAt = Math.round(Math.min(1.15, len * 0.3) * fps);
  const yearAt = Math.round(Math.min(2.3, len * 0.6) * fps);
  const stamp = usePunch(stampAt, 16);
  const year = usePunch(yearAt, 14);
  const titleSize = fitWord(s.title, 96);
  const photoBottom = s.photo ? Math.round(s.photoY + s.photoW / s.photoRatio) : 0;
  // the supplier chip: under the tile (or the photo), left of a photo that hangs below the tile, lower when a card sits under the tile
  const markY = s.chips ? 1610 : s.clip ? TILE.y + TILE.h + 20 : photoBottom + 20;
  return (
    <SceneShell shake={slam.shake + stamp.shake * 0.8 + year.shake * 0.5}>
      <Glitch amount={tear} style={{ position: "absolute", inset: 0 }}>
        <Drift items={[s.pct, "₽", "+"]} />
      </Glitch>
      <BrandBar series={SERIES} episode={EPISODE} delay={-30} />
      <div style={{ position: "absolute", left: 64, right: 64, top: 212, zIndex: 2, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 16 }}>
        <Kinetic text={s.title} size={titleSize} delay={2} per={3} mode="snap" lineHeight={1.0} />
        <TariffRow oldV={s.oldTariff} newV={s.newTariff} unit={s.unit} at={10} size={40} />
        {s.extra && (
          <Paper delay={18} size={20}>
            {s.extra}
          </Paper>
        )}
      </div>
      <div style={{ position: "absolute", left: 64, top: 660, zIndex: 1 }}>
        <ReceiptPanel width={430} tilt={-3} size={17} active={s.key} compact total={<Money value={RECEIPT.after} size={21} font="mono" color={colors.ink} />} />
      </div>
      {s.clip && <ClipTile src={`footage/zhkh-receipt/${s.clip}.mp4`} x={TILE.x} y={TILE.y} w={TILE.w} h={TILE.h} rot={2} at={4} z={1} />}
      {s.photo && <Cutout src={s.photo} x={s.photoX} y={s.photoY} w={s.photoW} ratio={s.photoRatio} at={s.clip ? 14 : 8} rot={s.rot} card={s.card} z={3} />}
      {s.chips && (
        <div style={{ position: "absolute", left: TILE.x + 22, top: TILE.y + TILE.h - 160, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 8, zIndex: 3 }}>
          {s.chips.map((c, i) => (
            <Chip key={c} delay={stampAt + 10 + i * 5} tone={i === 0 ? "bad" : "neutral"} filled={i === 0} size={18}>
              {c}
            </Chip>
          ))}
        </div>
      )}
      <Wordmark text={s.brand} at={16} y={markY} x={s.wordmarkLeft ? TILE.x + 10 : undefined} />
      {frame >= stampAt && (
        <div style={{ position: "absolute", left: 470, top: 580, zIndex: 6 }}>
          <Stamp tone="bad" size={96} rotate={-7} delay={stampAt}>
            {s.pct}
          </Stamp>
        </div>
      )}
      {frame >= yearAt && <YearBlock year={s.year} volume={s.volume} note={s.note} at={yearAt} />}
      {s.meme && <Sticker src={s.meme.src} x={40} y={1470} w={s.meme.w} ratio={s.meme.ratio} cut={s.meme.cut} at={yearAt + 10} rot={-5} z={5} />}
      <Pips active={index} />
      <Flash amount={stamp.energy} color={colors.bad} />
      <Flash amount={year.energy * 0.7} />
    </SceneShell>
  );
};
