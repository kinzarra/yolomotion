// The turn. Over a pile of dead computers the ladder builds bottom-up on its words
// (ЧИСЛА, СИНТАКСИС, ФРЕЙМВОРКИ); on «Теперь» the rungs crack and fall into the grave,
// and «ЧТО ТЫ ХОЧЕШЬ ПОСТРОИТЬ» takes the top of the frame.
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { usePunch } from "../../../reel";
import { theme } from "../../../theme";
import { vibecodingLayersColors as colors, vibecodingLayersPalette as palette } from "../palette";
import { CREDITS, EPISODE, SERIES } from "../data";
import { CUES } from "../timeline";
import { BrandBar, CutTear, Eyebrow, Flash, Kinetic, Meter, SceneShell, SourceLine, Tombstone, WIDE, clamp, media, useCue } from "../ui";
import { OffthreadVideo, Sequence } from "remotion";

const RUNGS = [
  { label: "ЧИСЛА", cue: CUES.turn.numbers },
  { label: "СИНТАКСИС", cue: CUES.turn.syntax },
  { label: "ФРЕЙМВОРКИ", cue: CUES.turn.fw },
];

export const TurnScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cue = useCue();
  const nowAt = cue(CUES.turn.now);
  const whatAt = cue(CUES.turn.what);
  const now = usePunch(nowAt, 18);
  const what = usePunch(whatAt, 16);
  const hits = RUNGS.map((r) => usePunch(cue(r.cue), 10)); // fixed length: the hook count never changes
  const grave = spring({ frame: frame - nowAt, fps, config: theme.spring.bouncy });
  return (
    <SceneShell shake={now.shake + what.shake * 0.6 + hits.reduce((a, h) => a + h.shake * 0.4, 0)}>
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <Sequence layout="none">
          <OffthreadVideo src={media("footage/vibecoding-layers/old-pcs.mp4")} muted style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.05 + frame * 0.0006})`, filter: "grayscale(1) brightness(0.5) contrast(1.2)" }} />
        </Sequence>
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${palette.bg}E0 0%, ${palette.bg}80 45%, ${palette.bg}E6 100%)` }} />
      </div>
      <CutTear>
        <div />
      </CutTear>
      <BrandBar series={SERIES} episode={EPISODE} delay={-30} />
      <div style={{ position: "absolute", left: 64, top: 236, zIndex: 5 }}>
        {frame < whatAt ? <Eyebrow delay={2}>СНАЧАЛА НАДО БЫЛО ЗНАТЬ</Eyebrow> : <Eyebrow delay={whatAt} color={palette.textDim}>ТЕПЕРЬ НАДО ЗНАТЬ ОДНО</Eyebrow>}
      </div>
      {frame >= whatAt && (
        <div style={{ position: "absolute", left: 64, right: 64, top: 310, zIndex: 6 }}>
          <Kinetic text="ЧТО ТЫ ХОЧЕШЬ ПОСТРОИТЬ" size={104} delay={whatAt} per={4} mode="snap" hero={[3]} glow lineHeight={1.02} />
        </div>
      )}
      {RUNGS.map((r, i) => {
        const at = cue(r.cue);
        const p = spring({ frame: frame - at, fps, config: theme.spring.snappy });
        const t = Math.max(0, frame - nowAt - i * 3) / fps;
        const fall = 2600 * t * t;
        const crack = interpolate(frame - nowAt, [0, 5], [0, 1], { easing: theme.ease.out, ...clamp });
        const top = 1120 - i * 150;
        if (frame < at || fall > 1400) return null;
        return (
          <div
            key={r.label}
            style={{
              position: "absolute",
              left: 120 + i * 30,
              width: 840 - i * 60,
              top,
              height: 120,
              zIndex: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: colors.surfaceLift,
              border: `3px solid ${crack > 0 ? colors.bad : colors.lineStrong}`,
              boxShadow: colors.shadow,
              fontFamily: WIDE,
              fontWeight: 900,
              fontSize: 62,
              color: palette.text,
              opacity: p * interpolate(fall, [150, 420], [1, 0], clamp),
              transform: `translateY(${interpolate(p, [0, 1], [-120, 0]) + fall}px) rotate(${(i % 2 ? -1 : 1) * t * 30}deg) scale(${interpolate(p, [0, 1], [1.3, 1])})`,
            }}
          >
            <span style={{ position: "absolute", left: 18, top: 10, fontFamily: theme.fonts.mono, fontSize: 20, color: palette.textDim }}>{i + 1}</span>
            {r.label}
            {crack > 0 && <span style={{ position: "absolute", left: 20, right: 20, top: "52%", height: 6, background: colors.bad, transform: `scaleX(${crack}) rotate(-3deg)` }} />}
          </div>
        );
      })}
      {frame >= nowAt && (
        <div style={{ position: "absolute", inset: 0, zIndex: 5, opacity: Math.min(1, grave * 2) }}>
          <Tombstone x={300} y={1180} w={480} at={nowAt} />
        </div>
      )}
      <Meter active={4} />
      <SourceLine text={CREDITS} top={1700} />
      <Flash amount={now.energy * 0.8} color={colors.bad} />
      <Flash amount={what.energy * 0.7} />
    </SceneShell>
  );
};
