// 01 hook — 0–4.5s. Face insert #1, and the only beat built on footage.
//
// This is the third cut of the hook, and the first two were the same idea: the
// footage shrank into a broadcast plate and the type lived in the black band
// underneath it. That composition is defensible on a page and wrong for a
// Short — it makes the face small, leaves 40% of the frame empty and black,
// and the whole thing reads dim. So the plate is gone.
//
// What the hook does instead:
//   * the face is FULL BLEED for all 4.5s and IN COLOUR — the neon studio is
//     the brightest asset this reel owns, and greyscaling it on frame 0 threw
//     that away. Colour drains to the reel's monochrome on the jump-cut at
//     f88, so the hook hands over to an editorial piece instead of sitting
//     outside it. The drain is the deviation, and it is one number (`sat`).
//   * both platform marks are on frame 0, oversized and cropped by the frame
//     edges, so the poster frame already says YouTube vs Netflix.
//   * $MILLIONS is knocked white out of a red slab that wipes across the lower
//     third. News-strap language, not a caption sitting under a picture.
//   * two hard scale jumps (f44, f88) instead of one smooth pull-back. A Short
//     cuts; it does not glide.
//
// The one thing carried over from the editorial register is the ending: STAY /
// exclusive. in the serif italic, and the camera pushing through the word into
// red — that is what the cut into beat 02 is built on.
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
  NetflixMark,
  SceneShell,
  Shake,
  Slam,
  YouTubeMark,
  ramp,
  usePunch,
} from "../ui";

const SHOT = PRESENTER["p1-hook"];

// The generated footage is landscape 1920×1080 and the frame is 1080×1920, so
// cover is height-driven: 1.7778, cropping 63% off the width. The face sits at
// x≈945 in the source, 15px left of centre, so a centred crop needs no nudge.
//
// Landmarks, source px → where they land at zoom 1.0:
//   head top y 95 → 169   eyes 280 → 498   chin 470 → 836   hands 960 → 1707
const SRC = { w: 1920, h: 1080 } as const;
const BASE = 1920 / SRC.h;

// Beat clock, in frames, against the 4.0s read of 01-hook at VO_RATE:
//   "millions" f45–f66   "stay" f91–f98   "exclusive." f98–f120
const KICKER_AT = 6;
const KICKER_OUT = 38;
const SLAB_AT = 44; // jump-cut #1 — the red bar takes the lower third
const SLAB_OUT = 78;
const DRAIN_AT = 88; // jump-cut #2 — colour leaves, the reel's palette arrives
const STAY_AT = 92;
const EXCL_AT = 102;
const TEAR_AT = 104;
const PUSH_AT = 110;

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // The footage is measured at 1.0× and plays at VO_RATE, like the voice.
  const life = Math.round((SHOT.duration / VO_RATE) * fps);

  const slabHit = usePunch(SLAB_AT, 18);
  const drainHit = usePunch(DRAIN_AT, 14);
  const exclHit = usePunch(EXCL_AT, 16);
  const shake = slabHit.shake * 0.7 + drainHit.shake * 0.4 + exclHit.shake * 0.4;

  // Two hard steps with a little drift inside each, rather than one long move:
  // the frame has to feel cut, not driven.
  const step1 = frame >= SLAB_AT ? 1 : 0;
  const step2 = frame >= DRAIN_AT ? 1 : 0;
  const drift = interpolate(frame, [0, durationInFrames], [0, 0.05], {
    easing: theme.ease.inOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const zoom = 1 + step1 * 0.11 - step2 * 0.11 + drift;
  const scale = BASE * zoom;
  const offsetX = -(SRC.w * scale - 1080) / 2;
  const offsetY = -(SRC.h * scale - 1920) / 2;

  // Colour is the hook's whole argument for existing inside a monochrome reel;
  // it leaves on the second jump-cut and the beat ends in the reel's palette.
  const sat = 1 - ramp(frame, DRAIN_AT, DRAIN_AT + 18, theme.ease.inOut);

  const kicker = ramp(frame, KICKER_AT, KICKER_AT + 16, theme.ease.inOut);
  const kickerOut = ramp(frame, KICKER_OUT, KICKER_OUT + 8, theme.ease.in);
  const slabIn = ramp(frame, SLAB_AT, SLAB_AT + 9, theme.ease.out);
  const slabOut = ramp(frame, SLAB_OUT, SLAB_OUT + 8, theme.ease.in);
  const scrim = ramp(frame, DRAIN_AT - 6, DRAIN_AT + 10);
  const tear = ramp(frame, TEAR_AT, TEAR_AT + 14, theme.ease.in);

  // The camera goes through the word: it accelerates (ease.in), so the frame
  // never parks inside the letterform. The word does NOT fade while it grows —
  // fading it turns the last twelve frames into a dark red smear. Everything
  // around it leaves fast (`clear`), and the last frames fill with the colour
  // of the letter the camera is inside.
  const push = ramp(frame, PUSH_AT, durationInFrames - 1, theme.ease.in);
  const clear = ramp(frame, PUSH_AT, PUSH_AT + 12, theme.ease.in);
  const fill = ramp(frame, durationInFrames - 11, durationInFrames - 1) * 0.55;

  return (
    <SceneShell exit={false} light={0}>
      <Shake amount={shake}>
        {/* ------------------------------------------------------ footage */}
        {frame < life && clear < 1 && (
          <div style={{ position: "absolute", inset: 0, overflow: "hidden", opacity: 1 - clear }}>
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
                filter: `saturate(${sat * 1.25}) contrast(${1.1 + (1 - sat) * 0.2}) brightness(${1.04 + (1 - sat) * 0.08})`,
              }}
            />
          </div>
        )}

        {/* Top wash — the strip lights are the brightest thing in the shot and
            the chrome has to sit on something. Kept light: the studio is the
            whole reason this hook is in colour. */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            height: 300,
            background: `linear-gradient(180deg, ${ynPalette.bg}B0, transparent)`,
            opacity: 1 - clear,
          }}
        />

        {/* ------------------------------------------- the two contenders */}
        {/* Oversized and cropped by the frame edges, present on frame 0: the
            poster frame has to say YouTube vs Netflix before a word is spoken.
            They wear the same red — see palette.ts. */}
        <YouTubeMark
          width={306}
          style={{
            position: "absolute",
            left: -76 - tear * 440,
            top: 322,
            opacity: (1 - tear) * (1 - clear),
          }}
        />
        <NetflixMark
          height={296}
          style={{
            position: "absolute",
            left: 888 + tear * 440,
            top: 300,
            opacity: (1 - tear) * (1 - clear),
          }}
        />

        {/* ------------------------------------------------------- chrome */}
        <div
          style={{
            position: "absolute",
            left: 76,
            top: 108,
            display: "flex",
            alignItems: "center",
            gap: 18,
            opacity: 1 - clear,
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              padding: "12px 20px",
              background: ynPalette.primary,
              fontFamily: theme.fonts.mono,
              fontSize: 25,
              fontWeight: 700,
              letterSpacing: "0.2em",
              color: ynColors.white,
            }}
          >
            <span
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: ynColors.white,
                opacity: 0.4 + Math.abs(Math.sin(frame / 8)) * 0.6,
              }}
            />
            BREAKING
          </span>
          <span
            style={{
              fontFamily: theme.fonts.mono,
              fontSize: 25,
              fontWeight: 600,
              letterSpacing: "0.2em",
              color: ynColors.white,
            }}
          >
            CREATOR ECONOMY
          </span>
        </div>

        {/* kicker, typing itself in over the desk while the face is alone */}
        {kickerOut < 1 && (
          <div
            style={{
              position: "absolute",
              left: 76,
              top: 1452,
              opacity: 1 - kickerOut,
              transform: `translateY(${kickerOut * 24}px)`,
            }}
          >
            <div
              style={{
                width: 320 * ramp(frame, 0, 10),
                height: 4,
                background: ynPalette.primary,
                marginBottom: 20,
              }}
            />
            <div
              style={{
                fontFamily: theme.fonts.mono,
                fontSize: 31,
                fontWeight: 600,
                letterSpacing: "0.2em",
                color: ynColors.white,
                whiteSpace: "nowrap",
                clipPath: `inset(0 ${(1 - kicker) * 100}% 0 0)`,
              }}
            >
              YOUTUBE · EXCLUSIVITY TALKS
            </div>
          </div>
        )}

        {/* -------------------------------------------------- the red slab */}
        {/* $MILLIONS knocked white out of a bar that wipes across the frame.
            It arrives on a jump-cut and leaves the way a news strap leaves —
            sideways, fast, no fade. */}
        {frame >= SLAB_AT && slabOut < 1 && (
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 1044,
              height: 224,
              background: ynPalette.primary,
              display: "flex",
              alignItems: "center",
              clipPath: `inset(0 ${(1 - slabIn) * 100}% 0 ${slabOut * 100}%)`,
              boxShadow: ynColors.shadow,
            }}
          >
            <div
              style={{
                marginLeft: 44,
                fontFamily: theme.fonts.wide,
                fontSize: 142,
                fontWeight: 900,
                lineHeight: 0.9,
                letterSpacing: "-0.045em",
                whiteSpace: "nowrap",
                color: ynColors.white,
                transform: `scale(${1 + slabHit.pop * 0.03})`,
                transformOrigin: "0% 50%",
              }}
            >
              $MILLIONS
            </div>
          </div>
        )}

        {/* Ground for the closing type. It arrives with the colour drain, so
            the last second of the hook is already the reel's page. */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 880,
            bottom: 0,
            opacity: scrim,
            background:
              `linear-gradient(180deg, transparent 0%, ${ynPalette.bg}B8 26%, ` +
              `${ynPalette.bg}F2 48%, ${ynPalette.bg} 70%)`,
          }}
        />

        {/* STAY / exclusive. — the serif italic is the one thing this hook
            keeps from the editorial register, and it is the word the camera
            goes through. */}
        <div style={{ position: "absolute", left: 76, top: 1120, opacity: 1 - clear }}>
          <Slam
            text="STAY"
            at={STAY_AT}
            size={128}
            align="left"
            tracking="-0.04em"
            color={ynColors.white}
          />
        </div>
        <div
          style={{
            position: "absolute",
            left: 70,
            top: 1244,
            transform: `scale(${1 + push * 9})`,
            transformOrigin: "24% 46%",
          }}
        >
          <Slam
            text="exclusive."
            at={EXCL_AT}
            size={184}
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
            left: 76,
            top: 1470,
            width: 640 * ramp(frame, STAY_AT + 6, STAY_AT + 24),
            height: 4,
            background: ynColors.white,
            opacity: (1 - clear) * 0.75,
          }}
        />
      </Shake>

      {/* inside the letter there is nothing but the letter */}
      <AbsoluteFill style={{ background: ynPalette.primary, opacity: fill }} />

      <Flash energy={slabHit.energy} strength={0.26} />
      <Flash energy={drainHit.energy} strength={0.2} />
      <Flash energy={exclHit.energy} strength={0.14} />
    </SceneShell>
  );
};
