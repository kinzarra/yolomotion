// Beat 1 — the circle. The cover is already dim; the three arrows of the
// voice draw bold on their words — NVIDIA → OPENAI $30, OPENAI → ORACLE $300,
// ORACLE → NVIDIA $40 — with a person for each; on «круг» the triangle pulses,
// on «замкнулся» the stamp and the ouroboros land in its middle.
import React from "react";
import { useCurrentFrame } from "remotion";
import { theme } from "../../../theme";
import { usePunch, useRamp } from "../../../reel";
import { colors } from "../palette";
import { BrandBar, Flash, Glitch, SceneShell, Shockwave } from "../ui";
import { Arrow, ArrowLabel, CENTER, CreditLine, Engraving, Figure, HeaderStrip, Person, StampBlock, Tag, arrowCurve, ringPos } from "../parts";
import { COVER_ARROWS, FACES, NODE_IDS, TRIANGLE } from "../map";
import { CIRCLE } from "../timeline";
import { COVER_BEND } from "./CoverScene";

const TRI_BEND = 70;

export const CircleScene: React.FC<{ series: string; episode: string }> = ({ series, episode }) => {
  const frame = useCurrentFrame();
  const n1 = usePunch(CIRCLE.n1, 16);
  const n2 = usePunch(CIRCLE.n2, 16);
  const n3 = usePunch(CIRCLE.n3, 16);
  const ring = usePunch(CIRCLE.ring, 22);
  const stamp = usePunch(CIRCLE.stamp, 18);
  // the cover's hairball steps back in the first half second
  const dim = useRamp(0, 12, theme.ease.inOut);
  const tear = frame < 7 ? 0.5 : 0;
  const shake = n1.shake * 0.6 + n2.shake * 0.6 + n3.shake * 0.6 + ring.shake * 0.8 + stamp.shake;

  const tri = TRIANGLE.map((a) => arrowCurve(ringPos(a.from), ringPos(a.to), 1, 1, TRI_BEND));
  const inTriangle = (id: string) => TRIANGLE.some((a) => a.from === id || a.to === id);
  const lands = [CIRCLE.n1, CIRCLE.n2, CIRCLE.n3];
  const starts = [CIRCLE.a1, CIRCLE.a2, CIRCLE.a3];

  return (
    <SceneShell shake={shake}>
      <BrandBar series={series} episode={episode} delay={-30} />
      <HeaderStrip text="КТО КОМУ ДОЛЖЕН В ИИ" at={-30} />

      {/* the cover's arrows, stepping back */}
      <Glitch amount={tear}>
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, zIndex: 2, opacity: 1 - dim * 0.88 }}>
          {COVER_ARROWS.map((a) => (
            <Arrow key={`${a.from}-${a.to}`} c={arrowCurve(ringPos(a.from), ringPos(a.to), 1, 1, COVER_BEND)} tone={a.tone} at={-40} width={4} dots={false} />
          ))}
        </svg>
      </Glitch>

      {/* the triangle, bold, on the words */}
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, zIndex: 2 }}>
        {TRIANGLE.map((a, i) => (
          <Arrow key={`tri-${i}`} c={tri[i]} tone={a.tone} at={starts[i]} draw={Math.max(6, lands[i] - starts[i])} width={frame >= CIRCLE.ring ? 12 : 9} />
        ))}
      </svg>
      <div style={{ position: "absolute", left: CENTER.x - 600, top: CENTER.y - 600, width: 1200, height: 1200, pointerEvents: "none", zIndex: 2 }}>
        <Shockwave at={CIRCLE.ring} life={24} size={1200} />
      </div>

      {/* the ten companies: the triangle's three stay lit */}
      {NODE_IDS.map((id, i) => (
        <Tag key={id} id={id} pos={ringPos(id)} dim={inTriangle(id) ? 0 : dim * 0.75} seed={i} lit={frame >= CIRCLE.ring && inTriangle(id)} />
      ))}

      {/* amounts on the three arrows */}
      <ArrowLabel c={tri[0]} text="$30 МЛРД" tone="invest" at={CIRCLE.n1 + 6} t={0.5} size={22} />
      <ArrowLabel c={tri[1]} text="$300 МЛРД" tone="pay" at={CIRCLE.n2 + 6} t={0.5} size={22} />
      <ArrowLabel c={tri[2]} text="$40 МЛРД ЧИПОВ" tone="pay" at={CIRCLE.n3 + 6} t={0.22} size={22} />

      {/* THE figure, one at a time, on the spoken number */}
      <Figure num="$30" unit="МЛРД" caption="NVIDIA ВЛОЖИЛА В OPENAI · 2026" at={CIRCLE.n1} out={CIRCLE.n2} tone="invest" />
      <Figure num="$300" unit="МЛРД" caption="OPENAI ПЛАТИТ ORACLE ЗА СЕРВЕРЫ · 5 ЛЕТ" at={CIRCLE.n2} out={CIRCLE.n3} tone="pay" />
      <Figure num="$40" unit="МЛРД" caption="ORACLE ПОКУПАЕТ ЧИПЫ У NVIDIA · 400 000 ШТУК" at={CIRCLE.n3} tone="pay" calmAt={CIRCLE.stamp} />

      {/* a person per arrow, top right */}
      <Person face={FACES.huang} at={CIRCLE.a1} out={CIRCLE.a2} />
      <Person face={FACES.altman} at={CIRCLE.a2} out={CIRCLE.a3} />
      <Person face={FACES.ellison} at={CIRCLE.a3} />
      <CreditLine text={FACES.huang.credit} at={CIRCLE.a1} out={CIRCLE.a2} />
      <CreditLine text={FACES.altman.credit} at={CIRCLE.a2} out={CIRCLE.a3} />
      <CreditLine text={FACES.ellison.credit} at={CIRCLE.a3} />

      {/* the turn: КРУГ ЗАМКНУЛСЯ */}
      <Engraving at={CIRCLE.stamp + 2} size={240} />
      <StampBlock lines={["КРУГ ЗАМКНУЛСЯ"]} tone="bad" at={CIRCLE.stamp} sub="ДЕНЬГИ ВЕРНУЛИСЬ ТУДА, ОТКУДА ВЫШЛИ" />

      <Flash amount={Math.max(n1.energy, n2.energy, n3.energy) * 0.6} />
      <Flash amount={ring.energy * 0.8} />
      <Flash amount={stamp.energy} color={colors.bad} />
    </SceneShell>
  );
};
