// Ассемблер. The card is struck out «вместо дырок», the listing types in and each
// command lights on its word (СЛОЖИ, ПЕРЕНЕСИ, СРАВНИ). On «на Луну» the Apollo 11
// engines fire beside Margaret Hamilton and her stack of printed code.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { usePunch } from "../../../reel";
import { theme } from "../../../theme";
import { ASM, EPISODE, SERIES } from "../data";
import { vibecodingLayersPalette as palette } from "../palette";
import { CUES } from "../timeline";
import { BrandBar, ClipTile, CodePanel, Cross, CutTear, Drift, EraHeader, Flash, Meter, Moon, Paper, PhotoCard, SceneShell, Tag, clamp, useCue } from "../ui";

export const AsmScene: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const c = CUES.asm;
  const sayAt = [cue(c.add), cue(c.mov), cue(c.cmp)];
  const lit = sayAt.reduce((acc, t, i) => (frame >= t ? i : acc), -1);
  const moonAt = cue(c.moon);
  const moon = usePunch(moonAt, 16);
  const cardOut = interpolate(frame, [moonAt - 8, moonAt], [0, 1], { easing: theme.ease.in, ...clamp });
  return (
    <SceneShell shake={moon.shake}>
      <CutTear>
        <Drift items={["ADD", "MOV", "CMP", "JMP"]} />
      </CutTear>
      <BrandBar series={SERIES} episode={EPISODE} delay={-30} />
      <EraHeader title="АССЕМБЛЕР" titleAt={cue(0.3)} size={104} />
      {frame >= cue(c.instead) && (
        <div style={{ position: "absolute", left: 64, top: 345, zIndex: 5 }}>
          <Paper delay={cue(c.instead)} size={26}>
            ВМЕСТО ДЫРОК: КОРОТКИЕ КОМАНДЫ
          </Paper>
        </div>
      )}
      <div style={{ position: "absolute", left: 64, top: 450, zIndex: 4 }}>
        <CodePanel
          at={cue(c.instead)}
          title="ПРОГРАММА · АССЕМБЛЕР"
          lit={lit}
          size={46}
          lines={ASM.map((l, i) => ({ text: `${l.op}  ${l.arg}`, at: cue(c.cmds) + i * 5, note: l.say, noteAt: sayAt[i] }))}
        />
      </div>
      {cardOut < 1 && (
        <div style={{ position: "absolute", inset: 0, zIndex: 3, opacity: 1 - cardOut, transform: `translateY(${cardOut * 60}px)` }}>
          <PhotoCard src="images/vibecoding-layers/punchcard.png" x={150} y={860} w={780} ratio={1920 / 864} at={4} rot={3} gray />
          {frame >= cue(c.instead) && (
            <div style={{ position: "absolute", left: 390, top: 880, zIndex: 4 }}>
              <Cross delay={cue(c.instead)} size={300} />
            </div>
          )}
        </div>
      )}
      <ClipTile src="footage/vibecoding-layers/apollo.mp4" x={400} y={790} w={620} h={400} rot={2} at={moonAt} tag="АПОЛЛОН-11 · 1969" z={2} />
      <PhotoCard src="images/vibecoding-layers/hamilton.jpg" x={50} y={770} w={360} ratio={1280 / 1592} at={moonAt + 6} rot={-4} caption="М. ГАМИЛЬТОН И ЕЁ КОД" focus="70% 50%" z={4} />
      <Moon x={600} y={1215} size={360} at={moonAt + 10} />
      <Tag at={cue(c.luna) - 6} x={64} y={1330} tone="neutral" size={26}>
        <span style={{ color: palette.text }}>КОД ПОСАДКИ НА ЛУНУ</span>
      </Tag>
      <Meter active={1} />
      <Flash amount={moon.energy * 0.8} />
    </SceneShell>
  );
};
