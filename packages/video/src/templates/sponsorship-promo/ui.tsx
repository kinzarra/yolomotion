// The product kit for this promo: the app's own cards, chips and numbers,
// rebuilt at video scale so every figure can count and every panel can move.
import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { theme } from "../../theme";
import { sp, spPalette } from "./palette";

export const F = theme.fonts.body; // Inter, as in the app

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Seconds → frames for this composition. */
export const useSec = () => {
  const { fps } = useVideoConfig();
  return (s: number) => Math.round(s * fps);
};

/** 0→1 spring that starts at `at` seconds. */
export const useSpringAt = (at: number, cfg: keyof typeof theme.spring = "snappy") => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - Math.round(at * fps), fps, config: theme.spring[cfg] });
};

/** Eased 0→1 ramp between two moments in seconds. */
export const useRampSec = (from: number, to: number, easing = theme.ease.out) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return interpolate(frame, [from * fps, to * fps], [0, 1], { easing, ...clamp });
};

/** A 0→1→0 hit envelope: scale punches, shakes and flashes off one value. */
export const useHit = (at: number, life = 0.45) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = (frame - at * fps) / (life * fps);
  if (t < 0 || t > 1) return { pop: 0, shake: 0 };
  const d = 1 - t;
  return { pop: Math.sin(t * Math.PI) * d, shake: Math.sin(t * 38) * d * d };
};

/** Russian number formatting: 3 557, 1,8, 108. */
export const fmt = (n: number, decimals = 0) =>
  n
    .toFixed(decimals)
    .replace(".", ",")
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");

/** A number that counts to its value between two moments. */
export const Count: React.FC<{
  to: number;
  from?: number;
  at?: number;
  dur?: number;
  decimals?: number;
}> = ({ to, from = 0, at = 0, dur = 0.9, decimals = 0 }) => {
  const p = useRampSec(at, at + dur);
  const v = from + (to - from) * p;
  return <>{fmt(decimals ? v : Math.round(v), decimals)}</>;
};

// ---------- backdrop ----------

/** The app's dark page with two violet glows drifting and a faint dot grid. */
export const Backdrop: React.FC<{ intensity?: number; tint?: string }> = ({
  intensity = 1,
  tint = sp.violetGlow,
}) => {
  const frame = useCurrentFrame();
  const a = frame / 90;
  return (
    <AbsoluteFill style={{ backgroundColor: spPalette.bg, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          opacity: 0.55 * intensity,
          background: `radial-gradient(900px 900px at ${30 + Math.sin(a) * 12}% ${
            22 + Math.cos(a * 0.8) * 6
          }%, ${tint}, transparent 70%)`,
        }}
      />
      <AbsoluteFill
        style={{
          opacity: 0.35 * intensity,
          background: `radial-gradient(800px 800px at ${78 + Math.cos(a * 0.7) * 10}% ${
            82 + Math.sin(a) * 6
          }%, ${tint}, transparent 70%)`,
        }}
      />
      <AbsoluteFill
        style={{
          opacity: 0.12,
          backgroundImage: `radial-gradient(${sp.violetTint} 1.4px, transparent 1.6px)`,
          backgroundSize: "44px 44px",
          backgroundPosition: `0 ${-frame * 0.6}px`,
          maskImage: "radial-gradient(70% 60% at 50% 45%, black, transparent)",
        }}
      />
    </AbsoluteFill>
  );
};

/**
 * Every scene enters on a whip: zoom-in from 1.14 with motion blur and a
 * short white flash, so each cut lands as a hit (TikTok cut grammar).
 */
export const Cut: React.FC<{ children: React.ReactNode; shake?: number; flash?: boolean }> = ({
  children,
  shake = 0,
  flash = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = interpolate(frame, [0, 0.3 * fps], [0, 1], { easing: theme.ease.out, ...clamp });
  const scale = interpolate(t, [0, 1], [1.14, 1]);
  const blur = interpolate(t, [0, 1], [14, 0]);
  const fl = interpolate(frame, [0, 4], [0.2, 0], clamp);
  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          transform: `scale(${scale}) translate(${shake * 14}px, ${shake * -9}px)`,
          filter: blur > 0.2 ? `blur(${blur}px)` : undefined,
        }}
      >
        {children}
      </AbsoluteFill>
      {flash && <AbsoluteFill style={{ backgroundColor: sp.white, opacity: fl }} />}
    </AbsoluteFill>
  );
};

// ---------- app pieces ----------

/** White app card. */
export const Card: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
  pad?: number;
}> = ({ children, style, pad = 40 }) => (
  <div
    style={{
      background: sp.card,
      borderRadius: 36,
      padding: pad,
      boxShadow: sp.shadow,
      fontFamily: F,
      color: sp.ink,
      ...style,
    }}
  >
    {children}
  </div>
);

/** The app's small uppercase label («НАЙДЕНО РАЗМЕЩЕНИЙ»). */
export const Eyebrow: React.FC<{ children: React.ReactNode; color?: string; size?: number }> = ({
  children,
  color = sp.mutedDark,
  size = 30,
}) => (
  <div
    style={{
      fontFamily: F,
      fontSize: size,
      fontWeight: 700,
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      color,
    }}
  >
    {children}
  </div>
);

/** Huge tight display number / word, Inter Black. */
export const Big: React.FC<{
  children: React.ReactNode;
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}> = ({ children, size = 200, color = sp.ink, style }) => (
  <div
    style={{
      fontFamily: F,
      fontWeight: 900,
      fontSize: size,
      letterSpacing: "-0.045em",
      lineHeight: 0.92,
      color,
      fontVariantNumeric: "tabular-nums",
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {children}
  </div>
);

/** White display headline on the dark page, words staggering in. */
export const Title: React.FC<{
  text: string;
  at?: number;
  size?: number;
  color?: string;
  accent?: string[]; // words painted violet
  stagger?: number; // seconds between words
  align?: "center" | "left";
  width?: number;
}> = ({ text, at = 0, size = 96, color = sp.white, accent = [], stagger = 0.06, align = "center", width = 960 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lines = text.split("\n");
  let k = 0;
  return (
    <div
      style={{
        width,
        fontFamily: F,
        fontWeight: 900,
        fontSize: size,
        letterSpacing: "-0.04em",
        lineHeight: 1.02,
        textAlign: align,
        color,
      }}
    >
      {lines.map((line, li) => (
        <div key={li}>
          {line.split(" ").map((w, wi) => {
            const i = k++;
            const p = spring({
              frame: frame - Math.round((at + i * stagger) * fps),
              fps,
              config: theme.spring.snappy,
            });
            return (
              <span
                key={wi}
                style={{
                  display: "inline-block",
                  marginRight: size * 0.24,
                  opacity: p,
                  transform: `translateY(${interpolate(p, [0, 1], [size * 0.5, 0])}px) scale(${interpolate(
                    p,
                    [0, 1],
                    [0.7, 1],
                  )})`,
                  color: accent.includes(w.replace(/[.,:?!«»]/g, "")) ? sp.violet : undefined,
                }}
              >
                {w}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

/** Violet pill (the app's primary chip / button). */
export const Pill: React.FC<{
  children: React.ReactNode;
  bg?: string;
  color?: string;
  size?: number;
  style?: React.CSSProperties;
}> = ({ children, bg = sp.violet, color = sp.white, size = 34, style }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 14,
      background: bg,
      color,
      fontFamily: F,
      fontWeight: 800,
      fontSize: size,
      padding: `${size * 0.42}px ${size * 0.85}px`,
      borderRadius: 999,
      letterSpacing: "-0.01em",
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {children}
  </div>
);

/** Brand dot chip as in the report filter («● VOIS»). */
export const BrandChip: React.FC<{ name: string; color: string; size?: number; style?: React.CSSProperties }> = ({
  name,
  color,
  size = 40,
  style,
}) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: size * 0.35,
      background: sp.card,
      border: `2px solid ${sp.line}`,
      borderRadius: 999,
      padding: `${size * 0.32}px ${size * 0.7}px`,
      fontFamily: F,
      fontWeight: 700,
      fontSize: size,
      color: sp.ink,
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    <span style={{ width: size * 0.36, height: size * 0.36, borderRadius: 99, background: color }} />
    {name}
  </div>
);

/** Thin progress bar with a fill 0..1. */
export const Bar: React.FC<{ p: number; color?: string; h?: number; track?: string }> = ({
  p,
  color = sp.violet,
  h = 16,
  track = sp.track,
}) => (
  <div style={{ height: h, borderRadius: h, background: track, overflow: "hidden", width: "100%" }}>
    <div style={{ height: "100%", width: `${Math.max(0, Math.min(1, p)) * 100}%`, background: color, borderRadius: h }} />
  </div>
);

/** The Yoloco mark: white Y (public y.svg path) in a violet circle. */
export const YMark: React.FC<{ size?: number; glow?: number }> = ({ size = 200, glow = 0 }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size,
      background: sp.violet,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: `0 0 ${80 * glow}px ${30 * glow}px ${sp.violetGlow}`,
    }}
  >
    <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 20 20">
      <path
        d="M14.8568 4H19L11.804 12.0229V17H8.19604V12.0229L1 4H5.30176L10.0793 9.64571L14.8568 4Z"
        fill={sp.white}
      />
    </svg>
  </div>
);

/** Wordmark: mark + «Yoloco». */
export const Wordmark: React.FC<{ size?: number; color?: string }> = ({ size = 120, color = sp.white }) => (
  <div style={{ display: "flex", alignItems: "center", gap: size * 0.28 }}>
    <YMark size={size} />
    <div style={{ fontFamily: F, fontWeight: 900, fontSize: size * 0.82, letterSpacing: "-0.04em", color }}>
      Yoloco
    </div>
  </div>
);

export type PlatformKind = "youtube" | "telegram" | "vk" | "instagram" | "tiktok";

/** Platform badge: the platform color from the app + a drawn glyph. */
export const Platform: React.FC<{ kind: PlatformKind; size?: number }> = ({ kind, size = 120 }) => {
  const bg = sp[kind];
  const w = sp.white;
  const glyph = {
    youtube: <path d="M9 7.5v9l7.5-4.5z" fill={w} />,
    telegram: <path d="M4.5 11.6l14-5.6c.6-.2 1.1.2.9.9l-2.4 11.3c-.2.7-.8.9-1.3.5l-3.6-2.7-1.8 1.7c-.2.2-.4.3-.7.3l.3-3.7 6.6-6c.3-.3-.1-.4-.4-.2L7.9 13.1l-3.5-1.1c-.7-.2-.7-.7.1-1z" fill={w} />,
    vk: (
      <text x="12" y="15.6" textAnchor="middle" fontFamily={F} fontWeight={900} fontSize="9.5" fill={w}>
        VK
      </text>
    ),
    instagram: (
      <g fill="none" stroke={w} strokeWidth="1.9">
        <rect x="5" y="5" width="14" height="14" rx="4.2" />
        <circle cx="12" cy="12" r="3.3" />
        <circle cx="16.3" cy="7.7" r="0.6" fill={w} stroke="none" />
      </g>
    ),
    tiktok: (
      <path
        d="M14.6 4.5c.3 1.9 1.5 3.2 3.4 3.4v2.6c-1.3 0-2.4-.4-3.4-1.1v5.4c0 2.8-2.2 4.7-4.8 4.7-2.6 0-4.6-2-4.6-4.5 0-2.9 2.7-5 5.6-4.4v2.7c-1.3-.4-2.8.4-2.8 1.8 0 1 .8 1.8 1.9 1.8 1.2 0 2-.9 2-2.2V4.5z"
        fill={w}
      />
    ),
  }[kind];
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.28,
        background: bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 20px 40px -14px rgba(0,0,0,0.6), inset 0 0 0 2px rgba(255,255,255,0.12)",
      }}
    >
      <svg width={size * 0.78} height={size * 0.78} viewBox="0 0 24 24">
        {glyph}
      </svg>
    </div>
  );
};

/** A real ad post thumbnail from the report, 9:16, with slow Ken Burns. */
export const PostTile: React.FC<{
  file: string;
  w: number;
  radius?: number;
  style?: React.CSSProperties;
  drift?: number;
}> = ({ file, w, radius = 22, style, drift = 0 }) => {
  const frame = useCurrentFrame();
  const z = 1.04 + 0.05 * ((frame + drift * 37) % 240) / 240;
  return (
    <div
      style={{
        width: w,
        height: (w * 16) / 9,
        borderRadius: radius,
        overflow: "hidden",
        background: sp.inkSoft,
        flexShrink: 0,
        ...style,
      }}
    >
      <Img
        src={staticFile(`media/sponsorship-promo/posts/${file}.jpg`)}
        style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${z})` }}
      />
    </div>
  );
};

/** Rubber stamp that slams in (red by default). */
export const Stamp: React.FC<{
  text: string;
  at: number;
  color?: string;
  size?: number;
  rotate?: number;
  style?: React.CSSProperties;
}> = ({ text, at, color = sp.bad, size = 120, rotate = -9, style }) => {
  const p = useSpringAt(at, "bouncy");
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < at * fps) return null;
  return (
    <div
      style={{
        position: "absolute",
        fontFamily: F,
        fontWeight: 900,
        fontSize: size,
        letterSpacing: "-0.02em",
        color,
        border: `${size * 0.075}px solid ${color}`,
        borderRadius: size * 0.2,
        padding: `${size * 0.06}px ${size * 0.26}px`,
        transform: `rotate(${rotate}deg) scale(${interpolate(p, [0, 1], [2.4, 1])})`,
        opacity: interpolate(p, [0, 0.35], [0, 1], clamp),
        whiteSpace: "nowrap",
        background: "rgba(255,255,255,0.0)",
        ...style,
      }}
    >
      {text}
    </div>
  );
};

/** Gentle idle float for anything held on screen (rule 7). */
export const useFloat = (px = 8, speed = 40, phase = 0) => {
  const frame = useCurrentFrame();
  return Math.sin((frame + phase) / speed * Math.PI * 2) * px;
};

/** Element entrance: opacity + rise + scale off one spring. */
export const Rise: React.FC<{
  at: number;
  children: React.ReactNode;
  y?: number;
  style?: React.CSSProperties;
  cfg?: keyof typeof theme.spring;
}> = ({ at, children, y = 80, style, cfg = "snappy" }) => {
  const p = useSpringAt(at, cfg);
  return (
    <div
      style={{
        opacity: interpolate(p, [0, 0.6], [0, 1], clamp),
        transform: `translateY(${interpolate(p, [0, 1], [y, 0])}px) scale(${interpolate(p, [0, 1], [0.86, 1])})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Content column centered in the safe zone above the captions. */
export const Stage: React.FC<{ children: React.ReactNode; top?: number; bottom?: number; gap?: number }> = ({
  children,
  top = 230,
  bottom = 560,
  gap = 40,
}) => (
  <AbsoluteFill
    style={{
      paddingTop: top,
      paddingBottom: bottom,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      gap,
    }}
  >
    {children}
  </AbsoluteFill>
);

// The post thumbnails pulled from the MIXIT vs VOIS vs The Act report.
export const POSTS = [
  "instagram_posts_26239", "tiktok_posts_1237", "tiktok_posts_19177", "tiktok_posts_1281",
  "tiktok_posts_2151", "instagram_posts_26251", "tiktok_posts_1236", "tiktok_posts_1523",
  "tiktok_posts_1512", "tiktok_posts_28061", "tiktok_posts_28104", "tiktok_posts_12314",
  "instagram_posts_33200", "tiktok_posts_6549", "tiktok_posts_1389", "tiktok_posts_1225",
  "instagram_posts_26258", "instagram_posts_38879", "instagram_posts_33193", "tiktok_posts_18938",
  "tiktok_posts_28089", "tiktok_posts_28060", "tiktok_posts_2526", "tiktok_posts_27682",
  "instagram_posts_32114", "tiktok_posts_2520", "tiktok_posts_9950", "tiktok_posts_16476",
  "tiktok_posts_28147", "tiktok_posts_20910", "tiktok_posts_2531", "tiktok_posts_7344",
  "tiktok_posts_28158", "tiktok_posts_2676", "tiktok_posts_27821", "tiktok_posts_2899",
  "tiktok_posts_2508", "tiktok_posts_28163", "tiktok_posts_64", "tiktok_posts_17611",
  "tiktok_posts_8126", "tiktok_posts_17494", "tiktok_posts_17362", "instagram_posts_17605",
  "tiktok_posts_17452", "tiktok_posts_98", "tiktok_posts_17376", "tiktok_posts_17366",
] as const;

/**
 * The feed wall: columns of real ad posts on a tilted plane, each column
 * scrolling at its own speed. Hook backdrop and the CTA's loop back to it.
 */
export const PostWall: React.FC<{
  dim?: number; // 0..1 darkening
  lit?: number[]; // indices that stay bright with a violet outline
  litP?: number; // 0..1 how far the "only these" state has progressed
  speed?: number;
}> = ({ dim = 0.35, lit = [], litP = 0, speed = 1 }) => {
  const frame = useCurrentFrame();
  const cols = 5;
  const tileW = 236;
  const gap = 18;
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: spPalette.bg }}>
      <AbsoluteFill
        style={{
          transform: "perspective(1800px) rotateX(18deg) rotateZ(-9deg) scale(1.35)",
          transformOrigin: "50% 45%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          gap,
          top: -200,
        }}
      >
        {Array.from({ length: cols }).map((_, c) => {
          const dir = c % 2 === 0 ? -1 : 1;
          const off = ((frame * speed * (1.2 + c * 0.25)) % 1000) * dir - 500;
          return (
            <div key={c} style={{ display: "flex", flexDirection: "column", gap, transform: `translateY(${off}px)` }}>
              {Array.from({ length: 9 }).map((__, r) => {
                const idx = (c * 9 + r) % POSTS.length;
                const n = c * 9 + r;
                const isLit = lit.includes(n);
                const o = isLit ? 1 : 1 - litP * 0.85;
                return (
                  <div
                    key={r}
                    style={{
                      opacity: o,
                      borderRadius: 24,
                      outline: isLit && litP > 0 ? `${6 * litP}px solid ${sp.violet}` : undefined,
                      boxShadow: isLit && litP > 0 ? `0 0 ${60 * litP}px ${sp.violetGlow}` : undefined,
                    }}
                  >
                    <PostTile file={POSTS[idx]} w={tileW} drift={n} />
                  </div>
                );
              })}
            </div>
          );
        })}
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background: `radial-gradient(60% 45% at 50% 42%, rgba(18,17,33,${0.25 + dim * 0.5}), rgba(18,17,33,${
            0.55 + dim * 0.4
          }) 70%)`,
        }}
      />
    </AbsoluteFill>
  );
};

/** The app's auto_awesome sparkle, drawn. */
export const Sparkle: React.FC<{ size?: number; color?: string }> = ({ size = 40, color = sp.white }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M10 3l1.8 5.2L17 10l-5.2 1.8L10 17l-1.8-5.2L3 10l5.2-1.8zM18 14l.9 2.1L21 17l-2.1.9L18 20l-.9-2.1L15 17l2.1-.9z" fill={color} />
  </svg>
);

/** Globe glyph for «весь интернет». */
export const Globe: React.FC<{ size?: number; color?: string }> = ({ size = 40, color = sp.white }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8">
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c2.8 3 2.8 15 0 18M12 3c-2.8 3-2.8 15 0 18" />
  </svg>
);

// ---------- v2 additions (author notes 2026-10-20) ----------

/** Material Symbols-style glyphs drawn as SVG (Inter has no ✓, it rendered as a bar). */
export type IconKind = "check" | "search" | "ai" | "campaign" | "media" | "doc" | "close" | "link" | "percent" | "ticket" | "crown" | "users" | "bolt";
export const Icon: React.FC<{ kind: IconKind; size?: number; color?: string }> = ({ kind, size = 32, color = sp.white }) => {
  const d: Record<IconKind, React.ReactNode> = {
    check: <path d="M9.2 16.6L4.8 12.2l-1.6 1.6 6 6L21 8l-1.6-1.6z" fill={color} />,
    close: <path d="M6.4 4.9L12 10.6l5.6-5.7 1.5 1.5-5.7 5.6 5.7 5.6-1.5 1.5-5.6-5.7-5.6 5.7-1.5-1.5 5.7-5.6-5.7-5.6z" fill={color} />,
    search: <path d="M15.5 14h-.8l-.3-.3A6.5 6.5 0 1 0 9.5 16a6.5 6.5 0 0 0 4.2-1.6l.3.3v.8l5 5 1.5-1.5zm-6 0a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9z" fill={color} />,
    ai: <path d="M10 3l1.8 5.2L17 10l-5.2 1.8L10 17l-1.8-5.2L3 10l5.2-1.8zM18 14l.9 2.1L21 17l-2.1.9L18 20l-.9-2.1L15 17l2.1-.9z" fill={color} />,
    campaign: <path d="M18 11v2h4v-2zm-2 6.6c1 .7 2.2 1.6 3.2 2.4l1.2-1.6c-1-.7-2.2-1.6-3.2-2.4zM20.4 5.6L19.2 4c-1 .8-2.2 1.7-3.2 2.4l1.2 1.6c1-.8 2.2-1.6 3.2-2.4zM4 9a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h1v4h2v-4h1l5 3V6L8 9zm11.5 3c0-1.3-.6-2.5-1.5-3.4v6.8c.9-.8 1.5-2 1.5-3.4z" fill={color} />,
    media: <path d="M2 6H0v5h.01L0 20a2 2 0 0 0 2 2h18v-2H2zm20-2h-8l-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zM7 15l4.5-6 3.5 4.5 2.5-3L21 15z" fill={color} />,
    doc: <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zm2 16H8v-2h8zm0-4H8v-2h8zm-3-5V3.5L18.5 9z" fill={color} />,
    link: <path d="M3.9 12a3.1 3.1 0 0 1 3.1-3.1h4V7H7a5 5 0 0 0 0 10h4v-1.9H7A3.1 3.1 0 0 1 3.9 12zM8 13h8v-2H8zm9-6h-4v1.9h4a3.1 3.1 0 0 1 0 6.2h-4V17h4a5 5 0 0 0 0-10z" fill={color} />,
    percent: <path d="M7.5 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zm0-5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm9 7a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zm0 5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zM5.4 20L4 18.6 18.6 4 20 5.4z" fill={color} />,
    ticket: <path d="M22 10V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v4a2 2 0 0 1 0 4v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 1 0-4zm-9 7.5h-2v-2h2zm0-4.5h-2v-2h2zm0-4.5h-2v-2h2z" fill={color} />,
    crown: <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11zm14 3a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-1h14z" fill={color} />,
    users: <path d="M16 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-8 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 2c-2.3 0-7 1.2-7 3.5V19h14v-2.5C15 14.2 10.3 13 8 13zm8 0h-1c1.2.8 2 1.9 2 3.5V19h6v-2.5c0-2.3-4.7-3.5-7-3.5z" fill={color} />,
    bolt: <path d="M11 21h-1l1-7H7.5c-.9 0 .3-.8.3-.8C9.1 10.9 11 7.6 13 3h1l-1 7h3.5c.5 0 .6.3.4.6C13.4 17.1 11 21 11 21z" fill={color} />,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
      {d[kind]}
    </svg>
  );
};

/** Round check badge (the app's done state). */
export const CheckDot: React.FC<{ size?: number; on?: boolean }> = ({ size = 34, on = true }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size,
      background: on ? sp.violet : sp.track,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    }}
  >
    {on ? <Icon kind="check" size={size * 0.7} color={sp.white} /> : null}
  </div>
);

/**
 * TikTok glitch: the children echoed in red and cyan, split sideways by `amt`
 * (0..1), screen-blended. Drive `amt` off a hit envelope.
 */
export const Glitch: React.FC<{ amt: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ amt, children, style }) => {
  const frame = useCurrentFrame();
  const j = Math.sin(frame * 2.7) * amt;
  const off = 18 * amt;
  return (
    <div style={{ position: "relative", ...style }}>
      {amt > 0.02 && (
        <>
          <div style={{ position: "absolute", inset: 0, transform: `translate(${-off + j * 6}px, ${j * 3}px)`, filter: "drop-shadow(0 0 0 #FF2E63)", opacity: 0.8, mixBlendMode: "screen", color: "#FF2E63" }}>
            <div style={{ filter: "sepia(1) saturate(8) hue-rotate(-50deg)" }}>{children}</div>
          </div>
          <div style={{ position: "absolute", inset: 0, transform: `translate(${off - j * 6}px, ${-j * 3}px)`, opacity: 0.8, mixBlendMode: "screen" }}>
            <div style={{ filter: "sepia(1) saturate(8) hue-rotate(150deg)" }}>{children}</div>
          </div>
        </>
      )}
      <div style={{ position: "relative", transform: `translateX(${j * 4}px)` }}>{children}</div>
    </div>
  );
};

/** A sticker that pops on with overshoot and a tilt: TikTok text-box grammar. */
export const Sticker: React.FC<{
  at: number;
  children: React.ReactNode;
  rotate?: number;
  bg?: string;
  color?: string;
  size?: number;
  style?: React.CSSProperties;
  from?: { x: number; y: number };
}> = ({ at, children, rotate = -4, bg = sp.white, color = sp.ink, size = 44, style, from = { x: 0, y: 0 } }) => {
  const p = useSpringAt(at, "bouncy");
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < at * fps) return null;
  const wob = Math.sin((frame - at * fps) / 9) * 1.2;
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: size * 0.3,
        background: bg,
        color,
        fontFamily: F,
        fontWeight: 900,
        fontSize: size,
        letterSpacing: "-0.02em",
        padding: `${size * 0.28}px ${size * 0.5}px`,
        borderRadius: size * 0.36,
        whiteSpace: "nowrap",
        boxShadow: "0 18px 40px -12px rgba(0,0,0,0.6)",
        transform: `translate(${(1 - p) * from.x}px, ${(1 - p) * from.y}px) rotate(${rotate * p + wob}deg) scale(${interpolate(p, [0, 1], [0.2, 1])})`,
        opacity: interpolate(p, [0, 0.3], [0, 1], clamp),
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** One word that slams in: scale 1.8 → 1, a quick tilt, a glitch echo on landing. */
export const Slam: React.FC<{ at: number; children: React.ReactNode; style?: React.CSSProperties; tilt?: number }> = ({ at, children, style, tilt = 0 }) => {
  const p = useSpringAt(at, "snappy");
  const hit = useHit(at + 0.05, 0.35);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < at * fps) return null;
  return (
    <div
      style={{
        transform: `scale(${interpolate(p, [0, 1], [1.9, 1])}) rotate(${interpolate(p, [0, 1], [tilt * 3, tilt])}deg)`,
        opacity: interpolate(p, [0, 0.25], [0, 1], clamp),
        filter: p < 0.6 ? `blur(${(0.6 - p) * 14}px)` : undefined,
        ...style,
      }}
    >
      <Glitch amt={hit.pop}>{children}</Glitch>
    </div>
  );
};

/** Avatar: a real avatar file, or the app's initials fallback. */
export const Avatar: React.FC<{ file?: string; name: string; size?: number; ring?: string }> = ({ file, name, size = 60, ring }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size,
      overflow: "hidden",
      flexShrink: 0,
      background: sp.violetSoft,
      color: sp.violet,
      fontFamily: F,
      fontWeight: 800,
      fontSize: size * 0.36,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      border: ring ? `${Math.max(3, size * 0.06)}px solid ${ring}` : undefined,
    }}
  >
    {file ? (
      <Img src={staticFile(`media/sponsorship-promo/avatars/${file}.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    ) : (
      name.slice(0, 2).toUpperCase()
    )}
  </div>
);

// Cards from the report's «Посты» tab (MIXIT vs VOIS vs The Act, sorted by views), read 2026-10-20.
export type PostCardData = {
  name: string;
  date: string;
  subs: string;
  img: string;
  avatar?: string;
  net: "instagram" | "tiktok";
  text: string;
  marks: string[];
  views: string;
  likes: string;
  comments: string;
  er: string;
  ad?: boolean;
};
export const POSTCARDS: PostCardData[] = [
  { name: "vashadusha_", date: "29 авг. 2026 г.", subs: "6 933", img: "instagram_posts_26239", avatar: "instagram_avatars_20639", net: "instagram", text: "#WW385975 - артикул на пилинг (копируй с ww для Wb) сохраняй инструкцию, нанесите на влажную кожу головы… Промокод на Ozon - на все продукты VOIS", marks: ["#WW385975", "Промокод на Ozon"], views: "4,8 млн", likes: "10 тыс.", comments: "74", er: "0.21%", ad: true },
  { name: "khadidzha_meow", date: "7 апр. 2026 г.", subs: "80,3 тыс.", img: "tiktok_posts_1237", avatar: "tiktok_avatars_66", net: "tiktok", text: "Я ПРОСТО В ШОКЕ #асмр #обзор #войс #маскадлялица #тренды", marks: ["#войс"], views: "3 млн", likes: "207,1 тыс.", comments: "1 196", er: "8.84%" },
  { name: "lazzkinzz", date: "17 июн. 2026 г.", subs: "196,9 тыс.", img: "tiktok_posts_19177", avatar: "tiktok_avatars_334", net: "tiktok", text: "#разговорник #бьюти #бьютиблог #реклама #сотрудничество #forme #бренды #войс #семили", marks: ["#реклама", "#сотрудничество"], views: "2,6 млн", likes: "121,9 тыс.", comments: "3 993", er: "5.00%", ad: true },
  { name: "mariyka_actcreati", date: "15 мая 2026 г.", subs: "8 575", img: "tiktok_posts_1281", net: "tiktok", text: "Вы бы пустили? Себе набор тоже взяла, это новинка шампунь и кондиционер", marks: ["новинка"], views: "2,6 млн", likes: "168,7 тыс.", comments: "254", er: "6.51%" },
  { name: "tery_ami", date: "22 авг. 2026 г.", subs: "5 762", img: "tiktok_posts_2151", net: "tiktok", text: "ПРОМИК НА СКИДКУ ОЗОН: #C75DFFDDEB5B (вставлять без хештега при оформлении)", marks: ["#C75DFFDDEB5B"], views: "2,4 млн", likes: "138 тыс.", comments: "522", er: "6.25%" },
  { name: "rassohina.beauty", date: "9 сент. 2026 г.", subs: "21,1 тыс.", img: "instagram_posts_26251", net: "instagram", text: "СРАБОТАЛО??! #KD69D1C1482B копируйте, выбирайте любые товары VOIS", marks: ["#KD69D1C1482B"], views: "2,3 млн", likes: "63,7 тыс.", comments: "676", er: "2.86%", ad: true },
  { name: "svetlanka_li", date: "7 апр. 2026 г.", subs: "3 372", img: "tiktok_posts_1236", net: "tiktok", text: "Вот и вся правда о масках VOIS, оригинал WB: #WW290616 копируй с буквами", marks: ["#WW290616"], views: "1,8 млн", likes: "44,2 тыс.", comments: "654", er: "2.86%" },
  { name: "krasopetka3", date: "28 сент. 2026 г.", subs: "258,2 тыс.", img: "tiktok_posts_1523", net: "tiktok", text: "Мою только корни волос. Артикулы на шампуни и кондиционер от VOIS", marks: ["Артикулы"], views: "1,6 млн", likes: "38,8 тыс.", comments: "405", er: "2.57%" },
];

/** Highlight box that sweeps over a word (the AI found it). */
export const HiMark: React.FC<{ p: number; children: React.ReactNode; color?: string }> = ({ p, children, color = sp.violet }) => (
  <span style={{ position: "relative", whiteSpace: "nowrap" }}>
    <span style={{ position: "absolute", left: -4, right: -4, top: 0, bottom: 0, background: color, opacity: 0.16 * p, borderRadius: 6, transformOrigin: "left center", transform: `scaleX(${p})` }} />
    <span style={{ position: "absolute", left: -4, right: -4, top: -2, bottom: -2, border: `2.5px solid ${color}`, borderRadius: 7, opacity: p }} />
    <span style={{ position: "relative", color: p > 0.5 ? color : undefined, fontWeight: p > 0.5 ? 800 : undefined }}>{children}</span>
  </span>
);

/** The «Посты» card of the report, 1:1 in layout, at video scale. `found` 0..1 lights the marks. */
export const ReportPostCard: React.FC<{ d: PostCardData; w?: number; found?: number }> = ({ d, w = 470, found = 0 }) => {
  const s = w / 470;
  const parts: React.ReactNode[] = [];
  let rest = d.text;
  d.marks.forEach((m, i) => {
    const k = rest.indexOf(m);
    if (k < 0) return;
    parts.push(rest.slice(0, k));
    parts.push(<HiMark key={i} p={found}>{m}</HiMark>);
    rest = rest.slice(k + m.length);
  });
  parts.push(rest);
  const stat = (l: string, v: string) => (
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 17 * s, color: sp.muted, fontWeight: 500 }}>{l}</div>
      <div style={{ fontSize: 22 * s, fontWeight: 800, marginTop: 2 * s }}>{v}</div>
    </div>
  );
  return (
    <div style={{ width: w, background: sp.card, borderRadius: 26 * s, padding: 16 * s, fontFamily: F, color: sp.ink, boxShadow: `0 0 0 ${1.5 * s}px ${sp.line}`, position: "relative" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 * s }}>
        <div style={{ position: "relative" }}>
          <Avatar file={d.avatar} name={d.name} size={52 * s} />
          <div style={{ position: "absolute", right: -4 * s, bottom: -4 * s, width: 22 * s, height: 22 * s, borderRadius: 99, background: d.net === "instagram" ? sp.instagram : sp.tiktok, border: `${2 * s}px solid ${sp.white}` }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 22 * s, fontWeight: 800 }}>{d.name}</span>
            <span style={{ fontSize: 16 * s, color: sp.muted }}>{d.date}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 * s }}>
            <span style={{ fontSize: 17 * s, color: sp.mutedDark }}>Подписчики: {d.subs}</span>
            <span style={{ fontSize: 15 * s, fontWeight: 700, background: sp.track, borderRadius: 99, padding: `${3 * s}px ${10 * s}px`, display: "flex", alignItems: "center", gap: 6 * s }}>
              <span style={{ width: 8 * s, height: 8 * s, borderRadius: 9, background: sp.vois }} />
              VOIS
            </span>
          </div>
        </div>
      </div>
      <div style={{ marginTop: 14 * s, height: 250 * s, borderRadius: 18 * s, overflow: "hidden" }}>
        <Img src={staticFile(`media/sponsorship-promo/posts/${d.img}.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <div style={{ marginTop: 14 * s, fontSize: 19 * s, lineHeight: 1.4, color: sp.inkSoft, height: 106 * s, overflow: "hidden" }}>{parts}</div>
      <div style={{ marginTop: 12 * s, paddingTop: 12 * s, borderTop: `${1.5 * s}px solid ${sp.line}`, display: "flex" }}>
        {stat("Просмотры", d.views)}
        {stat("Лайки", d.likes)}
        {stat("Комментарии", d.comments)}
        {stat("ER", d.er)}
      </div>
      <div style={{ marginTop: 12 * s, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 16 * s, fontWeight: 600, background: sp.track, color: sp.inkSoft, borderRadius: 99, padding: `${4 * s}px ${12 * s}px`, opacity: d.ad ? 1 : 0 }}>Реклама</span>
        <span style={{ fontSize: 17 * s, fontWeight: 700, color: sp.violet, border: `${1.5 * s}px solid ${sp.line}`, borderRadius: 99, padding: `${6 * s}px ${14 * s}px` }}>Открыть пост ↗</span>
      </div>
    </div>
  );
};

/** A generated photo from public/media/sponsorship-promo/gen, cover-fit with a push-in. */
export const GenPhoto: React.FC<{ file: string; z0?: number; z1?: number; dur?: number; style?: React.CSSProperties }> = ({ file, z0 = 1.05, z1 = 1.15, dur = 3, style }) => {
  const z = interpolate(useRampSec(0, dur, (x) => x), [0, 1], [z0, z1]);
  return (
    <AbsoluteFill style={{ overflow: "hidden", ...style }}>
      <Img src={staticFile(`media/sponsorship-promo/gen/${file}`)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${z})` }} />
    </AbsoluteFill>
  );
};
