import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../../theme";
import { ksPalette } from "../palette";
import { Kinetic, Mono, SceneShell, Strike, YolocoMark, YolocoWordmark, useIn, useRamp } from "../ui";

// 53.5–59s. Black. BIG in grey, struck through on "right", RIGHT in bone under
// it; then both lift away for the mark, the line and the URL. One second of
// hold. The photo credit sits at the foot of the page — CC BY requires it.
const BIG_AT = 14;
const STRIKE_AT = 74;
const RIGHT_AT = 82;
const CLEAR_AT = 104;
const BRAND_AT = 112; // the mark lands as "Yoloco." is spoken

export const YolocoScene: React.FC<{ ctaLabel: string; url: string; credit: string }> = ({
  ctaLabel,
  url,
  credit,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const strike = useRamp(STRIKE_AT, STRIKE_AT + 12, theme.ease.out);
  const clear = useRamp(CLEAR_AT, CLEAR_AT + 8, theme.ease.in);
  const urlIn = useIn(BRAND_AT + 22, "smooth");
  const creditIn = useIn(BRAND_AT + 8, "smooth");
  const breathe = Math.sin((frame / fps) * 1.8) * 2;

  return (
    <SceneShell exit={false}>
      <AbsoluteFill style={{ opacity: 1 - clear, transform: `translateY(${clear * -40}px)` }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 640, display: "flex", justifyContent: "center" }}>
          <div style={{ position: "relative" }}>
            <Kinetic text="BIG" delay={BIG_AT} size={220} color={ksPalette.textDim} />
            <Strike progress={strike} thickness={10} tilt={-4} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 880, display: "flex", justifyContent: "center" }}>
          <Kinetic text="RIGHT" delay={RIGHT_AT} size={220} />
        </div>
      </AbsoluteFill>

      {frame >= BRAND_AT - 2 && (
        <div
          style={{
            position: "absolute",
            left: 72,
            right: 72,
            top: 720,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 44,
            transform: `translateY(${breathe}px)`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <YolocoMark size={92} delay={BRAND_AT} />
            <YolocoWordmark size={84} delay={BRAND_AT + 5} />
          </div>
          <Kinetic text={ctaLabel} delay={BRAND_AT + 12} per={4} size={62} />
          <Mono
            size={26}
            color={ksPalette.text}
            style={{
              letterSpacing: "0.08em",
              textTransform: "none",
              opacity: urlIn,
              transform: `translateY(${interpolate(urlIn, [0, 1], [14, 0])}px)`,
            }}
          >
            {url}
          </Mono>
        </div>
      )}

      {/* attribution, not decoration */}
      <div
        style={{
          position: "absolute",
          left: 72,
          right: 72,
          top: 1600,
          textAlign: "center",
          fontFamily: theme.fonts.mono,
          fontSize: 17,
          letterSpacing: "0.03em",
          whiteSpace: "nowrap",
          color: ksPalette.textDim,
          opacity: creditIn * 0.7,
        }}
      >
        {credit}
      </div>
    </SceneShell>
  );
};
