// Beat 8 — the answer. Dark; the question from beat 3 is already there. A
// full second of nothing. Then: a red pulse leaves the hood and takes the
// money, the bank gets the signal and lets it blink unanswered, the notes
// slide to the hood — and on «возместить» the motion reverses: fresh notes
// come out of the bank back to the middle and ВОЗМЕЩЕНИЕ lands in lime.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { theme } from "../../../theme";
import { useIn, usePunch, useRamp } from "../../../reel";
import { pcColors } from "../palette";
import { BrandBar, Chip, Eyebrow, Flash, Glitch, Kinetic, NoteStack, Pulse, SceneShell, Shockwave, useExit } from "../ui";
import { NOTE_W, STAND_TOP, Standoff } from "./Standoff";

const TURN = 44; // «главный поворот»
const HACK = 92; // the pulse leaves the hood
const TAKEN = 118; // it reaches the money
const SIGNAL = 146; // the bank gets the signal
const IGNORED = 162; // and does nothing
const STEAL = 182; // the notes slide to the hood
const REVERSE = 296; // «возместить»
const WORD = 302; // ВОЗМЕЩЕНИЕ
const CHIP_A = 326;
const CHIP_B = 340;

export const TwistScene: React.FC<{ series: string; episode: string }> = ({ series, episode }) => {
  const frame = useCurrentFrame();
  const headOut = useExit(REVERSE - 10, 10);
  const travel = useRamp(HACK, TAKEN, theme.ease.inOut);
  const taken = usePunch(TAKEN, 14);
  const bankDim = useRamp(IGNORED, IGNORED + 16, theme.ease.inOut);
  const steal = useRamp(STEAL, STEAL + 30, theme.ease.inOut);
  const gone = useRamp(STEAL + 34, STEAL + 46, theme.ease.inOut);
  const reverse = usePunch(REVERSE, 24);
  const back = useRamp(REVERSE, REVERSE + 26, theme.ease.out);
  const backIn = useIn(REVERSE, "smooth");
  const glitch = interpolate(frame, [TAKEN, TAKEN + 2, TAKEN + 12], [0, 0.7, 0], {
    easing: theme.ease.out,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const signalOn = frame >= SIGNAL && frame < REVERSE ? (Math.sin((frame - SIGNAL) / 4) > -0.2 ? 1 : 0.3) : 0;
  const float = Math.sin(frame / 22) * 6;

  return (
    <SceneShell shake={reverse.shake * 0.6 + taken.shake * 0.3}>
      <BrandBar series={series} episode={episode} />
      <div style={{ position: "absolute", inset: 0, background: "#000", opacity: 0.5 * (1 - back * 0.6) }} />

      <AbsoluteFill style={{ alignItems: "center", paddingTop: 330 }}>
        <Eyebrow delay={TURN}>Главный поворот</Eyebrow>
        <div style={{ position: "relative", width: 980, marginTop: 26, minHeight: 220 }}>
          {headOut < 1 && (
            <div style={{ position: "absolute", inset: 0, opacity: 1 - headOut, transform: `translateY(${-headOut * 40}px)` }}>
              <Kinetic text="КТО ВЕРНЁТ ДЕНЬГИ?" delay={-40} per={0} size={104} align="center" mode="rise" style={{ justifyContent: "center" }} />
            </div>
          )}
          {frame >= WORD && (
            <div style={{ transform: `scale(${1 + reverse.pop * 0.06})` }}>
              <Kinetic text="ВОЗМЕЩЕНИЕ" delay={WORD} per={0} size={100} align="center" mode="snap" hero={[0]} glow style={{ justifyContent: "center" }} />
            </div>
          )}
        </div>
        {frame >= CHIP_A && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, marginTop: 4 }}>
            <Chip delay={CHIP_A} tone="hero" filled size={26}>
              БАНК ВЕРНЁТ ДЕНЬГИ
            </Chip>
            <Chip delay={CHIP_B} tone="paper" size={24}>
              ЕСЛИ НАРУШИЛ ТРЕБОВАНИЯ
            </Chip>
          </div>
        )}
      </AbsoluteFill>

      <Glitch amount={glitch} bands={4}>
        <Standoff
          hood={-40}
          bank={-40}
          notes={-40}
          notePop={taken.pop * 0.4}
          noteShift={-steal * 320}
          noteScale={1 - steal * 0.3}
          noteOpacity={1 - gone}
          bankDim={bankDim}
        />
      </Glitch>

      {/* the hack: a red pulse from the hood to the money */}
      {frame >= HACK && frame < TAKEN + 10 && (
        <Pulse size={64} on={1 - Math.max(0, (frame - TAKEN) / 10)} style={{ left: interpolate(travel, [0, 1], [200, 540]) - 32, top: STAND_TOP + 130 - 32 + Math.sin(travel * Math.PI) * -60 }} />
      )}

      {/* the signal the bank ignores */}
      <Pulse size={70} on={signalOn} style={{ left: 860 - 35, top: STAND_TOP - 20 }} />
      {frame >= IGNORED && frame < REVERSE && (
        <div style={{ position: "absolute", right: 40, top: STAND_TOP + 330 }}>
          <Chip delay={IGNORED} tone="bad" size={20}>
            СИГНАЛ ПРОИГНОРИРОВАН
          </Chip>
        </div>
      )}

      {/* the reversal: notes out of the bank, back to the middle */}
      {frame >= REVERSE && (
        <div
          style={{
            position: "absolute",
            left: interpolate(back, [0, 1], [760, 540 - NOTE_W / 2]),
            top: STAND_TOP + 40 + float,
            opacity: Math.min(1, backIn * 2),
            transform: `scale(${interpolate(back, [0, 1], [0.5, 1])}) rotate(${interpolate(back, [0, 1], [18, 0])}deg)`,
          }}
        >
          <NoteStack width={NOTE_W} delay={-40} />
        </div>
      )}
      <div style={{ position: "absolute", left: 860 - 540, top: STAND_TOP + 120 - 960, width: 1080, height: 1920, pointerEvents: "none" }}>
        <Shockwave at={REVERSE} life={28} size={1600} />
      </div>

      <Flash amount={taken.pop * 0.4} color={pcColors.bad} />
      <Flash amount={reverse.pop * 0.8} />
    </SceneShell>
  );
};
