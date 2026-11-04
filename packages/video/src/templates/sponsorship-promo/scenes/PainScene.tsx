import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { sp } from "../palette";
import { Backdrop, Big, Cut, F, GenPhoto, Icon, POSTS, PostTile, Slam, Stamp, Sticker, clamp, useFloat, useHit, useRampSec } from "../ui";

// The old way. A: the doubting girl (generated, the author's reference) and
// «НЕДЕЛЯ ВРУЧНУЮ». B: her hand on the phone, the feed scrolls by thumb, it
// stops on each post and someone has to decide: ad or not.
const B = 1.7;
// hand-key.png is 1536×2752; the keyed screen is x 427..1107, y 434..1941.
const K = 1080 / 1536;
const TOP = (1920 - 2752 * K) / 2;
const SCREEN = { x: 427 * K, y: 434 * K + TOP, w: (1107 - 427) * K, h: (1941 - 434) * K };
const FEED = [POSTS[3], POSTS[0], POSTS[9], POSTS[4], POSTS[14], POSTS[6]];
const STOPS = [
  { at: 2.0, i: 1, ad: true, label: "промокод?" },
  { at: 2.95, i: 2, ad: false, label: "реклама?" },
  { at: 3.9, i: 3, ad: true, label: "бюджет?" },
];

export const PainScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const toB = useRampSec(B - 0.12, B + 0.18);
  const hit = useHit(B, 0.4);
  const fl = useFloat(6, 50);
  // feed position: eased jumps between the stops, one tile height each
  const tileH = (SCREEN.w * 16) / 9;
  let pos = 0;
  STOPS.forEach((s) => {
    pos += interpolate(t, [s.at - 0.45, s.at - 0.05], [0, 1], { ...clamp, easing: (x) => 1 - Math.pow(1 - x, 3) });
  });
  const moving = STOPS.some((s) => t > s.at - 0.45 && t < s.at - 0.05);
  const y = -pos * tileH + tileH * 0.0;
  return (
    <Cut shake={hit.shake * 0.6}>
      <Backdrop intensity={0.8} />
      {/* A: the girl */}
      {t < B + 0.2 && (
        <AbsoluteFill style={{ opacity: 1 - toB }}>
          <GenPhoto file="girl2.png" z0={1.02} z1={1.12} dur={2} />
          <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(18,17,33,0.55) 0%, transparent 30%, transparent 55%, rgba(18,17,33,0.85) 100%)" }} />
          <AbsoluteFill style={{ alignItems: "center", paddingTop: 230 }}>
            <Slam at={0.15} tilt={-3}><Big size={110} color={sp.white} style={{ textShadow: "0 6px 30px rgba(0,0,0,0.6)" }}>НЕДЕЛЯ</Big></Slam>
            <Slam at={0.5} tilt={2}><Big size={110} color={sp.white} style={{ textShadow: "0 6px 30px rgba(0,0,0,0.6)" }}>ВРУЧНУЮ</Big></Slam>
          </AbsoluteFill>
          <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingTop: 600 }}>
            <Stamp text="7 ДНЕЙ" at={0.9} size={140} rotate={-10} style={{ background: "rgba(255,255,255,0.92)" }} />
          </AbsoluteFill>
        </AbsoluteFill>
      )}
      {/* B: the hand, the feed in its screen */}
      {t >= B - 0.12 && (
        <AbsoluteFill style={{ opacity: toB, transform: `translateY(${fl}px) scale(${interpolate(toB, [0, 1], [1.12, 1])})` }}>
          <div style={{ position: "absolute", left: SCREEN.x + 2, top: SCREEN.y + 2, width: SCREEN.w - 4, height: SCREEN.h - 4, borderRadius: 54, overflow: "hidden", background: sp.black }}>
            <div style={{ transform: `translateY(${y}px)`, filter: moving ? "blur(4px)" : undefined }}>
              {FEED.map((p, i) => (
                <PostTile key={i} file={p} w={SCREEN.w} radius={0} drift={i} />
              ))}
            </div>
            {/* the decision on each stop */}
            {STOPS.map((s) => (
              <Verdict key={s.at} at={s.at} ad={s.ad} />
            ))}
          </div>
          <Img src={staticFile("media/sponsorship-promo/gen/hand-key.png")} style={{ position: "absolute", left: 0, top: TOP, width: 1080, height: 2752 * K }} />
          {/* doubt stickers around the phone */}
          <div style={{ position: "absolute", left: 40, top: 520 }}>
            <Sticker at={STOPS[0].at - 0.1} rotate={-8} size={42}>{STOPS[0].label}</Sticker>
          </div>
          <div style={{ position: "absolute", right: 30, top: 820 }}>
            <Sticker at={STOPS[1].at - 0.1} rotate={7} size={42}>{STOPS[1].label}</Sticker>
          </div>
          <div style={{ position: "absolute", left: 60, top: 1120 }}>
            <Sticker at={STOPS[2].at - 0.1} rotate={-5} size={42} bg={sp.bad} color={sp.white}>{STOPS[2].label}</Sticker>
          </div>
        </AbsoluteFill>
      )}
    </Cut>
  );
};

const Verdict: React.FC<{ at: number; ad: boolean }> = ({ at, ad }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const on = t >= at + 0.15 && t < at + 0.75;
  const think = t >= at - 0.05 && t < at + 0.15;
  if (!on && !think) return null;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      {think ? (
        <div style={{ width: 110, height: 110, borderRadius: 110, background: "rgba(0,0,0,0.55)", color: sp.white, fontFamily: F, fontWeight: 900, fontSize: 70, display: "flex", alignItems: "center", justifyContent: "center" }}>?</div>
      ) : (
        <div style={{ width: 150, height: 150, borderRadius: 150, background: ad ? sp.violet : sp.bad, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 20px 50px rgba(0,0,0,0.5)" }}>
          <Icon kind={ad ? "check" : "close"} size={100} />
        </div>
      )}
    </AbsoluteFill>
  );
};
