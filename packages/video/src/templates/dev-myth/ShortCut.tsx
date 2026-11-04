// Shorts cut from the finished long video (author 2026-11-01: «давай нарезку
// Shorts»). A 9:16 frame around a 16:9 window: the same clip blurred behind,
// a hook title above that is complete on frame 0, big karaoke captions below
// (the long cut's own captions are cropped off the window), and for the last
// 2.5 s a plaque that sends the viewer to the full video.
import React from "react";
import { AbsoluteFill, OffthreadVideo, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { theme } from "../../theme";
import { Captions } from "../../reel/Captions";
import { defineTemplate } from "../types";
import { devMythColors as colors, devMythPalette as palette } from "./palette";
import { VOICEOVER, VO_RATE } from "./timeline";

const WIDE = `${theme.fonts.wide}, ${theme.fonts.mono}`;

export const SEGMENTS = {
  vs: { from: 0, to: 16.95, title: ["ПРОГРАММИСТ", "ИЛИ ИИ ЗА 100 $?"], hero: 1 },
  button: { from: 33.25, to: 48.85, title: ["ОДНА КНОПКА.", "ДВЕ НЕДЕЛИ."], hero: 1 },
  hard: { from: 88.48, to: 108.45, title: ["ПРОГРАММИРОВАТЬ", "ЭТО СЛОЖНО?"], hero: 1 },
  ten: { from: 334.55, to: 370.7, title: ["БЫЛО 10 ПРОГРАММИСТОВ.", "СТАЛО 3"], hero: 1 },
  end: { from: 386.3, to: 411.75, title: ["КОД ПИСАТЬ", "БОЛЬШЕ НЕ НУЖНО?"], hero: 1, plaqueTop: true },
} as const;
type Seg = keyof typeof SEGMENTS;

export const shortSchema = z.object({ seg: z.enum(["vs", "button", "hard", "ten", "end"]) });
type Props = z.infer<typeof shortSchema>;

const WIN = { y: 600, h: 594 }; // the 16:9 frame at 1080 wide is 608 tall; the bottom caption band is cropped off

export const ShortCut: React.FC<Props> = ({ seg }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const s = SEGMENTS[seg];
  const top = "plaqueTop" in s; // captions run to the end here, so the plaque takes the title's place
  const src = staticFile(`media/dev-myth/short-${seg}.mp4`);
  const lines = VOICEOVER.filter((l) => l.start >= s.from - 0.05 && l.start < s.to - 0.2).map((l) => ({ ...l, start: l.start - s.from }));
  const endAt = durationInFrames - Math.round(2.6 * fps);
  const endP = spring({ frame: frame - endAt, fps, config: theme.spring.bouncy });
  const pulse = 1 + Math.sin(frame / 5) * 0.015;
  return (
    <AbsoluteFill style={{ background: palette.bg }}>
      {/* the same clip, blurred, behind everything */}
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <OffthreadVideo src={src} muted style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(38px) brightness(0.35) saturate(0.8)", transform: "scale(1.25)" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: `linear-gradient(180deg, ${palette.bg}EE 0%, ${palette.bg}55 30%, ${palette.bg}55 65%, ${palette.bg}F2 100%)` }} />

      {/* the hook, complete on frame 0 */}
      <div style={{ position: "absolute", left: 60, right: 60, top: 230, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 12, transform: `scale(${pulse})`, transformOrigin: "left center", opacity: top && frame >= endAt ? Math.max(0, 1 - endP * 2) : 1 }}>
        <div style={{ display: "inline-block", padding: "8px 16px", background: colors.paper, color: colors.ink, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 28, letterSpacing: "0.12em", transform: "rotate(-1.5deg)" }}>20 ЛЕТ В IT · ДЕНЬГИ ПРОСТО</div>
        {s.title.map((t, i) => (
          <div key={t} style={{ fontFamily: WIDE, fontWeight: 900, fontSize: Math.min(84, Math.floor(900 / (t.length * 0.9))), lineHeight: 1.0, letterSpacing: "-0.02em", color: i === s.hero ? colors.ink2 : palette.text, background: i === s.hero ? palette.primary : undefined, padding: i === s.hero ? "4px 16px" : undefined, transform: i === s.hero ? "rotate(-2deg)" : undefined, textShadow: i === s.hero ? undefined : `0 6px 30px ${palette.bg}` }}>{t}</div>
        ))}
      </div>

      {/* the window */}
      <div style={{ position: "absolute", left: 0, top: WIN.y, width: 1080, height: WIN.h, overflow: "hidden", borderTop: `4px solid ${palette.primary}`, borderBottom: `4px solid ${palette.primary}`, boxShadow: `0 0 60px ${palette.glow}` }}>
        <OffthreadVideo src={src} style={{ width: 1210, height: 681, display: "block", marginLeft: -65 }} />
      </div>

      {/* big captions under the window */}
      <Captions voiceover={lines as typeof VOICEOVER} rate={VO_RATE} palette={palette} top={1300} fontSize={58} maxWidth={960} sideMargin={60} mode="box" uppercase boxTilt={2} fontFamily={WIDE} fontWeight={900} activeColor={palette.primary} activeInk={colors.ink2} heroColor={palette.primary} badColor={colors.bad} textShadow={`0 4px 22px ${palette.bg}`} stroke={`8px ${palette.bg}`} />

      {/* the way to the full video */}
      {frame >= endAt && (
        <div style={{ position: "absolute", left: 60, right: 60, top: top ? 200 : 1480, zIndex: 9, padding: "28px 34px", borderRadius: 28, background: "rgba(16,20,24,0.88)", border: `3px solid ${palette.primary}`, boxShadow: `0 0 50px ${palette.glow}`, transform: `scale(${interpolate(endP, [0, 1], [0.6, 1])})`, opacity: Math.min(1, endP * 1.4) }}>
          <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 28, letterSpacing: "0.12em", color: palette.textDim }}>ПОЛНЫЙ РАЗБОР · 7 МИНУТ</div>
          <div style={{ marginTop: 10, fontFamily: WIDE, fontWeight: 900, fontSize: 52, lineHeight: 1.05, color: palette.text }}>КАК НАС <span style={{ color: colors.bad }}>ОБМАНЫВАЛИ</span></div>
          <div style={{ marginTop: 14, display: "inline-block", padding: "10px 18px", background: palette.primary, color: colors.ink2, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 28 }}>ССЫЛКА НИЖЕ · НА КАНАЛЕ</div>
        </div>
      )}
    </AbsoluteFill>
  );
};

/** One composition per Short, so the render queue takes them by id: dev-myth-short-<seg>-reel. */
export const devMythShorts = (Object.keys(SEGMENTS) as Seg[]).map((seg) =>
  defineTemplate({
    id: `dev-myth-short-${seg}`,
    name: `Как разработчики обманывали нас · Short ${seg}`,
    description: "A Short cut from the long dev-myth video, framed 9:16 with a hook title, big captions and a pointer to the full video.",
    schema: shortSchema,
    defaultProps: { seg },
    durationInSeconds: Math.round((SEGMENTS[seg].to - SEGMENTS[seg].from) * 30) / 30,
    formats: ["reel"],
    component: ShortCut,
  }),
);
