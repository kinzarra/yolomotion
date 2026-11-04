import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { sp } from "../palette";
import { Backdrop, Big, BrandChip, Card, Count, Cut, Eyebrow, Icon, POSTS, PostTile, Rise, Slam, Sticker, useFloat, useHit, useRampSec, useSpringAt } from "../ui";

// «Можем оценить, кто забирает рынок»: share of voice, VOIS crowned, its
// real posts fanned behind the card.
const ROWS = [
  { name: "VOIS", color: sp.vois, share: 81, views: "86,9 млн" },
  { name: "MIXIT", color: sp.mixit, share: 10, views: "11,2 млн" },
  { name: "The Act", color: sp.theact, share: 9.1, views: "9,9 млн" },
];
const FAN = [{ x: -330, r: -16 }, { x: -110, r: -5 }, { x: 110, r: 5 }, { x: 330, r: 16 }];

export const SovScene: React.FC = () => {
  const frame = useCurrentFrame();
  const p = useSpringAt(0.05, "smooth");
  const grow = useRampSec(0.4, 1.3);
  const fan = useSpringAt(0.5, "bouncy");
  const hit = useHit(1.35, 0.45);
  const crown = useSpringAt(1.4, "bouncy");
  const fl = useFloat(8, 50);
  return (
    <Cut shake={hit.shake * 0.6}>
      <Backdrop tint="rgba(209,144,0,0.35)" intensity={1.1} />
      {/* VOIS posts fanned behind */}
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 200 }}>
        {FAN.map((f, i) => (
          <div key={i} style={{ position: "absolute", top: 260, transform: `translateX(${f.x * fan}px) rotate(${f.r * fan}deg) translateY(${(1 - fan) * 200 + Math.sin((frame + i * 9) / 14) * 6}px)`, opacity: fan * 0.95 }}>
            <div style={{ borderRadius: 22, outline: `5px solid ${sp.vois}` }}>
              <PostTile file={POSTS[[0, 4, 5, 7][i]]} w={230} radius={22} drift={i} />
            </div>
          </div>
        ))}
      </AbsoluteFill>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end", paddingBottom: 520, gap: 30 }}>
        <Slam at={0.02} tilt={-2}>
          <Big size={74} color={sp.white} style={{ textShadow: "0 6px 30px rgba(0,0,0,0.7)" }}>КТО ЗАБИРАЕТ РЫНОК?</Big>
        </Slam>
        <div style={{ position: "relative", transform: `translateY(${interpolate(p, [0, 1], [300, 0]) + fl}px)`, opacity: p }}>
          <Card pad={44} style={{ width: 960 }}>
            <Eyebrow size={28}>Доля голоса · просмотры</Eyebrow>
            <div style={{ display: "flex", alignItems: "center", gap: 24, marginTop: 10, transform: `scale(${1 + hit.pop * 0.06})`, transformOrigin: "left center" }}>
              <BrandChip name="VOIS" color={sp.vois} size={46} />
              <Big size={170} color={sp.vois}>
                <Count to={81} at={0.4} dur={0.9} />%
              </Big>
              <div style={{ transform: `scale(${crown}) rotate(${-12 * crown}deg)`, opacity: crown, width: 104, height: 104, borderRadius: 104, background: sp.vois, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 16px 40px -10px rgba(0,0,0,0.4)" }}>
                <Icon kind="crown" size={66} />
              </div>
            </div>
            <div style={{ display: "flex", height: 64, borderRadius: 20, overflow: "hidden", marginTop: 22, background: sp.track }}>
              {ROWS.map((r) => (
                <div key={r.name} style={{ width: `${r.share * grow}%`, background: r.color, color: sp.white, fontWeight: 800, fontSize: 26, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", whiteSpace: "nowrap" }}>
                  {grow > 0.9 && r.share > 30 ? `${r.name} ${r.share}%` : ""}
                </div>
              ))}
            </div>
            <div style={{ marginTop: 22, display: "flex", justifyContent: "space-between" }}>
              {ROWS.map((r, i) => (
                <Rise key={r.name} at={0.8 + i * 0.1} y={20}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 28, fontWeight: 700 }}>
                    <span style={{ width: 16, height: 16, borderRadius: 8, background: r.color }} />
                    {r.name} <span style={{ color: sp.muted }}>{r.views}</span>
                  </div>
                </Rise>
              ))}
            </div>
          </Card>
          <div style={{ position: "absolute", right: 20, bottom: -34 }}>
            <Sticker at={1.6} rotate={7} bg={sp.white} size={38}>лидер рынка</Sticker>
          </div>
        </div>
      </AbsoluteFill>
    </Cut>
  );
};
