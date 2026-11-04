// Beat 1 — the question, the object, who it is NOT, and the turn.
// A (cover): КТО УПРАВЛЯЕТ КУРСОМ ДОЛЛАРА? drops word by word in lime flashes
//   over 100 ₽ = $1, waving flags, 3D icons and a live forex board.
// Pause, then the whole stage blinks out.
// B: НЕ ПУТИН (his face rises) · НЕ ТРАМП (his face rises) → both dissolve
//   into ash → full frame ТОГДА КТО?
import React from "react";
import { Img, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../../theme";
import { useIn, usePunch, useRamp } from "../../../reel";
import { colors, palette } from "../palette";
import { BrandBar, Flash, Glitch, Kinetic, SceneShell, Stamp } from "../ui";
import { Dissolve, ForexBoard, Prop, WavingFlag, asset } from "../parts";
import { HOOK } from "../timeline";

const WORDS = ["КТО", "УПРАВЛЯЕТ", "КУРСОМ", "ДОЛЛАРА?"];
const WORD_AT = HOOK.words;
const FIVE = HOOK.five; // «5 самых влиятельных людей!»
const SURPRISE = HOOK.surprise; // «но вы удивитесь…»
const ETO = HOOK.eto; // ЭТО
const BLINK = HOOK.blink; // the stage starts blinking out
const NOT1 = HOOK.not1; // НЕ ПУТИН
const NOT2 = HOOK.not2; // НЕ ТРАМП
const DIS = HOOK.dissolve; // the faces dissolve
const WHO = HOOK.who; // ТОГДА КТО?
const GO = HOOK.go; // ПОГНАЛИ!

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// On / off per frame from BLINK: a stutter that ends dark.
const BLINK_PATTERN = [1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0];
const stageVisible = (frame: number) =>
  frame < BLINK ? 1 : (BLINK_PATTERN[frame - BLINK] ?? 0);

/* ----------------------------------------------------------- the words */

/** Each word slams down inside a lime block that burns off, leaving white type. */
const DropWord: React.FC<{ word: string; at: number; last: boolean; size: number }> = ({
  word,
  at,
  last,
  size,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - at, fps, config: theme.spring.snappy });
  const burn = interpolate(frame - at, [2, 14], [1, 0], { easing: theme.ease.out, ...clamp });
  const shown = frame >= at;
  return (
    <span
      style={{
        position: "relative",
        display: "inline-block",
        opacity: shown ? 1 : 0,
        transform: `translateY(${interpolate(p, [0, 1], [-70, 0])}px) scale(${interpolate(p, [0, 1], [1.45, 1])})`,
        transformOrigin: "left bottom",
      }}
    >
      <span
        style={{
          position: "absolute",
          inset: "-0.04em -0.12em -0.02em",
          background: palette.primary,
          opacity: burn,
          boxShadow: `0 0 ${Math.round(size * 0.6)}px ${palette.glow}`,
        }}
      />
      <span
        style={{
          position: "relative",
          color: burn > 0.5 ? colors.ink2 : last ? palette.primary : palette.text,
          textShadow: last && burn <= 0.5 ? `0 0 ${Math.round(size * 0.35)}px ${palette.glow}` : undefined,
        }}
      >
        {word}
      </span>
    </span>
  );
};

/* ---------------------------------------------------------- the object */

const NOTE_RATIO = 1920 / 830;

const Note: React.FC<{ src: string; width: number; rotate: number; phase: number }> = ({
  src,
  width,
  rotate,
  phase,
}) => {
  const frame = useCurrentFrame();
  const bob = Math.sin(frame / 22 + phase) * 7;
  const sway = Math.sin(frame / 31 + phase) * 1.4;
  return (
    <div
      style={{
        width,
        height: width / NOTE_RATIO,
        transform: `translateY(${bob}px) rotate(${rotate + sway}deg)`,
        boxShadow: colors.paperShadow,
        borderRadius: 6,
        overflow: "hidden",
      }}
    >
      <Img src={src} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </div>
  );
};

const Equals: React.FC<{ pulse: number }> = ({ pulse }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 22, transform: `scale(${1 + pulse * 0.18})` }}>
    {[0, 1].map((i) => (
      <div
        key={i}
        style={{
          width: 96,
          height: 20,
          background: colors.paper,
          boxShadow: `0 0 ${20 + pulse * 40}px rgba(241,237,226,${0.25 + pulse * 0.4})`,
        }}
      />
    ))}
  </div>
);

/* --------------------------------------------------------------- faces */

const Face: React.FC<{
  src: string;
  ratio: number;
  side: "left" | "right";
  width: number;
  at: number;
  lift?: number; // px above the floor — landscape crops need it to keep the face mid-frame
  edge?: number; // how far past the frame edge it hangs
}> = ({ src, ratio, side, width, at, lift = -40, edge }) => {
  const frame = useCurrentFrame();
  const p = useIn(at, "smooth");
  const breathe = Math.sin(frame / 30 + (side === "left" ? 0 : 1.7)) * 4;
  const fade = interpolate(frame, [DIS, DIS + 18], [1, 0], { easing: theme.ease.out, ...clamp });
  return (
    <div
      style={{
        position: "absolute",
        bottom: lift,
        width,
        ...(side === "left" ? { left: edge ?? -170 } : { right: edge ?? -190 }),
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [420, 0]) + breathe}px) scale(${interpolate(p, [0, 1], [1.08, 1])})`,
        transformOrigin: "bottom center",
        filter: "grayscale(0.55) contrast(1.08) brightness(0.92)",
        // cut-outs end in a hard line at the torso: melt the bottom away
        maskImage: "linear-gradient(180deg, #000 58%, transparent 96%)",
        WebkitMaskImage: "linear-gradient(180deg, #000 58%, transparent 96%)",
      }}
    >
      <Dissolve src={src} width={width} ratio={ratio} at={DIS + (side === "right" ? 4 : 0)} from={side} life={30} />
      {/* sink the torso into the floor; the floor goes with the face */}
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

export const HookScene: React.FC<{ series: string; episode: string; rate: string }> = ({
  series,
  episode,
}) => {
  const frame = useCurrentFrame();
  const words = usePunch(WORD_AT[3], 16);
  const five = usePunch(FIVE, 18);
  const not1 = usePunch(NOT1, 18);
  const not2 = usePunch(NOT2, 18);
  const who = usePunch(WHO, 22);
  const go = usePunch(GO, 18);
  const shock = useIn(WHO + 3, "bouncy");
  const textOut = useRamp(DIS + 12, DIS + 22, theme.ease.in);
  const pulse = interpolate(frame, [FIVE + 20, FIVE + 32, FIVE + 46], [0, 1, 0], { easing: theme.ease.out, ...clamp });
  const blinkTear = frame >= BLINK && frame < BLINK + 15 ? (BLINK_PATTERN[frame - BLINK] ? 0.7 : 0) : 0;
  const whoTear = interpolate(frame, [WHO - 1, WHO, WHO + 10], [0, 0.9, 0], { easing: theme.ease.out, ...clamp });
  const stage = stageVisible(frame);
  // «но вы удивитесь…»: the stage leans in and goes dim under the line
  const lean = useRamp(SURPRISE - 2, SURPRISE + 14, theme.ease.out);
  const dots = Math.min(3, Math.max(0, Math.floor((frame - SURPRISE - 14) / 6)));
  const shake = words.shake * 0.5 + five.shake * 0.4 + not1.shake + not2.shake + who.shake * 1.2 + go.shake;

  return (
    <SceneShell exit={false} shake={shake}>
      {frame < WHO && <BrandBar series={series} episode={episode} delay={-30} />}

      {/* ---------------- A: the cover stage, blinks out as one ---------------- */}
      {stage > 0 && (
        <Glitch amount={blinkTear}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: stage,
              transform: `scale(${1 + lean * 0.07})`,
              filter: `brightness(${1 - lean * 0.55}) blur(${lean * 3}px)`,
            }}
          >
            <div style={{ position: "absolute", left: 72, right: 72, top: 250 }}>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  columnGap: 24,
                  rowGap: 10,
                  fontFamily: `${theme.fonts.wide}, ${theme.fonts.mono}`,
                  fontSize: 92,
                  fontWeight: 900,
                  lineHeight: 1.04,
                  letterSpacing: "-0.02em",
                }}
              >
                {WORDS.map((w, i) => (
                  <DropWord key={w} word={w} at={WORD_AT[i]} last={i === WORDS.length - 1} size={92} />
                ))}
              </div>
              <div style={{ marginTop: 30, transform: `scale(${1 + five.pop * 0.08})`, transformOrigin: "left center" }}>
                <Kinetic text="5 САМЫХ ВЛИЯТЕЛЬНЫХ ЛЮДЕЙ!" size={40} delay={FIVE} per={3} mode="snap" hero={[0]} />
              </div>
            </div>

            {/* artifacts behind the object */}
            <WavingFlag src={asset("flag-ru.png")} ratio={1.5} width={200} x={52} y={770} rotate={-8} />
            <WavingFlag src={asset("flag-us.png")} ratio={1.9} width={240} x={800} y={760} rotate={7} phase={1.4} />

            {/* the object */}
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 860,
                height: 260,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 18,
              }}
            >
              <Note src={asset("rub100.jpg")} width={440} rotate={-7} phase={0} />
              <Equals pulse={pulse} />
              <Note src={asset("usd1.jpg")} width={440} rotate={6} phase={1.3} />
            </div>

            {/* artifacts in front, a row under the object */}
            <Prop src={asset("rub-pile.png")} width={170} x={34} y={1108} seed={1} rotate={-6} />
            <Prop src={asset("usd-stack.png")} width={310} x={206} y={1132} seed={2} rotate={3} />
            <Prop src={asset("gbp-pile.png")} width={250} x={548} y={1106} seed={3} rotate={-4} />
            <Prop src={asset("oil-drum.png")} width={112} x={900} y={1124} seed={4} rotate={4} />

            <ForexBoard top={1300} />
          </div>
        </Glitch>
      )}

      {/* «НО ВЫ УДИВИТЕСЬ…» over the dimmed stage, gone with the blink */}
      {frame >= SURPRISE && stage > 0 && (
        <div
          style={{
            position: "absolute",
            left: 60,
            right: 60,
            top: 800,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
            opacity: stage,
          }}
        >
          <Kinetic text="НО ВЫ" size={96} delay={SURPRISE} per={4} mode="snap" align="center" />
          <Kinetic
            text={`УДИВИТЕСЬ${".".repeat(dots)}`}
            size={100}
            delay={SURPRISE + 9}
            mode="snap"
            align="center"
            hero={[0]}
            glow
          />
        </div>
      )}

      {/* ---------------- B: who it is not ---------------- */}
      {frame >= ETO - 1 && frame < WHO && (
        <>
          {frame >= NOT1 - 1 && <Face src={asset("putin.png")} ratio={619 / 427} side="left" width={1000} lift={260} edge={-200} at={NOT1 + 2} />}
          {frame >= NOT2 - 1 && (
            <Face src={asset("trump.png")} ratio={1280 / 1600} side="right" width={800} at={NOT2 + 2} />
          )}
          <div
            style={{
              position: "absolute",
              left: 72,
              right: 72,
              top: 300,
              display: "flex",
              flexDirection: "column",
              gap: 8,
              opacity: 1 - textOut,
              transform: `translateY(${textOut * -60}px)`,
            }}
          >
            <Kinetic text="ЭТО" size={56} delay={ETO} mode="snap" color={palette.textDim} />
            <Kinetic text="НЕ ПУТИН" size={128} delay={NOT1} per={4} mode="snap" bad={[0]} />
            {frame >= NOT2 && <Kinetic text="НЕ ТРАМП" size={128} delay={NOT2} per={4} mode="snap" bad={[0]} />}
          </div>
          {/* CC BY needs the credit on screen while the photo is */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 640,
              textAlign: "center",
              fontFamily: theme.fonts.mono,
              fontSize: 17,
              letterSpacing: "0.06em",
              color: palette.textDim,
              opacity: interpolate(frame, [NOT1 + 10, NOT1 + 24, DIS, DIS + 16], [0, 0.85, 0.85, 0], clamp),
            }}
          >
            ФОТО ТРАМПА: WHITE HOUSE (PD)
          </div>
        </>
      )}

      {/* ---------------- the turn: full frame ---------------- */}
      {frame >= WHO && (
        <>
          {/* the viewer's face: a shocked reaction pops in over the question */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 150,
              display: "flex",
              justifyContent: "center",
              opacity: Math.min(1, shock * 1.4),
              transform: `translateY(${interpolate(shock, [0, 1], [120, 0]) + Math.sin(frame / 9) * 4}px) scale(${interpolate(shock, [0, 1], [0.6, 1]) + go.pop * 0.05}) rotate(${Math.sin(frame / 13) * 1.5}deg)`,
            }}
          >
            <Img
              src={asset("shock.png")}
              style={{
                width: 720,
                filter: "contrast(1.06)",
                // the photo ends in a hard cut at the shirt — melt it into the floor
                maskImage: "linear-gradient(180deg, #000 55%, transparent 95%)",
                WebkitMaskImage: "linear-gradient(180deg, #000 55%, transparent 95%)",
              }}
            />
          </div>
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 760,
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
          {frame >= GO && (
            <div style={{ position: "absolute", left: 0, right: 0, top: 1330, display: "flex", justifyContent: "center" }}>
              <Stamp tone="bad" size={104} rotate={-6} delay={GO}>
                ПОГНАЛИ!
              </Stamp>
            </div>
          )}
        </>
      )}

      <Flash amount={Math.max(words.energy * 0.6, not1.energy, not2.energy)} color={colors.bad} />
      <Flash amount={who.energy} />
      <Flash amount={go.energy} color={colors.bad} />
    </SceneShell>
  );
};
