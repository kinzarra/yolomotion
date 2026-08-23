// Beat 6 — the turn. A red ОТКРЫТЬ АВТОМАТИЧЕСКИ button pulses, then
// shatters into shards that fall out of the frame; a switch flips to lime
// under ТОЛЬКО ПО ЖЕЛАНИЮ. The receipt files the two facts.
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../../theme";
import { usePunch } from "../../../reel";
import { drColors, drPalette } from "../palette";
import { BrandBar, Eyebrow, Flash, Kinetic, Receipt, ReceiptLine, SceneShell, Toggle, rnd } from "../ui";

const BUTTON = 4;
const SHATTER = 44;
const TOGGLE = SHATTER + 18;
const FLIP = TOGGLE + 16;
const COLS = 4;
const ROWS = 3;

const RedButton: React.FC = () => (
  <div
    style={{
      width: 760,
      height: 230,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      background: `linear-gradient(180deg, ${drColors.bad}, #C91F1F)`,
      border: `3px solid #FF7A7A`,
      borderRadius: 28,
      boxShadow: `0 0 70px ${drColors.badGlow}, ${drColors.shadow}`,
      fontFamily: theme.fonts.wide,
      fontSize: 52,
      fontWeight: 900,
      lineHeight: 1.06,
      color: drColors.white,
    }}
  >
    ОТКРЫТЬ
    <br />
    АВТОМАТИЧЕСКИ
  </div>
);

export const VoluntaryScene: React.FC<{ series: string; episode: string }> = ({ series, episode }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const punch = usePunch(SHATTER, 20);
  const btn = spring({ frame: frame - BUTTON, fps, config: theme.spring.bouncy });
  const pulse = 1 + Math.sin(frame / 5) * 0.025;
  const fall = interpolate(frame, [SHATTER, SHATTER + 34], [0, 1], {
    easing: theme.ease.in,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const on = spring({ frame: frame - FLIP, fps, config: theme.spring.snappy });
  const tgl = spring({ frame: frame - TOGGLE, fps, config: theme.spring.smooth });

  return (
    <SceneShell shake={punch.shake}>
      <BrandBar series={series} episode={episode} />

      <AbsoluteFill style={{ paddingLeft: 72, paddingTop: 330 }}>
        <Eyebrow delay={2}>Главное</Eyebrow>
        <div style={{ width: 940, marginTop: 28, minHeight: 190 }}>
          {frame >= FLIP && <Kinetic text="ТОЛЬКО ПО ЖЕЛАНИЮ" delay={FLIP} per={4} size={84} />}
        </div>
      </AbsoluteFill>

      {/* the button — whole before the hit, shards after */}
      <div style={{ position: "absolute", left: 540 - 380, top: 760, width: 760, height: 230 }}>
        {frame < SHATTER ? (
          <div style={{ opacity: btn, transform: `scale(${interpolate(btn, [0, 1], [0.6, 1]) * pulse})` }}>
            <RedButton />
          </div>
        ) : (
          Array.from({ length: COLS * ROWS }, (_, i) => {
            const c = i % COLS;
            const r = Math.floor(i / COLS);
            const dx = ((c + 0.5) / COLS - 0.5) * 2; // -1..1
            const dy = ((r + 0.5) / ROWS - 0.5) * 2;
            const vx = dx * 420 + (rnd(i) - 0.5) * 160;
            const vy = dy * 160 - 220 - rnd(i + 7) * 200;
            const g = 1500;
            const t = fall;
            const x = vx * t;
            const y = vy * t + g * t * t;
            const rot = (rnd(i + 3) - 0.5) * 260 * t;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  inset: 0,
                  clipPath: `inset(${(r / ROWS) * 100}% ${100 - ((c + 1) / COLS) * 100}% ${100 - ((r + 1) / ROWS) * 100}% ${(c / COLS) * 100}%)`,
                  transform: `translate(${x}px, ${y}px) rotate(${rot}deg)`,
                  opacity: 1 - t * t,
                }}
              >
                <RedButton />
              </div>
            );
          })
        )}
      </div>

      {/* the switch takes the spot */}
      {frame >= TOGGLE && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 790,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 26,
            opacity: tgl,
            transform: `translateY(${interpolate(tgl, [0, 1], [40, 0])}px) scale(${interpolate(tgl, [0, 1], [0.8, 1])})`,
          }}
        >
          <Toggle on={on} width={300} />
          <div
            style={{
              fontFamily: theme.fonts.mono,
              fontSize: 26,
              fontWeight: 700,
              letterSpacing: "0.16em",
              color: on > 0.5 ? drPalette.text : drPalette.textDim,
            }}
          >
            {on > 0.5 ? "ВКЛЮЧИЛИ САМИ" : "ВЫКЛ"}
          </div>
        </div>
      )}

      <AbsoluteFill style={{ alignItems: "center", paddingTop: 1030 }}>
        <Receipt width={640} printFrom={TOGGLE} printFrames={30} title="УСЛОВИЯ" number="№ 0006">
          <ReceiptLine label="ДОБРОВОЛЬНО" mark="check" delay={TOGGLE + 10} />
          <ReceiptLine label="АВТОМАТИЧЕСКИ — НЕТ" mark="cross" delay={TOGGLE + 26} />
        </Receipt>
      </AbsoluteFill>

      <Flash amount={punch.pop * 0.8} color={drColors.bad} />
    </SceneShell>
  );
};
