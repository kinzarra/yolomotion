import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
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
  useIn,
} from "../ui";

/** 0.0–3.0s — "Your app feels fast with a hundred users." */
export const FastScene: React.FC<{
  brandName: string;
  chapter: string;
}> = ({ brandName, chapter }) => {
  const head = useIn(20, "smooth");
  return (
    <SceneShell>
      <BrandBar brandName={brandName} chapter={chapter} />
      <AbsoluteFill
        style={{
          padding: "310px 82px 250px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Eyebrow delay={0}>databases · lesson 02</Eyebrow>
        <div style={{ marginTop: 48 }}>
          <Kinetic text="100 USERS" size={138} delay={4} />
          <Kinetic
            text="→ FAST"
            size={138}
            delay={11}
            color={idxColors.good}
            glow
          />
        </div>

        <Panel delay={22} style={{ marginTop: 78, overflow: "hidden" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "22px 28px",
              borderBottom: `1px solid ${idxColors.line}`,
              background: idxColors.surfaceStrong,
              fontFamily: theme.fonts.mono,
              fontSize: 24,
              letterSpacing: "0.12em",
              color: idxPalette.textDim,
              opacity: head,
              transform: `translateX(${interpolate(head, [0, 1], [-18, 0])}px)`,
            }}
          >
            <span>TABLE · users</span>
            <span>100 rows</span>
          </div>
          {[0, 1, 2, 3].map((i) => (
            <TableRow key={i} index={i + 3} height={92} />
          ))}
        </Panel>

        <div style={{ marginTop: 46, display: "flex", gap: 20 }}>
          <Chip delay={40} tone="good" dot={false}>
            12 ms
          </Chip>
          <Chip delay={46} dot={false}>
            SELECT * FROM users
          </Chip>
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};
