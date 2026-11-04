// The whole reel as one function of reel time t: five worlds cut on the
// voice lines (timeline.ts), each world posed from t so any frame is final.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../theme";
import { fx } from "./palette";
import { Beam, Bulbs, Card, CargoTrain, Parcel, Chip, ChipStack, Cloud, Confetti, FarPlane, Fred, FuelTruck, Jet, Marshaller, Mood, Moon, Onlooker, Safe, SlotMachine, WallClock, WIDE } from "./toon";
import { clamp, Flash, FuelBar, Headline, MoneyPop, MONO, out, Paper, Pill, PopIn, ramp, Slam, sp, Subscribe, usd, X0 } from "./ui";
import { BANK0, CUT, FUEL, HANDS, LINE } from "./timeline";

const O = fx.outline;

/* ------------------------------------------------------------ props */

const Bundle: React.FC<{ x: number; y: number; scale?: number; rot?: number }> = ({ x, y, scale = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${scale})`}>
    {[12, 6, 0].map((d) => (
      <rect key={d} x={-90 + d} y={-48 - d} width={180} height={92} rx={8} fill={fx.paper} stroke={O} strokeWidth={4} />
    ))}
    <rect x={-18} y={-60} width={36} height={92} fill={fx.orange} stroke={O} strokeWidth={4} />
    <text x={-56} y={6} textAnchor="middle" fontFamily={WIDE} fontWeight={900} fontSize={40} fill={fx.purple}>$</text>
    <text x={56} y={6} textAnchor="middle" fontFamily={WIDE} fontWeight={900} fontSize={40} fill={fx.purple}>$</text>
  </g>
);

const Lock: React.FC<{ x: number; y: number; rot?: number; scale?: number }> = ({ x, y, rot = 0, scale = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${scale})`}>
    <path d="M-16 0 L-16 -18 Q-16 -36 0 -36 Q16 -36 16 -18 L16 0" fill="none" stroke={fx.ink} strokeWidth={8} />
    <rect x={-26} y={-4} width={52} height={44} rx={8} fill={fx.red} stroke={O} strokeWidth={4} />
    <circle cx={0} cy={14} r={6} fill={fx.ink} />
  </g>
);

const Box: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-20} y={-16} width={40} height={32} rx={3} fill={fx.box} stroke={O} strokeWidth={3} />
    <rect x={-5} y={-16} width={10} height={32} fill={fx.purple} />
    <path d="M-20 -6 L20 -6" stroke={fx.boxLo} strokeWidth={2} />
  </g>
);

/* ------------------------------------------------------------ worlds */

/** Memphis airport. Night by default; `dawn` warms the sky (Monday); `takeoff` rolls the jets out. */
const Airport: React.FC<{ t: number; dawn?: number; takeoff?: number; mood: Mood; sweat: boolean; shake?: number; lockOff?: number; showFred?: boolean; tow?: boolean }> = ({ t, dawn = 0, takeoff = 0, mood, sweat, shake = 0, lockOff = -1, showFred = true, tow = false }) => {
  const push = 1 + Math.min(1, t / 8) * 0.04;
  const sx = Math.sin(t * 70) * 14 * shake;
  const blink = Math.sin(t * 5) > 0 ? 1 : 0.3;
  const k1 = takeoff;
  const k2 = Math.max(0, takeoff - 0.25) / 0.75;
  const lockAge = lockOff < 0 ? -1 : lockOff;
  // no fuel, so the jets move on tugs: the middle one is pushed back across the apron
  const midX = tow ? 900 - Math.min(t, 8.5) * 34 : 760 + k2 * 700;
  const farX = tow ? 180 + t * 22 : 250 + k2 * 900;
  const train = ((t * 150) % 2300) - 900;
  const sunY = 980 - dawn * 160;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      <defs>
        <linearGradient id="sky-n" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={fx.night} />
          <stop offset="1" stopColor={fx.purple} />
        </linearGradient>
        <linearGradient id="sky-d" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={fx.purple} />
          <stop offset="0.7" stopColor={fx.purpleHi} />
          <stop offset="1" stopColor={fx.dawn} />
        </linearGradient>
      </defs>
      <g transform={`translate(${540 + sx} 960) scale(${push}) translate(-540 -960)`}>
        <rect width={1080} height={1150} fill="url(#sky-n)" />
        <rect width={1080} height={1150} fill="url(#sky-d)" opacity={dawn} />
        {dawn > 0 && <circle cx={300} cy={sunY} r={110} fill={fx.dawn} opacity={dawn} />}
        {dawn > 0 && <circle cx={300} cy={sunY} r={190} fill={fx.dawn} opacity={0.25 * dawn} />}
        <g opacity={1 - dawn}>
          <Moon x={930} y={330} />
          <Beam x={230} y={960} ang={-30 + Math.sin(t * 0.9) * 22} color={fx.glass} opacity={0.09} />
          <Beam x={640} y={960} ang={24 + Math.sin(t * 0.7 + 1) * 24} color={fx.glass} opacity={0.08} />
        </g>
        <Cloud x={((t * 40 + 200) % 1500) - 250} y={760} s={1.1} />
        <Cloud x={((t * 25 + 900) % 1500) - 250} y={880} s={0.7} opacity={0.12} />
        <FarPlane x={-200 + ((t * 150) % 1500)} y={640 - ((t * 150) % 1500) * 0.06} t={t} s={1.1} />
        {Array.from({ length: 40 }, (_, i) => (
          <circle key={i} cx={(i * 263) % 1080} cy={60 + ((i * 137) % 600)} r={i % 3 === 0 ? 2.6 : 1.6} fill={fx.white} opacity={(0.3 + 0.3 * Math.sin(t * 2 + i)) * (1 - dawn)} />
        ))}
        {/* terminal + tower */}
        <rect x={0} y={960} width={1080} height={190} fill={fx.purpleLo} />
        {Array.from({ length: 22 }, (_, i) => (
          <rect key={i} x={20 + i * 48} y={1010} width={30} height={40} fill={i % 4 === 1 ? fx.purpleHi : fx.glass} opacity={i % 4 === 1 ? 0.5 : 0.85} />
        ))}
        <rect x={780} y={700} width={56} height={270} fill={fx.purpleLo} stroke={O} strokeWidth={4} />
        <path d="M740 700 L876 700 L860 620 L756 620 Z" fill={fx.glass} stroke={O} strokeWidth={4} />
        <rect x={730} y={690} width={156} height={16} fill={fx.purpleLo} stroke={O} strokeWidth={4} />
        <path d={`M808 612 L${808 + Math.cos(t * 3) * 46} 606`} stroke={O} strokeWidth={6} strokeLinecap="round" />
        <circle cx={808} cy={600} r={10} fill={fx.red} opacity={blink} />
        <circle cx={808} cy={600} r={28} fill={fx.red} opacity={0.25 * blink} />
        <text x={40} y={990} fontFamily={WIDE} fontWeight={900} fontSize={30} fill={fx.white} opacity={0.75} letterSpacing="0.1em">MEMPHIS</text>
        {/* tarmac */}
        <rect x={0} y={1150} width={1080} height={770} fill={fx.tarmac} />
        {[1230, 1420, 1700].map((ly, i) => (
          <path key={ly} d={`M0 ${ly} L1080 ${ly}`} stroke={fx.tarmacLine} strokeWidth={4 + i * 2} strokeDasharray="60 40" />
        ))}
        {Array.from({ length: 12 }, (_, i) => (
          <circle key={i} cx={40 + i * 92} cy={1160} r={6} fill={fx.orange} opacity={0.6 + 0.4 * Math.sin(t * 4 - i * 0.6)} />
        ))}
        <Jet x={farX} y={1170 - k2 * k2 * 300} scale={0.42} dim={0.35} />
        <g transform={`rotate(${-9 * k2} ${midX} 1225)`}>
          <Jet x={midX} y={1225 - k2 * k2 * 420} scale={0.6} dim={0.2} />
        </g>
        {tow && <CargoTrain x={midX + 226} y={1290} scale={0.5} carts={0} />}
        <CargoTrain x={train} y={1345} scale={0.72} carts={3} />
        <FuelTruck x={830} y={1520} scale={0.62} locked={lockAge < 0} />
        {lockAge >= 0 && lockAge < 1.2 && <Lock x={830 + 18 + lockAge * 260} y={1520 - 37 - lockAge * 600 + lockAge * lockAge * 300} rot={lockAge * 400} scale={0.62} />}
        <g transform={`rotate(${-16 * Math.min(1, k1 * 2.5)} ${560 + k1 * 650} ${1500 - Math.pow(k1, 1.6) * 1250})`}>
          <Jet x={560 + k1 * 650} y={1500 - Math.pow(k1, 1.6) * 1250} scale={1.12 - k1 * 0.35} chocks={k1 === 0} />
        </g>
        {/* the night's parcels waiting on a pallet */}
        <g transform={`translate(600 ${1858 - takeoff * 0})`}>
          <rect x={-170} y={-10} width={340} height={22} rx={4} fill={fx.boxLo} stroke={O} strokeWidth={4} />
          {[[-130, -32], [-86, -32], [-42, -32], [2, -32], [46, -32], [90, -32], [134, -32], [-108, -66], [-64, -66], [-20, -66], [24, -66], [68, -66], [112, -66], [-86, -100], [-42, -100], [2, -100], [46, -100], [90, -100], [-20, -134], [24, -134]].map(([px, py], i) => (
            <Parcel key={i} x={px} y={py + (i % 3 === 0 ? Math.sin(t * 3 + i) * 1.5 : 0)} />
          ))}
        </g>
        <Marshaller x={985} y={1850} t={t} scale={0.62} />
        {showFred && <Fred x={150 + Math.sin(t * 0.9) * 22} y={1890 + Math.sin(t * 2.4) * 3} scale={0.56} mood={mood} sweat={sweat} arms={takeoff > 0 ? "up" : "down"} />}
      </g>
    </svg>
  );
};

/** Fred alone under a spotlight with the last $5 000 in his hand. */
const CashWorld: React.FC<{ t: number; age: number; fps: number }> = ({ t, age, fps }) => {
  const s = sp(age, fps, "smooth");
  const bundle = sp(age - 0.35, fps, "bouncy");
  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      <rect width={1080} height={1920} fill={fx.purple} />
      <circle cx={540} cy={1240} r={interpolate(s, [0, 1], [200, 520])} fill={fx.purpleHi} opacity={0.6} />
      {Array.from({ length: 14 }, (_, i) => {
        const a = (i / 14) * Math.PI * 2 + t * 0.3;
        return <path key={i} d={`M540 1240 L${540 + Math.cos(a) * 1400} ${1240 + Math.sin(a) * 1400} L${540 + Math.cos(a + 0.12) * 1400} ${1240 + Math.sin(a + 0.12) * 1400} Z`} fill={fx.purpleHi} opacity={0.22} />;
      })}
      <rect x={0} y={1760} width={1080} height={160} fill={fx.purpleLo} />
      <rect x={0} y={1752} width={1080} height={12} fill={fx.orange} />
      <WallClock x={900} y={820} t={t} r={80} />
      <g transform="translate(900 1080) rotate(4)">
        <rect x={-80} y={-90} width={160} height={180} rx={10} fill={fx.white} stroke={O} strokeWidth={4} />
        <rect x={-80} y={-90} width={160} height={48} rx={10} fill={fx.orange} stroke={O} strokeWidth={4} />
        <text x={0} y={-56} textAnchor="middle" fontFamily={MONO} fontWeight={800} fontSize={24} fill={fx.white}>1973</text>
        <text x={0} y={40} textAnchor="middle" fontFamily={WIDE} fontWeight={900} fontSize={70} fill={fx.purple}>ПТ</text>
      </g>
      <Safe x={250} y={1756} scale={0.9} />
      <g transform="translate(250 1560) rotate(-6)">
        <rect x={-66} y={-26} width={132} height={52} rx={8} fill={fx.red} stroke={O} strokeWidth={4} />
        <text x={0} y={12} textAnchor="middle" fontFamily={WIDE} fontWeight={900} fontSize={30} fill={fx.white}>ПУСТО</text>
      </g>
      {[0, 1, 2].map((i) => {
        const k = interpolate(age, [0.05 + i * 0.12, 0.6 + i * 0.12], [0, 1], { easing: theme.ease.out, ...clamp });
        if (k <= 0 || k >= 1) return null;
        const bx = interpolate(k, [0, 1], [250, 624]);
        const by = interpolate(k, [0, 1], [1640, 1490]) - Math.sin(k * Math.PI) * 260;
        return <Bundle key={i} x={bx} y={by} scale={0.5} rot={k * 360} />;
      })}
      <g transform={`translate(0 ${interpolate(s, [0, 1], [120, 0])})`}>
        <Fred x={540} y={1760 + Math.sin(t * 2.4) * 3} scale={1.02} mood="allin" />
        <g transform={`translate(${540 + 84} ${1760 - 270 - Math.abs(Math.sin(t * 5)) * 8})`}>
          <Bundle x={0} y={0} scale={interpolate(bundle, [0, 1], [0.2, 1.3])} rot={-12 + Math.sin(t * 3) * 4} />
        </g>
      </g>
    </svg>
  );
};

/** The jet over the desert at night, Vegas glowing ahead. */
const FlightWorld: React.FC<{ t: number; age: number }> = ({ t, age }) => {
  const scroll = age * 520;
  const jx = interpolate(age, [0, 1.6], [260, 600], { easing: theme.ease.out, ...clamp });
  const ridge = (off: number, h: number, step: number) =>
    `M${-step} 1920 ` + Array.from({ length: 12 }, (_, i) => `L${i * step - ((scroll * off) % step) - step} ${1500 - h * (i % 2 ? 1 : 0.45)}`).join(" ") + ` L1200 1920 Z`;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      <defs>
        <linearGradient id="sky-f" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={fx.night} />
          <stop offset="0.8" stopColor={fx.purple} />
          <stop offset="1" stopColor={fx.orange} />
        </linearGradient>
      </defs>
      <rect width={1080} height={1920} fill="url(#sky-f)" />
      {Array.from({ length: 36 }, (_, i) => (
        <circle key={i} cx={(((i * 263) % 1180) - scroll * 0.1 + 1180 * 4) % 1180} cy={600 + ((i * 137) % 700)} r={i % 3 === 0 ? 2.6 : 1.6} fill={fx.white} opacity={0.5} />
      ))}
      <Moon x={900} y={780} r={60} />
      {/* Vegas skyline slides in on the right */}
      <g transform={`translate(${interpolate(age, [0.3, 1.5], [420, 0], { easing: theme.ease.out, ...clamp })} 0)`}>
        {[[860, 260], [930, 380], [1000, 300], [1050, 200]].map(([bx, bh], i) => (
          <g key={i}>
            <rect x={bx - 30} y={1520 - bh} width={60} height={bh} fill={fx.purpleLo} stroke={O} strokeWidth={3} />
            {Array.from({ length: Math.floor(bh / 40) }, (_, j) => (
              <rect key={j} x={bx - 16} y={1520 - bh + 16 + j * 40} width={32} height={14} fill={(i + j) % 3 ? fx.orangeHi : fx.glass} opacity={0.5 + 0.5 * Math.sin(t * 6 + i + j)} />
            ))}
          </g>
        ))}
      </g>
      {/* Vegas glow on the horizon */}
      <ellipse cx={1000} cy={1560} rx={360} ry={160} fill={fx.orange} opacity={0.35 + 0.1 * Math.sin(t * 6)} />
      <path d={ridge(0.25, 180, 190)} fill={fx.purpleLo} />
      <path d={ridge(0.6, 120, 240)} fill={fx.night} />
      {/* speed lines */}
      {Array.from({ length: 8 }, (_, i) => {
        const y = 980 + i * 34;
        const x = (1400 - ((scroll * 2 + i * 210) % 1600));
        return <path key={i} d={`M${x} ${y} L${x + 160} ${y}`} stroke={fx.white} strokeWidth={4} strokeLinecap="round" opacity={0.25} />;
      })}
      {[0, 1, 2].map((i) => (
        <Cloud key={i} x={1300 - ((age * (900 + i * 300) + i * 600) % 1900)} y={1330 + i * 110} s={1.4 - i * 0.2} opacity={0.22} />
      ))}
      <g transform={`rotate(-4 ${jx} 1150)`}>
        <Jet x={jx} y={1150 + Math.sin(t * 3) * 10} scale={1.25} gear={false} />
      </g>
    </svg>
  );
};

/** The blackjack table. `hand` is the index of the hand on the felt. */
const VegasWorld: React.FC<{ t: number; fps: number; hand: number; mood: Mood; shake: number }> = ({ t, fps, hand, mood, shake }) => {
  const cheer = mood === "joy" ? 1 : 0;
  const arch: [number, number][] = Array.from({ length: 23 }, (_, i) => {
    const a = Math.PI * (i / 22);
    return [540 - Math.cos(a) * 400, 780 - Math.sin(a) * 150];
  });
  const h = hand >= 0 ? HANDS[hand] : null;
  const sx = Math.sin(t * 70) * 14 * shake;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      <defs>
        <linearGradient id="fade-v" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.45" stopColor={fx.night} />
          <stop offset="1" stopColor={fx.night} stopOpacity={0} />
        </linearGradient>
      </defs>
      <g transform={`translate(${sx} 0)`}>
        <rect width={1080} height={1920} fill={fx.night} />
        {Array.from({ length: 12 }, (_, i) => (
          <rect key={i} x={i * 90} y={0} width={90} height={1260} fill={i % 2 ? fx.purpleLo : fx.nightLow} />
        ))}
        <rect width={1080} height={700} fill="url(#fade-v)" />
        <path d="M140 790 Q540 520 940 790 L900 860 L180 860 Z" fill={fx.purple} stroke={O} strokeWidth={5} />
        <Bulbs pts={arch} r={9} on={Math.floor(t * 6)} />
        <text x={540} y={835} textAnchor="middle" fontFamily={WIDE} fontWeight={900} fontSize={84} fill={fx.white} letterSpacing="0.06em">LAS VEGAS</text>
        {/* dealer */}
        <g transform={`translate(540 ${1230 + Math.sin(t * 2) * 2})`}>
          <path d="M-120 0 Q-130 -160 -80 -200 Q0 -226 80 -200 Q130 -160 120 0 Z" fill={fx.white} stroke={O} strokeWidth={4} />
          <path d="M-80 -200 Q-110 -120 -90 0 L-40 0 L-30 -190 Z M80 -200 Q110 -120 90 0 L40 0 L30 -190 Z" fill={fx.ink} stroke={O} strokeWidth={4} />
          <path d="M-26 -196 L0 -182 L26 -196 L26 -170 L0 -182 L-26 -170 Z" fill={fx.orange} stroke={O} strokeWidth={3} />
          <rect x={-18} y={-236} width={36} height={36} fill={fx.skinLo} stroke={O} strokeWidth={4} />
          <ellipse cx={0} cy={-290} rx={56} ry={64} fill={fx.skinLo} stroke={O} strokeWidth={4} />
          <path d="M-58 -300 Q-60 -360 0 -358 Q60 -360 58 -300 Q40 -330 0 -328 Q-40 -330 -58 -300 Z" fill={fx.ink} stroke={O} strokeWidth={4} />
          <circle cx={-20} cy={-290} r={6} fill={O} />
          <circle cx={20} cy={-290} r={6} fill={O} />
          <path d="M-14 -256 L14 -256" stroke={O} strokeWidth={4} strokeLinecap="round" />
        </g>
        <Beam x={0} y={0} ang={150 + Math.sin(t * 1.3) * 14} len={1500} color={fx.orange} opacity={0.08} />
        <Beam x={1080} y={0} ang={-150 + Math.sin(t * 1.1 + 2) * 14} len={1500} color={fx.purpleHi} opacity={0.12} />
        <Onlooker x={345} y={1250} jump={cheer * Math.abs(Math.sin(t * 9)) * 26} s={0.85} />
        <Onlooker x={760} y={1250} jump={cheer * Math.abs(Math.sin(t * 9 + 1)) * 26} s={0.8} />
        <SlotMachine x={975} y={1226} t={t} scale={0.72} />
        <SlotMachine x={40} y={1226} t={t + 3} scale={0.6} />
        <Fred x={200} y={1405 + Math.sin(t * 3) * 4} scale={0.7} mood={mood} sweat={mood === "worried"} arms={mood === "joy" ? "up" : "down"} />
        {/* table */}
        <rect x={-60} y={1240} width={1200} height={700} fill={fx.felt} />
        <path d="M-60 1240 L1140 1240" stroke={fx.orange} strokeWidth={34} />
        <path d="M-60 1223 L1140 1223 M-60 1257 L1140 1257" stroke={O} strokeWidth={4} />
        <path d="M160 1500 Q540 1640 920 1500" fill="none" stroke={fx.feltHi} strokeWidth={4} />
        {/* dealer's two cards stay; the hand flies in fresh each deal */}
        <Card x={330} y={1380} rank="10" suit="club" rot={-6} scale={0.7} />
        <Card x={440} y={1376} rank="8" suit="diamond" rot={5} scale={0.7} />
        {h &&
          h.cards.map(([rank, suit], i) => {
            const d = sp(t - h.at - i * 0.08, fps, "snappy");
            const x = interpolate(d, [0, 1], [540, 430 + i * 150]);
            const y = interpolate(d, [0, 1], [1100, 1720 - i * 8]);
            return <Card key={`${hand}-${i}`} x={x} y={y} rank={rank} suit={suit as "spade"} rot={interpolate(d, [0, 1], [40, -10 + i * 18])} scale={interpolate(d, [0, 1], [0.5, 1])} />;
          })}
        <ChipStack x={830} y={1800} n={Math.min(12, 3 + Math.max(0, hand) * 2)} />
        <ChipStack x={940} y={1820} n={4} color={fx.purpleHi} />
        <Chip x={190} y={1760} />
        <Chip x={140} y={1860} color={fx.white} r={38} />
        {/* chips fly from the dealer to Fred's stack on every win */}
        {HANDS.map((hh, i) => {
          const prev = i === 0 ? BANK0 : HANDS[i - 1].bank;
          if (hh.bank <= prev) return null;
          return [0, 1, 2, 3].map((c) => {
            const k = interpolate(t, [hh.at + 0.25 + c * 0.06, hh.at + 0.65 + c * 0.06], [0, 1], { easing: theme.ease.inOut, ...clamp });
            if (k <= 0 || k >= 1) return null;
            return <Chip key={`${i}-${c}`} x={interpolate(k, [0, 1], [540, 830])} y={interpolate(k, [0, 1], [1120, 1700]) - Math.sin(k * Math.PI) * 220} r={30} color={c % 2 ? fx.white : fx.orange} />;
          });
        })}
        <Confetti x={540} y={1000} age={t - HANDS[5].at - 0.35} n={80} />
      </g>
    </svg>
  );
};

/** Sky full of jets; boxes below: 186 of them, then the camera pulls back to millions. */
const SkyWorld: React.FC<{ t: number; age: number; zoom: number }> = ({ t, age, zoom }) => {
  const cols = 18;
  const shown = Math.floor(interpolate(age, [0.2, 1.6], [0, 186], { easing: theme.ease.out, ...clamp }));
  const cell = 46;
  const gw = cols * cell;
  const s = interpolate(zoom, [0, 1], [1, 0.16]);
  const rows = Math.ceil(186 / cols);
  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      <defs>
        <linearGradient id="sky-s" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={fx.night} />
          <stop offset="1" stopColor={fx.purple} />
        </linearGradient>
        <pattern id="boxes" width={cell} height={cell} patternUnits="userSpaceOnUse">
          <rect x={3} y={7} width={40} height={32} rx={3} fill={fx.box} stroke={O} strokeWidth={3} />
          <rect x={18} y={7} width={10} height={32} fill={fx.purple} />
        </pattern>
      </defs>
      <rect width={1080} height={1920} fill="url(#sky-s)" />
      {/* clouds */}
      {[0, 1, 2, 3].map((i) => {
        const x = ((i * 330 - age * 60 * (1 + i * 0.3)) % 1500 + 1500) % 1500 - 250;
        return (
          <g key={i} transform={`translate(${x} ${700 + i * 120})`} opacity={0.18}>
            <ellipse cx={0} cy={0} rx={140} ry={40} fill={fx.white} />
            <ellipse cx={60} cy={-24} rx={80} ry={40} fill={fx.white} />
          </g>
        );
      })}
      <RouteMap t={t} age={age} zoom={zoom} />
      {/* jets crossing at three depths */}
      {[
        { y: 640, s: 0.32, v: 340, o: 0 },
        { y: 1080, s: 0.5, v: 420, o: 700 },
        { y: 1150, s: 0.7, v: 520, o: 300 },
      ].map((j, i) => {
        const x = ((age * j.v + j.o) % 1700) - 300;
        return (
          <g key={i} transform={`rotate(-5 ${x} ${j.y})`}>
            <Jet x={x} y={j.y + Math.sin(t * 2 + i) * 8} scale={j.s} gear={false} dim={i === 0 ? 0.3 : 0} />
          </g>
        );
      })}
      {/* the floor of boxes */}
      <rect x={0} y={1200} width={1080} height={720} fill={fx.purpleLo} />
      <rect x={0} y={1192} width={1080} height={12} fill={fx.orange} />
      <g transform={`translate(540 1240) scale(${s}) translate(${-gw / 2} 0)`}>
        {zoom > 0 && <rect x={-gw * 3} y={-40} width={gw * 7} height={4000} fill="url(#boxes)" opacity={Math.min(1, zoom * 3)} />}
        {Array.from({ length: shown }, (_, i) => (
          <Box key={i} x={(i % cols) * cell + cell / 2} y={Math.floor(i / cols) * cell + cell / 2} s={1} />
        ))}
      </g>
    </svg>
  );
};

/** Hub-and-spoke from Memphis: 25 cities in 1973, then the whole world lights up. */
const CITY = (i: number, rx: number, ry: number): [number, number] => {
  const a = Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1;
  const b = Math.abs(Math.sin(i * 78.233) * 9631.37) % 1;
  const ang = a * Math.PI * 2;
  const d = 0.35 + 0.65 * Math.sqrt(b);
  return [540 + Math.cos(ang) * rx * d, 880 + Math.sin(ang) * ry * d];
};
const RouteMap: React.FC<{ t: number; age: number; zoom: number }> = ({ t, age, zoom }) => {
  const draw = interpolate(age, [0.1, 1.4], [0, 1], { easing: theme.ease.out, ...clamp });
  const more = Math.floor(zoom * 60);
  const cities = [...Array.from({ length: 25 }, (_, i) => CITY(i, 400, 210)), ...Array.from({ length: more }, (_, i) => CITY(i + 100, 560, 300))];
  return (
    <g>
      {cities.map(([cx, cy], i) => {
        const len = Math.hypot(cx - 540, cy - 880);
        const k = i < 25 ? Math.min(1, Math.max(0, draw * 25 - i * 0.6) ) : 1;
        if (k <= 0) return null;
        const pk = ((t * 0.7 + i * 0.137) % 1);
        return (
          <g key={i}>
            <path d={`M540 880 L${cx} ${cy}`} stroke={fx.orange} strokeWidth={i < 25 ? 3 : 2} opacity={i < 25 ? 0.55 : 0.35} strokeDasharray={`${len * k} ${len}`} />
            <circle cx={cx} cy={cy} r={i < 25 ? 8 : 6} fill={fx.white} opacity={k} />
            {k >= 1 && <circle cx={540 + (cx - 540) * pk} cy={880 + (cy - 880) * pk} r={5} fill={fx.orangeHi} />}
          </g>
        );
      })}
      <circle cx={540} cy={880} r={34 + Math.sin(t * 4) * 4} fill={fx.orange} opacity={0.3} />
      <circle cx={540} cy={880} r={18} fill={fx.orange} stroke={O} strokeWidth={4} />
      <text x={540} y={942} textAnchor="middle" fontFamily={MONO} fontWeight={800} fontSize={24} letterSpacing="0.14em" fill={fx.white}>MEMPHIS</text>
    </g>
  );
};

/* ------------------------------------------------------------ story */

const bankAt = (t: number) => {
  let v = BANK0;
  let prev = BANK0;
  for (const h of HANDS) {
    const a = h.at + 0.3;
    if (t >= a) {
      prev = v;
      v = h.bank;
      if (t < a + 0.4) return prev + (v - prev) * ramp(t, a, a + 0.4, "out");
    }
  }
  return v;
};

const handAt = (t: number) => {
  let i = -1;
  HANDS.forEach((h, k) => {
    if (t >= h.at) i = k;
  });
  return i;
};

export const Story: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // flash + punch on every cut
  const cuts = [CUT.cash, CUT.flight, CUT.vegas, CUT.monday, CUT.sky];
  const lastCut = cuts.filter((c) => t >= c).pop() ?? -10;
  const sinceCut = t - lastCut;
  const flash = interpolate(sinceCut, [0, 0.25], [1, 0], clamp);
  const punch = interpolate(sp(sinceCut, fps, "smooth"), [0, 1], [1.1, 1]);

  let world: React.ReactNode;
  let overlay: React.ReactNode;

  if (t < CUT.cash) {
    /* 1. Memphis, Friday night: $5 000 on the account, $24 000 of fuel due */
    const billAge = t - LINE.fuel;
    const noAge = t - LINE.no - 0.25;
    const shake = noAge > 0 ? interpolate(noAge, [0, 0.35], [1, 0], clamp) : 0;
    world = <Airport t={t} mood="worried" sweat={t > LINE.fuel} shake={shake} tow />;
    overlay = (
      <>
        <Headline age={t + 5} fps={fps} eyebrow="МЕМФИС · ПЯТНИЦА · 1973" lines={["НА СЧЁТЕ", usd(5000)]} accent={[1]} sub="Federal Express" />
        <PopIn age={t - 0.3} fps={fps} rot={-2} style={{ left: X0, top: 500 }}>
          <Pill label="САМОЛЁТЫ" value="14" />
        </PopIn>
        <PopIn age={t - 0.45} fps={fps} rot={2} style={{ left: X0 + 210, top: 500 }}>
          <Pill label="ГОРОДА" value="25" />
        </PopIn>
        {billAge >= 0 && t < LINE.no && (
          <PopIn age={billAge} fps={fps} rot={-4} style={{ left: X0, top: 640, opacity: out(t - LINE.fuel, LINE.no - LINE.fuel, 0.2) }}>
            <Paper head="СЧЁТ ЗА ТОПЛИВО">
              <div style={{ fontFamily: WIDE, fontWeight: 900, fontSize: 74, color: fx.ink }}>{usd(FUEL)}</div>
              <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 22, letterSpacing: "0.12em", color: fx.purple, marginTop: 6 }}>ОПЛАТИТЬ ДО ПОНЕДЕЛЬНИКА</div>
            </Paper>
          </PopIn>
        )}
        {t - LINE.fuel - 1.6 >= 0 && t < LINE.no && (
          <PopIn age={t - LINE.fuel - 1.6} fps={fps} rot={3} style={{ left: X0 + 230, top: 880 }}>
            <Pill label="НЕ ХВАТАЕТ" value={usd(FUEL - 5000)} tone="bad" />
          </PopIn>
        )}
        {t >= LINE.no && (
          <PopIn age={t - LINE.no} fps={fps} rot={3} style={{ left: X0, top: 640 }}>
            <Paper head="ИНВЕСТОРАМ · ЗАЯВКА">
              <div style={{ fontFamily: WIDE, fontWeight: 900, fontSize: 50, color: fx.ink, lineHeight: 1.1 }}>ДАЙТЕ<br />ДЕНЕГ</div>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{ height: 10, borderRadius: 5, background: fx.grey, opacity: 0.5, marginTop: 14, width: `${90 - i * 18}%` }} />
              ))}
            </Paper>
            <Slam age={noAge} fps={fps} text="ОТКАЗ" size={84} rot={-12} style={{ left: 190, top: 150 }} />
          </PopIn>
        )}
      </>
    );
  } else if (t < CUT.flight) {
    /* 2. Fred takes the last $5 000 */
    const age = t - CUT.cash;
    world = <CashWorld t={t} age={age} fps={fps} />;
    overlay = (
      <>
        <Headline age={age} fps={fps} eyebrow="ПЯТНИЦА · ВЕЧЕР" lines={["БЕРЁТ", "ПОСЛЕДНИЕ", usd(5000)]} accent={[2]} />
        <PopIn age={age - 0.9} fps={fps} rot={-3} style={{ left: X0, top: 620 }}>
          <Pill label="ОСНОВАТЕЛЬ" value="ФРЕД СМИТ" />
        </PopIn>
      </>
    );
  } else if (t < CUT.vegas) {
    /* 3. The flight to Las Vegas */
    const age = t - CUT.flight;
    world = <FlightWorld t={t} age={age} />;
    overlay = (
      <>
        <Headline age={age} fps={fps} eyebrow="ПЯТНИЦА · НОЧЬ" lines={["ЛЕТИТ", "В ВЕГАС"]} accent={[1]} />
        <PopIn age={age - 0.35} fps={fps} rot={-4} style={{ left: X0, top: 450 }}>
          <Paper head="ПОСАДОЧНЫЙ ТАЛОН" width={620}>
            <div style={{ display: "flex", alignItems: "center", gap: 18, fontFamily: WIDE, fontWeight: 900, fontSize: 52, color: fx.ink }}>
              MEM <span style={{ fontFamily: MONO, color: fx.orange }}>→</span> LAS
            </div>
            <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 22, letterSpacing: "0.12em", color: fx.purple, marginTop: 8 }}>ПАССАЖИР: F. SMITH · В КАРМАНЕ {usd(5000)}</div>
            <div style={{ position: "relative", height: 34, marginTop: 14 }}>
              <div style={{ position: "absolute", left: 10, right: 10, top: 15, height: 4, background: `repeating-linear-gradient(90deg, ${fx.purple} 0 14px, transparent 14px 24px)` }} />
              <div style={{ position: "absolute", left: 0, top: 7, width: 20, height: 20, borderRadius: 10, background: fx.purple }} />
              <div style={{ position: "absolute", right: 0, top: 7, width: 20, height: 20, borderRadius: 10, background: fx.orange }} />
              <div style={{ position: "absolute", left: `${interpolate(age, [0.3, 1.5], [3, 88], { easing: theme.ease.inOut, ...clamp })}%`, top: -4, fontFamily: MONO, fontWeight: 800, fontSize: 34, color: fx.orange }}>✈</div>
            </div>
          </Paper>
        </PopIn>
      </>
    );
  } else if (t < CUT.monday) {
    /* 4. Blackjack: the bankroll fills the fuel bar */
    const hand = handAt(t);
    const bank = bankAt(t);
    const lost = t >= HANDS[1].at && t < HANDS[2].at;
    const won = t >= HANDS[5].at + 0.2;
    const mood: Mood = lost ? "worried" : won || (hand >= 0 && hand !== 1) ? "joy" : "allin";
    const hitAge = hand >= 0 ? t - HANDS[hand].at - 0.3 : -1;
    const hit = hitAge >= 0 ? interpolate(hitAge, [0, 0.4], [1, 0], clamp) : 0;
    const prizeAge = t - HANDS[5].at - 0.35;
    world = <VegasWorld t={t} fps={fps} hand={hand} mood={mood} shake={lost ? hit : 0} />;
    overlay = (
      <>
        <Headline age={t - CUT.vegas} fps={fps} eyebrow="ЛАС-ВЕГАС · ВЫХОДНЫЕ" lines={["БЛЭКДЖЕК"]} size={104} />
        <FuelBar bank={bank} need={FUEL} t={t} hit={hit} bad={lost} />
        {HANDS.map((h, i) => {
          const prev = i === 0 ? BANK0 : HANDS[i - 1].bank;
          const d = h.bank - prev;
          return i < 5 && i === hand ? <MoneyPop key={i} x={790} y={1560} age={t - h.at - 0.3} fps={fps} text={(d > 0 ? "+" : "−") + usd(Math.abs(d))} bad={d < 0} /> : null;
        })}
        {t >= LINE.lose && t < LINE.win && <Slam age={t - LINE.lose - 0.1} fps={fps} text="ПРОИГРЫШ" size={60} rot={8} style={{ left: 450, top: 1010 }} />}
        {prizeAge >= 0 && (
          <div style={{ position: "absolute", left: 0, right: 110, top: 930, display: "flex", justifyContent: "flex-end" }}>
            <div style={{ position: "relative", transform: `rotate(-6deg) scale(${interpolate(sp(prizeAge, fps, "bouncy"), [0, 1], [0.3, 1])})`, opacity: Math.min(1, prizeAge * 6), textAlign: "center", background: fx.orange, border: `6px solid ${O}`, borderRadius: 26, padding: "18px 40px", boxShadow: `0 14px 0 ${O}, 0 0 80px ${fx.orange}` }}>
              <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 30, letterSpacing: "0.18em", color: fx.white }}>ВЫИГРЫШ</div>
              <div style={{ fontFamily: WIDE, fontWeight: 900, fontSize: 96, color: fx.white, lineHeight: 1, textShadow: `0 7px 0 ${O}` }}>+{usd(27000)}</div>
            </div>
          </div>
        )}
      </>
    );
  } else if (t < CUT.sky) {
    /* 5. Monday: $32 000, bill paid, lock off, jets go */
    const age = t - CUT.monday;
    const dawn = ramp(t, CUT.monday, CUT.monday + 1, "out");
    const take = ramp(t, LINE.fly + 0.1, CUT.sky - 0.1, "inOut");
    world = <Airport t={t} dawn={dawn} takeoff={take} mood="joy" sweat={false} lockOff={t - (CUT.monday + 0.9)} />;
    overlay = (
      <>
        <Headline age={age} fps={fps} eyebrow="ПОНЕДЕЛЬНИК · МЕМФИС" lines={["НА СЧЁТЕ", usd(32000)]} accent={[1]} />
        <PopIn age={age - 0.2} fps={fps} rot={-4} style={{ left: X0, top: 600, opacity: out(age, CUT.sky - CUT.monday, 0.2) }}>
          <Paper head="СЧЁТ ЗА ТОПЛИВО">
            <div style={{ fontFamily: WIDE, fontWeight: 900, fontSize: 74, color: fx.ink }}>{usd(FUEL)}</div>
          </Paper>
          <Slam age={age - 0.55} fps={fps} text="ОПЛАЧЕНО" tone="hero" size={56} rot={-8} style={{ left: 150, top: 150 }} />
        </PopIn>
      </>
    );
  } else {
    /* 6. The sky: 186 parcels the first night, 17 million a day today */
    const age = t - CUT.sky;
    const zoom = ramp(t, CUT.today, CUT.today + 1.4, "inOut");
    const n = zoom <= 0 ? 186 : Math.round(186 + (17_000_000 - 186) * Math.pow(zoom, 3));
    const today = t >= CUT.today;
    const pop = today ? interpolate(t - CUT.today - 1.4, [0, 0.4], [1, 0], clamp) : 0;
    world = <SkyWorld t={t} age={age} zoom={zoom} />;
    overlay = (
      <>
        <div style={{ position: "absolute", left: X0, top: 150 }}>
          <PopIn age={age} fps={fps} style={{ position: "relative" }}>
            <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 30, letterSpacing: "0.2em", color: fx.orange }}>{today ? "FEDEX · СЕГОДНЯ" : "17 АПРЕЛЯ 1973 · ПЕРВАЯ НОЧЬ"}</div>
            <div style={{ fontFamily: WIDE, fontWeight: 900, fontSize: today ? 104 : 200, lineHeight: 1, color: today ? fx.orange : fx.white, marginTop: 18, textShadow: `0 9px 0 ${O}`, whiteSpace: "nowrap", transform: `scale(${1 + pop * 0.12})`, transformOrigin: "left center" }}>
              {String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ")}
            </div>
            <div style={{ fontFamily: WIDE, fontWeight: 800, fontSize: 46, color: fx.white, marginTop: 16 }}>{today ? "ПОСЫЛОК В ДЕНЬ" : "ПОСЫЛОК"}</div>
            {t >= CUT.today + 1.5 && (
              <PopIn age={t - CUT.today - 1.5} fps={fps} rot={-3} style={{ position: "relative", marginTop: 28 }}>
                <Pill label="ПЕРВАЯ НОЧЬ, 1973" value="186 ПОСЫЛОК" />
              </PopIn>
            )}
          </PopIn>
        </div>
        {t >= LINE.cta && <div style={{ position: "absolute", left: 0, right: 0, top: 1150, bottom: 0, background: `linear-gradient(180deg, ${fx.night}00, ${fx.night}D0 30%)`, opacity: ramp(t, LINE.cta, LINE.cta + 0.4, "out") }} />}
        <Subscribe t={t} at={LINE.cta} tapAt={LINE.cta + 1.6} fps={fps} top={1250} ask="А ТЫ БЫ ПОСТАВИЛ?" />
      </>
    );
  }

  return (
    <AbsoluteFill style={{ background: fx.night, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${punch})` }}>{world}</AbsoluteFill>
      {overlay}
      <Flash amount={flash} color={fx.white} />
    </AbsoluteFill>
  );
};
