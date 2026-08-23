import React from "react";
import {
  AbsoluteFill,
  interpolate,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { theme } from "../../../theme";
import { aiColors, aiPalette } from "../palette";
import { Her, HerVariant } from "../her";
import { BrandBar, Chip, SceneShell, useIn } from "../ui";

// 4.5–10s — the same face flips through fashion / beauty / fitness / travel
// every ~1.1s (a white shutter flash on each switch), while 24/7 / FULL
// CONTROL / UNLIMITED CONTENT stamp themselves around her in VO order.
const SEGMENTS: { at: number; variant: HerVariant; label: string }[] = [
  { at: 0, variant: "base", label: "AI MODEL" },
  { at: 21, variant: "fashion", label: "FASHION" },
  { at: 54, variant: "beauty", label: "BEAUTY" },
  { at: 87, variant: "fitness", label: "FITNESS" },
  { at: 120, variant: "travel", label: "TRAVEL" },
];

export const MorphScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const seg = [...SEGMENTS].reverse().find((s) => frame >= s.at) ?? SEGMENTS[0];
  const sinceSwitch = frame - seg.at;
  const accessoryIn = spring({ frame: sinceSwitch, fps, config: theme.spring.bouncy });
  // Camera-shutter flash + sideways kick on every switch.
  const flash =
    seg.at === 0
      ? 0
      : interpolate(sinceSwitch, [0, 2, 6], [0.85, 0.5, 0], {
          easing: theme.ease.out,
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
  const kick =
    seg.at === 0
      ? 0
      : interpolate(sinceSwitch, [0, 7], [(random(`kick-${seg.at}`) - 0.5) * 60, 0], {
          easing: theme.ease.out,
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

  const enter = useIn(0, "smooth");
  const breathe = 1 + Math.sin(frame / 22) * 0.012;

  return (
    <SceneShell>
      <BrandBar chapter="02 · THE MACHINE" />

      {/* niche readout + progress dots */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 330,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 22,
          opacity: enter,
        }}
      >
        <div
          key={seg.label}
          style={{
            fontFamily: theme.fonts.mono,
            fontSize: 34,
            fontWeight: 700,
            letterSpacing: "0.22em",
            color: aiPalette.text,
            transform: `translateX(${kick}px) scale(${0.9 + accessoryIn * 0.1})`,
            opacity: accessoryIn,
          }}
        >
          {seg.label}
        </div>
        <div style={{ display: "flex", gap: 14 }}>
          {SEGMENTS.slice(1).map((s) => (
            <span
              key={s.at}
              style={{
                width: 14,
                height: 14,
                borderRadius: "50%",
                background: seg.at >= s.at ? aiPalette.text : aiColors.surfaceLift,
                border: `1px solid ${aiColors.lineStrong}`,
              }}
            />
          ))}
        </div>
      </div>

      <AbsoluteFill style={{ alignItems: "center" }}>
        <div
          style={{
            marginTop: 480,
            opacity: enter,
            transform: `translateX(${kick}px) scale(${interpolate(enter, [0, 1], [0.92, breathe])})`,
          }}
        >
          <Her width={560} variant={seg.variant} accessoryIn={accessoryIn} />
        </div>
      </AbsoluteFill>

      {/* the three stamps, in voiceover order */}
      <div style={{ position: "absolute", left: 84, top: 620, transform: "rotate(-6deg)" }}>
        <Chip delay={74} red size={36}>
          UNLIMITED CONTENT
        </Chip>
      </div>
      <div style={{ position: "absolute", right: 84, top: 900, transform: "rotate(4deg)" }}>
        <Chip delay={104} size={40}>
          24/7
        </Chip>
      </div>
      <div style={{ position: "absolute", left: 110, top: 1180, transform: "rotate(-3deg)" }}>
        <Chip delay={132} size={36}>
          FULL CONTROL
        </Chip>
      </div>

      {/* shutter flash */}
      <AbsoluteFill
        style={{ background: aiColors.white, opacity: flash * 0.24, pointerEvents: "none" }}
      />
    </SceneShell>
  );
};
