// Beat 1 — the five nobody knows, what they decide, who it is NOT, the turn.
// A (cover): five hooded figures in masks, «?» on every face, «5 ЧЕЛОВЕК» /
//   «ТЫ ИХ ДАЖЕ НЕ ЗНАЕШЬ». «Они решают…» — three улики fall onto the row:
//   a chip, a play button, a stack of dollars.
// Blink-out. B: НЕ МАСК · НЕ ТРАМП · НЕ ПУТИН — three faces rise and go to
//   ash. Full frame ТОГДА КТО? over the row of masks, back in the dark.
import React from "react";
import { Img, interpolate, useCurrentFrame } from "remotion";
import { theme } from "../../../theme";
import { useIn, usePunch, useRamp } from "../../../reel";
import { colors, palette } from "../palette";
import { BrandBar, Flash, Glitch, Kinetic, SceneShell, Shockwave } from "../ui";
import { ChipIcon, Conspiracy, Dissolve, DropProp, FIGURES, PhotoFigure, PlayIcon, asset } from "../parts";
import { HOOK } from "../timeline";

const FIVE = HOOK.five;
const DECIDE = HOOK.decide;
const CHIP = HOOK.chip;
const PLAY = HOOK.play;
const MONEY = HOOK.money;
const BLINK = HOOK.blink;
const NOT1 = HOOK.not1;
const NOT2 = HOOK.not2;
const NOT3 = HOOK.not3;
const DIS = HOOK.dissolve;
const WHO = HOOK.who;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// On / off per frame from BLINK: a stutter that ends dark.
const BLINK_PATTERN = [1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0];
const stageVisible = (frame: number) => (frame < BLINK ? 1 : (BLINK_PATTERN[frame - BLINK] ?? 0));

/* --------------------------------------------------------------- faces */

const Face: React.FC<{
  src: string;
  ratio: number;
  width: number;
  at: number;
  left?: number;
  right?: number;
  bottom: number;
  from: "left" | "right";
  zIndex?: number;
}> = ({ src, ratio, width, at, left, right, bottom, from, zIndex }) => {
  const frame = useCurrentFrame();
  const p = useIn(at, "smooth");
  const breathe = Math.sin(frame / 30 + at) * 4;
  const fade = interpolate(frame, [DIS, DIS + 18], [1, 0], { easing: theme.ease.out, ...clamp });
  return (
    <div
      style={{
        position: "absolute",
        bottom,
        left,
        right,
        width,
        zIndex,
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [420, 0]) + breathe}px) scale(${interpolate(p, [0, 1], [1.08, 1])})`,
        transformOrigin: "bottom center",
        filter: "grayscale(0.55) contrast(1.08) brightness(0.92)",
        maskImage: "linear-gradient(180deg, #000 58%, transparent 96%)",
        WebkitMaskImage: "linear-gradient(180deg, #000 58%, transparent 96%)",
      }}
    >
      <Dissolve src={src} width={width} ratio={ratio} at={DIS + (from === "right" ? 4 : from === "left" ? 0 : 2)} from={from} life={30} />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: "45%",
          opacity: fade,
          background: `linear-gradient(180deg, transparent, ${palette.bg})`,
        }}
      />
    </div>
  );
};

/* --------------------------------------------------------------- scene */

export const HookScene: React.FC<{ series: string; episode: string }> = ({ series, episode }) => {
  const frame = useCurrentFrame();
  const five = usePunch(FIVE, 18);
  const chip = usePunch(CHIP, 14);
  const play = usePunch(PLAY, 14);
  const money = usePunch(MONEY, 16);
  const not1 = usePunch(NOT1, 18);
  const not2 = usePunch(NOT2, 18);
  const not3 = usePunch(NOT3, 18);
  const who = usePunch(WHO, 22);
  const textOut = useRamp(DIS + 12, DIS + 22, theme.ease.in);
  const stage = stageVisible(frame);
  const blinkTear = frame >= BLINK && frame < BLINK + 15 ? (BLINK_PATTERN[frame - BLINK] ? 0.7 : 0) : 0;
  const whoTear = interpolate(frame, [WHO - 1, WHO, WHO + 10], [0, 0.9, 0], { easing: theme.ease.out, ...clamp });
  // «они решают» — the row leans in, the «?» marks burn brighter
  const lean = useRamp(DECIDE - 2, DECIDE + 16, theme.ease.out);
  // the masks come back behind ТОГДА КТО?, pushed into the dark
  const back = useIn(WHO + 2, "smooth");
  const shake = five.shake * 0.5 + chip.shake * 0.6 + play.shake * 0.6 + money.shake * 0.8 + not1.shake + not2.shake + not3.shake + who.shake * 1.2;

  const figures = (dim: number, scale: number, yShift: number) => (
    <div style={{ position: "absolute", inset: 0, transform: `scale(${scale}) translateY(${yShift}px)`, transformOrigin: "50% 60%" }}>
      {FIGURES.map((f, i) => (
        <PhotoFigure key={f.src} fig={f} seed={i + 1} dim={dim} />
      ))}
    </div>
  );

  return (
    <SceneShell exit={false} shake={shake}>
      {frame < WHO && <BrandBar series={series} episode={episode} delay={-30} />}

      {/* ---------------- A: the cover stage, blinks out as one ---------------- */}
      {stage > 0 && (
        <Glitch amount={blinkTear}>
          <div style={{ position: "absolute", inset: 0, opacity: stage }}>
            {/* 5 ЧЕЛОВЕК — the cover headline, down on frame 0 */}
            <div
              style={{
                position: "absolute",
                left: 72,
                right: 72,
                top: 250,
                display: "flex",
                alignItems: "baseline",
                gap: 26,
                fontFamily: `${theme.fonts.wide}, ${theme.fonts.mono}`,
                fontWeight: 900,
                lineHeight: 0.95,
                letterSpacing: "-0.02em",
                transform: `scale(${1 + five.pop * 0.1})`,
                transformOrigin: "left bottom",
              }}
            >
              <span style={{ fontSize: 280, color: palette.primary, textShadow: `0 0 ${60 + five.energy * 80}px ${palette.glow}` }}>5</span>
              <span style={{ fontSize: 100, color: palette.text, transform: "translateY(-16px)" }}>ЧЕЛОВЕК</span>
            </div>

            {/* conspiracy artifacts in the lower third — the author's note 3 */}
            <Conspiracy at={-20} />

            {/* the five, leaning in on «они решают» */}
            <div style={{ position: "absolute", inset: 0, transform: `scale(${1 + lean * 0.05})`, transformOrigin: "50% 70%" }}>
              {figures(0, 1, 0)}
            </div>

            {/* the улики that fall onto them */}
            <DropProp at={CHIP} x={10} y={800} width={200} label="ТВОЙ ТЕЛЕФОН">
              <ChipIcon size={160} />
            </DropProp>
            <DropProp at={PLAY} x={452} y={735} width={200} label="ЧТО ТЫ СМОТРИШЬ">
              <PlayIcon size={160} />
            </DropProp>
            <DropProp at={MONEY} x={840} y={800} width={240} label="ДЕНЬГИ МИРА">
              <Img src={asset("usd-stack.png")} style={{ width: 230, display: "block" }} />
            </DropProp>
            {[
              { at: CHIP, cx: 108, cy: 880 },
              { at: PLAY, cx: 552, cy: 825 },
              { at: MONEY, cx: 960, cy: 880 },
            ].map(({ at, cx, cy }) => (
              <div key={at} style={{ position: "absolute", left: cx - 450, top: cy - 450, width: 900, height: 900, pointerEvents: "none" }}>
                <Shockwave at={at} life={18} size={900} />
              </div>
            ))}

            {/* ТЫ ИХ ДАЖЕ НЕ ЗНАЕШЬ — a paper strip under the row */}
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 1210,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  padding: "18px 34px",
                  background: colors.paper,
                  color: colors.ink,
                  fontFamily: theme.fonts.wide,
                  fontWeight: 900,
                  fontSize: 54,
                  letterSpacing: "-0.01em",
                  whiteSpace: "nowrap",
                  boxShadow: colors.paperShadow,
                  transform: `rotate(-1.5deg) translateY(${Math.sin(frame / 24) * 3}px)`,
                }}
              >
                ТЫ ИХ <span style={{ color: colors.bad }}>ДАЖЕ</span> НЕ ЗНАЕШЬ
              </div>
            </div>
          </div>
        </Glitch>
      )}

      {/* ---------------- B: who it is not ---------------- */}
      {frame >= NOT1 - 10 && frame < WHO && (
        <>
          {frame >= NOT1 - 1 && (
            <Face src={asset("musk.png")} ratio={1160 / 1450} width={760} at={NOT1 + 1} left={-150} bottom={380} from="left" zIndex={1} />
          )}
          {frame >= NOT2 - 1 && (
            <Face src={asset("trump.png")} ratio={1280 / 1600} width={760} at={NOT2 + 1} right={-170} bottom={380} from="right" zIndex={2} />
          )}
          {frame >= NOT3 - 1 && (
            <Face src={asset("putin.png")} ratio={619 / 427} width={1000} at={NOT3 + 1} left={40} bottom={110} from="left" zIndex={3} />
          )}
          <div
            style={{
              position: "absolute",
              left: 72,
              right: 72,
              top: 280,
              display: "flex",
              flexDirection: "column",
              gap: 6,
              zIndex: 4,
              opacity: 1 - textOut,
              transform: `translateY(${textOut * -60}px)`,
            }}
          >
            <Kinetic text="НЕ МАСК" size={124} delay={NOT1} per={4} mode="snap" bad={[0]} />
            {frame >= NOT2 && <Kinetic text="НЕ ТРАМП" size={124} delay={NOT2} per={4} mode="snap" bad={[0]} />}
            {frame >= NOT3 && <Kinetic text="НЕ ПУТИН" size={124} delay={NOT3} per={4} mode="snap" bad={[0]} />}
          </div>
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 1500,
              zIndex: 4,
              textAlign: "center",
              fontFamily: theme.fonts.mono,
              fontSize: 17,
              letterSpacing: "0.06em",
              color: palette.textDim,
              opacity: interpolate(frame, [NOT2 + 10, NOT2 + 24, DIS, DIS + 16], [0, 0.85, 0.85, 0], clamp),
            }}
          >
            ФОТО: NASA / AUBREY GEMIGNANI (PD) · WHITE HOUSE (PD)
          </div>
        </>
      )}

      {/* ---------------- the turn: full frame ---------------- */}
      {frame >= WHO && (
        <>
          <div style={{ position: "absolute", inset: 0, opacity: back, transform: `scale(${interpolate(back, [0, 1], [1.15, 1])})` }}>
            {figures(0.3, 0.8, 60)}
          </div>
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 540,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              transform: `scale(${1 + who.pop * 0.06})`,
            }}
          >
            <Glitch amount={whoTear}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Kinetic text="ТОГДА" size={150} delay={WHO} mode="snap" align="center" />
                <Kinetic text="КТО?" size={260} delay={WHO + 5} mode="snap" align="center" hero={[0]} glow lineHeight={1} />
              </div>
            </Glitch>
          </div>
        </>
      )}

      <Flash amount={five.energy * 0.5} />
      <Flash amount={Math.max(not1.energy, not2.energy, not3.energy)} color={colors.bad} />
      <Flash amount={who.energy} />
    </SceneShell>
  );
};
