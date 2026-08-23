// 09 yoloco — 52–59s. The field the last beat pulled back to is still there,
// scattered; over two seconds it snaps into a grid, everything dims, and one
// card lifts out of it into the middle of the page. Noise becomes structure,
// structure becomes a choice. Then black, and the brand.
//
// No accent anywhere except the chosen card's hairline: the payoff frame of
// this reel is black and bone, which is the whole point of having spent the
// vermilion on the problem.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { theme } from "../../../theme";
import { bpmColors, bpmPalette } from "../palette";
import {
  Field,
  FIELD_CHOSEN,
  Kinetic,
  Mono,
  SceneShell,
  YolocoMark,
  YolocoWordmark,
  ramp,
  useIn,
} from "../ui";

const SNAP_AT = 8;
const POP_AT = 58;
const CLEAR_AT = 96;
const BRAND_AT = 108;

export const YolocoScene: React.FC<{ ctaLabel: string; url: string }> = ({ ctaLabel, url }) => {
  const frame = useCurrentFrame();
  const snap = ramp(frame, SNAP_AT, SNAP_AT + 46, theme.ease.inOut);
  const pop = ramp(frame, POP_AT, POP_AT + 26, theme.ease.out);
  const clear = ramp(frame, CLEAR_AT, CLEAR_AT + 10, theme.ease.in);
  const urlIn = useIn(BRAND_AT + 24, "smooth");
  const noteIn = useIn(BRAND_AT + 10, "smooth");
  const label = ramp(frame, POP_AT + 14, POP_AT + 28);

  return (
    <SceneShell exit={false}>
      <AbsoluteFill style={{ opacity: 1 - clear }}>
        <Field
          t={snap}
          dim={0.5 - pop * 0.34}
          pop={pop}
          chosen={FIELD_CHOSEN}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 1010,
            display: "flex",
            justifyContent: "center",
            opacity: label,
          }}
        >
          <Mono size={22} color={bpmColors.bone}>
            One creator who fits
          </Mono>
        </div>
      </AbsoluteFill>

      {frame >= BRAND_AT - 2 && (
        <AbsoluteFill
          style={{
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 44,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <YolocoMark size={92} delay={BRAND_AT} />
            <YolocoWordmark size={84} delay={BRAND_AT + 5} />
          </div>
          <Kinetic text={ctaLabel} delay={BRAND_AT + 12} per={4} size={62} />
          <Mono
            size={26}
            color={bpmPalette.text}
            style={{
              letterSpacing: "0.08em",
              textTransform: "none",
              opacity: urlIn,
              transform: `translateY(${(1 - urlIn) * 14}px)`,
            }}
          >
            {url}
          </Mono>
        </AbsoluteFill>
      )}

      {/* The reel makes no claim about any real deal, creator or comment —
          it says so once, at the foot of the last page. */}
      <div
        style={{
          position: "absolute",
          left: 72,
          right: 72,
          top: 1640,
          textAlign: "center",
          fontFamily: theme.fonts.mono,
          fontSize: 17,
          letterSpacing: "0.05em",
          color: bpmPalette.textDim,
          opacity: noteIn * 0.6,
        }}
      >
        Figures, creators and comments in this video are illustrative
      </div>
    </SceneShell>
  );
};
