import React from "react";
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../theme";
import { dbColors, dbPalette } from "./palette";

export const SceneShell: React.FC<{children: React.ReactNode}> = ({children}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  return (
    <div style={{position: "absolute", inset: 0, overflow: "hidden"}}>
      <div style={{position: "absolute", inset: 0, opacity: 0.24, backgroundImage: `linear-gradient(${dbColors.line} 1px, transparent 1px), linear-gradient(90deg, ${dbColors.line} 1px, transparent 1px)`, backgroundSize: "72px 72px", translate: `${Math.sin(frame / fps) * 5}px ${Math.cos(frame / fps) * 5}px`}} />
      <div style={{position: "absolute", width: 780, height: 780, borderRadius: "50%", left: -420, top: 180, background: `radial-gradient(circle, ${dbPalette.primary}38, transparent 68%)`, filter: "blur(26px)", translate: `0px ${Math.sin(frame / fps) * 24}px`}} />
      <div style={{position: "absolute", width: 720, height: 720, borderRadius: "50%", right: -360, bottom: 100, background: `radial-gradient(circle, ${dbPalette.accent}26, transparent 68%)`, filter: "blur(34px)", translate: `0px ${Math.cos(frame / fps) * 22}px`}} />
      <div style={{position: "absolute", inset: 0, opacity: interpolate(frame, [durationInFrames - 0.34 * fps, durationInFrames - 0.04 * fps], [1, 0], {easing: theme.ease.in, extrapolateLeft: "clamp", extrapolateRight: "clamp"}), translate: interpolate(frame, [durationInFrames - 0.34 * fps, durationInFrames - 0.04 * fps], ["0px 0px", "0px -42px"], {easing: theme.ease.in, extrapolateLeft: "clamp", extrapolateRight: "clamp"})}}>{children}</div>
    </div>
  );
};

export const Eyebrow: React.FC<{children: React.ReactNode; delay?: number}> = ({children, delay = 0}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: frame - delay, fps, config: theme.spring.snappy});
  return <div style={{display: "inline-flex", alignItems: "center", gap: 14, opacity: p, translate: `0px ${interpolate(p, [0, 1], [24, 0])}px`, scale: interpolate(p, [0, 1], [0.94, 1]), fontFamily: theme.fonts.mono, color: dbPalette.accent, fontSize: 28, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase"}}><span style={{width: 12, height: 12, borderRadius: 6, background: dbPalette.accent}} />{children}</div>;
};

export const BigLine: React.FC<{children: React.ReactNode; delay?: number; color?: string; size?: number}> = ({children, delay = 0, color = dbPalette.text, size = 108}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: frame - delay, fps, config: theme.spring.smooth});
  return <div style={{fontFamily: theme.fonts.body, fontSize: size, lineHeight: 0.98, letterSpacing: "-0.055em", fontWeight: 800, color, opacity: p, translate: `0px ${interpolate(p, [0, 1], [52, 0])}px`, scale: interpolate(p, [0, 1], [0.94, 1])}}>{children}</div>;
};

export const Card: React.FC<{children: React.ReactNode; delay: number; hero?: boolean}> = ({children, delay, hero = false}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: frame - delay, fps, config: theme.spring.smooth});
  return <div style={{padding: "34px 36px", borderRadius: 30, border: `1px solid ${hero ? dbPalette.primary : dbColors.line}`, background: hero ? "rgba(255,147,77,0.09)" : dbColors.surface, boxShadow: hero ? `0 22px 70px -32px ${dbPalette.glow}` : "0 28px 80px -50px rgba(0,0,0,0.9)", opacity: p, translate: `0px ${interpolate(p, [0, 1], [46, 0])}px`, scale: interpolate(p, [0, 1], [0.94, 1])}}>{children}</div>;
};

export const DatabaseGlyph: React.FC<{delay?: number; size?: number}> = ({delay = 0, size = 310}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: frame - delay, fps, config: theme.spring.bouncy});
  const breathe = 1 + Math.sin(frame / fps * 2) * 0.015;
  return <div style={{position: "relative", width: size, height: size, opacity: p, scale: interpolate(p, [0, 1], [0.72, breathe]), rotate: interpolate(p, [0, 1], ["-12deg", "0deg"])}}>
    {[0, 1, 2].map((i) => <div key={i} style={{position: "absolute", left: size * 0.1, top: size * (0.18 + i * 0.21), width: size * 0.8, height: size * 0.33, borderRadius: "50%", border: `${Math.max(8, size * 0.035)}px solid ${i === 0 ? dbPalette.primary : dbColors.blue}`, background: dbColors.surfaceStrong, boxShadow: i === 0 ? `0 0 52px ${dbPalette.glow}` : "none"}} />)}
  </div>;
};

export const FooterBrand: React.FC<{brandName: string}> = ({brandName}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  return <div style={{position: "absolute", left: 82, right: 82, bottom: 82, display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: theme.fonts.mono, color: dbPalette.textDim, fontSize: 24, letterSpacing: "0.08em"}}>
    <div style={{display: "flex", alignItems: "center", gap: 14}}>
      <div style={{width: 48, height: 48, overflow: "hidden", borderRadius: 12, scale: interpolate(frame, [0, durationInFrames], [1, 1.06], {easing: theme.ease.inOut, extrapolateLeft: "clamp", extrapolateRight: "clamp"})}}>
        <Img src={staticFile("images/vibe-cloud-logo.png")} style={{width: "100%", height: "100%", objectFit: "cover", mixBlendMode: "multiply"}} />
      </div>
      <span>{brandName}</span>
    </div>
    <span>DATABASE GUIDE · 01</span>
  </div>;
};
