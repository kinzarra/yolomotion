// Beat 1. Frame 0 is the whole claim: «ПЕРЕБИВАЕТ как тёща», your bubble cut
// mid-word by Dessa's. Then the тёща leaves her poster, turns into lime
// halftone, and the dots re-form as the author's face: «Только по делу».
import React from "react";
import { Img, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../../theme";
import { usePunch } from "../../../reel";
import { ddColors as colors, ddPalette as palette } from "../palette";
import { PRESENTER } from "../presenter";
import { CUES, VO_RATE } from "../timeline";
import { Bubble, bump, clamp, CutCursor, Duplex, Face, FACE_FILL, Flash, Glass, Halftone, IMG, Kicker, media, PosterShell, Serif, Wide, X0, X1 } from "../ui";

const C = CUES.hook;
const OUTLINE = (w: number, col: string) => [`${w}px 0 0 ${col}`, `-${w}px 0 0 ${col}`, `0 ${w}px 0 ${col}`, `0 -${w}px 0 ${col}`].map((s) => `drop-shadow(${s})`).join(" ");

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const f = (s: number) => Math.round(s * fps);
  const e = (a: number, b: number, ease = theme.ease.inOut) => interpolate(frame, [f(a), f(b)], [0, 1], { easing: ease, ...clamp });

  const cut = usePunch(f(C.cut), 14);
  // poster leaves, тёща travels to the face position
  const leave = e(C.morph, C.morph + 0.35, theme.ease.in);
  const travel = e(C.morph, C.morph + 0.5);
  const toDots = e(C.morph + 0.15, C.morph + 0.5);
  const toFace = e(C.morph + 0.45, C.face - 0.05);
  const resolve = e(C.face, C.face + 0.35, theme.ease.out);
  const pitch = interpolate(toFace, [0, 1], [16, 7]) * interpolate(resolve, [0, 1], [1, 0.6]);
  const faceIn = usePunch(f(C.face), 18);
  const wordA = e(C.face + 0.02, C.face + 0.22, theme.ease.out);
  const wordB = e(C.deloo, C.deloo + 0.2, theme.ease.out);

  // тёща sticker: right of the bubbles at frame 0 → centred and big over the face
  const sx = interpolate(travel, [0, 1], [400, 180]);
  const sy = interpolate(travel, [0, 1], [590, 260]);
  const sw = interpolate(travel, [0, 1], [660, 760]);
  const breathe = Math.sin(t * 2.2) * 6;
  const dessaGate = (x: number) => (x < 0.44 + Math.min(1, t / 1.2) * 0.52 ? bump(0.44, 0.96)(x) : 0.04);

  return (
    <PosterShell shake={cut.shake}>
      {/* ---------- frame-0 poster ---------- */}
      <div style={{ position: "absolute", inset: 0, opacity: 1 - leave, transform: `scale(${1 + leave * 0.08})`, filter: leave > 0 ? `blur(${leave * 14}px)` : undefined }}>
        <Kicker left="BLOCK · DESSA" right="23.10.2026" at={-30} />
        <div style={{ position: "absolute", left: X0, top: 168, zIndex: 6 }}>
          <Wide size={96}>ПЕРЕБИВАЕТ</Wide>
          <Serif size={230} style={{ margin: "-6px 0 4px -8px" }}>как тёща</Serif>
          <Wide size={74}>ТОЛЬКО ПО ДЕЛУ</Wide>
        </div>
        <div style={{ position: "absolute", left: X0, top: 640, zIndex: 6, transform: `rotate(-3deg) translateX(${-cut.energy * 30}px)` }}>
          <Bubble who="you">
            Я тут подумал,
            <br />
            может ипоте
            <CutCursor />
          </Bubble>
        </div>
        <div style={{ position: "absolute", left: X0 + 20, top: 880, zIndex: 7, transform: "rotate(2deg)" }}>
          <Bubble who="ai" size={60} punch={cut.pop}>
            Поняла.
            <br />
            Не бери.
          </Bubble>
        </div>
        <Glass x={X0 - 10} y={1230} w={X1 - X0 + 20} h={340} z={8}>
          <div style={{ position: "absolute", left: 40, top: 30, fontFamily: theme.fonts.mono, fontSize: 22, letterSpacing: "0.14em", color: palette.text }}>СЛУШАЕТ И ГОВОРИТ ОДНОВРЕМЕННО</div>
          <div style={{ position: "absolute", left: 40, top: 100 }}>
            <Duplex w={X1 - X0 - 80} you={(x) => (x < 0.5 ? Math.max(bump(0.02, 0.24)(x), bump(0.28, 0.62)(x)) : 0.04)} ai={dessaGate} mark={{ a: 0.44, b: 0.62, label: "ПЕРЕБИЛА", tone: "bad" }} />
          </div>
        </Glass>
      </div>

      {/* ---------- the face, under the dots ---------- */}
      {toFace > 0 && (
        <div style={{ position: "absolute", inset: 0, opacity: interpolate(resolve, [0, 1], [0, 1]), transform: `scale(${1 + faceIn.pop * 0.03})` }}>
          <Face shot="punch" at={f(C.face)} len={Math.round((PRESENTER.punch.duration / VO_RATE) * fps)} rate={VO_RATE} />
        </div>
      )}

      {/* ---------- тёща in colour, then as dots ---------- */}
      <div style={{ position: "absolute", left: sx, top: sy + breathe * (1 - travel), width: sw, zIndex: 5, opacity: 1 - toDots, transform: `rotate(${interpolate(travel, [0, 1], [3, 0])}deg)` }}>
        <Img src={media(IMG.tescha.src)} style={{ width: "100%", display: "block", filter: `${OUTLINE(7, colors.white)} drop-shadow(0 30px 40px rgba(0,0,0,0.7)) saturate(1.15)` }} />
      </div>
      {toDots > 0 && resolve < 1 && (
        <div style={{ position: "absolute", inset: 0, zIndex: 6, mixBlendMode: "screen", opacity: (1 - resolve) * Math.min(1, toDots * 1.4) }}>
          {/* тёща dots fade out while the face dots fade in: a cross-dissolve inside the screen */}
          <div style={{ position: "absolute", left: sx, top: sy, opacity: 1 - toFace }}>
            <Halftone src={IMG.tescha.src} width={sw} height={sw * IMG.tescha.ratio} pitch={pitch} lift={1.3} />
          </div>
          <div style={{ position: "absolute", inset: 0, opacity: toFace, transform: `scale(${interpolate(toFace, [0, 1], [1.12, 1])})` }}>
            <Halftone src="presenter/dessa-duplex/punch-first.jpg" width={1080} height={1920} pitch={pitch} imgStyle={FACE_FILL} lift={1.25} />
          </div>
        </div>
      )}

      {/* ---------- «ТОЛЬКО ПО ДЕЛУ» over the face ---------- */}
      {wordA > 0 && (
        <div style={{ position: "absolute", left: X0, right: 1080 - X1, top: 1180, zIndex: 9 }}>
          <div style={{ opacity: wordA, transform: `translateY(${(1 - wordA) * 60}px)` }}>
            <Wide size={120}>ТОЛЬКО</Wide>
          </div>
          <div style={{ opacity: wordB, transform: `translateY(${(1 - wordB) * 60}px) scale(${1 + (1 - wordB) * 0.2})`, transformOrigin: "0% 100%" }}>
            <Serif size={210} at={-30} style={{ marginTop: 6 }}>по делу</Serif>
          </div>
        </div>
      )}

      <Flash amount={cut.energy * 0.8} />
      <Flash amount={faceIn.energy} />
    </PosterShell>
  );
};
