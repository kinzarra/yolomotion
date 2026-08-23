import React from "react";
import { interpolate, random, useCurrentFrame } from "remotion";
import { theme } from "../../../theme";
import { ovColors, ovPalette } from "../palette";
import {
  BrandBar,
  Chip,
  Counter,
  FrameGlitch,
  INFLUENCERS,
  SceneShell,
  useIn,
} from "../ui";

// 15.5–20s — the deliberate slow-down. Five invoices thud onto a stack while
// the same little audience watches the same ad on repeat above them; then the
// INVISIBLE INFLUENCER TAX stamp slams across the pile. Holds to breathe.
const STAMP = 40;

// The same-audience huddle above the stack (reuses the scene-2 dot language).
const HUDDLE = Array.from({ length: 26 }).map((_, i) => {
  const r = (k: string) => random(`iv-${i}-${k}`);
  const a = r("a") * Math.PI * 2;
  const rad = 12 + r("r") * 88;
  return {
    x: Math.cos(a) * rad,
    y: Math.sin(a) * rad * 0.62,
    size: 10 + Math.round(r("s") * 5),
    delay: i * 0.6,
  };
});

const InvoiceCard: React.FC<{ index: number; delay: number }> = ({ index, delay }) => {
  const frame = useCurrentFrame();
  const p = useIn(delay, "bouncy");
  const inf = INFLUENCERS[index];
  const rot = (index % 2 === 0 ? -1 : 1) * (2 + index * 0.7);
  const settleRot = interpolate(p, [0, 1], [rot * 3, rot]);
  const breathe = Math.sin(frame / 28 + index * 1.3) * 2.5;
  return (
    <div
      style={{
        position: "absolute",
        left: 540 - 300,
        top: 700 + index * 68,
        width: 600,
        borderRadius: 26,
        border: `1px solid ${ovColors.lineStrong}`,
        background: ovColors.surfaceLift,
        boxShadow: ovColors.shadow,
        padding: "26px 34px 24px",
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [-420, 0]) + breathe}px) scale(${interpolate(p, [0, 1], [1.18, 1])}) rotate(${settleRot}deg)`,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          fontFamily: theme.fonts.mono,
          fontSize: 25,
          fontWeight: 700,
          letterSpacing: "0.1em",
          color: ovPalette.textDim,
        }}
      >
        <span>INVOICE #00{index + 1}</span>
        <span style={{ color: ovPalette.text }}>{inf.handle}</span>
      </div>
      <div
        style={{
          marginTop: 18,
          paddingTop: 18,
          borderTop: `1px solid ${ovColors.line}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
        }}
      >
        <span
          style={{
            fontFamily: theme.fonts.body,
            fontSize: 27,
            fontWeight: 600,
            color: ovPalette.textDim,
          }}
        >
          Sponsored reel · 1 placement
        </span>
        <span
          style={{
            fontFamily: theme.fonts.display,
            fontSize: 44,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: ovPalette.text,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {inf.amount}
        </span>
      </div>
    </div>
  );
};

export const InvoiceScene: React.FC = () => {
  const frame = useCurrentFrame();

  const stampIn = useIn(STAMP, "bouncy");
  const burst = interpolate(frame, [STAMP - 3, STAMP, STAMP + 5, STAMP + 11], [0, 1, 1, 0], {
    easing: theme.ease.inOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const replayPulse = Math.sin(frame / 8) * 0.5 + 0.5;
  const huddleIn = useIn(2, "smooth");

  return (
    <SceneShell>
      <BrandBar chapter="04 · THE INVISIBLE TAX" />

      {/* the same audience, watching the same ad on repeat */}
      <div
        style={{
          position: "absolute",
          left: 540 - 150,
          top: 460,
          width: 300,
          height: 160,
          opacity: huddleIn,
          transform: `scale(${interpolate(huddleIn, [0, 1], [0.7, 1])})`,
        }}
      >
        {HUDDLE.map((d, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 150 + d.x,
              top: 80 + d.y + Math.sin(frame / 24 + i) * 3,
              width: d.size,
              height: d.size,
              borderRadius: "50%",
              background: "rgba(255, 59, 77, 0.6)",
            }}
          />
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 642,
          display: "flex",
          justifyContent: "center",
          gap: 14,
          alignItems: "center",
          fontFamily: theme.fonts.mono,
          fontSize: 25,
          fontWeight: 700,
          letterSpacing: "0.12em",
          color: ovPalette.textDim,
          opacity: huddleIn * 0.95,
        }}
      >
        {/* replay glyph — CSS triangle, no emoji */}
        <span
          style={{
            width: 0,
            height: 0,
            borderTop: "11px solid transparent",
            borderBottom: "11px solid transparent",
            borderLeft: `17px solid ${ovPalette.textDim}`,
            opacity: 0.5 + replayPulse * 0.5,
          }}
        />
        SAME AD · SAME PEOPLE · ×5
      </div>

      {/* the invoice stack */}
      {INFLUENCERS.map((_, i) => (
        <InvoiceCard key={i} index={i} delay={6 + i * 7} />
      ))}

      {/* running total */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1235,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Chip delay={10} size={31}>
          TOTAL SPENT&nbsp;
          <Counter
            to={12000}
            delay={12}
            duration={32}
            format={(v) => `$${Math.round(v).toLocaleString("en-US")}`}
            style={{ color: ovPalette.text }}
          />
        </Chip>
      </div>

      {/* THE STAMP */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 830,
          display: "flex",
          justifyContent: "center",
          opacity: stampIn,
          transform: `scale(${interpolate(stampIn, [0, 1], [2.6, 1])}) rotate(${interpolate(stampIn, [0, 1], [4, -7])}deg)`,
        }}
      >
        <div
          style={{
            padding: "30px 44px",
            borderRadius: 20,
            border: `6px solid ${ovColors.bad}`,
            background: "rgba(5, 8, 7, 0.78)",
            boxShadow: `0 0 80px ${ovColors.badGlow}, inset 0 0 44px rgba(255, 59, 77, 0.16)`,
            fontFamily: theme.fonts.display,
            fontSize: 74,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            textAlign: "center",
            lineHeight: 1.05,
            color: ovColors.bad,
            textShadow: `0 0 40px ${ovColors.badGlow}`,
            maxWidth: 880,
          }}
        >
          INVISIBLE
          <br />
          INFLUENCER TAX
        </div>
      </div>

      <FrameGlitch intensity={burst * 0.8} seed="invoice" tone="bad" />
    </SceneShell>
  );
};
