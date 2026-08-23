// Scene 4 — logo sting: cloud pops in, bolt strikes after, letter-staggered
// wordmark, tagline. The glowing bolt is the hero element.
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { theme } from "../../../theme";
import { vibe } from "../palette";
import { Entrance, useBreathe } from "../../../components/Motion";
import { ExitWrap } from "../ui";
import {
  BOLT_PATH,
  BOLT_TRANSFORM,
  CLOUD_PATH,
  CLOUD_TRANSFORM,
} from "../logoPaths";

const VIEWBOX = "-24 -26 368 368";

export const LogoScene: React.FC<{
  len: number;
  brandName: string;
  tagline: string;
  url: string;
}> = ({ len, brandName, tagline, url }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const breathe = useBreathe();

  const cloudIn = spring({ frame: frame - 4, fps, config: theme.spring.bouncy });
  const boltIn = spring({ frame: frame - 14, fps, config: theme.spring.snappy });
  const size = 360;

  return (
    <ExitWrap len={len}>
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 46,
        }}
      >
        <div
          style={{
            position: "relative",
            width: size,
            height: size,
            transform: `scale(${breathe})`,
          }}
        >
          <svg
            viewBox={VIEWBOX}
            style={{
              position: "absolute",
              inset: 0,
              transform: `scale(${cloudIn}) rotate(${interpolate(cloudIn, [0, 1], [-14, 0])}deg)`,
              opacity: cloudIn,
            }}
          >
            <g fill="#3E7CB0" transform={CLOUD_TRANSFORM}>
              <path d={CLOUD_PATH} />
            </g>
          </svg>
          <svg
            viewBox={VIEWBOX}
            style={{
              position: "absolute",
              inset: 0,
              transform: `scale(${boltIn})`,
              opacity: boltIn,
              filter: `drop-shadow(0 0 30px ${vibe.glow})`,
            }}
          >
            <g fill={vibe.primary} transform={BOLT_TRANSFORM}>
              <path d={BOLT_PATH} />
            </g>
          </svg>
        </div>

        <div
          style={{
            display: "flex",
            fontFamily: theme.fonts.display,
            fontSize: 118,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: vibe.text,
          }}
        >
          {brandName.split("").map((ch, i) => {
            const p = spring({
              frame: frame - 20 - i * 2,
              fps,
              config: theme.spring.snappy,
            });
            return (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  opacity: p,
                  transform: `translateY(${interpolate(p, [0, 1], [36, 0])}px)`,
                }}
              >
                {ch}
              </span>
            );
          })}
        </div>

        <Entrance delay={42}>
          <div
            style={{
              fontFamily: theme.fonts.display,
              fontSize: 40,
              fontWeight: 500,
              letterSpacing: "0.06em",
              color: vibe.textDim,
            }}
          >
            {tagline}
          </div>
        </Entrance>
        <Entrance delay={56}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "14px 34px",
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.14)",
              background: "rgba(255,255,255,0.05)",
              fontFamily: theme.fonts.mono,
              fontSize: 29,
              fontWeight: 700,
              color: vibe.text,
            }}
          >
            <span
              style={{
                width: 11,
                height: 11,
                borderRadius: 6,
                background: vibe.primary,
              }}
            />
            {url}
          </div>
        </Entrance>
      </AbsoluteFill>
    </ExitWrap>
  );
};
