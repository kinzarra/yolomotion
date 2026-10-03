// 02 turn — the reel's answer, at ~5s. The oil under the ground goes dark and
// is crossed out; above it the three flows the city actually lives on run
// past one lime node: containers, people, money.
import React from "react";
import { useVideoConfig } from "remotion";
import { useIn } from "../../../reel";
import { theme } from "../../../theme";
import { deColors, dePalette } from "../palette";
import { BrandBar, Chip, Cross, Dust, Eyebrow, Kinetic, Lane, SceneShell, useExit } from "../ui";

export const TurnScene: React.FC<{ series: string; episode: string }> = ({ series, episode }) => {
  const { fps } = useVideoConfig();
  const pass = Math.round(3.3 * fps); // «а на том, что едет мимо»
  const goods = Math.round(5.3 * fps); // «товары, люди, деньги»
  const oilDim = useExit(pass, 14);
  const node = useIn(pass + 4, "bouncy");
  return (
    <SceneShell>
      <Dust seed={2} />
      <BrandBar series={series} episode={episode} />
      <div style={{ position: "absolute", left: 90, top: 290 }}>
        <Eyebrow delay={0}>НА ЧЁМ ЗАРАБАТЫВАЕТ</Eyebrow>
      </div>
      <div style={{ position: "absolute", left: 90, right: 90, top: 350 }}>
        <Kinetic text="НЕ НЕФТЬ, А ПОТОКИ" delay={4} per={4} size={88} bad={[1]} hero={[3]} />
      </div>

      {/* under the ground: the oil, which dims and gets crossed */}
      <div style={{ position: "absolute", left: 90, right: 90, top: 600, height: 4, background: deColors.lineStrong }} />
      <div
        style={{
          position: "absolute",
          left: 90,
          right: 90,
          top: 604,
          height: 110,
          backgroundImage: `repeating-linear-gradient(135deg, transparent 0px, transparent 14px, ${deColors.line} 14px, ${deColors.line} 16px)`,
        }}
      />
      <div style={{ position: "absolute", left: 120, top: 630, display: "flex", gap: 24, alignItems: "center", opacity: 1 - oilDim * 0.7 }}>
        <Chip delay={14} tone="bad" size={28}>
          ПОД ЗЕМЛЁЙ · НЕФТЬ
        </Chip>
        {oilDim > 0 && <Cross delay={pass} size={64} thick={10} />}
      </div>

      {/* the flows */}
      <Lane kind="box" y={850} label="ТОВАРЫ" delay={pass + 6} speed={10} />
      <Lane kind="person" y={1010} label="ЛЮДИ" delay={goods - 6} speed={8} gap={150} />
      <Lane kind="coin" y={1170} label="ДЕНЬГИ" delay={goods + 8} speed={12} />

      {/* the node they pass through */}
      <div
        style={{
          position: "absolute",
          left: 532,
          top: 790,
          width: 16,
          height: 470,
          background: dePalette.primary,
          opacity: node * 0.9,
          transform: `scaleY(${node})`,
          transformOrigin: "top",
          boxShadow: `0 0 40px ${dePalette.glow}`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 540,
          top: 1290,
          transform: `translateX(-50%) scale(${0.6 + node * 0.4})`,
          opacity: node,
          fontFamily: theme.fonts.mono,
          fontSize: 30,
          fontWeight: 800,
          letterSpacing: "0.3em",
          color: dePalette.primary,
        }}
      >
        DUBAI
      </div>
    </SceneShell>
  );
};
