// 03 trust — 14–20s. One conceptual creator, two numbers moving in opposite
// directions: the fee counts up in bone, audience trust steps down in the
// accent. Then the card, the fee and the percentages all blow off the page and
// one word is left holding the frame — and it cracks.
//
// Both figures are invented for the argument, so both carry the footnote in
// frame rather than in a caption.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { theme } from "../../../theme";
import { bpmColors, bpmPalette } from "../palette";
import {
  Avatar,
  Crack,
  Eyebrow,
  Footnote,
  Mono,
  Num,
  Rule,
  SceneShell,
  Slam,
  ramp,
  useIn,
  usePunch,
} from "../ui";

const CARD_AT = 0;
const FEE_AT = 18;
const TRUST_AT = 58;
// The word lands on the word: the clip's last (hidden) caption page starts
// around frame 129, so the page has to be clear by 126.
const BLOW_AT = 116;
const WORD_AT = 126;
const CRACK_AT = 144;

// Conceptual, and labelled as such on screen.
const STEPS = [
  { at: TRUST_AT, value: "100%", bar: 1 },
  { at: TRUST_AT + 16, value: "87%", bar: 0.87 },
  { at: TRUST_AT + 30, value: "64%", bar: 0.64 },
];

export const TrustScene: React.FC = () => {
  const frame = useCurrentFrame();
  const cardIn = useIn(CARD_AT, "smooth");
  const feeIn = useIn(FEE_AT, "snappy");

  // The fee counts, it does not appear. 0 → 250,000 over 40 frames.
  const feeP = ramp(frame, FEE_AT, FEE_AT + 40, theme.ease.out);
  const fee = Math.round((feeP * 250_000) / 1000) * 1000;

  const step = STEPS.filter((s) => frame >= s.at).pop();
  const stepHit = usePunch(step?.at ?? 10_000, 12);
  const blow = ramp(frame, BLOW_AT, BLOW_AT + 12, theme.ease.in);
  const crack = ramp(frame, CRACK_AT, CRACK_AT + 26, theme.ease.out);
  const wordHit = usePunch(WORD_AT, 16);

  return (
    <SceneShell>
      <AbsoluteFill
        style={{
          opacity: 1 - blow,
          transform: `translateY(${blow * -70}px) scale(${1 + blow * 0.08})`,
        }}
      >
        {/* the creator */}
        <div
          style={{
            position: "absolute",
            left: 72,
            top: 400,
            display: "flex",
            alignItems: "center",
            gap: 30,
            opacity: cardIn,
            transform: `translateY(${interpolate(cardIn, [0, 1], [34, 0])}px)`,
          }}
        >
          <Avatar size={104} />
          <div>
            <Mono size={20}>Creator</Mono>
            <div
              style={{
                fontFamily: theme.fonts.display,
                fontSize: 62,
                fontWeight: 700,
                letterSpacing: "-0.035em",
                lineHeight: 1.06,
                color: bpmColors.bone,
              }}
            >
              2.8M FOLLOWERS
            </div>
          </div>
        </div>
        <Rule
          width={936}
          delay={CARD_AT + 10}
          color={bpmColors.line}
          style={{ position: "absolute", left: 72, top: 552 }}
        />

        {/* what the deal pays */}
        <div style={{ position: "absolute", left: 72, top: 604 }}>
          <Eyebrow delay={FEE_AT}>Brand deal</Eyebrow>
        </div>
        <div
          style={{
            position: "absolute",
            left: 72,
            top: 650,
            opacity: feeIn,
            transform: `translateY(${interpolate(feeIn, [0, 1], [26, 0])}px)`,
          }}
        >
          <Num size={112}>+${fee.toLocaleString("en-US")}</Num>
        </div>

        {/* what it costs */}
        <div style={{ position: "absolute", left: 72, top: 830 }}>
          <Eyebrow delay={TRUST_AT} color={bpmPalette.textDim}>
            Audience trust
          </Eyebrow>
        </div>
        {/* The percentage only exists once the beat gets to it — the first cut
            showed 100% from frame 0, which gave the fall away before the
            voice had said what was falling. */}
        {step && (
          <>
            <div
              style={{
                position: "absolute",
                left: 72,
                top: 872,
                transform: `scale(${1 + stepHit.pop * 0.06})`,
                transformOrigin: "left top",
              }}
            >
              <Num size={144} color={bpmPalette.primary}>
                {step.value}
              </Num>
            </div>
            <div
              style={{
                position: "absolute",
                left: 72,
                top: 1046,
                width: 936,
                height: 8,
                borderRadius: 2,
                background: bpmColors.surface,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  width: `${step.bar * 100}%`,
                  borderRadius: 2,
                  background: bpmPalette.primary,
                }}
              />
            </div>
          </>
        )}
        <Footnote delay={TRUST_AT + 10} style={{ position: "absolute", left: 72, top: 1092 }}>
          Conceptual illustration — not research data
        </Footnote>
      </AbsoluteFill>

      {/* the word that is left */}
      {frame >= WORD_AT && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          <div
            style={{
              position: "relative",
              transform: `translateY(-120px) scale(${1 + wordHit.pop * 0.04})`,
            }}
          >
            <Slam text="TRUST" at={WORD_AT} size={268} />
            {/* The fissures are drawn in the page colour, over the word: they
                read as the letterforms splitting rather than as scratches
                across a black frame, and outside the word they are invisible
                because they are the background. */}
            <Crack progress={crack} color={bpmPalette.bg} length={520} />
          </div>
        </AbsoluteFill>
      )}
    </SceneShell>
  );
};
