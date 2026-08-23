// Beat 9 — the condition. The frame tears in two. Left: ВЗЛОМ ОНЛАЙН-БАНКА —
// a red pulse cracks the shield, the refund holds. Right: ПЕРЕВЁЛ САМ — a
// call from «службы безопасности», the finger presses ПЕРЕВЕСТИ itself, the
// money leaves, a red cross, and АВТОМАТИЧЕСКОГО ВОЗВРАТА НЕТ.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { theme } from "../../../theme";
import { usePunch, useRamp } from "../../../reel";
import { pcColors } from "../palette";
import { BrandBar, CallCard, Check, Chip, Cross, Flash, Kinetic, Phone, Pulse, SceneShell, Shield, Touch, TransferScreen } from "../ui";

const HEAD = 4;
const TEAR = 6;
const L_CHIP = 14;
const SHIELD = 26;
const HIT = 58;
const CRACK = 74;
const REFUND = 98; // «а банк выполнил правила»
const R_CHIP = 20;
const CALL = 30;
const PRESS = 42; // «сам перевёл»
const LIFT = 50;
const CROSS = 130; // «автоматического»
const NO_REFUND = 150;

const TEAR_PATH = "M540 560 L522 640 L556 720 L530 820 L562 900 L526 1000 L556 1100 L534 1200 L552 1300 L540 1360";
const PH = { left: 690, top: 660, scale: 260 / 440 };
const BTN = { x: PH.left + 220 * PH.scale, y: PH.top + 762 * PH.scale };

export const ConditionScene: React.FC<{ series: string; episode: string; amount: string }> = ({ series, episode, amount }) => {
  const frame = useCurrentFrame();
  const tear = useRamp(TEAR, TEAR + 22, theme.ease.inOut);
  const hitTravel = useRamp(HIT, CRACK, theme.ease.in);
  const hit = usePunch(CRACK, 16);
  const crack = useRamp(CRACK, CRACK + 12, theme.ease.out);
  const press = useRamp(PRESS, PRESS + 6, theme.ease.out);
  const release = useRamp(PRESS + 8, PRESS + 14, theme.ease.inOut);
  const lift = useRamp(LIFT, LIFT + 18, theme.ease.out);
  const fingerIn = useRamp(PRESS - 14, PRESS, theme.ease.out);
  const fingerOut = useRamp(LIFT + 10, LIFT + 20, theme.ease.in);
  const cross = usePunch(CROSS, 16);

  return (
    <SceneShell shake={hit.shake * 0.4 + cross.shake * 0.4}>
      <BrandBar series={series} episode={episode} />

      <AbsoluteFill style={{ alignItems: "center", paddingTop: 330 }}>
        <div style={{ width: 980 }}>
          <Kinetic text="НЕ ЛЮБОЕ МОШЕННИЧЕСТВО" delay={HEAD} per={4} size={72} align="center" mode="snap" style={{ justifyContent: "center" }} />
        </div>
      </AbsoluteFill>

      {/* left: the hack — refund */}
      <div style={{ position: "absolute", left: 40, top: 600, width: 460, display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
        <Chip delay={L_CHIP} tone="bad" size={21}>
          ВЗЛОМ ОНЛАЙН-БАНКА
        </Chip>
        <div style={{ position: "relative", transform: `scale(${1 + hit.pop * 0.06})` }}>
          <Shield size={220} delay={SHIELD} lit crack={crack} />
        </div>
        {frame >= REFUND && (
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Check delay={REFUND} size={64} />
            <Chip delay={REFUND + 4} tone="hero" filled size={24}>
              ВОЗВРАТ
            </Chip>
          </div>
        )}
      </div>
      {frame >= HIT && frame < CRACK + 6 && (
        <Pulse
          size={60}
          on={1 - Math.max(0, (frame - CRACK) / 6)}
          style={{ left: interpolate(hitTravel, [0, 1], [60, 250]) - 30, top: interpolate(hitTravel, [0, 1], [1120, 800]) - 30 }}
        />
      )}

      {/* right: the call — no automatic refund */}
      <div style={{ position: "absolute", left: 580, top: 600, width: 460, display: "flex", justifyContent: "center" }}>
        <Chip delay={R_CHIP} tone="bad" size={21}>
          ПЕРЕВЁЛ САМ
        </Chip>
      </div>
      <div style={{ position: "absolute", left: PH.left, top: PH.top, width: 440, height: 860, transform: `scale(${PH.scale})`, transformOrigin: "top left" }}>
        <Phone width={440} height={860} delay={R_CHIP + 4}>
          <TransferScreen amount={amount} pressed={press * (1 - release)} lift={lift} />
          <CallCard delay={CALL} />
        </Phone>
      </div>
      <Touch x={BTN.x + (1 - fingerIn) * 60} y={BTN.y + (1 - fingerIn) * 90} press={press * (1 - release)} opacity={fingerIn * (1 - fingerOut)} size={70} />
      {frame >= CROSS && (
        <div style={{ position: "absolute", left: 810 - 110, top: 880 - 110, transform: `scale(${1 + cross.pop * 0.15})` }}>
          <Cross delay={CROSS} size={220} thick={22} />
        </div>
      )}
      {frame >= NO_REFUND && (
        <div style={{ position: "absolute", left: 580, top: 1205, width: 460, display: "flex", justifyContent: "center" }}>
          <Chip delay={NO_REFUND} tone="bad" filled size={20}>
            АВТОМАТИЧЕСКОГО ВОЗВРАТА НЕТ
          </Chip>
        </div>
      )}

      {/* the tear */}
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <path d={TEAR_PATH} fill="none" stroke={pcColors.paper} strokeWidth={6} strokeLinejoin="round" strokeDasharray={900} strokeDashoffset={900 * (1 - tear)} />
      </svg>

      <Flash amount={cross.pop * 0.45} color={pcColors.bad} />
    </SceneShell>
  );
};
