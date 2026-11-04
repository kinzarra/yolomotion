// Beat 2, the turn. Every other voice AI is a chain ЗВУК › ТЕКСТ › ИИ › ГОЛОС.
// On «Ни одной буквы» the ТЕКСТ link is knocked out and the giant 0 lands,
// with Dorsey in lime halftone inside its counter.
import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../../theme";
import { useIn, usePunch } from "../../../reel";
import { ddColors as colors, ddPalette as palette } from "../palette";
import { CUES } from "../timeline";
import { clamp, ClipCard, Cross, Flash, Halftone, IMG, Kicker, Mono, PosterShell, Shockwave, WIDE, X0, X1 } from "../ui";

const C = CUES.noText;
const LINKS = ["ЗВУК", "ТЕКСТ", "ИИ", "ГОЛОС"] as const;
const ROW = 104;

export const NoTextScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = (s: number) => Math.round(s * fps);
  const knock = interpolate(frame, [f(C.knock), f(C.knock) + 12], [0, 1], { easing: theme.ease.in, ...clamp });
  const close = interpolate(frame, [f(C.knock) + 6, f(C.knock) + 18], [0, 1], { easing: theme.ease.inOut, ...clamp });
  const zero = useIn(f(C.zero), "bouncy");
  const hit = usePunch(f(C.zero), 18);
  const struck = interpolate(frame, [f(C.knock) - 8, f(C.knock)], [0, 1], { easing: theme.ease.out, ...clamp });
  const k = frame / fps;
  // keeps moving after the hit: no static hold
  const after = interpolate(frame, [f(C.zero), f(C.zero) + 50], [0, 1], { easing: theme.ease.out, ...clamp });

  return (
    <PosterShell shake={hit.shake} glowY={1200}>
      <Kicker left="КАК УСТРОЕНЫ ОБЫЧНЫЕ ГОЛОСОВЫЕ ИИ" at={-4} />

      {/* the chain */}
      <div style={{ position: "absolute", left: X0, top: 190, width: 860 }}>
        {LINKS.map((l, i) => {
          const q = useInSafe(-6 + i * 3);
          const isText = i === 1;
          const y = i * ROW - (i > 1 ? close * ROW : 0);
          const fly = isText ? knock : 0;
          return (
            <div
              key={l}
              style={{
                position: "absolute",
                left: 0,
                top: y,
                display: "flex",
                alignItems: "center",
                gap: 22,
                opacity: q * (1 - fly) * (1 - after * 0.55),
                transform: `translateX(${interpolate(q, [0, 1], [-60, 0]) + fly * 700}px) rotate(${fly * 24}deg) scale(${interpolate(q, [0, 1], [0.9, 1])})`,
              }}
            >
              <Mono size={24} color={palette.textDim}>{`0${i + 1}`}</Mono>
              <div style={{ position: "relative", padding: "14px 30px", borderRadius: 999, border: `2px solid ${isText && struck > 0 ? colors.bad : colors.lineStrong}`, background: isText && struck > 0 ? `${colors.bad}22` : "rgba(255,255,255,0.05)", fontFamily: WIDE, fontWeight: 900, fontSize: 56, letterSpacing: "-0.03em", color: isText && struck > 0 ? colors.bad : palette.text }}>
                {l}
                {isText && struck > 0 && <div style={{ position: "absolute", left: 18, right: 18, top: "50%", height: 6, background: colors.bad, transform: `scaleX(${struck})`, transformOrigin: "0% 50%" }} />}
              </div>
            </div>
          );
        })}
      </div>

      {/* the turn: 0 with Dorsey inside, pushing in after it lands */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 470, height: 600, opacity: zero, transform: `scale(${interpolate(zero, [0, 1], [1.6, 1]) + hit.pop * 0.05 + after * 0.07}) rotate(${interpolate(zero, [0, 1], [-25, 0])}deg)` }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, textAlign: "center", fontFamily: WIDE, fontWeight: 900, fontSize: 700, lineHeight: 0.8, letterSpacing: "-0.04em", color: "transparent", WebkitTextStroke: `5px ${palette.primary}`, filter: `drop-shadow(0 0 30px ${palette.glow})` }}>0</div>
        <div style={{ position: "absolute", left: 315, top: 94, mixBlendMode: "screen", WebkitMaskImage: "radial-gradient(ellipse 50% 50% at 50% 45%, #000 60%, transparent 100%)", maskImage: "radial-gradient(ellipse 50% 50% at 50% 45%, #000 60%, transparent 100%)", transform: `scale(${1.02 + k * 0.03})` }}>
          <Halftone src={IMG.dorsey.src} width={450} height={450 * IMG.dorsey.ratio} pitch={interpolate(after, [0, 1], [11, 7])} />
        </div>
      </div>
      <div style={{ position: "absolute", left: X0, top: 1020, opacity: zero, transform: `translateX(${(1 - zero) * -80}px)` }}>
        <div style={{ fontFamily: WIDE, fontWeight: 900, fontSize: 54, letterSpacing: "-0.03em", color: palette.text, lineHeight: 1 }}>
          БУКВ ТЕКСТА <br /><span style={{ color: palette.primary }}>В ОБУЧЕНИИ</span>
        </div>
      </div>

      {/* what it learned from instead: people talking */}
      <ClipCard src="media/dessa-duplex/talk.mp4" x={X0} y={1170} w={X1 - X0} h={390} at={6} rot={-1.5} tag="ТОЛЬКО ЖИВАЯ РЕЧЬ" tagTone="good" grade="grayscale(0.15) contrast(1.1) brightness(0.9)" z={7} />
      <div style={{ position: "absolute", left: X0, right: 110, top: 1572, display: "flex", justifyContent: "space-between", opacity: zero, zIndex: 8 }}>
        <Mono size={18}>ДЖЕК ДОРСИ, BLOCK</Mono>
        <Mono size={16} color={colors.lineStrong}>фото: Steve Jurvetson, CC BY 2.0</Mono>
      </div>

      {frame >= f(C.knock) && frame < f(C.knock) + 14 && (
        <div style={{ position: "absolute", left: X0 + 420, top: 190 + ROW + 20 }}>
          <Cross delay={f(C.knock)} size={90} />
        </div>
      )}
      <Shockwave at={f(C.zero)} size={900} />
      <Flash amount={hit.energy} />
    </PosterShell>
  );
};

/** useIn inside a map: same hook count every frame, so it is safe. */
const useInSafe = (d: number) => useIn(d, "snappy");
