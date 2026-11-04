// Extra hits a place can carry (from the author's frame notes): the budget-
// rule gauge, the subscribe button, and rubber stamps slammed on a photo.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { useIn, usePunch } from "../../reel";
import { colors, palette } from "./palette";
import { Check } from "./ui";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/**
 * Urals vs the cut-off, live: the price swings across the line and the verdict
 * flips — above it the Ministry buys currency, below it sells. Illustrative
 * swing; the line is the real 2026 cut-off.
 */
export const CutoffGauge: React.FC<{ cutoff: number; at: number }> = ({ cutoff, at }) => {
  const frame = useCurrentFrame();
  const p = useIn(at, "snappy");
  const price = cutoff + Math.sin((frame - at) / 16) * 9 + 1.5;
  const above = price >= cutoff;
  const tone = above ? palette.primary : colors.bad;
  const H = 210;
  const lo = cutoff - 12;
  const hi = cutoff + 12;
  const y = (v: number) => H - ((v - lo) / (hi - lo)) * H;
  return (
    <div
      style={{
        position: "absolute",
        left: 46,
        top: 470,
        width: 300,
        padding: "16px 18px",
        borderRadius: 14,
        background: colors.surfaceStrong,
        border: `2px solid ${tone}`,
        boxShadow: colors.shadow,
        fontFamily: theme.fonts.mono,
        color: palette.text,
        opacity: p,
        transform: `translateX(${interpolate(p, [0, 1], [-60, 0])}px)`,
      }}
    >
      <div style={{ fontSize: 17, letterSpacing: "0.12em", color: palette.textDim }}>НЕФТЬ URALS · $/БАРР</div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 14, marginTop: 8 }}>
        <div style={{ position: "relative", width: 34, height: H, background: colors.surfaceLift, borderRadius: 6 }}>
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: H - y(price),
              background: tone,
              borderRadius: 6,
            }}
          />
          <div style={{ position: "absolute", left: -8, right: -8, top: y(cutoff), height: 3, background: palette.text }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1, color: tone }}>${price.toFixed(0)}</div>
          <div style={{ fontSize: 16, marginTop: 6, color: palette.textDim }}>ОТСЕЧКА ${cutoff}</div>
          <div
            style={{
              marginTop: 14,
              padding: "8px 10px",
              background: tone,
              color: colors.ink2,
              fontSize: 19,
              fontWeight: 800,
              letterSpacing: "0.06em",
              lineHeight: 1.2,
            }}
          >
            {above ? "МИНФИН ПОКУПАЕТ ВАЛЮТУ" : "МИНФИН ПРОДАЁТ ВАЛЮТУ"}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * The classic YouTuber subscribe beat: the cursor clicks ПОДПИСАТЬСЯ, it flips
 * to ВЫ ПОДПИСАНЫ, then the cursor hops to the bell and the bell rings.
 */
export const SubscribeButton: React.FC<{ at: number; out: number }> = ({ at, out }) => {
  const frame = useCurrentFrame();
  const p = useIn(at, "bouncy");
  const click1 = at + 20;
  const click2 = at + 40;
  const hit1 = usePunch(click1, 12);
  const hit2 = usePunch(click2, 12);
  const subbed = frame >= click1;
  const rang = frame >= click2;
  const bellIn = useIn(click1 + 2, "bouncy");
  const leave = interpolate(frame, [out - 8, out], [0, 1], { easing: theme.ease.in, ...clamp });
  const pulse = subbed ? 0 : (Math.sin(frame / 4) + 1) / 2;
  // cursor path: in from below-right → subscribe → bell → rests
  const toSub = interpolate(frame, [at + 2, click1 - 2], [0, 1], { easing: theme.ease.inOut, ...clamp });
  const toBell = interpolate(frame, [click1 + 6, click2 - 2], [0, 1], { easing: theme.ease.inOut, ...clamp });
  const cx = interpolate(toBell, [0, 1], [interpolate(toSub, [0, 1], [760, 470]), 800]);
  const cy = interpolate(toBell, [0, 1], [interpolate(toSub, [0, 1], [260, 78]), 72]);
  const press = Math.max(hit1.pop, hit2.pop);
  const ring = rang ? Math.sin((frame - click2) * 1.3) * 22 * Math.max(0, 1 - (frame - click2) / 26) : 0;
  if (frame >= out) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 1640,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 14,
        opacity: p * (1 - leave),
        transform: `translateY(${interpolate(p, [0, 1], [80, 0]) + leave * 40}px)`,
      }}
    >
      <div style={{ fontFamily: theme.fonts.mono, fontSize: 26, fontWeight: 700, letterSpacing: "0.14em", color: palette.text }}>
        ВСЁ ПРО ТВОИ ДЕНЬГИ — ПРОСТО
      </div>
      <div style={{ position: "relative", width: 900, height: 140 }}>
        <div
          style={{
            position: "absolute",
            right: 200, // the bell sits at x 734–846, the pill ends before it
            top: 6,
            display: "flex",
            alignItems: "center",
            gap: 16,
            whiteSpace: "nowrap",
            padding: "28px 52px",
            borderRadius: 999,
            background: subbed ? colors.surfaceLift : colors.bad,
            border: subbed ? `2px solid ${colors.lineStrong}` : "2px solid transparent",
            boxShadow: subbed ? "none" : `0 0 ${40 + pulse * 60}px ${colors.badGlow}, 0 0 0 ${pulse * 10}px rgba(255,59,59,0.25)`,
            fontFamily: theme.fonts.wide,
            fontWeight: 800,
            fontSize: 50,
            color: palette.text,
            transformOrigin: "right center",
            transform: `scale(${(1 + pulse * 0.04) * (1 - hit1.pop * 0.08)})`,
          }}
        >
          {subbed && <Check delay={click1} size={42} color={palette.primary} />}
          {subbed ? "ВЫ ПОДПИСАНЫ" : "ПОДПИСАТЬСЯ"}
        </div>
        {/* the bell */}
        {subbed && (
          <div
            style={{
              position: "absolute",
              left: 734,
              top: 14,
              width: 112,
              height: 112,
              borderRadius: "50%",
              background: rang ? palette.text : colors.surfaceLift,
              border: `2px solid ${colors.lineStrong}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: bellIn,
              transform: `scale(${interpolate(bellIn, [0, 1], [0.4, 1]) * (1 - hit2.pop * 0.1)})`,
              boxShadow: rang ? `0 0 40px rgba(241,237,226,0.35)` : "none",
            }}
          >
            <svg width={60} height={60} viewBox="0 0 24 24" style={{ transform: `rotate(${ring}deg)`, transformOrigin: "50% 10%" }}>
              <path
                d="M12 2a1.6 1.6 0 0 0-1.6 1.6v.7A6.5 6.5 0 0 0 5.5 10.7v4.6L3.6 17.6v1.1h16.8v-1.1l-1.9-2.3v-4.6a6.5 6.5 0 0 0-4.9-6.4v-.7A1.6 1.6 0 0 0 12 2Zm-2.3 18a2.3 2.3 0 0 0 4.6 0Z"
                fill={rang ? colors.ink2 : palette.text}
              />
            </svg>
          </div>
        )}
        {/* ring waves */}
        {rang &&
          [0, 1].map((i) => {
            const w = interpolate(frame - click2 - i * 5, [0, 18], [0, 1], { easing: theme.ease.out, ...clamp });
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: 790 - 56 - w * 40,
                  top: 70 - 56 - w * 40,
                  width: 112 + w * 80,
                  height: 112 + w * 80,
                  borderRadius: "50%",
                  border: `3px solid ${palette.text}`,
                  opacity: (1 - w) * 0.7,
                }}
              />
            );
          })}
        {/* the cursor */}
        <svg
          width={64}
          height={64}
          viewBox="0 0 24 24"
          style={{
            position: "absolute",
            left: cx,
            top: cy,
            transform: `scale(${1 - press * 0.22})`,
            filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.7))",
            opacity: Math.min(1, toSub * 3),
          }}
        >
          <path d="M3 2 L3 19 L8 14.5 L11.5 22 L14.5 20.6 L11 13.2 L18 13 Z" fill={palette.text} stroke={colors.ink2} strokeWidth={1.2} />
        </svg>
      </div>
    </div>
  );
};

/** Rubber stamps slamming onto the photo, worn ink like a real stamp. */
export const Stamps: React.FC<{ word: string; at: number }> = ({ word, at }) => {
  const spots = [
    { x: 70, y: 590, r: -12 },
    { x: 150, y: 800, r: 7 },
    { x: 60, y: 1000, r: -5 },
  ];
  return (
    <>
      <svg width={0} height={0} style={{ position: "absolute" }}>
        <filter id="stamp-grunge">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={7} result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.4 1.75" result="m" />
          <feComposite in="SourceGraphic" in2="m" operator="in" />
        </filter>
      </svg>
      {spots.map((s, i) => (
        <OneStamp key={i} word={word} at={at + i * 9} {...s} />
      ))}
    </>
  );
};

const OneStamp: React.FC<{ word: string; at: number; x: number; y: number; r: number }> = ({ word, at, x, y, r }) => {
  const frame = useCurrentFrame();
  const p = useIn(at, "snappy");
  if (frame < at) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        padding: "6px 22px",
        borderTop: `9px solid ${colors.bad}`,
        borderBottom: `9px solid ${colors.bad}`,
        color: colors.bad,
        fontFamily: "Georgia, 'Times New Roman', serif",
        fontWeight: 900,
        fontSize: 100,
        letterSpacing: "0.02em",
        lineHeight: 1,
        opacity: Math.min(0.92, p * 1.6),
        transform: `rotate(${r}deg) scale(${interpolate(p, [0, 1], [2.4, 1])})`,
        filter: "url(#stamp-grunge) drop-shadow(0 0 2px rgba(0,0,0,0.35))",
        whiteSpace: "nowrap",
      }}
    >
      {word}
    </div>
  );
};
