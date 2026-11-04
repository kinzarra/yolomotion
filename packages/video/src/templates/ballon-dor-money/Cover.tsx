// YouTube Shorts cover for ВЫПУСК 22: frame 0 = variant A («3 000 € / 0 €»),
// frame 30 = variant B («КЕЙНУ 0 €»). Key type stays in the centre band so the
// channel-grid crop keeps it.
import React from "react";
import { AbsoluteFill, Img, useCurrentFrame } from "remotion";
import { z } from "zod";
import { Grain, Vignette } from "../../components/Layers";
import { theme } from "../../theme";
import { defineTemplate } from "../types";
import { bdColors as colors, bdPalette as palette } from "./palette";
import { DuoClip, GoldBall, Label, Numbers, Stamp, WIDE, media } from "./ui";

const Big: React.FC<{ children: React.ReactNode; size: number; color?: string }> = ({ children, size, color = palette.text }) => (
  <div style={{ fontFamily: WIDE, fontWeight: 900, fontSize: size, lineHeight: 0.98, letterSpacing: "-0.03em", whiteSpace: "nowrap", color, textShadow: `0 0 ${size * 0.3}px ${color === palette.primary ? palette.glow : "rgba(0,0,0,0.6)"}, 0 6px 30px ${palette.bg}` }}>{children}</div>
);

export const BallonDorMoneyCover: React.FC = () => {
  const frame = useCurrentFrame();
  const b = frame >= 30;
  return (
    <AbsoluteFill style={{ background: palette.bg, overflow: "hidden" }}>
      <DuoClip src="media/ballon-dor-money/gold.mp4" dim={0.35} startFrom={2} />
      <Numbers items={["3 000 €", "0 €", "£3 000", "600 000 €", "16 МЛН €", "85%"]} />
      {/* Kane behind the ball, right */}
      <div style={{ position: "absolute", left: 560, top: b ? 560 : 640, width: 470, zIndex: 3, filter: `drop-shadow(5px 0 0 ${colors.white}) drop-shadow(-5px 0 0 ${colors.white}) drop-shadow(0 -5px 0 ${colors.white}) drop-shadow(0 30px 40px rgba(0,0,0,0.7))`, transform: "rotate(4deg)" }}>
        <Img src={media("images/ballon-dor-money/kane.png")} style={{ width: "100%", display: "block" }} />
      </div>
      <GoldBall x={b ? 90 : 110} y={b ? 760 : 700} w={b ? 440 : 470} at={-60} z={5} />
      <div style={{ position: "absolute", left: 90, right: 90, top: 250, zIndex: 8, display: "flex", flexDirection: "column", gap: 14 }}>
        {b ? (
          <>
            <Label at={-60} size={34} tone="lime">ЗОЛОТОЙ МЯЧ 2026</Label>
            <Big size={150}>КЕЙНУ</Big>
            <Big size={190} color={colors.bad}>0 €</Big>
          </>
        ) : (
          <>
            <Big size={120}>ЗОЛОТОЙ</Big>
            <Big size={120}>МЯЧ</Big>
            <Big size={150} color={palette.primary}>3 000 €</Big>
          </>
        )}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1360, zIndex: 9, display: "flex", justifyContent: "center" }}>
        {b ? (
          <Stamp tone="hero" size={62} rotate={-5} delay={-60}>А ВОКРУГ МИЛЛИОНЫ</Stamp>
        ) : (
          <Stamp tone="bad" size={68} rotate={-5} delay={-60}>ПОБЕДИТЕЛЮ: 0 €</Stamp>
        )}
      </div>
      <div style={{ position: "absolute", left: 90, top: 1560, zIndex: 9, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 30, letterSpacing: "0.14em", color: palette.textDim }}>
        ДЕНЬГИ · ПРОСТО · ВЫПУСК 22
      </div>
      <Grain />
      <Vignette />
    </AbsoluteFill>
  );
};

export const ballonDorMoneyCover = defineTemplate({
  id: "ballon-dor-money-cover",
  name: "Экономика Золотого мяча: обложка",
  description: "YouTube Shorts cover, two variants: frame 0 and frame 30.",
  schema: z.object({}),
  defaultProps: {},
  durationInSeconds: 2,
  formats: ["reel"],
  component: BallonDorMoneyCover,
});
