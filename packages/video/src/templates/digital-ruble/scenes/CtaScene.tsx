// Beat 10 — ОТКРОЕТЕ? Two answers, a comment counter that won't sit still,
// and one last receipt line: send it to the one who thinks cash is over.
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../../theme";
import { usePunch } from "../../../reel";
import { drColors, drPalette } from "../palette";
import { BrandBar, Counter, Flash, Kinetic, Receipt, ReceiptLine, SceneShell } from "../ui";

const HEAD = 2;
const YES = 26;
const NO = 32;
const COUNT = 60;
const PS = 150;

const Answer: React.FC<{ label: string; tone: "yes" | "no"; delay: number }> = ({ label, tone, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: theme.spring.bouncy });
  const pulse = tone === "yes" ? 1 + Math.sin(frame / 7) * 0.02 : 1;
  const yes = tone === "yes";
  return (
    <div
      style={{
        width: 400,
        height: 160,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 24,
        background: yes ? drPalette.primary : "transparent",
        border: `4px solid ${yes ? drPalette.primary : drColors.bad}`,
        boxShadow: yes ? `0 0 70px ${drPalette.glow}` : undefined,
        color: yes ? drColors.ink2 : drColors.bad,
        fontFamily: theme.fonts.wide,
        fontSize: 76,
        fontWeight: 900,
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [60, 0])}px) scale(${interpolate(p, [0, 1], [0.7, 1]) * pulse})`,
      }}
    >
      {label}
    </div>
  );
};

export const CtaScene: React.FC<{
  series: string;
  episode: string;
  yesLabel: string;
  noLabel: string;
  commentTarget: number;
}> = ({ series, episode, yesLabel, noLabel, commentTarget }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const punch = usePunch(YES, 14);
  const cnt = spring({ frame: frame - COUNT, fps, config: theme.spring.smooth });
  // the counter jitters while it climbs — comments landing
  const jitter = frame > COUNT && frame < COUNT + 80 ? Math.sin(frame * 2.3) * 2 : 0;

  return (
    <SceneShell exit={false} shake={punch.shake * 0.5}>
      <BrandBar series={series} episode={episode} />

      <AbsoluteFill style={{ alignItems: "center", paddingTop: 330 }}>
        <div style={{ width: 960 }}>
          <Kinetic text="ОТКРОЕТЕ?" delay={HEAD} per={4} size={108} mode="snap" align="center" style={{ justifyContent: "center" }} />
        </div>
        <div style={{ display: "flex", gap: 36, marginTop: 60 }}>
          <Answer label={yesLabel} tone="yes" delay={YES} />
          <Answer label={noLabel} tone="no" delay={NO} />
        </div>
      </AbsoluteFill>

      {/* comment counter */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 800,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 6,
          opacity: cnt,
          transform: `translateY(${interpolate(cnt, [0, 1], [30, 0]) + jitter}px)`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
          {/* speech bubble */}
          <div style={{ position: "relative", width: 92, height: 74 }}>
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: 24,
                border: `5px solid ${drPalette.text}`,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 18,
                bottom: -16,
                width: 24,
                height: 24,
                borderLeft: `5px solid ${drPalette.text}`,
                borderBottom: `5px solid ${drPalette.text}`,
                background: drPalette.bg,
                transform: "skewX(20deg)",
              }}
            />
          </div>
          <Counter to={commentTarget} delay={COUNT} size={128} />
        </div>
        <div
          style={{
            fontFamily: theme.fonts.mono,
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: "0.2em",
            color: drPalette.textDim,
          }}
        >
          КОММЕНТАРИЕВ
        </div>
      </div>

      <AbsoluteFill style={{ alignItems: "center", paddingTop: 1070 }}>
        <Receipt width={700} printFrom={PS} printFrames={30} title="P.S." number="↗ ПОДЕЛИТЬСЯ" tilt={1.2}>
          <ReceiptLine label="ОТПРАВЬ ТОМУ, КТО ДУМАЕТ," size={25} delay={PS + 6} />
          <ReceiptLine label="ЧТО НАЛИЧНЫЕ ОТМЕНЯЮТ" mark="cross" size={25} delay={PS + 14} />
        </Receipt>
      </AbsoluteFill>

      <Flash amount={punch.pop * 0.5} />
    </SceneShell>
  );
};
