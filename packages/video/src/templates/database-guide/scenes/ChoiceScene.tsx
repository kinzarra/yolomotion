import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { theme } from "../../../theme";
import { dbPalette } from "../palette";
import { BigLine, Card, Eyebrow, FooterBrand, SceneShell } from "../ui";

const choices = [
  ["SQLite", "a local prototype", "small start"],
  ["Firebase", "fast and convenient", "custom data model"],
  ["Supabase", "PostgreSQL + ready backend", "our pick"],
];

export const ChoiceScene: React.FC<{brandName: string}> = ({brandName}) => {
  const {fps} = useVideoConfig();
  return <SceneShell><AbsoluteFill style={{padding: "170px 82px"}}>
    <Eyebrow delay={0.05 * fps}>what to choose</Eyebrow>
    <div style={{marginTop: 42}}><BigLine delay={0.14 * fps} size={96}>STOP SEARCHING FOR</BigLine><BigLine delay={0.28 * fps} size={96} color={dbPalette.primary}>THE PERFECT DATABASE</BigLine></div>
    <div style={{marginTop: 70, display: "flex", flexDirection: "column", gap: 22}}>{choices.map(([name, desc, badge], i) => <Card key={name} delay={(0.42 + i * 0.16) * fps} hero={i === 2}><div style={{display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24}}><div><div style={{fontFamily: theme.fonts.body, fontSize: 56, fontWeight: 800, color: i === 2 ? dbPalette.primary : dbPalette.text}}>{name}</div><div style={{fontFamily: theme.fonts.body, fontSize: 30, color: dbPalette.textDim, marginTop: 8}}>{desc}</div></div><div style={{padding: "12px 18px", borderRadius: 999, background: i === 2 ? dbPalette.primary : "rgba(87,230,192,0.1)", color: i === 2 ? "#241300" : dbPalette.accent, fontFamily: theme.fonts.mono, fontSize: 20, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap"}}>{badge}</div></div></Card>)}</div>
    <div style={{marginTop: 44, fontFamily: theme.fonts.body, fontSize: 38, lineHeight: 1.28, color: dbPalette.textDim}}>Supabase gives you <span style={{color: dbPalette.text}}>SQL, Auth, Storage and APIs.</span><br/>Build today. Scale tomorrow.</div>
    <FooterBrand brandName={brandName} />
  </AbsoluteFill></SceneShell>;
};
