// 05 problem — 20.9–27.4s. The question the whole story turns on.
//
// One show card splits into two identical copies and each is handed to a
// platform. This is the reel's one deliberate two-red frame: the marks are
// the same colour on purpose, because the point is that the content under
// them is the same too. Then everything is taken away and the question sits
// alone in near-silence — the only beat in the reel where nothing moves but
// the vignette.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { theme } from "../../../theme";
import { ynColors, ynPalette } from "../palette";
import {
  Folio,
  Footnote,
  Mono,
  NetflixMark,
  SceneShell,
  ShowCard,
  Slam,
  YouTubeMark,
  ramp,
  usePunch,
} from "../ui";

const SPLIT_AT = 34;
const PLATFORMS_AT = 54;
const VALUE_AT = 78;
const DEGRADE_AT = 106;
const CLEAR_AT = 132;
const ASK_AT = 142;

export const ProblemScene: React.FC = () => {
  const frame = useCurrentFrame();
  const split = ramp(frame, SPLIT_AT, SPLIT_AT + 24, theme.ease.inOut);
  const plat = ramp(frame, PLATFORMS_AT, PLATFORMS_AT + 18);
  const value = ramp(frame, VALUE_AT, VALUE_AT + 16);
  const degrade = ramp(frame, DEGRADE_AT, DEGRADE_AT + 12, theme.ease.in);
  const clear = ramp(frame, CLEAR_AT, CLEAR_AT + 12, theme.ease.in);
  const hit = usePunch(ASK_AT, 20);

  // One card becomes two: the copy travels out from under the original.
  const spread = interpolate(split, [0, 1], [0, 268]);
  const cardW = interpolate(split, [0, 1], [700, 452]);
  const stage = 1 - clear;

  return (
    <SceneShell exit={false} light={0.45}>
      <div style={{ opacity: stage, transform: `scale(${1 - clear * 0.06})` }}>
        <Folio left="04 · WHY YOUTUBE CARES" right="SAME CONTENT" delay={-6} />

        {/* left copy (and, before the split, the only copy) */}
        <div
          style={{
            position: "absolute",
            left: 540 - cardW / 2 - spread,
            top: 640,
          }}
        >
          <ShowCard width={cardW} title="THE SHOW" meta="S1 · 8 EPISODES" delay={4} badge="ORIGINAL" />
        </div>
        {/* right copy */}
        {split > 0 && (
          <div
            style={{
              position: "absolute",
              left: 540 - cardW / 2 + spread,
              top: 640,
              opacity: split,
            }}
          >
            <ShowCard
              width={cardW}
              title="THE SHOW"
              meta="S1 · 8 EPISODES"
              delay={SPLIT_AT}
              badge="ORIGINAL"
            />
          </div>
        )}

        {/* The two claimants — same red, told apart by form only. They dim as
            the value degrades: the ??? has to be the one full-strength red in
            that frame, and it is the frame's whole point. */}
        <div style={{ opacity: plat * (1 - degrade * 0.62) }}>
          <YouTubeMark width={132} progress={plat} style={{ position: "absolute", left: 122, top: 470 }} />
          <div style={{ position: "absolute", left: 122, top: 588 }}>
            <Mono size={24} color={ynColors.bone}>
              YOUTUBE
            </Mono>
          </div>
          <NetflixMark height={128} progress={plat} style={{ position: "absolute", left: 826, top: 462 }} />
          <div style={{ position: "absolute", left: 826, top: 588 }}>
            <Mono size={24} color={ynColors.bone}>
              NETFLIX
            </Mono>
          </div>
        </div>

        {/* exclusive value: 100% → ??? */}
        <div style={{ position: "absolute", left: 0, right: 0, top: 1046, textAlign: "center" }}>
          <div style={{ opacity: value }}>
            <Mono size={25} style={{ display: "inline-block" }}>
              EXCLUSIVE VALUE
            </Mono>
          </div>
          <div
            style={{
              marginTop: 18,
              fontFamily: theme.fonts.wide,
              fontSize: 128,
              fontWeight: 900,
              letterSpacing: "-0.04em",
              lineHeight: 1,
              color: degrade > 0.5 ? ynPalette.primary : ynColors.bone,
              opacity: value,
              transform: `translateY(${interpolate(value, [0, 1], [26, 0])}px) scale(${interpolate(degrade, [0, 0.5, 1], [1, 0.86, 1])})`,
            }}
          >
            {degrade > 0.5 ? "???" : "100%"}
          </div>
        </div>

        <Footnote delay={VALUE_AT + 6} style={{ position: "absolute", left: 0, right: 0, top: 1268, textAlign: "center" }}>
          Conceptual visualisation — not data
        </Footnote>
      </div>

      {/* …and then the frame is only the question. */}
      <div
        style={{
          position: "absolute",
          left: 60,
          right: 60,
          top: 780,
          transform: `translate(${hit.shake * 0.3}px, ${hit.shake}px)`,
        }}
      >
        <Slam text="WHY WATCH" at={ASK_AT} size={168} align="left" />
        <Slam text="HERE?" at={ASK_AT + 7} size={168} align="left" color={ynPalette.primary} />
      </div>
    </SceneShell>
  );
};
