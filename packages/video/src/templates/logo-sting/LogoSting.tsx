import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { theme } from "../../theme";
import { SceneLayers } from "../../components/Layers";
import { SceneExit, WordReveal, Entrance, useBreathe } from "../../components/Motion";
import { LogoStingProps } from "./schema";

// Radial spark mark: staggered rays around a core dot.
const Spark: React.FC<{ size: number; color: string; glow: string; delay: number }> = ({
  size,
  color,
  glow,
  delay,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rays = 12;
  const pop = spring({ frame: frame - delay, fps, config: theme.spring.bouncy });
  const rot = spring({ frame: frame - delay, fps, config: theme.spring.smooth });
  const breathe = useBreathe();
  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        transform: `scale(${pop * breathe}) rotate(${interpolate(rot, [0, 1], [-120, 0])}deg)`,
        filter: `drop-shadow(0 0 ${size * 0.25}px ${glow})`,
      }}
    >
      {Array.from({ length: rays }).map((_, i) => {
        const p = spring({
          frame: frame - delay - i * 1.2,
          fps,
          config: theme.spring.snappy,
        });
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: size * 0.085,
              height: size * 0.46 * p,
              background: color,
              borderRadius: size,
              transformOrigin: "50% 0%",
              transform: `translateX(-50%) rotate(${(360 / rays) * i}deg) translateY(${size * 0.07}px)`,
            }}
          />
        );
      })}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: size * 0.16,
          height: size * 0.16,
          borderRadius: "50%",
          background: theme.colors.text,
          transform: "translate(-50%, -50%)",
        }}
      />
    </div>
  );
};

export const LogoSting: React.FC<LogoStingProps> = ({
  brandName,
  tagline,
  primary,
  accent,
}) => {
  const { width, height } = useVideoConfig();
  const palette = {
    ...theme.colors,
    ...(primary ? { primary, glow: `${primary}66` } : null),
    ...(accent ? { accent } : null),
  };
  const portrait = height > width;
  const markSize = Math.min(width, height) * (portrait ? 0.3 : 0.26);
  const nameSize = Math.min(width, height) * 0.11;

  return (
    <SceneLayers palette={palette}>
      <SceneExit>
        <AbsoluteFill
          style={{
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: Math.round(markSize * 0.28),
            fontFamily: theme.fonts.display,
          }}
        >
          <Spark size={markSize} color={palette.primary} glow={palette.glow} delay={0} />
          <WordReveal
            text={brandName}
            delay={14}
            per={4}
            style={{
              justifyContent: "center",
              fontSize: nameSize,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: theme.colors.text,
            }}
          />
          <Entrance delay={28}>
            <div
              style={{
                fontFamily: theme.fonts.body,
                fontSize: nameSize * 0.32,
                fontWeight: 500,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: theme.colors.textDim,
              }}
            >
              {tagline}
            </div>
          </Entrance>
        </AbsoluteFill>
      </SceneExit>
    </SceneLayers>
  );
};
