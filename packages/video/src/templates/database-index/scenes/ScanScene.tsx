import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { theme } from "../../../theme";
import { idxColors, idxPalette } from "../palette";
import {
  BrandBar,
  Chip,
  Counter,
  Eyebrow,
  Kinetic,
  Panel,
  RowField,
  SceneShell,
  usePunch,
  useIn,
} from "../ui";

const FIELD_H = 520;
const SLAM = 62;

/** 10.7–14.3s — "Without an index, the database may check rows one by one." */
export const ScanScene: React.FC<{
  brandName: string;
  chapter: string;
}> = ({ brandName, chapter }) => {
  const frame = useCurrentFrame();
  const head = useIn(20, "smooth");
  const scanY = interpolate(frame, [6, 68], [0, FIELD_H], {
    easing: theme.ease.inOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const offset = interpolate(frame, [6, 68], [0, -600], {
    easing: theme.ease.inOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const slam = usePunch(SLAM, 18);
  const slamIn = useIn(SLAM, "bouncy");

  return (
    <SceneShell>
      <BrandBar brandName={brandName} chapter={chapter} />
      <AbsoluteFill
        style={{
          padding: "300px 82px 220px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          transform: `translate(${slam.shake * 0.4}px, 0px)`,
        }}
      >
        <Eyebrow delay={0} color={idxColors.danger}>
          no index
        </Eyebrow>
        <div style={{ marginTop: 40 }}>
          <Kinetic text="CHECK ROWS" size={98} delay={3} />
          <Kinetic text="ONE BY ONE" size={98} delay={9} />
        </div>

        <div style={{ marginTop: 54 }}>
          <div
            style={{
              fontFamily: theme.fonts.mono,
              fontSize: 25,
              letterSpacing: "0.16em",
              color: idxPalette.textDim,
              opacity: head,
            }}
          >
            ROWS SCANNED
          </div>
          <div
            style={{
              marginTop: 10,
              fontFamily: theme.fonts.display,
              fontSize: 116,
              fontWeight: 700,
              letterSpacing: "-0.05em",
              lineHeight: 1,
              color: idxPalette.text,
              fontVariantNumeric: "tabular-nums",
              opacity: head,
              transform: `translateY(${interpolate(head, [0, 1], [26, 0])}px)`,
            }}
          >
            <Counter
              from={0}
              to={6}
              delay={8}
              duration={58}
              easing={theme.ease.out}
              format={(v) => Math.round(Math.pow(10, v)).toLocaleString("en-US")}
            />
          </div>
        </div>

        <Panel delay={16} style={{ marginTop: 44, overflow: "hidden" }}>
          <RowField
            count={44}
            rowH={40}
            height={FIELD_H}
            offset={offset}
            scanY={scanY}
            startIndex={210}
          />
        </Panel>

        <div style={{ marginTop: 38, display: "flex", gap: 20 }}>
          <Chip delay={74} tone="danger" dot={false}>
            4,300 ms
          </Chip>
          <Chip delay={80} dot={false}>
            0 rows skipped
          </Chip>
        </div>
      </AbsoluteFill>

      {/* The alarm label slams across the field. */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1140,
          display: "flex",
          justifyContent: "center",
          opacity: slamIn,
          transform: `rotate(-3deg) scale(${interpolate(slamIn, [0, 1], [1.35, 1 + slam.pop * 0.05])}) translateX(${slam.shake * 0.5}px)`,
        }}
      >
        <div
          style={{
            padding: "22px 42px",
            borderRadius: 20,
            background: idxColors.danger,
            boxShadow: `0 0 90px ${idxColors.danger}77`,
            fontFamily: theme.fonts.display,
            fontSize: 88,
            fontWeight: 700,
            letterSpacing: "-0.045em",
            color: idxPalette.bg,
            whiteSpace: "nowrap",
          }}
        >
          FULL TABLE SCAN
        </div>
      </div>
    </SceneShell>
  );
};
