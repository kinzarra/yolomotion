import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../../theme";
import { ksColors, ksPalette } from "../palette";
import { Flash, Kinetic, Photo, SceneShell, usePunch } from "../ui";

// 35.5–40.5s. A wall of languages the camera drives into; on the spoken word
// "language" every row shears into three slats and slides off the page. Behind
// it: the second portrait, and UNIVERSAL. — the one accent in the frame.
const ROWS = ["ENGLISH", "SPANISH", "FRENCH", "ARABIC", "PORTUGUESE", "ITALIAN", "JAPANESE"];
// Each row sits a little off centre, alternating, so the wall reads as laid
// bricks rather than a list. PORTUGUESE bleeds both edges on purpose.
const OFFSETS = [40, -50, 70, -30, 0, 60, -40];
const ROW_TOP = 300;
const ROW_H = 148;
const BREAK_AT = 96;
const BREAK_LEN = 26;
const WORD_AT = 118;

export const BarrierScene: React.FC<{ photo: string }> = ({ photo }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const hit = usePunch(BREAK_AT, 16);
  const approach = interpolate(frame, [20, BREAK_AT], [1, 1.22], {
    easing: theme.ease.inOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <SceneShell>
      {/* behind the wall */}
      <div style={{ position: "absolute", left: 160, top: 420 }}>
        <Photo src={photo} width={760} delay={BREAK_AT + 2} rise={60} kb={1.04} fade={280} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 72,
          right: 72,
          top: 1220,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Kinetic text="UNIVERSAL." delay={WORD_AT} size={136} color={ksPalette.primary} />
      </div>

      {/* the wall */}
      <AbsoluteFill
        style={{
          transform: `scale(${approach}) translate(${hit.shake * 0.3}px, ${hit.shake * 0.6}px)`,
          transformOrigin: "50% 50%",
        }}
      >
        {ROWS.map((word, i) => {
          const enter = spring({
            frame: frame - 2 - i * 4,
            fps,
            config: theme.spring.smooth,
          });
          const side = i % 2 === 0 ? 1 : -1;
          const top = ROW_TOP + i * ROW_H;
          // Slats leave on an in-out curve and fade as they go, so a row is
          // invisible well before it unmounts — an ease-in here left the
          // last slat hanging on screen until the very frame it vanished.
          const breakStart = BREAK_AT + i * 3;
          if (frame >= breakStart + BREAK_LEN) return null;
          const breakP = interpolate(frame, [breakStart, breakStart + BREAK_LEN], [0, 1], {
            easing: theme.ease.inOut,
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const row: React.CSSProperties = {
            position: "absolute",
            left: "50%",
            top,
            fontFamily: theme.fonts.display,
            fontSize: 140,
            fontWeight: 700,
            letterSpacing: "-0.05em",
            lineHeight: 1,
            whiteSpace: "nowrap",
            color: ksColors.bone,
            opacity: enter * (1 - breakP),
          };
          const slats = [
            { clip: "inset(0 66.7% 0 0)", dx: -1300, dy: 60, rot: -5 },
            { clip: "inset(0 33.3% 0 33.3%)", dx: 0, dy: -(top + 400), rot: 0 },
            { clip: "inset(0 0 0 66.7%)", dx: 1300, dy: 80, rot: 5 },
          ];
          return slats.map((s, k) => (
            <div
              key={`${word}-${k}`}
              style={{
                ...row,
                clipPath: s.clip,
                transform: `translateX(-50%) translate(${OFFSETS[i] + side * interpolate(enter, [0, 1], [420, 0]) + s.dx * breakP}px, ${s.dy * breakP}px) rotate(${s.rot * breakP}deg)`,
              }}
            >
              {word}
            </div>
          ));
        })}
      </AbsoluteFill>

      <Flash energy={hit.energy} strength={0.22} />
    </SceneShell>
  );
};
