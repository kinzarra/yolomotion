// 01 hook — the only beat with a face, and the only one built on footage.
//
// The presenter is composited HERE rather than in a <Presenter> layer above
// the scenes (the pattern ВЫПУСК 04 uses) for one reason: the studio is the
// background of this beat, so the headline has to sit on top of it. A layer
// above every scene would put the video over the type instead.
//
// No brand bar. The hairline of the series bar sits at y≈180 and the avatar's
// hair reaches y≈171 in this crop — they collide. A hook is also the one place
// where chrome costs more than it earns, so the bar starts at beat 02.
import React from "react";
import { interpolate, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../../theme";
import { useIn, useRamp, usePunch } from "../../../reel";
import { itColors, itPalette } from "../palette";
import { PRESENTER } from "../presenter";
import { VO_RATE } from "../timeline";
import { Flash, Glitch, SceneShell } from "../ui";

const SHOT = PRESENTER["p1-hook"];

// The generated footage is landscape 1920×1080; the frame is 1080×1920. Cover
// scale is height-driven (1.778), which crops 63% off the width — the face is
// dead-centre at x≈960 in the source, so the crop stays symmetric and nothing
// has to be nudged sideways.
//
// Landmarks measured off a real frame on a 96×54 grid, in source pixels →
// where they land in the 1080×1920 frame at scale 1.0:
//   head top  y  96 → 171     eyes y 280 → 498
//   chin      y 470 → 836     hands y 960 → 1707
// That puts the face in the top 44% and leaves the hoodie and the desk for the
// headline slab, which is exactly the split this beat wants.
const SRC = { w: 1920, h: 1080 } as const;
const SCALE = 1920 / SRC.h;
const OFFSET_X = -(SRC.w * SCALE - 1080) / 2;

export const HookScene: React.FC<{ applicants: string }> = ({ applicants }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // The footage is measured at 1.0× and plays at VO_RATE, like the voice.
  const life = Math.round((SHOT.duration / VO_RATE) * fps);

  // Slow push toward the face for the whole shot — rule 6, and it keeps a
  // static photo avatar from reading as a still.
  const push = interpolate(frame, [0, life], [1, 1.07], {
    easing: theme.ease.inOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // «убили» lands near the end of the line; the glitch builds from there and
  // takes the studio with it, so the cut into beat 02 happens mid-tear.
  const tear = useRamp(life - 16, durationInFrames - 2, theme.ease.in);
  const punch = usePunch(10, 18);
  const numberIn = useIn(6, "snappy");
  const lineIn = useIn(13, "smooth");

  return (
    <SceneShell shake={punch.shake * 0.5}>
      {/* The footage and the type each get their own <Glitch>; the scrims
          between them get none. Glitch composites two channel copies in
          `screen` blend mode, and screening a near-black opaque scrim onto
          itself twice lifts the whole frame to mid-grey — the first cut of
          this scene washed out at the tear for exactly that reason. Only
          layers that are mostly transparent may be glitched. */}
      <Glitch amount={tear * 0.85} bands={7} style={{ position: "absolute", inset: 0 }}>
        {frame < life && (
          <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
            <div
              style={{
                position: "absolute",
                inset: 0,
                transform: `scale(${push})`,
                transformOrigin: "50% 30%",
              }}
            >
              <OffthreadVideo
                src={staticFile(`presenter/no-it-in-russia/${SHOT.file}`)}
                muted
                playbackRate={VO_RATE}
                style={{
                  position: "absolute",
                  left: OFFSET_X,
                  top: 0,
                  width: SRC.w * SCALE,
                  height: SRC.h * SCALE,
                  maxWidth: "none",
                }}
              />
            </div>
          </div>
        )}
      </Glitch>

      {/* Top wash: the studio's magenta strip lights are the brightest thing
          in the frame and pull the eye off the face. Kept light — the studio
          is why this avatar was chosen, and burying it defeats the point. */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: 260,
          background: `linear-gradient(180deg, ${itPalette.bg}8C, transparent)`,
        }}
      />
      {/* Bottom slab: the headline needs a ground, and the desk and hands
          below y≈1700 carry nothing. */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 700,
          bottom: 0,
          background:
            `linear-gradient(180deg, transparent 0%, ${itPalette.bg}B8 34%, ` +
            `${itPalette.bg}F2 52%, ${itPalette.bg} 74%)`,
        }}
      />

      <Glitch amount={tear * 0.85} bands={7} style={{ position: "absolute", inset: 0 }}>
        {/* The number is the hook. Red, because 24-per-opening is the alarm —
            lime is reserved for the answer eight beats later. */}
        <div
          style={{
            position: "absolute",
            left: 90,
            right: 90,
            top: 1004,
            display: "flex",
            alignItems: "center",
            gap: 34,
          }}
        >
          <span
            style={{
              fontFamily: theme.fonts.wide,
              fontSize: 216,
              fontWeight: 900,
              lineHeight: 0.86,
              letterSpacing: "-0.05em",
              color: itColors.bad,
              opacity: Math.min(1, numberIn * 1.5),
              transform: `scale(${interpolate(numberIn, [0, 1], [2.2, 1 + punch.pop * 0.05])})`,
              filter: `drop-shadow(0 0 54px ${itColors.badGlow})`,
            }}
          >
            {applicants}
          </span>
          <span
            style={{
              fontFamily: theme.fonts.wide,
              fontSize: 58,
              fontWeight: 800,
              lineHeight: 1.14,
              letterSpacing: "-0.02em",
              color: itPalette.text,
              opacity: lineIn,
              transform: `translateX(${interpolate(lineIn, [0, 1], [42, 0])}px)`,
            }}
          >
            ЧЕЛОВЕКА
            <br />
            НА 1 ВАКАНСИЮ
          </span>
        </div>

        {/* Hairline under the block: the only thing tying the type to the
            studio, and it draws itself rather than fading in. */}
        <div
          style={{
            position: "absolute",
            left: 90,
            top: 1290,
            width: 900 * lineIn,
            height: 3,
            background: itColors.bad,
            opacity: 0.7,
          }}
        />
      </Glitch>
      <Flash amount={punch.energy * 0.5} color={itColors.bad} />
      {/* Only the last third of the tear flashes. Driving the flash off `tear`
          directly made it a slow white wash across the whole exit instead of
          a hit on the cut. */}
      <Flash amount={Math.max(0, (tear - 0.72) / 0.28)} color={itPalette.text} />
    </SceneShell>
  );
};
