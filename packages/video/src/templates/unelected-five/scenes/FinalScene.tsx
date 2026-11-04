// The last beat: the five masks line up again, this time with the names
// under them — the ones who were never on a ballot. The stamp lands on
// «выбирал» and holds to the last frame.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { theme } from "../../../theme";
import { useIn, usePunch } from "../../../reel";
import { colors, palette } from "../palette";
import { Flash, Kinetic, SceneShell } from "../ui";
import { FIGURES, PhotoFigure } from "../parts";
import { PLACES } from "../places";
import { FINAL } from "../timeline";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// mask slot → place (the row is plague, facet, fawkes, grin, balaclava); the
// portrait that unmasks each slot and the улика under the name (author's notes 16–18)
const ORDER = [0, 1, 2, 3, 4];
const PORTRAITS = [
  { src: "person-fouquet.png", ratio: 1200 / 1996, tag: "ЧИПЫ · $380 МЛН" },
  { src: "person-zhang.png", ratio: 1, tag: "TIKTOK · 1 МЛРД" },
  { src: "person-fink.png", ratio: 1200 / 1813, tag: "$15,5 ТРЛН" },
  { src: "person-wang.png", ratio: 1200 / 1601, tag: "ИДЕОЛОГИЯ КНР" },
  { src: "person-tahnoon.png", ratio: 1200 / 897, tag: "$1,5 ТРЛН · ОАЭ" },
];

export const FinalScene: React.FC = () => {
  const frame = useCurrentFrame();
  const row = useIn(0, "smooth");
  const hit = usePunch(FINAL.stamp, 20);
  const stampIn = useIn(FINAL.stamp, "snappy");
  const reveals = FIGURES.map((_, i) => useIn(FINAL.names + 10 + i * 5, "smooth"));
  const nameIns = ORDER.map((_, i) => useIn(FINAL.names + i * 5, "snappy"));
  return (
    <SceneShell exit={false} shake={hit.shake}>
      <div style={{ position: "absolute", inset: 0, opacity: row, transform: `scale(${interpolate(row, [0, 1], [1.1, 1])})` }}>
        {FIGURES.map((f, i) => {
          const r = reveals[i];
          return <PhotoFigure key={f.src} fig={{ ...f, y: f.y - 60 }} seed={i + 1} reveal={{ src: PORTRAITS[i].src, ratio: PORTRAITS[i].ratio, p: r }} />;
        })}
      </div>
      {/* the names, printed under the row, one per figure */}
      {ORDER.map((pi, i) => {
        const f = FIGURES[i];
        const p = PLACES[pi];
        const q = nameIns[i];
        const cx = f.x + f.width / 2;
        return (
          <div
            key={p.name}
            style={{
              position: "absolute",
              left: Math.max(12, Math.min(1080 - 12 - 210, cx - 105)),
              width: 210,
              top: 1230 + (i % 2) * 110,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
              textAlign: "center",
              fontFamily: theme.fonts.mono,
              fontWeight: 800,
              fontSize: 19,
              letterSpacing: "0.08em",
              lineHeight: 1.2,
              color: palette.text,
              opacity: q,
              transform: `translateY(${interpolate(q, [0, 1], [20, 0])}px)`,
            }}
          >
            <div>
              <span style={{ color: palette.primary }}>{p.rank}</span> {p.name}
            </div>
            <div style={{ padding: "4px 10px", background: colors.paper, color: colors.ink, fontSize: 16, whiteSpace: "nowrap" }}>{PORTRAITS[i].tag}</div>
          </div>
        );
      })}
      {/* the line, then the stamp */}
      <div style={{ position: "absolute", left: 72, right: 72, top: 250 }}>
        <Kinetic text="НИ ОДНОГО ИЗ НИХ" size={72} delay={2} per={3} mode="snap" lineHeight={1.05} />
        <Kinetic text="ТЫ НЕ ВЫБИРАЛ" size={72} delay={FINAL.stamp - 10} per={3} mode="snap" bad={[1]} lineHeight={1.05} />
      </div>
      {frame >= FINAL.stamp && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 1500,
            display: "flex",
            justifyContent: "center",
            opacity: stampIn,
            transform: `scale(${interpolate(stampIn, [0, 1], [2.2, 1])}) rotate(-5deg)`,
          }}
        >
          <div
            style={{
              padding: "18px 36px",
              border: `10px solid ${colors.bad}`,
              color: colors.bad,
              fontFamily: theme.fonts.wide,
              fontWeight: 900,
              fontSize: 60,
              lineHeight: 1.05,
              letterSpacing: "-0.01em",
              textAlign: "center",
              boxShadow: `0 0 60px ${colors.badGlow}`,
              background: "rgba(6,8,10,0.6)",
            }}
          >
            ТВОИХ ГОЛОСОВ
            <br />
            ЗА НИХ: <span style={{ fontSize: 84 }}>0</span>
          </div>
        </div>
      )}
      <Flash amount={hit.energy} color={colors.bad} />
    </SceneShell>
  );
};
