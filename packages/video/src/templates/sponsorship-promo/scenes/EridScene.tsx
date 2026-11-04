import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { sp } from "../palette";
import { Backdrop, Bar, Big, Card, Count, Cut, Eyebrow, Rise, Stamp, useFloat, useHit, useRampSec, useSpringAt } from "../ui";

// «Маркировка рекламы»: ERID on 1,8% of the posts. The one red frame.
export const EridScene: React.FC = () => {
  const p = useSpringAt(0, "smooth");
  const hit = useHit(1.35, 0.5);
  const bar = useRampSec(0.4, 1.3);
  const fl = useFloat(8, 50);
  return (
    <Cut shake={hit.shake * 0.8}>
      <Backdrop tint={sp.badSoft} intensity={1.6} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingBottom: 420, gap: 40 }}>
        <Rise at={0}>
          <Big size={70} color={sp.white}>ДАЖЕ ERID И МАРКИРОВКА</Big>
        </Rise>
        <div style={{ transform: `translateY(${interpolate(p, [0, 1], [260, 0]) + fl}px) scale(${1 + hit.pop * 0.06})`, opacity: p, position: "relative" }}>
          <Card pad={50} style={{ width: 940 }}>
            <Eyebrow size={28}>Токен маркировки ERID</Eyebrow>
            <Big size={330} color={sp.bad} style={{ marginTop: 6 }}>
              <Count to={1.8} at={0.35} dur={0.9} decimals={1} />%
            </Big>
            {/* 100 posts, 2 of them marked */}
            <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "repeat(20, 1fr)", gap: 8 }}>
              {Array.from({ length: 100 }).map((_, i) => (
                <div key={i} style={{ aspectRatio: "1", borderRadius: 99, background: i === 37 || i === 82 ? sp.bad : sp.track, transform: `scale(${Math.min(1, Math.max(0, bar * 1.6 - i / 160))})`, boxShadow: i === 37 || i === 82 ? `0 0 14px ${sp.bad}` : undefined }} />
              ))}
            </div>
            <div style={{ marginTop: 18, display: "flex", justifyContent: "space-between", fontSize: 30, fontWeight: 700 }}>
              <span style={{ color: sp.bad }}>63 с ERID</span>
              <span style={{ color: sp.muted }}>3 494 без</span>
            </div>
          </Card>
          <Stamp text="МЕНЬШЕ 2%" at={1.45} size={96} rotate={-10} style={{ right: -10, bottom: -60, background: sp.white }} />
        </div>
      </AbsoluteFill>
    </Cut>
  );
};
