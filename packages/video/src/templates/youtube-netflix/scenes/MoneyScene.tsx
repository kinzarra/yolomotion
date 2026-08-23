// 06 money — 27.4–34.4s. The transfer board.
//
// Two columns of a financing board: the model everybody grew up with, struck
// through, and the one being discussed next to it. Then the part that makes it
// a transfer story rather than a business-model diagram — a creator card
// walking from one column toward the other while the loser keeps hold of it.
//
// Every rung is mono type on a hairline: this is a document, not an infographic.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { theme } from "../../../theme";
import { ynColors, ynPalette } from "../palette";
import {
  Chip,
  CreatorCard,
  Folio,
  Mono,
  NetflixMark,
  SceneShell,
  Strike,
  YouTubeMark,
  ramp,
} from "../ui";

const OLD = ["CREATOR", "UPLOAD", "ADS", "REVENUE SHARE"];
const NEW = ["PLATFORM", "$ $ $ $", "CREATOR", "EXCLUSIVE CONTENT"];

const OLD_AT = 6;
const STRIKE_AT = 58;
const NEW_AT = 76;
const BRAND_AT = 132;
const TUG_AT = 150;

const ROW_H = 84;

const Rung: React.FC<{
  text: string;
  i: number;
  at: number;
  x: number;
  y: number;
  w: number;
  strong?: boolean;
}> = ({ text, i, at, x, y, w, strong = false }) => {
  const frame = useCurrentFrame();
  const p = ramp(frame, at + i * 9, at + i * 9 + 16, theme.ease.out);
  return (
    <>
      {i > 0 && (
        <div
          style={{
            position: "absolute",
            left: x + 22,
            top: y + i * ROW_H - 30,
            fontFamily: theme.fonts.mono,
            fontSize: 26,
            color: ynColors.dim,
            opacity: ramp(frame, at + i * 9 - 6, at + i * 9 + 4),
          }}
        >
          ↓
        </div>
      )}
      <div
        style={{
          position: "absolute",
          left: x,
          top: y + i * ROW_H,
          width: w,
          padding: "13px 16px",
          boxSizing: "border-box",
          borderLeft: `3px solid ${ynColors.lineStrong}`,
          background: strong ? ynColors.surface : "transparent",
          fontFamily: theme.fonts.mono,
          fontSize: 27,
          fontWeight: 600,
          letterSpacing: "0.1em",
          whiteSpace: "nowrap",
          color: strong ? ynColors.bone : ynPalette.text,
          opacity: p,
          transform: `translateX(${interpolate(p, [0, 1], [-26, 0])}px)`,
        }}
      >
        {text}
      </div>
    </>
  );
};

export const MoneyScene: React.FC = () => {
  const frame = useCurrentFrame();
  const strike = ramp(frame, STRIKE_AT, STRIKE_AT + 16, theme.ease.out);
  const oldDim = 1 - ramp(frame, STRIKE_AT + 10, STRIKE_AT + 30) * 0.62;
  const tug = ramp(frame, TUG_AT, TUG_AT + 34, theme.ease.inOut);

  return (
    <SceneShell light={0.45}>
      <Folio left="05 · THE NEW BATTLE" right="MODEL SHIFT" delay={-6} />

      {/* ------------------------------------------------------- old model */}
      {/* The strike goes through the TITLE, which is what the brief asks for
          and what actually reads: a rule drawn across the middle of a
          four-rung column looks like it crossed out one rung. */}
      <div style={{ opacity: oldDim }}>
        <div style={{ position: "absolute", left: 84, top: 396, width: 210, height: 30 }}>
          <Mono size={24} color={ynColors.bone}>
            OLD MODEL
          </Mono>
          <Strike progress={strike} color={ynPalette.primary} thickness={5} tilt={0} />
        </div>
        <div style={{ position: "absolute", left: 84, top: 452, width: 340, height: 2, background: ynColors.line }} />
        {OLD.map((t, i) => (
          <Rung key={t} text={t} i={i} at={OLD_AT} x={84} y={500} w={340} />
        ))}
      </div>

      {/* ------------------------------------------------------ new battle */}
      <Mono
        size={24}
        color={ynColors.bone}
        style={{ position: "absolute", left: 566, top: 400, opacity: ramp(frame, NEW_AT - 6, NEW_AT + 8) }}
      >
        NEW BATTLE
      </Mono>
      <div
        style={{
          position: "absolute",
          left: 566,
          top: 452,
          width: 430 * ramp(frame, NEW_AT - 4, NEW_AT + 14),
          height: 2,
          background: ynColors.lineStrong,
        }}
      />
      {NEW.map((t, i) => (
        <Rung key={t} text={t} i={i} at={NEW_AT} x={566} y={500} w={430} strong={i === 1} />
      ))}
      <div style={{ position: "absolute", left: 566, top: 840 }}>
        <Chip delay={BRAND_AT} size={25} color={ynColors.lineStrong}>
          + BRAND DEALS
        </Chip>
      </div>

      {/* ------------------------------------------------------ the tug */}
      {/* Deadline day: the card is already moving, and the other side has not
          let go of it. It is held one frame short of arriving — nothing in
          this story is signed. */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 1040 }}>
        <YouTubeMark
          width={112}
          progress={ramp(frame, TUG_AT - 12, TUG_AT)}
          style={{ position: "absolute", left: 906, top: 62 }}
        />
        <NetflixMark
          height={116}
          progress={ramp(frame, TUG_AT - 12, TUG_AT)}
          style={{ position: "absolute", left: 84, top: 38 }}
        />
        <CreatorCard
          code="CREATOR"
          meta="UNDER OFFER"
          width={452}
          delay={TUG_AT - 16}
          bar={0.66}
          style={{
            position: "absolute",
            left: 258 + tug * 160,
            top: 26,
            transform: `rotate(${interpolate(tug, [0, 0.6, 1], [0, 2.4, 1.2])}deg)`,
          }}
        />
        {/* the rope Netflix has not dropped */}
        <div
          style={{
            position: "absolute",
            left: 160,
            top: 106,
            width: 98 + tug * 160,
            height: 3,
            background: ynColors.lineStrong,
            opacity: ramp(frame, TUG_AT, TUG_AT + 10) * (1 - tug * 0.35),
          }}
        />
      </div>
    </SceneShell>
  );
};
