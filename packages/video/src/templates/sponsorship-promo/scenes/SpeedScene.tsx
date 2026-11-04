import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { sp } from "../palette";
import { Backdrop, Bar, Big, Card, Count, Cut, Eyebrow, Icon, IconKind, POSTS, PostTile, Rise, Sparkle, useHit, useRampSec } from "../ui";

// What happens in those 15 minutes: posts stream in from every side into the
// build card, the checked counter runs, the five stages light with the app's icons.
const STAGES: { s: string; k: IconKind }[] = [
  { s: "Поиск", k: "search" },
  { s: "Проверка AI", k: "ai" },
  { s: "Размещения", k: "campaign" },
  { s: "Свои медиа", k: "media" },
  { s: "Отчёт", k: "doc" },
];

export const SpeedScene: React.FC = () => {
  const frame = useCurrentFrame();
  const p = useRampSec(0.1, 1.7, (x) => 1 - Math.pow(1 - x, 2));
  const done = useHit(1.7, 0.4);
  return (
    <Cut>
      <Backdrop intensity={1} />
      {/* the stream of posts being checked */}
      {Array.from({ length: 14 }).map((_, i) => {
        const cyc = ((frame + i * 9) % 42) / 42;
        const ang = (i / 14) * Math.PI * 2 + 0.4;
        const r = interpolate(cyc, [0, 1], [900, 60]);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 540 + Math.cos(ang) * r - 60,
              top: 800 + Math.sin(ang) * r * 0.9 - 107,
              transform: `rotate(${ang * 40}deg) scale(${interpolate(cyc, [0, 0.8, 1], [1, 0.6, 0.1])})`,
              opacity: interpolate(cyc, [0, 0.15, 0.85, 1], [0, 0.9, 0.9, 0]),
            }}
          >
            <PostTile file={POSTS[(i * 3) % POSTS.length]} w={120} radius={14} drift={i} />
          </div>
        );
      })}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingBottom: 420, gap: 40 }}>
        <Rise at={0}>
          <Big size={170} color={sp.white} style={{ textShadow: `0 0 60px ${sp.violetGlow}` }}>
            15 МИНУТ
          </Big>
        </Rise>
        <div style={{ transform: `scale(${1 + done.pop * 0.06})` }}>
          <Card pad={44} style={{ width: 980 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
              <div style={{ width: 84, height: 84, borderRadius: 22, background: sp.violet, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Sparkle size={50} />
              </div>
              <div style={{ flex: 1 }}>
                <Eyebrow size={24}>{p < 1 ? "Сбор отчёта" : "Отчёт готов"}</Eyebrow>
                <div style={{ fontWeight: 800, fontSize: 36, marginTop: 4 }}>MIXIT vs VOIS vs The Act</div>
              </div>
              <Big size={84} color={sp.violet}>{Math.round(p * 100)}%</Big>
            </div>
            <div style={{ marginTop: 26 }}>
              <Bar p={p} h={22} />
            </div>
            <div style={{ marginTop: 14, fontSize: 28, fontWeight: 700, color: sp.mutedDark }}>
              найдено размещений: <span style={{ color: sp.ink }}><Count to={3557} at={0.1} dur={1.6} /></span>
            </div>
            <div style={{ marginTop: 26, display: "flex", justifyContent: "space-between" }}>
              {STAGES.map((st, i) => {
                const on = p > (i + 1) / STAGES.length - 0.02;
                return (
                  <div key={st.s} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: 170 }}>
                    <div style={{ position: "relative", width: 84, height: 84, borderRadius: 26, background: on ? sp.violet : sp.track, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: on ? `0 10px 30px -8px ${sp.violetGlow}` : undefined }}>
                      <Icon kind={st.k} size={46} color={on ? sp.white : sp.muted} />
                      {on && (
                        <div style={{ position: "absolute", right: -8, bottom: -8, width: 36, height: 36, borderRadius: 36, background: sp.theact, border: `4px solid ${sp.white}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Icon kind="check" size={24} />
                        </div>
                      )}
                    </div>
                    <div style={{ fontSize: 24, fontWeight: 700, color: on ? sp.ink : sp.muted, whiteSpace: "nowrap" }}>{st.s}</div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </AbsoluteFill>
    </Cut>
  );
};
