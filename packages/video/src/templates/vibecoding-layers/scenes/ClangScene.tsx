// 1972. Ritchie and a real screen of code above; the C listing types in «почти
// по-английски», a paper slip shows the machine turning it into digits; on «точку с
// запятой» the missing «;» blinks red at the end of the last line, «НЕ РАБОТАЕТ» slams.
import React from "react";
import { useCurrentFrame } from "remotion";
import { usePunch } from "../../../reel";
import { theme } from "../../../theme";
import { vibecodingLayersColors as colors } from "../palette";
import { C_BINARY, C_LINES, EPISODE, SERIES } from "../data";
import { CUES } from "../timeline";
import { BrandBar, ClipTile, CodePanel, CutTear, Drift, EraHeader, Flash, Glitch, Meter, Paper, PhotoCard, SceneShell, Stamp, useCue } from "../ui";

export const ClangScene: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const c = CUES.clang;
  const semiAt = cue(c.semi);
  const failAt = cue(c.nothing);
  const semi = usePunch(semiAt, 14);
  const fail = usePunch(failAt, 18);
  const blink = frame >= semiAt && Math.floor((frame - semiAt) / 5) % 2 === 0;
  const last = (
    <span>
      {C_LINES[2]}
      {frame >= semiAt && <span style={{ display: "inline-block", minWidth: "0.7em", textAlign: "center", color: colors.bad, opacity: blink ? 1 : 0.25, border: `3px solid ${colors.bad}`, borderRadius: 30, marginLeft: 6, fontFamily: theme.fonts.mono }}>;</span>}
    </span>
  );
  return (
    <SceneShell shake={semi.shake * 0.5 + fail.shake}>
      <CutTear>
        <Drift items={["{", "}", ";", "int"]} />
      </CutTear>
      <BrandBar series={SERIES} episode={EPISODE} delay={-30} />
      <EraHeader year="А ПОТОМ" title="ЯЗЫК СИ" at={cue(c.then)} titleAt={cue(c.lang)} />
      <PhotoCard src="images/vibecoding-layers/ritchie.jpg" x={56} y={520} w={300} ratio={558 / 717} at={cue(c.lang)} rot={-4} caption="ДЕННИС РИТЧИ · 1972" z={3} />
      <ClipTile src="footage/vibecoding-layers/code.mp4" x={400} y={500} w={620} h={400} rot={2} at={8} tag="ПОЧТИ АНГЛИЙСКИЙ" z={2} focus="50% 40%" />
      <Glitch amount={fail.energy * 0.6} style={{ position: "absolute", left: 64, top: 970, zIndex: 4 }}>
        <CodePanel
          at={cue(c.english) - 6}
          title="total.c"
          size={36}
          error={semiAt}
          lines={[
            { text: C_LINES[0], at: cue(c.english) },
            { text: C_LINES[1], at: cue(c.english) + 6 },
            { text: last, at: cue(c.english) + 12 },
          ]}
        />
      </Glitch>
      {frame >= cue(c.machine) && (
        <div style={{ position: "absolute", left: 64, top: 1265, zIndex: 5 }}>
          <Paper delay={cue(c.machine)} size={28}>
            МАШИНА ПЕРЕВОДИТ: {C_BINARY}
          </Paper>
        </div>
      )}
      {frame >= failAt && (
        <div style={{ position: "absolute", left: 90, top: 1400, zIndex: 7 }}>
          <Stamp tone="bad" size={72} rotate={-4} delay={failAt}>
            НЕ РАБОТАЕТ
          </Stamp>
        </div>
      )}
      <Meter active={2} />
      <Flash amount={fail.energy} color={colors.bad} />
    </SceneShell>
  );
};
