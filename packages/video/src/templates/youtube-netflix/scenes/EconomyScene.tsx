// 10 economy — 48.8–54.2s. The pull-back, and then the opposite of a
// pull-back.
//
// First the whole market wires itself up — platforms, brands, viewers and a
// field of anonymous creators behind them — and then everything that is not
// the actual decision is taken away. What is left is one creator, one brand,
// and the line between them. That single line is the product.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { theme } from "../../../theme";
import { ynColors, ynPalette } from "../palette";
import {
  CreatorCard,
  FieldMark,
  Folio,
  Mono,
  Node,
  SceneShell,
  Wire,
  noise,
  ramp,
} from "../ui";

const SIMPLIFY_AT = 78;
const LINK_AT = 100;
const TYPE_AT = 118;

const NODES = [
  { x: 236, y: 430, label: "YOUTUBE", at: 10, accent: true },
  { x: 844, y: 430, label: "NETFLIX", at: 16, accent: true },
  { x: 214, y: 1140, label: "BRANDS", at: 28 },
  { x: 866, y: 1140, label: "VIEWERS", at: 34 },
  { x: 540, y: 786, label: "CREATORS", at: 22 },
];

const WIRES = [
  { a: 0, b: 4, at: 22 },
  { a: 1, b: 4, at: 26 },
  { a: 2, b: 4, at: 38 },
  { a: 3, b: 4, at: 42 },
  { a: 0, b: 3, at: 50 },
  { a: 1, b: 3, at: 54 },
  { a: 2, b: 0, at: 58 },
];

const FIELD = Array.from({ length: 44 }, (_, i) => ({
  i,
  x: 40 + noise(i, 1) * 980,
  y: 330 + noise(i, 2) * 1030,
  size: 12 + noise(i, 3) * 16,
  delay: 4 + (i % 11) * 3,
}));

export const EconomyScene: React.FC = () => {
  const frame = useCurrentFrame();
  const simplify = ramp(frame, SIMPLIFY_AT, SIMPLIFY_AT + 20, theme.ease.inOut);
  const link = ramp(frame, LINK_AT, LINK_AT + 22, theme.ease.out);
  const typeIn = ramp(frame, TYPE_AT, TYPE_AT + 18, theme.ease.out);

  return (
    <SceneShell light={0.45}>
      <Folio left="08 · THE MEDIA ECONOMY" right="ONE DECISION" delay={-6} />

      {/* the market */}
      <div style={{ opacity: 1 - simplify * 0.94 }}>
        {FIELD.map((f) => (
          <FieldMark key={f.i} x={f.x} y={f.y} size={f.size} delay={f.delay} dim={0.9} />
        ))}
        {WIRES.map((w, i) => (
          <Wire
            key={`w-${i}`}
            x1={NODES[w.a].x}
            y1={NODES[w.a].y}
            x2={NODES[w.b].x}
            y2={NODES[w.b].y}
            progress={ramp(frame, w.at, w.at + 20, theme.ease.inOut)}
            color={ynColors.lineStrong}
            thickness={2}
          />
        ))}
        {NODES.map((n) => (
          <Node
            key={n.label}
            x={n.x}
            y={n.y}
            label={n.label}
            delay={n.at}
            accent={n.accent}
            size={n.label === "CREATORS" ? 168 : 128}
          />
        ))}
      </div>

      {/* …and the only question inside it */}
      {simplify > 0 && (
        <div style={{ opacity: simplify }}>
          <CreatorCard
            code="CREATOR"
            meta="AUDIENCE · TRUST · FIT"
            width={392}
            delay={SIMPLIFY_AT + 4}
            bar={0.84}
            style={{ position: "absolute", left: 76, top: 700 }}
          />
          <div
            style={{
              position: "absolute",
              left: 612,
              top: 700,
              width: 392,
              padding: 35,
              boxSizing: "border-box",
              border: `1.5px solid ${ynColors.lineStrong}`,
              borderRadius: 6,
              background: ynColors.surface,
              opacity: ramp(frame, SIMPLIFY_AT + 10, SIMPLIFY_AT + 26),
            }}
          >
            <Mono size={32} color={ynColors.bone}>
              BRAND
            </Mono>
            <div style={{ height: 12 }} />
            <Mono size={20}>ONE CAMPAIGN</Mono>
            <div style={{ marginTop: 24, height: 3, background: ynColors.line }}>
              <div style={{ height: 3, width: "62%", background: ynColors.lineStrong }} />
            </div>
          </div>
          {/* the line that is the whole product */}
          <div
            style={{
              position: "absolute",
              left: 468,
              // the vertical centre of the creator card: 700 + (95 + 2×29)/2
              top: 774,
              width: 144 * link,
              height: 4,
              background: ynPalette.primary,
            }}
          />
        </div>
      )}

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1040,
          textAlign: "center",
          opacity: typeIn,
          transform: `translateY(${interpolate(typeIn, [0, 1], [34, 0])}px)`,
        }}
      >
        <div
          style={{
            fontFamily: theme.fonts.display,
            fontSize: 80,
            fontWeight: 700,
            letterSpacing: "-0.045em",
            lineHeight: 1.06,
            color: ynColors.bone,
          }}
        >
          THE RIGHT CREATOR
        </div>
        <div
          style={{
            fontFamily: theme.fonts.mono,
            fontSize: 44,
            fontWeight: 500,
            color: ynPalette.primary,
            margin: "6px 0",
          }}
        >
          ×
        </div>
        <div
          style={{
            fontFamily: theme.fonts.display,
            fontSize: 80,
            fontWeight: 700,
            letterSpacing: "-0.045em",
            lineHeight: 1.06,
            color: ynColors.bone,
          }}
        >
          THE RIGHT AUDIENCE
        </div>
      </div>
    </SceneShell>
  );
};
