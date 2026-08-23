import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { theme } from "../../../theme";
import { idxColors, idxPalette } from "../palette";
import {
  BrandBar,
  Chip,
  Eyebrow,
  Kinetic,
  Panel,
  SceneShell,
  TableRow,
  TerminalCard,
  TypedCode,
  useIn,
  useRamp,
} from "../ui";

const ROWS = 7;
const ROW_H = 54;
const TARGET = 4;
const SEEK = 58;

/** 18.2–22.0s — "Instead of scanning everything, it knows where to look." */
export const IndexScene: React.FC<{
  brandName: string;
  chapter: string;
  indexStatement: string;
  targetEmail: string;
}> = ({ brandName, chapter, indexStatement, targetEmail }) => {
  const frame = useCurrentFrame();
  const created = useRamp(52, 62, theme.ease.out);
  const head = useIn(30, "smooth");
  const hit = useIn(SEEK + 15, "snappy");
  // The marker drops straight to the row instead of sweeping through the table.
  const markerY = interpolate(
    frame,
    [SEEK, SEEK + 13],
    [8, TARGET * ROW_H + ROW_H / 2 - 13],
    {
      easing: theme.ease.out,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

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
        <Eyebrow delay={0} color={idxColors.good}>
          with an index
        </Eyebrow>
        <div style={{ marginTop: 38 }}>
          <Kinetic text="IT KNOWS WHERE" size={88} delay={3} />
          <Kinetic text="TO LOOK" size={88} delay={9} />
        </div>

        <TerminalCard
          title="psql · vibecloud"
          delay={14}
          style={{ marginTop: 46 }}
        >
          <TypedCode code={indexStatement} delay={16} duration={34} size={29} />
          <div
            style={{
              marginTop: 18,
              fontFamily: theme.fonts.mono,
              fontSize: 26,
              color: idxColors.good,
              opacity: created,
              transform: `translateY(${interpolate(created, [0, 1], [12, 0])}px)`,
            }}
          >
            CREATE INDEX
          </div>
        </TerminalCard>

        <Panel delay={28} style={{ marginTop: 44, overflow: "hidden" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "18px 26px",
              borderBottom: `1px solid ${idxColors.line}`,
              background: idxColors.surfaceStrong,
              fontFamily: theme.fonts.mono,
              fontSize: 22,
              letterSpacing: "0.12em",
              color: idxPalette.textDim,
              opacity: head,
              transform: `translateX(${interpolate(head, [0, 1], [-16, 0])}px)`,
            }}
          >
            <span>idx_users_email</span>
            <span>1,000,000 rows</span>
          </div>
          <div style={{ display: "flex" }}>
            {/* The index rail: the marker drops to one row, nothing is swept. */}
            <div
              style={{
                position: "relative",
                width: 64,
                flexShrink: 0,
                borderRight: `1px solid ${idxColors.line}`,
                background: idxColors.surfaceStrong,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: 20,
                  top: markerY,
                  width: 0,
                  height: 0,
                  borderTop: "13px solid transparent",
                  borderBottom: "13px solid transparent",
                  borderLeft: `22px solid ${idxPalette.primary}`,
                  filter: `drop-shadow(0 0 22px ${idxPalette.glow})`,
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              {Array.from({ length: ROWS }).map((_, i) => (
                <TableRow
                  key={i}
                  index={480 + i}
                  height={ROW_H}
                  state={i === TARGET && hit > 0.4 ? "hit" : "idle"}
                  email={i === TARGET ? targetEmail : undefined}
                  opacity={i === TARGET ? 1 : 0.55}
                />
              ))}
            </div>
          </div>
        </Panel>

        <div style={{ marginTop: 38, display: "flex", gap: 20 }}>
          <Chip delay={SEEK + 20} tone="good" dot={false}>
            3 ms
          </Chip>
          <Chip delay={SEEK + 26} dot={false}>
            1 row read
          </Chip>
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};
