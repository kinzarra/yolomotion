// Beat 3. Someone waits on the line while a bank bot waits for silence; a red
// pause counter runs to 2,0 с. On «Этот отвечает сразу» it collapses to a lime 0.
import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../../theme";
import { useIn, usePunch } from "../../../reel";
import { ddColors as colors, ddPalette as palette } from "../palette";
import { CUES } from "../timeline";
import { clamp, ClipCard, FatSticker, Flash, Glass, IMG, Kicker, Mono, PosterShell, Serif, Shockwave, WIDE, X0, X1 } from "../ui";

const C = CUES.noPause;

export const NoPauseScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = (s: number) => Math.round(s * fps);
  const now = frame >= f(C.now);
  const hit = usePunch(f(C.now), 18);
  const twoHit = usePunch(f(C.two), 14);
  // the pause counter: 0,0 → 2,0 с by the time «2 секунды» is said, holds, then snaps to 0
  const run = interpolate(frame, [f(C.wait), f(C.two)], [0, 2], { easing: theme.ease.inOut, ...clamp });
  const value = now ? 0 : run;
  const numIn = useIn(4, "snappy");
  const zeroIn = useIn(f(C.now), "bouncy");
  const dots = Math.floor(frame / 8) % 4;
  const col = now ? palette.primary : colors.bad;
  const label = now ? "DESSA" : "БОТ В БАНКЕ";
  const memeOut = interpolate(frame, [f(C.now), f(C.now) + 8], [0, 1], { easing: theme.ease.in, ...clamp });

  return (
    <PosterShell shake={hit.shake + twoHit.shake * 0.5} glowY={1300}>
      <Kicker left="ПАУЗА ДО ОТВЕТА" right={label} at={2} />

      <ClipCard src="media/dessa-duplex/phone-wait.mp4" x={X0} y={180} w={X1 - X0} h={760} at={0} rot={-1.5} tag={now ? "ОТВЕТИЛ" : "ЖДЁТ ТИШИНЫ"} tagTone={now ? "good" : "bad"} grade={now ? "grayscale(0.1) contrast(1.1) brightness(0.95)" : "grayscale(0.6) contrast(1.15) brightness(0.8)"} />

      {/* bot bubble with typing dots, in the card */}
      <div style={{ position: "absolute", left: X0 + 40, top: 800, zIndex: 6 }}>
        {!now ? (
          <div style={{ display: "inline-flex", gap: 12, padding: "22px 30px", borderRadius: "30px 30px 30px 8px", background: "rgba(255,255,255,0.12)", backdropFilter: "blur(14px)", border: "1.5px solid rgba(255,255,255,0.2)" }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ width: 18, height: 18, borderRadius: 9, background: palette.text, opacity: dots > i ? 1 : 0.25 }} />
            ))}
          </div>
        ) : (
          <div style={{ display: "inline-block", padding: "20px 30px", borderRadius: "30px 30px 30px 8px", background: palette.primary, color: colors.ink, fontFamily: WIDE, fontWeight: 900, fontSize: 44, letterSpacing: "-0.02em", opacity: zeroIn, transform: `scale(${interpolate(zeroIn, [0, 1], [0.6, 1])})`, transformOrigin: "0% 100%", boxShadow: `0 0 50px ${palette.glow}` }}>
            Да, слушаю.
          </div>
        )}
      </div>

      {/* the counter */}
      <Glass x={X0 - 10} y={1010} w={X1 - X0 + 20} h={560} at={6}>
        <div style={{ position: "absolute", left: 44, top: 36 }}>
          <Mono size={22} color={palette.text}>{now ? "ОТВЕЧАЕТ СРАЗУ" : "ЖДЁТ, ПОКА ТЫ ЗАМОЛЧИШЬ"}</Mono>
        </div>
        <div style={{ position: "absolute", left: 40, top: 100, display: "flex", alignItems: "baseline", gap: 18, opacity: numIn, transform: `scale(${(now ? interpolate(zeroIn, [0, 1], [1.4, 1]) : 1) + twoHit.pop * 0.06})`, transformOrigin: "0% 100%" }}>
          <span style={{ fontFamily: WIDE, fontWeight: 900, fontSize: 330, lineHeight: 0.9, letterSpacing: "-0.05em", color: col, textShadow: `0 0 80px ${now ? palette.glow : colors.badGlow}` }}>
            {now ? "0" : value.toFixed(1).replace(".", ",")}
          </span>
          <Serif size={150} style={{ color: col, textShadow: "none" }}>сек</Serif>
        </div>
        {/* the pause bar */}
        <div style={{ position: "absolute", left: 44, right: 44, bottom: 50, height: 14, borderRadius: 7, background: "rgba(255,255,255,0.08)" }}>
          <div style={{ width: `${(value / 2) * 100}%`, height: "100%", borderRadius: 7, background: col, boxShadow: `0 0 20px ${now ? palette.glow : colors.badGlow}` }} />
        </div>
      </Glass>

      {/* the patient-kid meme: you, waiting for the bot */}
      <div style={{ position: "absolute", left: 620, top: 740, zIndex: 9 }}>
        <FatSticker src={IMG.meme.src} w={360} at={f(C.two) - 4} rot={7} out={memeOut} />
      </div>
      <Shockwave at={f(C.now)} size={1100} />
      <Flash amount={hit.energy} />
    </PosterShell>
  );
};
