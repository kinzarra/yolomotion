// The funeral, TikTok-style: the church candle full-bleed as on frame 0, mourners
// (cut from the author's picture) pop round it, language logos are thrown onto the
// grave like flowers, «Поставь лайк и подпишись». The last frame meets frame 0 (the loop).
import React from "react";
import { Img, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { usePunch } from "../../../reel";
import { theme } from "../../../theme";
import { EPISODE, LANGS, MOURNERS, SERIES } from "../data";
import { LEAD } from "../timeline";
import { BrandBar, CandleBg, CtaRow, CutSticker, Flash, Ribbon, SceneShell, Tombstone, media } from "../ui";

const Thrown: React.FC<{ f: string; x: number; y: number; rot: number; at: number }> = ({ f, x, y, rot, at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - at, fps, config: theme.spring.bouncy });
  if (frame < at) return null;
  const k = frame - at;
  // thrown in from above the frame, spinning, landing with a bounce
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 110, height: 110, zIndex: 8, display: "flex", alignItems: "center", justifyContent: "center", transform: `translateY(${interpolate(p, [0, 1], [-900, 0])}px) rotate(${rot + interpolate(p, [0, 1], [-200, 0])}deg) scale(${1 + Math.sin(k / 13) * 0.02})` }}>
      <Img src={media(`images/vibecoding-layers/langs/${f}.png`)} style={{ maxWidth: 110, maxHeight: 110, objectFit: "contain", filter: "drop-shadow(0 12px 16px rgba(0,0,0,0.8))" }} />
    </div>
  );
};

export const CtaScene: React.FC = () => {
  const { fps } = useVideoConfig();
  const at = Math.round(LEAD * fps);
  const hit = usePunch(at + 6, 14);
  return (
    <SceneShell exit={false} shake={hit.shake * 0.5}>
      <CandleBg />
      <Ribbon at={0} />
      <BrandBar series={SERIES} episode={EPISODE} delay={-30} />
      <CtaRow at={at} like="ЛАЙК" subscribe="ПОДПИСАТЬСЯ" top={250} />
      <div style={{ position: "absolute", inset: 0, zIndex: 5 }}>
        <Tombstone x={190} y={1110} w={700} drop={false} />
      </div>
      {MOURNERS.map((m, i) => (
        <CutSticker key={m.src} src={`images/vibecoding-layers/${m.src}.png`} x={m.x} y={m.y} w={m.w} ratio={m.ratio} at={2 + i * 5} rot={m.rot} z={7} outline={7} />
      ))}
      {LANGS.map((l, i) => (
        <Thrown key={l.f} f={l.f} x={l.x} y={l.y} rot={l.rot} at={14 + i * 3} />
      ))}
      <Flash amount={hit.energy * 0.5} />
    </SceneShell>
  );
};
