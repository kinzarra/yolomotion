// Beat 4 — what the rule touches. A card, a wallet and the СБП mark fly at
// the phone one after another and stop dead at a red wall (three hits). The
// phone names the reason. Then the lime detour: ДРУГОЙ ТЕЛЕФОН → ИЛИ
// ОТДЕЛЕНИЕ, an arc drawn over the wall.
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../../theme";
import { usePunch, useRamp } from "../../../reel";
import { pcColors, pcPalette } from "../palette";
import { Arrow, BankCard, Barrier, BrandBar, Chip, Eyebrow, Flash, Kinetic, Phone, SbpMark, SceneShell, TransferScreen, Wallet, useExit } from "../ui";

const HEAD = 4;
const CARD = 40; // «картам»
const WALLET = 78; // «электронные деньги»
const SBP = 120; // «СБП»
const ARRIVE = 10; // frames from launch to the wall
const THREAT = 171; // «угрозы»
const REASON = 183; // «сообщит причину»
const DETOUR = 238; // «другое устройство»
const BRANCH = 268; // «или отделение»

const WALL_X = 600;
const PHONE_SCALE = 300 / 440;
const ARC = "M430 672 Q600 560 770 672";

const Flyer: React.FC<{ at: number; left: number; top: number; children: React.ReactNode }> = ({ at, left, top, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - at, fps, config: theme.spring.snappy });
  if (frame < at) return null;
  return (
    <div style={{ position: "absolute", left, top, transform: `translateX(${interpolate(p, [0, 1], [-620, 0])}px)`, opacity: Math.min(1, p * 3) }}>
      {children}
    </div>
  );
};

export const ScopeScene: React.FC<{ series: string; episode: string; amount: string }> = ({ series, episode, amount }) => {
  const frame = useCurrentFrame();
  const h1 = usePunch(CARD + ARRIVE, 14);
  const h2 = usePunch(WALLET + ARRIVE, 14);
  const h3 = usePunch(SBP + ARRIVE, 14);
  const threat = usePunch(THREAT, 18);
  const hit = Math.max(h1.energy, h2.energy, h3.energy, threat.energy * 0.8);
  const shake = h1.shake * 0.3 + h2.shake * 0.3 + h3.shake * 0.3;
  const headOut = useExit(DETOUR - 10, 10);
  const wallFade = useRamp(DETOUR, DETOUR + 16, theme.ease.inOut);
  const arc = useRamp(DETOUR + 4, DETOUR + 22, theme.ease.out);

  return (
    <SceneShell shake={shake}>
      <BrandBar series={series} episode={episode} />

      <AbsoluteFill style={{ alignItems: "center", paddingTop: 330 }}>
        <Eyebrow delay={2}>Что затронет правило</Eyebrow>
        <div style={{ position: "relative", width: 980, marginTop: 22, minHeight: 134 }}>
          {headOut < 1 && (
            <div style={{ position: "absolute", inset: 0, opacity: 1 - headOut, transform: `translateY(${-headOut * 40}px)` }}>
              <Kinetic text="КАРТЫ, СБП, КОШЕЛЬКИ" delay={HEAD} per={4} size={62} align="center" mode="snap" style={{ justifyContent: "center" }} />
            </div>
          )}
          {frame >= DETOUR && (
            <Kinetic text="ДРУГОЕ УСТРОЙСТВО" delay={DETOUR} per={4} size={60} align="center" mode="snap" hero={[1]} style={{ justifyContent: "center" }} />
          )}
        </div>
        {frame >= DETOUR && (
          <div style={{ display: "flex", alignItems: "center", gap: 22, marginTop: 18 }}>
            <Chip delay={DETOUR + 6} tone="hero" size={26}>
              ДРУГОЙ ТЕЛЕФОН
            </Chip>
            <Arrow width={90} delay={DETOUR + 14} color={pcPalette.primary} />
            <Chip delay={BRANCH} tone="paper" size={26}>
              ИЛИ ОТДЕЛЕНИЕ
            </Chip>
          </div>
        )}
      </AbsoluteFill>

      {/* the three ways to pay, stopped */}
      <Flyer at={CARD} left={WALL_X - 300 - 14} top={690}>
        <BankCard width={300} delay={-40} />
      </Flyer>
      <Flyer at={WALLET} left={WALL_X - 240 - 14} top={905}>
        <Wallet width={240} delay={-40} />
      </Flyer>
      <Flyer at={SBP} left={WALL_X - 170 - 14} top={1100}>
        <SbpMark size={170} delay={-40} />
      </Flyer>

      {/* the wall */}
      <div style={{ opacity: 1 - wallFade * 0.55 }}>
        <Barrier height={660} hit={hit} style={{ left: WALL_X - 3, top: 640 }} />
      </div>

      {/* the phone behind it */}
      <div style={{ position: "absolute", left: 700, top: 700, width: 440, height: 860, transform: `scale(${PHONE_SCALE})`, transformOrigin: "top left" }}>
        <Phone width={440} height={860} delay={8}>
          <TransferScreen amount={amount} rejected={1} settled={1} />
        </Phone>
      </div>
      {frame >= REASON && frame < DETOUR && (
        <div style={{ position: "absolute", left: 640, top: 628 }}>
          <Chip delay={REASON} tone="bad" filled size={22}>
            ПРИЧИНА: УГРОЗА
          </Chip>
        </div>
      )}

      {/* the detour over the wall */}
      {arc > 0 && (
        <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0, pointerEvents: "none", filter: `drop-shadow(0 0 16px ${pcPalette.glow})` }}>
          <path d={ARC} fill="none" stroke={pcPalette.primary} strokeWidth={8} strokeLinecap="square" strokeDasharray={700} strokeDashoffset={700 * (1 - arc)} />
          {arc > 0.96 && <path d="M742 650 L772 676 L736 690" fill="none" stroke={pcPalette.primary} strokeWidth={8} strokeLinejoin="miter" />}
        </svg>
      )}

      <Flash amount={Math.max(h1.pop, h2.pop, h3.pop) * 0.5} color={pcColors.bad} />
    </SceneShell>
  );
};
