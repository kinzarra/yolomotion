// 02 offer — 4.5–10.0s. What is actually being reported.
//
// The page is a wire story: a folio, a live ticker, the YouTube plate at the
// head of a rail, three anonymous creators hanging off it, and money walking
// down the rail as dots. The figures are bone, never green and never red — in
// this reel red belongs to the two platforms and to nothing else.
//
// The three figures are the one thing in the reel that could be misread as
// reporting, so the frame carries its own disclaimer in mono type rather than
// in a caption: the caption scrolls away, the frame does not.
import React from "react";
import { useCurrentFrame } from "remotion";
import { interpolate } from "remotion";
import { theme } from "../../../theme";
import { ynColors, ynPalette } from "../palette";
import {
  CreatorCard,
  FlowDot,
  Folio,
  Footnote,
  Mono,
  NetflixMark,
  SceneShell,
  Ticker,
  YouTubeMark,
  ramp,
} from "../ui";

const RAIL_X = 126;
const CARD_X = 214;
// A card is 183px tall at this width (border-box: 470 + 2×35 padding around a
// 113px content column). Rows are pitched 192 apart so the roster has air, and
// the figures hang off the right of each card at its vertical centre.
const CARD_W = 470;
const CARD_H = 183;
const ROWS = [
  { code: "CREATOR 01", meta: "TOP-TIER · MULTI-PLATFORM", y: 656, bar: 0.92, at: 26 },
  { code: "CREATOR 02", meta: "TOP-TIER · ORIGINALS", y: 848, bar: 0.78, at: 36 },
  { code: "CREATOR 03", meta: "TOP-TIER · FRANCHISE", y: 1040, bar: 0.86, at: 46 },
];
const FIGURES = [
  { text: "$1M+", y: 702, at: 46 },
  { text: "$2M+", y: 894, at: 57 },
  { text: "$5M+", y: 1086, at: 68 },
];

const FIGURES_OUT = 112;
const N_AT = 116;

const Figure: React.FC<{ text: string; y: number; at: number; out: number }> = ({
  text,
  y,
  at,
  out,
}) => {
  const frame = useCurrentFrame();
  const p = ramp(frame, at, at + 16, theme.ease.out);
  if (p <= 0 || out >= 1) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 724,
        top: y,
        fontFamily: theme.fonts.wide,
        fontSize: 74,
        fontWeight: 900,
        letterSpacing: "-0.04em",
        lineHeight: 1,
        color: ynColors.bone,
        opacity: p * (1 - out),
        transform: `translateX(${interpolate(p, [0, 1], [-40, 0]) + out * 150}px) scale(${interpolate(p, [0, 1], [0.7, 1])})`,
      }}
    >
      {text}
    </div>
  );
};

export const OfferScene: React.FC = () => {
  const frame = useCurrentFrame();
  const railDraw = ramp(frame, 14, 62, theme.ease.inOut);
  const figuresOut = ramp(frame, FIGURES_OUT, FIGURES_OUT + 10, theme.ease.in);
  const nIn = ramp(frame, N_AT, N_AT + 22, theme.ease.out);

  return (
    <SceneShell light={0.5}>
      <Folio left="02 · WHAT IS HAPPENING" right="DEVELOPING" delay={-6} />
      <Ticker
        top={244}
        delay={4}
        items={[
          "CREATOR ECONOMY",
          "· EXCLUSIVITY TALKS",
          "· TALENT MARKET",
          "· PLATFORM SPEND",
          "· ORIGINALS",
        ]}
      />

      {/* the platform at the head of the rail */}
      <YouTubeMark
        width={168}
        progress={ramp(frame, 4, 22)}
        style={{ position: "absolute", left: 84, top: 356 }}
      />
      <Mono size={24} color={ynColors.bone} style={{ position: "absolute", left: 274, top: 396 }}>
        YOUTUBE
      </Mono>
      <Mono size={20} style={{ position: "absolute", left: 274, top: 432 }}>
        REPORTED TALKS
      </Mono>

      {/* the rail the money walks down */}
      <div
        style={{
          position: "absolute",
          left: RAIL_X,
          top: 500,
          width: 3,
          height: 700 * railDraw,
          background: ynColors.lineStrong,
        }}
      />
      <FlowDot x={RAIL_X + 1} y0={508} y1={1180} at={22} />
      <FlowDot x={RAIL_X + 1} y0={508} y1={1180} at={38} />
      <FlowDot x={RAIL_X + 1} y0={508} y1={1180} at={54} />
      <FlowDot x={RAIL_X + 1} y0={508} y1={1180} at={70} />
      <FlowDot x={RAIL_X + 1} y0={508} y1={1180} at={86} />

      {ROWS.map((r) => (
        <React.Fragment key={r.code}>
          <div
            style={{
              position: "absolute",
              left: RAIL_X,
              top: r.y + CARD_H / 2,
              width: (CARD_X - RAIL_X) * ramp(frame, r.at - 4, r.at + 10),
              height: 2,
              background: ynColors.line,
            }}
          />
          <CreatorCard
            code={r.code}
            meta={r.meta}
            width={CARD_W}
            delay={r.at}
            bar={r.bar}
            dim={1 - nIn * 0.55}
            style={{ position: "absolute", left: CARD_X, top: r.y }}
          />
        </React.Fragment>
      ))}

      {FIGURES.map((f) => (
        <Figure key={f.text} text={f.text} y={f.y} at={f.at} out={figuresOut} />
      ))}

      {/* Netflix takes the column the money was standing in. */}
      {nIn > 0 && (
        <NetflixMark
          height={520}
          progress={1}
          style={{
            position: "absolute",
            left: 726,
            top: 664,
            opacity: nIn,
            transform: `translateX(${interpolate(nIn, [0, 1], [420, 0])}px)`,
          }}
        />
      )}

      <Footnote delay={64} style={{ position: "absolute", left: 84, top: 1256, width: 900 }}>
        Conceptual. Reported multi-million-dollar incentives —
        <br />
        individual terms vary. No deal is confirmed as signed.
      </Footnote>
    </SceneShell>
  );
};
