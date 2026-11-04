// The whole reel is one running street: the sim drives the cartoon, the game
// overlays ride on top, the editor types the sim's own source underneath.
// Reel time t maps to sim time T through timeline.simTime (fast-forward).
import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../../theme";
import { CLIENTS, clientX, cash, COUNTER_X, GAP, DELIVERY, DOG, DOG_VICTIM, HIRE_COST, MAX_LINE, paidAt, PRICE, queue, RUSH, serving, sold, START, TIP } from "../sim";
import { sfColors as colors, sfPalette as palette, toon } from "../palette";
import { Courier, Dog, Kind, Kiosk, lookFor, MetroSign, Person, Seller, Street } from "../toon";
import { clamp, Coin, Flash, CoinFly, CODE, CODE_TOTAL, Editor, fmt, HudPill, PayPop, PersonIcon, springAt, SPLIT, WIDE, WrapIcon, X0, X1 } from "../ui";
import { Caption, CostPop, EventPop, HookFace, FastForward, Finale, HookTitle, LostPop, PaybackStamp, RushBanner, UpgradeCard } from "../overlays";
import { BEAT, ffAmount, simTime, TYPE, VO_RATE } from "../timeline";
import { DURATIONS } from "../durations";

const GROUND = 980; // pavement starts
const FEET = 1072; // the queue's lane
const KIOSK_X = 560;
const KIOSK_Y = GROUND - 420;
const CASH_PILL: [number, number] = [X0 + 60, 156];
const SERVED = CLIENTS.filter((c) => !c.left);
/** The client at the window when the tip lands is drawn as a granny. */
const TIPPER = SERVED.find((c) => c.start <= TIP.at && TIP.at < c.end + 0.45) ?? SERVED[0];
const DOG_MEET = clientX(DOG_VICTIM, DOG) ?? 800;
/** Reel second the courier rolls past the window (DELIVERY.at in sim time). */
const COURIER_AT = 19.4;

/** In-game clock: 2 minutes per sim second, 18:00 lands on the rush. */
const clockAt = (T: number) => {
  const m = Math.floor(18 * 60 + (T - RUSH) * 2);
  return `${Math.floor(m / 60)}:${String(m % 60).padStart(2, "0")}`;
};

/** Reel second when the cash first climbs back above its pre-hire level. */
const PAYBACK = (() => {
  const before = cash(simTime(BEAT.hire) - 0.01);
  for (let t = BEAT.hire + 0.5; t < 30; t += 1 / 30) if (cash(simTime(t)) >= before) return t;
  return null;
})();

/**
 * Passers-by, cast by hand so the street is mixed: mums with kids, grannies
 * with a cane, bearded men, women with bags. Front lane passes in front of the
 * queue, back lane behind it. at0 = where the walker is on frame 0 (the cover).
 */
type Walker = { seed: number; kind: Kind; dir: 1 | -1; speed: number; at0: number; lane: "front" | "back"; phone?: boolean; kid?: boolean; beard?: boolean };
const WALKERS: Walker[] = [
  { seed: 201, kind: "woman", dir: 1, speed: 125, at0: 1000, lane: "front", kid: true },
  { seed: 202, kind: "granny", dir: -1, speed: 70, at0: 300, lane: "front" },
  { seed: 205, kind: "man", dir: -1, speed: 160, at0: 1500, lane: "front", beard: true },
  { seed: 209, kind: "woman", dir: 1, speed: 150, at0: -900, lane: "front", phone: true },
  { seed: 203, kind: "man", dir: 1, speed: 165, at0: 470, lane: "back", phone: true, beard: true },
  { seed: 204, kind: "woman", dir: -1, speed: 150, at0: 40, lane: "back" },
  { seed: 206, kind: "man", dir: 1, speed: 185, at0: -500, lane: "back" },
  { seed: 207, kind: "granny", dir: 1, speed: 72, at0: 250, lane: "back" },
  { seed: 208, kind: "woman", dir: -1, speed: 118, at0: 1300, lane: "back", kid: true },
];
const LANE = { front: { y: 1112, scale: 0.94, dim: 0 }, back: { y: 1008, scale: 0.78, dim: 0.3 } } as const;

const Walkers: React.FC<{ T: number; lane: "front" | "back" }> = ({ T, lane }) => (
  <>
    {WALKERS.filter((w) => w.lane === lane).map((w) => {
      const span = 1560;
      const raw0 = w.dir > 0 ? w.at0 : 1080 - w.at0;
      const raw = ((raw0 + 220 + (T - START) * w.speed) % span + span) % span - 220;
      const x = w.dir > 0 ? raw : 1080 - raw;
      const L = LANE[lane];
      const look = lookFor(w.seed, { kind: w.kind, ...(w.beard ? { beard: true, hair: toon.hair[0], style: 0 } : {}) });
      const phase = raw / 34;
      return (
        <g key={w.seed}>
          <Person x={x} y={L.y} look={look} phase={phase} moving={1} scale={L.scale} flip={w.dir < 0} phone={w.phone} dim={L.dim} holdHand={w.kid} />
          {w.kid && <Person x={x - 58 * w.dir * L.scale} y={L.y + 4} look={lookFor(w.seed + 50, { kind: "kid" })} phase={phase * 1.5 + 1} moving={1} scale={L.scale} flip={w.dir < 0} dim={L.dim} />}
        </g>
      );
    })}
  </>
);

/** Rush hour: a stream of people comes up out of the metro and walks off right. */
const RushCrowd: React.FC<{ T: number }> = ({ T }) => (
  <>
    {Array.from({ length: 16 }, (_, k) => {
      const born = RUSH + k * 0.75;
      const age = T - born;
      const x = 150 + age * (150 + (k % 4) * 25);
      if (age < 0 || x > 1240) return null;
      const rise = interpolate(age, [0, 0.4], [40, 0], clamp);
      return (
        <g key={k} opacity={interpolate(age, [0, 0.3], [0, 1], clamp)}>
          <Person x={x} y={1008 + rise} look={lookFor(400 + k)} phase={x / 30} moving={1} scale={0.74} dim={0.35} phone={k % 5 === 3} />
        </g>
      );
    })}
  </>
);

export const StreetScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const T = simTime(t);
  const rate = 1 + 3 * ffAmount(t);
  const now = serving(T);
  const hired = t >= BEAT.hire;
  const helperIn = springAt(t, BEAT.hire + 0.15, fps, "bouncy");

  // payments: the newest few pop «+500 ₽», the last one sends coins to the till
  const paid = SERVED.filter((c) => paidAt(c) <= T && (T - paidAt(c)) / rate < 1.25).slice(-2);
  const last = paid[paid.length - 1];
  const payAge = last ? (T - paidAt(last)) / rate : 9;
  const cashPop = payAge > 0.55 && payAge < 1.1 ? Math.sin(((payAge - 0.55) / 0.55) * Math.PI) : 0;
  const done = SERVED.filter((c) => c.end <= T);
  const soldAge = done.length ? (T - done[done.length - 1].end) / rate : 9;
  const soldPop = soldAge < 0.4 ? Math.sin((soldAge / 0.4) * Math.PI) : 0;
  const q = queue(T);
  const full = q >= MAX_LINE;

  // face → street: flash and a punch-in on the cut
  const cutAge = t - BEAT.face;
  const punchIn = interpolate(cutAge, [0, 0.45], [1.12, 1], { easing: theme.ease.out, ...clamp });
  const flash = cutAge > -0.05 && cutAge < 0.2 ? interpolate(cutAge, [-0.05, 0.03, 0.2], [0, 0.8, 0], clamp) : 0;

  const typed = interpolate(t, [0, TYPE.end], [TYPE.from, CODE_TOTAL], clamp);
  const finished = t >= BEAT.done;

  return (
    <div style={{ position: "absolute", inset: 0, background: palette.bg, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${punchIn})`, transformOrigin: "540px 760px" }}>
      <svg width={1080} height={SPLIT} viewBox={`0 0 1080 ${SPLIT}`} style={{ position: "absolute", left: 0, top: 0 }}>
        <Street t={T} ground={GROUND} bottom={SPLIT} />
        <MetroSign x={150} ground={GROUND + 10} t={T} />
        <Walkers T={T} lane="back" />
        <RushCrowd T={T} />
        <Kiosk x={KIOSK_X} y={KIOSK_Y} t={T} p={now ? now.p : null}>
          {hired && (
            <g transform={`translate(98 ${300 - (1 - helperIn) * 160}) scale(0.5)`} opacity={Math.min(1, helperIn * 2)}>
              <Seller x={0} y={0} t={T + 0.7} p={now ? (now.p + 0.5) % 1 : null} helper />
            </g>
          )}
          <g transform="translate(215 300) scale(0.56)">
            <Seller x={0} y={0} t={T} p={now ? now.p : null} />
          </g>
        </Kiosk>
        {CLIENTS.map((c) => {
          const x = clientX(c, T);
          if (x === null) return null;
          const a = clientX(c, T - 0.05) ?? x;
          const b = clientX(c, T + 0.05) ?? x;
          const moving = interpolate(Math.abs(b - a) / 0.1, [0, 120], [0, 1], clamp);
          const robbed = c.id === DOG_VICTIM.id && T >= DOG;
          const carry = c.left || robbed ? 0 : interpolate(T, [c.end - 0.25, c.end + 0.05], [0, 1], clamp);
          return <Person key={c.id} x={x} y={FEET} look={lookFor(c.id, c.id === TIPPER.id ? { kind: "granny" } : undefined)} phase={x / 34} moving={moving} carry={carry} breath={T * 2 + c.id} flip={c.left && T > c.arrive + 0.9} />;
        })}
        <Walkers T={T} lane="front" />
        {/* the dog: runs in from the right, grabs the shawarma, bolts left down the street */}
        {T > DOG - 1.2 && T < DOG + 2.2 && (
          <Dog x={DOG_MEET + 60 - (T - DOG) * 560} y={1122} phase={T * 18} flip prize={T >= DOG} size={1.35} />
        )}
        {t > COURIER_AT - 1.4 && t < COURIER_AT + 1.2 && <Courier x={700 + (t - COURIER_AT) * 760} y={1120} t={t} />}
      </svg>

      {/* money pops */}
      {rate > 1.3 ? (
        // fast-forward: one combo counter instead of a pile of pops
        <PayPop x={COUNTER_X - 205} y={712} age={0.45} amount={PRICE * SERVED.filter((c) => paidAt(c) <= T && (T - paidAt(c)) / rate < 1).length} />
      ) : (
        paid.map((c) => <PayPop key={c.id} x={COUNTER_X - 205 + ((c.id * 37) % 60) - 30} y={712 - (c.id % 2) * 70} age={(T - paidAt(c)) / rate} amount={PRICE} />)
      )}
      <CoinFly from={[COUNTER_X - 40, 760]} to={CASH_PILL} age={payAge} />
      {CLIENTS.filter((c) => c.left && T >= c.arrive && (T - c.arrive) / rate < 1.4).map((c) => (
        <LostPop key={c.id} x={Math.max(190, COUNTER_X - GAP * c.tail)} y={720} age={(T - c.arrive) / rate} />
      ))}

      <EventPop x={760} y={500} age={T - TIP.at} label="ЧАЕВЫЕ ОТ БАБУШКИ" amount="+100 ₽" />
      <EventPop x={Math.min(DOG_MEET - 120, 700)} y={950} age={T - DOG} label="СОБАКА УКРАЛА ШАУРМУ" tone="bad" />
      <EventPop x={760} y={500} age={t - COURIER_AT} label="ДОСТАВКА ×5" amount="+2 500 ₽" />

      {/* HUD */}
      <div style={{ position: "absolute", left: X0, top: 120, display: "flex", gap: 12 }}>
        <HudPill hero icon={<Coin />} label="КАССА" value={`${fmt(cash(T))} ₽`} pop={cashPop} />
        <HudPill icon={<PersonIcon />} label="ОЧЕРЕДЬ" value={String(q)} alarm={full} />
        <HudPill icon={<WrapIcon />} label="ПРОДАНО" value={String(sold(T))} pop={soldPop} />
      </div>
      <div style={{ position: "absolute", right: 1080 - X1, top: 120, height: 72, display: "flex", alignItems: "center", padding: "0 18px", borderRadius: 40, background: "rgba(6, 8, 10, 0.78)", border: `2px solid ${colors.lineStrong}`, fontFamily: WIDE, fontWeight: 800, fontSize: 30, color: palette.text }}>
        {clockAt(T)}
      </div>

      {/* sky: one beat at a time */}
      <Caption t={t} at={BEAT.titleOut + 0.3} len={3.2} kicker="1 ШАУРМА" line={<>= 500 <span style={{ fontFamily: "inherit" }}>₽</span> В КАССУ</>} />
      <RushBanner t={t} at={BEAT.rush} clock={clockAt(RUSH)} />
      <Caption t={t} at={BEAT.rush + 3.4} len={3.2} tone="bad" kicker={`ОЧЕРЕДЬ ${MAX_LINE}+`} line={<>ЛЮДИ<br />УХОДЯТ</>} />
      <UpgradeCard t={t} at={BEAT.card} tap={BEAT.hire} price={HIRE_COST} />
      <CostPop t={t} at={BEAT.hire + 0.45} amount={HIRE_COST} />
      <FastForward amount={ffAmount(t)} t={t} />
      <PaybackStamp t={t} at={PAYBACK} />
      <Finale t={t} at={BEAT.cta - 0.5} cash={cash(T)} talk={BEAT.cta} talkLen={DURATIONS["02-cta"] / VO_RATE} rate={VO_RATE} />

      <Editor typed={typed} t={t} top={SPLIT} height={1920 - SPLIT} label={finished ? `ГОТОВО · ${CODE.length} СТРОК` : "CLAUDE ПИШЕТ КОД"} />
      </div>
      <HookFace t={t} until={BEAT.face} rate={VO_RATE} />
      <Flash amount={flash} />
      <HookTitle t={t} outAt={BEAT.titleOut} />
    </div>
  );
};
