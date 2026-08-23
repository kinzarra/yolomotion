// Beat 9 — the frame tears in two: the card you have vs the wallet you
// could have. VS lands on the tear. Neither side wins here; the question is
// the point.
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../../theme";
import { usePunch } from "../../../reel";
import { drColors, drPalette } from "../palette";
import { BankCard, BrandBar, Chip, Flash, Glitch, Kinetic, Phone, RubleMark, SceneShell } from "../ui";

const TEAR = 8;
const LEFT = 18;
const RIGHT = 26;
const VS = 46;

// a jagged tear down the middle of the lower frame
const TEAR_PATH = "M540 560 L522 640 L556 720 L530 820 L562 900 L526 1000 L556 1100 L534 1200 L552 1300 L540 1340";

export const QuestionScene: React.FC<{ series: string; episode: string }> = ({ series, episode }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const punch = usePunch(VS, 16);
  const tear = interpolate(frame, [TEAR, TEAR + 22], [0, 1], {
    easing: theme.ease.inOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const vs = spring({ frame: frame - VS, fps, config: theme.spring.bouncy });
  const part = spring({ frame: frame - VS, fps, config: theme.spring.smooth });
  const glitch = interpolate(frame, [VS, VS + 2, VS + 10], [0, 0.8, 0], {
    easing: theme.ease.out,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const breathe = Math.sin(frame / 26) * 5;

  return (
    <SceneShell shake={punch.shake * 0.6}>
      <BrandBar series={series} episode={episode} />

      <AbsoluteFill style={{ alignItems: "center", paddingTop: 330 }}>
        <div style={{ width: 960 }}>
          <Kinetic text="УДОБНЕЕ КАРТЫ?" delay={2} per={4} size={96} align="center" style={{ justifyContent: "center" }} />
        </div>
      </AbsoluteFill>

      {/* left: the card */}
      <div
        style={{
          position: "absolute",
          left: 40,
          top: 760,
          width: 460,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 30,
          transform: `translateX(${-part * 18}px) translateY(${breathe}px)`,
        }}
      >
        <div style={{ transform: "rotate(-8deg)" }}>
          <BankCard width={420} tone="paper" delay={LEFT} />
        </div>
        <Chip delay={LEFT + 12} tone="paper" size={24}>
          КАРТА
        </Chip>
      </div>

      {/* right: the wallet */}
      <div
        style={{
          position: "absolute",
          right: 60,
          top: 620,
          width: 420,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 30,
          transform: `translateX(${part * 18}px) translateY(${-breathe}px)`,
        }}
      >
        <Phone width={300} height={540} delay={RIGHT}>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 30 }}>
            <RubleMark size={190} delay={RIGHT + 8} />
          </div>
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 44,
              textAlign: "center",
              fontFamily: theme.fonts.mono,
              fontSize: 20,
              letterSpacing: "0.18em",
              color: drPalette.textDim,
            }}
          >
            КОШЕЛЁК
          </div>
        </Phone>
        <Chip delay={RIGHT + 12} tone="neutral" size={24}>
          ЦИФРОВОЙ
        </Chip>
      </div>

      {/* the tear */}
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <path
          d={TEAR_PATH}
          fill="none"
          stroke={drColors.paper}
          strokeWidth={6}
          strokeLinejoin="round"
          strokeDasharray={900}
          strokeDashoffset={900 * (1 - tear)}
        />
      </svg>

      {/* VS */}
      <div
        style={{
          position: "absolute",
          left: 540 - 90,
          top: 900,
          width: 180,
          height: 180,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: Math.min(1, vs * 2),
          transform: `scale(${interpolate(vs, [0, 1], [2.6, 1])}) rotate(${interpolate(vs, [0, 1], [-20, -6])}deg)`,
        }}
      >
        <Glitch amount={glitch}>
          <div
            style={{
              width: 180,
              height: 180,
              borderRadius: "50%",
              background: drColors.ink2,
              border: `4px solid ${drColors.paper}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: theme.fonts.wide,
              fontSize: 64,
              fontWeight: 900,
              color: drColors.paper,
            }}
          >
            VS
          </div>
        </Glitch>
      </div>

      <Flash amount={punch.pop * 0.4} color={drColors.paper} />
    </SceneShell>
  );
};
