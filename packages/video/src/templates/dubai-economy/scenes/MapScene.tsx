// 05 map — the secret is geography. Two seconds of the climb-out over the
// city from a cabin window (Klaus Hesse, CC BY 3.0) as texture, then the dot
// globe: the 8-hour ring grows from Dubai and the pie fills to two thirds.
import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../../theme";
import { deColors } from "../palette";
import {
  BrandBar,
  Chip,
  Clip,
  DotGlobe,
  Eyebrow,
  Flash,
  Kinetic,
  Pie,
  Scrim,
  SceneShell,
  ramp,
} from "../ui";

export const MapScene: React.FC<{ series: string; episode: string }> = ({ series, episode }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cut = Math.round(1.6 * fps); // after «Секрет в географии»
  const reach = ramp(frame, cut + 10, cut + 50, theme.ease.out);
  const share = ramp(frame, Math.round(3.6 * fps), Math.round(4.8 * fps), theme.ease.out);
  const flash = interpolate(frame, [cut, cut + 6], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (frame < cut) {
    return (
      <SceneShell exit={false}>
        <Clip shot="05-map-takeoff" zoom={[1.3, 1.45]} focus={[0.3, 0.85]} filter="grayscale(1) contrast(1.5) brightness(0.7)" />
        <Scrim top={0.7} mid={0.15} bottom={0.9} />
        <div style={{ position: "absolute", left: 90, right: 90, top: 760 }}>
          <Kinetic text="СЕКРЕТ В ГЕОГРАФИИ" delay={2} per={4} size={96} mode="snap" />
        </div>
      </SceneShell>
    );
  }
  return (
    <SceneShell>
      <BrandBar series={series} episode={episode} />
      <div style={{ position: "absolute", left: 90, top: 290 }}>
        <Eyebrow delay={cut}>ДУБАЙ В ЦЕНТРЕ КАРТЫ</Eyebrow>
      </div>
      <div style={{ position: "absolute", left: 90, right: 90, top: 345 }}>
        <Kinetic text="8 ЧАСОВ ПОЛЁТА" delay={cut + 2} per={4} size={70} hero={[0]} />
      </div>
      <div style={{ position: "absolute", left: 200, top: 560 }}>
        <DotGlobe size={640} ring={reach} delay={cut} />
      </div>
      <div style={{ position: "absolute", right: 60, top: 1010, transform: `scale(${0.6 + share * 0.4})`, opacity: share > 0 ? 1 : 0 }}>
        <Pie size={250} share={share * 0.667} label="2/3" />
      </div>
      <div style={{ position: "absolute", left: 90, top: 1250 }}>
        {share > 0 && (
          <Chip delay={Math.round(3.8 * fps)} size={28}>
            НАСЕЛЕНИЯ ЗЕМЛИ
          </Chip>
        )}
      </div>
      <Flash amount={flash} color={deColors.white} />
    </SceneShell>
  );
};
