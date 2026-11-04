import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { sp } from "../palette";
import { Avatar, Backdrop, Big, Card, Count, Cut, Eyebrow, Icon, Platform, PostTile, Sticker, useFloat, useHit, useRampSec, useSpringAt } from "../ui";

// «Ищем все кампании, лучшие офферы и топ-блогеров.» Three quick beats:
// 142 campaigns fanned → the best offers on their posts → top creators.
const P2 = 1.25;
const P3 = 2.25;
const CAMPS = [
  { title: "скидка 3% по промокоду OCTOBERXX", code: "1614410559", dates: "8 нояб. 2025 - 18 окт. 2026", posts: 39, views: "5,2 млн" },
  { title: "пожизненная скидка на VOIS", code: "C75DFFDDEB5B", dates: "21 авг. - 10 окт. 2026", posts: 23, views: "2,6 млн" },
  { title: "скидка на альгинатную маску VOIS", code: "OFF84F7C6B44", dates: "17 сент. - 13 окт. 2026", posts: 4, views: "1,1 млн" },
];
const OFFERS = [
  { e: "Лучший оффер", q: "«копируй с буквами ww»", who: "mariyka_actcreati · 2,6 млн просмотров", file: "tiktok_posts_1281" },
  { e: "Оффер с промокодом", q: "«промик на скидку Озон»", who: "tery_ami · 2,4 млн просмотров", file: "tiktok_posts_2151" },
];
const TOP = [
  { name: "tery_ami", sub: "76 размещений", v: "7,7 млн", file: undefined as string | undefined },
  { name: "khadidzha_meow", sub: "лучший пост", v: "3 млн", file: "tiktok_avatars_66" },
  { name: "lazzkinzz", sub: "лучший пост", v: "2,6 млн", file: "tiktok_avatars_334" },
];

const CampCard: React.FC<(typeof CAMPS)[number]> = ({ title, code, dates, posts, views }) => (
  <Card pad={30} style={{ width: 560 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <Eyebrow size={24} color={sp.violet}>Промокод</Eyebrow>
      <Platform kind="tiktok" size={46} />
    </div>
    <div style={{ fontSize: 32, fontWeight: 800, marginTop: 12, lineHeight: 1.15 }}>{title}</div>
    <div style={{ fontFamily: "monospace", fontSize: 26, color: sp.muted, marginTop: 12 }}>{code}</div>
    <div style={{ fontSize: 26, color: sp.mutedDark, marginTop: 6, fontWeight: 600 }}>{dates}</div>
    <div style={{ display: "flex", gap: 40, marginTop: 18, fontSize: 28, fontWeight: 800 }}>
      <span>{posts} разм.</span>
      <span style={{ color: sp.violet }}>{views}</span>
    </div>
  </Card>
);

export const CampScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const fan = useSpringAt(0.05, "smooth");
  const out1 = useRampSec(P2 - 0.1, P2 + 0.15);
  const out2 = useRampSec(P3 - 0.1, P3 + 0.15);
  const hit = useHit(0.6, 0.4);
  const fl = useFloat(8, 50);
  const ph = t < P2 ? 1 : t < P3 ? 2 : 3;
  return (
    <Cut shake={hit.shake * 0.5}>
      <Backdrop />
      {ph === 1 && (
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 230, opacity: 1 - out1 }}>
          <div style={{ transform: `scale(${1 + hit.pop * 0.08})`, textAlign: "center" }}>
            <Big size={210} color={sp.white} style={{ textShadow: `0 0 60px ${sp.violetGlow}` }}>
              <Count to={142} at={0.05} dur={0.55} />
            </Big>
            <Big size={78} color={sp.violetTint} style={{ marginTop: 6 }}>КАМПАНИИ С ДАТАМИ</Big>
          </div>
          <div style={{ position: "relative", width: 1080, height: 560, marginTop: 50 }}>
            {CAMPS.map((c, i) => (
              <div key={c.code} style={{ position: "absolute", left: 260 + interpolate(fan, [0, 1], [0, (i - 1) * 215]), top: 30 + Math.abs(i - 1) * 40, transform: `rotate(${interpolate(fan, [0, 1], [0, (i - 1) * 9])}deg) translateY(${interpolate(fan, [0, 1], [400, 0])}px)`, zIndex: i === 1 ? 3 : 1 }}>
                <CampCard {...c} />
              </div>
            ))}
          </div>
        </AbsoluteFill>
      )}
      {ph === 2 && (
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 220, gap: 26, opacity: 1 - out2 }}>
          <Sticker at={P2} rotate={-3} bg={sp.violet} color={sp.white} size={50}>ЛУЧШИЕ ОФФЕРЫ</Sticker>
          {OFFERS.map((o, i) => (
            <Offer key={o.q} {...o} at={P2 + 0.1 + i * 0.25} r={i ? 2 : -2} />
          ))}
        </AbsoluteFill>
      )}
      {ph === 3 && (
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 220, gap: 22, transform: `translateY(${fl}px)` }}>
          <Sticker at={P3} rotate={3} bg={sp.violet} color={sp.white} size={50}>ТОП-БЛОГЕРЫ</Sticker>
          {TOP.map((c, i) => (
            <Creator key={c.name} {...c} i={i} />
          ))}
          <div style={{ position: "relative", width: 1080, height: 420, marginTop: 10 }}>
            {["tiktok_posts_2151", "tiktok_posts_1237", "tiktok_posts_19177"].map((f, i) => (
              <TopPost key={f} file={f} i={i} />
            ))}
          </div>
        </AbsoluteFill>
      )}
    </Cut>
  );
};

const Offer: React.FC<(typeof OFFERS)[number] & { at: number; r: number }> = ({ e, q, who, file, at, r }) => {
  const p = useSpringAt(at, "bouncy");
  return (
    <div style={{ transform: `translateX(${(1 - p) * (r < 0 ? -900 : 900)}px) rotate(${r}deg)` }}>
      <Card pad={26} style={{ width: 940, display: "flex", gap: 26, alignItems: "center" }}>
        <PostTile file={file} w={170} radius={18} />
        <div style={{ flex: 1 }}>
          <Eyebrow size={24}>{e}</Eyebrow>
          <div style={{ fontSize: 50, fontWeight: 900, marginTop: 8, letterSpacing: "-0.03em", lineHeight: 1.05 }}>{q}</div>
          <div style={{ fontSize: 26, color: sp.muted, marginTop: 10, fontWeight: 700 }}>{who}</div>
        </div>
      </Card>
    </div>
  );
};

const TopPost: React.FC<{ file: string; i: number }> = ({ file, i }) => {
  const p = useSpringAt(P3 + 0.45 + i * 0.12, "bouncy");
  return (
    <div style={{ position: "absolute", left: 540 - 105 + (i - 1) * 250, top: Math.abs(i - 1) * 30, transform: `translateY(${(1 - p) * 400}px) rotate(${(i - 1) * 8}deg)`, opacity: p }}>
      <div style={{ borderRadius: 22, outline: `5px solid ${sp.violet}`, boxShadow: `0 0 40px ${sp.violetGlow}` }}>
        <PostTile file={file} w={210} radius={22} drift={i} />
      </div>
    </div>
  );
};

const Creator: React.FC<(typeof TOP)[number] & { i: number }> = ({ name, sub, v, file, i }) => {
  const p = useSpringAt(P3 + 0.1 + i * 0.15, "bouncy");
  return (
    <div style={{ transform: `scale(${p}) rotate(${(i - 1) * 2}deg)`, opacity: p }}>
      <Card pad={26} style={{ width: 900, display: "flex", alignItems: "center", gap: 24 }}>
        <div style={{ position: "relative" }}>
          <Avatar file={file} name={name} size={110} ring={sp.violet} />
          {i === 0 && (
            <div style={{ position: "absolute", left: -14, top: -22, transform: "rotate(-18deg)" }}>
              <Icon kind="crown" size={54} color={sp.vois} />
            </div>
          )}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 44, fontWeight: 900 }}>{name}</div>
          <div style={{ fontSize: 26, color: sp.muted, fontWeight: 700 }}>{sub}</div>
        </div>
        <Big size={70} color={sp.violet}>{v}</Big>
      </Card>
    </div>
  );
};
