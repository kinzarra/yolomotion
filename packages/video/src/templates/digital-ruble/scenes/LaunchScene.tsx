// Beat 5 — the date, then the place. A tear-off calendar loses 31 АВГ and
// shows 1 СЕН; then the calendar leaves upward and a bank app slides in, the
// «Цифровой кошелёк» row gets tapped and lights up.
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../../theme";
import { usePunch } from "../../../reel";
import { drColors, drPalette } from "../palette";
import { BrandBar, Chip, Eyebrow, Flash, Phone, RubleMark, SceneShell } from "../ui";

const TEAR = 30; // 31 АВГ rips off
const CHIP_DATE = TEAR + 16;
const CHIP_START = TEAR + 30;
const SWAP = 120; // calendar out, phone in
const TAP = SWAP + 74; // the row is pressed

const CalendarPage: React.FC<{ day: string; month: string; lit?: boolean }> = ({ day, month, lit = false }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      background: `linear-gradient(180deg, ${drColors.white}, ${drColors.paper})`,
      border: `2px solid ${drColors.inkRule}`,
      boxShadow: drColors.paperShadow,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: theme.fonts.wide,
      color: drColors.ink,
    }}
  >
    <div style={{ fontSize: 300, fontWeight: 900, lineHeight: 0.9, letterSpacing: "-0.04em" }}>{day}</div>
    <div
      style={{
        marginTop: 18,
        fontFamily: theme.fonts.mono,
        fontSize: 40,
        fontWeight: 800,
        letterSpacing: "0.22em",
        color: lit ? drColors.ink : drColors.inkFaded,
      }}
    >
      {month}
    </div>
  </div>
);

const Row: React.FC<{ label: string; sub?: string; hot?: number; delay: number }> = ({ label, sub, hot = 0, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: theme.spring.snappy });
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 18,
        padding: "22px 26px",
        margin: "0 22px 14px",
        borderRadius: 22,
        background: hot > 0 ? `rgba(205,255,59,${0.1 * hot})` : drColors.surfaceLift,
        border: `2px solid ${hot > 0 ? drPalette.primary : drColors.line}`,
        boxShadow: hot > 0.5 ? `0 0 40px ${drPalette.glow}` : undefined,
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [24, 0])}px) scale(${1 + hot * 0.03})`,
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: hot > 0 ? drPalette.primary : drColors.surfaceStrong,
          border: `1px solid ${drColors.lineStrong}`,
        }}
      />
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: theme.fonts.body, fontSize: 28, fontWeight: 700, color: drPalette.text }}>{label}</div>
        {sub && <div style={{ fontFamily: theme.fonts.body, fontSize: 20, color: drPalette.textDim, marginTop: 4 }}>{sub}</div>}
      </div>
      <div style={{ fontFamily: theme.fonts.mono, fontSize: 26, color: hot > 0 ? drPalette.primary : drPalette.textDim }}>›</div>
    </div>
  );
};

export const LaunchScene: React.FC<{ series: string; episode: string }> = ({ series, episode }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const punch = usePunch(TEAR, 16);
  const tapPunch = usePunch(TAP, 14);

  const tear = interpolate(frame, [TEAR, TEAR + 18], [0, 1], {
    easing: theme.ease.in,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const calIn = spring({ frame: frame - 2, fps, config: theme.spring.smooth });
  const calOut = interpolate(frame, [SWAP, SWAP + 9], [0, 1], {
    easing: theme.ease.in,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const hot = spring({ frame: frame - TAP, fps, config: theme.spring.snappy });
  const ring = interpolate(frame, [TAP - 10, TAP + 8], [0, 1], {
    easing: theme.ease.out,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <SceneShell shake={punch.shake * 0.5 + tapPunch.shake * 0.2}>
      <BrandBar series={series} episode={episode} />

      <AbsoluteFill style={{ alignItems: "center", paddingTop: 330 }}>
        <Eyebrow delay={2}>Что меняется</Eyebrow>
        <div style={{ display: "flex", gap: 16, marginTop: 30, flexWrap: "wrap", justifyContent: "center", width: 960 }}>
          <Chip delay={CHIP_DATE} tone="hero" size={30} filled>
            1 СЕНТЯБРЯ 2026
          </Chip>
          <Chip delay={CHIP_START} tone="neutral" size={26}>
            СТАРТ МАССОВОГО ВНЕДРЕНИЯ
          </Chip>
        </div>
      </AbsoluteFill>

      {/* calendar */}
      {calOut < 1 && (
        <div
          style={{
            position: "absolute",
            left: 540 - 270,
            top: 600,
            width: 540,
            height: 600,
            perspective: 1400,
            opacity: calIn * (1 - calOut),
            transform: `translateY(${interpolate(calIn, [0, 1], [80, 0]) - calOut * 900}px) scale(${interpolate(calIn, [0, 1], [0.92, 1]) * (1 - calOut * 0.2)})`,
          }}
        >
          {/* binder */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              height: 92,
              background: drColors.surfaceLift,
              border: `2px solid ${drColors.lineStrong}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 40,
              fontFamily: theme.fonts.mono,
              fontSize: 30,
              fontWeight: 800,
              letterSpacing: "0.3em",
              color: drPalette.text,
              zIndex: 3,
            }}
          >
            {[0, 1].map((i) => (
              <div key={i} style={{ width: 22, height: 22, borderRadius: "50%", background: drColors.ink2, border: `2px solid ${drColors.lineStrong}` }} />
            ))}
            <span>2026</span>
            {[0, 1].map((i) => (
              <div key={i} style={{ width: 22, height: 22, borderRadius: "50%", background: drColors.ink2, border: `2px solid ${drColors.lineStrong}` }} />
            ))}
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 92, bottom: 0 }}>
            <CalendarPage day="1" month="СЕНТЯБРЯ" lit />
            {tear < 1 && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  transformOrigin: "50% 0%",
                  transform: `perspective(1100px) rotateX(${-tear * 120}deg) rotateZ(${tear * 9}deg) translateY(${tear * 60}px)`,
                  opacity: 1 - tear * tear * tear,
                }}
              >
                <CalendarPage day="31" month="АВГУСТА" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* the bank app */}
      {frame >= SWAP + 8 && (
        <div style={{ position: "absolute", left: 540 - 250, top: 560 }}>
          <Phone width={500} height={760} delay={SWAP + 8}>
            <div style={{ padding: "76px 0 0" }}>
              <div style={{ padding: "0 44px 18px", display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
                <span style={{ fontFamily: theme.fonts.body, fontSize: 30, fontWeight: 800, color: drPalette.text }}>Главная</span>
                <span style={{ fontFamily: theme.fonts.mono, fontSize: 20, color: drPalette.textDim }}>••• ₽</span>
              </div>
              <Row label="Переводы" sub="По номеру телефона" delay={SWAP + 18} />
              <Row label="Платежи" sub="ЖКХ, связь, штрафы" delay={SWAP + 24} />
              <Row label="Цифровой кошелёк" sub="Платформа Банка России" delay={SWAP + 30} hot={hot} />
              <Row label="Вклады" delay={SWAP + 36} />
            </div>
            {/* tap ring on the row */}
            {ring > 0 && ring < 1 && (
              <div
                style={{
                  position: "absolute",
                  left: 250 - 60,
                  top: 392 - 60,
                  width: 120,
                  height: 120,
                  borderRadius: "50%",
                  border: `${6 * (1 - ring)}px solid ${drPalette.primary}`,
                  transform: `scale(${0.3 + ring * 1.4})`,
                  opacity: 1 - ring,
                }}
              />
            )}
          </Phone>
          {/* the mark pops out of the phone when the row lights */}
          {frame >= TAP && (
            <div style={{ position: "absolute", right: -70, top: -60 }}>
              <RubleMark size={180} delay={TAP + 2} />
            </div>
          )}
        </div>
      )}

      <Flash amount={tapPunch.pop * 0.5} />
    </SceneShell>
  );
};
