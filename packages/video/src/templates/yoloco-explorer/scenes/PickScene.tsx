// 04 pick — «Оставить или вычеркнуть. Одно касание. Это Тиндер для
// маркетолога». Two taps, then two swipes, exactly as the card handles them:
// translateX + rotate(dragX / 24), the stamp past 24px, then the card snaps
// back carrying its verdict (emerald ring, or rose + struck + 60%).
import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../../theme";
import { COPY, Lang } from "../copy";
import { cues } from "../timeline";
import { AppScreen, SceneShell, Tap, UI_VIEW_H, Verdict, ease } from "../ui";
import { CardState, LAYOUT, ReportPage, cardTop } from "./report";
import { FOUND } from "./ResultsScene";

/** Out to `amp`, hold, back to 0 — the drag of one swipe, in px. */
const swipe = (frame: number, at: number, amp: number) => {
  const out = interpolate(frame, [at, at + 9], [0, amp], { easing: theme.ease.out, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const back = interpolate(frame, [at + 14, at + 22], [0, 1], { easing: theme.ease.inOut, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return out * (1 - back);
};

export const PickScene: React.FC<{ lang: Lang }> = ({ lang }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const copy = COPY[lang];
  const c = cues(lang, "pick").map((s) => Math.round(s * fps));

  // one decision per spoken page: tap keep, tap keep, swipe left, swipe right
  const tapAt = [c[0] + 6, c[1] + 2];
  const swipeAt = [c[2] + 4, c[3] + 4];
  const decided = (i: number) => (i < 2 ? frame >= tapAt[i] : frame >= swipeAt[i - 2] + 12);
  const verdicts: Verdict[] = ["keep", "keep", "reject", "keep"].map((v, i) => (decided(i) ? (v as Verdict) : "none"));

  // keep the active card centred in the viewport
  const active = [0, tapAt[0] + 8, swipeAt[0] - 10, swipeAt[1] - 10].reduce((acc, at, i) => (frame >= at ? i : acc), 0);
  const centre = (i: number) => cardTop(i, false) + LAYOUT.card / 2 - UI_VIEW_H / 2;
  const from = centre(Math.max(0, active - 1));
  const to = centre(active);
  const moveAt = [0, tapAt[0] + 8, swipeAt[0] - 10, swipeAt[1] - 10][active];
  const scroll = active === 0 ? to : from + (to - from) * ease(frame, moveAt, moveAt + 10, theme.ease.inOut);

  const cards: CardState[] = copy.creators.map((cr, i) => ({
    c: cr,
    verdict: verdicts[i],
    press: i < 2 && frame >= tapAt[i] - 2 && frame < tapAt[i] + 6 ? "keep" : null,
    drag: i === 2 ? swipe(frame, swipeAt[0], -250) : i === 3 ? swipe(frame, swipeAt[1], 250) : 0,
  }));
  const kept = verdicts.filter((v) => v === "keep").length;
  const rejected = verdicts.filter((v) => v === "reject").length;

  // the keep button of card i, in viewport coordinates (UI px)
  const keepBtn = (i: number) => ({ x: 16 + 14 + 95, y: cardTop(i, false) + LAYOUT.card - 14 - 17 - scroll });
  const hintIn = ease(frame, c[2] - 6, c[2] + 6);

  return (
    <SceneShell>
      <AppScreen
        url={copy.url.replace("/new", "/7c1e…")}
        scroll={scroll}
        overlay={
          <>
            <Tap x={keepBtn(0).x} y={keepBtn(0).y} at={tapAt[0]} />
            <Tap x={keepBtn(1).x} y={keepBtn(1).y} at={tapAt[1]} />
            {/* the swipe hint the app shows on touch screens */}
            <div
              style={{
                position: "absolute",
                left: 0,
                width: 430,
                top: UI_VIEW_H - 40,
                display: "flex",
                justifyContent: "center",
                opacity: hintIn,
                transform: `translateY(${(1 - hintIn) * 16}px)`,
              }}
            >
              <div
                style={{
                  padding: "6px 14px",
                  borderRadius: 999,
                  background: "rgba(15,23,42,0.82)",
                  color: "#fff",
                  fontFamily: theme.fonts.body,
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.02em",
                }}
              >
                {copy.swipeHint}
              </div>
            </div>
          </>
        }
      >
        <ReportPage lang={lang} cards={cards} found={FOUND} kept={kept} rejected={rejected} rounds={1} />
      </AppScreen>
    </SceneShell>
  );
};
