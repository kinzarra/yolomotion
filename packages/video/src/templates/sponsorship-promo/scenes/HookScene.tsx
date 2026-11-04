import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { sp } from "../palette";
import { Big, POSTS, PostTile, PostWall, Platform, PlatformKind, Slam, Sticker, clamp, useFloat, useHit, useRampSec, useSpringAt } from "../ui";

// Frame 0: the question over the wall of the competitor's real ads, word by
// word. At «И как вообще найти…» the wall turns into a dense grid of ad videos
// and the four networks fly out as stickers.
const TURN = 3.6;
const GRID = 12; // 6 × 2 tiles
// the stickers land around the girl's raised hands
const NETS: { k: PlatformKind; x: number; y: number; r: number }[] = [
  { k: "youtube", x: 70, y: 1000, r: -12 },
  { k: "telegram", x: 150, y: 1170, r: 8 },
  { k: "tiktok", x: 800, y: 1170, r: -6 },
  { k: "instagram", x: 880, y: 1000, r: 12 },
];

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const turn = useRampSec(TURN, TURN + 0.3);
  const fl = useFloat(8, 46);
  const hit = useHit(TURN, 0.4);
  const tP = useSpringAt(TURN + 0.5, "snappy");
  const girl = useSpringAt(TURN + 0.25, "smooth");
  const netP = [useSpringAt(5.6, "bouncy"), useSpringAt(5.75, "bouncy"), useSpringAt(5.9, "bouncy"), useSpringAt(6.05, "bouncy")];
  return (
    <AbsoluteFill>
      <PostWall dim={0.55 + turn * 0.45} speed={1.6} />
      {/* phase 1: the question, slammed word by word */}
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: 300,
          opacity: 1 - turn,
          transform: `translateY(${fl}px) scale(${1 - turn * 0.2})`,
          gap: 10,
        }}
      >
        <Slam at={0.05} tilt={-2}><Big size={96} color={sp.white}>А ТЫ ЗНАЕШЬ,</Big></Slam>
        <Slam at={0.75} tilt={1}><Big size={112} color={sp.white}>У КАКИХ</Big></Slam>
        <Slam at={1.05} tilt={-1}><Big size={132} color={sp.white} style={{ textShadow: `0 0 60px ${sp.violetGlow}` }}>БЛОГЕРОВ</Big></Slam>
        <Slam at={1.75} tilt={1}><Big size={92} color={sp.violetTint}>РЕКЛАМИРУЕТСЯ</Big></Slam>
        <Slam at={2.55} tilt={-3} style={{ marginTop: 18 }}>
          <div style={{ background: sp.violet, borderRadius: 28, padding: "10px 34px", boxShadow: `0 0 80px ${sp.violetGlow}` }}>
            <Big size={90} color={sp.white}>ТВОЙ КОНКУРЕНТ?</Big>
          </div>
        </Slam>
      </AbsoluteFill>

      {/* phase 2: a grid of ad videos, the question, the networks */}
      {turn > 0 && (
        <AbsoluteFill style={{ backgroundColor: `rgba(18,17,33,${0.75 * turn})` }}>
          <div style={{ position: "absolute", top: 150, left: 24, width: 1032, display: "flex", flexWrap: "wrap", gap: 12, transform: `scale(${1 + hit.pop * 0.04})` }}>
            {Array.from({ length: GRID }).map((_, i) => {
              const at = TURN + ((i * 7) % GRID) * 0.025;
              return <GridTile key={i} i={i} at={at} frame={frame} />;
            })}
          </div>
          <div style={{ position: "absolute", top: 750, width: 1080, textAlign: "center", zIndex: 3, opacity: tP, transform: `scale(${interpolate(tP, [0, 1], [1.4, 1])})` }}>
            <Big size={76} color={sp.white} style={{ lineHeight: 1.05, whiteSpace: "normal" }}>
              КАК НАЙТИ <span style={{ color: sp.violetTint }}>РЕКЛАМУ</span>
              <br />У БЛОГЕРОВ?
            </Big>
          </div>
          {/* the girl asks it (generated, same character as the pain beat) */}
          <div style={{ position: "absolute", left: 540 - 380, top: 900, width: 760, transform: `translateY(${(1 - girl) * 500}px)`, opacity: girl }}>
            <Img src={staticFile("media/sponsorship-promo/gen/ask-cut.png")} style={{ width: 760, display: "block", filter: `drop-shadow(0 0 60px ${sp.violetGlow})` }} />
          </div>
          {NETS.map((n, i) => (
            <div
              key={n.k}
              style={{
                position: "absolute",
                zIndex: 4,
                top: n.y,
                left: 540 - 62 + (n.x - 478) * netP[i],
                transform: `translateY(${(1 - netP[i]) * 200}px) rotate(${n.r * netP[i] + Math.sin((frame + i * 11) / 10) * 4}deg) scale(${netP[i]})`,
                opacity: interpolate(netP[i], [0, 0.2], [0, 1], clamp),
              }}
            >
              <div style={{ padding: 8, background: sp.white, borderRadius: 40, boxShadow: "0 20px 40px -10px rgba(0,0,0,0.6)" }}>
                <Platform kind={n.k} size={108} />
              </div>
            </div>
          ))}
          <div style={{ position: "absolute", top: 560, left: 650, zIndex: 3 }}>
            <Sticker at={TURN + 0.9} rotate={6} bg={sp.bad} color={sp.white} size={40}>реклама?</Sticker>
          </div>
        </AbsoluteFill>
      )}
      <AbsoluteFill style={{ backgroundColor: sp.white, opacity: interpolate(turn, [0, 0.15, 0.5], [0, 0.25, 0], clamp) }} />
    </AbsoluteFill>
  );
};

const GridTile: React.FC<{ i: number; at: number; frame: number }> = ({ i, at, frame }) => {
  const p = useSpringAt(at, "bouncy");
  const idx = (i * 5 + 3) % POSTS.length;
  return (
    <div style={{ transform: `scale(${p}) rotate(${(1 - p) * (i % 2 ? 10 : -10)}deg)`, opacity: p, position: "relative" }}>
      <PostTile file={POSTS[idx]} w={161} radius={18} drift={i} />
      <div style={{ position: "absolute", left: 10, bottom: 10, width: 40, height: 40, borderRadius: 40, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="22" height="22" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" fill={sp.white} /></svg>
      </div>
      <div style={{ position: "absolute", inset: 0, borderRadius: 18, boxShadow: `inset 0 0 0 3px ${(frame + i * 13) % 50 < 6 ? sp.violet : "transparent"}` }} />
    </div>
  );
};
