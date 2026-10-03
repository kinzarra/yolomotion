// Word-synced karaoke captions, shared by every voiceover reel.
//
// Word timing is derived from each clip's measured duration: words get
// weights proportional to their length (plus a pause bonus for punctuation),
// then the spoken window is split accordingly. No per-word timestamps to
// maintain — retiming a clip retimes its words.
//
// The active word flips to the act's signal color, and "+"/"!"-marked
// keywords keep their hero/bad color permanently once spoken.
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme, Palette } from "../theme";
import { VoLine } from "./timeline";

type WordColor = "none" | "hero" | "bad";

type Word = {
  text: string;
  color: WordColor;
  start: number; // seconds, absolute
  end: number;
};

type Page = {
  hidden: boolean;
  words: Word[];
  start: number;
  end: number; // display end (includes tail)
};

export type CaptionStyle = {
  // Color of the word currently being spoken. A function receives the
  // current time in seconds, so an act change can flip the signal color
  // (e.g. red through the problem half, hero green once the fix lands).
  activeColor?: string | ((seconds: number) => string);
  heroColor?: string; // "+WORD"
  badColor?: string; // "!WORD"
  top?: number;
  sideMargin?: number;
  maxWidth?: number;
  fontSize?: number;
  // Defaults to the theme display face. A reel in a script that face lacks
  // (Cyrillic, for one) passes a face that has it — see fonts.ts.
  fontFamily?: string;
  fontWeight?: number;
  // How the active word is marked. "color" (default) recolours it; "box"
  // sets it on a filled block, "pill" on a rounded one, "underline" draws a
  // bar under it. Every word keeps the same padding whether or not it is
  // lit, so the line never reflows as the highlight travels.
  mode?: "color" | "box" | "pill" | "underline";
  activeInk?: string; // text colour on a box / pill (defaults to bg-dark ink)
  boxColor?: string; // block fill; defaults to the active colour
  boxTilt?: number; // degrees, alternating sign per word — tabloid stickers
  uppercase?: boolean;
  letterSpacing?: string;
  textShadow?: string;
  stroke?: string; // CSS -webkit-text-stroke, painted under the fill
  // A plate behind the whole page — frosted glass or a solid card.
  plate?: string;
  plateBlur?: number;
  align?: "center" | "left";
  // "+WORD" keywords in a contrasting face (a serif italic in an editorial
  // look). Only the keyword changes face, never running text.
  heroFontFamily?: string;
  heroFontStyle?: "normal" | "italic";
  heroFontWeight?: number;
};

const weightOf = (word: string) => {
  // Unicode-aware: Cyrillic (or any script) letters count, not just ASCII —
  // otherwise every Russian word weighs the same and the karaoke drifts.
  const letters = word.replace(/[^\p{L}\p{N}']/gu, "").length;
  let w = letters + 1.4;
  if (word.endsWith("...")) w += 9;
  else if (/[.?!]$/.test(word)) w += 3;
  else if (/[,—]$/.test(word)) w += 1.6;
  return w;
};

const parseWord = (raw: string) => {
  if (raw.startsWith("+")) return { text: raw.slice(1), color: "hero" as const };
  if (raw.startsWith("!")) return { text: raw.slice(1), color: "bad" as const };
  return { text: raw, color: "none" as const };
};

const paginate = (line: VoLine, rate: number): Page[] => {
  const spoken = line.raw / rate;
  const all = line.pages.flatMap((p, pi) =>
    p
      .replace(/^~/, "")
      .split(" ")
      .map((raw) => ({ ...parseWord(raw), page: pi, hidden: p.startsWith("~") })),
  );
  const total = all.reduce((s, w) => s + weightOf(w.text), 0);
  let cursor = line.start;
  const timed = all.map((w) => {
    const dur = (weightOf(w.text) / total) * spoken;
    const word = { ...w, start: cursor, end: cursor + dur };
    cursor += dur;
    return word;
  });
  return line.pages.map((p, pi) => {
    const words = timed.filter((w) => w.page === pi);
    const isLast = pi === line.pages.length - 1;
    return {
      hidden: p.startsWith("~"),
      words,
      start: words[0].start,
      end: words[words.length - 1].end + (isLast ? 0.3 : 0.06),
    };
  });
};

/**
 * When each caption page of a line starts and ends, by the same word weights
 * the karaoke uses. Scenes key visual cues to it ("the second sentence lands
 * here") so a re-recorded clip moves the cue with the caption.
 */
export const pageTimes = (line: VoLine, rate: number) =>
  paginate(line, rate).map(({ start, end }) => ({ start, end }));

export const Captions: React.FC<
  { voiceover: VoLine[]; rate: number; palette: Palette } & CaptionStyle
> = ({
  voiceover,
  rate,
  palette,
  activeColor = palette.primary,
  heroColor = palette.primary,
  badColor,
  top = 1408,
  sideMargin = 90,
  maxWidth = 880,
  fontSize = 54,
  fontFamily = theme.fonts.display,
  fontWeight = 700,
  mode = "color",
  activeInk = palette.bg,
  boxColor,
  boxTilt = 0,
  uppercase = false,
  letterSpacing = "-0.02em",
  textShadow = "0 4px 26px rgba(0,0,0,0.85)",
  stroke,
  plate,
  plateBlur = 0,
  align = "center",
  heroFontFamily,
  heroFontStyle = "normal",
  heroFontWeight,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const now = frame / fps;

  const pages = React.useMemo(
    () => voiceover.flatMap((line) => paginate(line, rate)),
    [voiceover, rate],
  );

  const page = pages.find((p) => !p.hidden && now >= p.start - 0.12 && now < p.end);
  if (!page) return null;

  const signal = typeof activeColor === "function" ? activeColor(now) : activeColor;

  const inP = spring({
    frame: frame - Math.round((page.start - 0.12) * fps),
    fps,
    config: theme.spring.snappy,
  });
  // Exit faster than entrance: 4 frames at the end of the page window.
  const outP = interpolate(
    frame,
    [Math.round(page.end * fps) - 4, Math.round(page.end * fps) - 1],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const padded = mode === "box" || mode === "pill";
  const justify = align === "left" ? "flex-start" : "center";

  return (
    <div
      style={{
        position: "absolute",
        left: sideMargin,
        right: sideMargin,
        top,
        display: "flex",
        justifyContent: justify,
        pointerEvents: "none",
        opacity: inP * outP,
        transform: `translateY(${interpolate(inP, [0, 1], [26, 0])}px) scale(${interpolate(inP, [0, 1], [0.94, 1])})`,
        transformOrigin: align === "left" ? "left center" : "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: justify,
          columnGap: padded ? 4 : 18,
          rowGap: padded ? 2 : 6,
          maxWidth,
          fontFamily,
          fontSize,
          fontWeight,
          letterSpacing,
          lineHeight: 1.12,
          textAlign: align,
          textTransform: uppercase ? "uppercase" : "none",
          textShadow,
          ...(plate
            ? {
                background: plate,
                backdropFilter: plateBlur ? `blur(${plateBlur}px)` : undefined,
                padding: "22px 30px",
                borderRadius: 34,
              }
            : {}),
        }}
      >
        {page.words.map((w, i) => {
          // active → signal color and slightly larger; spoken → white (or the
          // keyword's own color); upcoming → dim.
          const hot = interpolate(
            now,
            [w.start, w.start + 0.08, w.end, w.end + 0.09],
            [0, 1, 1, 0],
            {
              easing: theme.ease.out,
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            },
          );
          const said = now >= w.start;
          const keyColor =
            w.color === "hero" ? heroColor : w.color === "bad" ? (badColor ?? null) : null;
          const restColor = keyColor ?? (said ? palette.text : palette.textDim);
          const lit = hot > 0.5;
          const color =
            padded && lit ? activeInk : lit && mode !== "underline" ? (keyColor ?? signal) : restColor;
          const hero = w.color === "hero" && heroFontFamily;
          return (
            <span
              key={`${w.text}-${i}`}
              style={{
                position: "relative",
                display: "inline-block",
                color,
                opacity: said ? 1 : 0.45,
                transform: `scale(${1 + hot * (padded ? 0.04 : 0.07)}) rotate(${hot * boxTilt * (i % 2 ? -1 : 1)}deg)`,
                padding: padded ? "0.02em 0.2em 0.06em" : undefined,
                fontFamily: hero ? heroFontFamily : undefined,
                fontStyle: hero ? heroFontStyle : undefined,
                fontWeight: hero ? heroFontWeight : undefined,
                WebkitTextStroke: stroke && !(padded && lit) ? stroke : undefined,
                paintOrder: stroke ? "stroke fill" : undefined,
              }}
            >
              {padded && (
                <span
                  style={{
                    position: "absolute",
                    inset: 0,
                    zIndex: -1,
                    background: keyColor ?? boxColor ?? signal,
                    borderRadius: mode === "pill" ? 999 : 6,
                    opacity: hot,
                    transform: `scale(${0.86 + hot * 0.14})`,
                  }}
                />
              )}
              {mode === "underline" && (
                <span
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: "-0.04em",
                    height: "0.12em",
                    background: keyColor ?? signal,
                    transform: `scaleX(${hot})`,
                    transformOrigin: "left center",
                  }}
                />
              )}
              {w.text}
            </span>
          );
        })}
      </div>
    </div>
  );
};
