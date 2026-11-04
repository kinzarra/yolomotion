// Beat 2 — the years, silent. One frame per year: 1992 · 1993 · 1995 · 1998 ·
// СЕГОДНЯ. The object is the money on the book: a 10 × 10 grid of 100-ruble
// notes that melts to what the deposit is worth in 1991 rubles, the book
// itself top-right with its balance. A glitch + shockwave cuts from year to
// year; the last frame brings today's 30 000 ₽ in and the stamp −95%.
import React from "react";
import { Img, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../../theme";
import { useIn, usePunch, useRamp } from "../../../reel";
import { colors, palette } from "../palette";
import { BrandBar, Chip, Flash, Glitch, SceneShell, Shockwave, Stamp } from "../ui";
import { Book, Note, NOTE5000, NOTE5000_RATIO, NOTE_RATIO } from "../parts";
import { YRS } from "../timeline";
import { LAST, LOSS_PCT, NEED_NOTES, NEED_SHOWN, NOTE_VALUE, NOTES_TOTAL, RETURNED, YEARS } from "../years";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const num = (n: number) => Math.round(n).toLocaleString("ru-RU").replace(/\s/g, " ");
const WIDE = `${theme.fonts.wide}, ${theme.fonts.mono}`;

const YEAR_AT: readonly number[] = YRS.years;
const ROLL = 16; // frames a year change takes

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
  const prev = i === 0 ? null : YEARS[i - 1].label;
  const style = (label: string): React.CSSProperties => ({
    position: "absolute",
    left: 0,
    top: 0,
    fontFamily: theme.fonts.wide,
    fontSize: label.length > 4 ? 96 : 170,
    fontWeight: 900,
    letterSpacing: "-0.04em",
    lineHeight: label.length > 4 ? 1.75 : 1,
    color: palette.text,
  });
  return (
    <div style={{ position: "absolute", left: 66, top: 236, width: 560, height: 180, overflow: "hidden" }}>
      {rewind ? (
        <div style={{ ...style("1991"), color: palette.textDim }}>{frame % 2 === 0 ? "1991" : "19__"}</div>
      ) : (
        <>
          {prev !== null && p < 1 && (
            <div style={{ ...style(prev), transform: `translateY(${-p * 110}%)`, opacity: 1 - p }}>{prev}</div>
          )}
          <div style={{ ...style(YEARS[i].label), transform: `translateY(${(1 - p) * 110}%)` }}>
            {i === LAST
              ? // the jump in time is shown, not implied: the year counts up to today
                String(Math.round(interpolate(frame, [YEAR_AT[LAST] + 6, YEAR_AT[LAST] + 36], [1998, 2026], { easing: theme.ease.out, ...clamp })))
              : YEARS[i].label}
          </div>
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

/* ------------------------------------------------------- the book card */

const BookCard: React.FC = () => {
  const frame = useCurrentFrame();
  const i = yearIndex(frame);
  const p = useIn(-20, "snappy");
  const reprint = usePunch(YEAR_AT[i] + 10, 14);
  const denominated = YEARS[i].year >= 1998 && YEARS[i].year < 2026;
  const sway = Math.sin(frame / 32) * 1.2;
  return (
    <div
      style={{
        position: "absolute",
        left: 650,
        top: 232,
        zIndex: 20,
        opacity: Math.min(1, p * 1.6),
        transform: `rotate(${3 + sway}deg) scale(${interpolate(p, [0, 1], [1.3, 1])})`,
      }}
    >
      <Book w={370} h={300}>
        <div style={{ position: "absolute", left: 16, top: 14 }}>
          <Chip tone="neutral" size={20}>
            НА КНИЖКЕ
          </Chip>
        </div>
        <div
          style={{
            position: "absolute",
            left: 16,
            right: 12,
            bottom: 18,
            fontFamily: WIDE,
            fontSize: YEARS[i].onBook.length > 10 ? 40 : 54,
            fontWeight: 900,
            letterSpacing: "-0.02em",
            color: colors.ink,
            lineHeight: 1,
            transform: `scale(${1 + reprint.pop * 0.12})`,
            transformOrigin: "left bottom",
          }}
        >
          {YEARS[i].onBook}
        </div>
        {denominated && (
          <div style={{ position: "absolute", left: 40, top: 66 }}>
            <Stamp delay={YEAR_AT[i] + 8} tone="bad" size={42} rotate={-10} style={{ fontFamily: WIDE }}>
              −3 НУЛЯ
            </Stamp>
          </div>
        )}
      </Book>
    </div>
  );
};

/* ------------------------------------------------------------ the grid */

const COLS = 10;
const NOTE_W = 92;
const NOTE_H = Math.round(NOTE_W * NOTE_RATIO);
const GRID_X = 50;
const GRID_Y = 660;
const STEP_X = 98;
const STEP_Y = 52;
const FLY = 14; // frames a note takes to leave
const STAGGER = 0.4; // frames between two leaving notes

/** Notes alive at year i: whole count + the fraction of the last one. */
const aliveAt = (i: number) => YEARS[i].real / NOTE_VALUE;

const NotesGrid: React.FC = () => {
  const frame = useCurrentFrame();
  const i = yearIndex(frame);
  // fill bottom-up so the pile reads as a pile; k = 0 is bottom-left
  return (
    <>
      {Array.from({ length: NOTES_TOTAL }, (_, k) => {
        const row = Math.floor(k / COLS);
        const col = k % COLS;
        const x = GRID_X + col * STEP_X;
        const y = GRID_Y + (COLS - 1 - row) * STEP_Y;
        // the year this note leaves in
        let leaveYear = -1;
        for (let j = 1; j < YEARS.length; j += 1) {
          if (aliveAt(j) <= k) {
            leaveYear = j;
            break;
          }
        }
        const alive = aliveAt(i);
        let frac = 1;
        if (k >= Math.ceil(alive)) frac = 0;
        else if (k + 1 > alive) frac = alive - k;
        if (leaveYear !== -1 && i >= leaveYear) {
          // leaving: fly off from its year's cut, staggered by position
          const at = YEAR_AT[leaveYear] + (k - Math.floor(aliveAt(leaveYear))) * STAGGER + 4;
          const t = interpolate(frame, [at, at + FLY], [0, 1], { easing: theme.ease.in, ...clamp });
          if (t >= 1) return null;
          const prevFrac = leaveYear > 1 && k + 1 > aliveAt(leaveYear - 1) ? aliveAt(leaveYear - 1) - k : 1;
          return (
            <div
              key={k}
              style={{
                position: "absolute",
                left: x,
                top: y - t * 320,
                transform: `translateX(${t * 160}px) rotate(${t * 40 - 4}deg) scale(${1 - t * 0.3})`,
                opacity: 1 - t,
                zIndex: 10 + row,
              }}
            >
              <Note w={NOTE_W} frac={prevFrac} />
            </div>
          );
        }
        if (frac <= 0.004) return null;
        if (k === 0 && i >= 2) return null; // from 1993 the last note is LastNote, centre stage
        const bob = Math.sin(frame / 26 + k * 0.7) * 2;
        // the torn one tears down between years
        const tear = (() => {
          if (frac >= 1 || i === 0) return frac;
          const prev = Math.min(1, Math.max(0, aliveAt(i - 1) - k));
          const p = interpolate(frame, [YEAR_AT[i] + 6, YEAR_AT[i] + 6 + FLY], [0, 1], { easing: theme.ease.out, ...clamp });
          return interpolate(p, [0, 1], [prev, frac]);
        })();
        return (
          <div key={k} style={{ position: "absolute", left: x, top: y + bob, transform: "rotate(-4deg)", zIndex: 10 + row }}>
            <Note w={NOTE_W} frac={tear} />
          </div>
        );
      })}
    </>
  );
};

/**
 * From 1993 the one note that is left comes out of the grid to centre stage
 * and is torn down year by year to what the deposit still buys; the red
 * ghost behind it is the part prices ate. It leaves on СЕГОДНЯ.
 */
const LAST_W = 760;
const LAST_X = 160;
const LAST_Y = 790;

const LastNote: React.FC = () => {
  const frame = useCurrentFrame();
  const i = yearIndex(frame);
  const at = YEAR_AT[2];
  const p = useIn(at, "smooth");
  const out = useRamp(YEAR_AT[LAST], YEAR_AT[LAST] + 12, theme.ease.in);
  if (frame < at || out >= 1) return null;
  const w = interpolate(p, [0, 1], [NOTE_W, LAST_W]);
  const h = Math.round(w * NOTE_RATIO);
  const x = interpolate(p, [0, 1], [GRID_X, LAST_X]);
  const y = interpolate(p, [0, 1], [GRID_Y + (COLS - 1) * STEP_Y, LAST_Y]);
  // tear it down at every year from 1993 on
  let frac = 1;
  for (let j = 2; j <= Math.min(i, LAST - 1); j += 1) {
    const t = interpolate(frame, [YEAR_AT[j] + 12, YEAR_AT[j] + 34], [0, 1], { easing: theme.ease.inOut, ...clamp });
    frac = interpolate(t, [0, 1], [frac, aliveAt(j)]);
  }
  const bob = Math.sin(frame / 28) * 3;
  const tilt = -3 + Math.sin(frame / 40) * 0.8;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y + bob - out * 300,
        width: w,
        height: h,
        transform: `rotate(${tilt + out * 30}deg)`,
        opacity: 1 - out,
        zIndex: 14,
      }}
    >
      {/* the ghost of the whole note */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          border: `3px dashed ${colors.bad}`,
          background: `rgba(255, 59, 59, ${0.1 + (1 - frac) * 0.16})`,
          borderRadius: 8,
          opacity: p,
        }}
      />
      <Note w={w} frac={frac} />
      {frac < 1 && (
        <div
          style={{
            position: "absolute",
            left: `${Math.min(frac * 100 + 4, 52)}%`,
            top: "50%",
            transform: "translateY(-50%)",
            fontFamily: theme.fonts.mono,
            fontSize: 30,
            fontWeight: 800,
            letterSpacing: "0.12em",
            color: colors.bad,
            whiteSpace: "nowrap",
            opacity: p,
          }}
        >
          {`СЪЕЛИ ЦЕНЫ · ${Math.round((1 - frac) * 100)}%`}
        </div>
      )}
      <div style={{ position: "absolute", left: 0, top: h + 18, opacity: p }}>
        <Chip tone="paper" size={24} delay={at + 16}>
          ПОСЛЕДНЯЯ КУПЮРА ИЗ СТА
        </Chip>
      </div>
    </div>
  );
};

/* --------------------------------------------- today: 6 notes of 126 */

// The wall of 5 000 ₽ notes the deposit is worth today (629 000 ₽ = 126
// notes), 14 × 9. The six that the state returns sit in its bottom-left.
const GHOST_COLS = 12;
const GHOST_ROWS = Math.ceil(NEED_NOTES / GHOST_COLS); // 11, the top row half full
const GHOST_W = 78;
const GHOST_H = Math.round(GHOST_W * NOTE5000_RATIO);
const GHOST_X = 48;
const GHOST_Y = 640;
const GHOST_SX = 82;
const GHOST_SY = 40;
const ghostSlot = (k: number) => {
  const row = Math.floor(k / GHOST_COLS);
  const col = k % GHOST_COLS;
  return { x: GHOST_X + col * GHOST_SX, y: GHOST_Y + (GHOST_ROWS - 1 - row) * GHOST_SY };
};
const RETURNED_NOTES = RETURNED / 5000;

/** Today's money: six 5 000 ₽ notes fly in big — ВЕРНУТ 30 000 ₽ — then
 * shrink into their six slots of the wall they should have been. */
const Returned: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = YEAR_AT[LAST] + 6;
  if (frame < at) return null;
  const W = 300;
  const H = Math.round(W * NOTE5000_RATIO);
  const shrink = interpolate(frame, [YRS.ghost, YRS.ghost + 18], [0, 1], { easing: theme.ease.inOut, ...clamp });
  return (
    <>
      {Array.from({ length: RETURNED_NOTES }, (_, k) => {
        // not a hook: the count of hooks must not change between frames
        const p = spring({ frame: frame - at - k * 5, fps, config: theme.spring.bouncy });
        const col = k % 3;
        const row = Math.floor(k / 3);
        const bigX = 90 + col * 318;
        const bigY = 700 + row * (H + 46);
        const slot = ghostSlot(k);
        const x = interpolate(shrink, [0, 1], [bigX, slot.x]);
        const y = interpolate(shrink, [0, 1], [bigY, slot.y]);
        const w = interpolate(shrink, [0, 1], [W, GHOST_W]);
        const rot = interpolate(shrink, [0, 1], [k % 2 ? 3 : -4, 0]);
        const bob = Math.sin(frame / 24 + k) * 3 * (1 - shrink);
        return (
          <div
            key={k}
            style={{
              position: "absolute",
              left: x,
              top: interpolate(p, [0, 1], [y + 300, y]) + bob,
              transform: `rotate(${rot + (1 - p) * 20}deg) scale(${interpolate(p, [0, 1], [0.6, 1])})`,
              opacity: Math.min(1, p * 2),
              zIndex: 12 + k,
            }}
          >
            <Note w={w} src={NOTE5000} ratio={NOTE5000_RATIO} />
          </div>
        );
      })}
    </>
  );
};

/** The other 120 notes: grey, dashed — what should be there and is not. */
const GhostGrid: React.FC = () => {
  const frame = useCurrentFrame();
  const at = YRS.ghost;
  if (frame < at) return null;
  return (
    <>
      {Array.from({ length: NEED_NOTES }, (_, k) => {
        if (k < RETURNED_NOTES) return null; // the real six sit here
        const t = interpolate(frame, [at + k * 0.3, at + k * 0.3 + 10], [0, 1], { easing: theme.ease.out, ...clamp });
        if (t <= 0) return null;
        const s = ghostSlot(k);
        return (
          <div
            key={k}
            style={{
              position: "absolute",
              left: s.x,
              top: s.y,
              width: GHOST_W,
              height: GHOST_H,
              opacity: t * 0.6,
              transform: `scale(${0.6 + 0.4 * t})`,
              border: `2px dashed ${palette.textDim}`,
              borderRadius: 3,
              overflow: "hidden",
              zIndex: 11,
            }}
          >
            <Img src={NOTE5000} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(1)", opacity: 0.6 }} />
          </div>
        );
      })}
    </>
  );
};

/** The red chip over the pile: prices since 1991. */
const PricesChip: React.FC = () => {
  const frame = useCurrentFrame();
  const i = yearIndex(frame);
  const today = i === LAST;
  const text = today ? `ДОЛЖНО БЫТЬ ${NEED_NOTES} КУПЮР = ${num(NEED_SHOWN)} ₽` : YEARS[i].chip;
  const at = today ? YRS.ghost + 16 : YEAR_AT[i] + 12;
  if (!text || frame < at) return null;
  return (
    <div style={{ position: "absolute", left: 66, top: today ? 576 : 592, zIndex: 15, transform: `translateY(${Math.sin(frame / 14) * 3}px)` }}>
      <Chip tone={today ? "paper" : "bad"} filled={!today} size={24} delay={at}>
        {text}
      </Chip>
    </div>
  );
};

/* -------------------------------------------------------- the evidence */

const EvidenceClip: React.FC = () => {
  const frame = useCurrentFrame();
  const i = yearIndex(frame);
  const clip = YEARS[i].clip;
  const at = YEAR_AT[i] + 8;
  const end = at + YRS.clipLife;
  const p = useIn(at, "bouncy");
  const out = useRamp(end - 8, end, theme.ease.in);
  if (!clip || frame < at || frame >= end) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 650,
        top: 880,
        width: 370,
        height: 270,
        border: `7px solid ${colors.paper}`,
        boxShadow: colors.shadow,
        overflow: "hidden",
        zIndex: 30,
        opacity: Math.min(1, p * 1.6) * (1 - out),
        transform: `rotate(${interpolate(p, [0, 1], [10, 3])}deg) scale(${interpolate(p, [0, 1], [1.3, 1]) * (1 - out * 0.2)})`,
      }}
    >
      <Sequence key={clip} from={at} layout="none">
        <OffthreadVideo src={staticFile(`media/sberbook-1991/${clip}.mp4`)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </Sequence>
      <div style={{ position: "absolute", left: 14, top: 12 }}>
        <Chip tone="neutral" size={20}>
          {YEARS[i].label}
        </Chip>
      </div>
    </div>
  );
};

/* -------------------------------------------------------- the numbers */

const Readout: React.FC = () => {
  const frame = useCurrentFrame();
  const i = yearIndex(frame);
  const real = useYearValue((j) => (j === LAST ? YEARS[LAST - 1].real : YEARS[j].real));
  const today = i === LAST;
  const swap = useIn(YEAR_AT[LAST] + 4, "snappy");
  const ghost = frame >= YRS.ghost;
  const swap2 = useIn(YRS.ghost, "snappy");
  const label: React.CSSProperties = { fontFamily: theme.fonts.mono, fontSize: 28, fontWeight: 700, letterSpacing: "0.14em" };
  const big: React.CSSProperties = {
    fontFamily: WIDE,
    fontWeight: 900,
    letterSpacing: "-0.03em",
    fontVariantNumeric: "tabular-nums",
    whiteSpace: "nowrap",
    lineHeight: 1.05,
  };
  const realText = real >= 10 ? `${num(real)} РУБ.` : `${real.toFixed(1).replace(".", ",")} РУБ.`;
  return (
    <div style={{ position: "absolute", left: 66, right: 66, top: 1250, display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
        <span style={{ ...label, color: palette.primary }}>{today ? "ВЕРНУТ РОДИТЕЛЯМ" : "В ЦЕНАХ 1991"}</span>
        <span
          style={{
            ...big,
            fontSize: 104,
            color: palette.primary,
            transform: today ? `scale(${interpolate(swap, [0, 1], [1.3, 1])})` : undefined,
            transformOrigin: "right center",
          }}
        >
          {today ? `${num(RETURNED)} ₽` : realText}
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
        <span style={{ ...label, color: palette.textDim }}>{today ? (ghost ? "ТЕ 10 000 РУБ. В ЦЕНАХ 2026" : "НА КНИЖКЕ") : "НА КНИЖКЕ"}</span>
        <span
          style={{
            ...big,
            fontSize: 64,
            color: palette.textDim,
            transform: today && ghost ? `scale(${interpolate(swap2, [0, 1], [1.25, 1])})` : undefined,
            transformOrigin: "right center",
          }}
        >
          {today ? (ghost ? `${num(NEED_SHOWN)} ₽` : "10 000 × 3") : YEARS[i].onBook}
        </span>
      </div>
    </div>
  );
};

/** Thermal tape under the readout. */
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

/* ------------------------------------------------------------- scene */

export const YearsScene: React.FC<{ series: string; episode: string }> = ({ series, episode }) => {
  const frame = useCurrentFrame();
  const i = yearIndex(frame);
  const cutGlitch = YEAR_AT.reduce(
    (acc, at, j) => (j === 0 ? acc : Math.max(acc, interpolate(frame, [at, at + 2, at + 9], [0, 0.85, 0], clamp))),
    interpolate(frame, [0, 3, 10], [1, 0.9, 0], clamp),
  );
  const hit = usePunch(YEAR_AT[i], 16);
  const stamp = usePunch(YRS.stamp, 18);
  const ev = YEARS[i].event;
  const badCut = ev?.tone === "bad";
  return (
    <SceneShell exit={false} shake={hit.shake * 0.7 + stamp.shake}>
      <BrandBar series={series} episode={episode} delay={-20} />
      <Glitch amount={cutGlitch} style={{ position: "absolute", inset: 0 }}>
        <div style={{ position: "absolute", inset: 0 }}>
          <YearOdometer />
          <EventLine />
          <BookCard />
          <PricesChip />
          <div style={{ position: "absolute", inset: 0, transform: `scale(${1 + hit.pop * 0.03})` }}>
            <NotesGrid />
            <LastNote />
            <GhostGrid />
            <Returned />
          </div>
          <EvidenceClip />
          <Readout />
          <Tape />
        </div>
      </Glitch>

      {/* the answer: what the state gives back against what the money was */}
      {frame >= YRS.stamp && (
        <div style={{ position: "absolute", left: 96, top: 1096, zIndex: 40 }}>
          <Stamp delay={YRS.stamp} tone="bad" size={70} rotate={-7} style={{ fontFamily: WIDE }}>
            {`ПОТЕРЯНО ${LOSS_PCT}%`}
          </Stamp>
        </div>
      )}

      {i > 0 && <Shockwave key={i} at={YEAR_AT[i]} size={1300} color={badCut ? colors.bad : palette.primary} />}
      <Flash amount={hit.energy * 0.6} color={badCut ? colors.bad : palette.primary} />
      <Flash amount={stamp.energy * 0.8} color={colors.bad} />
    </SceneShell>
  );
};
