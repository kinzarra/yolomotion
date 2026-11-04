import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { sp } from "../palette";
import { Backdrop, Bar, Big, Card, Count, Cut, Eyebrow, F, Glitch, Slam, Sticker, useFloat, useHit, useRampSec, useSpringAt } from "../ui";

// «Сколько потратили? Семьдесят два миллиона рублей!»
export const BudgetScene: React.FC = () => {
  const frame = useCurrentFrame();
  const p = useSpringAt(0.5, "smooth");
  const hit = useHit(2.15, 0.5);
  const range = useRampSec(1.6, 2.4);
  const fl = useFloat(8, 48);
  const pile = useSpringAt(0.9, "smooth");
  return (
    <Cut shake={hit.shake * 0.8}>
      <Backdrop intensity={1.3} />
      {/* the money: a pile of real ruble bundles rising behind the card (generated) */}
      <div style={{ position: "absolute", left: 540 - 520, top: 1020, width: 1040, transform: `translateY(${(1 - pile) * 700}px) scale(${1 + hit.pop * 0.05})`, filter: "drop-shadow(0 -20px 60px rgba(96,113,255,0.35))" }}>
        <Img src={staticFile("media/sponsorship-promo/gen/rub-cut.png")} style={{ width: 1040, display: "block" }} />
      </div>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingBottom: 420, gap: 44 }}>
        <Slam at={0.02} tilt={-2}>
          <Big size={74} color={sp.white}>СКОЛЬКО ПОТРАТИЛИ?</Big>
        </Slam>
        <div style={{ position: "relative", transform: `translateY(${interpolate(p, [0, 1], [260, 0]) + fl}px) scale(${1 + hit.pop * 0.08})`, opacity: p }}>
          <Card pad={52} style={{ width: 940 }}>
            <Eyebrow size={30}>Оценка бюджета</Eyebrow>
            <Glitch amt={hit.pop}>
              <Big size={230} style={{ marginTop: 14 }}>
                <Count to={72} at={1.0} dur={1.15} />
                <span style={{ fontSize: 150 }}> млн ₽</span>
              </Big>
            </Glitch>
            <div style={{ marginTop: 30 }}>
              <Bar p={range} h={18} color={sp.violetTint} />
              <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between", fontSize: 30, fontWeight: 700, color: sp.muted }}>
                <span>51,4 млн ₽</span>
                <span>92,5 млн ₽</span>
              </div>
            </div>
          </Card>
          <div style={{ position: "absolute", right: -10, top: -40 }}>
            <Sticker at={2.3} rotate={8} bg={sp.bad} color={sp.white} size={40}>на рекламу у блогеров</Sticker>
          </div>
        </div>
      </AbsoluteFill>
    </Cut>
  );
};
