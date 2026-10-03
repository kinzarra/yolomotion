// Scene primitives for this reel. Keep them here rather than in the scenes
// so the visual language stays consistent across cuts.
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../theme";
import { dubaiEconomyPalette } from "./palette";

// Entrances animate opacity + translateY + scale together — never a lone fade.
export const Headline: React.FC<{
  children: React.ReactNode;
  delay?: number;
  size?: number;
}> = ({ children, delay = 0, size = 118 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: theme.spring.smooth });
  return (
    <div
      style={{
        fontFamily: theme.fonts.display,
        fontSize: size,
        fontWeight: 800,
        letterSpacing: "-0.035em",
        lineHeight: 0.95,
        color: dubaiEconomyPalette.text,
        textAlign: "center",
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [40, 0])}px) scale(${interpolate(
          p,
          [0, 1],
          [0.92, 1],
        )})`,
      }}
    >
      {children}
    </div>
  );
};
