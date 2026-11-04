// Like + subscribe (author: «не забудь лайк и подписаться где-нибудь в
// конце»): a cursor taps ♥ → ПОДПИСАТЬСЯ → the bell under the CTA face.
// Copied from salary-2013 with the row height as a prop.import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { theme } from "../../../theme";
import { useIn, usePunch } from "../../../reel";
import { colors, palette } from "../palette";
import { Check } from "../ui";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const HEART = "M12 21s-7.5-4.6-9.6-9.1C.9 8.6 2.9 4.5 6.7 4.5c2.1 0 3.6 1.2 4.3 2.4.7-1.2 2.2-2.4 4.3-2.4 3.8 0 5.8 4.1 4.3 7.4C19.5 16.4 12 21 12 21Z";
const BELL =
  "M12 2a1.6 1.6 0 0 0-1.6 1.6v.7A6.5 6.5 0 0 0 5.5 10.7v4.6L3.6 17.6v1.1h16.8v-1.1l-1.9-2.3v-4.6a6.5 6.5 0 0 0-4.9-6.4v-.7A1.6 1.6 0 0 0 12 2Zm-2.3 18a2.3 2.3 0 0 0 4.6 0Z";

// Row geometry (frame px): heart, pill, bell on one line.
const ROW_Y_DEFAULT = 880;
const HEART_X = 150;
const PILL_X = 310;
const PILL_W = 500;
const BELL_X = 840;

export const LikeSubscribe: React.FC<{ at: number; out: number; y?: number }> = ({ at, out, y = ROW_Y_DEFAULT }) => {
  const ROW_Y = y;
  const frame = useCurrentFrame();
  const inP = useIn(at, "bouncy");
  const like = at + 12;
  const sub = at + 24;
  const bell = at + 36;
  const hitLike = usePunch(like, 12);
  const hitSub = usePunch(sub, 12);
  const hitBell = usePunch(bell, 12);
  if (frame < at || frame >= out) return null;
  const leave = interpolate(frame, [out - 6, out], [0, 1], { easing: theme.ease.in, ...clamp });
  const liked = frame >= like;
  const subbed = frame >= sub;
  const rang = frame >= bell;
  // cursor: in from bottom-right → heart → pill → bell
  const seg = (a: number, b: number) => interpolate(frame, [a, b], [0, 1], { easing: theme.ease.inOut, ...clamp });
  const s1 = seg(at + 2, like - 1);
  const s2 = seg(like + 3, sub - 1);
  const s3 = seg(sub + 3, bell - 1);
  const cx = interpolate(s3, [0, 1], [interpolate(s2, [0, 1], [interpolate(s1, [0, 1], [900, HEART_X + 50]), PILL_X + PILL_W / 2]), BELL_X + 50]);
  const cy = ROW_Y + 60 + interpolate(s1, [0, 1], [260, 0]);
  const press = Math.max(hitLike.pop, hitSub.pop, hitBell.pop);
  const ring = rang ? Math.sin((frame - bell) * 1.3) * 22 * Math.max(0, 1 - (frame - bell) / 20) : 0;
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 60, opacity: 1 - leave }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: ROW_Y,
          height: 140,
          opacity: Math.min(1, inP * 1.6),
          transform: `translateY(${interpolate(inP, [0, 1], [90, 0])}px)`,
        }}
      >
        {/* like */}
        <div
          style={{
            position: "absolute",
            left: HEART_X,
            top: 10,
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: liked ? colors.bad : colors.surfaceLift,
            border: `2px solid ${liked ? colors.bad : colors.lineStrong}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: liked ? `0 0 ${30 + hitLike.energy * 60}px ${colors.badGlow}` : "none",
            transform: `scale(${1 + hitLike.pop * 0.3})`,
          }}
        >
          <svg width={66} height={66} viewBox="0 0 24 24">
            <path d={HEART} fill={liked ? palette.text : "none"} stroke={palette.text} strokeWidth={1.8} />
          </svg>
        </div>
        {liked && (
          <div
            style={{
              position: "absolute",
              left: HEART_X + 20,
              top: -40 - (frame - like) * 2.2,
              fontFamily: theme.fonts.wide,
              fontSize: 40,
              fontWeight: 900,
              color: colors.bad,
              opacity: Math.max(0, 1 - (frame - like) / 22),
            }}
          >
            +1
          </div>
        )}
        {/* subscribe */}
        <div
          style={{
            position: "absolute",
            left: PILL_X,
            top: 6,
            width: PILL_W,
            height: 128,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 14,
            borderRadius: 999,
            background: subbed ? colors.surfaceLift : palette.text,
            border: subbed ? `2px solid ${colors.lineStrong}` : "2px solid transparent",
            fontFamily: theme.fonts.wide,
            fontWeight: 800,
            fontSize: 40,
            color: subbed ? palette.text : colors.ink2,
            whiteSpace: "nowrap",
            transform: `scale(${1 - hitSub.pop * 0.08})`,
          }}
        >
          {subbed && <Check delay={sub} size={38} color={palette.primary} />}
          {subbed ? "ВЫ ПОДПИСАНЫ" : "ПОДПИСАТЬСЯ"}
        </div>
        {/* bell */}
        <div
          style={{
            position: "absolute",
            left: BELL_X,
            top: 10,
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: rang ? palette.text : colors.surfaceLift,
            border: `2px solid ${colors.lineStrong}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `scale(${1 - hitBell.pop * 0.12})`,
          }}
        >
          <svg width={62} height={62} viewBox="0 0 24 24" style={{ transform: `rotate(${ring}deg)`, transformOrigin: "50% 10%" }}>
            <path d={BELL} fill={rang ? colors.ink2 : palette.text} />
          </svg>
        </div>
      </div>
      {/* the cursor */}
      <svg
        width={70}
        height={70}
        viewBox="0 0 24 24"
        style={{
          position: "absolute",
          left: cx,
          top: cy,
          transform: `scale(${1 - press * 0.22})`,
          filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.7))",
          opacity: Math.min(1, s1 * 3),
        }}
      >
        <path d="M3 2 L3 19 L8 14.5 L11.5 22 L14.5 20.6 L11 13.2 L18 13 Z" fill={palette.text} stroke={colors.ink2} strokeWidth={1.2} />
      </svg>
    </div>
  );
};
