import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { theme } from "../../../theme";
import { idxColors, idxPalette } from "../palette";
import {
  BrandBar,
  Counter,
  Eyebrow,
  Kinetic,
  Panel,
  SceneShell,
  useIn,
  useRamp,
} from "../ui";

const FOUND = 30;

const Compare: React.FC<{
  label: string;
  value: string;
  width: number; // 0–100
  color: string;
  delay: number;
}> = ({ label, value, width, color, delay }) => {
  const p = useIn(delay, "snappy");
  const fill = useRamp(delay + 3, delay + 26, theme.ease.out);
  return (
    <div
      style={{
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [26, 0])}px)`,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          fontFamily: theme.fonts.mono,
          fontSize: 27,
          letterSpacing: "0.08em",
          color: idxPalette.textDim,
        }}
      >
        <span>{label}</span>
        <span style={{ color, fontWeight: 700 }}>{value}</span>
      </div>
      <div
        style={{
          marginTop: 16,
          height: 22,
          borderRadius: 22,
          background: idxColors.surfaceStrong,
          border: `1px solid ${idxColors.line}`,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${Math.max(width * fill, 1.4)}%`,
            height: "100%",
            borderRadius: 22,
            background: color,
          }}
        />
      </div>
    </div>
  );
};

/** 22.0–25.6s — "Same query. Same data. Way less work." */
export const FoundScene: React.FC<{
  brandName: string;
  chapter: string;
}> = ({ brandName, chapter }) => {
  const head = useIn(2, "smooth");
  const found = useIn(FOUND, "bouncy");
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
        <Eyebrow delay={0}>the payoff</Eyebrow>

        <div style={{ marginTop: 44 }}>
          <div
            style={{
              fontFamily: theme.fonts.mono,
              fontSize: 25,
              letterSpacing: "0.16em",
              color: idxPalette.textDim,
              opacity: head,
            }}
          >
            ROWS TO CHECK
          </div>
          <div
            style={{
              marginTop: 8,
              fontFamily: theme.fonts.display,
              fontSize: 132,
              fontWeight: 700,
              letterSpacing: "-0.05em",
              lineHeight: 1,
              color: idxPalette.text,
              fontVariantNumeric: "tabular-nums",
              opacity: head,
              transform: `translateY(${interpolate(head, [0, 1], [30, 0])}px)`,
            }}
          >
            <Counter
              from={6}
              to={0}
              delay={2}
              duration={28}
              easing={theme.ease.inOut}
              format={(v) => Math.round(Math.pow(10, v)).toLocaleString("en-US")}
            />
          </div>
        </div>

        <div
          style={{
            marginTop: 30,
            alignSelf: "flex-start",
            display: "inline-flex",
            alignItems: "center",
            gap: 20,
            padding: "16px 34px",
            borderRadius: 999,
            border: `1px solid ${idxColors.good}`,
            background: idxColors.goodSoft,
            fontFamily: theme.fonts.display,
            fontSize: 78,
            fontWeight: 700,
            letterSpacing: "-0.045em",
            color: idxColors.good,
            opacity: found,
            transform: `translateX(${interpolate(found, [0, 1], [-70, 0])}px) scale(${interpolate(found, [0, 1], [0.86, 1])})`,
          }}
        >
          → FOUND
        </div>

        <Panel delay={38} style={{ marginTop: 48, padding: "34px 34px 38px" }}>
          <Compare
            label="NO INDEX"
            value="1,000,000 rows · 4,300 ms"
            width={100}
            color={idxColors.danger}
            delay={42}
          />
          <div style={{ height: 34 }} />
          <Compare
            label="INDEXED"
            value="1 row · 3 ms"
            width={3}
            color={idxColors.good}
            delay={50}
          />
        </Panel>

        <div style={{ marginTop: 46 }}>
          <Kinetic text="SAME QUERY. SAME DATA." size={62} delay={56} per={2} />
          <Kinetic
            text="WAY LESS WORK."
            size={92}
            delay={64}
            color={idxPalette.primary}
            glow
          />
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};
