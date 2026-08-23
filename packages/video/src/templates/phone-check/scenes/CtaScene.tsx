// Beat 10 — the argument, then the loop. ЗАЩИТА (lime shield) against
// ПРИВАТНОСТЬ (paper padlock), a question mark between them, «напишите одно
// слово». In the last second and a half everything clears and the transfer
// screen rises back to its hook position with the finger a moment before
// the tap — the first frame of the reel is that tap.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { theme } from "../../../theme";
import { useIn, usePunch, useRamp } from "../../../reel";
import { pcColors, pcPalette } from "../palette";
import { BrandBar, Chip, Glitch, Kinetic, Padlock, Phone, SceneShell, Shield, Touch, TransferScreen, useExit } from "../ui";
import { BUTTON, PHONE } from "./shared";

const HEAD = 4;
const LEFT = 18;
const RIGHT = 26;
const MARK = 44;
const WRITE = 58; // «напишите»
const NOTE = 16;
const CLEAR = 150; // the argument leaves
const RISE = 152; // the phone comes back
const FINGER = 176;

export const CtaScene: React.FC<{ series: string; episode: string; amount: string; footnote: string }> = ({ series, episode, amount, footnote }) => {
  const frame = useCurrentFrame();
  const mark = usePunch(MARK, 14);
  const markIn = useIn(MARK, "bouncy");
  const note = useIn(NOTE, "smooth");
  const out = useExit(CLEAR, 12);
  const rise = useRamp(RISE, RISE + 32, theme.ease.out);
  const finger = useRamp(FINGER, FINGER + 14, theme.ease.out);
  const glitch = interpolate(frame, [MARK, MARK + 2, MARK + 10], [0, 0.7, 0], {
    easing: theme.ease.out,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const breathe = Math.sin(frame / 24) * 5;

  return (
    <SceneShell exit={false} shake={mark.shake * 0.4}>
      <BrandBar series={series} episode={episode} />

      <div style={{ position: "absolute", inset: 0, opacity: 1 - out, transform: `translateY(${-out * 50}px)` }}>
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 330 }}>
          <div style={{ width: 980 }}>
            <Kinetic text="ЗАЩИТА ИЛИ ПРИВАТНОСТЬ?" delay={HEAD} per={4} size={74} align="center" mode="snap" hero={[0]} style={{ justifyContent: "center" }} />
          </div>
          {frame >= WRITE && (
            <div style={{ marginTop: 22 }}>
              <Chip delay={WRITE} tone="paper" size={26}>
                НАПИШИТЕ ОДНО СЛОВО
              </Chip>
            </div>
          )}
        </AbsoluteFill>

        {/* left: protection */}
        <div style={{ position: "absolute", left: 40, top: 700, width: 460, display: "flex", flexDirection: "column", alignItems: "center", gap: 20, transform: `translateY(${breathe}px)` }}>
          <Kinetic text="ЗАЩИТА" delay={LEFT} per={0} size={48} mode="snap" hero={[0]} />
          <div style={{ position: "relative", width: 220, height: 430 }}>
            <Phone width={220} height={430} delay={LEFT + 4}>
              <div style={{ position: "absolute", inset: 0, transform: "scale(0.5)", transformOrigin: "top left", width: 440, height: 860 }}>
                <TransferScreen amount={amount} muted />
              </div>
            </Phone>
            <div style={{ position: "absolute", left: 10, top: 140 }}>
              <Shield size={200} delay={LEFT + 14} lit fill />
            </div>
          </div>
        </div>

        {/* right: privacy */}
        <div style={{ position: "absolute", left: 580, top: 700, width: 460, display: "flex", flexDirection: "column", alignItems: "center", gap: 20, transform: `translateY(${-breathe}px)` }}>
          <Kinetic text="ПРИВАТНОСТЬ" delay={RIGHT} per={0} size={48} mode="snap" color={pcColors.paper} />
          <div style={{ position: "relative", width: 220, height: 430 }}>
            <Phone width={220} height={430} delay={RIGHT + 4}>
              <div style={{ position: "absolute", inset: 0, transform: "scale(0.5)", transformOrigin: "top left", width: 440, height: 860 }}>
                <TransferScreen amount={amount} muted />
              </div>
            </Phone>
            <div style={{ position: "absolute", left: 20, top: 130 }}>
              <Padlock size={180} delay={RIGHT + 14} />
            </div>
          </div>
        </div>

        {/* the question between them */}
        <div
          style={{
            position: "absolute",
            left: 540 - 80,
            top: 940,
            width: 160,
            height: 160,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: Math.min(1, markIn * 2),
            transform: `scale(${interpolate(markIn, [0, 1], [2.6, 1])}) rotate(${interpolate(markIn, [0, 1], [-20, -6])}deg)`,
          }}
        >
          <Glitch amount={glitch}>
            <div
              style={{
                width: 160,
                height: 160,
                borderRadius: "50%",
                background: pcColors.ink2,
                border: `4px solid ${pcColors.paper}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: theme.fonts.wide,
                fontSize: 84,
                fontWeight: 900,
                color: pcColors.paper,
              }}
            >
              ?
            </div>
          </Glitch>
        </div>

        {/* the source */}
        <div
          style={{
            position: "absolute",
            left: 90,
            right: 90,
            top: 1610,
            textAlign: "center",
            fontFamily: theme.fonts.body,
            fontSize: 26,
            fontWeight: 500,
            letterSpacing: "0.02em",
            color: pcPalette.text,
            opacity: note * 0.7,
            transform: `translateY(${(1 - note) * 14}px)`,
          }}
        >
          {footnote}
        </div>
      </div>

      {/* the loop: the transfer screen comes back */}
      {frame >= RISE && (
        <>
          <div
            style={{
              position: "absolute",
              left: PHONE.left,
              top: interpolate(rise, [0, 1], [1920, PHONE.top]),
              transform: `scale(${interpolate(rise, [0, 1], [0.86, 1])})`,
              transformOrigin: "top center",
            }}
          >
            <Phone width={PHONE.width} height={PHONE.height} delay={-40}>
              <TransferScreen amount={amount} />
            </Phone>
          </div>
          <Touch x={BUTTON.x + (1 - finger) * 40} y={BUTTON.y + (1 - finger) * 120} press={0} opacity={finger} />
        </>
      )}
    </SceneShell>
  );
};
