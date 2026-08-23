import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../../theme";
import { yoColors, yoPalette } from "../palette";
import {
  BrandBar,
  Dial,
  Eyebrow,
  MetricBar,
  Panel,
  Spark,
  SceneShell,
  useIn,
} from "../ui";

const Card: React.FC<{
  index: number;
  delay: number;
  title: string;
  note: string;
  children: React.ReactNode;
}> = ({ index, delay, title, note, children }) => {
  const num = useIn(delay + 3, "snappy");
  return (
    <Panel delay={delay} hero={index === 0} style={{ padding: "34px 38px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
        <div style={{ flex: 1 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              fontFamily: theme.fonts.mono,
              fontSize: 26,
              letterSpacing: "0.14em",
              color: yoPalette.textDim,
              opacity: num,
              transform: `translateX(${interpolate(num, [0, 1], [-18, 0])}px)`,
            }}
          >
            <span style={{ color: yoPalette.primary }}>
              0{index + 1}
            </span>
            <span
              style={{ width: 44, height: 1, background: yoColors.lineStrong }}
            />
          </div>
          <div
            style={{
              marginTop: 14,
              fontFamily: theme.fonts.display,
              fontSize: 66,
              fontWeight: 700,
              letterSpacing: "-0.04em",
              lineHeight: 1.02,
              color: yoPalette.text,
            }}
          >
            {title}
          </div>
          <div
            style={{
              marginTop: 12,
              fontFamily: theme.fonts.body,
              fontSize: 32,
              fontWeight: 500,
              color: yoPalette.textDim,
            }}
          >
            {note}
          </div>
        </div>
        <div
          style={{
            width: 268,
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          {children}
        </div>
      </div>
    </Panel>
  );
};

// 12.0–17.5s — the three things that actually predict a sale.
export const PillarsScene: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <SceneShell>
      <BrandBar chapter="04 · WHAT MATTERS" />
      <AbsoluteFill style={{ padding: "300px 72px 190px" }}>
        <Eyebrow delay={0.1 * fps}>the only three signals</Eyebrow>
        <div
          style={{
            marginTop: 26,
            fontFamily: theme.fonts.display,
            fontSize: 104,
            fontWeight: 700,
            letterSpacing: "-0.05em",
            lineHeight: 0.98,
            color: yoPalette.text,
          }}
        >
          WHAT
          <br />
          ACTUALLY MATTERS
        </div>

        <div
          style={{
            marginTop: 62,
            display: "flex",
            flexDirection: "column",
            gap: 30,
          }}
        >
          <Card
            index={0}
            delay={1.13 * fps}
            title="AUDIENCE FIT"
            note="Do they follow your buyer?"
          >
            <Dial value={87} delay={1.3 * fps} size={182} label="fit" />
          </Card>
          <Card
            index={1}
            delay={2.4 * fps}
            title="REAL ENGAGEMENT"
            note="Comments, not impressions."
          >
            <div style={{ textAlign: "right" }}>
              <Spark
                points={[8, 14, 11, 22, 18, 34, 29, 48]}
                delay={2.6 * fps}
                width={252}
                height={86}
                color={yoPalette.accent}
              />
              <div
                style={{
                  marginTop: 8,
                  fontFamily: theme.fonts.mono,
                  fontSize: 32,
                  fontWeight: 700,
                  color: yoPalette.accent,
                }}
              >
                4.8% ER
              </div>
            </div>
          </Card>
          <Card
            index={2}
            delay={3.6 * fps}
            title="WHO ACTUALLY FOLLOWS"
            note="Age, country, intent."
          >
            <div
              style={{
                width: 252,
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              <MetricBar
                label="DE 18–34"
                value={74}
                delay={3.8 * fps}
                color={yoPalette.accent}
                trackHeight={14}
                labelSize={24}
              />
              <MetricBar
                label="Beauty intent"
                value={62}
                delay={4.0 * fps}
                color={yoPalette.accent}
                trackHeight={14}
                labelSize={24}
              />
            </div>
          </Card>
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};
