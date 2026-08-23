// 07 crazy — 34.4–36.8s. Face insert #2, and the shortest beat in the reel.
//
// It has to read as an interruption, so it is composed as the opposite of the
// hook: no plate, no pull-back, no folio — full bleed, pushed in, and the face
// hard against the LEFT of the frame instead of inside a box on the right. The
// cut lands mid-sentence because the voice line starts on frame 0 of the beat.
//
// The type sits low, over the hoodie and the desk, where the studio carries no
// information — the same discipline as the hook, mirrored.
import React from "react";
import {
  OffthreadVideo,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { theme } from "../../../theme";
import { ynColors, ynPalette } from "../palette";
import { PRESENTER } from "../presenter";
import { VO_RATE } from "../timeline";
import { Flash, Mono, SceneShell, Slam, ramp, usePunch } from "../ui";

const SHOT = PRESENTER["p2-crazy"];

const SRC = { w: 1920, h: 1080 } as const;
const FACE_X = 945; // source px
// Height-driven cover of the full frame, then anchored so the face sits at a
// third of the width rather than dead centre — that alone makes it a different
// shot from the hook without upscaling the source past 1.1×.
const BASE = 1920 / SRC.h;
const FACE_TARGET_X = 372;

const NEW_AT = 12;
const HOLLY_AT = 22;

export const CrazyScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const life = Math.round((SHOT.duration / VO_RATE) * fps);

  // A hard, accelerating push for the whole 2.4s — an interrupt does not drift.
  const push = interpolate(frame, [0, durationInFrames], [1.0, 1.11], {
    easing: theme.ease.out,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scale = BASE * push;
  const offsetX = FACE_TARGET_X - FACE_X * scale;
  const offsetY = -(SRC.h * scale - 1920) / 2;

  const hit = usePunch(HOLLY_AT, 18);
  const out = ramp(frame, durationInFrames - 8, durationInFrames - 1, theme.ease.in);

  return (
    <SceneShell exit={false} light={0}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          transform: `translate(${hit.shake * 0.4}px, ${hit.shake}px)`,
        }}
      >
        {frame < life && (
          <OffthreadVideo
            src={staticFile(`presenter/youtube-netflix/${SHOT.file}`)}
            muted
            playbackRate={VO_RATE}
            style={{
              position: "absolute",
              left: offsetX,
              top: offsetY,
              width: SRC.w * scale,
              height: SRC.h * scale,
              maxWidth: "none",
              filter: ynColors.photo,
            }}
          />
        )}

        {/* ground for the type — the desk and the hoodie carry nothing */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 760,
            bottom: 0,
            background:
              `linear-gradient(180deg, transparent 0%, ${ynPalette.bg}C4 26%, ` +
              `${ynPalette.bg}F2 46%, ${ynPalette.bg} 66%)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            height: 240,
            background: `linear-gradient(180deg, ${ynPalette.bg}A6, transparent)`,
          }}
        />

        {/* the word that was on screen a second ago, being replaced */}
        <div style={{ position: "absolute", right: 66, top: 1074, opacity: 1 - ramp(frame, NEW_AT - 4, NEW_AT + 6) }}>
          <Mono size={30} color={ynColors.bone}>
            CREATORS
          </Mono>
        </div>

        <div style={{ position: "absolute", right: 62, top: 1050, textAlign: "right", opacity: 1 - out }}>
          <Slam text="THE NEW" at={NEW_AT} size={104} align="right" />
        </div>
        <div style={{ position: "absolute", right: 56, top: 1156, textAlign: "right", opacity: 1 - out }}>
          <Slam
            text="HOLLYWOOD?"
            at={HOLLY_AT}
            size={148}
            align="right"
            color={ynPalette.primary}
          />
        </div>
        <div
          style={{
            position: "absolute",
            right: 62,
            top: 1350,
            width: 620 * ramp(frame, HOLLY_AT + 8, HOLLY_AT + 24),
            height: 3,
            background: ynColors.lineStrong,
            opacity: 1 - out,
          }}
        />
      </div>

      <Flash energy={hit.energy} strength={0.16} />
    </SceneShell>
  );
};
