import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { theme } from "../../../theme";
import { idxColors, idxPalette } from "../palette";
import {
  BrandBar,
  Chip,
  Counter,
  Kinetic,
  Panel,
  RowField,
  SceneShell,
  TerminalCard,
  TypedCode,
  useIn,
  useRamp,
} from "../ui";

/** 7.0–10.7s — "Why? Imagine looking for one person in a million-row table." */
export const QueryScene: React.FC<{
  brandName: string;
  chapter: string;
  query: string;
  targetEmail: string;
}> = ({ brandName, chapter, query, targetEmail }) => {
  const head = useIn(46, "smooth");
  const drift = useRamp(46, 108, theme.ease.inOut);
  return (
    <SceneShell>
      <BrandBar brandName={brandName} chapter={chapter} />
      <AbsoluteFill
        style={{
          padding: "300px 82px 220px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Kinetic text="WHY?" size={156} delay={0} color={idxPalette.text} />

        <TerminalCard title="psql · vibecloud" delay={12} style={{ marginTop: 44 }}>
          <TypedCode code={query} delay={18} duration={42} size={31} />
        </TerminalCard>

        <Panel delay={44} style={{ marginTop: 42, overflow: "hidden" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "20px 26px",
              borderBottom: `1px solid ${idxColors.line}`,
              background: idxColors.surfaceStrong,
              fontFamily: theme.fonts.mono,
              fontSize: 23,
              letterSpacing: "0.12em",
              color: idxPalette.textDim,
              opacity: head,
              transform: `translateX(${interpolate(head, [0, 1], [-16, 0])}px)`,
            }}
          >
            <span>TABLE · users</span>
            <span style={{ color: idxPalette.accent }}>
              <Counter
                from={100000}
                to={1000000}
                delay={46}
                duration={30}
                easing={theme.ease.out}
              />
              &nbsp;ROWS
            </span>
          </div>
          <RowField
            count={30}
            rowH={44}
            height={500}
            offset={interpolate(drift, [0, 1], [0, -190], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })}
            startIndex={40}
          />
        </Panel>

        <div style={{ marginTop: 40, display: "flex", gap: 20 }}>
          <Chip delay={72} tone="blue">
            find 1 of 1,000,000
          </Chip>
          <Chip delay={78} dot={false}>
            {targetEmail}
          </Chip>
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};
