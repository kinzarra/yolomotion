// Beat 8 — the formula. Four links stacked — ГОСДОЛГ, ПРАВИЛА, ШОРТЫ, ETF —
// and a lime line that draws itself down through them, lighting each one as
// it arrives. The line head is the only thing that glows.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { theme } from "../../../theme";
import { btcPalette } from "../palette";
import { BrandBar, ChainNode, Eyebrow, SceneShell } from "../ui";

const LINKS = [
  { label: "ГОСДОЛГ", note: "спичка", at: 22 },
  { label: "ПРАВИЛА", note: "уверенность", at: 80 },
  { label: "ШОРТЫ", note: "бензин", at: 138, tone: "bad" as const },
  { label: "ETF", note: "огонь", at: 184 },
];
const TOP = 470;
const STEP = 222;
const X = 540;

export const FormulaScene: React.FC<{ series: string; episode: string }> = ({ series, episode }) => {
  const frame = useCurrentFrame();
  // the line reaches link i exactly at LINKS[i].at
  const reach = (() => {
    for (let i = LINKS.length - 1; i >= 1; i -= 1) {
      if (frame >= LINKS[i - 1].at) {
        const p = interpolate(frame, [LINKS[i - 1].at + 16, LINKS[i].at], [i - 1, i], {
          easing: theme.ease.inOut,
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        if (frame < LINKS[i].at || i === LINKS.length - 1) return p;
      }
    }
    return 0;
  })();
  const headY = TOP + reach * STEP;
  const hot = (i: number) =>
    interpolate(frame, [LINKS[i].at, LINKS[i].at + 4, LINKS[i].at + 40], [0, 1, 0], {
      easing: theme.ease.out,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

  return (
    <SceneShell>
      <BrandBar series={series} episode={episode} />

      <AbsoluteFill style={{ alignItems: "center", paddingTop: 330 }}>
        <Eyebrow delay={2}>Формула ралли</Eyebrow>
      </AbsoluteFill>

      {/* the line, behind the links */}
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <line x1={X} y1={TOP} x2={X} y2={TOP + STEP * (LINKS.length - 1)} stroke={btcPalette.textDim} strokeWidth={3} strokeDasharray="6 10" opacity={0.5} />
        <line
          x1={X}
          y1={TOP}
          x2={X}
          y2={headY}
          stroke={btcPalette.primary}
          strokeWidth={10}
          strokeLinecap="square"
          style={{ filter: `drop-shadow(0 0 14px ${btcPalette.glow})` }}
        />
        {frame >= LINKS[0].at && (
          <>
            <circle cx={X} cy={headY} r={28 + Math.sin(frame / 3) * 5} fill={btcPalette.primary} opacity={0.25} />
            <circle cx={X} cy={headY} r={14} fill={btcPalette.primary} />
          </>
        )}
      </svg>

      {LINKS.map((l, i) => (
        <div key={l.label} style={{ position: "absolute", left: 0, right: 0, top: TOP + i * STEP, display: "flex", justifyContent: "center", transform: "translateY(-50%)" }}>
          <ChainNode
            label={l.label}
            note={l.note}
            delay={4 + i * 6}
            lit={frame >= l.at ? 1 : 0}
            hot={hot(i)}
            tone={l.tone ?? "hero"}
            width={640}
            size={62}
          />
        </div>
      ))}
    </SceneShell>
  );
};
