import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../../theme";
import { yoColors, yoPalette } from "../palette";
import {
  Avatar,
  BrandBar,
  Counter,
  Eyebrow,
  Legend,
  Panel,
  Rise,
  SceneShell,
  Segment,
  StackedBar,
  useIn,
} from "../ui";

const SEGMENTS: Segment[] = [
  { label: "Wrong country", value: 61, color: yoColors.dim },
  { label: "Bots & inactive", value: 26, color: yoColors.bad },
  { label: "Actually your buyer", value: 13, color: yoPalette.primary },
];

// 3.5–9.0s — the creator looks enormous; the audience says otherwise.
export const CreatorScene: React.FC<{ handle: string; niche: string }> = ({
  handle,
  niche,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const chip = useIn(0.75 * fps, "bouncy");
  const verdict = useIn(3.6 * fps, "snappy");
  const float = Math.sin(frame / 34) * 5;

  return (
    <SceneShell>
      <BrandBar chapter="02 · THE CREATOR" />
      <AbsoluteFill style={{ padding: "340px 72px 150px" }}>
        <Panel delay={0} style={{ padding: "40px 44px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
            <div style={{ transform: `translateY(${float}px)` }}>
              <Avatar size={150} />
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  fontFamily: theme.fonts.display,
                  fontSize: 54,
                  fontWeight: 700,
                  letterSpacing: "-0.03em",
                  color: yoPalette.text,
                }}
              >
                {handle}
                <span
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    background: yoPalette.primary,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 21,
                    transform: `scale(${chip})`,
                  }}
                >
                  ✓
                </span>
              </div>
              <div
                style={{
                  marginTop: 10,
                  fontFamily: theme.fonts.mono,
                  fontSize: 27,
                  letterSpacing: "0.08em",
                  color: yoPalette.textDim,
                  textTransform: "uppercase",
                }}
              >
                {niche}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  fontFamily: theme.fonts.display,
                  fontSize: 92,
                  fontWeight: 700,
                  letterSpacing: "-0.05em",
                  lineHeight: 1,
                  color: yoPalette.text,
                }}
              >
                <Counter
                  to={1}
                  delay={0.2 * fps}
                  duration={0.7 * fps}
                  format={(v) => `${v.toFixed(1)}M`}
                />
              </div>
              <div
                style={{
                  marginTop: 8,
                  fontFamily: theme.fonts.mono,
                  fontSize: 24,
                  letterSpacing: "0.14em",
                  color: yoPalette.textDim,
                }}
              >
                FOLLOWERS
              </div>
            </div>
          </div>
        </Panel>

        <Rise delay={0.95 * fps} distance={22} style={{ marginTop: 34 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 16,
              padding: "16px 28px",
              borderRadius: 999,
              border: `1px solid ${yoColors.lineStrong}`,
              background: yoColors.surface,
              fontFamily: theme.fonts.mono,
              fontSize: 28,
              letterSpacing: "0.1em",
              color: yoPalette.text,
            }}
          >
            LOOKS LIKE A PERFECT PARTNER
          </div>
        </Rise>

        <Panel delay={1.6 * fps} style={{ marginTop: 56, padding: "44px 44px 48px" }}>
          <Eyebrow delay={1.9 * fps}>who actually follows</Eyebrow>
          <div style={{ marginTop: 34 }}>
            <StackedBar segments={SEGMENTS} delay={2.1 * fps} height={52} />
          </div>
          <div
            style={{
              marginTop: 40,
              display: "flex",
              flexDirection: "column",
              gap: 26,
            }}
          >
            {SEGMENTS.map((s, i) => (
              <Legend
                key={s.label}
                segment={s}
                delay={(2.5 + i * 0.24) * fps}
                hero={i === 2}
              />
            ))}
          </div>
        </Panel>

        <div
          style={{
            marginTop: 60,
            opacity: verdict,
            transform: `translateY(${interpolate(verdict, [0, 1], [34, 0])}px)`,
            fontFamily: theme.fonts.display,
            fontSize: 64,
            fontWeight: 700,
            letterSpacing: "-0.04em",
            lineHeight: 1.06,
            color: yoPalette.text,
          }}
        >
          1M REACHED.
          <br />
          <span style={{ color: yoColors.bad }}>130K WORTH REACHING.</span>
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};
