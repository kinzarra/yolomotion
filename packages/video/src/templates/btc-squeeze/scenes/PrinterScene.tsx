// Beat 3 — not a printing press. ПЕЧАТНЫЙ СТАНОК? rises, a red bar strikes
// it through and НЕТ slams on. Then the market's reading, row by row:
// ДОХОДНОСТИ ↓ (red), ДОЛЛАР ↓ (red), РИСК ↑ — the only lime thing.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { theme } from "../../../theme";
import { useIn, usePunch } from "../../../reel";
import { btcColors, btcPalette } from "../palette";
import { ArrowGlyph, BrandBar, Chip, Eyebrow, Flash, Kinetic, SceneShell, Shockwave, Stamp, Strike } from "../ui";

const HEAD = 2;
const STRIKE = 22; // «Нет»
const STAMP = 27;
const HEARD = 78; // «рынок услышал другое»
const FIRE = 126; // «тушить пожар в госдолге»
const ROWS = [190, 230, 262]; // доходности · доллар · риск

const Row: React.FC<{ label: string; dir: "up" | "down"; tone: "bad" | "hero"; delay: number }> = ({ label, dir, tone, delay }) => {
  const p = useIn(delay, "snappy");
  const color = tone === "hero" ? btcPalette.primary : btcColors.bad;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: 760,
        padding: "14px 32px",
        background: btcColors.surface,
        border: `2px solid ${tone === "hero" ? btcPalette.primary : btcColors.lineStrong}`,
        boxShadow: tone === "hero" ? `0 0 50px ${btcPalette.glow}` : btcColors.shadow,
        opacity: p,
        transform: `translateX(${interpolate(p, [0, 1], [-60, 0])}px) scale(${interpolate(p, [0, 1], [0.94, 1])})`,
      }}
    >
      <span
        style={{
          fontFamily: theme.fonts.wide,
          fontSize: 54,
          fontWeight: 800,
          letterSpacing: "-0.01em",
          color: tone === "hero" ? btcPalette.primary : btcPalette.text,
        }}
      >
        {label}
      </span>
      <ArrowGlyph dir={dir} size={70} delay={delay + 5} color={color} thick={13} />
    </div>
  );
};

export const PrinterScene: React.FC<{ series: string; episode: string }> = ({ series, episode }) => {
  const frame = useCurrentFrame();
  const no = usePunch(STAMP, 18);
  const risk = usePunch(ROWS[2], 16);
  const dim = interpolate(frame, [ROWS[0] - 10, ROWS[0] + 6], [1, 0.45], {
    easing: theme.ease.inOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <SceneShell shake={no.shake * 0.6 + risk.shake * 0.3}>
      <BrandBar series={series} episode={episode} />

      <AbsoluteFill style={{ alignItems: "center", paddingTop: 330 }}>
        <Eyebrow delay={2} color={btcColors.bad}>
          Первое подозрение
        </Eyebrow>
        <div style={{ position: "relative", width: 960, marginTop: 30, opacity: dim }}>
          <Kinetic text="ПЕЧАТНЫЙ СТАНОК?" delay={HEAD} per={4} size={66} align="center" style={{ justifyContent: "center", whiteSpace: "nowrap" }} />
          <Strike delay={STRIKE} thick={14} tilt={-3} />
          <div style={{ position: "absolute", right: -20, top: 34 }}>
            <Stamp delay={STAMP} size={72} rotate={-8}>
              НЕТ
            </Stamp>
          </div>
        </div>

        <div style={{ marginTop: 90, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, opacity: dim }}>
          <Chip delay={HEARD} tone="neutral" size={26}>
            РЫНОК УСЛЫШАЛ ДРУГОЕ:
          </Chip>
          <Chip delay={FIRE} tone="paper" size={30}>
            ТУШИТЬ ПОЖАР В ГОСДОЛГЕ
          </Chip>
        </div>
      </AbsoluteFill>

      <AbsoluteFill style={{ alignItems: "center", paddingTop: 900 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <Row label="ДОХОДНОСТИ" dir="down" tone="bad" delay={ROWS[0]} />
          <Row label="ДОЛЛАР" dir="down" tone="bad" delay={ROWS[1]} />
          <Row label="РИСК" dir="up" tone="hero" delay={ROWS[2]} />
        </div>
      </AbsoluteFill>

      <Shockwave at={ROWS[2]} life={24} size={1200} />
      <Flash amount={no.pop * 0.6} color={btcColors.bad} />
      <Flash amount={risk.pop * 0.5} />
    </SceneShell>
  );
};
