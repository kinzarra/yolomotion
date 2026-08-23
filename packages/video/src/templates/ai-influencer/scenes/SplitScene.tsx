import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { theme } from "../../../theme";
import { aiColors, aiPalette } from "../palette";
import { Her } from "../her";
import { BrandBar, Chip, SceneShell, useIn, useRamp } from "../ui";

// 10–15.5s — split screen: one tired human filming take 47 at 2:47 AM vs the
// AI multiplying into a grid of identical copies. The ninth copy renders as a
// red wireframe — the tell that none of them are real.

// Tired creator hunched over a laptop at 2 AM, with the phone rig still
// rolling — procedural, monochrome, slow head nod.
const TiredCreator: React.FC<{ nod: number }> = ({ nod }) => (
  <svg width={400} height={330} viewBox="0 0 400 330" style={{ display: "block" }}>
    {/* phone on a tripod, filming */}
    <rect x={36} y={112} width={30} height={52} rx={7} fill={aiColors.surfaceLift} stroke={aiColors.lineStrong} strokeWidth={2.5} />
    <circle cx={51} cy={124} r={3.5} fill={aiColors.white} />
    <line x1={51} y1={164} x2={51} y2={218} stroke={aiColors.lineStrong} strokeWidth={4} />
    <line x1={51} y1={218} x2={32} y2={252} stroke={aiColors.lineStrong} strokeWidth={4} strokeLinecap="round" />
    <line x1={51} y1={218} x2={70} y2={252} stroke={aiColors.lineStrong} strokeWidth={4} strokeLinecap="round" />
    {/* desk */}
    <line x1={96} y1={252} x2={384} y2={252} stroke={aiColors.lineStrong} strokeWidth={5} strokeLinecap="round" />
    <line x1={128} y1={252} x2={120} y2={318} stroke={aiColors.lineStrong} strokeWidth={5} strokeLinecap="round" />
    <line x1={352} y1={252} x2={360} y2={318} stroke={aiColors.lineStrong} strokeWidth={5} strokeLinecap="round" />
    {/* laptop: tilted screen + base */}
    <path d="M282,166 L348,158 L356,244 L282,248 Z" fill={aiColors.surfaceStrong} stroke={aiColors.lineStrong} strokeWidth={3} />
    <path d="M286,172 L344,165 L350,238 L287,241 Z" fill={aiColors.ink} opacity={0.9} />
    <line x1={252} y1={250} x2={362} y2={250} stroke={aiColors.lineStrong} strokeWidth={7} strokeLinecap="round" />
    {/* torso slumped over the desk */}
    <path
      d="M150,252 C150,196 166,156 194,146 C226,140 252,180 272,240 L278,252 Z"
      fill={aiColors.surfaceLift}
      stroke={aiColors.lineStrong}
      strokeWidth={3}
    />
    {/* arm dropped onto the desk */}
    <path d="M236,204 C258,222 274,236 292,244" stroke={aiColors.skinShade} strokeWidth={13} strokeLinecap="round" fill="none" />
    {/* head, nodding off toward the screen */}
    <g transform={`rotate(${nod} 196 140)`}>
      <circle cx={196} cy={104} r={30} fill={aiColors.skinShade} />
      <path d="M170,98 C166,72 196,60 216,74 C228,82 228,96 224,104 C214,88 186,86 170,98 Z" fill={aiColors.hair} />
      {/* closed eye + flat mouth: done for today */}
      <path d="M204,104 C208,107 214,107 218,104" stroke={aiColors.ink} strokeWidth={3} strokeLinecap="round" fill="none" />
      <path d="M208,120 L220,119" stroke={aiColors.ink} strokeWidth={3} strokeLinecap="round" />
    </g>
    {/* coffee */}
    <rect x={168} y={224} width={26} height={28} rx={5} fill={aiColors.surfaceStrong} stroke={aiColors.lineStrong} strokeWidth={3} />
  </svg>
);

export const SplitScene: React.FC = () => {
  const frame = useCurrentFrame();
  const slideL = useRamp(0, 12, theme.ease.out);
  const slideR = useRamp(4, 16, theme.ease.out);
  const divider = useRamp(8, 22, theme.ease.inOut);
  const nod = Math.sin(frame / 26) * 4 - 3;
  const gridStart = 26;

  return (
    <SceneShell>
      <BrandBar chapter="03 · HUMAN VS AI" />

      {/* left — the human */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 280,
          bottom: 0,
          width: 540,
          opacity: slideL,
          transform: `translateX(${interpolate(slideL, [0, 1], [-140, 0])}px)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontFamily: theme.fonts.mono,
            fontSize: 30,
            fontWeight: 700,
            letterSpacing: "0.24em",
            color: aiPalette.textDim,
          }}
        >
          HUMAN
        </span>
        <div style={{ marginTop: 130 }}>
          <TiredCreator nod={nod} />
        </div>
        <div style={{ marginTop: 90, display: "flex", flexDirection: "column", gap: 22, alignItems: "center" }}>
          <Chip delay={34} size={26}>TAKE 47</Chip>
          <Chip delay={42} size={26}>2:47 AM</Chip>
          <Chip delay={50} size={26}>1 VIDEO / DAY</Chip>
        </div>
      </div>

      {/* right — the machine */}
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 280,
          bottom: 0,
          width: 540,
          opacity: slideR,
          transform: `translateX(${interpolate(slideR, [0, 1], [140, 0])}px)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontFamily: theme.fonts.mono,
            fontSize: 30,
            fontWeight: 700,
            letterSpacing: "0.24em",
            color: aiPalette.text,
          }}
        >
          AI
        </span>
        <div
          style={{
            marginTop: 60,
            display: "grid",
            gridTemplateColumns: "repeat(3, 128px)",
            columnGap: 22,
            rowGap: 4,
          }}
        >
          {Array.from({ length: 9 }).map((_, i) => {
            const p = interpolate(frame, [gridStart + i * 5, gridStart + i * 5 + 12], [0, 1], {
              easing: theme.ease.out,
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const wireframe = i === 8;
            return (
              <div
                key={i}
                style={{
                  opacity: p,
                  transform: `translateY(${interpolate(p, [0, 1], [30, 0])}px) scale(${interpolate(p, [0, 1], [0.7, 1])})`,
                }}
              >
                <Her width={128} wire={wireframe ? 1 : 0} />
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 56, display: "flex", flexDirection: "column", gap: 22, alignItems: "center" }}>
          <Chip delay={78} size={26}>NEVER TIRED</Chip>
          <Chip delay={120} red size={30}>
            HUNDREDS / DAY
          </Chip>
        </div>
      </div>

      {/* divider */}
      <div
        style={{
          position: "absolute",
          left: 538,
          top: 300,
          width: 4,
          height: 1180,
          borderRadius: 4,
          background: aiColors.lineStrong,
          transform: `scaleY(${divider})`,
          transformOrigin: "top",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 496,
          top: 850,
          width: 88,
          height: 88,
          borderRadius: "50%",
          background: aiColors.surfaceLift,
          border: `1px solid ${aiColors.lineStrong}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: theme.fonts.display,
          fontSize: 34,
          fontWeight: 700,
          color: aiPalette.text,
          opacity: divider,
          transform: `scale(${divider}) rotate(${interpolate(divider, [0, 1], [-90, 0])}deg)`,
        }}
      >
        VS
      </div>
    </SceneShell>
  );
};
