// Beat 5 — whose voice and whose face.
// The avatar picker is the evidence: the looks in it are the owner's own
// generated photo-avatars plus the digital twin, so «моё лицо» is literal.
// Then the claim the picker cannot show — the voice is a clone, not a stock
// narrator — as a waveform built from the reel's own hairlines.
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { theme } from "../../../theme";
import { ycColors, ycPalette } from "../palette";
import { Chip, Eyebrow, Kinetic, PhoneFrame, SceneShell, Screencast, Scrim, TopBar, shotFrames } from "../ui";

export const VoiceScene: React.FC = () => {
  const { durationInFrames, fps } = useVideoConfig();
  const shot = Math.min(shotFrames("05-voice", fps), durationInFrames - 50);

  return (
    <SceneShell>
      <Sequence durationInFrames={shot} layout="none">
        <PhoneFrame>
          <Screencast shot="05-voice" len={shot} focus={0.36} zoom={[1, 1.05]} />
        </PhoneFrame>
        <Scrim from="bottom" height={820} solid={0.55} />
        <TopBar>
          <Eyebrow delay={4}>Шаг 04 · ведущий</Eyebrow>
        </TopBar>
      </Sequence>

      <Sequence from={shot} layout="none">
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 46 }}>
          <Wave delay={0} />
          <div style={{ width: 900 }}>
            <Kinetic
              text="ВАШ ГОЛОС"
              delay={5}
              per={4}
              size={104}
              align="center"
              hero={[1]}
              style={{ justifyContent: "center" }}
            />
          </div>
          <Chip delay={18} tone="paper" size={30}>
            КЛОН · НЕ ДИКТОР
          </Chip>
        </AbsoluteFill>
      </Sequence>
    </SceneShell>
  );
};

/** 34 bars on one frame read — a per-bar hook would be illegal inside map(). */
const Wave: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
  const frame = useCurrentFrame();
  const bars = 34;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 9, height: 180 }}>
      {Array.from({ length: bars }, (_, i) => {
        const p = interpolate(frame, [delay + i * 0.55, delay + i * 0.55 + 7], [0, 1], {
          easing: theme.ease.out,
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        // A speech-shaped envelope: loud in the middle, breathing over time.
        const env = Math.sin((i / (bars - 1)) * Math.PI) ** 0.7;
        const live = 0.45 + 0.55 * Math.abs(Math.sin(frame / 7 + i * 0.9));
        const h = 18 + 150 * env * live;
        return (
          <div
            key={i}
            style={{
              width: 8,
              height: h * p,
              borderRadius: 4,
              background: i % 5 === 2 ? ycPalette.primary : ycColors.lineStrong,
              boxShadow: i % 5 === 2 ? `0 0 16px ${ycPalette.glow}` : undefined,
            }}
          />
        );
      })}
    </div>
  );
};
