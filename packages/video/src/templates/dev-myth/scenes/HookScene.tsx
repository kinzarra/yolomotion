// Beat 1, the confession. The author's face fills the frame from its first
// voiced frame; the three lines land as type on the left as they are spoken:
// «Я 20 ЛЕТ В IT» → red stamp «МЫ ВАС ОБМАНЫВАЛИ» → lime stamp «СЕЙЧАС ДОКАЖУ».
import React from "react";
import { OffthreadVideo, Sequence, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../../theme";
import { usePunch } from "../../../reel";
import { devMythColors as colors, devMythPalette as palette } from "../palette";
import { Burst, Flash, Glitch, Kinetic, S, SceneShell, Stamp, TopBar, cl, media } from "../ui";
import { HOOK_LEAD, HOOK_T, T, VO_RATE } from "../timeline";
import { PRESENTER } from "../presenter";

/** The HeyGen shot, lip-synced from clip 0, so it starts with the line (LEAD). */
const Face: React.FC<{ from: number; glitch: number }> = ({ from, glitch }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const len = Math.round((PRESENTER.hook.duration / VO_RATE) * fps);
  const k = frame - from;
  if (k < 0) return null;
  const hold = Math.min(k, len - 1);
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 2, overflow: "hidden" }}>
      <Glitch amount={glitch} style={{ position: "absolute", inset: 0 }}>
        <Sequence from={from} layout="none">
          {/* the look is native 16:9; pushed right so the left third is clean for the type, slow push-in */}
          <OffthreadVideo src={media("presenter/dev-myth/" + PRESENTER.hook.file)} muted playbackRate={VO_RATE} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `translateX(230px) scale(${1.14 + hold * 0.0007})`, transformOrigin: "50% 45%" }} />
        </Sequence>
      </Glitch>
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(90deg, ${palette.bg}F5 0%, ${palette.bg}D0 28%, ${palette.bg}40 52%, transparent 70%)` }} />
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${palette.bg}80 0%, transparent 22%, transparent 70%, ${palette.bg}E0 100%)` }} />
    </div>
  );
};

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const faceAt = S(HOOK_LEAD, fps);
  const yearsAt = S(T(HOOK_T.years, HOOK_LEAD), fps);
  const lieAt = S(T(HOOK_T.lie, HOOK_LEAD), fps);
  const proveAt = S(T(HOOK_T.prove, HOOK_LEAD), fps);
  const face = usePunch(faceAt, 12);
  const lie = usePunch(lieAt, 16);
  const prove = usePunch(proveAt, 14);
  const tear = interpolate(frame - lieAt, [0, 2, 9], [0, 1, 0], cl);
  return (
    <SceneShell shake={lie.shake * 0.8 + prove.shake * 0.5}>
      <Face from={faceAt} glitch={tear * 0.9} />
      <TopBar left="ДЕНЬГИ · ПРОСТО" right="20 ЛЕТ В IT · 2026" delay={faceAt} />
      <div style={{ position: "absolute", left: 96, top: 250, width: 900, zIndex: 9 }}>
        <div style={{ display: "inline-block", marginBottom: 18, padding: "8px 16px", background: colors.paper, color: colors.ink, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 26, letterSpacing: "0.12em", transform: "rotate(-1.5deg)", opacity: frame >= yearsAt ? 1 : 0 }}>
          ПРИЗНАНИЕ
        </div>
        <Kinetic text="Я 20 ЛЕТ В IT" size={108} delay={yearsAt} per={3} mode="snap" hero={[1, 2]} lineHeight={1.02} />
      </div>
      {frame >= lieAt && (
        <div style={{ position: "absolute", left: 96, top: 500, zIndex: 10 }}>
          <Stamp tone="bad" size={82} rotate={-4} delay={lieAt}>МЫ ВАС ОБМАНЫВАЛИ</Stamp>
        </div>
      )}
      {frame >= proveAt && (
        <div style={{ position: "absolute", left: 120, top: 680, zIndex: 10 }}>
          <Stamp tone="hero" size={96} rotate={2.5} delay={proveAt}>СЕЙЧАС ДОКАЖУ</Stamp>
        </div>
      )}
      <Burst at={proveAt} x={560} y={760} />
      <Flash amount={face.energy * 0.6} />
      <Flash amount={lie.energy} color={colors.bad} />
      <Flash amount={prove.energy * 0.9} />
    </SceneShell>
  );
};
