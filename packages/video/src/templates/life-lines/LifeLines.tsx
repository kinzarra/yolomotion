import React from "react";
import {
  AbsoluteFill,
  interpolate,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Grain, Vignette } from "../../components/Layers";
import { ease, fonts, palette, springs } from "./palette";
import {
  ageAt,
  EDGES,
  EVENTS,
  FINALE_FRAME,
  frameOfAge,
  laneX,
  NOW_Y,
  PEOPLE,
  Person,
  PX_PER_YEAR,
  wobbleX,
  AGES,
} from "./data";
import { LifeLinesProps } from "./schema";

const W = 1080;
const H = 1920;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const SEEDS = PEOPLE.map((p) => random(`seed-${p.id}`));
const STAR_TRAVEL_S = 1.6;
const TRAIL_YEARS = 12;
export const SAFE_SCALE = 0.8;

// ---------------------------------------------------------------- positions
type Head = {
  x: number;
  y: number;
  /** 0 = riding the now line, 1 = settled as a star */
  k: number;
  /** birth pop 0..1 */
  pop: number;
};

const headOf = (p: Person, i: number, frame: number, fps: number): Head | null => {
  const a = ageAt(frame);
  if (a < p.start) return null;
  const bornBefore = p.start <= AGES[0];
  const pop = bornBefore
    ? 1
    : spring({ frame: frame - frameOfAge(p.start), fps, config: springs.pop });
  if (a <= p.end) {
    return { x: laneX(p, a) + wobbleX(p, a, SEEDS[i]), y: NOW_Y, k: 0, pop };
  }
  if (p.endKind !== "star" || !p.star) return null;
  const fd = frameOfAge(p.end);
  const k = interpolate(frame, [fd, fd + STAR_TRAVEL_S * fps], [0, 1], {
    ...clamp,
    easing: ease.inOut,
  });
  const x0 = laneX(p, p.end) + wobbleX(p, p.end, SEEDS[i]);
  const [sx, sy] = p.star;
  return {
    x: x0 + (sx - x0) * k + Math.sin(k * Math.PI) * 40,
    y: NOW_Y + (sy - NOW_Y) * k,
    k,
    pop: 1,
  };
};

// ---------------------------------------------------------------- sky
const STARFIELD = Array.from({ length: 170 }, (_, i) => ({
  x: random(`sx${i}`) * W,
  y: random(`sy${i}`) * H * 0.95,
  r: 0.6 + random(`sr${i}`) * 1.4,
  ph: random(`sp${i}`) * 6.28,
  sp: 14 + random(`ss${i}`) * 26,
}));

export const Sky: React.FC = () => {
  const frame = useCurrentFrame();
  const d = Math.sin(frame / 90) * 30;
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${palette.skyTop} 0%, ${palette.skyMid} 45%, ${palette.skyBottom} 100%)`,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: -200 + d,
          top: -250,
          width: 1100,
          height: 900,
          borderRadius: "50%",
          filter: "blur(60px)",
          background: `radial-gradient(circle, ${palette.nebula}, transparent 65%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          right: -300 - d,
          top: 150,
          width: 900,
          height: 800,
          borderRadius: "50%",
          filter: "blur(70px)",
          background: `radial-gradient(circle, ${palette.nebula2}, transparent 65%)`,
        }}
      />
      <svg width={W} height={H} style={{ position: "absolute" }}>
        {STARFIELD.map((s, i) => (
          <circle
            key={i}
            cx={s.x}
            cy={s.y}
            r={s.r}
            fill={palette.star}
            opacity={(0.18 + 0.32 * (0.5 + 0.5 * Math.sin(frame / s.sp + s.ph))) * (1 - s.y / H * 0.6)}
          />
        ))}
      </svg>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- age axis
const AXIS_X = 82;
export const AgeAxis: React.FC = () => {
  const frame = useCurrentFrame();
  const a = ageAt(frame);
  const ticks: React.ReactNode[] = [];
  const top = 270;
  const bottom = 1840;
  for (let n = Math.floor(a - (bottom - NOW_Y) / PX_PER_YEAR); n <= Math.ceil(a + (NOW_Y - top) / PX_PER_YEAR); n++) {
    const y = NOW_Y - (n - a) * PX_PER_YEAR;
    if (y < top || y > bottom) continue;
    const five = n % 5 === 0;
    const fade = interpolate(y, [top, top + 120, bottom - 300, bottom], [0, 1, 1, 0], clamp);
    ticks.push(
      <g key={n} opacity={fade}>
        <line x1={AXIS_X - (five ? 12 : 6)} x2={AXIS_X} y1={y} y2={y} stroke={palette.axis} strokeWidth={2} />
        {five && n >= 0 && n !== Math.floor(a) && Math.abs(y - NOW_Y) > 40 ? (
          <text x={AXIS_X - 18} y={y + 8} textAnchor="end" fontFamily={fonts.label} fontSize={26} fill={palette.axisText}>
            {n}
          </text>
        ) : null}
      </g>,
    );
  }
  const shown = Math.max(0, Math.floor(a));
  return (
    <svg width={W} height={H} style={{ position: "absolute" }}>
      <text x={34} y={250} fontFamily={fonts.label} fontSize={28} fill={palette.axisText}>
        возраст
      </text>
      <line x1={AXIS_X} x2={AXIS_X} y1={top} y2={bottom} stroke={palette.axis} strokeWidth={2} />
      {ticks}
      {a >= 0 ? (
        <>
          <circle cx={AXIS_X} cy={NOW_Y} r={6} fill={palette.now} />
          <text x={AXIS_X - 18} y={NOW_Y + 9} textAnchor="end" fontFamily={fonts.label} fontWeight={600} fontSize={30} fill={palette.now}>
            {shown}
          </text>
        </>
      ) : null}
    </svg>
  );
};

// ---------------------------------------------------------------- threads
const trailPath = (p: Person, i: number, a: number) => {
  const q0 = Math.max(p.start, a - TRAIL_YEARS);
  const q1 = Math.min(a, p.end);
  if (q1 <= q0) return null;
  const pts: string[] = [];
  const step = 0.08;
  for (let q = q0; q < q1; q += step) {
    pts.push(`${(laneX(p, q) + wobbleX(p, q, SEEDS[i])).toFixed(1)},${(NOW_Y + (a - q) * PX_PER_YEAR).toFixed(1)}`);
  }
  pts.push(`${(laneX(p, q1) + wobbleX(p, q1, SEEDS[i])).toFixed(1)},${(NOW_Y + (a - q1) * PX_PER_YEAR).toFixed(1)}`);
  return "M" + pts.join("L");
};

export const Threads: React.FC = () => {
  const frame = useCurrentFrame();
  const a = ageAt(frame);
  const paths = PEOPLE.map((p, i) => ({ p, i, d: trailPath(p, i, a) })).filter((t) => t.d);
  const sparkles: React.ReactNode[] = [];
  paths.forEach(({ p, i }) => {
    if (p.pass) return;
    const q0 = Math.max(p.start, a - TRAIL_YEARS);
    const q1 = Math.min(a, p.end);
    for (let q = Math.ceil(q0 * 3) / 3; q < q1 - 0.2; q += 1 / 3) {
      const tw = 0.5 + 0.5 * Math.sin(frame / 6 + q * 7 + i);
      sparkles.push(
        <circle
          key={`${p.id}-${q.toFixed(2)}`}
          cx={laneX(p, q) + wobbleX(p, q, SEEDS[i]) + (random(`${p.id}${q.toFixed(2)}`) - 0.5) * 6}
          cy={NOW_Y + (a - q) * PX_PER_YEAR}
          r={1.3 + tw * 1.1}
          fill="#ffffff"
          opacity={0.25 + 0.5 * tw}
        />,
      );
    }
  });
  return (
    <svg width={W} height={H} style={{ position: "absolute" }}>
      <defs>
        <filter id="ll-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation={7} />
        </filter>
        <linearGradient id="ll-fade" gradientUnits="userSpaceOnUse" x1={0} y1={NOW_Y} x2={0} y2={1880}>
          <stop offset="0" stopColor="#fff" stopOpacity={1} />
          <stop offset="0.55" stopColor="#fff" stopOpacity={0.75} />
          <stop offset="1" stopColor="#fff" stopOpacity={0} />
        </linearGradient>
        <mask id="ll-mask" maskUnits="userSpaceOnUse" x={0} y={0} width={W} height={H}>
          <rect x={0} y={NOW_Y - 4} width={W} height={H} fill="url(#ll-fade)" />
        </mask>
      </defs>
      <g mask="url(#ll-mask)">
        <g filter="url(#ll-glow)" opacity={0.6}>
          {paths.map(({ p, d }) => (
            <path key={p.id} d={d!} fill="none" stroke={p.color} strokeWidth={p.pass ? 5 : 10} opacity={p.pass ? 0.4 : 1} strokeLinecap="round" />
          ))}
        </g>
        {paths.map(({ p, d }) => (
          <path key={p.id} d={d!} fill="none" stroke={p.color} strokeWidth={p.pass ? 2.4 : 3.4} opacity={p.pass ? 0.6 : 0.95} strokeLinecap="round" />
        ))}
        {sparkles}
      </g>
    </svg>
  );
};

// ---------------------------------------------------------------- heads + stars
const Glint: React.FC<{ color: string; size: number; tw: number }> = ({ color, size, tw }) => {
  const L = 34 * size * (0.85 + 0.3 * tw);
  const bar = (rot: number) => (
    <div
      style={{
        position: "absolute",
        left: -L,
        top: -1.2,
        width: L * 2,
        height: 2.4,
        transform: `rotate(${rot}deg)`,
        background: `linear-gradient(90deg, transparent, ${color}, #ffffff, ${color}, transparent)`,
        opacity: 0.85,
      }}
    />
  );
  return (
    <>
      {bar(0)}
      {bar(90)}
    </>
  );
};

export const HeadsAndStars: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const finaleFade = interpolate(frame, [FINALE_FRAME, FINALE_FRAME + fps], [1, 0], { ...clamp, easing: ease.in });
  return (
    <AbsoluteFill>
      {PEOPLE.map((p, i) => {
        const h = headOf(p, i, frame, fps);
        if (!h || h.x < -60 || h.x > W + 60) return null;
        const tw = 0.5 + 0.5 * Math.sin(frame / 9 + SEEDS[i] * 6.28);
        const size = h.k > 0 ? 1 + ((p.starSize ?? 1) - 1) * h.k : 1;
        const living = p.endKind === "stay";
        const dim = living ? 0.55 + 0.45 * finaleFade : 1;
        // label: above the head while alive, beside the star once settled
        const side = p.starSide === "left" ? -1 : 1;
        const estW = p.label.length * 20;
        const edge = Math.min(0, W - 24 - (h.x + estW / 2)) + Math.max(0, 24 - (h.x - estW / 2));
        const lx = interpolate(h.k, [0, 1], [edge, side * (26 + 14 * size)]);
        const ly = interpolate(h.k, [0, 1], [-46 + (p.labelDy ?? 0), 0]);
        const anchor = interpolate(h.k, [0, 1], [-50, side > 0 ? 0 : -100]);
        const labelOpacity = (living ? finaleFade : 1) * h.pop;
        const isMe = p.id === "me";
        const flare =
          isMe && h.k > 0
            ? interpolate(frame, [FINALE_FRAME, FINALE_FRAME + 12, FINALE_FRAME + 2 * fps], [0, 1, 0.35], { ...clamp, easing: ease.out })
            : 0;
        const glowR = (h.k > 0 ? 46 : 40) * size * (1 + 0.15 * tw) + flare * 220;
        return (
          <div key={p.id} style={{ position: "absolute", left: h.x, top: h.y, opacity: dim }}>
            <div style={{ transform: `scale(${h.pop})` }}>
              <div
                style={{
                  position: "absolute",
                  left: -glowR,
                  top: -glowR,
                  width: glowR * 2,
                  height: glowR * 2,
                  borderRadius: "50%",
                  background: `radial-gradient(circle, ${p.color}${isMe && flare > 0 ? "aa" : "66"}, transparent 62%)`,
                  opacity: p.pass ? 0.5 : 1,
                }}
              />
              {h.k > 0 ? <Glint color={p.color} size={size * (1 + flare * 1.5)} tw={tw} /> : null}
              <div
                style={{
                  position: "absolute",
                  left: -8 * size,
                  top: -8 * size,
                  width: 16 * size,
                  height: 16 * size,
                  borderRadius: "50%",
                  background: `radial-gradient(circle, #ffffff 0 30%, ${p.color} 55%)`,
                  boxShadow: `0 0 ${14 * size}px ${p.color}`,
                }}
              />
            </div>
            <div
              style={{
                position: "absolute",
                left: lx,
                top: ly,
                transform: `translate(${anchor}%, -50%)`,
                whiteSpace: "nowrap",
                fontFamily: fonts.label,
                fontWeight: 600,
                fontSize: 34,
                color: p.pass ? palette.passLabel : p.color,
                textShadow: `0 0 14px ${p.pass ? "rgba(200,210,255,0.4)" : p.color + "88"}, 0 2px 6px rgba(0,0,0,0.6)`,
                opacity: labelOpacity,
              }}
            >
              {p.label}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- life events
const years = (n: number) => {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return "год";
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return "года";
  return "лет";
};

const Events: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill>
      {EVENTS.map(([age, text], i) => {
        const ef = frameOfAge(age);
        const next = EVENTS[i + 1] ? frameOfAge(EVENTS[i + 1][0]) : Infinity;
        const hold = Math.min(2.4 * fps, next - 16 - ef);
        if (frame < ef - 6 || frame > ef + hold + 10) return null;
        const inn = spring({ frame: frame - (ef - 6), fps, config: springs.pop });
        const out = interpolate(frame, [ef + hold, ef + hold + 10], [1, 0], { ...clamp, easing: ease.in });
        return (
          <div
            key={age}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 300,
              textAlign: "center",
              opacity: Math.min(inn, out),
              transform: `translateY(${(1 - inn) * 24 - (1 - out) * 16}px) scale(${0.9 + 0.1 * inn})`,
              fontFamily: fonts.label,
              fontWeight: 600,
              fontSize: 44,
              color: palette.text,
              textShadow: "0 2px 12px rgba(0,0,0,0.6)",
            }}
          >
            <span style={{ color: palette.now }}>
              {age} {years(age)}
            </span>
            <span style={{ color: palette.textDim }}>{"  ·  "}</span>
            {text}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- finale
const STAR_OF = Object.fromEntries(PEOPLE.filter((p) => p.star).map((p) => [p.id, p.star!]));

const Constellation: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = FINALE_FRAME + Math.round(STAR_TRAVEL_S * fps * 0.7);
  if (frame < start) return null;
  return (
    <svg width={W} height={H} style={{ position: "absolute" }}>
      {EDGES.map(([a, b], i) => {
        const [x1, y1] = STAR_OF[a];
        const [x2, y2] = STAR_OF[b];
        const len = Math.hypot(x2 - x1, y2 - y1);
        const s = start + i * Math.round(0.35 * fps);
        const k = interpolate(frame, [s, s + 0.8 * fps], [0, 1], { ...clamp, easing: ease.inOut });
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={palette.constellation}
            strokeWidth={2}
            strokeDasharray={len}
            strokeDashoffset={len * (1 - k)}
          />
        );
      })}
    </svg>
  );
};

const Finale: React.FC<LifeLinesProps> = ({ title, line1, line2, question, questionAccent, hint }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (s: number) => FINALE_FRAME + Math.round(s * fps);
  const enter = (f0: number) => spring({ frame: frame - f0, fps, config: springs.soft });
  const tIn = enter(at(2.4));
  const sIn = enter(at(3.4));
  const qIn = spring({ frame: frame - at(5), fps, config: springs.pop });
  const hIn = spring({ frame: frame - at(5.6), fps, config: springs.soft });
  if (frame < at(2.2)) return null;
  const breathe = 1 + Math.sin(frame / 18) * 0.012;
  const [before, after] = question.split(questionAccent);
  const rise = (k: number) => ({
    opacity: k,
    transform: `translateY(${(1 - k) * 30}px) scale(${0.96 + 0.04 * k})`,
  });
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: -100,
          top: 1110,
          width: W + 200,
          height: 560,
          borderRadius: "50%",
          background: `radial-gradient(ellipse at center, ${palette.scrim}, transparent 70%)`,
          opacity: tIn,
        }}
      />
      <div style={{ position: "absolute", left: 0, right: 0, top: 1170, textAlign: "center", ...rise(tIn) }}>
        <div style={{ fontFamily: fonts.serif, fontStyle: "italic", fontWeight: 500, fontSize: 112, color: palette.text, textShadow: "0 0 30px rgba(255,220,150,0.25)" }}>
          {title}
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1310, textAlign: "center", ...rise(sIn) }}>
        <div style={{ fontFamily: fonts.serif, fontStyle: "italic", fontWeight: 500, fontSize: 52, lineHeight: 1.25, color: palette.textDim }}>
          {line1}
          <br />
          {line2}
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1480, display: "flex", justifyContent: "center", ...rise(qIn) }}>
        <div
          style={{
            transform: `scale(${breathe})`,
            padding: "18px 34px",
            borderRadius: 999,
            border: `2px solid ${palette.now}66`,
            background: palette.pillBg,
            fontFamily: fonts.label,
            fontWeight: 600,
            fontSize: 42,
            color: palette.text,
            boxShadow: `0 0 30px ${palette.now}33`,
            whiteSpace: "nowrap",
          }}
        >
          {before}
          <span style={{ color: palette.now }}>{questionAccent}</span>
          {after}
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1590, textAlign: "center", ...rise(hIn) }}>
        <div style={{ fontFamily: fonts.label, fontWeight: 500, fontSize: 34, color: palette.textDim }}>{hint}</div>
      </div>
    </AbsoluteFill>
  );
};

export const LifeLines: React.FC<LifeLinesProps> = (props) => (
  <AbsoluteFill style={{ background: palette.skyBottom }}>
    <Sky />
    {/* Instagram fills tall phones and crops ~100px off each side of a 9:16
        reel: everything but the sky lives in a centred 80% safe area. */}
    <AbsoluteFill style={{ transform: `scale(${SAFE_SCALE})`, transformOrigin: "50% 50%" }}>
      <AgeAxis />
      <Threads />
      <Constellation />
      <HeadsAndStars />
      <Events />
      <Finale {...props} />
    </AbsoluteFill>
    <Grain />
    <Vignette />
  </AbsoluteFill>
);
