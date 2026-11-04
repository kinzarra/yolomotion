// The case file as one function of reel time t: six chapters cut on the
// voice lines, every frame a finished comic page with 3+ pieces of evidence.
import React from "react";
import { AbsoluteFill, Img, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { bh } from "./palette";
import { CLOCK0, CLOCK1, CUT, FROZEN, LINE, STOLEN, VO_RATE } from "./timeline";
import { PRESENTER } from "./presenter";
import { Boom, Caption, Chapter, Clock, clamp, dots, Flash, Glitch, img, InkClip, Inked, InkBg, media, Money, MONO, Panel, Print, ramp, RedString, sp, SpeedLines, Stamp2, Subscribe, Tag, WIDE, X0 } from "./ui";

/* ------------------------------------------------------------ face */

/**
 * When each HeyGen slice is on screen. The hook slice is lip-synced to the
 * first 1.62 s of the original take and stops before its «Смотри»; the ask
 * slice starts on its words inside the CTA line.
 */
const FACE = {
  hook: { from: 0, to: CUT.faceEnd },
  ask: { from: CUT.ask, to: CUT.ask + PRESENTER.ask.duration / VO_RATE },
} as const;
type Shot = keyof typeof FACE;

/** The presenter inside a comic panel; `children` fill the panel when the face is off. */
const FacePanel: React.FC<{ x: number; y: number; w: number; h: number; rot: number; age: number; fps: number; t: number; shot: Shot; children: React.ReactNode }> = ({ x, y, w, h, rot, age, fps, t, shot, children }) => {
  const f = FACE[shot];
  const talking = t >= f.from && t < f.to;
  const sinceSwap = Math.min(Math.abs(t - f.from), Math.abs(t - f.to));
  return (
    <Panel x={x} y={y} w={w} h={h} rot={rot} age={age} fps={fps} from="top" bg={bh.ink}>
      <Glitch amount={shot === "hook" && t < 0.2 ? 0 : interpolate(sinceSwap, [0, 0.15], [0.8, 0], clamp)} style={{ position: "absolute", inset: 0 }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: w, height: h, overflow: "hidden" }}>
          {talking ? (
            <Sequence from={Math.round(f.from * fps)} layout="none">
              <OffthreadVideo src={staticFile(`presenter/binance-hack/${PRESENTER[shot].file}`)} muted playbackRate={VO_RATE} style={{ position: "absolute", width: 1080 * 1.7, left: w / 2 - 540 * 1.7, top: h * 0.55 - 860 * 1.7, filter: "contrast(1.15) saturate(0.85)" }} />
            </Sequence>
          ) : (
            children
          )}
          {talking && <div style={{ position: "absolute", inset: 0, backgroundImage: dots("rgba(0,0,0,0.5)", 9, 22), backgroundSize: "9px 9px", mixBlendMode: "multiply", opacity: 0.5 }} />}
        </div>
      </Glitch>
    </Panel>
  );
};

/* ------------------------------------------------------------ pieces */

const BinanceLogo: React.FC<{ w: number; style?: React.CSSProperties }> = ({ w, style }) => (
  <div style={{ position: "absolute", filter: `drop-shadow(5px 0 0 ${bh.ink}) drop-shadow(-5px 0 0 ${bh.ink}) drop-shadow(0 5px 0 ${bh.ink}) drop-shadow(0 -5px 0 ${bh.ink}) drop-shadow(10px 12px 0 ${bh.ink})`, ...style }}>
    <Img src={img("binance.svg")} style={{ width: w, display: "block" }} />
  </div>
);

/** A coin badge: a crypto logo on a round inked token. */
const Badge: React.FC<{ src: string; size: number; bg: string; pad?: number }> = ({ src, size, bg, pad = 0.18 }) => (
  <div style={{ width: size, height: size, borderRadius: size / 2, background: bg, border: `6px solid ${bh.ink}`, boxShadow: `6px 8px 0 ${bh.ink}`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
    <Img src={src} style={{ width: size * (1 - pad * 2), height: size * (1 - pad * 2), objectFit: "contain" }} />
  </div>
);

/** The coins that were in the vault: logos floating around the hook panel. */
const COINS = [
  { src: "logo-btc.svg", bg: bh.white, pad: 0.02, x: 22, y: 200, s: 140 },
  { src: "logo-eth.png", bg: bh.white, pad: 0.16, x: 925, y: 190, s: 130 },
  { src: "si-solana.svg", bg: bh.ink, pad: 0.22, x: 930, y: 620, s: 120 },
  { src: "si-xrp.svg", bg: bh.ink, pad: 0.24, x: 25, y: 660, s: 120 },
  { src: "tether.svg", bg: bh.white, pad: 0.08, x: 760, y: 820, s: 0 },
] as const;
const CoinOrbit: React.FC<{ t: number; fps: number }> = ({ t, fps }) => (
  <>
    {COINS.filter((c) => c.s > 0).map((c, i) => {
      const s = sp(t + 1 - i * 0.06, fps, "bouncy");
      return (
        <div key={c.src} style={{ position: "absolute", left: c.x, top: c.y + Math.sin(t * 2.2 + i * 1.7) * 14, transform: `rotate(${Math.sin(t * 1.4 + i) * 12}deg) scale(${s})` }}>
          <Badge src={img(c.src)} size={c.s} bg={c.bg} pad={c.pad} />
        </div>
      );
    })}
  </>
);

/**
 * Bitcoin crashing on a candle chart, drawn live: candles print one by one,
 * the last ones fall hard, the price tag ticks down. Illustrative shape; the
 * only figure on it is the sourced «ниже $77 000».
 */
const CANDLES = Array.from({ length: 22 }, (_, i) => {
  const base = i < 12 ? 80.6 + Math.sin(i * 1.3) * 0.35 : 80.6 - Math.pow(i - 11, 1.35) * 0.17;
  const o = base + Math.sin(i * 2.1) * 0.18;
  const c = i < 12 ? base + Math.cos(i * 1.7) * 0.25 : base - 0.38;
  return { o, c, h: Math.max(o, c) + 0.15 + (i % 3) * 0.06, l: Math.min(o, c) - 0.15 - (i % 4) * 0.05 };
});
const CrashChart: React.FC<{ t: number; at: number; w: number; h: number }> = ({ t, at, w, h }) => {
  const k = ramp(t, at, at + 2.4, "out");
  const n = Math.max(1, Math.round(k * CANDLES.length));
  const lo = 76.2, hi = 81.4;
  const y = (v: number) => h - 70 - ((v - lo) / (hi - lo)) * (h - 150);
  const cw = (w - 80) / CANDLES.length;
  const last = CANDLES[n - 1].c;
  const price = Math.round(last * 1000);
  return (
    <div style={{ position: "absolute", inset: 0, background: "#0E0E12" }}>
      <svg width={w} height={h} style={{ position: "absolute", inset: 0 }}>
        {[0, 1, 2, 3, 4].map((g) => <line key={g} x1={0} x2={w} y1={60 + g * ((h - 130) / 4)} y2={60 + g * ((h - 130) / 4)} stroke="rgba(255,255,255,0.08)" strokeWidth={2} />)}
        <line x1={0} x2={w} y1={y(77)} y2={y(77)} stroke={bh.paper} strokeWidth={3} strokeDasharray="14 10" opacity={0.6} />
        {CANDLES.slice(0, n).map((c, i) => {
          const up = c.c >= c.o;
          const col = up ? "#1FCB7A" : bh.red;
          const x = 40 + i * cw + cw / 2;
          return (
            <g key={i}>
              <line x1={x} x2={x} y1={y(c.h)} y2={y(c.l)} stroke={col} strokeWidth={4} />
              <rect x={x - cw * 0.34} width={cw * 0.68} y={y(Math.max(c.o, c.c))} height={Math.max(4, Math.abs(y(c.o) - y(c.c)))} fill={col} stroke={bh.ink} strokeWidth={2} />
            </g>
          );
        })}
      </svg>
      <div style={{ position: "absolute", left: 22, top: 18, fontFamily: MONO, fontWeight: 800, fontSize: 30, color: bh.paper }}>BTC / USDT</div>
      <div style={{ position: "absolute", right: 22, top: 14, fontFamily: MONO, fontWeight: 800, fontSize: 40, color: last < 80 ? bh.red : "#1FCB7A" }}>{"$" + String(price).replace(/\B(?=(\d{3})+(?!\d))/g, " ")}</div>
      <div style={{ position: "absolute", left: 22, bottom: 20, background: bh.red, border: `5px solid ${bh.ink}`, padding: "6px 14px", fontFamily: MONO, fontWeight: 800, fontSize: 30, color: bh.white, opacity: n > 16 ? 1 : 0 }}>БИТКОИН НИЖЕ $77 000</div>
    </div>
  );
};

/** One node of the theft chain: a picture in a circle and a caption. */
const Node: React.FC<{ age: number; fps: number; y: number; label: string; sub: string; hot?: boolean; children: React.ReactNode }> = ({ age, fps, y, label, sub, hot = false, children }) => {
  if (age < 0) return null;
  const s = sp(age, fps, "bouncy");
  return (
    <div style={{ position: "absolute", left: 90, top: y, display: "flex", alignItems: "center", gap: 30, transform: `translateX(${(1 - s) * -400}px)`, opacity: Math.min(1, s * 2) }}>
      <div style={{ position: "relative", width: 170, height: 170, borderRadius: 85, overflow: "hidden", background: bh.paper, border: `8px solid ${hot ? bh.red : bh.ink}`, boxShadow: `8px 10px 0 ${bh.ink}` }}>{children}</div>
      <div style={{ background: hot ? bh.red : bh.paper, border: `6px solid ${bh.ink}`, boxShadow: `8px 8px 0 ${bh.ink}`, padding: "10px 22px", maxWidth: 640 }}>
        <div style={{ fontFamily: WIDE, fontWeight: 900, fontSize: 40, color: hot ? bh.white : bh.ink, lineHeight: 1.05 }}>{label}</div>
        <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 24, color: hot ? bh.white : bh.ink, opacity: 0.8, marginTop: 4 }}>{sub}</div>
      </div>
    </div>
  );
};

/** Down-arrow between two nodes with a coin sliding along it. */
const Link: React.FC<{ y: number; draw: number; t: number; coin?: boolean }> = ({ y, draw, t, coin = false }) => {
  if (draw <= 0) return null;
  const len = 70;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <path d={`M175 ${y} L175 ${y + len * draw}`} stroke={bh.red} strokeWidth={14} strokeLinecap="round" />
      {draw > 0.95 && <path d={`M150 ${y + len - 14} L175 ${y + len + 12} L200 ${y + len - 14} Z`} fill={bh.red} stroke={bh.ink} strokeWidth={4} />}
      {coin && <image href={img("coin.png")} x={145} y={y - 20 + ((t * 2.6) % 1) * len} width={60} height={60} />}
    </svg>
  );
};

/** Corkboard with a dark noir light pool. */
const Board: React.FC<{ t: number }> = ({ t }) => (
  <AbsoluteFill style={{ background: bh.cork }}>
    <div style={{ position: "absolute", inset: 0, backgroundImage: dots("rgba(0,0,0,0.35)", 7, 30), backgroundSize: "7px 7px" }} />
    <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at ${50 + Math.sin(t * 0.7) * 6}% 38%, rgba(255,230,170,0.22), rgba(0,0,0,0.75) 70%)` }} />
  </AbsoluteFill>
);

/** The vacancy letter: how the group usually gets in. */
const Letter: React.FC<{ x: number; y: number; age: number; fps: number; rot?: number; scale?: number }> = ({ x, y, age, fps, rot = -5, scale = 1 }) => {
  if (age < 0) return null;
  const s = sp(age, fps, "bouncy");
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 620, transform: `rotate(${rot}deg) scale(${interpolate(s, [0, 1], [0.3, 1]) * scale})`, transformOrigin: "left top", opacity: Math.min(1, s * 2), background: bh.white, border: `7px solid ${bh.ink}`, boxShadow: `14px 16px 0 ${bh.ink}`, fontFamily: MONO }}>
      <div style={{ background: bh.ink, color: bh.paper, padding: "12px 20px", fontSize: 26, fontWeight: 700, letterSpacing: "0.1em" }}>ВХОДЯЩИЕ · HR</div>
      <div style={{ padding: "18px 24px" }}>
        <div style={{ fontSize: 24, color: bh.grey, fontWeight: 700 }}>Тема:</div>
        <div style={{ fontFamily: WIDE, fontWeight: 900, fontSize: 44, color: bh.ink, lineHeight: 1.1, marginTop: 4 }}>ВАКАНСИЯ: SENIOR DEVOPS</div>
        <div style={{ fontSize: 26, color: bh.ink, marginTop: 10, fontWeight: 700 }}>Пройдите тестовое задание:</div>
        <div style={{ marginTop: 12, display: "inline-flex", alignItems: "center", gap: 12, border: `5px solid ${bh.red}`, padding: "10px 16px", fontSize: 30, fontWeight: 800, color: bh.red }}>
          <span style={{ width: 28, height: 34, background: bh.red, display: "inline-block", clipPath: "polygon(0 0, 70% 0, 100% 25%, 100% 100%, 0 100%)" }} />
          тестовое_задание.zip
        </div>
      </div>
    </div>
  );
};

/** One past case on the «wave» line. */
const Case: React.FC<{ age: number; fps: number; x: number; y: number; rot: number; logo: React.ReactNode; sum: string; date: string; hot?: boolean }> = ({ age, fps, x, y, rot, logo, sum, date, hot = false }) => {
  if (age < 0) return null;
  const s = sp(age, fps, "bouncy");
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 460, transform: `rotate(${rot}deg) scale(${interpolate(s, [0, 1], [1.8, 1])})`, opacity: Math.min(1, s * 2), background: hot ? bh.yellow : bh.paper, border: `7px solid ${bh.ink}`, boxShadow: `12px 14px 0 ${bh.ink}`, padding: 16 }}>
      <div style={{ height: 110, background: bh.ink, display: "flex", alignItems: "center", justifyContent: "center", border: `4px solid ${bh.ink}` }}>{logo}</div>
      <div style={{ fontFamily: WIDE, fontWeight: 900, fontSize: 50, color: hot ? bh.ink : bh.red, marginTop: 10, lineHeight: 1, whiteSpace: "nowrap" }}>{sum}</div>
      <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 24, color: bh.ink, marginTop: 6 }}>{date}</div>
    </div>
  );
};

/* ------------------------------------------------------------ story */

export const Story: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const cuts = [LINE.laptop, LINE.order, LINE.wave, CUT.people, CUT.vacancy, LINE.frozen, LINE.cta];
  const since = Math.min(...cuts.map((c) => (t >= c ? t - c : 99)));
  const flash = interpolate(since, [0, 0.12], [1, 0], clamp);
  const punch = 1 + interpolate(since, [0, 0.35], [0.06, 0], clamp);
  const glitch = interpolate(since, [0, 0.18], [0.9, 0], clamp);

  // the counter drains while the exchange signs its own withdrawals
  const drained = ramp(t, CUT.drain, LINE.wave - 0.3, "inOut");
  const left = STOLEN * (1 - drained);
  const clock = CLOCK0 + (CLOCK1 - CLOCK0) * ramp(t, 0, LINE.wave, "inOut");

  let world: React.ReactNode;
  let overlay: React.ReactNode;

  if (t < LINE.laptop) {
    /* 0. Hook: the case opens. Frame 0 = the full vault, the coins and the number. */
    const age = t + 1; // frame 0 is already a finished page
    world = (
      <>
        <InkBg src={img("bg-vault.jpg")} t={t} dark={0.12} />
        <SpeedLines t={t} cy={1180} opacity={0.35} />
      </>
    );
    overlay = (
      <>
        <div style={{ position: "absolute", left: X0, top: 160, fontFamily: MONO, fontWeight: 800, fontSize: 28, letterSpacing: "0.2em", color: bh.paper, background: bh.red, padding: "8px 18px", border: `5px solid ${bh.ink}`, transform: "rotate(-2deg)" }}>ДЕЛО № 29.10.2026</div>
        <FacePanel x={170} y={250} w={740} h={560} rot={-2} age={age} fps={fps} t={t} shot="hook">
          <CrashChart t={t} at={CUT.faceEnd} w={740} h={560} />
        </FacePanel>
        <CoinOrbit t={t} fps={fps} />
        <BinanceLogo w={460} style={{ left: 300, top: 860, transform: `rotate(-3deg) scale(${1 + Math.sin(t * 3) * 0.01})` }} />
        <div style={{ position: "absolute", left: 80, right: 0, top: 960 }}>
          <Money value={STOLEN} short size={130} pop={interpolate(t - CUT.money, [0, 0.35], [1, 0], clamp) * (t >= CUT.money ? 1 : 0)} style={{ transform: "rotate(-3deg)" }} />
        </div>
        <div style={{ position: "absolute", left: 90, top: 1110, transform: `rotate(-3deg) scale(${1 + Math.sin(t * 6) * 0.015})`, fontFamily: WIDE, fontWeight: 900, fontSize: 76, color: bh.red, WebkitTextStroke: `8px ${bh.ink}`, paintOrder: "stroke fill", textShadow: `6px 8px 0 ${bh.ink}`, whiteSpace: "nowrap" }}>БЫЛО УКРАДЕНО!</div>
        <Caption age={age} fps={fps} y={1265} rot={1.5} text="ЗА 20 МИНУТ" />
        <Clock secs={clock} t={t} x={430} y={1258} size={48} />
        {t < CUT.teaser ? (
          <Stamp2 age={t - 1.6} fps={fps} text="КРУПНЕЙШАЯ КРАЖА" size={58} rot={-6} style={{ left: 110, top: 1420 }} />
        ) : (
          <Caption age={t - CUT.teaser} fps={fps} y={1410} rot={-2} text="ВСЁ НАЧАЛОСЬ С ОДНОГО НОУТБУКА" tone="ink" />
        )}
      </>
    );
  } else if (t < LINE.order) {
    /* 1. The weapon: one DevOps engineer and his laptop. */
    const age = t - LINE.laptop;
    const hacked = t >= CUT.hack;
    const hk = sp(t - CUT.hack, fps, "snappy");
    world = (
      <>
        <AbsoluteFill style={{ background: bh.paper }} />
        <SpeedLines t={t} cy={1000} color={hacked ? bh.red : bh.ink} opacity={0.18 + hk * 0.25} />
      </>
    );
    overlay = (
      <>
        <Chapter age={age} fps={fps} n={1} title="ОРУЖИЕ" />
        <Panel x={70} y={290} w={940} h={760} rot={-1.2} age={age - 0.05} fps={fps} from="left" bg={bh.inkSoft}>
          <InkClip src={media("clip-keys.mp4")} at={LINE.laptop} fps={fps} tint={hacked ? bh.red : bh.paperShade} dark={0.2} />
          <div style={{ position: "absolute", left: 300, top: 70, width: 600, transform: `scale(${1.02 + age * 0.012})` }}>
            <Inked src={img("fig-laptop.png")} w={600} h={733} outline={5} dot={0.25} style={{ position: "relative" }} />
            <svg viewBox="0 0 809 989" width={600} height={733} style={{ position: "absolute", left: 0, top: 0 }}>
              <polygon points="38,450 573,351 598,725 63,794" fill={hacked ? bh.red : bh.paper} opacity={hacked ? 0.92 : 0} />
            </svg>
            {hacked && (
              <div style={{ position: "absolute", left: 50, top: 380, width: 450, transform: "rotate(-8deg) skewY(-2deg)", textAlign: "center", fontFamily: MONO, fontWeight: 800, color: bh.white, opacity: Math.sin(t * 14) > -0.6 ? 1 : 0.4 }}>
                <div style={{ fontSize: 36 }}>ДОСТУП</div>
                <div style={{ fontSize: 36 }}>ПОЛУЧЕН</div>
              </div>
            )}
          </div>
        </Panel>
        {/* the engineer himself, cut out and inked, cup in hand */}
        <div style={{ position: "absolute", left: 40, top: 760, transform: `rotate(-3deg) scale(${interpolate(sp(age - 0.2, fps, "bouncy"), [0, 1], [0.4, 1])})`, transformOrigin: "left bottom" }}>
          <Glitch amount={hacked ? interpolate(t - CUT.hack, [0, 0.4], [0.7, 0.08], clamp) : 0}>
            <Inked src={img("fig-devops.png")} w={560} h={537} outline={9} dot={0.22} color tint={hacked ? "#FFB3B3" : undefined} style={{ position: "relative" }} />
          </Glitch>
        </div>
        <Tag n={1} label="DEVOPS-ИНЖЕНЕР BINANCE" x={90} y={1330} age={age - 0.4} fps={fps} rot={-2} />
        {!hacked && <Caption age={age - 0.15} fps={fps} y={1450} rot={1.5} text="ШИФР НИКТО НЕ ЛОМАЛ" tone="ink" />}
        {hacked && <Caption age={t - CUT.hack} fps={fps} y={1450} rot={1.5} text="ЕГО НОУТБУК ВЗЛОМАЛИ" tone="ink" />}
        {hacked && <Stamp2 age={t - CUT.hack - 0.15} fps={fps} text="ВЗЛОМАН" size={84} rot={-12} style={{ left: 330, top: 330 }} />}
        <Boom age={t - CUT.hack} fps={fps} text="КЛИК!" x={760} y={1150} size={120} rot={10} color={bh.yellow} />
      </>
    );
  } else if (t < LINE.wave) {
    /* 2. The order: laptop → Binance server → Binance wallet → hacker. */
    const age = t - LINE.order;
    const rows = [300, 540, 780, 1020];
    world = (
      <>
        <InkClip src={media("clip-servers.mp4")} at={LINE.order} fps={fps} dark={0.45} />
        <SpeedLines t={t} cx={540} cy={1500} color={bh.ink} opacity={0.35} />
      </>
    );
    const flowing = t >= CUT.drain;
    overlay = (
      <>
        <Chapter age={age} fps={fps} n={2} title="ПРИКАЗ" />
        <Node age={age - 0.05} fps={fps} y={rows[0]} label="НОУТБУК ИНЖЕНЕРА" sub="ХАКЕРЫ ВНУТРИ" hot>
          <Img src={img("fig-laptop.png")} style={{ position: "absolute", width: 230, left: -30, top: -60, filter: "grayscale(1) contrast(1.4)" }} />
        </Node>
        <Link y={rows[0] + 170} draw={ramp(t, LINE.order + 0.3, LINE.order + 0.6, "out")} t={t} />
        <Node age={t - CUT.order} fps={fps} y={rows[1]} label="СЕРВЕР BINANCE" sub="ПРИКАЗ: ВЫВЕСТИ ВСЁ">
          <InkClip src={media("clip-servers.mp4")} at={LINE.order} fps={fps} dark={0.1} />
        </Node>
        <Link y={rows[1] + 170} draw={ramp(t, CUT.order + 0.5, CUT.order + 0.8, "out")} t={t} />
        <Node age={t - CUT.order - 0.6} fps={fps} y={rows[2]} label="КОШЕЛЁК БИРЖИ" sub="ПОДПИСЫВАЕТ САМ">
          <div style={{ position: "absolute", inset: 0, background: bh.ink, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Img src={img("binance.svg")} style={{ width: 400, marginLeft: 270, transform: "scale(1)" }} />
          </div>
        </Node>
        <Link y={rows[2] + 170} draw={ramp(t, CUT.drain, CUT.drain + 0.3, "out")} t={t} coin={flowing} />
        <Node age={t - CUT.drain - 0.2} fps={fps} y={rows[3]} label="КОШЕЛЬКИ ХАКЕРОВ" sub="10 БЛОКЧЕЙНОВ" hot>
          <Img src={img("fig-hacker.png")} style={{ position: "absolute", width: 200, left: -15, top: 0, filter: "grayscale(1) brightness(0.5)" }} />
        </Node>
        <div style={{ position: "absolute", left: X0, top: 1260, fontFamily: MONO, fontWeight: 800, fontSize: 28, color: bh.paper, letterSpacing: "0.14em" }}>ОСТАЛОСЬ В КОШЕЛЬКЕ BINANCE</div>
        <div style={{ position: "absolute", left: 80, top: 1305 }}>
          <Money value={left} size={112} pop={drained > 0 && drained < 1 ? Math.abs(Math.sin(t * 20)) * 0.3 : 0} />
        </div>
        <Clock secs={clock} t={t} x={X0} y={1470} size={48} />
        <Boom age={t - CUT.drain} fps={fps} text="ВЖУХ!" x={740} y={1590} size={120} rot={-10} len={1.6} />
      </>
    );
  } else if (t < LINE.frozen) {
    /* 3. Why a wave → who → how: three beats on one board. */
    const age = t - LINE.wave;
    world = <Board t={t} />;
    if (t < CUT.people) {
      // «Почему волна?»: the cases line up, each bigger than the last
      overlay = (
        <>
          <Chapter age={age} fps={fps} n={3} title="ВОЛНА ВЗЛОМОВ" />
          <Case age={age} fps={fps} x={70} y={1120} rot={-5} sum="$1,5 МЛРД" date="BYBIT · ФЕВРАЛЬ 2025" logo={<Img src={img("bybit.svg")} style={{ width: 250, filter: "invert(1)" }} />} />
          <Case age={age - 0.12} fps={fps} x={560} y={740} rot={4} sum="$351 МЛН" date="BITGET · СЕНТЯБРЬ 2026" logo={<div style={{ fontFamily: WIDE, fontWeight: 900, fontSize: 64, color: "#00F0FF" }}>Bitget</div>} />
          <Case age={age - 0.24} fps={fps} x={120} y={330} rot={-3} hot sum="$6,3 МЛРД" date="BINANCE · ОКТЯБРЬ 2026" logo={<Img src={img("binance.svg")} style={{ width: 320 }} />} />
          <RedString a={[300, 1150]} b={[790, 770]} draw={ramp(t, LINE.wave + 0.15, LINE.wave + 0.45, "out")} t={t} />
          <RedString a={[790, 770]} b={[350, 360]} draw={ramp(t, LINE.wave + 0.3, LINE.wave + 0.6, "out")} t={t} />
          <Stamp2 age={age - 0.35} fps={fps} text="СЛЕД КНДР?" size={56} rot={-6} style={{ left: 470, top: 1290 }} />
        </>
      );
    } else if (t < CUT.vacancy) {
      // «Бьют не по коду, а по людям»: who
      const pa = t - CUT.people;
      const kim: [number, number] = [300, 520];
      const lz: [number, number] = [790, 520];
      overlay = (
        <>
          <Chapter age={99} fps={fps} n={3} title="ПОДОЗРЕВАЕМЫЕ" />
          <Caption age={pa - 0.05} fps={fps} y={250} x={X0} rot={-1} text="БЬЮТ НЕ ПО КОДУ, А ПО ЛЮДЯМ" tone="ink" />
          <RedString a={kim} b={lz} draw={ramp(t, CUT.people + 0.4, CUT.people + 0.8, "out")} t={t} />
          <Print x={90} y={340} w={420} h={420} rot={-4} age={pa} fps={fps} label="КНДР" sub="ГОСУДАРСТВО" tone="bad">
            <div style={{ position: "absolute", inset: 0, background: bh.paperShade }}>
              {[0, 1, 2, 3, 4, 5].map((i) => <div key={i} style={{ position: "absolute", left: 0, right: 0, top: 30 + i * 68, height: 3, background: bh.ink, opacity: 0.35 }} />)}
            </div>
            <Inked src={img("fig-kim.png")} w={360} outline={3} dot={0.3} tint={bh.paper} style={{ left: 10, top: 40 }} />
            <Img src={img("flag-kp.svg")} style={{ position: "absolute", right: 10, top: 10, width: 110, border: `3px solid ${bh.ink}` }} />
          </Print>
          <Print x={580} y={340} w={420} h={420} rot={5} age={pa - 0.2} fps={fps} label="LAZARUS" sub="ХАКЕРЫ КНДР · TRADERTRAITOR" tone="bad">
            <Img src={img("kp-print.png")} style={{ position: "absolute", height: "100%", left: "50%", transform: `translateX(-50%) scale(${1.05 + pa * 0.03})`, filter: "contrast(1.2) saturate(1.2)" }} />
          </Print>
          <Inked src={img("fig-hacker.png")} w={520} outline={7} dot={0.4} style={{ left: 280, top: 940, filter: "brightness(0.35)", transform: `scale(${interpolate(sp(pa - 0.35, fps, "smooth"), [0, 1], [0.6, 1])})` }} />
          <div style={{ position: "absolute", left: 0, right: 0, top: 1000, textAlign: "center", fontFamily: WIDE, fontWeight: 900, fontSize: 220, color: bh.red, WebkitTextStroke: `12px ${bh.ink}`, paintOrder: "stroke fill", opacity: pa > 0.5 ? 1 : 0 }}>?</div>
          <div style={{ position: "absolute", left: X0, top: 1600, fontFamily: MONO, fontSize: 18, color: bh.grey, opacity: 0.8 }}>Фото: kremlin.ru, CC BY 4.0</div>
        </>
      );
    } else {
      // «Фейковая вакансия и тестовое задание с вирусом»: how
      const va = t - CUT.vacancy;
      const vir = t >= CUT.virus;
      overlay = (
        <>
          <Chapter age={99} fps={fps} n={3} title="ИХ ПРИЁМ" />
          <Letter x={110} y={320} age={va} fps={fps} rot={-4} />
          <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
            <path d="M540 820 L540 960" stroke={bh.red} strokeWidth={14} strokeLinecap="round" strokeDasharray="140" strokeDashoffset={140 * (1 - ramp(t, CUT.virus - 0.2, CUT.virus + 0.1, "out"))} />
            {vir && <path d="M510 950 L540 990 L570 950 Z" fill={bh.red} stroke={bh.ink} strokeWidth={4} />}
          </svg>
          {vir && (
            <Panel x={150} y={1010} w={780} h={420} rot={2} age={t - CUT.virus} fps={fps} from="bottom" bg={bh.red}>
              <InkClip src={media("clip-keys.mp4")} at={CUT.virus} fps={fps} tint={bh.red} dark={0.35} />
              <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center", fontFamily: WIDE, fontWeight: 900, fontSize: 110, color: bh.white, WebkitTextStroke: `9px ${bh.ink}`, paintOrder: "stroke fill" }}>ВИРУС</div>
              <div style={{ position: "absolute", left: 0, right: 0, top: 230, textAlign: "center", fontFamily: MONO, fontWeight: 800, fontSize: 34, color: bh.white }}>НА РАБОЧЕМ НОУТБУКЕ</div>
            </Panel>
          )}
          <Tag n={3} label="ТАК В 2024 ОГРАБИЛИ DMM BITCOIN" x={90} y={1480} age={va - 0.5} fps={fps} rot={-2} />
          <Boom age={t - CUT.virus} fps={fps} text="ЩЁЛК!" x={820} y={930} size={100} rot={12} color={bh.yellow} />
        </>
      );
    }
  } else if (t < LINE.cta) {
    /* 4. The trail: what was frozen, and the bitcoin nobody can freeze. */
    const age = t - LINE.frozen;
    const ba = t - CUT.btc;
    world = <InkClip src={media("clip-ice.mp4")} at={LINE.frozen} fps={fps} tint="#BFE6FF" dark={0.3} />;
    const pile = [
      { x: 120, y: 1010, s: 300, r: -14 },
      { x: 380, y: 940, s: 360, r: 8 },
      { x: 660, y: 1030, s: 290, r: 20 },
      { x: 250, y: 1200, s: 250, r: -30 },
      { x: 560, y: 1230, s: 270, r: 34 },
    ];
    overlay = (
      <>
        <Chapter age={age} fps={fps} n={4} title="СЛЕД" />
        <Panel x={90} y={300} w={900} h={500} rot={-2} age={age - 0.05} fps={fps} from="left" bg="#DDF2FF">
          <div style={{ position: "absolute", inset: 0, backgroundImage: dots("rgba(30,90,140,0.35)", 10, 26), backgroundSize: "10px 10px" }} />
          <div style={{ position: "absolute", left: 50, top: 50, fontFamily: MONO, fontWeight: 800, fontSize: 30, color: bh.ink, letterSpacing: "0.14em" }}>ЗАМОРОЖЕНО</div>
          <div style={{ position: "absolute", left: 40, top: 110 }}>
            <Money value={FROZEN * ramp(t, LINE.frozen + 0.2, LINE.frozen + 1.4, "out")} size={104} color={bh.white} short />
          </div>
          <Img src={img("tether.svg")} style={{ position: "absolute", left: 50, top: 300, width: 330 }} />
          <div style={{ position: "absolute", left: 420, top: 316, fontFamily: WIDE, fontWeight: 900, fontSize: 52, color: "#2775CA" }}>USDC</div>
        </Panel>
        <Boom age={age - 0.3} fps={fps} text="ДЗЫНЬ!" x={780} y={300} size={100} rot={8} color={bh.white} />
        {ba >= 0 && pile.map((c, i) => {
          const s = sp(ba - i * 0.07, fps, "bouncy");
          return (
            <div key={i} style={{ position: "absolute", left: c.x, top: c.y - (1 - s) * 700 + Math.sin(t * 2 + i) * 6, transform: `rotate(${c.r + Math.sin(t * 1.5 + i) * 4}deg)`, opacity: Math.min(1, s * 3) }}>
              <Inked src={img("coin.png")} w={c.s} h={c.s} outline={7} dot={0.1} color style={{ position: "relative" }} />
            </div>
          );
        })}
        {ba >= 0 && (
          <div style={{ position: "absolute", left: 90, top: 860, transform: `rotate(-3deg) scale(${sp(ba - 0.2, fps)})`, transformOrigin: "left center", background: bh.paper, border: `6px solid ${bh.ink}`, boxShadow: `10px 10px 0 ${bh.ink}`, padding: "10px 22px" }}>
            <span style={{ fontFamily: WIDE, fontWeight: 900, fontSize: 64, color: bh.ink }}>18 270 BTC</span>
            <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 26, color: bh.ink, marginLeft: 18 }}>У ХАКЕРОВ</span>
          </div>
        )}
        <Stamp2 age={ba - 0.45} fps={fps} text="НЕ ЗАМОРОЗИТЬ" size={72} rot={-8} style={{ left: 100, top: 1460 }} />
      </>
    );
  } else {
    /* 5. The verdict: the vault is empty, the case stays open. */
    const age = t - LINE.cta;
    world = <InkBg src={img("bg-vault.jpg")} t={t} dark={0.6} />;
    overlay = (
      <>
        <Chapter age={age} fps={fps} n={5} title="ДЕЛО ОТКРЫТО" />
        <FacePanel x={170} y={300} w={740} h={560} rot={2} age={age} fps={fps} t={t} shot="ask">
          <InkClip src={media("clip-servers.mp4")} at={LINE.cta} fps={fps} dark={0.2} />
        </FacePanel>
        <div style={{ position: "absolute", left: 80, top: 940 }}>
          <div style={{ fontFamily: WIDE, fontWeight: 900, fontSize: 120, color: bh.red, WebkitTextStroke: `10px ${bh.ink}`, paintOrder: "stroke fill", textShadow: `6px 8px 0 ${bh.ink}`, transform: "rotate(-3deg)" }}>−$6,3 МЛРД</div>
        </div>
        <Caption age={age - 0.2} fps={fps} y={1110} rot={1} text="BINANCE ОБЕЩАЕТ ВЕРНУТЬ ВСЁ" />
        <Caption age={t - CUT.ask} fps={fps} y={1230} rot={-1.5} text="А ТЫ ДЕРЖИШЬ КРУПНОЕ НА БИРЖЕ?" tone="ink" />
        <Stamp2 age={age - 0.5} fps={fps} text="ПУСТО" size={70} rot={12} style={{ left: 700, top: 760 }} />
        <Subscribe t={t} at={CUT.comment - 0.2} tapAt={CUT.tap} fps={fps} top={1360} ask="ПИШИ В КОММЕНТАРИЯХ" />
      </>
    );
  }

  return (
    <AbsoluteFill style={{ background: bh.night, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${punch})` }}>
        <Glitch amount={glitch} style={{ position: "absolute", inset: 0 }}>
          <AbsoluteFill>{world}</AbsoluteFill>
        </Glitch>
      </AbsoluteFill>
      {overlay}
      <Flash amount={flash} color={bh.white} />
    </AbsoluteFill>
  );
};
