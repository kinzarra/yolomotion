// YouTube thumbnails for dev-myth, three variants for Test & Compare.
// Thumbnail rules applied: the face big (a third of the frame) with a clear
// emotion, at most three words, one number, two colours of signal, readable
// at 168×94 in the mobile feed.
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { z } from "zod";
import { theme } from "../../theme";
import { defineTemplate } from "../types";
import { devMythColors as colors, devMythPalette as palette } from "./palette";

const WIDE = `${theme.fonts.wide}, ${theme.fonts.mono}`;
const I = "images/dev-myth/";

export const thumbSchema = z.object({ variant: z.enum(["confess", "price", "vs"]) });
type Props = z.infer<typeof thumbSchema>;

const Backdrop: React.FC<{ tint: string }> = ({ tint }) => (
  <>
    <AbsoluteFill style={{ background: palette.bg }} />
    <AbsoluteFill style={{ backgroundImage: `radial-gradient(circle, ${colors.lineStrong} 1.4px, transparent 1.8px)`, backgroundSize: "44px 44px", opacity: 0.5 }} />
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 72% 55%, ${tint}55 0%, transparent 55%)` }} />
  </>
);

/** The author, cut out, white sticker outline, lit from behind. */
const Face: React.FC<{ src: string; x: number; y: number; h: number; glow: string }> = ({ src, x, y, h, glow }) => (
  <Img src={staticFile(I + src)} style={{ position: "absolute", left: x, top: y, height: h, filter: `drop-shadow(10px 0 0 #fff) drop-shadow(-10px 0 0 #fff) drop-shadow(0 10px 0 #fff) drop-shadow(0 -10px 0 #fff) drop-shadow(0 0 60px ${glow})` }} />
);

const Word: React.FC<{ children: React.ReactNode; size: number; color: string; bg?: string; rotate?: number; style?: React.CSSProperties }> = ({ children, size, color, bg, rotate = 0, style }) => (
  <div style={{ display: "inline-block", fontFamily: WIDE, fontWeight: 900, fontSize: size, lineHeight: 0.95, letterSpacing: "-0.03em", color, background: bg, padding: bg ? `${size * 0.08}px ${size * 0.18}px` : undefined, transform: `rotate(${rotate}deg)`, textShadow: bg ? undefined : `0 8px 0 ${palette.bg}, 0 0 40px ${palette.bg}`, WebkitTextStroke: bg ? undefined : `4px ${palette.bg}`, paintOrder: "stroke fill", ...style }}>{children}</div>
);

export const Thumb: React.FC<Props> = ({ variant }) => {
  if (variant === "confess") {
    // A: the confession. A smirk, «МЫ ВАС ОБМАНЫВАЛИ», 20 лет в IT as the proof of who says it.
    return (
      <AbsoluteFill>
        <Backdrop tint={colors.bad} />
        <Face src="face-smirk.png" x={760} y={40} h={1500} glow={colors.badGlow} />
        <div style={{ position: "absolute", left: 70, top: 110, display: "flex", flexDirection: "column", gap: 22, alignItems: "flex-start" }}>
          <Word size={64} color={colors.ink2} bg={palette.primary} rotate={-2}>20 ЛЕТ В IT</Word>
          <Word size={160} color={palette.text}>МЫ ВАС</Word>
          <Word size={124} color={colors.white} bg={colors.bad} rotate={-3}>ОБМАНЫВАЛИ</Word>
        </div>
      </AbsoluteFill>
    );
  }
  if (variant === "price") {
    // B: the price. One number crossed, one number lit, a doubtful face.
    return (
      <AbsoluteFill>
        <Backdrop tint={palette.primary} />
        <Face src="face-doubt.png" x={860} y={40} h={1500} glow={palette.glow} />
        <div style={{ position: "absolute", left: 70, top: 120, display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-start" }}>
          <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 44, letterSpacing: "0.1em", color: palette.text }}>ПРОГРАММИСТ</div>
          <div style={{ position: "relative" }}>
            <Word size={150} color={colors.bad}>254 000 ₽</Word>
            <div style={{ position: "absolute", left: -10, right: -10, top: 70, height: 22, background: colors.bad, transform: "rotate(-6deg)", boxShadow: `0 0 30px ${colors.badGlow}` }} />
          </div>
          <div style={{ marginTop: 30, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 44, letterSpacing: "0.1em", color: palette.text }}>ИИ</div>
          <Word size={230} color={palette.primary} style={{ textShadow: `0 0 60px ${palette.glow}, 0 8px 0 ${palette.bg}` }}>100 $</Word>
        </div>
      </AbsoluteFill>
    );
  }
  // C: versus. The face between a developer and the machine, the two prices, VS.
  return (
    <AbsoluteFill>
      <Backdrop tint={palette.primary} />
      <AbsoluteFill style={{ background: `linear-gradient(100deg, ${colors.bad}66 0%, transparent 45%, transparent 55%, ${palette.primary}55 100%)` }} />
      <Img src={staticFile(I + "fig-dev.png")} style={{ position: "absolute", left: 30, top: 330, height: 760, filter: "brightness(1.4) drop-shadow(8px 0 0 #fff) drop-shadow(-8px 0 0 #fff) drop-shadow(0 8px 0 #fff) drop-shadow(0 -8px 0 #fff)" }} />
      <div style={{ position: "absolute", right: 70, top: 420, width: 360, height: 360, borderRadius: 64, background: "rgba(16,20,24,0.85)", border: `6px solid ${palette.primary}`, boxShadow: `0 0 80px ${palette.glow}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Img src={staticFile(I + "logos/claude.svg")} style={{ width: 230, height: 230 }} />
      </div>
      <Face src="face-doubt.png" x={430} y={170} h={1250} glow={palette.glow} />
      <div style={{ position: "absolute", left: 60, top: 70 }}><Word size={120} color={colors.bad}>254 000 ₽</Word></div>
      <div style={{ position: "absolute", right: 60, top: 60 }}><Word size={160} color={palette.primary}>100 $</Word></div>
      <div style={{ position: "absolute", left: 470, top: 780, width: 170, height: 170, borderRadius: 90, background: colors.white, color: colors.ink2, fontFamily: WIDE, fontWeight: 900, fontSize: 80, display: "flex", alignItems: "center", justifyContent: "center", transform: "rotate(-8deg)", boxShadow: `0 0 50px ${palette.bg}` }}>VS</div>
    </AbsoluteFill>
  );
};

export const devMythThumb = defineTemplate({
  id: "dev-myth-thumb",
  name: "Как разработчики обманывали нас · обложки",
  description: "Three YouTube thumbnails for dev-myth (confess / price / vs) for Test & Compare.",
  schema: thumbSchema,
  defaultProps: { variant: "confess" },
  durationInSeconds: 1,
  formats: ["landscape"],
  component: Thumb,
});
