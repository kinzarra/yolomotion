// Beat 4. Two friends laughing on a card; on the glass plate your wave runs
// and САРКАЗМ, ВЗДОХ, СМЕШОК pop onto it as they are said. On «перебивает»
// Dessa's wave cuts in over yours.
import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../../theme";
import { useIn, usePunch } from "../../../reel";
import { ddColors as colors, ddPalette as palette } from "../palette";
import { CUES } from "../timeline";
import { bump, clamp, ClipCard, Duplex, either, Flash, Glass, Kicker, PosterShell, Serif, upTo, Wide, WIDE, X0, X1 } from "../ui";

const C = CUES.feels;
const TAGS = [
  { word: "САРКАЗМ", at: C.sarcasm, x: 0 },
  { word: "ВЗДОХ", at: C.sigh, x: 0.36 },
  { word: "СМЕШОК", at: C.laugh, x: 0.7 },
] as const;

const Tag: React.FC<{ word: string; at: number; x: number; w: number }> = ({ word, at, x, w }) => {
  const q = useIn(at, "bouncy");
  return (
    <div style={{ position: "absolute", left: x * w, top: -8, opacity: q, transform: `translateY(${interpolate(q, [0, 1], [40, 0])}px) scale(${interpolate(q, [0, 1], [0.5, 1])})`, transformOrigin: "0% 100%" }}>
      <div style={{ padding: "10px 18px", borderRadius: 14, background: palette.primary, color: colors.ink, fontFamily: WIDE, fontWeight: 900, fontSize: 30, letterSpacing: "-0.01em", boxShadow: `0 0 30px ${palette.glow}` }}>{word}</div>
      <div style={{ width: 2, height: 40, marginLeft: 22, background: palette.primary }} />
    </div>
  );
};

export const FeelsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = (s: number) => Math.round(s * fps);
  const hit = usePunch(f(C.cut), 16);
  const w = X1 - X0 - 80;
  const youRun = interpolate(frame, [0, f(C.cut)], [0.05, 0.62], { easing: theme.ease.inOut, ...clamp });
  const aiRun = interpolate(frame, [f(C.cut), f(C.cut) + 24], [0.5, 1], { easing: theme.ease.out, ...clamp });
  const cutOn = interpolate(frame, [f(C.cut), f(C.cut) + 6], [0, 1], clamp);
  const you = upTo(either(bump(0.02, 0.22), bump(0.26, 0.44), bump(0.48, 0.66)), youRun);
  const ai = frame >= f(C.cut) ? upTo(bump(0.5, 0.98), aiRun) : () => 0.04;

  return (
    <PosterShell shake={hit.shake} glowY={1350}>
      <Kicker left="СЛЫШИТ НЕ СЛОВА, А ТЕБЯ" at={2} />
      <div style={{ position: "absolute", left: X0, top: 160, zIndex: 6 }}>
        <Wide size={88} at={0}>СЛЫШИТ</Wide>
        <Serif size={170} at={5} style={{ marginTop: -4 }}>эмоции</Serif>
      </div>

      <ClipCard src="media/dessa-duplex/laughing.mp4" x={X0 + 60} y={470} w={X1 - X0 - 60} h={560} at={3} rot={2} tag="ЖИВАЯ РЕЧЬ" tagTone="good" grade="grayscale(0.2) contrast(1.1) brightness(0.9)" />

      <Glass x={X0 - 10} y={1090} w={X1 - X0 + 20} h={470} at={8}>
        <div style={{ position: "absolute", left: 40, top: 150 }}>
          {TAGS.map((t) => (
            <Tag key={t.word} word={t.word} at={f(t.at)} x={t.x} w={w} />
          ))}
        </div>
        <div style={{ position: "absolute", left: 40, top: 230 }}>
          <Duplex w={w} you={you} ai={ai} mark={{ a: 0.5, b: 0.66, label: "ПЕРЕБИЛА ПО ДЕЛУ", tone: "good", on: cutOn }} />
        </div>
      </Glass>
      <Flash amount={hit.energy} />
    </PosterShell>
  );
};
