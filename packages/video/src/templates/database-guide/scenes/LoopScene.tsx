import React from "react";
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {theme} from "../../../theme";
import {dbPalette} from "../palette";
import {BigLine, Eyebrow, FooterBrand, SceneShell} from "../ui";

export const LoopScene: React.FC<{brandName: string}> = ({brandName}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const reset = spring({frame: frame - 0.35 * fps, fps, config: theme.spring.bouncy});
  return <SceneShell><AbsoluteFill style={{padding: "300px 82px 190px", alignItems: "center", textAlign: "center"}}>
    <Eyebrow delay={0.05 * fps}>without a database</Eyebrow>
    <div style={{marginTop: 58}}>
      <BigLine delay={0.12 * fps} size={112}>YOUR APP</BigLine>
      <BigLine delay={0.25 * fps} size={112} color={dbPalette.primary}>FORGETS EVERYTHING.</BigLine>
    </div>
    <div style={{marginTop: 100, display: "flex", alignItems: "center", gap: 22, padding: "22px 32px", borderRadius: 22, border: `1px solid ${dbPalette.primary}`, background: "rgba(255,147,77,0.09)", opacity: reset, translate: `0px ${interpolate(reset, [0, 1], [38, 0])}px`, scale: interpolate(reset, [0, 1], [0.92, 1])}}>
      <div style={{width: 14, height: 14, borderRadius: 7, background: dbPalette.primary, boxShadow: `0 0 28px ${dbPalette.glow}`}} />
      <span style={{fontFamily: theme.fonts.mono, fontSize: 30, fontWeight: 800, color: dbPalette.text}}>MEMORY RESET TO ZERO</span>
    </div>
    <FooterBrand brandName={brandName} />
  </AbsoluteFill></SceneShell>;
};
