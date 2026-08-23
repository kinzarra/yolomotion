import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../../theme";
import { mbColors, mbPalette } from "../palette";
import {
  BrandBar,
  Cursor,
  Cutout,
  SceneShell,
  Scanlines,
  useIn,
  useRamp,
} from "../ui";

// 14–20s. The whole argument of the beat is that the card does the work before
// the click: one number on the thumbnail, and three questions the viewer asks
// themselves. The cursor arrives, hovers, and never clicks — that comes later.
const QUESTIONS = [
  { text: "Will he finish?", at: 105 },
  { text: "How long will it take?", at: 118 },
  { text: "Why is he doing this?!", at: 131 },
];

const CARD_W = 800;
const CARD_X = (1080 - CARD_W) / 2;

// Rows are their own component so the entrance hook is never called in a loop.
const Question: React.FC<{ text: string; at: number }> = ({ text, at }) => {
  const p = useIn(at, "snappy");
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 24,
        opacity: p,
        transform: `translateX(${interpolate(p, [0, 1], [-44, 0])}px) scale(${interpolate(p, [0, 1], [0.94, 1])})`,
      }}
    >
      <span
        style={{
          width: 10,
          height: 46,
          borderRadius: 5,
          background: mbColors.lineStrong,
          transform: `scaleY(${p})`,
          flexShrink: 0,
        }}
      />
      <span
        style={{
          fontFamily: theme.fonts.display,
          fontSize: 54,
          fontWeight: 700,
          letterSpacing: "-0.03em",
          color: mbPalette.text,
        }}
      >
        {text}
      </span>
    </div>
  );
};

export const ThumbnailScene: React.FC<{ photo: string }> = ({ photo }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const card = useIn(0, "smooth");
  const meta = useIn(10, "snappy");

  // Cursor travels in, then hovers with a slow idle drift.
  const travel = useRamp(30, 68, theme.ease.out);
  const cx = interpolate(travel, [0, 1], [980, 596]);
  const cy = interpolate(travel, [0, 1], [1520, 604]);
  const drift = travel >= 1 ? Math.sin((frame / fps) * 2.1) * 5 : 0;

  // Hover state: the card lifts under the pointer.
  const hover = interpolate(frame, [64, 78], [0, 1], {
    easing: theme.ease.out,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Ken Burns on the thumbnail art, so the still never sits dead.
  const kb = interpolate(frame, [0, 180], [1, 1.07], {
    easing: theme.ease.inOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <SceneShell>
      <BrandBar chapter="04 · THE CARD" />

      <div
        style={{
          position: "absolute",
          left: CARD_X,
          top: 300,
          width: CARD_W,
          opacity: card,
          transform: `translateY(${interpolate(card, [0, 1], [50, 0]) - hover * 12}px) scale(${interpolate(card, [0, 1], [0.92, 1]) + hover * 0.015})`,
        }}
      >
        {/* thumbnail */}
        <div
          style={{
            position: "relative",
            width: CARD_W,
            height: Math.round((CARD_W * 9) / 16),
            borderRadius: 26,
            overflow: "hidden",
            background: mbColors.tape,
            border: `1px solid ${hover > 0.5 ? mbColors.lineStrong : mbColors.line}`,
            boxShadow: `0 ${28 + hover * 26}px ${70 + hover * 40}px -40px rgba(0,0,0,0.95)`,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `radial-gradient(circle at 50% 46%, ${mbColors.tapeLift}, ${mbColors.tape} 72%)`,
              transform: `scale(${kb})`,
            }}
          />
          {/* the number owns the left, he owns the right */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              paddingLeft: 34,
              fontFamily: theme.fonts.display,
              fontSize: 104,
              fontWeight: 800,
              letterSpacing: "-0.05em",
              fontVariantNumeric: "tabular-nums",
              color: mbColors.white,
              textShadow: `6px 6px 0 ${mbPalette.primary}`,
              transform: `scale(${kb})`,
            }}
          >
            100,000
          </div>
          <Cutout photo={photo} height={380} delay={4} tilt={-1.5} style={{ right: 6 }} />
          <Scanlines opacity={0.16} period={6} />
          {/* duration badge */}
          <div
            style={{
              position: "absolute",
              right: 20,
              bottom: 20,
              padding: "8px 14px",
              borderRadius: 8,
              background: "rgba(8,8,11,0.86)",
              fontFamily: theme.fonts.mono,
              fontSize: 26,
              fontWeight: 700,
              color: mbColors.white,
            }}
          >
            40:12:41
          </div>
        </div>

        {/* meta row */}
        <div
          style={{
            display: "flex",
            gap: 22,
            marginTop: 28,
            opacity: meta,
            transform: `translateY(${interpolate(meta, [0, 1], [18, 0])}px)`,
          }}
        >
          <div
            style={{
              width: 66,
              height: 66,
              borderRadius: "50%",
              background: mbColors.surfaceLift,
              border: `1px solid ${mbColors.line}`,
              flexShrink: 0,
            }}
          />
          <div>
            <div
              style={{
                fontFamily: theme.fonts.display,
                fontSize: 46,
                fontWeight: 700,
                letterSpacing: "-0.03em",
                color: mbPalette.text,
                lineHeight: 1.1,
              }}
            >
              I Counted To 100,000!
            </div>
            <div
              style={{
                marginTop: 10,
                fontFamily: theme.fonts.mono,
                fontSize: 27,
                letterSpacing: "0.06em",
                color: mbPalette.textDim,
              }}
            >
              MrBeast · 2017
            </div>
          </div>
        </div>
      </div>

      {/* the three questions the card asks for you */}
      <div
        style={{
          position: "absolute",
          left: CARD_X,
          top: 960,
          width: CARD_W,
          display: "flex",
          flexDirection: "column",
          gap: 26,
        }}
      >
        {QUESTIONS.map((q) => (
          <Question key={q.text} text={q.text} at={q.at} />
        ))}
      </div>

      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <Cursor x={cx} y={cy + drift} size={46} />
      </AbsoluteFill>
    </SceneShell>
  );
};
