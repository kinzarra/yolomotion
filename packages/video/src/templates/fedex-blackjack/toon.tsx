// The cartoon cast and props: Fred Smith, the 1973 Falcon 20 jets, the
// fuel truck, cards and chips. Flat SVG with one dark outline, like the
// shawarma street.
import React from "react";
import { theme } from "../../theme";
import { fx } from "./palette";

const O = fx.outline;
const SW = 4;
export const WIDE = `${theme.fonts.wide}, ${theme.fonts.mono}`;

/* ------------------------------------------------------------ Fred */

export type Mood = "calm" | "worried" | "allin" | "joy";

/** Fred's head, centred on (0, 0), about 150 px wide. Dot eyes, one-line mouth. */
export const FredHead: React.FC<{ mood?: Mood; sweat?: boolean }> = ({ mood = "calm", sweat = false }) => {
  const brows: Record<Mood, [string, string]> = {
    calm: ["M-38 -26 Q-26 -32 -14 -28", "M14 -28 Q26 -32 38 -26"],
    worried: ["M-38 -22 Q-26 -24 -14 -34", "M14 -34 Q26 -24 38 -22"],
    allin: ["M-38 -34 Q-26 -26 -12 -22", "M12 -22 Q26 -26 38 -34"],
    joy: ["M-38 -34 Q-26 -42 -14 -36", "M14 -36 Q26 -42 38 -34"],
  };
  const mouth: Record<Mood, React.ReactNode> = {
    calm: <path d="M-18 34 Q0 44 18 34" fill="none" stroke={O} strokeWidth={4.5} strokeLinecap="round" />,
    worried: <path d="M-18 40 Q-9 32 0 38 Q9 44 18 36" fill="none" stroke={O} strokeWidth={4.5} strokeLinecap="round" />,
    allin: <path d="M-16 38 Q6 40 20 30" fill="none" stroke={O} strokeWidth={4.5} strokeLinecap="round" />,
    joy: <path d="M-24 28 Q0 30 24 28 Q20 58 0 58 Q-20 58 -24 28 Z" fill={fx.outline} stroke={O} strokeWidth={4} strokeLinejoin="round" />,
  };
  return (
    <g>
      {/* ears */}
      <ellipse cx={-66} cy={4} rx={12} ry={18} fill={fx.skin} stroke={O} strokeWidth={SW} />
      <ellipse cx={66} cy={4} rx={12} ry={18} fill={fx.skin} stroke={O} strokeWidth={SW} />
      {/* face: a soft square jaw */}
      <path d="M-62 -20 Q-64 -84 0 -86 Q64 -84 62 -20 L58 28 Q50 74 0 76 Q-50 74 -58 28 Z" fill={fx.skin} stroke={O} strokeWidth={SW} strokeLinejoin="round" />
      {/* hair: side part on his right (screen left), sweep to the other side */}
      <path d="M-66 -10 Q-74 -96 -6 -100 Q64 -104 70 -30 Q66 -12 60 -6 Q58 -48 30 -60 Q-6 -46 -34 -62 Q-48 -46 -54 -8 Z" fill={fx.hair} stroke={O} strokeWidth={SW} strokeLinejoin="round" />
      <path d="M-34 -62 Q-30 -82 -18 -94" fill="none" stroke={O} strokeWidth={3} strokeLinecap="round" />
      {/* eyes, brows, nose, mouth */}
      <path d={brows[mood][0]} fill="none" stroke={fx.hair} strokeWidth={7} strokeLinecap="round" />
      <path d={brows[mood][1]} fill="none" stroke={fx.hair} strokeWidth={7} strokeLinecap="round" />
      {mood === "allin" ? (
        <>
          <path d="M-34 -8 L-16 -8" stroke={O} strokeWidth={7} strokeLinecap="round" />
          <path d="M16 -8 L34 -8" stroke={O} strokeWidth={7} strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx={-25} cy={-8} r={mood === "worried" ? 7.5 : 6.5} fill={O} />
          <circle cx={25} cy={-8} r={mood === "worried" ? 7.5 : 6.5} fill={O} />
        </>
      )}
      <path d="M2 2 Q-6 18 4 20" fill="none" stroke={fx.skinLo} strokeWidth={4} strokeLinecap="round" />
      {mouth[mood]}
      {sweat && <path d="M54 -48 Q64 -30 58 -22 Q50 -22 50 -32 Q50 -40 54 -48 Z" fill="#8FD3FF" stroke={O} strokeWidth={3} />}
    </g>
  );
};

/**
 * Fred standing front-on, feet at (x, y), about 600 px tall at scale 1.
 * Navy suit, white shirt, orange tie. `arms`: down, up (both in the air), phone.
 */
export const Fred: React.FC<{ x: number; y: number; scale?: number; mood?: Mood; arms?: "down" | "up" | "phone"; sweat?: boolean }> = ({ x, y, scale = 1, mood = "calm", arms = "down", sweat = false }) => {
  const armL = arms === "up" ? 150 : 8;
  const armR = arms === "up" ? -150 : arms === "phone" ? -150 : -8;
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <ellipse cx={0} cy={4} rx={110} ry={16} fill="rgba(0,0,0,0.4)" />
      {/* legs + shoes */}
      <rect x={-44} y={-250} width={38} height={236} rx={14} fill={fx.suitLo} stroke={O} strokeWidth={SW} />
      <rect x={6} y={-250} width={38} height={236} rx={14} fill={fx.suitLo} stroke={O} strokeWidth={SW} />
      <path d="M-50 -18 Q-52 6 -28 6 L-2 6 Q2 -10 -8 -18 Z" fill={fx.ink} stroke={O} strokeWidth={SW} strokeLinejoin="round" />
      <path d="M50 -18 Q52 6 28 6 L2 6 Q-2 -10 8 -18 Z" fill={fx.ink} stroke={O} strokeWidth={SW} strokeLinejoin="round" />
      {/* arms (behind the jacket edge) */}
      <g transform={`rotate(${armL} -78 -470)`}>
        <rect x={-100} y={-478} width={40} height={210} rx={20} fill={fx.suit} stroke={O} strokeWidth={SW} />
        <circle cx={-80} cy={-262} r={20} fill={fx.skin} stroke={O} strokeWidth={SW} />
      </g>
      <g transform={`rotate(${armR} 78 -470)`}>
        <rect x={60} y={-478} width={40} height={arms === "phone" ? 120 : 210} rx={20} fill={fx.suit} stroke={O} strokeWidth={SW} />
        {arms === "phone" ? (
          <g transform="translate(80 -350)">
            <rect x={-18} y={-10} width={36} height={130} rx={18} fill={fx.suit} stroke={O} strokeWidth={SW} transform="rotate(150 0 0)" />
          </g>
        ) : (
          <circle cx={80} cy={-262} r={20} fill={fx.skin} stroke={O} strokeWidth={SW} />
        )}
      </g>
      {/* jacket */}
      <path d="M-84 -486 Q-92 -340 -76 -236 L76 -236 Q92 -340 84 -486 Q0 -508 -84 -486 Z" fill={fx.suit} stroke={O} strokeWidth={SW} strokeLinejoin="round" />
      <path d="M-34 -496 L0 -380 L34 -496 Z" fill={fx.white} stroke={O} strokeWidth={SW} strokeLinejoin="round" />
      <path d="M-10 -488 L10 -488 L14 -470 L6 -400 L0 -388 L-6 -400 L-14 -470 Z" fill={fx.orange} stroke={O} strokeWidth={3} strokeLinejoin="round" />
      <path d="M-36 -494 L-4 -370 M36 -494 L4 -370" stroke={fx.suitLo} strokeWidth={6} strokeLinecap="round" />
      <path d="M0 -380 L0 -240" stroke={fx.suitLo} strokeWidth={3} />
      <circle cx={0} cy={-320} r={5} fill={fx.suitLo} />
      <circle cx={0} cy={-280} r={5} fill={fx.suitLo} />
      {/* neck + head */}
      <rect x={-22} y={-530} width={44} height={40} fill={fx.skin} stroke={O} strokeWidth={SW} />
      <g transform="translate(0 -600)">
        <FredHead mood={mood} sweat={sweat} />
      </g>
    </g>
  );
};

/* ------------------------------------------------------------ jets */

/**
 * Dassault Falcon 20 in side view, nose right, centred on the fuselage at
 * (x, y), about 700 px long at scale 1. 1973 Federal Express colours: purple
 * top, white belly, orange cheatline. Rear-mounted engines, T-ish tail.
 */
export const Jet: React.FC<{ x: number; y: number; scale?: number; flip?: boolean; dim?: number; gear?: boolean; chocks?: boolean }> = ({ x, y, scale = 1, flip = false, dim = 0, gear = true, chocks = false }) => {
  const body = "M-330 -34 Q-350 -30 -352 -14 Q-350 12 -320 22 L230 40 Q300 40 345 18 Q365 6 360 -6 Q340 -30 270 -44 L-300 -50 Z";
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`} style={{ filter: dim ? `brightness(${1 - dim})` : undefined }}>
      <defs>
        <clipPath id={`jet-top-${x}-${y}`}>
          <rect x={-400} y={-120} width={800} height={112} />
        </clipPath>
      </defs>
      {/* far wing */}
      <path d="M-40 24 L-170 8 L-140 0 L40 12 Z" fill={fx.greyLo} stroke={O} strokeWidth={SW} strokeLinejoin="round" />
      {/* tail fin */}
      <path d="M-250 -46 L-330 -210 L-282 -210 L-170 -48 Z" fill={fx.purple} stroke={O} strokeWidth={SW} strokeLinejoin="round" />
      <path d="M-360 -214 L-250 -214 L-250 -200 L-366 -200 Z" fill={fx.purple} stroke={O} strokeWidth={SW} strokeLinejoin="round" />
      {/* gear */}
      {gear && (
        <g>
          <path d="M240 36 L244 84" stroke={O} strokeWidth={8} />
          <circle cx={244} cy={92} r={16} fill={fx.ink} stroke={O} strokeWidth={SW} />
          <path d="M-60 30 L-62 84" stroke={O} strokeWidth={10} />
          <circle cx={-76} cy={92} r={20} fill={fx.ink} stroke={O} strokeWidth={SW} />
          <circle cx={-44} cy={92} r={20} fill={fx.ink} stroke={O} strokeWidth={SW} />
        </g>
      )}
      {chocks && (
        <g>
          <path d="M-110 112 L-98 88 L-90 112 Z" fill={fx.orange} stroke={O} strokeWidth={3} strokeLinejoin="round" />
          <path d="M-12 112 L-24 88 L-30 112 Z" fill={fx.orange} stroke={O} strokeWidth={3} strokeLinejoin="round" />
        </g>
      )}
      {/* fuselage: white, purple top half, orange cheatline */}
      <path d={body} fill={fx.white} />
      <path d={body} fill={fx.purple} clipPath={`url(#jet-top-${x}-${y})`} />
      <path d="M-344 -6 L356 -6" stroke={fx.orange} strokeWidth={8} clipPath={`url(#jet-top-${x}-${y})`} />
      <path d={body} fill="none" stroke={O} strokeWidth={SW} strokeLinejoin="round" />
      {/* cockpit glass + cabin windows */}
      <path d="M290 -38 Q318 -30 336 -16 L300 -16 Z" fill={fx.glass} stroke={O} strokeWidth={3} strokeLinejoin="round" />
      {[-140, -90, -40, 10, 60, 110, 160].map((wx) => (
        <rect key={wx} x={wx} y={-36} width={22} height={18} rx={8} fill={fx.glass} stroke={O} strokeWidth={2.5} />
      ))}
      <text x={60} y={18} textAnchor="middle" fontFamily={WIDE} fontWeight={800} fontSize={24} fill={fx.purple} letterSpacing="0.04em">FEDERAL EXPRESS</text>
      {/* door */}
      <rect x={250} y={-38} width={30} height={60} rx={8} fill="none" stroke={fx.purpleLo} strokeWidth={3} opacity={0.5} />
      {/* rear engine nacelle on the pylon */}
      <path d="M-170 -40 L-160 -62" stroke={O} strokeWidth={10} />
      <path d="M-260 -92 Q-270 -66 -250 -54 L-110 -58 Q-90 -76 -110 -96 Z" fill={fx.paper} stroke={O} strokeWidth={SW} strokeLinejoin="round" />
      <ellipse cx={-108} cy={-77} rx={10} ry={20} fill={fx.ink} stroke={O} strokeWidth={3} />
      {/* near wing */}
      <path d="M-60 30 L-230 74 L-180 80 L70 34 Z" fill={fx.grey} stroke={O} strokeWidth={SW} strokeLinejoin="round" />
    </g>
  );
};

/** Fuel truck with a padlock on the hose: no money, no fuel. Wheels on y. */
export const FuelTruck: React.FC<{ x: number; y: number; scale?: number; locked?: boolean }> = ({ x, y, scale = 1, locked = true }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <ellipse cx={0} cy={6} rx={260} ry={16} fill="rgba(0,0,0,0.4)" />
    <rect x={-250} y={-200} width={330} height={150} rx={60} fill={fx.paper} stroke={O} strokeWidth={SW} />
    <path d="M-250 -128 L80 -128" stroke={fx.orange} strokeWidth={10} />
    <text x={-86} y={-150} textAnchor="middle" fontFamily={WIDE} fontWeight={900} fontSize={34} fill={fx.ink}>ТОПЛИВО</text>
    <path d="M100 -50 L100 -170 Q100 -190 140 -190 L200 -190 Q240 -160 250 -110 L250 -50 Z" fill={fx.orange} stroke={O} strokeWidth={SW} strokeLinejoin="round" />
    <path d="M128 -170 L190 -170 Q214 -150 222 -118 L128 -118 Z" fill={fx.glass} stroke={O} strokeWidth={3} strokeLinejoin="round" />
    <rect x={-260} y={-60} width={520} height={30} rx={8} fill={fx.greyLo} stroke={O} strokeWidth={SW} />
    {[-180, -40, 180].map((wx) => (
      <g key={wx}>
        <circle cx={wx} cy={-20} r={30} fill={fx.ink} stroke={O} strokeWidth={SW} />
        <circle cx={wx} cy={-20} r={11} fill={fx.grey} />
      </g>
    ))}
    {/* hose reel and the lock */}
    <circle cx={30} cy={-100} r={28} fill={fx.greyLo} stroke={O} strokeWidth={SW} />
    <circle cx={30} cy={-100} r={14} fill="none" stroke={O} strokeWidth={3} />
    {locked && (
      <g transform="translate(30 -60)">
        <path d="M-16 0 L-16 -18 Q-16 -36 0 -36 Q16 -36 16 -18 L16 0" fill="none" stroke={fx.ink} strokeWidth={8} />
        <rect x={-26} y={-4} width={52} height={44} rx={8} fill={fx.red} stroke={O} strokeWidth={SW} />
        <circle cx={0} cy={14} r={6} fill={fx.ink} />
      </g>
    )}
  </g>
);

/* ------------------------------------------------------------ casino */

type Suit = "spade" | "heart" | "club" | "diamond";
const suitPath: Record<Suit, string> = {
  heart: "M0 34 C-50 2 -40 -38 0 -16 C40 -38 50 2 0 34 Z",
  diamond: "M0 -38 L30 0 L0 38 L-30 0 Z",
  spade: "M0 -38 C40 -6 46 20 18 24 C8 24 4 18 2 14 L10 38 L-10 38 L-2 14 C-4 18 -8 24 -18 24 C-46 20 -40 -6 0 -38 Z",
  club: "M0 -38 A16 16 0 1 1 -2 -6 A16 16 0 1 1 -10 22 L-2 12 L-8 38 L8 38 L2 12 L10 22 A16 16 0 1 1 2 -6 A16 16 0 1 1 0 -38 Z",
};

export const SuitMark: React.FC<{ suit: Suit; size?: number; x?: number; y?: number }> = ({ suit, size = 1, x = 0, y = 0 }) => (
  <path d={suitPath[suit]} transform={`translate(${x} ${y}) scale(${size})`} fill={suit === "heart" || suit === "diamond" ? fx.red : fx.ink} />
);

/** A playing card centred at (x, y), 170 x 240, rotated by rot. */
export const Card: React.FC<{ x: number; y: number; rank: string; suit: Suit; rot?: number; scale?: number; back?: boolean }> = ({ x, y, rank, suit, rot = 0, scale = 1, back = false }) => {
  const red = suit === "heart" || suit === "diamond";
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${scale})`}>
      <rect x={-85} y={-120} width={170} height={240} rx={16} fill="rgba(0,0,0,0.35)" transform="translate(6 10)" />
      <rect x={-85} y={-120} width={170} height={240} rx={16} fill={back ? fx.purple : fx.white} stroke={O} strokeWidth={SW} />
      {back ? (
        <rect x={-68} y={-103} width={136} height={206} rx={10} fill="none" stroke={fx.orange} strokeWidth={4} strokeDasharray="10 8" />
      ) : (
        <>
          <text x={-62} y={-72} fontFamily={WIDE} fontWeight={900} fontSize={44} fill={red ? fx.red : fx.ink}>{rank}</text>
          <SuitMark suit={suit} size={0.5} x={-46} y={-40} />
          <SuitMark suit={suit} size={1.5} x={4} y={30} />
        </>
      )}
    </g>
  );
};

/** A casino chip seen from above. */
export const Chip: React.FC<{ x: number; y: number; color?: string; r?: number }> = ({ x, y, color = fx.orange, r = 44 }) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r={r} fill={color} stroke={O} strokeWidth={SW} />
    <circle r={r * 0.78} fill="none" stroke={fx.white} strokeWidth={r * 0.18} strokeDasharray={`${r * 0.36} ${r * 0.36}`} />
    <circle r={r * 0.5} fill={color} stroke={fx.white} strokeWidth={3} />
  </g>
);

/** A stack of chips seen from the side, bottom at (x, y). */
export const ChipStack: React.FC<{ x: number; y: number; n: number; color?: string }> = ({ x, y, n, color = fx.orange }) => (
  <g transform={`translate(${x} ${y})`}>
    {Array.from({ length: n }, (_, i) => (
      <g key={i} transform={`translate(0 ${-i * 16})`}>
        <ellipse cx={0} cy={0} rx={50} ry={16} fill={color} stroke={O} strokeWidth={3} />
        <path d="M-30 4 L-30 -4 M0 6 L0 -2 M30 4 L30 -4" stroke={fx.white} strokeWidth={6} />
        <ellipse cx={0} cy={-8} rx={50} ry={16} fill={color} stroke={O} strokeWidth={3} />
      </g>
    ))}
  </g>
);

/** Row of marquee bulbs along a path of points, every other one lit. */
export const Bulbs: React.FC<{ pts: [number, number][]; r?: number; on?: number }> = ({ pts, r = 9, on = 0 }) => (
  <g>
    {pts.map(([bx, by], i) => {
      const lit = (i + on) % 2 === 0;
      return (
        <g key={i}>
          {lit && <circle cx={bx} cy={by} r={r * 2.6} fill={fx.orange} opacity={0.25} />}
          <circle cx={bx} cy={by} r={r} fill={lit ? "#FFE2B0" : fx.orange} opacity={lit ? 1 : 0.55} />
        </g>
      );
    })}
  </g>
);

/* ------------------------------------------------------------ set dressing */

/** A cardboard parcel with purple tape, centred on (x, y). */
export const Parcel: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-20} y={-16} width={40} height={32} rx={3} fill={fx.box} stroke={O} strokeWidth={3} />
    <rect x={-5} y={-16} width={10} height={32} fill={fx.purple} />
    <path d="M-20 -6 L20 -6" stroke={fx.boxLo} strokeWidth={2} />
  </g>
);

/** Ground crew in an orange vest waving two lit wands. Feet at (x, y), ~300 px tall. */
export const Marshaller: React.FC<{ x: number; y: number; t: number; scale?: number }> = ({ x, y, t, scale = 1 }) => {
  const a = Math.sin(t * 5) * 38;
  const arm = (side: 1 | -1, ang: number) => (
    <g transform={`rotate(${ang} ${side * 30} -210)`}>
      <rect x={side * 30 - 9} y={-214} width={18} height={92} rx={9} fill={fx.orange} stroke={O} strokeWidth={SW} />
      <circle cx={side * 30} cy={-122} r={10} fill={fx.skin} stroke={O} strokeWidth={3} />
      <rect x={side * 30 - 7} y={-128} width={14} height={70} rx={7} fill={fx.orangeHi} stroke={O} strokeWidth={3} />
      <circle cx={side * 30} cy={-62} r={22} fill={fx.orange} opacity={0.35} />
    </g>
  );
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <ellipse cx={0} cy={4} rx={60} ry={10} fill="rgba(0,0,0,0.4)" />
      <rect x={-26} y={-120} width={20} height={116} rx={9} fill={fx.suitLo} stroke={O} strokeWidth={SW} />
      <rect x={6} y={-120} width={20} height={116} rx={9} fill={fx.suitLo} stroke={O} strokeWidth={SW} />
      {arm(-1, -115 + a)}
      {arm(1, 115 - a)}
      <path d="M-34 -222 Q-38 -160 -32 -116 L32 -116 Q38 -160 34 -222 Q0 -232 -34 -222 Z" fill={fx.orange} stroke={O} strokeWidth={SW} strokeLinejoin="round" />
      <path d="M-34 -170 L34 -170" stroke={fx.white} strokeWidth={8} />
      <circle cx={0} cy={-256} r={28} fill={fx.skin} stroke={O} strokeWidth={SW} />
      <path d="M-30 -262 Q-28 -292 0 -290 Q28 -292 30 -262 Z" fill={fx.purple} stroke={O} strokeWidth={SW} />
      <circle cx={-10} cy={-252} r={4} fill={O} />
      <circle cx={10} cy={-252} r={4} fill={O} />
    </g>
  );
};

/** Baggage tug pulling carts stacked with parcels; front at (x, y) on the wheels' line. */
export const CargoTrain: React.FC<{ x: number; y: number; scale?: number; carts?: number }> = ({ x, y, scale = 1, carts = 3 }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <ellipse cx={130 + carts * 70} cy={6} rx={140 + carts * 80} ry={12} fill="rgba(0,0,0,0.35)" />
    {/* tug */}
    <path d="M0 -20 L0 -70 Q0 -90 20 -90 L60 -90 L80 -60 L110 -60 L110 -20 Z" fill={fx.purple} stroke={O} strokeWidth={SW} strokeLinejoin="round" />
    <rect x={14} y={-84} width={36} height={26} rx={4} fill={fx.glass} stroke={O} strokeWidth={3} />
    <circle cx={28} cy={-12} r={16} fill={fx.ink} stroke={O} strokeWidth={SW} />
    <circle cx={88} cy={-12} r={16} fill={fx.ink} stroke={O} strokeWidth={SW} />
    {Array.from({ length: carts }, (_, i) => {
      const cx = 130 + i * 150;
      return (
        <g key={i}>
          <path d={`M${cx - 20} -30 L${cx} -30`} stroke={O} strokeWidth={5} />
          <rect x={cx} y={-40} width={130} height={18} rx={4} fill={fx.grey} stroke={O} strokeWidth={SW} />
          <circle cx={cx + 24} cy={-12} r={12} fill={fx.ink} stroke={O} strokeWidth={3} />
          <circle cx={cx + 106} cy={-12} r={12} fill={fx.ink} stroke={O} strokeWidth={3} />
          <Parcel x={cx + 30} y={-58} />
          <Parcel x={cx + 74} y={-58} />
          <Parcel x={cx + 52} y={-90} />
          {i % 2 === 0 && <Parcel x={cx + 104} y={-58} s={0.9} />}
        </g>
      );
    })}
  </g>
);

/** A searchlight beam from (x, y), `ang` degrees off vertical. */
export const Beam: React.FC<{ x: number; y: number; ang: number; len?: number; color?: string; opacity?: number }> = ({ x, y, ang, len = 1300, color = fx.white, opacity = 0.08 }) => {
  const a = (ang * Math.PI) / 180;
  const w = 0.07;
  const p = (d: number) => `${x + Math.sin(a + d) * len} ${y - Math.cos(a + d) * len}`;
  return <path d={`M${x} ${y} L${p(-w)} L${p(w)} Z`} fill={color} opacity={opacity} />;
};

export const Moon: React.FC<{ x: number; y: number; r?: number }> = ({ x, y, r = 56 }) => (
  <g>
    <circle cx={x} cy={y} r={r * 2.2} fill={fx.glass} opacity={0.08} />
    <circle cx={x} cy={y} r={r} fill={fx.glass} />
    <circle cx={x - r * 0.3} cy={y - r * 0.2} r={r * 0.16} fill={fx.skinLo} opacity={0.5} />
    <circle cx={x + r * 0.28} cy={y + r * 0.3} r={r * 0.11} fill={fx.skinLo} opacity={0.5} />
  </g>
);

export const Cloud: React.FC<{ x: number; y: number; s?: number; opacity?: number }> = ({ x, y, s = 1, opacity = 0.16 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={opacity}>
    <ellipse cx={0} cy={0} rx={150} ry={42} fill={fx.white} />
    <ellipse cx={-50} cy={-22} rx={70} ry={44} fill={fx.white} />
    <ellipse cx={50} cy={-34} rx={86} ry={52} fill={fx.white} />
  </g>
);

/** A far-off airliner silhouette with blinking nav lights (someone else's, it has fuel). */
export const FarPlane: React.FC<{ x: number; y: number; t: number; s?: number }> = ({ x, y, t, s = 1 }) => {
  const on = Math.sin(t * 9) > 0.3;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-70 0 Q-60 -10 50 -8 Q74 -6 80 0 Q74 6 50 8 L-60 8 Z" fill={fx.nightLow} />
      <path d="M-10 0 L-40 34 L-24 34 L20 2 Z M-10 0 L-36 -30 L-22 -30 L18 -2 Z" fill={fx.nightLow} />
      <path d="M-62 -2 L-76 -26 L-64 -26 L-48 -4 Z" fill={fx.nightLow} />
      <circle cx={-40} cy={34} r={4} fill={on ? fx.red : fx.nightLow} />
      <circle cx={-36} cy={-30} r={4} fill={on ? fx.white : fx.nightLow} />
    </g>
  );
};

/** Slot machine; reels scroll with t. Base at (x, y). */
export const SlotMachine: React.FC<{ x: number; y: number; t: number; scale?: number }> = ({ x, y, t, scale = 1 }) => {
  const sym = ["7", "$", "7", "$", "7"];
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <rect x={-90} y={-330} width={180} height={330} rx={20} fill={fx.purple} stroke={O} strokeWidth={SW} />
      <path d="M-90 -290 Q0 -380 90 -290 Z" fill={fx.orange} stroke={O} strokeWidth={SW} />
      <text x={0} y={-300} textAnchor="middle" fontFamily={WIDE} fontWeight={900} fontSize={28} fill={fx.white}>777</text>
      <rect x={-70} y={-260} width={140} height={90} rx={10} fill={fx.white} stroke={O} strokeWidth={SW} />
      <clipPath id={`reel-${x}`}>
        <rect x={-66} y={-256} width={132} height={82} />
      </clipPath>
      <g clipPath={`url(#reel-${x})`}>
        {[0, 1, 2].map((r) => {
          const off = ((t * (7 + r * 2.3) * 60) % 300) - 150;
          return sym.map((s, i) => (
            <text key={`${r}-${i}`} x={-44 + r * 44} y={-200 + i * 60 - off - 60} textAnchor="middle" fontFamily={WIDE} fontWeight={900} fontSize={40} fill={s === "7" ? fx.red : fx.purple}>{s}</text>
          ));
        })}
      </g>
      <rect x={-60} y={-140} width={120} height={40} rx={8} fill={fx.purpleLo} stroke={O} strokeWidth={3} />
      <path d="M90 -230 L120 -230 L120 -120" fill="none" stroke={O} strokeWidth={10} strokeLinecap="round" />
      <circle cx={120} cy={-240 + Math.sin(t * 3) * 6} r={16} fill={fx.red} stroke={O} strokeWidth={SW} />
    </g>
  );
};

/** Open, empty safe. Base at (x, y). */
export const Safe: React.FC<{ x: number; y: number; scale?: number }> = ({ x, y, scale = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <rect x={-120} y={-260} width={240} height={260} rx={14} fill={fx.greyLo} stroke={O} strokeWidth={SW} />
    <rect x={-96} y={-236} width={192} height={212} rx={8} fill={fx.ink} stroke={O} strokeWidth={SW} />
    <path d="M-96 -120 L96 -120" stroke={fx.greyLo} strokeWidth={6} />
    {/* door swung open to the left */}
    <path d="M-120 -260 L-210 -232 L-210 -24 L-120 0 Z" fill={fx.grey} stroke={O} strokeWidth={SW} strokeLinejoin="round" />
    <circle cx={-166} cy={-130} r={22} fill={fx.greyLo} stroke={O} strokeWidth={SW} />
    <path d="M-166 -150 L-166 -110 M-186 -130 L-146 -130" stroke={O} strokeWidth={4} />
  </g>
);

export const WallClock: React.FC<{ x: number; y: number; t: number; r?: number }> = ({ x, y, t, r = 70 }) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r={r} fill={fx.white} stroke={O} strokeWidth={SW + 2} />
    {Array.from({ length: 12 }, (_, i) => {
      const a = (i / 12) * Math.PI * 2;
      return <path key={i} d={`M${Math.sin(a) * r * 0.78} ${-Math.cos(a) * r * 0.78} L${Math.sin(a) * r * 0.9} ${-Math.cos(a) * r * 0.9}`} stroke={O} strokeWidth={4} />;
    })}
    <path d={`M0 0 L0 ${-r * 0.5}`} stroke={O} strokeWidth={7} strokeLinecap="round" transform={`rotate(${t * 40})`} />
    <path d={`M0 0 L0 ${-r * 0.74}`} stroke={fx.orange} strokeWidth={5} strokeLinecap="round" transform={`rotate(${t * 480})`} />
    <circle r={6} fill={O} />
  </g>
);

/** Confetti burst from (x, y) at age; deterministic. */
export const Confetti: React.FC<{ x: number; y: number; age: number; n?: number }> = ({ x, y, age, n = 60 }) => {
  if (age < 0) return null;
  const cols = [fx.orange, fx.white, fx.purpleHi, fx.orangeHi];
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const r1 = Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1;
        const r2 = Math.abs(Math.sin(i * 78.233) * 12345.678) % 1;
        const a = -Math.PI / 2 + (r1 - 0.5) * 2.6;
        const v = 900 + r2 * 900;
        const px = x + Math.cos(a) * v * age;
        const py = y + Math.sin(a) * v * age + 1400 * age * age;
        return <rect key={i} x={px} y={py} width={18} height={10} fill={cols[i % 4]} transform={`rotate(${(r1 * 360 + age * 720 * (r2 - 0.5))} ${px} ${py})`} />;
      })}
    </g>
  );
};

/** A crowd silhouette head-and-shoulders, bouncing by `jump`. */
export const Onlooker: React.FC<{ x: number; y: number; jump?: number; s?: number }> = ({ x, y, jump = 0, s = 1 }) => (
  <g transform={`translate(${x} ${y - jump}) scale(${s})`}>
    <path d="M-60 0 Q-60 -80 0 -84 Q60 -80 60 0 Z" fill={fx.nightLow} />
    <circle cx={0} cy={-120} r={36} fill={fx.nightLow} />
  </g>
);
