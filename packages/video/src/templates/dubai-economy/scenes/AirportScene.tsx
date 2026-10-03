// 06 airport — Emirates and the airport. The evidence is moving: an Emirates
// A380 on the DXB taxiway, seen through a cabin window (Klaus Hesse, CC BY
// 3.0) — the window frame IS the screen container. The counter runs to 92.
import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { useIn } from "../../../reel";
import { theme } from "../../../theme";
import { deColors, dePalette } from "../palette";
import { BoardRow, BrandBar, Clip, Counter, SceneShell, Sweep } from "../ui";

export const AirportScene: React.FC<{ series: string; episode: string }> = ({ series, episode }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const count = Math.round(2.9 * fps); // «на девяносто два миллиона»
  const win = useIn(0, "smooth");
  const lbl = useIn(count + 10, "smooth");
  return (
    <SceneShell>
      <BrandBar series={series} episode={episode} />
      <div style={{ position: "absolute", left: 90, top: 280 }}>
        <BoardRow cells={["EMIRATES", "DXB", "С 1985"]} widths={[400, 180, 260]} delay={4} size={34} />
      </div>

      {/* the cabin window */}
      <div
        style={{
          position: "absolute",
          left: 70,
          top: 370,
          width: 940,
          height: 600,
          borderRadius: 120,
          overflow: "hidden",
          border: `14px solid ${deColors.surfaceLift}`,
          boxShadow: `inset 0 0 60px rgba(0,0,0,0.8), ${deColors.shadow}`,
          transform: `scale(${0.94 + win * 0.06})`,
        }}
      >
        <Clip shot="06-airport-a380" zoom={[1.12, 1.24]} focus={[0.55, 0.45]} />
        <Sweep at={14} life={34} strength={0.18} />
      </div>

      <div style={{ position: "absolute", left: 90, top: 1010, display: "flex", alignItems: "baseline", gap: 26 }}>
        {frame >= count && <Counter to={92} delay={count} size={250} color={dePalette.primary} />}
        <div
          style={{
            fontFamily: theme.fonts.wide,
            fontWeight: 800,
            fontSize: 54,
            lineHeight: 1.05,
            color: dePalette.text,
            opacity: lbl,
            transform: `translateX(${(1 - lbl) * 30}px)`,
          }}
        >
          МЛН
          <br />
          <span style={{ fontFamily: theme.fonts.mono, fontSize: 28, letterSpacing: "0.12em", color: dePalette.textDim }}>
            ПАССАЖИРОВ / ГОД
          </span>
        </div>
      </div>
    </SceneShell>
  );
};
