import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { theme } from "../../../theme";
import { secColors, secPalette } from "../palette";
import { AppMock } from "../AppMock";
import {
  BrandBar,
  Chip,
  Kinetic,
  Panel,
  SceneShell,
  UrlPill,
  WindowCard,
  useIn,
  useRamp,
} from "../ui";

/** 3.9–7.5s — the pretty deployed app, and the bundle it hands to everyone. */
export const AppScene: React.FC<{
  brandName: string;
  chapter: string;
  appDomain: string;
}> = ({ brandName, chapter, appDomain }) => {
  const bar = useIn(38, "smooth");
  const fill = useRamp(46, 78, theme.ease.inOut);

  return (
    <SceneShell>
      <BrandBar brandName={brandName} chapter={chapter} />
      <AbsoluteFill
        style={{
          padding: "300px 82px 240px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Kinetic text="THE BROWSER" size={104} delay={2} />
        <Kinetic text="DOWNLOADS YOUR CODE." size={104} delay={8} color={secPalette.accent} />

        <WindowCard
          title={<UrlPill domain={appDomain} />}
          delay={14}
          style={{ marginTop: 64 }}
          pad="0"
        >
          <AppMock width={916 - 2} delay={12} />
        </WindowCard>

        {/* The part nobody looks at: the bundle going out to a stranger. */}
        <Panel delay={38} style={{ marginTop: 44, padding: "26px 30px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 22,
              fontFamily: theme.fonts.mono,
              fontSize: 26,
              color: secPalette.textDim,
              opacity: bar,
              transform: `translateX(${interpolate(bar, [0, 1], [-14, 0])}px)`,
            }}
          >
            <span style={{ color: secPalette.text, fontWeight: 700 }}>GET</span>
            <span style={{ flex: 1, minWidth: 0 }}>/assets/index-9f2c.js</span>
            <span>812 kB</span>
          </div>
          <div
            style={{
              marginTop: 20,
              height: 12,
              borderRadius: 6,
              background: secColors.surfaceLift,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${fill * 100}%`,
                height: "100%",
                borderRadius: 6,
                background: secPalette.accent,
                boxShadow: `0 0 24px ${secPalette.accent}66`,
              }}
            />
          </div>
        </Panel>

        <div style={{ marginTop: 38 }}>
          <Chip delay={84} tone="blue">
            sent to every visitor — in full
          </Chip>
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};
