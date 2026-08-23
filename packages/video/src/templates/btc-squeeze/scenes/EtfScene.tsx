// Beat 7 — not only the squeeze. Three spot-ETF tickets line up, $ tokens
// rain into their slots with a stagger, and the digit strip races to
// $1 000 000 000. Headline $1B В ETF, chip ЗА 3 СЕССИИ.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { theme } from "../../../theme";
import { btcColors, btcPalette } from "../palette";
import { BrandBar, Chip, DigitStrip, Eyebrow, EtfCard, Kinetic, SceneShell, rnd } from "../ui";

const HEAD = 4;
const CARDS = 10;
const RAIN = 24;
const COUNT = 100; // «вошёл миллиард»
const SESSIONS = 72; // «За три торговые сессии»

const CARD_W = 280;
const CARD_GAP = 48;
const ROW_TOP = 930;
const DROPS = 14;
const FALL = 22;

export const EtfScene: React.FC<{ series: string; episode: string }> = ({ series, episode }) => {
  const frame = useCurrentFrame();
  const drops = Array.from({ length: DROPS }, (_, i) => {
    const start = RAIN + i * 6;
    const card = Math.floor(rnd(i * 3 + 1) * 3);
    const p = interpolate(frame, [start, start + FALL], [0, 1], {
      easing: theme.ease.in,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const x = 72 + card * (CARD_W + CARD_GAP) + CARD_W / 2 + (rnd(i * 7 + 2) - 0.5) * 80;
    const y = interpolate(p, [0, 1], [720, ROW_TOP - 10]);
    return { i, card, p, x, y, start };
  });
  const pulse = (card: number) =>
    drops.reduce((acc, d) => {
      if (d.card !== card) return acc;
      const land = d.start + FALL;
      const k = interpolate(frame, [land, land + 10], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      return Math.max(acc, frame >= land ? k : 0);
    }, 0);

  return (
    <SceneShell>
      <BrandBar series={series} episode={episode} />

      <AbsoluteFill style={{ alignItems: "center", paddingTop: 330 }}>
        <Eyebrow delay={2}>Спот-ETF · притоки</Eyebrow>
        <div style={{ width: 960, marginTop: 18 }}>
          <Kinetic text="$1B В ETF" delay={HEAD} per={4} size={124} align="center" mode="snap" hero={[0]} style={{ justifyContent: "center" }} />
        </div>
        <div style={{ marginTop: 22, minHeight: 70 }}>
          {frame >= COUNT && <DigitStrip to={1_000_000_000} delay={COUNT} frames={54} size={60} prefix="$" color={btcPalette.text} />}
        </div>
        <div style={{ marginTop: 18 }}>
          <Chip delay={SESSIONS} tone="paper" size={28}>
            ЗА 3 ТОРГОВЫЕ СЕССИИ
          </Chip>
        </div>
      </AbsoluteFill>

      {/* the rain */}
      {drops.map((d) =>
        d.p <= 0 || d.p >= 1 ? null : (
          <div
            key={d.i}
            style={{
              position: "absolute",
              left: d.x - 30,
              top: d.y - 30,
              width: 60,
              height: 60,
              borderRadius: "50%",
              background: btcColors.surfaceStrong,
              border: `3px solid ${btcPalette.primary}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: theme.fonts.wide,
              fontSize: 30,
              fontWeight: 900,
              color: btcPalette.primary,
              opacity: interpolate(d.p, [0, 0.15, 1], [0, 1, 1]),
              transform: `scale(${interpolate(d.p, [0, 0.2, 1], [0.4, 1, 0.9])}) rotate(${d.p * 180}deg)`,
            }}
          >
            $
          </div>
        ),
      )}

      {/* the tickets */}
      <div style={{ position: "absolute", left: 72, top: ROW_TOP, display: "flex", gap: CARD_GAP }}>
        {["BTC ETF", "BTC ETF", "BTC ETF"].map((name, i) => (
          <EtfCard key={i} name={name} ticker={["SPOT · A", "SPOT · B", "SPOT · C"][i]} delay={CARDS + i * 5} pulse={pulse(i)} width={CARD_W} />
        ))}
      </div>
    </SceneShell>
  );
};
