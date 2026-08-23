import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../../theme";
import { dbPalette } from "../palette";
import { BigLine, DatabaseGlyph, Eyebrow, FooterBrand, SceneShell } from "../ui";

export const CtaScene: React.FC<{brandName: string; cta: string}> = ({brandName, cta}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: frame - 1.45 * fps, fps, config: theme.spring.bouncy});
  return <SceneShell><AbsoluteFill style={{padding: "250px 82px 190px", alignItems: "center", textAlign: "center"}}>
    <Eyebrow delay={0.05 * fps}>in short</Eyebrow>
    <div style={{marginTop: 50}}><BigLine delay={0.14 * fps} size={106}>A DATABASE IS</BigLine><BigLine delay={0.28 * fps} size={106} color={dbPalette.primary}>PRODUCT MEMORY</BigLine></div>
    <div style={{marginTop: 86}}><DatabaseGlyph delay={0.46 * fps} size={360} /></div>
    <div style={{marginTop: 80, padding: "24px 42px", borderRadius: 999, background: dbPalette.primary, color: "#241300", boxShadow: `0 20px 80px -18px ${dbPalette.glow}`, fontFamily: theme.fonts.body, fontSize: 39, fontWeight: 800, letterSpacing: "-0.025em", opacity: p, scale: p}}>{cta}</div>
    <div style={{marginTop: 42, fontFamily: theme.fonts.body, fontSize: 32, color: dbPalette.textDim}}>Save this so you never have to explain it again.</div>
    <FooterBrand brandName={brandName} />
  </AbsoluteFill></SceneShell>;
};
