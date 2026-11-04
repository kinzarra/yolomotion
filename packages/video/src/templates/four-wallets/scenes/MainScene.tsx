// The whole reel is one continuous chart: the trails must persist across
// every moment, so there are no cuts, only events.
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile } from "remotion";
import { theme } from "../../../theme";
import { HEROES, Hero, RANKING, peakOf } from "../data";
import { fwColors } from "../palette";
import { AGE_TO, HOOK, LIFE_END, ageAt, timeAt } from "../timeline";
import {
  Axes,
  CH,
  Flash,
  Head,
  LegendCell,
  PeakStar,
  Sky,
  Stamp,
  Tag,
  Trail,
  Txt,
  exitOf,
  money,
  pointAt,
  usePop,
  useT,
  valueAt,
  xOf,
  yearsWord,
} from "../ui";

const TAG_LIFE = 1.25;
const EVENTS = HEROES.flatMap((h) => h.events.map((e) => ({ hero: h, ...e, at: timeAt(e.age) })));

/* ------------------------------------------------------------- hook */

const Portraits: React.FC = () => {
  const { t } = useT();
  const out = interpolate(t, [2.35, 2.85], [0, 1], { easing: theme.ease.in, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (out >= 1) return null;
  return (
    <AbsoluteFill>
      {HEROES.map((h, i) => {
        const cx = 165 + i * 250;
        const lag = Math.max(0, Math.min(1, out * 1.3 - i * 0.08));
        const start = h.keys[0][1];
        return (
          <div
            key={h.key}
            style={{
              position: "absolute",
              left: cx - 125,
              top: 600,
              width: 250,
              opacity: 1 - lag,
              transform: `translateY(${lag * 160}px) scale(${1 - lag * 0.35})`,
              textAlign: "center",
            }}
          >
            <div style={{ height: 660, display: "flex", alignItems: "flex-end", justifyContent: "center", overflow: "hidden" }}>
              <Img
                src={staticFile(h.photo)}
                style={{
                  maxWidth: 270,
                  maxHeight: 660,
                  objectFit: "contain",
                  transform: `scale(${1 + t * 0.012}) translateY(${Math.sin(t * 1.6 + i) * 4}px)`,
                  transformOrigin: "50% 100%",
                  filter: `drop-shadow(0 0 26px ${h.color}66)`,
                }}
              />
            </div>
            <div style={{ height: 4, margin: "0 30px", background: h.color, boxShadow: `0 0 18px ${h.color}` }} />
            <div style={{ fontFamily: theme.fonts.mono, fontSize: 17, fontWeight: 700, letterSpacing: "0.06em", color: h.color, marginTop: 14, lineHeight: 1.25, height: 44 }}>
              {h.name}
            </div>
            <div style={{ fontFamily: theme.fonts.wide, fontSize: start > 0 ? 34 : 44, fontWeight: 900, color: start > 0 ? fwColors.major : fwColors.white, marginTop: 4 }}>
              <Txt>{money(start)}</Txt>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const Header: React.FC = () => {
  const { t } = useT();
  const out = exitOf(t, LIFE_END + 0.45, 0.3);
  const ans = usePop(LIFE_END + 0.6, "smooth");
  const ask = usePop(LIFE_END + 1.7, "snappy");
  return (
    <AbsoluteFill>
      {out > 0 && (
        <div style={{ position: "absolute", top: 268, left: 0, right: 0, textAlign: "center", opacity: out, transform: `translateY(${(1 - out) * -30}px)` }}>
          <div style={{ fontFamily: theme.fonts.wide, fontSize: 70, fontWeight: 900, color: fwColors.white, letterSpacing: "-0.01em" }}>
            КТО БОГАЧЕ В 65?
          </div>
          <div style={{ fontFamily: theme.fonts.mono, fontSize: 26, fontWeight: 600, color: fwColors.axisText, marginTop: 18, letterSpacing: "0.06em" }}>
            4 ЖИЗНИ С 18 ДО 65 ЛЕТ · УГАДАЙ
          </div>
        </div>
      )}
      {ans > 0.01 && (
        <div style={{ position: "absolute", top: 250, left: 0, right: 0, textAlign: "center" }}>
          <div style={{ opacity: ans, transform: `translateY(${interpolate(ans, [0, 1], [30, 0])}px) scale(${interpolate(ans, [0, 1], [0.9, 1])})` }}>
            <div style={{ fontFamily: theme.fonts.mono, fontSize: 26, fontWeight: 800, letterSpacing: "0.16em", color: fwColors.major }}>МАЖОР</div>
            <div style={{ fontFamily: theme.fonts.wide, fontSize: 64, fontWeight: 900, color: fwColors.white, marginTop: 6 }}>
              <Txt>25 МЛН ₽ → 2 МЛН ₽</Txt>
            </div>
          </div>
          <div
            style={{
              fontFamily: theme.fonts.wide,
              fontSize: 30,
              fontWeight: 700,
              color: fwColors.axisText,
              marginTop: 16,
              opacity: ask,
              transform: `translateY(${interpolate(ask, [0, 1], [20, 0])}px)`,
            }}
          >
            А ТЫ КАКАЯ ЛИНИЯ?
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------ chart */

const AgeCursor: React.FC<{ age: number; show: number }> = ({ age, show }) => {
  const x = xOf(age);
  const n = Math.floor(age);
  return (
    <AbsoluteFill style={{ opacity: show }}>
      <div style={{ position: "absolute", left: x - 1, top: CH.top - 20, width: 2, height: CH.bottom - CH.top + 20, background: `linear-gradient(180deg, ${fwColors.gridZero}, transparent)` }} />
      <div
        style={{
          position: "absolute",
          left: Math.min(CH.right - 40, Math.max(CH.left + 40, x)),
          top: CH.top - 74,
          transform: "translateX(-50%)",
          padding: "8px 20px",
          borderRadius: 999,
          background: fwColors.surface,
          border: `1.5px solid ${fwColors.surfaceLine}`,
          fontFamily: theme.fonts.wide,
          fontSize: 30,
          fontWeight: 800,
          color: fwColors.white,
          whiteSpace: "nowrap",
        }}
      >
        {n} {yearsWord(n)}
      </div>
    </AbsoluteFill>
  );
};

const lastEventPulse = (h: Hero, t: number) => {
  const past = h.events.map((e) => timeAt(e.age)).filter((at) => at <= t);
  if (past.length === 0) return 0;
  return (t - past[past.length - 1]) / 0.6;
};

const starAt = (h: Hero) => {
  const [age] = peakOf(h);
  return age >= AGE_TO - 0.01 ? LIFE_END + 0.15 : timeAt(age + 0.7);
};

/* ----------------------------------------------------------- legend */

const SLOT = (i: number) => ({ x: 60 + (i % 2) * 490, y: 1408 + Math.floor(i / 2) * 140 });

const Legend: React.FC<{ age: number }> = ({ age }) => {
  const { t } = useT();
  const reorder = usePop(LIFE_END + 0.55, "smooth");
  return (
    <AbsoluteFill>
      {HEROES.map((h, i) => {
        const enter = usePop(2.5 + i * 0.1, "snappy");
        const rank = RANKING.indexOf(h.key);
        const a = SLOT(i);
        const b = SLOT(rank);
        const rankPop = usePop(LIFE_END + 0.9 + rank * 0.12, "bouncy");
        if (t < 2.45) return null;
        return (
          <div
            key={h.key}
            style={{
              position: "absolute",
              left: interpolate(reorder, [0, 1], [a.x, b.x]),
              top: interpolate(reorder, [0, 1], [a.y, b.y]),
              opacity: enter,
              transform: `translateY(${interpolate(enter, [0, 1], [40, 0])}px) scale(${interpolate(enter, [0, 1], [0.9, 1])})`,
            }}
          >
            <LegendCell hero={h} value={valueAt(h, age)} rank={rank + 1} rankPop={rankPop} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------- scene */

export const MainScene: React.FC = () => {
  const { t } = useT();
  const age = ageAt(t);
  const chartIn = usePop(2.45, "smooth");
  const go = usePop(2.15, "snappy");
  const goOut = exitOf(t, 3.3, 0.25);

  let sx = 0;
  let sy = 0;
  let flash = 0;
  for (const e of EVENTS) {
    const dt = t - e.at;
    if (!e.shake || dt < 0 || dt > 0.45) continue;
    const amp = 13 * (1 - dt / 0.45) ** 2;
    sx += Math.sin(dt * 70) * amp;
    sy += Math.cos(dt * 55) * amp * 0.6;
    flash = Math.max(flash, 1 - dt / 0.3);
  }

  return (
    <AbsoluteFill>
      <Sky />
      <Header />
      <AbsoluteFill style={{ transform: `translate(${sx}px, ${sy}px)` }}>
        <Axes show={chartIn} />
        {t >= HOOK - 0.2 && <AgeCursor age={age} show={chartIn * exitOf(t, LIFE_END + 0.5, 0.3)} />}
        {HEROES.map((h) => (
          <Trail key={h.key} hero={h} age={age} show={chartIn} />
        ))}
        {HEROES.map((h) => {
          const [pa, pv] = peakOf(h);
          const p = pointAt(h, pa);
          return <PeakStar key={h.key} hero={h} x={p.x} y={p.y} at={starAt(h)} label={`МАКС ${money(pv)}`} below={h.key === "major"} />;
        })}
        {HEROES.map((h) => (
          <Head key={h.key} hero={h} age={age} show={chartIn} pulse={lastEventPulse(h, t)} />
        ))}
        {EVENTS.map((e) => (
          <Tag
            key={`${e.hero.key}-${e.age}`}
            hero={e.hero}
            title={e.title}
            sub={e.sub}
            loss={e.loss}
            at={e.at}
            life={TAG_LIFE}
            anchor={pointAt(e.hero, e.age + 0.6)}
          />
        ))}
      </AbsoluteFill>
      <Portraits />
      <Legend age={age} />
      {t > 2.1 && goOut > 0 && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: goOut }}>
          <div style={{ opacity: go }}>
            <Stamp delay={Math.round(2.15 * 30)} size={110} rotate={-6} style={{ color: fwColors.white, borderColor: fwColors.white }}>
              ПОГНАЛИ!
            </Stamp>
          </div>
        </AbsoluteFill>
      )}
      <Flash amount={flash * 0.7} color={fwColors.loss} />
    </AbsoluteFill>
  );
};
