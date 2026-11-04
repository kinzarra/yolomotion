import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { sp } from "../palette";
import {
  Avatar, Backdrop, Big, Card, Count, Cut, F, Glitch, Globe, HiMark, Icon, Pill, Platform, PlatformKind, POSTCARDS, POSTS as POSTS_ALL, PostTile, ReportPostCard, Rise, Slam, Sparkle, Sticker,
  clamp, useFloat, useHit, useRampSec, useSpringAt,
} from "../ui";

// A: «AI ищет» → 1 МЛРД+ posts in our base → the networks → the whole web.
// B: the report's real «Посты» tab scrolling, the AI beam lights the promo
// codes in each card and stamps them: ad, even with no brand tag.
const B = 4.9;
const NETS: PlatformKind[] = ["youtube", "telegram", "vk", "instagram", "tiktok"];
const CARD_W = 452;
const SCROLL_PX = 1364; // scrolled between B+0.3 and C // 4 rows of ~586 px minus the 980 px window
// the moment each card's codes get lit (scene seconds)
const FOUND = [5.4, 5.6, 5.9, 6.1, 6.4, 6.6, 6.9, 7.0];
const C = 6.95; // the zoom into one post: why the AI called it an ad

export const ScanScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const toB = useRampSec(B - 0.15, B + 0.25);
  const hitBillion = useHit(2.35, 0.5);
  const ring = useRampSec(2.35, 3.0);
  const web = useSpringAt(3.9, "bouncy");
  const fl = useFloat(8, 46);
  const netP = [useSpringAt(2.9, "bouncy"), useSpringAt(3.0, "bouncy"), useSpringAt(3.1, "bouncy"), useSpringAt(3.2, "bouncy"), useSpringAt(3.3, "bouncy")];
  const ticker = useRampSec(1.5, 2.35, (x) => x * x);
  const scroll = useRampSec(B + 0.3, C, (x) => x);
  const toC = useRampSec(C - 0.1, C + 0.3);
  const spin = frame / fps;
  const win = useSpringAt(B - 0.1, "smooth");
  const beam = ((t - B) / 1.1) % 1;
  return (
    <Cut shake={hitBillion.shake * 0.8}>
      <Backdrop intensity={1.1} />

      {/* A */}
      {t < B + 0.3 && (
        <AbsoluteFill style={{ opacity: 1 - toB, transform: `scale(${1 + toB * 0.25})`, alignItems: "center", justifyContent: "center", paddingBottom: 380 }}>
          <PostRing spin={spin} p={ring > 0 || t > 2.35 ? 1 : interpolate(t, [1.2, 2.3], [0, 1], clamp)} />
          <Rise at={0} style={{ position: "relative", zIndex: 2 }}>
            <Pill size={46} style={{ marginBottom: 40, boxShadow: `0 0 60px ${sp.violetGlow}` }}>
              <Sparkle size={50} /> AI ищет в нашей базе
            </Pill>
          </Rise>
          <div style={{ position: "relative", transform: `scale(${1 + hitBillion.pop * 0.12}) translateY(${fl}px)`, textAlign: "center", height: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {t < 2.35 ? (
              <Big size={120} color={sp.white} style={{ opacity: interpolate(t, [1.45, 1.55], [0, 1], clamp) }}>
                {Math.round(120000000 + ticker * 879999999).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}
              </Big>
            ) : (
              <Glitch amt={hitBillion.pop}>
                <Big size={196} color={sp.white} style={{ textShadow: `0 0 90px ${sp.violetGlow}` }}>
                  1 МЛРД+
                </Big>
              </Glitch>
            )}
            <div style={{ position: "absolute", width: 500, height: 500, borderRadius: 999, border: `8px solid ${sp.violetTint}`, transform: `scale(${interpolate(ring, [0, 1], [0.4, 2.4])})`, opacity: ring > 0 ? 1 - ring : 0 }} />
          </div>
          <Rise at={2.45}>
            <Big size={70} color={sp.violetTint} style={{ letterSpacing: "-0.02em" }}>постов у нас в базе</Big>
          </Rise>
          <div style={{ display: "flex", gap: 22, marginTop: 70 }}>
            {NETS.map((k, i) => (
              <div key={k} style={{ transform: `translateY(${(1 - netP[i]) * 200 + Math.sin((frame + i * 9) / 12) * 7}px) rotate(${(1 - netP[i]) * 30 + Math.sin((frame + i * 7) / 15) * 4}deg) scale(${netP[i]})`, opacity: netP[i] }}>
                <div style={{ padding: 7, background: sp.white, borderRadius: 40 }}>
                  <Platform kind={k} size={124} />
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 40, transform: `scale(${web}) rotate(${(1 - web) * -10 - 2}deg)`, opacity: web }}>
            <Pill size={50} bg={sp.white} color={sp.violet}>
              <Globe size={56} color={sp.violet} /> + весь интернет
            </Pill>
          </div>
        </AbsoluteFill>
      )}

      {/* B: the real «Посты» tab */}
      {t >= B - 0.15 && t < C + 0.35 && (
        <AbsoluteFill style={{ opacity: toB * (1 - toC), transform: `scale(${1 + toC * 0.3})` }}>
          <div
            style={{
              position: "absolute",
              left: 50,
              top: 150,
              width: 980,
              height: 1180,
              borderRadius: 44,
              background: sp.page,
              overflow: "hidden",
              boxShadow: sp.shadow,
              transform: `translateY(${(1 - win) * 500}px) rotate(${(1 - win) * 6}deg)`,
              fontFamily: F,
            }}
          >
            {/* tab header as in the app */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 120, background: sp.white, zIndex: 2, display: "flex", alignItems: "center", padding: "0 30px", gap: 14, borderBottom: `2px solid ${sp.line}` }}>
              {["Обзор", "Креативы", "Кампании", "Блогеры"].map((x) => (
                <span key={x} style={{ fontSize: 26, fontWeight: 600, color: sp.mutedDark, padding: "10px 12px" }}>{x}</span>
              ))}
              <span style={{ fontSize: 26, fontWeight: 700, color: sp.violet, background: sp.violetSoft, borderRadius: 16, padding: "10px 18px" }}>Посты</span>
            </div>
            <div style={{ position: "absolute", top: 120, left: 0, right: 0, height: 76, padding: "0 30px", background: sp.page, zIndex: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 26, color: sp.muted, fontWeight: 600 }}>
                Постов: <Count to={3557} at={B + 0.2} dur={1.0} />
              </span>
              <span style={{ fontSize: 24, fontWeight: 700, background: sp.white, borderRadius: 99, padding: "8px 18px" }}>Просмотры</span>
            </div>
            <div style={{ position: "absolute", top: 200, left: 30, width: 920, transform: `translateY(${-scroll * SCROLL_PX}px)`, display: "flex", flexWrap: "wrap", gap: 16 }}>
              {POSTCARDS.map((d, i) => (
                <FoundCard key={d.name} i={i} at={FOUND[i]} />
              ))}
            </div>
            {/* AI beam */}
            <div style={{ position: "absolute", left: 0, right: 0, top: interpolate(beam, [0, 1], [150, 1180]), height: 140, background: `linear-gradient(180deg, transparent, ${sp.violetGlow}, transparent)`, zIndex: 3, opacity: t > B + 0.4 ? 0.9 : 0 }}>
              <div style={{ position: "absolute", top: 69, left: 0, right: 0, height: 3, background: sp.violetTint }} />
            </div>
          </div>
        </AbsoluteFill>
      )}
      {/* C: why it is an ad, the text scrolled and lit */}
      {t >= C - 0.1 && <WhyAd />}
    </Cut>
  );
};

const FoundCard: React.FC<{ i: number; at: number }> = ({ i, at }) => {
  const p = useRampSec(at, at + 0.3);
  const pop = useSpringAt(at + 0.1, "bouncy");
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ position: "relative" }}>
      <div style={{ borderRadius: 26, boxShadow: p > 0 ? `0 0 0 ${5 * p}px ${sp.violet}, 0 0 50px ${sp.violetGlow}` : undefined }}>
        <ReportPostCard d={POSTCARDS[i]} w={CARD_W} found={p} />
      </div>
      {frame >= (at + 0.1) * fps && (
        <div style={{ position: "absolute", top: 70, right: -6, transform: `rotate(${8 - (i % 2) * 14}deg) scale(${pop})`, display: "flex", alignItems: "center", gap: 8, background: sp.violet, color: sp.white, fontFamily: F, fontWeight: 900, fontSize: 30, padding: "10px 18px", borderRadius: 16, boxShadow: "0 14px 30px -8px rgba(0,0,0,0.5)" }}>
          <Icon kind="check" size={32} /> РЕКЛАМА
        </div>
      )}
    </div>
  );
};

void Slam;

/** «Огромная база»: two rings of real posts orbiting in 3D behind the billion. */
const PostRing: React.FC<{ spin: number; p: number }> = ({ spin, p }) => {
  const N = 14;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingBottom: 380, perspective: 1400, opacity: p * 0.85 }}>
      {[0, 1].map((ringI) => (
        <div key={ringI} style={{ position: "absolute", width: 0, height: 0, transformStyle: "preserve-3d", transform: `translateY(${ringI ? 260 : -40}px) rotateX(${ringI ? -14 : 12}deg) rotateY(${(ringI ? -1 : 1) * spin * 30}deg) scale(${0.6 + p * 0.4})` }}>
          {Array.from({ length: N }).map((_, i) => (
            <div key={i} style={{ position: "absolute", left: -55, top: -98, transform: `rotateY(${(i * 360) / N}deg) translateZ(${ringI ? 520 : 600}px)`, backfaceVisibility: "hidden" }}>
              <PostTile file={POSTS_ALL[(i * 3 + ringI * 7) % POSTS_ALL.length]} w={110} radius={14} drift={i} />
            </div>
          ))}
        </div>
      ))}
    </AbsoluteFill>
  );
};

const WHY = [
  { m: "#WW385975", why: "артикул товара", k: "ticket" as const, at: C + 0.45 },
  { m: "Промокод на Ozon", why: "промокод", k: "percent" as const, at: C + 1.0 },
  { m: "VOIS", why: "бренд в тексте", k: "ai" as const, at: C + 1.5 },
];

/** The post zoomed: its caption scrolls, the AI lights each reason it found. */
const WhyAd: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const inP = useSpringAt(C - 0.05, "smooth");
  const scrollText = useRampSec(C + 0.75, C + 1.8);
  const lit = WHY.map((w) => Math.max(0, Math.min(1, (t - w.at) / 0.3)));
  const d = POSTCARDS[0];
  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 170, opacity: inP }}>
      <div style={{ transform: `translateY(${(1 - inP) * 300}px)` }}>
        <Card pad={34} style={{ width: 980 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <Avatar file={d.avatar} name={d.name} size={84} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 38, fontWeight: 900 }}>{d.name}</div>
              <div style={{ fontSize: 26, color: sp.muted, fontWeight: 600 }}>Подписчики: {d.subs} · {d.views} просмотров</div>
            </div>
            <Platform kind="instagram" size={64} />
          </div>
          <div style={{ display: "flex", gap: 24, marginTop: 24 }}>
            <PostTile file={d.img} w={300} radius={22} />
            <div style={{ flex: 1, height: 533, overflow: "hidden", position: "relative" }}>
              <div style={{ fontSize: 36, lineHeight: 1.45, color: sp.inkSoft, fontWeight: 500, transform: `translateY(${-scrollText * 90}px)` }}>
                <HiMark p={lit[0]}>#WW385975</HiMark> - артикул на пилинг (копируй с ww для Wb) сохраняй инструкцию, нанесите на влажную кожу головы, аккуратно помассируйте 2-3 минуты и тщательно смойте. <HiMark p={lit[1]}>Промокод на Ozon</HiMark> - на все продукты <HiMark p={lit[2]}>VOIS</HiMark>
              </div>
              <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 80, background: `linear-gradient(transparent, ${sp.card})` }} />
            </div>
          </div>
        </Card>
      </div>
      {/* the reasons, as the report's chips */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 30, width: 980 }}>
        {WHY.map((w, i) => (
          <Rise key={w.m} at={w.at} y={40}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, background: sp.white, borderRadius: 22, padding: "14px 22px", fontFamily: F, boxShadow: sp.shadow }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: sp.violet, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon kind={w.k} size={34} />
              </div>
              <span style={{ fontSize: 34, fontWeight: 900, color: sp.ink }}>{w.why}</span>
              <span style={{ fontSize: 30, fontWeight: 700, color: sp.violet, marginLeft: "auto", fontFamily: i === 0 ? "monospace" : F }}>{w.m}</span>
            </div>
          </Rise>
        ))}
      </div>
      {/* verdicts: same height, same width (note 9) */}
      <div style={{ position: "absolute", top: 1330, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 20 }}>
        <Sticker at={C + 2.0} rotate={-3} bg={sp.violet} color={sp.white} size={36} style={{ width: 430, justifyContent: "center" }}>
          <Sparkle size={38} /> РЕКЛАМА · VOIS
        </Sticker>
        <Sticker at={C + 2.4} rotate={3} size={36} style={{ width: 430, justifyContent: "center" }}>
          без отметки бренда
        </Sticker>
      </div>
    </AbsoluteFill>
  );
};
