import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { sp } from "../palette";
import { Backdrop, Bar, Big, Card, Cut, Eyebrow, F, Icon, IconKind, PostTile, Slam, useFloat, useHit, useRampSec, useSpringAt } from "../ui";

// «И как они продают: промокоды, реферальные ссылки, скидки. Все механики.»
// A: three real posts, each with the mechanic the AI read in it.
// B: the report's mechanics card, the promo code on top.
const B = 3.85;
const EVID: { file: string; who: string; k: IconKind; tag: string; detail: string; at: number; r: number }[] = [
  { file: "tiktok_posts_2151", who: "tery_ami", k: "ticket", tag: "ПРОМОКОД", detail: "C75DFFDDEB5B", at: 0.6, r: -6 },
  { file: "tiktok_posts_1236", who: "svetlanka_li", k: "link", tag: "ССЫЛКА WB", detail: "WW290616", at: 1.9, r: 3 },
  { file: "instagram_posts_26251", who: "rassohina.beauty", k: "percent", tag: "СКИДКА", detail: "KD69D1C1482B", at: 3.0, r: 7 },
];
const ROWS = [
  { name: "Промокод", posts: "1 912", views: "66 млн", p: 1 },
  { name: "Реферальная ссылка", posts: "1 462", views: "38,6 млн", p: 0.585 },
  { name: "Скидка", posts: "321", views: "10,2 млн", p: 0.155 },
];

export const MechScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const toB = useRampSec(B - 0.1, B + 0.25);
  const card = useSpringAt(B, "smooth");
  const hit = useHit(B + 0.5, 0.45);
  const fl = useFloat(8, 50);
  return (
    <Cut shake={hit.shake * 0.5}>
      <Backdrop />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 210 }}>
        <Slam at={0.02} tilt={-2}><Big size={110} color={sp.white}>КАК ПРОДАЮТ?</Big></Slam>
      </AbsoluteFill>
      {t < B + 0.3 && (
        <AbsoluteFill style={{ opacity: 1 - toB, transform: `translateY(${-toB * 200}px) scale(${1 - toB * 0.2})` }}>
          <div style={{ position: "absolute", top: 540, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 22 }}>
            {EVID.map((e) => (
              <Evidence key={e.file} {...e} />
            ))}
          </div>
        </AbsoluteFill>
      )}
      {t >= B - 0.1 && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingBottom: 380 }}>
          <div style={{ transform: `translateY(${interpolate(card, [0, 1], [500, 60]) + fl}px)`, opacity: card }}>
            <Card pad={48} style={{ width: 960 }}>
              <Eyebrow size={28}>Все механики · просмотры</Eyebrow>
              <div style={{ marginTop: 26, display: "flex", flexDirection: "column", gap: 28 }}>
                {ROWS.map((r, i) => (
                  <Row key={r.name} {...r} i={i} hitPop={i === 0 ? hit.pop : 0} />
                ))}
              </div>
            </Card>
          </div>
        </AbsoluteFill>
      )}
    </Cut>
  );
};

const Evidence: React.FC<(typeof EVID)[number]> = ({ file, who, k, tag, detail, at, r }) => {
  const p = useSpringAt(at, "bouncy");
  const tagP = useSpringAt(at + 0.15, "bouncy");
  return (
    <div style={{ transform: `translateY(${(1 - p) * 300}px) rotate(${r * p}deg) scale(${interpolate(p, [0, 1], [0.6, 1])})`, opacity: interpolate(p, [0, 0.3], [0, 1], { extrapolateRight: "clamp" }), display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ borderRadius: 26, outline: `5px solid ${sp.violet}`, boxShadow: `0 0 50px ${sp.violetGlow}`, position: "relative" }}>
        <PostTile file={file} w={310} radius={26} />
        <div style={{ position: "absolute", left: 14, top: 14, background: "rgba(0,0,0,0.55)", color: sp.white, fontFamily: F, fontSize: 22, fontWeight: 700, padding: "6px 12px", borderRadius: 12 }}>@{who}</div>
      </div>
      <div style={{ marginTop: -40, transform: `scale(${tagP}) rotate(${-r}deg)`, background: sp.white, borderRadius: 22, padding: "14px 20px", boxShadow: "0 18px 40px -10px rgba(0,0,0,0.6)", fontFamily: F, minWidth: 270 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, color: sp.violet, fontWeight: 900, fontSize: 32 }}>
          <Icon kind={k} size={38} color={sp.violet} /> {tag}
        </div>
        <div style={{ fontSize: 24, fontWeight: 700, color: sp.mutedDark, marginTop: 4, fontFamily: "monospace" }}>{detail}</div>
      </div>
    </div>
  );
};

const Row: React.FC<{ name: string; posts: string; views: string; p: number; i: number; hitPop: number }> = ({ name, posts, views, p, i, hitPop }) => {
  const g = useRampSec(B + 0.2 + i * 0.1, B + 0.8 + i * 0.1);
  const lead = i === 0;
  return (
    <div style={{ transform: `scale(${1 + hitPop * 0.05})`, transformOrigin: "left center" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{ fontSize: lead ? 44 : 34, fontWeight: lead ? 900 : 700, color: lead ? sp.violet : sp.ink }}>{name}</span>
        <span style={{ fontSize: lead ? 64 : 34, fontWeight: 900, color: lead ? sp.violet : sp.inkSoft, letterSpacing: "-0.03em" }}>{views}</span>
      </div>
      <div style={{ marginTop: 12 }}>
        <Bar p={g * p} h={lead ? 26 : 18} color={lead ? sp.violet : sp.violetTint} />
      </div>
      <div style={{ marginTop: 8, fontSize: 24, color: sp.muted, fontWeight: 600 }}>{posts} размещений</div>
    </div>
  );
};
