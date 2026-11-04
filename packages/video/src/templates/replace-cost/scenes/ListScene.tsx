import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../../theme";
import { rcColors, rcPalette } from "../palette";
import { cue } from "../cues";
import { BrandBarWide, Chip, Glitch, Kinetic, Photo, SceneShell, WIDE, rnd } from "../ui";

const CARDS = [
  { n: 1, name: "КАССИР", file: "selfcheckout.jpg", focus: [0.5, 0.5] as [number, number] },
  { n: 2, name: "ОПЕРАТОР", file: "callcenter.jpg", focus: [0.5, 0.4] as [number, number] },
  { n: 3, name: "БЭК-ОФИС", file: "office.jpg", focus: [0.5, 0.5] as [number, number] },
  { n: 4, name: "КУРЬЕР", file: "yandex-rover.jpg", focus: [0.5, 0.6] as [number, number] },
];

const CW = 300;
const CH = 400;

// Beat 3 — five price tags in a row; the fifth stays locked and glitches on
// «самой защищённой». It opens in beat 10.
export const ListScene: React.FC<{ series: string; episode: string }> = ({ series, episode }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const c = (p: number) => cue("list", "03-list", p, fps);
  const lockHit = c(4);
  const tease = frame >= lockHit && frame < lockHit + 10 ? 0.9 : frame >= lockHit ? 0.12 + rnd(Math.floor(frame / 3)) * 0.15 : 0;
  const card = (i: number) => spring({ frame: frame - (c(1) - 4 + i * 5), fps, config: theme.spring.snappy });
  return (
    <SceneShell>
      <BrandBarWide series={series} episode={episode} />
      <div style={{ position: "absolute", left: 96, top: 140 }}>
        <Kinetic text="5 ПРОФЕССИЙ С ЦЕННИКОМ" size={64} per={3} delay={4} hero={[0]} />
      </div>
      <div style={{ position: "absolute", left: 138, top: 290, display: "flex", gap: 36 }}>
        {CARDS.map((k, i) => {
          const p = card(i);
          return (
            <div
              key={k.n}
              style={{
                position: "relative",
                width: CW,
                height: CH,
                background: rcColors.paper,
                padding: 14,
                opacity: Math.min(1, p * 1.5),
                transform: `translateY(${interpolate(p, [0, 1], [80, Math.sin((frame + i * 9) / 26) * 3])}px) rotate(${interpolate(p, [0, 1], [8, (i % 2 ? 1 : -1) * 1.5])}deg)`,
                filter: `drop-shadow(${rcColors.paperShadow})`,
              }}
            >
              <div style={{ position: "relative", width: CW - 28, height: 250, overflow: "hidden" }}>
                <Photo file={k.file} len={durationInFrames} focus={k.focus} zoom={[1.05, 1.18]} filter="grayscale(1) contrast(1.2)" />
              </div>
              <div style={{ fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: 18, letterSpacing: "0.14em", color: rcColors.inkFaded, marginTop: 14 }}>
                №{k.n} · ЦЕННИК ВЫПИСАН
              </div>
              <div style={{ fontFamily: WIDE, fontWeight: 900, fontSize: 34, color: rcColors.ink, marginTop: 8, letterSpacing: "-0.02em" }}>{k.name}</div>
            </div>
          );
        })}
        {/* the locked fifth */}
        {(() => {
          const p = card(4);
          return (
            <div
              style={{
                position: "relative",
                width: CW,
                height: CH,
                border: `3px dashed ${rcPalette.primary}`,
                background: rcColors.surface,
                opacity: Math.min(1, p * 1.5),
                transform: `translateY(${interpolate(p, [0, 1], [80, 0])}px)`,
              }}
            >
              <Glitch amount={tease} style={{ position: "absolute", inset: 0 }}>
                <div style={{ width: CW - 6, height: CH - 6, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18 }}>
                  <div style={{ fontFamily: WIDE, fontWeight: 900, fontSize: 120, color: rcPalette.primary, filter: `drop-shadow(0 0 22px ${rcPalette.glow})` }}>???</div>
                  <div style={{ fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: 18, letterSpacing: "0.14em", color: rcPalette.textDim }}>№5 · ЗАКРЫТО</div>
                </div>
              </Glitch>
            </div>
          );
        })()}
      </div>
      <div style={{ position: "absolute", left: 138 + (CW + 36) * 4 - 10, top: 716 }}>
        <Chip delay={lockHit} tone="hero" size={22}>
          САМАЯ ЗАЩИЩЁННАЯ?
        </Chip>
      </div>
    </SceneShell>
  );
};
