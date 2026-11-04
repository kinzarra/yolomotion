// «ПОСТЕР» kit for ВЫПУСК 23: the digital-ruble palette, set with fewer and
// bigger things. Lime halftone for people, frosted glass for data, one
// editorial italic word per headline, and the two-voice wave as the object.
import React from "react";
import { Img, interpolate, OffthreadVideo, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../theme";
import { useIn } from "../../reel";
import { ddColors as colors, ddPalette as palette } from "./palette";

export * from "../digital-ruble/ui";

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const media = (f: string) => staticFile(f);
/** Unbounded has no ₽ ≠ − arrows: the mono face catches them. */
export const WIDE = `${theme.fonts.wide}, ${theme.fonts.mono}`;
export const X0 = 110; // IG side-crop safe zone: 110..970
export const X1 = 970;
export const W = 1080;

export const IMG = {
  tescha: { src: "images/dessa-duplex/tescha.png", ratio: 362 / 364 },
  dorsey: { src: "images/dessa-duplex/dorsey.png", ratio: 1191 / 961 },
  gb200: { src: "images/dessa-duplex/gb200.jpg", ratio: 640 / 330 },
  macbook: { src: "images/dessa-duplex/macbook.jpg", ratio: 1300 / 867 },
  meme: { src: "images/dessa-duplex/meme-wait-outlined.png", ratio: 974 / 935 },
} as const;

/** HeyGen returns the 16:9 studio letterboxed in 9:16; this scale + origin fills the frame with it. */
export const FACE_FILL: React.CSSProperties = { transform: "scale(3.2)", transformOrigin: "540px 959px" };

/* ------------------------------------------------------------- shell */

/** Background for every beat: near-black, one lime field and one mint field drifting, a 7-frame exit. */
export const PosterShell: React.FC<{ children: React.ReactNode; exit?: boolean; shake?: number; glowY?: number }> = ({ children, exit = true, shake = 0, glowY = 520 }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = frame / fps;
  const out = exit ? interpolate(frame, [durationInFrames - 7, durationInFrames - 1], [0, 1], { easing: theme.ease.in, ...clamp }) : 0;
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: palette.bg }}>
      {/* glows live inside the content group: halftone layers screen onto them */}
      <div style={{ position: "absolute", inset: 0, opacity: 1 - out * 0.9, transform: `translate(${shake}px, ${out * -34}px) scale(${1 + out * 0.04})`, filter: out > 0 ? `blur(${out * 10}px)` : undefined }}>
        <div style={{ position: "absolute", inset: -60, background: palette.bg }} />
        <div style={{ position: "absolute", width: 1300, height: 1300, left: -110 + Math.sin(t * 0.6) * 30, top: glowY - 650 + Math.cos(t * 0.5) * 30, borderRadius: "50%", background: `radial-gradient(circle, ${palette.primary}24, transparent 60%)` }} />
        <div style={{ position: "absolute", width: 900, height: 900, left: 430, top: 1180 + Math.sin(t * 0.4) * 30, borderRadius: "50%", background: `radial-gradient(circle, ${palette.accent}12, transparent 62%)` }} />
        {children}
      </div>
    </div>
  );
};

/* -------------------------------------------------------------- type */

export const Kicker: React.FC<{ left: string; right?: string; at?: number }> = ({ left, right, at = 0 }) => {
  const q = useIn(at, "smooth");
  return (
    <div style={{ position: "absolute", left: X0, right: W - X1, top: 100, display: "flex", justifyContent: "space-between", fontFamily: theme.fonts.mono, fontSize: 24, letterSpacing: "0.14em", color: palette.textDim, opacity: q, transform: `translateY(${interpolate(q, [0, 1], [-16, 0])}px)`, zIndex: 20 }}>
      <span style={{ color: palette.text }}>{left}</span>
      {right && <span>{right}</span>}
    </div>
  );
};

/** Wide grotesk line with a spring entrance (opacity + y + scale). `at` < 0 means already in at frame 0. */
export const Wide: React.FC<{ children: React.ReactNode; size: number; at?: number; color?: string; glow?: boolean; style?: React.CSSProperties }> = ({ children, size, at = -30, color = palette.text, glow, style }) => {
  const q = useIn(at, "snappy");
  return (
    <div
      style={{
        fontFamily: WIDE,
        fontWeight: 900,
        fontSize: size,
        lineHeight: 0.92,
        letterSpacing: "-0.04em",
        whiteSpace: "nowrap",
        color,
        textShadow: glow ? `0 0 ${size * 0.45}px ${palette.glow}` : `0 8px 40px ${palette.bg}`,
        opacity: q,
        transform: `translateY(${interpolate(q, [0, 1], [size * 0.5, 0])}px) scale(${interpolate(q, [0, 1], [0.9, 1])})`,
        transformOrigin: "0% 100%",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** The one editorial italic word of a headline. */
export const Serif: React.FC<{ children: React.ReactNode; size: number; at?: number; style?: React.CSSProperties }> = ({ children, size, at = -30, style }) => {
  const q = useIn(at, "smooth");
  return (
    <div
      style={{
        fontFamily: theme.fonts.serifRu,
        fontStyle: "italic",
        fontWeight: 500,
        fontSize: size,
        lineHeight: 0.8,
        letterSpacing: "-0.03em",
        color: palette.primary,
        textShadow: `0 0 50px ${palette.glow}`,
        whiteSpace: "nowrap",
        opacity: q,
        transform: `translateX(${interpolate(q, [0, 1], [-60, 0])}px) skewX(${interpolate(q, [0, 1], [-12, 0])}deg)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const Mono: React.FC<{ children: React.ReactNode; size?: number; color?: string; style?: React.CSSProperties }> = ({ children, size = 24, color = palette.textDim, style }) => (
  <div style={{ fontFamily: theme.fonts.mono, fontSize: size, letterSpacing: "0.14em", color, whiteSpace: "nowrap", ...style }}>{children}</div>
);

/* --------------------------------------------------------- halftone */

/**
 * Variable-size halftone in CSS: blurred inverted image on white, a dot field
 * colour-dodged over it, a huge contrast on the parent → hard black dots. Then
 * invert → white dots, multiply → lime dots; the caller screens it onto black.
 * `imgStyle` positions the image inside the box (e.g. FACE_FILL).
 */
export const Halftone: React.FC<{ src: string; width: number; height: number; pitch?: number; imgStyle?: React.CSSProperties; lift?: number }> = ({ src, width, height, pitch = 10, imgStyle, lift = 1.5 }) => (
  <div style={{ position: "relative", isolation: "isolate", width, height }}>
    <div style={{ filter: "invert(1)", width, height }}>
      <div style={{ position: "relative", width, height, overflow: "hidden", background: colors.white, filter: "contrast(40)" }}>
        <Img src={media(src)} style={{ position: "absolute", left: 0, top: 0, width, height, objectFit: "cover", filter: `grayscale(1) contrast(0.8) brightness(${lift}) invert(1) brightness(0.86) blur(2.2px)`, ...imgStyle }} />
        <div style={{ position: "absolute", inset: "-50%", backgroundImage: `radial-gradient(circle at center, ${colors.ink2}, ${colors.white})`, backgroundSize: `${pitch}px ${pitch}px`, transform: "rotate(-30deg)", mixBlendMode: "color-dodge" }} />
      </div>
    </div>
    <div style={{ position: "absolute", inset: 0, background: palette.primary, mixBlendMode: "multiply" }} />
  </div>
);

/* ------------------------------------------------------------- glass */

export const Glass: React.FC<{ x: number; y: number; w: number; h: number; at?: number; children?: React.ReactNode; z?: number; radius?: number }> = ({ x, y, w, h, at = -30, children, z = 8, radius = 44 }) => {
  const q = useIn(at, "smooth");
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        zIndex: z,
        borderRadius: radius,
        background: "linear-gradient(160deg, rgba(255,255,255,0.10), rgba(255,255,255,0.03))",
        backdropFilter: "blur(26px) saturate(1.4)",
        WebkitBackdropFilter: "blur(26px) saturate(1.4)",
        border: "1.5px solid rgba(255,255,255,0.16)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.25), 0 40px 80px -30px rgba(0,0,0,0.9)",
        overflow: "hidden",
        opacity: q,
        transform: `translateY(${interpolate(q, [0, 1], [80, 0])}px) scale(${interpolate(q, [0, 1], [0.94, 1])})`,
      }}
    >
      {children}
    </div>
  );
};

/* ------------------------------------------------------------- waves */

/** Smooth speech-like curve: sum of sines under a gate envelope. */
export const wavePath = (seed: number, t: number, w: number, amp: number, gate: (x: number) => number) => {
  const pts: string[] = [];
  for (let i = 0; i <= 200; i += 1) {
    const x = i / 200;
    const y = (Math.sin(x * 38 + seed + t * 6) * 0.55 + Math.sin(x * 91 + seed * 2 - t * 9) * 0.3 + Math.sin(x * 17 + seed * 3) * 0.15) * amp * gate(x);
    pts.push(`${i === 0 ? "M" : "L"}${(x * w).toFixed(1)},${y.toFixed(1)}`);
  }
  return pts.join(" ");
};
export const bump = (a: number, b: number) => (x: number) => {
  if (x < a || x > b) return 0.04;
  return Math.sin(((x - a) / (b - a)) * Math.PI) ** 0.6;
};
export const either = (...gs: ((x: number) => number)[]) => (x: number) => Math.max(...gs.map((g) => g(x)));
/** Reveal a gate left to right: 0..1 progress, the rest stays flat. */
export const upTo = (g: (x: number) => number, p: number) => (x: number) => (x <= p ? g(x) : 0.04);

/** Two voices on one timeline. `mark` highlights the overlap window [a, b] in red or lime. */
export const Duplex: React.FC<{
  w: number;
  you: (x: number) => number;
  ai: (x: number) => number;
  mark?: { a: number; b: number; label: string; tone: "bad" | "good"; on?: number };
  height?: number;
}> = ({ w, you, ai, mark, height = 200 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const col = mark?.tone === "bad" ? colors.bad : palette.primary;
  const mo = mark?.on ?? 1;
  return (
    <svg width={w} height={height} style={{ overflow: "visible" }}>
      {mark && mo > 0 && (
        <>
          <rect x={w * mark.a} y={-4} width={w * (mark.b - mark.a)} height={height + 8} rx={18} fill={`${col}18`} stroke={`${col}88`} strokeWidth={1.5} opacity={mo} />
          <text x={w * (mark.a + mark.b) * 0.5} y={height + 4} textAnchor="middle" fill={col} opacity={mo} style={{ fontFamily: theme.fonts.mono, fontSize: 20, letterSpacing: "0.14em" }}>
            {mark.label}
          </text>
        </>
      )}
      <g transform={`translate(0,${height * 0.3})`}>
        <path d={wavePath(1.2, t, w, height * 0.24, you)} fill="none" stroke={palette.text} strokeWidth={4} strokeLinecap="round" />
      </g>
      <g transform={`translate(0,${height * 0.7})`}>
        <path d={wavePath(4.7, t, w, height * 0.27, ai)} fill="none" stroke={palette.primary} strokeWidth={5} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 10px ${palette.glow})` }} />
      </g>
      <text x={0} y={16} fill={palette.text} style={{ fontFamily: theme.fonts.mono, fontSize: 20, letterSpacing: "0.14em" }}>ТЫ</text>
      <text x={0} y={height + 4} fill={palette.primary} style={{ fontFamily: theme.fonts.mono, fontSize: 20, letterSpacing: "0.14em" }}>DESSA</text>
    </svg>
  );
};

/* ----------------------------------------------------------- bubbles */

export const Bubble: React.FC<{ who: "you" | "ai"; children: React.ReactNode; at?: number; size?: number; rot?: number; punch?: number }> = ({ who, children, at = -30, size = 38, rot = 0, punch = 0 }) => {
  const q = useIn(at, who === "ai" ? "bouncy" : "snappy");
  const you = who === "you";
  return (
    <div style={{ opacity: q, transform: `translateX(${interpolate(q, [0, 1], [you ? -80 : 120, 0])}px) rotate(${rot}deg) scale(${interpolate(q, [0, 1], [0.8, 1]) * (1 + punch * 0.08)})`, transformOrigin: you ? "0% 100%" : "100% 100%" }}>
      <Mono size={20} color={you ? palette.text : palette.primary} style={{ marginBottom: 10, letterSpacing: "0.18em" }}>{you ? "ТЫ" : "DESSA"}</Mono>
      <div
        style={{
          display: "inline-block",
          background: you ? colors.paper : palette.primary,
          color: colors.ink,
          borderRadius: you ? "34px 34px 34px 8px" : "34px 34px 8px 34px",
          padding: you ? "26px 34px" : "24px 34px",
          fontFamily: WIDE,
          fontWeight: you ? 700 : 900,
          fontSize: size,
          lineHeight: 1.08,
          letterSpacing: "-0.025em",
          boxShadow: you ? colors.paperShadow : `0 0 60px ${palette.glow}, 0 30px 60px -20px rgba(0,0,0,0.8)`,
        }}
      >
        {children}
      </div>
    </div>
  );
};

/** Red text cursor where your sentence was cut. */
export const CutCursor: React.FC = () => {
  const frame = useCurrentFrame();
  return <span style={{ display: "inline-block", width: 4, height: 40, background: colors.bad, marginLeft: 6, verticalAlign: "-6px", opacity: Math.floor(frame / 8) % 2 === 0 ? 1 : 0.2 }} />;
};

/* ------------------------------------------------------------ media */

/** Footage in a rounded glass-edged card, Ken Burns inside, a mono tag. */
export const ClipCard: React.FC<{ src: string; x: number; y: number; w: number; h: number; at?: number; rot?: number; tag?: string; tagTone?: "bad" | "good"; z?: number; grade?: string; startFrom?: number }> = ({
  src,
  x,
  y,
  w,
  h,
  at = 0,
  rot = 0,
  tag,
  tagTone = "bad",
  z = 3,
  grade = "grayscale(0.35) contrast(1.1) brightness(0.85)",
  startFrom = 0,
}) => {
  const frame = useCurrentFrame();
  const q = useIn(at, "smooth");
  const k = Math.max(0, frame - at);
  const kb = 1.04 + k * 0.0012;
  const r = rot + Math.sin(k / 31) * 0.6;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        zIndex: z,
        borderRadius: 40,
        overflow: "hidden",
        border: "1.5px solid rgba(255,255,255,0.18)",
        boxShadow: colors.shadow,
        background: colors.surfaceStrong,
        opacity: q,
        transform: `translateY(${interpolate(q, [0, 1], [120, 0])}px) rotate(${r}deg) scale(${interpolate(q, [0, 1], [0.86, 1])})`,
      }}
    >
      <Sequence from={at} layout="none">
        <OffthreadVideo src={media(src)} muted startFrom={startFrom} style={{ width: "100%", height: "100%", objectFit: "cover", filter: grade, transform: `scale(${kb})` }} />
      </Sequence>
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${palette.bg}00 45%, ${palette.bg}D0 100%)` }} />
      {tag && (
        <div style={{ position: "absolute", left: 26, top: 24, padding: "8px 14px", borderRadius: 12, background: tagTone === "bad" ? colors.bad : palette.primary, color: tagTone === "bad" ? colors.white : colors.ink, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 20, letterSpacing: "0.14em" }}>
          {tag}
        </div>
      )}
    </div>
  );
};

/** A photo that is never still: slow push + drift. */
export const Drift: React.FC<{ src: string; w: number; h: number; at?: number; style?: React.CSSProperties; imgStyle?: React.CSSProperties }> = ({ src, w, h, at = 0, style, imgStyle }) => {
  const frame = useCurrentFrame();
  const k = Math.max(0, frame - at);
  return (
    <div style={{ width: w, height: h, overflow: "hidden", ...style }}>
      <Img src={media(src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.04 + k * 0.0011}) translateY(${-k * 0.25}px)`, ...imgStyle }} />
    </div>
  );
};

/**
 * The author's HeyGen face, full-frame. Before `at` the first frame stands
 * still (for the halftone reveal to resolve into); after the clip ends the
 * last frame holds. `len` is the clip length in frames at the reel's rate.
 */
export const Face: React.FC<{ shot: "punch" | "cta"; at: number; len: number; rate: number }> = ({ shot, at, len, rate }) => {
  const frame = useCurrentFrame();
  const base = `presenter/dessa-duplex/${shot}`;
  const still = frame < at ? `${base}-first.jpg` : frame >= at + len ? `${base}-last.jpg` : null;
  const st: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1080, height: 1920, ...FACE_FILL };
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: palette.bg }}>
      {still ? (
        <Img src={media(still)} style={st} />
      ) : (
        <Sequence from={at} durationInFrames={len} layout="none">
          <OffthreadVideo src={media(`${base}.mp4`)} muted playbackRate={rate} style={st} />
        </Sequence>
      )}
      {/* grade the studio into the palette: cool shadows, a lime kiss */}
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${palette.bg}B0 0%, ${palette.bg}00 22%, ${palette.bg}00 55%, ${palette.bg}E6 100%)` }} />
    </div>
  );
};

/* --------------------------------------------------------------- CTA */

export const CtaRow: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const thumb = useIn(at, "bouncy");
  const btn = useIn(at + 10, "snappy");
  const bub = useIn(at + 20, "bouncy");
  if (frame < at) return null;
  const k = frame - at;
  const fill = interpolate(k, [8, 14], [0, 1], { easing: theme.ease.out, ...clamp });
  const burst = interpolate(k, [10, 24], [0, 1], { easing: theme.ease.out, ...clamp });
  const ring = k > 16 ? Math.sin((k - 16) / 1.6) * interpolate(k, [16, 40], [16, 0], clamp) : 0;
  const thumbColor = fill > 0.5 ? palette.primary : palette.text;
  const pill: React.CSSProperties = { display: "inline-flex", alignItems: "center", gap: 12, padding: "16px 26px", borderRadius: 40, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 28, letterSpacing: "0.08em" };
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
      <div style={{ position: "relative", ...pill, padding: "16px 20px", background: "rgba(255,255,255,0.08)", border: "1.5px solid rgba(255,255,255,0.18)", color: thumbColor, opacity: thumb, transform: `scale(${interpolate(thumb, [0, 1], [0.4, 1]) * (fill > 0 && fill < 1 ? 1.2 : 1)})` }}>
        {burst > 0 && burst < 1 && <div style={{ position: "absolute", left: 14, top: 8, width: 56, height: 56, borderRadius: "50%", border: `3px solid ${palette.primary}`, opacity: 1 - burst, transform: `scale(${1 + burst * 2.2})` }} />}
        <svg viewBox="0 0 24 24" width={44} height={44} style={{ filter: fill > 0.5 ? `drop-shadow(0 0 12px ${palette.glow})` : undefined }}>
          <path d="M2 10h4v11H2zM7 10l4.2-7.6c.4-.7 1.3-.9 1.9-.4.5.4.7 1 .6 1.6L13 9h6.3c1.3 0 2.3 1.2 2 2.5l-1.6 7.4A2.5 2.5 0 0 1 17.3 21H7z" fill={fill > 0.5 ? palette.primary : "none"} stroke={thumbColor} strokeWidth={1.6} strokeLinejoin="round" />
        </svg>
      </div>
      <div style={{ ...pill, background: colors.bad, color: colors.white, boxShadow: `0 0 34px ${colors.badGlow}`, opacity: btn, transform: `scale(${interpolate(btn, [0, 1], [1.6, 1])}) rotate(${interpolate(btn, [0, 1], [-6, 0])}deg)` }}>
        ПОДПИСАТЬСЯ
        <svg viewBox="0 0 24 24" width={34} height={34} style={{ transform: `rotate(${ring}deg)`, transformOrigin: "50% 15%" }}>
          <path d="M12 2a6 6 0 0 0-6 6v4l-2 3v1h16v-1l-2-3V8a6 6 0 0 0-6-6zm-2 17a2 2 0 0 0 4 0" fill={colors.white} />
        </svg>
      </div>
      <div style={{ ...pill, padding: "16px 20px", background: palette.primary, color: colors.ink, opacity: bub, transform: `scale(${interpolate(bub, [0, 1], [0.4, 1])}) translateY(${Math.sin(k / (fps * 0.25)) * 3}px)` }}>
        <svg viewBox="0 0 24 24" width={40} height={40}>
          <path d="M4 4h16v12H8l-4 4z" fill="none" stroke={colors.ink} strokeWidth={2} strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
};

/** Spring helper for scene-local timing in seconds. */
export const useAt = (sec: number) => {
  const { fps } = useVideoConfig();
  return Math.round(sec * fps);
};

export const useSpringAt = (frameAt: number, cfg: keyof typeof theme.spring = "snappy") => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - frameAt, fps, config: theme.spring[cfg] });
};

/* ---------------------------------------------------------- hardware */

/** «Big LLMs: hundreds of racks» vs «Dessa: one». The grid fills rack by rack. */
export const RackCompare: React.FC<{ at: number; cols?: number; rows?: number }> = ({ at, cols = 9, rows = 6 }) => {
  const frame = useCurrentFrame();
  const n = cols * rows;
  const one = useIn(at + 18, "bouncy");
  return (
    <>
      <div style={{ position: "absolute", left: 40, top: 30, fontFamily: theme.fonts.mono, fontSize: 22, letterSpacing: "0.14em", color: palette.text }}>БОЛЬШИЕ LLM</div>
      <div style={{ position: "absolute", right: 40, top: 30, fontFamily: theme.fonts.mono, fontSize: 22, letterSpacing: "0.14em", color: palette.primary }}>DESSA</div>
      <div style={{ position: "absolute", left: 40, top: 86 }}>
        {Array.from({ length: n }, (_, i) => {
          const c = i % cols;
          const r = Math.floor(i / cols);
          const on = interpolate(frame, [at + i * 0.35, at + i * 0.35 + 6], [0, 1], { easing: theme.ease.out, ...clamp });
          return (
            <div key={i} style={{ position: "absolute", left: c * 44, top: r * 58, width: 34, height: 50, borderRadius: 5, border: `1.5px solid ${colors.lineStrong}`, background: "rgba(255,255,255,0.06)", opacity: on, transform: `scale(${interpolate(on, [0, 1], [0.4, 1])})` }}>
              {[10, 20, 30].map((y) => (
                <div key={y} style={{ position: "absolute", left: 5, right: 5, top: y, height: 2, background: colors.lineStrong }} />
              ))}
            </div>
          );
        })}
        <div style={{ position: "absolute", left: 0, top: rows * 58 + 14, fontFamily: WIDE, fontWeight: 900, fontSize: 44, letterSpacing: "-0.03em", color: palette.textDim, whiteSpace: "nowrap" }}>СОТНИ СТОЕК</div>
      </div>
      <div style={{ position: "absolute", left: 40 + cols * 44 + 30, top: 150, fontFamily: theme.fonts.serifRu, fontStyle: "italic", fontSize: 80, color: palette.textDim }}>vs</div>
      <div style={{ position: "absolute", right: 70, top: 100, display: "flex", flexDirection: "column", alignItems: "center", opacity: one, transform: `scale(${interpolate(one, [0, 1], [0.3, 1])})` }}>
        <div style={{ position: "relative", width: 110, height: 190, borderRadius: 10, border: `3px solid ${palette.primary}`, background: `${palette.primary}22`, boxShadow: `0 0 50px ${palette.glow}` }}>
          {[24, 48, 72, 96, 120, 144, 168].map((y) => (
            <div key={y} style={{ position: "absolute", left: 12, right: 12, top: y, height: 4, background: palette.primary, opacity: 0.8 }} />
          ))}
        </div>
        <div style={{ marginTop: 22, fontFamily: WIDE, fontWeight: 900, fontSize: 44, letterSpacing: "-0.03em", color: palette.primary, whiteSpace: "nowrap" }}>1 СТОЙКА</div>
      </div>
    </>
  );
};

/** The Apple mark, chrome-filled with a lime rim glow (path: Wikimedia Commons «Apple_logo_black.svg»). */
export const AppleMark: React.FC<{ size: number }> = ({ size }) => (
  <svg viewBox="0 0 814 1000" width={size} height={(size * 1000) / 814} style={{ filter: `drop-shadow(0 0 18px ${palette.glow}) drop-shadow(0 20px 30px rgba(0,0,0,0.8))` }}>
    <defs>
      <linearGradient id="dd-chrome" x1="0" y1="0" x2="0.4" y2="1">
        <stop offset="0" stopColor={colors.white} />
        <stop offset="0.45" stopColor={palette.textDim} />
        <stop offset="0.55" stopColor={colors.white} />
        <stop offset="1" stopColor={palette.textDim} />
      </linearGradient>
    </defs>
    <path
      fill="url(#dd-chrome)"
      stroke={palette.primary}
      strokeWidth={10}
      d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57-155.5-127C46.7 790.7 0 663 0 541.8c0-194.4 126.4-297.5 250.8-297.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z"
    />
  </svg>
);

/**
 * A cut-out sticker whose fat white + lime + dark outline is BAKED into the PNG
 * (ffmpeg alpha dilate). Stacked CSS drop-shadows timed out on the CPU-only
 * render server (30 s per frame), so only one shadow is drawn live.
 */
export const FatSticker: React.FC<{ src: string; w: number; at: number; rot?: number; out?: number }> = ({ src, w, at, rot = 6, out = 0 }) => {
  const q = useIn(at, "bouncy");
  const frame = useCurrentFrame();
  const k = Math.max(0, frame - at);
  return (
    <div style={{ width: w, opacity: q * (1 - out), transform: `scale(${interpolate(q, [0, 1], [0.2, 1]) * (1 - out * 0.4) * (1 + Math.sin(k / 9) * 0.012)}) rotate(${interpolate(q, [0, 1], [-30, rot]) + out * 40}deg)` }}>
      <Img src={media(src)} style={{ width: "100%", display: "block", filter: "drop-shadow(0 30px 40px rgba(0,0,0,0.75))" }} />
    </div>
  );
};
