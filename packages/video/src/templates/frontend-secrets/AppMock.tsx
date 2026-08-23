// The "beautiful deployed app" that later gets ripped open. Pure UI mock;
// staggered pops driven by `delay`, all sizes derived from `width` so the
// devtools scene can reuse it at a smaller scale.
import React from "react";
import { interpolate } from "remotion";
import { theme } from "../../theme";
import { secColors, secPalette } from "./palette";
import { useIn } from "./ui";

const BARS_A = [0.45, 0.7, 0.55, 0.9, 0.62];
const BARS_B = [0.8, 0.5, 0.66, 0.42, 0.74];

const Rise: React.FC<{ p: number; children: React.ReactNode; style?: React.CSSProperties }> = ({
  p,
  children,
  style,
}) => (
  <div
    style={{
      opacity: p,
      transform: `translateY(${interpolate(p, [0, 1], [26, 0])}px) scale(${interpolate(p, [0, 1], [0.96, 1])})`,
      ...style,
    }}
  >
    {children}
  </div>
);

export const AppMock: React.FC<{
  width: number;
  delay?: number;
  showCards?: boolean;
}> = ({ width, delay = 0, showCards = true }) => {
  const u = width / 900; // designed at 900 wide
  const nav = useIn(delay + 2, "snappy");
  const heroA = useIn(delay + 5, "smooth");
  const heroB = useIn(delay + 8, "smooth");
  const btn = useIn(delay + 11, "bouncy");
  const cardA = useIn(delay + 14, "smooth");
  const cardB = useIn(delay + 17, "smooth");

  const card = (p: number, bars: number[], label: string, value: string) => (
    <Rise
      p={p}
      style={{
        flex: 1,
        borderRadius: 18 * u,
        border: `1px solid ${secColors.line}`,
        background: secColors.surfaceLift,
        padding: `${20 * u}px ${24 * u}px`,
      }}
    >
      <div
        style={{
          fontFamily: theme.fonts.body,
          fontSize: 19 * u,
          fontWeight: 500,
          color: secPalette.textDim,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: theme.fonts.display,
          fontSize: 34 * u,
          fontWeight: 700,
          color: secPalette.text,
          margin: `${6 * u}px 0 ${14 * u}px`,
        }}
      >
        {value}
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 10 * u, height: 52 * u }}>
        {bars.map((h, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: `${h * 100}%`,
              borderRadius: 5 * u,
              background: secColors.bar,
            }}
          />
        ))}
      </div>
    </Rise>
  );

  return (
    <div style={{ width, padding: `${26 * u}px ${30 * u}px ${30 * u}px` }}>
      <Rise p={nav} style={{ display: "flex", alignItems: "center", gap: 14 * u }}>
        <span
          style={{
            width: 30 * u,
            height: 30 * u,
            borderRadius: 9 * u,
            background: secPalette.accent,
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontFamily: theme.fonts.display,
            fontSize: 25 * u,
            fontWeight: 700,
            color: secPalette.text,
            letterSpacing: "-0.02em",
          }}
        >
          lumen.
        </span>
        <span style={{ flex: 1 }} />
        {[54, 40, 46].map((w, i) => (
          <span
            key={i}
            style={{
              width: w * u,
              height: 9 * u,
              borderRadius: 5 * u,
              background: secColors.lineStrong,
            }}
          />
        ))}
      </Rise>

      <Rise p={heroA} style={{ marginTop: 36 * u }}>
        <div
          style={{
            fontFamily: theme.fonts.display,
            fontSize: 52 * u,
            fontWeight: 700,
            lineHeight: 1.06,
            letterSpacing: "-0.03em",
            color: secPalette.text,
          }}
        >
          Ship your next idea
        </div>
      </Rise>
      <Rise p={heroB} style={{ marginTop: 12 * u }}>
        <div
          style={{
            fontFamily: theme.fonts.body,
            fontSize: 22 * u,
            fontWeight: 400,
            color: secPalette.textDim,
          }}
        >
          AI drafts, you approve. Live in minutes.
        </div>
      </Rise>
      <Rise p={btn} style={{ marginTop: 22 * u, display: "inline-block" }}>
        <span
          style={{
            display: "inline-block",
            padding: `${13 * u}px ${34 * u}px`,
            borderRadius: 999,
            background: secPalette.primary,
            color: "#241300",
            fontFamily: theme.fonts.display,
            fontSize: 22 * u,
            fontWeight: 700,
            boxShadow: `0 ${10 * u}px ${40 * u}px -${12 * u}px ${secPalette.glow}`,
          }}
        >
          Generate →
        </span>
      </Rise>

      {showCards ? (
        <div style={{ display: "flex", gap: 20 * u, marginTop: 30 * u }}>
          {card(cardA, BARS_A, "Drafts shipped", "1,284")}
          {card(cardB, BARS_B, "Time saved", "36 h")}
        </div>
      ) : null}
    </div>
  );
};
