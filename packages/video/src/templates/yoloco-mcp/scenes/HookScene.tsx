// 01 hook — the author's collage, alive. Tight on his face while he
// introduces himself, then the camera pulls back until the whole desk fills
// the frame; on the last word he snaps, and the TikTok cut takes the strobe
// into the next beat.
//
// Two layers of the same drawing (blur-filled background + Vision matte) make
// the parallax and the body sway possible. The background is graded
// grey-violet and he stays in colour: the one live element in the frame.
import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../../theme";
import { usePunch } from "../../../reel";
import { mcpColors, mcpPalette } from "../palette";
import { HOOK } from "../timeline";
import {
  ART,
  Cartoon,
  Glitch,
  Kinetic,
  MonoChip,
  SnapBurst,
  TikTokCut,
  YolocoTile,
  cutZoom,
  lerpPt,
} from "../ui";

// Portrait art (1122×1402) in a portrait frame: cover is height-driven, and
// 1920/1402 = 1.369 crops 15% off each side, which keeps the ring light, the
// monitor and the phone strip and loses only empty shelf.
const COVER = 1920 / ART.h;
const TIGHT = { scale: 2.15, anchor: ART.face, at: { x: 540, y: 640 } };
const PLATE = { scale: COVER, anchor: ART.center, at: { x: 540, y: 960 } };

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = frame / fps;

  // Slow push while tight, then an eased pull-back. The zoom interpolates in
  // log space so the camera decelerates the way a real one does.
  const push = interpolate(t, [0, HOOK.tightUntil], [1, 1.04], { easing: theme.ease.inOut, ...clamp });
  const pull = interpolate(t, [HOOK.tightUntil, HOOK.pulledAt], [0, 1], { easing: theme.ease.inOut, ...clamp });
  const scale = Math.exp(interpolate(pull, [0, 1], [Math.log(TIGHT.scale * push), Math.log(PLATE.scale)]));
  const anchor = lerpPt(TIGHT.anchor, PLATE.anchor, pull);
  const at = lerpPt(TIGHT.at, PLATE.at, pull);
  const parallax = Math.sin(t * 0.9) * 12 * (1 - pull);

  const snapFrame = Math.round(HOOK.snap * fps);
  const punch = usePunch(snapFrame, 14);
  const cutK = frame - (durationInFrames - 9);

  // The snap lands on the hand on his head, wherever the camera has it.
  const snapAt = {
    x: at.x + (ART.hand.x - anchor.x) * scale,
    y: at.y + (ART.hand.y - anchor.y) * scale,
  };

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", backgroundColor: mcpPalette.bg }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translate(${punch.shake * 0.4}px, 0) scale(${cutZoom(cutK, "out") * (1 + punch.pop * 0.03)})`,
          transformOrigin: `${snapAt.x}px ${snapAt.y}px`,
        }}
      >
        <Glitch amount={punch.energy * 0.5} bands={6} style={{ position: "absolute", inset: 0 }}>
          <Cartoon
            scale={scale}
            anchor={anchor}
            at={at}
            grade={0.85}
            dim={0.36}
            tint={0.28}
            parallax={parallax}
            bob={1 - pull * 0.5}
          />
        </Glitch>
      </div>

      {/* Top scrim: the ring light and the clock are the brightest things in
          the drawing and they sit exactly where the headline goes. */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: 760,
          background:
            `linear-gradient(180deg, ${mcpPalette.bg}F2 0%, ${mcpPalette.bg}D9 42%, ` +
            `${mcpPalette.bg}80 74%, transparent 100%)`,
          opacity: 0.55 + pull * 0.45,
        }}
      />
      {/* Bottom scrim: ground for the name tag and the captions at y=1408. */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1120,
          bottom: 0,
          background: `linear-gradient(180deg, transparent 0%, ${mcpPalette.bg}B3 34%, ${mcpPalette.bg}F2 66%, ${mcpPalette.bg} 100%)`,
        }}
      />

      <div style={{ position: "absolute", left: 70, right: 70, top: 216 }}>
        <Kinetic
          text="INFLUENCER MARKETING IS CHANGING."
          size={104}
          weight={800}
          align="center"
          delay={Math.round(HOOK.headline * fps)}
          per={4}
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1258,
          display: "flex",
          justifyContent: "center",
          opacity: interpolate(pull, [0.65, 1], [0, 1], clamp),
          transform: `translateY(${interpolate(pull, [0.65, 1], [26, 0], clamp)}px)`,
        }}
      >
        <MonoChip size={24} color={mcpPalette.text} border={mcpColors.lineStrong}>
          <YolocoTile size={26} />
          PHILIPP · FOUNDER OF YOLOCO
        </MonoChip>
      </div>

      <SnapBurst at={snapFrame} x={snapAt.x} y={snapAt.y} />
      <TikTokCut k={cutK} phase="out" />
    </div>
  );
};
