// Frame 0 is the cover: the church candle full-bleed, the mourning ribbon, «СЕГОДНЯ ХОРОНИМ»
// and the tombstone already standing. On «хороним» the frame punches. On the promise the
// candle cuts away: «КАК ОНО РАЗВИВАЛОСЬ», «70 ЛЕТ» rolls, the era rail lights 1950 → 2025,
// and the face takes the lower half where the grave stood (author's notes 1–8).
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { usePunch } from "../../../reel";
import { theme } from "../../../theme";
import { vibecodingLayersColors as colors, vibecodingLayersPalette as palette } from "../palette";
import { EPISODE, ERAS, SERIES } from "../data";
import { PRESENTER } from "../presenter";
import { CUES, PROMISE_AT } from "../timeline";
import { BrandBar, CandleBg, FacePanel, Flash, Glitch, Kinetic, Ribbon, SceneShell, Tombstone, WIDE, clamp, useCue } from "../ui";

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const cue = useCue();
  const buryAt = cue(CUES.hook.bury, 0);
  const P = Math.round(PROMISE_AT * fps);
  const seventyAt = P + cue(CUES.promise.seventy, 0);
  const bury = usePunch(buryAt, 18);
  const cut = usePunch(P, 14);
  const tear = interpolate(frame - P, [0, 1, 8], [0, 0.9, 0], clamp);
  const roll = spring({ frame: frame - seventyAt + 6, fps, config: { damping: 30, stiffness: 60, mass: 1 } });
  const years = Math.round(interpolate(roll, [0, 1], [0, 70]));
  const first = frame < P;
  return (
    <SceneShell exit={false} shake={bury.shake + cut.shake * 0.6}>
      <CandleBg until={P} />
      {first && <Ribbon at={-20} />}
      <BrandBar series={SERIES} episode={EPISODE} delay={-30} />
      <Glitch amount={tear} style={{ position: "absolute", inset: 0 }}>
        {first ? (
          <div style={{ position: "absolute", left: 64, right: 64, top: 230, zIndex: 5, display: "flex", flexDirection: "column", gap: 6 }}>
            <Kinetic text="СЕГОДНЯ" size={104} delay={-30} mode="snap" lineHeight={1} />
            {frame >= buryAt && <Kinetic text="ХОРОНИМ" size={138} delay={buryAt} mode="snap" bad={[0]} lineHeight={1} style={{ filter: `drop-shadow(0 0 40px ${colors.badGlow})` }} />}
          </div>
        ) : (
          <>
            <div style={{ position: "absolute", left: 64, right: 64, top: 236, zIndex: 5, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 6 }}>
              <Kinetic text="КАК ОНО РАЗВИВАЛОСЬ" size={64} delay={P + 2} per={3} mode="snap" lineHeight={1} />
              <div style={{ display: "flex", alignItems: "baseline", gap: 24, fontFamily: WIDE, fontWeight: 900, lineHeight: 1, opacity: Math.min(1, roll * 3) }}>
                <span style={{ fontSize: 260, color: palette.primary, letterSpacing: "-0.04em", filter: `drop-shadow(0 0 60px ${palette.glow})` }}>{years}</span>
                <span style={{ fontSize: 100, color: palette.text }}>ЛЕТ</span>
              </div>
            </div>
            <div style={{ position: "absolute", left: 40, right: 40, top: 640, zIndex: 5 }}>
              <div style={{ position: "absolute", left: 70, right: 70, top: 26, height: 4, background: colors.lineStrong }} />
              <div style={{ position: "absolute", left: 70, top: 26, height: 4, width: `${interpolate(frame - seventyAt, [0, 22], [0, 86], { easing: theme.ease.out, ...clamp })}%`, background: palette.text }} />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                {ERAS.map((e, i) => {
                  const t = seventyAt + i * 5;
                  const q = interpolate(frame - t, [0, 6], [0, 1], { easing: theme.ease.out, ...clamp });
                  const last = i === ERAS.length - 1;
                  return (
                    <div key={e.year} style={{ width: 196, display: "flex", flexDirection: "column", alignItems: "center", gap: 10, opacity: 0.3 + q * 0.7 }}>
                      <div style={{ width: 56, height: 56, borderRadius: 28, background: q > 0.5 ? (last ? colors.bad : palette.text) : colors.surfaceLift, border: `3px solid ${colors.lineStrong}`, transform: `scale(${1 + (q > 0 && q < 1 ? 0.3 : 0)})` }} />
                      <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 30, color: palette.text }}>{e.year}</div>
                      <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 20, letterSpacing: "0.04em", color: last ? palette.primary : palette.text, whiteSpace: "nowrap" }}>{e.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </Glitch>
      {first && (
        <div style={{ position: "absolute", inset: 0, zIndex: 6 }}>
          <Tombstone x={190} y={1110} w={700} drop={false} />
        </div>
      )}
      <FacePanel at={P} len={durationInFrames - P} file={`presenter/vibecoding-layers/${PRESENTER.promise.file}`} enabled={PRESENTER.promise.enabled} label="ЛИЦО HEYGEN · 2,2 С" x={64} y={900} w={952} h={860} />
      <Flash amount={bury.energy * 0.8} color={colors.bad} />
      <Flash amount={cut.energy * 0.5} />
    </SceneShell>
  );
};
