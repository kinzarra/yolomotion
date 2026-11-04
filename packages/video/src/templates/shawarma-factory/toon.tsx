// The cartoon: a night street, one shawarma kiosk, its seller, the people.
// Everything is flat SVG with a dark outline, posed from sim time `t` so the
// street is a pure function of the frame.
import React from "react";
import { theme } from "../../theme";
import { rnd } from "../digital-ruble/ui";
import { sfColors as colors, sfPalette as palette, toon } from "./palette";

const O = toon.outline;
const SW = 3.2; // outline width

/* ------------------------------------------------------------ people */

/** man, woman, granny (headscarf, cane, stoop), kid (small, walks with mum). */
export type Kind = "man" | "woman" | "granny" | "kid";

export type Look = {
  kind: Kind;
  skin: string;
  hair: string;
  top: string;
  pants: string;
  style: number; // man: 0 short, 1 cap, 2 hood, 4 bald · woman: 3 long, 5 bun · kid: 0 / 5
  beard: boolean;
  skirt: boolean;
  bag: boolean;
  tall: number;
};

export const lookFor = (seed: number, force?: Partial<Look>): Look => {
  const r = (k: number) => rnd(seed * 13 + k);
  const pick = <T,>(arr: readonly T[], k: number) => arr[Math.floor(r(k) * arr.length) % arr.length];
  const roll = r(9);
  const kind: Kind = force?.kind ?? (roll < 0.42 ? "man" : roll < 0.8 ? "woman" : "granny");
  const base: Look = {
    kind,
    skin: pick(toon.skin, 1),
    hair: pick(toon.hair.slice(0, 4), 2),
    top: pick(toon.top, 3),
    pants: pick(toon.pants, 4),
    style: [0, 1, 2, 4][Math.floor(r(5) * 4)],
    beard: false,
    skirt: false,
    bag: r(6) > 0.7,
    tall: 0.94 + r(7) * 0.12,
  };
  if (kind === "man" && r(8) > 0.45) {
    // caucasian men in the crowd: dark hair, full beard
    Object.assign(base, { beard: true, hair: toon.hair[0], skin: pick([toon.skin[1], toon.skin[4], toon.skin[0]], 10), style: r(11) > 0.5 ? 0 : 1 });
  }
  if (kind === "woman") Object.assign(base, { style: r(5) > 0.5 ? 3 : 5, skirt: r(12) > 0.4, bag: r(6) > 0.35, tall: 0.9 + r(7) * 0.08 });
  if (kind === "granny") Object.assign(base, { hair: toon.hair[4], skirt: true, bag: true, tall: 0.86 });
  if (kind === "kid") Object.assign(base, { style: r(5) > 0.5 ? 0 : 5, bag: false, tall: 1 });
  return { ...base, ...force };
};

/**
 * A walker in profile, facing right, feet at (x, y). `phase` advances with
 * distance walked, `moving` 0..1 scales the stride, `carry` puts a shawarma in
 * the front hand, `phone` bends the head down over a lit screen.
 */
export const Person: React.FC<{
  x: number;
  y: number;
  look: Look;
  phase: number;
  moving: number;
  scale?: number;
  flip?: boolean;
  carry?: number;
  phone?: boolean;
  dim?: number;
  breath?: number;
  holdHand?: boolean; // back arm reaches down to a kid
}> = ({ x, y, look, phase, moving, scale = 1, flip = false, carry = 0, phone = false, dim = 0, breath = 0, holdHand = false }) => {
  const granny = look.kind === "granny";
  const kid = look.kind === "kid";
  const stride = granny ? 16 : 28;
  const swing = Math.sin(phase) * stride * moving;
  const bob = Math.abs(Math.cos(phase)) * (granny ? 3 : 6) * moving + Math.sin(breath) * 1.5;
  const s = scale * look.tall * (kid ? 0.56 : 1);
  const armBack = holdHand ? 18 : -swing * 0.85;
  const armFront = kid ? -55 : granny ? -28 + swing * 0.2 : carry > 0 ? -70 * carry + swing * 0.3 * (1 - carry) : swing * 0.85;
  const headTilt = phone ? 14 : granny ? 10 : 0;
  const stoop = granny ? 9 : 0;
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`} style={{ filter: dim ? `brightness(${1 - dim})` : undefined }}>
      <ellipse cx={0} cy={2} rx={42} ry={9} fill="rgba(0,0,0,0.45)" />
      <g transform={`translate(0 ${-bob})`}>
        <Leg angle={-swing} color={look.pants} back />
        <g transform={`rotate(${stoop} 0 -128)`}>
          <Arm angle={armBack} color={look.top} skin={look.skin} back />
          {look.bag && !granny && <rect x={-46} y={-222} width={30} height={78} rx={10} fill={toon.kioskDark} stroke={O} strokeWidth={SW} />}
        </g>
        <Leg angle={swing} color={look.pants} />
        <g transform={`rotate(${stoop} 0 -128)`}>
          {/* torso, or a coat / dress that covers the hips */}
          {look.skirt ? (
            <path d={`M-30 -232 Q-36 -160 -42 ${granny ? -48 : -70} L42 ${granny ? -48 : -70} Q36 -160 30 -232 Q0 -246 -30 -232 Z`} fill={look.top} stroke={O} strokeWidth={SW} strokeLinejoin="round" />
          ) : (
            <path d="M-30 -232 Q-34 -150 -28 -122 L28 -122 Q34 -150 30 -232 Q0 -246 -30 -232 Z" fill={look.top} stroke={O} strokeWidth={SW} strokeLinejoin="round" />
          )}
          <path d="M2 -236 L2 -124" stroke="rgba(0,0,0,0.18)" strokeWidth={3} />
          <g transform={`rotate(${headTilt} 0 -246)`}>
            <rect x={-9} y={-252} width={18} height={16} fill={look.skin} stroke={O} strokeWidth={SW} />
            <Head look={look} />
          </g>
          <Arm angle={armFront} color={look.top} skin={look.skin} carry={carry} phone={phone} cane={granny} />
        </g>
      </g>
    </g>
  );
};

const Leg: React.FC<{ angle: number; color: string; back?: boolean }> = ({ angle, color, back }) => (
  <g transform={`rotate(${angle} 0 -128)`} style={{ filter: back ? "brightness(0.72)" : undefined }}>
    <rect x={-12} y={-132} width={24} height={122} rx={11} fill={color} stroke={O} strokeWidth={SW} />
    <path d="M-13 -12 Q-14 4 0 4 L26 4 Q30 -6 18 -12 Z" fill={toon.shoe} stroke={O} strokeWidth={SW} strokeLinejoin="round" />
  </g>
);

const Arm: React.FC<{ angle: number; color: string; skin: string; back?: boolean; carry?: number; phone?: boolean; cane?: boolean }> = ({ angle, color, skin, back, carry = 0, phone, cane }) => {
  const bend = phone ? -95 : carry > 0 ? -40 * carry : cane ? 20 : 0;
  return (
    <g transform={`rotate(${angle} 0 -222)`} style={{ filter: back ? "brightness(0.72)" : undefined }}>
      <rect x={-10} y={-226} width={20} height={60} rx={10} fill={color} stroke={O} strokeWidth={SW} />
      <g transform={`rotate(${bend} 0 -172)`}>
        <rect x={-9} y={-176} width={18} height={54} rx={9} fill={color} stroke={O} strokeWidth={SW} />
        {cane && (
          <g transform={`rotate(${-angle - bend} 0 -122)`}>
            <path d="M0 -122 L4 0" stroke={toon.meatLo} strokeWidth={7} strokeLinecap="round" />
            <path d="M0 -122 Q-2 -136 -14 -132" stroke={toon.meatLo} strokeWidth={7} fill="none" strokeLinecap="round" />
          </g>
        )}
        {cane && <rect x={-30} y={-126} width={26} height={34} rx={6} fill={toon.kioskDark} stroke={O} strokeWidth={2.4} />}
        <circle cx={0} cy={-122} r={10} fill={skin} stroke={O} strokeWidth={SW} />
        {carry > 0 && <Shawarma x={6} y={-132} scale={0.55 * carry} rot={-20} />}
        {phone && (
          <g>
            <rect x={-2} y={-140} width={16} height={28} rx={3} fill={toon.outline} />
            <rect x={0} y={-137} width={12} height={20} rx={2} fill={palette.accent} opacity={0.75} />
          </g>
        )}
      </g>
    </g>
  );
};

const Head: React.FC<{ look: Look }> = ({ look }) => {
  const { skin, hair, style, kind } = look;
  const granny = kind === "granny";
  return (
    <g>
      {style === 3 && !granny && <path d="M-30 -282 Q-46 -236 -30 -196 L-4 -226 Z" fill={hair} stroke={O} strokeWidth={SW} />}
      <circle cx={2} cy={-270} r={30} fill={skin} stroke={O} strokeWidth={SW} />
      <path d="M30 -272 Q40 -264 31 -258" fill={skin} stroke={O} strokeWidth={SW} strokeLinecap="round" />
      <circle cx={19} cy={-276} r={3.6} fill={O} />
      {kind === "woman" && <path d="M22 -282 L27 -286" stroke={O} strokeWidth={2.4} strokeLinecap="round" />}
      <path d="M14 -254 Q20 -251 25 -255" fill="none" stroke={O} strokeWidth={2.4} strokeLinecap="round" />
      {look.beard && (
        <g>
          <path d="M-12 -266 Q-10 -238 10 -236 Q30 -236 33 -252 Q26 -246 20 -250 Q10 -254 2 -250 Q-4 -256 -12 -266 Z" fill={toon.hair[0]} stroke={O} strokeWidth={2.4} strokeLinejoin="round" />
          <path d="M8 -284 L26 -286" stroke={toon.hair[0]} strokeWidth={5} strokeLinecap="round" />
        </g>
      )}
      {granny ? (
        // headscarf tied under the chin
        <g>
          <path d="M-34 -262 Q-38 -310 4 -306 Q36 -302 34 -272 Q30 -286 8 -290 Q-14 -290 -18 -262 Q-20 -240 -8 -236 L-30 -232 Q-36 -246 -34 -262 Z" fill={look.top} stroke={O} strokeWidth={SW} strokeLinejoin="round" style={{ filter: "brightness(1.35)" }} />
          <path d="M-8 -236 L6 -230 L-4 -222 Z" fill={look.top} stroke={O} strokeWidth={2.4} style={{ filter: "brightness(1.35)" }} />
          <path d="M8 -288 Q20 -290 30 -282" fill="none" stroke={hair} strokeWidth={5} strokeLinecap="round" />
        </g>
      ) : (
        <>
          {style === 0 && <path d="M-28 -276 Q-26 -306 6 -302 Q30 -300 32 -282 Q14 -290 -4 -284 Q-18 -280 -28 -276 Z" fill={hair} stroke={O} strokeWidth={SW} strokeLinejoin="round" />}
          {style === 1 && (
            <g>
              <path d="M-29 -276 Q-28 -306 4 -304 Q30 -302 31 -280 Z" fill={look.top} stroke={O} strokeWidth={SW} style={{ filter: "brightness(0.7)" }} />
              <path d="M22 -282 L50 -278 Q48 -272 24 -274 Z" fill={look.top} stroke={O} strokeWidth={SW} style={{ filter: "brightness(0.7)" }} />
            </g>
          )}
          {style === 2 && <path d="M-36 -262 Q-40 -312 4 -310 Q40 -308 36 -276 Q28 -296 4 -296 Q-22 -294 -24 -258 Q-26 -238 -16 -228 L-32 -230 Q-38 -246 -36 -262 Z" fill={look.top} stroke={O} strokeWidth={SW} strokeLinejoin="round" />}
          {style === 3 && <path d="M-30 -272 Q-30 -308 6 -304 Q32 -300 32 -280 Q8 -290 -14 -278 Z" fill={hair} stroke={O} strokeWidth={SW} strokeLinejoin="round" />}
          {style === 4 && <path d="M-26 -284 Q-10 -300 12 -298" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth={4} strokeLinecap="round" />}
          {style === 5 && (
            <g>
              <path d="M-30 -272 Q-30 -308 6 -304 Q32 -300 32 -282 Q10 -292 -14 -280 Z" fill={hair} stroke={O} strokeWidth={SW} strokeLinejoin="round" />
              <circle cx={-26} cy={-298} r={13} fill={hair} stroke={O} strokeWidth={SW} />
            </g>
          )}
        </>
      )}
    </g>
  );
};

/** Moscow-style metro pillar: a lit box with the red М on a pole. Pole stands at (x, ground). */
export const MetroSign: React.FC<{ x: number; ground: number; t: number }> = ({ x, ground, t }) => {
  const glow = 0.85 + 0.15 * Math.sin(t * 1.7);
  return (
    <g>
      <ellipse cx={x} cy={ground - 330} rx={120} ry={90} fill={colors.bad} opacity={0.14 * glow} style={{ filter: "blur(26px)" }} />
      <rect x={x - 7} y={ground - 300} width={14} height={300} fill={toon.kioskEdge} stroke={O} strokeWidth={2.4} />
      <rect x={x - 50} y={ground - 382} width={100} height={100} rx={10} fill={colors.paper} stroke={O} strokeWidth={SW} />
      <text x={x} y={ground - 302} textAnchor="middle" fontFamily={`${theme.fonts.wide}, ${theme.fonts.mono}`} fontWeight={900} fontSize={82} fill={colors.bad} style={{ filter: `drop-shadow(0 0 6px ${colors.badGlow})` }}>М</text>
    </g>
  );
};

/* ------------------------------------------------------------ props */

export const Shawarma: React.FC<{ x: number; y: number; scale?: number; rot?: number }> = ({ x, y, scale = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${scale})`}>
    <path d="M-16 -46 Q0 -60 16 -46 L20 30 Q0 40 -20 30 Z" fill={toon.lavash} stroke={O} strokeWidth={SW} strokeLinejoin="round" />
    <path d="M-15 -44 Q-4 -30 2 -50 Q8 -32 15 -44" fill={toon.meatHi} stroke={O} strokeWidth={2.4} />
    <path d="M-10 -40 L-4 -46 M6 -42 L11 -47" stroke={palette.primary} strokeWidth={3} strokeLinecap="round" />
    <path d="M-20 4 L20 4 L20 30 Q0 40 -20 30 Z" fill={colors.paper} stroke={O} strokeWidth={SW} strokeLinejoin="round" />
    <path d="M-20 12 L20 12" stroke={toon.lavashLo} strokeWidth={2} />
  </g>
);

/* ------------------------------------------------------------ seller */

/**
 * The shawarma man, front-on behind the counter; (x, y) is the counter top
 * under his belly. `p` is the order stage: slice at the spit, roll the
 * lavash, hand it over the counter to the left.
 */
export const Seller: React.FC<{ x: number; y: number; t: number; p: number | null; helper?: boolean }> = ({ x, y, t, p, helper = false }) => {
  const slicing = p !== null && p < 0.45;
  const rolling = p !== null && p >= 0.45 && p < 0.82;
  const handing = p !== null && p >= 0.82;
  const chop = slicing ? Math.sin(t * 34) * 14 : 0;
  const breathe = Math.sin(t * 2.2) * 2;
  const look = handing ? -8 : slicing ? 10 : rolling ? 0 : Math.sin(t * 0.9) * 4;
  // right arm (screen right) reaches the spit, left arm reaches the client
  const rArm = slicing ? -58 + chop * 0.4 : rolling ? -18 : -8;
  const lArm = handing ? 78 : rolling ? 26 : 12;
  return (
    <g transform={`translate(${x} ${y + breathe})`}>
      {/* back arm (left, toward the client) */}
      <g transform={`rotate(${lArm} -52 -150)`}>
        <rect x={-66} y={-156} width={28} height={110} rx={14} fill={toon.skin[1]} stroke={O} strokeWidth={SW} />
        <circle cx={-52} cy={-42} r={15} fill={toon.skin[1]} stroke={O} strokeWidth={SW} />
        {handing && <Shawarma x={-48} y={-26} scale={0.7} rot={-150} />}
      </g>
      {/* torso: dark tee, white apron */}
      <path d="M-62 -168 Q-70 -60 -64 0 L64 0 Q70 -60 62 -168 Q0 -190 -62 -168 Z" fill={toon.kioskDark} stroke={O} strokeWidth={SW} strokeLinejoin="round" />
      <path d="M-44 -120 L44 -120 L50 0 L-50 0 Z" fill={toon.apron} stroke={O} strokeWidth={SW} strokeLinejoin="round" />
      <path d="M-44 -120 L-30 -172 M44 -120 L30 -172" stroke={toon.apronShade} strokeWidth={6} strokeLinecap="round" />
      <path d="M-40 -64 L40 -64" stroke={toon.apronShade} strokeWidth={3} />
      <path d="M-20 -60 Q-10 -40 6 -58" fill="none" stroke={colors.bad} strokeWidth={3} opacity={0.7} />
      {/* head */}
      <g transform={`translate(${look} 0)`}>
        <rect x={-18} y={-196} width={36} height={24} fill={toon.skin[1]} stroke={O} strokeWidth={SW} />
        <ellipse cx={0} cy={-236} rx={44} ry={48} fill={toon.skin[1]} stroke={O} strokeWidth={SW} />
        <ellipse cx={-45} cy={-232} rx={8} ry={12} fill={toon.skin[1]} stroke={O} strokeWidth={2.6} />
        <ellipse cx={45} cy={-232} rx={8} ry={12} fill={toon.skin[1]} stroke={O} strokeWidth={2.6} />
        {/* beard wraps the jaw (the helper is young and clean-shaven) */}
        {!helper && <path d="M-44 -238 Q-46 -180 0 -176 Q46 -180 44 -238 Q36 -206 20 -206 Q0 -214 -20 -206 Q-36 -206 -44 -238 Z" fill={toon.hair[0]} stroke={O} strokeWidth={SW} strokeLinejoin="round" />}
        {/* moustache + smile */}
        {!helper && <path d="M-22 -214 Q-10 -224 0 -216 Q10 -224 22 -214 Q12 -208 0 -212 Q-12 -208 -22 -214 Z" fill={toon.hair[0]} />}
        <path d="M-12 -203 Q0 -194 12 -203" fill={colors.ink} stroke={O} strokeWidth={2.4} />
        {/* nose, eyes, brows */}
        <path d="M0 -246 Q-8 -226 -2 -222 Q4 -220 8 -224" fill="none" stroke={O} strokeWidth={2.8} strokeLinecap="round" />
        <circle cx={-17} cy={-250} r={4.6} fill={O} />
        <circle cx={17} cy={-250} r={4.6} fill={O} />
        <path d="M-30 -264 Q-18 -272 -6 -264" stroke={toon.hair[0]} strokeWidth={7} strokeLinecap="round" fill="none" />
        <path d="M6 -264 Q18 -272 30 -264" stroke={toon.hair[0]} strokeWidth={7} strokeLinecap="round" fill="none" />
        {/* cap */}
        <path d="M-44 -258 Q-46 -296 0 -298 Q46 -296 44 -258 Q0 -272 -44 -258 Z" fill={helper ? colors.paper : toon.kioskDark} stroke={O} strokeWidth={SW} strokeLinejoin="round" />
        <path d="M-50 -258 Q0 -276 50 -258 Q0 -262 -50 -258 Z" fill={helper ? colors.paper : toon.kioskDark} stroke={O} strokeWidth={SW} />
        <circle cx={0} cy={-284} r={5} fill={palette.primary} />
      </g>
      {/* front arm (right, toward the spit) with the knife */}
      <g transform={`rotate(${rArm} 52 -150)`}>
        <rect x={38} y={-156} width={28} height={110} rx={14} fill={toon.skin[1]} stroke={O} strokeWidth={SW} />
        <circle cx={52} cy={-42} r={15} fill={toon.skin[1]} stroke={O} strokeWidth={SW} />
        <g transform={`translate(52 -36) rotate(${-30 + chop})`}>
          <rect x={-5} y={-2} width={10} height={22} rx={3} fill={toon.kioskDark} stroke={O} strokeWidth={2} />
          <path d="M-6 20 L6 20 L4 70 Q0 76 -6 66 Z" fill={toon.steel} stroke={O} strokeWidth={2.4} />
        </g>
      </g>
    </g>
  );
};

/* ------------------------------------------------------------ kiosk */

const SIGN = "ШАУРМА";

/** The spit: a meat cone with shifting bands so it reads as turning, red heat behind. */
const Spit: React.FC<{ x: number; y: number; t: number; heat: number }> = ({ x, y, t, heat }) => {
  const turn = (t * 26) % 18;
  const bands = Array.from({ length: 9 }, (_, i) => i);
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={38} y={-6} width={24} height={176} rx={6} fill={colors.bad} opacity={0.25 + heat * 0.25} style={{ filter: `blur(6px)` }} />
      <rect x={42} y={0} width={14} height={164} rx={4} fill={colors.bad} stroke={O} strokeWidth={2.4} opacity={0.9} />
      <line x1={0} y1={-12} x2={0} y2={180} stroke={toon.steel} strokeWidth={5} />
      <clipPath id="spit-clip">
        <path d="M-36 6 Q0 -6 36 6 L24 150 Q0 160 -24 150 Z" />
      </clipPath>
      <path d="M-36 6 Q0 -6 36 6 L24 150 Q0 160 -24 150 Z" fill={toon.meat} />
      <g clipPath="url(#spit-clip)">
        {bands.map((i) => (
          <path key={i} d={`M-40 ${i * 18 - turn} Q0 ${i * 18 - turn + 8} 40 ${i * 18 - turn}`} stroke={i % 2 ? toon.meatHi : toon.meatLo} strokeWidth={6} fill="none" />
        ))}
        <rect x={14} y={-10} width={30} height={180} fill={colors.bad} opacity={0.22} />
      </g>
      <path d="M-36 6 Q0 -6 36 6 L24 150 Q0 160 -24 150 Z" fill="none" stroke={O} strokeWidth={SW} />
      <ellipse cx={0} cy={168} rx={34} ry={7} fill={toon.steel} stroke={O} strokeWidth={2.4} />
    </g>
  );
};

/** Kiosk, top-left at (x, y): neon sign, striped awning, window, counter, menu. Width 440, ground at y + 420. */
export const Kiosk: React.FC<{ x: number; y: number; t: number; p: number | null; children?: React.ReactNode }> = ({ x, y, t, p, children }) => {
  const flicker = 0.9 + 0.1 * Math.sin(t * 23) * Math.sin(t * 7.3);
  const stripes = Array.from({ length: 10 }, (_, i) => i);
  const slicing = p !== null && p < 0.45;
  const roll = p !== null && p >= 0.45 && p < 0.82 ? (p - 0.45) / 0.37 : 0;
  return (
    <g transform={`translate(${x} ${y})`}>
      {/* neon spill on the wall and pavement */}
      <ellipse cx={220} cy={470} rx={330} ry={46} fill={palette.primary} opacity={0.09 * flicker} style={{ filter: "blur(18px)" }} />
      <ellipse cx={220} cy={60} rx={300} ry={130} fill={palette.primary} opacity={0.07 * flicker} style={{ filter: "blur(30px)" }} />
      {/* body */}
      <rect x={0} y={130} width={440} height={290} fill={toon.kiosk} stroke={O} strokeWidth={SW} />
      {/* window */}
      <rect x={30} y={140} width={380} height={168} fill={toon.interior} stroke={O} strokeWidth={SW} />
      {Array.from({ length: 6 }, (_, r) =>
        Array.from({ length: 12 }, (_, c) => <rect key={`${r}-${c}`} x={32 + c * 32} y={142 + r * 28} width={30} height={26} fill={toon.tile} />),
      )}
      <rect x={30} y={140} width={380} height={168} fill={`url(#warm)`} />
      <defs>
        <linearGradient id="warm" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={colors.paper} stopOpacity={0.16} />
          <stop offset="1" stopColor={colors.paper} stopOpacity={0.02} />
        </linearGradient>
      </defs>
      <Spit x={352} y={150} t={t} heat={slicing ? 1 : 0.5} />
      {/* shelf with lavash and sauces */}
      <rect x={44} y={220} width={70} height={8} fill={toon.steel} opacity={0.7} />
      <rect x={52} y={196} width={20} height={24} rx={4} fill={colors.paper} stroke={O} strokeWidth={2} />
      <rect x={78} y={190} width={20} height={30} rx={4} fill={colors.bad} stroke={O} strokeWidth={2} />
      {children /* the seller stands here, behind the counter */}
      {/* counter */}
      <rect x={-12} y={300} width={464} height={20} fill={toon.steel} stroke={O} strokeWidth={SW} />
      <rect x={-12} y={300} width={464} height={5} fill="rgba(255,255,255,0.35)" />
      {/* lavash being rolled on the counter */}
      <g transform="translate(150 296)">
        <ellipse cx={30} cy={0} rx={64 * (1 - roll * 0.6)} ry={8} fill={toon.lavash} stroke={O} strokeWidth={2.4} />
        {roll > 0 && <rect x={30 - 64 * (1 - roll * 0.6)} y={-18 * roll} width={36 * roll + 10} height={18 * roll + 2} rx={8} fill={toon.lavashLo} stroke={O} strokeWidth={2} />}
      </g>
      {/* stack of lavash at the edge */}
      <g transform="translate(40 292)">
        {[0, 1, 2, 3].map((i) => <ellipse key={i} cx={20} cy={-i * 4} rx={30} ry={6} fill={toon.lavash} stroke={O} strokeWidth={1.6} />)}
      </g>
      {/* lower panel details */}
      <rect x={20} y={340} width={180} height={64} rx={6} fill={toon.kioskDark} stroke={O} strokeWidth={2} />
      {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={34} y={352 + i * 10} width={152} height={3} fill={toon.kioskEdge} />)}
      {/* menu card */}
      <g transform="translate(236 332) rotate(-2)">
        <rect x={0} y={0} width={180} height={76} rx={6} fill={colors.paper} stroke={O} strokeWidth={SW} />
        <text x={14} y={30} fontFamily={theme.fonts.mono} fontWeight={700} fontSize={19} fill={colors.ink} letterSpacing="0.06em">ШАУРМА</text>
        <text x={14} y={64} fontFamily={theme.fonts.mono} fontWeight={800} fontSize={30} fill={colors.ink}>500 ₽</text>
      </g>
      {/* roof + sign */}
      <rect x={-16} y={0} width={472} height={22} fill={toon.kioskDark} stroke={O} strokeWidth={SW} />
      <rect x={30} y={22} width={380} height={72} rx={8} fill={colors.ink2} stroke={O} strokeWidth={SW} />
      <text
        x={220}
        y={76}
        textAnchor="middle"
        fontFamily={`${theme.fonts.wide}, ${theme.fonts.mono}`}
        fontWeight={900}
        fontSize={50}
        letterSpacing="0.04em"
        fill={palette.primary}
        opacity={flicker}
        style={{ filter: `drop-shadow(0 0 8px ${palette.glow}) drop-shadow(0 0 22px ${palette.glow})` }}
      >
        {SIGN}
      </text>
      {/* awning */}
      <g>
        {stripes.map((i) => (
          <path key={i} d={`M${-16 + i * 47.2} 94 L${-16 + (i + 1) * 47.2} 94 L${-16 + (i + 1) * 47.2} 128 Q${-16 + (i + 0.5) * 47.2} 142 ${-16 + i * 47.2} 128 Z`} fill={i % 2 ? colors.paper : toon.kioskDark} stroke={O} strokeWidth={2.4} />
        ))}
      </g>
    </g>
  );
};

/* ------------------------------------------------------------ street */

/** Skyline, lamp, pavement and road for a frame `w` wide whose pavement starts at `ground`. */
export const Street: React.FC<{ t: number; ground: number; bottom: number; w?: number }> = ({ t, ground, bottom, w = 1080 }) => {
  const blocks = [
    { x: -20, w: 230, h: 520 },
    { x: 200, w: 170, h: 380 },
    { x: 360, w: 260, h: 600 },
    { x: 610, w: 190, h: 430 },
    { x: 790, w: 310, h: 560 },
  ];
  return (
    <g>
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={toon.skyTop} />
          <stop offset="1" stopColor={toon.skyLow} />
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={w} height={ground} fill="url(#sky)" />
      {Array.from({ length: 26 }, (_, i) => (
        <circle key={i} cx={rnd(i + 3) * w} cy={rnd(i + 40) * 320 + 40} r={rnd(i + 80) * 1.6 + 0.6} fill={colors.paper} opacity={0.2 + 0.25 * Math.sin(t * 2 + i)} />
      ))}
      {blocks.map((b, bi) => (
        <g key={bi}>
          <rect x={b.x} y={ground - b.h} width={b.w} height={b.h} fill={toon.building[bi % 3]} stroke={O} strokeWidth={2} />
          {Array.from({ length: Math.floor((b.h - 60) / 54) }, (_, r) =>
            Array.from({ length: Math.floor((b.w - 30) / 46) }, (_, c) => {
              const on = rnd(bi * 97 + r * 13 + c) > 0.55;
              return <rect key={`${r}-${c}`} x={b.x + 22 + c * 46} y={ground - b.h + 30 + r * 54} width={24} height={30} fill={on ? toon.windowOn : toon.windowOff} opacity={on ? 0.35 + rnd(bi + r + c * 3) * 0.4 : 1} />;
            }),
          )}
        </g>
      ))}
      {/* street wall at ground level */}
      <rect x={0} y={ground - 120} width={w} height={120} fill={toon.wall} />
      <rect x={0} y={ground - 120} width={w} height={4} fill={colors.lineStrong} opacity={0.4} />
      {/* pavement */}
      <rect x={0} y={ground} width={w} height={bottom - ground - 70} fill={toon.sidewalk} />
      {Array.from({ length: 14 }, (_, i) => (
        <line key={i} x1={i * 90 - 40} y1={ground} x2={i * 90 - 80} y2={bottom - 70} stroke={toon.sidewalkLine} strokeWidth={2} />
      ))}
      <line x1={0} y1={ground + 60} x2={w} y2={ground + 60} stroke={toon.sidewalkLine} strokeWidth={2} />
      <rect x={0} y={bottom - 70} width={w} height={18} fill={toon.curb} />
      <rect x={0} y={bottom - 52} width={w} height={52} fill={toon.road} />
      {Array.from({ length: 7 }, (_, i) => (
        <rect key={i} x={((i * 200 - t * 120) % 1400 + 1400) % 1400 - 160} y={bottom - 28} width={90} height={6} fill={colors.paper} opacity={0.25} />
      ))}
    </g>
  );
};

/** Street lamp with a soft cone; the pole stands on the pavement at (x, ground). */
export const Lamp: React.FC<{ x: number; ground: number; t: number }> = ({ x, ground, t }) => (
  <g>
    <path d={`M${x + 40} ${ground - 380} L${x - 90} ${ground + 70} L${x + 170} ${ground + 70} Z`} fill={toon.lampLight} opacity={0.8 + 0.05 * Math.sin(t * 3)} style={{ filter: "blur(12px)" }} />
    <rect x={x - 6} y={ground - 400} width={12} height={400} fill={toon.kioskEdge} stroke={O} strokeWidth={2.4} />
    <path d={`M${x} ${ground - 400} Q${x + 10} ${ground - 430} ${x + 50} ${ground - 420}`} stroke={toon.kioskEdge} strokeWidth={10} fill="none" />
    <path d={`M${x + 26} ${ground - 420} L${x + 74} ${ground - 420} L${x + 64} ${ground - 396} L${x + 36} ${ground - 396} Z`} fill={toon.kioskDark} stroke={O} strokeWidth={2.4} />
    <ellipse cx={x + 50} cy={ground - 394} rx={16} ry={5} fill={colors.paper} />
  </g>
);

/** A scruffy street dog in profile, facing right; `phase` drives the gallop, `prize` puts a shawarma in its mouth. */
export const Dog: React.FC<{ x: number; y: number; phase: number; flip?: boolean; prize?: boolean; size?: number }> = ({ x, y, phase, flip = false, prize = false, size = 1 }) => {
  const a = Math.sin(phase) * 32;
  const fur = toon.hair[2];
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -size : size} ${size})`}>
      <ellipse cx={0} cy={2} rx={60} ry={9} fill="rgba(0,0,0,0.45)" />
      <g transform={`translate(0 ${-Math.abs(Math.cos(phase)) * 8})`}>
        {[[-34, a], [34, -a], [-24, -a], [44, a]].map(([lx, ang], i) => (
          <rect key={i} x={lx - 7} y={-62} width={14} height={60} rx={7} fill={fur} stroke={O} strokeWidth={SW} transform={`rotate(${ang} ${lx} -60)`} style={{ filter: i > 1 ? "brightness(0.75)" : undefined }} />
        ))}
        <path d={`M-52 -88 Q-80 ${-120 + Math.sin(phase * 2) * 10} -86 -110`} stroke={fur} strokeWidth={10} fill="none" strokeLinecap="round" />
        <ellipse cx={0} cy={-78} rx={58} ry={26} fill={fur} stroke={O} strokeWidth={SW} />
        <circle cx={58} cy={-104} r={24} fill={fur} stroke={O} strokeWidth={SW} />
        <path d="M70 -100 L96 -96 Q98 -86 74 -88 Z" fill={fur} stroke={O} strokeWidth={SW} strokeLinejoin="round" />
        <circle cx={96} cy={-95} r={5} fill={O} />
        <circle cx={64} cy={-110} r={3.6} fill={O} />
        <path d="M44 -124 Q36 -98 50 -96 Q54 -112 44 -124 Z" fill={toon.hair[1]} stroke={O} strokeWidth={2.4} />
        {prize && <Shawarma x={92} y={-84} scale={0.5} rot={80} />}
      </g>
    </g>
  );
};

/** Courier on an e-scooter with a cube bag, facing right, feet at (x, y). */
export const Courier: React.FC<{ x: number; y: number; t: number }> = ({ x, y, t }) => (
  <g>
    <g transform={`translate(${x} ${y})`}>
      <line x1={-50} y1={-14} x2={50} y2={-14} stroke={toon.kioskEdge} strokeWidth={10} strokeLinecap="round" />
      <line x1={46} y1={-14} x2={58} y2={-170} stroke={toon.kioskEdge} strokeWidth={7} strokeLinecap="round" />
      <line x1={46} y1={-170} x2={72} y2={-170} stroke={toon.kioskEdge} strokeWidth={7} strokeLinecap="round" />
      {[-46, 50].map((wx) => (
        <g key={wx} transform={`translate(${wx} -4) rotate(${t * 900})`}>
          <circle r={14} fill={O} />
          <line x1={-10} y1={0} x2={10} y2={0} stroke={toon.steel} strokeWidth={2} />
        </g>
      ))}
    </g>
    <Person x={x - 6} y={y - 18} look={lookFor(77, { kind: "man", style: 1 })} phase={0.6} moving={0.25} />
    <g transform={`translate(${x - 74} ${y - 270})`}>
      <rect x={0} y={0} width={70} height={76} rx={8} fill={colors.paper} stroke={O} strokeWidth={SW} />
      <path d="M8 16 L62 16" stroke={toon.lavashLo} strokeWidth={3} />
    </g>
  </g>
);
