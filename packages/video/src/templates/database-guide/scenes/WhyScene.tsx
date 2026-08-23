import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { theme } from "../../../theme";
import { dbPalette } from "../palette";
import { BigLine, Card, Eyebrow, FooterBrand, SceneShell } from "../ui";

const items = [
  ["Users", "who signed in and what they can access"],
  ["Content", "posts, products, projects, messages"],
  ["State", "what changed a minute ago"],
];

export const WhyScene: React.FC<{brandName: string}> = ({brandName}) => {
  const {fps} = useVideoConfig();
  return <SceneShell><AbsoluteFill style={{padding: "190px 82px"}}>
    <Eyebrow delay={0.05 * fps}>why you need it</Eyebrow>
    <div style={{marginTop: 44}}><BigLine delay={0.14 * fps} size={102}>A DATABASE KEEPS</BigLine><BigLine delay={0.28 * fps} size={102} color={dbPalette.primary}>WHAT MATTERS</BigLine></div>
    <div style={{marginTop: 78, display: "flex", flexDirection: "column", gap: 24}}>{items.map(([title, body], i) => <Card key={title} delay={(0.4 + i * 0.14) * fps}><div style={{display: "flex", alignItems: "center", gap: 28}}><div style={{width: 68, height: 68, borderRadius: 22, background: i === 0 ? dbPalette.primary : "rgba(87,230,192,0.13)", color: i === 0 ? "#241300" : dbPalette.accent, display: "grid", placeItems: "center", fontFamily: theme.fonts.mono, fontSize: 28, fontWeight: 800}}>0{i + 1}</div><div><div style={{fontFamily: theme.fonts.body, fontSize: 48, fontWeight: 750, color: dbPalette.text}}>{title}</div><div style={{fontFamily: theme.fonts.body, fontSize: 30, color: dbPalette.textDim, marginTop: 6}}>{body}</div></div></div></Card>)}</div>
    <FooterBrand brandName={brandName} />
  </AbsoluteFill></SceneShell>;
};
