// Beat 6. «Пока это демо» on glass, then the face re-forms from lime dots:
// «Подпишись, скажу, когда выйдет», with the question and subscribe row. The
// last half second dissolves the face back into the тёща of frame 0 (loop).
import React from "react";
import { Img, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../../theme";
import { useIn, usePunch } from "../../../reel";
import { ddColors as colors, ddPalette as palette } from "../palette";
import { PRESENTER } from "../presenter";
import { CUES, VO_RATE } from "../timeline";
import { bump, clamp, CtaRow, Duplex, Face, FACE_FILL, Flash, Glass, Halftone, IMG, Kicker, media, Mono, PosterShell, Serif, Wide, X0, X1 } from "../ui";

const C = CUES.cta;
const OUTLINE = (w: number, col: string) => [`${w}px 0 0 ${col}`, `-${w}px 0 0 ${col}`, `0 ${w}px 0 ${col}`, `0 -${w}px 0 ${col}`].map((s) => `drop-shadow(${s})`).join(" ");

export const CtaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = (s: number) => Math.round(s * fps);
  const e = (a: number, b: number, ease = theme.ease.inOut) => interpolate(frame, [f(a), f(b)], [0, 1], { easing: ease, ...clamp });
  const dotsIn = e(C.face - 0.45, C.face - 0.1);
  const resolve = e(C.face, C.face + 0.3, theme.ease.out);
  const back = e(C.loop, C.loop + 0.35);
  const settle = e(C.loop + 0.3, C.loop + 0.65, theme.ease.out);
  const faceHit = usePunch(f(C.face), 16);
  const q = useIn(f(C.face) + 4, "snappy");
  const demoOut = e(C.face - 0.5, C.face - 0.2, theme.ease.in);
  const pitch = interpolate(resolve, [0, 1], [12, 6]);
  const loopPitch = interpolate(back, [0, 1], [6, 14]);

  return (
    <PosterShell exit={false} glowY={900}>
      {/* «Пока это демо» */}
      <div style={{ position: "absolute", inset: 0, opacity: 1 - demoOut, transform: `scale(${1 + demoOut * 0.06})` }}>
        <Kicker left="BLOCK · DESSA" right="ИССЛЕДОВАТЕЛЬСКОЕ ДЕМО" at={-30} />
        <div style={{ position: "absolute", left: X0, top: 380 }}>
          <Wide size={150} at={0}>ПОКА</Wide>
          <Serif size={300} at={4} style={{ marginTop: -10 }}>демо</Serif>
        </div>
        <Glass x={X0 - 10} y={1060} w={X1 - X0 + 20} h={360} at={6}>
          <div style={{ position: "absolute", left: 40, top: 32 }}>
            <Mono size={22} color={palette.text}>API НЕТ · ЛИСТ ОЖИДАНИЯ</Mono>
          </div>
          <div style={{ position: "absolute", left: 40, top: 110 }}>
            <Duplex w={X1 - X0 - 80} you={bump(0.04, 0.4)} ai={bump(0.32, 0.9)} height={200} />
          </div>
        </Glass>
      </div>

      {/* the face */}
      {dotsIn > 0 && (
        <div style={{ position: "absolute", inset: 0, opacity: resolve * (1 - back), transform: `scale(${1 + faceHit.pop * 0.03})` }}>
          <Face shot="cta" at={f(C.face)} len={Math.round((PRESENTER.cta.duration / VO_RATE) * fps)} rate={VO_RATE} />
        </div>
      )}
      {dotsIn > 0 && (resolve < 1 || back > 0) && settle < 1 && (
        <div style={{ position: "absolute", inset: 0, mixBlendMode: "screen", opacity: back > 0 ? 1 - settle : dotsIn * (1 - resolve) }}>
          <div style={{ position: "absolute", inset: 0, opacity: 1 - back * 0.9 }}>
            <Halftone src={back > 0 ? "presenter/dessa-duplex/cta-last.jpg" : "presenter/dessa-duplex/cta-first.jpg"} width={1080} height={1920} pitch={back > 0 ? loopPitch : pitch} imgStyle={FACE_FILL} lift={1.25} />
          </div>
          {back > 0 && (
            <div style={{ position: "absolute", left: 400, top: 590, opacity: back }}>
              <Halftone src={IMG.tescha.src} width={660} height={660 * IMG.tescha.ratio} pitch={loopPitch} lift={1.3} />
            </div>
          )}
        </div>
      )}

      {/* question + subscribe over the face */}
      {frame >= f(C.face) && back < 1 && (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - back }}>
          <div style={{ position: "absolute", left: X0, top: 1140, opacity: q, transform: `translateY(${interpolate(q, [0, 1], [-40, 0])}px)` }}>
            <Wide size={70}>ЧТО ТЫ СКАЖЕШЬ</Wide>
            <Serif size={150} style={{ marginTop: 2 }}>ему первым?</Serif>
          </div>
          <div style={{ position: "absolute", left: X0, top: 1430 }}>
            <CtaRow at={f(C.face) + 6} />
          </div>
          <div style={{ position: "absolute", left: X0, top: 1555 }}>
            <Mono size={20} color={palette.text}>ПИШИ В КОММЕНТАХ</Mono>
          </div>
        </div>
      )}

      {/* loop: the тёща of frame 0 comes back */}
      {settle > 0 && (
        <div style={{ position: "absolute", inset: 0, opacity: settle }}>
          <div style={{ position: "absolute", left: 400, top: 590, width: 660, transform: "rotate(3deg)" }}>
            <Img src={media(IMG.tescha.src)} style={{ width: "100%", display: "block", filter: `${OUTLINE(7, colors.white)} drop-shadow(0 30px 40px rgba(0,0,0,0.7)) saturate(1.15)` }} />
          </div>
          <div style={{ position: "absolute", left: X0, top: 168 }}>
            <Wide size={96}>ПЕРЕБИВАЕТ</Wide>
            <Serif size={230} style={{ margin: "-6px 0 4px -8px" }}>как тёща</Serif>
          </div>
        </div>
      )}
      <Flash amount={faceHit.energy} />
    </PosterShell>
  );
};
