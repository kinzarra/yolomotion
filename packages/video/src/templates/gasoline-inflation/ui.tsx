import React from "react";
import { Video } from "@remotion/media";
import {
  CanvasImage,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { theme } from "../../theme";
import { useIn } from "../../reel";
import {
  BrandBar,
  Flash,
  Glitch,
  SceneShell,
} from "../digital-ruble/ui";
import { gasColors, gasPalette } from "./palette";

export { BrandBar, Flash, Glitch, SceneShell };

export const PhotoBg: React.FC<{
  src: string;
  dark?: number;
  scaleTo?: number;
  filter?: string;
}> = ({ src, dark = 0.48, scaleTo = 1.08, filter = "saturate(0.72) contrast(1.12)" }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const scale = interpolate(frame, [0, durationInFrames], [1.01, scaleTo], {
    easing: theme.ease.inOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${scale})` }}>
        <CanvasImage
          src={staticFile(`media/gasoline-inflation/${src}`)}
          width={1080}
          height={1920}
          fit="cover"
          style={{ position: "absolute", inset: 0, width: 1080, height: 1920, filter }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            `linear-gradient(180deg, ${gasPalette.bg}B8 0%, ${gasPalette.bg}${Math.round(dark * 255)
              .toString(16)
              .padStart(2, "0")} 40%, ${gasPalette.bg}F2 100%)`,
        }}
      />
    </>
  );
};

export const VideoBg: React.FC<{
  src: string;
  trimBefore?: number;
  dark?: number;
}> = ({ src, trimBefore = 0, dark = 0.34 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const scale = interpolate(frame, [0, durationInFrames], [1.03, 1.11], {
    easing: theme.ease.inOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${scale})` }}>
        <Video
          src={staticFile(`media/gasoline-inflation/${src}`)}
          muted
          trimBefore={trimBefore}
          objectFit="cover"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(180deg, ${gasPalette.bg}99 0%, ${gasPalette.bg}${Math.round(
            dark * 255,
          )
            .toString(16)
            .padStart(2, "0")} 38%, ${gasPalette.bg}F5 100%)`,
        }}
      />
    </>
  );
};

export const Brand: React.FC<{ series: string; episode: string }> = ({ series, episode }) => (
  <BrandBar series={series} episode={episode} delay={3} />
);

export const SceneTitle: React.FC<{
  children: React.ReactNode;
  top?: number;
  size?: number;
  color?: string;
  delay?: number;
  align?: "left" | "center";
}> = ({
  children,
  top = 296,
  size = 86,
  color = gasPalette.text,
  delay = 4,
  align = "left",
}) => {
  const p = useIn(delay, "smooth");
  return (
    <div
      style={{
        position: "absolute",
        left: 76,
        right: 76,
        top,
        fontFamily: theme.fonts.wide,
        fontSize: size,
        fontWeight: 900,
        lineHeight: 1.02,
        letterSpacing: "-0.045em",
        textTransform: "uppercase",
        color,
        textAlign: align,
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [48, 0])}px)`,
      }}
    >
      {children}
    </div>
  );
};

export const Pill: React.FC<{
  children: React.ReactNode;
  delay?: number;
  color?: string;
  filled?: boolean;
  style?: React.CSSProperties;
}> = ({ children, delay = 0, color = gasPalette.primary, filled = false, style }) => {
  const p = useIn(delay, "snappy");
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 74,
        padding: "14px 24px",
        border: `3px solid ${color}`,
        background: filled ? color : gasColors.surface,
        color: filled ? gasColors.ink2 : color,
        fontFamily: theme.fonts.wide,
        fontSize: 31,
        fontWeight: 800,
        lineHeight: 1.06,
        textTransform: "uppercase",
        opacity: p,
        transform: `scale(${interpolate(p, [0, 1], [0.72, 1])})`,
        boxShadow: filled ? `0 0 42px ${gasPalette.glow}` : gasColors.shadow,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const GlassCard: React.FC<{
  children: React.ReactNode;
  delay?: number;
  accent?: string;
  style?: React.CSSProperties;
}> = ({ children, delay = 0, accent = gasPalette.primary, style }) => {
  const p = useIn(delay, "smooth");
  return (
    <div
      style={{
        border: `2px solid ${gasColors.lineStrong}`,
        borderLeft: `10px solid ${accent}`,
        background: gasColors.surface,
        padding: "30px 34px",
        boxShadow: gasColors.shadow,
        opacity: p,
        transform: `translateX(${interpolate(p, [0, 1], [90, 0])}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const Arrow: React.FC<{ delay?: number; color?: string; vertical?: boolean }> = ({
  delay = 0,
  color = gasPalette.primary,
  vertical = false,
}) => {
  const p = useIn(delay, "snappy");
  return (
    <div
      style={{
        color,
        fontFamily: theme.fonts.wide,
        fontSize: 58,
        fontWeight: 900,
        lineHeight: 1,
        opacity: p,
        transform: `scale(${interpolate(p, [0, 1], [0.4, 1])})`,
      }}
    >
      {vertical ? "↓" : "→"}
    </div>
  );
};

export const TinySource: React.FC<{ children: React.ReactNode; top?: number }> = ({
  children,
  top = 1310,
}) => (
  <div
    style={{
      position: "absolute",
      left: 78,
      top,
      padding: "12px 18px",
      background: gasPalette.bg,
      border: `1px solid ${gasColors.lineStrong}`,
      color: gasPalette.textDim,
      fontFamily: theme.fonts.mono,
      fontSize: 22,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
    }}
  >
    {children}
  </div>
);
