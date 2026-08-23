// The five-layer stack: BgMesh (bottom) → assets → graphics → Grade → Grain + Vignette (top).
// Every scene renders inside <SceneLayers> so the stack is never skipped.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { theme, Palette } from "../theme";

export const BgMesh: React.FC<{ palette?: Palette }> = ({
  palette = theme.colors,
}) => {
  const frame = useCurrentFrame();
  const d1 = Math.sin(frame / 55) * 50;
  const d2 = Math.cos(frame / 70) * 40;
  return (
    <AbsoluteFill style={{ background: palette.bg }}>
      <div
        style={{
          position: "absolute",
          width: 1200,
          height: 1200,
          borderRadius: "50%",
          top: -450,
          left: -300 + d1,
          filter: "blur(50px)",
          background: `radial-gradient(circle, ${palette.primary}33, transparent 62%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 900,
          height: 900,
          borderRadius: "50%",
          bottom: -400,
          right: -250 - d2,
          filter: "blur(70px)",
          background: `radial-gradient(circle, ${palette.accent}22, transparent 65%)`,
        }}
      />
    </AbsoluteFill>
  );
};

export const Grade: React.FC<{ palette?: Palette; opacity?: number }> = ({
  palette = theme.colors,
  opacity = 0.18, // 0.10–0.15 light themes, 0.18–0.25 dark
}) => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <AbsoluteFill
      style={{
        backgroundColor: palette.primary,
        mixBlendMode: "soft-light",
        opacity,
      }}
    />
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(180deg, rgba(0,0,0,0.10), transparent 28%, transparent 72%, rgba(0,0,0,0.2))",
      }}
    />
  </AbsoluteFill>
);

export const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  const noise = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`;
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        backgroundImage: noise,
        backgroundSize: "220px",
        backgroundPosition: `${(frame * 7) % 220}px ${(frame * 13) % 220}px`,
        opacity: 0.05,
        mixBlendMode: "overlay",
      }}
    />
  );
};

export const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      background:
        "radial-gradient(ellipse at center, transparent 56%, rgba(0,0,0,0.22) 100%)",
    }}
  />
);

// Standard scene shell: background below children, grade/grain/vignette above.
export const SceneLayers: React.FC<{
  palette?: Palette;
  children: React.ReactNode;
}> = ({ palette = theme.colors, children }) => (
  <AbsoluteFill>
    <BgMesh palette={palette} />
    <AbsoluteFill>{children}</AbsoluteFill>
    <Grade palette={palette} />
    <Grain />
    <Vignette />
  </AbsoluteFill>
);
