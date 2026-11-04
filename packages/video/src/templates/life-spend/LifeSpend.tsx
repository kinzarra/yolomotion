import React from "react";
import { AbsoluteFill, interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Grain, Vignette } from "../../components/Layers";
import { Sky } from "../life-lines/LifeLines";
import { ease, fonts, palette, springs } from "../life-lines/palette";
import {
  ageAt,
  AGES,
  EVENTS,
  FINALE_FRAME,
  frameOfAge,
  labelAt,
  laneX,
  NOW_Y,
  PATH,
  PX_PER_YEAR,
  Thread,
  THREADS,
  wobbleX,
} from "./data";
import { LifeSpendProps } from "./schema";

const W = 1080;
const H = 1920;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const SEEDS = THREADS.map((p) => random(`seed-${p.id}`));
const STAR_TRAVEL_S = 1.3;
const TRAIL_YEARS = 12;
const SAFE_SCALE = 0.8;
const isFuneral = (p: Thread) => p.id.startsWith("funeral");

// ---------------------------------------------------------------- positions
type Head = { x: number; y: number; k: number; pop: number; arrived: number };

const headOf = (p: Thread, i: number, frame: number, fps: number): Head | null => {
  const a = ageAt(frame);
  if (a < p.start) return null;
  const pop = p.start <= AGES[0] ? 1 : spring({ frame: frame - frameOfAge(p.start), fps, config: springs.pop });
  if (a <= p.end) return { x: laneX(p, a) + wobbleX(p, a, SEEDS[i]), y: NOW_Y, k: 0, pop, arrived: -1 };
  if (p.endKind !== "star" || !p.star) return null;
  const fd = frameOfAge(p.end);
  const travel = STAR_TRAVEL_S * fps;
  const k = interpolate(frame, [fd, fd + travel], [0, 1], { ...clamp, easing: ease.inOut });
  const x0 = laneX(p, p.end) + wobbleX(p, p.end, SEEDS[i]);
  const [sx, sy] = p.star;
  return {
    x: x0 + (sx - x0) * k + Math.sin(k * Math.PI) * 30,
    y: NOW_Y + (sy - NOW_Y) * k,
    k,
    pop: 1,
    arrived: frame - (fd + travel),
  };
};

// ---------------------------------------------------------------- age axis
const AXIS_X = 82;
const AgeAxis: React.FC = () => {
  const frame = useCurrentFrame();
  const a = ageAt(frame);
  const top = 270;
  const bottom = 1840;
  const ticks: React.ReactNode[] = [];
  for (let n = Math.floor(a - (bottom - NOW_Y) / PX_PER_YEAR); n <= Math.ceil(a + (NOW_Y - top) / PX_PER_YEAR); n++) {
    const y = NOW_Y - (n - a) * PX_PER_YEAR;
    if (y < top || y > bottom || n > 84) continue;
    const five = n % 5 === 0;
    const fade = interpolate(y, [top, top + 120, bottom - 300, bottom], [0, 1, 1, 0], clamp);
    ticks.push(
      <g key={n} opacity={fade}>
        <line x1={AXIS_X - (five ? 12 : 6)} x2={AXIS_X} y1={y} y2={y} stroke={palette.axis} strokeWidth={2} />
        {five && n >= 0 && Math.abs(y - NOW_Y) > 40 ? (
          <text x={AXIS_X - 18} y={y + 8} textAnchor="end" fontFamily={fonts.label} fontSize={26} fill={palette.axisText}>
            {n}
          </text>
        ) : null}
      </g>,
    );
  }
  const shown = Math.min(84, Math.max(0, Math.floor(a)));
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
const trailPath = (p: Thread, i: number, a: number) => {
  const q0 = Math.max(p.start, a - TRAIL_YEARS);
  const q1 = Math.min(a, p.end);
  if (q1 <= q0) return null;
  const pts: string[] = [];
  for (let q = q0; q < q1; q += 0.08) {
    pts.push(`${(laneX(p, q) + wobbleX(p, q, SEEDS[i])).toFixed(1)},${(NOW_Y + (a - q) * PX_PER_YEAR).toFixed(1)}`);
  }
  pts.push(`${(laneX(p, q1) + wobbleX(p, q1, SEEDS[i])).toFixed(1)},${(NOW_Y + (a - q1) * PX_PER_YEAR).toFixed(1)}`);
  return "M" + pts.join("L");
};

const Threads: React.FC = () => {
  const frame = useCurrentFrame();
  const a = ageAt(frame);
  const paths = THREADS.map((p, i) => ({ p, i, d: trailPath(p, i, a) })).filter((t) => t.d);
  const sparkles: React.ReactNode[] = [];
  paths.forEach(({ p, i }) => {
    if (p.kind === "buy") return;
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
  const glowW = (p: Thread) => (p.thick ? 30 : p.kind === "buy" ? 6 : 10);
  const coreW = (p: Thread) => (p.thick ? 11 : p.kind === "buy" ? 2.4 : 3.4);
  return (
    <svg width={W} height={H} style={{ position: "absolute" }}>
      <defs>
        <filter id="ls-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation={7} />
        </filter>
        <linearGradient id="ls-fade" gradientUnits="userSpaceOnUse" x1={0} y1={NOW_Y} x2={0} y2={1880}>
          <stop offset="0" stopColor="#fff" stopOpacity={1} />
          <stop offset="0.55" stopColor="#fff" stopOpacity={0.75} />
          <stop offset="1" stopColor="#fff" stopOpacity={0} />
        </linearGradient>
        <mask id="ls-mask" maskUnits="userSpaceOnUse" x={0} y={0} width={W} height={H}>
          <rect x={0} y={NOW_Y - 4} width={W} height={H} fill="url(#ls-fade)" />
        </mask>
      </defs>
      <g mask="url(#ls-mask)">
        <g filter="url(#ls-glow)" opacity={0.6}>
          {paths.map(({ p, d }) => (
            <path key={p.id} d={d!} fill="none" stroke={p.color} strokeWidth={glowW(p)} opacity={p.kind === "buy" ? 0.6 : 1} strokeLinecap="round" />
          ))}
        </g>
        {paths.map(({ p, d }) => (
          <path key={p.id} d={d!} fill="none" stroke={p.color} strokeWidth={coreW(p)} opacity={p.kind === "buy" ? 0.8 : 0.95} strokeLinecap="round" />
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

const HeadsAndStars: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const finaleFade = interpolate(frame, [FINALE_FRAME, FINALE_FRAME + fps], [1, 0], { ...clamp, easing: ease.in });
  const textAt = FINALE_FRAME + 3.6 * fps;
  return (
    <AbsoluteFill>
      {THREADS.map((p, i) => {
        const h = headOf(p, i, frame, fps);
        if (!h || h.x < -60 || h.x > W + 60) return null;
        const tw = 0.5 + 0.5 * Math.sin(frame / 9 + SEEDS[i] * 6.28);
        const small = p.kind !== "family";
        const starSize = p.starSize ?? (small ? 0.5 : 1);
        const size = h.k > 0 ? 1 + (starSize - 1) * h.k : small ? 0.8 : 1;
        const living = p.endKind === "stay";
        const funeral = isFuneral(p);
        const dim = funeral
          ? interpolate(frame, [textAt, textAt + fps], [1, 0.45], clamp)
          : living
            ? 0.55 + 0.45 * finaleFade
            : 1;
        // a purchase's name stays by its star for a beat, then the star is just a dot
        const starLabel = small ? interpolate(h.k, [0.3, 0.75], [1, 0], clamp) : 1;
        const label = labelAt(p, Math.min(ageAt(frame), p.end));
        const side = h.x > 760 ? -1 : 1;
        const fontSize = small ? 31 : 34;
        const estW = label.length * fontSize * 0.56;
        const edge = Math.min(0, W - 24 - (h.x + estW / 2)) + Math.max(0, 24 - (h.x - estW / 2));
        const lx = interpolate(h.k, [0, 1], [edge, side * (22 + 12 * size)]);
        const ly = interpolate(h.k, [0, 1], [(p.labelDy ?? -48), 0]);
        const anchor = interpolate(h.k, [0, 1], [-50, side > 0 ? 0 : -100]);
        const labelOpacity = (living && !funeral ? finaleFade : 1) * h.pop * starLabel;
        const isMe = p.id === "me";
        const flare =
          isMe && h.k > 0
            ? interpolate(frame, [FINALE_FRAME, FINALE_FRAME + 12, FINALE_FRAME + 2 * fps], [0, 1, 0.35], { ...clamp, easing: ease.out })
            : 0;
        const glowR = (h.k > 0 ? 40 : 34) * size * (1 + 0.15 * tw) + flare * 220;
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
                  opacity: small && h.k > 0 ? 0.7 : 1,
                }}
              />
              {h.k > 0 && (!small || h.arrived < 0.8 * fps) ? <Glint color={p.color} size={size * (1 + flare * 1.5)} tw={tw} /> : null}
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
            {labelOpacity > 0.01 ? (
              <div
                style={{
                  position: "absolute",
                  left: lx,
                  top: ly,
                  transform: `translate(${anchor}%, -50%)`,
                  whiteSpace: "nowrap",
                  fontFamily: fonts.label,
                  fontWeight: 600,
                  fontSize,
                  color: p.color,
                  textShadow: `0 0 14px ${p.color}88, 0 2px 6px rgba(0,0,0,0.75)`,
                  opacity: labelOpacity,
                }}
              >
                {label}
              </div>
            ) : null}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- top line: hook, then life events
const years = (n: number) => {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return "год";
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return "года";
  return "лет";
};

const TopLine: React.FC<{ hook: string }> = ({ hook }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lineStyle = (k: number, out: number): React.CSSProperties => ({
    position: "absolute",
    left: 0,
    right: 0,
    top: 300,
    textAlign: "center",
    opacity: Math.min(k, out),
    transform: `translateY(${(1 - k) * 24 - (1 - out) * 16}px) scale(${0.9 + 0.1 * k})`,
    fontFamily: fonts.label,
    fontWeight: 600,
    fontSize: 44,
    color: palette.text,
    textShadow: "0 2px 12px rgba(0,0,0,0.6)",
  });
  const hookOut = interpolate(frame, [2.6 * fps, 2.9 * fps], [1, 0], { ...clamp, easing: ease.in });
  return (
    <AbsoluteFill>
      {frame < 3 * fps ? (
        <div style={{ ...lineStyle(1, hookOut), fontSize: 58 }}>{hook}</div>
      ) : null}
      {EVENTS.map(([age, text], i) => {
        const ef = frameOfAge(age);
        const next = EVENTS[i + 1] ? frameOfAge(EVENTS[i + 1][0]) : Infinity;
        const hold = Math.min(2.4 * fps, next - 16 - ef);
        if (frame < ef - 6 || frame > ef + hold + 10) return null;
        const k = spring({ frame: frame - (ef - 6), fps, config: springs.pop });
        const out = interpolate(frame, [ef + hold, ef + hold + 10], [1, 0], { ...clamp, easing: ease.in });
        return (
          <div key={age} style={lineStyle(k, out)}>
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
const PathOfPurchases: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = FINALE_FRAME + Math.round(2.4 * fps);
  if (frame < start) return null;
  const k = interpolate(frame, [start, start + 2.4 * fps], [0, 1], { ...clamp, easing: ease.inOut });
  const d = "M" + PATH.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join("L");
  return (
    <svg width={W} height={H} style={{ position: "absolute" }}>
      <path d={d} fill="none" stroke={palette.constellation} strokeWidth={1.6} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - k} opacity={0.75} />
    </svg>
  );
};

const Bell: React.FC<{ swing: number; color: string }> = ({ swing, color }) => (
  <svg viewBox="0 0 24 24" width={46} height={46} style={{ transform: `rotate(${swing}deg)`, transformOrigin: "50% 10%" }}>
    <path d="M12 2a1.6 1.6 0 0 1 1.6 1.6v.6A6.5 6.5 0 0 1 18.5 10.5V15l2 2.5v1H3.5v-1l2-2.5v-4.5a6.5 6.5 0 0 1 4.9-6.3v-.6A1.6 1.6 0 0 1 12 2zm-2.4 17.5h4.8a2.4 2.4 0 0 1-4.8 0z" fill={color} />
  </svg>
);
const Thumb: React.FC<{ color: string }> = ({ color }) => (
  <svg viewBox="0 0 24 24" width={40} height={40}>
    <path d="M2 10h4v11H2zM8 21V10l5.2-7.4a1.8 1.8 0 0 1 3.2 1.4L15.4 9H21a2 2 0 0 1 2 2.3l-1.4 8A2 2 0 0 1 19.6 21z" fill={color} />
  </svg>
);
const Bubble: React.FC<{ color: string }> = ({ color }) => (
  <svg viewBox="0 0 24 24" width={36} height={36}>
    <path d="M4 3h16a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H9l-5 4v-4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" fill={color} />
  </svg>
);

/** The standard end card: subscribe pressed, bell rings, like counts, comment asks. */
const SubscribeCard: React.FC<{ at: number; question: string; top: number }> = ({ at, question, top }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const k = frame - at;
  if (k < 0) return null;
  const inP = spring({ frame: k, fps, config: springs.soft });
  const press = Math.round(0.6 * fps);
  const pressed = k >= press;
  const squish = interpolate(k, [press - 3, press, press + 5], [1, 0.87, 1], clamp);
  const ring = pressed ? Math.sin((k - press) / 1.6) * interpolate(k - press, [0, 24], [24, 0], clamp) : 0;
  const likeAt = press + 6;
  const likeP = spring({ frame: k - likeAt, fps, config: springs.pop });
  const likes = Math.round(interpolate(k - likeAt, [0, 20], [0, 1000], { ...clamp, easing: ease.out }));
  const comP = spring({ frame: k - likeAt - 6, fps, config: springs.pop });
  const pill: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "14px 26px",
    borderRadius: 40,
    background: palette.pillBg,
    border: "2px solid rgba(200,212,255,0.25)",
  };
  return (
    <div style={{ position: "absolute", left: 40, right: 40, top, display: "flex", flexDirection: "column", alignItems: "center", gap: 18, opacity: inP, transform: `translateY(${(1 - inP) * 60}px)` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div
          style={{
            padding: "18px 36px",
            borderRadius: 60,
            background: pressed ? "rgba(60,66,96,0.9)" : "#e8344a",
            color: "#fff",
            fontFamily: fonts.label,
            fontWeight: 600,
            fontSize: 38,
            transform: `scale(${squish})`,
            boxShadow: pressed ? "none" : "0 0 36px rgba(232,52,74,0.55)",
          }}
        >
          {pressed ? "Вы подписаны" : "Подписаться"}
        </div>
        <div style={{ width: 84, height: 84, borderRadius: 42, display: "flex", alignItems: "center", justifyContent: "center", background: pressed ? palette.now : "rgba(60,66,96,0.9)", boxShadow: pressed ? `0 0 26px ${palette.now}88` : "none" }}>
          <Bell swing={ring} color={pressed ? "#141a33" : "#fff"} />
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ ...pill, opacity: likeP, transform: `scale(${0.3 + 0.7 * likeP})` }}>
          <Thumb color={palette.now} />
          <span style={{ fontFamily: fonts.label, fontWeight: 600, fontSize: 30, color: palette.text }}>{likes >= 1000 ? "1K" : likes}</span>
        </div>
        <div style={{ ...pill, opacity: comP, transform: `scale(${0.3 + 0.7 * comP})` }}>
          <Bubble color={palette.text} />
          <span style={{ fontFamily: fonts.label, fontWeight: 600, fontSize: 28, color: palette.text }}>{question}</span>
        </div>
      </div>
    </div>
  );
};

const Finale: React.FC<LifeSpendProps> = ({ line1, line2, question }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (s: number) => FINALE_FRAME + Math.round(s * fps);
  if (frame < at(3.4)) return null;
  const enter = (f0: number) => spring({ frame: frame - f0, fps, config: springs.soft });
  const aIn = enter(at(3.6));
  const bIn = enter(at(4.6));
  const rise = (k: number) => ({ opacity: k, transform: `translateY(${(1 - k) * 30}px) scale(${0.96 + 0.04 * k})` });
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: -100,
          top: 1060,
          width: W + 200,
          height: 700,
          borderRadius: "50%",
          background: `radial-gradient(ellipse at center, ${palette.scrim}, transparent 70%)`,
          opacity: aIn,
        }}
      />
      <div style={{ position: "absolute", left: 0, right: 0, top: 1150, textAlign: "center", ...rise(aIn) }}>
        <div style={{ fontFamily: fonts.serif, fontStyle: "italic", fontWeight: 500, fontSize: 58, color: palette.textDim }}>{line1}</div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1230, textAlign: "center", ...rise(bIn) }}>
        <div style={{ fontFamily: fonts.serif, fontStyle: "italic", fontWeight: 500, fontSize: 84, color: palette.text, textShadow: "0 0 30px rgba(255,220,150,0.25)" }}>
          {line2}
        </div>
      </div>
      <SubscribeCard at={at(6.2)} question={question} top={1420} />
    </AbsoluteFill>
  );
};

export const LifeSpend: React.FC<LifeSpendProps> = (props) => (
  <AbsoluteFill style={{ background: palette.skyBottom }}>
    <Sky />
    {/* Instagram crops ~100px off each side on tall phones: keep it in a centred 80% safe area. */}
    <AbsoluteFill style={{ transform: `scale(${SAFE_SCALE})`, transformOrigin: "50% 50%" }}>
      <AgeAxis />
      <Threads />
      <PathOfPurchases />
      <HeadsAndStars />
      <TopLine hook={props.hook} />
      <Finale {...props} />
    </AbsoluteFill>
    <Grain />
    <Vignette />
  </AbsoluteFill>
);
