// 01 hook — face first. The author (HeyGen photo avatar, lip-synced to the
// house clip) says the paradox full-bleed in the studio; on «процента» a red
// «≈1%» slams in over the hoodie with a shockwave. On the pause after
// «экономики» the face cuts hard to the night skyline — the evidence for
// «небоскрёбы» (Robert Bock, CC0) — and the question snaps in.
//
// The face is the one shot that stays in colour (footage.md): it is the live
// element of the reel. No brand bar in the hook — the studio is the frame.
import React from "react";
import { OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../../theme";
import { usePunch } from "../../../reel";
import { deColors, dePalette } from "../palette";
import { PRESENTER } from "../presenter";
import { VO_RATE } from "../timeline";
import {
  BigNum,
  Eyebrow,
  Flash,
  Glitch,
  Kinetic,
  Photo,
  Scrim,
  SceneShell,
  Shockwave,
  Sweep,
} from "../ui";

const SHOT = PRESENTER["p1-hook"];

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  // The insert is cut in the clip's pause after «экономики» (3.18–3.33s).
  const faceFrames = Math.round((SHOT.duration / VO_RATE) * fps) - 1;
  const slam = Math.round(1.95 * fps); // «процента»
  const ask = Math.round(3.4 * fps); // «Откуда тогда небоскрёбы?»
  const hit = usePunch(slam, 16);
  const cut = usePunch(faceFrames, 12);
  const push = interpolate(frame, [0, faceFrames], [1.0, 1.08], {
    easing: theme.ease.inOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cutFlash = interpolate(frame, [faceFrames, faceFrames + 3], [0.5, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  if (frame < faceFrames) {
    return (
      <SceneShell exit={false} shake={hit.shake}>
        {/* No <Glitch> on the face: its sepia/hue channel copies screen onto
            skin and turn it olive. The slam glitches the number only. */}
        <div style={{ position: "absolute", inset: 0 }}>
          <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
            <OffthreadVideo
              src={staticFile(`presenter/dubai-economy/${SHOT.file}`)}
              muted
              playbackRate={VO_RATE}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "52% 50%",
                transform: `scale(${push})`,
                transformOrigin: "52% 28%",
                // tame the studio neon so the reel's red stays the only signal
                filter: "saturate(0.8) contrast(1.05)",
              }}
            />
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(180deg, ${dePalette.bg}40 0%, transparent 22%, transparent 46%, ${dePalette.bg}D9 64%, ${dePalette.bg}F2 100%)`,
          }}
        />
        {frame >= slam - 4 && (
          <div style={{ position: "absolute", left: 90, right: 90, top: 1010 }}>
            <Eyebrow delay={slam - 4} color={deColors.bad}>
              НЕФТЬ В ЭКОНОМИКЕ ДУБАЯ
            </Eyebrow>
            <Glitch amount={hit.energy * 0.9} style={{ marginTop: 40 }}>
              <BigNum size={250} color={deColors.bad} delay={slam - 4} glow={deColors.badGlow}>
                ≈1%
              </BigNum>
            </Glitch>
          </div>
        )}
        <div style={{ position: "absolute", left: 540, top: 1150, width: 0, height: 0 }}>
          <Shockwave at={slam} color={deColors.bad} size={1500} />
        </div>
        {/* no colour flash over the face: a red screen wash turns skin olive */}
      </SceneShell>
    );
  }

  return (
    <SceneShell shake={cut.shake * 0.6}>
      <Photo
        file="01-hook-skyline.jpg"
        len={durationInFrames - faceFrames}
        focus={[0.555, 0.3]}
        zoom={[1.08, 1.2]}
        drift={-30}
      />
      <Scrim top={0.55} mid={0.45} bottom={0.92} />
      <Sweep at={faceFrames + 4} life={30} />
      <div style={{ position: "absolute", left: 90, top: 820 }}>
        <Eyebrow delay={faceFrames + 2} color={deColors.bad}>
          НЕФТЬ ≈1% · А ГОРОД РАСТЁТ
        </Eyebrow>
      </div>
      <div style={{ position: "absolute", left: 90, right: 90, top: 900 }}>
        <Glitch amount={cut.energy * 0.6}>
          <Kinetic text="ОТКУДА ТОГДА НЕБОСКРЁБЫ?" delay={Math.min(ask, faceFrames + 4)} per={4} size={92} mode="snap" />
        </Glitch>
      </div>
      <Flash amount={cutFlash} color={deColors.white} />
    </SceneShell>
  );
};
