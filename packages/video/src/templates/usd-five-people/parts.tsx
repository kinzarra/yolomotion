// Episode pieces on top of the series kit: the broker's quote board, the
// waving flags, the 3D icons, and the dissolve that takes the faces away.
// Colors / easings come from the palette and theme like everything else.
import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { colors, palette } from "./palette";
import { rnd } from "./ui";

export const asset = (f: string) => staticFile(`images/usd-five-people/${f}`);

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/* ------------------------------------------------------------ quotes */

// Bank of Russia official rates for 16.10.2026; the board ticks around them.
// EUR/USD is the cross of the two.
const QUOTES = [
  { pair: "USD/RUB", base: 83.76, digits: 4 },
  { pair: "EUR/RUB", base: 93.7693, digits: 4 },
  { pair: "CNY/RUB", base: 12.4991, digits: 4 },
  { pair: "GBP/RUB", base: 110.2282, digits: 4 },
  { pair: "EUR/USD", base: 93.7693 / 83.76, digits: 5 },
];

const TICK = 5; // frames between quote updates

/** Deterministic random walk: the same frame always shows the same quote. */
const quoteAt = (base: number, row: number, step: number) => {
  let v = 0;
  for (let i = 1; i <= step; i += 1) v += (rnd(row * 97 + i * 13) - 0.5) * 0.0009;
  return base * (1 + v);
};

const fmt = (v: number, digits: number) => v.toFixed(digits).replace(".", ",");

/** The broker terminal: pairs, bid / ask flashing on every tick, a candle chart. */
export const ForexBoard: React.FC<{ top: number }> = ({ top }) => {
  const frame = useCurrentFrame();
  const step = Math.max(0, Math.floor(frame / TICK));
  const since = frame - step * TICK; // frames since the last tick, for the flash
  const blink = Math.sin(frame / 6) > 0 ? 1 : 0.25;
  const clock = 14 * 3600 + 32 * 60 + 7 + Math.floor(frame / 30);
  const hh = String(Math.floor(clock / 3600)).padStart(2, "0");
  const mm = String(Math.floor((clock % 3600) / 60)).padStart(2, "0");
  const ss = String(clock % 60).padStart(2, "0");

  const cell: React.CSSProperties = { padding: "10px 12px", textAlign: "right", whiteSpace: "nowrap" };

  return (
    <div
      style={{
        position: "absolute",
        left: 44,
        right: 44,
        top,
        borderRadius: 14,
        background: colors.surfaceStrong,
        border: `2px solid ${colors.lineStrong}`,
        boxShadow: colors.shadow,
        overflow: "hidden",
        fontFamily: theme.fonts.mono,
        color: palette.text,
      }}
    >
      {/* header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "14px 18px",
          borderBottom: `1px solid ${colors.line}`,
          fontSize: 20,
          fontWeight: 700,
          letterSpacing: "0.14em",
        }}
      >
        <span style={{ width: 12, height: 12, borderRadius: "50%", background: colors.bad, opacity: blink }} />
        <span>FOREX · LIVE</span>
        <span style={{ marginLeft: "auto", color: palette.textDim }}>
          16.10 {hh}:{mm}:{ss} МСК
        </span>
      </div>

      <div style={{ display: "flex" }}>
        <table style={{ borderCollapse: "collapse", fontSize: 24, fontWeight: 700, flex: 1 }}>
          <thead>
            <tr style={{ color: palette.textDim, fontSize: 15, letterSpacing: "0.12em" }}>
              <th style={{ ...cell, textAlign: "left" }}>ПАРА</th>
              <th style={cell}>BID</th>
              <th style={cell}>ASK</th>
              <th style={cell}>%</th>
            </tr>
          </thead>
          <tbody>
            {QUOTES.map((q, row) => {
              const now = quoteAt(q.base, row, step);
              const prev = quoteAt(q.base, row, Math.max(0, step - 1));
              const up = now >= prev;
              const tone = up ? palette.primary : colors.bad;
              const flash = interpolate(since, [0, TICK], [1, 0], { easing: theme.ease.out, ...clamp });
              const spread = q.base * 0.00012;
              const chg = ((now - q.base) / q.base) * 100;
              return (
                <tr key={q.pair} style={{ borderTop: `1px solid ${colors.line}` }}>
                  <td style={{ ...cell, textAlign: "left", color: row === 0 ? palette.text : palette.textDim }}>
                    {q.pair}
                  </td>
                  {[now, now + spread].map((v, i) => (
                    <td
                      key={i}
                      style={{
                        ...cell,
                        color: tone,
                        background: `${up ? "rgba(205,255,59," : "rgba(255,59,59,"}${(flash * 0.22).toFixed(3)})`,
                      }}
                    >
                      {fmt(v, q.digits)}
                    </td>
                  ))}
                  <td style={{ ...cell, color: chg >= 0 ? palette.primary : colors.bad }}>
                    {chg >= 0 ? "+" : ""}
                    {chg.toFixed(2).replace(".", ",")}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <Candles />
      </div>
    </div>
  );
};

/** USD/RUB candles, the last one alive. */
const Candles: React.FC = () => {
  const frame = useCurrentFrame();
  const W = 250;
  const H = 300;
  const n = 11;
  let open = 0.5;
  const bars = Array.from({ length: n }, (_, i) => {
    const live = i === n - 1;
    const drift = (rnd(i * 7 + 1) - 0.47) * 0.16 + (live ? Math.sin(frame / 7) * 0.05 : 0);
    const close = Math.min(0.9, Math.max(0.1, open + drift));
    const hi = Math.max(open, close) + rnd(i * 3 + 2) * 0.06;
    const lo = Math.min(open, close) - rnd(i * 5 + 4) * 0.06;
    const bar = { open, close, hi, lo, live };
    open = close;
    return bar;
  });
  const y = (v: number) => H - v * H;
  const bw = W / n;
  return (
    <svg width={W} height={H} style={{ borderLeft: `1px solid ${colors.line}`, flexShrink: 0 }}>
      {[0.25, 0.5, 0.75].map((g) => (
        <line key={g} x1={0} x2={W} y1={y(g)} y2={y(g)} stroke={colors.line} strokeWidth={1} />
      ))}
      {bars.map((b, i) => {
        const up = b.close >= b.open;
        const c = up ? palette.primary : colors.bad;
        const x = i * bw + bw / 2;
        return (
          <g key={i} opacity={b.live ? (Math.sin(frame / 5) > -0.3 ? 1 : 0.6) : 0.9}>
            <line x1={x} x2={x} y1={y(b.hi)} y2={y(b.lo)} stroke={c} strokeWidth={2} />
            <rect
              x={x - bw * 0.3}
              y={y(Math.max(b.open, b.close))}
              width={bw * 0.6}
              height={Math.max(3, Math.abs(y(b.open) - y(b.close)))}
              fill={c}
            />
          </g>
        );
      })}
    </svg>
  );
};

/* ------------------------------------------------------------- flags */

/**
 * A vector flag (rendered at 2× from the SVG) cut into thin strips riding a
 * sine wave. Strips are ~2px wide on screen, so the edge reads as a curve,
 * not a staircase; light and shadow ride the same wave.
 */
export const WavingFlag: React.FC<{
  src: string;
  width: number;
  ratio: number; // width / height of the flag image
  x: number;
  y: number;
  rotate?: number;
  phase?: number;
}> = ({ src, width, ratio, x, y, rotate = 0, phase = 0 }) => {
  const frame = useCurrentFrame();
  const height = width / ratio;
  const strips = 90;
  const sw = width / strips;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        height: height + 30,
        transform: `rotate(${rotate}deg)`,
        filter: "drop-shadow(0 18px 24px rgba(0,0,0,0.6))",
      }}
    >
      {Array.from({ length: strips }, (_, i) => {
        // the hoist (left edge) is held: amplitude grows towards the fly
        const k = i / (strips - 1);
        const wave = Math.sin(frame / 8 - k * 7.5 + phase);
        const slope = Math.cos(frame / 8 - k * 7.5 + phase); // facing the light or away
        const shade = 0.9 + slope * 0.12 * (0.4 + k);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: i * sw,
              top: 15 + wave * 10 * (0.25 + k),
              width: sw + 1,
              height,
              backgroundImage: `url(${src})`,
              backgroundSize: `${width}px ${height}px`,
              backgroundPosition: `${-i * sw}px 0`,
              filter: `brightness(${shade.toFixed(3)})`,
            }}
          />
        );
      })}
    </div>
  );
};

/* ------------------------------------------------------------- icons */

/** A cut-out photo of a real object, floating on its own orbit. */
export const Prop: React.FC<{ src: string; width: number; x: number; y: number; seed: number; rotate?: number }> = ({
  src,
  width,
  x,
  y,
  seed,
  rotate = 0,
}) => {
  const frame = useCurrentFrame();
  const bob = Math.sin(frame / 17 + seed * 1.9) * 12;
  const tilt = Math.sin(frame / 23 + seed) * 8;
  return (
    <Img
      src={src}
      style={{
        position: "absolute",
        left: x,
        top: y + bob,
        width,
        transform: `rotate(${rotate + tilt * 0.5}deg)`,
        filter: "drop-shadow(0 22px 26px rgba(0,0,0,0.7)) contrast(1.05) saturate(1.05)",
      }}
    />
  );
};

/* ----------------------------------------------------------- dissolve */

/**
 * The picture breaks into tiles that drift up and away, ash-like, in a sweep
 * from the edge it is anchored to. Before `at` it is one plain image.
 */
export const Dissolve: React.FC<{
  src: string;
  width: number;
  ratio: number; // width / height
  at: number;
  life?: number;
  from?: "left" | "right";
  style?: React.CSSProperties;
}> = ({ src, width, ratio, at, life = 26, from = "left", style }) => {
  const frame = useCurrentFrame();
  const height = width / ratio;
  if (frame < at) {
    return <Img src={src} style={{ width, height, display: "block", ...style }} />;
  }
  const cols = 26;
  const size = width / cols;
  const rows = Math.ceil(height / size);
  const tiles: React.ReactNode[] = [];
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const seed = r * cols + c;
      const sweep = (from === "left" ? c : cols - 1 - c) / cols;
      const delay = sweep * life * 0.45 + rnd(seed) * life * 0.35;
      const p = interpolate(frame - at - delay, [0, life], [0, 1], { easing: theme.ease.inOut, ...clamp });
      if (p >= 1) continue;
      const dir = from === "left" ? 1 : -1;
      tiles.push(
        <div
          key={seed}
          style={{
            position: "absolute",
            left: c * size,
            top: r * size,
            // +1px overlap hides the seams between still tiles
            width: size + 1,
            height: size + 1,
            backgroundImage: `url(${src})`,
            backgroundSize: `${width}px ${height}px`,
            backgroundPosition: `${-c * size}px ${-r * size}px`,
            opacity: 1 - p,
            transform: `translate(${dir * p * (60 + rnd(seed + 1) * 160)}px, ${-p * (80 + rnd(seed + 2) * 220)}px) rotate(${p * (rnd(seed + 3) - 0.5) * 140}deg) scale(${1 - p * 0.7})`,
          }}
        />,
      );
    }
  }
  return <div style={{ position: "relative", width, height, ...style }}>{tiles}</div>;
};
