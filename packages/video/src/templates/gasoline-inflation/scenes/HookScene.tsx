import React from "react";
import { Video } from "@remotion/media";
import { interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../../theme";
import { useIn, useRamp } from "../../../reel";
import { gasColors, gasPalette } from "../palette";
import { PRESENTER } from "../presenter";
import { VO_RATE } from "../timeline";
import { Flash, Glitch, SceneShell } from "../ui";

const SHOT = PRESENTER["p1-hook"];

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const faceFrames = Math.round((SHOT.duration / VO_RATE) * fps);
  const facePush = interpolate(frame, [0, faceFrames], [1, 1.07], {
    easing: theme.ease.inOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const tear = useRamp(durationInFrames - 13, durationInFrames - 1, theme.ease.in);
  const first = useIn(3, "snappy");
  const second = useIn(10, "smooth");
  const third = useIn(20, "snappy");

  return (
    <SceneShell>
      <Glitch amount={tear * 0.9} bands={8} style={{ position: "absolute", inset: 0 }}>
        <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
          {frame < faceFrames && (
            <Video
              src={staticFile(`presenter/gasoline-inflation/${SHOT.file}`)}
              muted
              playbackRate={VO_RATE}
              objectFit="cover"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                transform: `scale(${facePush})`,
                transformOrigin: "50% 30%",
              }}
            />
          )}
        </div>
      </Glitch>

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(180deg, ${gasPalette.bg}33 0%, transparent 26%, ${gasPalette.bg}E8 58%, ${gasPalette.bg} 100%)`,
        }}
      />
      <Glitch amount={tear} bands={7} style={{ position: "absolute", inset: 0 }}>
        <div
          style={{
            position: "absolute",
            left: 74,
            right: 74,
            top: 980,
            fontFamily: theme.fonts.wide,
            fontWeight: 900,
            lineHeight: 0.98,
            letterSpacing: "-0.045em",
            textTransform: "uppercase",
          }}
        >
          <div
            style={{
              color: gasPalette.text,
              fontSize: 88,
              opacity: first,
              transform: `translateX(${interpolate(first, [0, 1], [-80, 0])}px)`,
            }}
          >
            Не водишь?
          </div>
          <div
            style={{
              marginTop: 16,
              color: gasColors.bad,
              fontSize: 92,
              opacity: second,
              transform: `translateX(${interpolate(second, [0, 1], [100, 0])}px)`,
              filter: `drop-shadow(0 0 38px ${gasColors.badGlow})`,
            }}
          >
            Платишь за бензин
          </div>
          <div
            style={{
              display: "inline-block",
              marginTop: 20,
              padding: "12px 20px",
              color: gasColors.ink2,
              background: gasPalette.primary,
              fontSize: 70,
              opacity: third,
              transform: `scale(${interpolate(third, [0, 1], [1.5, 1])}) rotate(-1deg)`,
              boxShadow: `0 0 54px ${gasPalette.glow}`,
            }}
          >
            В цене хлеба
          </div>
        </div>
      </Glitch>
      <Flash amount={Math.max(0, (tear - 0.75) / 0.25)} color={gasPalette.text} />
    </SceneShell>
  );
};
