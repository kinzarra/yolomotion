import React from "react";
import { AbsoluteFill } from "remotion";
import { BgMesh } from "../../../components/Layers";
import { dubaiEconomyPalette } from "../palette";
import { Headline } from "../ui";

// TODO: the "rescue" beat.
export const RescueScene: React.FC = () => (
  <AbsoluteFill>
    <BgMesh palette={dubaiEconomyPalette} />
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <Headline>RESCUE</Headline>
    </AbsoluteFill>
  </AbsoluteFill>
);
