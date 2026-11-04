import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { sp } from "../palette";
import { Backdrop, BrandChip, Card, Cut, Eyebrow, F, Pill, Rise, Sparkle, YMark, clamp, useHit, useRampSec, useSpringAt } from "../ui";

// The product enters: the Y slams in with a ring, the menu tab «Конкуренты
// NEW», then the real form with the three brands typed in and the click.
const BRANDS = [
  { name: "MIXIT", color: sp.mixit },
  { name: "VOIS", color: sp.vois },
  { name: "The Act", color: sp.theact },
];
const FORM = 1.25;

export const RevealScene: React.FC<{ section: string }> = ({ section }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logo = useSpringAt(0, "bouncy");
  const ring = useRampSec(0.05, 0.8);
  const toForm = useRampSec(FORM - 0.1, FORM + 0.35);
  const click = useHit(2.75, 0.35);
  const press = useSpringAt(2.75, "snappy");
  const cursorT = useRampSec(2.2, 2.7);
  return (
    <Cut>
      <Backdrop intensity={1.2} />
      {/* logo moment */}
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: 380,
          opacity: 1 - toForm,
          transform: `translateY(${-toForm * 300}px) scale(${1 - toForm * 0.4})`,
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 340,
            height: 340,
            borderRadius: 999,
            border: `6px solid ${sp.violetTint}`,
            transform: `translateY(-80px) scale(${interpolate(ring, [0, 1], [0.6, 2.6])})`,
            opacity: 1 - ring,
          }}
        />
        <div style={{ transform: `scale(${interpolate(logo, [0, 1], [0.2, 1])}) rotate(${interpolate(logo, [0, 1], [-40, 0])}deg)` }}>
          <YMark size={260} glow={1} />
        </div>
        <Rise at={0.35} style={{ marginTop: 50 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
            <div style={{ fontFamily: F, fontWeight: 900, fontSize: 110, color: sp.white, letterSpacing: "-0.04em" }}>{section}</div>
            <Pill size={36} style={{ background: sp.violetSoft, color: sp.violet }}>NEW</Pill>
          </div>
        </Rise>
      </AbsoluteFill>
      {/* the form */}
      {frame >= (FORM - 0.1) * fps && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingBottom: 420 }}>
          <div style={{ opacity: toForm, transform: `translateY(${(1 - toForm) * 260}px) scale(${0.9 + 0.1 * toForm})` }}>
            <Card pad={46} style={{ width: 960 }}>
              <Pill size={26} style={{ background: sp.violetSoft, color: sp.violet }}>КОНКУРЕНТНЫЙ АНАЛИЗ</Pill>
              <div style={{ fontWeight: 900, fontSize: 56, letterSpacing: "-0.03em", marginTop: 22 }}>Какие бренды анализируем?</div>
              <div
                style={{
                  marginTop: 26,
                  border: `3px solid ${sp.violet}`,
                  borderRadius: 24,
                  padding: 22,
                  display: "flex",
                  gap: 16,
                  flexWrap: "wrap",
                  minHeight: 96,
                  alignItems: "center",
                }}
              >
                {BRANDS.map((b, i) => (
                  <Rise key={b.name} at={FORM + 0.25 + i * 0.22} y={30}>
                    <BrandChip name={b.name} color={b.color} size={40} />
                  </Rise>
                ))}
              </div>
              <div style={{ marginTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Eyebrow size={24}>Сфера: косметика · Россия · ₽</Eyebrow>
              </div>
              <div style={{ marginTop: 30, display: "flex", justifyContent: "center", position: "relative" }}>
                <Pill size={44} style={{ transform: `scale(${1 - click.pop * 0.12})`, boxShadow: `0 0 ${60 * press}px ${sp.violetGlow}` }}>
                  <Sparkle size={44} /> Определить бренды
                </Pill>
                {/* cursor */}
                <svg
                  width="70"
                  height="70"
                  viewBox="0 0 24 24"
                  style={{
                    position: "absolute",
                    left: interpolate(cursorT, [0, 1], [820, 560]),
                    top: interpolate(cursorT, [0, 1], [180, 40]),
                    opacity: interpolate(cursorT, [0, 0.2], [0, 1], clamp),
                    transform: `scale(${1 - click.pop * 0.2})`,
                  }}
                >
                  <path d="M4 2l15 9-6.5 1.6L16 20l-3 1.4-3.6-7.2L4 18z" fill={sp.ink} stroke={sp.white} strokeWidth="1.4" />
                </svg>
              </div>
            </Card>
          </div>
        </AbsoluteFill>
      )}
    </Cut>
  );
};
