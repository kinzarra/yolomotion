// Beat 1 — the hook. Frame 0 is the cover: YOUR MINIMUM WAGE over a pile of
// seven real $1 notes (dealt out into a cascade under the first line) and a quarter, and a pay stub «2009 · $7.25 / HOUR».
// «you still make seven twenty-five» — the year rolls 2009 → 2026, the stub
// reprints with the very same amount and a NO RAISE stamp.
// «so what's it really worth?» — the question slams over the top, the cash
// shudders red and the amount turns into $?.?? (answered in the last third).
import React from "react";
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../../theme";
import { useIn, usePunch, useRamp } from "../../../reel";
import { colors, palette } from "../palette";
import {
  Bill,
  BILL,
  rnd,
  BrandBar,
  Coin,
  Flash,
  Glitch,
  Kinetic,
  Receipt,
  ReceiptLine,
  ReceiptRule,
  SceneShell,
  Shockwave,
  Stamp,
} from "../ui";
import { HOOK } from "../timeline";
import { BILL_W, SLOT0, SLOTS } from "../parts";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const THEN = 2009; // FLSA: $7.25 since July 24, 2009
const NOW = 2026; // still $7.25 (DOL, October 2026)

/* ------------------------------------------------------------ the cash */

// $7.25 = seven $1 notes + one quarter. Frame 0: the seven lie as one neat
// pile (the cover still shows all the cash). Under «you made seven
// twenty-five…» they are counted out one by one into a tidy cascade, the
// quarter drops last. Top note first, so the pile shrinks as it is dealt.
const DEAL_FROM = 4;
const DEAL_EVERY = 6; // frames between notes — the deal ends before «two thousand nine»
const dealAt = (i: number) => DEAL_FROM + (6 - i) * DEAL_EVERY;
const QUARTER_AT = dealAt(0) + DEAL_EVERY;
const QUARTER_PX = 190;

const Cash: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const hit = usePunch(HOOK.worthHit, 22);
  // after «worth» the notes keep a faint red cast: the melt starts here
  const tint = interpolate(frame, [HOOK.worthHit, HOOK.worthHit + 4, HOOK.worthHit + 24], [0, 0.32, 0.12], clamp);
  const q = spring({ frame: frame - QUARTER_AT, fps, config: theme.spring.bouncy });
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {SLOTS.map((slot, i) => {
        const p = spring({ frame: frame - dealAt(i), fps, config: theme.spring.snappy });
        const pile = { x: SLOT0.x + i * 0.6, y: SLOT0.y - i * 2.2, rot: -4 + i * 0.4 };
        const x = interpolate(p, [0, 1], [pile.x, slot.x]);
        const y = interpolate(p, [0, 1], [pile.y, slot.y]);
        // the note lifts off the pile as it travels
        const lift = Math.sin(Math.min(1, p) * Math.PI) * 0.05;
        const breathe = Math.sin(frame / 26 + i * 0.9) * 0.4;
        const jitter = hit.shake * (i % 2 === 0 ? 0.25 : -0.25);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x + jitter,
              top: y,
              zIndex: i,
              transform: `rotate(${interpolate(p, [0, 1], [pile.rot, slot.rot]) + breathe}deg) scale(${1 + lift})`,
            }}
          >
            <Bill w={BILL_W} tint={tint} />
          </div>
        );
      })}
      {frame >= QUARTER_AT && (
        <div
          style={{
            position: "absolute",
            left: 760,
            top: interpolate(q, [0, 1], [880, 1000]) + Math.sin(frame / 20) * 3,
            zIndex: 10,
            opacity: Math.min(1, q * 2),
            transform: `rotate(${interpolate(q, [0, 1], [-60, -14]) + hit.shake * 0.4}deg) scale(${interpolate(q, [0, 1], [1.4, 1])})`,
          }}
        >
          <Coin kind="quarter" quarterPx={QUARTER_PX} />
        </div>
      )}
    </div>
  );
};

/* ------------------------------------------------------------- the meme */

// «so what's it really worth?» — Tony Stark in a rain of cash (the
// author's pick), cut out of the photo (scripts/matte.swift). Full frame
// width — his hands run off both edges — rising from behind the stub, which
// hides the photo's flat bottom edge. The rain around him is ours: real $1
// scans tumbling in 3D, in three depth layers.
const MEME = staticFile("images/min-wage-725/meme-stark.png");
const MEME_W = 1080;
const MEME_H = 706;
const MEME_TOP = 1250 - MEME_H; // bottom edge tucked ~50 px under the stub (top 1200)

const Meme: React.FC = () => {
  const frame = useCurrentFrame();
  const p = useIn(HOOK.worthHit, "bouncy");
  if (frame < HOOK.worthHit) return null;
  const push = interpolate(frame, [HOOK.worthHit, HOOK.worthHit + 60], [1, 1.04], { easing: theme.ease.inOut, ...clamp });
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: MEME_TOP,
        width: MEME_W,
        height: MEME_H,
        zIndex: 20,
        transformOrigin: "50% 100%",
        opacity: Math.min(1, p * 2),
        transform: `translateY(${interpolate(p, [0, 1], [380, 0])}px) scale(${interpolate(p, [0, 1], [0.85, 1]) * push})`,
        filter: "drop-shadow(0 30px 50px rgba(0,0,0,0.65))",
      }}
    >
      <Img src={MEME} style={{ width: "100%", height: "100%", display: "block" }} />
    </div>
  );
};

// The rain: deterministic notes, each with its own start, lane, size and
// tumble. Far notes are small, blurred and dim (behind the card); near ones
// are big and sharp (over everything but the stub's text stays readable).
const RAIN = Array.from({ length: 40 }, (_, k) => {
  const depth = k % 3; // 0 far · 1 mid · 2 near
  return {
    depth,
    x: rnd(k * 3.1) * 1180 - 120,
    // a third are already mid-air on the hit, the rest keep coming until the cut
    start: HOOK.worthHit - (k % 3 === 0 ? 30 : 0) + Math.floor(rnd(k * 7.7) * 26),
    fall: [70, 52, 40][depth] + Math.floor(rnd(k * 1.9) * 14), // frames top → bottom
    w: [130, 200, 300][depth] * (0.85 + rnd(k * 5.3) * 0.3),
    spin: (rnd(k * 2.2) - 0.5) * 16,
    phase: rnd(k * 4.4) * Math.PI * 2,
    sway: 40 + rnd(k * 6.6) * 70,
  };
});

const MoneyRain: React.FC<{ layer: "back" | "front" }> = ({ layer }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: layer === "back" ? 15 : 25, pointerEvents: "none" }}>
      {RAIN.filter((n) => (layer === "back" ? n.depth < 2 : n.depth === 2)).map((n, k) => {
        if (frame < HOOK.worthHit - 2) return null; // nothing falls before the hit
        const t = (frame - n.start) / n.fall;
        if (t < 0 || t > 1.4) return null;
        const y = interpolate(t, [0, 1], [-300, 2000], { easing: theme.ease.inOut });
        const ft = (frame - n.start) / 9 + n.phase; // flutter
        return (
          <div
            key={k}
            style={{
              position: "absolute",
              left: n.x + Math.sin(ft * 0.7) * n.sway,
              top: y,
              width: n.w,
              opacity: [0.55, 0.85, 1][n.depth],
              filter: n.depth === 0 ? "blur(3px)" : n.depth === 1 ? "blur(0.6px)" : "drop-shadow(0 18px 24px rgba(0,0,0,0.5))",
              transform: `perspective(900px) rotateX(${Math.sin(ft) * 62}deg) rotateY(${Math.cos(ft * 0.8) * 38}deg) rotateZ(${n.spin * ft}deg)`,
            }}
          >
            <Img src={BILL} style={{ width: "100%", display: "block", borderRadius: 3 }} />
          </div>
        );
      })}
    </div>
  );
};

/* ------------------------------------------------------------- the stub */

const StubBody: React.FC<{ year: number; amount: string; punch: number; delay: number; bad?: boolean }> = ({
  year,
  amount,
  punch,
  delay,
  bad = false,
}) => (
  <>
    <ReceiptLine label="PERIOD" value={`${year} · 1 HOUR`} size={28} delay={delay} />
    <ReceiptRule />
    <div style={{ fontSize: 26, letterSpacing: "0.14em", color: colors.inkFaded, marginTop: 6 }}>
      FEDERAL MINIMUM WAGE
    </div>
    <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
      <div
        style={{
          fontFamily: `${theme.fonts.wide}, ${theme.fonts.mono}`,
          fontSize: 124,
          fontWeight: 900,
          letterSpacing: "-0.03em",
          lineHeight: 1.05,
          color: bad ? colors.bad : colors.ink,
          fontVariantNumeric: "tabular-nums",
          whiteSpace: "nowrap",
          transform: `scale(${1 + punch * 0.12})`,
          transformOrigin: "left center",
        }}
      >
        {amount}
      </div>
      <div style={{ fontFamily: theme.fonts.mono, fontSize: 40, fontWeight: 800, color: colors.inkFaded }}>/ HR</div>
    </div>
  </>
);

const Stub: React.FC = () => {
  const frame = useCurrentFrame();
  const seven = usePunch(HOOK.seven, 14);
  const again = usePunch(HOOK.stillAmount, 16);
  const hit = usePunch(HOOK.worthHit, 18);
  const unknown = frame >= HOOK.worthHit;
  const bob = Math.sin(frame / 28) * 6;
  return (
    <div style={{ position: "absolute", left: 160, top: 1200, zIndex: 30, transform: `translateY(${bob}px)` }}>
      <Receipt width={760} printFrom={-40} printFrames={1} title="PAY STUB" number={`# ${THEN}`} tilt={-2}>
        <StubBody year={THEN} amount="$7.25" punch={seven.pop} delay={-30} />
      </Receipt>
      {/* the reprint lands exactly over the old stub */}
      <div style={{ position: "absolute", left: 0, top: 0 }}>
        <Receipt width={760} printFrom={HOOK.still} printFrames={12} title="PAY STUB" number={`# ${NOW}`} tilt={-2}>
          <StubBody
            year={NOW}
            amount={unknown ? "$?.??" : "$7.25"}
            punch={unknown ? hit.pop : again.pop}
            delay={HOOK.still}
            bad={unknown}
          />
        </Receipt>
      </div>
      {frame >= HOOK.stillAmount && (
        <div style={{ position: "absolute", right: -46, top: 128, zIndex: 5 }}>
          <Stamp delay={HOOK.stillAmount + 4} size={54} rotate={-8}>
            NO RAISE
          </Stamp>
        </div>
      )}
    </div>
  );
};

/* ------------------------------------------------------------ the words */

const YearTag: React.FC = () => {
  const frame = useCurrentFrame();
  const stamp = usePunch(HOOK.year, 14);
  const land = usePunch(HOOK.stillAmount, 14);
  const year = Math.round(
    interpolate(frame, [HOOK.still, HOOK.stillAmount], [THEN, NOW], { easing: theme.ease.inOut, ...clamp }),
  );
  const now = year === NOW;
  const pop = stamp.pop + land.pop;
  return (
    <div
      style={{
        display: "inline-block",
        padding: "10px 22px",
        background: now ? palette.primary : colors.paper,
        color: colors.ink2,
        fontFamily: theme.fonts.mono,
        fontSize: 54,
        fontWeight: 800,
        letterSpacing: "0.04em",
        fontVariantNumeric: "tabular-nums",
        transform: `rotate(${-3 + pop * 4}deg) scale(${1 + pop * 0.35})`,
        boxShadow: now ? `0 0 40px ${palette.glow}` : colors.paperShadow,
      }}
    >
      {year}
    </div>
  );
};

const Header: React.FC = () => {
  const frame = useCurrentFrame();
  const out = useRamp(HOOK.worth - 4, HOOK.worth + 2, theme.ease.in);
  if (frame >= HOOK.worth + 2) return null;
  const still = frame >= HOOK.still;
  return (
    <div
      style={{
        position: "absolute",
        left: 72,
        right: 72,
        top: 260,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        opacity: 1 - out,
        transform: `translateY(${out * -40}px)`,
      }}
    >
      {still ? (
        <Kinetic key="still" text="STILL" delay={HOOK.still} size={104} mode="snap" />
      ) : (
        // already set on frame 0 — this is the cover
        <Kinetic key="then" text="YOUR MINIMUM WAGE" delay={-20} size={66} lineHeight={1} style={{ maxWidth: 600 }} />
      )}
      <YearTag />
    </div>
  );
};

const Question: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < HOOK.worth) return null;
  return (
    <div style={{ position: "absolute", left: 72, right: 72, top: 230 }}>
      <Kinetic text="WHAT'S IT" delay={HOOK.worth} size={96} mode="snap" per={4} />
      <Kinetic text="REALLY WORTH?" delay={HOOK.worthHit - 8} size={104} mode="snap" per={6} bad={[1]} />
    </div>
  );
};

/* ---------------------------------------------------------------- scene */

export const HookScene: React.FC<{ series: string; episode: string }> = ({ series, episode }) => {
  const frame = useCurrentFrame();
  const again = usePunch(HOOK.stillAmount, 16);
  const doubt = usePunch(HOOK.worthHit, 20);
  const glitch = interpolate(frame, [HOOK.worthHit, HOOK.worthHit + 3, HOOK.worthHit + 12], [0, 0.9, 0], clamp);
  const push = interpolate(frame, [HOOK.worth, HOOK.worth + 40], [1, 1.05], { easing: theme.ease.out, ...clamp });
  const enter = useIn(-30); // already settled on frame 0
  return (
    <SceneShell exit={false} shake={again.shake * 0.6 + doubt.shake}>
      <BrandBar series={series} episode={episode} delay={-20} />
      <Header />
      <Question />
      <div style={{ position: "absolute", inset: 0, transform: `scale(${push * enter})` }}>
        <Glitch amount={glitch} style={{ position: "absolute", inset: 0 }}>
          <div style={{ position: "absolute", inset: 0 }}>
            <Cash />
            <MoneyRain layer="back" />
            <Meme />
            <MoneyRain layer="front" />
            <Stub />
          </div>
        </Glitch>
      </div>
      <Shockwave at={HOOK.stillAmount} />
      <Flash amount={again.energy} />
      <Flash amount={doubt.energy} color={colors.bad} />
    </SceneShell>
  );
};
