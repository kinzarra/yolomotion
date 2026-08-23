// 04 backlash — 20–26.5s. A sponsored post, then the replies. Four arrive one
// at a time and can be read; then eighty arrive at once and none of them can.
// The reel has no SFX, so the brief's "notification, notification,
// notification — SILENCE" is carried entirely by rate: the flood accelerates,
// the page goes black in a single frame, and one comment is left standing in
// the quiet. That last card is the only accent in the beat.
//
// Every comment is written for this video. None is attributed, none is styled
// as a screenshot of a real account.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { theme } from "../../../theme";
import { bpmColors, bpmPalette } from "../palette";
import {
  Avatar,
  CommentCard,
  Mono,
  Rise,
  SceneShell,
  Tag,
  ramp,
  noise,
} from "../ui";

// The post is already arriving on frame 0 — a hard cut into a black frame is
// dead air, and this beat has none to spare.
const POST_AT = 0;
const FIRST_AT = 24;
const FLOOD_AT = 84;
const CUT_AT = 132;

const SLOW = [
  { text: "Seriously?", at: FIRST_AT, y: 902 },
  { text: "Another AI ad?", at: FIRST_AT + 15, y: 1000 },
  { text: "How much did they pay you?", at: FIRST_AT + 29, y: 1098 },
  { text: "This doesn't fit your content.", at: FIRST_AT + 42, y: 1196 },
];

const POOL = [
  "Seriously?",
  "Another AI ad?",
  "How much did they pay you?",
  "This doesn't fit your content.",
  "unfollowing",
  "we can tell it's paid",
  "you don't even use this",
  "ad #4 this week",
  "so that's what you cost",
  "disappointed tbh",
];

// 64 replies, deterministically scattered over the page. They stay above
// y≈1340 so the caption band at 1408 keeps reading through the flood.
const FLOOD = Array.from({ length: 64 }, (_, i) => ({
  i,
  text: POOL[i % POOL.length],
  at: FLOOD_AT + Math.round(noise(i, 31) * 40),
  x: -70 + noise(i, 32) * 900,
  y: 220 + noise(i, 33) * 1110,
  scale: 0.5 + noise(i, 34) * 0.42,
  rotate: (noise(i, 35) - 0.5) * 9,
}));

export const BacklashScene: React.FC<{ handle: string }> = ({ handle }) => {
  const frame = useCurrentFrame();
  const cut = frame >= CUT_AT ? 1 : 0;
  const quiet = ramp(frame, CUT_AT, CUT_AT + 14, theme.ease.out);

  return (
    <SceneShell>
      <AbsoluteFill style={{ opacity: 1 - cut }}>
        {/* the post */}
        <Rise
          delay={POST_AT}
          distance={40}
          style={{ position: "absolute", left: 72, top: 268, width: 936 }}
        >
          <div
            style={{
              border: `1.5px solid ${bpmColors.line}`,
              borderRadius: 12,
              background: bpmColors.surfaceStrong,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
                padding: "22px 26px",
              }}
            >
              <Avatar size={64} />
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontFamily: theme.fonts.body,
                    fontSize: 30,
                    fontWeight: 600,
                    color: bpmColors.bone,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {handle}
                </div>
                <Mono size={16} style={{ marginTop: 4 }}>
                  Paid partnership
                </Mono>
              </div>
              <Tag delay={POST_AT + 12} size={17}>
                Ad
              </Tag>
            </div>
            {/* where the creative would be — a frame, not a picture: there is
                no real campaign here and it must not look like one */}
            <div
              style={{
                height: 300,
                margin: "0 26px 26px",
                border: `1.5px solid ${bpmColors.line}`,
                borderRadius: 8,
                background: bpmColors.surface,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Mono size={18} color={bpmColors.dim}>
                Sponsored creative
              </Mono>
            </div>
          </div>
        </Rise>

        {/* the four that can still be read */}
        {SLOW.map((c) => (
          <CommentCard
            key={c.text}
            text={c.text}
            at={c.at}
            x={72}
            y={c.y}
            width={790}
            size={30}
            fade={1 - ramp(frame, FLOOD_AT, FLOOD_AT + 16) * 0.55}
          />
        ))}

        {/* and the eighty that cannot */}
        {frame >= FLOOD_AT &&
          FLOOD.map((c) => (
            <CommentCard
              key={`f-${c.i}`}
              text={c.text}
              at={c.at}
              x={c.x}
              y={c.y}
              width={640}
              size={26}
              scale={c.scale}
              rotate={c.rotate}
            />
          ))}
      </AbsoluteFill>

      {/* silence */}
      {frame >= CUT_AT && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          {/* CommentCard positions itself absolutely, so it needs a relative
              box of its own size to be centred against. */}
          <div
            style={{
              position: "relative",
              width: 720,
              height: 96,
              opacity: quiet,
              transform: `scale(${0.96 + quiet * 0.04})`,
            }}
          >
            <CommentCard
              text="How much did they pay you?"
              at={CUT_AT + 2}
              x={0}
              y={0}
              width={720}
              size={34}
              accent
            />
          </div>
        </AbsoluteFill>
      )}
    </SceneShell>
  );
};
