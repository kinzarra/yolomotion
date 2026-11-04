import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { sp } from "../palette";
import { Avatar, Backdrop, Big, Card, Count, Cut, Eyebrow, F, POSTCARDS, POSTS, PostTile, useFloat, useHit, useRampSec, useSpringAt } from "../ui";

// «Найдено три с половиной тысячи рекламных интеграций и пятьсот блогеров»:
// the integrations card with real ad posts bursting out behind it, then the
// creators card with their faces.
const SWAP = 1.9;
const AVATARS: { file?: string; name: string }[] = [
  { file: "instagram_avatars_20639", name: "va" },
  { file: "tiktok_avatars_66", name: "km" },
  { file: "tiktok_avatars_334", name: "la" },
  { file: "tiktok_avatars_112", name: "a" },
  { file: "tiktok_avatars_221", name: "b" },
  { file: "tiktok_avatars_271", name: "c" },
  { file: "tiktok_avatars_4746", name: "d" },
  { file: "tiktok_avatars_10531", name: "e" },
];
const BURST = [
  { x: -400, y: -560, r: -14 }, { x: 380, y: -600, r: 12 }, { x: -440, y: 120, r: 10 },
  { x: 420, y: 160, r: -9 }, { x: -120, y: -720, r: 4 }, { x: 150, y: 330, r: -5 },
];

export const VolumeScene: React.FC = () => {
  const frame = useCurrentFrame();
  const a = useSpringAt(0, "smooth");
  const b = useSpringAt(SWAP, "smooth");
  const back = useRampSec(SWAP - 0.1, SWAP + 0.3);
  const burst = useSpringAt(0.3, "bouncy");
  const h1 = useHit(1.2, 0.4);
  const h2 = useHit(SWAP + 0.6, 0.4);
  const fl = useFloat(8, 50);
  return (
    <Cut shake={(h1.shake + h2.shake) * 0.5}>
      <Backdrop />
      {/* real posts burst out */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingBottom: 420, opacity: 1 - back * 0.7 }}>
        {BURST.map((q, i) => (
          <div key={i} style={{ position: "absolute", transform: `translate(${q.x * burst}px, ${q.y * burst + Math.sin((frame + i * 10) / 16) * 8}px) rotate(${q.r * burst}deg) scale(${burst})`, opacity: burst }}>
            <PostTile file={POSTS[(i * 4 + 1) % POSTS.length]} w={210} radius={22} drift={i} />
          </div>
        ))}
      </AbsoluteFill>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingBottom: 420 }}>
        <div
          style={{
            position: "absolute",
            transform: `translateY(${interpolate(a, [0, 1], [300, 0]) - back * 360 + fl}px) scale(${(1 + h1.pop * 0.06) * (1 - back * 0.2)})`,
            opacity: interpolate(a, [0, 0.5], [0, 1]) * (1 - back * 0.4),
          }}
        >
          <Card pad={48} style={{ width: 900 }}>
            <Eyebrow size={30}>Найдено рекламных интеграций</Eyebrow>
            <Big size={210} style={{ marginTop: 14 }}>
              <Count to={3557} dur={1.1} at={0.1} />
            </Big>
            <div style={{ marginTop: 12, color: sp.violet, fontSize: 36, fontWeight: 800 }}>у твоего конкурента</div>
          </Card>
        </div>
        {b > 0.01 && (
          <div style={{ position: "absolute", transform: `translateY(${interpolate(b, [0, 1], [700, 170]) + fl}px) scale(${1 + h2.pop * 0.06})`, opacity: interpolate(b, [0, 0.4], [0, 1]) }}>
            <Card pad={48} style={{ width: 900 }}>
              <Eyebrow size={30}>Блогеров с рекламой</Eyebrow>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14 }}>
                <Big size={190} color={sp.violet}>
                  <Count to={516} at={SWAP} dur={0.8} />
                </Big>
                <div style={{ display: "flex" }}>
                  {AVATARS.slice(0, 5).map((v, i) => (
                    <AvatarPop key={i} i={i} file={v.file} name={v.name} />
                  ))}
                </div>
              </div>
              <div style={{ marginTop: 10, color: sp.muted, fontSize: 28, fontWeight: 600 }}>
                {POSTCARDS.slice(0, 3).map((p) => "@" + p.name).join(" · ")} …
              </div>
            </Card>
          </div>
        )}
      </AbsoluteFill>
      {/* the creators who advertised the competitor, a running strip */}
      <div style={{ position: "absolute", top: 1235, left: 0, width: 1080, overflow: "hidden", opacity: b }}>
        <div style={{ display: "flex", gap: 16, transform: `translateX(${-((frame * 5) % 1600)}px)`, width: 4000 }}>
          {[...POSTCARDS, ...POSTCARDS, ...POSTCARDS].map((p, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, background: sp.white, borderRadius: 99, padding: "8px 22px 8px 8px", flexShrink: 0, fontFamily: F, boxShadow: "0 12px 30px -10px rgba(0,0,0,0.5)" }}>
              <Avatar file={p.avatar} name={p.name} size={64} />
              <div>
                <div style={{ fontSize: 26, fontWeight: 800, color: sp.ink }}>@{p.name}</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: sp.violet }}>реклама VOIS · {p.views}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Cut>
  );
};

const AvatarPop: React.FC<{ i: number; file?: string; name: string }> = ({ i, file, name }) => {
  const p = useSpringAt(SWAP + 0.3 + i * 0.08, "bouncy");
  return (
    <div style={{ marginLeft: i ? -26 : 0, transform: `scale(${p}) translateY(${(1 - p) * 40}px)`, opacity: p }}>
      <Avatar file={file} name={name} size={96} ring={sp.white} />
    </div>
  );
};
