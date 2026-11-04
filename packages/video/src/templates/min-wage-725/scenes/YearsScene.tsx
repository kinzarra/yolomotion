// Beat 2 — the years, silent. The same seven $1 notes and coins, re-paid
// every year in 2009 dollars (BLS CPI-U): the cash on the table is always
// exactly what one hour of minimum wage buys, to the cent.
//   year odometer + this year's loss (red) · event card with a clip
//   cascade of $1 notes — a note flies off when the value drops below it
//   coin row — the change, rebuilt every year with the fewest coins
//   WORTH IN 2009 DOLLARS: lime counter · ON YOUR PAY STUB: $7.25
// 2026 holds to the end: $4.63 and the stamp −36%.
import React from "react";
import { OffthreadVideo, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../../theme";
import { useIn, usePunch } from "../../../reel";
import { colors, palette } from "../palette";
import { Bill, BILL_RATIO, BrandBar, Chip, Coin, Flash, Glitch, SceneShell, Shockwave, Stamp } from "../ui";
import { BILL_W, SLOT0, SLOTS, STEP } from "../parts";
import { YRS } from "../timeline";
import { CENTS, FINAL_DROP, YEARS, cash, usd, yearlyChange } from "../years";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const WIDE = `${theme.fonts.wide}, ${theme.fonts.mono}`;

const YEAR_AT: readonly number[] = YRS.years;
const LAST = YEARS.length - 1;
const ROLL = 10; // frames a year change takes

const yearIndex = (frame: number) => YEAR_AT.reduce((acc, at, i) => (frame >= at ? i : acc), 0);

/** The value in cents at this frame, rolling from year to year. */
const useCents = () => {
  const frame = useCurrentFrame();
  let v = CENTS[0];
  for (let i = 1; i < YEAR_AT.length; i += 1) {
    const p = interpolate(frame, [YEAR_AT[i], YEAR_AT[i] + ROLL], [0, 1], { easing: theme.ease.out, ...clamp });
    v = interpolate(p, [0, 1], [v, CENTS[i]]);
  }
  return Math.round(v);
};

const NEVER = 1e6; // a frame no scene reaches (interpolate needs finite ranges)

/** Frame at which the cash first holds `n` or fewer notes (NEVER if it never does). */
const notesDropAt = (n: number) => {
  const i = CENTS.findIndex((c) => cash(c).bills <= n);
  return i < 0 ? NEVER : YEAR_AT[i];
};

/* ------------------------------------------------------------ the year */

const YearOdometer: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const i = yearIndex(frame);
  const p = i === 0 ? 1 : spring({ frame: frame - YEAR_AT[i], fps, config: theme.spring.snappy });
  const rewind = frame < 6; // glitch back from the hook's 2026
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
    fontVariantNumeric: "tabular-nums",
  };
  return (
    <div style={{ position: "absolute", left: 66, top: 236, width: 560, height: 180, overflow: "hidden" }}>
      {rewind ? (
        <div style={{ ...style, color: palette.textDim }}>{frame % 2 === 0 ? "2026" : "2017"}</div>
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

/** Under the year: how much of the hour this year ate. */
const YearChange: React.FC = () => {
  const frame = useCurrentFrame();
  const i = yearIndex(frame);
  const label = YEARS[i].label;
  const ch = yearlyChange(i);
  return (
    <div key={i} style={{ position: "absolute", left: 66, top: 432 }}>
      {label ? (
        <Chip delay={YEAR_AT[i] + 3} tone="paper" size={28}>
          {label}
        </Chip>
      ) : i === 0 ? (
        <Chip delay={-20} tone="paper" size={28}>
          JULY 2009 · $7.25 / HR
        </Chip>
      ) : (
        <Chip delay={YEAR_AT[i] + 3} tone="bad" size={28}>
          {`${ch.toFixed(1).replace("-", "−")}% THIS YEAR`}
        </Chip>
      )}
    </div>
  );
};

/* ------------------------------------------------------ the event card */

const EventCard: React.FC = () => {
  const frame = useCurrentFrame();
  const i = yearIndex(frame);
  const ev = YEARS[i].event;
  const p = useIn(YEAR_AT[i] + 4, "snappy");
  if (!ev) return null;
  const end = i < LAST ? YEAR_AT[i + 1] : NEVER;
  const out = interpolate(frame, [end - 6, end], [0, 1], { easing: theme.ease.in, ...clamp });
  const kb = interpolate(frame, [YEAR_AT[i], YEAR_AT[i] + 60], [1.04, 1.14], { easing: theme.ease.inOut, ...clamp });
  return (
    <div
      style={{
        position: "absolute",
        left: 640,
        top: 220,
        width: 380,
        zIndex: 40,
        opacity: Math.min(1, p * 1.6) * (1 - out),
        transform: `rotate(${interpolate(p, [0, 1], [10, 3])}deg) scale(${interpolate(p, [0, 1], [1.3, 1]) - out * 0.1})`,
      }}
    >
      <div
        style={{
          position: "relative",
          width: 380,
          height: 300,
          border: `7px solid ${colors.paper}`,
          overflow: "hidden",
          boxShadow: colors.shadow,
        }}
      >
        <OffthreadVideo
          key={ev.clip}
          src={staticFile(`media/min-wage-725/${ev.clip}.mp4`)}
          muted
          style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${kb})` }}
        />
      </div>
      <div
        style={{
          background: colors.paper,
          color: colors.ink,
          padding: "14px 18px 12px",
          boxShadow: colors.paperShadow,
        }}
      >
        <div style={{ fontFamily: WIDE, fontSize: 30, fontWeight: 900, lineHeight: 1.1, letterSpacing: "-0.01em" }}>
          {ev.title}
        </div>
        <div
          style={{
            fontFamily: theme.fonts.mono,
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: "0.12em",
            color: colors.inkFaded,
            marginTop: 6,
          }}
        >
          {ev.sub}
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------ the cash */

const Notes: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      {SLOTS.map((slot, i) => {
        // note i (0-based) leaves when the cash drops to i notes
        const leave = notesDropAt(i);
        const t = interpolate(frame, [leave, leave + 16], [0, 1], { easing: theme.ease.in, ...clamp });
        if (t >= 1) return null;
        const burn = interpolate(frame, [leave, leave + 4], [0, 0.55], clamp);
        const breathe = Math.sin(frame / 26 + i * 0.9) * 0.4;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: slot.x + t * 520,
              top: slot.y - t * 260,
              zIndex: i,
              opacity: 1 - t * t,
              transform: `rotate(${slot.rot + breathe + t * 38}deg) scale(${1 - t * 0.25})`,
            }}
          >
            <Bill w={BILL_W} tint={burn} />
          </div>
        );
      })}
    </>
  );
};

const QUARTER_PX = 140;
// the coin row sits just under the last note left on the table
const NOTE_H = Math.round(BILL_W * BILL_RATIO);
const coinY = (notes: number) => SLOT0.y + (notes - 1) * STEP + NOTE_H + 26;

const CoinRow: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const i = yearIndex(frame);
  const coins = cash(CENTS[i]).coins;
  const at = i === 0 ? -30 : YEAR_AT[i] + 2;
  const notes = cash(CENTS[i]).bills;
  const before = i === 0 ? notes : cash(CENTS[i - 1]).bills;
  const slide = interpolate(frame, [at + 6, at + 22], [0, 1], { easing: theme.ease.inOut, ...clamp });
  const top = interpolate(slide, [0, 1], [coinY(before), coinY(notes)]);
  let x = 0;
  const placed = coins.map((kind) => {
    const d = { quarter: 140, dime: 103, nickel: 122, penny: 110 }[kind] * (QUARTER_PX / 140);
    const left = x;
    x += d * 0.82;
    return { kind, left, d };
  });
  const width = x + (placed.length ? placed[placed.length - 1].d * 0.18 : 0);
  return (
    <div key={i} style={{ position: "absolute", left: 540 - width / 2, top, height: QUARTER_PX, zIndex: 10 }}>
      {placed.map((c, k) => {
        const p = spring({ frame: frame - at - k * 2, fps, config: theme.spring.bouncy });
        return (
          <div
            key={k}
            style={{
              position: "absolute",
              left: c.left,
              top: QUARTER_PX - c.d + Math.sin(frame / 18 + k) * 2,
              opacity: Math.min(1, p * 2),
              transform: `translateY(${(1 - p) * -60}px) rotate(${(1 - p) * -90 + (k % 2 ? 8 : -6)}deg) scale(${interpolate(p, [0, 1], [1.3, 1])})`,
            }}
          >
            <Coin kind={c.kind} quarterPx={QUARTER_PX} />
          </div>
        );
      })}
    </div>
  );
};

/* ------------------------------------------------------- the value */

const Value: React.FC = () => {
  const frame = useCurrentFrame();
  const cents = useCents();
  const i = yearIndex(frame);
  const tick = usePunch(i === 0 ? -100 : YEAR_AT[i], 12);
  const final = usePunch(YEAR_AT[LAST], 18);
  return (
    <div style={{ position: "absolute", left: 66, right: 66, top: 1400, zIndex: 30 }}>
      <div
        style={{
          fontFamily: theme.fonts.mono,
          fontSize: 26,
          fontWeight: 700,
          letterSpacing: "0.14em",
          color: palette.textDim,
        }}
      >
        ONE HOUR · WORTH IN 2009 DOLLARS
      </div>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
        <div
          style={{
            fontFamily: WIDE,
            fontSize: 150,
            fontWeight: 900,
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
            color: palette.primary,
            textShadow: `0 0 40px ${palette.glow}`,
            fontVariantNumeric: "tabular-nums",
            transform: `scale(${1 + tick.pop * 0.06 + final.pop * 0.14})`,
            transformOrigin: "left center",
          }}
        >
          {usd(cents)}
        </div>
        <div
          style={{
            fontFamily: theme.fonts.mono,
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: "0.08em",
            color: palette.textDim,
            textAlign: "right",
            lineHeight: 1.3,
          }}
        >
          PAY STUB
          <br />
          <span style={{ color: palette.text, fontSize: 40, fontWeight: 800 }}>$7.25</span>
        </div>
      </div>
    </div>
  );
};

const FinalStamp: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < YRS.stamp) return null;
  return (
    <div style={{ position: "absolute", right: 60, top: 640, zIndex: 50 }}>
      <Stamp delay={YRS.stamp} size={120} rotate={-8}>
        {`−${FINAL_DROP}%`}
      </Stamp>
    </div>
  );
};

/* ---------------------------------------------------------------- scene */

export const YearsScene: React.FC<{ series: string; episode: string }> = ({ series, episode }) => {
  const frame = useCurrentFrame();
  const i = yearIndex(frame);
  const yearHit = usePunch(i === 0 ? -100 : YEAR_AT[i], 10);
  const eventFlash = usePunchSafe(YEAR_AT[i]);
  const event = YEARS[i].event ? eventFlash : 0;
  const stamp = usePunch(YRS.stamp, 18);
  const glitch =
    interpolate(frame, [0, 2, 8], [0.9, 0.9, 0], clamp) +
    (i > 0 ? interpolate(frame, [YEAR_AT[i], YEAR_AT[i] + 2, YEAR_AT[i] + 6], [0, 0.35, 0], clamp) : 0);
  return (
    <SceneShell exit={false} shake={yearHit.shake * 0.25 + stamp.shake}>
      <BrandBar series={series} episode={episode} delay={-20} />
      <YearOdometer />
      <YearChange />
      <EventCard />
      <Glitch amount={glitch} style={{ position: "absolute", inset: 0 }}>
        <div style={{ position: "absolute", inset: 0 }}>
          <Notes />
          <CoinRow />
        </div>
      </Glitch>
      <Value />
      <FinalStamp />
      <Shockwave at={YRS.stamp} color={colors.bad} />
      <Flash amount={event * 0.5} color={colors.bad} />
      <Flash amount={stamp.energy} color={colors.bad} />
    </SceneShell>
  );
};

/** A red flash on an event year — energy only, no hooks inside conditionals. */
const usePunchSafe = (at: number) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [at, at + 14], [0, 1], { easing: theme.ease.out, ...clamp });
  return frame < at ? 0 : (1 - t) * (1 - t);
};
