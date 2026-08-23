// Beat 2 — the camera flies out of the phone. The rejected screen recedes to
// the bottom of the frame under a red scan grid, code fragments drift behind,
// and 1 МАРТА 2027 rolls into place like the wheels of a lock. Then the rule
// in four characters: УГРОЗА → ОТКАЗ. On «вредоносного воздействия» a red
// signal wakes inside the small phone.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { theme } from "../../../theme";
import { usePunch, useRamp } from "../../../reel";
import { pcColors } from "../palette";
import { Arrow, BrandBar, Chip, CodeRain, Flash, Glitch, Kinetic, LockDigits, Phone, Pulse, ScanGrid, SceneShell, TransferScreen } from "../ui";
import { PHONE } from "./shared";

const FLY = 2; // the phone recedes
const RULES = 30; // НОВЫЕ ПРАВИЛА
const MONTH = 34; // 1 МАРТА
const YEAR = 44; // 2027 rolls
const LOCK = 80; // the last wheel lands
const ROW = 150; // УГРОЗА → ОТКАЗ
const MALWARE = 262; // the red signal in the phone

const SMALL = 0.44;
const PHONE_SMALL_TOP = 930;

export const DateScene: React.FC<{ series: string; episode: string; amount: string }> = ({ series, episode, amount }) => {
  const frame = useCurrentFrame();
  const fly = useRamp(FLY, FLY + 26, theme.ease.inOut);
  const lock = usePunch(LOCK, 14);
  const row = usePunch(ROW + 16, 12);
  const scale = interpolate(fly, [0, 1], [1, SMALL]);
  const top = interpolate(fly, [0, 1], [PHONE.top, PHONE_SMALL_TOP]);
  const left = 540 - (PHONE.width * scale) / 2;
  const code = useRamp(FLY, FLY + 40, theme.ease.out);
  const grid = useRamp(FLY + 18, FLY + 40, theme.ease.out);
  const malware = useRamp(MALWARE, MALWARE + 8, theme.ease.out);
  const yearGlitch = interpolate(frame, [LOCK - 1, LOCK + 1, LOCK + 10], [0, 0.6, 0], {
    easing: theme.ease.out,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const phoneGlitch = interpolate(frame, [MALWARE, MALWARE + 2, MALWARE + 14], [0, 0.8, 0], {
    easing: theme.ease.out,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const gw = PHONE.width * SMALL + 200;
  const gh = PHONE.height * SMALL + 110;

  return (
    <SceneShell shake={lock.shake * 0.5}>
      <CodeRain amount={code} />
      <BrandBar series={series} episode={episode} />

      <AbsoluteFill style={{ alignItems: "center", paddingTop: 330 }}>
        <Chip delay={RULES} tone="paper" size={28}>
          НОВЫЕ ПРАВИЛА
        </Chip>
        <div style={{ marginTop: 34 }}>
          <Kinetic text="С 1 МАРТА" delay={MONTH} per={4} size={92} align="center" mode="snap" />
        </div>
        <div style={{ marginTop: 4, transform: `scale(${1 + lock.pop * 0.05})` }}>
          <Glitch amount={yearGlitch} bands={5}>
            <LockDigits text="2027" delay={YEAR} per={7} size={230} />
          </Glitch>
        </div>
        {/* УГРОЗА → ОТКАЗ */}
        {frame >= ROW && (
          <div style={{ display: "flex", alignItems: "center", gap: 26, marginTop: 36, transform: `scale(${1 + row.pop * 0.05})` }}>
            <Chip delay={ROW} tone="bad" size={32}>
              УГРОЗА
            </Chip>
            <Arrow width={110} delay={ROW + 8} color={pcColors.bad} />
            <Chip delay={ROW + 16} tone="bad" filled size={32}>
              ОТКАЗ
            </Chip>
          </div>
        )}
      </AbsoluteFill>

      {/* the phone, receding under the grid */}
      <ScanGrid amount={grid} width={gw} height={gh} style={{ left: 540 - gw / 2, top: PHONE_SMALL_TOP - 50 }} />
      <div style={{ position: "absolute", left, top, width: PHONE.width, height: PHONE.height, transform: `scale(${scale})`, transformOrigin: "top left" }}>
        <Glitch amount={phoneGlitch} bands={5}>
          <Phone width={PHONE.width} height={PHONE.height} delay={-40}>
            <TransferScreen amount={amount} rejected={1} settled={1} />
          </Phone>
        </Glitch>
      </div>
      <Pulse size={90} on={malware} style={{ left: 540 - 45, top: PHONE_SMALL_TOP + (PHONE.height * SMALL) / 2 - 45 }} />

      <Flash amount={lock.pop * 0.35} color={pcColors.paper} />
    </SceneShell>
  );
};
