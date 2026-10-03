import React, { useEffect, useMemo, useState } from "react";
import { Caption, createTikTokStyleCaptions, TikTokPage } from "@remotion/captions";
import {
  Sequence,
  staticFile,
  useCurrentFrame,
  useDelayRender,
  useVideoConfig,
} from "remotion";
import { theme } from "../../theme";
import { gasColors, gasPalette } from "./palette";

const alarmWords = ["бензин", "дефицит", "дорожают", "дороже", "растёт", "исчезает"];

const CaptionPage: React.FC<{ page: TikTokPage }> = ({ page }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const now = page.startMs + (frame / fps) * 1000;
  return (
    <div
      style={{
        position: "absolute",
        left: 70,
        right: 70,
        top: 1450,
        minHeight: 164,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexWrap: "wrap",
        alignContent: "center",
        padding: "24px 32px",
        background: `${gasPalette.bg}E8`,
        border: `2px solid ${gasColors.lineStrong}`,
        boxShadow: gasColors.shadow,
        fontFamily: theme.fonts.wide,
        fontSize: 42,
        fontWeight: 800,
        lineHeight: 1.22,
        letterSpacing: "-0.025em",
        textAlign: "center",
        textTransform: "uppercase",
      }}
    >
      {page.tokens.map((token) => {
        const active = now >= token.fromMs && now < token.toMs;
        const alarm = alarmWords.some((word) => token.text.toLowerCase().includes(word));
        return (
          <span
            key={`${token.fromMs}-${token.text}`}
            style={{
              whiteSpace: "pre-wrap",
              color: active ? (alarm ? gasColors.bad : gasPalette.primary) : gasPalette.text,
              textShadow: active ? `0 0 28px ${alarm ? gasColors.badGlow : gasPalette.glow}` : "none",
              transform: `scale(${active ? 1.06 : 1})`,
            }}
          >
            {token.text}
          </span>
        );
      })}
    </div>
  );
};

export const CaptionsTrack: React.FC = () => {
  const { fps } = useVideoConfig();
  const { delayRender, continueRender, cancelRender } = useDelayRender();
  const [handle] = useState(() => delayRender("Loading gasoline captions"));
  const [captions, setCaptions] = useState<Caption[] | null>(null);

  useEffect(() => {
    fetch(staticFile("captions/gasoline-inflation.json"))
      .then((response) => response.json())
      .then((json: Caption[]) => {
        setCaptions(json);
        continueRender(handle);
      })
      .catch((error) => cancelRender(error));
  }, [cancelRender, continueRender, handle]);

  const pages = useMemo(
    () =>
      captions
        ? createTikTokStyleCaptions({
            captions,
            combineTokensWithinMilliseconds: 760,
          }).pages
        : [],
    [captions],
  );

  return (
    <>
      {pages.map((page) => (
        <Sequence
          key={page.startMs}
          from={Math.round((page.startMs / 1000) * fps)}
          durationInFrames={Math.ceil(((page.durationMs + 120) / 1000) * fps)}
          name="captions"
        >
          <CaptionPage page={page} />
        </Sequence>
      ))}
    </>
  );
};
