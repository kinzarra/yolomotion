// Beat 4 — the second spark. The White House draws itself in dim ink, five
// silhouettes step in front of it, the CLARITY ACT prints on paper and a
// lime ПРАВИЛА stamp lands. Headline: МЕНЬШЕ НЕОПРЕДЕЛЁННОСТИ.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { theme } from "../../../theme";
import { usePunch } from "../../../reel";
import { btcColors } from "../palette";
import { BrandBar, Chip, Eyebrow, Flash, Kinetic, Receipt, ReceiptLine, ReceiptRule, SceneShell, Silhouette, Stamp, WhiteHouse } from "../ui";

const HOUSE = 2;
const PEOPLE = 66; // «собрал лидеров»
const DOC = 150; // «потребовал продвинуть»
const STAMP = 192; // «CLARITY Act»
const HEAD = 256; // «правила для крипты могут стать понятнее»

export const ClarityScene: React.FC<{ series: string; episode: string }> = ({ series, episode }) => {
  const frame = useCurrentFrame();
  const stamp = usePunch(STAMP, 18);
  // the building and the people give way to the headline: they slide down a
  // touch and dim once the document owns the frame
  const settle = interpolate(frame, [DOC, DOC + 16], [0, 1], {
    easing: theme.ease.inOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <SceneShell shake={stamp.shake * 0.5}>
      <BrandBar series={series} episode={episode} />

      <AbsoluteFill style={{ alignItems: "center", paddingTop: 330 }}>
        <Eyebrow delay={2}>Вашингтон · регулирование</Eyebrow>
        <div style={{ width: 960, marginTop: 18, minHeight: 190 }}>
          {frame >= HEAD && (
            <Kinetic text="МЕНЬШЕ НЕОПРЕДЕЛЁННОСТИ" delay={HEAD} per={5} size={60} align="center" mode="snap" style={{ justifyContent: "center" }} />
          )}
        </div>
      </AbsoluteFill>

      {/* the building and the people */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 560,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          opacity: 1 - settle * 0.45,
          transform: `translateY(${settle * 18}px) scale(${1 - settle * 0.04})`,
        }}
      >
        <WhiteHouse width={760} delay={HOUSE} />
        <div style={{ display: "flex", gap: 26, marginTop: -70 }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <Silhouette key={i} height={i === 2 ? 200 : 176} delay={PEOPLE + i * 5} />
          ))}
        </div>
      </div>

      {/* the document */}
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 1010 }}>
        <div style={{ position: "relative" }}>
          <Receipt width={680} printFrom={DOC} printFrames={30} title="H.R. · ДОКУМЕНТ" number="БЕЛЫЙ ДОМ" tilt={1.4}>
            <div
              style={{
                fontFamily: theme.fonts.wide,
                fontSize: 84,
                fontWeight: 900,
                letterSpacing: "-0.02em",
                lineHeight: 1,
                color: btcColors.ink,
              }}
            >
              CLARITY
            </div>
            <ReceiptRule />
            <ReceiptLine label="ACT · ПРАВИЛА ДЛЯ КРИПТЫ" size={24} delay={DOC + 16} />
          </Receipt>
          <div style={{ position: "absolute", right: -64, top: 150 }}>
            <Stamp delay={STAMP} tone="hero" size={54} rotate={-7}>
              ПРАВИЛА
            </Stamp>
          </div>
        </div>
        <div style={{ marginTop: 22 }}>
          <Chip delay={STAMP + 14} tone="neutral" size={24}>
            ЛИДЕРЫ КРИПТОИНДУСТРИИ · ТРАМП
          </Chip>
        </div>
      </AbsoluteFill>

      <Flash amount={stamp.pop * 0.6} />
    </SceneShell>
  );
};
