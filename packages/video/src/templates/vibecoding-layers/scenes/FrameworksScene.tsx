// 2000-е. Ready parts drop onto the stack on their words (КНОПКА, ОПЛАТА, ВХОД),
// the React logo spins as the example of a framework, real hands click Lego on the right.
import React from "react";
import { Img, interpolate, useCurrentFrame } from "remotion";
import { useIn, usePunch } from "../../../reel";
import { vibecodingLayersColors as colors } from "../palette";
import { BRICKS, EPISODE, SERIES } from "../data";
import { CUES } from "../timeline";
import { Brick, BrandBar, ClipTile, CutTear, Drift, EraHeader, Flash, Kinetic, Meter, Paper, SceneShell, media, useCue } from "../ui";

export const FrameworksScene: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const c = CUES.frameworks;
  const drops = [cue(c.button), cue(c.pay), cue(c.login)];
  const hits = [usePunch(drops[0], 10), usePunch(drops[1], 10), usePunch(drops[2], 10)];
  const build = usePunch(cue(c.build), 14);
  const logo = useIn(cue(c.fw) + 4, "bouncy");
  return (
    <SceneShell shake={hits.reduce((a, h) => a + h.shake * 0.6, 0) + build.shake * 0.5}>
      <CutTear>
        <Drift items={["npm", "{ }", "import", "</>"]} />
      </CutTear>
      <BrandBar series={SERIES} episode={EPISODE} delay={-30} />
      <EraHeader year="2000-е" title="ФРЕЙМВОРКИ" at={0} titleAt={cue(c.fw)} />
      <div style={{ position: "absolute", left: 64, top: 540, zIndex: 3, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 14, opacity: logo, transform: `translateY(${interpolate(logo, [0, 1], [60, 0])}px)` }}>
        <div style={{ width: 230, height: 230, borderRadius: 30, background: `linear-gradient(160deg, ${colors.surfaceLift}, ${colors.surfaceStrong})`, border: `2px solid ${colors.lineStrong}`, boxShadow: colors.shadow, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Img src={media("images/vibecoding-layers/react.png")} style={{ width: 170, transform: `rotate(${frame * 1.6}deg)`, filter: "grayscale(1) brightness(1.6)" }} />
        </div>
        <Paper delay={cue(c.fw) + 10} size={20}>
          REACT · ОДИН ИЗ НИХ
        </Paper>
      </div>
      <ClipTile src="footage/vibecoding-layers/lego.mp4" x={600} y={520} w={420} h={560} rot={3} at={8} tag="КАК ЛЕГО" z={2} focus="50% 30%" />
      {frame >= cue(c.wrote) && (
        <div style={{ position: "absolute", left: 64, top: 880, zIndex: 5 }}>
          <Paper delay={cue(c.wrote)} size={28} rotate={-2}>
            УЖЕ КТО-ТО НАПИСАЛ
          </Paper>
        </div>
      )}
      <div style={{ position: "absolute", left: 64, top: 1090, zIndex: 4, display: "flex", flexDirection: "column-reverse", gap: 4, transform: `scale(${1 + build.energy * 0.04})`, transformOrigin: "left bottom" }}>
        {BRICKS.map((b, i) => (
          <Brick key={b} label={b} at={drops[i]} w={560} tone="paper" />
        ))}
      </div>
      {frame >= cue(c.build) && (
        <div style={{ position: "absolute", left: 660, top: 1290, width: 360, zIndex: 6 }}>
          <Kinetic text="ТЫ ТОЛЬКО СОБИРАЕШЬ" size={40} delay={cue(c.build)} per={3} mode="snap" lineHeight={1.1} />
        </div>
      )}
      <Meter active={3} />
      <Flash amount={build.energy * 0.6} />
    </SceneShell>
  );
};
