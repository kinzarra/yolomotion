// Talking-head inserts, laid over the scenes and under the captions.
//
// The footage is muted on purpose: the voice already plays from the reel's own
// VoiceoverTrack. It runs at VO_RATE because the avatar was generated from the
// clips at 1.0x while the reel plays them at 1.1x — without that the lips drift
// ~10% against the words.
//
// Two shapes, both cut from the same landscape source:
//   corner — a round PiP in the free band bottom-left; the graphics keep running
//   hero   — a wide card across the middle, which covers the scene's mid-frame
//            content on purpose: by the time a hero insert lands, that content
//            has already been read.
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { theme } from "../../../theme";
import { useIn } from "../../../reel";
import { dwColors, dwPalette } from "../palette";
import { PRESENTER } from "../presenter";
import { VO_RATE } from "../timeline";

// The generated footage is 1080×1080 — a square canvas with the 16:9 avatar
// letterboxed into it, so the usable band is only y 232–845.
const SRC = { w: 1080, h: 1080 } as const;

// The square that gets masked to a circle, measured off the source with a
// 108×108 grid rather than eyeballed: the eyes sit at y≈505 and the face
// centre at x≈545. The square is placed so the eyes land ~38% down, which is
// where a face reads as centred in a circle — dead-centre eyes look like the
// subject is sinking — and it stays clear of the letterbox bars.
const CROP = { x: 275, y: 300, size: 540 } as const;

// Small circle over running graphics, bottom-left.
const PIP = { d: 280, left: 110, top: 1105 } as const;
// Big circle for the cut-aways, centred horizontally and sitting inside the
// matte band so nothing pokes out beside it.
const HERO = { d: 620, left: (1080 - 620) / 2, top: 600 } as const;
// The finale is the most crowded frame in the reel: headline, sub-headline,
// poll chips, disclaimer and footnote all have to stay readable. This is the
// one band left free once the disclaimer moves up to 950, and it sits directly
// under the three answer chips — which is exactly where the ask belongs.
const CTA = { d: 300, left: (1080 - 300) / 2, top: 1070 } as const;

// A hero cut has to erase what the scene is still drawing around the circle,
// or the top edge of a receipt and the bottom of a chip poke out past it.
//
// The vertical edges are HARD because the gap they thread is 11px wide:
//   headline bottom ≈ 565  (must survive — it is the beat's message)
//   receipt top     = 576  (must be covered)
// A gradient cannot fade inside 11px; the first attempt tried and ate the
// headlines instead. The bottom edge at 1225 sits between the `answer` chip
// (1150–1210, covered) and the `who` chip (from 1230, survives — it carries
// the instruction); the `mistake` chip at 1272 is well clear.
//
// The horizontal edges ARE soft, because a circle is narrower than a card and
// would otherwise leave flat bars of dead background either side of it. All
// the scene content lives between x=90 and x=990, so fading out over the outer
// 9% hides everything that matters and keeps the drifting lime glow at the
// frame edges alive.
const MATTE = { top: 570, bottom: 1225 } as const;

const OUT = 8; // exits are faster than entrances

const src = (file: string) => staticFile(`presenter/dollar-wait/${file}`);

/** Shared exit: the last OUT frames of a shot fade and lift it away. */
const Shot: React.FC<{ life: number; children: React.ReactNode }> = ({ life, children }) => {
  const frame = useCurrentFrame();
  const out = interpolate(frame, [life - OUT, life - 1], [0, 1], {
    easing: theme.ease.in,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ opacity: 1 - out, transform: `translateY(${out * -26}px)` }}>
      {children}
    </AbsoluteFill>
  );
};

/**
 * The circle both styles are built from: the measured square cropped out of the
 * landscape frame, masked round, with the face centred inside it.
 */
const Bubble: React.FC<{
  file: string;
  d: number;
  left: number;
  top: number;
  ring: number;
  p: number;
}> = ({ file, d, left, top, ring, p }) => {
  const scale = d / CROP.size;
  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width: d,
        height: d,
        borderRadius: "50%",
        overflow: "hidden",
        border: `${ring}px solid ${dwPalette.primary}`,
        boxShadow: `0 0 ${d * 0.16}px ${dwPalette.glow}, ${dwColors.shadow}`,
        opacity: Math.min(1, p * 1.4),
        transform: `translateY(${interpolate(p, [0, 1], [d * 0.12, 0])}px) scale(${interpolate(p, [0, 1], [0.74, 1])})`,
      }}
    >
      <OffthreadVideo
        src={src(file)}
        muted
        playbackRate={VO_RATE}
        style={{
          position: "absolute",
          width: SRC.w * scale,
          height: SRC.h * scale,
          left: -CROP.x * scale,
          top: -CROP.y * scale,
          maxWidth: "none",
        }}
      />
    </div>
  );
};

/** Small circle in a free band; the graphics keep running around it. */
type Spot = { d: number; left: number; top: number };

const SmallShot: React.FC<{ file: string; life: number; at: Spot }> = ({
  file,
  life,
  at,
}) => {
  const p = useIn(0, "smooth");
  return (
    <Shot life={life}>
      <Bubble file={file} d={at.d} left={at.left} top={at.top} ring={4} p={p} />
    </Shot>
  );
};

/**
 * Wide card: the landscape frame used at close to its native size.
 *
 * A hero insert is a cut-away, so whatever the scene is still drawing behind it
 * has to go — otherwise the top edge of a receipt or the bottom of a chip pokes
 * out around the card and reads as a mistake. The scrim erases that band in the
 * background colour, with soft edges so there is no visible rectangle.
 */
const HeroShot: React.FC<{ file: string; life: number }> = ({ file, life }) => {
  const p = useIn(0, "smooth");
  return (
    <Shot life={life}>
      {/* The matte snaps in three times faster than the circle. Sharing the
          circle's opacity meant the receipt behind it showed through the first
          few frames of the entrance and read as a double exposure. */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: MATTE.top,
          height: MATTE.bottom - MATTE.top,
          background:
            `linear-gradient(90deg, transparent 0%, ${dwPalette.bg} 9%, ` +
            `${dwPalette.bg} 91%, transparent 100%)`,
          opacity: Math.min(1, p * 3),
        }}
      />
      <Bubble file={file} d={HERO.d} left={HERO.left} top={HERO.top} ring={5} p={p} />
    </Shot>
  );
};

export const Presenter: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <>
      {Object.entries(PRESENTER)
        .filter(([, shot]) => shot.enabled)
        .map(([id, shot]) => {
        // The file is measured at 1.0x; on screen it runs at VO_RATE.
        const life = Math.round((shot.duration / VO_RATE) * fps);
        return (
          <Sequence
            key={id}
            from={Math.round(shot.reelIn * fps)}
            durationInFrames={life}
            name={`presenter/${id}`}
          >
            {shot.style === "hero" ? (
              <HeroShot file={shot.file} life={life} />
            ) : (
              <SmallShot file={shot.file} life={life} at={shot.style === "cta" ? CTA : PIP} />
            )}
          </Sequence>
        );
      })}
    </>
  );
};
