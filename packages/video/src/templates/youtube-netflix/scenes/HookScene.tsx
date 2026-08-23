// 01 hook — 0–4.5s. Face insert #1, and the only beat built on footage.
//
// The presenter is composited HERE rather than in a <Presenter> layer above
// the scenes: the studio is this beat's background for the first second and a
// half, so the type has to be able to sit on top of it. A layer above every
// scene would put the video over the type.
//
// The move: the reel opens FULL BLEED — frame 0 is the thumbnail and the face
// is the hook — and on the word "millions" the camera pulls back until the
// studio is a broadcast plate bleeding off the right edge, revealing the black
// page it was printed on. $MILLIONS then runs across the bottom with its top
// edge tucked behind the plate, the two platform marks stack down the left
// margin, and STAY / exclusive. take the lower band. On "exclusive" the marks
// tear apart and the camera pushes through the word into beat 02.
//
// The studio is graded to greyscale like every photograph in this register
// (khaby-silence's rule: the colour budget is one accent per frame and it is
// never the footage), so the platform red is the only colour in the frame.
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
import { ynColors, ynPalette } from "../palette";
import { PRESENTER } from "../presenter";
import { VO_RATE } from "../timeline";
import {
  Flash,
  Folio,
  NetflixMark,
  SceneShell,
  Shake,
  Slam,
  YouTubeMark,
  ramp,
  usePunch,
} from "../ui";

const SHOT = PRESENTER["p1-hook"];

// The generated footage is landscape 1920×1080. Both framings below are
// height-driven cover crops (their aspect is well under 16:9), so one formula
// serves the whole move: scale = boxHeight / 1080, centred horizontally.
//
// Landmarks measured off a real frame, source px:
//   head top y  95    eyes y 280    chin y 470    hands y 960
//   face centre x 945 (15px left of frame centre — the crop stays symmetric)
const SRC = { w: 1920, h: 1080 } as const;

// Stage A: the frame itself. Stage B: the broadcast plate — 45% of the frame,
// bleeding off the right edge, with the left margin left for the two marks and
// the bottom band left for the type.
const FULL = { x: 0, y: 0, w: 1080, h: 1920 } as const;
const PLATE = { x: 186, y: 150, w: 894, h: 1050 } as const;

const PULL_AT = 40;
const PULL_END = 66;
const MILLIONS_AT = 48; // the word lands on the word
const MARKS_AT = 70;
const MILLIONS_OUT = 92;
const STAY_AT = 96;
const EXCL_AT = 106;
const TEAR_AT = 110;
const PUSH_AT = 112;

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // The footage is measured at 1.0× and plays at VO_RATE, like the voice.
  const life = Math.round((SHOT.duration / VO_RATE) * fps);

  const pull = ramp(frame, PULL_AT, PULL_END, theme.ease.inOut);
  const box = {
    x: interpolate(pull, [0, 1], [FULL.x, PLATE.x]),
    y: interpolate(pull, [0, 1], [FULL.y, PLATE.y]),
    w: interpolate(pull, [0, 1], [FULL.w, PLATE.w]),
    h: interpolate(pull, [0, 1], [FULL.h, PLATE.h]),
  };
  const scale = box.h / SRC.h;
  const offsetX = -(SRC.w * scale - box.w) / 2;

  // Slow push on the studio for the whole shot — rule 6, and it keeps a photo
  // avatar from reading as a still photograph.
  const breathe = interpolate(frame, [0, life], [1, 1.05], {
    easing: theme.ease.inOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const millionsHit = usePunch(MILLIONS_AT, 18);
  const exclHit = usePunch(EXCL_AT, 16);
  const shake = millionsHit.shake * 0.55 + exclHit.shake * 0.4;

  const millionsIn = ramp(frame, MILLIONS_AT, MILLIONS_AT + 14, theme.ease.out);
  const millionsOut = ramp(frame, MILLIONS_OUT, MILLIONS_OUT + 9, theme.ease.in);
  const marks = ramp(frame, MARKS_AT, MARKS_AT + 18);
  const tear = ramp(frame, TEAR_AT, TEAR_AT + 16, theme.ease.in);

  // The camera goes through the word: it accelerates (ease.in), so the frame
  // never parks inside the letterform.
  const push = ramp(frame, PUSH_AT, durationInFrames - 1, theme.ease.in);
  const plateOut = ramp(frame, PUSH_AT + 4, durationInFrames - 6);

  return (
    <SceneShell exit={false} light={0}>
      <Shake amount={shake}>
        {/* --------------------------------------------------- the plate */}
        {frame < life && plateOut < 1 && (
          <div
            style={{
              position: "absolute",
              left: box.x,
              top: box.y,
              width: box.w,
              height: box.h,
              overflow: "hidden",
              opacity: 1 - plateOut,
              // The plate only earns a border once it IS a plate.
              borderLeft: `${pull * 2}px solid ${ynColors.lineStrong}`,
              borderTop: `${pull * 2}px solid ${ynColors.lineStrong}`,
              borderBottom: `${pull * 2}px solid ${ynColors.lineStrong}`,
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                transform: `scale(${breathe})`,
                transformOrigin: "50% 26%",
              }}
            >
              <OffthreadVideo
                src={staticFile(`presenter/youtube-netflix/${SHOT.file}`)}
                muted
                playbackRate={VO_RATE}
                style={{
                  position: "absolute",
                  left: offsetX,
                  top: 0,
                  width: SRC.w * scale,
                  height: SRC.h * scale,
                  maxWidth: "none",
                  filter: ynColors.photo,
                }}
              />
            </div>
            {/* The strip lights are the brightest thing in the shot and pull
                the eye off the face. Kept light — the studio is why this
                avatar was chosen. */}
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 0,
                height: 300,
                background: `linear-gradient(180deg, ${ynPalette.bg}99, transparent)`,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                height: 340,
                background: `linear-gradient(0deg, ${ynPalette.bg}CC, transparent)`,
              }}
            />
          </div>
        )}

        <Folio
          left="BREAKING"
          right="CREATOR ECONOMY"
          delay={2}
          top={70}
          color={ynColors.bone}
        />

        {/* ------------------------------------------- the two contenders */}
        {/* Down the left margin, on one hairline: the whole story in 150px of
            page. They wear the same red — see palette.ts. */}
        <div
          style={{
            position: "absolute",
            left: 46,
            top: 300,
            width: 3,
            height: 500 * marks,
            background: ynColors.lineStrong,
            opacity: 1 - tear,
          }}
        />
        <YouTubeMark
          width={118}
          progress={marks}
          style={{
            position: "absolute",
            left: 20,
            top: 330 - tear * 300,
            opacity: marks * (1 - tear * 0.2),
          }}
        />
        <NetflixMark
          height={124}
          progress={marks}
          style={{
            position: "absolute",
            left: 42,
            top: 700 + tear * 420,
            opacity: marks * (1 - tear * 0.2),
          }}
        />

        {/* ------------------------------------------------ the lower band */}
        {/* $MILLIONS runs off the right edge and tucks its top behind the
            plate — the brief's "letters behind the subject", earned by
            composition rather than by matting the studio away. */}
        {millionsOut < 1 && (
          <div
            style={{
              position: "absolute",
              left: 34,
              top: 1128,
              fontFamily: theme.fonts.wide,
              fontSize: 168,
              fontWeight: 900,
              lineHeight: 0.9,
              letterSpacing: "-0.045em",
              whiteSpace: "nowrap",
              color: ynColors.bone,
              opacity: millionsIn * (1 - millionsOut),
              transform: `translateY(${interpolate(millionsIn, [0, 1], [90, 0]) + millionsOut * 70}px) scale(${interpolate(millionsIn, [0, 1], [1.14, 1 + millionsHit.pop * 0.02])})`,
              transformOrigin: "0% 50%",
            }}
          >
            $MILLIONS
          </div>
        )}

        {/* STAY / exclusive. — the one serif-italic word this register allows,
            and the only red word in the reel's first five seconds. */}
        <div style={{ position: "absolute", left: 46, top: 1150, opacity: 1 - push }}>
          <Slam text="STAY" at={STAY_AT} size={112} align="left" tracking="-0.04em" />
        </div>
        <div
          style={{
            position: "absolute",
            left: 40,
            top: 1258,
            opacity: 1 - Math.min(1, push * 1.4),
            transform: `scale(${1 + push * 7})`,
            transformOrigin: "22% 50%",
          }}
        >
          <Slam
            text="exclusive."
            at={EXCL_AT}
            size={176}
            align="left"
            color={ynPalette.primary}
            font={theme.fonts.serif}
            weight={400}
            tracking="-0.01em"
          />
        </div>
        <div
          style={{
            position: "absolute",
            left: 46,
            top: 1470,
            width: 620 * ramp(frame, STAY_AT + 6, STAY_AT + 24),
            height: 3,
            background: ynColors.lineStrong,
            opacity: 1 - push,
          }}
        />
      </Shake>

      <Flash energy={millionsHit.energy} strength={0.2} />
      <Flash energy={exclHit.energy} strength={0.14} />
    </SceneShell>
  );
};
