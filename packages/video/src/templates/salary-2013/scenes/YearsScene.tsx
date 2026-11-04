// Beat 2 — the years, silent. Four years, ONE frame each (author: «одним
// кадром на каждый год — всего 4 года»): 2014 · 2018 · 2022 · 2025.
// Every frame holds the whole story of its year at once:
//   year (odometer) · event line · leader card (clip + industry + ₽)
//   pile of packs — one per 10 000 ₽ on paper, the part prices ate in red
//   НА БУМАГЕ / В ЦЕНАХ 2013 · receipt tape with prices, dollar, oil.
// A glitch + shockwave cuts from year to year; 2025 holds to the end with
// the answer stamp РЕАЛЬНО +47% and DiCaprio beside the leader.
import React from "react";
import { Img, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../../theme";
import { useIn, usePunch } from "../../../reel";
import { colors, palette } from "../palette";
import { BrandBar, Chip, Flash, Glitch, SceneShell, Shockwave, Stamp } from "../ui";
import { Pack, NOTE_RATIO } from "../parts";
import { YRS } from "../timeline";
import { PACK_VALUE, YEARS, realSince2013 } from "../years";
import { YearExtras } from "./YearExtras";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const rub = (n: number) => `${Math.round(n).toLocaleString("ru-RU").replace(/\s/g, " ")} ₽`;
const WIDE = `${theme.fonts.wide}, ${theme.fonts.mono}`;

const YEAR_AT: readonly number[] = YRS.years;
const ROLL = 16; // frames a year change takes
const LAST = YEARS.length - 1;

const yearIndex = (frame: number) => YEAR_AT.reduce((acc, at, i) => (frame >= at ? i : acc), 0);

/** Eased value of a YEARS field at this frame. */
const useYearValue = (pick: (i: number) => number) => {
  const frame = useCurrentFrame();
  let v = pick(0);
  for (let i = 1; i < YEAR_AT.length; i += 1) {
    const p = interpolate(frame, [YEAR_AT[i], YEAR_AT[i] + ROLL], [0, 1], { easing: theme.ease.out, ...clamp });
    v = interpolate(p, [0, 1], [v, pick(i)]);
  }
  return v;
};

/* ---------------------------------------------------------- the year */

const YearOdometer: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const i = yearIndex(frame);
  const p = i === 0 ? 1 : spring({ frame: frame - YEAR_AT[i], fps, config: theme.spring.snappy });
  const rewind = frame < YRS.rewind + 6;
  const prev = i === 0 ? null : YEARS[i - 1].year;
  const style: React.CSSProperties = {
    position: "absolute",
    left: 0,
    top: 0,
    fontFamily: theme.fonts.wide,
    fontSize: 170,
    fontWeight: 900,
    letterSpacing: "-0.04em",
    lineHeight: 1,
    color: palette.text,
  };
  return (
    <div style={{ position: "absolute", left: 66, top: 236, width: 560, height: 180, overflow: "hidden" }}>
      {rewind ? (
        <div style={{ ...style, color: palette.textDim }}>{frame % 2 === 0 ? "2025" : "2019"}</div>
      ) : (
        <>
          {prev !== null && p < 1 && (
            <div style={{ ...style, transform: `translateY(${-p * 110}%)`, opacity: 1 - p }}>{prev}</div>
          )}
          <div style={{ ...style, transform: `translateY(${(1 - p) * 110}%)` }}>{YEARS[i].year}</div>
        </>
      )}
    </div>
  );
};

/** The year's event, one line under the year. */
const EventLine: React.FC = () => {
  const frame = useCurrentFrame();
  const i = yearIndex(frame);
  const ev = YEARS[i].event;
  const p = useIn(YEAR_AT[i] + 6, "snappy");
  if (!ev) return null;
  const bad = ev.tone === "bad";
  return (
    <div
      style={{
        position: "absolute",
        left: 66,
        top: 440,
        maxWidth: 560,
        padding: "12px 18px",
        background: bad ? colors.bad : colors.paper,
        color: bad ? colors.white : colors.ink,
        fontFamily: theme.fonts.mono,
        fontSize: 27,
        fontWeight: 800,
        letterSpacing: "0.04em",
        lineHeight: 1.25,
        opacity: Math.min(1, p * 1.6),
        transform: `translateX(${(1 - p) * -80}px) rotate(-1.5deg)`,
        boxShadow: bad ? `0 0 34px ${colors.badGlow}` : colors.paperShadow,
        zIndex: 25,
      }}
    >
      {ev.text}
    </div>
  );
};

/* ------------------------------------------------------- leader card */

const LeaderCard: React.FC = () => {
  const frame = useCurrentFrame();
  const i = yearIndex(frame);
  const ld = YEARS[i].leader;
  const p = useIn(YEAR_AT[i] + 4, "snappy");
  const num = useIn(YEAR_AT[i] + 12, "snappy");
  if (!ld) return null;
  const kb = interpolate(frame, [YEAR_AT[i], YEAR_AT[i] + 150], [1.05, 1.16], { easing: theme.ease.inOut, ...clamp });
  return (
    <div
      style={{
        position: "absolute",
        left: 650,
        top: 232,
        width: 370,
        zIndex: 20,
        opacity: Math.min(1, p * 1.6),
        transform: `rotate(${interpolate(p, [0, 1], [10, 3])}deg) scale(${interpolate(p, [0, 1], [1.3, 1])})`,
      }}
    >
      <div style={{ position: "relative", width: 370, height: 300, border: `7px solid ${colors.paper}`, overflow: "hidden", boxShadow: colors.shadow }}>
        {/* each year's clip starts at its own year, not at the scene start */}
        <Sequence key={ld.clip} from={YEAR_AT[i]} layout="none">
          <OffthreadVideo
            src={staticFile(`media/salary-2013/${ld.clip}.mp4`)}
            muted
            style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${kb})` }}
          />
        </Sequence>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(6,8,10,0) 40%, rgba(6,8,10,0.85) 100%)" }} />
        <div style={{ position: "absolute", left: 16, top: 14 }}>
          <Chip tone="neutral" size={20}>
            {`ЛИДЕР ${YEARS[i].year}`}
          </Chip>
        </div>
        <div
          style={{
            position: "absolute",
            left: 16,
            right: 12,
            bottom: 14,
            fontFamily: WIDE,
            fontSize: ld.who.length > 12 ? 30 : 40,
            whiteSpace: "pre-line",
            fontWeight: 900,
            letterSpacing: "-0.02em",
            color: palette.text,
            lineHeight: 1,
          }}
        >
          {ld.who}
        </div>
      </div>
      <div
        style={{
          display: "inline-block",
          marginTop: -10,
          marginLeft: 20,
          padding: "8px 16px",
          background: colors.paper,
          color: colors.ink,
          fontFamily: WIDE,
          fontSize: 46,
          fontWeight: 900,
          letterSpacing: "-0.02em",
          transform: `rotate(-4deg) scale(${interpolate(num, [0, 1], [1.5, 1])})`,
          opacity: Math.min(1, num * 1.6),
          boxShadow: colors.paperShadow,
          position: "relative",
        }}
      >
        {rub(ld.amount)}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------ the pile */

const PACK_W = 320;
const PACK_THICK = 14;
// Slots fill bottom-up, three to a row, each with its own small tilt — a pile,
// not a grid. Twelve slots carry the reel past 2025 (101 784 ₽ ≈ 10,2 packs).
const SLOTS = Array.from({ length: 12 }, (_, i) => {
  const row = Math.floor(i / 3);
  const col = i % 3;
  const jitter = Math.sin(i * 2.7) * 18;
  return {
    x: 215 + col * 320 + (row % 2 ? 26 : -10) + jitter,
    y: 1100 - row * 118,
    rot: Math.sin(i * 1.9) * 7,
  };
});

const PackPile: React.FC = () => {
  const frame = useCurrentFrame();
  const nominal = useYearValue((i) => YEARS[i].nominal) / PACK_VALUE;
  const real = useYearValue((i) => YEARS[i].real) / PACK_VALUE;
  return (
    <>
      {SLOTS.map((s, i) => {
        const fill = Math.min(1, Math.max(0, nominal - i));
        if (fill <= 0.001) return null;
        const land = Math.min(1, fill / 0.2);
        const thick = Math.max(2, Math.round(PACK_THICK * fill));
        const redFrom = Math.min(1, Math.max(0, real - i));
        const red = fill > redFrom ? (fill - redFrom) / fill : 0;
        const bob = Math.sin(frame / 26 + i * 1.3) * 4;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: s.x - PACK_W / 2,
              top: s.y - (PACK_W * NOTE_RATIO) / 2 + bob - (1 - land) * 260,
              transform: `rotate(${s.rot + (1 - land) * 18}deg) scale(${interpolate(land, [0, 1], [1.3, 1])})`,
              opacity: land,
              zIndex: i,
            }}
          >
            <Pack w={PACK_W} thick={thick} />
            {red > 0.01 && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: `${red * 100}%`,
                  height: PACK_W * NOTE_RATIO + thick * 2.4,
                  background: colors.bad,
                  mixBlendMode: "multiply",
                  opacity: 0.92,
                }}
              />
            )}
          </div>
        );
      })}
    </>
  );
};

/** «СЪЕЛИ ЦЕНЫ» — tagged to the top of the red packs. */
const EatenTag: React.FC = () => {
  const frame = useCurrentFrame();
  const nominal = useYearValue((i) => YEARS[i].nominal);
  const real = useYearValue((i) => YEARS[i].real);
  const eaten = nominal - real;
  if (eaten < 1500) return null;
  const top = Math.min(SLOTS.length - 1, Math.ceil(nominal / PACK_VALUE) - 1);
  const s = SLOTS[top];
  const p = Math.min(1, (eaten - 1500) / 1500);
  return (
    <div
      style={{
        position: "absolute",
        left: Math.min(s.x - 40, 640),
        top: s.y - 150 + Math.sin(frame / 14) * 4,
        zIndex: 15,
        opacity: p,
      }}
    >
      <Chip tone="bad" filled size={24}>
        {`СЪЕЛИ ЦЕНЫ · ${rub(eaten)}`}
      </Chip>
    </div>
  );
};

/* -------------------------------------------------------- the numbers */

const Readout: React.FC = () => {
  const nominal = useYearValue((i) => YEARS[i].nominal);
  const real = useYearValue((i) => YEARS[i].real);
  const label: React.CSSProperties = { fontFamily: theme.fonts.mono, fontSize: 28, fontWeight: 700, letterSpacing: "0.14em" };
  const big: React.CSSProperties = {
    fontFamily: WIDE,
    fontWeight: 900,
    letterSpacing: "-0.03em",
    fontVariantNumeric: "tabular-nums",
    whiteSpace: "nowrap",
    lineHeight: 1.05,
  };
  return (
    <div style={{ position: "absolute", left: 66, right: 66, top: 1250, display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
        <span style={{ ...label, color: palette.textDim }}>НА БУМАГЕ</span>
        <span style={{ ...big, fontSize: 104, color: palette.text }}>{rub(nominal)}</span>
      </div>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
        <span style={{ ...label, color: palette.primary }}>В ЦЕНАХ 2013</span>
        <span style={{ ...big, fontSize: 76, color: palette.primary }}>{rub(real)}</span>
      </div>
    </div>
  );
};

/** Thermal tape under the readout: the year's prices, dollar and oil. */
const Tape: React.FC = () => {
  const frame = useCurrentFrame();
  const i = yearIndex(frame);
  const reprint = interpolate(frame, [YEAR_AT[i], YEAR_AT[i] + 10], [0, 1], { easing: theme.ease.out, ...clamp });
  const slide = (frame * 2.2) % 420;
  const items = [...YEARS[i].tape, ...YEARS[i].tape, ...YEARS[i].tape];
  return (
    <div
      style={{
        position: "absolute",
        left: -20,
        right: -20,
        top: 1500,
        height: 74,
        background: colors.paper,
        transform: "rotate(-2deg)",
        boxShadow: colors.paperShadow,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 40,
          alignItems: "center",
          height: "100%",
          paddingLeft: 30,
          transform: `translateX(${-slide}px)`,
          clipPath: `inset(0 ${(1 - reprint) * 100}% 0 0)`,
          fontFamily: theme.fonts.mono,
          fontSize: 34,
          fontWeight: 800,
          letterSpacing: "0.06em",
          color: colors.ink,
          whiteSpace: "nowrap",
        }}
      >
        {items.map((t, k) => (
          <span key={k} style={{ display: "flex", alignItems: "center", gap: 40 }}>
            <span style={{ color: k % 3 === 0 ? colors.bad : colors.ink }}>{t}</span>
            <span style={{ color: colors.inkFaded }}>///</span>
          </span>
        ))}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------ finale */

const DICAPRIO = staticFile("images/salary-2013/dicaprio.png");

const DiCaprio: React.FC = () => {
  const frame = useCurrentFrame();
  const p = useIn(YRS.dicaprio, "bouncy");
  if (frame < YRS.dicaprio) return null;
  const sway = Math.sin(frame / 20) * 1.5;
  return (
    <div
      style={{
        position: "absolute",
        left: 24,
        top: 520,
        width: 290,
        height: 285,
        zIndex: 22,
        opacity: Math.min(1, p * 2),
        transform: `translateY(${(1 - p) * 260}px) rotate(${-6 + sway}deg)`,
        filter: "drop-shadow(0 24px 30px rgba(0,0,0,0.75))",
        maskImage: "linear-gradient(180deg, #000 80%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(180deg, #000 80%, transparent 100%)",
      }}
    >
      <Img src={DICAPRIO} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
    </div>
  );
};

/* ------------------------------------------------------------- scene */

export const YearsScene: React.FC<{ series: string; episode: string }> = ({ series, episode }) => {
  const frame = useCurrentFrame();
  const i = yearIndex(frame);
  // a glitch on the rewind and on every year cut
  const cutGlitch = YEAR_AT.reduce(
    (acc, at) => Math.max(acc, interpolate(frame, [at, at + 2, at + 9], [0, 0.85, 0], clamp)),
    interpolate(frame, [0, 3, 10], [1, 0.9, 0], clamp),
  );
  const hit = usePunch(YEAR_AT[i], 16);
  const stamp = usePunch(YRS.stamp, 18);
  const ev = YEARS[i].event;
  const total = realSince2013(LAST);
  return (
    <SceneShell exit={false} shake={hit.shake * 0.7 + stamp.shake}>
      <BrandBar series={series} episode={episode} delay={-20} />
      <Glitch amount={cutGlitch} style={{ position: "absolute", inset: 0 }}>
        <div style={{ position: "absolute", inset: 0 }}>
          <YearOdometer />
          <EventLine />
          <LeaderCard />
          <YearExtras key={i} i={i} at={YEAR_AT[i]} />
          <div style={{ position: "absolute", inset: 0, transform: `scale(${1 + hit.pop * 0.03})` }}>
            <PackPile />
            <EatenTag />
          </div>
          <Readout />
          <Tape />
        </div>
      </Glitch>
      <DiCaprio />

      {/* the answer: richer by this much, not ×3,4 */}
      {frame >= YRS.stamp && (
        <div style={{ position: "absolute", left: 96, top: 1090, zIndex: 40 }}>
          <Stamp delay={YRS.stamp} tone="hero" size={74} rotate={-7} style={{ fontFamily: WIDE }}>
            {`РЕАЛЬНО +${total}%`}
          </Stamp>
        </div>
      )}

      {i > 0 && <Shockwave key={i} at={YEAR_AT[i]} size={1300} color={ev?.tone === "bad" ? colors.bad : palette.primary} />}
      <Flash amount={hit.energy * 0.6} color={ev?.tone === "bad" ? colors.bad : palette.primary} />
      <Flash amount={stamp.energy * 0.8} />
    </SceneShell>
  );
};
