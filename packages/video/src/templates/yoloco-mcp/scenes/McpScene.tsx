// 03 mcp — Claude on the left, Yoloco on the right, one protocol between
// them with traffic both ways. Around it, the artefacts the author asked for:
// a robot for the agent, marketing numbers, and creator selfies from the
// collage on tilted phone cards.
import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../../theme";
import { mcpColors, mcpPalette } from "../palette";
import {
  BrandBar,
  ClaudeTile,
  Cutout,
  Icon,
  IconName,
  Kinetic,
  Label,
  MonoChip,
  PhoneCard,
  SceneShell,
  TikTokCut,
  YolocoMark,
  cutZoom,
  useIn,
  useRamp,
} from "../ui";

const TILE = 210;
const ROW_Y = 580;
const LINK = { x1: 90 + TILE, x2: 1080 - 90 - TILE, y: ROW_Y + TILE / 2 };

const STATS: { icon: IconName; label: string; value: string; delay: number }[] = [
  { icon: "spark", label: "tools", value: "58", delay: 34 },
  { icon: "shield", label: "real audience", value: "91%", delay: 40 },
  { icon: "overlap", label: "shared", value: "23%", delay: 46 },
];

export const McpScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const left = useIn(4, "smooth");
  const right = useIn(8, "smooth");
  const link = useRamp(14, 40);
  const width = LINK.x2 - LINK.x1;
  const dots = Array.from({ length: 6 }, (_, i) => {
    const toYoloco = i % 2 === 0;
    const u = ((t * 0.7 + i / 6) % 1) * (toYoloco ? 1 : -1);
    return { x: LINK.x1 + ((u + 1) % 1) * width, toYoloco, i };
  });

  const inK = frame; // the incoming half of the TikTok cut opened in beat 02

  return (
    <SceneShell>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${cutZoom(inK, "in")})` }}>
      <BrandBar chapter="01 · MCP SERVER" />

      <div style={{ position: "absolute", left: 0, right: 0, top: 356 }}>
        <Kinetic text="MCP" size={150} weight={800} align="center" delay={8} />
      </div>
      {/* the agent, and a creator: the two ends of the story, flanking the word */}
      <div style={{ position: "absolute", left: 104, top: 330 }}>
        <Cutout src="footage/yoloco-mcp/cut-robot.png" height={168} delay={18} float={1.2} glow />
      </div>
      <div style={{ position: "absolute", left: 828, top: 300 }}>
        <PhoneCard src="footage/yoloco-mcp/creator-selfie-1.png" width={126} tilt={8} delay={24} ring />
      </div>

      <div
        style={{
          position: "absolute",
          left: 90,
          top: ROW_Y,
          opacity: left,
          transform: `translateX(${interpolate(left, [0, 1], [-90, 0])}px)`,
        }}
      >
        <ClaudeTile size={TILE} delay={4} />
      </div>
      <div
        style={{
          position: "absolute",
          left: LINK.x2,
          top: ROW_Y,
          opacity: right,
          transform: `translateX(${interpolate(right, [0, 1], [90, 0])}px)`,
        }}
      >
        <YolocoMark size={TILE} delay={8} />
      </div>
      <div
        style={{
          position: "absolute",
          left: LINK.x1 + 18,
          top: LINK.y - 2,
          width: width - 36,
          height: 4,
          borderRadius: 2,
          background: mcpColors.lineStrong,
          transform: `scaleX(${link})`,
        }}
      />
      {link >= 1 &&
        dots.map((d) => (
          <div
            key={d.i}
            style={{
              position: "absolute",
              left: d.x - 8,
              top: LINK.y - 8,
              width: 16,
              height: 16,
              borderRadius: "50%",
              background: d.toYoloco ? mcpColors.clay : mcpPalette.primary,
              boxShadow: `0 0 16px ${d.toYoloco ? mcpColors.clayGlow : mcpPalette.glow}`,
            }}
          />
        ))}
      <div style={{ position: "absolute", left: 0, right: 0, top: 812, display: "flex", justifyContent: "center", opacity: link }}>
        <MonoChip size={21} color={mcpPalette.textDim}>MODEL CONTEXT PROTOCOL</MonoChip>
      </div>

      {/* numbers under the link: what travels through it */}
      <div style={{ position: "absolute", left: 90, right: 90, top: 880, display: "flex", gap: 16, justifyContent: "center" }}>
        {STATS.map((s) => {
          const p = interpolate(frame, [s.delay, s.delay + 14], [0, 1], {
            easing: theme.ease.out,
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <div
              key={s.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "14px 22px 14px 16px",
                borderRadius: 22,
                background: mcpColors.surface,
                border: `1px solid ${mcpColors.line}`,
                opacity: p,
                transform: `translateY(${(1 - p) * 26}px) scale(${0.9 + p * 0.1})`,
              }}
            >
              <Icon name={s.icon} size={30} color={mcpPalette.accent} />
              <span style={{ fontFamily: theme.fonts.display, fontSize: 40, fontWeight: 700, color: mcpPalette.text, letterSpacing: "-0.03em" }}>
                {s.value}
              </span>
              <span style={{ fontFamily: theme.fonts.mono, fontSize: 19, color: mcpPalette.textDim, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                {s.label}
              </span>
            </div>
          );
        })}
      </div>

      <div style={{ position: "absolute", left: 70, right: 70, top: 1030 }}>
        <Kinetic text="YOLOCO MCP SERVER" size={96} weight={800} align="center" delay={Math.round(2.75 * fps)} per={4} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1272, display: "flex", justifyContent: "center" }}>
        <Label delay={Math.round(3.95 * fps)} color={mcpPalette.primary}>
          LIVE · APP.YOLOCO.IO/MCP
        </Label>
      </div>
      </div>
      <TikTokCut k={inK} phase="in" />
    </SceneShell>
  );
};
