import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { theme } from "../../../theme";
import { mbColors, mbPalette } from "../palette";
import { BrandBar, SceneShell, useIn, useRamp } from "../ui";

// 35.5–43s. The contrast beat: the wrong lesson is written out, struck
// through, and everything — grid, bloom, quote — is cleared to black before
// the four words land one at a time. Nothing else is on screen for them.
const QUOTE_AT = 40;
const STRIKE = { from: 62, to: 80 };
const CLEAR = { from: 84, to: 94 };

const WORDS = [
  { text: "MAKE", at: 96, size: 88 },
  { text: "THE IDEA", at: 105, size: 100 },
  { text: "IMPOSSIBLE", at: 120, size: 130 },
  { text: "TO IGNORE.", at: 137, size: 130, hero: true },
];

const Word: React.FC<{ text: string; at: number; size: number; hero?: boolean }> = ({
  text,
  at,
  size,
  hero = false,
}) => {
  const p = useIn(at, "snappy");
  return (
    <div
      style={{
        fontFamily: theme.fonts.display,
        fontSize: size,
        fontWeight: 800,
        letterSpacing: "-0.05em",
        lineHeight: 1.06,
        whiteSpace: "nowrap",
        color: hero ? mbPalette.primary : mbPalette.text,
        textShadow: hero
          ? `0 0 60px ${mbPalette.glow}, 0 0 130px ${mbPalette.glow}`
          : undefined,
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [size * 0.34, 0])}px) scale(${interpolate(p, [0, 1], [0.86, 1])})`,
      }}
    >
      {text}
    </div>
  );
};

export const LessonScene: React.FC = () => {
  const frame = useCurrentFrame();
  const eyebrow = useIn(4, "snappy");
  const quote = useIn(QUOTE_AT, "smooth");
  const strike = useRamp(STRIKE.from, STRIKE.to);
  const clear = useRamp(CLEAR.from, CLEAR.to, theme.ease.in);

  // Everything recedes to black before the words: grid, bloom and the quote.
  const room = 1 - clear;

  return (
    <SceneShell grid={room} bloom={0.25 + room * 0.75}>
      <AbsoluteFill style={{ opacity: 1 }}>
        <BrandBar chapter="07 · THE LESSON" />

        <div
          style={{
            position: "absolute",
            left: 60,
            right: 60,
            top: 700,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 40,
            opacity: room,
            transform: `scale(${1 - clear * 0.12}) translateY(${clear * -30}px)`,
          }}
        >
          <div
            style={{
              fontFamily: theme.fonts.mono,
              fontSize: 30,
              fontWeight: 700,
              letterSpacing: "0.18em",
              color: mbPalette.textDim,
              opacity: eyebrow,
              transform: `translateY(${interpolate(eyebrow, [0, 1], [-18, 0])}px)`,
            }}
          >
            THE WRONG LESSON
          </div>

          <div
            style={{
              position: "relative",
              opacity: quote,
              transform: `translateY(${interpolate(quote, [0, 1], [34, 0])}px) scale(${interpolate(quote, [0, 1], [0.94, 1])})`,
            }}
          >
            <div
              style={{
                fontFamily: theme.fonts.display,
                fontSize: 78,
                fontWeight: 700,
                letterSpacing: "-0.04em",
                color: mbColors.dim,
                whiteSpace: "nowrap",
              }}
            >
              &ldquo;DO SOMETHING STUPID.&rdquo;
            </div>
            <div
              style={{
                position: "absolute",
                left: -14,
                top: "52%",
                height: 8,
                borderRadius: 4,
                width: `${strike * 104}%`,
                background: mbPalette.primary,
                boxShadow: `0 0 34px ${mbPalette.glow}`,
              }}
            />
          </div>
        </div>

        {/* four words, black screen, one at a time */}
        <div
          style={{
            position: "absolute",
            left: 60,
            right: 60,
            top: 600,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
          }}
        >
          {WORDS.map((w) => (
            <Word key={w.text} {...w} />
          ))}
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};
