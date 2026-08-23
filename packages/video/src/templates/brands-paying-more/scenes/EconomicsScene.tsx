// 05 economics — 26.5–31.5s. The whole argument as an equation. The old model
// is set, struck through, and replaced by the same two terms plus a third the
// industry did not use to price. RISK is the last vermilion of the reel's
// first half; from here the accent is spent and the answer is bone.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { theme } from "../../../theme";
import { bpmColors, bpmPalette } from "../palette";
import { Eyebrow, Kinetic, Mono, SceneShell, Slam, Strike, ramp, usePunch } from "../ui";

const OLD_AT = 0;
const STRIKE_AT = 44;
const SWAP_AT = 60;
const RISK_AT = 78;

const Term: React.FC<{ text: string; delay: number; size?: number }> = ({
  text,
  delay,
  size = 74,
}) => <Kinetic text={text} delay={delay} per={3} size={size} color={bpmColors.bone} />;

const Plus: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const p = ramp(frame, delay, delay + 12);
  return (
    <div
      style={{
        fontFamily: theme.fonts.mono,
        fontSize: 46,
        fontWeight: 500,
        color: bpmPalette.textDim,
        opacity: p,
        transform: `scale(${0.7 + p * 0.3})`,
      }}
    >
      +
    </div>
  );
};

export const EconomicsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const strike = ramp(frame, STRIKE_AT, STRIKE_AT + 12);
  const swap = ramp(frame, SWAP_AT, SWAP_AT + 10, theme.ease.in);
  const riskHit = usePunch(RISK_AT, 18);

  // Slow push once the new model is on the page — the frame closes in on RISK.
  const push = ramp(frame, SWAP_AT, 150, theme.ease.inOut);

  return (
    <SceneShell>
      <AbsoluteFill
        style={{
          transform: `scale(${1 + push * 0.09})`,
          transformOrigin: "50% 62%",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 486,
            display: "flex",
            justifyContent: "center",
          }}
        >
          {frame < SWAP_AT + 10 ? (
            <Mono size={22} color={bpmPalette.textDim}>
              The old model
            </Mono>
          ) : (
            <Eyebrow delay={SWAP_AT + 10} rule={false}>
              What it costs now
            </Eyebrow>
          )}
        </div>

        {/* the old model */}
        {swap < 1 && (
          <div
            style={{
              position: "absolute",
              left: 72,
              right: 72,
              top: 606,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 22,
              opacity: 1 - swap,
              transform: `translateY(${swap * -46}px)`,
            }}
          >
            <div style={{ position: "relative" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
                <Term text="BRAND MONEY" delay={OLD_AT} />
                <Plus delay={OLD_AT + 12} />
                <Term text="CREATOR REACH" delay={OLD_AT + 18} />
              </div>
              <Strike progress={strike} thickness={9} tilt={-2.5} />
            </div>
          </div>
        )}

        {/* the new one */}
        {frame >= SWAP_AT && (
          <div
            style={{
              position: "absolute",
              left: 72,
              right: 72,
              top: 566,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 18,
            }}
          >
            <Term text="BRAND MONEY" delay={SWAP_AT + 4} size={62} />
            <Plus delay={SWAP_AT + 12} />
            <Term text="CREATOR REACH" delay={SWAP_AT + 16} size={62} />
            <Plus delay={SWAP_AT + 24} />
            <div style={{ height: 10 }} />
            <Mono size={22} color={bpmPalette.textDim}>
              Reputation
            </Mono>
            <div style={{ transform: `scale(${1 + riskHit.pop * 0.05})` }}>
              <Slam text="RISK" at={RISK_AT} size={244} color={bpmPalette.primary} />
            </div>
          </div>
        )}
      </AbsoluteFill>
    </SceneShell>
  );
};
