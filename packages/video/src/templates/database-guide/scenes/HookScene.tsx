import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../../theme";
import { dbPalette } from "../palette";
import { BigLine, DatabaseGlyph, Eyebrow, FooterBrand, SceneShell } from "../ui";

export const HookScene: React.FC<{brandName: string}> = ({brandName}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return <SceneShell><AbsoluteFill style={{padding: "250px 82px 190px"}}>
    <Eyebrow delay={0.45 * fps}>guide for vibe coders</Eyebrow>
    <div style={{marginTop: 54}}><BigLine delay={-0.22 * fps}>YOUR APP</BigLine><BigLine delay={-0.08 * fps} color={dbPalette.primary}>FORGOT EVERYTHING.</BigLine></div>
    <div style={{position: "absolute", left: 382, top: 930, translate: `${Math.sin(frame / fps) * 8}px 0px`}}><DatabaseGlyph delay={0.48 * fps} size={330} /></div>
    <div style={{position: "absolute", left: 82, right: 82, top: 1350, fontFamily: theme.fonts.body, fontSize: 46, lineHeight: 1.25, color: dbPalette.textDim, opacity: interpolate(frame, [0.4 * fps, 0.72 * fps], [0, 1], {easing: theme.ease.out, extrapolateLeft: "clamp", extrapolateRight: "clamp"})}}>Users. Content. All gone.<br/><span style={{color: dbPalette.text}}>Your app needs a database.</span></div>
    <FooterBrand brandName={brandName} />
  </AbsoluteFill></SceneShell>;
};
