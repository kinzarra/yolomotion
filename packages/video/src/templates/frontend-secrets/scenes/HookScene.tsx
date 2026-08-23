import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { theme } from "../../../theme";
import { secColors, secPalette } from "../palette";
import {
  BrandBar,
  Chip,
  Eyebrow,
  Slam,
  SceneShell,
  TypedCode,
  WindowCard,
  usePunch,
  useRamp,
} from "../ui";

const SLAM_AT = 70;

/** 0.0–3.9s — the key types into frontend code, then THIS IS NOT SECRET slams. */
export const HookScene: React.FC<{
  brandName: string;
  chapter: string;
  secretName: string;
  secretValue: string;
}> = ({ brandName, chapter, secretName, secretValue }) => {
  const frame = useCurrentFrame();
  const punch = usePunch(SLAM_AT, 20);
  // The editor built the frame; once the verdict slams in, it steps back.
  const dim = useRamp(SLAM_AT, SLAM_AT + 8, theme.ease.out);

  return (
    <SceneShell>
      <BrandBar brandName={brandName} chapter={chapter} />
      <AbsoluteFill
        style={{
          padding: "310px 82px 250px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          transform: `translate(${punch.shake}px, ${punch.shake * -0.4}px)`,
        }}
      >
        <Eyebrow delay={0}>security · lesson 01</Eyebrow>

        <div
          style={{
            marginTop: 46,
            opacity: 1 - dim * 0.72,
            filter: `blur(${dim * 3}px)`,
            transform: `scale(${1 - dim * 0.05})`,
          }}
        >
          <WindowCard title="App.tsx — frontend" delay={3} pad="30px 34px">
            <TypedCode
              lines={[
                "// bundled into the frontend",
                `const ${secretName} =`,
                `  "${secretValue}";`,
                "",
                "const ai = new OpenAI({",
                `  apiKey: ${secretName},`,
                "});",
              ]}
              delay={10}
              duration={44}
              size={44}
              heroLines={[1, 2]}
            />
          </WindowCard>
          <div style={{ marginTop: 36 }}>
            <Chip delay={50} tone="good">
              deployed → production
            </Chip>
          </div>
        </div>

        {/* The verdict — slams over the dimmed editor. */}
        <div
          style={{
            position: "absolute",
            left: 82,
            right: 82,
            top: 0,
            bottom: 120,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            gap: 10,
            transform: "rotate(-2deg)",
          }}
        >
          <Slam text="THIS IS" at={SLAM_AT} size={132} />
          <Slam text="NOT SECRET." at={SLAM_AT + 4} size={158} color={secColors.danger} />
        </div>
      </AbsoluteFill>

      {/* One red pulse on the slam — dies with the punch. */}
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background: `radial-gradient(circle at 50% 46%, ${secColors.dangerGlow}, transparent 62%)`,
          opacity: punch.energy * 0.4,
        }}
      />
      {/* Sub-second white flash frame right on impact. */}
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background: secPalette.text,
          opacity:
            frame >= SLAM_AT && frame < SLAM_AT + 2 ? 0.16 : 0,
        }}
      />
    </SceneShell>
  );
};
