// Karaoke captions timed to the recording, not to an estimate.
//
// The engine's <Captions> splits a clip's measured window between words by
// letter weight. That is right for TTS — we made the audio, so nothing can
// contradict the model. Here the audio is a real conversation, and the real
// word boundaries exist: scripts/transcribe.swift reads them off the footage
// and gen-source-cut.mjs maps them through the jump cut. This track just
// renders them.
import React, { useEffect, useMemo, useState } from "react";
import {
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  useDelayRender,
  useVideoConfig,
} from "remotion";
import { theme } from "../../theme";
import { ucColors, ucPalette } from "./palette";

type Token = { text: string; fromMs: number; toMs: number };
type Page = { startMs: number; endMs: number; outMs: number; tokens: Token[] };

const CaptionPage: React.FC<{ page: Page }> = ({ page }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const now = page.startMs + (frame / fps) * 1000;

  // The plate itself arrives — a caption that only fades reads as a subtitle,
  // and this reel wants the words to feel cut in.
  const enter = interpolate(frame, [0, 7], [0, 1], {
    easing: theme.ease.out,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: 90,
        right: 90,
        top: 1330,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "baseline",
          // The active word scales to 1.07, which eats the gap: at 18px the
          // words read as one run («ВСЕМПРИВЕТ»).
          gap: "14px 28px",
          maxWidth: 900,
          padding: "26px 34px",
          background: ucColors.plate,
          border: `2px solid ${ucColors.line}`,
          borderRadius: 26,
          boxShadow: ucColors.shadow,
          opacity: enter,
          transform: `translateY(${interpolate(enter, [0, 1], [26, 0])}px) scale(${interpolate(
            enter,
            [0, 1],
            [0.96, 1],
          )})`,
        }}
      >
        {page.tokens.map((token) => {
          const active = now >= token.fromMs && now < token.toMs;
          return (
            <span
              key={`${token.fromMs}-${token.text}`}
              style={{
                fontFamily: theme.fonts.wide,
                fontSize: 52,
                fontWeight: 800,
                lineHeight: 1.06,
                letterSpacing: "-0.03em",
                textTransform: "uppercase",
                color: active ? ucPalette.primary : ucColors.bone,
                textShadow: active ? `0 0 34px ${ucPalette.glow}` : "none",
                transform: `scale(${active ? 1.07 : 1})`,
                display: "inline-block",
              }}
            >
              {token.text}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export const CaptionsTrack: React.FC = () => {
  const { fps } = useVideoConfig();
  const { delayRender, continueRender, cancelRender } = useDelayRender();
  const [handle] = useState(() => delayRender("Loading unicorn-cafe captions"));
  const [pages, setPages] = useState<Page[]>([]);

  useEffect(() => {
    fetch(staticFile("captions/unicorn-cafe.json"))
      .then((response) => response.json())
      .then((json: Page[]) => {
        setPages(json);
        continueRender(handle);
      })
      .catch((error) => cancelRender(error));
  }, [cancelRender, continueRender, handle]);

  const sequences = useMemo(
    () =>
      pages.map((page) => ({
        page,
        from: Math.round((page.startMs / 1000) * fps),
        durationInFrames: Math.max(
          1,
          Math.round(((page.outMs - page.startMs) / 1000) * fps),
        ),
      })),
    [pages, fps],
  );

  return (
    <>
      {sequences.map(({ page, from, durationInFrames }) => (
        <Sequence
          key={page.startMs}
          from={from}
          durationInFrames={durationInFrames}
          name={`caption/${page.tokens.map((t) => t.text).join(" ")}`}
        >
          <CaptionPage page={page} />
        </Sequence>
      ))}
    </>
  );
};
