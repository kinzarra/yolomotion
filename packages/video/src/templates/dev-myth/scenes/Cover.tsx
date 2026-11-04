// Frame 0 is the cover (author 2026-11-01: «старт ультра крутым, чтобы человек
// сказал вау, дай посмотрю»). The whole promise in one frame: a person at
// 254 000 ₽ a month against a machine at 100 $ a month, VS in the middle,
// already complete on frame 0, breathing, then torn away by a glitch into the
// first receipt.
import React from "react";
import { Img, OffthreadVideo, interpolate, useCurrentFrame } from "remotion";
import { theme } from "../../../theme";
import { devMythColors as colors, devMythPalette as palette } from "../palette";
import { Glitch, WIDE, cl, media } from "../ui";

export const COVER_END = 26; // frames: ~0.87 s, under «Вот сколько…»

export const Cover: React.FC<{ salary: number; price: number }> = ({ salary, price }) => {
  const frame = useCurrentFrame();
  if (frame >= COVER_END + 8) return null;
  const out = interpolate(frame, [COVER_END - 4, COVER_END + 8], [0, 1], { easing: theme.ease.in, ...cl });
  const tear = interpolate(frame, [COVER_END - 6, COVER_END, COVER_END + 8], [0, 1, 1.4], cl);
  const breathe = 1 + Math.sin(frame / 6) * 0.012;
  const fmt = (n: number) => n.toLocaleString("ru-RU").replace(/\s/g, " ");
  const half = (side: "l" | "r") => {
    const l = side === "l";
    const c = l ? colors.bad : palette.primary;
    return (
      <div style={{ position: "absolute", top: 0, bottom: 0, left: l ? 0 : 960, width: 960, overflow: "hidden", clipPath: l ? "polygon(0 0, 100% 0, 88% 100%, 0 100%)" : "polygon(12% 0, 100% 0, 100% 100%, 0 100%)" }}>
        <OffthreadVideo src={media(l ? "media/dev-myth/v-office.mp4" : "media/dev-myth/v-network.mp4")} muted style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(1) contrast(1.2) brightness(0.45)", transform: `scale(${1.1 * breathe})` }} />
        <div style={{ position: "absolute", inset: 0, background: c, mixBlendMode: "multiply", opacity: 0.55 }} />
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at ${l ? "35%" : "65%"} 60%, transparent 0%, ${palette.bg}DD 75%)` }} />
        {l ? (
          <Img src={media("images/dev-myth/fig-dev.png")} style={{ position: "absolute", left: 60, bottom: -40, height: 640, filter: `brightness(1.5) drop-shadow(8px 0 0 #fff) drop-shadow(-8px 0 0 #fff) drop-shadow(0 8px 0 #fff) drop-shadow(0 -8px 0 #fff) drop-shadow(0 40px 60px rgba(0,0,0,0.8))`, transform: `scale(${breathe})`, transformOrigin: "bottom center" }} />
        ) : (
          <div style={{ position: "absolute", right: 120, bottom: 140, width: 380, height: 380, borderRadius: 60, background: "rgba(16,20,24,0.7)", border: `4px solid ${palette.primary}`, boxShadow: `0 0 80px ${palette.glow}`, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${breathe}) rotate(${Math.sin(frame / 9) * 2}deg)` }}>
            <Img src={media("images/dev-myth/logos/claude.svg")} style={{ width: 240, height: 240 }} />
          </div>
        )}
        <div style={{ position: "absolute", top: 190, [l ? "right" : "left"]: l ? 190 : 170, textAlign: l ? "right" : "left" } as React.CSSProperties}>
          <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 30, letterSpacing: "0.16em", color: palette.text }}>{l ? "ЧЕЛОВЕК" : "МАШИНА"}</div>
          <div style={{ fontFamily: WIDE, fontWeight: 900, fontSize: l ? 104 : 150, lineHeight: 1, color: c, textShadow: `0 0 50px ${c}88, 0 8px 30px ${palette.bg}`, whiteSpace: "nowrap" }}>{l ? `${fmt(salary)} ₽` : `${price} $`}</div>
          <div style={{ marginTop: 10, display: "inline-block", padding: "8px 16px", background: c, color: colors.ink2, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 26, letterSpacing: "0.1em" }}>В МЕСЯЦ</div>
        </div>
      </div>
    );
  };
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 40, opacity: 1 - out, background: palette.bg }}>
      <Glitch amount={tear} style={{ position: "absolute", inset: 0 }}>
        <div style={{ position: "absolute", inset: 0 }}>
          {half("l")}
          {half("r")}
          {/* the seam and VS */}
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
            <line x1={1075} y1={0} x2={845} y2={1080} stroke={palette.text} strokeWidth={10} />
          </svg>
          <div style={{ position: "absolute", left: 960 - 95, top: 540 - 95, width: 190, height: 190, borderRadius: 95, background: palette.bg, border: `6px solid ${palette.text}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: WIDE, fontWeight: 900, fontSize: 72, color: palette.text, transform: `scale(${1 + Math.sin(frame / 4) * 0.04})`, boxShadow: `0 0 60px ${palette.bg}` }}>VS</div>
          {/* the headline */}
          <div style={{ position: "absolute", left: 0, right: 0, top: 50, display: "flex", justifyContent: "center" }}>
            <div style={{ padding: "14px 36px", background: palette.bg, border: `3px solid ${colors.bad}`, boxShadow: `0 0 40px ${colors.badGlow}`, fontFamily: WIDE, fontWeight: 900, fontSize: 64, color: palette.text, letterSpacing: "-0.01em", transform: "rotate(-1.5deg)" }}>
              КАК НАС <span style={{ color: colors.bad }}>ОБМАНЫВАЛИ</span>
            </div>
          </div>
        </div>
      </Glitch>
    </div>
  );
};
