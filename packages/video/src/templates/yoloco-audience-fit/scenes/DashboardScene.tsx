import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../../theme";
import { yoColors, yoPalette } from "../palette";
import {
  Avatar,
  BrandBar,
  Dial,
  Kinetic,
  Panel,
  SceneShell,
  useIn,
  useRamp,
} from "../ui";

const ROWS = [
  { handle: "@lenanotes", reach: "120K", score: 94 },
  { handle: "@studioamé", reach: "84K", score: 88 },
  { handle: "@maxvisuals", reach: "1.0M", score: 21 },
];

const Chip: React.FC<{ label: string; delay: number; on?: boolean }> = ({
  label,
  delay,
  on = false,
}) => {
  const p = useIn(delay, "snappy");
  return (
    <span
      style={{
        padding: "10px 20px",
        borderRadius: 999,
        border: `1px solid ${on ? yoPalette.primary : yoColors.line}`,
        background: on ? yoColors.tintStrong : yoColors.surfaceStrong,
        fontFamily: theme.fonts.mono,
        fontSize: 23,
        letterSpacing: "0.06em",
        color: on ? yoPalette.text : yoPalette.textDim,
        opacity: p,
        transform: `scale(${interpolate(p, [0, 1], [0.8, 1])})`,
      }}
    >
      {label}
    </span>
  );
};

const CreatorRow: React.FC<{
  row: (typeof ROWS)[number];
  index: number;
  delay: number;
}> = ({ row, index, delay }) => {
  const p = useIn(delay, "snappy");
  const fill = useRamp(delay + 4, delay + 22, theme.ease.out);
  const top = index === 0;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 22,
        padding: "18px 22px",
        borderRadius: 22,
        background: top ? yoColors.tintStrong : "transparent",
        border: `1px solid ${top ? yoPalette.primary : "transparent"}`,
        opacity: p,
        transform: `translateX(${interpolate(p, [0, 1], [-38, 0])}px)`,
      }}
    >
      <span
        style={{
          width: 34,
          fontFamily: theme.fonts.mono,
          fontSize: 26,
          color: top ? yoPalette.primary : yoPalette.textDim,
        }}
      >
        {index + 1}
      </span>
      <Avatar size={56} muted={row.score < 50} />
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontFamily: theme.fonts.body,
            fontSize: 32,
            fontWeight: 600,
            color: yoPalette.text,
          }}
        >
          {row.handle}
        </div>
        <div
          style={{
            fontFamily: theme.fonts.mono,
            fontSize: 22,
            color: yoPalette.textDim,
          }}
        >
          {row.reach} followers
        </div>
      </div>
      <div style={{ width: 210 }}>
        <div
          style={{
            height: 12,
            borderRadius: 12,
            background: yoColors.surfaceLift,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${row.score * fill}%`,
              height: "100%",
              borderRadius: 12,
              background: row.score < 50 ? yoColors.bad : yoPalette.primary,
            }}
          />
        </div>
      </div>
      <span
        style={{
          width: 74,
          textAlign: "right",
          fontFamily: theme.fonts.mono,
          fontSize: 34,
          fontWeight: 700,
          fontVariantNumeric: "tabular-nums",
          color: row.score < 50 ? yoColors.bad : yoPalette.text,
        }}
      >
        {Math.round(row.score * fill)}
      </span>
    </div>
  );
};

// 22.0–26.0s — the product, doing exactly what the video just argued for.
export const DashboardScene: React.FC = () => {
  const { fps } = useVideoConfig();
  const win = useIn(0, "smooth");
  const swap = useRamp(1.75 * fps, 1.95 * fps, theme.ease.out);

  return (
    <SceneShell>
      <BrandBar chapter="06 · THE PLATFORM" />
      <AbsoluteFill style={{ padding: "360px 62px 190px" }}>
        <Panel delay={0} style={{ padding: 0, overflow: "hidden" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: "22px 26px",
              borderBottom: `1px solid ${yoColors.line}`,
              background: yoColors.surfaceStrong,
            }}
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  background: yoColors.lineStrong,
                  opacity: win,
                }}
              />
            ))}
            <span
              style={{
                marginLeft: 12,
                padding: "8px 22px",
                borderRadius: 999,
                background: yoPalette.bg,
                fontFamily: theme.fonts.mono,
                fontSize: 23,
                color: yoPalette.textDim,
              }}
            >
              app.yoloco.io / discovery
            </span>
          </div>

          <div style={{ padding: "28px 26px 32px" }}>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Chip label="Beauty" delay={0.3 * fps} on />
              <Chip label="Germany" delay={0.4 * fps} on />
              <Chip label="18–34" delay={0.5 * fps} on />
              <Chip label="Intent affinity > 80" delay={0.6 * fps} />
            </div>

            <div
              style={{
                marginTop: 26,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              {ROWS.map((row, i) => (
                <CreatorRow
                  key={row.handle}
                  row={row}
                  index={i}
                  delay={(0.8 + i * 0.17) * fps}
                />
              ))}
            </div>

            <div
              style={{
                marginTop: 26,
                paddingTop: 26,
                borderTop: `1px solid ${yoColors.line}`,
                display: "flex",
                alignItems: "center",
                gap: 34,
              }}
            >
              <Dial
                value={92}
                delay={1.45 * fps}
                size={150}
                label="readiness"
              />
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 18 }}>
                {[
                  ["Reachability", "78%", 1.6],
                  ["Audience overlap", "12%", 1.72],
                ].map(([k, v, d]) => (
                  <Stat key={k as string} k={k as string} v={v as string} delay={(d as number) * fps} />
                ))}
              </div>
            </div>
          </div>
        </Panel>

        <div style={{ marginTop: 62, position: "relative", height: 210 }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: 1 - swap,
              transform: `translateY(${swap * -40}px)`,
            }}
          >
            <Kinetic
              text="STOP BUYING"
              delay={0.35 * fps}
              size={96}
              color={yoPalette.textDim}
            />
            <Kinetic
              text="FOLLOWERS."
              delay={0.5 * fps}
              size={96}
              color={yoColors.bad}
            />
          </div>
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: swap,
              transform: `translateY(${(1 - swap) * 46}px)`,
            }}
          >
            <Kinetic
              text="START BUYING"
              delay={1.9 * fps}
              size={96}
              color={yoPalette.text}
            />
            <Kinetic
              text="INFLUENCE."
              delay={2.05 * fps}
              size={96}
              color={yoPalette.primary}
              style={{ textShadow: `0 0 60px ${yoPalette.glow}` }}
            />
          </div>
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};

const Stat: React.FC<{ k: string; v: string; delay: number }> = ({
  k,
  v,
  delay,
}) => {
  const p = useIn(delay, "snappy");
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        paddingBottom: 14,
        borderBottom: `1px solid ${yoColors.line}`,
        opacity: p,
        transform: `translateX(${interpolate(p, [0, 1], [24, 0])}px)`,
        fontFamily: theme.fonts.body,
        fontSize: 30,
        color: yoPalette.textDim,
      }}
    >
      <span>{k}</span>
      <span
        style={{
          fontFamily: theme.fonts.mono,
          fontSize: 36,
          fontWeight: 700,
          color: yoPalette.text,
        }}
      >
        {v}
      </span>
    </div>
  );
};
