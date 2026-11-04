// One silent beat of the map: the title snaps in, the focus company slides to
// the centre, arrows draw to it one by one (each with THE figure top left and
// a paper amount that stays on the arrow), a real person stands top right, a
// clip band plays under the ring, the stamp lands last and holds to the cut.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { theme } from "../../../theme";
import { useIn, usePunch } from "../../../reel";
import { colors } from "../palette";
import { BrandBar, Flash, SceneShell, Shockwave } from "../ui";
import { Arrow, ArrowLabel, CENTER, ClipBand, CreditLine, FOCUS_SCALE, FaceDot, Figure, HeaderStrip, Person, StampBlock, Tag, arrowCurve, ringPos } from "../parts";
import { Beat, NODE_IDS, NodeId } from "../map";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const MapScene: React.FC<{ beat: Beat; series: string; episode: string }> = ({ beat, series, episode }) => {
  const frame = useCurrentFrame();
  const focus = beat.focus;
  const slide = useIn(0, "smooth");
  const stamp = usePunch(beat.stamp.at, 18);
  // one punch per figure (fixed count per beat, so the hook order is stable)
  const hits = beat.arrows.map((a) => usePunch(a.at + 10, 14));
  const pulses = beat.pulses ?? [];
  const pulseHits = pulses.map((p) => usePunch(p.at, 16));
  const shake = hits.reduce((s, h) => s + h.shake * 0.5, 0) + pulseHits.reduce((s, h) => s + h.shake * 0.8, 0) + stamp.shake;
  const flash = Math.max(0, ...hits.map((h) => h.energy * 0.6), ...pulseHits.map((h) => h.energy));

  // where every node is right now: the focus glides from its ring seat to the centre
  const pos = (id: NodeId) => {
    const r = ringPos(id);
    if (id !== focus) return { p: r, s: 1 };
    return { p: { x: interpolate(slide, [0, 1], [r.x, CENTER.x]), y: interpolate(slide, [0, 1], [r.y, CENTER.y]) }, s: interpolate(slide, [0, 1], [1, FOCUS_SCALE]) };
  };
  // nodes not in this beat sit back; a node lights up when its arrow starts
  const involved = (id: NodeId) => beat.arrows.find((a) => a.from === id || a.to === id)?.at ?? pulses.find((p) => p.node === id)?.at;
  const dimOf = (id: NodeId) => {
    if (id === focus) return 0;
    const at = involved(id);
    const base = interpolate(frame, [0, 12], [0, 0.75], clamp);
    if (at === undefined) return base;
    return base * (1 - interpolate(frame, [at, at + 8], [0, 1], clamp));
  };
  const curves = beat.arrows.map((a) => {
    const f = pos(a.from);
    const t = pos(a.to);
    return arrowCurve(f.p, t.p, f.s, t.s, 34);
  });
  // the figure of an arrow holds until the next figure arrives
  const figures = beat.arrows.map((a, i) => ({ a, i })).filter(({ a }) => a.big);
  const pulseFigures = pulses.map((p, i) => ({ p, i }));
  const alarmOf = (id: NodeId) => {
    let v = 0;
    pulses.forEach((p, i) => {
      if (p.node !== id) return;
      v = Math.max(v, interpolate(frame, [p.at, p.at + 4, p.at + 26, p.at + 40], [0, 1, 1, 0.35], clamp), frame >= p.at ? 0.35 : 0);
    });
    return v;
  };
  const stampTone = beat.stamp.tone === "bad" ? colors.bad : undefined;
  const personOut = undefined;

  return (
    <SceneShell shake={shake}>
      <BrandBar series={series} episode={episode} delay={-30} />
      <HeaderStrip text={beat.header} bad={beat.headerBad} at={0} />

      {beat.clip && <ClipBand shot={beat.clip.shot} at={beat.clip.at} label={beat.clip.label} />}

      {/* the arrows, one svg under the tags */}
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, zIndex: 2 }}>
        {beat.arrows.map((a, i) => (
          <Arrow key={`${a.from}-${a.to}`} c={curves[i]} tone={a.tone} at={a.at} draw={12} width={a.big ? 8 : 6} />
        ))}
      </svg>

      {/* the ten companies */}
      {NODE_IDS.map((id, i) => {
        const { p, s } = pos(id);
        return <Tag key={id} id={id} pos={p} scale={s} dim={dimOf(id)} lit={id === focus} alarm={alarmOf(id)} seed={i} />;
      })}

      {/* amounts on the arrows, portraits on the ring tags */}
      {beat.arrows.map((a, i) => {
        // the amount sits near the ring end of its spoke, so converging arrows keep their labels apart;
        // when the beat also draws the reverse arrow, this one's label moves to the middle
        const reverse = beat.arrows.some((b) => b.from === a.to && b.to === a.from);
        const t = a.from === focus ? (reverse ? 0.45 : 0.58) : 0.24;
        return <ArrowLabel key={`l-${a.from}-${a.to}`} c={curves[i]} text={a.label} tone={a.tone} at={a.at + 13} t={t} />;
      })}
      {beat.arrows.map((a) => {
        if (!a.face) return null;
        const id = a.from === focus ? a.to : a.from;
        return <FaceDot key={`f-${a.from}-${a.to}`} face={a.face} pos={ringPos(id)} at={a.at + 4} />;
      })}

      {/* THE figure: one at a time */}
      {figures.map(({ a, i }, k) => {
        const next = figures[k + 1];
        return <Figure key={`big-${i}`} num={a.big!.num} unit={a.big!.unit} caption={a.big!.caption} at={a.at + 10} out={next ? next.a.at + 10 : undefined} tone={a.tone} calmAt={beat.stamp.at} />;
      })}
      {pulseFigures.map(({ p, i }, k) => {
        const next = pulseFigures[k + 1];
        return <Figure key={`pulse-${i}`} num={p.big.num} unit={p.big.unit} caption={p.big.caption} at={p.at + 2} out={next ? next.p.at + 2 : undefined} tone="pay" calmAt={beat.stamp.at} />;
      })}
      {pulses.map((p, i) => {
        const r = ringPos(p.node);
        return (
          <div key={`sw-${i}`} style={{ position: "absolute", left: r.x - 400, top: r.y - 400, width: 800, height: 800, pointerEvents: "none", zIndex: 2 }}>
            <Shockwave at={p.at} life={20} size={800} color={colors.bad} />
          </div>
        );
      })}

      {/* the person, top right */}
      {beat.person && <Person face={beat.person} at={beat.person.at} out={beat.person.out ?? personOut} />}
      {beat.person && <CreditLine text={beat.person.credit} at={beat.person.at} out={beat.person.out} />}

      {/* the stamp, last, held to the cut */}
      <StampBlock lines={beat.stamp.lines} tone={beat.stamp.tone} at={beat.stamp.at} sub={beat.stamp.sub} />

      <Flash amount={flash} />
      <Flash amount={stamp.energy} color={stampTone} />
    </SceneShell>
  );
};
