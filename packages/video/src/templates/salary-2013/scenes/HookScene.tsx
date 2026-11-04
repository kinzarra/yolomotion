// Beat 1 — the hook. Frame 0 is the cover: ТВОЯ ЗАРПЛАТА over one pack of
// 5 000 ₽ notes and a pay slip «2013 · 30 000 ₽».
// «сейчас получаешь сто» — the slip reprints under a lime head to
// «2025 · 100 360 ₽» while the pack multiplies into three and a third.
// «ты правда стал богаче?» — the question slams over the top and on «стал
// богаче» the author's meme (rich men asleep on money) lands over the packs.
import React from "react";
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../../theme";
import { useIn, usePunch, useRamp } from "../../../reel";
import { colors, palette } from "../palette";
import { BrandBar, Flash, Glitch, Kinetic, Receipt, ReceiptLine, ReceiptRule, SceneShell, Shockwave } from "../ui";
import { HOOK } from "../timeline";
import { NOTE, Pack } from "../parts";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;


const THEN = { year: "2013", amount: 30000 }; // Росстат: 29 792 ₽
const NOW = { year: "2025", amount: 101784 }; // Росстат, редакция 2026: 101 784 ₽

const rub = (n: number) => `${Math.round(n).toLocaleString("ru-RU").replace(/\s/g, " ")} ₽`;

/* ----------------------------------------------------------- the packs */

// 30 000 ₽ = one pack of 5 000s. At «сейчас» it multiplies: 100 360 / 30 000
// = 3,35 → three full packs and a thin fourth one.
const PACKS = [
  { x: 540, y: 860, w: 600, rot: -4, thick: 14, at: 0, then: true },
  { x: 345, y: 760, w: 440, rot: -8, thick: 14, at: 0, then: false },
  { x: 735, y: 720, w: 440, rot: 6, thick: 14, at: 5, then: false },
  { x: 380, y: 980, w: 440, rot: 4, thick: 14, at: 10, then: false },
  { x: 750, y: 960, w: 440, rot: -5, thick: 5, at: 15, then: false },
];

const PackPile: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // the first pack shrinks into the pile as the clones land
  const settle = spring({ frame: frame - HOOK.now, fps, config: theme.spring.smooth });
  return (
    <>
      {PACKS.map((pk, i) => {
        const first = pk.then;
        if (first && settle > 0.999) return null; // its place is taken by pack 1
        if (!first && frame < HOOK.now + pk.at) return null;
        const p = first
          ? 1
          : spring({ frame: frame - HOOK.now - pk.at, fps, config: theme.spring.bouncy });
        const tgt = PACKS[1];
        const x = first ? interpolate(settle, [0, 1], [pk.x, tgt.x]) : pk.x;
        const y = first ? interpolate(settle, [0, 1], [pk.y, tgt.y]) : pk.y;
        const w = first ? interpolate(settle, [0, 1], [pk.w, tgt.w]) : pk.w;
        const rot = first ? interpolate(settle, [0, 1], [pk.rot, tgt.rot]) : pk.rot;
        const bob = Math.sin(frame / 26 + i * 1.3) * 5;
        // clones pop out of the first pack's spot
        const fromX = PACKS[0].x;
        const fromY = PACKS[0].y;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: interpolate(p, [0, 1], [fromX, x]) - w / 2,
              top: interpolate(p, [0, 1], [fromY, y]) - (w * 0.44) / 2 + bob,
              transform: `rotate(${rot + (1 - p) * 14}deg) scale(${interpolate(p, [0, 1], [0.4, 1])})`,
              opacity: Math.min(1, p * 2),
              zIndex: i === 0 ? 1 : i + 1,
            }}
          >
            <Pack w={w} thick={pk.thick} />
          </div>
        );
      })}
    </>
  );
};

/* ------------------------------------------------------------ the meme */

const MEME = staticFile("images/salary-2013/meme-rich.jpg");

const Meme: React.FC = () => {
  const frame = useCurrentFrame();
  const p = useIn(HOOK.meme, "bouncy");
  if (frame < HOOK.meme) return null;
  const kb = interpolate(frame, [HOOK.meme, HOOK.meme + 60], [1, 1.08], { easing: theme.ease.inOut, ...clamp });
  return (
    <div
      style={{
        position: "absolute",
        left: 90,
        top: 640,
        width: 900,
        height: 506,
        border: `10px solid ${colors.paper}`,
        boxShadow: colors.paperShadow,
        overflow: "hidden",
        zIndex: 20,
        opacity: Math.min(1, p * 1.6),
        transform: `rotate(${interpolate(p, [0, 1], [-14, -3])}deg) scale(${interpolate(p, [0, 1], [1.6, 1])})`,
      }}
    >
      <Img src={MEME} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${kb})` }} />
    </div>
  );
};

/* ----------------------------------------------------------- the slip */

const SlipBody: React.FC<{ year: string; amount: string; punch: number; delay: number }> = ({
  year,
  amount,
  punch,
  delay,
}) => (
  <>
    <ReceiptLine label="ПЕРИОД" value={`${year} · МЕСЯЦ`} size={28} delay={delay} />
    <ReceiptRule />
    <div style={{ fontSize: 26, letterSpacing: "0.14em", color: colors.inkFaded, marginTop: 6 }}>
      НАЧИСЛЕНО
    </div>
    <div
      style={{
        fontFamily: `${theme.fonts.wide}, ${theme.fonts.mono}`,
        fontSize: 118,
        fontWeight: 900,
        letterSpacing: "-0.03em",
        lineHeight: 1.05,
        color: colors.ink,
        fontVariantNumeric: "tabular-nums",
        whiteSpace: "nowrap",
        transform: `scale(${1 + punch * 0.12})`,
        transformOrigin: "left center",
      }}
    >
      {amount}
    </div>
  </>
);

const Slip: React.FC = () => {
  const frame = useCurrentFrame();
  const thirty = usePunch(HOOK.thirty, 14);
  const sto = usePunch(HOOK.sto, 16);
  const count = interpolate(frame, [HOOK.now, HOOK.sto], [THEN.amount, NOW.amount], {
    easing: theme.ease.out,
    ...clamp,
  });
  const bob = Math.sin(frame / 28) * 6;
  return (
    <div style={{ position: "absolute", left: 160, top: 1190, transform: `translateY(${bob}px)` }}>
      <Receipt width={760} printFrom={-40} printFrames={1} title="РАСЧЁТНЫЙ ЛИСТОК" number="№ 2013" tilt={-2}>
        <SlipBody year={THEN.year} amount={rub(THEN.amount)} punch={thirty.pop} delay={-30} />
      </Receipt>
      {/* the reprint lands exactly over the old slip */}
      <div style={{ position: "absolute", left: 0, top: 0 }}>
        <Receipt width={760} printFrom={HOOK.now} printFrames={12} title="РАСЧЁТНЫЙ ЛИСТОК" number="№ 2025" tilt={-2}>
          <SlipBody year={NOW.year} amount={rub(count)} punch={sto.pop} delay={HOOK.now} />
        </Receipt>
      </div>
    </div>
  );
};

/* ---------------------------------------------------------- the words */

const YearTag: React.FC = () => {
  const frame = useCurrentFrame();
  const stamp = usePunch(HOOK.year, 14);
  const now = frame >= HOOK.now;
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
        transform: `rotate(${-3 + stamp.pop * 4}deg) scale(${1 + stamp.pop * 0.35})`,
        boxShadow: now ? `0 0 40px ${palette.glow}` : colors.paperShadow,
      }}
    >
      {now ? "2025" : "2013"}
    </div>
  );
};

const Header: React.FC = () => {
  const frame = useCurrentFrame();
  const out = useRamp(HOOK.rich - 4, HOOK.rich + 2, theme.ease.in);
  if (frame >= HOOK.rich + 2) return null;
  const now = frame >= HOOK.now;
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
      {now ? (
        <Kinetic key="now" text="СЕЙЧАС" delay={HOOK.now} size={96} mode="snap" />
      ) : (
        // already set on frame 0 — this is the cover
        <Kinetic key="then" text="ТВОЯ ЗАРПЛАТА" delay={-20} size={70} lineHeight={1} style={{ maxWidth: 560 }} />
      )}
      <YearTag />
    </div>
  );
};

const Question: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < HOOK.rich) return null;
  return (
    <div style={{ position: "absolute", left: 72, right: 72, top: 230 }}>
      <Kinetic text="ТЫ ПРАВДА" delay={HOOK.rich} size={96} mode="snap" per={4} />
      <Kinetic text="СТАЛ БОГАЧЕ?" delay={HOOK.richer - 6} size={112} mode="snap" per={6} bad={[1]} />
    </div>
  );
};

/* --------------------------------------------------------------- scene */

export const HookScene: React.FC<{ series: string; episode: string }> = ({ series, episode }) => {
  const frame = useCurrentFrame();
  const sto = usePunch(HOOK.sto, 16);
  const doubt = usePunch(HOOK.richer, 20);
  const glitch = interpolate(frame, [HOOK.richer, HOOK.richer + 3, HOOK.richer + 12], [0, 0.9, 0], clamp);
  const push = interpolate(frame, [HOOK.rich, HOOK.rich + 40], [1, 1.05], { easing: theme.ease.out, ...clamp });
  const enter = useIn(-30); // already settled on frame 0
  return (
    <SceneShell exit={false} shake={sto.shake * 0.6 + doubt.shake}>
      <BrandBar series={series} episode={episode} delay={-20} />
      <Header />
      <Question />
      <div style={{ position: "absolute", inset: 0, transform: `scale(${push * enter})` }}>
        <Glitch amount={glitch} style={{ position: "absolute", inset: 0 }}>
          <div style={{ position: "absolute", inset: 0 }}>
            <PackPile />
            <Meme />
            <Slip />
          </div>
        </Glitch>
      </div>
      <Shockwave at={HOOK.sto} />
      <Flash amount={sto.energy} />
      <Flash amount={doubt.energy} color={colors.bad} />
    </SceneShell>
  );
};
