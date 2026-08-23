import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { theme } from "../../../theme";
import { secColors, secPalette } from "../palette";
import {
  BrandBar,
  Eyebrow,
  Kinetic,
  SceneShell,
  useIn,
  usePunch,
  useRamp,
} from "../ui";

const X_AT = 72;

const ITEMS: [string, string, number][] = [
  ["API KEY", "sk-proj-4f81kQ…Vz2M", 5],
  ["DB PASSWORD", "postgres://admin:hunter2@prod…", 29],
  ["PRIVATE TOKEN", "ghp_9f2KqPz8w…", 53],
];

const LeakRow: React.FC<{ label: string; value: string; delay: number; dim: number }> = ({
  label,
  value,
  delay,
  dim,
}) => {
  const p = useIn(delay, "snappy");
  return (
    <div
      style={{
        borderRadius: 26,
        border: `1px solid ${secColors.lineStrong}`,
        background: secColors.surface,
        boxShadow: secColors.shadow,
        padding: "38px 42px",
        display: "flex",
        alignItems: "baseline",
        justifyContent: "space-between",
        gap: 30,
        opacity: p * (1 - dim * 0.55),
        transform: `translateY(${interpolate(p, [0, 1], [40, 0])}px) scale(${interpolate(p, [0, 1], [1.28, 1])})`,
      }}
    >
      <span
        style={{
          fontFamily: theme.fonts.display,
          fontSize: 72,
          fontWeight: 800,
          letterSpacing: "-0.03em",
          color: secPalette.text,
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: theme.fonts.mono,
          fontSize: 27,
          color: secPalette.textDim,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {value}
      </span>
    </div>
  );
};

/** 13.4–18.1s — API KEY / DB PASSWORD / PRIVATE TOKEN, then the big X. */
export const ExposedScene: React.FC<{
  brandName: string;
  chapter: string;
}> = ({ brandName, chapter }) => {
  const frame = useCurrentFrame();
  const punch = usePunch(X_AT, 18);
  const dim = useRamp(X_AT, X_AT + 8, theme.ease.out);
  const strokeA = useRamp(X_AT, X_AT + 9, theme.ease.inOut);
  const strokeB = useRamp(X_AT + 4, X_AT + 13, theme.ease.inOut);

  // Two diagonals anchored in opposite corners so they cross as an X.
  const stroke = (top: string, deg: number, p: number) => (
    <div
      style={{
        position: "absolute",
        left: "-3%",
        right: "-3%",
        top,
        height: 34,
        borderRadius: 17,
        background: secColors.danger,
        boxShadow: `0 0 60px ${secColors.dangerGlow}`,
        transform: `translateY(-50%) rotate(${deg}deg) scaleX(${p})`,
        transformOrigin: "left center",
      }}
    />
  );

  return (
    <SceneShell>
      <BrandBar brandName={brandName} chapter={chapter} />
      <AbsoluteFill
        style={{
          padding: "310px 82px 250px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          transform: `translate(${punch.shake}px, ${punch.shake * -0.4}px)`,
        }}
      >
        <Eyebrow delay={0} color={secColors.danger}>
          shipped in your bundle
        </Eyebrow>
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            gap: 26,
            marginTop: 48,
          }}
        >
          {ITEMS.map(([label, value, delay]) => (
            <LeakRow key={label} label={label} value={value} delay={delay} dim={dim} />
          ))}
          {/* The X — drawn over the whole stack, stroke by stroke. */}
          {stroke("10%", 21, strokeA)}
          {stroke("90%", -21, strokeB)}
        </div>

        <div style={{ marginTop: 92 }}>
          <Kinetic text="THESE BELONG" size={110} delay={86} per={2} />
          <Kinetic text="ON THE SERVER." size={110} delay={92} per={2} color={secPalette.primary} glow />
        </div>
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background: `radial-gradient(circle at 50% 42%, ${secColors.dangerGlow}, transparent 60%)`,
          opacity: punch.energy * 0.34,
        }}
      />
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background: secPalette.text,
          opacity: frame >= X_AT && frame < X_AT + 2 ? 0.14 : 0,
        }}
      />
    </SceneShell>
  );
};
