// The «ultra modern» layer for parts 3–5 (author 2026-11-01: «больше фоток и
// видео и более сложную графику»): every beat stands on a duotone video, the
// evidence sits in HUD-framed media cards, and glass chips with icons drift
// around it. Same palette: lime is the one signal, red the loss, paper the
// surface; the glass is dark, never a third colour.
import React from "react";
import { Img, OffthreadVideo, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../theme";
import { rnd } from "../digital-ruble/ui";
import { devMythColors as colors, devMythPalette as palette } from "./palette";
import { cl, media } from "./ui";
import { richText } from "./sym";

/** A full-frame video, desaturated into the palette, pushed in slowly, dark enough to carry type. */
export const BgVideo: React.FC<{ src: string; dim?: number; tint?: number; startFrom?: number; blur?: number }> = ({ src, dim = 0.62, tint = 0.35, startFrom = 0, blur = 0 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
  const push = interpolate(frame, [0, durationInFrames], [1.06, 1.16], { easing: theme.ease.inOut, ...cl });
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", zIndex: 0 }}>
      <OffthreadVideo src={media(src)} muted startFrom={Math.round(startFrom * fps)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${push})`, filter: `grayscale(0.7) contrast(1.15) brightness(${1 - dim}) blur(${blur}px)` }} />
      <div style={{ position: "absolute", inset: 0, background: palette.primary, mixBlendMode: "multiply", opacity: tint }} />
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 30% 40%, transparent 0%, ${palette.bg}AA 70%), linear-gradient(180deg, ${palette.bg}CC 0%, transparent 25%, transparent 70%, ${palette.bg}EE 100%)` }} />
    </div>
  );
};

/** HUD corners, a scanning line and a REC/meta strip around any box. */
export const Hud: React.FC<{ label?: string; meta?: string; color?: string }> = ({ label, meta, color = palette.primary }) => {
  const frame = useCurrentFrame();
  const scan = (frame * 1.6) % 120 - 10;
  const c = 34;
  const corner = (pos: React.CSSProperties, rot: number) => (
    <div style={{ position: "absolute", width: c, height: c, borderTop: `4px solid ${color}`, borderLeft: `4px solid ${color}`, transform: `rotate(${rot}deg)`, ...pos }} />
  );
  return (
    <div style={{ position: "absolute", inset: -14, pointerEvents: "none" }}>
      {corner({ left: 0, top: 0 }, 0)}
      {corner({ right: 0, top: 0 }, 90)}
      {corner({ right: 0, bottom: 0 }, 180)}
      {corner({ left: 0, bottom: 0 }, 270)}
      <div style={{ position: "absolute", left: 14, right: 14, top: `${scan}%`, height: 2, background: `linear-gradient(90deg, transparent, ${color}, transparent)`, opacity: 0.7 }} />
      {(label || meta) && (
        <div style={{ position: "absolute", left: 14, right: 14, bottom: -34, display: "flex", justifyContent: "space-between", fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: 18, letterSpacing: "0.12em", color }}>
          <span><span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 5, background: colors.bad, marginRight: 8, opacity: Math.floor(frame / 12) % 2 ? 1 : 0.3 }} />{label}</span>
          <span style={{ color: palette.textDim }}>{meta}</span>
        </div>
      )}
    </div>
  );
};

/** A media card (video or still) that slides in with a 3D tilt and floats, framed by the HUD. */
export const MediaCard: React.FC<{ src: string; at?: number; x: number; y: number; w: number; h: number; tilt?: number; label?: string; meta?: string; video?: boolean; startFrom?: number; grade?: boolean; fit?: "cover" | "contain"; z?: number }> = ({ src, at = 0, x, y, w, h, tilt = 0, label, meta, video, startFrom = 0, grade = true, fit = "cover", z = 6 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - at, fps, config: theme.spring.smooth });
  if (frame < at) return null;
  const isVideo = video ?? src.endsWith(".mp4");
  const ry = interpolate(p, [0, 1], [tilt * 4 + 25, tilt]);
  const float = Math.sin((frame + x) / 40) * 6;
  const kb = interpolate(frame - at, [0, 300], [1.05, 1.15], cl);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, zIndex: z, perspective: 1400, opacity: Math.min(1, p * 1.4) }}>
      <div style={{ position: "absolute", inset: 0, transform: `translateY(${interpolate(p, [0, 1], [60, 0]) + float}px) rotateY(${ry}deg) rotateX(${Math.sin((frame + y) / 55) * 2}deg)`, transformStyle: "preserve-3d" }}>
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", borderRadius: 18, border: `2px solid ${colors.lineStrong}`, boxShadow: `0 40px 90px -30px rgba(0,0,0,0.95), 0 0 0 1px ${palette.primary}33` }}>
          {isVideo ? (
            <Sequence from={at} layout="none">
              <OffthreadVideo src={media(src)} muted startFrom={Math.round(startFrom * fps)} style={{ width: "100%", height: "100%", objectFit: fit, transform: `scale(${kb})`, filter: grade ? "contrast(1.08) saturate(0.85)" : undefined }} />
            </Sequence>
          ) : (
            <Img src={media(src)} style={{ width: "100%", height: "100%", objectFit: fit, transform: `scale(${kb})`, filter: grade ? "contrast(1.08) saturate(0.85)" : undefined }} />
          )}
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(115deg, rgba(255,255,255,0.10) 0%, transparent 35%)` }} />
        </div>
        <Hud label={label} meta={meta} />
      </div>
    </div>
  );
};

/** A frosted glass chip with an icon (svg/png) or a glyph, drifting. */
export const GlassChip: React.FC<{ at: number; x: number; y: number; text: string; icon?: string; glyph?: string; hero?: boolean; size?: number }> = ({ at, x, y, text, icon, glyph, hero = false, size = 26 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - at, fps, config: theme.spring.bouncy });
  if (frame < at) return null;
  const dx = Math.sin((frame + x) / 35) * 10;
  const dy = Math.cos((frame + y) / 42) * 8;
  return (
    <div style={{ position: "absolute", left: x, top: y, zIndex: 9, transform: `translate(${dx}px, ${dy}px) scale(${interpolate(p, [0, 1], [0.4, 1])})`, opacity: Math.min(1, p * 1.5), display: "flex", alignItems: "center", gap: 12, padding: `${size * 0.45}px ${size * 0.8}px`, borderRadius: 999, background: hero ? `${palette.primary}E6` : "rgba(20,26,30,0.62)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", border: `1.5px solid ${hero ? palette.primary : "rgba(230,240,225,0.25)"}`, boxShadow: hero ? `0 0 30px ${palette.glow}` : "0 14px 40px -12px rgba(0,0,0,0.8)", fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: size, letterSpacing: "0.04em", color: hero ? colors.ink2 : palette.text, whiteSpace: "nowrap" }}>
      {icon && <Img src={media(icon)} style={{ width: size * 1.3, height: size * 1.3, objectFit: "contain" }} />}
      {glyph && <span style={{ fontSize: size * 1.1, display: "inline-flex" }}>{richText(glyph)}</span>}
      {richText(text)}
    </div>
  );
};

/** A big number with a small caption, glass plate, for the stats beats. */
export const StatPlate: React.FC<{ at: number; x: number; y: number; value: string; caption: string; bad?: boolean; w?: number }> = ({ at, x, y, value, caption, bad = false, w = 560 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - at, fps, config: theme.spring.snappy });
  if (frame < at) return null;
  const c = bad ? colors.bad : palette.primary;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, zIndex: 9, padding: "26px 30px", borderRadius: 22, background: "rgba(16,20,24,0.66)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", border: `1.5px solid ${c}66`, boxShadow: `0 30px 80px -30px rgba(0,0,0,0.9), inset 0 0 40px ${c}14`, transform: `translateY(${interpolate(p, [0, 1], [40, 0])}px) scale(${interpolate(p, [0, 1], [0.9, 1])})`, opacity: Math.min(1, p * 1.4) }}>
      <div style={{ fontFamily: `${theme.fonts.wide}, ${theme.fonts.mono}`, fontWeight: 900, fontSize: Math.min(96, (w - 60) / (value.length * 0.82)), lineHeight: 1, whiteSpace: "nowrap", color: c, textShadow: `0 0 30px ${c}66` }}>{value}</div>
      <div style={{ marginTop: 12, fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: 22, letterSpacing: "0.08em", color: palette.text }}>{caption}</div>
    </div>
  );
};

/** Distributed computing: nodes on a sphere-ish field, packets running along the links. */
export const NodeNet: React.FC<{ at: number; w: number; h: number; n?: number }> = ({ at, w, h, n = 22 }) => {
  const frame = useCurrentFrame();
  const k = Math.max(0, frame - at);
  const pts = Array.from({ length: n }, (_, i) => {
    const a = rnd(i * 7) * Math.PI * 2 + k * 0.004 * (i % 2 ? 1 : -1);
    const r = 0.18 + rnd(i * 13) * 0.32;
    return [w / 2 + Math.cos(a) * r * w, h / 2 + Math.sin(a) * r * h * 1.1] as [number, number];
  });
  const links: [number, number][] = [];
  pts.forEach((p, i) => pts.forEach((q, j) => { if (j > i && Math.hypot(p[0] - q[0], p[1] - q[1]) < w * 0.24) links.push([i, j]); }));
  const show = interpolate(k, [0, 30], [0, 1], cl);
  return (
    <svg width={w} height={h} style={{ overflow: "visible" }}>
      {links.map(([i, j], li) => {
        const t = ((k * 0.03 + rnd(li) ) % 1);
        const [x1, y1] = pts[i], [x2, y2] = pts[j];
        return (
          <g key={li} opacity={show}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={palette.primary} strokeOpacity={0.35} strokeWidth={1.5} />
            <circle cx={x1 + (x2 - x1) * t} cy={y1 + (y2 - y1) * t} r={4} fill={palette.primary} style={{ filter: `drop-shadow(0 0 6px ${palette.glow})` }} />
          </g>
        );
      })}
      {pts.map(([x, y], i) => (
        <g key={i} opacity={interpolate(k, [i * 1.2, i * 1.2 + 8], [0, 1], cl)}>
          <rect x={x - 16} y={y - 12} width={32} height={24} rx={4} fill={colors.surfaceStrong} stroke={palette.primary} strokeWidth={2} />
          <rect x={x - 10} y={y - 6} width={20} height={3} fill={palette.primary} opacity={0.8} />
          <rect x={x - 10} y={y} width={12} height={3} fill={palette.primary} opacity={0.5} />
        </g>
      ))}
    </svg>
  );
};

/** The author's face in a round PiP (note 73), lip-synced, lime ring. */
export const FaceCircle: React.FC<{ file: string; duration: number; rate: number; from: number; x: number; y: number; d: number }> = ({ file, duration, rate, from, x, y, d }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const len = Math.round((duration / rate) * fps);
  const k = frame - from;
  if (k < 0 || k >= len + 6) return null;
  const pIn = spring({ frame: k, fps, config: theme.spring.bouncy });
  const out = interpolate(k, [len, len + 6], [1, 0], cl);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: d, height: d, zIndex: 30, borderRadius: "50%", overflow: "hidden", border: `6px solid ${palette.primary}`, boxShadow: `0 0 40px ${palette.glow}, 0 30px 60px -20px rgba(0,0,0,0.9)`, transform: `scale(${interpolate(pIn, [0, 1], [0.3, 1]) * out})` }}>
      <Sequence from={from} layout="none">
        <OffthreadVideo src={media("presenter/dev-myth/" + file)} muted playbackRate={rate} style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scale(1.45) translateY(6%)" }} />
      </Sequence>
    </div>
  );
};

/** A brand logo on a light glass plate, for logos drawn dark (JetBrains): big, crisp, never on dark. */
export const LogoPlate: React.FC<{ at: number; src: string; x: number; y: number; w: number; caption?: string }> = ({ at, src, x, y, w, caption }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - at, fps, config: theme.spring.bouncy });
  if (frame < at) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, zIndex: 9, padding: "26px 32px", borderRadius: 24, background: "rgba(242,245,238,0.96)", boxShadow: `0 30px 80px -30px rgba(0,0,0,0.9), 0 0 0 2px ${palette.primary}55`, transform: `translateY(${interpolate(p, [0, 1], [40, 0])}px) scale(${interpolate(p, [0, 1], [0.8, 1])})`, opacity: Math.min(1, p * 1.4) }}>
      <Img src={media(src)} style={{ width: "100%", display: "block" }} />
      {caption && <div style={{ marginTop: 14, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 22, letterSpacing: "0.1em", color: colors.ink }}>{caption}</div>}
    </div>
  );
};
