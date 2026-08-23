import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../../theme";
import { ksColors, ksPalette } from "../palette";
import { Kinetic, Mono, SceneShell } from "../ui";

// 12.5–17s. Early posts fly past — small cards, small numbers, labelled as
// illustration — then everything fades, the page goes fully black for 0.3s,
// and THEN HE NOTICED something. lands with a slow push-in.
const CARDS = [
  { views: "137", likes: "2" },
  { views: "284", likes: "5" },
  { views: "512", likes: "9" },
  { views: "96", likes: "1" },
  { views: "341", likes: "4" },
];
const CARD_W = 250;
const CARD_H = 440;
const GAP = 40;
const FADE_AT = 48;
const TEXT_AT = 68;

const rowX = (frame: number) =>
  interpolate(frame, [0, 56], [1180, -1000], {
    easing: theme.ease.inOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const Card: React.FC<{ views: string; likes: string; i: number }> = ({ views, likes, i }) => (
  <div
    style={{
      position: "absolute",
      left: i * (CARD_W + GAP),
      top: 0,
      width: CARD_W,
      height: CARD_H,
      borderRadius: 18,
      background: ksColors.surfaceStrong,
      border: `1px solid ${ksColors.line}`,
      overflow: "hidden",
    }}
  >
    {/* an anonymous thumbnail: a dim figure, never a likeness */}
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: `radial-gradient(circle at 50% 42%, ${ksColors.dim}, ${ksColors.surfaceStrong} 70%)`,
        opacity: 0.7,
      }}
    />
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: 120,
        width: 70,
        height: 70,
        marginLeft: -35,
        borderRadius: "50%",
        background: ksColors.ink,
        opacity: 0.6,
      }}
    />
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: 200,
        width: 150,
        height: 120,
        marginLeft: -75,
        borderRadius: "75px 75px 0 0",
        background: ksColors.ink,
        opacity: 0.6,
      }}
    />
    <svg
      width={34}
      height={34}
      viewBox="0 0 24 24"
      style={{ position: "absolute", left: "50%", top: "46%", marginLeft: -17, opacity: 0.55 }}
    >
      <path d="M7 4.5v15l12-7.5z" fill={ksColors.bone} />
    </svg>
    <div
      style={{
        position: "absolute",
        left: 18,
        right: 18,
        bottom: 20,
        display: "flex",
        flexDirection: "column",
        gap: 6,
        fontFamily: theme.fonts.mono,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
      }}
    >
      <div style={{ fontSize: 30, fontWeight: 700, color: ksPalette.text }}>
        {views} <span style={{ fontSize: 16, color: ksPalette.textDim }}>views</span>
      </div>
      <div style={{ fontSize: 16, color: ksPalette.textDim }}>{likes} likes</div>
    </div>
  </div>
);

export const NobodyScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const fade = interpolate(frame, [FADE_AT, FADE_AT + 10], [1, 0], {
    easing: theme.ease.in,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const x = rowX(frame);
  const vel = x - rowX(frame - 1);
  const push = interpolate(frame, [TEXT_AT, durationInFrames], [1, 1.07], {
    easing: theme.ease.inOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const light = frame < TEXT_AT ? fade : interpolate(frame, [TEXT_AT, TEXT_AT + 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <SceneShell light={light}>
      <AbsoluteFill style={{ opacity: fade }}>
        {/* the row, with two ghost copies trailing at the row's own velocity */}
        {[1, 0.5, 0].map((lag, k) => (
          <div
            key={k}
            style={{
              position: "absolute",
              left: x - vel * lag,
              top: 620,
              opacity: k === 2 ? 1 : k === 1 ? 0.22 : 0.1,
            }}
          >
            {CARDS.map((c, i) => (
              <Card key={i} i={i} {...c} />
            ))}
          </div>
        ))}
        <div style={{ position: "absolute", left: 72, top: 1120 }}>
          <Mono size={15} color={ksPalette.textDim}>
            Illustrative — not actual statistics
          </Mono>
        </div>
      </AbsoluteFill>

      {/* after the black */}
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${push})`,
        }}
      >
        <div style={{ width: 900, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <Kinetic text="THEN HE NOTICED" delay={TEXT_AT} per={5} size={104} />
          <Kinetic text="something." delay={TEXT_AT + 16} size={104} italic={[0]} />
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};
