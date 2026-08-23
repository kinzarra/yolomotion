import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../../theme";
import { yoColors, yoPalette } from "../palette";
import { Avatar, BrandBar, Eyebrow, SceneShell, useIn, useRamp } from "../ui";

const COL = 296;
const GAP = 52;

const Head: React.FC<{
  handle: string;
  tag: string;
  delay: number;
  win: boolean;
  reveal: number;
}> = ({ handle, tag, delay, win, reveal }) => {
  const p = useIn(delay, "smooth");
  const lift = win ? reveal : 0;
  return (
    <div
      style={{
        width: COL,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 14,
        opacity: p * (win ? 1 : 1 - reveal * 0.55),
        transform: `translateY(${interpolate(p, [0, 1], [40, 0]) - lift * 10}px) scale(${interpolate(p, [0, 1], [0.9, 1]) * (win ? 1 + lift * 0.06 : 1 - reveal * 0.06)})`,
        filter: win ? "none" : `saturate(${1 - reveal * 0.85})`,
      }}
    >
      <div
        style={{
          borderRadius: "50%",
          padding: 6,
          border: `3px solid ${win ? yoPalette.primary : yoColors.line}`,
          boxShadow: win ? `0 0 ${44 * lift}px ${yoPalette.glow}` : "none",
        }}
      >
        <Avatar size={104} muted={!win} />
      </div>
      <span
        style={{
          fontFamily: theme.fonts.display,
          fontSize: 38,
          fontWeight: 700,
          letterSpacing: "-0.03em",
          color: yoPalette.text,
        }}
      >
        {handle}
      </span>
      <span
        style={{
          fontFamily: theme.fonts.mono,
          fontSize: 23,
          letterSpacing: "0.1em",
          color: win ? yoPalette.primary : yoPalette.textDim,
        }}
      >
        {tag}
      </span>
    </div>
  );
};

const Row: React.FC<{
  label: string;
  left: string;
  right: string;
  delay: number;
  hero?: boolean;
  reveal: number;
}> = ({ label, left, right, delay, hero = false, reveal }) => {
  const p = useIn(delay, "snappy");
  const size = hero ? 74 : 54;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        paddingTop: hero ? 26 : 0,
        borderTop: hero ? `1px solid ${yoColors.lineStrong}` : undefined,
        marginTop: hero ? 12 : 0,
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [26, 0])}px)`,
      }}
    >
      <span
        style={{
          flex: 1,
          fontFamily: theme.fonts.mono,
          fontSize: 25,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: yoPalette.textDim,
        }}
      >
        {label}
      </span>
      <span
        style={{
          width: COL,
          textAlign: "center",
          fontFamily: theme.fonts.display,
          fontSize: size,
          fontWeight: 700,
          letterSpacing: "-0.04em",
          fontVariantNumeric: "tabular-nums",
          color: yoColors.dim,
          opacity: 1 - reveal * 0.35,
        }}
      >
        {left}
      </span>
      <span style={{ width: GAP }} />
      <span
        style={{
          width: COL,
          textAlign: "center",
          fontFamily: theme.fonts.display,
          fontSize: size,
          fontWeight: 700,
          letterSpacing: "-0.04em",
          fontVariantNumeric: "tabular-nums",
          color: hero ? yoPalette.primary : yoPalette.text,
          textShadow: hero ? `0 0 ${46 * reveal}px ${yoPalette.glow}` : undefined,
        }}
      >
        {right}
      </span>
    </div>
  );
};

// 17.5–22.0s — the small creator out-earns the big one, row by row.
export const VersusScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const reveal = useRamp(2.9 * fps, 3.5 * fps, theme.ease.out);
  const vs = useIn(0.5 * fps, "bouncy");
  const verdict = useIn(3.1 * fps, "bouncy");

  return (
    <SceneShell>
      <BrandBar chapter="05 · THE MATH" />
      <AbsoluteFill style={{ padding: "400px 72px 170px" }}>
        <Eyebrow delay={0}>same budget · same niche</Eyebrow>

        <div
          style={{
            marginTop: 40,
            display: "flex",
            alignItems: "flex-end",
            position: "relative",
          }}
        >
          <div style={{ flex: 1 }} />
          <Head
            handle="@maxvisuals"
            tag="MASSIVE"
            delay={0.16 * fps}
            win={false}
            reveal={reveal}
          />
          <div style={{ width: GAP }} />
          <Head
            handle="@lenanotes"
            tag="RIGHT AUDIENCE"
            delay={0.32 * fps}
            win
            reveal={reveal}
          />
          <div
            style={{
              position: "absolute",
              left: 576,
              bottom: 96,
              width: 76,
              height: 76,
              borderRadius: "50%",
              background: yoColors.surfaceLift,
              border: `1px solid ${yoColors.lineStrong}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: theme.fonts.display,
              fontSize: 32,
              fontWeight: 700,
              color: yoPalette.text,
              opacity: vs,
              transform: `scale(${vs}) rotate(${interpolate(vs, [0, 1], [-90, 0])}deg)`,
            }}
          >
            VS
          </div>
        </div>

        <div
          style={{
            marginTop: 66,
            display: "flex",
            flexDirection: "column",
            gap: 30,
          }}
        >
          <Row
            label="Followers"
            left="1,000,000"
            right="120,000"
            delay={0.9 * fps}
            reveal={reveal}
          />
          <Row
            label="Audience fit"
            left="9%"
            right="87%"
            delay={1.5 * fps}
            reveal={reveal}
          />
          <Row
            label="Engagement"
            left="0.9%"
            right="4.8%"
            delay={2.1 * fps}
            reveal={reveal}
          />
          <Row
            label="Buyers reached"
            left="810"
            right="5,011"
            delay={2.7 * fps}
            hero
            reveal={reveal}
          />
        </div>

        <div
          style={{
            marginTop: 62,
            alignSelf: "flex-end",
            padding: "18px 32px",
            marginRight: 8,
            borderRadius: 999,
            background: yoPalette.primary,
            opacity: verdict,
            transform: `translateY(${interpolate(verdict, [0, 1], [30, 0])}px) scale(${interpolate(verdict, [0, 1], [1.25, 1 + Math.sin(frame / 12) * 0.012])})`,
            fontFamily: theme.fonts.display,
            fontSize: 50,
            fontWeight: 700,
            letterSpacing: "-0.03em",
            color: yoPalette.text,
          }}
        >
          6.2× MORE BUYERS
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};
