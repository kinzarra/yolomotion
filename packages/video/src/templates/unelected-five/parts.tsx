// Episode pieces on top of the series kit: the five masked figures, the
// улики that fall onto them, and the ash dissolve that takes the faces away
// (from usd-five-people). Colors / easings come from the palette and theme.
import React from "react";
import { Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../theme";
import { useIn, usePunch } from "../../reel";
import { colors, palette } from "./palette";
import { rnd } from "./ui";

export const asset = (f: string) => staticFile(`images/unelected-five/${f}`);

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/* ------------------------------------------------------------ figures */

/**
 * One of the five: a real photo of a masked, hooded figure (Pexels / Pixabay,
 * cut out with matte.swift), graded into the palette, torso melting into the
 * floor, breathing. A lime «?» is burned over the face — the only glowing
 * thing on the figure — and flickers like a dying tube.
 */
export type Figure = {
  src: string; // public/images/unelected-five/
  width: number;
  ratio: number; // image width / height
  x: number;
  y: number;
  z: number;
  tilt: number;
  q: { x: number; y: number; size: number }; // the face, as fractions of the image box
};

export const FIGURES: Figure[] = [
  { src: "fig-plague.png", width: 430, ratio: 1200 / 1805, x: -100, y: 640, z: 2, tilt: -3, q: { x: 0.5, y: 0.31, size: 140 } },
  { src: "fig-facet.png", width: 420, ratio: 1200 / 1800, x: 110, y: 600, z: 3, tilt: 2, q: { x: 0.5, y: 0.38, size: 130 } },
  { src: "fig-fawkes.png", width: 460, ratio: 1200 / 1800, x: 310, y: 545, z: 5, tilt: 0, q: { x: 0.5, y: 0.33, size: 160 } },
  { src: "fig-grin.png", width: 420, ratio: 1200 / 1801, x: 545, y: 600, z: 4, tilt: -2, q: { x: 0.47, y: 0.38, size: 130 } },
  { src: "fig-balaclava.png", width: 430, ratio: 1200 / 1800, x: 755, y: 650, z: 1, tilt: 3, q: { x: 0.5, y: 0.36, size: 140 } },
];

export const PhotoFigure: React.FC<{ fig: Figure; seed: number; dim?: number; reveal?: { src: string; ratio: number; p: number } }> = ({ fig, seed, dim = 0, reveal }) => {
  const frame = useCurrentFrame();
  const breathe = Math.sin(frame / 26 + seed * 1.7) * 6;
  const sway = Math.sin(frame / 37 + seed * 0.9) * 1.2;
  const height = fig.width / fig.ratio;
  // the «?» flickers: mostly on, random drop-outs, never two figures alike
  const f1 = rnd(Math.floor(frame / 2) * 3 + seed * 17);
  const flicker = (f1 > 0.9 ? 0.2 : f1 > 0.82 ? 0.6 : 1) * (1 - dim * 0.7);
  const glow = 0.55 + Math.sin(frame / 11 + seed) * 0.2;
  return (
    <div
      style={{
        position: "absolute",
        left: fig.x,
        top: fig.y + breathe,
        width: fig.width,
        height,
        zIndex: fig.z,
        transform: `rotate(${fig.tilt + sway}deg)`,
        transformOrigin: "50% 100%",
        opacity: 1 - dim * 0.5,
        filter: `brightness(${1 - dim * 0.45}) drop-shadow(0 30px 40px rgba(0,0,0,0.8))`,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          // graded into the series: cold, desaturated, the torso melts into the floor
          filter: "grayscale(0.7) contrast(1.12) brightness(0.86)",
          maskImage: "linear-gradient(180deg, #000 55%, transparent 97%)",
          WebkitMaskImage: "linear-gradient(180deg, #000 55%, transparent 97%)",
        }}
      >
        <Img src={asset(fig.src)} style={{ width: fig.width, height, display: "block" }} />
        {reveal && reveal.p > 0 && (
          <Img
            src={asset(reveal.src)}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: fig.width,
              height: fig.width / reveal.ratio,
              display: "block",
              opacity: reveal.p,
              transform: `scale(${interpolate(reveal.p, [0, 1], [1.15, 1])})`,
              transformOrigin: "50% 30%",
            }}
          />
        )}
      </div>
      {/* the «?» burned over the face */}
      <div
        style={{
          position: "absolute",
          left: fig.width * fig.q.x,
          top: height * fig.q.y,
          transform: "translate(-50%, -50%)",
          fontFamily: theme.fonts.wide,
          fontWeight: 900,
          fontSize: fig.q.size,
          lineHeight: 1,
          color: palette.primary,
          opacity: flicker * (1 - (reveal?.p ?? 0)),
          textShadow: `0 0 ${16 + glow * 24}px ${palette.glow}, 0 0 4px ${palette.primary}`,
          mixBlendMode: "screen",
        }}
      >
        ?
      </div>
    </div>
  );
};

/* -------------------------------------------------------------- улики */

/** A lime chip, drawn — the «телефон» улика. */
export const ChipIcon: React.FC<{ size: number }> = ({ size }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} style={{ display: "block" }}>
    {Array.from({ length: 6 }, (_, i) => (
      <React.Fragment key={i}>
        <rect x={22 + i * 10} y={2} width={5} height={14} fill={palette.primary} />
        <rect x={22 + i * 10} y={84} width={5} height={14} fill={palette.primary} />
        <rect x={2} y={22 + i * 10} width={14} height={5} fill={palette.primary} />
        <rect x={84} y={22 + i * 10} width={14} height={5} fill={palette.primary} />
      </React.Fragment>
    ))}
    <rect x={14} y={14} width={72} height={72} rx={8} fill={colors.ink2} stroke={palette.primary} strokeWidth={5} />
    <rect x={32} y={32} width={36} height={36} rx={4} fill={palette.primary} />
    <text x={50} y={57} textAnchor="middle" fontFamily={theme.fonts.mono} fontWeight={800} fontSize={16} fill={colors.ink2}>
      3nm
    </text>
  </svg>
);

/** A play button, drawn — the «что ты смотришь» улика. */
export const PlayIcon: React.FC<{ size: number }> = ({ size }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} style={{ display: "block" }}>
    <rect x={4} y={4} width={92} height={92} rx={24} fill={colors.ink2} stroke={palette.primary} strokeWidth={5} />
    <path d="M38 28 L74 50 L38 72 Z" fill={palette.primary} />
  </svg>
);

/**
 * A улика that falls from above onto the row: drops on a spring, squashes on
 * impact, a ring bursts out, a label prints under it. `at` is its landing.
 */
export const DropProp: React.FC<{
  at: number;
  x: number;
  y: number;
  label: string;
  children: React.ReactNode;
  width: number;
}> = ({ at, x, y, label, children, width }) => {
  const frame = useCurrentFrame();
  const drop = useIn(at - 8, "snappy");
  const hit = usePunch(at, 14);
  const labelIn = useIn(at + 4, "snappy");
  const bob = frame > at ? Math.sin((frame - at) / 14) * 4 : 0;
  if (frame < at - 8) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
        opacity: Math.min(1, drop * 2),
        transform: `translateY(${interpolate(drop, [0, 1], [-520, 0]) + bob}px)`,
      }}
    >
      <div
        style={{
          transform: `scale(${1 + hit.pop * 0.22}, ${1 - hit.pop * 0.18})`,
          transformOrigin: "50% 100%",
          filter: `drop-shadow(0 0 ${18 + hit.energy * 30}px ${palette.glow}) drop-shadow(0 24px 30px rgba(0,0,0,0.7))`,
        }}
      >
        {children}
      </div>
      <div
        style={{
          padding: "6px 14px",
          background: colors.paper,
          color: colors.ink,
          fontFamily: theme.fonts.mono,
          fontWeight: 800,
          fontSize: 22,
          letterSpacing: "0.1em",
          whiteSpace: "nowrap",
          boxShadow: colors.paperShadow,
          opacity: labelIn,
          transform: `translateY(${interpolate(labelIn, [0, 1], [14, 0])}px)`,
        }}
      >
        {label}
      </div>
    </div>
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

/* ------------------------------------------------------------- places */

/** A real photo of the person, cut out, graded, rising into frame. */
export const PersonPhoto: React.FC<{
  src: string;
  width: number;
  ratio: number; // image width / height
  at: number;
  right?: number;
  bottom?: number;
  flip?: boolean;
}> = ({ src, width, ratio, at, right = -40, bottom = 560, flip = false }) => {
  const frame = useCurrentFrame();
  const p = useIn(at, "smooth");
  const breathe = Math.sin(frame / 30 + at) * 4;
  const kb = interpolate(frame, [at, at + 240], [1, 1.06], clamp);
  const height = width / ratio;
  return (
    <div
      style={{
        position: "absolute",
        right,
        bottom,
        width,
        height,
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [380, 0]) + breathe}px) scale(${interpolate(p, [0, 1], [1.08, 1]) * kb}) ${flip ? "scaleX(-1)" : ""}`,
        transformOrigin: "bottom center",
        filter: "grayscale(0.5) contrast(1.08) brightness(0.94) drop-shadow(0 30px 40px rgba(0,0,0,0.8))",
        maskImage: "linear-gradient(180deg, #000 62%, transparent 97%)",
        WebkitMaskImage: "linear-gradient(180deg, #000 62%, transparent 97%)",
      }}
    >
      <Img src={asset(src)} style={{ width, height, display: "block" }} />
    </div>
  );
};

/**
 * A licensed clip (Pexels) in a phone-like screen: rounded, bordered, graded
 * into the palette, a label printed on paper in its corner. `from` is the
 * second of the source it starts at; `at` / `out` are scene frames.
 */
export const Clip: React.FC<{
  src: string; // public/media/unelected-five/
  from: number;
  at: number;
  out: number;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
}> = ({ src, from, at, out, x, y, width, height, label }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = useIn(at, "snappy");
  const leave = interpolate(frame, [out - 8, out], [0, 1], { easing: theme.ease.in, ...clamp });
  const zoom = interpolate(frame, [at, out], [1, 1.1], clamp);
  if (frame < at - 2 || frame >= out) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        height,
        borderRadius: 22,
        overflow: "hidden",
        border: `3px solid ${colors.lineStrong}`,
        boxShadow: colors.shadow,
        background: colors.surfaceStrong,
        opacity: p * (1 - leave),
        transform: `translateY(${interpolate(p, [0, 1], [60, 0]) + leave * 30}px) scale(${interpolate(p, [0, 1], [0.92, 1])})`,
      }}
    >
      <div style={{ position: "absolute", inset: 0, transform: `scale(${zoom})`, filter: "grayscale(0.35) contrast(1.1) brightness(0.9) saturate(0.9)" }}>
        <OffthreadVideo
          src={staticFile(`media/unelected-five/${src}`)}
          startFrom={Math.round(from * fps)}
          muted
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
      {/* lime scan edge */}
      <div style={{ position: "absolute", inset: 0, boxShadow: `inset 0 0 0 2px ${palette.primary}33` }} />
      <div
        style={{
          position: "absolute",
          left: 14,
          top: 14,
          padding: "6px 12px",
          background: colors.paper,
          color: colors.ink,
          fontFamily: theme.fonts.mono,
          fontWeight: 800,
          fontSize: 19,
          letterSpacing: "0.1em",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </div>
    </div>
  );
};

/* ---------------------------------------------------- conspiracy props */

/**
 * The hook's lower third, after the author's note «артефакты теории
 * заговора, больше таинственности»: a drawn Eye of Providence in a pyramid,
 * red strings pinned between it and the figures, a «СОВЕРШЕННО СЕКРЕТНО»
 * paper. Everything drawn in the kit's colors; the eye is the one glow.
 */
export const Conspiracy: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const p = useIn(at, "smooth");
  const pulse = 0.6 + Math.sin(frame / 9) * 0.25;
  const drift = Math.sin(frame / 40) * 6;
  const paper = colors.paperShade;
  const ink = colors.ink;
  const red = colors.bad;
  // pins: on the figures' chests and on the pyramid
  const pins = [
    { x: 110, y: 1010 },
    { x: 330, y: 980 },
    { x: 540, y: 950 },
    { x: 760, y: 985 },
    { x: 970, y: 1015 },
  ];
  const hub = { x: 540, y: 1560 };
  return (
    <div style={{ position: "absolute", inset: 0, opacity: p, transform: `translateY(${interpolate(p, [0, 1], [60, 0]) + drift}px)`, pointerEvents: "none" }}>
      {/* red strings from the pins to the pyramid */}
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {pins.map((pin, i) => {
          const sag = 40 + i * 6;
          const mx = (pin.x + hub.x) / 2;
          const my = (pin.y + hub.y) / 2 + sag + Math.sin(frame / 13 + i) * 4;
          return <path key={i} d={`M${pin.x} ${pin.y} Q${mx} ${my} ${hub.x} ${hub.y - 150}`} stroke={red} strokeWidth={3} fill="none" opacity={0.85} />;
        })}
        {pins.map((pin, i) => (
          <g key={`p${i}`}>
            <circle cx={pin.x} cy={pin.y} r={11} fill={red} />
            <circle cx={pin.x - 3} cy={pin.y - 3} r={4} fill="rgba(255,255,255,0.55)" />
          </g>
        ))}
      </svg>
      {/* the pyramid with the eye, on parchment */}
      <div style={{ position: "absolute", left: 540 - 170, top: 1370, width: 340, height: 300, transform: `rotate(${-3 + Math.sin(frame / 50)}deg)` }}>
        <svg viewBox="0 0 340 300" width={340} height={300}>
          <rect x={6} y={6} width={328} height={288} fill={paper} stroke={colors.inkRule} strokeWidth={2} />
          {/* rays */}
          {Array.from({ length: 14 }, (_, i) => {
            const a = -Math.PI / 2 + ((i - 6.5) / 14) * Math.PI * 1.1;
            return <line key={i} x1={170} y1={118} x2={170 + Math.cos(a) * 150} y2={118 + Math.sin(a) * 150} stroke={ink} strokeWidth={1.4} opacity={0.5} />;
          })}
          <rect x={0} y={0} width={340} height={300} fill={paper} opacity={0} />
          {/* pyramid */}
          <path d="M70 262 L170 70 L270 262 Z" fill={paper} stroke={ink} strokeWidth={4} />
          {Array.from({ length: 7 }, (_, i) => (
            <line key={i} x1={70 + (100 / 7) * (i + 1) * 0.92} y1={262 - (192 / 7) * (i + 1) * 0.92} x2={270 - (100 / 7) * (i + 1) * 0.92} y2={262 - (192 / 7) * (i + 1) * 0.92} stroke={ink} strokeWidth={1.5} opacity={0.7} />
          ))}
          {/* the capstone with the eye */}
          <path d="M136 136 L170 70 L204 136 Z" fill={paper} stroke={ink} strokeWidth={4} />
          <path d="M146 118 C 158 102, 182 102, 194 118 C 182 134, 158 134, 146 118 Z" fill={ink} />
          <circle cx={170} cy={118} r={8} fill={palette.primary} style={{ filter: `drop-shadow(0 0 ${8 + pulse * 10}px ${palette.glow})` }} opacity={0.75 + pulse * 0.25} />
          <text x={170} y={286} textAnchor="middle" fontFamily={theme.fonts.mono} fontWeight={800} fontSize={17} letterSpacing={3} fill={ink}>
            NOVUS ORDO SECLORUM
          </text>
        </svg>
      </div>
      {/* the secret file */}
      <div
        style={{
          position: "absolute",
          left: 60,
          top: 1440,
          width: 250,
          padding: "16px 16px 18px",
          background: paper,
          color: ink,
          fontFamily: theme.fonts.mono,
          fontSize: 15,
          lineHeight: 1.3,
          transform: `rotate(${5 + Math.sin(frame / 37) * 0.8}deg)`,
          boxShadow: colors.paperShadow,
        }}
      >
        <div style={{ fontWeight: 800, letterSpacing: "0.12em", marginBottom: 8 }}>ДЕЛО № 0017</div>
        {[0.9, 0.75, 0.95, 0.6, 0.85, 0.7].map((w, i) => (
          <div key={i} style={{ height: 6, width: `${w * 100}%`, background: colors.inkRule, marginBottom: 7 }} />
        ))}
        <div
          style={{
            position: "absolute",
            right: -14,
            top: 46,
            padding: "4px 10px",
            border: `4px solid ${red}`,
            color: red,
            fontFamily: theme.fonts.wide,
            fontWeight: 900,
            fontSize: 18,
            transform: "rotate(-14deg)",
            whiteSpace: "nowrap",
          }}
        >
          СОВЕРШЕННО СЕКРЕТНО
        </div>
      </div>
      {/* a clipping on the right */}
      <div
        style={{
          position: "absolute",
          right: 50,
          top: 1430,
          width: 230,
          padding: "14px 14px 16px",
          background: paper,
          color: ink,
          fontFamily: theme.fonts.mono,
          fontSize: 14,
          transform: `rotate(${-6 + Math.sin(frame / 43) * 0.8}deg)`,
          boxShadow: colors.paperShadow,
        }}
      >
        <div style={{ fontFamily: theme.fonts.wide, fontWeight: 900, fontSize: 20, lineHeight: 1.05, marginBottom: 8 }}>КТО ПРАВИТ МИРОМ?</div>
        {[1, 0.8, 0.9, 0.7, 0.95, 0.5].map((w, i) => (
          <div key={i} style={{ height: 5, width: `${w * 100}%`, background: colors.inkRule, marginBottom: 6 }} />
        ))}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------ logos */

/** TikTok's note glyph with the cyan/red split, drawn; editorial use. */
export const TikTokMark: React.FC<{ size: number }> = ({ size }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} style={{ display: "block" }}>
    <defs>
      <path id="tt-note" d="M58 8 C 60 22, 70 32, 84 33 L84 48 C 74 48, 66 45, 58 40 L58 66 C 58 82, 46 94, 30 94 C 14 94, 2 82, 2 66 C 2 50, 14 38, 30 38 C 33 38, 36 38, 38 39 L38 55 C 36 54, 33 53, 30 53 C 23 53, 17 59, 17 66 C 17 73, 23 79, 30 79 C 37 79, 43 73, 43 66 L43 8 Z" />
    </defs>
    <use href="#tt-note" fill="#25F4EE" transform="translate(-3,-3)" />
    <use href="#tt-note" fill="#FE2C55" transform="translate(3,3)" />
    <use href="#tt-note" fill="#FFFFFF" />
  </svg>
);

/**
 * A vector flag cut into thin strips riding a sine wave (from the
 * usd-five-people kit).
 */
export const WavingFlag: React.FC<{ src: string; width: number; ratio: number; x: number; y: number; rotate?: number; phase?: number; at?: number }> = ({
  src,
  width,
  ratio,
  x,
  y,
  rotate = 0,
  phase = 0,
  at = 0,
}) => {
  const frame = useCurrentFrame();
  const p = useIn(at, "smooth");
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
        opacity: p,
        transform: `rotate(${rotate}deg) translateX(${interpolate(p, [0, 1], [-80, 0])}px)`,
        filter: "drop-shadow(0 18px 24px rgba(0,0,0,0.6))",
      }}
    >
      {Array.from({ length: strips }, (_, i) => {
        const k = i / (strips - 1);
        const wave = Math.sin(frame / 8 - k * 7.5 + phase);
        const slope = Math.cos(frame / 8 - k * 7.5 + phase);
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

/** A ticker tape of BlackRock's stakes, scrolling right to left. */
export const Ticker: React.FC<{ at: number; top: number; items: string[] }> = ({ at, top, items }) => {
  const frame = useCurrentFrame();
  const p = useIn(at, "snappy");
  const text = items.join("   ·   ");
  const shift = ((frame - at) * 4) % 2400;
  if (frame < at) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top,
        height: 54,
        overflow: "hidden",
        background: colors.surfaceStrong,
        borderTop: `2px solid ${colors.lineStrong}`,
        borderBottom: `2px solid ${colors.lineStrong}`,
        opacity: p,
        fontFamily: theme.fonts.mono,
        fontWeight: 800,
        fontSize: 26,
        letterSpacing: "0.08em",
        color: palette.primary,
        whiteSpace: "nowrap",
        lineHeight: "54px",
      }}
    >
      <div style={{ position: "absolute", left: -shift, top: 0 }}>
        {text}   ·   {text}   ·   {text}
      </div>
    </div>
  );
};
