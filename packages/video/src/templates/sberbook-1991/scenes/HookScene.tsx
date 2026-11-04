// Beat 1 — the hook. Frame 0 is the cover: СБЕРКНИЖКА ТВОИХ РОДИТЕЛЕЙ over the
// open book with «ОСТАТОК 10 000 РУБ.», a pack of a hundred 100-ruble notes,
// the tag «1991» and the readout НА КНИЖКЕ · 10 000 РУБ.
// «десять тысяч» punches the balance; «в девяносто первом» stamps the year
// and a 1991-era car slides in as evidence; «полтора года зарплаты» drops
// the chip 18 ЗАРПЛАТ; «что от них осталось» turns the headline into the
// question and glitches out into the years.
import React from "react";
import { Img, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../../theme";
import { useIn, usePunch, useRamp } from "../../../reel";
import { colors, palette } from "../palette";
import { BrandBar, Chip, Flash, Glitch, Kinetic, SceneShell, Shockwave } from "../ui";
import { HOOK } from "../timeline";
import { Book, Note, Pack } from "../parts";
import { DEPOSIT, SALARY_1991 } from "../years";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const WIDE = `${theme.fonts.wide}, ${theme.fonts.mono}`;
const num = (n: number) => Math.round(n).toLocaleString("ru-RU").replace(/\s/g, " ");

/* ------------------------------------------------------------ the book */

export const TheBook: React.FC = () => {
  const frame = useCurrentFrame();
  const settle = useIn(-30); // already on frame 0
  const hit = usePunch(HOOK.amount, 16);
  const bob = Math.sin(frame / 30) * 5;
  return (
    <div
      style={{
        position: "absolute",
        left: 60,
        top: 520 + bob,
        transform: `scale(${settle * (1 + hit.pop * 0.04)})`,
        zIndex: 5,
      }}
    >
      <Book w={600} h={470} tilt={-3}>
        {/* the printed form */}
        <div
          style={{
            position: "absolute",
            left: 28,
            top: 26,
            fontFamily: theme.fonts.mono,
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: "0.16em",
            color: colors.inkFaded,
          }}
        >
          СБЕРЕГАТЕЛЬНАЯ КНИЖКА
        </div>
        <div
          style={{
            position: "absolute",
            left: 28,
            top: 60,
            fontFamily: theme.fonts.mono,
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: "0.1em",
            color: colors.inkFaded,
          }}
        >
          СБЕРКАССА № 4 · СЧ. № 38355
        </div>
        {/* the handwritten line */}
        <div
          style={{
            position: "absolute",
            left: 28,
            right: 28,
            top: 150,
            padding: "14px 18px",
            background: "rgba(241,237,226,0.86)",
            borderTop: `2px solid ${colors.inkRule}`,
            borderBottom: `2px solid ${colors.inkRule}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            fontFamily: theme.fonts.mono,
            fontSize: 24,
            fontWeight: 800,
            letterSpacing: "0.08em",
            color: colors.ink,
          }}
        >
          <span>20.06.1991 · ОСТАТОК</span>
          <span style={{ color: colors.inkFaded }}>РУБ. · КОП.</span>
        </div>
        <div
          style={{
            position: "absolute",
            left: 28,
            top: 230,
            fontFamily: WIDE,
            fontSize: 118,
            fontWeight: 900,
            letterSpacing: "-0.03em",
            lineHeight: 1,
            color: colors.ink,
            whiteSpace: "nowrap",
            transform: `scale(${1 + hit.pop * 0.14})`,
            transformOrigin: "left center",
          }}
        >
          {num(DEPOSIT)}
          <span style={{ fontSize: 56, marginLeft: 14 }}>— 00</span>
        </div>
        <div
          style={{
            position: "absolute",
            left: 30,
            top: 372,
            fontFamily: theme.fonts.mono,
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: "0.12em",
            color: colors.inkFaded,
          }}
        >
          ДЕСЯТЬ ТЫСЯЧ РУБ. 00 КОП.
        </div>
      </Book>
    </div>
  );
};

/* ------------------------------------------------------------ the pack */

const LOOSE = [
  { x: 430, y: 1000, rot: -14, at: 0 },
  { x: 520, y: 960, rot: 9, at: 4 },
  { x: 610, y: 1010, rot: -4, at: 8 },
];

export const ThePack: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const hit = usePunch(HOOK.amount, 16);
  const bob = Math.sin(frame / 24 + 1) * 4;
  return (
    <>
      {LOOSE.map((n, i) => {
        if (frame < HOOK.rubles + n.at) return null;
        // not a hook: the count of hooks must not change between frames
        const p = spring({ frame: frame - HOOK.rubles - n.at, fps, config: theme.spring.bouncy });
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: interpolate(p, [0, 1], [700, n.x]),
              top: interpolate(p, [0, 1], [1020, n.y]) + bob,
              transform: `rotate(${n.rot + (1 - p) * 30}deg) scale(${interpolate(p, [0, 1], [0.6, 1])})`,
              opacity: Math.min(1, p * 2),
              zIndex: 8,
            }}
          >
            <Note w={300} />
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          left: 580,
          top: 930 + bob,
          transform: `rotate(5deg) scale(${1 + hit.pop * 0.08})`,
          zIndex: 10,
        }}
      >
        <Pack w={440} thick={22} label="100 × 100" />
      </div>
    </>
  );
};

/* ---------------------------------------------------------- the people */

// The author's photo (notes 3): a group of Soviet young people, cut out
// with matte.swift, a paper sticker outline — they rise from the bottom
// edge on frame 6 and get a punch on «твоих родителей».
const PEOPLE = staticFile("images/sberbook-1991/people.png");
const PEOPLE_W = 640;
const PEOPLE_H = Math.round(PEOPLE_W * (968 / 1000));

export const People: React.FC<{ at?: number; scale?: number; left?: number; top?: number }> = ({ at = 6, scale = 1, left = 420, top = 1330 }) => {
  const frame = useCurrentFrame();
  const p = useIn(at, "bouncy");
  const hit = usePunch(HOOK.parents, 16);
  const bob = Math.sin(frame / 30 + 2) * 4;
  const sway = Math.sin(frame / 46) * 1.2;
  return (
    <div
      style={{
        position: "absolute",
        left,
        top: top + bob + (1 - p) * 420,
        width: PEOPLE_W * scale,
        height: PEOPLE_H * scale,
        transform: `rotate(${-2 + sway + (1 - p) * -8}deg) scale(${interpolate(p, [0, 1], [0.8, 1]) * (1 + hit.pop * 0.05)})`,
        transformOrigin: "50% 100%",
        opacity: Math.min(1, p * 2),
        zIndex: 12,
        // the sticker: a paper outline on all sides, then the drop shadow
        filter: `drop-shadow(3px 0 0 ${colors.paper}) drop-shadow(-3px 0 0 ${colors.paper}) drop-shadow(0 3px 0 ${colors.paper}) drop-shadow(0 -3px 0 ${colors.paper}) drop-shadow(0 24px 28px rgba(0,0,0,0.7))`,
      }}
    >
      <Img src={PEOPLE} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
    </div>
  );
};

/* -------------------------------------------------------- the evidence */

const CAR = staticFile("media/sberbook-1991/zhiguli.mp4");

const CarCard: React.FC = () => {
  const frame = useCurrentFrame();
  const p = useIn(HOOK.year, "bouncy");
  const out = useRamp(HOOK.look - 8, HOOK.look, theme.ease.in);
  if (frame < HOOK.year || frame >= HOOK.look) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 660,
        top: 560,
        width: 360,
        height: 270,
        border: `7px solid ${colors.paper}`,
        boxShadow: colors.shadow,
        overflow: "hidden",
        zIndex: 20,
        opacity: Math.min(1, p * 1.6) * (1 - out),
        transform: `rotate(${interpolate(p, [0, 1], [12, 4])}deg) scale(${interpolate(p, [0, 1], [1.3, 1]) * (1 - out * 0.2)})`,
      }}
    >
      <Sequence from={HOOK.year} layout="none">
        <OffthreadVideo src={CAR} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </Sequence>
      <div style={{ position: "absolute", left: 14, top: 12 }}>
        <Chip tone="neutral" size={20}>
          1991
        </Chip>
      </div>
    </div>
  );
};

/* ----------------------------------------------------------- the words */

const YearTag: React.FC = () => {
  const stamp = usePunch(HOOK.year, 14);
  return (
    <div
      style={{
        display: "inline-block",
        padding: "10px 22px",
        background: colors.paper,
        color: colors.ink2,
        fontFamily: theme.fonts.mono,
        fontSize: 54,
        fontWeight: 800,
        letterSpacing: "0.04em",
        transform: `rotate(${-3 + stamp.pop * 5}deg) scale(${1 + stamp.pop * 0.4})`,
        boxShadow: colors.paperShadow,
      }}
    >
      1991
    </div>
  );
};

const Header: React.FC = () => {
  const frame = useCurrentFrame();
  const out = useRamp(HOOK.look - 4, HOOK.look + 2, theme.ease.in);
  const parents = usePunch(HOOK.parents, 14);
  if (frame >= HOOK.look + 2) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 72,
        right: 72,
        top: 236,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        opacity: 1 - out,
        transform: `translateY(${out * -40}px)`,
      }}
    >
      {/* already set on frame 0 — this is the cover */}
      <div style={{ maxWidth: 700 }}>
        <Kinetic text="СБЕРКНИЖКА" delay={-20} size={66} lineHeight={1} />
        <div style={{ transform: `scale(${1 + parents.pop * 0.06})`, transformOrigin: "left center" }}>
          <Kinetic text="ТВОИХ РОДИТЕЛЕЙ" delay={-14} size={58} lineHeight={1} color={palette.textDim} />
        </div>
      </div>
      <YearTag />
    </div>
  );
};

const Question: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < HOOK.look) return null;
  return (
    <div style={{ position: "absolute", left: 72, right: 72, top: 236 }}>
      <Kinetic text="ЧТО ОТ НИХ" delay={HOOK.look} size={92} mode="snap" per={4} />
      <Kinetic text="ОСТАЛОСЬ?" delay={HOOK.left - 6} size={112} mode="snap" per={6} bad={[0]} />
    </div>
  );
};

/* ---------------------------------------------------------- the readout */

const Readout: React.FC = () => {
  const hit = usePunch(HOOK.amount, 16);
  const label: React.CSSProperties = { fontFamily: theme.fonts.mono, fontSize: 28, fontWeight: 700, letterSpacing: "0.14em" };
  return (
    <div style={{ position: "absolute", left: 66, right: 66, top: 1250, display: "flex", flexDirection: "column", gap: 10, zIndex: 15 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
        <span style={{ ...label, color: palette.textDim }}>НА КНИЖКЕ</span>
        <span
          style={{
            fontFamily: WIDE,
            fontWeight: 900,
            fontSize: 104,
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
            whiteSpace: "nowrap",
            color: palette.text,
            transform: `scale(${1 + hit.pop * 0.1})`,
            transformOrigin: "right center",
          }}
        >
          {num(DEPOSIT)} РУБ.
        </span>
      </div>
    </div>
  );
};

const SalaryChip: React.FC = () => {
  const frame = useCurrentFrame();
  const hit = usePunch(HOOK.salary, 16);
  if (frame < HOOK.salary) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 66,
        top: 1380,
        transform: `scale(${1 + hit.pop * 0.2}) rotate(-2deg)`,
        transformOrigin: "left center",
        zIndex: 30,
      }}
    >
      <Chip tone="hero" filled size={34} delay={HOOK.salary}>
        {`${Math.round(DEPOSIT / SALARY_1991)} ЗАРПЛАТ · ${SALARY_1991} РУБ./МЕС`}
      </Chip>
    </div>
  );
};

/* --------------------------------------------------------------- scene */

export const HookScene: React.FC<{ series: string; episode: string }> = ({ series, episode }) => {
  const frame = useCurrentFrame();
  const amount = usePunch(HOOK.amount, 16);
  const doubt = usePunch(HOOK.left, 20);
  const glitch = interpolate(frame, [HOOK.left, HOOK.left + 3, HOOK.left + 12], [0, 0.9, 0], clamp);
  const push = interpolate(frame, [HOOK.look, HOOK.look + 40], [1, 1.05], { easing: theme.ease.out, ...clamp });
  return (
    <SceneShell exit={false} shake={amount.shake * 0.6 + doubt.shake}>
      <BrandBar series={series} episode={episode} delay={-20} />
      <Header />
      <Question />
      <div style={{ position: "absolute", inset: 0, transform: `scale(${push})` }}>
        <Glitch amount={glitch} style={{ position: "absolute", inset: 0 }}>
          <div style={{ position: "absolute", inset: 0 }}>
            <TheBook />
            <ThePack />
            <People />
            <CarCard />
            <Readout />
          </div>
        </Glitch>
      </div>
      <SalaryChip />
      <Shockwave at={HOOK.amount} />
      <Flash amount={amount.energy * 0.7} />
      <Flash amount={doubt.energy} color={colors.bad} />
    </SceneShell>
  );
};
