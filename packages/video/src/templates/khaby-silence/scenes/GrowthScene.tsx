import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { theme } from "../../../theme";
import { ksColors, ksPalette } from "../palette";
import { Eyebrow, Flash, Num, Photo, SceneShell, Slam, Tag, usePunch } from "../ui";

// 40.5–45.5s. A ladder from 2020 to 100M+ and the camera rides up it, faster
// and faster, until the flash — then #1, in the accent, with the stage photo
// in front of it and two more flashes, like walking into an editorial shoot.
// Gaps widen up the ladder — the exponential, drawn. 100M+ starts above the
// frame and the ride brings it down to y≈700 at the moment the flash hits.
const RUNGS = [
  { label: "2020", y: 0, year: true },
  { label: "1M", y: -360 },
  { label: "10M", y: -800 },
  { label: "50M", y: -1320 },
  { label: "100M+", y: -1920 },
];
const BASE_Y = 1500;
const RIDE = { from: 6, to: 78, dist: 1120 };
const TOP_AT = 80;
const ONE_AT = 84;
const FLASHES = [
  { at: TOP_AT, k: 1 },
  { at: TOP_AT + 14, k: 0.55 },
  { at: TOP_AT + 28, k: 0.35 },
];

const camAt = (frame: number) =>
  interpolate(frame, [RIDE.from, RIDE.to], [0, RIDE.dist], {
    easing: theme.ease.in,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const Ladder: React.FC<{ cam: number; opacity: number }> = ({ cam, opacity }) => (
  <div style={{ position: "absolute", inset: 0, opacity, transform: `translateY(${cam}px)` }}>
    <div
      style={{
        position: "absolute",
        left: 118,
        top: BASE_Y - 2200,
        width: 2,
        height: 2500,
        background: ksColors.lineStrong,
      }}
    />
    {RUNGS.map((r) => (
      <div
        key={r.label}
        style={{
          position: "absolute",
          left: 100,
          top: BASE_Y + r.y,
          display: "flex",
          alignItems: "center",
          gap: 40,
        }}
      >
        <div style={{ width: 38, height: 2, background: ksColors.bone }} />
        {r.year ? (
          <div
            style={{
              fontFamily: theme.fonts.mono,
              fontSize: 40,
              fontWeight: 600,
              letterSpacing: "0.18em",
              color: ksPalette.textDim,
            }}
          >
            {r.label}
          </div>
        ) : (
          <Num size={150} style={{ transform: "translateY(-8px)" }}>
            {r.label}
          </Num>
        )}
      </div>
    ))}
  </div>
);

export const GrowthScene: React.FC<{ photo: string }> = ({ photo }) => {
  const frame = useCurrentFrame();
  const cam = camAt(frame);
  const vel = cam - camAt(frame - 1);
  const hits = FLASHES.map((f) => usePunch(f.at, 14));
  const flash = Math.max(...hits.map((h, i) => h.energy * FLASHES[i].k));
  const shake = hits[0].shake * 0.5;

  return (
    <SceneShell>
      <AbsoluteFill style={{ transform: `translate(${shake * 0.3}px, ${shake}px)` }}>
        {frame < TOP_AT && (
          <>
            {/* ghosts trail the ladder at its own velocity — motion blur */}
            <Ladder cam={cam - vel * 1.2} opacity={0.07} />
            <Ladder cam={cam - vel * 0.9} opacity={0.11} />
            <Ladder cam={cam - vel * 0.6} opacity={0.17} />
            <Ladder cam={cam - vel * 0.3} opacity={0.28} />
            <Ladder cam={cam} opacity={1} />
          </>
        )}

        {frame >= TOP_AT && (
          <>
            <div style={{ position: "absolute", left: 72, top: 492 }}>
              <Eyebrow delay={TOP_AT + 2}>Khaby Lame</Eyebrow>
            </div>
            <div style={{ position: "absolute", left: 60, top: 540 }}>
              <Slam
                text="#1"
                at={ONE_AT}
                size={440}
                font={theme.fonts.wide}
                weight={900}
                color={ksPalette.primary}
                tracking="-0.06em"
                align="left"
              />
            </div>
            <div style={{ position: "absolute", left: 470, top: 450 }}>
              <Photo src={photo} width={620} delay={TOP_AT + 2} rise={120} kb={1.03} fade={160} />
            </div>
            <div style={{ position: "absolute", left: 72, top: 1010 }}>
              <Tag delay={TOP_AT + 20} size={20}>
                Most-followed on TikTok · 2022
              </Tag>
            </div>
          </>
        )}
      </AbsoluteFill>

      <Flash energy={flash} strength={0.55} />
    </SceneShell>
  );
};
