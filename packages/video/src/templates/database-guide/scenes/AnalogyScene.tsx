import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../../theme";
import { dbColors, dbPalette } from "../palette";
import { BigLine, Eyebrow, FooterBrand, SceneShell } from "../ui";

export const AnalogyScene: React.FC<{brandName: string}> = ({brandName}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return <SceneShell><AbsoluteFill style={{padding: "190px 82px"}}>
    <Eyebrow delay={0.05 * fps}>how it works</Eyebrow>
    <div style={{marginTop: 44}}><BigLine delay={0.14 * fps} size={98}>LIKE A SMART</BigLine><BigLine delay={0.28 * fps} size={98} color={dbPalette.primary}>TABLE</BigLine></div>
    <div style={{marginTop: 92, borderRadius: 32, border: `1px solid ${dbColors.line}`, overflow: "hidden", background: dbColors.surface}}>
      {["id · name · email", "42 · Alex · alex@vibe.dev", "43 · Max · max@ship.ai", "44 · Julia · julia@build.io"].map((row, i) => {const p = spring({frame: frame - (0.42 + i * 0.13) * fps, fps, config: theme.spring.smooth}); return <div key={row} style={{height: 122, padding: "0 34px", display: "flex", alignItems: "center", borderBottom: i < 3 ? `1px solid ${dbColors.line}` : "none", fontFamily: theme.fonts.mono, fontSize: i === 0 ? 26 : 31, fontWeight: i === 0 ? 700 : 500, color: i === 0 ? dbPalette.accent : dbPalette.text, opacity: p, translate: `${interpolate(p, [0, 1], [48, 0])}px 0px`, scale: interpolate(p, [0, 1], [0.98, 1])}}>{row}</div>;})}
    </div>
    <div style={{marginTop: 54, fontFamily: theme.fonts.body, fontSize: 42, lineHeight: 1.3, color: dbPalette.textDim}}>You ask: <span style={{color: dbPalette.text}}>&quot;get user 42&quot;</span><br/>The database finds one exact row.</div>
    <div style={{marginTop: 32, display: "inline-flex", padding: "18px 24px", borderRadius: 18, background: dbColors.surface, border: `1px solid ${dbColors.line}`, fontFamily: theme.fonts.mono, fontSize: 25, color: dbPalette.accent}}>SELECT * FROM users WHERE id = 42;</div>
    <FooterBrand brandName={brandName} />
  </AbsoluteFill></SceneShell>;
};
