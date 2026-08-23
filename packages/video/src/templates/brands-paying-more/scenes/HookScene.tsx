// 01 hook — 0–6s. The only beat with a face, and the only one built on
// footage.
//
// The presenter is composited HERE rather than in a <Presenter> layer above
// the scenes: the studio IS this beat's background, so the headline has to sit
// on top of it. A layer above every scene would put the video over the type.
//
// The studio is graded to greyscale like every photograph in this register
// (khaby-silence's rule: the colour budget is one accent per frame, and it is
// never the footage). The neon strip lights survive as bright rim-light, and
// HATE is then the only colour anywhere in the reel's first six seconds.
import React from "react";
import {
  AbsoluteFill,
  OffthreadVideo,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { theme } from "../../../theme";
import { bpmColors, bpmPalette } from "../palette";
import { PRESENTER } from "../presenter";
import { VO_RATE } from "../timeline";
import { Eyebrow, Flash, SceneShell, Shard, Slam, ramp, usePunch } from "../ui";

const SHOT = PRESENTER["p1-hook"];

// The generated footage is landscape 1920×1080; the frame is 1080×1920. Cover
// scale is height-driven (1.778), cropping 63% off the width — the face is
// dead-centre at x≈960 in the source, so the crop stays symmetric.
//
// Landmarks measured off a real frame, source px → where they land at 1.0×:
//   head top y  95 → 169    eyes y 285 → 507
//   chin      y 460 → 818   hands y 960 → 1707
// The face sits in the top 44%; the hoodie and the desk below y≈900 carry
// nothing, which is where the headline slab goes.
const SRC = { w: 1920, h: 1080 } as const;
const SCALE = 1920 / SRC.h;
const OFFSET_X = -(SRC.w * SCALE - 1080) / 2;

// The headline slams on frame 0, not a beat later: frame 0 is the thumbnail
// and the first thing anyone sees, and the avatar happens to be mid-blink
// there. Giving the eye a word to land on is worth more than a clean face.
const BRANDS_AT = 0;
const MORE_AT = 44;
const HATE_AT = 100;
const BREAK_AT = 152;

// The letterform blown apart: a 3×5 tiling of the frame, jittered. At the
// scale HATE reaches by frame 152 the screen is a vermilion field with black
// counters, so rectangles are what the letters have already become.
const SHARDS = Array.from({ length: 15 }, (_, i) => {
  const col = i % 3;
  const row = Math.floor(i / 3);
  return { i, x: col * 380 - 40, y: row * 400 - 40, w: 380, h: 400 };
});

export const HookScene: React.FC<{ kicker: string }> = ({ kicker }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // The footage is measured at 1.0× and plays at VO_RATE, like the voice.
  const life = Math.round((SHOT.duration / VO_RATE) * fps);

  // Slow push on the studio for the whole shot — rule 6, and it keeps a photo
  // avatar from reading as a still photograph.
  const push = interpolate(frame, [0, life], [1, 1.07], {
    easing: theme.ease.inOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // "because people hate their ads" — the word arrives on "hate" and the
  // camera keeps travelling into it until the letters are all there is.
  // ease.in, not inOut: the push accelerates. With a symmetric curve the
  // frame sat inside the letterform — flat orange — for most of a second.
  const grow = ramp(frame, HATE_AT, BREAK_AT, theme.ease.in);
  const hateScale = interpolate(grow, [0, 1], [0.5, 9]);
  // A whisper of fill only. The first cut of this scene wiped the frame to a
  // flat orange plane for a fifth of a second, which read as a render fault
  // rather than a push: at 9× the letterforms themselves are wide orange bars
  // separated by black counters, and that structure is the shot.
  const fill = ramp(frame, BREAK_AT - 16, BREAK_AT) * 0.45;
  const brk = ramp(frame, BREAK_AT, BREAK_AT + 22, theme.ease.in);

  const hateHit = usePunch(HATE_AT, 18);
  const brandsHit = usePunch(BRANDS_AT, 14);
  const shake = hateHit.shake * 0.5 + brandsHit.shake * 0.25;

  // The studio does not survive the push: it dims as HATE takes the frame and
  // is gone by the break.
  const studio = 1 - ramp(frame, HATE_AT + 24, BREAK_AT - 6) * 0.92;

  return (
    <SceneShell exit={false} light={0}>
      <AbsoluteFill style={{ transform: `translate(${shake * 0.35}px, ${shake}px)` }}>
        {/* footage */}
        {frame < life && (
          <div style={{ position: "absolute", inset: 0, overflow: "hidden", opacity: studio }}>
            <div
              style={{
                position: "absolute",
                inset: 0,
                transform: `scale(${push})`,
                transformOrigin: "50% 28%",
              }}
            >
              <OffthreadVideo
                src={staticFile(`presenter/brands-paying-more/${SHOT.file}`)}
                muted
                playbackRate={VO_RATE}
                style={{
                  position: "absolute",
                  left: OFFSET_X,
                  top: 0,
                  width: SRC.w * SCALE,
                  height: SRC.h * SCALE,
                  maxWidth: "none",
                  filter: bpmColors.photo,
                }}
              />
            </div>
          </div>
        )}

        {/* Top wash — the strip lights are the brightest thing in the frame
            and pull the eye off the face. Kept light: the studio is why this
            avatar was chosen. */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            height: 300,
            background: `linear-gradient(180deg, ${bpmPalette.bg}A6, transparent)`,
            opacity: studio,
          }}
        />
        {/* Bottom slab: the headline needs a ground, and the desk and hands
            below y≈900 carry nothing. */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 780,
            bottom: 0,
            opacity: studio,
            background:
              `linear-gradient(180deg, transparent 0%, ${bpmPalette.bg}A8 26%, ` +
              `${bpmPalette.bg}F0 46%, ${bpmPalette.bg} 66%)`,
          }}
        />

        {/* the headline slab */}
        <div style={{ position: "absolute", left: 72, top: 1042, opacity: 1 - grow }}>
          <Eyebrow delay={BRANDS_AT + 4}>{kicker}</Eyebrow>
        </div>
        <div style={{ position: "absolute", left: 72, right: 40, top: 1096, opacity: 1 - grow }}>
          <Slam text="AI BRANDS" at={BRANDS_AT} until={MORE_AT} size={152} align="left" />
          <Slam text="PAY MORE?" at={MORE_AT} until={HATE_AT + 6} size={152} align="left" />
        </div>
        <div
          style={{
            position: "absolute",
            left: 72,
            top: 1290,
            width: 936 * ramp(frame, BRANDS_AT + 10, BRANDS_AT + 30),
            height: 3,
            background: bpmColors.lineStrong,
            opacity: 1 - grow,
          }}
        />

        {/* HATE — the only colour in the first six seconds, and the camera
            keeps going until it is inside the letters. */}
        {frame >= HATE_AT && brk < 1 && (
          <AbsoluteFill
            style={{
              alignItems: "center",
              justifyContent: "center",
              opacity: 1 - brk,
            }}
          >
            <div
              style={{
                fontFamily: theme.fonts.display,
                fontSize: 300,
                fontWeight: 700,
                letterSpacing: "-0.06em",
                lineHeight: 0.9,
                color: bpmPalette.primary,
                whiteSpace: "nowrap",
                transform: `scale(${hateScale * (1 + hateHit.pop * 0.06)})`,
                transformOrigin: "38% 50%",
              }}
            >
              HATE
            </div>
          </AbsoluteFill>
        )}

        {/* Inside the letter there is nothing but the letter. */}
        <AbsoluteFill style={{ background: bpmPalette.primary, opacity: fill * (1 - brk) }} />

        {/* …and then it is not a letter any more. */}
        {brk > 0 &&
          SHARDS.map((s) => (
            <Shard key={`shard-${s.i}`} {...s} progress={brk} color={bpmPalette.primary} />
          ))}
      </AbsoluteFill>

      <Flash energy={hateHit.energy} strength={0.14} />
    </SceneShell>
  );
};
