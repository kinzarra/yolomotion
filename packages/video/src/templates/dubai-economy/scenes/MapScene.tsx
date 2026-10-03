import React from "react";
import { AbsoluteFill } from "remotion";
import { BgMesh } from "../../../components/Layers";
import { dubaiEconomyPalette } from "../palette";
import { Headline } from "../ui";

// TODO: the "map" beat.
export const MapScene: React.FC = () => (
  <AbsoluteFill>
    <BgMesh palette={dubaiEconomyPalette} />
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <Headline>MAP</Headline>
    </AbsoluteFill>
  </AbsoluteFill>
);
