// 09 followers — 42.3–48.8s. Where the story becomes the viewer's problem.
//
// The number is deliberately the biggest thing in the reel, and it is
// deliberately the emptiest: it fills the page, gets asked a two-word question,
// and falls through the floor to reveal the six things that were underneath it
// the whole time.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { theme } from "../../../theme";
import { ynColors, ynPalette } from "../palette";
import { Flash, Folio, Mono, SceneShell, Slam, Tag, ramp, usePunch } from "../ui";

const SO_AT = 58;
const DROP_AT = 82;
const GRID_AT = 100;
const ASSET_AT = 152;

const DIMENSIONS = [
  "AUDIENCE",
  "TRUST",
  "BRAND FIT",
  "ENGAGEMENT",
  "GEOGRAPHY",
  "INTERESTS",
];

export const FollowersScene: React.FC = () => {
  const frame = useCurrentFrame();
  const numIn = ramp(frame, 4, 24, theme.ease.out);
  const drop = ramp(frame, DROP_AT, DROP_AT + 16, theme.ease.in);
  const soOut = ramp(frame, GRID_AT - 8, GRID_AT + 4, theme.ease.in);
  const gridDim = 1 - ramp(frame, ASSET_AT - 6, ASSET_AT + 10) * 0.86;
  const hit = usePunch(SO_AT, 20);
  const assetHit = usePunch(ASSET_AT, 18);

  return (
    <SceneShell light={0.4}>
      <Folio left="07 · WHAT BRANDS BUY" right="ATTENTION" delay={-6} />

      {/* the number nobody should be buying */}
      {drop < 1 && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 560,
            textAlign: "center",
            opacity: numIn * (1 - drop) * (1 - ramp(frame, SO_AT, SO_AT + 12) * 0.72),
            transform: `translateY(${interpolate(numIn, [0, 1], [70, 0]) + drop * 340}px) scale(${interpolate(numIn, [0, 1], [1.16, 1]) * (1 - drop * 0.12)})`,
          }}
        >
          <div
            style={{
              fontFamily: theme.fonts.wide,
              fontSize: 132,
              fontWeight: 900,
              letterSpacing: "-0.05em",
              lineHeight: 1,
              fontVariantNumeric: "tabular-nums",
              color: ynColors.bone,
              whiteSpace: "nowrap",
            }}
          >
            10,000,000
          </div>
          <div style={{ marginTop: 26 }}>
            <Mono size={34} color={ynPalette.textDim} style={{ display: "inline-block" }}>
              FOLLOWERS
            </Mono>
          </div>
        </div>
      )}

      {/* the two words that empty it out */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 800,
          opacity: 1 - soOut,
          transform: `translate(${hit.shake * 0.3}px, ${hit.shake - soOut * 120}px) scale(${1 - soOut * 0.2})`,
        }}
      >
        <Slam text="SO WHAT?" at={SO_AT} size={188} color={ynPalette.primary} />
      </div>

      {/* what was under it */}
      <div
        style={{
          position: "absolute",
          left: 84,
          right: 84,
          top: 620,
          display: "flex",
          flexWrap: "wrap",
          gap: 22,
          justifyContent: "center",
          opacity: gridDim,
        }}
      >
        {DIMENSIONS.map((d, i) => (
          <Tag key={d} delay={GRID_AT + i * 6} size={30}>
            {d}
          </Tag>
        ))}
      </div>

      {/* the line that makes it a thesis rather than a checklist */}
      <div
        style={{
          position: "absolute",
          left: 62,
          top: 960,
          transform: `translate(${assetHit.shake * 0.25}px, ${assetHit.shake}px)`,
        }}
      >
        <Slam text="ATTENTION" at={ASSET_AT} size={150} align="left" />
        <Slam text="IS AN ASSET." at={ASSET_AT + 7} size={150} align="left" />
      </div>

      <Flash energy={hit.energy} strength={0.14} />
    </SceneShell>
  );
};
